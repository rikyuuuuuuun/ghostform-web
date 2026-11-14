import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {B,TTL,validMessage,progress,lastStage} from '../metrics-core.mjs';
import {visitStore,payloadOf,blockedBySignals} from '../metrics.mjs';
import worker,{UPSERT} from '../ops/analytics/worker.mjs';
import {cohortSql,summarize,periodResult,renderReport,weekWindow,DAY} from '../scripts/funnel-report-core.mjs';
const id='a'.repeat(32);
const message=(mask=1,extra={})=>({v:1,id,entry:'home',source:'default',mask,qa:true,shared:true,...extra});
const database=()=>{const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../ops/analytics/migrations/0001_funnel.sql',import.meta.url),'utf8'));return db;};
const d1=db=>({prepare(sql){let values=[];return {bind(...args){values=args;return this;},async run(){return db.prepare(sql).run(...values);}};}});
const env=db=>({DB:d1(db),GLOBAL_LIMIT:{limit:async()=>({success:true})},SESSION_LIMIT:{limit:async()=>({success:true})}});
const request=(payload,origin='https://rikyuuuuuuun.github.io')=>new Request('https://collector.test/collect',{method:'POST',headers:{Origin:origin,'Content-Type':'text/plain'},body:JSON.stringify(payload)});

test('both task orders yield the same completion, store-before-use never becomes store-after-use retroactively',()=>{
  let a=progress(progress(progress(1,'step','trial'),'opacity','trial'),'store','trial');
  let b=progress(progress(progress(1,'opacity','trial'),'step','trial'),'store','trial');
  assert.equal(a,511);assert.equal(a,b);
  const early=progress(progress(1,'store','trial'),'opacity','trial');
  assert.equal(early&B.AFTER_ANY,0);assert.equal(lastStage(early),'store_before_use');
});
test('same-tab navigation and reload keep a visit; expiry and a new explicit source create a new visit',()=>{
  const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  let now=1000,n=0;const random=()=> (++n).toString(16).padStart(32,'0');
  const home=visitStore({storage,now:()=>now,random,page:'home',source:'x'});
  const first=home.record('view');
  const trial=visitStore({storage,now:()=>now,random,page:'trial',source:'x'});
  assert.equal(trial.record('opacity').id,first.id);assert.equal(trial.get().mask,15);
  now+=TTL;assert.notEqual(trial.get().id,first.id);
  const coach=visitStore({storage,now:()=>now,random,page:'trial',source:'coach'});
  assert.equal(coach.get().source,'coach');assert.equal(n,3);
});
test('storage denial preserves one page-local visit and marks it unlinked',()=>{
  let n=0;const tracker=visitStore({storage:{getItem(){throw new Error('denied');}},now:()=>1,random:()=>String(++n).padStart(32,'0'),page:'trial'});
  const a=tracker.record('opacity'),b=tracker.record('step');assert.equal(a.id,b.id);assert.equal(b.shared,false);assert.equal(n,1);
});
test('QA storage is separate; privacy signals and payload allowlist prevent accidental PII',()=>{
  const map=new Map(),storage={getItem:k=>map.get(k),setItem:(k,v)=>map.set(k,v)};
  const options={storage,now:()=>1,random:()=>id,page:'home'};
  visitStore(options).record('view');visitStore({...options,qa:true}).record('step');assert.equal(map.size,2);
  assert.equal(blockedBySignals({globalPrivacyControl:true}),true);assert.equal(blockedBySignals({doNotTrack:'1'}),true);
  assert.equal(blockedBySignals({}),false);
  assert.equal(validMessage(message(1,{url:'https://private.example'})),false);
  assert.equal(validMessage(message(1,{ip:'1.2.3.4'})),false);
  assert.equal('started' in payloadOf({...message(),started:1000}),false);
});
test('invalid masks and inconsistent completion claims are rejected',()=>{
  for(const mask of [0,-1,4294967297,8,256,1|32|128])assert.equal(validMessage(message(mask)),false,mask);
  assert.equal(validMessage(message(511)),true);
});
test('D1 merges repeated and reversed deliveries without double-counting or changing attribution',()=>{
  const db=database(),statement=db.prepare(UPSERT);
  statement.run(id,100,100,'home','x',511,1,1);statement.run(id,90,90,'home','x',1,1,1);
  statement.run(id,200,200,'home','coach',1,1,1);
  statement.run(id,4000000,4000000,'home','x',1,1,1);
  assert.deepEqual({...db.prepare('SELECT COUNT(*) n,mask,source,last_seen FROM visits').get()},{n:1,mask:511,source:'x',last_seen:100});
  db.close();
});
test('collector persists real HTTP messages, rejects unknown origins, local live traffic and public report reads',async()=>{
  const db=database(),bindings=env(db);
  assert.equal((await worker.fetch(request(message(511)),bindings)).status,204);
  assert.equal(db.prepare('SELECT mask FROM visits').get().mask,511);
  assert.equal((await worker.fetch(request(message(),'https://other.example'),bindings)).status,403);
  assert.equal((await worker.fetch(request(message(1,{qa:false}),'http://127.0.0.1:8901'),bindings)).status,400);
  assert.equal((await worker.fetch(new Request('https://collector.test/report'),bindings)).status,404);
  assert.equal((await worker.fetch(request({...message(),video:'do not accept'}),bindings)).status,400);
  db.close();
});
test('oversized bodies, throttling and storage failures cannot be counted as accepted',async()=>{
  const db=database(),bindings=env(db);
  assert.equal((await worker.fetch(new Request('https://collector.test/collect',{method:'POST',headers:{Origin:'https://rikyuuuuuuun.github.io'},body:'x'.repeat(2000)}),bindings)).status,400);
  bindings.SESSION_LIMIT.limit=async()=>({success:false});assert.equal((await worker.fetch(request(message()),bindings)).status,429);
  bindings.SESSION_LIMIT.limit=async()=>({success:true});bindings.DB.prepare=()=>{throw new Error('offline');};
  assert.equal((await worker.fetch(request(message()),bindings)).status,503);db.close();
});
test('cohort SQL excludes QA and interval-end visits; terminal stages reconcile without overlapping task counts',()=>{
  const db=database();const stmt=db.prepare(UPSERT);const masks=[1,1057,515,7,22,31,511,102];
  masks.forEach((mask,i)=>stmt.run(String(i).padStart(32,'0'),100,100,i===4||i===7?'trial':'home','default',mask,0,1));
  stmt.run('f'.repeat(32),100,100,'home','default',511,1,1);
  stmt.run('e'.repeat(32),200,200,'home','default',511,0,1);
  const counts=summarize(db.prepare(cohortSql(100,200)).all());
  assert.deepEqual(counts.total,{visits:8,trial:6,ready:5,opacity:2,step:3,both:2,any:3,store:3,after_trial:2,after_any:1,after_both:1,direct_store:1,unlinked:0});
  assert.equal(counts.byEntry.home.visits,6);assert.equal(Object.values(counts.lastStages).reduce((a,b)=>a+b,0),8);
  db.close();
});
test('not-measured and partial weeks are never shown as zero or as comparable full weeks',()=>{
  const before=periodResult([],{start:1,end:10,activeSince:20,now:30});assert.equal(before.counts,null);
  const partial=periodResult([],{start:10,end:30,activeSince:20,now:30});assert.equal(partial.coverage,'partial');assert.equal(partial.counts.total.visits,0);
  const text=renderReport({qa:false,current:partial,previous:before});assert.match(text,/増減率を計算しない/);assert.match(text,/ダウンロード完了を示しません/);
});
test('weekly boundaries use seven complete JST days regardless of host timezone',()=>{
  const w=weekWindow(Date.parse('2026-11-20T09:00:00Z'));
  assert.equal(new Date(w.end).toISOString(),'2026-11-19T15:00:00.000Z');assert.equal(w.end-w.start,7*DAY);
});
test('scheduled retention deletes only expired live and QA rows',async()=>{
  const db=database(),now=Date.now(),insert=db.prepare(UPSERT);
  insert.run('1'.repeat(32),now-91*DAY,now-91*DAY,'home','default',1,0,1);
  insert.run('2'.repeat(32),now-89*DAY,now-89*DAY,'home','default',1,0,1);
  insert.run('3'.repeat(32),now-2*DAY,now-2*DAY,'home','default',1,1,1);
  let pending;await worker.scheduled({},env(db),{waitUntil(p){pending=p;}});await pending;
  assert.equal(db.prepare('SELECT COUNT(*) n FROM visits').get().n,1);
  assert.equal(db.prepare('SELECT id FROM visits').get().id,'2'.repeat(32));db.close();
});
