import { chromium } from 'playwright';
const b = await chromium.launch();
for (const lang of ['ja','ko','en']) {
  for (const [path,w] of [['/','390'],['/search/','390'],['/price/','390'],['/advertise/','390'],['/','1440']]) {
    const ctx = await b.newContext({ viewport:{width:+w,height:900}, isMobile:+w<500, hasTouch:+w<500 });
    await ctx.addInitScript(()=>{try{localStorage.setItem('yn_age_ok','1')}catch{}});
    const p = await ctx.newPage();
    await p.goto('http://127.0.0.1:3000/'+lang+path, { waitUntil:'networkidle' });
    await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const clipped = (el) => {
        for (let a = el.parentElement; a; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX;
          if (o === 'auto' || o === 'hidden' || o === 'scroll') return true;
        }
        return false;
      };
      const bad = [];
      document.querySelectorAll('main *').forEach(el => {
        const b = el.getBoundingClientRect();
        if ((b.right > vw + 1 || b.left < -1) && !clipped(el))
          bad.push(el.tagName + '.' + (el.className||'').toString().split(' ')[0] + ' L' + Math.round(b.left) + ' R' + Math.round(b.right));
      });
      return { sw: document.documentElement.scrollWidth, vw, bad: [...new Set(bad)].slice(0,8) };
    });
    const ok = r.sw <= r.vw + 1 && r.bad.length === 0;
    console.log((ok?'OK  ':'FAIL'), lang+path, w, 'sw='+r.sw, r.bad.join(' | '));
    await ctx.close();
  }
}
await b.close();
