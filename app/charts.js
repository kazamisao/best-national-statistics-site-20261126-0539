// Small chart builders. Every chart is plain HTML bars, not canvas, so
// it renders the same in a screenshot as it does on the page and needs
// no JavaScript library at all.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// One horizontal bar: a label, a filled track and the value at the end.
export function hbar(label, valueText, pctOfMax, accent) {
  const pct = Math.max(0, Math.min(100, pctOfMax));
  return `<div class="hbar"><span class="hbar-label">${esc(label)}</span>
    <span class="hbar-track"><span class="hbar-fill${accent ? ' accent' : ''}" style="width:${pct.toFixed(1)}%"></span></span>
    <span class="hbar-value">${esc(valueText)}</span></div>`;
}

// Two bars side by side for one indicator, e.g. urban against rural.
export function pairBars(title, aLabel, aValue, aPct, bLabel, bValue, bPct) {
  return `<div class="pair"><h4>${esc(title)}</h4>
    ${hbar(aLabel, aValue, aPct, true)}
    ${hbar(bLabel, bValue, bPct, false)}
  </div>`;
}

// A ranking list of regions as bars. mode is 'count' (people) or 'share'
// (percent of the country); the toggle on the page switches between them.
export function regionBars(regions, mode) {
  const max = Math.max(...regions.map((r) => (mode === 'share' ? r.sharePct : r.population)));
  return regions.map((r) => {
    const v = mode === 'share' ? r.sharePct : r.population;
    const text = mode === 'share' ? `${r.sharePct.toFixed(1)}%` : v.toLocaleString('en-US');
    return `<a class="hbar region-row" href="#/wilayah/${r.slug}" data-region="${r.slug}">
      <span class="hbar-label">${esc(r.name)}</span>
      <span class="hbar-track"><span class="hbar-fill" style="width:${((v / max) * 100).toFixed(1)}%"></span></span>
      <span class="hbar-value">${text}</span></a>`;
  }).join('');
}
