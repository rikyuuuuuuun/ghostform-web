// Only owner-issued Apple campaign links belong here. No analytics SDK or cookies.
const ghostformStoreLinks = {
  default: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_web_202611&mt=8',
  x: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_x_202611&mt=8',
  instagram: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_ig_202611&mt=8',
  tiktok: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_tt_202611&mt=8',
  note: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_note_202611&mt=8',
  coach: 'https://apps.apple.com/app/apple-store/id6831656347?pt=129755185&ct=gf_coach_202611&mt=8'
};
const ghostformSource = new URLSearchParams(location.search).get('from');
const ghostformDestination = Object.hasOwn(ghostformStoreLinks, ghostformSource)
  ? ghostformStoreLinks[ghostformSource] : ghostformStoreLinks.default;
document.querySelectorAll('[data-store-link]').forEach(link => { link.href = ghostformDestination; });
