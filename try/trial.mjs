import { SAMPLE, stepFrame, playbackFrame, sourceRect, overlayAlphas, containRect } from './core.mjs';

const $ = selector => document.querySelector(selector);
const canvas = $('#comparison');
const ctx = canvas.getContext('2d', { alpha: false });
const state = { frame: 36, teacher: 100, student: 100, mode: 'overlay', playing: false, rate: .5, ready: false };
let sheets = [], tick = 0, startedAt = 0, startedFrame = 0, hasPlayed = false;
let loadAttempt = 0;
const completed = new Set();

function mark(task) {
  completed.add(task);
  $(`#task-${task} .done`).hidden = false;
  if (completed.size === 3) $('#download-message').textContent = '見つけた違いを、自分の練習でも';
}
function announce(text) { $('#announcement').textContent = text; }
function imageAt(frame, area, alpha) {
  if (alpha <= 0) return;
  const r = sourceRect(frame), d = containRect(SAMPLE.width, SAMPLE.height, area.x, area.y, area.width, area.height);
  ctx.globalAlpha = alpha;
  ctx.drawImage(sheets[r.sheet], r.x, r.y, r.width, r.height, d.x, d.y, d.width, d.height);
}
function render() {
  if (!state.ready) return;
  const w = canvas.width, h = canvas.height;
  ctx.globalAlpha = 1; ctx.fillStyle = '#080b0e'; ctx.fillRect(0, 0, w, h);
  if (state.mode === 'side') {
    imageAt(state.frame, { x: 0, y: 0, width: w / 2, height: h }, 1);
    imageAt(state.frame + SAMPLE.offsetFrames, { x: w / 2, y: 0, width: w / 2, height: h }, 1);
    ctx.globalAlpha = 1; ctx.fillStyle = '#303944'; ctx.fillRect(w / 2 - 1, 0, 2, h);
  } else {
    const alpha = overlayAlphas(state.teacher, state.student);
    const area = { x: 0, y: 0, width: w, height: h };
    imageAt(state.frame, area, alpha.teacher);
    imageAt(state.frame + SAMPLE.offsetFrames, area, alpha.student);
  }
  ctx.globalAlpha = 1;
  $('#stage-empty').hidden = state.mode !== 'overlay' || state.teacher + state.student > 0;
  const seconds = (state.frame / SAMPLE.fps).toFixed(2);
  $('#time').innerHTML = `${seconds}<small>秒</small>`;
  $('#frame').textContent = `F${state.frame + 1} / ${SAMPLE.frameCount}`;
  $('#scrub').value = state.frame;
  $('#scrub').setAttribute('aria-valuetext', `${seconds}秒、${state.frame + 1}コマ目`);
  canvas.dataset.frame = state.frame;
}
function resize() {
  const rect = canvas.getBoundingClientRect(), scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.round(rect.width * scale));
  canvas.height = Math.max(1, Math.round(rect.height * scale));
  render();
}
function updatePlay() {
  $('#play').setAttribute('aria-label', state.playing ? '一時停止' : '再生');
  canvas.setAttribute('aria-pressed', String(state.playing));
  $('#play-icon').src = state.playing ? '../assets/pause-fill.svg' : '../assets/play-fill.svg';
}
function pause(user = false) {
  const wasPlaying = state.playing;
  state.playing = false; cancelAnimationFrame(tick); updatePlay();
  if (user && wasPlaying && hasPlayed) mark('pause');
}
function animate(now) {
  if (!state.playing) return;
  const next = playbackFrame(startedFrame, now - startedAt, state.rate);
  if (next !== state.frame) { state.frame = next; render(); }
  tick = requestAnimationFrame(animate);
}
function play() {
  if (!state.ready) return;
  startedFrame = state.frame; startedAt = performance.now();
  state.playing = true; hasPlayed = true; updatePlay(); tick = requestAnimationFrame(animate);
}
function step(direction) {
  if (!state.ready) return;
  pause(true); state.frame = stepFrame(state.frame, direction); render(); mark('step');
  announce(`${(state.frame / SAMPLE.fps).toFixed(2)}秒、${state.frame + 1}コマ目`);
}
$('#play').addEventListener('click', () => state.playing ? pause(true) : play());
// One click = one frame. Holding repeats; cancelling or leaving cannot leave a timer running.
for (const [id, direction] of [['prev', -1], ['next', 1]]) {
  const button = $('#' + id); let hold = 0, repeat = 0, repeated = false, ignoreClick = false;
  const stop = () => { clearTimeout(hold); clearInterval(repeat); };
  button.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !state.ready) return;
    stop(); repeated = false; ignoreClick = false;
    hold = setTimeout(() => { repeated = true; step(direction); repeat = setInterval(() => step(direction), 85); }, 380);
  });
  button.addEventListener('pointerup', () => { ignoreClick = repeated; stop(); });
  for (const event of ['pointerleave', 'pointercancel', 'lostpointercapture']) button.addEventListener(event, stop);
  window.addEventListener('blur', stop);
  document.addEventListener('visibilitychange', stop);
  button.addEventListener('click', () => { if (!ignoreClick) step(direction); ignoreClick = false; });
}
$('#scrub').addEventListener('input', event => { pause(true); state.frame = +event.target.value; render(); });
$('#speed').addEventListener('click', () => {
  const resume = state.playing; pause();
  const rates = [.25, .5, 1]; state.rate = rates[(rates.indexOf(state.rate) + 1) % rates.length];
  $('#speed').textContent = state.rate + '×';
  $('#speed').setAttribute('aria-label', `再生速度 ${state.rate}倍、押して変更`);
  if (resume) play();
});
function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll('[data-mode]').forEach(peer => peer.setAttribute('aria-pressed', String(peer.dataset.mode === mode)));
  const side = state.mode === 'side';
  $('#side-labels').hidden = !side;
  $('#stage-mode').textContent = side ? '左右に並べて比較' : '半透明で重ねて比較';
  canvas.setAttribute('aria-label', side ? '並べたプレビュー、押すと再生・停止' : '重ねたプレビュー、押すと再生・停止');
  for (const key of ['teacher', 'student']) $('#' + key + '-opacity').disabled = side;
  $('#mix-help').textContent = side ? '濃さを変えるには「重ねる」に戻してください' : '2本の濃さを調整して、位置の違いを見つけてみてください';
  render();
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
for (const key of ['teacher', 'student']) $('#' + key + '-opacity').addEventListener('input', event => {
  state[key] = +event.target.value; $('#' + key + '-value').textContent = state[key] + '%'; render(); mark('mix');
});
$('#reset').addEventListener('click', () => {
  pause(); state.frame = 36; state.teacher = 100; state.student = 100; state.rate = .5;
  $('#speed').textContent = '0.5×'; $('#speed').setAttribute('aria-label', '再生速度を変更');
  for (const key of ['teacher', 'student']) { $('#' + key + '-opacity').value = 100; $('#' + key + '-value').textContent = '100%'; }
  setMode('overlay'); announce('最初の再生位置と濃さに戻しました');
});
canvas.addEventListener('click', () => state.playing ? pause(true) : play());
canvas.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1); }
  if (event.key === ' ') { event.preventDefault(); state.playing ? pause(true) : play(); }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
window.addEventListener('pagehide', () => pause());
if ('ResizeObserver' in window) new ResizeObserver(resize).observe($('#stage'));
else window.addEventListener('resize', resize);

async function load() {
  const attempt = ++loadAttempt; let count = 0;
  $('#retry').hidden = true; $('#film-fallback').hidden = true;
  $('#load-message').textContent = 'サンプルを準備中'; $('#load-progress').value = 0; $('#load-progress').hidden = false;
  try {
    if (!ctx) throw new Error('Canvas unavailable');
    const images = await Promise.all(SAMPLE.sheets.map(src => new Promise((resolve, reject) => {
      const img = new Image(); const timeout = setTimeout(() => reject(new Error('Sample timeout')), 20000);
      img.onload = async () => {
        try {
          if (img.decode) await img.decode();
          clearTimeout(timeout);
          if (attempt === loadAttempt) { $('#load-progress').value = ++count; $('#load-message').textContent = `サンプルを準備中 ${count} / ${SAMPLE.sheets.length}`; }
          resolve(img);
        } catch { clearTimeout(timeout); reject(new Error('Sample decode unavailable')); }
      };
      img.onerror = () => { clearTimeout(timeout); reject(new Error('Sample unavailable')); };
      img.src = new URL(src, import.meta.url).href;
    })));
    if (attempt !== loadAttempt) return;
    sheets = images; state.ready = true; $('#stage').setAttribute('aria-busy', 'false');
    canvas.setAttribute('aria-disabled', 'false');
    $('#loading').hidden = true; $('#stage-mode').hidden = false; $('#controls').disabled = false;
    resize(); announce('サンプルの準備ができました。濃さやコマ送りを試せます');
  } catch {
    if (attempt !== loadAttempt) return;
    ++loadAttempt; // Late successes from this failed batch must not replace the error state.
    $('#stage').setAttribute('aria-busy', 'false'); $('#load-progress').hidden = true;
    $('#load-message').textContent = 'サンプルを読み込めませんでした'; $('#retry').hidden = false; $('#film-fallback').hidden = false;
  }
}
$('#retry').addEventListener('click', load);
load();
