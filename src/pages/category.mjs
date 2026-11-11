// ============================================================================
// CATEGORY hub pages — /:lang/snack/ , /:lang/girlsbar/ , /:lang/massage/
// These mirror the two Yahoo! Japan style search intents:
//   「スナック 店舗検索」 and 「ガールズバー 料金 地域名」
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { secHead, shopCard, rankList, crumbs, sideAd, catName, sampleNotice } from '../render/components.mjs';
import { CATEGORIES, catBySlug, FEATURES } from '../data/categories.mjs';
import { REGIONS, districtList, GEO_STATS } from '../data/geo.mjs';
import { SHOPS, shopsByDistrict, shopsByPref, RANKINGS } from '../data/shops.mjs';
import { LISTING_MODE, SAMPLE_COUNT_LABEL } from '../data/registry.mjs';
const countLabel = (lang) => (LISTING_MODE === 'sample' ? (SAMPLE_COUNT_LABEL[lang] || SAMPLE_COUNT_LABEL.ja) : t(lang, 'shops'));

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

function areaRows(lang, catSlug, limit = 24) {
  const rows = [];
  for (const d of districtList) {
    const n = (shopsByDistrict.get(d.slug) || []).filter((s) => s.cat === catSlug).length;
    if (!n) continue;
    rows.push({ name: d[lang], pref: d.pref[lang], prefSlug: d.prefSlug, districtSlug: d.slug, priceIndex: d.p, shops: n, tier: d.tier });
  }
  return rows.sort((a, b) => a.tier - b.tier || b.shops - a.shops).slice(0, limit);
}

export function categoryPage(lang, slug) {
  const cat = catBySlug.get(slug);
  if (!cat) return null;
  const path = `/${lang}/${slug}/`;
  const pools = SHOPS.filter((s) => s.cat === slug);
  // 実店舗を先に、サンプルは後ろ。カテゴリ上位12件が全部サンプルだと実店舗が見えない。
  const top = [
    ...pools.filter((s) => s.realData).sort((a, b) => (b.verifiedAt || '').localeCompare(a.verifiedAt || '')),
    ...pools.filter((s) => !s.realData).sort((a, b) => b.points - a.points),
  ].slice(0, 12);
  const rows = areaRows(lang, slug);
  const catImg = { snack: '/images/concept-snack-1.jpg', girlsbar: '/images/concept-girlsbar-1.jpg', massage: '/images/concept-massage-1.jpg' }[slug];

  const headline = cat.title[lang];
  const body = `
<section class="ph">
  <div class="wrap wrap-wide">
    ${crumbs(lang, [{ label: t(lang, 'breadcrumbHome'), href: `/${lang}/` }, { label: cat[lang] }])}
    <h1>${esc(headline)}</h1>
    <p>${esc(cat.lead[lang])}</p>
    <div class="ph-row">
      <span class="chip mint">${esc(t(lang, 'legalNote'))}</span>
      <span class="chip">${esc(t(lang, 'aiConcept'))}</span>
      <span class="chip">${pools.length.toLocaleString('en-US')} ${esc(countLabel(lang))}</span>
    </div>
  </div>
</section>

<section class="sec" style="padding-top:26px">
  <div class="wrap wrap-wide">
    <div class="split">
      <div class="stack">
        <form class="filters" action="/${lang}/search/" method="get" role="search">
          <input type="hidden" name="cat" value="${slug}">
          <input type="search" name="q" id="fQuery" placeholder="${esc(t(lang, 'searchPlaceholder'))}" aria-label="${esc(t(lang, 'search'))}" style="flex:1 1 210px">
          <select name="feat" id="fFeat" aria-label="${esc(t(lang, 'features'))}">
            <option value="">${esc(L(lang, 'すべての特徴', '전체 특징', 'All features'))}</option>
            ${FEATURES.map((f) => `<option value="${f.id}">${esc(f[lang])}</option>`).join('')}
          </select>
          <button class="btn btn-gold" type="submit">${ICONS.search}${esc(t(lang, 'search'))}</button>
          <div class="cnt" style="margin-left:auto"><b id="fCount">${top.length}</b> ${esc(t(lang, 'results'))}</div>
        </form>

        <div class="tabs" role="tablist">
          ${CATEGORIES.map((c) => `<a href="/${lang}/${c.slug}/"${c.slug === slug ? ' class="on"' : ''}>${esc(c.ja)}<span style="color:var(--ink3);font-weight:600"> · ${esc(c.ko)} · ${esc(c.en)}</span></a>`).join('')}
        </div>

${sampleNotice(lang)}
        <div class="shops" id="shopGrid">
          ${top.map((s) => shopCard(lang, s)).join('')}
        </div>
        <div id="fEmpty" style="display:none" class="notice">${esc(t(lang, 'noResults'))}</div>
        <p class="small muted">※ ${esc(t(lang, 'conceptNote'))}</p>

        <div class="mt24">
          ${secHead(lang, 'VENUE COLLECTION', esc(cat[lang]), esc(L(lang,'公開資料による掲載店一覧。人気順位ではありません。','공개 자료 기반 목록이며 인기 순위가 아닙니다.','Public-source listings,not a popularity ranking.')))}
          ${rankList(lang, RANKINGS.byCat[slug], 10)}
        </div>

        <div class="mt24">
          ${secHead(lang, 'GUIDE', esc(L(lang, `${cat[lang]}を安心して楽しむために`, `${cat[lang]}를 안심하고 즐기기 위해`, `Enjoying ${cat[lang]} with confidence`)), '')}
          <div class="notice ${slug === 'massage' ? 'mint' : ''}"><b>${esc(t(lang, 'legalNote'))}</b><br>${esc(cat.legality[lang])}</div>
          <div class="steps mt16">
            ${[
              [L(lang, '総額を確認', '총액 확인', 'Confirm the total'), L(lang, '店舗ごとの公開料金と出典を確認し、追加料金は来店前に店舗へ確認。', '매장별 공개 요금과 출처를 살펴보고, 추가요금은 방문 전에 매장에 확인하세요.', 'Review venue-specific listed fees and sources; confirm extras with the venue before visiting.')],
              [L(lang, '言語を確認', '언어 확인', 'Check the language'), L(lang, '言語対応は来店前に店舗へ確認。', '언어 응대는 방문 전에 매장에 확인하세요.', 'Confirm language support with the venue before visiting.')],
              [L(lang, 'ルールを守る', '규칙 준수', 'Follow the rules'), L(lang, '20歳未満の飲酒禁止。写真撮影は店舗の許可が必要です。', '만 20세 미만 음주 금지. 촬영은 점포 허가가 필요합니다.', 'No drinking under 20. Photography requires the venue\u2019s permission.')],
              [L(lang, '困ったら相談', '문제 시 상담', 'Ask for help'), L(lang, '不明な料金は支払前に店舗へ確認。', '불분명한 요금은 결제 전에 매장에 확인하세요.', 'Ask the venue to explain unclear charges before paying.')],
            ].map(([a, b]) => `<div class="step"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}
          </div>
        </div>
      </div>

      <div class="side-stack">
        ${sideAd(lang)}
        <div class="card">
          <h4>${ICONS.map}${esc(L(lang, '主要エリア', '주요 지역', 'Top areas'))}</h4>
          <div class="dlist">
            ${rows.slice(0, 14).map((r) => `<a href="/${lang}/area/${r.prefSlug}/${r.districtSlug}/">${esc(r.name)}</a>`).join('')}
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: headline,
      description: cat.lead[lang],
      url: `https://${SITE.host}${path}`,
      inLanguage: lang,
      isPartOf: { '@type': 'WebSite', name: 'BAM-NIGHT JAPAN', url: `https://${SITE.host}/` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: headline,
      numberOfItems: top.length,
      itemListElement: top.slice(0, 10).map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://${SITE.host}/${lang}/shop/${s.slug}/`,
        name: lang === 'ko' ? s.nameKo : lang === 'en' ? s.nameEn : s.nameJa,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t(lang, 'breadcrumbHome'), item: `https://${SITE.host}/${lang}/` },
        { '@type': 'ListItem', position: 2, name: cat[lang], item: `https://${SITE.host}${path}` },
      ],
    },
  ];

  return page({ lang, path, title: headline, desc: cat.lead[lang], body, jsonLd, noindex: LISTING_MODE === 'sample' });
}
