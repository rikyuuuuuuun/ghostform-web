import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const script = readFileSync(new URL('../store-links.js', import.meta.url), 'utf8');
function resolve(source) {
  const store = {href:''};
  const internal = {href:'https://rikyuuuuuuun.github.io/ghostform-web/try/'};
  const external = {href:'https://example.com/'};
  vm.runInNewContext(script, {
    URL, URLSearchParams, Object,
    location: {href:'https://rikyuuuuuuun.github.io/ghostform-web/?from='+encodeURIComponent(source), origin:'https://rikyuuuuuuun.github.io', search:'?from='+encodeURIComponent(source)+'&unrelated=omit'},
    document: {querySelectorAll: selector => selector === '[data-store-link]' ? [store] : [internal,external]}
  });
  return {store:new URL(store.href),internal:new URL(internal.href),external:new URL(external.href)};
}
test('all existing source campaigns survive the trial route with the issued JP destination', () => {
  const tokens = {x:'gf_x_202611',instagram:'gf_ig_202611',tiktok:'gf_tt_202611',note:'gf_note_202611',coach:'gf_coach_202611'};
  for (const [source,token] of Object.entries(tokens)) {
    const r=resolve(source);
    assert.equal(r.store.pathname,'/jp/app/id6831656347');
    assert.equal(r.store.searchParams.get('ct'),token);
    assert.equal(r.store.searchParams.get('pt'),'129755185');
    assert.equal(r.store.searchParams.get('mt'),'8');
    assert.equal(r.internal.search,'?from='+source);
    assert.equal(r.external.search,'');
  }
});
test('unknown and inherited keys do not create a campaign or propagate arbitrary query data', () => {
  for (const source of ['unknown','constructor','__proto__','']) {
    const r=resolve(source);
    assert.equal(r.store.searchParams.get('ct'),'gf_web_202611');
    assert.equal(r.internal.search,'');
  }
});
