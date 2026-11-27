// The two maps of Tanah & Tetangga: a schematic geographic map and a
// Dorling cartogram (one circle per region, sized by population).
// The geographic shapes are simplified on purpose — the page says so —
// but every region sits where it sits on the real map, and the circles
// sit in the same rough geography, so the two views can be compared.
import { REGIONS } from './data.js';

const bySlug = Object.fromEntries(REGIONS.map((r) => [r.slug, r]));

// Schematic polygons in a 1000 x 720 viewBox. Neighbours share edges so
// the map reads as one country; a sand silhouette sits underneath to
// hide any hairline gap between polygons.
export const GEO_POLYS = {
  kunene: { points: [[70, 80], [320, 80], [330, 200], [210, 270], [70, 270]], label: [185, 180] },
  omusati: { points: [[320, 80], [470, 80], [480, 180], [350, 200], [330, 200]], label: [400, 140] },
  ohangwena: { points: [[470, 80], [600, 80], [600, 150], [480, 180]], label: [535, 125] },
  oshana: { points: [[350, 200], [480, 180], [520, 270], [350, 270]], label: [432, 232] },
  oshikoto: { points: [[480, 180], [600, 150], [700, 150], [700, 270], [520, 270]], label: [600, 215] },
  'kavango-west': { points: [[600, 80], [700, 80], [700, 150], [600, 150]], label: [650, 112] },
  'kavango-east': { points: [[700, 80], [860, 80], [860, 150], [700, 150]], label: [780, 112] },
  zambezi: { points: [[860, 80], [988, 52], [988, 150], [860, 150]], label: [925, 105] },
  erongo: { points: [[70, 270], [210, 270], [250, 380], [200, 470], [70, 470]], label: [155, 365] },
  otjozondjupa: { points: [[210, 270], [520, 270], [520, 400], [380, 470], [250, 380]], label: [370, 335] },
  khomas: { points: [[200, 470], [250, 380], [380, 470], [400, 560], [250, 560]], label: [300, 475] },
  omaheke: { points: [[380, 470], [520, 400], [700, 400], [700, 560], [400, 560]], label: [555, 480] },
  hardap: { points: [[70, 470], [200, 470], [250, 560], [400, 560], [400, 640], [70, 640]], label: [235, 560] },
  kharas: { points: [[400, 560], [700, 560], [700, 640], [400, 640]], label: [550, 600] },
};

export const SILHOUETTE =
  'M70,80 L700,80 L700,58 L860,52 L988,52 L988,150 L860,150 L700,150 L700,640 L70,640 Z';

// Dorling cartogram: circles sized by the square root of population,
// placed in the same rough geography as the map above. Radius is set so
// the largest circle (Khomas) is 63 units across a 1000 x 720 viewBox.
export const CARTO = {
  khomas: { x: 330, y: 500, r: 63 },
  ohangwena: { x: 500, y: 110, r: 52 },
  omusati: { x: 360, y: 130, r: 51 },
  oshikoto: { x: 580, y: 220, r: 46 },
  erongo: { x: 150, y: 360, r: 44 },
  oshana: { x: 400, y: 230, r: 43 },
  otjozondjupa: { x: 380, y: 330, r: 42 },
  'kavango-east': { x: 790, y: 110, r: 42 },
  zambezi: { x: 920, y: 110, r: 34 },
  'kavango-west': { x: 660, y: 110, r: 32 },
  kunene: { x: 180, y: 160, r: 31 },
  kharas: { x: 560, y: 600, r: 30 },
  hardap: { x: 230, y: 580, r: 29 },
  omaheke: { x: 560, y: 480, r: 29 },
};

const fmt = (n) => n.toLocaleString('en-US');

// Five-step choropleth: pale sand where almost nobody lives, deep
// terracotta where people crowd together.
export function densityColor(d) {
  if (d < 1) return '#EFDDBE';
  if (d < 3) return '#E3C79B';
  if (d < 8) return '#D89A6A';
  if (d < 15) return '#C96F45';
  return '#BC563D';
}

function labelColor(d) {
  return d >= 8 ? '#FFF7EA' : '#422D40';
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function renderGeoMap(selectedSlug) {
  const polys = REGIONS.map((r) => {
    const g = GEO_POLYS[r.slug];
    const pts = g.points.map((p) => p.join(',')).join(' ');
    const sel = r.slug === selectedSlug;
    const [lx, ly] = g.label;
    return `<g class="region${sel ? ' selected' : ''}" data-region="${r.slug}" tabindex="0" role="button" aria-label="${esc(r.name)}: ${fmt(r.population)} people">
      <polygon points="${pts}" fill="${densityColor(r.density)}" stroke="#F6EDD8" stroke-width="2"/>
      <text x="${lx}" y="${ly - 3}" class="map-name" fill="${labelColor(r.density)}">${esc(r.name)}</text>
      <text x="${lx}" y="${ly + 17}" class="map-pop" fill="${labelColor(r.density)}">${fmt(r.population)}</text>
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 1000 720" role="img" aria-label="Schematic map of Namibia coloured by population density">
    <path d="${SILHOUETTE}" fill="#DCC79C"/>
    ${polys}
  </svg>`;
}

export function renderCartoMap(selectedSlug) {
  const circles = REGIONS.map((r) => {
    const c = CARTO[r.slug];
    const sel = r.slug === selectedSlug;
    const inside = c.r >= 38 && r.name.length <= 10;
    const name = inside
      ? `<text x="${c.x}" y="${c.y - 3}" class="map-name" fill="#FFF7EA">${esc(r.name)}</text>
         <text x="${c.x}" y="${c.y + 17}" class="map-pop" fill="#FFF7EA">${fmt(r.population)}</text>`
      : `<text x="${c.x}" y="${c.y + c.r + 21}" class="map-name" fill="#422D40">${esc(r.name)}</text>
         <text x="${c.x}" y="${c.y + c.r + 39}" class="map-pop" fill="#422D40">${fmt(r.population)}</text>`;
    return `<g class="region${sel ? ' selected' : ''}" data-region="${r.slug}" tabindex="0" role="button" aria-label="${esc(r.name)}: ${fmt(r.population)} people">
      <circle cx="${c.x}" cy="${c.y}" r="${c.r}" fill="#BC563D" fill-opacity="0.92" stroke="#F6EDD8" stroke-width="2"/>
      ${name}
    </g>`;
  }).join('');
  return `<svg viewBox="40 20 980 680" role="img" aria-label="Cartogram of Namibia: one circle per region, sized by population">
    ${circles}
  </svg>`;
}

export function regionBySlug(slug) {
  return bySlug[slug] || null;
}
