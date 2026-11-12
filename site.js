// Presentation only: no tracking SDK, cookies, network calls or video inference.
const motionToggle = document.querySelector('.motion-toggle');
if (motionToggle && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  motionToggle.hidden = false;
  motionToggle.addEventListener('click', () => {
    const paused = motionToggle.getAttribute('aria-pressed') !== 'true';
    document.documentElement.classList.toggle('motion-paused', paused);
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.querySelector('span').textContent = paused ? '演出を再開' : '演出を停止';
    motionToggle.querySelector('img').src = paused ? 'assets/play-fill.svg' : 'assets/pause-fill.svg';
  });
}
const comparisonScreen = document.querySelector('#comparison-screen');
const description = document.querySelector('.screen-description');
const screenChoices = {
  overlay: {src:'assets/store-01.jpg', alt:'お手本と練習の動画を半透明で重ねたGhostformのApp Store掲載画面', text:'半透明で重ねて、動きのズレを確認。'},
  side: {src:'assets/store-06.jpg', alt:'お手本と練習の動画を左右に並べたGhostformのApp Store掲載画面', text:'左右に並べて、同じ局面を見比べる。'}
};
document.querySelectorAll('[data-screen]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    const key = button.dataset.screen;
    const choice = screenChoices[key];
    if (!choice || !comparisonScreen || !description) return;
    comparisonScreen.src = choice.src;
    comparisonScreen.alt = choice.alt;
    comparisonScreen.parentElement.className = 'screen-crop ' + key;
    description.textContent = choice.text;
    document.querySelectorAll('[data-screen]').forEach(peer => peer.setAttribute('aria-pressed', String(peer === button)));
  });
});
