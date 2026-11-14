# Browser sample comparison

Scope: a public sample-only trial at `/try/`, linked from the hero and comparison introduction. The mobile/native and experimental 3D repositories are unchanged. The website retains its existing imagery and color direction.

## Interaction

- Overlay / side-by-side, independent teacher/student opacity, play/pause, 0.25/0.5/1× speeds, scrub, exact single-frame steps and held steps, reset.
- Same `overlayAlphas()` source-over calculation as the released app (`ghostform-app` df1a1ba browser snapshot). Side mode shows both clips fully and disables opacity, matching that behavior.
- Native range inputs and buttons, 44px or larger transport buttons, visible focus, canvas keyboard controls, reduced motion compatible. Loading and failure/retry states, film fallback and a no-JavaScript explanation remain available.
- No login, camera, uploads, billing, advertising SDK, user-video persistence or experimental pose inference. Download links retain issued Apple campaigns. Known `from` values survive home → trial → download and return-to-home; other parameters are dropped.

## Sample and rendering

This is the same licensed, cropped Jill Burrow/Pexels exercise footage used in the published comparison film. The teacher and student samples use the same source with a 12-frame (0.5s) offset. This is an operation example, not before/after athletic improvement; the page discloses this visibly. It does not imply endorsement.

- Source page: https://www.pexels.com/video/woman-lifting-weights-while-squating-8893521/
- License: https://www.pexels.com/license/ (checked 2026-11-14)
- Prepared input outside this repo: `../../outputs/ghostform-live-demos/capture-site/media/動作A.mp4`, 540×1024, 24fps.
- 108 real frames resized to 256×486; three 6×6 JPEG sheets. Teacher frames 0–95, student 12–107. UI range 0–95 at 24fps; clip duration 4s. No pose generation or synthetic human frames.
- Total sheet payload: 1,269,364 bytes. Full decoded RGBA dimensions represent about 51.3MiB, before browser/GPU overhead; actual device memory is unmeasured.
- Canvas contains the original frame proportions. One shared frame index drives both samples. `requestAnimationFrame` advances by elapsed time at the selected speed; no HTML video seek is required for stepping or scrubbing. Playback pauses when the document becomes hidden.
- Source samples are silent. Resources load only on entering the trial; the marketing homepage does not load the sheets.

Regenerate from the prepared licensed input:

```powershell
node scripts/prepare-trial-media.mjs ../../outputs/ghostform-live-demos/capture-site/media/動作A.mp4 ../../outputs/ghostform-live-demos/tools/bin/ffmpeg.exe
```

The fixed frame assets make this sample deterministic. This renderer is not a general upload/video decoder; do not advertise arbitrary uploads or native-app parity beyond the demonstrated controls.

## Verification and recovery

Run `node --test tests/*.test.mjs` and syntax checks for `try/trial.mjs` / `store-links.js`. Unit checks cover frame boundaries and looping, actual app opacity weighting, every sheet lookup, aspect ratio and campaign routing. Browser checks must exercise real controls and inspect the actual image as well as labels.

Current browser evidence is outside the public repo at `../../outputs/ghostform-browser-trial/`. Checked 320×740, 390×844, 844×390 and 1440×1000, including clipped-button bounds. A one-time sample-sheet HTTP503 is produced only by the local preview helper's optional fourth argument; it is not a production test hook. Check error copy remains stable and retry restores working controls. Physical iPhone/Safari and Android devices are not verified by these desktop viewport checks.

Publication uses the existing main/Pages workflow. Confirm the matching deployment SHA, public module MIME/asset responses, homepage trial link, sample interaction, campaign continuity and a real App Store click. Keep confirmed redirect/catalog state separate from an Apple page-rendering error or actual download attribution.

To roll back, revert the trial commit rather than rewriting shared history. Do not delete native-app user data. The trial writes no video state to localStorage/IndexedDB. Website measurement uses the separate short-lived session and opt-out settings described in `measurement.md`.
