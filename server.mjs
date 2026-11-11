import {CATALOG} from './src/data/catalog.mjs';
import {collectionPage} from './src/pages/collection.mjs';
import {evidencePage} from './src/pages/evidence.mjs';
// ============================================================================
// BAM-NIGHT JAPAN — zero-dependency Node.js server (Node 20+)
// Binds 0.0.0.0, accepts any Host/Origin (E2B preview safe), serves
// server-rendered HTML for /ja /ko /en plus JSON APIs.
// ============================================================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

import { LANGS, DEFAULT_LANG } from './src/i18n.mjs';
import { homePage } from './src/pages/home.mjs';
import { categoryPage } from './src/pages/category.mjs';
import { areaIndexPage, regionPage, prefPage, districtPage } from './src/pages/area.mjs';
import { searchPage } from './src/pages/search.mjs';
import { shopPage } from './src/pages/shop.mjs';
import { rankingPage } from './src/pages/ranking.mjs';
import { pricePage } from './src/pages/price.mjs';
import { advertisePage } from './src/pages/advertise.mjs';
import { registerPage } from './src/pages/register.mjs';
import { submitVenue, REAL_VENUE_COUNT, LISTING_MODE } from './src/data/registry.mjs';
import { guidePage } from './src/pages/guide.mjs';
import { LEGAL_PAGES } from './src/pages/legal.mjs';
import { SHOPS, SHOPS_BY_SLUG } from './src/data/shops.mjs';
import { quote, yen } from './src/data/pricing.mjs';
import { roi } from './src/data/ads.mjs';
import { REGIONS, prefectureList } from './src/data/geo.mjs';
import { t } from './src/i18n.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');
const PORT = Number(process.env.PORT || 3000);
const HOST = '0.0.0.0';

// in-memory cache of rendered HTML: key -> {body, at}
const CACHE = new Map();
const CACHE_TTL = 1000 * 60 * 10;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'ALLOWALL',
  'permissions-policy': 'geolocation=(), microphone=(), camera=()',
  'content-security-policy': [
    "default-src 'self'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "font-src 'self' data:",
    "frame-ancestors *",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

function send(res, status, body, type = 'text/html; charset=utf-8', extra = {}) {
  const buf = Buffer.isBuffer(body) ? body : Buffer.from(body, 'utf8');
  const headers = { ...SECURITY_HEADERS, 'content-type': type, 'cache-control': 'no-cache', ...extra };
  const ae = res.__acceptEncoding || '';
  if (buf.length > 1024 && /\bgzip\b/.test(ae) && !type.startsWith('image/')) {
    const z = gzipSync(buf, { level: 6 });
    headers['content-encoding'] = 'gzip';
    headers.vary = 'accept-encoding';
    headers['content-length'] = z.length;
    res.writeHead(status, headers);
    res.end(z);
    return;
  }
  headers['content-length'] = buf.length;
  res.writeHead(status, headers);
  res.end(buf);
}

const json = (res, status, obj) =>
  send(res, status, JSON.stringify(obj), 'application/json; charset=utf-8', { 'cache-control': 'no-store' });

function cached(key, fn) {
  const hit = CACHE.get(key);
  const now = Date.now();
  if (hit && now - hit.at < CACHE_TTL) return hit.body;
  const body = fn();
  if (body) CACHE.set(key, { body, at: now });
  return body;
}

function collectBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(new Error('payload too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// sitemap / robots
// ---------------------------------------------------------------------------
function sitemap() {
  const base = 'https://bam-night.com';
  const urls = [];
  const push = (p) => urls.push(p);
  for (const l of LANGS) {
    push(`/${l}/`);
    push(`/${l}/search/`);
    push(`/${l}/ranking/`);
    push(`/${l}/price/`);
    push(`/${l}/guide/`);
    push(`/${l}/advertise/`);
    push(`/${l}/register/`);
    push(`/${l}/area/`);
    for (const c of ['snack', 'girlsbar', 'massage']) push(`/${l}/${c}/`);
    for (const k of Object.keys(LEGAL_PAGES)) push(`/${l}/legal/${k}/`);
    for (const r of REGIONS) push(`/${l}/area/${r.slug}/`);
    for (const p of prefectureList) push(`/${l}/area/${p.slug}/`);
    for (const p of prefectureList) for (const d of p.districtSlugs) push(`/${l}/area/${p.slug}/${d}/`);
    // サンプル店舗しか無いあいだは、架空の店舗URLを検索エンジンに送らない
    if (LISTING_MODE === 'real') for (const s of SHOPS) if (!s.sample) push(`/${l}/shop/${s.slug}/`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `<url><loc>${base}${u}</loc><lastmod>2026-11-07</lastmod><changefreq>daily</changefreq><priority>${u.split('/').length <= 4 ? '0.9' : '0.6'}</priority></url>`).join('\n')}
</urlset>`;
}

const ROBOTS = `User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://bam-night.com/sitemap.xml`;

// ---------------------------------------------------------------------------
// router
// ---------------------------------------------------------------------------
function renderPage(lang, segs, url) {
  const [a, b, c] = segs;
  if (segs.length === 0) return homePage(lang);
  if (a === 'saved' || a === 'compare') return collectionPage(lang,a);
  if (a === 'evidence') return evidencePage(lang);
  if (a === 'search') return searchPage(lang, url.searchParams);
  if (a === 'ranking') return rankingPage(lang);
  if (a === 'price') return guidePage(lang);
  if (a === 'guide') return guidePage(lang);
  if (a === 'advertise') return LEGAL_PAGES.data(lang);
  if (a === 'register') return LEGAL_PAGES.data(lang);
  if (a === 'snack' || a === 'girlsbar' || a === 'massage') return categoryPage(lang, a);
  if (a === 'area') {
    if (!b) return areaIndexPage(lang);
    if (c && c.length) return districtPage(lang,b,c);
    // two-segment: could be region or prefecture
    let page = regionPage(lang, b);
    if (!page) page = prefPage(lang, b);
    return page;
  }
  if (a === 'legal' && b && LEGAL_PAGES[b]) return LEGAL_PAGES[b](lang);
  if (a === 'shop' && b) {
    const s = SHOPS_BY_SLUG.get(b);
    return s ? shopPage(lang, s) : null;
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const t0 = Date.now();
  res.__acceptEncoding = req.headers['accept-encoding'] || '';
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // permissive CORS for preview hosts
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-headers', 'content-type, accept');
  res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204, SECURITY_HEADERS); res.end(); return; }

  try {
    // ---------- APIs ----------
    if (url.pathname === '/data/catalog.json' || url.pathname === '/api/catalog') return json(res,200,{version:1,total:CATALOG.length,venues:CATALOG});
    if(['/api/quote','/api/roi','/api/inquiry','/api/register'].includes(url.pathname)) return json(res,410,{ok:false,error:'This service is not offered. Contact venues through official channels.'});
    if (url.pathname === '/api/quote') {
      const p = url.searchParams;
      const q = quote({
        cat: p.get('cat') || 'snack',
        priceIndex: parseFloat(p.get('priceIndex') || '1'),
        plan: p.get('plan') || 'set60',
        castDrinks: parseInt(p.get('castDrinks') || '0', 10),
        extensions: parseInt(p.get('extensions') || '0', 10),
        nomination: p.get('nomination') === '1',
        service: p.get('service') === '1',
        lateNight: p.get('lateNight') === '1',
        people: parseInt(p.get('people') || '1', 10),
        nomination: p.get('nomination') === '1',
        service: p.get('service') !== '0',
        discount: parseInt(p.get('discount') || '0', 10),
      });
      const lang = LANGS.includes(p.get('lang')) ? p.get('lang') : 'ja';
      return json(res, q ? 200 : 400, q
        ? { ok: true, lang, quote: q, yen, t: { subtotal: t(lang, 'calcSubtotal'), tax: t(lang, 'calcTax') } }
        : { ok: false, error: 'invalid category' });
    }

    if (url.pathname === '/api/roi') {
      const p = url.searchParams;
      const r = roi({
        plan: p.get('plan') || 'standard',
        avgSpend: parseInt(p.get('avgSpend') || '8000', 10),
        months: parseInt(p.get('months') || '1', 10),
      });
      return json(res, 200, { ok: true, roi: r, fmt: (n) => Number(n).toLocaleString('en-US') });
    }

    if (url.pathname === '/api/inquiry' && req.method === 'POST') {
      const raw = await collectBody(req);
      let data = {};
      try { data = JSON.parse(raw); } catch { return json(res, 400, { ok: false, error: 'bad json' }); }
      const required = ['shop', 'name', 'email', 'area', 'plan'];
      const missing = required.filter((k) => !String(data[k] || '').trim());
      if (missing.length) return json(res, 422, { ok: false, error: 'missing fields', missing });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email))) return json(res, 422, { ok: false, error: 'bad email' });
      if (!data.consent) return json(res, 422, { ok: false, error: 'consent required' });
      const ticket = 'YN-' + Date.now().toString(36).toUpperCase().slice(-6);
      fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
      fs.appendFileSync(path.join(__dirname, 'data', 'inquiries.jsonl'), JSON.stringify({ ticket, ...data, receivedAt: new Date().toISOString() }) + '\n');
      return json(res, 200, { ok: true, ticket });
    }

    if (url.pathname === '/api/register' && req.method === 'POST') {
      const raw = await collectBody(req);
      let d = {};
      try { d = JSON.parse(raw); } catch { return json(res, 400, { ok: false, error: 'bad json' }); }
      const need = ['name', 'cat', 'pref', 'district', 'address', 'tel', 'email', 'open', 'close', 'setFee'];
      const missing = need.filter((k) => !String(d[k] ?? '').trim());
      if (missing.length) return json(res, 422, { ok: false, error: 'missing fields', missing });
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(d.email))) return json(res, 422, { ok: false, error: 'bad email' });
      if (!/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/.test(String(d.tel).replace(/\s/g, ''))) return json(res, 422, { ok: false, error: 'bad tel' });
      if (!d.consent) return json(res, 422, { ok: false, error: 'consent required' });
      if (!['snack', 'girlsbar', 'massage'].includes(d.cat)) return json(res, 422, { ok: false, error: 'bad category' });
      if(d.photoUrl && d.photoRightsConfirmed!==true) return json(res,422,{ok:false,error:'photo permission required'});
      for(const key of ['sourceUrl','photoUrl']){if(d[key]){try{if(new URL(String(d[key])).protocol!=='https:')throw new Error();}catch{return json(res,422,{ok:false,error:'https URL required',field:key});}}}
      if (d.cat === 'massage' && d.sexual === true) return json(res, 422, { ok: false, error: 'sexual services not allowed' });
      const rec = submitVenue({
        name: String(d.name).slice(0, 80), cat: d.cat, pref: d.pref, district: d.district,
        address: String(d.address).slice(0, 140), tel: String(d.tel).slice(0, 20),
        email: String(d.email).slice(0, 120), open: d.open, close: d.close,
        setFee: parseInt(d.setFee, 10) || 0, charge: parseInt(d.charge, 10) || 0,
        features: Array.isArray(d.features) ? d.features.slice(0, 12) : [],
        note: String(d.note || '').slice(0, 600),
        sourceUrl:String(d.sourceUrl||'').slice(0,1000),photoUrl:String(d.photoUrl||'').slice(0,1000),photoRightsConfirmed:d.photoRightsConfirmed===true,photoReviewStatus:'pending',
        lang: LANGS.includes(d.lang) ? d.lang : 'ja',
      });
      return json(res, 200, { ok: true, ticket: rec.id });
    }

    if(url.pathname==='/api/shops'){const cat=url.searchParams.get('cat'),district=url.searchParams.get('district');const venues=CATALOG.filter(v=>(!cat||v.cat===cat)&&(!district||v.districtSlug===district));return json(res,200,{ok:true,total:venues.length,venues});}

    if (url.pathname === '/api/health') {
      return json(res, 200, { ok: true, shops: SHOPS.length, uptime: Math.round(process.uptime()), version: '8.0.0', realVenues: REAL_VENUE_COUNT });
    }

    if (url.pathname === '/sitemap.xml') return send(res, 200, sitemap(), 'application/xml; charset=utf-8');
    if (url.pathname === '/robots.txt') return send(res, 200, ROBOTS, 'text/plain; charset=utf-8');

    // ---------- static ----------
    if (url.pathname.startsWith('/images/') || url.pathname === '/favicon.ico' || url.pathname === '/favicon.svg' || url.pathname === '/manifest.webmanifest') {
      const safe = path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, '');
      const file = path.join(PUBLIC, safe);
      if (!file.startsWith(PUBLIC)) return send(res, 403, 'Forbidden', 'text/plain');
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        const ext = path.extname(file);
        return send(res, 200, fs.readFileSync(file), MIME[ext] || 'application/octet-stream', {
          'cache-control': 'public, max-age=86400',
        });
      }
      return send(res, 404, 'Not found', 'text/plain');
    }

    // ---------- pages ----------
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') {
      res.writeHead(302, { location: `/${DEFAULT_LANG}/` });
      return res.end();
    }

    const parts = pathname.split('/').filter(Boolean);
    let lang = parts[0];
    if (!LANGS.includes(lang)) {
      // legacy/SEO: /shop/xxx -> /ja/shop/xxx
      res.writeHead(302, { location: `/${DEFAULT_LANG}${pathname}` });
      return res.end();
    }
    const segs = parts.slice(1);
    // district page: /:lang/area/:pref/:district
    if (segs[0] === 'area' && segs.length === 3) {
      const key = `${lang}|area|${segs[1]}|${segs[2]}|${url.search}`;
      const html = cached(key, () => districtPage(lang, segs[1], segs[2]));
      if (html) return send(res, 200, html);
      return send(res, 404, notFound(lang), 'text/html; charset=utf-8');
    }
    // trailing slash normalisation for known sections
    if (segs.length && !pathname.endsWith('/') && !segs.includes('.')) {
      res.writeHead(301, { location: pathname + '/' });
      return res.end();
    }

    const key = `${lang}|${segs.join('/')}|${url.search}`;
    const html = cached(key, () => renderPage(lang, segs, url));
    if (html) {
      return send(res, 200, html, 'text/html; charset=utf-8', { 'cache-control': 'public, max-age=60' });
    }
    return send(res, 404, notFound(lang), 'text/html; charset=utf-8');
  } catch (err) {
    console.error('[error]', req.method, req.url, err && err.stack ? err.stack : err);
    return send(res, 500, errorPage(), 'text/html; charset=utf-8');
  }
});

// attach slug map
import('./src/data/shops.mjs').then(() => {});

const LANG_HTML = { ja: 'ja', ko: 'ko', en: 'en' };

function notFound(lang) {
  const l = LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const c = {
    ja: { t: 'ページが見つかりませんでした', b: 'URLが変更されたか、掲載が終了した可能性があります。下のリンクから探し直してください。', q: '店舗を探す', h: 'トップへ戻る' },
    ko: { t: '페이지를 찾을 수 없습니다', b: 'URL이 변경되었거나 게재가 종료되었을 수 있습니다. 아래 링크에서 다시 찾아보세요.', q: '점포 찾기', h: '홈으로' },
    en: { t: 'This page could not be found', b: 'The URL may have changed or the listing may have closed. Try searching again below.', q: 'Search venues', h: 'Back to home' },
  }[l];
  return `<!DOCTYPE html><html lang="${LANG_HTML[l] || l}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>404 | BAM-NIGHT</title><meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
:root{color-scheme:dark}
body{margin:0;font-family:system-ui,-apple-system,"Hiragino Sans","Noto Sans JP","Malgun Gothic",sans-serif;
background:radial-gradient(120% 80% at 50% 0%,#1a1526 0%,#07080d 62%);color:#f2f3f7;min-height:100vh;
display:grid;place-items:center;text-align:center;padding:28px 20px;-webkit-text-size-adjust:100%}
.w{max-width:420px;width:100%}
h1{font-size:clamp(3rem,18vw,4.5rem);margin:0 0 6px;line-height:1;
background:linear-gradient(135deg,#f7d791,#e0a83c);-webkit-background-clip:text;background-clip:text;color:transparent}
h2{font-size:1.0625rem;margin:0 0 12px;line-height:1.5;word-break:keep-all}
p{color:#a9aec2;line-height:1.8;font-size:.875rem;margin:0 0 22px;word-break:keep-all;overflow-wrap:anywhere}
a{display:block;padding:14px 18px;border-radius:12px;font-weight:800;text-decoration:none;font-size:.9375rem}
.p{background:linear-gradient(135deg,#f7d791,#e0a83c);color:#171103;margin-bottom:10px}
.s{background:#171a26;color:#e8eaf2;border:1px solid #2b3145}
</style></head>
<body><div class="w"><h1>404</h1><h2>${c.t}</h2><p>${c.b}</p>
<a class="p" href="/${l}/search/">${c.q}</a><a class="s" href="/${l}/">${c.h}</a></div></body></html>`;
}

function errorPage() {
  return `<!DOCTYPE html><html lang="ja"><head><meta charset="utf-8"><title>500</title>
<style>body{font-family:system-ui;background:#07080d;color:#f2f3f7;display:grid;place-items:center;height:100vh;margin:0;text-align:center}</style>
</head><body><div><h1>500</h1><p>サーバーエラーが発生しました。</p><a href="/ja/" style="color:#e0a83c">トップへ</a></div></body></html>`;
}

server.listen(PORT, HOST, () => {
  console.log(`BAM-NIGHT JAPAN listening on http://${HOST}:${PORT}`);
  console.log(`  shops=${SHOPS.length}`);
});
