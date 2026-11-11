import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const pages=[];function walk(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p);else if(p.endsWith('.html'))pages.push(p);}}walk('dist');
const forbidden=/\bcalcBar(?:Per|Total)?\b|\bcalc-bar\b|내역 보기/;
for(const file of pages)assert(!forbidden.test(fs.readFileSync(file,'utf8')),file+' contains removed total bar');
if(process.argv.includes('--static-only')){console.log('PASS: '+pages.length+' HTML files contain no legacy total bar');process.exit(0);}
const {chromium}=await import('playwright');
const base='http://127.0.0.1:8123/bam-night',b=await chromium.launch(),c=await b.newContext();await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));let checks=0;
const routes=['','snack/','girlsbar/','massage/','price/','advertise/','shop/shinjuku-snack-akari/','shop/shinjuku-girlsbar-oraf/','shop/shinjuku-massage-reraku-pepe/'];
try{
 for(const lang of ['ja','ko','en'])for(const width of [390,1440])for(const route of routes){
  await p.setViewportSize({width,height:900});const r=await p.goto(`${base}/${lang}/${route}`);assert.equal(r.status(),200);
  if(route==='price/'){await p.selectOption('#cCat','girlsbar');await p.waitForTimeout(100);}
  for(const bottom of [false,true]){
   await p.evaluate(bottom=>scrollTo(0,bottom?document.body.scrollHeight:0),bottom);
   assert.equal(await p.locator('#calcBar,#calcBarPer,#calcBarTotal,.calc-bar').count(),0);
   const fixed=await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.position==='fixed'&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0&&r.bottom>innerHeight-130&&r.top<innerHeight;}).map(e=>e.innerText||'').filter(t=>/내역 보기|内訳を見る|View breakdown|세금 포함 총액\(1인\)/i.test(t)));
   assert.equal(fixed.length,0,fixed.join('\n'));
  }
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));checks++;
 }
 assert.equal(errors.length,0,errors.join('\n'));const result={staticHtml:pages.length,browserChecks:checks,passed:true,errors};fs.writeFileSync('qa/real-snack/no-floating-v26.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: '+pages.length+' HTML files; '+checks+' browser cases, top/bottom and calculator interaction; no floating total bar');
 await p.goto(base+'/ko/shop/shinjuku-snack-akari/');await p.locator('#photo-policy img').scrollIntoViewIfNeeded();await p.locator('#photo-policy img').evaluate(e=>e.decode());await p.screenshot({path:'/home/user/bam-night-v26-snack-preview.png',fullPage:true});await p.evaluate(()=>scrollTo(0,document.body.scrollHeight));await p.screenshot({path:'/home/user/bam-night-v26-bottom-preview.png'});
}finally{await b.close();}
