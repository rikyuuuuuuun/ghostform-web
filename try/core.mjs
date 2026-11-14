// Short, fixed sample: real 24fps frames, prepared offline for instant stepping.
export const SAMPLE = Object.freeze({
  fps: 24, frameCount: 96, offsetFrames: 12, sourceFrameCount: 108,
  width: 256, height: 486, columns: 6, framesPerSheet: 36,
  sheets: ['assets/sample-01.jpg', 'assets/sample-02.jpg', 'assets/sample-03.jpg']
});
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const stepFrame = (frame, direction) => clamp(Math.round(frame) + direction, 0, SAMPLE.frameCount - 1);
export function playbackFrame(start, elapsedMs, rate) {
  return Math.floor(start + Math.max(0, elapsedMs) * SAMPLE.fps * rate / 1000) % SAMPLE.frameCount;
}
export function sourceRect(frame) {
  const bounded = clamp(Math.round(frame), 0, SAMPLE.sourceFrameCount - 1);
  const cell = bounded % SAMPLE.framesPerSheet;
  return { sheet: Math.floor(bounded / SAMPLE.framesPerSheet), x: cell % SAMPLE.columns * SAMPLE.width,
    y: Math.floor(cell / SAMPLE.columns) * SAMPLE.height, width: SAMPLE.width, height: SAMPLE.height };
}
// Same source-over weighting as the released app's overlayAlphas().
export function overlayAlphas(teacher, student) {
  const t = clamp(teacher, 0, 100) / 100, s = clamp(student, 0, 100) / 100;
  const total = Math.max(t + s, 1), upper = s / total;
  return { teacher: upper >= 1 ? 0 : Math.min(1, (t / total) / (1 - upper)), student: upper };
}
export function containRect(sourceWidth, sourceHeight, x, y, width, height) {
  const scale = Math.min(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale, h = sourceHeight * scale;
  return { x: x + (width - w) / 2, y: y + (height - h) / 2, width: w, height: h };
}
