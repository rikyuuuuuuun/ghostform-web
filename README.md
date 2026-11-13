# Ghostform public website

Public URL: https://rikyuuuuuuun.github.io/ghostform-web/

This is a buildless GitHub Pages website. Publishing uses the existing `main` branch and Pages workflow. It does not build or publish the mobile app.

## Files

- `index.html`: product introduction, use cases, first-use instructions, download links, canonical URL and Search Console verification.
- `support.html` and `privacy.html`: existing support/privacy URLs, retained for the app listing.
- `store-links.js`: Apple-issued campaign tokens on the explicit Japanese product URL. `?from=x`, `instagram`, `tiktok`, `note`, or `coach` selects a source. Unknown values use the website campaign. Regionless `/app/apple-store/` links reproduced a US not-found page; retain `/jp/app/` in JS, HTML fallbacks and support links.
- `site.js`: presentation motion pause, product-screenshot choices and tap-to-play feature films. Starting one film pauses the other. Native video controls, explanatory copy and download fallbacks remain accessible without JavaScript.
- `sitemap.xml`: homepage and support page.
- `assets/`: original official icon and current App Store marketing screenshots, obtained from the product's public catalog response. The 600px copies are web assets, not store-submission originals.
- `assets/athlete-hero.png`: AI-generated promotional artwork, not an inference result or app screenshot. The athlete is deliberately independent of a particular sport. Keep the artwork behind the headline and clipped inside `.hero-stage` so feet never cover the Japanese heading.
- `assets/sports/`: six AI-generated sport-specific campaign photographs (golf, baseball, gymnastics handstand, dance, tennis and soccer). Each has 960px/480px JPEG versions, uncropped at 3:2, responsive `srcset`, descriptive alt text and lazy loading. The originals and prompts are retained outside this public repo in `../../outputs/ghostform-sports-images/`. These are illustrations of use cases, not customer photographs or pose-estimation results.
- `assets/practice/`: four AI-generated delayed-replay practice scenes, each at 960px/480px. The originals and prompts are retained in `../../outputs/ghostform-live-demos/delay-v3/`.
- `assets/video/`: two 30-second, 720×1280, H.264/AAC feature films with fast-start metadata and JPEG posters. `compare-practice-v2` pairs real layer-comparison operations with golf/baseball/gymnastics/dance uses; `delay-practice-v3` pairs the verified three-second delayed replay with the same four sports. Both use `preload="none"`, inline native controls and an optional large play button; neither autoplays. The finished masters and editable HyperFrames projects stay in `../../outputs/ghostform-live-demos/`.
- `assets/display.woff2` and `headings-ja.woff2`: self-hosted subsets of Barlow Condensed ExtraBold Italic and Noto Sans JP Black (Google Fonts; accompanying OFL licenses). UI text uses the system sans-serif. Decorative icons are unmodified Bootstrap Icons 1.13.1 (MIT; license included).
- `design-qa.md`: design comparison and browser validation record. Its evidence paths refer to local deliverables outside the public repository.

## Preview and publish

From this directory run `python -m http.server 8891 --bind 127.0.0.1`, then open the printed local URL. Check desktop and mobile widths, images, FAQ expansion, anchors and the App Store destination. For download changes, actually follow a default and a source-specific button and verify the Ghostform listing title and Japanese storefront; checking hrefs or only a 200 response is insufficient. Preserve the no-JavaScript fallback download links when changing campaign settings. Changing the storefront path must not change the issued campaign/provider tokens; actual attribution still requires Apple reporting.

Inspect and commit only the intended files, then push `main`. Wait for the matching Pages deployment to succeed. Verify the actual public URL and its links after deployment; a successful push alone is not publication verification.

For feature-film updates, verify portrait widths of 320px and 390px, landscape and desktop. Check that both videos begin only after a tap, remain inline, and that starting the other video pauses the first. Keep the native controls and direct MP4 fallback. Practice photos need a visible AI-illustration disclosure; the operation demos need their sample/browser provenance. Never show the sample comparison as an athlete's improvement, or the delay as an edit-created time shift. Preserve captions, free-versus-PRO delay limits and video-source credits when re-encoding.

Music in both films: "Cipher" Kevin MacLeod (incompetech.com), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), excerpted and volume-adjusted. Product-demo source footage: Jill Burrow / Pexels (comparison), Julia Larson / Pexels (delay). Full credits are also in the films and the expandable video notes.

For indexing, use the verified Search Console property for the exact public prefix. Do not treat ownership verification or an accepted crawl request as proof of indexing. If sitemap fetching fails while public XML is valid and returns HTTP 200, record both results and check subsequent Google fetches. Repeated URL submissions do not increase crawl priority.

## Recovery

Use a new reverting commit for an identified website change; do not force-reset shared history. The pre-landing-page head was `7d388fed9dddf09c08af6e09290fba4590ab9453`. Preserve the verification tag and existing support/privacy pages when reverting unrelated design changes.
