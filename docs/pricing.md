# Website pricing section

The user requested the section between First comparison and Before you start, an updated free-plan FAQ and a header link on 2026-11-14. Retain the existing dark/cyan/orange campaign direction and show free use before the optional PRO upgrade.

## Confirmed basis

- Japanese public App Store product ID 6831656347 showed **Ghostform PRO ¥680** in the expanded In-App Purchases list on 2026-11-14. The page also showed version 1.5. The date is displayed beside the website offer; the app's current purchase screen remains authoritative.
- Native app main at `22a4671cb23af24eb61c5f194959de9c867a402c`, `www/index.html`, defines free/pro limits in `PLAN_LIMITS` and describes the same limits in the PRO comparison table.
- Free: history **3**, 720p exports **3 per day**, automatic alignment **3 per day**, delay up to **10 seconds**, freehand drawing. Comparison, skeleton, slow playback and frame stepping are available. Slow-motion export is distinct from slow playback.
- PRO: history **100**, 1080p export without a daily count limit, delay up to **60 seconds**, no ads/logo, straight-line angle/circle/rectangle tools and camera level. A non-consumable one-time in-app purchase; not a subscription.
- The source deliberately makes **no normal-price claim** because PRO has not previously sold at another price. Do not add a crossed-out ¥1,280 or an invented sale end date. Public launch-price wording must be rechecked when the purchase price changes.

The supplied draft's free history count of five and reference normal price of ¥1,280 were corrected. The website does not change app pricing or limits.

## Links and layout

Every plan button is an existing Japanese App Store destination with `data-store-link` and the issued provider/campaign tokens. It opens the listing, not an in-app purchase screen. The PRO card therefore describes downloading the iPhone app and purchasing inside it, rather than promising a direct purchase on this website.

The header adds #pricing. At 900px and below its four navigation links occupy a second row; touch targets remain at least 44px. Plans are stacked on phones, side by side above 760px. Existing smooth scrolling and reduced-motion rules are reused. The floating phone download bar hides while either pricing CTA is in view.

Verify 320px/390px portrait, 844px landscape and 1440px desktop, actual header/FAQ navigation, the pricing CTA's App Store destination and source campaign preservation. Use `gf_qa=1` for browser checks. Evidence stays outside this public repository in `../../outputs/ghostform-pricing/`. Physical iPhone/Safari remains a separate check.

## Free-first positioning — 2026-11-14

The user's follow-up applies the pricing advantage across the homepage: free core functions in the hero and feature stories; optional, non-subscription PRO in the hero, pricing, FAQ and closing; the verified ¥680 launch offer inside pricing. The free-plan download action is visually primary. Three practice situations explain when the optional upgrade helps: a longer delay before returning to the display, clean high-resolution sharing, and retaining more comparisons. No purchase, app limit, store metadata or advertising configuration is changed.

Keep the approved unslop direction: a tool for athletes and coaches to inspect their movements; focused, energetic, practical; the practice floor and video timeline; the existing athlete visual and real operation demos as the rich moments; cyan/orange as the two comparison layers. No new artwork, urgency badges, countdowns or section reordering is needed for the pricing message.

The supplied competitive report is a research lead, not publication-ready evidence. Onform's current public description includes overlay comparison and skeleton/3D tools; Skill Cam's developer announcement describes both comparison and delay replay. A generic table stating that comparison apps cannot replay or delay apps cannot compare would therefore mislead. Do not publish that table, the supplied historic competitor prices, or a blanket cloud-account requirement. Own-product facts are the basis of this page, without a market-wide exclusivity or lowest-price claim.

Primary references checked on 2026-11-14: [Onform on the Japanese App Store](https://apps.apple.com/jp/app/id1490334045) and [Skill Cam developer announcement](https://www.sportlight.jp/news/2026/08/13/skill-cam/). These support omitting the supplied generalization, not a numerical competitor-price comparison. Recheck any future named comparison against current primary plan details before publication.

Current-pass browser evidence is stored outside the public repo in `../../outputs/ghostform-pricing-value/`. QA clicks are excluded via `gf_qa=1`; a successful destination check does not establish conversion improvement or a download.

## Dated A/B/C comparison — 2026-11-14

The user explicitly requested a real app comparison labeled A社/B社/C社 and dated as of today. `#app-comparison` now sits inside pricing after the optional-upgrade examples. The labels represent specific apps, not a claim about all competitors. Linked primary sources remain available in the expandable conditions panel.

| Label | Specific app / public Japan listing | Published paid-plan examples |
| --- | --- | --- |
| A社 | Onform, ID 1490334045 | Individual Standard Monthly ¥1,500; Individual Premium Monthly ¥2,500 |
| B社 | Skill Cam, ID 6788213774 | 月額プラン ¥400; 年額プラン ¥4,000 |
| C社 | Video Delay Instant Replay, ID 1135528824 | Monthly ¥1,100; Yearly ¥3,500 and ¥9,000 |

These are selected listed products, not an assertion of each app's minimum available price or equivalent plans. A's listing also contains legacy Personal entries; do not call ¥1,500 its absolute minimum. A's current developer pricing page defines 2D skeleton tracking in Individual Standard and golf 3D in Premium; Standard/Pro-coached athletes have free-use conditions. It also offers a 14-day trial. B's public listing/developer announcement supports overlay/split, delayed capture and annotation/export. C's current listing supports split display, delay, sport-specific on-device AI, external cameras and multiple viewing directions. Do not repeat the supplied report's outdated claim that C has no comparison/AI. Expanding the live App Store list also revealed a ¥3,500 Yearly entry beyond the initial list; both base Yearly examples are retained, alongside the note that weekly/free-trial pricing differs.

For A's delay and B's AI, the table says the checked official description does not mention them. Missing documentation is not proof of non-support. All functionality rows describe documented availability across applicable tiers, not blanket free availability. No competitor app installation, inference-accuracy benchmark, account/mandatory-cloud claim or lifetime cost estimate was performed. Long buffer capacity is not the same as the delay setting; do not advertise C's possible 30-minute buffer as its guaranteed delay.

The date is a fixed `<time datetime="2026-11-14">`, not a daily clock that would falsely imply a fresh check. When updating, recheck all displayed prices, product names and feature descriptions before advancing the date. Retain the purchase-screen-authoritative and plan/device-condition notes.

`comparison.js` progressively enhances the table at phone widths: Ghostform stays beside the selected A/B/C column, with ordinary labeled buttons and `aria-pressed`. Desktop shows all apps. With JS unavailable, all data remains in the horizontally scrollable table; no essential content is script-generated. Source links for competitors deliberately omit `data-store-link`, so the existing campaign resolver and Ghostform-only store-click measurement do not rewrite/count them as Ghostform downloads. The Ghostform source link retains its issued campaign tokens.

Verify A/B/C switching and keyboard activation at 320/390px, all columns above 760px, the no-JS fallback and source disclosure. Source/browser evidence stays outside the public repo in `../../outputs/ghostform-app-comparison/`.
