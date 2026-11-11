// ============================================================================
// REAL VENUE REGISTRY (実店舗レジストリ)
// ----------------------------------------------------------------------------
// 実在する店舗だけがここに入ります。登録は次の2経路：
//   1. オーナー本人による自己登録（/register）→ 管理者承認 → ここに追記
//   2. 管理者による手動登録（data/venues.jsonl を直接編集）
//
// 承認済みデータは data/venues.jsonl に保存され、起動時に読み込まれます。
// listings は「実在店舗のみ」、samples は「サンプル表示」として完全に分離します。
// ============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', '..');
const DATA_DIR = path.join(ROOT, 'data');
const VENUES_FILE = path.join(DATA_DIR, 'venues.jsonl');
const PENDING_FILE = path.join(DATA_DIR, 'pending.jsonl');

const ensureDir = () => { try { fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {} };

function readJsonl(file) {
  try {
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8')
      .split('\n')
      .filter((l) => l.trim())
      .map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch { return []; }
}

// ---- approved real venues ------------------------------------------------
// 실데이터 로더(seeds/venues.csv, feed/*.csv, data/venues.jsonl)를 그대로 재수출한다.
// 샘플 데이터와는 파일부터 다르므로, 가상 점포가 실점포로 승격되는 경로는 없다.
export { REAL_VENUES, REAL_VENUE_COUNT, HAS_REAL_VENUES, LISTING_MODE, IMPORT_ISSUES, ATTRIBUTIONS } from './venues.mjs';

// ---- pending submissions ------------------------------------------------
export function submitVenue(payload) {
  ensureDir();
  const record = {
    ...payload,
    id: 'pending-' + Date.now().toString(36),
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  fs.appendFileSync(PENDING_FILE, JSON.stringify(record) + '\n');
  return record;
}

export function pendingCount() {
  return readJsonl(PENDING_FILE).length;
}

// ---- disclaimer strings -------------------------------------------------
export const SAMPLE_NOTICE = {
  ja: '現在この業種・エリアには実店舗の登録がありません。表示中の店舗は、サイトの機能とUIをご確認いただくためのサンプルです。実在の店舗ではありません。',
  ko: '현재 이 업종·지역에는 실점포 등록이 없습니다. 표시 중인 점포는 사이트 기능과 UI를 확인하기 위한 샘플이며, 실존하는 점포가 아닙니다.',
  en: 'No real venues are registered for this category and area yet. The shops shown are samples for reviewing site functionality and UI — they are not real venues.',
};

export const SAMPLE_BADGE = {
  ja: '架空サンプル',
  ko: '가상 샘플',
  en: 'FICTIONAL SAMPLE',
};
// Counters shown to visitors must say what they really are while in sample mode.
export const SAMPLE_COUNT_LABEL = {
  ja: 'サンプル枠',
  ko: '샘플 슬롯',
  en: 'sample slots',
};

export const REAL_BADGE = {
  ja: '実店舗',
  ko: '실점포',
  en: 'Verified venue',
};
