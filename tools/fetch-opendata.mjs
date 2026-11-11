#!/usr/bin/env node
// ============================================================================
// BAM-NIGHT — オープンデータ取り込み（著作権的に安全な無料ソースのみ）
// ----------------------------------------------------------------------------
// 使い方:
//   node tools/fetch-opendata.mjs list
//   node tools/fetch-opendata.mjs tokyo-shinjuku --preview
//   node tools/fetch-opendata.mjs tokyo-shinjuku --commit
//   node tools/fetch-opendata.mjs osm-kabukicho --preview
//
// 方針:
//   * 自治体オープンデータ（CC BY 4.0）と OpenStreetMap（ODbL）だけを使う
//   * 競合ポータルのスクレイピングは行わない（実装もしない）
//   * --preview は feed/ に書き出すだけ。--commit で seeds/ に昇格＝サイト反映
//   * 出典・ライセンス・取得日を必ず各レコードに埋め込む
// ============================================================================

import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { ROOT } from '../src/data/venues.mjs';
import { canPublishFrom, FORBIDDEN, sourceById } from '../src/data/sources.mjs';

/**
 * ホワイトリスト強制：src/data/sources.mjs に載っていない出典からの取り込みは実行時に拒否する。
 * 「あとから雑に追加する」ことを物理的に難しくするためのガード。
 */
function assertAllowed(sourceId) {
  const rec = sourceById(sourceId);
  if (!rec) throw new Error(`出典 ${sourceId} はホワイトリスト（src/data/sources.mjs）に未登録のため取り込みできません`);
  if (!canPublishFrom(sourceId)) throw new Error(`出典 ${sourceId} は掲載不可（tier=${rec.tier}）です`);
  return rec;
}

const UA = 'BAM-NIGHT-DataBot/1.0 (+https://storykim1980-crypto.github.io/bam-night/; contact via site)';

// ---- 出典レジストリ --------------------------------------------------------
export const SOURCES = {
  'tokyo-shinjuku': {
    label: '新宿区 食品等営業許可・届け出一覧（東京都オープンデータカタログ / CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131041d0000000124',
    ward: '新宿区',
    attribution: '出典：新宿区「食品等営業許可・届け出一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
    kind: 'tokyo-food',
    whitelist: 'tokyo-food-licence',
  },
  'tokyo-minato': {
    label: '港区 食品営業許可一覧（東京都オープンデータカタログ / CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131032d0000000244',
    attribution: '出典：港区「食品営業許可一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
    kind: 'tokyo-food',
    whitelist: 'tokyo-food-licence',
  },
  'tokyo-chuo': {
    kind: 'tokyo-food',
    whitelist: 'tokyo-chuo-licence',
    label: '中央区 食品等営業許可・届出一覧（CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131024d0000000037',
    ward: '中央区',
    attribution: '出典：中央区「食品等営業許可・届出一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-nakano': {
    kind: 'tokyo-food-v2',
    whitelist: 'tokyo-nakano-licence',
    label: '中野区 食品等営業許可届出一覧（CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131148d0000000129',
    ward: '中野区',
    attribution: '出典：中野区「食品等営業許可届出一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-taito': {
    kind: 'tokyo-food-v2',
    whitelist: 'tokyo-taito-licence',
    label: '台東区 食品衛生営業施設一覧（CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131067d3100000006',
    ward: '台東区',
    whitelist: 'tokyo-taito-licence',
    attribution: '出典：台東区「食品衛生営業施設一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-higashimurayama': {
    kind: 'tokyo-food',
    whitelist: 'tokyo-higashimurayama-licence',
    label: '東村山市 食品等営業許可・届出一覧（CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't132136d3100000018',
    ward: '東村山市',
    attribution: '出典：東村山市「食品等営業許可・届け出一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-all': {
    label: '東京都 食品等営業許可・届出一覧（自治体標準データセット / CC BY 4.0）',
    licence: 'CC BY 4.0',
    kind: 'catalog-search',
    search: '食品等営業許可・届出一覧',
    attribution: '出典：東京都オープンデータカタログ「食品等営業許可・届出一覧」（各区公開、CC BY 4.0）を加工して作成',
  },
  'tokyo-sejutsu': {
    kind: 'sejutsu',
    whitelist: 'tokyo-sejutsu',
    label: '文京区 施術所一覧（あん摩マッサージ指圧・はり・きゅう / CC BY 4.0）',
    licence: 'CC BY 4.0',
    url: 'https://www.city.bunkyo.lg.jp/documents/6059/sejutsusyo.csv',
    catalogId: 't131059d0407100003',
    attribution: '出典：文京区「施術所一覧」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-sejutsu-minato': {
    kind: 'sejutsu-minato',
    whitelist: 'tokyo-sejutsu-minato',
    label: '港区 施術所情報（CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't131032d0000000209',
    attribution: '出典：港区「港区の施術所情報」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
  },
  'tokyo-metro': {
    label: '東京都保健医療局 食品関係営業台帳（東京都オープンデータカタログ / CC BY 4.0）',
    licence: 'CC BY 4.0',
    catalogId: 't000055d0000000361',
    attribution: '出典：東京都保健医療局「食品関係営業台帳」（東京都オープンデータカタログ、CC BY 4.0）を加工して作成',
    kind: 'tokyo-food',
  },
};

// 繁華街 → (prefSlug, districtSlug) 対応。ここに無い町名は取り込まない。
// 町名 → サイトの繁華街エリア。複合テストは使わない（誤爆する）。
// 収録エリアを増やすときは、この表に1行足すだけでよい。
// 町名 → サイトのエリア。**区を明示**してスコープする（弥生町は文京区と中野区の両方にある等、
// 区をまたぐ同名町名で誤マッチするため）。
const AREA_MAP = [
  // ---- 新宿区
  { ward: '新宿区', town: /^歌舞伎町/, districtSlug: 'shinjuku-kabukicho' },
  { ward: '新宿区', town: /^(西新宿|新宿|新宿三丁目)/, districtSlug: 'shinjuku' },
  // ---- 渋谷区
  { ward: '渋谷区', town: /^(道玄坂|宇田川町|円山町|松濤|神南)/, districtSlug: 'shibuya' },
  { ward: '渋谷区', town: /^(恵比寿|広尾)/, districtSlug: 'ebisu' },
  // ---- 豊島区
  { ward: '豊島区', town: /^(西池袋|東池袋)/, districtSlug: 'ikebukuro' },
  // ---- 港区
  { ward: '港区', town: /^六本木/, districtSlug: 'roppongi' },
  { ward: '港区', town: /^(赤坂|元赤坂|麻布|南青山|北青山|西麻布|東麻布)/, districtSlug: 'akasaka' },
  // ---- 中央区
  { ward: '中央区', town: /^銀座/, districtSlug: 'ginza' },
  { ward: '中央区', town: /^(日本橋|八重洲|京橋|丸の内|大手町)/, districtSlug: 'nihonbashi' },
  { ward: '中央区', town: /^(新橋|東新橋|西新橋)/, districtSlug: 'shimbashi' },
  // ---- 千代田区
  { ward: '千代田区', town: /^(有楽町|日比谷|内幸町)/, districtSlug: 'yurakucho' },
  { ward: '千代田区', town: /^(神田|神保町|一ツ橋)/, districtSlug: 'jinbocho' },
  // ---- 台東区
  { ward: '台東区', town: /^上野/, districtSlug: 'ueno' },
  { ward: '台東区', town: /^浅草/, districtSlug: 'asakusa' },
  // ---- 墨田区
  { ward: '墨田区', town: /^(錦糸|江東橋|太平)/, districtSlug: 'kinshicho' },
  // ---- 武蔵野市
  { ward: '武蔵野市', town: /^吉祥寺/, districtSlug: 'kichijoji' },
  // ---- 中野区
  { ward: '中野区', town: /^/, districtSlug: 'nakano' },
  // ---- 品川区
  { ward: '品川区', town: /^(五反田|西五反田|東五反田)/, districtSlug: 'gotanda' },
  { ward: '品川区', town: /^/, districtSlug: 'shinagawa' },
  // ---- 文京区（既存エリアに「本郷・小石川」を新設）
  { ward: '文京区', town: /^/, districtSlug: 'hongo' },
  // ---- 東村山市
  { ward: '東村山市', town: /^/, districtSlug: 'higashimurayama' },
];

// 区→エリア（サイトに該当エリアが無い区は掲載しない = 誤った地域表示をしない）
const WARD_MAP = [
  { ward: '東村山市', slug: 'higashimurayama' },
  { ward: '文京区', slug: 'hongo' },
  { ward: '新宿区', slug: 'shinjuku' },
  { ward: '渋谷区', slug: 'shibuya' },
  { ward: '豊島区', slug: 'ikebukuro' },
  { ward: '港区', slug: 'roppongi' },      // 六本木・赤坂を含む
  { ward: '中央区', slug: 'ginza' },
  { ward: '台東区', slug: 'ueno' },
  { ward: '墨田区', slug: 'kinshicho' },
  { ward: '武蔵野市', slug: 'kichijoji' },
  { ward: '中野区', slug: 'nakano' },
  { ward: '品川区', slug: 'shinagawa' },
  { ward: '千代田区', slug: 'jinbocho' },
];

/** 住所文字列から掲載エリアを決める。決まらなければ null（＝掲載しない） */
export function resolveArea(addr) {
  const a = String(addr || '').replace(/^東京都/, '').replace(/^北海道/, '').replace(/^(京都府|大阪府)/, '').replace(/^.{2,3}県/, '');

  // ① 市区町村名を切り出す（残りは町名）
  // 「東村山市」「新宿区」「中野区」…を区切りとして切り出す。
  // 貪欲にすると「新宿区歌舞伎町」まで食べてしまうので、既知の市区町村名を優先し、
  // 見つからない場合だけ正規表現で推定する。
  const known = [...WARD_MAP.map((w) => w.ward), ...AREA_MAP.map((x) => x.ward)]
    .filter(Boolean)
    .sort((x, y) => y.length - x.length)
    .find((w) => a.startsWith(w));
  const m = known ? [known, known] : a.match(/^([\u4e00-\u9fff]{1,4}?(?:市|区|町|村))/);
  const muni = m ? m[1] : '';
  const town = muni ? a.slice(muni.length) : a;

  // ② 区を明示した町名ルール（同名町名の誤マッチを防ぐ）
  const byTown = AREA_MAP.find((x) => (!x.ward || x.ward === muni) && x.town.test(town));
  if (byTown) return { prefSlug: 'tokyo', districtSlug: byTown.districtSlug };

  // ③ 市区町村単位のエリア
  const ward = WARD_MAP.find((w) => w.ward === muni);
  if (ward) return { prefSlug: 'tokyo', districtSlug: ward.slug };

  // ④ 決まらない場合は掲載しない（誤った地域表示をしない）
  return null;
}

// 業種判定：name から推定（当てはまらないものは捨てる＝誤分類を載せない）
// 業種は「誤分類して載せる」より「載せない」を優先する（景表法・信頼性）。
const CAT_RULES = [
  { cat: 'girlsbar', re: /ガールズバー|GIRLS\s?BAR|Girls\s?Bar|ガールズ\s?バー/ },
  { cat: 'snack', re: /スナック|SNACK|Snack|スナツク/ },
  // 이하 2개는 "추정"이다. 카드에 catNote 로 반드시 표기한다.
  { cat: 'snack', re: /ラウンジ|LOUNGE|Lounge|バー|BAR|Bar|パブ|PUB|Pub/, guess: true },
];
// 「バー」単体は飲食店（バーガー・バール等）と混同するので除外語を先に判定
// 大手チェーン・居酒屋は「スナック/ガールズバー」ポータルの対象外なので除外
const CHAIN = /鳥貴族|HUB|Hub|hub|白木屋|和民|ワタミ|笑笑|庄や|養老乃瀧|磯丸|塚田農場|魚民|千年の宴|三代目|目利きの銀次|居酒屋|IZAKAYA|Izakaya|いざかや|焼肉|ホルモン|カラオケ|KARAOKE|カフェ|Cafe|CAFE|喫茶|珈琲|ラーメン|寿司|そば|うどん|カレー|CoCo壱|マクドナルド|スターバックス|ドトール/i;
const isChain = (n) => CHAIN.test(n);
const EXCLUDE = /バーガー|バール|バーベキュー|バーコード|バースデー|ハンバーグ|バーニャ|バーゲン|BARGA|Burger|バター|バス|バッグ|バランス/;

/** 스낵·걸즈바·라운지·바 계열 이름인지 (보수적: 일반 음식점·바베큐 등 제외) */
const nightlifeName = (n) => /スナック|SNACK|Snack|スナツク|ガールズバー|GIRLS\s?BAR|Girls\s?Bar|ラウンジ|LOUNGE|Lounge|バー|BAR|Bar|パブ|PUB|Pub/.test(n) && !EXCLUDE.test(n);

const pickCatDetail = (n) => {
  for (const r of CAT_RULES) if (new RegExp(r.re.source).test(n)) return { cat: r.cat, guess: !!r.guess };
  return null;
};

/**
 * 住所は「町丁目まで」に丸める（サイト方針: 番地以下は表示しない）。
 *   歌舞伎町1-1-8  → 歌舞伎町1丁目
 *   富久町2-13     → 富久町
 *   西新宿7丁目8-1 → 西新宿7丁目
 */
export function maskTown(town) {
  const t = String(town || '').trim();
  if (!t) return '';
  const chome = t.match(/^(.*?)([0-9０-９]+)丁目/);
  // 丁目が無い町名は「地番＝番地」なので町名だけで止める（歌舞伎町1-1-8 → 歌舞伎町）
  if (chome) return `${chome[1]}${chome[2]}丁目`;
  const plain = t.match(/^(.*?(?:[\u4e00-\u9fff]+町|大字[\u4e00-\u9fff]*|[\u4e00-\u9fff]+[0-9]+丁目))/);
  if (plain) return plain[1];
  return t.replace(/[0-9０-９\-－ー].*$/, '');
}

const today = new Date();
const isLive = (r, i) => {
  const haigyo = r[i['廃業年月日']] || '';
  if (haigyo.trim()) return false;
  const exp = r[i['許可満了日']] || '';
  if (exp) { const d = new Date(exp); if (!Number.isNaN(+d) && d < today) return false; }
  return true;
};

// ---- 東京都オープンデータ（自治体標準データセット） ------------------------
/** カタログに CSV リソースが無い自治体向けの直接 URL 表 */
const SOURCES_BY_CATALOG = {
  t131067d3100000006: { csvUrl: 'https://www.city.taito.lg.jp/kenkohukusi/kenkokikikanrieisei/food/syokuhin-sisetu/index.files/2026ALL-IND-CSV.csv' },
};

async function fetchCkanCsv(catalogId) {
  const api = `https://catalog.data.metro.tokyo.lg.jp/api/3/action/package_show?id=${catalogId}`;
  const res = await fetch(api, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`カタログAPI ${res.status}`);
  const j = await res.json();
  const res0 = (j.result.resources || []);
  // 台東区のように「HTML リソースしか無い」場合は csvUrl を直接指定して取得する
  // r.format が CSV でも url が .html のケース（台東区）があるので URL の拡張子で判定する
  const csv = res0.find((r) => /\.csv(\?|$)/i.test(r.url));
  const url = csv ? csv.url : SOURCES_BY_CATALOG[catalogId]?.csvUrl;
  if (!url) throw new Error('CSV リソースが見つかりません');
  const body = await fetch(url, { headers: { 'user-agent': UA } });
  if (!body.ok) throw new Error(`CSV取得 ${body.status}`);
  const buf = Buffer.from(await body.arrayBuffer());
  return decodeCsvBuffer(buf);
}

function decodeCsvBuffer(buf) {
  // 自治体標準データセットは UTF-16LE / UTF-8 BOM / CP932 が混在する
  if (buf[0] === 0xff && buf[1] === 0xfe) return buf.toString('utf16le');
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) return buf.toString('utf8').replace(/^\uFEFF/, '');
  const utf8 = buf.toString('utf8');
  if (!utf8.includes('\uFFFD')) return utf8;
  try { return new TextDecoder('shift_jis').decode(buf); } catch { return utf8; }
}

export function parseCsvText(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c === '\r') { /* skip */ }
    else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}

// 自治体ごとに列名が違うので「論理フィールド → 候補列名」で吸収する。
// 新しい区を追加するときは、ここの候補に列名を足すだけでよい。
const FIELD_ALIASES = {
  name:        ['施設名称', '営業所名称', '名称', '店舗名称', '施設名', '屋号'],
  kind:        ['営業の種類', '業態', '許可業種', '業種'],
  ward:        ['地方公共団体名', '市区町村名', '市区町村'],
  town:        ['施設所在地_町字', '営業所所在地', '所在地', '住所'],
  city:        ['施設所在地_市区町村', '市区町村名'],
  pref:        ['施設所在地_都道府県', '都道府県名', '都道府県'],
  tel:         ['施設電話番号', '営業所電話番号', '電話番号'],
  licenceNo:   ['許可番号'],
  expiry:      ['許可満了日'],
  closed:      ['廃業年月日'],
};

function pickCols(head) {
  const map = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const hit = aliases.find((a) => head.includes(a));
    if (hit) map[field] = head.indexOf(hit);
  }
  return map;
}

const cell = (r, cols, f) => (cols[f] === undefined ? '' : String(r[cols[f]] ?? '').trim());

/** 日付文字列（西暦/和暦混在）を正規化してパース */
function parseDateJp(s) {
  if (!s) return null;
  const t = String(s).trim();
  let m = t.match(/^(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const era = t.match(/^(明治|大正|昭和|平成|令和)(\d{1,2}|元)年(\d{1,2})月(\d{1,2})日/);
  if (era) {
    const base = { 明治: 1867, 大正: 1911, 昭和: 1925, 平成: 1988, 令和: 2018 }[era[1]];
    const y = base + (era[2] === '元' ? 1 : +era[2]);
    return new Date(y, +era[3] - 1, +era[4]);
  }
  return null;
}

/** 営業中かどうか（廃業日あり＝除外、許可満了日が過去＝除外） */
function isLiveRow(r, cols, today) {
  if (cell(r, cols, 'closed')) return false;
  const exp = parseDateJp(cell(r, cols, 'expiry'));
  if (exp && exp < today) return false;
  return true;
}

async function buildTokyoFood(key) {
  assertAllowed(SOURCES[key].whitelist || key);
  const src = SOURCES[key];
  const text = await fetchCkanCsv(src.catalogId);
  const rows = parseCsvText(text);
  // タイトル行が先頭にあるファイル（施術所など）に備えてヘッダ行を探す
  const HEADER_NAMES = new Set(['施設名称', '営業所名称', '名称', '店舗名称', '施設名', '市区町村コード', '全国地方公共団体コード']);
  const hi = rows.findIndex((r) => r.some((c) => HEADER_NAMES.has(String(c).replace(/^"|"$/g, '').replace(/\r/g, '').trim())));
  const headIdx = hi >= 0 ? hi : 0;
  const head = rows[headIdx].map((h) => h.replace(/^"|"$/g, '').replace(/\r/g, '').trim());
  const cols = pickCols(head);
  // 中野区のように「名称列が空で、隣の列に店名・その次に業種」という独自スキーマへの対応。
  // 空行を飛ばして最初の非空行をサンプルにする。
  if (cols.name !== undefined) {
    const sample = rows.slice(headIdx + 1).find((r) => r.some((c) => String(c).trim())) || [];
    if (!String(sample[cols.name] ?? '').trim() && cols.kind !== undefined) {
      // 「業種列に店名 → 次の列に業種」のペアを探す（+1〜+3列まで許容）
      for (let d = 0; d <= 3; d++) {
        const kindIdx = cols.kind + d + 1;
        if (/飲食店営業|販売業|製造業|喫茶/.test(String(sample[kindIdx] ?? ''))) {
          cols.name = cols.kind + d;
          cols.kind = kindIdx;
          break;
        }
      }
    }
  }
  if (cols.name === undefined) throw new Error(`名称列が見つかりません（列: ${head.slice(0, 8).join('/')}）— データ仕様を確認してください`);

  const today = new Date();
  const out = [];
  const skipped = { noName: 0, notNightlife: 0, noCat: 0, noArea: 0, closed: 0, chain: 0 };
  const wardNames = new Set();
  for (const r of rows.slice(headIdx + 1)) {
    if (!r.length || r.every((c) => !String(c).trim())) continue;
    const name = cell(r, cols, 'name').replace(/\u3000/g, ' ').trim();
    if (!name) { skipped.noName++; continue; }
    const kind = cell(r, cols, 'kind');
    if (!/飲食店営業|喫茶店営業/.test(kind)) { skipped.notNightlife++; continue; }
    if (!nightlifeName(name)) { skipped.notNightlife++; continue; }
    if (isChain(name)) { skipped.chain++; continue; }
    if (!isLiveRow(r, cols, today)) { skipped.closed++; continue; }
    const catPick = pickCatDetail(name);
    if (!catPick) { skipped.noCat++; continue; }
    const ward = cell(r, cols, 'ward');
    if (ward) wardNames.add(ward);
    const town = cell(r, cols, 'town');
    // 中野区のように市区町村列が空のデータセットがあるので、出典から市区町村名を補う
    const city = cell(r, cols, 'city') || ward || src.ward || '';
    const prefName = cell(r, cols, 'pref') || '東京都';
    const full = `${prefName}${city && !town.startsWith(city) ? city : ''}${town}`;
    const area = resolveArea(full);
    if (!area) { skipped.noArea++; continue; }
    out.push({
      name,
      cat: catPick.cat,
      catNote: catPick.guess ? '営業許可の施設名称からバー/ラウンジと推定（業種は未確認）' : '',
      prefSlug: area.prefSlug,
      districtSlug: area.districtSlug,
      address: `${prefName}${maskTown(full.replace(new RegExp('^' + prefName), ''))}`,
      station: '',
      features: '',
      licence: `食品衛生法 飲食店営業許可${cell(r, cols, 'licenceNo') ? `（許可番号 ${cell(r, cols, 'licenceNo')}）` : ''}`,
      verifiedAt: new Date().toISOString().slice(0, 10),
      sourceUrl: 'https://catalog.data.metro.tokyo.lg.jp/dataset/' + src.catalogId,
      source: src.attribution,
    });
  }
  return { out, skipped, src, total: rows.length - headIdx - 1, wards: [...wardNames] };
}

// ---- 施術所（あん摩マッサージ指圧・はり・きゅう）-------------------------
// 「健全マッサージ」の法的な実体はこれ。国家資格者の施術所台帳がオープンデータで出ている。
// 性的サービスは制度上存在しないため、この区分には一切混ぜない。
async function buildSejutsu() {
  assertAllowed('tokyo-sejutsu');
  const src = SOURCES['tokyo-sejutsu'];
  const res = await fetch(src.url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error('施術所CSV ' + res.status);
  const text = decodeCsvBuffer(Buffer.from(await res.arrayBuffer()));
  const rows = parseCsvText(text);
  // 1行目は「施術所一覧（令和8年10月10日現在）」のようなタイトル行なので、ヘッダ位置を探す
  const hi = rows.findIndex((r) => r.some((c) => c.trim() === '施設名称'));
  if (hi < 0) throw new Error('ヘッダ行（施設名称）が見つかりません — 仕様変更を確認してください');
  const head = rows[hi].map((c) => c.trim());
  const i = Object.fromEntries(head.map((h, n) => [h, n]));
  // このデータセットは区名が行に含まれないため、出典の区名を前置する
  const wardName = '文京区';
  const out = [];
  const skipped = { noName: 0, noArea: 0, notMassage: 0 };
  for (const r of rows.slice(hi + 1)) {
    const name = (r[i['施設名称']] || '').replace(/\u3000/g, ' ').trim();
    if (!name) { skipped.noName++; continue; }
    const kind = (r[i['業務の種類']] || '').trim();
    // 「あん摩」「マッサージ」「指圧」を含むものだけ（はり・きゅう単独は対象外）
    if (!/あん摩|マッサージ|指圧/.test(kind)) { skipped.notMassage++; continue; }
    // CSV の所在地は「文京区本駒込2-1-1」のように区名込み。二重に前置しない。
    const colAddr = (r[i['施設所在地']] || '').trim();
    const rawAddr = colAddr.startsWith(wardName) ? colAddr : `${wardName}${colAddr}`;
    const area = resolveArea(rawAddr);
    if (!area) {
      skipped.noArea++;
      if (!skipped.unsupportedWards) skipped.unsupportedWards = new Set();
      skipped.unsupportedWards.add(rawAddr.replace(/^東京都/, '').slice(0, 3));
      continue;   // エリア未登録の区は掲載しない（誤った地域表示をしない）
    }
    out.push({
      name,
      cat: 'massage',
      catNote: '東京都の施術所台帳に基づく掲載（国家資格者）',
      prefSlug: area.prefSlug,
      districtSlug: area.districtSlug,
      address: `東京都${maskTown(rawAddr)}`,
      station: '',
      licence: `あん摩マッサージ指圧師（業務の種類：${kind}）`,
      verifiedAt: new Date().toISOString().slice(0, 10),
      sourceUrl: src.url,
      source: src.attribution,
    });
  }
  return { out, skipped, src, total: rows.length - hi - 1 };
}

// ---- OpenStreetMap（ODbL）--------------------------------------------------
const OSM_AREAS = {
  // OSM の住所タグは欠損が多いので、エリア判定は「町丁目の外接矩形」で行う
  kabukicho: {
    // 歌舞伎町 = 靖国通り(南)〜職安通り(北)・西武新宿線(西)〜明治通り(東)の矩形。
    // area 指定より矩形のほうが「隣町のバー」を拾わない（実測で確認済み）。
    q: '[out:json][timeout:90][bbox:35.6943,139.6988,35.7000,139.7048];'
      + '(node["amenity"~"^(bar|pub|nightclub)$"]["name"];way["amenity"~"^(bar|pub|nightclub)$"]["name"];);out center tags;',
    prefSlug: 'tokyo', districtSlug: 'shinjuku-kabukicho' },
  tokyo: { q: '[out:json][timeout:120];area["name"="東京都"]["admin_level"="4"]->.a;(node["amenity"~"^(bar|pub|nightclub)$"]["name"](area.a););out center tags;', prefSlug: 'tokyo', districtSlug: null },
};

async function buildOsm(areaKey) {
  assertAllowed('osm-nightlife');
  const a = OSM_AREAS[areaKey];
  if (!a) throw new Error('未対応のエリア: ' + areaKey);
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', 'user-agent': UA },
    body: 'data=' + encodeURIComponent(a.q),
  });
  if (!res.ok) throw new Error('Overpass ' + res.status);
  const j = await res.json();
  const out = [];
  for (const el of j.elements || []) {
    const t = el.tags || {};
    const name = (t['name'] || '').trim();
    if (!name || isChain(name)) continue;
    const addrFull = `${t['addr:province'] || '東京都'}${t['addr:city'] || ''}${t['addr:suburb'] || ''}${t['addr:street'] || ''}`;
    if (a.match && !a.match.test(addrFull + (t['addr:quarter'] || ''))) continue;
    const cat = /ガールズバー|girls/i.test(name) ? 'girlsbar' : 'snack';
    const town = (addrFull.match(/[\u4e00-\u9fff]+町[0-9０-９]*丁目|[\u4e00-\u9fff]+丁目/) || [])[0] || '';
    out.push({
      name, cat,
      catNote: 'OpenStreetMapのタグから推定（業種は未確認）',
      prefSlug: a.prefSlug,
      districtSlug: a.districtSlug || 'shinjuku-kabukicho',
      address: town ? `東京都${t['addr:city'] || ''}${maskTown(town)}` : (addrFull ? addrFull.replace(/[0-9０-９\-－ー].*$/, '') : '東京都'),
      station: '',
      hoursStart: (t['opening_hours'] || '').match(/\d{2}:\d{2}/)?.[0] || '',
      features: '',
      licence: '',
      verifiedAt: new Date().toISOString().slice(0, 10),
      sourceUrl: `https://www.openstreetmap.org/${el.type}/${el.id}`,
      source: '出典：OpenStreetMap contributors（ODbL 1.0）を加工して作成',
    });
  }
  return { out, src: { label: 'OpenStreetMap (ODbL 1.0)', attribution: '© OpenStreetMap contributors, ODbL 1.0' }, total: (j.elements || []).length, skipped: {} };
}

// ---- 書き出し --------------------------------------------------------------
const HEADER = ['name', 'cat', 'catNote', 'prefSlug', 'districtSlug', 'address', 'station', 'hoursStart', 'hoursEnd', 'closed', 'set60', 'extend30', 'castDrink', 'charge', 'nomination', 'servicePct', 'priceCovered', 'features', 'tel', 'licence', 'verifiedAt', 'sourceUrl', 'source'];
const q = (v) => (/[",\n]/.test(String(v ?? '')) ? `"${String(v ?? '').replace(/"/g, '""')}"` : String(v ?? ''));

function write(records, file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const lines = [HEADER.join(',')];
  for (const r of records) lines.push(HEADER.map((h) => q(r[h])).join(','));
  fs.writeFileSync(file, lines.join('\n') + '\n');
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === 'list') {
    console.log('取り込み可能な出典（すべて無料・商用可）:');
    for (const [k, v] of Object.entries(SOURCES)) console.log('  ', k.padEnd(16), v.licence, v.label);
    console.log('   osm-kabukicho   ODbL', 'OpenStreetMap 新宿区の bar/pub/nightclub');
    console.log('\n■ 使用禁止（転載しない）:');
    for (const f of FORBIDDEN) console.log('   ✗', f.name);
    console.log('\n例: node tools/fetch-opendata.mjs tokyo-shinjuku --preview');
    return;
  }
  const commit = rest.includes('--commit');
  let result;
  if (cmd === 'osm-kabukicho') result = await buildOsm('kabukicho');
  else if (cmd === 'tokyo-sejutsu') result = await buildSejutsu();
  else if (cmd.startsWith('tokyo-')) result = await buildTokyoFood(cmd);
  else throw new Error('不明なコマンド: ' + cmd);

  const { out, skipped = {}, src, total } = result;
  const byCat = out.reduce((a, r) => ((a[r.cat] = (a[r.cat] || 0) + 1), a), {});
  const byArea = out.reduce((a, r) => ((a[r.districtSlug] = (a[r.districtSlug] || 0) + 1), a), {});

  console.log('────────────────────────────────────────────────');
  console.log(' 出典        :', src.label || src.attribution);
  console.log(' ライセンス  :', src.licence || 'ODbL 1.0');
  console.log(' 元データ行数:', total);
  console.log(' 取り込み候補:', out.length, byCat);
  console.log(' エリア別    :', byArea);
  if (Object.keys(skipped).length) console.log(' 除外内訳    :', skipped);
  console.log('────────────────────────────────────────────────');

  if (!out.length) { console.log('候補ゼロ。条件を見直してください。'); return; }
  const stamp = new Date().toISOString().slice(0, 10);
  const dir = commit ? 'seeds' : 'feed';
  const file = path.join(ROOT, dir, `${cmd}-${stamp}.csv`);
  write(out, file);
  console.log(`書き出し: ${path.relative(ROOT, file)} (${out.length} 件)`);
  if (commit) {
    // 동일 내용의 preview 파일이 feed/ 에 남아 중복 집계되는 것을 막는다
    const prev = path.join(ROOT, 'feed', `${cmd}-${stamp}.csv`);
    if (fs.existsSync(prev)) { fs.rmSync(prev); console.log('중복 방지: 기존 preview 파일 삭제 →', path.relative(ROOT, prev)); }
    console.log('→ seeds/ に反映しました。`node tools/import.mjs stats` でモードを確認し、');
    console.log('  必ず 20 件ほど手作業でスポットチェックしてから `npm run build:pages` してください。');
  } else {
    console.log('→ preview です。中身を確認し、問題なければ同じコマンドに --commit を付けて実行してください。');
  }
  console.log('\n※ 帰属表示が必要です。サイトのフッター/ライセンスページに以下を掲載してください:');
  console.log('   ', src.attribution || src.label);
}

// CLI として直接実行されたときだけ走らせる（テストで import しても安全）
const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isCli) main().catch((e) => { console.error('✗', e.message); process.exit(1); });
