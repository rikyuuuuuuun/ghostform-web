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
    document.querySelectorAll('#compare-film, #delay-film').forEach(other => {
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

// Expand the same video in a modal; no duplicate player or second download.
const filmDialog = document.querySelector('.film-dialog');
let expandedFilm = null;
let restoreFilm = null;
let priorOverflow = '';
if (filmDialog) filmDialog.addEventListener('close', () => {
  if (restoreFilm) restoreFilm();
  expandedFilm = null;
  restoreFilm = null;
  document.body.style.overflow = priorOverflow;
});
document.querySelector('[data-close-film]')?.addEventListener('click', () => filmDialog.close());
document.querySelectorAll('[data-expand-film]').forEach(button => {
  const video = document.getElementById(button.dataset.expandFilm);
  const stage = video?.closest('.film-stage');
  if (!video || !stage || !filmDialog?.showModal) return;
  button.hidden = false;
  button.addEventListener('click', () => {
    if (expandedFilm) return;
    const keepPlaying = !video.paused && !video.ended;
    const playButton = stage.querySelector('[data-play-film]');
    priorOverflow = document.body.style.overflow;
    expandedFilm = video;
    restoreFilm = () => {
      const resume = !video.paused && !video.ended;
      stage.insertBefore(video, playButton);
      if (resume) video.play().catch(() => {});
      button.focus();
    };
    filmDialog.querySelector('#film-dialog-title').textContent = video.id === 'delay-film'
      ? 'ディレイ再生の実演' : 'レイヤー比較の実演';
    filmDialog.querySelector('.film-dialog-stage').append(video);
    filmDialog.showModal();
    document.body.style.overflow = 'hidden';
    if (keepPlaying) video.play().catch(() => {});
  });
});

// Show a phone CTA after the first download action has scrolled away.
// Hide it around videos and the final CTA so it cannot cover playback controls.
const mobileDownload = document.querySelector('.mobile-download');
const firstDownload = document.querySelector('.button-hero');
const finalDownload = document.querySelector('.closing [data-store-link]');
if (mobileDownload && firstDownload && finalDownload) {
  const phoneLayout = matchMedia('(max-width: 760px)');
  const videos = [...document.querySelectorAll('.feature-film video')];
  const inView = element => {
    const bounds = element.getBoundingClientRect();
    return bounds.bottom > 0 && bounds.top < innerHeight;
  };
  const updateDownload = () => {
    mobileDownload.hidden = !phoneLayout.matches
      || firstDownload.getBoundingClientRect().bottom > 0
      || inView(finalDownload)
      || videos.some(inView);
  };
  const observer = new IntersectionObserver(updateDownload, {threshold: [0, 0.01, 1]});
  [firstDownload, finalDownload, ...videos].forEach(element => observer.observe(element));
  phoneLayout.addEventListener('change', updateDownload);
  window.addEventListener('resize', updateDownload, {passive: true});
  updateDownload();
}
