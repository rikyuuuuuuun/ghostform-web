// Preserve owner-issued Apple tokens and explicitly select the Japanese web storefront.
// The regionless /app/apple-store/ URL showed a US not-found page in web browsers.
// No analytics SDK or cookies.
const ghostformStoreLinks = {
  default: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_web_202611&mt=8',
  x: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_x_202611&mt=8',
  instagram: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_ig_202611&mt=8',
  tiktok: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_tt_202611&mt=8',
  note: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_note_202611&mt=8',
  coach: 'https://apps.apple.com/jp/app/id6831656347?pt=129755185&ct=gf_coach_202611&mt=8'
};
const ghostformSource = new URLSearchParams(location.search).get('from');
const ghostformDestination = Object.hasOwn(ghostformStoreLinks, ghostformSource)
  ? ghostformStoreLinks[ghostformSource] : ghostformStoreLinks.default;
document.querySelectorAll('[data-store-link]').forEach(link => { link.href = ghostformDestination; });

// Keep an existing campaign when entering the browser trial or returning home.
// Accept only known source names; do not carry arbitrary query parameters.
if (Object.hasOwn(ghostformStoreLinks, ghostformSource)) {
  document.querySelectorAll('[data-site-link]').forEach(link => {
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin) return;
    destination.searchParams.set('from', ghostformSource);
    link.href = destination.href;
  });
}
