import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {districtList} from '../src/data/geo.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const DATA=path.join(ROOT,'research/venues.json');
const OUT=path.join(ROOT,'src/data/researched-venues.mjs');
const cats=['snack','girlsbar','massage'],districts=new Set(districtList.map(d=>d.slug));
const langs=['ja','ko','en'];
export function safeUrl(value){
 if(typeof value!=='string'||value.length>2000)return false;
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&!/^(localhost|.*\.localhost|.*\.local|\[.*\]|\d+(\.\d+){3})$/i.test(u.hostname)&&u.hostname.includes('.');}catch{return false;}
}
const referenceDate='2026-11-08'; // trusted project research date; sandbox clock can lag
const researchToday=()=>[referenceDate,new Date().toISOString().slice(0,10)].sort().at(-1);
export function validateRows(rows,today=researchToday()){
 const errors=[],warnings=[],slugs=new Set(),ids=new Set(),identities=new Map();
 if(!Array.isArray(rows))return {errors:['Dataset must be an array'],warnings};
 const err=(i,m)=>errors.push(`[${i}] ${m}`);
 for(const [i,p] of rows.entries()){
  if(!p||typeof p!=='object'){err(i,'Record must be an object');continue;}
  const deletedPath=path.join(ROOT,'research/deleted-candidate-slugs.json');
  const userDeleted=fs.existsSync(deletedPath)?JSON.parse(fs.readFileSync(deletedPath,'utf8')):[];
  if(userDeleted.includes(p.slug))err(i,'User-deleted candidate cannot be reimported');
  if(!cats.includes(p.cat))err(i,'Unknown category');
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug||''))err(i,'Unsafe slug');
  if(slugs.has(p.slug))err(i,'Duplicate slug');slugs.add(p.slug);
  if(!p.id||typeof p.id!=='string')err(i,'Missing id');
  if(ids.has(p.id))err(i,'Duplicate id');ids.add(p.id);
  if(p.additionalSources!=null&&!Array.isArray(p.additionalSources)){err(i,'additionalSources must be an array');continue;}
  if(p.images!=null&&!Array.isArray(p.images)){err(i,'images must be an array');continue;}
  if(!p.fieldSources||typeof p.fieldSources!=='object'||Array.isArray(p.fieldSources)){err(i,'fieldSources must be an object');continue;}
  if(Object.values(p.fieldSources).some(v=>!Array.isArray(v))){err(i,'fieldSources values must be URL arrays');continue;}
  for(const lang of langs)if(typeof p.name?.[lang]!=='string'||!p.name[lang].trim())err(i,'Missing name translation: '+lang);
  if(typeof p.address!=='string'||p.address.trim().length<8)err(i,'Missing full address');
  if(!districts.has(p.districtSlug))err(i,'Unknown district');
  if(!['draft','published_research','archived'].includes(p.status))err(i,'Invalid publication state');
  if(!['official','third_party_directory','public_open_data','owner'].includes(p.sourceType))err(i,'Unsupported source type');
  for(const key of ['sourceUrl','mapUrl'])if(!safeUrl(p[key]))err(i,'Invalid HTTPS '+key);
  if(p.bookingUrl&&!safeUrl(p.bookingUrl))err(i,'Invalid HTTPS bookingUrl');
  if(p.socialUrl&&!safeUrl(p.socialUrl))err(i,'Invalid HTTPS socialUrl');
  for(const u of p.additionalSources||[])if(!safeUrl(u))err(i,'Unsafe additional source');
  const date=p.checkedAt;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date>today)err(i,'Invalid/future checkedAt');
  if(p.phone!=null&&(typeof p.phone!=='string'||!/^\+?[0-9][0-9 -]{8,19}$/.test(p.phone)))err(i,'Invalid phone; use null when unknown');
  for(const field of ['hours','closed','seats','fees','access','services','notices']){
   if(p[field]!=null)for(const lang of langs)if(typeof p[field]?.[lang]!=='string'||!p[field][lang].trim())err(i,'Missing '+field+' translation: '+lang);
  }
  if(p.ownerConfirmed===true||p.verification?.owner===true)err(i,'Online-only pipeline cannot grant owner verification');
  if(p.verification?.operation===true||p.verification?.licence===true||p.verification?.onSite===true||p.verification?.phone===true)err(i,'Manual verification cannot be inferred by this pipeline');
  if(p.status==='published_research'&&p.verification?.sourceReviewed!==true)err(i,'Published research needs source review');
  if(p.researchMethod!=='online_only')err(i,'researchMethod must be online_only');
  if((p.images||[]).length)err(i,'Direct venue-image publication requires separate rights review; online-only pipeline accepts no venue photos');
  if(p.imageMode!=='ai_category_illustration')err(i,'Use explicitly labelled category AI illustration');
  for(const field of ['name','address','phone','hours','closed','seats','fees','payment','access','services','notices','bookingUrl']){
   if(!p[field])continue;
   if(!p.fieldSources?.[field]?.length)warnings.push(`[${i}] ${field}: no field-level source; record-level source only`);
   for(const u of p.fieldSources?.[field]||[])if(!safeUrl(u))err(i,'Unsafe field source');
  }
  const identity=(p.name?.ja||'').normalize('NFKC').replace(/\s/g,'')+'|'+(p.address||'').normalize('NFKC').replace(/[\s−ー-]/g,'');
  if(identities.has(identity))err(i,'Duplicate name/address: '+identities.get(identity));identities.set(identity,p.slug);
  if(/\bundefined\b|\bNaN\b|\bTODO\b/.test(JSON.stringify(p)))err(i,'Placeholder token in record');
 }
 return {errors,warnings};
}
function atomic(file,text){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,text);fs.renameSync(tmp,file);}
function compile(rows){const published=rows.filter(p=>p.status==='published_research');atomic(OUT,'// Generated from research/venues.json by research-pipeline.mjs. Do not hand-edit.\nexport const RESEARCHED_VENUES = '+JSON.stringify(published,null,2)+';\n');}
function report(rows){const today=researchToday();return {generatedAt:new Date().toISOString(),total:rows.length,published:rows.filter(p=>p.status==='published_research').length,ownerConfirmed:rows.filter(p=>p.ownerConfirmed).length,manualVerificationPerformed:false,categories:Object.fromEntries(cats.map(cat=>[cat,{records:rows.filter(p=>p.cat===cat).length,published:rows.filter(p=>p.cat===cat&&p.status==='published_research').length}])),queue:rows.filter(p=>p.status!=='archived').map(p=>({slug:p.slug,cat:p.cat,checkedAt:p.checkedAt,daysSinceSourceCheck:Math.floor((Date.parse(today)-Date.parse(p.checkedAt))/86400000),needsRecheck:Date.parse(today)-Date.parse(p.checkedAt)>30*86400000,source:p.sourceUrl})).sort((a,b)=>cats.indexOf(a.cat)-cats.indexOf(b.cat)||b.daysSinceSourceCheck-a.daysSinceSourceCheck)};}
export async function main(args=process.argv.slice(2)){
 const cmd=args[0]||'validate';const rows=JSON.parse(fs.readFileSync(DATA,'utf8'));
 if(cmd==='import'){
  if(!args[1])throw new Error('Usage: research-pipeline.mjs import path/to/records.json [--dry-run]');
  const incoming=JSON.parse(fs.readFileSync(path.resolve(args[1]),'utf8'));
  if(!Array.isArray(incoming))throw new Error('Import file must be an array');
  if(new Set(incoming.map(p=>p?.slug)).size!==incoming.length)throw new Error('Duplicate slugs in import');
  const map=new Map(rows.map(p=>[p.slug,p]));for(const p of incoming)map.set(p.slug,p);
  const merged=[...map.values()],check=validateRows(merged);
  if(check.errors.length)throw new Error(check.errors.join('\n'));
  if(!args.includes('--dry-run')){atomic(DATA,JSON.stringify(merged,null,2)+'\n');compile(merged);}
  console.log(JSON.stringify({dryRun:args.includes('--dry-run'),incoming:incoming.length,total:merged.length,warnings:check.warnings},null,2));return;
 }
 const check=validateRows(rows);if(check.errors.length)throw new Error(check.errors.join('\n'));
 if(cmd==='validate'){console.log(JSON.stringify({records:rows.length,...check},null,2));return;}
 if(cmd==='compile'){compile(rows);console.log('Compiled '+rows.filter(p=>p.status==='published_research').length+' source-reviewed profiles.');return;}
 if(cmd==='report'||cmd==='queue'){const result=report(rows);atomic(path.join(ROOT,'research/reports/status.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));return;}
 if(cmd==='links'){
  const urls=[...new Set(rows.flatMap(p=>[p.sourceUrl,...(p.additionalSources||[])]))];const results=[];
  for(const url of urls){try{const r=await fetch(url,{method:'GET',redirect:'error',signal:AbortSignal.timeout(15000)});results.push({url,status:r.status,reachable:r.ok});await r.body?.cancel();}catch(e){results.push({url,reachable:false,error:e.message});}}
  const result={checkedAt:new Date().toISOString(),note:'HTTP reachability only. Does not update factual checkedAt or confirm operation, licensing, price or rights.',results};atomic(path.join(ROOT,'research/reports/links.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));return;
 }
 throw new Error('Unknown command: '+cmd);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){main().catch(e=>{console.error(e.message);process.exitCode=1;});}
