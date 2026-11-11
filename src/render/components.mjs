// ============================================================================
// BAM-NIGHT JAPAN — Reusable UI components
// ============================================================================

import { t, pick } from '../i18n.mjs';
import { ICONS, esc } from './layout.mjs';
import { CATEGORIES, catBySlug, featureById } from '../data/categories.mjs';
import { yen } from '../data/pricing.mjs';
import { REGIONS, prefectureList } from '../data/geo.mjs';
import { SAMPLE_BADGE, REAL_BADGE, SAMPLE_NOTICE, LISTING_MODE } from '../data/registry.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

export function catName(lang, slug) {
  const c = catBySlug.get(slug);
  return c ? c[lang] : slug;
}

export function aiBadge(lang, cls = '') {
  return `<span class="bdg bdg-ai ${cls}" title="${esc(t(lang, 'conceptNote'))}">${esc(t(lang, 'aiConceptShort'))}</span>`;
}

export function shopName(lang, s) {
  return lang === 'ko' ? s.nameKo : lang === 'en' ? s.nameEn : s.nameJa;
}
export function distName(lang, s) {
  return lang === 'ko' ? s.districtKo : lang === 'en' ? s.districtEn : s.districtJa;
}
function distOf(lang, s) {
  return lang === 'ko' ? s.distanceKo : lang === 'en' ? s.distanceEn : s.distanceJa;
}

function featureChips(lang, ids, max = 4) {
  return ids.slice(0, max).map((id) => {
    const f = featureById.get(id);
    if (!f) return '';
    const cls = id === 'korean' ? ' on-ko' : id === 'english' ? ' on-en' : '';
    return `<span class="fchip${cls}">${esc(f[lang])}</span>`;
  }).join('');
}

export function shopCard(lang, s, opts = {}) {
  const href = `/${lang}/shop/${s.slug}/`;
  const name = shopName(lang, s);
  const badge =
    (s.badge === 'vip' ? `<span class="bdg bdg-vip">${esc(t(lang, 'vip'))}</span>` : '') +
    (s.badge === 'pr' ? `<span class="bdg bdg-pr">${esc(t(lang, 'pr'))}</span>` : '') +
    (s.badge === 'new' ? `<span class="bdg bdg-new">${esc(t(lang, 'newOpen'))}</span>` : '');
  return `
<article class="sc" data-pref="${s.prefSlug}" data-district="${s.districtSlug}" data-cat="${s.cat}" data-price="${s.avgAllIn60}" data-points="${s.points}" data-rating="${s.rating}"
  data-feat="${s.features.join(' ')}" data-search="${esc(`${s.nameJa} ${s.nameKo} ${s.nameEn} ${s.districtJa} ${s.districtKo} ${s.districtEn} ${s.station} ${s.prefJa} ${s.prefEn}`)}">
  <div class="sc-thumb${s.images.length ? '' : ' no-img'}">
    <a href="${href}" aria-label="${esc(name)}">
      ${s.images.length ? `<img src="${s.images[0]}" alt="${esc(name)}" loading="lazy" width="640" height="400">` : `<img src="/images/ai-${s.cat}-editorial.jpg" alt="${esc(L(lang,'AIコンセプト・実店舗写真ではありません','AI 콘셉트 · 실제 매장 사진 아님','AI concept · not an actual venue photo'))}" loading="lazy" width="640" height="400"><span class="image-note">AI CONCEPT</span>`}
    </a>
    <button class="save-venue" data-save="${s.slug}" aria-pressed="false" aria-label="${esc(L(lang,'お気に入りに保存','관심 매장 저장','Save venue'))}">♡</button>
    <div class="sc-badges">${badge}<span class="bdg bdg-cat">${esc(catName(lang, s.cat))}</span>${s.sample ? `<span class="bdg bdg-sample">${esc(SAMPLE_BADGE[lang] || SAMPLE_BADGE.ja)}</span>` : `<span class="bdg bdg-real">${esc(s.researchProfile ? L(lang,'公開資料','공개자료','Public source') : (REAL_BADGE[lang] || REAL_BADGE.ja))}</span>`}${s.sample ? aiBadge(lang) : ''}</div>
    ${s.sample ? `<span class="sc-pts">🐾 ${s.points.toLocaleString('en-US')}${esc(t(lang, 'points'))}</span>` : (s.verifiedAt ? `<span class="sc-pts">✓ ${esc(s.verifiedAt)}</span>` : '')}
  </div>
  <div class="sc-body">
    <a href="${href}"><h3 class="sc-name">${esc(name)}</h3></a>
    <div class="sc-meta">
      <span>${esc(distName(lang, s))}</span><span class="dot"></span>
      <span>${esc(distOf(lang, s))}</span><span class="dot"></span>
      <span>${esc(L(lang,'営業条件は詳細へ','영업 조건은 상세에서','See hours in details'))}</span>
    </div>
    ${s.researchProfile?.fees ? `<p class="sc-summary">${esc(s.researchProfile.fees[lang]||s.researchProfile.fees.ja)}</p>` : ''}
    <div class="sc-feats">${featureChips(lang, s.features, 4)}</div>
    ${s.coupon ? `<div class="sc-coupon">${ICONS.ticket}<span>${esc(s.coupon[lang])}</span></div>` : ''}
    <button class="compare-action" data-compare="${s.slug}" aria-pressed="false">⇄ ${esc(L(lang,'比較に追加','비교에 추가','Add to comparison'))}</button>
    <div class="sc-price">
      ${s.avgAllIn60
        ? `<span class="price-all"><small>${esc(t(lang, 'allInFrom'))}</small><b>${yen(s.avgAllIn60)}<i>${esc(t(lang, 'taxIncl'))}</i></b></span>`
        : `<span class="price-all"><small>${esc(L(lang, '料金', '요금', 'Price'))}</small><b style="font-size:13px">${esc(L(lang, '条件は詳細へ', '상세 조건 확인', 'See fee conditions'))}</b></span>`}
      <span class="rating">${s.reviewCount ? `${ICONS.star}${s.rating.toFixed(1)}<span>(${s.reviewCount})</span>` : `<span class="muted" style="font-size:11px">${esc(L(lang, '公開資料を参照', '공개 자료 참고', 'Public-source listing'))}</span>`}</span>
    </div>
  </div>
</article>`;
}

export function shopRow(lang, s, rank) {
  return `
<a class="rr" href="/${lang}/shop/${s.slug}/">
  <span class="rr-no${rank <= 3 ? ' top' : ''}">${rank}</span>
  <span class="rr-im">${s.images.length ? `<img src="${s.images[0]}" alt="" loading="lazy" width="56" height="56">` : `<span class="rr-noimg">${esc(catName(lang, s.cat))}</span>`}</span>
  <span class="rr-tx"><b>${esc(shopName(lang, s))}</b><small>${esc(distName(lang, s))} ・ ${esc(catName(lang, s.cat))} ・ ${s.realData&&!s.priceKnown ? esc(L(lang,'料金は店舗へ確認','요금은 매장에 확인','Confirm pricing')) : yen(s.avgAllIn60)}</small></span>
  <span class="rr-pt">${s.sample ? esc(L(lang,'サンプル','샘플','Sample')) : '↗'}</span>
</a>`;
}

export function rankList(lang, shops, limit = 10, ranked = true) {
  return `<div class="ranklist">${shops.slice(0, limit).map((s, i) => shopRow(lang, s, ranked ? i + 1 : i + 1)).join('')}</div>`;
}

// ---- region grid -----------------------------------------------------------
export function regionGrid(lang) {
  return `<div class="regions">${REGIONS.map((r) => {
    const cnt = r.prefectures.reduce((n, p) => n + p.districts.length, 0);
    const prefCnt = r.prefectures.length;
    return `<a class="reg-c" href="/${lang}/area/${r.slug}/">
      <b>${esc(r[lang])}</b>
      <small>${esc(L(lang, `${prefCnt}都道府県・${cnt}エリア`, `${prefCnt}개 도도부현·${cnt}개 지역`, `${prefCnt} prefectures · ${cnt} districts`))}</small>
      <span class="n">${esc(t(lang, 'viewAll'))} <span>→</span></span>
    </a>`;
  }).join('')}</div>`;
}

export function prefGrid(lang, prefs) {
  return `<div class="pref-grid">${prefs.map((p) => {
    const n = p.districtSlugs.length;
    return `<div class="pref-c">
      <div class="hd2"><b><a href="/${lang}/area/${p.slug}/">${esc(p[lang])}</a></b>
        <span class="cnt">${n} ${esc(t(lang, 'area'))}</span></div>
      <div class="dlist">${p.districtSlugs.slice(0, 8).map((ds) => {
        const d = p.__districts.find((x) => x.slug === ds);
        return `<a href="/${lang}/area/${p.slug}/${ds}/">${esc(d[lang])}</a>`;
      }).join('')}${n > 8 ? `<a href="/${lang}/area/${p.slug}/">+${n - 8}</a>` : ''}</div>
    </div>`;
  }).join('')}</div>`;
}

// prefectures enriched with their district objects for the template above
export const prefsWithDistricts = prefectureList.map((p) => ({
  ...p,
  __districts: REGIONS.find((r) => r.slug === p.regionSlug).prefectures.find((x) => x.slug === p.slug).districts,
}));

// ---- plan cards ------------------------------------------------------------
export function planCards(lang, plans) {
  return `<div class="plans">${plans.map((p) => `
  <div class="plan${p.best ? ' best' : ''}">
    ${p.best ? `<span class="plan-best-tag">${esc(L(lang, 'いちばん人気', '가장 인기', 'Most popular'))}</span>` : ''}
    <h4>${esc(p.name[lang])}</h4>
    <div class="pl-price">${yen(p.price)}<small>${esc(p.period[lang])} ${esc(t(lang, 'taxExcl'))}</small></div>
    <ul>${p.features[lang].map((f) => `<li>${ICONS.check}<span>${esc(f)}</span></li>`).join('')}</ul>
    <a class="btn ${p.best ? 'btn-gold' : 'btn-ghost'}" href="#form" data-plan="${p.id}">${esc(p.cta[lang])}</a>
  </div>`).join('')}</div>`;
}

// ---- trust strip -----------------------------------------------------------
export function trustStrip(lang) {
  const items = [
    ['coins', 'trustTransparent', 'trustTransparentD'],
    ['shield', 'trustLegal', 'trustLegalD'],
    ['leaf', 'trustWholesome', 'trustWholesomeD'],
    ['globe', 'trustMultilingual', 'trustMultilingualD'],
  ];
  return `<div class="trust">${items.map(([ic, ti, de]) => `
  <div class="trust-c"><div class="ic">${ICONS[ic]}</div>
    <b>${esc(t(lang, ti))}</b><span>${esc(t(lang, de))}</span></div>`).join('')}</div>`;
}

// ---- ad units --------------------------------------------------------------
export function heroVipAd(lang) {
  return `<div class="ad-hero">
  <img src="/images/ad-vip-banner.jpg" alt="${esc(t(lang, 'ad'))}">
  <div class="ad-hero-in">
    <span class="ad-tag">PR ${esc(t(lang, 'ad'))}</span>
    <h3>${esc(L(lang, '銀座・北新地の上質な夜を、総額で。', '긴자·기타신치의 품격 있는 밤을, 총액으로.', 'Ginza & Kitashinchi — premium nights, all-in pricing.'))}</h3>
    <p>${esc(L(lang, 'トップPR枠スポンサー募集中。3言語の全ページで全国に露出します。', '톱 PR 슬롯 스폰서 모집 중. 3개 언어 전 페이지에서 전국에 노출됩니다.', 'Homepage PR slot available — exposure nationwide across all three language editions.'))}</p>
    <a class="btn btn-gold" href="/${lang}/advertise/">${esc(t(lang, 'navAdvertise'))}</a>
  </div>
</div>`;
}

export function adStrip(lang, title, sub) {
  return `<div class="ad-strip">
    <div><b><span class="ad-tag" style="margin-right:8px">${esc(t(lang, 'pr'))}</span>${esc(title)}</b>
      <small>${esc(sub)}</small></div>
    <a class="btn btn-ghost" href="/${lang}/advertise/#form">${esc(L(lang, '掲載を申し込む', '게재 신청', 'Get listed'))}</a>
  </div>`;
}

export function sideAd(lang) { return ''; }

// ---- breadcrumbs -----------------------------------------------------------
export function crumbs(lang, items) {
  return `<nav class="crumb" aria-label="breadcrumb">${items.map((it, i) =>
    (i ? ICONS.chev : '') + (it.href ? `<a href="${it.href}">${esc(it.label)}</a>` : `<span style="color:var(--ink2)">${esc(it.label)}</span>`),
  ).join('')}</nav>`;
}

export function secHead(lang, eyebrow, title, lead, right = '') {
  return `<div class="sec-hd"><div>
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
    <h2>${title}</h2>${lead ? `<p>${esc(lead)}</p>` : ''}
  </div>${right}</div>`;
}


// ---- sample-data disclosure ------------------------------------------------
/**
 * 実店舗が未登録のあいだ、一覧の先頭に必ず出す開示バナー。
 * 景表法・優良誤認を避けるため、消してはいけない。
 */
export function sampleNotice(lang) {
  if (LISTING_MODE !== 'sample') return '';
  return `<div class="notice amber" role="note" style="margin-bottom:18px">
    <b>${L(lang, 'サンプル表示について', '샘플 표시 안내', 'About the sample listings')}</b>
    <p style="margin:6px 0 0;font-size:.8125rem;line-height:1.65">${esc(SAMPLE_NOTICE[lang] || SAMPLE_NOTICE.ja)}</p>
    <a class="btn btn-ghost" style="margin-top:10px" href="/${lang}/register/">${L(lang, '実店舗を無料で登録する', '실점포를 무료로 등록하기', 'Register a real venue for free')}</a>
  </div>`;
}
