import {B,lastStage} from '../metrics-core.mjs';
export const DAY=86400000;
export const STAGES={before_trial:'体験ページへ進む前',before_ready:'体験の読み込み完了前',load_error:'読み込みエラーが未解消',
  before_use:'準備完了後、濃さ・コマ送りを試す前',one_no_store:'濃さ・コマ送りの片方を試した後',both_no_store:'両方を試した後',
  store_after_use:'対象操作後にApp Storeをクリック',store_before_use:'体験を開き、対象操作前にApp Storeをクリック',
  store_direct:'体験前のApp Store直接クリックあり'};
export function weekWindow(now=Date.now()) {
  const end=Math.floor((now+9*3600000)/DAY)*DAY-9*3600000;
  return {start:end-7*DAY,end,previousStart:end-14*DAY};
}
export const jstDate=ms=>new Date(ms+9*3600000).toISOString().slice(0,10);
export function cohortSql(start,end,qa=false) {
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||end<=start)throw new Error('Invalid period');
  return `SELECT entry,source,mask,shared,COUNT(*) AS visits FROM visits
WHERE qa=${Number(qa)} AND first_seen>=${start} AND first_seen<${end}
GROUP BY entry,source,mask,shared ORDER BY entry,source,mask,shared;`;
}
const blank=()=>({visits:0,trial:0,ready:0,opacity:0,step:0,both:0,any:0,store:0,after_trial:0,after_any:0,after_both:0,direct_store:0,unlinked:0});
export function summarize(rows) {
  const total=blank(),byEntry={home:blank(),trial:blank()},bySource={},last={};
  for(const row of rows) {
    const n=Number(row.visits),m=Number(row.mask);
    if(!Number.isInteger(n)||n<0||!Object.hasOwn(byEntry,row.entry))throw new Error('Invalid aggregate');
    bySource[row.source]??=blank();
    for(const bucket of [total,byEntry[row.entry],bySource[row.source]]) {
      bucket.visits+=n;
      for(const [name,bit] of Object.entries({trial:B.TRIAL,ready:B.READY,opacity:B.MIX,step:B.STEP,store:B.STORE,
        after_trial:B.AFTER_TRIAL,after_any:B.AFTER_ANY,after_both:B.AFTER_BOTH,direct_store:B.DIRECT_STORE}))
        if((m&bit)===bit)bucket[name]+=n;
      if(m&(B.MIX|B.STEP))bucket.any+=n;
      if((m&(B.MIX|B.STEP))===(B.MIX|B.STEP))bucket.both+=n;
      if(!row.shared)bucket.unlinked+=n;
    }
    const stage=lastStage(m);last[stage]=(last[stage]||0)+n;
  }
  if(Object.values(last).reduce((a,b)=>a+b,0)!==total.visits)throw new Error('Stage partition does not reconcile');
  return {total,byEntry,bySource,lastStages:last};
}
export function periodResult(rows,{start,end,activeSince,now=Date.now(),qa=false}) {
  const retainedSince=now-90*DAY,begin=Math.max(activeSince,retainedSince);
  if(!Number.isFinite(activeSince))throw new Error('Measurement start unavailable');
  const coverage=end<=begin?'not_measured':start<begin||end>now?'partial':'complete';
  return {start:new Date(start).toISOString(),endExclusive:new Date(end).toISOString(),timezone:'Asia/Tokyo',coverage,
    qa,measuredSince:new Date(activeSince).toISOString(),counts:coverage==='not_measured'?null:summarize(rows)};
}
export function renderReport(report) {
  const {current,previous}=report;
  const lines=[`Ghostform サイト→体験→ストア｜${report.qa?'検証データ':'本集計'}`,
    `期間：${jstDate(Date.parse(current.start))}〜${jstDate(Date.parse(current.endExclusive)-1)} JST`,
    `計測開始：${current.measuredSince}／集計範囲：${{not_measured:'計測開始前',partial:'一部期間',complete:'全期間'}[current.coverage]}`];
  if(report.snapshot)lines.push(`速報：利用中の訪問も含みます。終了時刻（排他）：${current.endExclusive}`);
  if(!current.counts){lines.push('この期間は計測開始前です。訪問・操作・クリック数は取得対象外（0件ではありません）');return lines.join('\n');}
  const {total:t,byEntry:e,lastStages:last}=current.counts;
  lines.push(`計測できた訪問：${t.visits}（公式サイト入口 ${e.home.visits}／体験版への直接入口 ${e.trial.visits}）`,
    '対象操作＝濃さ調整またはコマ送り。両方の順序は問いません',
    `公式サイト入口の経路：${e.home.visits} → 体験 ${e.home.trial} → 準備完了 ${e.home.ready} → 操作 ${e.home.any} → 操作後ストア ${e.home.after_any}`,
    `体験版へ直接来た経路：${e.trial.visits} → 準備完了 ${e.trial.ready} → 操作 ${e.trial.any} → 操作後ストア ${e.trial.after_any}`,
    `濃さ調整：${t.opacity}／コマ送り：${t.step}／両方：${t.both}（重複するため合算しない）`,
    `App Storeクリック：${t.store}／体験後 ${t.after_trial}／操作後 ${t.after_any}／両方の操作後 ${t.after_both}`,
    `体験前のストア直行を確認：${t.direct_store}（体験未利用の離脱に含めない）`,
    '到達状況の区分（重複なし）：');
  for(const [key,label]of Object.entries(STAGES))lines.push(`  ${label}：${last[key]||0}`);
  lines.push('リンク指定別（実際の参照元と一致するとは限りません）：');
  for(const [source,c]of Object.entries(current.counts.bySource))lines.push(`  ${source==='default'?'指定なし':source}：訪問 ${c.visits}／体験 ${c.trial}／対象操作 ${c.any}／操作後ストア ${c.after_any}`);
  const stopped=Object.entries(last).filter(([k])=>!k.startsWith('store_')).sort((a,b)=>b[1]-a[1]);
  if(stopped[0]?.[1]>0)lines.push(`最も多い未到達段階：${STAGES[stopped[0][0]]}（${stopped[0][1]}訪問）。離脱理由はこの数値だけでは断定しない`);
  if(current.coverage==='complete'&&previous.coverage==='complete'&&previous.counts)
    lines.push(`前週差：体験 ${t.trial-previous.counts.total.trial}／操作 ${t.any-previous.counts.total.any}／操作後ストア ${t.after_any-previous.counts.total.after_any}`);
  else lines.push('前週比較：開始前・一部期間を含むため増減率を計算しない');
  lines.push(`ページ間の連結を保証できない訪問：${t.unlinked}`,
    '30分を単位とする訪問であり人数ではありません。拒否設定・送信失敗・ブロック等による未計測があります',
    'App Storeクリックはストアでの表示成功やダウンロード完了を示しません。Appleの初回DLは別に報告します');
  return lines.join('\n');
}
