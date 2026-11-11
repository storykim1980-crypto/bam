import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch();let checks=0;
try{
 const c=await b.newContext();await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));const p=await c.newPage();
 for(const lang of ['ja','ko','en'])for(const host of ['http://127.0.0.1:3000','http://127.0.0.1:8123/bam-night']){
  await p.goto(host+'/'+lang+'/search/');
  const records=await p.$eval('#searchDataset',e=>JSON.parse(e.textContent));
  assert.equal(Number(await p.locator('#fCount').textContent()),records.length);
  assert.equal(await p.locator('.sc').count(),24);
  await p.click('#fMoreBtn');assert.equal(await p.locator('.sc').count(),48);
  await p.selectOption('#fCat','massage');
  assert.equal(Number(await p.locator('#fCount').textContent()),records.filter(r=>r.cat==='massage').length);
  assert(await p.locator('.sc').evaluateAll(els=>els.every(e=>e.dataset.cat==='massage')));
  await p.goto(host+'/'+lang+'/search/?pref=tokyo&district=ginza');
  assert.equal(await p.locator('#fDist').inputValue(),'ginza');
  assert.equal(Number(await p.locator('#fCount').textContent()),records.filter(r=>r.pref==='tokyo'&&r.district==='ginza').length);
  assert(await p.locator('.sc').evaluateAll(els=>els.every(e=>e.dataset.district==='ginza')));
  const href=await p.locator('.sc-name').first().locator('..').getAttribute('href');
  assert(href.startsWith(new URL(host).pathname.replace(/\/$/,'')+'/'+lang+'/shop/'));
  checks++;
 }
 console.log('PASS: '+checks+' host/language combinations; full index counts, 24/48 pagination, category filter, URL district, correct subpath links');
}finally{await b.close();}
