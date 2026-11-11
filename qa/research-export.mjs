import assert from 'node:assert/strict';
import fs from 'node:fs';
import {csvCell,buildResearchCsv} from '../tools/research-export.mjs';
let checks=0;
for(const value of ['=SUM(A1)','+1+1','-1+1','@SUM(A1)',' =1','\t=1','\r=1','\n=1','\uFEFF=1']){assert(csvCell(value).startsWith('"\''));checks++;}
for(const [value,want]of [[null,'""'],['a,b','"a,b"'],['a"b','"a""b"'],['가게','"가게"'],['03-1234-5678','"03-1234-5678"'],['a\nb','"a\nb"']]){assert.equal(csvCell(value),want);checks++;}
const rows=JSON.parse(fs.readFileSync('research/venues.json'));const csv=buildResearchCsv(rows);assert(csv.startsWith('\uFEFF'));checks++;assert(csv.includes('"source_type"'));checks++;
const draft=structuredClone(rows[0]);draft.status='draft';draft.slug='must-not-export';assert(!buildResearchCsv([draft]).includes(draft.slug));checks++;
assert(csv.includes('"false"'));checks++;
console.log('PASS: '+checks+' CSV escaping, formula-prefix and publication-filter checks');
fs.writeFileSync('research/reports/export-qa.json',JSON.stringify({checks,passed:true},null,2)+'\n');
