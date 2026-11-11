import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateRows} from './research-pipeline.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function csvCell(value){
 let s=value==null?'':String(value);
 // Neutralize spreadsheet formula prefixes, including whitespace-prefixed forms.
 if(/^[\s\uFEFF]*[=+\-@]|^[\t\r\n]/.test(s))s="'"+s;
 return '"'+s.replaceAll('"','""')+'"';
}
export function buildResearchCsv(rows){
 const headers=['category','name_ja','name_ko','name_en','slug','address','phone','listed_hours_ko','listed_closed_ko','fee_conditions_ko','access_ko','source_notices_ko','booking_url','source_url','source_type','source_checked_at','owner_confirmed','research_method','image_mode'];
 const data=rows.filter(p=>p.status==='published_research').map(p=>[p.cat,p.name.ja,p.name.ko,p.name.en,p.slug,p.address,p.phone,p.hours?.ko,p.closed?.ko,p.fees?.ko,p.access?.ko,p.notices?.ko,p.bookingUrl,p.sourceUrl,p.sourceType,p.checkedAt,p.ownerConfirmed===true,p.researchMethod,p.imageMode]);
 return '\uFEFF'+[headers,...data].map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const rows=JSON.parse(fs.readFileSync(path.join(ROOT,'research/venues.json'),'utf8'));
  const result=validateRows(rows);if(result.errors.length)throw new Error(result.errors.join('\n'));
  const output=process.argv[2]?path.resolve(process.argv[2]):path.join(ROOT,'research/reports/venues.csv');
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output+'.tmp',buildResearchCsv(rows));fs.renameSync(output+'.tmp',output);
  console.log('Exported '+rows.filter(p=>p.status==='published_research').length+' published research records to '+output);
 }catch(e){console.error(e.message);process.exitCode=1;}
}
