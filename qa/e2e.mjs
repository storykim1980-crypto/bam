import { SHOPS } from '../src/data/shops.mjs';
// Full end-to-end QA harness for YORU NAVI JAPAN
// Run: node qa/e2e.mjs
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE || 'http://127.0.0.1:3000';
const OUT = path.join(process.cwd(), 'qa', 'shots');
fs.mkdirSync(OUT, { recursive: true });

const langs = ['ja', 'ko', 'en'];
const issues = [];
const notes = [];
const addIssue = (where, msg) => { issues.push(`${where} :: ${msg}`); };

function attachLogging(page, tag) {
  const errs = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(`${tag} console: ${m.text()}`);
  });
  page.on('pageerror', (e) => errs.push(`${tag} pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (!u.includes('favicon')) errs.push(`${tag} requestfailed: ${u} ${r.failure()?.errorText}`);
  });
  page.on('response', (r) => {
    if (r.status() >= 400) errs.push(`${tag} HTTP ${r.status()}: ${r.url()}`);
  });
  return errs;
}

const SKIP_GATE = 'try{localStorage.setItem("yn_age_ok","1")}catch(e){}';

async function newCtx(browser, opts = {}, skipGate = true) {
  const ctx = await browser.newContext(opts);
  if (skipGate) await ctx.addInitScript(SKIP_GATE);
  return ctx;
}

async function bypassGate(page) {
  // Gate is normally suppressed via init script; this is a safety net.
  const gate = await page.$('#ageGate');
  if (gate) {
    await page.evaluate(() => { const g = document.getElementById('ageGate'); if (g) g.remove(); document.body.classList.remove('noscroll'); });
    addIssue('gate', 'age gate rendered despite yn_age_ok flag');
  }
}

async function checkImages(page, where) {
  const broken = await page.$$eval('img', (imgs) => imgs
    .filter((i) => (i.getAttribute('src') || '').trim() && i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute('src') || '(empty src)'));
  if (broken.length) addIssue(where, `broken images: ${broken.slice(0, 5).join(', ')}`);
  const n = await page.$$eval('img', (i) => i.length);
  return n;
}

async function checkOverflow(page, where, viewportW) {
  const o = await page.evaluate((vw) => {
    const de = document.documentElement;
    const offenders = [];
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > vw + 2 && getComputedStyle(el).position !== 'fixed') {
        const p = el.closest('.tbl-wrap, .tabs, .mnav, .lb, .marquee, .shops');
        if (!p) offenders.push(el.tagName + '.' + (el.className || '').toString().slice(0, 40) + ` right=${Math.round(r.right)}`);
      }
    });
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, offenders: offenders.slice(0, 6) };
  }, viewportW);
  if (o.scrollW > o.clientW + 2) addIssue(where, `horizontal overflow scrollWidth=${o.scrollW} client=${o.clientW} :: ${o.offenders.join(' | ')}`);
}

async function run() {
  const browser = await chromium.launch();

  // ============ DESKTOP ============
  const desktop = await newCtx(browser, { viewport: { width: 1440, height: 900 }, locale: 'ja-JP' });

  // --- 1. Age gate behaviour ---
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const errs = attachLogging(p, '[gate]');
    await p.goto(`${BASE}/ja/`, { waitUntil: 'load' });
    const visible = await p.isVisible('#ageGate');
    if (!visible) addIssue('/ja/ gate', 'age gate not visible');
    await p.click('#gateNo');
    const denied = await p.isVisible('#gateDenied');
    if (!denied) addIssue('/ja/ gate', 'deny message not shown');
    const disabled = await p.isDisabled('#gateYes');
    if (!disabled) addIssue('/ja/ gate', 'accept button should be disabled after declining');
    await p.reload({ waitUntil: 'load' });
    await p.check('#gateRemember');
    await p.click('#gateYes');
    await p.waitForTimeout(400);
    const gateGone = await p.$('#ageGate');
    if (gateGone) addIssue('/ja/ gate', 'gate not dismissed after accept');
    // persistent across reload
    await p.reload({ waitUntil: 'load' });
    const stillGone = await p.$('#ageGate');
    if (stillGone) addIssue('/ja/ gate', 'gate reappeared despite remember');
    errs.forEach((e) => addIssue('/ja/ gate', e));
    await ctx.close();
  }

  const pages = [];
  for (const l of langs) {
    pages.push(`/${l}/`, `/${l}/search/`, `/${l}/ranking/`, `/${l}/price/`, `/${l}/guide/`, `/${l}/advertise/`,
      `/${l}/area/`, `/${l}/area/kanto/`, `/${l}/area/tokyo/`, `/${l}/area/tokyo/shinjuku-kabukicho/`,
      `/${l}/snack/`, `/${l}/girlsbar/`, `/${l}/massage/`,
      `/${l}/legal/terms/`, `/${l}/legal/privacy/`, `/${l}/legal/tokushoho/`, `/${l}/legal/compliance/`,
      `/${l}/legal/ai/`, `/${l}/legal/age/`, `/${l}/legal/report/`, `/${l}/legal/company/`);
  }

  for (const route of pages) {
    const p = await desktop.newPage();
    const errs = attachLogging(p, route);
    const res = await p.goto(BASE + route, { waitUntil: 'load' });
    if (!res || res.status() !== 200) addIssue(route, `status ${res && res.status()}`);
    await bypassGate(p);
    await p.waitForTimeout(120);
    await checkImages(p, route);
    await checkOverflow(p, route, 1440);
    const title = await p.title();
    if (!title || title.length < 5) addIssue(route, 'bad title');
    const h1 = await p.$$eval('h1', (e) => e.length);
    if (h1 !== 1) addIssue(route, `h1 count = ${h1}`);
    const lang = await p.getAttribute('html', 'lang');
    if (!lang) addIssue(route, 'missing html lang');
    // nav links reachable
    const hrefs = await p.$$eval('a[href^="/"]', (as) => as.map((a) => a.getAttribute('href')));
    errs.forEach((e) => addIssue(route, e));
    if (route.endsWith('/snack/') || route.endsWith('/girlsbar/') || route.endsWith('/massage/')) {
      await p.screenshot({ path: path.join(OUT, `cat-${route.replace(/\//g, '_')}.png`), fullPage: false });
    }
    if (route === `/${langs[0]}/`) await p.screenshot({ path: path.join(OUT, 'home-desktop.png'), fullPage: false });
    await p.close();
  }

  // --- 2. Shop detail page deep test ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[shop]');
    await p.goto(`${BASE}/ko/search/?cat=girlsbar`, { waitUntil: 'load' });
    await bypassGate(p);
    await p.click('.sc-name');
    await p.waitForLoadState('load');
    await checkImages(p, 'shop detail');
    if (!(await p.$('#menu'))) addIssue('shop detail', 'no #menu section');
    // lightbox
    if(!(await p.$('a[data-lb]'))){
      const sample=SHOPS.find(s=>s.sample&&s.images.length);
      if(sample) await p.goto(`${BASE}/ko/shop/${sample.slug}/`,{waitUntil:'load'});
    }
    const lbLink = await p.$('a[data-lb]');
    if (!lbLink) notes.push('shop detail: no rights-cleared photo; gallery intentionally absent');
    else {
      await lbLink.click();
      await p.waitForTimeout(250);
      const open = await p.isVisible('#lb.open');
      if (!open) addIssue('shop detail', 'lightbox did not open');
      await p.click('#lbX');
      await p.waitForTimeout(200);
      if (await p.isVisible('#lb.open')) addIssue('shop detail', 'lightbox did not close');
    }
    await checkOverflow(p, 'shop detail', 1440);
    errs.forEach((e) => addIssue('shop detail', e));
    await p.screenshot({ path: path.join(OUT, 'shop-detail.png'), fullPage: false });
    await p.close();
  }

  // --- 3. Calculator functional test ---
  {
    for (const l of langs) {
      const p = await desktop.newPage();
      const errs = attachLogging(p, `[calc ${l}]`);
      await p.goto(`${BASE}/${l}/price/`, { waitUntil: 'load' });
      await bypassGate(p);
      await p.waitForFunction(() => {
        const e = document.querySelector('#calcTotal');
        return e && e.textContent.trim() !== '—';
      }, { timeout: 8000 }).catch(() => addIssue(`/${l}/price/`, 'calculator never populated'));

      const read = async () => (await p.textContent('#calcTotal')).trim();
      const base = await read();
      if (!/^¥[\d,]+$/.test(base)) addIssue(`/${l}/price/`, `calc total malformed: ${base}`);

      // change category -> must recompute
      await p.selectOption('#cCat', 'massage');
      await p.waitForTimeout(350);
      const afterCat = await read();
      if (afterCat === base) addIssue(`/${l}/price/`, 'category change did not update total');

      // change people -> grand total should scale
      await p.selectOption('#cPeople', '3');
      await p.waitForTimeout(350);
      const all3 = (await p.textContent('#calcTotalAll')).trim();

      // Regional market-price multipliers were intentionally removed in v25.
      if(await p.locator('#cArea,#areaIdx').count()) addIssue(`/${l}/price/`, 'removed regional price band returned');

      // late-night toggle must increase the total
      const before = await read();
      await p.selectOption('#cLate', '1');
      await p.waitForTimeout(350);
      const after = await read();
      const num = (s) => parseInt(s.replace(/[^\d]/g, ''), 10);
      if (num(after) <= num(before)) addIssue(`/${l}/price/`, `late-night toggle did not increase total (${before} -> ${after})`);

      // breakdown rows render
      const lines = await p.$$eval('#calcLines .calc-line', (e) => e.length);
      if (lines < 3) addIssue(`/${l}/price/`, `breakdown lines too few (${lines})`);
      if (/NaN|undefined|\[object/.test(await p.textContent('#calc'))) addIssue(`/${l}/price/`, 'NaN/undefined in calculator output');

      errs.forEach((e) => addIssue(`/${l}/price/`, e));
      if (l === 'ja') await p.screenshot({ path: path.join(OUT, 'calculator.png'), fullPage: false });
      await p.close();
    }
  }

  // --- 4. Advertiser enquiry form: validation + submit ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[form]');
    await p.goto(`${BASE}/ja/advertise/`, { waitUntil: 'load' });
    await bypassGate(p);
    // empty submit -> errors
    await p.click('#inqForm button[type=submit]');
    await p.waitForTimeout(250);
    const showedErr = await p.isVisible('#formStatus.ng');
    if (!showedErr) addIssue('/ja/advertise/', 'empty submit did not surface validation error');
    const errFields = await p.$$eval('.err', (e) => e.length);
    if (errFields < 3) addIssue('/ja/advertise/', `expected >=3 error fields, got ${errFields}`);
    // invalid email
    await p.fill('#shop', 'テストスナック');
    await p.fill('#name', 'テスト太郎');
    await p.fill('#email', 'not-an-email');
    await p.click('#inqForm button[type=submit]');
    await p.waitForTimeout(200);
    if (!(await p.isVisible('#formStatus.ng'))) addIssue('/ja/advertise/', 'invalid email not rejected');
    // valid submit
    await p.fill('#email', 'owner@example.jp');
    await p.fill('#phone', '03-1234-5678');
    await p.selectOption('#area', { index: 1 });
    await p.selectOption('#plan', { index: 1 });
    await p.fill('#message', 'QAテスト送信');
    await p.check('#formConsent');
    const [resp] = await Promise.all([
      p.waitForResponse((r) => r.url().includes('/api/inquiry') && r.request().method() === 'POST', { timeout: 8000 }).catch(() => null),
      p.click('#inqForm button[type=submit]'),
    ]);
    if (!resp) addIssue('/ja/advertise/', 'POST /api/inquiry never fired');
    else if (resp.status() !== 200) addIssue('/ja/advertise/', `inquiry status ${resp.status()}`);
    await p.waitForTimeout(400);
    if (!(await p.isVisible('#formStatus.ok'))) addIssue('/ja/advertise/', 'success state not shown');
    // plan CTA preselects the plan
    await p.goto(`${BASE}/ja/advertise/#form`, { waitUntil: 'load' });
    await bypassGate(p);
    await p.click('.plan.best a[data-plan]');
    await p.waitForTimeout(300);
    const planVal = await p.inputValue('#plan');
    if (planVal !== 'standard') addIssue('/ja/advertise/', `plan CTA did not preselect (got "${planVal}")`);
    errs.forEach((e) => addIssue('/ja/advertise/', e));
    await p.screenshot({ path: path.join(OUT, 'advertise.png'), fullPage: false });
    await p.close();
    // invalid API payloads
    const api = await desktop.request.post(`${BASE}/api/inquiry`, { data: { shop: 'x' } });
    if (api.status() !== 422) addIssue('/api/inquiry', `missing-fields should be 422, got ${api.status()}`);
    const api2 = await desktop.request.post(`${BASE}/api/inquiry`, { data: { shop: 'a', name: 'b', email: 'bad', area: 'x', plan: 'y', consent: true } });
    if (api2.status() !== 422) addIssue('/api/inquiry', `bad email should be 422, got ${api2.status()}`);
  }

  // --- 5. ROI simulator ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[roi]');
    await p.goto(`${BASE}/en/advertise/`, { waitUntil: 'load' });
    await bypassGate(p);
    await p.waitForFunction(() => {
      const e = document.querySelector('#roiPct');
      return e && e.textContent.trim() !== '—';
    }, { timeout: 8000 }).catch(() => addIssue('/en/advertise/', 'ROI never populated'));
    const pct1 = await p.textContent('#roiPct');
    await p.selectOption('#roiPlan', 'areapr');
    await p.waitForTimeout(350);
    const pct2 = await p.textContent('#roiPct');
    if (pct1 === pct2) addIssue('/en/advertise/', 'ROI did not recalc on plan change');
    if (!/^-?\d/.test(pct2.trim())) addIssue('/en/advertise/', `ROI value malformed: ${pct2}`);
    await p.selectOption('#roiMonths', '12');
    await p.waitForTimeout(300);
    const bar = await p.$eval('#roiFill', (e) => e.style.width);
    if (!bar || bar === '0%') addIssue('/en/advertise/', 'ROI bar not animated');
    errs.forEach((e) => addIssue('/en/advertise/', e));
    await p.screenshot({ path: path.join(OUT, 'roi.png'), fullPage: false });
    await p.close();
  }

  // --- 6. Search filtering / sorting ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[search]');
    await p.goto(`${BASE}/ja/search/`, { waitUntil: 'load' });
    await bypassGate(p);
    const initial = await p.$$eval('.sc', (e) => e.length);
    if (initial === 0) addIssue('/ja/search/', 'no cards rendered');
    // feature chip filter
    await p.click('.fchips button[data-feat="korean"]');
    await p.waitForTimeout(300);
    const filtered = await p.$$eval('.sc', (e) => e.filter((x) => x.style.display !== 'none').length);
    // 実データには特徴タグが未登録のことがあるため 0 件は起こりうる。
    // ただし「絞り込みが効いていない（件数が増える/減らない）」のは不具合。
    const expectedFiltered=await p.$eval('#searchDataset',e=>JSON.parse(e.textContent).filter(r=>r.feat.includes('korean')).length);
    const wrongFeatures=await p.$$eval('.sc',els=>els.some(e=>!(' '+e.dataset.feat+' ').includes(' korean ')));
    if(wrongFeatures||filtered!==Math.min(24,expectedFiltered))addIssue('/ja/search/','paginated feature filter mismatch');
    if (filtered === 0) {
      const emptyShown = await p.$eval('#fEmpty', (e) => getComputedStyle(e).display !== 'none').catch(() => false);
      if (!emptyShown) addIssue('/ja/search/', 'filtered to 0 but empty state not shown');
    }
    const count = await p.textContent('#fCount');
    if (parseInt(count, 10) !== expectedFiltered) addIssue('/ja/search/', `count label ${count} != visible ${filtered}`);
    // reset chip
    await p.click('.fchips button[data-feat=""]');
    await p.waitForTimeout(250);
    const back = await p.$$eval('.sc', (e) => e.filter((x) => x.style.display !== 'none').length);
    if (back !== initial) addIssue('/ja/search/', `reset did not restore (${back} vs ${initial})`);
    // sort by price low
    await p.selectOption('#fSort', 'priceLow');
    await p.waitForTimeout(350);
    const prices = await p.$$eval('.sc', (e) => e.map((x) => parseInt(x.dataset.price, 10)));
    const sorted = [...prices].sort((a, b) => a - b);
    if (prices.join() !== sorted.join()) addIssue('/ja/search/', 'price-low sort incorrect');
    // server-side query
    await p.goto(`${BASE}/ja/search/?q=스스키노&lang=ko`, { waitUntil: 'load' });
    await bypassGate(p);
    const q = await p.inputValue('#fQuery');
    if (q !== '스스키노') addIssue('/ja/search/?q=', 'query not preserved in input');
    // pref -> district dependent select
    await p.selectOption('#fPref', 'tokyo');
    await p.waitForTimeout(200);
    const distOpts = await p.$$eval('#fDist option', (o) => o.length);
    if (distOpts < 5) addIssue('/ja/search/', `district select not populated (${distOpts})`);
    // no-results state
    await p.goto(`${BASE}/ja/search/?q=zzzzzznotfound`, { waitUntil: 'load' });
    await bypassGate(p);
    if (!(await p.isVisible('#fEmpty'))) addIssue('/ja/search/?q=none', 'empty state not visible');
    errs.forEach((e) => addIssue('/ja/search/', e));
    await p.close();
  }

  // --- 7. Home hero search (pref -> district cascade) ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[home search]');
    await p.goto(`${BASE}/en/`, { waitUntil: 'load' });
    await bypassGate(p);
    await p.selectOption('#heroPref', 'osaka');
    await p.waitForTimeout(250);
    const n = await p.$$eval('#heroDist option', (o) => o.length);
    if (n < 3) addIssue('/en/ hero', `district cascade empty (${n})`);
    await p.selectOption('#heroDist', { index: 1 });
    await p.click('#heroSearch button[type=submit]');
    await p.waitForLoadState('load');
    if (!p.url().includes('/search/')) addIssue('/en/ hero', 'search form did not navigate to /search/');
    if (!p.url().includes('district=')) addIssue('/en/ hero', 'district not in query string');
    const cards = await p.$$eval('.sc', (e) => e.length);
    if (!cards && !(await p.isVisible('#fEmpty'))) addIssue('/en/ hero','no results and no honest empty state');
    errs.forEach((e) => addIssue('/en/ hero', e));
    await p.close();
  }

  // --- 8. Mobile viewport (iPhone 13) ---
  const mobile = await newCtx(browser, { ...devices['iPhone 13'] });
  for (const l of langs) {
    for (const route of [`/${l}/`, `/${l}/search/`, `/${l}/price/`, `/${l}/advertise/`, `/${l}/girlsbar/`, `/${l}/area/tokyo/tokyo-shibuya/`.replace('/tokyo/tokyo-shibuya', '/tokyo/shibuya')]) {
      const p = await mobile.newPage();
      const errs = attachLogging(p, `[m ${route}]`);
      await p.goto(BASE + route, { waitUntil: 'load' });
      await bypassGate(p);
      await p.waitForTimeout(150);
      await checkImages(p, `m ${route}`);
      await checkOverflow(p, `m ${route}`, 390);
      const w = await p.evaluate(() => document.documentElement.scrollWidth);
      if (w > 392) addIssue(`m ${route}`, `page scrollWidth ${w} > 392`);
      // v8: navigation lives in the hamburger overlay (#mnav); the old fixed .mbar is retired
      if (!(await p.isVisible('#burger'))) addIssue(`m ${route}`, 'hamburger button missing');
      // burger menu
      if (await p.isVisible('#burger')) {
        await p.click('#burger');
        await p.waitForTimeout(300);
        if (!(await p.isVisible('#mnav.open'))) addIssue(`m ${route}`, 'mobile nav did not open');
        const links = await p.$$eval('#mnav a', (a) => a.length);
        if (links !== 7) addIssue(`m ${route}`, `mobile nav links ${links}`);
        await p.click('#burger');
        await p.waitForTimeout(250);
        if (await p.isVisible('#mnav.open')) addIssue(`m ${route}`, 'mobile nav did not close');
      }
      // tap target sizing
      const small = await p.$$eval('a, button', (els) => els.filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.height < 28 && e.textContent.trim().length > 2 && !e.closest('footer, .crumb, .dlist, .tags, .plan');
      }).length);
      if (small > 6) notes.push(`m ${route}: ${small} small tap targets`);
      errs.forEach((e) => addIssue(`m ${route}`, e));
      if (route === `/${l}/`) await p.screenshot({ path: path.join(OUT, `home-mobile-${l}.png`), fullPage: false });
      if (route.endsWith('/price/') && l === 'ja') await p.screenshot({ path: path.join(OUT, 'price-mobile.png'), fullPage: false });
      await p.close();
    }
  }

  // --- 9. Tablet ---
  {
    const ctx = await newCtx(browser, { viewport: { width: 820, height: 1180 } });
    for (const route of ['/ja/', '/ja/search/', '/ko/price/']) {
      const p = await ctx.newPage();
      const errs = attachLogging(p, `[t ${route}]`);
      await p.goto(BASE + route, { waitUntil: 'load' });
      await bypassGate(p);
      await checkOverflow(p, `t ${route}`, 820);
      errs.forEach((e) => addIssue(`t ${route}`, e));
      await p.close();
    }
    await ctx.close();
  }

  // --- 10. Language switcher round-trip ---
  {
    const p = await desktop.newPage();
    const errs = attachLogging(p, '[lang switch]');
    await p.goto(`${BASE}/ja/girlsbar/`, { waitUntil: 'load' });
    await bypassGate(p);
    await p.click('.langs a[data-lang="ko"]');
    await p.waitForLoadState('load');
    if (!p.url().includes('/ko/girlsbar/')) addIssue('lang switch', `bad target ${p.url()}`);
    if ((await p.getAttribute('html', 'lang')) !== 'ko-KR') addIssue('lang switch', 'html lang not ko-KR');
    await bypassGate(p);
    await p.click('.langs a[data-lang="en"]');
    await p.waitForLoadState('load');
    if (!p.url().includes('/en/girlsbar/')) addIssue('lang switch', `bad target ${p.url()}`);
    if ((await p.getAttribute('html', 'lang')) !== 'en-US') addIssue('lang switch', 'html lang not en-US');
    errs.forEach((e) => addIssue('lang switch', e));
    await p.close();
  }

  // --- 11. 404 + redirects + API contract ---
  {
    const ctx = await newCtx(browser);
    const req = ctx.request;
    const r404 = await req.get(`${BASE}/ja/nope-nothing/`, { failOnStatusCode: false });
    if (r404.status() !== 404) addIssue('404 page', `expected 404, got ${r404.status()}`);
    const body = await r404.text();
    if (!body.includes('404')) addIssue('404 page', 'no 404 marker');
    const root = await req.get(`${BASE}/`, { maxRedirects: 0, failOnStatusCode: false });
    if (root.status() !== 302) addIssue('/', `expected 302, got ${root.status()}`);
    const noSlash = await req.get(`${BASE}/ja/snack`, { maxRedirects: 0, failOnStatusCode: false });
    if (noSlash.status() !== 301) addIssue('/ja/snack', `expected 301, got ${noSlash.status()}`);
    // API contract
    const q = await (await req.get(`${BASE}/api/quote?cat=girlsbar&priceIndex=1.2&plan=set90&castDrinks=3&service=1&nomination=1&lateNight=1&people=2`)).json();
    if (!q.ok || !q.quote) addIssue('/api/quote', 'bad payload');
    else {
      const sum = q.quote.lines.reduce((s, l) => s + l.amount, 0);
      if (sum !== q.quote.subtotal) addIssue('/api/quote', `line sum ${sum} != subtotal ${q.quote.subtotal}`);
      if (q.quote.tax !== Math.round(q.quote.subtotal * 0.1 / 100) * 100) addIssue('/api/quote', 'tax mismatch');
      if (q.quote.totalAll !== q.quote.totalPerPerson * 2) addIssue('/api/quote', 'people multiplication wrong');
      for (const l of q.quote.lines) if (!l.ja || !l.ko || !l.en) addIssue('/api/quote', 'line missing a language label');
    }
    const bad = await req.get(`${BASE}/api/quote?cat=nope`, { failOnStatusCode: false });
    if (bad.status() !== 400) addIssue('/api/quote?cat=nope', `expected 400, got ${bad.status()}`);
    const roiRes = await (await req.get(`${BASE}/api/roi?plan=vip&avgSpend=12000&months=6`)).json();
    if (!roiRes.ok || typeof roiRes.roi.roi !== 'number') addIssue('/api/roi', 'bad payload');
    const sm = await req.get(`${BASE}/sitemap.xml`);
    const smText = await sm.text();
    if (!smText.includes('<urlset')) addIssue('/sitemap.xml', 'invalid sitemap');
    const urlCount = (smText.match(/<url>/g) || []).length;
    // Sample-only shop pages are deliberately excluded from the sitemap and served
    // as noindex, so the expected count is the non-shop surface (~540).
    if (urlCount < 500) addIssue('/sitemap.xml', `only ${urlCount} urls`);
    // 実店舗（オープンデータ由来）は sitemap に載せてよい。
    // 禁止なのは「架空サンプル店舗」を検索エンジンに送ること。
    const { REAL_SHOPS } = await import('../src/data/shops.mjs');
    const { LANGS } = await import('../src/i18n.mjs');
    const shopUrls = (smText.match(/<loc>[^<]*\/shop\/[^<]*<\/loc>/g) || []);
    const expected = REAL_SHOPS.length * LANGS.length;
    if (shopUrls.length !== expected) {
      addIssue('/sitemap.xml', `shop URLs ${shopUrls.length} != real venues ${expected} (sample leaked or real missing)`);
    } else {
      const abs = shopUrls[Math.floor(shopUrls.length / 2)].replace(/<[^>]+>/g, '');
      const probe = BASE + new URL(abs).pathname;   // ローカルサーバーで検証する
      const pp = await ctx.newPage();
      await pp.goto(probe, { waitUntil: 'domcontentloaded' });
      await bypassGate(pp);
      const html = await pp.content();
      if (/name="robots" content="noindex/.test(html)) addIssue('/sitemap.xml', 'real shop URL is noindex');
      // /ko/ では「실점포」表記になるので、日英韓のどれかで出ていれば良い
      if (!/実店舗|실점포|Verified venue/.test(html)) addIssue('/sitemap.xml', 'shop URL lacks real-venue badge');
      await pp.close();
    }
    const rb = await req.get(`${BASE}/robots.txt`);
    if (!(await rb.text()).includes('Sitemap:')) addIssue('/robots.txt', 'missing sitemap ref');
    await ctx.close();
  }

  // --- 12. Perf-ish + a11y basics ---
  {
    const p = await desktop.newPage();
    await p.goto(`${BASE}/ja/`, { waitUntil: 'load' });
    await bypassGate(p);
    const t = await p.evaluate(() => {
      const n = performance.getEntriesByType('navigation')[0];
      return n ? Math.round(n.loadEventEnd - n.startTime) : 0;
    });
    notes.push(`/ja/ load event: ${t}ms`);
    const issuesA11y = await p.evaluate(() => {
      const out = [];
      document.querySelectorAll('img:not([alt])').forEach((i) => out.push('img without alt: ' + i.src));
      document.querySelectorAll('input:not([aria-label]):not([id])').forEach((i) => out.push('input without label'));
      const btns = [...document.querySelectorAll('button')].filter((b) => !b.textContent.trim() && !b.getAttribute('aria-label'));
      btns.forEach((b) => out.push('button without accessible name'));
      return out;
    });
    issuesA11y.forEach((i) => addIssue('/ja/ a11y', i));
    // tab order reachability of primary CTA
    await p.keyboard.press('Tab');
    const firstFocus = await p.evaluate(() => document.activeElement && document.activeElement.className);
    if (!firstFocus) addIssue('/ja/ a11y', 'no focusable first element');
    await p.close();
  }

  await browser.close();

  console.log('\n================ QA RESULT ================');
  console.log(`ISSUES: ${issues.length}`);
  issues.slice(0, 80).forEach((i) => console.log(' ✗ ' + i));
  console.log(`\nNOTES: ${notes.length}`);
  notes.slice(0, 40).forEach((n) => console.log(' · ' + n));
  fs.writeFileSync(path.join('qa', 'report.json'), JSON.stringify({ issues, notes, at: new Date().toISOString() }, null, 2));
  process.exit(issues.length ? 1 : 0);
}

run().catch((e) => { console.error('HARNESS FAILURE', e); process.exit(2); });
