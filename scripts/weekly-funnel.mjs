import {execFileSync} from 'node:child_process';
import {mkdirSync,writeFileSync,existsSync,renameSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {weekWindow,periodResult,cohortSql,renderReport,DAY} from './funnel-report-core.mjs';

const args=process.argv.slice(2),qa=args.includes('--qa'),snapshot=args.includes('--snapshot');
const option=name=>{const i=args.indexOf(name);return i<0?null:args[i+1];};
const repo=fileURLToPath(new URL('../',import.meta.url));
const directory=option('--out');if(!directory)throw new Error('Use --out <private-directory-outside-repo>');
const out=path.resolve(directory),relative=path.relative(repo,out);
if(!relative.startsWith('..')&&!path.isAbsolute(relative))throw new Error('Analytics reports must stay outside the public repository');
mkdirSync(out,{recursive:true});
const cli=process.env.GHOSTFORM_WRANGLER_PATH||path.join(repo,'ops/analytics/node_modules/wrangler/bin/wrangler.js');
const config=path.join(repo,'ops/analytics/wrangler.jsonc'),now=Date.now();
let {start,end,previousStart}=weekWindow(now);
if(snapshot){end=now;start=end-7*DAY;previousStart=start-7*DAY;}
function save(result,text) {
  const json=JSON.stringify(result,null,2),stamp=new Date(now).toISOString().replaceAll(':','-');
  writeFileSync(path.join(out,`funnel-${stamp}.json`),json);
  writeFileSync(path.join(out,'funnel.json.tmp'),json);renameSync(path.join(out,'funnel.json.tmp'),path.join(out,'funnel.json'));
  writeFileSync(path.join(out,'funnel.txt'),text+'\n');
}
try {
  if(!existsSync(cli))throw new Error('Wrangler is not installed; run npm ci --prefix ops/analytics');
  const sql="SELECT key,value FROM meta;\n"+cohortSql(start,end,qa)+'\n'+cohortSql(previousStart,start,qa);
  const file=path.join(out,'funnel-query.sql');writeFileSync(file,sql);
  let raw,response;
  // --file uses D1's bulk importer and returns a summary, not SELECT rows.
  try { raw=execFileSync(process.execPath,[cli,'d1','execute','ghostform-web-funnel','--remote','--command',sql,'--json','--config',config],
    {cwd:repo,encoding:'utf8',timeout:90000,maxBuffer:2*1024*1024,env:{...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:path.join(out,'wrangler-logs')},stdio:['ignore','pipe','pipe']}); }
  catch { throw new Error('Cloudflare集計の取得に失敗しました。既存Wrangler認証・接続を確認してください'); }
  try {response=JSON.parse(raw);}catch{throw new Error('Cloudflareの集計応答を読み取れませんでした');}
  if(response.length!==3||response.some(x=>x.success===false||!Array.isArray(x.results)))throw new Error('Invalid D1 aggregate response');
  const meta=Object.fromEntries(response[0].results.map(r=>[r.key,r.value]));
  if(meta.schema_version!=='1')throw new Error('Unsupported metric schema');
  const activeSince=Number(meta.active_since);if(!activeSince)throw new Error('Measurement start is unavailable');
  const report={status:'ok',version:1,createdAt:new Date(now).toISOString(),qa,snapshot,
    current:periodResult(response[1].results,{start,end,activeSince,now,qa}),
    previous:periodResult(response[2].results,{start:previousStart,end:start,activeSince,now,qa})};
  const text=renderReport(report);save(report,text);
  console.log(text);
}catch(error){
  const unavailable={status:'unavailable',createdAt:new Date(now).toISOString(),qa,reason:error.message,counts:null};
  save(unavailable,'計測データを取得できませんでした（0件ではありません）：'+error.message);
  console.error(error.message);process.exitCode=1;
}
