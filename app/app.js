// Tanah & Tetangga — routing, the two maps, ranking, profiles, compare
// and the full table. All figures come from data.js; nothing here is
// fetched from anywhere.
import { REGIONS, NATIONAL, AGE_BANDS, EDUCATION, SERVICES, LABOUR, ECONOMY, SOURCES } from './data.js';
import { renderGeoMap, renderCartoMap, regionBySlug } from './maps.js';
import { hbar, pairBars, regionBars } from './charts.js';

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString('en-US');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

let selectedSlug = 'khomas';
let rankMode = 'count';

// ---------- maps ----------
function renderMaps() {
  $('map-geo').innerHTML = renderGeoMap(selectedSlug);
  $('map-carto').innerHTML = renderCartoMap(selectedSlug);
}

function selectRegion(slug) {
  const r = regionBySlug(slug);
  if (!r) return;
  selectedSlug = slug;
  renderMaps();
  renderSelectedCard();
  const sel = $('region-select');
  if (sel) sel.value = slug;
  renderProfile();
}

function renderSelectedCard() {
  const r = regionBySlug(selectedSlug);
  const rank = REGIONS.findIndex((x) => x.slug === selectedSlug) + 1;
  $('selected-card').innerHTML = `
    <h3><a href="#/wilayah/${r.slug}">${esc(r.name)}</a> — capital ${esc(r.capital)}</h3>
    <p class="sel-sub">Region ${rank} of 14 by population. Tap any region on either map to read it here.</p>
    <div class="sel-grid">
      <div><b>${fmt(r.population)}</b><span>people (${r.sharePct.toFixed(1)}% of Namibia)</span></div>
      <div><b>${fmt(r.households)}</b><span>households, ${r.householdSize.toFixed(1)} people each</span></div>
      <div><b>+${r.growth.toFixed(1)}%</b><span>growth since 2011</span></div>
      <div><b>${fmt(r.areaKm2)} km²</b><span>of land</span></div>
      <div><b>${r.density.toFixed(1)} /km²</b><span>against 3.7 nationally</span></div>
      <div><b>${r.density > NATIONAL.density ? 'Crowded' : 'Empty'}</b><span>${r.density > NATIONAL.density ? 'denser than the country as a whole' : 'emptier than the country as a whole'}</span></div>
    </div>`;
}

// ---------- ranking ----------
function renderRanking() {
  $('ranking').innerHTML = regionBars(REGIONS, rankMode);
}

// ---------- section charts ----------
function renderSectionCharts() {
  $('age-bars').innerHTML = AGE_BANDS.map((b) =>
    hbar(b.label, `${b.pct.toFixed(1)}% — ${b.note}`, b.pct, b.label.startsWith('15')),
  ).join('');
  $('edu-bars').innerHTML = pairBars(
    'Never attended school, people aged 6 and over',
    'Towns', `${EDUCATION.neverSchooledUrbanPct.toFixed(1)}%`,
    EDUCATION.neverSchooledUrbanPct,
    'Rural areas', `${EDUCATION.neverSchooledRuralPct.toFixed(1)}%`,
    EDUCATION.neverSchooledRuralPct,
  );
  $('services-bars').innerHTML =
    pairBars('Safe drinking water, households', '2023', `${SERVICES.safeWaterPct.toFixed(1)}%`, SERVICES.safeWaterPct, '2011', `${SERVICES.safeWater2011Pct.toFixed(1)}%`, SERVICES.safeWater2011Pct)
    + pairBars('Homes with no toilet', 'Rural areas', `${SERVICES.noToiletRuralPct}%`, SERVICES.noToiletRuralPct, 'Towns', `${SERVICES.noToiletUrbanPct}%`, SERVICES.noToiletUrbanPct)
    + hbar('Electricity access, all homes', `${SERVICES.electricityAccessPct.toFixed(1)}%`, SERVICES.electricityAccessPct, false);
  $('labour-bars').innerHTML =
    hbar('Unemployed, strict (looking for work)', `${LABOUR.unemploymentStrictPct.toFixed(1)}%`, LABOUR.unemploymentStrictPct, true)
    + hbar('Unemployed, broad (incl. discouraged)', `${LABOUR.unemploymentBroadPct.toFixed(1)}%`, LABOUR.unemploymentBroadPct, false)
    + hbar('Youth unemployed', `${LABOUR.youthUnemploymentPct.toFixed(1)}%`, LABOUR.youthUnemploymentPct, true)
    + pairBars('Unemployment by sex', 'Women', `${LABOUR.womenUnemploymentPct.toFixed(1)}%`, LABOUR.womenUnemploymentPct, 'Men', `${LABOUR.menUnemploymentPct.toFixed(1)}%`, LABOUR.menUnemploymentPct);
  $('sector-bars').innerHTML = ECONOMY.sectors.map((s) =>
    hbar(s.label, `${s.pct.toFixed(1)}%`, s.pct, s.label.startsWith('Tertiary')),
  ).join('');
}

// ---------- region profile ----------
function fillSelect(sel, selected) {
  sel.innerHTML = REGIONS.map((r) =>
    `<option value="${r.slug}"${r.slug === selected ? ' selected' : ''}>${esc(r.name)} — ${fmt(r.population)}</option>`,
  ).join('');
}

function renderProfile() {
  const r = regionBySlug(selectedSlug);
  const rank = REGIONS.findIndex((x) => x.slug === selectedSlug) + 1;
  const toilet = r.noToiletPct
    ? `<div><b>${r.noToiletPct}%</b><span>of homes have no toilet — among the highest in the country</span></div>` : '';
  $('profile').innerHTML = `
    <h3>${esc(r.name)}</h3>
    <p class="prof-sub">Capital ${esc(r.capital)} · region ${rank} of 14 by population</p>
    <div class="prof-grid">
      <div><b>${fmt(r.population)}</b><span>people — ${r.sharePct.toFixed(1)}% of Namibia</span></div>
      <div><b>${fmt(r.households)}</b><span>households</span></div>
      <div><b>${r.householdSize.toFixed(1)}</b><span>people per household (national 3.8)</span></div>
      <div><b>+${r.growth.toFixed(1)}%</b><span>growth since the 2011 census</span></div>
      <div><b>${fmt(r.areaKm2)} km²</b><span>of land</span></div>
      <div><b>${r.density.toFixed(1)} /km²</b><span>people per square kilometre (national 3.7)</span></div>
      ${toilet}
    </div>
    <p class="note">Read ${esc(r.name)} against the country: it holds ${r.sharePct.toFixed(1)}% of
    the people on ${((r.areaKm2 / NATIONAL.areaKm2) * 100).toFixed(1)}% of the land.
    ${r.density > NATIONAL.density
      ? 'That makes it denser than Namibia as a whole — services reach more people per kilometre of road.'
      : 'That makes it emptier than Namibia as a whole — services must travel further for fewer people.'}</p>`;
}

// ---------- compare ----------
const CMP_ROWS = [
  { label: 'Population', get: (r) => r.population, fmt: (v) => fmt(v), diff: (a, b) => `${a > b ? '+' : ''}${fmt(a - b)} people` },
  { label: 'Share of the country', get: (r) => r.sharePct, fmt: (v) => `${v.toFixed(1)}%`, diff: (a, b) => `${a > b ? '+' : ''}${(a - b).toFixed(1)} points` },
  { label: 'Households', get: (r) => r.households, fmt: (v) => fmt(v), diff: (a, b) => `${a > b ? '+' : ''}${fmt(a - b)} homes` },
  { label: 'People per household', get: (r) => r.householdSize, fmt: (v) => v.toFixed(1), diff: (a, b) => `${a > b ? '+' : ''}${(a - b).toFixed(1)} people` },
  { label: 'Growth since 2011', get: (r) => r.growth, fmt: (v) => `+${v.toFixed(1)}%`, diff: (a, b) => `${a > b ? '+' : ''}${(a - b).toFixed(1)} points` },
  { label: 'Land area', get: (r) => r.areaKm2, fmt: (v) => `${fmt(v)} km²`, diff: (a, b) => `${a > b ? '+' : ''}${fmt(a - b)} km²` },
  { label: 'People per km²', get: (r) => r.density, fmt: (v) => v.toFixed(1), diff: (a, b) => `${a > b ? '+' : ''}${(a - b).toFixed(1)} /km²` },
];

function renderCompare() {
  const a = regionBySlug($('cmp-a').value);
  const b = regionBySlug($('cmp-b').value);
  const rows = CMP_ROWS.map((row) => {
    const av = row.get(a);
    const bv = row.get(b);
    const cls = av > bv ? 'diff-pos' : av < bv ? 'diff-neg' : '';
    return `<tr><td>${row.label}</td><td>${row.fmt(av)}</td><td>${row.fmt(bv)}</td><td class="${cls}">${row.diff(av, bv)}</td></tr>`;
  }).join('');
  $('compare-table').innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>Indicator</th><th>${esc(a.name)}</th><th>${esc(b.name)}</th><th>Difference (A − B)</th></tr></thead>
    <tbody>${rows}</tbody></table></div>`;
}

// ---------- full table ----------
let sortKey = 'population';
let sortDir = -1;
const COLS = [
  { key: 'name', label: 'Region', get: (r) => r.name },
  { key: 'population', label: 'Population', get: (r) => r.population, fmt: (v) => fmt(v) },
  { key: 'sharePct', label: 'Share %', get: (r) => r.sharePct, fmt: (v) => v.toFixed(1) },
  { key: 'households', label: 'Households', get: (r) => r.households, fmt: (v) => fmt(v) },
  { key: 'householdSize', label: 'Per home', get: (r) => r.householdSize, fmt: (v) => v.toFixed(1) },
  { key: 'growth', label: 'Growth %', get: (r) => r.growth, fmt: (v) => `+${v.toFixed(1)}` },
  { key: 'areaKm2', label: 'Area km²', get: (r) => r.areaKm2, fmt: (v) => fmt(v) },
  { key: 'density', label: 'Per km²', get: (r) => r.density, fmt: (v) => v.toFixed(1) },
];

function renderFullTable() {
  const rows = [...REGIONS].sort((a, b) => {
    const av = COLS.find((c) => c.key === sortKey).get(a);
    const bv = COLS.find((c) => c.key === sortKey).get(b);
    return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
  });
  const head = COLS.map((c) =>
    `<th data-sort="${c.key}">${c.label}${c.key === sortKey ? (sortDir === -1 ? ' ↓' : ' ↑') : ''}</th>`,
  ).join('');
  const body = rows.map((r) => `<tr>${COLS.map((c, i) =>
    (i === 0
      ? `<td><a href="#/wilayah/${r.slug}">${esc(c.get(r))}</a></td>`
      : `<td>${c.fmt ? c.fmt(c.get(r)) : c.get(r)}</td>`),
  ).join('')}</tr>`).join('');
  $('full-table').innerHTML = `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    <p class="note">Totals: ${fmt(NATIONAL.population)} people · ${fmt(NATIONAL.households)} households ·
    825,615 km². Shares are of the national population; growth is since the 2011 census.</p>`;
}

// ---------- router ----------
const PAGES = ['sebaran', 'umur', 'pendidikan', 'air', 'kerja', 'wilayah', 'banding', 'tabel'];

function route() {
  const hash = window.location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  let page = parts[0] || 'sebaran';
  if (!PAGES.includes(page)) page = 'sebaran';
  for (const p of PAGES) $('page-' + p).classList.toggle('hidden', p !== page);
  document.querySelectorAll('.mainnav a').forEach((a) =>
    a.classList.toggle('active', a.dataset.nav === page));
  if (page === 'wilayah' && parts[1] && regionBySlug(parts[1])) selectRegion(parts[1]);
  window.scrollTo(0, 0);
}

// ---------- wire up ----------
fillSelect($('region-select'), selectedSlug);
fillSelect($('cmp-a'), 'khomas');
fillSelect($('cmp-b'), 'kharas');
renderMaps();
renderSelectedCard();
renderRanking();
renderSectionCharts();
renderProfile();
renderCompare();
$('sources').innerHTML = SOURCES.map((s) => `<li>${esc(s)}</li>`).join('');
renderFullTable();

document.addEventListener('click', (e) => {
  const regionEl = e.target.closest('[data-region]');
  if (regionEl) {
    selectRegion(regionEl.dataset.region);
    return;
  }
  const th = e.target.closest('th[data-sort]');
  if (th) {
    const key = th.dataset.sort;
    if (sortKey === key) sortDir = -sortDir;
    else { sortKey = key; sortDir = key === 'name' ? 1 : -1; }
    renderFullTable();
  }
});
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-region]')) {
    e.preventDefault();
    selectRegion(e.target.dataset.region);
  }
});
$('map-geo').addEventListener('click', (e) => {
  const el = e.target.closest('[data-region]');
  if (el) selectRegion(el.dataset.region);
});
$('map-carto').addEventListener('click', (e) => {
  const el = e.target.closest('[data-region]');
  if (el) selectRegion(el.dataset.region);
});

$('btn-geo').addEventListener('click', () => setMapLead('geo'));
$('btn-carto').addEventListener('click', () => setMapLead('carto'));
// The two maps always sit side by side on a desktop. The toggle picks
// which one leads: it moves first and takes the terracotta frame. On a
// phone the toggle picks which map is shown at all.
function setMapLead(view) {
  $('maps').dataset.lead = view;
  $('panel-geo').classList.toggle('featured', view === 'geo');
  $('panel-carto').classList.toggle('featured', view === 'carto');
  $('panel-geo').style.order = view === 'geo' ? '0' : '1';
  $('panel-carto').style.order = view === 'carto' ? '0' : '1';
  $('btn-geo').classList.toggle('active', view === 'geo');
  $('btn-carto').classList.toggle('active', view === 'carto');
  $('btn-geo').setAttribute('aria-pressed', String(view === 'geo'));
  $('btn-carto').setAttribute('aria-pressed', String(view === 'carto'));
}

$('btn-abs').addEventListener('click', () => setRankMode('count'));
$('btn-pct').addEventListener('click', () => setRankMode('share'));
function setRankMode(mode) {
  rankMode = mode;
  renderRanking();
  $('btn-abs').classList.toggle('active', mode === 'count');
  $('btn-pct').classList.toggle('active', mode === 'share');
  $('btn-abs').setAttribute('aria-pressed', String(mode === 'count'));
  $('btn-pct').setAttribute('aria-pressed', String(mode === 'share'));
}

$('region-select').addEventListener('change', (e) => selectRegion(e.target.value));
$('cmp-a').addEventListener('change', renderCompare);
$('cmp-b').addEventListener('change', renderCompare);

window.addEventListener('hashchange', route);
route();
