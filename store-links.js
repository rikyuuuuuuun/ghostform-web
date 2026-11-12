// Only owner-issued Apple campaign links belong here. No analytics SDK or cookies.
const ghostformStoreLinks = {
  default: 'https://apps.apple.com/jp/app/id6831656347'
};
const ghostformSource = new URLSearchParams(location.search).get('from');
const ghostformDestination = Object.hasOwn(ghostformStoreLinks, ghostformSource)
  ? ghostformStoreLinks[ghostformSource] : ghostformStoreLinks.default;
document.querySelectorAll('[data-store-link]').forEach(link => { link.href = ghostformDestination; });
