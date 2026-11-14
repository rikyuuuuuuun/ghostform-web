import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {oidcVerifier,AUDIENCE,TRUST} from '../ops/analytics/report-auth.mjs';
import {weeklyReport} from '../ops/analytics/weekly-report.mjs';
import worker from '../ops/analytics/worker.mjs';
const now=Date.parse('2026-11-20T08:30:00Z'),sec=now/1000;
const pair=await crypto.subtle.generateKey({name:'RSASSA-PKCS1-v1_5',modulusLength:2048,publicExponent:new Uint8Array([1,0,1]),hash:'SHA-256'},true,['sign','verify']);
const jwk={...await crypto.subtle.exportKey('jwk',pair.publicKey),kid:'test-key',use:'sig'};
const b64=data=>Buffer.from(data).toString('base64url');
async function token(overrides={},header={}){
  const a=b64(JSON.stringify({alg:'RS256',typ:'JWT',kid:'test-key',...header}));
  const b=b64(JSON.stringify({iss:'https://token.actions.githubusercontent.com',aud:AUDIENCE,...TRUST,
    repository_visibility:'private',runner_environment:'github-hosted',event_name:'schedule',iat:sec,nbf:sec-5,exp:sec+300,...overrides}));
  return 'Bearer '+a+'.'+b+'.'+b64(await crypto.subtle.sign('RSASSA-PKCS1-v1_5',pair.privateKey,new TextEncoder().encode(a+'.'+b)));
}
test('only signed short-lived tokens from the exact private repository workflow can read reports',async()=>{
  let fetched=0;const verify=oidcVerifier({now:()=>now,fetcher:async()=>{fetched++;return Response.json({keys:[jwk]});}});
  assert.equal((await verify(await token())).repository_id,TRUST.repository_id);
  await verify(await token({event_name:'workflow_dispatch'}));assert.equal(fetched,1);
  for(const overrides of [{repository_id:'1'},{repository_owner_id:'1'},{ref:'refs/heads/other'},
    {workflow_ref:'other'},{repository_visibility:'public'},{event_name:'pull_request'},
    {aud:'other'},{iss:'https://evil.test'},{exp:sec-60,iat:sec-360},{nbf:sec+90},
    {iat:sec-700,exp:sec+300},{runner_environment:'self-hosted'}])
    await assert.rejects(()=>token(overrides).then(verify));
  await assert.rejects(()=>token({}, {alg:'none'}).then(verify));
  const forged=(await token()).split('.');forged[1]=b64(JSON.stringify({fake:true}));await assert.rejects(()=>verify(forged.join('.')));
  await assert.rejects(()=>verify(null));
  const signature=(await token()).slice(0,-8)+'ABCDEFGH';await assert.rejects(()=>verify(signature));
});
test('report route denies anonymous requests without touching the database',async()=>{
  const env={DB:{prepare(){throw new Error('must not read');}}};
  assert.equal((await worker.fetch(new Request('https://test/weekly-report'),env)).status,401);
  assert.equal((await worker.fetch(new Request('https://test/weekly-report',{method:'POST'}),env)).status,405);
});
test('key fetching uses Workers-compatible manual redirects and rejects redirected key sources',async()=>{
  const verify=oidcVerifier({now:()=>now,fetcher:async(url,options)=>{
    assert.equal(options.redirect,'manual');return Response.json({keys:[jwk]});
  }});
  await verify(await token());
  const redirected=oidcVerifier({now:()=>now,fetcher:async()=>new Response(null,{status:302,headers:{Location:'https://other.test/keys'}})});
  await assert.rejects(()=>token().then(redirected),/identity_unavailable/);
});
test('cloud report uses the same complete-JST cohort definitions, excludes QA and exports no visit IDs',async()=>{
  const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../ops/analytics/migrations/0001_funnel.sql',import.meta.url),'utf8'));
  db.prepare("UPDATE meta SET value=? WHERE key='active_since'").run(String(now-20*86400000));
  const insert=db.prepare('INSERT INTO visits VALUES(?,?,?,?,?,?,?,?)');
  const privateId='a'.repeat(32);
  insert.run(privateId,now-86400000,now-86400000,'home','default',511,0,1);
  insert.run('b'.repeat(32),now-86400000,now-86400000,'home','default',511,1,1);
  const adapter={prepare(sql){return sql;},async batch(queries){return queries.map(sql=>({success:true,results:db.prepare(sql).all()}));}};
  const result=await weeklyReport(adapter,now);
  assert.equal(result.report.current.endExclusive,'2026-11-19T15:00:00.000Z');
  assert.equal(result.report.current.counts.total.visits,1);assert.equal(result.report.current.counts.total.after_both,1);
  assert.equal(JSON.stringify(result).includes(privateId),false);assert.equal(result.report.qa,false);db.close();
});
