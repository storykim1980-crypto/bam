// GitHub Pages(서브패스 + 정적) 환경 검증
import { chromium } from 'playwright';
const BASE = process.env.GH_BASE || 'http://127.0.0.1:4100/bam-night';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:390,height:844}, isMobile:true, hasTouch:true, deviceScaleFactor:2 });
await ctx.addInitScript(()=>{try{localStorage.setItem('yn_age_ok','1')}catch{}});
const p = await ctx.newPage();
const issues = [], errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type()==='error' && !/favicon|ERR_ABORTED/.test(m.text())) errs.push(m.text()); });
p.on('response', r => { if (r.url().startsWith(BASE.replace(/\/$/,'')) && r.status()>=400) errs.push(`HTTP ${r.status()} ${r.url()}`); });

const routes = ['/','/ja/','/ko/','/en/','/ja/price/','/ja/search/','/ja/register/','/ja/advertise/','/ja/ranking/','/ja/area/','/ja/area/tokyo/','/ja/area/tokyo/shinjuku-kabukicho/','/ja/snack/','/ja/legal/tokushoho/'];
for (const r of routes) {
  await p.goto(BASE + r, { waitUntil:'networkidle' });
  await p.waitForTimeout(250);
  const info = await p.evaluate(() => ({
    title: document.title.slice(0,40),
    h1: (document.querySelector('h1')?.textContent||'').trim().slice(0,30),
    css: getComputedStyle(document.body).backgroundColor,
    docW: document.documentElement.scrollWidth,
    vw: window.innerWidth,
    links: document.querySelectorAll('a[href]').length,
    imgs: [...document.images].filter(i=>i.src && i.getAttribute('src')!=='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7').length,
  }));
  const bad = [];
  if (!info.h1) bad.push('h1 없음');
  if (info.css === 'rgba(0, 0, 0, 0)') bad.push('CSS 미적용');
  if (info.docW > info.vw + 1) bad.push(`가로넘침 ${info.docW}>${info.vw}`);
  if (info.links < 10) bad.push(`링크 ${info.links}`);
  console.log(`${bad.length?'✗':'✓'} ${r.padEnd(40)} ${info.title}`);
  if (bad.length) issues.push(`${r}: ${bad.join(', ')}`);
}

// 계산기 (서버 없이 브라우저에서 계산되는지)
await p.goto(BASE + '/ja/price/',{waitUntil:'networkidle'});
await p.waitForTimeout(900);
const t1 = await p.locator('#calcTotal').first().textContent();
await p.selectOption('#cCat','massage');
await p.waitForTimeout(600);
const t2 = await p.locator('#calcTotal').first().textContent();
console.log(`\n계산기: 기본 ${t1} → massage ${t2}`);
if (!t1 || t1.trim()==='—') issues.push('계산기: 초기값 계산 안 됨');
if (t1===t2) issues.push('계산기: 업종 변경 반영 안 됨');

// 이미지 로딩
const imgOk = await p.evaluate(async () => {
  const list=[...document.images].filter(i=>i.getAttribute('src')&&!i.src.startsWith('data:'));
  return Promise.all(list.map(i=>new Promise(r=>{ if(i.complete) r(i.naturalWidth>0); else {i.onload=()=>r(true); i.onerror=()=>r(false);} })));
});
const broken = imgOk.filter(x=>!x).length;
if (broken) issues.push(`이미지 ${broken}개 깨짐`);

// 링크 검사 (내부 링크가 /bam-night/ 하위인지)
await p.goto(BASE + '/ja/',{waitUntil:'networkidle'});
const oddLinks = await p.evaluate(() => [...document.querySelectorAll('a[href^="/"]')]
  .map(a=>a.getAttribute('href')).filter(h=>!h.startsWith('/bam-night/') && h!=='/bam-night'));
if (oddLinks.length) issues.push('서브패스 없는 링크: ' + [...new Set(oddLinks)].slice(0,5).join(', '));

if (errs.length) issues.push('콘솔/HTTP: ' + [...new Set(errs)].slice(0,5).join(' | '));
await b.close();
console.log(issues.length ? '\n' + issues.join('\n') : '\nALL CLEAN');
console.log('\nISSUES: ' + issues.length);
