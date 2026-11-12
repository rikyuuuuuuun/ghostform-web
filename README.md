# Ghostform public website

Public URL: https://rikyuuuuuuun.github.io/ghostform-web/

This is a buildless GitHub Pages website. Publishing uses the existing `main` branch and Pages workflow. It does not build or publish the mobile app.

## Files

- `index.html`: product introduction, use cases, first-use instructions, download links, canonical URL and Search Console verification.
- `support.html` and `privacy.html`: existing support/privacy URLs, retained for the app listing.
- `store-links.js`: Apple-issued campaign links. `?from=x`, `instagram`, `tiktok`, `note`, or `coach` selects a source. Unknown values use the website campaign.
- `site.js`: presentation motion pause and two real product-screenshot choices. All content and download fallbacks remain accessible without JavaScript.
- `sitemap.xml`: homepage and support page.
- `assets/`: original official icon and current App Store marketing screenshots, obtained from the product's public catalog response. The 600px copies are web assets, not store-submission originals.
- `assets/athlete-hero.png`: AI-generated promotional artwork, not an inference result or app screenshot. The athlete is deliberately independent of a particular sport. Keep the artwork behind the headline and clipped inside `.hero-stage` so feet never cover the Japanese heading.
- `assets/display.woff2` and `headings-ja.woff2`: self-hosted subsets of Barlow Condensed ExtraBold Italic and Noto Sans JP Black (Google Fonts; accompanying OFL licenses). UI text uses the system sans-serif. Decorative icons are unmodified Bootstrap Icons 1.13.1 (MIT; license included).
- `design-qa.md`: design comparison and browser validation record. Its evidence paths refer to local deliverables outside the public repository.

## Preview and publish

From this directory run `python -m http.server 8891 --bind 127.0.0.1`, then open the printed local URL. Check desktop and mobile widths, images, FAQ expansion, anchors and the App Store destination. Preserve the no-JavaScript fallback download links when changing campaign settings.

Inspect and commit only the intended files, then push `main`. Wait for the matching Pages deployment to succeed. Verify the actual public URL and its links after deployment; a successful push alone is not publication verification.

For indexing, use the verified Search Console property for the exact public prefix. Do not treat ownership verification or an accepted crawl request as proof of indexing. If sitemap fetching fails while public XML is valid and returns HTTP 200, record both results and check subsequent Google fetches. Repeated URL submissions do not increase crawl priority.

## Recovery

Use a new reverting commit for an identified website change; do not force-reset shared history. The pre-landing-page head was `7d388fed9dddf09c08af6e09290fba4590ab9453`. Preserve the verification tag and existing support/privacy pages when reverting unrelated design changes.
