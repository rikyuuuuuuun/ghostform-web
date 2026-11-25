import { readFileSync, writeFileSync } from 'node:fs';

// The English page contains the verified markets, store destinations and observed prices.
// Mirror only its market cards. Each landing page keeps its own copy and works without JS.
const english = new URL('../en/index.html', import.meta.url);
const block = /(<!-- Start of verified storefronts -->\n)([\s\S]*?)([ \t]*<!-- End of verified storefronts -->)/;
const readPage = url => readFileSync(url, 'utf8').replace(/\r\n/g, '\n');
const verified = readPage(english).match(block);
if (!verified) throw new Error('English storefront markers missing');
const cardPattern = /^[ \t]*<section class="market" id="([A-Z]{2})"[\s\S]*?<\/section>$/gm;
const cards = Array.from(verified[2].matchAll(cardPattern));
if (!cards.length || verified[2].replace(cardPattern, '').trim()) throw new Error('Unexpected market card format');
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const translations = [
  { dir:'es', locale:'es-419', apple:'es-MX', play:'es_419', noPrice:'Consulta el precio de PRO en la app', usStore:'App Store de Estados Unidos' },
  { dir:'fr', locale:'fr-CA', apple:'fr-CA', play:'fr_CA', noPrice:'Prix de PRO dans l’application', usStore:'App Store des États-Unis' },
];

for (const lang of translations) {
  const countries = new Intl.DisplayNames([lang.locale], {type:'region'});
  const order = new Intl.Collator(lang.locale);
  const localized = cards.map(([html, code]) => {
    const name = countries.of(code);
    const output = html
      .replace(/(<h3[^>]*>)[^<]+(<\/h3>)/, (_, start, end) => start + escapeHtml(name) + end)
      .replace(/href="(https:\/\/apps\.apple\.com\/[^"]+)"/g, (_, href) => {
        const url = new URL(href.replaceAll('&amp;', '&'));
        url.searchParams.set('l', lang.apple);
        return 'href="' + escapeHtml(url.href) + '"';
      })
      .replaceAll('hl=en&amp;gl=', 'hl=' + lang.play + '&amp;gl=')
      .replaceAll('U.S. App Store', lang.usStore)
      .replace(/(<small data-currency="([A-Z]{3})" data-amount="(\d+(?:\.\d+)?)">)PRO [^<]+/g, (_, start, currency, amount) => {
        const format = new Intl.NumberFormat(lang.locale, {style:'currency', currency, currencyDisplay:'code'});
        return start + 'PRO ' + format.format(Number(amount));
      })
      .replaceAll('See PRO price in app', lang.noPrice);
    return {name, output};
  }).sort((a,b) => order.compare(a.name, b.name)).map(card => card.output);
  const page = new URL('../' + lang.dir + '/index.html', import.meta.url);
  const original = readPage(page);
  if (!block.test(original)) throw new Error('Missing storefront markers in ' + lang.dir);
  const rendered = original.replace(block, (_, start, content, end) => start + localized.join('\n') + '\n' + end);
  if (rendered === original) continue;
  if (process.argv.includes('--check')) throw new Error('Refresh storefronts for ' + lang.dir);
  writeFileSync(page, rendered);
}
