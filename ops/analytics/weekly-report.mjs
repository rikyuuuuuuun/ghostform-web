import {weekWindow,cohortSql,periodResult,renderReport} from '../../scripts/funnel-report-core.mjs';
export async function weeklyReport(db,now=Date.now()) {
  const {start,end,previousStart}=weekWindow(now);
  const rows=await db.batch([db.prepare('SELECT key,value FROM meta'),db.prepare(cohortSql(start,end)),db.prepare(cohortSql(previousStart,start))]);
  if(rows.length!==3||rows.some(r=>r.success===false||!Array.isArray(r.results)))throw new Error('aggregate_unavailable');
  const meta=Object.fromEntries(rows[0].results.map(r=>[r.key,r.value])),activeSince=Number(meta.active_since);
  if(meta.schema_version!=='1'||!Number.isFinite(activeSince)||activeSince<=0)throw new Error('aggregate_unavailable');
  const report={status:'ok',version:1,createdAt:new Date(now).toISOString(),qa:false,snapshot:false,
    current:periodResult(rows[1].results,{start,end,activeSince,now}),
    previous:periodResult(rows[2].results,{start:previousStart,end:start,activeSince,now})};
  return {report,text:renderReport(report)};
}
