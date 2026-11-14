# Ghostform public website

- This repository serves `https://rikyuuuuuuun.github.io/ghostform-web/` through GitHub Pages. The app and 3D prototypes live in a different repository.
- Keep existing support and privacy URLs working. Preserve the ownership-verification meta tag in `index.html`.
- Describe features confirmed in the released iPhone app. Do not advertise experimental 3D/Full/Heavy features as available.
- Use the official logo and actual approved product assets. Keep free-download claims separate from PRO features and advertising.
- Only use campaign links issued by App Store Connect. Their presence does not prove attribution or downloads; thresholds and reporting delays apply.
- For Japanese download links, preserve the issued tokens on `https://apps.apple.com/jp/app/id6831656347`. Regionless campaign URLs have reproduced a US not-found page. Verify an actual click reaches Ghostform's Japanese listing; href inspection alone is insufficient.
- See `README.md` for publication and verification. Changes on `main` publish automatically; inspect the diff before pushing.

- Website measurement definitions and operator procedure live in `docs/measurement.md`. Keep native-app tracking separate. Respect privacy signals/opt-out, and never send video or IP/UA/referrer fields in the allowlisted payload.
- Use `gf_qa=1` for browser verification and QA payloads for API checks; exclude them from live totals. Keep every analytics result/log outside this public repo. Weekly reporting uses the existing authenticated CLI with aggregate SELECTs, not a public report endpoint or new API keys.
