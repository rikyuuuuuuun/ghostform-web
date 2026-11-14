export const VERSION = 1;
export const TTL = 30 * 60 * 1000;
export const B = Object.freeze({ HOME:1, TRIAL:2, READY:4, MIX:8, STEP:16, STORE:32,
  AFTER_TRIAL:64, AFTER_ANY:128, AFTER_BOTH:256, ERROR:512, DIRECT_STORE:1024 });
export const ALL_BITS = Object.values(B).reduce((a,b)=>a|b,0);
export const SOURCES = ['default','x','instagram','tiktok','note','coach'];
export const has = (mask,bit)=>(mask & bit)===bit;
export function progress(mask,event,page) {
  mask |= page==='home' ? B.HOME : B.TRIAL;
  if(event==='ready') mask |= B.TRIAL|B.READY;
  if(event==='opacity') mask |= B.TRIAL|B.READY|B.MIX;
  if(event==='step') mask |= B.TRIAL|B.READY|B.STEP;
  if(event==='error') mask |= B.TRIAL|B.ERROR;
  if(event==='store') {
    mask |= B.STORE;
    if(has(mask,B.TRIAL)) {
      mask |= B.AFTER_TRIAL;
      if(mask & (B.MIX|B.STEP)) mask |= B.AFTER_ANY;
      if(has(mask,B.MIX|B.STEP)) mask |= B.AFTER_BOTH;
    } else mask |= B.DIRECT_STORE;
  }
  return mask;
}
export function validMessage(p) {
  const keys=['v','id','entry','source','mask','qa','shared'];
  if(!p || typeof p!=='object' || Object.keys(p).some(k=>!keys.includes(k))) return false;
  if(p.v!==VERSION || typeof p.id!=='string' || !/^[a-f0-9]{32}$/.test(p.id) || !['home','trial'].includes(p.entry)
    || !SOURCES.includes(p.source) || typeof p.qa!=='boolean' || typeof p.shared!=='boolean'
    || !Number.isInteger(p.mask) || p.mask<=0 || p.mask>ALL_BITS || (p.mask & ~ALL_BITS)) return false;
  const m=p.mask;
  if(p.entry==='home' && !has(m,B.HOME) || p.entry==='trial' && !has(m,B.TRIAL)) return false;
  if(m & (B.READY|B.MIX|B.STEP|B.ERROR|B.AFTER_TRIAL) && !has(m,B.TRIAL)) return false;
  if(m & (B.MIX|B.STEP) && !has(m,B.READY)) return false;
  if(m & (B.AFTER_TRIAL|B.DIRECT_STORE) && !has(m,B.STORE)) return false;
  if(has(m,B.AFTER_ANY) && (!has(m,B.AFTER_TRIAL) || !(m & (B.MIX|B.STEP)))) return false;
  if(has(m,B.AFTER_BOTH) && !has(m,B.AFTER_ANY|B.MIX|B.STEP)) return false;
  return true;
}
export function newVisit({page,source='default',qa=false,id,now,shared=true}) {
  return {v:VERSION,id,entry:page,source,mask:page==='home'?B.HOME:B.TRIAL,qa,shared,started:now};
}
export function reuseVisit(old,{now,qa,source=null}) {
  if(!old || now-old.started<0 || now-old.started>=TTL || old.qa!==qa) return false;
  if(source && old.source!==source) return false;
  const {started,...message}=old;
  return Number.isFinite(started) && validMessage(message);
}
export function lastStage(mask) {
  if(has(mask,B.AFTER_ANY)) return 'store_after_use';
  if(has(mask,B.AFTER_TRIAL)) return 'store_before_use';
  if(has(mask,B.DIRECT_STORE)) return 'store_direct';
  if(!has(mask,B.TRIAL)) return 'before_trial';
  if(!has(mask,B.READY)) return has(mask,B.ERROR)?'load_error':'before_ready';
  if(has(mask,B.MIX|B.STEP)) return 'both_no_store';
  if(mask & (B.MIX|B.STEP)) return 'one_no_store';
  return 'before_use';
}
