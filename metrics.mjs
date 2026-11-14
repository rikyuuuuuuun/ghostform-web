import { VERSION, SOURCES, B, progress, newVisit, reuseVisit } from './metrics-core.mjs';

export const ENDPOINT='https://ghostform-web-funnel.line-harness-trampoline.workers.dev/collect';
export function visitStore({storage,now=Date.now,random,page,source=null,qa=false}) {
  const key='gf_web_visit_v1_'+(qa?'qa':'live'); let memory=null,shared=!!storage;
  const save=()=>{if(storage) try{storage.setItem(key,JSON.stringify(memory));}
    catch{storage=null;shared=false;memory.shared=false;}};
  const get=()=>{
    let old=memory;
    if(storage) try{old=JSON.parse(storage.getItem(key)||'null');}catch{storage=null;shared=false;}
    const time=now();
    const reusable=reuseVisit(old,{now:time,qa,source}),oldMask=old?.mask,oldShared=old?.shared;
    memory=reusable?old:newVisit({page,source:source||'default',qa,id:random(),now:time,shared});
    memory.mask=progress(memory.mask,'view',page); memory.shared=memory.shared&&shared;
    if(!reusable||memory.mask!==oldMask||memory.shared!==oldShared)save();return memory;
  };
  return {get,record(event){const s=get(),before=s.mask;s.mask=progress(s.mask,event,page);if(before!==s.mask)save();return s;},
    clear(){memory=null;if(storage)try{storage.removeItem(key);}catch{};}};
}
export function payloadOf(session) {const {started,...payload}=session;return payload;}
export function blockedBySignals(navigator) {
  return navigator.globalPrivacyControl===true || navigator.doNotTrack==='1';
}

function boot() {
  const query=new URLSearchParams(location.search),qa=query.get('gf_qa')==='1';
  const base=new URL('./',import.meta.url).pathname;
  const page=[base,base+'index.html'].includes(location.pathname)?'home':
    [base+'try/',base+'try/index.html'].includes(location.pathname)?'trial':null;
  const source=SOURCES.includes(query.get('from'))?query.get('from'):null;
  const optKey='gf_web_metrics_off_v1_'+(qa?'qa':'live');
  let local=null,session=null,preferencesAvailable=false;
  try{local=window.localStorage;local.setItem(optKey+'_probe','1');local.removeItem(optKey+'_probe');preferencesAvailable=true;}catch{local=null;}
  try{session=window.sessionStorage;}catch{};
  let optedOut=false;try{optedOut=local?.getItem(optKey)==='1';}catch{};
  const signal=()=>blockedBySignals(navigator);
  let store=null,timer=0,lastQueued='',lastState='';
  const enabled=()=>{
    if(local)try{optedOut=local.getItem(optKey)==='1';}catch{preferencesAvailable=false;}
    return preferencesAvailable&&!signal()&&!optedOut;
  };
  const random=()=>crypto.randomUUID().replaceAll('-','');
  const ensure=()=>store||(store=visitStore({storage:session,random,page,source,qa}));
  function send(retry=false) {
    clearTimeout(timer); if(!enabled()||!page) return;
    try {
      const payload=payloadOf(ensure().get()),key=payload.id+':'+payload.mask;
      if(key===lastQueued&&!retry)return; lastQueued=key;
      fetch(ENDPOINT,{method:'POST',mode:'cors',credentials:'omit',keepalive:true,referrerPolicy:'no-referrer',
        headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload)})
        .then(response=>{if(!response.ok)throw new Error('not accepted');})
        .catch(()=>{if(!retry&&enabled())timer=setTimeout(()=>send(true),1500);});
    } catch { /* Measurement must never interrupt sample playback or navigation. */ }
  }
  function record(event) {
    if(!['view','ready','opacity','step','error','store'].includes(event)||!enabled()||!page)return;
    try {
      const s=ensure().record(event);
      const key=s.id+':'+s.mask;
      if(key===lastState&&event!=='store')return;lastState=key;
      if(event==='store')send();else{clearTimeout(timer);timer=setTimeout(()=>send(),100);}
    }catch{}
  }
  function snapshot() {
    if(page!=='trial')return;
    if(document.querySelector('#controls')?.disabled===false)record('ready');
    if(document.querySelector('#task-mix .done')?.hidden===false)record('opacity');
    if(document.querySelector('#task-step .done')?.hidden===false)record('step');
    if(document.querySelector('#retry')?.hidden===false)record('error');
  }
  function updatePrivacy() {
    enabled();
    document.querySelectorAll('[data-metrics-state]').forEach(el=>{
      el.textContent=!preferencesAvailable?'このブラウザでは設定を保存できないため、集計していません':signal()?'ブラウザのプライバシー設定により停止中':optedOut?'利用状況の集計は停止中':'利用状況の集計は有効';
    });
    document.querySelectorAll('[data-metrics-toggle]').forEach(button=>{
      button.disabled=signal()||!preferencesAvailable;button.textContent=optedOut?'集計を有効にする':'集計を停止する';
    });
  }
  function clearVisit() {
    clearTimeout(timer);store?.clear();
    try{session?.removeItem('gf_web_visit_v1_'+(qa?'qa':'live'));}catch{}
    store=null;lastQueued='';lastState='';
  }
  document.querySelectorAll('[data-metrics-toggle]').forEach(button=>button.addEventListener('click',()=>{
    if(signal())return;optedOut=!optedOut;
    try{local?.setItem(optKey,optedOut?'1':'0');}catch{preferencesAvailable=false;}
    clearVisit();
    updatePrivacy();if(enabled()){record('view');snapshot();}
  }));
  // QA visits use separate storage and a separate database flag, never live totals.
  if(qa)document.querySelectorAll('a[href]').forEach(link=>{
    const url=new URL(link.href);
    if(url.origin===location.origin && [base,base+'index.html',base+'try/',base+'try/index.html',base+'privacy.html',base+'support.html'].includes(url.pathname)){
      url.searchParams.set('gf_qa','1');link.href=url.href;
    }
  });
  function outbound(event) {
    if(event.defaultPrevented || (event.type==='auxclick'&&event.button!==1))return;
    const link=event.target instanceof Element?event.target.closest('a[data-store-link]'):null;
    if(!link)return;
    const url=new URL(link.href);
    if(url.hostname==='apps.apple.com'&&url.pathname.includes('id6831656347')){snapshot();record('store');}
  }
  document.addEventListener('click',outbound);
  document.addEventListener('auxclick',outbound);
  window.addEventListener('pagehide',()=>send());
  window.addEventListener('online',()=>send(true));
  window.addEventListener('pageshow',()=>{updatePrivacy();if(!enabled())clearVisit();});
  window.addEventListener('storage',event=>{if(event.key===optKey){updatePrivacy();if(!enabled())clearVisit();}});
  window.GhostformMetrics=Object.freeze({record,enabled});
  updatePrivacy();if(!enabled())clearVisit();record('view');snapshot();
}
if(typeof window!=='undefined')boot();
