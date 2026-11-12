# Ghostform landing page design QA

final result: passed

## Visual target and evidence

- Selected visual truth: `../../outputs/ghostform-growth-redesign/selected-athlete-final.png`. The user chose the third displayed design, replaced the dancer with a general athlete, and requested feet behind the headline.
- Implementation: `../../outputs/ghostform-growth-redesign/implementation-target-final.jpg`, IAB at 946 × 1663 CSS pixels, default page state, overlay screenshot selected, scroll position zero. Both images were opened together in one comparison input after the final asset revision.
- Source: 946 × 1663 pixels. Implementation capture: 931 × 1637 pixels from the 946 × 1663 CSS viewport (IAB uniformly scales the capture to the content width excluding the 15-pixel scrollbar). Reviewed at the equivalent CSS scale in the combined input; no device frame or browser toolbar is included. The mobile capture is 375 × 812 pixels from 390 × 844 CSS pixels for the same reason. This capture-density difference and antialiasing are excluded from fidelity findings.
- Responsive evidence: `implementation-mobile-final.jpg`, `mobile-compare-side-final.jpg`, `mobile-faq-open.jpg` in the same evidence directory; tested at 390 × 844, 320 × 740 and 1440 × 1024. Mobile adaptation is evaluated for readability and operation; the selected mock has no separate mobile frame.
- Focused review: the headline/athlete region and the product-screen region are readable in the combined full-view comparison. The shoe no longer appears through the letters or below them; the Japanese heading remains clear. Actual approved screenshots retain their app controls and colors.

## Comparison history

1. Initial capture `implementation-target-size-v1.jpg`: P1 — condensed headline did not fit and was too short; P2 — hero and comparison spacing pushed proof below the target region. Fixed the display text's horizontal proportions, increased its height, reduced stage height and section padding. Hero artwork remains behind a semantic text layer.
2. `implementation-target-size-v2.jpg`: main proportions corrected. P2 — mobile header CTA wrapped and decorative microcopy overlapped the athlete. Shortened the mobile CTA and hid decorative labels on mobile. P2 — side-by-side screenshot crop exposed part of the marketing title; corrected the crop to the actual app frame.
3. Final source/capture comparison: lower feet were faded in the image asset and remain behind opaque HTML type; hero stage clips the artwork before the Japanese heading. No actionable P0/P1/P2 findings remain.

## Required fidelity surfaces

- Typography: tall condensed italic Barlow Condensed display, heavy Noto Sans JP subset for Japanese headings, system sans-serif for readable body/UI text. Large English words fit at the tested widths; mobile CTA stays on one line.
- Spacing/layout: black full-bleed poster composition, centered conversion area, asymmetric copy/product proof, cream brand divider and first-use section. Additional released-feature details, FAQ and real screenshot controls intentionally extend the original two-section concept into a complete page.
- Colors: near-black, white, cyan and orange preserve the selected direction. Cream sections add contrast lower on the page. Buttons and text use contrasting solid colors; motion respects reduced-motion CSS.
- Images: custom AI promotional athlete artwork, original official app icon, actual approved App Store assets. Imported Bootstrap Icons 1.13.1 are unmodified; no handcrafted icons or CSS imitation of app imagery. The artwork is not presented as pose-analysis output. UI and headings are real DOM elements.
- Copy: released iPhone comparison and delay features, explicit free-download/ads/IAP distinction, PRO caveat, no experimental 3D promises, no fake statistics, testimonials, dates or playable-video controls. Mock filler text and internal art-direction label were removed.

## Functional verification

- Browser: screenshot selector switches `aria-pressed`, image, alt text and explanation for overlay/side-by-side; FAQ expands; motion pause updates pressed state and label; navigation anchors work.
- All five download links resolve to the owner-issued X campaign when arriving with `?from=x`; default Apple-issued fallback URLs remain in HTML. No new tracking service or cookie code was added.
- DOM checks: no broken internal anchor targets or horizontal overflow at the tested viewports. Local resources exist. `node --check site.js` and `git diff --check` pass.
- Browser console: no error/warning entries in the tested local page.
- Support/privacy pages use their existing independent styling and retain their paths. Ownership verification, canonical, sitemap and app schema were preserved.

## Limits and follow-up polish

- Physical iPhone/Safari and Android devices were not operated. Reduced-motion and no-JavaScript fallbacks were inspected in code, not emulated as separate browser environments.
- The source's decorative playback bar was replaced with an actual scroll link and optional motion toggle, because the hero is artwork rather than a playable video.
- P3: generated-image details and type rasterization vary by device. The approved direction is implemented, not a claim of pixel identity or a limit on future design work.
- Download attribution, index rankings and conversion improvements require subsequent live analytics; visual QA does not establish these outcomes.

## Sport imagery update (2026-11-13)

- User requested sport-specific imagery within the existing design. Added a coherent set for golf, baseball, gymnastics, dance, tennis and soccer. The latter two extend the previously textual six-sport introduction into image links.
- Built-in ImageGen produced the photographs using the current hero's cyan/orange/near-black palette as the art reference. These illustrate use cases; they are not customer images or analysis results. The gymnastics subject is a straight handstand, with the whole body visible.
- Desktop layout: three image links per row; tablet: two; phone: one. Images preserve the generated 3:2 frame without cropping, and titles/body text remain real accessible HTML. The whole image-and-text area links to the relevant existing feature section.
- Asset delivery: 960px and 480px JPEGs with responsive srcset, lazy loading, async decode and explicit width/height. All six 960px files total 452,451 bytes; all six 480px files total 144,627 bytes.
- Browser evidence: `../../outputs/ghostform-sports-images/sports-section-preview.jpg` (complete desktop section), `desktop-preview.jpg` and `mobile-preview.jpg`. Six images loaded at 1440px; no horizontal overflow at 390px or 320px. Actual dance and tennis links reached #delay and #compare. No browser warning/error entries were observed.
- The existing hero, product screenshots, ownership tag, privacy/support pages and Japanese App Store campaign destinations were preserved. The previous selected mock remains the visual reference for the overall page; the sport section's photo layout is the user's subsequent requested change.
- Physical phone operation and acquisition/conversion uplift remain unverified. No actionable layout or interaction findings remain from this focused check.
## 2026-11-13: first viewport and image delivery

- Kept the selected athlete, cyan/orange palette, oversized lettering, and foreground text hiding the legs.
- At 1440×900 and 1280×800, the Japanese product description and full primary download button are visible without scrolling. Primary button bottom: 832px and 725px respectively.
- Checked 390×844 and 320×740 as well; no horizontal page overflow. The existing mobile layout stays intact.
- JPEG quality 90 preserves the 1536×1024 composition: 171,500 bytes versus the previous PNG's 1,739,330 bytes (90.1% fewer image bytes). This is a byte reduction, not a measured real-network speed claim. The original PNG remains for recovery.
- Screenshots and profile-link verification are stored outside the public repository in `outputs/ghostform-growth-execution/`.
