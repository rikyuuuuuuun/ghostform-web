import { validMessage } from '../../metrics-core.mjs';
import {oidcVerifier} from './report-auth.mjs';
import {weeklyReport} from './weekly-report.mjs';
const verifyReportIdentity=oidcVerifier();

const ORIGIN='https://rikyuuuuuuun.github.io';
const LOCAL=new Set(['http://127.0.0.1:8901','http://127.0.0.1:8902']);
export const UPSERT=`INSERT INTO visits(id,first_seen,last_seen,entry,source,mask,qa,shared)
VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET
 last_seen=MAX(visits.last_seen,excluded.last_seen),
 mask=visits.mask | excluded.mask, shared=MIN(visits.shared,excluded.shared)
WHERE visits.entry=excluded.entry AND visits.source=excluded.source AND visits.qa=excluded.qa
 AND excluded.last_seen-visits.first_seen<=3600000`;
export async function limitedText(request) {
  if(Number(request.headers.get('Content-Length'))>1024) throw new Error('large');
  const reader=request.body?.getReader(); if(!reader) throw new Error('empty');
  let length=0,text=''; const decoder=new TextDecoder();
  try { for(;;) { const {value,done}=await reader.read(); if(done) break;
    length+=value.byteLength; if(length>1024) throw new Error('large'); text+=decoder.decode(value,{stream:true}); }
    return text+decoder.decode();
  } finally { await reader.cancel().catch(()=>{}); }
}
function response(status,origin) {
  return new Response(null,{status,headers:{'Cache-Control':'no-store','Vary':'Origin',
    ...(origin?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS',
      'Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}:{})}});
}
export default {
  async fetch(request,env) {
    const path=new URL(request.url).pathname,origin=request.headers.get('Origin');
    if(path==='/health' && request.method==='GET') return Response.json({ok:true,version:1},{headers:{'Cache-Control':'no-store'}});
    if(path==='/weekly-report') {
      if(request.method!=='GET')return response(405);
      try {await verifyReportIdentity(request.headers.get('Authorization'));}
      catch(error){return error.message==='identity_unavailable'?
        Response.json({status:'unavailable',counts:null,reason:'identity_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}}):response(401);}
      try{return Response.json(await weeklyReport(env.DB),{headers:{'Cache-Control':'no-store'}});}
      catch{return Response.json({status:'unavailable',counts:null,reason:'aggregate_unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
    }
    if(path!=='/collect') return response(404);
    if(origin!==ORIGIN && !LOCAL.has(origin)) return response(403);
    if(request.method==='OPTIONS') return response(204,origin);
    if(request.method!=='POST') return response(405,origin);
    let payload;
    try { payload=JSON.parse(await limitedText(request)); }
    catch { return response(400,origin); }
    if(!validMessage(payload) || (LOCAL.has(origin) && !payload.qa)) return response(400,origin);
    try {
      if(!(await env.GLOBAL_LIMIT.limit({key:'collect'})).success
        || !(await env.SESSION_LIMIT.limit({key:payload.id})).success) return response(429,origin);
      const now=Date.now();
      await env.DB.prepare(UPSERT).bind(payload.id,now,now,payload.entry,payload.source,
        payload.mask,Number(payload.qa),Number(payload.shared)).run();
      return response(204,origin);
    } catch { return response(503,origin); }
  },
  async scheduled(controller,env,ctx) {
    // No request logs, IP addresses, user agents, referrers, or video data are stored.
    const now=Date.now();
    ctx.waitUntil(env.DB.prepare('DELETE FROM visits WHERE (qa=0 AND last_seen<?) OR (qa=1 AND last_seen<?)')
      .bind(now-90*86400000,now-86400000).run());
  }
};
