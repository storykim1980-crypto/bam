import {RESEARCHED_VENUES} from './researched-venues.mjs';
// ============================================================================
// BAM-NIGHT — REAL VENUE SOURCE (실데이터 소스 어댑터)
// ----------------------------------------------------------------------------
// ここは「実在する店舗情報」だけを取り込む層です。合成（サンプル）データとは
// 完全に分離してあり、実データが1件も無いときはサイトは sample モードのまま
// 動きます（架空の店舗を実店舗として見せることは絶対にありません）。
//
// 取り込み経路（優先順）:
//   1. 自社調査 seeds/venues.csv        … 公開情報をもとに手で作る正本（推奨）
//   2. 提携データ feed/<provider>.csv   … ホットペッパー等の正規フィード（要契約）
//   3. オーナー自己登録 data/venues.jsonl … /register → 承認済み
//
// すべて正規化（normalizeVenue）を通り、必須項目と出典が揃ったものだけが
// SHOPS に合流します。出典が空のレコードは捨てます（＝出典のない情報は載せない）。
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, '..', '..');
const SEED_DIR = path.join(ROOT, 'seeds');
const FEED_DIR = path.join(ROOT, 'feed');
const DATA_DIR = path.join(ROOT, 'data');

const readIf = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch { return null; } };

// ---- CSV (RFC4180風・ダブルクォート対応の最小実装) -------------------------
export function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c === '\r') { /* skip */ }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const out = rows.filter((r) => r.some((x) => x.trim() !== ''));
  if (out.length < 2) return [];
  const head = out[0].map((h) => h.trim());
  return out.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const readJsonl = (f) => {
  const t = readIf(f);
  if (!t) return [];
  return t.split('\n').filter((l) => l.trim())
    .map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
};

// ---- normalisation --------------------------------------------------------
const CAT_ALIASES = {
  snack: ['snack', 'スナック', '스낵', 'スナックバー', 'snack bar'],
  girlsbar: ['girlsbar', 'girls bar', 'girls-bar', 'ガールズバー', '걸즈바', 'ガールズバー・バー'],
  massage: ['massage', 'relaxation', '整体', 'リラクゼーション', 'マッサージ', 'リラク', '마사지', '마사지', 'esthe', 'エステ'],
};
export const catFromText = (v) => {
  const s = String(v || '').toLowerCase().trim();
  for (const [k, list] of Object.entries(CAT_ALIASES)) if (list.some((a) => s === a || s.includes(a.toLowerCase()))) return k;
  return null;
};

const prefCache = new Map();
export function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9fff-]+/g, '-')
    .replace(/-+/g, '-').replace(/^-|-$/g, '');
}

/**
 * 1レコードを正規化。必須: name, cat, prefSlug, districtSlug, address, source。
 * 足りないものは null を返し、理由を issues に積む（＝載せない）。
 */
export function normalizeVenue(raw, ctx = {}) {
  const issues = [];
  const src = String(raw.source || raw.出典 || '').trim();
  const name = String(raw.name || raw.nameJa || raw.店名 || '').trim();
  const cat = catFromText(raw.cat || raw.category || raw.業種);
  const prefSlug = String(raw.prefSlug || raw.pref || raw.都道府県slug || '').trim();
  const districtSlug = String(raw.districtSlug || raw.area || raw.エリアslug || '').trim();
  const address = String(raw.address || raw.addressJa || raw.住所 || '').trim();

  if (!name) issues.push('name 必須');
  if (!cat) issues.push('cat は snack / girlsbar / massage のいずれか');
  if (!prefSlug) issues.push('prefSlug 必須');
  if (!districtSlug) issues.push('districtSlug 必須');
  if (!address) issues.push('address 必須（番地は町丁目まででよい）');
  if (!src) issues.push('source 必須（出典なしの情報は掲載しない）');
  if (issues.length) return { ok: false, issues };

  const num = (v, d) => { const n = Number(String(v ?? '').replace(/[^\d.-]/g, '')); return Number.isFinite(n) && n > 0 ? n : d; };
  const price = {
    set60: num(raw.set60 ?? raw.セット60分, null),
    extend30: num(raw.extend30 ?? raw.延長30分, null),
    castDrink: num(raw.castDrink ?? raw.キャストドリンク, null),
    charge: num(raw.charge ?? raw.チャージ, null),
    nomination: num(raw.nomination ?? raw.指名料, null),
    servicePct: num(raw.servicePct ?? raw.サービス料率, null),
  };
  const hasPricing = Object.values(price).some((v) => v !== null);

  const priceCovered = ['yes', 'true', '1', 'あり', '○', 'o'].includes(String(raw.priceCovered ?? '').toLowerCase());
  const verifiedAt = String(raw.verifiedAt || raw.確認日 || '').trim();
  const tel = String(raw.tel || raw.phone || raw['電話番号'] || '').trim();
  // 電話番号は指針上マスク（実店舗でも番号・番地は出さない運用）
  const phoneMask = tel ? tel.replace(/\d(?=\d{2})/g, '•') : '';

  const venue = {
    id: String(raw.id || `real-${slugify(name)}-${districtSlug}`),
    slug: String(raw.slug || `${districtSlug}-${cat}-${slugify(name).slice(0, 24)}`),
    source: src,          // 出典（データセット名＋ライセンス＋取得日）を失わない
    sample: false,
    cat,
    nameJa: String(raw.nameJa || name),
    nameKo: String(raw.nameKo || raw.name || name),
    nameEn: String(raw.nameEn || raw.name || name),
    tag: String(raw.tag || ''),
    prefSlug, districtSlug,
    addressJa: address,
    addressKo: String(raw.addressKo || address),
    addressEn: String(raw.addressEn || address),
    station: String(raw.station || raw.最寄駅 || ''),
    hoursStart: String(raw.hoursStart || raw.営業開始 || ''),
    hoursEnd: String(raw.hoursEnd || raw.営業終了 || ''),
    closed: String(raw.closed || raw.定休日 || ''),
    features: String(raw.features || raw.特徴 || '').split(/[,、/ ]+/).filter(Boolean),
    phoneMask,
    price,
    hasPricing,
    priceCovered,           // 店頭・公式で税込総額が明示されているか
    verifiedAt,             // 情報確認日（YYYY-MM-DD）
    sourceUrl: String(raw.sourceUrl || raw.出典URL || ''),
    images: String(raw.images || raw.画像 || '').split(/[,、 ]+/).filter(Boolean),
    licence: String(raw.licence || raw.許可 || ''),  // 風営法/食品衛生法などの確認状況
    catNote: String(raw.catNote || ''),              // 業種が「推定」の場合の注記
    note: String(raw.note || ''),                    // 編集メモ（表示用）
    aiConcept: false,
  };
  return { ok: true, venue };
}

// ---- loaders --------------------------------------------------------------
function loadCsvDir(dir, origin) {
  const out = [];
  const issues = [];
  let files = [];
  // テンプレート/見本ファイルは絶対に読み込まない（架空の見本が実店舗になる事故を防ぐ）
  const STUB = /(template|sample|example|見本|テンプレ|dummy)/i;
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith('.csv') && !STUB.test(f)); } catch { return { out, issues }; }
  for (const f of files) {
    const rows = parseCsv(readIf(path.join(dir, f)) || '');
    rows.forEach((r, i) => {
      const res = normalizeVenue(r, origin);
      if (res.ok) out.push({ ...res.venue, origin, originFile: f });
      else issues.push({ file: f, row: i + 2, name: r.name || r.店名 || '', issues: res.issues });
    });
  }
  return { out, issues };
}

const seed = loadCsvDir(SEED_DIR, 'seed');
const feed = loadCsvDir(FEED_DIR, 'feed');
const owned = readJsonl(path.join(DATA_DIR, 'venues.jsonl'));
const ownedNormalized = owned
  .map((r) => normalizeVenue({ ...r, source: r.source || 'owner-registration' }))
  .filter((x) => x.ok).map((x) => ({ ...x.venue, origin: 'register' }));

// 같은 점포가 두 파일에 있어도 한 번만 싣는다(이름+에어리어 기준).
const ALL = [...ownedNormalized, ...seed.out, ...feed.out];
const seenKey = new Set();
export const DUPLICATES = [];
export const REAL_VENUES = ALL.filter((v) => {
  const k = `${v.nameJa}|${v.districtSlug}`;
  if (seenKey.has(k)) { DUPLICATES.push(k); return false; }
  seenKey.add(k);
  return true;
});
export const REAL_VENUE_COUNT = RESEARCHED_VENUES.length;
export const IMPORT_ISSUES = [...seed.issues, ...feed.issues];
export const HAS_REAL_VENUES = REAL_VENUE_COUNT > 0;

/** 화면 표기용 출처 목록(중복 제거) — CC BY / ODbL 의무 이행 */
export const ATTRIBUTIONS = [...new Set(REAL_VENUES.map((v) => v.source).filter(Boolean))];

/** 実店舗が1件でも入っているか。UI の mode 判定に使う。 */
export const LISTING_MODE = HAS_REAL_VENUES ? 'real' : 'sample';

/** 名前重複の検出（同じ店を二重掲載しない） */
/** 로드 시 제거된 중복 목록 (같은 이름 + 같은 에어리어) */
export function duplicateNames() { return DUPLICATES; }
