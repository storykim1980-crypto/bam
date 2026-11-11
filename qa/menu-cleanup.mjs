import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const base=process.env.BASE||'http://127.0.0.1:8123/bam-night';const b=await chromium.launch();const c=await b.newContext();await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));let checks=0;
try{
 for(const lang of ['ja','ko','en'])for(const width of [320,390,1440])for(const route of ['','snack/','girlsbar/','massage/','price/']){
  await p.setViewportSize({width,height:1000});const r=await p.goto(`${base}/${lang}/${route}`);assert.equal(r.status(),200);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const text=await p.locator('main').innerText();assert(!/지역별 요금 시세|料金相場|地域別.*相場|regional price comparison|area price band|지역 가격대|全国平均|전국 평균|National average/i.test(text));
  assert.equal(await p.locator('#cArea,#areaIdx').count(),0);
  if(!route){
   assert.equal(await p.locator('main #calc,main .calc,main #calcTotal').count(),0);
   assert(!/시뮬레이터|シミュレーター|simulator|estimate your total/i.test(text));
   assert.equal(await p.locator('#home-main-menu > a').count(),3);
   for(const cat of ['snack','girlsbar','massage'])assert.equal(await p.locator(`#home-main-menu a[href="${base.replace(/^https?:\/\/[^/]+/,'')}/${lang}/${cat}/"]`).count(),1);
   const links=await p.locator('.night-essential-grid > a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
   for(const target of ['area','guide','search'])assert(links.some(u=>u.endsWith(`/${lang}/${target}/`)));
  }
  if(route==='price/')assert.equal(await p.locator('#calc').count(),1);
  checks++;
 }
 assert.equal(errors.length,0,errors.join('\n'));
 console.log(`PASS: ${checks} language/viewport/route checks; 3 main category links; no home calculator or regional price bands; no horizontal overflow`);
 fs.writeFileSync('qa/real-snack/menu-cleanup-v26.json',JSON.stringify({checks,passed:true,errors},null,2)+'\n');
 await p.goto(base+'/ko/');await p.locator('.night-category img').first().scrollIntoViewIfNeeded();await p.locator('.night-category img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));});await p.screenshot({path:'/home/user/bam-night-v26-home-preview.png',fullPage:true});
}finally{await b.close();}
