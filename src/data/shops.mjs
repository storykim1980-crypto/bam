import { RESEARCHED_VENUES } from './researched-venues.mjs';
// ============================================================================
// BAM-NIGHT JAPAN — source-backed listings only; synthetic generator removed.
// ============================================================================

import { districtList, prefectureList, districtBySlug } from './geo.mjs';
import { CATEGORIES } from './categories.mjs';
import { REAL_VENUES } from './venues.mjs';

function realToShop(v) {
  const pref = prefectureList.find((p) => p.slug === v.prefSlug);
  const dist = districtBySlug.get(v.districtSlug);
  if (!pref || !dist) return null;                     // エリアが未登録なら掲載しない
  const catDef = CATEGORIES.find((c) => c.slug === v.cat);
  if (!catDef) return null;

  const p = v.price || {};
  const has = (x) => Number.isFinite(x) && x > 0;

  // 実データの価格だけを積む（推測・補完はしない）。税込総額はここで計算。
  const lines = [];
  const add = (id, ja, ko, en, amount) => { if (has(amount) || amount === 0) lines.push({ id, ja, ko, en, amount: Math.round(amount) }); };
  add('set', 'セット料金（60分）', '세트 요금(60분)', 'Set fee (60 min)', p.set60);
  if (has(p.charge)) add('charge', 'チャージ・お通し', '차지·오토시', 'Cover / otoshi', p.charge);
  if (has(p.castDrink)) add('cast', 'キャストドリンク ×1', '캐스트 드링크 ×1', 'Cast drink ×1', p.castDrink);
  if (has(p.nomination)) add('nom', '指名料', '지명료', 'Nomination fee', p.nomination);
  const sub = lines.reduce((a, l) => a + l.amount, 0);
  const service = has(p.servicePct) ? Math.round(sub * (p.servicePct / 100)) : 0;
  if (service) add('service', `サービス料（${p.servicePct}%）`, `서비스료(${p.servicePct}%)`, `Service (${p.servicePct}%)`, service);
  const taxed = Math.round((sub + service) * 1.1);
  const priceKnown = lines.length > 0;
  const seo = { prefSlug: pref.slug, prefJa: pref.ja, prefKo: pref.ko, prefEn: pref.en };
  return {
    id: v.id,
    slug: v.slug,
    cat: v.cat,
    nameJa: v.nameJa, nameKo: v.nameKo, nameEn: v.nameEn,
    tag: v.tag || 'standard',
    districtSlug: dist.slug,
    districtJa: dist.ja, districtKo: dist.ko, districtEn: dist.en,
    ...seo,
    regionSlug: dist.regionSlug,
    addressJa: v.addressJa, addressKo: v.addressKo, addressEn: v.addressEn,
    station: v.station || dist.station,
    distanceJa: '', distanceKo: '', distanceEn: '',
    priceIndex: 1,
    features: v.features || [],
    hoursStart: v.hoursStart || '', hoursEnd: v.hoursEnd || '',
    closed: v.closed || '',
    seats: 0,
    capacityPct: 0,
    points: 0,                    // 実店舗はポイント操作をしない（0から開始）
    rating: 0, reviewCount: 0,    // 口コミが無いのに数字を出さない
    phoneMask: v.phoneMask || '',
    images: v.images && v.images.length ? v.images : [],
    coupon: null,
    badge: null,
    verifiedLegal: !!v.licence,
    aiConcept: false,
    sample: false,
    source: 'real',
    origin: v.origin,
    sourceUrl: v.sourceUrl || '',
    priceCovered: !!v.priceCovered,
    verifiedAt: v.verifiedAt || '',
    catNote: v.catNote || '',
    dataNote: v.note || '',
    licence: v.licence || '',
    avgAllIn60: priceKnown ? taxed : null,
    priceKnown,
    priceLines: lines,
    reviews: [],
    lat: null, lng: null,
    realData: true,
  };
}
// 実店舗は slug で一意化する（同一店名が別データ源・別行で重複したとき、
// 詳細ページが二重生成されて1つが404になるのを防ぐ）。
const realShops = (() => {
  const seen = new Set();
  const out = [];
  for (const v of REAL_VENUES) {
    const shop = realToShop(v);
    if (!shop || seen.has(shop.slug)) continue;   // 先勝ち（＝より情報量の多い順に並べる前提）
    seen.add(shop.slug);
    out.push(shop);
  }
  return out;
})();

// Publish source-reviewed snack profiles first; never fall back to synthetic listings.
const researchedSnacks=RESEARCHED_VENUES.map(profile=>{
 const view=realToShop({id:profile.id,slug:profile.slug,cat:profile.cat,prefSlug:profile.prefSlug||'tokyo',districtSlug:profile.districtSlug,nameJa:profile.name.ja,nameKo:profile.name.ko,nameEn:profile.name.en,addressJa:profile.address,addressKo:profile.address,addressEn:profile.address,sourceUrl:profile.sourceUrl,origin:profile.sourceUrl,verifiedAt:profile.checkedAt,images:[],features:[],phoneMask:profile.phone||''});
 if(!view)throw new Error('Unmapped researched snack: '+profile.slug);
 return {...view,researchProfile:profile,verifiedLegal:false,station:'',priceKnown:false,avgAllIn60:null};
});
export const SAMPLE_SHOPS=[];
export const SHELL_SHOPS=[];
export const SHOPS=[...researchedSnacks]; // Canonical research data only; never merge unreviewed imports.
export const REAL_SHOPS=SHOPS;
export const SHOP_COUNT=SHOPS.length;
export const REAL_SHOP_COUNT=SHOPS.length;
export const SAMPLE_SHOP_COUNT=0;
export const DISPLAY_COUNT=SHOPS.length;

export const shopsByDistrict = new Map();
export const shopsByPref = new Map();
export const shopsByRegion = new Map();
// 지리 인덱스는 병합 배열(SHOPS) 기준 — 실점포가 있으면 실점포가 우선 노출된다.
for (const s of SHOPS) {
  if (!shopsByDistrict.has(s.districtSlug)) shopsByDistrict.set(s.districtSlug, []);
  shopsByDistrict.get(s.districtSlug).push(s);
  if (!shopsByPref.has(s.prefSlug)) shopsByPref.set(s.prefSlug, []);
  shopsByPref.get(s.prefSlug).push(s);
  if (!shopsByRegion.has(s.regionSlug)) shopsByRegion.set(s.regionSlug, []);
  shopsByRegion.get(s.regionSlug).push(s);
}

export const catCountByDistrict = (slug, cat) =>
  (shopsByDistrict.get(slug) || []).filter((s) => s.cat === cat).length;

export const RANKINGS = {
  // Compatibility discovery indexes; no measured popularity claimed.
  daily: [...SHOPS].sort((a, b) => (b.realData ? -1 : 1) - (a.realData ? -1 : 1) || b.points - a.points).slice(0, 100),
  byCat: Object.fromEntries(
    ['snack', 'girlsbar', 'massage'].map((c) => [c, [...SHOPS].filter((s) => s.cat === c).sort((a, b) => (b.realData ? -1 : 1) - (a.realData ? -1 : 1) || b.points - a.points).slice(0, 60)]),
  ),
  newOpen: SHOPS.filter((s) => s.badge === 'new').slice(0, 40),
  vip: SHOPS.filter((s) => s.badge === 'vip').slice(0, 24),
};

export const TODAY = process.env.BAMNIGHT_TODAY || '2026-11-07';
export const DISTRICTS = districtList;
export const districtOf = (slug) => districtBySlug.get(slug);

export const SHOPS_BY_SLUG = new Map(SHOPS.map((s) => [s.slug, s]));
