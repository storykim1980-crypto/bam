import {chromium} from 'playwright';
import fs from 'node:fs';
import {LEGAL_PAGES} from '../src/pages/legal.mjs';
import {SHOPS} from '../src/data/shops.mjs';
const b=await chromium.launch();const issues=[];let checks=0;
const routes=['','search/','snack/','girlsbar/','massage/','ranking/','price/','guide/','advertise/','register/','area/','area/kanto/','area/tokyo/','area/tokyo/shinjuku-kabukicho/',...Object.keys(LEGAL_PAGES).map(x=>'legal/'+x+'/'),...['realData','sample'].map(key=>SHOPS.find(s=>s[key])).filter(Boolean).map(s=>'shop/'+s.slug+'/')];
const c=await b.newContext();await c.addInitScript(()=>localStorage.setItem('yn_age_ok','1'));const p=await c.newPage();
p.on('pageerror',e=>issues.push('JS: '+e.message));
for(const lang of ['ja','ko','en'])for(const route of routes)for(const width of [320,390,1440]){
 await p.setViewportSize({width,height:900});const url='http://127.0.0.1:8123/bam-night/'+lang+'/'+route;
 const res=await p.goto(url,{waitUntil:'load'});
 if(res.status()!==200)issues.push(url+' HTTP '+res.status());
 const info=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:!!document.querySelector('h1'),type:document.body.dataset.pageType,bad:/\bundefined\b|\bNaN\b/.test(document.body.innerText)}));
 if(info.overflow>1)issues.push(lang+'/'+route+' '+width+' overflow '+info.overflow);
 if(!info.h1||!info.type||info.bad)issues.push(lang+'/'+route+' content '+JSON.stringify(info));
 checks++;
}
await b.close();const result={checks,templates:routes.length,languages:3,widths:[320,390,1440],issues};fs.writeFileSync('qa/v17/interior-sweep.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));process.exitCode=issues.length?1:0;
