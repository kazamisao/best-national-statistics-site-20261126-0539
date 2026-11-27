// Tests for the Tanah & Tetangga site: data consistency first, then the
// wiring of the pages. Run with: node --test test/site.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { REGIONS, NATIONAL, AGE_BANDS, SERVICES, LABOUR, ECONOMY } from '../app/data.js';

const app = (p) => readFileSync(new URL(`../app/${p}`, import.meta.url), 'utf8');

test('regions: exactly the 14 regions of Namibia, each fully filled', () => {
  assert.equal(REGIONS.length, 14);
  for (const r of REGIONS) {
    for (const k of ['slug', 'name', 'capital', 'population', 'households', 'growth', 'areaKm2']) {
      assert.ok(r[k] !== undefined && r[k] !== null && r[k] !== '', `${r.slug} missing ${k}`);
    }
    assert.ok(r.population > 0 && r.households > 0 && r.areaKm2 > 0);
    assert.ok(r.growth > 0, `${r.slug} growth should be positive`);
  }
  const slugs = new Set(REGIONS.map((r) => r.slug));
  assert.equal(slugs.size, 14, 'region slugs must be unique');
});

test('regions: populations add up to the census total', () => {
  const pop = REGIONS.reduce((s, r) => s + r.population, 0);
  assert.equal(pop, 3022401);
  const hh = REGIONS.reduce((s, r) => s + r.households, 0);
  assert.equal(hh, 756339);
});

test('regions: shares add to ~100 and each share matches its population', () => {
  let total = 0;
  for (const r of REGIONS) {
    const share = (r.population / NATIONAL.population) * 100;
    assert.ok(Math.abs(share - r.sharePct) < 0.06, `${r.slug} share ${r.sharePct} vs computed ${share}`);
    total += r.sharePct;
  }
  assert.ok(Math.abs(total - 100) < 0.5, `shares sum ${total}`);
});

test('regions: density is population over area, household size over households', () => {
  for (const r of REGIONS) {
    const density = r.population / r.areaKm2;
    assert.ok(Math.abs(density - r.density) < 0.06, `${r.slug} density ${r.density} vs ${density}`);
    const hhSize = r.population / r.households;
    assert.ok(Math.abs(hhSize - r.householdSize) < 0.06, `${r.slug} hh size ${r.householdSize} vs ${hhSize}`);
  }
});

test('national figures are internally consistent', () => {
  assert.equal(NATIONAL.population, 3022401);
  assert.equal(NATIONAL.urban + NATIONAL.rural, NATIONAL.population);
  assert.equal(NATIONAL.female + NATIONAL.male, NATIONAL.population);
  assert.equal(NATIONAL.households, 756339);
  const ageSum = AGE_BANDS.reduce((s, b) => s + b.pct, 0);
  assert.ok(Math.abs(ageSum - 100) < 0.2, `age bands sum ${ageSum}`);
});

test('services: water and toilet figures agree with household counts', () => {
  // 91.4% of households have safe water; 40.0% have no toilet (302,385 homes)
  const noToilet = Math.round((SERVICES.noToiletPct / 100) * NATIONAL.households);
  assert.ok(Math.abs(noToilet - 302385) < 1500, `no-toilet homes ${noToilet}`);
  const noPower = SERVICES.noPowerRural + SERVICES.noPowerUrban;
  assert.ok(Math.abs(noPower - 306524) < 100, `households without power ${noPower}`);
});

test('labour: strict and broad rates bracket the same unemployed count', () => {
  assert.ok(LABOUR.unemployedStrict > 0);
  assert.ok(LABOUR.unemploymentStrictPct > LABOUR.unemploymentBroadPct - 25);
  assert.ok(LABOUR.unemploymentBroadPct > LABOUR.unemploymentStrictPct);
});

test('economy: sector shares add to 100', () => {
  const sum = ECONOMY.sectors.reduce((s, x) => s + x.pct, 0);
  assert.ok(Math.abs(sum - 100) < 0.2, `sector shares sum ${sum}`);
});

test('no placeholder or empty text anywhere in the app source', () => {
  for (const f of ['index.html', 'style.css', 'data.js', 'maps.js', 'charts.js', 'app.js']) {
    const src = app(f);
    for (const bad of ['TODO', 'FIXME', 'lorem', 'Lorem', 'placeholder', 'XXX', 'TBD']) {
      assert.ok(!src.includes(bad), `${f} contains ${bad}`);
    }
    assert.ok(!src.includes('http://') && !src.includes('https://'), `${f} must not name a network URL`);
  }
});

test('index.html loads only local files and names every section link', () => {
  const html = app('index.html');
  for (const sec of ['#/', '#/umur', '#/pendidikan', '#/air', '#/kerja', '#/wilayah', '#/banding', '#/tabel']) {
    assert.ok(html.includes(`href="${sec}"`), `nav missing ${sec}`);
  }
  assert.ok(html.includes('src="app.js"'), 'index.html does not load app.js');
  assert.ok(html.includes('href="style.css"'), 'index.html does not load style.css');
  const js = app('app.js');
  for (const f of ['./data.js', './maps.js', './charts.js']) {
    assert.ok(js.includes(f), `app.js does not import ${f}`);
  }
});

test('repo files the kit needs exist', () => {
  const root = (p) => new URL(`../${p}`, import.meta.url).pathname;
  for (const f of ['main.ts', 'LICENSE', 'README.md', 'vendor/makefun-frontend.ts', '.makefun/owner.json']) {
    assert.ok(existsSync(root(f)), `missing ${f}`);
  }
  const vendor = readFileSync(root('vendor/makefun-frontend.ts'), 'utf8');
  const kitVendor = readFileSync(
    '/home/hatch/workspace/makefun/kit-best-national-statistics-site-20261126-0539/best-national-statistics-site-20261126-0539-kit/starter/vendor/makefun-frontend.ts',
    'utf8',
  );
  assert.equal(vendor, kitVendor, 'vendor/makefun-frontend.ts must be the kit copy unchanged');
  const owner = JSON.parse(readFileSync(root('.makefun/owner.json'), 'utf8'));
  assert.equal(owner.wallet, 'FCVXqAiSDbsUriov7NbvWJ1VsBYgnndnTN2hGMxZEP2s');
  const shots = readdirSync(root('screenshots')).filter((n) => !n.startsWith('.'));
  assert.ok(shots.length >= 3 && shots.length <= 4, `need 3-4 screenshots, have ${shots.length}`);
});
