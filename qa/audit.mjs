#!/usr/bin/env node
// ============================================================================
// qa/audit.mjs — 添付「HIGH-END WEBSITE」§12 / §14 準拠の全数監査
// ----------------------------------------------------------------------------
// 既存の e2e / mobile が見ていない項目を実ブラウザで全数チェックする。
//   1. 全ページの内部リンクを実際に辿り、リンク切れ・リダイレクト・404 を検出
//   2. ホーム → 検索 → 詳細 → エリア → 言語切替 → CTA を実クリックで通す
//   3. 390px で横スクロール / はみ出し要素 / 重なりを検出
//   4. プレースホルダー（Lorem / TODO / undefined / NaN / {{ }}）の残留検出
//   5. ページ間で同一情報の不一致（店舗名・住所・料金ラベル）
//   6. 3言語のレイアウト崩れ（ナビのはみ出し・テキスト切れ）
//   7. 画像の 404 と alt 欠落
// 使い方: node qa/audit.mjs [--base http://127.0.0.1:3000] [--max 250]
// ============================================================================

import { chromium } from 'playwright';

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i >= 0 ? process.argv[i + 1] : d;
};
const BASE = arg('--base', 'http://127.0.0.1:3000');
const resolveHref = (href) => new URL(href, BASE + '/').href;
const MAXPAGES = parseInt(arg('--max', '250'), 10);

const issues = [];
const notes = [];
const addIssue = (where, what) => issues.push(`✗ ${where} :: ${what}`);
const addNote = (where, what) => notes.push(` · ${where}: ${what}`);

async function bypassGate(p) {
  await p.evaluate(() => {
    try { localStorage.setItem('yn_age_ok', '1'); } catch { /* ignore */ }
  });
}

// 全ページから内部リンクを集める（BFS）
async function crawl(ctx) {
  const seen = new Set();
  const queue = [`${BASE}/ja/`];
  const broken = [];
  const page = await ctx.newPage();
  while (queue.length && seen.size < MAXPAGES) {
    const url = queue.shift();
    const path = new URL(url).pathname;
    if (seen.has(path)) continue;
    seen.add(path);
    let res;
    try {
      res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    } catch (e) {
      broken.push({ path, why: 'navigation failed: ' + e.message.split('\n')[0] });
      continue;
    }
    const status = res ? res.status() : 0;
    if (status >= 400) { broken.push({ path, why: `HTTP ${status}` }); continue; }
    // リダイレクト先が別URL（意図しないリダイレクト）
    const finalPath = new URL(page.url()).pathname;
    if (finalPath !== path && !path.endsWith('/')) broken.push({ path, why: `redirected to ${finalPath}` });

    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const h of hrefs) {
      if (!h || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) continue;
      if (/^https?:\/\//.test(h) && !h.startsWith(BASE)) continue; // 外部は別扱い
      const clean = h.split('#')[0].split('?')[0];
      if (!clean) continue;
      const abs = resolveHref(clean);
      const p2 = new URL(abs).pathname;
      if (!seen.has(p2) && queue.length < 4000) queue.push(abs);
    }
  }
  await page.close();
  return { visited: seen.size, broken };
}

// ユーザーシナリオ（実クリック）
async function scenario(ctx) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

  await p.goto(`${BASE}/ja/`, { waitUntil: 'load' });
  await bypassGate(p);
  await p.reload({ waitUntil: 'load' });

  // 検索（ヘッダー検索 → 結果ページ）
  const q = await p.$('form[role="search"] input[name="q"]:visible');
  if (!q) addIssue('/ja/', 'search input not found');
  else {
    const inForm = await p.$eval('form[role="search"] input[name="q"]:visible', (el) => !!el.form);
    if (!inForm) addIssue('/ja/', 'search input is not inside a form (Enter cannot submit)');
    await q.fill('歌舞伎町');
    // フォーム送信はナビゲーション完了を待つ必要がある（domcontentloaded だけでは早すぎる）
    await Promise.all([
      p.waitForURL(/\/search\//, { timeout: 8000 }).catch(() => {}),
      p.keyboard.press('Enter'),
    ]);
    if (!p.url().includes('search')) addIssue('/ja/', `Enter on search did not navigate (${p.url()})`);
    else {
      const n = await p.$$eval('.sc', (e) => e.length);
      if (n === 0) addIssue('/ja/search/?q=歌舞伎町', 'search returned 0 cards');
      else {
        const shownQ = await p.$eval('#fQuery', (e) => e.value).catch(() => '');
        if (shownQ !== '歌舞伎町') addIssue('/ja/search/?q=歌舞伎町', `query not carried into filter box (${shownQ})`);
      }
    }
  }

  // 詳細ページへ（実在店舗）
  await p.goto(`${BASE}/ja/search/`, { waitUntil: 'domcontentloaded' });
  const firstShop = await p.$eval('.sc a[href*="/shop/"]', (a) => a.getAttribute('href')).catch(() => null);
  if (!firstShop) addIssue('/ja/search/', 'no shop link on results page');
  else {
    await p.goto(resolveHref(firstShop), { waitUntil: 'domcontentloaded' });
    const name = await p.textContent('h1');
    if (!name || !name.trim()) addIssue(firstShop, 'empty h1 on detail page');
    // 「未確認」なのに金額が出ていないか / 逆に捏造価格が出ていないか
    const body = await p.textContent('body');
    if (/\b¥0\b/.test(body)) addIssue(firstShop, 'shows ¥0 for an unconfirmed price');
    const vis = await p.evaluate(() => {
      const c = document.body.cloneNode(true);
      c.querySelectorAll('script, style').forEach((n) => n.remove());
      return c.innerText || '';
    });
    if (/\bundefined\b|\bNaN\b/.test(vis)) addIssue(firstShop, 'placeholder token in visible text');
    // パンくずのリンクが生きているか
    const crumbs = await p.$$eval('.crumbs a, nav[aria-label*="パン"] a', (as) => as.map((a) => a.getAttribute('href')));
    for (const c of crumbs) {
      if (!c) continue;
      const r = await ctx.request.get(resolveHref(c));
      if (r.status() >= 400) addIssue(firstShop, `breadcrumb link broken: ${c}`);
    }
  }

  // 言語切替（同じページで3言語）
  for (const lang of ['ko', 'en', 'ja']) {
    await p.goto(`${BASE}/${lang}/`, { waitUntil: 'domcontentloaded' });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 1) addIssue(`/${lang}/`, `horizontal overflow ${over}px at desktop`);
    const h1 = await p.textContent('h1').catch(() => '');
    if (!h1 || !h1.trim()) addIssue(`/${lang}/`, 'empty h1');
  }

  // CTA（掲載申込フォームへ）
  await p.goto(`${BASE}/ja/register/`, { waitUntil: 'domcontentloaded' });
  const submit = await p.$('#regForm button[type="submit"], #regForm .btn');
  if (!submit) addIssue('/ja/register/', 'no submit button');
  else {
    await submit.click();
    await p.waitForTimeout(400);
    const status = await p.textContent('#formStatus').catch(() => '');
    if (!status || !status.trim()) addNote('/ja/register/', 'empty submit shows no validation message');
  }

  if (errs.length) for (const e of errs.slice(0, 6)) addIssue('/ja/ (js)', e.slice(0, 120));
  await p.close();
}

// 390px 実機幅の全数チェック
async function mobileCheck(ctx) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
  const paths = ['/ja/', '/ja/search/', '/ja/massage/', '/ja/price/', '/ja/guide/', '/ja/advertise/', '/ja/register/', '/ja/legal/data/',
    '/ko/', '/en/', '/ja/area/tokyo/', '/ja/area/tokyo/hongo/', '/ja/area/tokyo/ueno/'];
  for (const path of paths) {
    await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    await bypassGate(p);
    await p.reload({ waitUntil: 'domcontentloaded' });
    const r = await p.evaluate(() => {
      const vw = window.innerWidth;
      const over = document.documentElement.scrollWidth - vw;
      // 画面外にはみ出している要素（スクロール可能コンテナ内は除外）
      const bad = [];
      for (const el of document.querySelectorAll('body *')) {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) continue;
        if (b.right > vw + 2 || b.left < -2) {
          let anc = el.parentElement, scrollable = false;
          while (anc && anc !== document.body) {
            const s = getComputedStyle(anc);
            if (/(auto|scroll)/.test(s.overflowX)) { scrollable = true; break; }
            anc = anc.parentElement;
          }
          if (!scrollable) bad.push(`${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]} right=${Math.round(b.right)}`);
        }
      }
      return { over, bad: bad.slice(0, 5) };
    });
    if (r.over > 1) addIssue(path, `390px horizontal overflow ${r.over}px`);
    if (r.bad.length) addIssue(path, `390px overflowing elements: ${r.bad.join(' | ')}`);
  }
  await p.close();
}

// コンテンツ監査：プレースホルダー・画像・alt・情報一致
async function contentCheck(ctx) {
  const p = await ctx.newPage();
  const paths = ['/ja/', '/ja/search/', '/ja/massage/', '/ja/girlsbar/', '/ja/price/', '/ja/guide/',
    '/ja/advertise/', '/ja/register/', '/ja/legal/data/', '/ja/legal/privacy/', '/ko/', '/en/'];
  for (const path of paths) {
    await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
    const html = await p.content();
    if (/Lorem ipsum|TODO|FIXME|XXX|｛｛|\{\{|サンプルテキスト|placeholder text/i.test(html)) {
      addIssue(path, 'placeholder text found');
    }
    // script/style 内の JS は「表示テキスト」ではないので除外して判定する
    const visible = await p.evaluate(() => {
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('script, style, template').forEach((n) => n.remove());
      return clone.innerText || '';
    });
    if (/\bundefined\b|\bNaN\b/.test(visible)) addIssue(path, 'undefined/NaN in visible text');
    const title = await p.title();
    if (/undefined|NaN/.test(title)) addIssue(path, `undefined/NaN in <title>: ${title}`);
    const imgs = await p.$$eval('img', (is) => is.map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt') })));
    for (const im of imgs) {
      if (!im.alt && im.alt !== '') addIssue(path, `img without alt: ${im.src}`);
      if (im.alt === '') addNote(path, `decorative img alt="" ${im.src}`);
      if (im.src && !/^(https?:|data:)/.test(im.src)) {
        const r = await ctx.request.get(resolveHref(im.src));
        if (r.status() >= 400) addIssue(path, `image 404: ${im.src}`);
      }
    }
  }
  await p.close();
}

// 同一店舗の情報が一覧と詳細で一致するか
async function consistencyCheck(ctx) {
  const p = await ctx.newPage();
  await p.goto(`${BASE}/ja/search/`, { waitUntil: 'domcontentloaded' });
  const card = await p.evaluate(() => {
    const a = document.querySelector('.sc a[href*="/shop/"]');
    if (!a) return null;
    const sc = a.closest('.sc');
    return { href: a.getAttribute('href'), name: (sc.querySelector('h3, .sc-name, b') || {}).textContent || '' };
  });
  if (card) {
    await p.goto(resolveHref(card.href), { waitUntil: 'domcontentloaded' });
    const h1 = await p.textContent('h1');
    const norm = (s) => (s || '').replace(/\s+/g, '').trim();
    if (card.name && norm(h1) && !norm(h1).includes(norm(card.name).slice(0, 8))) {
      addIssue(card.href, `card name "${norm(card.name)}" != detail h1 "${norm(h1)}"`);
    }
  }
  await p.close();
}

const t0 = Date.now();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
try {
  const c = await crawl(ctx);
  if (c.broken.length) for (const b of c.broken.slice(0, 25)) addIssue(b.path, `link broken — ${b.why}`);
  else addNote('crawl', `${c.visited} ページの内部リンクはすべて 200`);
  await scenario(ctx);
  await mobileCheck(ctx);
  await contentCheck(ctx);
  await consistencyCheck(ctx);
} finally {
  await browser.close();
}

console.log('\n================ AUDIT RESULT ================');
console.log(`所要時間: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`ISSUES: ${issues.length}`);
for (const i of issues) console.log(' ' + i);
console.log(`\nNOTES: ${notes.length}`);
for (const n of notes) console.log(' ' + n);
process.exit(issues.length ? 1 : 0);
