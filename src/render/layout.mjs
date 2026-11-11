import {collectionScript} from './collection-client.mjs';
import {EDITORIAL_CSS} from './editorial-style.mjs';
// ============================================================================
// BAM-NIGHT JAPAN — Layout shell, design system v8, header/footer
// Mobile-first, zero external assets, WCAG-conscious type scale,
// CJK/Korean-aware line breaking, no horizontal overflow at 320px+.
// ============================================================================

import { t, LANGS, LANG_LABEL, LANG_HTML, pick } from '../i18n.mjs';
const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;
import { CATEGORIES } from '../data/categories.mjs';
import { REGIONS, GEO_STATS } from '../data/geo.mjs';
import { SHOP_COUNT } from '../data/shops.mjs';
import { ATTRIBUTIONS, HAS_REAL_VENUES } from '../data/venues.mjs';
import { yen } from '../data/pricing.mjs';

export const SITE = {
  name: 'BAM-NIGHT JAPAN',
  host: process.env.SITE_HOST || 'bam-night.com',
  // 정적 배포(GitHub Pages のプロジェクトページ)では /bam-night のようなサブパスになる。
  // 空文字なら https://host/ja/ …、'/bam-night' なら https://host/bam-night/ja/ …
  base: (process.env.BASE_PATH || '').replace(/\/$/, ''),
  year: 2026,
  month: '2026-11',
};

/** 사이트 내부 절대경로에 배포 서브패스를 붙인다. */
export const url = (p = '/') => `${SITE.base}${p.startsWith('/') ? p : '/' + p}`;

export const esc = (s) =>
  String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// ---------------------------------------------------------------------------
// CSS — design system v8
// ---------------------------------------------------------------------------
export const CSS = String.raw`
:root{
  /* ---------- light luxury palette ---------- */
  --bg:#fbf9f5;            /* warm ivory */
  --bg2:#f4f1ea;           /* section tint */
  --bg3:#ffffff;
  --panel:#ffffff;
  --panel2:#faf8f3;
  --line:#e6e0d5;          /* hairline */
  --line2:#d5ccbb;
  --ink:#15161c;           /* near-black */
  --ink2:#4b4f5c;
  --ink3:#666a76;
  --ink-inv:#ffffff;
  --gold:#8a6a2e;--gold-key:#a9803a;          /* antique gold (AA on ivory) */
  --gold2:#7d5f28;
  --gold3:#6f5420;
  --gold-wash:#f6efe0;
  --rose:#9c3f63;
  --mint:#2f7a63;
  --violet:#6b5fae;
  --blue:#2f5c8a;
  --shadow-sm:0 1px 2px rgba(21,22,28,.05);
  --shadow:0 10px 30px -12px rgba(21,22,28,.18), 0 2px 8px rgba(21,22,28,.06);
  --shadow-lg:0 28px 60px -24px rgba(21,22,28,.28), 0 4px 14px rgba(21,22,28,.08);
  /* type scale (fluid, mobile-first) */
  --fs-xs:0.6875rem; --fs-sm:0.8125rem; --fs-base:0.9375rem; --fs-md:1rem;
  --fs-lg:1.0625rem; --fs-xl:1.25rem; --fs-2xl:1.5rem; --fs-3xl:1.875rem;
  --lh:1.75; --lh-tight:1.4;
  /* no webfont requests: system stacks only (fast + privacy-friendly) */
  --ff:-apple-system,BlinkMacSystemFont,"Hiragino Kaku Gothic ProN","Hiragino Sans",
    "Noto Sans JP","Yu Gothic",Meiryo,"Apple SD Gothic Neo","Malgun Gothic","Segoe UI",
    Roboto,"Helvetica Neue",Arial,sans-serif;
  --ff-serif:"Hiragino Mincho ProN","Yu Mincho",YuMincho,"Noto Serif JP","Times New Roman",serif;
  --r:14px; --r2:20px; --r3:28px; --head:60px; --pad:16px; --maxw:1200px;
  --grad-gold:linear-gradient(135deg,#e2c489,#c39a4e 46%,#9a7332);
  --grad-ink:linear-gradient(160deg,#ffffff,#faf8f3);
  --grad-ivory:linear-gradient(180deg,#ffffff,#faf8f3);
  color-scheme:light;
}

/* ---------- reset ---------- */
*{box-sizing:border-box}
svg{width:1.05em;height:1.05em;flex:0 0 auto;vertical-align:-.14em;fill:none}
svg[fill=currentColor]{fill:currentColor}
html{
  -webkit-text-size-adjust:100%;
  scroll-behavior:smooth;
  overflow-x:hidden;
}
body{
  margin:0;background:var(--bg);color:var(--ink);
  font-family:var(--ff);font-size:var(--fs-base);line-height:var(--lh);
  -webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;
  overflow-x:hidden;max-width:100vw;text-rendering:optimizeLegibility;
  font-feature-settings:"palt" 0;
}
/* CJK / Korean line breaking: Korean must not break mid-word */
:lang(ko){word-break:keep-all;overflow-wrap:break-word;line-height:1.8;letter-spacing:-0.01em}
:lang(ja){word-break:normal;line-break:strict;overflow-wrap:break-word;letter-spacing:.005em}
:lang(en){word-break:normal;overflow-wrap:break-word;hyphens:auto}
h1,h2,h3,h4,h5,p,li,figcaption{overflow-wrap:break-word}
body.noscroll{overflow:hidden;position:relative}
html.nav-open,html.nav-open body{overflow:hidden;height:100%;touch-action:none}
img{max-width:100%;display:block;height:auto}
a{color:inherit;text-decoration:none}
button{font-family:inherit;cursor:pointer;color:inherit}
input,select,textarea{font-family:inherit;font-size:16px;max-width:100%}
:focus-visible{outline:2px solid var(--gold);outline-offset:3px;border-radius:8px}
[hidden]{display:none!important}

.wrap{width:100%;max-width:var(--maxw);margin:0 auto;padding:0 var(--pad)}
.wrap-wide{max-width:1320px}
.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:fixed;top:-70px;left:12px;z-index:9999;background:var(--gold);color:#1a1508;padding:11px 18px;
  border-radius:10px;font-weight:700;transition:top .2s}
.skip:focus{top:10px}

/* ---------- header ---------- */
.hd{position:sticky;top:0;z-index:200;background:rgba(251,249,245,.86);
  backdrop-filter:saturate(160%) blur(16px);-webkit-backdrop-filter:saturate(160%) blur(16px);
  border-bottom:1px solid var(--line)}
.hd-in{display:flex;align-items:center;gap:10px;height:var(--head);min-width:0}
.logo{display:flex;align-items:center;gap:8px;flex:0 1 auto;min-width:0}
.logo-mark{width:32px;height:32px;border-radius:10px;background:var(--grad-gold);display:grid;place-items:center;
  box-shadow:0 6px 16px -6px rgba(169,128,58,.55);flex:0 0 auto}
.logo-mark svg{width:18px;height:18px;color:#171103;fill:currentColor}
.logo-tx{display:flex;flex-direction:column;line-height:1.08;min-width:0}
.logo-tx b{font-size:1.0625rem;letter-spacing:.045em;font-weight:900;white-space:nowrap;
  font-feature-settings:'ss01';text-transform:uppercase;min-width:0;overflow:hidden;text-overflow:ellipsis}
.logo-tx span{font-size:.5rem;letter-spacing:.155em;color:var(--gold2);font-weight:800;margin-top:3px;white-space:nowrap;opacity:.9}
.nav{display:flex;align-items:center;gap:1px;margin-left:4px;min-width:0}
.nav a{padding:8px 9px;border-radius:9px;font-size:var(--fs-sm);font-weight:600;color:var(--ink2);
  white-space:nowrap;transition:background .18s,color .18s}
.nav a:hover{color:var(--ink);background:var(--panel2)}
.nav a.on{color:#fff;background:var(--ink);font-weight:800}
.hd-right{margin-left:auto;display:flex;align-items:center;gap:7px;flex:0 0 auto}
.hd-search{display:flex;align-items:center;gap:6px;background:#fff;border:1px solid var(--line);
  border-radius:10px;padding:7px 10px;width:230px;transition:border-color .2s,box-shadow .2s}
.hd-search:focus-within{border-color:var(--gold2);box-shadow:0 0 0 3px rgba(169,128,58,.13)}
.hd-search input{background:none;border:0;color:var(--ink);width:100%;outline:0;font-size:var(--fs-sm);min-width:0}
.hd-search input::placeholder{color:var(--ink3)}
.hd-search svg{width:14px;height:14px;color:var(--ink3)}
.langs{display:flex;background:#fff;border:1px solid var(--line);border-radius:10px;padding:3px;gap:1px;flex:0 0 auto}
.langs a{padding:5px 7px;border-radius:7px;font-size:.625rem;font-weight:800;color:var(--ink3);letter-spacing:.04em;line-height:1;
  display:inline-flex;align-items:center;justify-content:center;min-width:30px;min-height:30px}
.langs a.on{background:var(--ink);color:#fff}
.langs a:hover{color:var(--ink)}
.burger{display:none;width:38px;height:38px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);
  color:var(--ink);align-items:center;justify-content:center;flex:0 0 auto;padding:0}
.burger svg{width:19px;height:19px}
.burger .ic-close{display:none}
.burger[aria-expanded="true"] .ic-menu{display:none}
.burger[aria-expanded="true"] .ic-close{display:block}

/* ---------- mobile nav (fixed overlay, scroll-locked) ---------- */
.mnav{position:fixed;left:0;right:0;top:var(--head);bottom:0;z-index:190;background:var(--bg);
  overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;
  padding:14px var(--pad) calc(120px + env(safe-area-inset-bottom));
  display:none;visibility:hidden}
.mnav.open{display:block;visibility:visible;animation:mnavIn .18s ease-out}
@keyframes mnavIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}
.mnav-hd{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px}
.mnav-hd b{font-size:var(--fs-sm);letter-spacing:.12em;color:var(--ink3);text-transform:uppercase}
.mnav-hint{font-size:var(--fs-xs);color:var(--ink3);font-weight:700;white-space:nowrap}
.mnav-x{width:36px;height:36px;border-radius:9px;background:var(--panel2);border:1px solid var(--line);
  display:grid;place-items:center;flex:0 0 auto}
.mnav h4{margin:16px 0 8px;font-size:.625rem;letter-spacing:.14em;color:var(--ink3);
  text-transform:uppercase;font-weight:800}
.mnav a{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:13px 14px;
  border-radius:11px;background:var(--panel2);border:1px solid var(--line);margin-bottom:6px;
  font-weight:600;font-size:var(--fs-base);min-height:46px}
.mnav a:active{background:var(--panel2)}
.mnav a small{color:var(--ink3);font-weight:600;font-size:var(--fs-xs);flex:0 0 auto}
.mnav .grid2{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.mnav-cats{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:18px}
.mnav-cats a{display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:14px 15px;text-decoration:none;min-height:56px}
.mnav-cats a b{font-size:.9375rem;font-weight:800;color:var(--ink);min-width:0}
.mnav-cats a small{font-size:var(--fs-xs);color:var(--gold2);font-weight:800;white-space:nowrap;flex:0 0 auto}
.mnav .grid2 a{justify-content:flex-start;flex-direction:column;align-items:flex-start;gap:2px}

/* ---------- buttons ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:11px;
  padding:12px 18px;font-size:var(--fs-base);font-weight:800;border:1px solid transparent;
  transition:transform .15s,filter .15s,background .15s,border-color .15s;
  white-space:nowrap;line-height:1.25;text-align:center;min-height:44px;max-width:100%}
.btn:active{transform:translateY(1px)}
.btn svg{width:15px;height:15px}
.btn-gold{background:var(--grad-gold);color:#20160a;font-weight:800;letter-spacing:.04em;
  box-shadow:0 10px 26px -12px rgba(140,102,40,.75),inset 0 1px 0 rgba(255,255,255,.42)}
.btn-gold:hover{filter:brightness(1.04) saturate(1.06);box-shadow:0 14px 30px -12px rgba(140,102,40,.8),inset 0 1px 0 rgba(255,255,255,.5)}
.btn-ghost{background:var(--panel2);border-color:var(--line2);color:var(--ink)}
.btn-ghost:hover{background:var(--line)}
.btn-line{background:transparent;border-color:var(--line2);color:var(--ink2)}
.btn-line:hover{color:var(--ink);border-color:#4c5678}
.btn-block{width:100%}

/* ---------- chips ---------- */
.chip{display:inline-flex;align-items:center;gap:5px;background:var(--panel2);border:1px solid var(--line);
  color:var(--ink2);border-radius:999px;padding:5px 11px;font-size:var(--fs-xs);font-weight:700;
  line-height:1.4;white-space:nowrap}
.chip.gold{background:rgba(169,128,58,.12);border-color:rgba(169,128,58,.36);color:var(--gold2)}
.chip.rose{background:rgba(231,102,144,.12);border-color:rgba(231,102,144,.34);color:#8a2f52}
.chip.mint{background:rgba(99,179,148,.13);border-color:rgba(99,179,148,.36);color:#1f6350}

/* ---------- age gate ---------- */
.gate{position:fixed;inset:0;z-index:9000;background:radial-gradient(120% 90% at 50% 0%,var(--gold-wash) 0%,var(--bg) 60%);
  display:grid;place-items:center;padding:16px;overflow-y:auto;-webkit-overflow-scrolling:touch}
.gate-card{width:100%;max-width:440px;background:rgba(255,255,255,.97);border:1px solid var(--line);
  border-radius:20px;padding:26px 20px 20px;text-align:center;box-shadow:0 40px 110px rgba(0,0,0,.72);
  animation:pop .3s cubic-bezier(.2,.9,.3,1.2)}
@keyframes pop{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:none}}
.gate-badge{display:inline-flex;gap:6px;align-items:center;background:rgba(231,102,144,.14);
  color:#8a2f52;border:1px solid rgba(231,102,144,.36);border-radius:999px;padding:5px 13px;
  font-size:var(--fs-xs);font-weight:800;letter-spacing:.05em;white-space:nowrap}
.gate h1{font-size:1.0625rem;margin:14px 0 10px;line-height:1.5;font-weight:800}
.gate p{color:var(--ink2);font-size:var(--fs-sm);line-height:1.8;margin:0 0 16px;text-align:left}
.gate-legal{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin-bottom:16px}
.gate .btn{width:100%;margin-bottom:8px}
.gate-foot{font-size:var(--fs-xs);color:var(--ink3);margin-top:12px;line-height:1.7}
.gate-check{display:flex;gap:8px;align-items:flex-start;text-align:left;font-size:var(--fs-xs);
  color:var(--ink2);margin:2px 0 14px;cursor:pointer;line-height:1.6}
.gate-check input{width:18px;height:18px;margin:0;accent-color:var(--gold);flex:0 0 auto}
.gate-denied{font-size:var(--fs-sm);color:#8a2f52;background:rgba(231,102,144,.1);
  border:1px solid rgba(231,102,144,.3);border-radius:11px;padding:13px;line-height:1.75;display:none}

/* ---------- hero ---------- */
/* ============================================================
   HERO — light luxury: ivory field + framed image card
   ============================================================ */
.hero{position:relative;isolation:isolate;overflow:hidden;
  padding:0 var(--pad);background:var(--bg)}
.hero::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:
    radial-gradient(58% 78% at 88% 8%,rgba(169,128,58,.10),transparent 62%),
    radial-gradient(46% 64% at 6% 92%,rgba(47,122,99,.07),transparent 66%),
    linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%)}
.hero-in{position:relative;width:100%;max-width:var(--maxw);margin:0 auto;min-width:0;
  display:grid;grid-template-columns:1fr;gap:26px;
  padding:26px 0 34px;align-items:center}
.hero-copy{min-width:0}
.hero-top{display:flex;gap:6px;flex-wrap:nowrap;overflow-x:auto;margin-bottom:18px;
  scrollbar-width:none;-ms-overflow-style:none;padding-bottom:2px}
.hero-top::-webkit-scrollbar{display:none}
.hero-top .chip{flex:0 0 auto}
.hero h1{font-size:clamp(1.625rem,6.4vw,3.5rem);line-height:1.18;margin:0 0 16px;
  letter-spacing:-.022em;font-weight:900;color:var(--ink);word-break:keep-all;
  text-wrap:balance}
.hero h1 em{font-style:normal;position:relative;white-space:nowrap}
.hero h1 em::after{content:"";position:absolute;left:-.06em;right:-.06em;bottom:.02em;height:.30em;
  background:var(--grad-gold);opacity:.26;border-radius:2px;z-index:-1}
.hero p{color:var(--ink2);font-size:clamp(.9375rem,3.3vw,1.0625rem);max-width:36em;
  margin:0 0 22px;line-height:1.8;word-break:keep-all}
.hero-stats{display:flex;gap:16px 30px;flex-wrap:wrap;margin-top:24px;padding-top:20px;
  border-top:1px solid var(--line)}
.hero-media{position:relative;margin:0;min-width:0;border-radius:var(--r3);overflow:hidden;
  box-shadow:var(--shadow-lg);aspect-ratio:4/3;background:var(--panel2)}
.hero-media img{width:100%;height:100%;object-fit:cover;display:block}
.hero-media::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,transparent 52%,rgba(21,22,28,.55) 100%)}
.hero-media figcaption{position:absolute;left:0;right:0;bottom:0;z-index:1;
  padding:14px 16px;color:#fff;font-size:var(--fs-xs);font-weight:700;letter-spacing:.02em;
  display:flex;align-items:center;gap:7px}
.hero-media .hm-badge{background:rgba(255,255,255,.94);color:var(--ink);
  border-radius:999px;padding:4px 9px;font-size:.59375rem;font-weight:800;letter-spacing:.02em}
.hero-search{margin-top:22px}
.hstat b{display:block;font-size:1.375rem;font-weight:900;letter-spacing:-.02em;line-height:1.2;
  background:var(--grad-gold);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-fill-color:transparent}
.hstat span{font-size:var(--fs-xs);color:var(--ink3);letter-spacing:.04em;font-weight:700}

/* ---------- search box ---------- */
.sbox{background:#fff;border:1px solid var(--line);box-shadow:var(--shadow);border-radius:16px;padding:11px;
  display:flex;gap:8px;flex-wrap:wrap;box-shadow:var(--shadow);
  backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
.sbox select,.sbox input{background:var(--panel2);border:1px solid var(--line);color:var(--ink);border-radius:10px;
  padding:12px 12px;font-size:var(--fs-base);min-width:0;max-width:100%}
.sbox input[type=search]{flex:1 1 100%}
.sbox select{flex:1 1 calc(50% - 4px);appearance:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23858ba3' stroke-width='2'><path d='M6 9l6 6 6-6'/></svg>");
  background-repeat:no-repeat;background-position:right 10px center;background-size:14px;padding-right:30px}
.sbox .btn{flex:1 1 100%;padding:12px 20px}

/* ---------- sections ---------- */
.sec{padding:40px 0}
.sec.alt{background:var(--bg2)}
.sec.alt2{background:linear-gradient(180deg,#fff,#faf8f3)}
.sec-hd{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:20px;flex-wrap:wrap}
.sec-hd>div{min-width:0}
.sec-hd h2{font-size:clamp(1.125rem,4.2vw,1.75rem);margin:0;letter-spacing:-.01em;font-weight:900;
  line-height:1.35;word-break:keep-all}
.sec-hd p{margin:6px 0 0;color:var(--ink2);font-size:var(--fs-sm);max-width:680px;line-height:1.7}
.eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:.625rem;font-weight:900;
  letter-spacing:.15em;color:var(--gold);text-transform:uppercase;margin-bottom:7px}
.eyebrow::before{content:"";width:16px;height:2px;background:var(--grad-gold);border-radius:2px}

/* ---------- trust ---------- */
.trust{display:grid;grid-template-columns:1fr;gap:10px}
.trust-c{background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line);
  border-radius:var(--r);padding:15px;transition:border-color .2s,transform .2s;min-width:0}
.trust-c:hover{border-color:var(--line2)}
.trust-c .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;margin-bottom:9px;
  background:rgba(169,128,58,.12);color:var(--gold)}
.trust-c .ic svg{width:17px;height:17px}
.trust-c b{display:block;font-size:var(--fs-base);margin-bottom:4px;font-weight:800}
.trust-c span{font-size:var(--fs-xs);color:var(--ink3);line-height:1.65;display:block}

/* ---------- category cards ---------- */
.cats{display:grid;grid-template-columns:1fr;gap:12px}
.cat-c{position:relative;border-radius:var(--r2);overflow:hidden;border:1px solid var(--line);
  background:var(--panel);display:flex;flex-direction:column;transition:border-color .3s,transform .35s var(--ease-out),box-shadow .35s var(--ease-out);
  min-width:0;box-shadow:var(--shadow-sm)}
.cat-c:hover{border-color:var(--line2)}
.cat-c .im{position:relative;z-index:0;pointer-events:none;height:172px;overflow:hidden;background:var(--bg2)}
.cat-c .im img{width:100%;height:100%;object-fit:cover;opacity:1;
  transition:transform .8s var(--ease-out)}
.cat-c:hover .im img{transform:scale(1.045)}
.cat-c .im::after{content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(255,255,255,0) 62%,rgba(255,255,255,.9) 100%)}
@media (hover:hover){.cat-c:hover{transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--line2)}}
.cat-c .body{position:relative;padding:4px 18px 18px;margin-top:-18px;z-index:1;min-width:0}
.cat-c h3{margin:0 0 3px;font-size:var(--fs-xl);font-weight:900;letter-spacing:-.01em;line-height:1.3}
.cat-c .ko{font-size:var(--fs-xs);color:var(--ink3);letter-spacing:.06em;margin-bottom:10px;text-transform:uppercase;
  font-weight:700;line-height:1.5}
.cat-c p{margin:0 0 13px;font-size:var(--fs-sm);color:#4b4f5c;line-height:1.7}
.cat-c .row{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;flex-wrap:wrap}
.cat-c .sum{font-size:var(--fs-md);font-weight:800;color:var(--ink);line-height:1.3;min-width:0;
  font-variant-numeric:tabular-nums}
.cat-c .sum small{display:block;font-size:var(--fs-xs);color:var(--ink3);font-weight:700;
  letter-spacing:.02em;margin-top:2px}
.cat-pill{position:absolute;top:12px;left:12px;z-index:2;background:rgba(255,255,255,.94);
  color:var(--ink);border:1px solid rgba(21,22,28,.08);border-radius:999px;padding:5px 12px;
  font-size:var(--fs-xs);font-weight:800;letter-spacing:.03em;max-width:calc(100% - 24px);
  box-shadow:0 3px 12px -6px rgba(9,10,16,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}

/* ---------- region grid ---------- */
.regions{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.reg-c{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:13px;
  transition:border-color .2s,background .2s;display:flex;flex-direction:column;gap:2px;min-width:0}
.reg-c:hover{border-color:var(--gold);background:var(--panel2)}
.reg-c b{font-size:var(--fs-base);line-height:1.35;word-break:keep-all}
.reg-c small{font-size:var(--fs-xs);color:var(--ink3);line-height:1.5}
.reg-c .n{margin-top:7px;font-size:var(--fs-xs);color:var(--gold);font-weight:800}
.reg-c .n span{color:var(--ink3);font-weight:600}

/* ---------- shop cards ---------- */
.shops{display:grid;grid-template-columns:1fr;gap:12px}
.sc{background:linear-gradient(170deg,var(--panel2),var(--panel));border:1px solid var(--line);
  border-radius:var(--r2);overflow:hidden;display:flex;flex-direction:column;
  transition:transform .2s,border-color .2s,box-shadow .2s;position:relative;min-width:0}
.sc:hover{border-color:var(--line2);box-shadow:0 20px 48px -26px rgba(21,22,28,.45)}
.sc-thumb{position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bg)}
.sc-thumb>a{position:absolute;inset:0;display:block;z-index:1}
.sc-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .45s}
.sc:hover .sc-thumb img{transform:scale(1.04)}
.sc-thumb::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:linear-gradient(180deg,transparent 44%,rgba(9,10,16,.88))}
.sc-thumb.no-img{background:linear-gradient(150deg,#f6f2e9,#efe9db)}
.sc-thumb.no-img>a{display:grid;place-items:center}
.sc-noimg{font-size:.75rem;font-weight:800;letter-spacing:.06em;color:var(--ink3);
  border:1px dashed var(--line2);border-radius:999px;padding:8px 14px;background:rgba(255,255,255,.7)}
.rr-noimg{display:grid;place-items:center;width:100%;height:100%;font-size:9px;color:var(--ink3);
  background:var(--bg2);border-radius:8px}
.sc-badges{position:absolute;top:8px;left:8px;display:flex;gap:4px;flex-wrap:wrap;z-index:2;
  pointer-events:none;max-width:calc(100% - 72px)}
.bdg{font-size:.59375rem;font-weight:900;letter-spacing:.02em;padding:3.5px 7px;border-radius:6px;
  line-height:1.5;white-space:nowrap;color:var(--ink);
  background:rgba(255,255,255,.94);border:1px solid rgba(255,255,255,.7);
  box-shadow:0 2px 8px -3px rgba(9,10,16,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.bdg-vip{background:var(--grad-gold);color:#20160a;border-color:rgba(255,255,255,.5)}
.bdg-pr{background:rgba(107,95,174,.95);color:#fff;border-color:rgba(255,255,255,.45)}
.bdg-new{background:rgba(47,122,99,.95);color:#fff;border-color:rgba(255,255,255,.45)}
.bdg-ai{background:rgba(255,255,255,.94);color:var(--ink2);border:1px solid rgba(21,22,28,.08)}
.bdg-cat{background:rgba(255,255,255,.94);color:var(--ink);border:1px solid rgba(21,22,28,.08)}
.bdg-sample{background:rgba(255,244,222,.96);color:#7a5510;border:1px solid rgba(169,128,58,.55)}
.bdg-real{background:rgba(47,122,99,.95);color:#fff;border:1px solid rgba(255,255,255,.45)}


.sc-pts{position:absolute;top:8px;right:8px;z-index:2;background:rgba(255,255,255,.95);
  border:1px solid rgba(169,128,58,.4);color:#4a3714;font-size:.59375rem;font-weight:900;
  padding:3px 7px;border-radius:999px;pointer-events:none;white-space:nowrap}
.sc-body{padding:13px 14px 14px;display:flex;flex-direction:column;gap:6px;flex:1;min-width:0}
.sc-name{font-size:var(--fs-md);font-weight:800;line-height:1.42;letter-spacing:-.005em;
  margin:0;word-break:keep-all}
.sc-meta{font-size:var(--fs-xs);color:var(--ink3);display:flex;align-items:center;gap:5px;
  flex-wrap:wrap;line-height:1.6}
.sc-meta .dot{width:3px;height:3px;border-radius:50%;background:var(--ink3);flex:0 0 auto}
.sc-feats{display:flex;gap:4px;flex-wrap:wrap}
.fchip{font-size:.59375rem;font-weight:800;background:var(--bg2);border:1px solid var(--line);color:#4b4f5c;
  border-radius:5px;padding:2px 6px;letter-spacing:.01em;line-height:1.6;white-space:nowrap}
.fchip.on-ko{background:rgba(99,179,148,.15);border-color:rgba(99,179,148,.36);color:#1f6350}
.fchip.on-en{background:rgba(154,142,232,.15);border-color:rgba(154,142,232,.36);color:#4a4278}
.sc-price{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-top:auto;
  padding-top:9px;border-top:1px solid var(--line);flex-wrap:wrap}
.price-all{display:flex;flex-direction:column;line-height:1.2;min-width:0}
.price-all small{font-size:.59375rem;color:var(--ink3);font-weight:700;letter-spacing:.02em}
.price-all b{font-size:1.1875rem;font-weight:900;color:var(--ink);letter-spacing:-.02em}
.price-all b i{font-style:normal;font-size:var(--fs-xs);color:var(--ink3);font-weight:700;margin-left:2px}
.rating{display:flex;align-items:center;gap:3px;font-size:var(--fs-sm);font-weight:800;
  color:var(--gold2);flex:0 0 auto}
.rating svg{width:11px;height:11px}
.rating span{color:var(--ink3);font-weight:600;font-size:var(--fs-xs)}
.sc-coupon{display:flex;align-items:center;gap:5px;background:rgba(231,102,144,.1);
  border:1px dashed rgba(231,102,144,.4);border-radius:7px;padding:5px 8px;
  font-size:var(--fs-xs);font-weight:800;color:#8a2f52;line-height:1.5}
.sc-coupon svg{width:12px;height:12px;flex:0 0 auto}
.sc-coupon span{min-width:0;overflow-wrap:anywhere}

/* ---------- rank rows ---------- */
.ranklist{display:flex;flex-direction:column;gap:7px}
.rr{display:grid;grid-template-columns:26px 46px minmax(0,1fr) auto;gap:8px;align-items:center;
  background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 10px 8px 6px;
  transition:background .18s,border-color .18s;min-width:0}
.rr:hover{background:var(--panel2);border-color:var(--line2)}
.rr-no{font-size:var(--fs-sm);font-weight:900;color:var(--ink3);text-align:center;line-height:1}
.rr-no.top{color:var(--gold)}
.rr-im{width:46px;height:46px;border-radius:9px;overflow:hidden;background:var(--bg);flex:0 0 auto}
.rr-im img{width:100%;height:100%;object-fit:cover}
.rr-tx{min-width:0}
.rr-tx b{display:block;font-size:var(--fs-sm);font-weight:800;line-height:1.4;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr-tx small{font-size:var(--fs-xs);color:var(--ink3);line-height:1.4;
  display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr-pt{font-size:var(--fs-xs);font-weight:900;color:var(--gold2);white-space:nowrap}

/* ---------- prefecture / district lists ---------- */
.pref-grid{display:grid;grid-template-columns:1fr;gap:10px}
.pref-c{background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:13px;
  transition:border-color .2s,background .2s;min-width:0}
.pref-c:hover{border-color:var(--line2);background:var(--panel2)}
.pref-c .hd2{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px;min-width:0}
.pref-c b{font-size:var(--fs-base);line-height:1.4;word-break:keep-all;min-width:0}
.pref-c .cnt{font-size:var(--fs-xs);color:var(--gold);font-weight:800;background:rgba(169,128,58,.1);
  border:1px solid rgba(169,128,58,.28);border-radius:999px;padding:2px 8px;white-space:nowrap;flex:0 0 auto}
.dlist{display:flex;flex-wrap:wrap;gap:4px}
.dlist a,.dlist span{font-size:var(--fs-xs);color:var(--ink2);background:var(--panel2);
  border:1px solid var(--line);border-radius:6px;padding:5px 9px;transition:all .15s;
  line-height:1.5;min-height:28px;display:inline-flex;align-items:center}
.dlist a:hover{color:#161005;background:var(--grad-gold);border-color:transparent}

/* ---------- tables ---------- */
.tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);
  border-radius:var(--r);background:var(--panel);max-width:100%}
table.tbl{width:100%;border-collapse:collapse;font-size:var(--fs-sm);min-width:0}
table.tbl th{text-align:left;padding:11px 12px;background:var(--panel2);color:var(--ink2);
  font-size:var(--fs-xs);font-weight:800;letter-spacing:.04em;text-transform:uppercase;
  border-bottom:1px solid var(--line);white-space:nowrap}
table.tbl td{padding:11px 12px;border-bottom:1px solid var(--bg2);vertical-align:middle;
  line-height:1.55;word-break:keep-all}
table.tbl tr:last-child td{border-bottom:0}
table.tbl tbody tr:hover{background:var(--panel2)}
table.tbl td.num{font-variant-numeric:tabular-nums;font-weight:800;white-space:nowrap;text-align:right}
table.tbl .up{color:var(--rose)}
table.tbl .low{color:var(--mint)}
table.tbl a.rowlink{font-weight:700;display:inline-flex;align-items:center;min-height:28px}
table.tbl a.rowlink:hover{color:var(--gold2)}
.card table.tbl{min-width:0}

/* ---------- calculator ---------- */
.calc{display:grid;grid-template-columns:1fr;gap:14px;align-items:start}
.calc-form{background:var(--panel);border:1px solid var(--line);border-radius:var(--r2);padding:18px;min-width:0}
.calc-row{display:grid;grid-template-columns:1fr;gap:11px;margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:5px;min-width:0}
.field label{font-size:var(--fs-xs);font-weight:800;color:var(--ink2);letter-spacing:.02em;
  line-height:1.5;display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.field select,.field input[type=number]{background:var(--bg3);border:1px solid var(--line);color:var(--ink);
  border-radius:9px;padding:11px 11px;font-size:var(--fs-base);width:100%;min-width:0}
.field select:focus,.field input:focus{border-color:var(--gold);outline:0;
  box-shadow:0 0 0 3px rgba(169,128,58,.13)}
.toggles{display:flex;flex-direction:column;gap:10px;margin:4px 0 14px}
.tg{display:flex;align-items:center;gap:10px;font-size:var(--fs-sm);color:var(--ink2);
  cursor:pointer;font-weight:600;line-height:1.5;min-height:32px}
.tg input{appearance:none;width:40px;height:23px;border-radius:999px;background:var(--line);
  position:relative;transition:background .2s;flex:0 0 auto;cursor:pointer;border:0;margin:0}
.tg input::after{content:"";position:absolute;top:3px;left:3px;width:17px;height:17px;
  border-radius:50%;background:#8f96ad;transition:left .2s,background .2s}
.tg input:checked{background:rgba(169,128,58,.36)}
.tg input:checked::after{left:20px;background:var(--gold)}
.calc-out{background:linear-gradient(165deg,#ffffff,#faf8f3);border:1px solid var(--line2);
  border-radius:var(--r2);padding:18px;min-width:0}
.calc-total{text-align:center;padding-bottom:14px;margin-bottom:12px;border-bottom:1px dashed var(--line2)}
.calc-total small{display:block;font-size:var(--fs-xs);color:var(--ink3);font-weight:800;
  letter-spacing:.04em;margin-bottom:4px;line-height:1.5}
.calc-total b{font-size:clamp(1.75rem,9vw,2.5rem);font-weight:900;letter-spacing:-.03em;
  background:var(--grad-gold);-webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums;display:block;line-height:1.15}
.calc-total em{font-style:normal;font-size:var(--fs-xs);color:var(--ink3);font-weight:700;
  display:block;margin-top:6px;line-height:1.6}
.calc-lines{display:flex;flex-direction:column;gap:7px;font-size:var(--fs-sm);margin-bottom:12px}
.calc-line{display:flex;justify-content:space-between;gap:10px;color:var(--ink2);line-height:1.6}
.calc-line span{min-width:0;word-break:keep-all}
.calc-line b{font-variant-numeric:tabular-nums;color:var(--ink);font-weight:800;white-space:nowrap;flex:0 0 auto}
.calc-line.disc b{color:var(--mint)}
.calc-line.sum{border-top:1px solid var(--line2);padding-top:8px;font-weight:800;color:var(--ink)}
.calc-mini{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}
.calc-mini div{background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:9px 10px;
  text-align:center;min-width:0}
.calc-mini small{display:block;font-size:.59375rem;color:var(--ink3);font-weight:700;
  margin-bottom:3px;letter-spacing:.02em;line-height:1.5}
.calc-mini b{font-size:var(--fs-md);font-weight:900;color:var(--gold2);font-variant-numeric:tabular-nums;
  line-height:1.3;display:block}

/* ---------- ROI ---------- */
.roi{display:grid;grid-template-columns:1fr;gap:14px;align-items:start}
.roi-out{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.roi-k{background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:12px;min-width:0}
.roi-k small{display:block;font-size:.59375rem;color:var(--ink3);font-weight:800;
  letter-spacing:.03em;margin-bottom:4px;line-height:1.5}
.roi-k b{font-size:var(--fs-lg);font-weight:900;font-variant-numeric:tabular-nums;
  display:block;line-height:1.3;word-break:break-word}
.roi-k.good b{color:var(--mint)}
.roi-bar{grid-column:1/-1;background:var(--panel2);border:1px solid var(--line);border-radius:11px;padding:12px}
.roi-track{height:8px;background:var(--line);border-radius:999px;overflow:hidden;margin-top:8px}
.roi-fill{height:100%;background:var(--grad-gold);border-radius:999px;transition:width .35s}

/* ---------- plans ---------- */
.plans{display:grid;grid-template-columns:1fr;gap:12px;align-items:stretch}
.plan{background:linear-gradient(170deg,var(--panel2),var(--panel));border:1px solid var(--line);
  border-radius:var(--r2);padding:18px 16px;display:flex;flex-direction:column;position:relative;
  transition:transform .2s,border-color .2s;min-width:0}
.plan:hover{border-color:var(--line2)}
.plan.best{border-color:rgba(169,128,58,.55);background:linear-gradient(180deg,#fffdf8,#fff);
  box-shadow:0 0 0 1px rgba(169,128,58,.14),0 24px 50px -24px rgba(120,88,36,.4)}
.plan .pl-price{font-variant-numeric:tabular-nums}
.plan-best-tag{position:absolute;top:-10px;left:50%;transform:translateX(-50%);background:var(--grad-gold);
  color:#171103;font-size:.59375rem;font-weight:900;letter-spacing:.08em;padding:3px 11px;
  border-radius:999px;white-space:nowrap}
.plan h4{margin:0 0 2px;font-size:var(--fs-base);font-weight:900;line-height:1.4}
.plan .pl-price{font-size:1.5rem;font-weight:900;letter-spacing:-.03em;margin:8px 0 2px;
  font-variant-numeric:tabular-nums;line-height:1.2;word-break:break-word}
.plan .pl-price small{font-size:var(--fs-xs);color:var(--ink3);font-weight:700;letter-spacing:0}
.plan ul{list-style:none;padding:0;margin:12px 0 14px;display:flex;flex-direction:column;gap:6px;
  font-size:var(--fs-xs);color:var(--ink2);line-height:1.65}
.plan li{display:flex;gap:6px;align-items:flex-start;min-width:0}
.plan li svg{width:12px;height:12px;flex:0 0 auto;margin-top:3px;color:var(--mint)}
.plan li span{min-width:0}
.plan .btn{margin-top:auto;font-size:var(--fs-sm);padding:11px 10px}

/* ---------- forms ---------- */
.form{background:var(--panel);border:1px solid var(--line);border-radius:var(--r2);padding:18px}
.form-grid{display:grid;grid-template-columns:1fr;gap:12px}
.form-grid .full{grid-column:1/-1}
.form label{display:block;font-size:var(--fs-xs);font-weight:800;color:var(--ink2);
  margin-bottom:5px;letter-spacing:.02em;line-height:1.5}
.form label .req{color:var(--rose);margin-left:3px}
.form input,.form select,.form textarea{width:100%;background:var(--bg3);border:1px solid var(--line);
  color:var(--ink);border-radius:9px;padding:11px 11px;font-size:16px;transition:border-color .15s;min-width:0}
.form input:focus,.form select:focus,.form textarea:focus{border-color:var(--gold);outline:0;
  box-shadow:0 0 0 3px rgba(169,128,58,.12)}
.form textarea{min-height:92px;resize:vertical}
.form .err{border-color:var(--rose)!important;box-shadow:0 0 0 3px rgba(231,102,144,.14)!important}
.err-msg{font-size:var(--fs-xs);color:#8a2f52;margin-top:4px;display:none;font-weight:700}
.err-msg.show{display:block}
.form-consent{display:flex;gap:8px;align-items:flex-start;font-size:var(--fs-xs);color:var(--ink2);
  margin:14px 0;line-height:1.65;cursor:pointer}
.form-consent input{width:18px;height:18px;margin:1px 0 0;accent-color:var(--gold);flex:0 0 auto}
.form-status{margin-top:12px;padding:11px 13px;border-radius:10px;font-size:var(--fs-sm);
  font-weight:700;display:none;line-height:1.6}
.form-status.ok{display:block;background:rgba(99,179,148,.14);border:1px solid rgba(99,179,148,.42);color:#1f6350}
.form-status.ng{display:block;background:rgba(231,102,144,.12);border:1px solid rgba(231,102,144,.42);color:#8a2f52}

/* ---------- prose / legal ---------- */
.prose{max-width:100%;min-width:0}
.prose h2{font-size:1.125rem;margin:30px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--line);
  font-weight:900;line-height:1.45;word-break:keep-all}
.prose h3{font-size:var(--fs-base);margin:20px 0 7px;font-weight:800;color:var(--gold2);line-height:1.5}
.prose p,.prose li{color:var(--ink2);font-size:var(--fs-sm);line-height:1.95}
.prose ul,.prose ol{padding-left:18px;margin:10px 0}
.prose li{margin-bottom:6px}
.prose strong{color:var(--ink)}
.prose table{width:100%;border-collapse:collapse;font-size:var(--fs-sm);margin:12px 0;
  display:block;overflow-x:auto}
.prose th,.prose td{border:1px solid var(--line);padding:9px 11px;text-align:left;
  vertical-align:top;line-height:1.7}
.prose th{background:var(--panel2);color:var(--ink2);font-size:var(--fs-xs);width:34%;font-weight:800}
.prose td{color:var(--ink2)}
.notice{border-radius:var(--r);padding:14px 15px;font-size:var(--fs-sm);line-height:1.85;
  margin:16px 0;border:1px solid rgba(169,128,58,.32);background:rgba(169,128,58,.07);color:#6b4e22}
.notice.mint{border-color:rgba(99,179,148,.36);background:rgba(99,179,148,.08);color:#1c5b47}
.notice.rose{border-color:rgba(231,102,144,.36);background:rgba(231,102,144,.08);color:#8a2f52}
.notice.amber{border-color:rgba(232,168,58,.42);background:rgba(232,168,58,.09);color:#7a5510}
.notice b{color:var(--ink)}

/* ---------- page header ---------- */
.ph{background:linear-gradient(180deg,var(--panel),var(--bg));border-bottom:1px solid var(--line);
  padding:26px 0 22px;position:relative;overflow:hidden}
.ph::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(60% 100% at 82% 0%,rgba(154,142,232,.13),transparent 66%)}
.crumb{display:flex;align-items:center;gap:6px;font-size:var(--fs-xs);color:var(--ink3);
  margin-bottom:10px;flex-wrap:wrap;position:relative;z-index:1;line-height:1.6}
.crumb a:hover{color:var(--gold2)}
.crumb svg{width:9px;height:9px;opacity:.6}
.crumb span{overflow-wrap:anywhere}
.ph h1{font-size:clamp(1.1875rem,5.2vw,2rem);margin:0 0 9px;line-height:1.38;
  letter-spacing:-.015em;font-weight:900;position:relative;z-index:1;word-break:keep-all}
.ph p{color:var(--ink2);font-size:var(--fs-sm);margin:0;max-width:760px;line-height:1.85;
  position:relative;z-index:1}
.ph-row{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px;position:relative;z-index:1}

/* ---------- filters ---------- */
.filters{background:var(--panel);border:1px solid var(--line);border-radius:var(--r2);
  padding:13px;margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-width:0}
.filters select,.filters input[type=search]{background:var(--bg3);border:1px solid var(--line);
  color:var(--ink);border-radius:9px;padding:10px 11px;font-size:var(--fs-sm);min-width:0;
  flex:1 1 46%}
.filters select:focus,.filters input:focus{border-color:var(--gold);outline:0}
.filters .btn{flex:1 1 auto}
.filters .spacer{flex:1}
.filters .cnt{font-size:var(--fs-sm);color:var(--ink3);font-weight:700;white-space:nowrap}
.filters .cnt b{color:var(--gold2);font-size:var(--fs-md)}
.fchips{display:flex;gap:5px;flex-wrap:wrap;width:100%}
.fchips button{background:var(--panel2);border:1px solid var(--line);color:var(--ink2);border-radius:999px;
  padding:7px 12px;font-size:var(--fs-xs);font-weight:800;transition:all .15s;
  min-height:38px;display:inline-flex;align-items:center;line-height:1.4}
.fchips button.on{background:var(--grad-gold);color:#161005;border-color:transparent}
.fchips button:hover{border-color:var(--line2)}

/* ---------- tabs ---------- */
.tabs{display:flex;gap:3px;background:var(--panel);border:1px solid var(--line);border-radius:12px;
  padding:4px;margin-bottom:16px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.tabs::-webkit-scrollbar{display:none}
.tabs a,.tabs button{flex:0 0 auto;padding:9px 13px;border-radius:8px;font-size:var(--fs-sm);
  font-weight:800;color:var(--ink3);background:none;border:0;white-space:nowrap;transition:all .15s;
  min-height:38px;display:inline-flex;align-items:center}
.tabs a.on,.tabs button.on{background:var(--line);color:var(--ink)}
.tabs a:hover,.tabs button:hover{color:var(--ink)}

/* ---------- ads ---------- */
.ad-hero{position:relative;border-radius:var(--r3);overflow:hidden;border:1px solid rgba(169,128,58,.34);
  background:#fff;display:grid;grid-template-columns:1fr;box-shadow:var(--shadow)}
.ad-hero img{position:relative;inset:auto;width:100%;height:196px;object-fit:cover;z-index:0;display:block}
.ad-hero::after{content:none}
.ad-hero-in{position:relative;z-index:2;padding:22px;min-width:0;
  background:linear-gradient(160deg,#fff,#faf8f3)}
@media (min-width:760px){
  .ad-hero{grid-template-columns:1.08fr .92fr;align-items:stretch}
  .ad-hero img{height:100%;min-height:250px}
  .ad-hero-in{padding:26px 28px;display:flex;flex-direction:column;justify-content:center}
}
.ad-hero h3{margin:8px 0 7px;font-size:clamp(1.0625rem,4vw,1.6rem);font-weight:900;
  line-height:1.35;word-break:keep-all}
.ad-hero p{margin:0 0 14px;color:var(--ink2);font-size:var(--fs-sm);line-height:1.75;max-width:44ch}
.ad-tag{display:inline-block;font-size:.59375rem;font-weight:900;letter-spacing:.12em;
  background:var(--grad-gold);color:#171103;padding:3px 9px;border-radius:5px;white-space:nowrap}
.ad-strip{border:1px dashed var(--line2);border-radius:var(--r);padding:12px 14px;
  display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:rgba(154,142,232,.05);flex-wrap:wrap;min-width:0}
.ad-strip>div{min-width:0;flex:1 1 200px}
.ad-strip b{font-size:var(--fs-sm);line-height:1.6;display:block}
.ad-strip small{display:block;font-size:var(--fs-xs);color:var(--ink3);margin-top:3px;line-height:1.6}
.ad-side{background:linear-gradient(160deg,var(--panel2),var(--panel));border:1px solid var(--line2);
  border-radius:var(--r2);padding:16px;position:relative;overflow:hidden;min-width:0}
.ad-side::before{content:"";position:absolute;top:-40px;right:-40px;width:110px;height:110px;
  border-radius:50%;background:radial-gradient(circle,rgba(169,128,58,.22),transparent 70%);
  pointer-events:none}
.ad-side h4{margin:0 0 6px;font-size:var(--fs-sm);font-weight:900;position:relative;
  display:flex;align-items:center;gap:6px;line-height:1.5}
.ad-side h4 svg{width:14px;height:14px;color:var(--gold)}
.ad-side p{margin:0 0 11px;font-size:var(--fs-xs);color:var(--ink3);line-height:1.7;position:relative}
.ad-side .tags{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:11px;position:relative}

/* ---------- layout splits ---------- */
.split{display:grid;grid-template-columns:1fr;gap:18px;align-items:start;min-width:0}
.side-stack{display:flex;flex-direction:column;gap:12px;min-width:0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:var(--r2);padding:16px;min-width:0}
.card h4{margin:0 0 11px;font-size:var(--fs-sm);font-weight:900;letter-spacing:.01em;
  display:flex;align-items:center;gap:6px;flex-wrap:wrap;line-height:1.5}
.card h4 svg{width:14px;height:14px;flex:0 0 auto;color:var(--gold)}

/* ---------- shop detail ---------- */
.det-hero{display:grid;grid-template-columns:1fr;border-radius:var(--r2);overflow:hidden;
  border:1px solid var(--line);background:var(--panel);min-width:0}
.det-hero.no-media{grid-template-columns:1fr}
.det-hero.no-media .det-info{max-width:720px}
.det-gal{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto auto;gap:2px;
  aspect-ratio:16/13;min-width:0}
.det-gal a{overflow:hidden;position:relative;display:block;background:var(--bg);min-width:0}
.det-gal a:first-child{grid-column:1/-1}
.det-gal img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.det-gal a:hover img{transform:scale(1.04)}
.det-info{padding:18px;min-width:0}
.det-info h1{font-size:clamp(1.125rem,4.6vw,1.5rem);margin:7px 0 7px;line-height:1.4;
  font-weight:900;word-break:keep-all}
.det-info .sub{font-size:var(--fs-xs);color:var(--ink3);margin-bottom:12px;line-height:1.7}
.det-boxes{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:12px 0}
.dbox{background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:9px 11px;min-width:0}
.dbox small{display:block;font-size:.59375rem;color:var(--ink3);font-weight:800;
  letter-spacing:.03em;margin-bottom:3px;line-height:1.5}
.dbox b{font-size:var(--fs-sm);font-weight:800;line-height:1.45;word-break:keep-all;display:block}
.maplike{height:158px;border-radius:12px;border:1px solid var(--line);overflow:hidden;position:relative;
  background-color:#f7f4ed;
  background-image:
    radial-gradient(circle at 50% 46%,rgba(169,128,58,.2),transparent 46%),
    linear-gradient(135deg,#faf8f3,#f1ece1),
    repeating-linear-gradient(0deg,var(--panel2) 0 1px,transparent 1px 24px),
    repeating-linear-gradient(90deg,var(--panel2) 0 1px,transparent 1px 24px);
  display:grid;place-items:center}
.maplike .pin{width:34px;height:34px;border-radius:50%;background:var(--grad-gold);
  display:grid;place-items:center;color:#20160a;
  box-shadow:0 0 0 7px rgba(169,128,58,.15),0 0 0 15px rgba(169,128,58,.07),0 6px 16px -6px rgba(120,88,36,.6)}
.maplike .pin svg{width:16px;height:16px}
.maplike .lbl{position:absolute;bottom:8px;left:8px;font-size:var(--fs-xs);color:var(--ink2);
  background:rgba(255,255,255,.93);padding:4px 9px;border-radius:6px;border:1px solid var(--line);
  max-width:calc(100% - 16px);font-weight:700;
  box-shadow:0 2px 8px -4px rgba(21,22,28,.35)}

/* ---------- FAQ ---------- */
.faq details{background:var(--panel);border:1px solid var(--line);border-radius:12px;
  margin-bottom:8px;overflow:hidden}
.faq summary{padding:13px 15px;font-size:var(--fs-sm);font-weight:800;cursor:pointer;
  list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;
  line-height:1.6;min-height:44px}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";color:var(--gold);font-size:1.1875rem;font-weight:400;
  line-height:1;flex:0 0 auto}
.faq details[open] summary::after{content:"–"}
.faq details[open] summary{border-bottom:1px solid var(--line)}
.faq .ans{padding:12px 15px;font-size:var(--fs-sm);color:var(--ink2);line-height:1.9}

/* ---------- steps ---------- */
.steps{display:grid;grid-template-columns:1fr;gap:10px;counter-reset:s}
.step{background:var(--panel);border:1px solid var(--line);border-radius:var(--r);padding:16px;
  position:relative;counter-increment:s;min-width:0}
.step::before{content:counter(s,decimal-leading-zero);position:absolute;top:11px;right:13px;
  font-size:1.5rem;font-weight:900;color:var(--line);letter-spacing:-.04em;line-height:1}
.step b{display:block;font-size:var(--fs-base);margin-bottom:5px;position:relative;
  line-height:1.5;padding-right:34px}
.step p{margin:0;font-size:var(--fs-xs);color:var(--ink3);line-height:1.75}

/* ---------- footer ---------- */
.ft{background:linear-gradient(180deg,#1b1a17,#14130f);border-top:1px solid rgba(169,128,58,.3);
  padding:40px 0 26px;margin-top:16px;color:#efe9dc}
.ft .logo-tx b{color:#fbf9f5}
.ft .logo-tx span{color:#d9b878;opacity:1}
.ft h5{color:#b8ae9b!important}
.ft a{color:#ddd6c8}
.ft a:hover{color:#e8c98c}
.ft-about p,.ft-bot,.ft-bot .ops{color:#a89f8f}
.ft ul{list-style:none}
.ft-grid{display:grid;grid-template-columns:1fr;gap:24px}
.ft-about p{font-size:var(--fs-xs);color:var(--ink3);line-height:1.9;margin:11px 0 0;max-width:340px}
.ft h5{font-size:.625rem;letter-spacing:.13em;text-transform:uppercase;color:#b8ae9b;
  margin:0 0 10px;font-weight:900}
.ft ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px}
.ft a{font-size:var(--fs-sm);color:var(--ink2);line-height:1.7;display:inline-block;
  padding:2px 0;min-height:26px}
.ft a:hover{color:#e8c98c}
.ft-badges{display:flex;gap:5px;flex-wrap:wrap;margin-top:12px}
.ft-bot{margin-top:28px;padding-top:18px;border-top:1px solid rgba(255,255,255,.12);display:flex;
  justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:var(--fs-xs);color:var(--ink3);
  line-height:1.8}
.ft-bot .ops{line-height:1.85}
.ft-src{margin-top:24px;padding:14px 16px;border:1px solid rgba(255,255,255,.14);border-radius:12px;
  background:rgba(255,255,255,.04)}
.ft-src b{display:block;font-size:.6875rem;letter-spacing:.08em;color:#d9b878;margin-bottom:8px}
.ft-src ul{margin:0;padding-left:16px;display:grid;gap:4px}
.ft-src li{font-size:.6875rem;color:#b8ae9b;line-height:1.7;word-break:break-word}
.ft-src p{margin:8px 0 0;font-size:.625rem;color:#8f8676;line-height:1.7}
.srcbox{margin-top:16px;padding:13px 15px;border:1px solid rgba(201,169,97,.35);border-radius:12px;background:rgba(201,169,97,.06)}
.srcbox b{display:block;font-size:.6875rem;letter-spacing:.06em;color:var(--gold2);margin-bottom:6px}
.srcbox p{margin:0 0 5px;font-size:.75rem;line-height:1.7;color:var(--tx)}
.srcbox p.warnline{color:#c99a4a}
.srcbox p.mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:.625rem;word-break:break-all;color:var(--mut)}
.srcbox p.small{font-size:.6875rem}
.ft .chip{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16);color:#e4dccb}

/* ---------- mobile tab bar ---------- */
.mbar{display:none;position:fixed;bottom:0;left:0;right:0;z-index:180;
  background:rgba(251,249,245,.94);backdrop-filter:blur(18px) saturate(180%);-webkit-backdrop-filter:blur(18px) saturate(180%);
  border-top:1px solid var(--line);
  padding:5px 2px calc(5px + env(safe-area-inset-bottom));grid-template-columns:repeat(5,1fr)}
.mbar a{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
  padding:6px 2px;font-size:.5625rem;font-weight:800;color:var(--ink3);border-radius:8px;
  min-height:44px;line-height:1.3;text-align:center}
.mbar a.on{color:var(--gold3)}
.mbar svg{width:18px;height:18px}
.mbar span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ---------- toast / lightbox ---------- */
.toast{position:fixed;left:50%;bottom:calc(78px + env(safe-area-inset-bottom));z-index:500;
  transform:translate(-50%,180%);opacity:0;pointer-events:none;background:var(--panel2);
  border:1px solid var(--line2);color:var(--ink);padding:11px 17px;border-radius:11px;
  font-size:var(--fs-sm);font-weight:700;box-shadow:var(--shadow);
  transition:transform .3s cubic-bezier(.2,.9,.3,1.2),opacity .3s;max-width:calc(100vw - 32px);
  text-align:center;line-height:1.55}
.toast.show{transform:translate(-50%,0);opacity:1}
.lb{position:fixed;inset:0;z-index:800;background:rgba(10,10,12,.93);display:none;place-items:center;
  padding:16px}
.lb.open{display:grid}
.lb img{max-width:min(1000px,94vw);max-height:82vh;border-radius:12px;object-fit:contain}
.lb img[src^="data:image/gif"]{display:none}
.lb-x{position:absolute;top:12px;right:12px;width:42px;height:42px;border-radius:50%;
  background:var(--panel2);border:1px solid var(--line2);color:#fff;font-size:1.25rem;
  display:grid;place-items:center;line-height:1}

/* ---------- utilities ---------- */
.grid2{display:grid;grid-template-columns:1fr;gap:12px}
.grid3{display:grid;grid-template-columns:1fr;gap:12px}
.grid3>*,.grid2>*,.split>*,.calc>*,.roi>*{min-width:0}
.stack{display:flex;flex-direction:column;gap:12px}
.mt8{margin-top:8px}.mt16{margin-top:16px}.mt24{margin-top:24px}
.tc{text-align:center}
.muted{color:var(--ink3)}
.small{font-size:var(--fs-sm);line-height:1.75}
.big-num{font-variant-numeric:tabular-nums}
.pill-row{display:flex;gap:5px;flex-wrap:wrap}
.legend{display:flex;gap:12px;flex-wrap:wrap;font-size:var(--fs-xs);color:var(--ink3);margin-top:9px}
.legend i{display:inline-block;width:7px;height:7px;border-radius:2px;margin-right:5px}
[day]{scroll-margin-top:calc(var(--head) + 16px)}
[id]{scroll-margin-top:calc(var(--head) + 16px)}
h1 svg,h2 svg,h3 svg,h4 svg,h5 svg{width:1em;height:1em;vertical-align:-.12em}

/* ==========================================================================
   BREAKPOINTS  — 480 / 700 / 900 / 1100
   ========================================================================== */
@media(min-width:480px){
  .regions{grid-template-columns:1fr 1fr 1fr}
  .sbox input[type=search]{flex:1 1 100%}
  .sbox select{flex:1 1 calc(33% - 6px)}
  .filters select,.filters input[type=search]{flex:1 1 30%}
  .roi-out{grid-template-columns:1fr 1fr}
  .grid2{grid-template-columns:1fr 1fr}
}
@media(min-width:600px){
  :root{--pad:20px;--head:64px}
  .sec{padding:48px 0}
  .trust{grid-template-columns:1fr 1fr}
  .shops{grid-template-columns:1fr 1fr}
  .pref-grid{grid-template-columns:1fr 1fr}
  .cats{grid-template-columns:1fr}
  .det-hero.no-media{grid-template-columns:1fr}
.det-hero.no-media .det-info{max-width:720px}
.det-gal{aspect-ratio:16/11}
  .form-grid{grid-template-columns:1fr 1fr}
  .calc-row{grid-template-columns:1fr 1fr}
  .ft-grid{grid-template-columns:1fr 1fr}
  .calc-mini{grid-template-columns:1fr 1fr}
  .hero-in{grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);gap:38px;padding:40px 0 48px}
  .hero-media{aspect-ratio:5/4}
}
@media(min-width:700px){
  .plans{grid-template-columns:1fr 1fr}
  .grid3{grid-template-columns:1fr 1fr}
  .steps{grid-template-columns:1fr 1fr}
  .roi-out{grid-template-columns:1fr 1fr}
  .mnav .grid2{grid-template-columns:1fr 1fr}
}
@media(min-width:900px){
  .hero-in{padding:56px 0 64px;gap:52px}
  .hero-media{aspect-ratio:4/3}
  .cats{grid-template-columns:repeat(3,1fr)}
  .trust{grid-template-columns:repeat(4,1fr)}
  .regions{grid-template-columns:repeat(4,1fr)}
  .shops{grid-template-columns:repeat(auto-fill,minmax(272px,1fr))}
  .pref-grid{grid-template-columns:repeat(auto-fill,minmax(232px,1fr))}
  .plans{grid-template-columns:repeat(4,1fr)}
  .grid3{grid-template-columns:repeat(3,1fr)}
  .split{grid-template-columns:minmax(0,1fr) 296px;gap:22px}
  .side-stack{position:sticky;top:calc(var(--head) + 16px)}
  .calc{grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:18px}
  .calc-out{position:sticky;top:calc(var(--head) + 16px)}
  .roi{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px}
  .det-hero{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)}
  .det-hero.no-media{grid-template-columns:1fr}
.det-hero.no-media .det-info{max-width:720px}
.det-gal{aspect-ratio:16/11}
  .steps{grid-template-columns:repeat(4,1fr)}
  .ft-grid{grid-template-columns:1.7fr 1fr 1fr 1fr;gap:30px}
  .sbox{flex-wrap:nowrap}
  .sbox input[type=search]{flex:1 1 220px}
  .sbox select{flex:0 1 158px}
  .sbox .btn{flex:0 0 auto}
  .det-boxes{grid-template-columns:1fr 1fr}
  .form{padding:22px}
  .calc-form,.calc-out{padding:22px}
  .card{padding:18px}
  .trust{grid-template-columns:repeat(4,1fr)}
  .sec-hd h2{font-size:1.75rem}
}
@media(min-width:1100px){
  .nav{display:flex}
  .burger{display:none}
  .mnav{display:none!important}
  .mbar{display:none}
  .hd-search{width:250px}
}
@media(max-width:1099px){
  .nav{display:none}
  .burger{display:flex}
  .mbar{display:grid}
  body{padding-bottom:calc(56px + env(safe-area-inset-bottom))}
  .ft{padding-bottom:calc(70px + env(safe-area-inset-bottom))}
}
@media(max-width:1099px) and (min-width:700px){
  .mnav .grid2{grid-template-columns:1fr 1fr 1fr}
}
@media(max-width:520px){
  .hd-search{display:none}
  .logo-tx span{display:none}
  .logo-tx b{font-size:1rem}
  .langs a{padding:5px 6px;font-size:.5625rem}
  .burger{width:36px;height:36px}
  .hd-in{gap:6px}
}
@media(max-width:380px){
  .hd-in{gap:4px}
  .logo-mark{width:29px;height:29px;border-radius:9px}
  .logo-tx b{font-size:.9375rem;letter-spacing:0}
  .langs{padding:2px}
  .langs a{padding:5px;font-size:.53125rem;letter-spacing:0}
  .burger{width:34px;height:34px}
  .hd-right{gap:4px}
  .regions{grid-template-columns:1fr}
  .hero-top .chip{font-size:.5625rem;padding:4px 8px}
  .calc-mini{grid-template-columns:1fr}
  .sc-pts{font-size:.53125rem}
}
@media(max-width:340px){
  .logo-tx{display:none}
  .dlist a,.dlist span{padding:5px 7px;font-size:.59375rem}
}
@media(prefers-reduced-motion:reduce){
  *{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}
}
@media print{
  .hd,.mnav,.mbar,.ft,.toast,.lb,.ad-side,.ad-strip,.ad-hero{display:none!important}
  body{background:#fff;color:#000}
}

/* ---------- hero: mobile keeps copy first, media after ---------- */
@media (max-width:899px){
  .hero-in{display:flex;flex-direction:column;align-items:stretch}
  .hero-copy,.hero-media{width:100%;max-width:100%;min-width:0;flex:0 0 auto}
  .hero-copy{order:1}
  .hero-media{order:2;margin-top:6px}
  .hero-media figcaption{font-size:.625rem}
  .hero-stats{gap:16px}
}

/* ---------- touch targets: 44px minimum (WCAG 2.5.5) ----------
   Applied on small viewports and on any coarse pointer, so it holds
   regardless of how the device reports hover support. */
@media (hover:none),(pointer:coarse){
  .langs a{min-width:44px;min-height:44px;font-size:.6875rem}
  .langs{padding:2px}
  .burger{width:44px;height:44px}
  .fchips button{min-height:44px;padding:10px 15px}
  .fchips{gap:8px}
  .crumb a,.crumb span{min-height:32px;display:inline-flex;align-items:center}
  .sbox select,.sbox input{min-height:46px}
  .pill-row .chip{min-height:40px;display:inline-flex;align-items:center}
}
@media (max-width:900px){
  .langs a{min-width:44px;min-height:44px;font-size:.6875rem}
  .langs{padding:2px}
  .burger{width:44px;height:44px}
  .fchips button{min-height:44px;padding:10px 15px}
  .fchips{gap:8px}
  .sbox select,.sbox input{min-height:46px}
  .pill-row .chip{min-height:42px;display:inline-flex;align-items:center}
}
/* ==================================================================
   LIGHT LUXURY POLISH — modern CSS layer (2026)
   ================================================================== */
:root{
  --ease:cubic-bezier(.22,.61,.36,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
  --maxw-wide:1320px;
}

/* --- balanced, optically-tuned typography --- */
h1,h2,h3,.hero h1,.sec-hd h2,.ph h1{text-wrap:balance}
p,li,figcaption,.hero p,.sec-hd p{text-wrap:pretty}
.hero h1{letter-spacing:-.028em;font-weight:900;
  font-feature-settings:'palt' 1;text-decoration-skip-ink:auto}
.hero h1 em{font-style:normal;position:relative;z-index:0;padding:0 .06em;color:var(--ink)}
.hero h1 em::after{content:"";position:absolute;z-index:-1;left:-.02em;right:-.02em;
  bottom:.02em;height:.42em;border-radius:3px;
  background:linear-gradient(90deg,rgba(195,154,78,.34),rgba(195,154,78,.14))}

/* --- display type: apostrophes are never used as quote marks (a11y + copy rules) --- */
.hero h1,.ph h1,.sec-hd h2,.hero p,.sec-hd p{text-rendering:optimizeLegibility}

/* --- editorial display: serif for JA/KO/EN headline weight --- */
.hero h1,.ph h1{font-family:var(--ff-serif);
  letter-spacing:.002em;font-weight:600;line-height:1.24}
.hero h1{line-height:1.2}
.sec-hd h2{line-height:1.3;font-family:var(--ff);letter-spacing:-.015em;font-weight:900}
:lang(ko) .hero h1,:lang(ko) .ph h1{font-weight:600;letter-spacing:-.005em}
.hero h1 em{font-family:inherit}

/* --- hero copy must never size to its chips row --- */
.hero-in,.hero-copy,.hero-media{min-width:0}
.hero-top{max-width:100%;min-width:0;flex-wrap:nowrap;overflow-x:auto;
  -webkit-mask-image:linear-gradient(90deg,#000 88%,transparent 100%);
  mask-image:linear-gradient(90deg,#000 88%,transparent 100%)}
.hero-top .chip{flex:0 0 auto;max-width:none}
.hero-search{max-width:100%}
.hero h1,.hero p{max-width:100%}

/* --- hero chips: scroll on mobile, wrap on desktop (no clipped labels) --- */
@media (min-width:900px){
  .hero-top{flex-wrap:wrap;overflow:visible;row-gap:6px;
    -webkit-mask-image:none;mask-image:none}
}
@media (max-width:430px){
  .logo-mark{width:28px;height:28px;border-radius:9px}
  .logo-mark svg{width:16px;height:16px}
  .logo-tx b{font-size:.8125rem;letter-spacing:0}
  .logo-tx span{font-size:.4375rem;letter-spacing:.1em}
}

/* --- hero search: predictable grid instead of squeezing flex --- */
.hero-search{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px;align-items:center}
.hero-search input[type=search]{grid-column:1/-1;width:100%;min-width:0;height:48px;padding:0 14px}
.hero-search select{grid-column:span 1;width:100%;min-width:0;height:46px;padding:0 34px 0 12px}
.hero-search select:nth-of-type(3){grid-column:1/-1}
.hero-search .btn{grid-column:1/-1;width:100%;height:48px;justify-content:center}
@media (min-width:1000px){
  /* 2 rows: full-width keyword field, then three selects + button */
  .hero-search{grid-template-columns:repeat(3,minmax(0,1fr)) auto;padding:10px;gap:8px}
  .hero-search input[type=search]{grid-column:1/-1;height:46px}
  .hero-search select{grid-column:span 1}
  .hero-search select:nth-of-type(3){grid-column:span 1}
  .hero-search .btn{grid-column:auto;width:auto;padding:0 20px;height:46px}
}

/* --- refined section rhythm --- */
body{background:
  radial-gradient(1100px 520px at 82% -8%,rgba(169,128,58,.10),transparent 62%),
  radial-gradient(760px 420px at 6% 4%,rgba(107,95,174,.055),transparent 60%),
  var(--bg);
  background-repeat:no-repeat;background-attachment:scroll}
.sec + .sec{border-top:1px solid var(--line)}
.sec-alt{background:linear-gradient(180deg,#fff,#faf8f3)}

/* --- cards: crisp hairline + soft lift --- */
.card,.pcard,.vcard,.acard{border-color:var(--line);box-shadow:var(--shadow-sm);
  transition:transform .35s var(--ease-out),box-shadow .35s var(--ease-out),border-color .3s}
@media (hover:hover){
  .card:hover,.pcard:hover,.vcard:hover,.acard:hover{
    transform:translateY(-3px);box-shadow:var(--shadow-lg);border-color:var(--line2)}
}

/* --- header: light glass + gold hairline after scroll --- */
.hd{transition:box-shadow .3s var(--ease),background .3s var(--ease)}
.hd.stuck{background:rgba(251,249,245,.95);
  box-shadow:0 1px 0 var(--line),0 12px 34px -26px rgba(21,22,28,.5)}
.logo-mark{border-radius:11px}

/* --- buttons / inputs --- */
.btn{transition:transform .18s var(--ease),box-shadow .22s var(--ease),background .18s,color .18s}
.btn:active{transform:translateY(1px) scale(.995)}
:where(.btn,.fchips button,.nav a,.langs a,.mbar a):focus-visible{
  outline:2px solid var(--gold);outline-offset:2px}
.sbox select,.sbox input,.hd-search{
  transition:border-color .2s var(--ease),box-shadow .2s var(--ease),background .2s}
.sbox select:hover,.sbox input:hover{border-color:var(--line2)}

/* --- hero media: hairline frame + slow zoom --- */
.hero-media{box-shadow:0 28px 70px -40px rgba(21,22,28,.55)}
.hero-media::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),inset 0 0 0 3px rgba(169,128,58,.1)}
.hero-media img{transition:transform 1.2s var(--ease-out)}
@media (hover:hover){.hero-media:hover img{transform:scale(1.025)}}
.hero-stats{border-top:1px solid var(--line);padding-top:18px}
.hstat b{font-variant-numeric:tabular-nums}

/* --- scroll reveal (JS + motion allowed only) --- */
@media (prefers-reduced-motion:no-preference){
  html.js [data-rv]{opacity:0;transform:translateY(16px);
    transition:opacity .7s var(--ease-out),transform .7s var(--ease-out)}
  html.js [data-rv].rv-in{opacity:1;transform:none}
  html.js [data-rv][data-rv-d="1"]{transition-delay:.07s}
  html.js [data-rv][data-rv-d="2"]{transition-delay:.14s}
  html.js [data-rv][data-rv-d="3"]{transition-delay:.21s}
}

/* --- cross-document view transitions --- */
@view-transition{navigation:auto}
::view-transition-old(root){animation-duration:.16s}
::view-transition-new(root){animation-duration:.22s}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.01ms!important;scroll-behavior:auto!important}
  html.js [data-rv]{opacity:1!important;transform:none!important}
}

@media (prefers-contrast:more){
  :root{--ink2:#33363f;--ink3:#5a5e6b;--line:#cdc4b4;--line2:#b5a993}
}


/* v15 — editorial pricing studio */
.calc{display:block!important;background:#fff;border:1px solid #e6dfd1;border-radius:24px;padding:32px;box-shadow:0 16px 50px #34291509;overflow:hidden}
.calc-head{display:flex;align-items:center;gap:16px;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid #eee8dd}
.calc-ic{width:52px;height:52px;flex-shrink:0;display:grid;place-items:center;border-radius:16px;background:#f4eee0;color:#937038}
.calc-ic svg{width:24px;height:24px}.calc-head h3{font-size:1.4rem;margin:0 0 6px}.calc-head p{margin:0;color:#777167;font-size:.86rem;line-height:1.7}
.calc-workspace{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:32px;align-items:start}.calc-inputs{min-width:0}
.calc-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 16px}.calc-field{min-width:0}.calc-field label{display:block;font-size:.75rem;font-weight:750;color:#6d665b;margin-bottom:8px;letter-spacing:.03em}
.calc-field select{appearance:none;width:100%;min-width:0;min-height:50px;padding:12px 34px 12px 14px;border:1px solid #ded8cc;border-radius:10px;background:#fbfaf7;color:#26231e;font:inherit;font-size:.85rem;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='m4 6 4 4 4-4' fill='none' stroke='%238a7349' stroke-width='1.5'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;cursor:pointer}.calc-field select:focus-visible{outline:3px solid #cfb97b66;border-color:#9a7836}
.calc-result{padding:26px;border:1px solid #dfd3ba;border-radius:18px;background:linear-gradient(140deg,#faf7ee,#fffdf8);min-width:0}.calc-result-heading{font-size:.65rem;color:#927238;font-weight:850;letter-spacing:.13em;margin-bottom:22px}
.calc-result .calc-lines{gap:12px;margin-bottom:24px}.calc-result .calc-line{font-size:.82rem}.calc-result .calc-total{border-top:1px solid #ded3bd;border-bottom:0;padding:22px 0 0;margin-bottom:20px}.calc-total>span{display:block;font-size:.75rem;color:#716349;margin-bottom:8px}.calc-result .calc-total b{font-size:clamp(2rem,4vw,3.4rem);line-height:1.2;color:#926d29;background:none;-webkit-text-fill-color:initial}
.calc-mini{gap:10px}.calc-mini div{background:#ffffffaa;padding:14px 8px}.calc-mini small{font-size:.65rem}.calc-mini b{font-size:1.05rem}.calc-note{font-size:.72rem!important;line-height:1.8;color:#837c70;margin:20px 0 0!important}.calc-actions{display:flex;align-items:center;gap:12px;justify-content:space-between;margin-top:22px}.calc-actions button{border:1px solid #ddd3c0;border-radius:9px;background:white;padding:10px 14px;min-height:44px;font:inherit;font-size:.75rem;cursor:pointer}.calc-actions span{font-size:.65rem;color:#8d8577}
@media(max-width:760px){.calc{padding:20px 16px;border-radius:18px}.calc-workspace{grid-template-columns:1fr;gap:24px}.calc-head{align-items:flex-start;gap:12px}.calc-head h3{font-size:1.15rem}.calc-grid{gap:16px 10px}.calc-field select{font-size:.75rem;padding-left:10px}.calc-result{padding:22px 18px}.calc-result .calc-total b{font-size:2.6rem}}


/* v16 — midnight editorial */
:root{--head:80px}body{background:#f8f7f3;color:#242621}.hd{background:#f8f7f3f5!important;border-bottom:1px solid #dddcd4!important}.hd-in{height:80px}.logo-mark{background:#232f2a;color:#d5bc83}.nav{gap:24px}.nav a{font-size:.82rem;letter-spacing:.02em}.hd-search{display:none!important}.burger{display:flex!important;width:46px!important;height:46px!important;border-radius:50%;background:transparent;border-color:#d9d8ce}.hd-right{gap:18px}.langs a{min-width:32px;min-height:40px;display:inline-flex;align-items:center;justify-content:center}.mnav{left:auto;width:min(480px,100%);padding:28px 26px 70px;box-shadow:-20px 20px 80px #14201933;background:#f8f7f3;z-index:190}.mnav.open{display:block!important}.mnav a{min-height:56px;border-radius:0;border:0;border-bottom:1px solid #deded3;background:transparent;font-size:1rem}.mnav-cats a{padding:18px 14px}.mnav h4{margin-top:30px}.mnav-cats a small{display:none}.mnav-hd{padding-bottom:20px}.nav-open{overflow:hidden!important}body.noscroll{overflow:hidden!important}.night-eyebrow{display:block;font-size:.65rem;font-weight:750;letter-spacing:.19em;color:#8c7851}.night-hero{position:relative;min-height:640px;background:#16251f;color:#fff;overflow:hidden}.night-hero-photo{position:absolute;inset:0;background:linear-gradient(90deg,#13251ff5 0%,#13251fe0 35%,#14251f33 100%),url('${SITE.base}/images/hero-tokyo-night.jpg') center 55%/cover}.night-hero-content{position:relative;padding-top:90px;padding-bottom:60px}.night-hero .night-eyebrow{color:#d8c591}.night-hero h1{font-size:clamp(2.8rem,5.8vw,5.6rem);line-height:1.16;letter-spacing:-.065em;margin:26px 0 24px;font-weight:700;max-width:850px}.night-hero p{font-size:1rem;line-height:1.9;max-width:580px;color:#e0e4dc}.night-hero-links{display:flex;align-items:center;gap:28px;margin-top:34px;font-size:.8rem}.night-primary{display:inline-flex;align-items:center;justify-content:space-between;gap:30px;background:#d5bc83;color:#1e2b24!important;padding:17px 24px;font-weight:750;border-radius:4px;min-height:52px;text-decoration:none}.night-photo-label{display:block;margin-top:42px;color:#bdc9bf;font-size:.6rem}.night-find{position:relative;margin-top:-25px;background:#fff;padding:30px 34px;border:1px solid #e3e2d9;border-radius:8px;box-shadow:0 16px 50px #18251d08}.night-find-label{display:flex;gap:26px;align-items:center;margin-bottom:20px}.night-find-label>span{font-size:.6rem;letter-spacing:.14em;color:#8c7851}.night-find h2{font-size:1.15rem;margin:0}.night-find .sbox{display:grid;grid-template-columns:1.3fr repeat(3,1fr) auto;gap:10px;margin:0;background:transparent;border:0;padding:0;box-shadow:none}.night-find .sbox input.grow{grid-column:auto;grid-row:auto}.night-find input,.night-find select{width:100%;min-width:0;min-height:48px;background:#f8f7f3;border:1px solid #deded4;border-radius:4px;padding:10px;font:inherit;font-size:.8rem;color:#333}.night-section{padding-top:86px;padding-bottom:78px}.night-section-top{display:flex;justify-content:space-between;align-items:end;gap:28px;margin-bottom:32px}.night-section-top h2{font-size:clamp(1.7rem,3vw,2.6rem);letter-spacing:-.05em;margin:14px 0 0;font-weight:650}.night-section-top>p,.night-section-top>a{font-size:.8rem;line-height:1.7;color:#6e756b}.night-category-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px}.night-category{display:block;text-decoration:none}.night-category-photo{position:relative;overflow:hidden;border-radius:6px;background:#24352a;aspect-ratio:1.3}.night-category-photo img{width:100%;height:100%;object-fit:cover;transition:transform .5s}.night-category:hover img{transform:scale(1.035)}.night-category-photo>span{position:absolute;top:16px;left:18px;color:white;font-size:.65rem;letter-spacing:.2em}.night-category-text{position:relative;padding:22px 45px 10px 0}.night-category h3{margin:0 0 8px;font-size:1.5rem;font-weight:650}.night-category p{font-size:.8rem;color:#747b70;margin:0}.night-round-arrow{position:absolute;right:0;top:25px;border:1px solid #c9cec3;border-radius:50%;width:36px;height:36px;display:grid;place-items:center}.night-disclosure{margin:24px 0 0;font-size:.65rem;color:#777d73;line-height:1.8}.night-destinations{background:#eaece5;padding:72px 0}.night-area-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #c9cfc3}.night-area-grid>a{position:relative;padding:28px 24px;border-right:1px solid #c9cfc3;min-width:0}.night-area-grid>a:first-child{padding-left:0}.night-area-grid>a:last-child{border:0}.night-area-number{font-size:.6rem;color:#7e8977}.night-area-grid h3{font-size:1.5rem;margin:22px 0 12px;font-weight:600}.night-area-grid p{font-size:.75rem;color:#65725f}.night-area-grid>a>span:last-child{position:absolute;right:24px;top:24px}.night-guide{border-top:1px solid #d5d9ce;padding-top:60px;padding-bottom:76px;text-align:center}.night-guide h2{font-size:clamp(1.6rem,3vw,2.5rem);letter-spacing:-.04em;margin:18px 0}.night-guide p{font-size:.85rem;line-height:1.9;color:#6d7667;max-width:660px;margin:0 auto 28px}.ft{background:#17261f!important;color:#e3e7dc}.ft a{color:#c1cbbb}.ft-grid{gap:36px}.ft-about p{color:#a6b3a1!important}.sec{padding-top:64px;padding-bottom:64px}.sec-head h2{letter-spacing:-.04em}.btn{border-radius:5px}.card,.calc{box-shadow:none}.calc{border-radius:12px}.calc-result{border-radius:9px}.ft-badges{display:none}
@media(min-width:1100px){.mnav{display:none!important}.mnav.open{display:block!important}}
@media(max-width:760px){:root{--head:68px}.hd-in{height:68px}.nav{display:none}.logo-tx b{font-size:1rem}.hd-right{gap:7px}.langs{gap:0}.night-hero{min-height:560px}.night-hero-content{padding-top:64px;padding-bottom:54px}.night-hero-photo{background:linear-gradient(90deg,#13251fee,#13251f77),url('${SITE.base}/images/hero-tokyo-night.jpg') 62% center/cover}.night-hero h1{font-size:clamp(2.5rem,9.5vw,4rem);margin:25px 0}.night-hero p{font-size:.85rem;max-width:340px}.night-hero-links{align-items:flex-start;flex-direction:column;gap:20px}.night-photo-label{margin-top:26px}.night-find{width:calc(100% - 32px);padding:24px 18px;margin-top:-20px}.night-find-label{display:block}.night-find-label>span{display:block;margin-bottom:12px}.night-find .sbox{grid-template-columns:1fr 1fr}.night-find .sbox input.grow{grid-column:1/-1}.night-find .sbox button{width:100%}.night-section{padding-top:52px;padding-bottom:48px}.night-section-top{display:block;margin-bottom:24px}.night-section-top>p,.night-section-top>a{display:block;margin-top:16px}.night-category-grid{grid-template-columns:1fr;gap:28px}.night-category-photo{aspect-ratio:1.65}.night-category h3{font-size:1.35rem}.night-category-text{padding-top:18px}.night-destinations{padding:48px 0}.night-area-grid{grid-template-columns:1fr}.night-area-grid>a,.night-area-grid>a:first-child{padding:22px 0;border-right:0;border-bottom:1px solid #c9cfc3}.night-area-grid h3{margin:12px 0;font-size:1.3rem}.night-guide{padding-top:42px;padding-bottom:52px}.mnav{top:68px;padding:24px 20px 60px}.night-hero-links>a{min-height:44px;display:inline-flex;align-items:center}.night-guide .night-primary{min-width:220px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}


/* v17 — complete interior design system */
:root{--r:8px;--r2:12px;--panel:#fff;--panel2:#f5f5ef;--bg3:#f2f3ec;--ink:#25342a;--ink2:#566151;--ink3:#737e6e;--line:#e0e4d8;--line2:#d4dbca;--gold2:#8b713b;--gold:#a38b55;--mint:#416e52}
.ph{background:linear-gradient(120deg,#e9ede4,#f4f4ed)!important;border-bottom:1px solid #dce2d4;padding:42px 0 46px!important}.ph h1{font-size:clamp(1.75rem,3.5vw,3.1rem)!important;letter-spacing:-.055em;line-height:1.35;max-width:1050px;font-weight:650!important;margin:24px 0 15px!important;overflow-wrap:anywhere}.ph p{max-width:760px;color:#65705d;line-height:1.9;font-size:.9rem}.page-kicker{font-size:.65rem;letter-spacing:.08em;color:#6e7c61;font-weight:700;margin-bottom:22px}.crumb{font-size:.68rem;line-height:1.8;flex-wrap:wrap}.crumb a{min-height:32px;display:inline-flex;align-items:center}.ph-row{gap:8px;margin-top:24px}.chip,.fchip{border-radius:4px;font-size:.65rem;line-height:1.7;padding:5px 9px;background:#f4f5ef;border-color:#dce1d3;color:#5f6f50}.chip.gold{background:#f0e9d7;color:#7b6739}.chip.mint{background:#e5eee3;color:#4a6847}.chapter-nav{background:#f8f7f3;border-bottom:1px solid #dfe3d6}.chapter-nav>div{display:flex;overflow-x:auto;gap:24px;scrollbar-width:thin}.chapter-nav a{display:flex;align-items:center;min-height:54px;font-size:.73rem;white-space:nowrap;color:#53634b;border-bottom:2px solid transparent}.chapter-nav a:hover{border-color:#92783f}.sec-hd{margin-bottom:26px}.sec-hd h2{font-size:clamp(1.3rem,2.2vw,1.9rem);line-height:1.45;font-weight:650!important}.sec-hd p{line-height:1.8;color:#78816f;font-size:.8rem}.sec-hd .eyebrow{font-size:.6rem;letter-spacing:.18em;color:#8a7447}.split{grid-template-columns:minmax(0,1fr) 270px;gap:36px;align-items:start}.stack{gap:28px}.side-stack{gap:20px}.side-stack .card{background:#ecefe6;border:0;padding:22px}.card{background:#fff;border:1px solid #e0e5d7;border-radius:10px;padding:26px;box-shadow:none}.card h4{font-size:1rem;line-height:1.6;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid #e2e6da}.card h4 svg{color:#7a8769}.dlist a{min-height:44px;padding:10px 0;border:0;border-bottom:1px solid #d9dfd1;border-radius:0;background:transparent;font-size:.78rem;line-height:1.6}.dlist{gap:0}.shops{gap:22px;grid-template-columns:repeat(3,minmax(0,1fr))}.split .shops{grid-template-columns:repeat(2,minmax(0,1fr))}.sc{border:1px solid #dfe5d6;border-radius:9px;box-shadow:none;transition:box-shadow .2s,transform .2s;background:#fff;overflow:hidden}.sc:hover{transform:translateY(-3px);box-shadow:0 12px 30px #21311b0b}.sc-thumb{aspect-ratio:1.6;background:#e8eee3}.sc-thumb.no-img{height:160px;background:linear-gradient(120deg,#e0e8d7,#f0f2e9)}.sc-noimg{display:flex;flex-direction:column;gap:8px;align-items:center;color:#5a6f4e}.venue-monogram{font-size:2.5rem;font-weight:500;opacity:.55}.sc-noimg small{font-size:.55rem;letter-spacing:.18em}.sc-body{padding:20px}.sc-name{font-size:1rem;line-height:1.6;font-weight:700;letter-spacing:-.025em;overflow-wrap:anywhere}.sc-body>a{min-height:44px;display:block}.sc-meta{font-size:.68rem;line-height:1.7;flex-wrap:wrap;gap:5px}.sc-feats{margin-top:12px}.sc-coupon{background:#edf2e6;color:#4e6542;font-size:.7rem;border-radius:4px}.sc-price{padding-top:16px;margin-top:16px;border-top:1px solid #e1e6d9}.bdg{font-size:.55rem;border-radius:3px;box-shadow:none}.sc-pts{font-size:.55rem;background:#ffffffdf;color:#53624a}.sc-badges{gap:4px;flex-wrap:wrap}.price-all b{font-size:1.25rem!important}.rating{font-size:.65rem}.filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;background:#fff;padding:22px;border:1px solid #dce3d1;border-radius:10px;margin-bottom:26px}.filters input[type=search]{grid-column:1/-1}.filters input,.filters select{width:100%;min-width:0;min-height:48px;padding:11px 12px!important;border:1px solid #d9e0ce!important;border-radius:5px!important;background:#f8f9f4!important;font-size:.8rem!important;color:#35462b}.filters .fchips{grid-column:1/-1;gap:7px;display:flex;flex-wrap:wrap;padding-top:8px;border-top:1px solid #e4e8dd}.fchips button{min-height:40px;padding:8px 12px;border-radius:4px;font-size:.7rem}.fchips button.on{background:#263d2b;color:#fff;border-color:#263d2b}.btn{min-height:46px;line-height:1.5;font-size:.76rem;padding:12px 18px}.btn-gold{background:#29432f;color:#fff!important;border-color:#29432f}.btn-gold:hover{background:#39583e}.btn-ghost,.btn-line{border-color:#cdd6c2;background:transparent;color:#405c36}.tbl-wrap{border:1px solid #dde3d3;border-radius:8px;overflow-x:auto;max-width:100%;background:white}.tbl{margin:0;width:100%;font-size:.8rem}.tbl th{background:#eaf0e2;color:#5c6f4d;font-size:.7rem;font-weight:750;padding:16px!important;border-bottom:1px solid #d8e0cd}.tbl td{padding:16px!important;line-height:1.7;border-color:#e5e9df}.tbl tbody tr:hover{background:#f8faf5}.rowlink{display:inline-flex;min-height:32px;align-items:center}.tabs{display:flex;gap:8px;flex-wrap:wrap;border-bottom:1px solid #dce3d1;padding-bottom:14px;margin-bottom:24px}.tabs a{min-height:44px;padding:10px 16px;border:1px solid #d8e0cc;border-radius:4px;font-size:.75rem;display:flex;align-items:center;background:#fff}.tabs a.on{background:#2b432e;color:white;border-color:#2b432e}.ranklist{background:white;border:1px solid #dde4d2;border-radius:10px;overflow:hidden}.rr{padding:17px 20px;min-height:96px;border-bottom:1px solid #e4e9dc}.rr:last-child{border-bottom:0}.rr-no{font-size:1.25rem;color:#8b977a;background:transparent!important}.rr-no.top{color:#8a7139}.rr-im{border-radius:5px}.rr-noimg{background:#e8eedd;color:#657a50;font-size:.6rem}.rr-tx b{font-size:.9rem;line-height:1.6;font-weight:650}.rr-tx small{font-size:.65rem;line-height:1.7}.rr-pt{font-size:.65rem;color:#70845c}.regions,.pref-grid{gap:18px}.reg-c,.pref-c{border:1px solid #dce3d0;border-radius:8px;background:#fff;padding:24px;box-shadow:none}.reg-c h3{font-size:1.3rem}.reg-c .n{margin-top:20px}.pref-c .hd2{padding-bottom:15px;border-bottom:1px solid #e2e7d8}.pref-c .dlist a{min-height:42px}.det-hero{border:1px solid #dce4d0;background:#fff;border-radius:12px;overflow:hidden;gap:0}.det-info{padding:32px}.det-info h2{font-size:1.8rem;letter-spacing:-.04em}.det-stats{gap:12px}.dbox{padding:16px;background:#f3f6ee;border:1px solid #e0e7d5;border-radius:6px;min-width:0}.dbox small{font-size:.65rem;color:#79856c}.dbox b{font-size:.85rem;line-height:1.7;overflow-wrap:anywhere}.srcbox{background:#f5f7f0;border-left:3px solid #a8b693;padding:18px;border-radius:0;font-size:.75rem;line-height:1.9}.mono{overflow-wrap:anywhere;word-break:break-all}.maplike{background:repeating-linear-gradient(45deg,#e4ebda,#e4ebda 1px,#eef2e8 1px,#eef2e8 18px);border:1px solid #dce5cf;border-radius:7px}.notice{padding:18px 20px;border-radius:6px;border:1px solid #dce3d0;background:#eef2e7;color:#5b6b4e;font-size:.78rem;line-height:1.85}.notice.amber{background:#f5f0df;border-color:#e3dac0;color:#75633e}.prose{max-width:850px;background:white;padding:34px;border:1px solid #e0e6d6;border-radius:10px;line-height:1.95;font-size:.9rem;overflow-wrap:anywhere}.prose h2{font-size:1.5rem;font-weight:650;letter-spacing:-.035em;margin-top:42px;padding-top:26px;border-top:1px solid #e1e7d7}.prose h2:first-child{margin-top:0;padding-top:0;border-top:0}.prose h3{font-size:1.1rem;margin-top:28px}.prose p{color:#59694c;line-height:1.95}.prose li{margin:8px 0;color:#59694c}.prose table{width:100%;table-layout:fixed}.prose th,.prose td{overflow-wrap:anywhere;padding:12px;border-bottom:1px solid #e2e7d8;font-size:.75rem;vertical-align:top}.faq details{background:#fff;border:1px solid #dce5d0;border-radius:6px;margin-bottom:10px}.faq summary{padding:20px;font-size:.85rem;min-height:58px;cursor:pointer}.faq .ans{padding:0 20px 22px;color:#62734f;font-size:.8rem;line-height:1.9}.form{background:#fff;border:1px solid #dbe3cf;border-radius:12px;padding:30px;box-shadow:none;max-width:960px;margin-left:auto;margin-right:auto}.form input:not([type=checkbox]),.form select,.form textarea,.field input,.field select,.field textarea{background:#f8faf4;border:1px solid #d4dfc6;border-radius:5px;padding:13px;font:inherit;font-size:.85rem;min-height:48px;width:100%;min-width:0}.form label,.field label{font-size:.75rem;font-weight:750;color:#5e7150;line-height:1.7}.form textarea{min-height:130px}.form input[type=checkbox]{width:20px;height:20px;accent-color:#36562f}.form fieldset{border:1px solid #d9e3cd;border-radius:8px;padding:22px;margin:24px 0}.form legend{padding:0 10px;color:#455e36;font-weight:750}.plans{gap:22px}.plan{border:1px solid #d8e2cb;border-radius:10px;background:white;padding:30px;box-shadow:none}.plan.best{border:2px solid #46643a;background:#f8faf4}.plan-best-tag{background:#3f5d33;color:white;border-radius:4px}.pl-price{font-size:2rem;color:#36502c;font-weight:650}.plan ul{line-height:2}.kpis{gap:18px}.kpi{border:1px solid #dde5d2;border-radius:8px;background:#fff}.kpi b{color:#3f5934}.ad-strip{display:none}.page-legal .prose{font-size:.85rem}.page-legal .side-stack{position:sticky;top:100px}.page-search .split>.side-stack{position:sticky;top:100px}.page-guide .grid3{grid-template-columns:1fr}.page-guide .grid3 .card{padding:20px}.page-register .ph-row{display:none}
@media(max-width:1000px){.split{grid-template-columns:minmax(0,1fr);gap:28px}.side-stack{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.page-legal .side-stack,.page-search .split>.side-stack{position:static}.shops{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.ph{padding:24px 0 30px!important}.page-kicker{font-size:.58rem;margin-bottom:14px;line-height:1.8}.ph h1{font-size:1.65rem!important;margin-top:18px!important}.ph p{font-size:.8rem;line-height:1.85}.ph-row{margin-top:18px}.sec{padding:36px 0!important}.split{gap:24px}.card{padding:20px 16px}.shops,.split .shops{grid-template-columns:minmax(0,1fr);gap:20px}.sc-thumb.no-img{height:150px}.sc-body{padding:18px}.sc-name{font-size:1.05rem}.filters{grid-template-columns:repeat(2,minmax(0,1fr));padding:16px;gap:10px}.filters input[type=search]{grid-column:1/-1}.filters select{font-size:.75rem!important;padding:10px!important}.filters .btn{padding:10px 8px}.fchips button{font-size:.65rem;min-height:40px}.tbl{font-size:.7rem}.tbl th,.tbl td{padding:12px!important}.tbl{min-width:520px}.tbl-wrap{overscroll-behavior-x:contain}.side-stack{grid-template-columns:1fr}.side-stack .card{padding:20px}.rr{padding:14px 12px;gap:10px}.rr-tx b{font-size:.8rem}.rr-tx small{font-size:.6rem}.rr-pt{font-size:.55rem}.det-hero{display:flex;flex-direction:column}.det-info{padding:22px 16px}.det-info h2{font-size:1.35rem}.det-stats{grid-template-columns:1fr 1fr}.dbox{padding:12px}.dbox b{font-size:.75rem}.prose{padding:22px 17px;font-size:.83rem;line-height:1.95}.prose h2{font-size:1.2rem;margin-top:32px}.prose h3{font-size:1rem}.prose th,.prose td{font-size:.68rem;padding:9px}.prose .grid3{grid-template-columns:1fr}.form{padding:22px 16px}.form fieldset{padding:16px 12px}.form .grid2,.form .grid3,.plans{grid-template-columns:1fr}.plan{padding:26px 22px}.chapter-nav>div{gap:20px}.chapter-nav a{font-size:.68rem}.regions,.pref-grid{grid-template-columns:1fr}.tabs a{font-size:.68rem;min-height:44px;padding:10px 13px}.notice{padding:16px;font-size:.73rem}.page-legal .prose{font-size:.8rem}}
:where(a,button,input,select,textarea,summary):focus-visible{outline:3px solid #bba363;outline-offset:3px}h2[id],h3[id],section[id],div[id]{scroll-margin-top:110px}

/* v17 visual review corrections */
.dlist{display:flex;flex-direction:column;align-items:stretch}.dlist>a{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}.sc-thumb.no-img::after{display:none}.sc-noimg{border:0;border-radius:0;background:none;padding:0}.rr-im img{width:100%;height:100%;object-fit:cover}.form-grid{gap:20px}.roi{background:#fff;border:1px solid #dce4d0;padding:28px;border-radius:10px;gap:30px}.roi-k{border:1px solid #dce4d0;border-radius:6px;padding:15px}.roi-k small{font-size:.65rem}.roi-k b{font-size:1.1rem;color:#3c562f}.roi-track{background:#e0e7d7}.roi-fill{background:#708663}.reg-c .reg-n{font-size:1.3rem}.page-search #fMore{display:block}.page-search .sc-thumb{max-height:210px}
@media(max-width:600px){.form-grid{grid-template-columns:1fr!important}.form-grid .full{grid-column:1}.roi{padding:20px 16px;grid-template-columns:1fr}.roi-out{grid-template-columns:1fr 1fr}.det-info .grid2{grid-template-columns:1fr 1fr}.rr-im{flex-shrink:0}.prose .tbl{min-width:0}.chapter-nav>div{padding-left:16px;padding-right:16px}}

/* v18 home essentials: lightweight destinations, no embedded calculator */
.night-essentials{border-bottom:1px solid #dde3d5}.night-essential-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.night-essential{position:relative;display:block;padding:30px;background:#fff;border:1px solid #dce3d2;border-radius:8px;text-decoration:none;transition:border-color .2s,transform .2s}.night-essential:hover{border-color:#91a47b;transform:translateY(-3px)}.night-essential-icon{display:grid;place-items:center;width:46px;height:46px;background:#edf2e6;border-radius:9px;color:#647b4f}.night-essential-icon svg{width:22px;height:22px}.night-essential-number{position:absolute;right:28px;top:32px;font-size:.65rem;color:#8b977d;letter-spacing:.12em}.night-essential h3{font-size:1.2rem;font-weight:650;margin:26px 0 12px;letter-spacing:-.03em}.night-essential p{font-size:.8rem;line-height:1.9;color:#707d62;min-height:3.8em;margin:0 0 28px}.night-essential-link{display:flex;justify-content:space-between;border-top:1px solid #e3e8da;padding-top:18px;font-size:.75rem;font-weight:700;color:#4d653c;min-height:44px}
@media(max-width:760px){.night-essential-grid{grid-template-columns:1fr;gap:14px}.night-essential{padding:24px}.night-essential h3{font-size:1.15rem;margin-top:20px}.night-essential p{min-height:0;margin-bottom:18px}.night-essential-number{top:28px;right:24px}}

/* Source-reviewed venue details */
.visit-actions{display:flex;gap:12px;flex-wrap:wrap}.visit-facts{margin:0}.visit-fact{display:grid;grid-template-columns:145px minmax(0,1fr);gap:20px;padding:18px 0;border-bottom:1px solid #e1e7d6}.visit-fact:last-child{border:0}.visit-fact dt{font-size:.75rem;color:#6b7b5b}.visit-fact dd{font-size:.85rem;line-height:1.85;margin:0;overflow-wrap:anywhere}.visit-copy{font-size:.85rem;line-height:2;color:#5c6d4e}.visit-checklist{font-size:.8rem;line-height:1.95;padding-left:20px;color:#617451}.visit-checklist li{margin:10px 0}.visit-photo-empty{min-height:150px;background:#eef3e7;border:1px dashed #c6d5b7;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;border-radius:7px;color:#758664;font-size:.8rem}.visit-photo-empty svg{width:30px;height:30px}.visit-sources{padding-left:20px;line-height:1.8}.visit-sources small{display:block;color:#849075;font-size:.65rem;overflow-wrap:anywhere}.visit-sources a{display:inline-flex;align-items:center;min-height:44px}.page-shop .card h2{font-size:1.3rem;letter-spacing:-.03em;margin:0 0 20px}
@media(max-width:600px){.visit-fact{grid-template-columns:1fr;gap:5px;padding:15px 0}.visit-fact dd{font-size:.8rem}.visit-actions .btn{flex:1 1 140px}.page-shop .card h2{font-size:1.12rem}}

` + EDITORIAL_CSS;

// ---------------------------------------------------------------------------
// icons
// ---------------------------------------------------------------------------

export const ICONS = {
  moon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/><path d="M18.6 2.6l.85 2.15 2.15.85-2.15.85-.85 2.15-.85-2.15-2.15-.85 2.15-.85z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 6.5 7 .9-5.1 4.8 1.3 7L12 17.7 5.8 21.2l1.3-7L2 9.4l7-.9Z"/></svg>',
  ticket: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6Z"/><path d="M13 5v14" stroke-dasharray="2 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="m4 12.5 5.2 5.2L20 7"/></svg>',
  chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m9 5 7 7-7 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6Z"/><path d="m8.8 12 2.3 2.3 4.2-4.4"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="9" cy="7" rx="6" ry="3"/><path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3"/><path d="M9 15v3c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.5-2.1-2.7-4.8-3"/><ellipse cx="15" cy="10" rx="6" ry="3"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3Z"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 20A7 7 0 0 1 4 13c0-6 6-9 16-9 0 10-3 16-9 16Z"/><path d="M4 20c3-7 7-10 12-12"/></svg>',
  glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12l-2 7H8Z"/><path d="M12 10v8M8 21h8"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20s-8-4.6-8-10a4.6 4.6 0 0 1 8-2.9A4.6 4.6 0 0 1 20 10c0 5.4-8 10-8 10Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1Z"/></svg>',
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2Z"/><path d="M9 4v14M15 6v14"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  calc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2Z"/><path d="M4 17h15"/></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1Z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6"/><path d="M10.5 20a2 2 0 0 0 3 0"/></svg>',
};

// ---------------------------------------------------------------------------
// partials
// ---------------------------------------------------------------------------
const navItems = (lang) => [
  { href: `/${lang}/snack/`, label: t(lang, 'navSnack') },
  { href: `/${lang}/girlsbar/`, label: t(lang, 'navGirlsbar') },
  { href: `/${lang}/massage/`, label: t(lang, 'navMassage') },
  { href: `/${lang}/ranking/`, label: t(lang, 'navRanking') },
  { href: `/${lang}/price/`, label: t(lang, 'navPrice') },
  { href: `/${lang}/guide/`, label: t(lang, 'navGuide') },
  { href: `/${lang}/advertise/`, label: t(lang, 'navAdvertise') },
];

export function header(lang, path = '/', q = '') {
  const items = [...CATEGORIES.map(c=>({href:`/${lang}/${c.slug}/`,label:c[lang]})),{href:`/${lang}/area/`,label:L(lang,'エリア','지역 탐색','Areas')},{href:`/${lang}/guide/`,label:L(lang,'訪問ガイド','방문 체크','Visit guide')},{href:`/${lang}/evidence/`,label:L(lang,'出典','출처 노트','Sources')}];
  const active = (href) => (path === href || (href !== `/${lang}/` && path.startsWith(href)) ? ' class="on"' : '');
  return `
<header class="hd">
  <div class="wrap wrap-wide hd-in">
    <a class="logo" href="/${lang}/" aria-label="${esc(t(lang, 'brand'))}">
      <span class="logo-mark" aria-hidden="true">${ICONS.moon}</span>
      <span class="logo-tx"><b>${esc(t(lang, 'brand'))}</b><span>${esc(t(lang, 'brandSub'))}</span></span>
    </a>
    <nav class="nav" aria-label="${esc(t(lang, 'menu'))}">${items.map((i) => `<a href="${i.href}"${active(i.href)}>${esc(i.label)}</a>`).join('')}</nav>
    <div class="hd-right"><a class="shortlist-shortcut" href="/${lang}/saved/" aria-label="${esc(L(lang,'保存と比較','저장·비교 매장','Saved and compared venues'))}">♡</a><a class="hd-cta" href="/${lang}/search/">${esc(L(lang,'店舗を探す','매장 찾아보기','Find a venue'))} ↗</a>
      <form class="hd-search" action="/${lang}/search/" method="get" role="search">
        ${ICONS.search}
        <input type="search" name="q" placeholder="${esc(t(lang, 'searchPlaceholder'))}" aria-label="${esc(t(lang, 'search'))}" value="${esc(q)}">
      </form>
      <div class="langs" role="group" aria-label="${esc(t(lang, 'langSwitch'))}">
        ${LANGS.map((l) => `<a href="/${l}${path.replace(/^\/(ja|ko|en)/, '')}"${l === lang ? ' class="on" aria-current="true"' : ''} lang="${LANG_HTML[l]}" data-lang="${l}">${l.toUpperCase()}</a>`).join('')}
      </div>
      <button class="burger" id="burger" type="button" aria-label="${esc(t(lang, 'menu'))}" aria-expanded="false" aria-controls="mnav">
        <span class="ic-menu">${ICONS.menu}</span><span class="ic-close">${ICONS.close}</span>
      </button>
    </div>
  </div>
</header>
<div class="mnav" id="mnav" aria-hidden="true" inert role="dialog" aria-modal="true" aria-label="${esc(t(lang, 'menu'))}">
  <div class="mnav-hd">
    <b>${esc(t(lang, 'menu'))}</b>
    <span class="mnav-hint">${esc(t(lang, 'closeHint'))}</span>
  </div>
  <form class="hd-search" style="display:flex;width:100%;margin-bottom:4px" action="/${lang}/search/" method="get" role="search">
    ${ICONS.search}<input type="search" name="q" placeholder="${esc(t(lang, 'searchPlaceholder'))}" aria-label="${esc(t(lang, 'search'))}">
  </form>
  <h4>${esc(t(lang, 'category'))}</h4>
  <div class="mnav-cats">
    ${CATEGORIES.map((c) => `<a href="/${lang}/${c.slug}/"><b>${esc(c[lang])}</b><small>${esc(L(lang,'掲載店を探す','등록 매장 보기','Browse listings'))}</small></a>`).join('')}
  </div>
  <a href="/${lang}/area/">${ICONS.map}<span style="flex:1">${esc(t(lang, 'navArea'))}</span></a>

  <a href="/${lang}/guide/">${ICONS.book}<span style="flex:1">${esc(t(lang, 'navGuide'))}</span></a>
  <a href="/${lang}/saved/">♡ <span>${esc(L(lang,'お気に入り','관심 매장','Saved venues'))}</span></a>
</div>
<nav class="mbar" aria-label="${esc(t(lang, 'menu'))}">
  <a href="/${lang}/"${path === `/${lang}/` ? ' class="on"' : ''}>${ICONS.home}<span>${esc(t(lang, 'navHome'))}</span></a>
  <a href="/${lang}/area/"${path.startsWith(`/${lang}/area`) ? ' class="on"' : ''}>${ICONS.map}<span>${esc(t(lang, 'navArea'))}</span></a>
  <a href="/${lang}/search/"${path.startsWith(`/${lang}/search`) ? ' class="on"' : ''}>${ICONS.search}<span>${esc(t(lang, 'search'))}</span></a>
  <a href="/${lang}/guide/">${ICONS.book}<span>${esc(t(lang,'navGuide'))}</span></a>
  <a href="/${lang}/saved/">♡<span>${esc(L(lang,'保存','관심 매장','Saved'))}</span></a>
</nav>`;
}

export function footer(lang){
 const E=(ja,ko,en)=>esc(L(lang,ja,ko,en));
 return `<footer class="ft"><div class="wrap wrap-wide"><div class="ft-grid"><div class="ft-about"><a class="logo" href="/${lang}/"><span class="logo-mark">${ICONS.moon}</span><span class="logo-tx"><b>밤나이트 <small>BAM·NIGHT</small></b><span>JAPAN AFTER HOURS / THE CITY GUIDE</span></span></a><p>${E('公開資料を基に、料金・条件・出典を案内します。実地検証・営業・安全を保証するものではありません。','공개 자료를 바탕으로 요금·조건·출처를 안내합니다. 실사 검증이나 영업·안전을 보장하지 않습니다.','Explore fees,conditions and sources from public information. This is not an on-site verification or a guarantee of opening or safety.')}</p><span class="eyebrow">${SHOP_COUNT} LISTINGS · JA / KO / EN</span></div><div><h5>${E('店舗を探す','매장 둘러보기','Explore venues')}</h5><ul>${CATEGORIES.map(c=>`<li><a href="/${lang}/${c.slug}/">${esc(c[lang])}</a></li>`).join('')}<li><a href="/${lang}/area/">${E('エリアから','지역별 탐색','By neighbourhood')}</a></li></ul></div><div><h5>${E('訪問の準備','방문 준비','Plan your visit')}</h5><ul><li><a href="/${lang}/guide/">${E('初訪問ガイド','첫 방문 가이드','First-visit guide')}</a></li><li><a href="/${lang}/saved/">${E('お気に入り','관심 매장','Saved venues')}</a></li><li><a href="/${lang}/legal/data/">${E('出典と掲載基準','출처·게재 기준','Sources and standards')}</a></li><li><a href="/${lang}/legal/age/">${E('年齢制限','연령 제한','Age restrictions')}</a></li></ul></div><div><h5>${E('情報とポリシー','안내 및 정책','Information')}</h5><ul>${[['terms',E('利用規約','이용 약관','Terms')],['privacy',E('プライバシー','개인정보 안내','Privacy')],['ai',E('画像について','이미지 안내','Image disclosure')],['compliance',E('掲載ポリシー','게재 정책','Listing policy')]].map(([r,l])=>`<li><a href="/${lang}/legal/${r}/">${l}</a></li>`).join('')}</ul></div></div><div class="ft-bot"><span>© 2026 BAM-NIGHT JAPAN</span><span>${E('飲酒は20歳以上。画像は参考イメージです。','음주는 만20세부터. 이미지는 참고용입니다.','Drinking is20+ in Japan. Images are illustrative.')}</span></div></div></footer>`;
}

export function ageGate(lang) {
  return `
<div class="gate" id="ageGate" role="dialog" aria-modal="true" aria-labelledby="gateTitle">
  <div class="gate-card">
    <span class="gate-badge">${ICONS.shield} 18+ / 20+</span>
    <h1 id="gateTitle">${esc(t(lang, 'ageGateTitle'))}</h1>
    <div class="gate-legal">
      <span class="chip gold">${esc(t(lang, 'legalNote'))}</span>
      <span class="chip mint">${esc(t(lang, 'noSexual'))}</span>
    </div>
    <p>${esc(t(lang, 'ageGateBody'))}</p>
    <label class="gate-check"><input type="checkbox" id="gateRemember"><span>${esc(t(lang, 'ageGateRemember'))}</span></label>
    <button class="btn btn-gold" id="gateYes" type="button">${esc(t(lang, 'ageGateYes'))}</button>
    <button class="btn btn-line" id="gateNo" type="button">${esc(t(lang, 'ageGateNo'))}</button>
    <div class="gate-denied" id="gateDenied" role="alert">${esc(t(lang, 'ageGateDenied'))}</div>
    <div class="gate-foot">${esc(t(lang, 'age205'))} ／ ${esc(t(lang, 'age185'))}</div>
  </div>
</div>`;
}

export function jsonld(data) {
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function page({ lang, path, title, desc, body, q = '', gate = false, extraHead = '', jsonLd = null, canonical, noindex = false }) {
  const routeType = path.split('/').filter(Boolean)[1] || 'home';
  const pageType = ['snack','girlsbar','massage'].includes(routeType) ? 'category' : routeType;
  const intro = {
    search: ['次の一軒に、出会おう。','다음 목적지를 발견하세요.','Find your next favourite stop.'],
    category: ['気分に合う一軒を、ここから。','취향에 맞는 한 곳, 여기서부터.','A place that fits your mood.'],
    area: ['街を知れば、夜が広がる。','지역을 알면, 밤이 달라집니다.','Get to know the neighbourhood.'],
    shop: ['訪れる前に、知っておきたいこと。','방문 전에 알아둘 매장 정보.','The details before you step inside.'],
    ranking: ['次の行き先の、ヒントに。','다음 방문을 위한 발견.','A little inspiration for your next stop.'],
    price: ['会計の不安は、出発前に。','요금 걱정은, 출발 전에.','Know the estimate before you go.'],
    guide: ['はじめての夜を、心地よく。','처음인 밤도, 편안하게.','Your first night, made simple.'],
    advertise: ['あなたのお店を、次の出会いへ。','당신의 매장을, 새로운 만남으로.','Connect your venue with its next guest.'],
    register: ['お店の魅力を、きちんと届ける。','매장의 매력을, 정확하게 전하세요.','Give your venue a clear introduction.'],
    legal: ['安心して使うための、大切なこと。','안심하고 이용하기 위한 약속.','Clear information. Considered choices.']
  }[pageType];
  if(intro){
    body=body.replace(/(<section class="ph"[^>]*><div class="wrap wrap-wide">)/,
      '$1<div class="page-kicker">BAM-NIGHT / '+esc(L(lang,...intro))+'</div>');
    const headings=[];
    body=body.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g,(all,attrs,text)=>{
      if(headings.length>=6 || /id=/.test(attrs)) return all;
      const id='chapter-'+(headings.length+1);headings.push({id,text:text.replace(/<[^>]*>/g,'').replace(/^[\s🐾]+/u,'')});
      return '<h2'+attrs+' id="'+id+'">'+text+'</h2>';
    });
    if(headings.length>=3 && ['guide','legal','advertise','shop','price'].includes(pageType)){
      const toc='<nav class="chapter-nav" aria-label="'+esc(L(lang,'ページ内ナビゲーション','페이지 내 탐색','On this page'))+'"><div class="wrap wrap-wide">'+headings.map(h=>'<a href="#'+h.id+'">'+h.text+'</a>').join('')+'</div></nav>';
      body=body.replace('</section>','</section>'+toc);
    }
  }
  const can = canonical || `https://${SITE.host}${SITE.base}${path}`;
  return `<!DOCTYPE html>
<html lang="${LANG_HTML[lang]}" data-lang="${lang}">
<head>
<meta charset="utf-8">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#0e0e0d">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(can)}">
<link rel="alternate" hreflang="ja" href="https://${SITE.host}${SITE.base}/ja${path.replace(/^\/(ja|ko|en)/, '')}">
<link rel="alternate" hreflang="ko" href="https://${SITE.host}${SITE.base}/ko${path.replace(/^\/(ja|ko|en)/, '')}">
<link rel="alternate" hreflang="en" href="https://${SITE.host}${SITE.base}/en${path.replace(/^\/(ja|ko|en)/, '')}">
<link rel="alternate" hreflang="x-default" href="https://${SITE.host}${SITE.base}/ja${path.replace(/^\/(ja|ko|en)/, '')}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta name="theme-color" content="#0e0e0d">
<meta name="rating" content="adult">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${LANG_HTML[lang].replace('-', '_')}">
<meta property="og:url" content="${esc(can)}">
<meta property="og:image" content="https://${SITE.host}/images/hero-tokyo-night.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#e3ac44"/><path d="M23 18.5A9 9 0 1 1 13.5 9a7 7 0 0 0 9.5 9.5Z" fill="#151007"/></svg>')}">
${process.env.STATIC_BUILD === '1'
  ? `<link rel="stylesheet" href="${url('/style.css')}">`
  : `<style>${CSS}</style>`}
${jsonLd ? jsonld(jsonLd) : ''}
${extraHead}
</head>
<body class="page-${esc(pageType)}" data-page-type="${esc(pageType)}">
<a class="skip" href="#main">${lang === 'ja' ? '本文へスキップ' : lang === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}</a>
${header(lang, path, q)}
<main id="main">
${body}
</main>
${footer(lang)}
${gate ? ageGate(lang) : ''}
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="image">
  <button class="lb-x" id="lbX" type="button" aria-label="close">×</button>
  <img id="lbImg" alt="" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
</div>
${process.env.STATIC_BUILD === '1'
  ? `<script src="${url('/static-api.js')}" data-base="${SITE.base}"></script>`
  : ''}<script>${CLIENT_JS}</script>${collectionScript(lang,SITE.base,path.includes('/compare/'))}
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// client JS — hardened mobile nav, no innerHTML swaps, bfcache-safe
// ---------------------------------------------------------------------------
export const CLIENT_JS = String.raw`
(function(){
  var BASE=${JSON.stringify(SITE.base)};
  "use strict";
  var $ = function(s,c){return (c||document).querySelector(s)};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var lang = document.documentElement.getAttribute('data-lang') || 'ja';
  function yen(n){ return '\u00a5' + Math.round(Number(n)||0).toLocaleString('en-US'); }
  function fmt(n){ return (Math.round(Number(n)||0)).toLocaleString('en-US'); }

  $$('[data-lang][href]').forEach(function(a){if(!a.search)a.search=window.location.search;});

  /* ---------- mobile nav: single source of truth, no icon rebuild ---------- */
  var burger=$('#burger'), mnav=$('#mnav'), mnavX=$('#mnavX');
  function setNav(open){
    if(!burger||!mnav) return;
    mnav.inert=!open;
    mnav.classList.toggle('open', open);
    mnav.setAttribute('aria-hidden', open?'false':'true');
    burger.setAttribute('aria-expanded', open?'true':'false');
    document.documentElement.classList.toggle('nav-open', open);
    document.body.classList.toggle('noscroll', open);
    if(!open) resetScrollLock();
  }
  function closeNav(){ var inside=mnav&&mnav.contains(document.activeElement); setNav(false); if(inside&&burger) burger.focus({preventScroll:true}); }
  if(burger){ burger.addEventListener('click', function(e){ e.preventDefault(); setNav(!mnav.classList.contains('open')); }); }
  if(mnavX){ mnavX.addEventListener('click', function(e){ e.preventDefault(); closeNav(); burger && burger.focus(); }); }
  // any nav link closes the menu before navigating
  if(mnav){ mnav.addEventListener('click',function(e){ var a=e.target.closest('a'); if(a){closeNav();resetScrollLock();} }); mnav.addEventListener('submit',function(){closeNav();resetScrollLock();}); }
  window.addEventListener('pagehide',function(){closeNav();resetScrollLock();});
  document.addEventListener('keydown', function(e){
    if(e.key==='Tab'&&mnav&&mnav.classList.contains('open')){
      var focusable=[burger].concat($$('a,button,input,select',mnav)).filter(function(el){return el&&el.getClientRects().length&&!el.disabled;});
      var first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    } if(e.key==='Escape'){ closeNav(); closeLb(); } });
  // clicking the dimmed area to the right/below is not applicable (full-screen), but
  // tapping the page behind an open menu should close it
  document.addEventListener('click', function(e){
    if(!mnav||!mnav.classList.contains('open')) return;
    if(mnav.contains(e.target)||(burger&&burger.contains(e.target))) return;
    closeNav();
  }, true);
  // bfcache / back-forward restore must never leave the page scroll-locked
  window.addEventListener('pageshow', function(){ setNav(false); closeLb(); document.body.classList.remove('noscroll'); });
  // resize past the desktop breakpoint resets the menu
  var mq = window.matchMedia('(min-width:1100px)');
  function onMq(){ if(mq.matches) closeNav(); }
  if(mq.addEventListener) mq.addEventListener('change',onMq); else if(mq.addListener) mq.addListener(onMq);
  window.addEventListener('orientationchange', function(){ closeNav(); });

  /* ---------- age gate ---------- */
  var gate = $('#ageGate');
  if(gate){
    var KEY='yn_age_ok', ok=false;
    try{ ok = localStorage.getItem(KEY)==='1'; }catch(e){}
    if(ok){ gate.parentNode.removeChild(gate); }
    else { document.body.classList.add('noscroll'); }
    var yes=$('#gateYes'), no=$('#gateNo'), rem=$('#gateRemember'), den=$('#gateDenied');
    if(yes) yes.addEventListener('click',function(){
      try{ if(rem && rem.checked) localStorage.setItem(KEY,'1'); }catch(e){}
      gate.style.transition='opacity .22s'; gate.style.opacity='0';
      setTimeout(function(){ if(gate.parentNode) gate.parentNode.removeChild(gate); document.body.classList.remove('noscroll'); },200);
    });
    if(no) no.addEventListener('click',function(){
      if(den) den.style.display='block';
      if(yes){ yes.disabled=true; yes.style.opacity='.4'; yes.style.pointerEvents='none'; }
    });
  }

  /* ---------- toast ---------- */
  window.ynToast=function(msg){
    var to=$('#toast'); if(!to)return;
    to.textContent=msg; to.classList.add('show');
    clearTimeout(window.__tt); window.__tt=setTimeout(function(){to.classList.remove('show')},2600);
  };

  /* ---------- lightbox ---------- */
  var lb=$('#lb'), lbImg=$('#lbImg'), lbX=$('#lbX');
  function closeLb(){ if(!lb)return; lb.classList.remove('open'); document.body.classList.remove('noscroll'); }
  $$('a[data-lb]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      if(!lb) return;
      lbImg.src=a.getAttribute('data-lb'); lbImg.alt=a.getAttribute('data-alt')||'';
      lb.classList.add('open'); document.body.classList.add('noscroll');
    });
  });
  if(lbX) lbX.addEventListener('click',closeLb);
  if(lb) lb.addEventListener('click',function(e){ if(e.target===lb) closeLb(); });

  /* ---------- language switch keeps query string ---------- */
  $$('.langs a[data-lang]').forEach(function(a){
    a.addEventListener('click',function(e){
      if(location.search){ e.preventDefault(); location.href=a.getAttribute('href')+location.search; }
    });
  });


  /* スクロールロックが残るとページが固まる（＝ハンバーガー後に操作不能）。
     閉じる経路すべてでロックを外し、固まっていた場合も復帰させる。 */
  function resetScrollLock(){
    document.body.classList.remove('noscroll');
    document.documentElement.classList.remove('nav-open');
    document.body.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.documentElement.style.removeProperty('height');
    if(!window.__ynScrollY){ window.__ynScrollY=0; }
  }

  /* ---------- price calculator ---------- */
  var calc=$('#calc');
  if(calc){
    // [name] を優先し、無ければ id で拾う（両方のマークアップで動くように）
    function pick(name,id){ return calc.querySelector('[name="'+name+'"]') || document.getElementById(id); }
    var els={cat:pick('cat','cCat'),area:pick('priceIndex','cArea'),plan:pick('plan','cPlan'),
      drinks:pick('castDrinks','cDrinks'),ext:pick('extensions','cExt'),people:pick('people','cPeople'),
      nom:pick('nomination','cNom'),svc:pick('service','cSvc'),late:pick('lateNight','cLate'),
      disc:pick('discount','cDisc')};
    var calcParams=new URLSearchParams(location.search);
    if(els.cat&&['snack','girlsbar','massage'].indexOf(calcParams.get('cat'))>=0) els.cat.value=calcParams.get('cat');
    // works for <select>, <input type=checkbox> and hidden inputs alike
    function on(el,dflt){
      if(!el) return dflt;
      if(el.type==='checkbox') return el.checked?'1':'0';
      var v=el.value;
      return (v===undefined||v===null)?dflt:v;
    }
    var resetButton=$('#calcReset');
    if(resetButton) resetButton.addEventListener('click',function(){
      Object.keys(els).forEach(function(k){var el=els[k];if(el&&el.tagName==='SELECT') el.selectedIndex=0;});
      if(els.area) els.area.value='1';
      if(els.svc) els.svc.value='1';
      render();
    });
    var calcRequest=0;
    function priceIndex(){ return (els.area && parseFloat(els.area.value)) || 1; }
    function render(){
      if(!els.cat||!els.plan) return;
      var areaLabel=$('#areaIdx'); if(areaLabel) areaLabel.textContent='×'+priceIndex().toFixed(2);
      var requestId=++calcRequest;
      var p=new URLSearchParams({
        cat:els.cat.value, plan:els.plan.value, priceIndex:priceIndex(),
        castDrinks:on(els.drinks,'0'), extensions:on(els.ext,'0'),
        people:on(els.people,'1'),
        nomination:on(els.nom,'0')==='1'?'1':'0',
        service:on(els.svc,'1')==='1'?'1':'0',
        lateNight:on(els.late,'0')==='1'?'1':'0',
      });
      // クーポンは「%」なので、セット料金ベースの概算額に変換して送る
      var discPct=parseFloat(on(els.disc,'0'))||0;
      var setBaseYen={snack:3500,girlsbar:4500,massage:6000}[els.cat.value]||3500;
      if(discPct>0){ p.set('discount', String(Math.round(setBaseYen*(priceIndex())*(discPct/100)/100)*100)); }
      fetch(BASE+'/api/quote?'+p.toString(),{headers:{accept:'application/json'}})
        .then(function(r){return r.json()})
        .then(function(d){
          if(requestId!==calcRequest||!d||!d.ok||!d.quote) return;
          var q=d.quote;
          var set=function(id,v){var e=$(id); if(e) e.textContent=v;};
          set('#calcTotal',yen(q.totalPerPerson));
          set('#calcTotalAll',yen(q.totalAll));
          set('#calcHourly',yen(q.effectiveHourly));
          set('#calcTaxAmt',yen(q.tax));
          var lines=$('#calcLines');
          if(lines){
            lines.innerHTML=q.lines.map(function(l){
              var lg=(q&&q.lang)||document.documentElement.getAttribute('data-lang')||'ja';
              var lab=(l&&(l[lg]||l.ja||l.en||''))||'';
              return '<div class="calc-line'+(l.amount<0?' disc':'')+'"><span>'+lab+'</span><b>'+yen(l.amount)+'</b></div>';
            }).join('')
            + '<div class="calc-line sum"><span>'+d.t.subtotal+'</span><b>'+yen(q.subtotal)+'</b></div>'
            + '<div class="calc-line"><span>'+d.t.tax+'</span><b>'+yen(q.tax)+'</b></div>';
          }
        }).catch(function(err){ console.warn('[calc]', err&&err.message); });
    }
    if(els.area) els.area.addEventListener('change',function(){
      var ai=$('#areaIdx'); if(ai) ai.textContent='\u00d7'+priceIndex().toFixed(2);
      render();
    });
    ['cat','plan','drinks','ext','people','nom','svc','late','disc'].forEach(function(k){
      var el=els[k]; if(!el) return;
      el.addEventListener('change',render); el.addEventListener('input',render);
    });
    render();
  }

  /* ---------- ad ROI simulator ---------- */
  var roi=$('#roi');
  if(roi){
    var rp=$('#roiPlan'), rs=$('#roiSpend'), rm=$('#roiMonths');
    function roiRender(){
      if(!rp) return;
      var p=new URLSearchParams({plan:rp.value,avgSpend:rs?rs.value:8000,months:rm?rm.value:1});
      fetch(BASE+'/api/roi?'+p.toString(),{headers:{accept:'application/json'}})
        .then(function(r){return r.json()}).then(function(d){
          if(!d||!d.ok) return;
          var r=d.roi;
          var set=function(id,v){var e=$(id); if(e) e.textContent=v;};
          set('#roiImpr',fmt(r.impressions)); set('#roiClicks',fmt(r.clicks));
          set('#roiVisits',fmt(r.visits)); set('#roiRev',yen(r.revenue));
          set('#roiCost',yen(r.cost)); set('#roiRoas',r.roas.toFixed(2)+'\u00d7');
          set('#roiPct',r.roi+'%');
          var f=$('#roiFill'); if(f) f.style.width=Math.max(4,Math.min(100,Math.max(0,r.roi)/2))+'%';
        }).catch(function(){});
    }
    [rp,rs,rm].forEach(function(e){ if(e){ e.addEventListener('change',roiRender); e.addEventListener('input',roiRender);} });
    roiRender();
  }

  /* ---------- listing enquiry form ---------- */
  /* ---------- enquiry / registration form ----------
     #inqForm は問い合わせ、#regForm は店舗の無料掲載申込。
     どちらも <form action="/api/..."> の data-* に文言を持たせている。 */
  ['#inqForm','#regForm'].forEach(function(sel){
    var form=$(sel);
    if(!form) return;
    var status=$('#formStatus');
    var endpoint=form.getAttribute('action')||'/api/inquiry';
    var consentEl=$('#formConsent')||$('#regConsent');

    function showStatus(cls,txt){
      if(!status) return;
      status.className='form-status '+cls;
      status.textContent=txt;
      status.style.display='block';
      status.scrollIntoView({block:'center',behavior:'smooth'});
    }

    form.addEventListener('submit',function(e){
      e.preventDefault();
      var bad=false;

      // 必須チェック（data-required が付いた要素）
      $$('[data-required]',form).forEach(function(f){
        var msg=f.parentNode.querySelector('.err-msg');
        var val=(f.value||'').trim();
        var invalid=!val;
        if(f.type==='email'&&val) invalid=!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
        if(f.type==='tel'&&val) invalid=!/^0\d{1,4}-?\d{1,4}-?\d{3,4}$/.test(val.replace(/\s/g,''));
        f.classList.toggle('err',invalid);
        f.setAttribute('aria-invalid',invalid?'true':'false');
        if(msg) msg.classList.toggle('show',invalid);
        if(invalid) bad=true;
      });

      if(consentEl&&!consentEl.checked){ bad=true; consentEl.classList.add('err'); }
      else if(consentEl){ consentEl.classList.remove('err'); }

      var photoInput=form.querySelector('[name=photoUrl]'), rightsInput=form.querySelector('[name=photoRightsConfirmed]');
      if(photoInput&&photoInput.value.trim()&&(!rightsInput||!rightsInput.checked)){showStatus('ng',({ja:'写真の利用許諾を確認してください。',ko:'사진 사용 허락을 확인해 주세요.',en:'Confirm photo permission before submitting.'})[lang]);return;}
      if(bad){
        showStatus('ng',form.dataset.msgInvalid||'Please check the required fields.');
        var first=form.querySelector('.err');
        if(first&&first.focus) first.focus({preventScroll:true});
        return;
      }

      if(status){ status.className='form-status'; status.style.display='none'; }

      // フォーム全体を集約（checkbox の複数値は配列に）
      var payload={};
      new FormData(form).forEach(function(v,k){
        if(Object.prototype.hasOwnProperty.call(payload,k)){
          if(!Array.isArray(payload[k])) payload[k]=[payload[k]];
          payload[k].push(v);
        } else { payload[k]=v; }
      });
      payload.consent = consentEl ? !!consentEl.checked : false;
      if(rightsInput)payload.photoRightsConfirmed=!!rightsInput.checked;
      payload.lang = document.documentElement.getAttribute('data-lang') || 'ja';
      payload.at = new Date().toISOString();

      var btn=form.querySelector('button[type=submit]');
      var old=btn ? btn.textContent : '';
      if(btn){ btn.disabled=true; btn.setAttribute('aria-busy','true'); btn.textContent=form.dataset.msgSending||old; }
      if(status){ status.className='form-status'; status.textContent=form.dataset.msgSending||''; status.style.display='block'; }

      function done(ok,via){
        if(btn){ btn.disabled=false; btn.removeAttribute('aria-busy'); btn.textContent=old; }
        if(ok && via==='mailto'){
          // 정적 배포: 서버가 없으므로 메일 앱으로 넘긴다
          showStatus('ok',form.dataset.msgMail||form.dataset.msgOk||'Opening your mail app.');
          return;
        }
        if(ok){ showStatus('ok',form.dataset.msgOk||'Sent.'); form.reset(); }
        else { showStatus('ng',form.dataset.msgErr||'Sending failed.'); }
      }

      fetch(BASE+endpoint,{
        method:'POST',
        headers:{'content-type':'application/json',accept:'application/json'},
        body:JSON.stringify(payload)
      })
        .then(function(r){ return r.json().catch(function(){ return {ok:false}; }); })
        .then(function(d){ done(!!(d&&d.ok), d&&d.via); })
        .catch(function(){ done(false); });
    });

    // 入力し直したらエラー表示を消す
    form.addEventListener('input',function(e){
      var f=e.target;
      if(!f||!f.classList||!f.classList.contains('err')) return;
      f.classList.remove('err');
      f.removeAttribute('aria-invalid');
      var m=f.parentNode.querySelector('.err-msg');
      if(m) m.classList.remove('show');
    });
  });

  /* ---------- plan CTA preselect ---------- */
  $$('a[data-plan]').forEach(function(a){
    a.addEventListener('click', function(){
      var pl=document.getElementById('plan');
      if(pl) pl.value=a.getAttribute('data-plan');
    });
  });

  /* ---------- listing filter / sort ---------- */
  var grid=$('#shopGrid');
  if(grid){
    var fq=$('#fQuery'), fc=$('#fCat'), fp=$('#fPrice'), fs=$('#fSort'), ff=$('#fFeat');
    var searchDataset=$('#searchDataset'), searchRecords=null, searchLimit=24;
    if(searchDataset){try{searchRecords=JSON.parse(searchDataset.textContent);}catch(e){console.warn('[search]',e.message);}}
    var searchPref=$('#fPref'),searchDistrict=$('#fDist');
    var countEl=$('#fCount'), emptyEl=$('#fEmpty');
    function hydrateFromUrl(){
      var params=new URLSearchParams(window.location.search);
      if(!params.get('pref')&&params.get('district')&&searchRecords){var record=searchRecords.find(function(r){return r.district===params.get('district');});if(record)params.set('pref',record.pref);}
      [[fq,'q'],[fc,'cat'],[fp,'max'],[fs,'sort'],[ff,'feat'],[searchPref,'pref'],[searchDistrict,'district']].forEach(function(pair){
        if(pair[0]&&params.has(pair[1])){pair[0].value=params.get(pair[1]);if(pair[0]===searchPref)pair[0].dispatchEvent(new Event('change'));}
      });
    }
    hydrateFromUrl();
    window.addEventListener('pageshow',function(){hydrateFromUrl();apply();});
    function apply(){
      if(searchRecords){
        var text=(fq&&fq.value||'').toLowerCase().trim(), category=fc&&fc.value||'',pref=searchPref&&searchPref.value||'',district=searchDistrict&&searchDistrict.value||'',feature=ff&&ff.value||'',max=Number(fp&&fp.value)||0,sort=fs&&fs.value||'points';
        var matches=searchRecords.filter(function(r){return (!text||r.search.indexOf(text)>=0)&&(!category||r.cat===category)&&(!pref||r.pref===pref)&&(!district||r.district===district)&&(!feature||r.feat.indexOf(feature)>=0)&&(!max||(r.known&&r.price<=max));});
        matches.sort(function(a,b){
          if(sort==='priceLow'||sort==='priceHigh'){if(a.known!==b.known)return a.known?-1:1;return sort==='priceLow'?a.price-b.price:b.price-a.price;}
          if(sort==='rating')return b.rating-a.rating;
          if(a.real!==b.real)return a.real?-1:1;
          return b.points-a.points;
        });
        grid.innerHTML=matches.slice(0,searchLimit).map(function(r){return BASE?r.html.replace(/(href|src)="\/(?!\/)/g,'$1="'+BASE+'/'):r.html;}).join('');
        if(countEl)countEl.textContent=matches.length;
        if(emptyEl)emptyEl.style.display=matches.length?'none':'block';
        var more=$('#fMore');if(more)more.style.display=matches.length>searchLimit?'block':'none';
        return;
      }
      var q=(fq&&fq.value||'').toLowerCase().trim();
      var cat=fc&&fc.value||'';
      var maxp=fp&&fp.value?parseInt(fp.value,10):0;
      var feat=ff&&ff.value||'';
      var cards=$$('.sc',grid), shown=0;
      cards.forEach(function(c){
        var ok=true;
        if(q && (c.dataset.search||'').toLowerCase().indexOf(q)===-1) ok=false;
        if(ok&&cat&&c.dataset.cat!==cat) ok=false;
        if(ok&&maxp&&parseInt(c.dataset.price,10)>maxp) ok=false;
        if(ok&&feat&&(' '+(c.dataset.feat||'')+' ').indexOf(' '+feat+' ')===-1) ok=false;
        c.style.display=ok?'':'none';
        if(ok) shown++;
      });

      if(countEl) countEl.textContent=shown;
      if(emptyEl) emptyEl.style.display=shown?'none':'block';
      if(fs){
        var list=cards.slice().sort(function(a,b){
          var k=fs.value;
          if(k==='priceLow') return (+a.dataset.price)-(+b.dataset.price);
          if(k==='priceHigh') return (+b.dataset.price)-(+a.dataset.price);
          if(k==='rating') return (+b.dataset.rating)-(+a.dataset.rating);
          return (+b.dataset.points)-(+a.dataset.points);
        });
        list.forEach(function(c){grid.appendChild(c)});
      }
    }
    var moreBtn=$('#fMoreBtn');
    if(moreBtn){ moreBtn.addEventListener('click',function(){searchLimit+=24;apply();}); }
    [fq,fc,fp,ff,searchPref,searchDistrict].forEach(function(e){if(e){var update=function(){searchLimit=24;apply();};e.addEventListener('input',update);e.addEventListener('change',update);}});
    if(fs) fs.addEventListener('change',apply);
    $$('.fchips button').forEach(function(b){
      b.addEventListener('click',function(){
        $$('.fchips button').forEach(function(x){x.classList.remove('on')});
        b.classList.add('on');
        if(ff) ff.value=b.dataset.feat||'';
        apply();
      });
    });
    apply();
  }
})();
/* ---- light-luxury motion layer (progressive enhancement) ---- */
(function(){
  var de=document.documentElement;
  de.classList.add('js');
  var hd=document.querySelector('.hd');
  if(hd){
    var onS=function(){ if(window.scrollY>8){hd.classList.add('stuck')}else{hd.classList.remove('stuck')} };
    onS(); window.addEventListener('scroll',onS,{passive:true});
  }
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items=Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
  if(!items.length) return;
  if(reduce||!('IntersectionObserver' in window)){
    items.forEach(function(el){el.classList.add('rv-in')}); return;
  }
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('rv-in'); io.unobserve(e.target); }
    });
  },{rootMargin:'0px 0px -8% 0px',threshold:.06});
  items.forEach(function(el){io.observe(el)});
})();

`;
