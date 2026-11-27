// Screenshot + interaction checks for Tanah & Tetangga.
// Serves app/ on a local port, opens each view from shots.json in a
// headless Chromium, verifies the page works (no console errors, maps
// render, toggles and compare respond), and saves real renders into
// screenshots/. Run from the repository root: node tools/shots.mjs
import { createServer } from 'node:http';
import { readFileSync, statSync, createReadStream } from 'node:fs';
import { extname, join, normalize, resolve, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const puppeteer = require('/home/hatch/workspace/polyester/browser/node_modules/puppeteer-core');

const __dirname = dirname(fileURLToPath(import.meta.url));

const ROOT = resolve(__dirname, '..');
const APP = join(ROOT, 'app');
const SHOTS = JSON.parse(readFileSync(join(ROOT, 'shots.json'), 'utf8'));
const CHROME = '/home/hatch/.cache/ms-playwright/chromium-1148/chrome-linux/chrome';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  const file = resolve(join(APP, normalize(p)));
  if (file !== APP && !file.startsWith(APP + sep)) { res.writeHead(403).end(); return; }
  try {
    const st = statSync(file);
    if (!st.isFile()) throw new Error('not a file');
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'content-length': st.size });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('not found'); }
});

(async () => {
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}/index.html`;
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--force-device-scale-factor=1'],
  });
  const errors = [];
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

    // --- interaction checks on the desktop hero ---
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(base + '#/', { waitUntil: 'networkidle0', timeout: 30000 });
    await sleep(400);
    const checks = await page.evaluate(() => {
      const out = {};
      out.geoPolygons = document.querySelectorAll('#map-geo polygon').length;
      out.cartoCircles = document.querySelectorAll('#map-carto circle').length;
      out.rankRows = document.querySelectorAll('#ranking .hbar').length;
      out.selectedHasKhomas = document.getElementById('selected-card').textContent.includes('Khomas');
      // switch the leading map, then back
      document.getElementById('btn-carto').click();
      out.cartoLeads = document.getElementById('maps').dataset.lead === 'carto';
      out.cartoFeatured = document.getElementById('panel-carto').classList.contains('featured');
      out.cartoFirst = document.getElementById('panel-carto').style.order === '0';
      document.getElementById('btn-geo').click();
      // click a region on the geographic map
      document.querySelector('#map-geo [data-region="erongo"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      out.afterClick = document.getElementById('selected-card').textContent.includes('Erongo');
      out.cartoSelected = !!document.querySelector('#map-carto [data-region="erongo"].selected');
      // ranking toggle to percent
      document.getElementById('btn-pct').click();
      out.pctShown = document.querySelector('#ranking .hbar-value').textContent.includes('%');
      document.getElementById('btn-abs').click();
      return out;
    });
    console.log('CHECKS hero:', JSON.stringify(checks));
    for (const [k, v] of Object.entries(checks)) {
      if (v === false || v === 0) throw new Error(`check failed: ${k} = ${v}`);
    }
    if (checks.geoPolygons !== 14 || checks.cartoCircles !== 14) throw new Error('expected 14 polygons and 14 circles');
    if (checks.rankRows !== 14) throw new Error('expected 14 ranking rows');

    // --- compare + table + profile routes ---
    await page.goto(base + '#/banding', { waitUntil: 'networkidle0' });
    await sleep(300);
    const cmp = await page.evaluate(() => ({
      rows: document.querySelectorAll('#compare-table tbody tr').length,
      hasDiff: document.querySelector('#compare-table').textContent.includes('Difference'),
    }));
    console.log('CHECKS compare:', JSON.stringify(cmp));
    if (cmp.rows !== 7) throw new Error('compare should have 7 rows');

    await page.goto(base + '#/tabel', { waitUntil: 'networkidle0' });
    await sleep(300);
    const tbl = await page.evaluate(() => ({
      rows: document.querySelectorAll('#full-table tbody tr').length,
      first: document.querySelector('#full-table tbody tr td').textContent,
    }));
    console.log('CHECKS table:', JSON.stringify(tbl));
    if (tbl.rows !== 14 || tbl.first !== 'Khomas') throw new Error('full table should list 14 regions, Khomas first');

    // --- screenshots ---
    for (const shot of SHOTS) {
      await page.setViewport({ width: shot.viewport.width, height: shot.viewport.height });
      await page.goto(base + shot.path, { waitUntil: 'networkidle0', timeout: 30000 });
      await sleep(500);
      if (shot.file === '1-sebaran.jpg') {
        // Frame the two maps, not the masthead: the cover shot must show
        // both maps whole, so scroll the maps block to the top first.
        await page.evaluate(() => {
          document.getElementById('maps').scrollIntoView();
          window.scrollBy(0, -12);
        });
        await sleep(400);
      }
      if (shot.file === '4-kartogram-phone.jpg') {
        await page.evaluate(() => {
          document.getElementById('btn-carto').click();
          document.getElementById('panel-carto').scrollIntoView();
        });
        await sleep(400);
      }
      const out = join(ROOT, 'screenshots', shot.file);
      await page.screenshot({ path: out, type: 'jpeg', quality: 88 });
      const bytes = statSync(out).size;
      console.log(`SHOT ${shot.file} ${shot.viewport.width}x${shot.viewport.height} ${bytes} bytes`);
      if (bytes > 262144) throw new Error(`${shot.file} over the 256 KiB cap`);
    }
  } finally {
    await browser.close();
    server.close();
  }
  if (errors.length) {
    console.log('PAGE ERRORS:', JSON.stringify(errors, null, 2));
    process.exit(1);
  }
  console.log('ALL CHECKS PASSED, no page errors');
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
