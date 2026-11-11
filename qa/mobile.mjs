// Mobile overflow + hamburger + interaction sweep (v8)
import { chromium } from 'playwright';

const BASE = 'http://127.0.0.1:3000';
const PAGES = ['/ja/', '/ko/', '/en/', '/ja/snack/', '/ja/price/', '/ja/search/', '/ja/ranking/', '/ja/area/', '/ja/area/tokyo/', '/ja/area/tokyo/shinjuku-kabukicho/', '/ja/register/', '/ja/advertise/', '/ja/guide/'];
const WIDTHS = [320, 360, 390, 414];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { localStorage.setItem('yn_age_ok', '1'); } catch {} });

const issues = [];
const page = await ctx.newPage();
const consoleErrs = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrs.push(m.text()); });
page.on('pageerror', (e) => consoleErrs.push('PAGEERROR ' + e.message));

for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 800 });
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(120);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const offenders = [];
      const vw = window.innerWidth;
      document.querySelectorAll('body *').forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        if (b.right > vw + 1.5) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed' && cs.visibility === 'hidden') return;
          offenders.push({ tag: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''), right: Math.round(b.right), w: Math.round(b.width) });
        }
      });
      return { docW: de.scrollWidth, vw, offenders: offenders.slice(0, 6) };
    });
    if (r.docW > r.vw + 1) {
      issues.push(`OVERFLOW ${w}px ${p}  docW=${r.docW} vw=${r.vw} :: ` + r.offenders.map((o) => `${o.tag}(r${o.right},w${o.w})`).join(' '));
    }
  }
}

// ---- hamburger test ----
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(BASE + '/ja/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(200);

const burger = page.locator('#burger');
if (!(await burger.count())) issues.push('BURGER: #burger missing');
else {
  await burger.click();
  await page.waitForTimeout(350);
  const open1 = await page.evaluate(() => {
    const n = document.getElementById('mnav');
    const b = document.getElementById('burger');
    const cs = n ? getComputedStyle(n) : null;
    return {
      exists: !!n,
      visible: cs ? cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none' : false,
      hasOpen: n ? n.classList.contains('open') : false,
      expanded: b ? b.getAttribute('aria-expanded') : null,
      bodyLocked: document.body.classList.contains('noscroll') || document.documentElement.classList.contains('nav-open'),
      navH: n ? Math.round(n.getBoundingClientRect().height) : 0,
      links: n ? n.querySelectorAll('a').length : 0,
    };
  });
  if (!open1.visible) issues.push('BURGER: menu not visible after tap ' + JSON.stringify(open1));
  if (!open1.hasOpen) issues.push('BURGER: .open not set');
  if (open1.expanded !== 'true') issues.push('BURGER: aria-expanded not true');
  if (!open1.bodyLocked) issues.push('BURGER: body not scroll-locked');
  if (open1.links !== 7) issues.push('BURGER: expected 7 main links, got ' + open1.links);

  // v8: the single close affordance is the header burger, morphing into an ×
  {
    const x = page.locator('#burger');
    await x.click({ timeout: 3000 }).catch((e) => issues.push('BURGER: close button not clickable — ' + e.message.split('\n')[0]));
    await page.waitForTimeout(350);
    await page.evaluate(() => { window.scrollTo(0, 300); });
    await page.waitForTimeout(700);
    await page.evaluate(() => { window.__scrollProbe = window.scrollY > 0; });
    const closed = await page.evaluate(() => ({
      open: document.getElementById('mnav').classList.contains('open'),
      expanded: document.getElementById('burger').getAttribute('aria-expanded'),
      locked: document.body.classList.contains('noscroll') || document.documentElement.classList.contains('nav-open'),
      // scroll-behavior:smooth means scrollY is still 0 on the next tick — measure after a wait
      canScroll: window.__scrollProbe === true,
      contentVisible: document.querySelector('main, .hero, section') ? getComputedStyle(document.querySelector('main, .hero, section')).visibility : 'n/a',
    }));
    if (closed.open) issues.push('BURGER: still open after X');
    if (closed.expanded !== 'false') issues.push('BURGER: aria-expanded not reset');
    if (closed.locked) issues.push('BURGER: still scroll-locked after close (FREEZE)');
    if (!closed.canScroll) issues.push('BURGER: page cannot scroll after close (FREEZE)');
  }

  // reopen then close by tapping a nav link -> navigates
  await burger.click();
  await page.waitForTimeout(250);
  const link = page.locator('#mnav a').nth(1);
  if (await link.count()) {
    const href = await link.getAttribute('href');
    await link.click({ timeout: 3000 }).catch((e) => issues.push('BURGER: nav link click failed — ' + e.message.split('\n')[0]));
    await page.waitForTimeout(700);
    const url = page.url();
    if (!url.includes(href || '###')) issues.push(`BURGER: link ${href} did not navigate (still ${url})`);
    const lockAfterNav = await page.evaluate(() => document.body.classList.contains('noscroll'));
    if (lockAfterNav) issues.push('BURGER: scroll lock leaked across navigation (FREEZE)');
  }
}

// ---- calculator ----
await page.goto(BASE + '/ja/price/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
const calcTotal = await page.locator('#calcTotal').first().textContent().catch(() => null);
if (!calcTotal || calcTotal.trim() === '—') issues.push('CALC: total not computed -> ' + calcTotal);
else {
  await page.selectOption('#cCat', 'massage').catch(() => issues.push('CALC: #cCat not selectable'));
  await page.waitForTimeout(400);
  const t2 = await page.locator('#calcTotal').first().textContent();
  if (t2 === calcTotal) issues.push('CALC: total did not change on category switch');
  const lines = await page.locator('#calcLines .calc-line').count();
  if (lines < 2) issues.push('CALC: breakdown rows missing (' + lines + ')');
  const disc = page.locator('#cDisc');
  if (await disc.count()) {
    await page.selectOption('#cDisc', '10').catch(() => {});
    await page.waitForTimeout(400);
    const t3 = await page.locator('#calcTotal').first().textContent();
    if (t3 === t2) issues.push('CALC: coupon discount had no effect');
  }
}

// ---- register form (client + server) ----
await page.goto(BASE + '/ja/register/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(300);
await page.selectOption('#rPref', 'tokyo');
await page.waitForTimeout(250);
await page.fill('#rName', 'QAテスト店');
await page.selectOption('#rCat', 'snack');
const distAfter = await page.locator('#rArea option').count();
if (distAfter < 2) issues.push('REGISTER: district list empty after prefecture change');
const firstDist = await page.locator('#rArea option').nth(1).getAttribute('value');
await page.selectOption('#rArea', firstDist);
await page.fill('#rAddr', '東京都新宿区歌舞伎町1-2-3');
await page.fill('#rTel', '03-1234-5678');
await page.fill('#rMail', 'qa@example.jp');
await page.check('#formConsent');
await page.click('#regForm button[type=submit]');
await page.waitForTimeout(1500);
const status = await page.locator('#formStatus').textContent().catch(() => '');
if (!/送信|submitted|전송/i.test(status || '')) issues.push('REGISTER: submit status = "' + status + '"');

// ---- console errors ----
await page.goto(BASE + '/ja/', { waitUntil: 'networkidle' });
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
const realErrs = consoleErrs.filter((e) => !/favicon|manifest|net::ERR_ABORTED/i.test(e));
if (realErrs.length) issues.push('CONSOLE: ' + [...new Set(realErrs)].slice(0, 5).join(' | '));

await browser.close();

console.log(issues.length ? issues.join('\n') : 'CLEAN');
console.log('\nISSUES: ' + issues.length);
