import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch();let n=0;
try{
 for(const base of ['http://127.0.0.1:3000','http://127.0.0.1:8123/bam-night']){
  const c=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));
  const p=await c.newPage();
  for(const lang of ['ja','ko','en']){
   await p.goto(base+'/'+lang+'/');
   for(let i=0;i<5;i++){
    await p.click('#burger');assert(await p.locator('#mnav').isVisible());
    assert.equal(await p.locator('#mnav a').count(),7);
    await p.click('#burger');
    await p.evaluate(()=>window.scrollTo({top:300,behavior:'instant'}));
    assert(await p.evaluate(()=>scrollY>0&&!document.body.classList.contains('noscroll')&&!document.documentElement.classList.contains('nav-open')));
    n++;
   }
   await p.click('#burger');await p.locator('#mnav a').nth(1).click();await p.waitForLoadState('domcontentloaded');
   assert(await p.evaluate(()=>!document.body.classList.contains('noscroll')));
   await p.goBack();await p.waitForLoadState('domcontentloaded');
   assert(await p.evaluate(()=>!document.documentElement.classList.contains('nav-open')));
   await p.click('#burger');await p.keyboard.press('Escape');assert.equal(await p.locator('#burger').getAttribute('aria-expanded'),'false');
   await p.click('#burger');await p.setViewportSize({width:1200,height:900});assert.equal(await p.locator('#burger').getAttribute('aria-expanded'),'false');
   await p.setViewportSize({width:390,height:844});
   assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  await c.close();
 }
 console.log(`PASS: ${n} open-close-scroll cycles; 3 languages × 2 hosts; link navigation, back, Escape, desktop resize, overflow`);
}finally{await b.close();}
