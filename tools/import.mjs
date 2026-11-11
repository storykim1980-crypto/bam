#!/usr/bin/env node
// ============================================================================
// BAM-NIGHT — 実店舗データ取り込み CLI
// ----------------------------------------------------------------------------
// 使い方:
//   node tools/import.mjs check                  … 取り込み前の検証だけ
//   node tools/import.mjs stats                  … 現在のモードと件数
//   node tools/import.mjs from-csv <file.csv>    … CSV を seeds/ に取り込む
//   node tools/import.mjs from-endpoint <src.mjs> <url>  … 正規API/フィード取得
//   node tools/import.mjs template               … 空のCSVテンプレートを出力
//
// 設計方針（法務・品質のガード）:
//   * 出典(source)が空の行は絶対に取り込まない
//   * 電話番号・番地は自動でマスク（番地は町丁目まで）
//   * 既に seeds/ にある店名+エリアは重複として弾く
//   * from-endpoint は「利用規約で許可された範囲」でしか使わない:
//     robots.txt を確認し、Disallow されていれば即中止する
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCsv, normalizeVenue, duplicateNames, REAL_VENUES, REAL_VENUE_COUNT, IMPORT_ISSUES, LISTING_MODE, ROOT } from '../src/data/venues.mjs';
import { SHOPS, REAL_SHOP_COUNT, SAMPLE_SHOP_COUNT } from '../src/data/shops.mjs';

const SEED_DIR = path.join(ROOT, 'seeds');
const cmd = process.argv[2] || 'stats';

const HEADER = [
  'name', 'cat', 'prefSlug', 'districtSlug', 'address', 'station',
  'hoursStart', 'hoursEnd', 'closed', 'set60', 'extend30', 'castDrink',
  'charge', 'nomination', 'servicePct', 'priceCovered', 'features',
  'tel', 'licence', 'verifiedAt', 'sourceUrl', 'source',
];

function stats() {
  console.log('────────────────────────────────────────────');
  console.log(' モード           :', LISTING_MODE);
  console.log(' 実店舗（取込）   :', REAL_VENUE_COUNT);
  console.log(' 実店舗（表示）   :', REAL_SHOP_COUNT, REAL_VENUE_COUNT > REAL_SHOP_COUNT ? `（重複 ${REAL_VENUE_COUNT - REAL_SHOP_COUNT} 件を統合）` : '');
  console.log(' サンプル枠       :', SAMPLE_SHOP_COUNT);
  console.log(' 表示合計         :', SHOPS.length);
  console.log(' 取り込みエラー   :', IMPORT_ISSUES.length);
  if (IMPORT_ISSUES.length) {
    IMPORT_ISSUES.slice(0, 10).forEach((i) => console.log('   -', i.file || i.origin, '行', i.row, i.name, '→', i.issues.join(' / ')));
  }
  const dups = duplicateNames();
  if (dups.length) console.log(' 重複候補         :', dups.length, dups.slice(0, 5));
  console.log('────────────────────────────────────────────');
  if (LISTING_MODE === 'sample') {
    console.log(' → seeds/venues.csv か feed/*.csv に実店舗を1件以上入れると real モードに切り替わります。');
  }
}

function template() {
  fs.mkdirSync(SEED_DIR, { recursive: true });
  const f = path.join(SEED_DIR, '_TEMPLATE-do-not-import.csv');
  const example = [
    'スナック 月あかり', 'snack', 'tokyo', 'shinjuku-kabukicho', '東京都新宿区歌舞伎町1丁目',
    '新宿駅', '19:00', '02:00', 'sun', '4000', '2500', '1200', '500', '1000', '10',
    'yes', 'korean,card,nonsmoking', '0312345678', '確認済み(2026-10)',
    '2026-11-01', 'https://example.com/shop/0001', '店頭掲示・公式サイト(2026-11-01 確認)',
  ];
  fs.writeFileSync(f, HEADER.join(',') + '\n' + example.map((c) => (/[",]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',') + '\n');
  console.log('テンプレートを書き出しました:', path.relative(ROOT, f));
  console.log('※ この例は書式見本です。実在店舗の実データに置き換えてから seeds/venues.csv にリネームしてください。');
}

function fromCsv(file) {
  if (!file || !fs.existsSync(file)) return fail('CSV が見つかりません: ' + file);
  if (/(template|sample|example|見本|テンプレ|dummy)/i.test(path.basename(file)))
    return fail('テンプレート/見本ファイルは取り込めません。実データに置き換え、ファイル名から template/sample を外してください。');
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  if (!rows.length) return fail('CSV にデータ行がありません（1行目はヘッダー）');
  const ok = [], bad = [];
  rows.forEach((r, i) => {
    const res = normalizeVenue(r, 'seed');
    if (res.ok) ok.push(res.venue); else bad.push({ row: i + 2, name: r.name || '', issues: res.issues });
  });
  fs.mkdirSync(SEED_DIR, { recursive: true });
  const stamp = new Date().toISOString().slice(0, 10);
  const dest = path.join(SEED_DIR, `venues.imported-${stamp}.csv`);
  // 元のCSVをそのまま正本にする（手で直せるように）
  fs.copyFileSync(file, dest);
  console.log(`取り込み: ${ok.length} 件 OK / ${bad.length} 件 却下 → ${path.relative(ROOT, dest)}`);
  bad.slice(0, 20).forEach((b) => console.log('   却下 行', b.row, b.name, '→', b.issues.join(' / ')));
  console.log('次に `node tools/import.mjs check` で再検証してください。');
}

// ---- 正規エンドポイント（API/フィード）からの取得 --------------------------
async function robotsAllows(base, ua = 'BAM-NIGHT-Bot') {
  try {
    const res = await fetch(new URL('/robots.txt', base), { headers: { 'user-agent': ua } });
    if (!res.ok) return { ok: false, reason: `robots.txt が読めません (HTTP ${res.status}) — 許可が確認できないため中止` };
    const txt = await res.text();
    const lines = txt.split('\n').map((l) => l.split('#')[0].trim()).filter(Boolean);
    let applies = false, disallow = [];
    for (const l of lines) {
      const [k, v = ''] = l.split(':').map((x) => x.trim());
      if (/^user-agent$/i.test(k)) applies = v === '*' || v.toLowerCase() === ua.toLowerCase();
      else if (applies && /^disallow$/i.test(k) && v) disallow.push(v);
    }
    const blocked = disallow.filter((d) => d === '/' || process.argv[4]?.includes(d));
    if (blocked.length) return { ok: false, reason: `robots.txt で Disallow: ${blocked.join(', ')} — 中止` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: 'robots.txt 取得失敗: ' + e.message + ' — 許可が確認できないため中止' };
  }
}

async function fromEndpoint(srcFile, url) {
  if (!srcFile || !url) return fail('使い方: node tools/import.mjs from-endpoint <src/feeds/xxx.mjs> <url>');
  if (!fs.existsSync(srcFile)) return fail('ソース定義が見つかりません: ' + srcFile);
  const mod = await import(path.resolve(srcFile));
  const u = new URL(url);
  const gate = await robotsAllows(u.origin);
  console.log('robots check:', gate.ok ? 'OK' : 'NG — ' + gate.reason);
  if (!gate.ok) process.exit(2);
  if (mod.termsRequired && !process.env.BAMNIGHT_TERMS_ACK) {
    return fail('このソースは利用規約の確認が必要です。内容を確認のうえ BAMNIGHT_TERMS_ACK=1 を付けて再実行してください。');
  }
  const res = await fetch(url, { headers: { 'user-agent': 'BAM-NIGHT-Bot (+https://storykim1980-crypto.github.io/bam-night/)' } });
  if (!res.ok) return fail('取得失敗 HTTP ' + res.status);
  const body = await res.text();
  const rows = mod.parse ? mod.parse(body) : parseCsv(body);
  const ok = [];
  rows.forEach((r) => { const x = normalizeVenue(mod.map ? mod.map(r) : r, 'feed'); if (x.ok) ok.push(x.venue); });
  console.log(`${rows.length} 行 → ${ok.length} 件 正規化OK`);
  if (!ok.length) return fail('有効な行がありません。map() の定義を確認してください。');
  fs.mkdirSync(path.join(ROOT, 'feed'), { recursive: true });
  const dest = path.join(ROOT, 'feed', `${mod.id || 'feed'}-${new Date().toISOString().slice(0, 10)}.csv`);
  fs.writeFileSync(dest, HEADER.join(',') + '\n' + ok.map((v) => HEADER.map((h) => v[h] ?? '').join(',')).join('\n'));
  console.log('書き出し:', path.relative(ROOT, dest));
}

function check() {
  const bad = REAL_VENUES.filter((v) => !v.source);
  console.log('出典なし:', bad.length);
  console.log('重複:', duplicateNames().length);
  console.log('エリア未登録:', REAL_VENUES.filter((v) => !v.districtSlug).length);
  console.log(IMPORT_ISSUES.length ? '要修正の行が ' + IMPORT_ISSUES.length + ' 件あります' : '検証OK');
}

function fail(msg) { console.error('✗', msg); process.exit(1); }

const table = { stats, template, 'from-csv': fromCsv, 'from-endpoint': fromEndpoint, check };
const fn = table[cmd];
if (!fn) { console.log('コマンド:', Object.keys(table).join(' | ')); process.exit(1); }
await fn(process.argv[3], process.argv[4]);
