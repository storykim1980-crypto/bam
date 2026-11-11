import { calculator } from '../render/sections.mjs';
// ============================================================================
// PRICE GUIDE — dedicated illustrative calculator; no regional price bands
// Answers the exact Yahoo! Japan query pattern 「ガールズバー 料金 地域名」
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { crumbs, secHead, sideAd } from '../render/components.mjs';
import { CATEGORIES, catBySlug } from '../data/categories.mjs';
import { REGIONS, districtList, prefectureList, prefBySlug, GEO_STATS } from '../data/geo.mjs';
import { shopsByDistrict } from '../data/shops.mjs';
import { areaMedian, yen } from '../data/pricing.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

function rowsFor(lang, catSlug) {
  const rows = [];
  for (const d of districtList) {
    const n = (shopsByDistrict.get(d.slug) || []).filter((s) => s.cat === catSlug).length;
    if (!n) continue;
    rows.push({ name: d[lang], pref: d.pref[lang], prefSlug: d.prefSlug, districtSlug: d.slug, priceIndex: d.p, shops: n, tier: d.tier });
  }
  return rows.sort((a, b) => b.priceIndex - a.priceIndex);
}

export function pricePage(lang, params) {
  const path = `/${lang}/price/`;
  const initCat = CATEGORIES.some((c) => c.slug === (params.get('cat') || '')) ? params.get('cat') : 'girlsbar';
  const rawIdx = params.get('idx');
  const hasIdx = rawIdx !== null && rawIdx !== '' && !Number.isNaN(parseFloat(rawIdx));
  const initIdx = hasIdx ? Math.min(1.8, Math.max(0.7, parseFloat(rawIdx))) : 1;
  const title = L(lang,'料金のしくみと総額シミュレーター','요금 구조와 총액 계산기','Pricing explained & total calculator');

  const body = `
<section class="ph"><div class="wrap wrap-wide">
  ${crumbs(lang, [{ label: t(lang, 'breadcrumbHome'), href: `/${lang}/` }, { label: t(lang, 'navPrice') }])}
  <h1>${esc(L(lang, '料金ガイド・総額シミュレーター', '요금 가이드·총액 시뮬레이터', 'Price guide & all-in calculator'))}</h1>
  <p>${esc(t(lang, 'priceLead'))}</p>
  <div class="ph-row">
    <span class="chip gold">${esc(t(lang, 'trustTransparent'))}</span>
    <span class="chip mint">${esc(t(lang, 'taxIncl'))}</span>
    <span class="chip">${GEO_STATS.districts} ${esc(t(lang, 'area'))}</span>
  </div>
</div></section>

<section class="sec" style="padding-top:26px"><div class="wrap wrap-wide">
  ${calculator(lang)}
</div></section>

<section class="sec"><div class="wrap wrap-wide">
  <div class="split">
    <div class="stack">
      ${secHead(lang, 'HOW PRICING WORKS', esc(L(lang, '日本の夜の店の料金の仕組み', '일본 나이트 가게 요금 구조', 'How Japanese night venue pricing works')), '')}
      <div class="prose">
        <h3>1. ${esc(L(lang, 'セット料金（基本料金）', '세트 요금(기본 요금)', 'Set fee (base rate)'))}</h3>
        <p>${esc(L(lang, '入店から一定時間（通常60〜90分）の基本料金です。ここに飲み放題が含まれる店と含まれない店があります。', '입점부터 일정 시간(보통 60~90분)의 기본 요금입니다. 여기에 무제한 음주가 포함된 점포와 그렇지 않은 점포가 있습니다.', 'A base fee covering a fixed time from entry, usually 60–90 minutes. Some venues include all-you-can-drink; others do not.'))}</p>
        <h3>2. ${esc(L(lang, 'チャージ・お通し', '차지·오토시', 'Cover charge / otoshi'))}</h3>
        <p>${esc(L(lang, '席料・お通し代として500〜1,500円程度がかかる場合があります。必ず事前に確認しましょう。', '좌석료·오토시 대로 500~1,500엔 정도가 발생할 수 있습니다. 반드시 사전에 확인하세요.', 'A seat charge of roughly ¥500–1,500 may apply. Always confirm before you sit down.'))}</p>
        <h3>3. ${esc(L(lang, 'キャストドリンク', '캐스트 드링크', 'Cast drinks'))}</h3>
        <p>${esc(L(lang, 'キャストと一緒に飲むドリンク代（700〜1,500円／杯）。多く頼むほど総額が上がります。', '캐스트와 함께 마시는 드링크 요금(700~1,500엔/잔). 많이 주문할수록 총액이 올라갑니다.', 'Drinks you buy for the cast (¥700–1,500 each). Ordering more raises your total.'))}</p>
        <h3>4. ${esc(L(lang, '指名料・延長料・深夜割増', '지명료·연장료·심야 할증', 'Nomination, extension & late-night surcharge'))}</h3>
        <p>${esc(L(lang, '特定のキャストを指名すると1,000円前後、30分延長で1,500〜2,000円、22時以降は10%の深夜割増がかかる店舗もあります。', '특정 캐스트를 지명하면 1,000엔 전후, 30분 연장에 1,500~2,000엔, 22시 이후 10% 심야 할증이 붙는 점포도 있습니다.', 'Nominating a specific cast is around ¥1,000, a 30-minute extension ¥1,500–2,000, and some venues add a 10% late-night surcharge after 22:00.'))}</p>
        <h3>5. ${esc(L(lang, '消費税10%', '소비세 10%', '10% consumption tax'))}</h3>
        <p>${esc(L(lang, '日本では表示料金に消費税10%が加算されるのが一般的です。当サイトはすべて税込総額で表示しています。', '일본에서는 표시 요금에 소비세 10%가 가산되는 것이 일반적입니다. 본 사이트는 모두 세금 포함 총액으로 표시합니다.', 'In Japan, 10% consumption tax is normally added to displayed prices. We show every price as a tax-inclusive total.'))}</p>
        <div class="notice"><b>${esc(L(lang, 'ぼったくり対策', '바가지 요금 대책', 'Avoiding rip-offs'))}</b><br>
          ${esc(L(lang, '入店前に「総額いくらか」を必ず確認し、明朗会計の店舗を選びましょう。当サイトの店舗ページには税込総額を明記しています。トラブル時は最寄りの警察署（#9110）または消費者ホットライン（188）へ。', '입점 전에 "총액이 얼마인지"를 반드시 확인하고 투명 정찰제 점포를 선택하세요. 본 사이트 점포 페이지에는 세금 포함 총액이 명시되어 있습니다. 트러블 시 가까운 경찰서(#9110) 또는 소비자 핫라인(188)으로.', 'Before entering, always confirm the total. Choose venues with transparent billing — every listing on this site states a tax-inclusive total. If there is a dispute, contact the police (#9110) or the consumer hotline (188).'))}</div>
      </div>
    </div>
    <div class="side-stack">
      ${sideAd(lang)}

    </div>
  </div>
</div></section>`;

  const jsonLd = {'@context':'https://schema.org','@type':'WebPage',name:title,inLanguage:lang};

  return page({ lang, path, title, desc: L(lang,'料金のしくみとモデル条件による総額の試算。実際の料金は来店前に店舗へご確認ください。','요금 구조와 모델 조건에 따른 총액 계산. 실제 요금은 방문 전 매장에 확인하세요.','Understand pricing and estimate a model total. Confirm actual prices with the venue before visiting.'), body, jsonLd });
}
