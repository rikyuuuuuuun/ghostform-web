import test from 'node:test';
import assert from 'node:assert/strict';
import { SAMPLE, stepFrame, playbackFrame, sourceRect, overlayAlphas, containRect } from '../try/core.mjs';

test('one-frame stepping is reversible at every interior sample frame', () => {
  for (let i = 0; i < SAMPLE.frameCount - 1; i++) assert.equal(stepFrame(stepFrame(i, 1), -1), i);
});
test('stepping at either end stays within the prepared sample', () => {
  assert.equal(stepFrame(0, -1), 0); assert.equal(stepFrame(95, 1), 95);
});
test('24fps playback shows every frame at normal speed', () => {
  for (let i = 0; i < 96; i++) assert.equal(playbackFrame(0, (i + .01) * 1000 / 24, 1), i);
});
test('half/quarter speed and loop boundaries retain the correct frame', () => {
  assert.equal(playbackFrame(36, 1000, .5), 48);
  assert.equal(playbackFrame(36, 1000, .25), 42);
  assert.equal(playbackFrame(95, 50, 1), 0);
  assert.equal(playbackFrame(0, 4000, 1), 0);
});
test('every teacher and student frame maps inside a real sheet, including the last frame', () => {
  for (let i = 0; i < 96; i++) for (const offset of [0, 12]) {
    const r = sourceRect(i + offset);
    assert.ok(r.sheet < SAMPLE.sheets.length);
    assert.ok(r.x >= 0 && r.x + r.width <= SAMPLE.width * 6);
    assert.ok(r.y >= 0 && r.y + r.height <= SAMPLE.height * 6);
  }
  assert.deepEqual(sourceRect(107), { sheet: 2, x: 1280, y: 2430, width: 256, height: 486 });
});
test('prepared sample offset is exactly half a second', () => assert.equal(SAMPLE.offsetFrames / SAMPLE.fps, .5));
test('overlay follows the actual app source-over weighting at equal and unequal weights', () => {
  // Effective teacher contribution is bottom alpha * (1 - top alpha).
  for (const [t,s] of [[100,100],[100,30],[20,80],[0,100],[100,0],[20,30],[0,0]]) {
    const alpha = overlayAlphas(t,s), total = Math.max(t+s,100);
    assert.ok(Math.abs(alpha.teacher*(1-alpha.student)-t/total) < 1e-12);
    assert.ok(Math.abs(alpha.student-s/total) < 1e-12);
  }
});
test('zero weights produce no phantom image', () => assert.deepEqual(overlayAlphas(0,0), {teacher:0, student:0}));
test('contain preserves sample proportions in portrait and split layouts', () => {
  for (const width of [135,320,680]) {
    const rect = containRect(256,486,0,0,width,330);
    assert.ok(rect.width <= width && rect.height <= 330);
    assert.ok(Math.abs(rect.width / rect.height - 256 / 486) < 1e-10);
  }
});
