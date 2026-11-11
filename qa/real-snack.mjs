import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {SHOPS,SAMPLE_SHOP_COUNT} from '../src/data/shops.mjs';
const profiles=SHOPS.filter(s=>s.researchProfile);
const expected=JSON.parse(fs.readFileSync('research/venues.json')).filter(p=>p.status==='published_research').length;assert.equal(profiles.length,expected);assert.equal(SAMPLE_SHOP_COUNT,0);assert(SHOPS.every(s=>!s.sample&&s.realData&&s.rating===0&&s.reviewCount===0));
assert(profiles.every(s=>s.images.length===0&&!s.verifiedLegal&&!s.researchProfile.ownerConfirmed));
const b=await chromium.launch();const c=await b.newContext();await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));const p=await c.newPage();let checks=0;const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 for(const s of profiles)for(const lang of ['ja','ko','en'])for(const width of [320,390,1440]){
  await p.setViewportSize({width,height:1000});const r=await p.goto('http://127.0.0.1:8123/bam-night/'+lang+'/shop/'+s.slug+'/');assert.equal(r.status(),200);
  assert.equal(await p.locator('#menu').count(),1);
  assert.equal(await p.locator('#visit-info').count(),1);assert.equal(await p.locator('#sources a').count(),1+(s.researchProfile.additionalSources||[]).length);
  assert.equal(await p.locator('a[href^="tel:"]').count(),s.researchProfile.phone?1:0);
  assert.equal(await p.locator('.visit-actions a[href="'+(s.researchProfile.bookingUrl||'__none__')+'"]').count(),s.researchProfile.bookingUrl?1:0);
  assert.equal(await p.locator('#source-notice').count(),s.researchProfile.notices?1:0);
  if(s.researchProfile.notices)assert((await p.locator('#source-notice').innerText()).includes(s.researchProfile.notices[lang]));
  assert.equal(await p.locator('#photo-policy img').count(),1);
  assert.equal(await p.locator('#photo-policy figure[data-ai-illustration="category"]').count(),1);
  assert(await p.locator('#photo-policy figcaption').innerText().then(t=>t.includes('AI')));
  assert(await p.locator('#photo-policy img').evaluate(im=>im.complete&&im.naturalWidth>0));
  assert(!(await p.locator('#photo-policy img').getAttribute('src')).startsWith('https:'));
  assert.equal(await p.locator('meta[name="robots"]').getAttribute('content'),'noindex,follow');
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const text=await p.locator('main').innerText();assert(!/undefined|NaN|★|🐾/.test(text));
  if(s.slug==='shinjuku-snack-powan'&&lang==='ko'&&width===1440)await p.screenshot({path:'/home/user/bam-night-real-snack-detail.png',fullPage:true});
  checks++;
 }
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: '+checks+' researched-detail checks; public listings '+SHOPS.length+'; '+profiles.length+' source-reviewed profiles; 0 synthetic shops/reviews; no unlicensed copied photos; unknown phones omitted; noindex; no overflow');
 fs.writeFileSync('qa/real-snack/result.json',JSON.stringify({checks,publicListings:SHOPS.length,researchProfiles:profiles.length,ownerConfirmed:0,photoPermissionCleared:0,synthetic:0,errors},null,2));
}finally{await b.close();}
