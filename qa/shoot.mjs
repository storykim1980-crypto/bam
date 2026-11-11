import { chromium } from 'playwright';
const b = await chromium.launch();
const shots = [
  ['m-home', '/ja/', 390, 844, true],
  ['m-home-lower', '/ja/', 390, 844, true, 1400],
  ['m-search', '/ja/search/', 390, 844, true],
  ['m-price', '/ja/price/', 390, 844, true],
  ['m-register', '/ja/register/', 390, 844, true],
  ['m-nav-open', '/ja/', 390, 844, true, 0, 'nav'],
  ['d-home', '/ja/', 1440, 900, false],
  ['d-search', '/ja/search/', 1440, 900, false],
  ['d-price', '/ja/price/', 1440, 900, false],
  ['m-ko-home', '/ko/', 390, 844, true],
  ['m-en-home', '/en/', 390, 844, true],
];
for (const [name, path, w, h, mobile, scroll, action] of shots) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => { try { localStorage.setItem('yn_age_ok', '1'); } catch {} });
  const p = await ctx.newPage();
  await p.goto('http://127.0.0.1:3000' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  if (scroll) { await p.evaluate((y) => window.scrollTo(0, y), scroll); await p.waitForTimeout(600); }
  if (action === 'nav') { await p.click('#burger'); await p.waitForTimeout(500); }
  await p.screenshot({ path: `qa/shots/${name}.png` });
  await ctx.close();
}
await b.close();
console.log('shots done');
