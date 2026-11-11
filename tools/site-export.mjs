import {CATALOG} from '../src/data/catalog.mjs';
import {collectionPage} from '../src/pages/collection.mjs';
import {evidencePage} from '../src/pages/evidence.mjs';
// ============================================================================
// STATIC EXPORT — GitHub Pages 用の静的サイト生成
// ----------------------------------------------------------------------------
// Node サーバーをそのまま使い、全ルートを HTML ファイルとして書き出す。
// 計算機・ROI・フォームはブラウザ側で動く (build/browser.js) ので、
// サーバーが無い静的ホスティングでもサイトが完全に動作する。
//
//   BASE_PATH=/bam-night npm run build
//   → dist/  (dist/index.html, dist/ja/index.html, …)
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');

const LANGS = ['ja', 'ko', 'en'];
const CATS = ['snack', 'girlsbar', 'massage'];

// ---- 同梱モジュール ----
const { REGIONS, prefectureList } = await import('../src/data/geo.mjs');
const { SHOPS, SHOPS_BY_SLUG } = await import('../src/data/shops.mjs');
const { LISTING_MODE } = await import('../src/data/venues.mjs');
const { LEGAL_PAGES } = await import('../src/pages/legal.mjs');
const LEGAL = Object.keys(LEGAL_PAGES);

const home = (await import('../src/pages/home.mjs')).homePage;
const search = (await import('../src/pages/search.mjs')).searchPage;
const ranking = (await import('../src/pages/ranking.mjs')).rankingPage;
const price = (await import('../src/pages/price.mjs')).pricePage;
const guide = (await import('../src/pages/guide.mjs')).guidePage;
const advertise = (await import('../src/pages/advertise.mjs')).advertisePage;
const register = (await import('../src/pages/register.mjs')).registerPage;
const category = (await import('../src/pages/category.mjs')).categoryPage;
const shopPage = (await import('../src/pages/shop.mjs')).shopPage;
const areaIndex = (await import('../src/pages/area.mjs')).areaIndexPage;
const regionPage = (await import('../src/pages/area.mjs')).regionPage;
const prefPage = (await import('../src/pages/area.mjs')).prefPage;
const districtPage = (await import('../src/pages/area.mjs')).districtPage;

// ---------------------------------------------------------------------------
// 로케일별 라우트 정의 (server.mjs のルーターと同じ順序・同じ関数)
// ---------------------------------------------------------------------------
function routesFor(lang) {
  const r = [];
  const add = (urlPath, render) => r.push({ urlPath, render });

  add(`/${lang}/`, () => home(lang));
  add(`/${lang}/saved/`, () => collectionPage(lang,'saved'));
  add(`/${lang}/compare/`, () => collectionPage(lang,'compare'));
  add(`/${lang}/evidence/`, () => evidencePage(lang));
  add(`/${lang}/search/`, () => search(lang, new URLSearchParams()));
  add(`/${lang}/ranking/`, () => ranking(lang));
  add(`/${lang}/price/`, () => guide(lang));
  add(`/${lang}/guide/`, () => guide(lang));
  add(`/${lang}/advertise/`, () => LEGAL_PAGES.data(lang));
  add(`/${lang}/register/`, () => LEGAL_PAGES.data(lang));
  add(`/${lang}/area/`, () => areaIndex(lang));

  for (const c of CATS) add(`/${lang}/${c}/`, () => category(lang, c));
  for (const k of LEGAL) add(`/${lang}/legal/${k}/`, () => LEGAL_PAGES[k](lang));

  for (const region of REGIONS.filter(r=>SHOPS.some(s=>s.regionSlug===r.slug))) {
    add(`/${lang}/area/${region.slug}/`, () => regionPage(lang, region.slug));
    for (const pref of region.prefectures.filter(p=>SHOPS.some(s=>s.prefSlug===p.slug))) {
      add(`/${lang}/area/${pref.slug}/`, () => prefPage(lang, pref.slug));
      for (const d of pref.districts.filter(d=>SHOPS.some(s=>s.districtSlug===d.slug))) {
        add(`/${lang}/area/${pref.slug}/${d.slug}/`, () => districtPage(lang, pref.slug, d.slug));
      }
    }
  }
  for (const s of SHOPS) {
    add(`/${lang}/shop/${s.slug}/`, () => shopPage(lang, SHOPS_BY_SLUG.get(s.slug)));
  }
  return r;
}

// ---------------------------------------------------------------------------
// 내부 절대경로에 배포 서브패스를 붙인다.
// 외부(http, //, mailto, data:, #) 는 건드리지 않는다.
// ---------------------------------------------------------------------------
function rebase(html) {
  if (!BASE) return html;
  return html.replace(/(\s(?:href|src|action)=")(\/(?!\/)[^"]*)"/g, (m, pre, p) => {
    if (p.startsWith(`${BASE}/`) || p === BASE) return m;
    return `${pre}${BASE}${p}"`;
  });
}

// ---------------------------------------------------------------------------
// 파일 쓰기
// ---------------------------------------------------------------------------
function write(urlPath, html) {
  const clean = urlPath.replace(/^\/+|\/+$/g, '');
  const dir = path.join(OUT, clean);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), rebase(html), 'utf8');
  return path.join(clean, 'index.html');
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let n = 0;
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, e.name);
    const dst = path.join(to, e.name);
    if (e.isDirectory()) n += copyDir(src, dst);
    else { fs.copyFileSync(src, dst); n++; }
  }
  return n;
}

// ---------------------------------------------------------------------------
// 実行
// ---------------------------------------------------------------------------
const t0 = Date.now();
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

let count = 0;
const failures = [];

for (const lang of LANGS) {
  const routes = routesFor(lang);
  for (const { urlPath, render } of routes) {
    try {
      const html = render();
      if (!html || html.length < 2000) throw new Error('empty render');
      write(urlPath, html);
      count++;
    } catch (err) {
      failures.push(`${urlPath} :: ${err.message}`);
    }
  }
  process.stdout.write(`  ${lang}: ${routes.length} routes\n`);
}

// ---- 루트: /ja/ 로 이동 ----
fs.writeFileSync(path.join(OUT, 'index.html'), `<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8">
<title>BAM-NIGHT JAPAN</title>
<link rel="canonical" href="${BASE}/ja/">
<meta http-equiv="refresh" content="0; url=${BASE}/ja/">
<meta name="robots" content="noindex">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<style>html,body{margin:0;height:100%;background:#0b0d14;color:#f2f3f7;
font-family:system-ui,-apple-system,"Hiragino Sans",sans-serif;display:grid;place-items:center}
a{color:#e8b653;font-weight:800;text-decoration:none;font-size:1rem}</style>
</head><body><a href="${BASE}/ja/">BAM-NIGHT JAPAN →</a></body></html>`, 'utf8');

// ---- 言語ルートの直リンクも用意 (/ja → /ja/) ----
for (const l of LANGS) {
  fs.writeFileSync(path.join(OUT, `${l}.html`), `<!DOCTYPE html><meta charset="utf-8">
<link rel="canonical" href="${BASE}/${l}/"><meta http-equiv="refresh" content="0; url=${BASE}/${l}/">
<a href="${BASE}/${l}/">/${l}/</a>`, 'utf8');
}

// ---- 정적 자원 ----
const assets = copyDir(path.join(ROOT, 'public'), OUT);

// ---- 공유 CSS (모든 페이지가 같은 파일을 캐시) ----
const { CSS } = await import('../src/render/layout.mjs');
fs.writeFileSync(path.join(OUT, 'style.css'), CSS.replace(/\n\s*/g, '\n').trim(), 'utf8');

// ---- 파일명이 .html 인 경로도 허용 (/ja/price → /ja/price/) ----
// GitHub Pages 는 디렉터리 index.html 을 자동 처리하므로 추가 작업 없음.

// ---- Jekyll 비활성화 (.nojekyll) : _ 로 시작하는 파일이 지워지지 않도록 ----
fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

// ---- 404 ----
const { page } = await import('../src/render/layout.mjs');
fs.writeFileSync(path.join(OUT, '404.html'), rebase(`<!DOCTYPE html>
<html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>404 | BAM-NIGHT</title><meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>html,body{margin:0;min-height:100%;background:radial-gradient(120% 80% at 50% 0%,#1a1526,#07080d 62%);
color:#f2f3f7;font-family:system-ui,-apple-system,"Hiragino Sans",sans-serif;display:grid;place-items:center;text-align:center;padding:28px}
h1{font-size:clamp(3rem,18vw,4.5rem);margin:0 0 8px;background:linear-gradient(135deg,#f7d791,#e0a83c);
-webkit-background-clip:text;background-clip:text;color:transparent}
p{color:#a9aec2;line-height:1.8;font-size:.875rem;margin:0 0 22px}
a{display:inline-block;padding:13px 22px;border-radius:12px;background:linear-gradient(135deg,#f7d791,#e0a83c);
color:#171103;font-weight:800;text-decoration:none}</style></head>
<body><div><h1>404</h1><p>ページが見つかりませんでした。<br>This page could not be found.</p>
<a href="/ja/">トップへ戻る / Home</a></div></body></html>`), 'utf8');

// ---- sitemap / robots (정적 배포용) ----
const host = process.env.SITE_HOST || 'bam-night.com';
const siteBase = `https://${host}${BASE}`;
const urls = [];
for (const lang of LANGS) for(const route of routesFor(lang)) if(!/\/(saved|compare)\//.test(route.urlPath))urls.push(route.urlPath);
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${siteBase}${u}</loc><lastmod>2026-11-07</lastmod><changefreq>weekly</changefreq><priority>${u.split('/').length <= 4 ? '0.9' : '0.6'}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sm, 'utf8');
fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteBase}/sitemap.xml\n`, 'utf8');

// ---- 빌드 요약 ----
const size = (dir) => {
  let b = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    b += e.isDirectory() ? size(p) : fs.statSync(p).size;
  }
  return b;
};
const mb = (size(OUT) / 1024 / 1024).toFixed(1);
console.log(`\n✅ static export → dist/`);
console.log(`   pages   : ${count + 1} (+404)`);
console.log(`   assets  : ${assets}`);
console.log(`   size    : ${mb} MB`);
console.log(`   base    : ${BASE || '(root)'}`);
console.log(`   failures: ${failures.length}`);
console.log(`   time    : ${((Date.now() - t0) / 1000).toFixed(1)}s`);
if (failures.length) {
  console.log('\n⚠ failures:');
  for (const f of failures.slice(0, 20)) console.log('  ' + f);
  process.exitCode = 1;
}

fs.mkdirSync(path.join(OUT,'data'),{recursive:true});fs.writeFileSync(path.join(OUT,'data/catalog.json'),JSON.stringify({version:1,total:CATALOG.length,venues:CATALOG}));

fs.copyFileSync(path.join(ROOT,'deployment-version.json'),path.join(OUT,'deployment-version.json'));
