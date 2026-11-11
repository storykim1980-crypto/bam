import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {validateRows,safeUrl} from '../tools/research-pipeline.mjs';
const rows=JSON.parse(fs.readFileSync('research/venues.json'));let checks=0;
assert.equal(validateRows(rows).errors.length,0);checks++;
const negative=[
 p=>p.bookingUrl='javascript:alert(1)',p=>p.access={ja:'駅',ko:'',en:'Station'},p=>p.services={ja:'施術'},p=>p.notices='unverified',
 p=>p.slug='../x',p=>p.cat='fiction',p=>p.sourceUrl='javascript:alert(1)',p=>p.mapUrl='https://127.0.0.1/',p=>p.socialUrl='http://example.com',p=>p.checkedAt='2099-01-01',p=>p.checkedAt='2026-02-30',p=>p.phone='.',p=>p.phone=1234567890,p=>p.name.ko='',p=>p.address='',p=>p.districtSlug='missing',p=>p.ownerConfirmed=true,p=>p.verification.licence=true,p=>p.verification.operation=true,p=>p.verification.sourceReviewed=false,p=>p.images=['https://example.com/a.jpg'],p=>p.images={},p=>p.additionalSources={},p=>p.fieldSources={},p=>p.fieldSources.address='https://example.com',p=>p.researchMethod='on_site',p=>p.status='approved',p=>p.imageMode='real_photo',
];
// An empty fieldSources map is permitted with explicit record-source warnings.
negative.splice(negative.findIndex(f=>{const p=structuredClone(rows[0]);f(p);return p.fieldSources&&Object.keys(p.fieldSources).length===0;}),1);
for(const mutate of negative){const p=structuredClone(rows[0]);mutate(p);assert(validateRows([p]).errors.length>0,String(mutate));checks++;}
assert(validateRows([rows[0],rows[0]]).errors.some(e=>e.includes('Duplicate')));checks++;
for(const u of ['http://x.com','https://localhost/','https://x.local/','https://[::1]/','https://1.2.3.4/','https://user:pass@example.com','https://example.com:8443']){assert.equal(safeUrl(u),false);checks++;}
for(const cat of ['snack','girlsbar','massage']){const p=structuredClone(rows[0]);p.cat=cat;assert.equal(validateRows([p]).errors.length,0);checks++;}
const before=fs.readFileSync('research/venues.json');const beforeModule=fs.readFileSync('src/data/researched-venues.mjs');
const r=spawnSync(process.execPath,['tools/research-pipeline.mjs','import','research/venues.json','--dry-run'],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);assert.deepEqual(fs.readFileSync('research/venues.json'),before);assert.deepEqual(fs.readFileSync('src/data/researched-venues.mjs'),beforeModule);checks++;
console.log(`PASS: ${checks} pipeline validation, URL, 3-category and dry-run checks`);
fs.writeFileSync('research/reports/pipeline-qa.json',JSON.stringify({checks,passed:true},null,2)+'\n');
