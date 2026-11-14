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
# Feature films and practice use cases — 2026-11-13

- Both features now follow introduction → 30-second product/use-case film → concrete practice steps → four image-led sport uses. On narrow screens the film follows the introduction so its play button appears sooner. Desktop keeps copy and film side by side.
- Delay: the existing verified three-second replay film, with a single movement returning about three seconds later. Comparison: a new 30-second edit of the genuine browser comparison operation followed by golf/baseball/gymnastics/dance examples. Reused campaign images and new delay-practice images are labelled as AI-generated illustrations.
- Web media: 720×1280 H.264/AAC, fast-start, approximately 1.25 MB for comparison and 1.77 MB for delay. Both full-decode checks passed. No autoplay or initial media preload; native inline controls and a direct MP4 fallback remain available. Source verification preserves store campaigns, canonical URL, Search Console verification, support and privacy pages.
- CUA browser checks: 320×740, 390×844, 844×390 and 1440×1000 viewports. No horizontal overflow in the feature or sport blocks. The browser's desktop scrollbar subtracts 15 CSS pixels from the layout width; these are responsive browser checks, not physical iPhone tests.
- Actual playback: comparison advanced beyond 15 seconds without a media error; starting delay paused comparison and began delay normally. Screenshot tabs, native FAQ expansion and all four delay-practice images were also checked. New feature page had no console errors.
- Evidence outside the public repo: `../../outputs/ghostform-feature-site/` contains source/media/browser reports and screenshots. `../../outputs/ghostform-live-demos/compare-v2/` contains the editable film, source provenance, review and audio measurements. Sound was measured, not listened to.
- The first mobile pass put the play button below the initial section viewport and broke a heading awkwardly. The DOM order and explicit mobile heading breaks were corrected before publication. Copy was shortened so sport cards remain easy to scan.

## Mobile journey audit and fixes — 2026-11-13

Current-run screenshots and reports: `../../outputs/ghostform-mobile-audit/`. The audit followed entry → comparison/delay films → sport use cases → first use → FAQ/download → support/privacy. Approved artwork, the real demo films and the existing cyan/orange direction remain the visual basis.

- Entry: the original first viewport had a clear download action, but small explanatory text and no mobile route directly to delay. Added a Japanese app label, a 15–16px two-line explanation and two explicit feature links. The primary action remains within the first viewport: bottom 597px at 320×740 and 816px at 1440×900.
- Films: portrait demos have tap-to-play, inline native controls, no autoplay and no preload. Added an accessible `dialog` for an enlarged view. The same video advanced from 13.65s before opening to 13.94s expanded and 22.27s after closing, without a media error. A browser-fullscreen variant produced unstable framing in the in-app browser and was replaced before publication. Native fullscreen is still available through video controls where supported.
- Conversion: the original main download action was around y=539px and the next content action around y=8973px at 390px. Added actions after both feature stories and a phone-only bar that hides around videos and the closing action. The bar link actually reached Ghostform's Japanese App Store listing. All eight download links used the issued X campaign when loaded with `?from=x`; this does not establish download attribution.
- Sport reading: retained every sport and photograph, with two columns on phones. At 390px the six-sport section reduced from roughly 2940px to 1434px despite larger copy. Practice body copy increased from 12px to 14px. FAQ questions increased from 13px to 16px, answers from 12px to 15px. Footer links have 44px touch heights. Necessary explanatory sentences keep punctuation; headings and short feature copy omit unnecessary `。`.
- Auxiliary pages: inspected support and privacy on the current public site. Support already has a readable layout and home link. Privacy lacked a return path; added a 44px home link and long-link wrapping, without changing policy text.
- Local verification: 320×740, 390×844, 844×390, 1440×900. No horizontal page overflow in these checks. At 320px, corrected a download label breaking onto a final single character. Opening/closing the video dialog, the FAQ, direct feature anchors, privacy return path, the bar's hide/show conditions and video mutual pause were exercised. Source checks preserve ownership, canonical/schema, campaign tokens, support and sitemap; local references and JavaScript syntax pass.
- Limits: these are desktop-browser viewport and playback checks, not physical iPhone/Safari, screen-reader or full WCAG certification. No acquisition/conversion uplift, search-ranking improvement or actual download attribution is claimed. The App Store emitted a client-logger warning; no local-site console error was observed.

## Approved Unslop polish — 2026-11-14

Source: [unslop](https://github.com/heydamir/unslop/blob/main/skills/unslop/SKILL.md), by Damir Sokolovsky (@heydamir), CC BY 4.0. Used the developer original, not an OpenAI-provided skill. Audit, source snapshot, measurements and screenshots: `../../outputs/ghostform-unslop-2026-11-14/`. User approved implementation and publication before editing.

Direction: strong, straightforward practice review. Preserve the female athlete hero, every sport photograph, black/cyan/orange, display headings and section order. No image regeneration was needed; the product recordings supply more useful poster imagery.

The nine passes were applied in order:
1. Spacing: normalized scoped card padding, feature gaps and label clearance.
2. Color: grouped supporting text into secondary/muted roles; retained accents and inverse colors.
3. Icons: downward arrows for in-page anchors; external/store diagonal arrows retained.
4. Copy: shortened comparison/delay steps and six-sport descriptions; rewrote the joined desktop delay heading. Short labels omit unnecessary Japanese full stops.
5. Type: retained display fonts; reduced auxiliary tracking/capitalization and limited UI weight variation.
6. Layout: moved film play buttons below the operation image, above native controls; retained mobile/desktop order and all sport images.
7. Details: 12px mobile-bar disclosure, safe-area clearance and existing focus/native-control behavior retained.
8. Visuals: real operation frames plus editable HTML headings until playback, without generating app UI.
9. Motion: removed the repeating hero drift and its redundant pause control; kept only brief interaction feedback.

Local CUA checks: 320×740, 390×844, 844×390 and 1440×900. No horizontal page overflow. Poster headings fit their header areas at 320px and PC widths; the operation image remains unobstructed. Phone bar disclosure is 12px and the bar hides around video / short landscape. Comparison playback advanced normally; opening/closing the dialog retained the same video (two total players) and playback time, returning focus to the opener. Starting delay paused comparison and hid its poster heading. FAQ expansion and screenshot selection worked. No local-site console errors were observed. Source checks pass for references, unique IDs, JS syntax, ownership, canonical/schema, issued campaign tokens, support/privacy/sitemap, eight practice cards, inline videos and absence of autoplay/preload.

Preservation: original hero/sport/practice images and MP4s are unchanged from dde0015; store-links.js, support.html, privacy.html and sitemap.xml are unchanged. Browser demo feasibility was inspected read-only; no public web-app trial or native/3D change is included.

External limit on this run: actual default and X-campaign clicks reached Apple's Japanese storefront; the X link redirected to the Ghostform product slug with the issued campaign/provider tokens. Apple rendered “エラーが発生しました。” in this browser, so successful product-page rendering and download completion are not confirmed for this run. Do not replace the already-issued Japanese links based on that response. Physical iPhone/Safari and acquisition uplift are unverified.

## Browser sample trial — 2026-11-14

User authorized implementation and official-site publication. Added a distinct hands-on entry in the hero and comparison introduction; preserved existing art, films, feature order and native-app repositories. The trial uses the app's dark interface direction, cyan/orange teacher/student labels, central play button, flanking frame steps, native range inputs and the same opacity weighting.

- Real sample motion is supplied as 108 predecoded 24fps frames in three JPEG sheets (1.27MB total), with teacher/student separated by 12 source frames. Page uses no video seeks for stepping; each control renders the selected frame directly. User-facing provenance discloses the same-source time shift.
- Local browser widths: 320×740, 390×844, 844×390 and 1440×1000. Core sliders fit the initial portrait view at 320/390; landscape places image and controls side by side. A clipped 320px transport control was found and corrected; bounds checks then found no clipped controls or horizontal page overflow.
- Exercised opacity endpoints and both-zero hint, visually checked actual single/overlaid images, single forward/back steps, 20 consecutive steps, first/last frame limits, playback/pause, hold/release, keyboard step, split mode and reset. The same-image canvas renderer does not use native seek operations.
- An intentionally failed sample-sheet HTTP503 showed stable failure copy, disabled controls, retry and a film fallback. Retry restored enabled controls and frame36. This failure injection exists only in a local server helper, not the published app.
- Existing X campaign was preserved from homepage → trial → actual download click. Apple redirected to the Japanese Ghostform slug and rendered the Ghostform product title in this run. This confirms destination rendering, not a completed download or Apple attribution.
- Node: 11 passing tests, zero failures, covering exact frame rules, all sheet bounds, app opacity math, aspect ratio and issued campaign routing. Physical iPhone/Safari and Android tests remain unverified. No claim of measured mobile latency or acquisition uplift.
- Evidence: `../../outputs/ghostform-browser-trial/`. Implementation and media details: `docs/browser-trial.md`.
