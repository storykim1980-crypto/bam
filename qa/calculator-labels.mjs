import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const b = await chromium.launch();
let checks = 0;
try {
 for (const base of ['http://127.0.0.1:3000', 'http://127.0.0.1:8123/bam-night']) {
  const ctx = await b.newContext();
  await ctx.addInitScript(() => localStorage.setItem('yn_age_ok','1'));
  const p = await ctx.newPage();
  for (const route of ['/ja/price/','/ko/price/','/en/price/']) {
   await p.goto(base+route);
   for (const cat of ['snack','girlsbar','massage']) {
    await p.selectOption('#cCat',cat);
    await p.waitForTimeout(350);
    const labels = await p.locator('#calcLines .calc-line span').allTextContents();
    assert(labels.length > 2, base+route+' missing lines');
    assert(labels.every(x => x.trim() && !/undefined|NaN/.test(x)),JSON.stringify(labels));
    const lang=route.split('/')[1];
    const expected=lang==='ko'?'세트':lang==='en'?'Set':'セット';
    assert(labels.some(x=>x.toLowerCase().includes(expected.toLowerCase())),JSON.stringify(labels));
    checks++;
   }
  }
  await ctx.close();
 }
 console.log('Calculator label regression: '+checks+' checks, 0 issues');
} finally { await b.close(); }
