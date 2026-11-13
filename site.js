// Presentation only: no tracking SDK, cookies or video inference.
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

// Start a film only after a tap. Keep native controls and direct links as fallbacks.
document.querySelectorAll('[data-play-film]').forEach(button => {
  const video = document.getElementById(button.dataset.playFilm);
  if (!video) return;
  const status = button.closest('figure').querySelector('.film-status');
  button.hidden = false;
  button.addEventListener('click', () => {
    if (video.ended) video.currentTime = 0;
    if (status) status.textContent = '';
    video.play().catch(() => {
      button.hidden = false;
      if (status) status.textContent = '下の再生ボタンか「動画を直接開く」からご覧ください。';
    });
  });
  video.addEventListener('playing', () => {
    button.hidden = true;
    document.querySelectorAll('.feature-film video').forEach(other => {
      if (other !== video && !other.paused) other.pause();
    });
  });
  video.addEventListener('pause', () => {
    button.hidden = false;
    button.querySelector('span').innerHTML = '続きから再生<small>音声付き</small>';
  });
  video.addEventListener('ended', () => {
    button.hidden = false;
    button.querySelector('span').innerHTML = 'もう一度見る<small>30秒・音声付き</small>';
  });
  video.addEventListener('error', () => {
    button.hidden = false;
    if (status) status.textContent = '動画を読み込めませんでした。「動画を直接開く」もお試しください。';
  });
});
