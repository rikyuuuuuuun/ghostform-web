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
