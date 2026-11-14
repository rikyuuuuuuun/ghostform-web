// Readable phone comparison; without JS all companies remain in the scrollable table.
(() => {
  const section = document.querySelector('#app-comparison');
  if (!section) return;
  const controls = section.querySelector('.comparison-switch');
  const choices = [...section.querySelectorAll('[data-compare-company]')];
  if (!controls || choices.length !== 3) return;
  const select = company => {
    if (!['a', 'b', 'c'].includes(company)) return;
    section.dataset.selectedCompany = company;
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.compareCompany === company)));
  };
  select('a');
  choices.forEach(button => button.addEventListener('click', () => select(button.dataset.compareCompany)));
  section.classList.add('comparison-ready');
  controls.hidden = false;
})();
