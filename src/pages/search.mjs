// ============================================================================
// SEARCH — server-filtered results with client-side refinement
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { shopCard, crumbs, sideAd, secHead, sampleNotice } from '../render/components.mjs';
import { CATEGORIES, FEATURES, catBySlug } from '../data/categories.mjs';
import { REGIONS, prefectureList, districtList, prefBySlug } from '../data/geo.mjs';
import { SHOPS } from '../data/shops.mjs';
import { LISTING_MODE } from '../data/registry.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

// 1ページに描画するカード枚数。件数が増えても DOM 爆発しないよう上限を切る。
// 60 は「実店舗が埋もれる」原因だったので拡大し、実データが全件見えるようにした。
const GRID_CAP = 120;

export function filterShops(params) {
  const q = (params.get('q') || '').trim().toLowerCase();
  const cat = params.get('cat') || '';
  const pref = params.get('pref') || districtList.find(d=>d.slug===params.get('district'))?.prefSlug || '';
  const district = params.get('district') || '';
  const feat = params.get('feat') || '';
  const maxPrice = parseInt(params.get('max') || '0', 10) || 0;
  const sort = params.get('sort') || 'points';

  let list = SHOPS;
  if (cat) list = list.filter((s) => s.cat === cat);
  if (pref) list = list.filter((s) => s.prefSlug === pref);
  if (district) list = list.filter((s) => s.districtSlug === district);
  if (feat) list = list.filter((s) => s.features.includes(feat));
  if (maxPrice) list = list.filter((s) => s.priceKnown && s.avgAllIn60 <= maxPrice);
  if (q) {
    list = list.filter((s) => {
      const hay = `${s.nameJa} ${s.nameKo} ${s.nameEn} ${s.districtJa} ${s.districtKo} ${s.districtEn} ${s.prefJa} ${s.prefKo} ${s.prefEn} ${s.station} ${s.cat}`.toLowerCase();
      return hay.includes(q);
    });
  }
  const sorted = [...list].sort((a, b) => {
    if (sort === 'priceLow') return a.avgAllIn60 - b.avgAllIn60;
    if (sort === 'priceHigh') return b.avgAllIn60 - a.avgAllIn60;
    if (sort === 'name') return a.nameJa.localeCompare(b.nameJa,'ja');
    return 0;
  });
  return { list: sorted, q, cat, pref, district, feat, maxPrice, sort };
}

const distMapFor = (lang) => Object.fromEntries(prefectureList.map((p) => {
  const pref = REGIONS.find((r) => r.slug === p.regionSlug).prefectures.find((x) => x.slug === p.slug);
  return [p.slug, pref.districts.filter(d=>SHOPS.some(s=>s.districtSlug===d.slug)).map((d) => ({ s: d.slug, n: d[lang] }))];
}));

export function searchPage(lang, params) {
  const distMap = distMapFor(lang);
  const { list, q, cat, pref, district, feat, maxPrice, sort } = filterShops(params);
  const path = `/${lang}/search/`;
  const catDef = cat ? catBySlug.get(cat) : null;
  const prefDef = pref ? prefBySlug.get(pref) : null;
  const distDef = district ? districtList.find((d) => d.slug === district) : null;

  const headingBits = [distDef ? distDef[lang] : prefDef ? prefDef[lang] : '', catDef ? catDef[lang] : '', q ? `“${q}”` : ''].filter(Boolean);
  const title = headingBits.length
    ? L(lang, `${headingBits.join(' ')} の検索結果｜BAM-NIGHT`, `${headingBits.join(' ')} 검색 결과｜BAM-NIGHT`, `${headingBits.join(' ')} — search results | BAM-NIGHT`)
    : L(lang, '店舗検索｜全国のスナック・ガールズバー・健全リラクゼーション', '점포 검색｜전국 스낙크·걸즈바·마사지', 'Store search | snack bars, girls bars & wholesome relaxation nationwide');

  const districtOptions = prefDef
    ? (REGIONS.find((r) => r.slug === prefDef.regionSlug).prefectures.find((x) => x.slug === prefDef.slug).districts)
    : [];

  const body = `
<section class="ph"><div class="wrap wrap-wide">
  ${crumbs(lang, [{ label: t(lang, 'breadcrumbHome'), href: `/${lang}/` }, { label: t(lang, 'navSearch') },
    ...(prefDef ? [{ label: prefDef[lang], href: `/${lang}/area/${prefDef.slug}/` }] : []),
    ...(distDef ? [{ label: distDef[lang], href: `/${lang}/area/${prefDef.slug}/${distDef.slug}/` }] : [])])}
  <h1>${esc(title.replace('｜BAM-NIGHT', '').replace(' | BAM-NIGHT', ''))}</h1>
  <p>${esc(L(lang, '店名・業種・掲載エリアで検索。料金条件や出典は店舗ごとに確認できます。', '매장명·업종·등록 지역으로 검색하세요. 요금 조건과 출처는 매장별 상세에서 확인할 수 있습니다.', 'Search by venue name,category and listed neighbourhood. Check each venue for fee conditions and sources.'))}</p>
</div></section>

<section class="sec" style="padding-top:26px"><div class="wrap wrap-wide">
  <div class="split">
    <div>
      <form class="filters" action="/${lang}/search/" method="get" role="search" id="searchForm">
        <input type="search" name="q" id="fQuery" value="${esc(q)}" placeholder="${esc(t(lang, 'searchPlaceholder'))}" aria-label="${esc(t(lang, 'search'))}" style="flex:1 1 200px">
        <select name="cat" id="fCat" aria-label="${esc(t(lang, 'category'))}">
          <option value="">${esc(L(lang, 'すべての業種', '전체 업종', 'All categories'))}</option>
          ${CATEGORIES.map((c) => `<option value="${c.slug}"${c.slug === cat ? ' selected' : ''}>${esc(c[lang])}</option>`).join('')}
        </select>
        <select name="pref" id="fPref" aria-label="${esc(t(lang, 'prefecture'))}">
          <option value="">${esc(L(lang, 'すべての都道府県', '전체 도도부현', 'All prefectures'))}</option>
          ${prefectureList.filter(p=>SHOPS.some(s=>s.prefSlug===p.slug)).map((p) => `<option value="${p.slug}"${p.slug === pref ? ' selected' : ''}>${esc(p[lang])}</option>`).join('')}
        </select>
        <select name="district" id="fDist" aria-label="${esc(t(lang, 'area'))}">
          <option value="">${esc(L(lang, 'すべてのエリア', '전체 지역', 'All areas'))}</option>
          ${districtOptions.filter(d=>SHOPS.some(s=>s.districtSlug===d.slug)).map((d) => `<option value="${d.slug}"${d.slug === district ? ' selected' : ''}>${esc(d[lang])}</option>`).join('')}
        </select>
        <button class="btn btn-gold" type="submit">${ICONS.search}${esc(t(lang, 'search'))}</button>
        <a class="btn btn-line" href="/${lang}/search/">${esc(t(lang, 'reset'))}</a>

      </form>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap">
        <div class="cnt small muted"><b id="fCount" style="color:var(--gold2);font-size:16px">${list.length}</b> ${esc(t(lang, 'results'))}</div>
        <div class="pill-row">
          ${catDef ? `<span class="chip gold">${esc(catDef[lang])}</span>` : ''}
          ${prefDef ? `<span class="chip">${esc(prefDef[lang])}</span>` : ''}
          ${distDef ? `<span class="chip">${esc(distDef[lang])}</span>` : ''}
          ${feat ? `<span class="chip mint">${esc(FEATURES.find((f) => f.id === feat)?.[lang] || feat)}</span>` : ''}
        </div>
      </div>

${sampleNotice(lang)}
      <div class="shops" id="shopGrid">
        ${(() => {
          // 実店舗を先頭に、サンプルは後ろ。同じ60件の枠でも「実在する店」が必ず見える。
          const shown = [...(list.filter((s) => s.realData)), ...(list.filter((s) => !s.realData))].slice(0, GRID_CAP);
          return shown.map((s) => shopCard(lang, s)).join('');
        })()}
      </div>
      <div id="fEmpty" class="notice" style="display:${list.length ? 'none' : 'block'}">${esc(t(lang, 'noResults'))}
        <br><small class="muted">${esc(L(lang,
          'オープンデータ由来の実店舗は「韓国語対応」などの特徴タグが未登録のことがあります。条件を広げてお試しください。',
          '공개 데이터 기반 실점포는 "한국어 대응" 등 특징 태그가 미등록인 경우가 있습니다. 조건을 넓혀 보세요.',
          'Open-data listings may not yet carry feature tags such as language support. Try relaxing the filters.'))}</small></div>
      <div id="fMore" class="mt24"><button type="button" class="btn btn-line btn-block" id="fMoreBtn">${esc(L(lang,'さらに24件を見る','24개 더 보기','Show 24 more'))}</button></div>
      <script type="application/json" id="searchDataset">${JSON.stringify(SHOPS.map(s=>({html:shopCard(lang,s),cat:s.cat,pref:s.prefSlug,district:s.districtSlug,price:s.avgAllIn60,known:!s.realData||s.priceKnown,points:s.points,rating:s.rating,real:!!s.realData,feat:s.features,search:[s.nameJa,s.nameKo,s.nameEn,s.districtJa,s.districtKo,s.districtEn,s.prefJa,s.prefKo,s.prefEn,s.station,s.cat].join(' ').toLowerCase()}))).replaceAll('<',String.fromCharCode(92)+'u003c')}</script>
    </div>
    <div class="side-stack">
      ${sideAd(lang)}
      <div class="card">
        <h4>${ICONS.chart}${esc(L(lang,'カテゴリー','업종별 탐색','Categories'))}</h4>
        <div class="dlist">${CATEGORIES.map((c) => `<a href="/${lang}/${c.slug}/">${esc(c[lang])}</a>`).join('')}</div>
      </div>
      <div class="card">
        <h4>${ICONS.map}${esc(L(lang,'掲載エリア','등록 지역','Listed areas'))}</h4>
        <div class="dlist">${[...new Set(SHOPS.map(s=>s.districtSlug))].map((s) => {
          const d = districtList.find((x) => x.slug === s);
          return d ? `<a href="/${lang}/area/${d.prefSlug}/${d.slug}/">${esc(d[lang])}</a>` : '';
        }).join('')}</div>
      </div>
    </div>
  </div>
</div></section>

<script>
(function(){
  var P=document.getElementById('fPref'),D=document.getElementById('fDist');
  if(!P||!D) return;
  var data=${JSON.stringify(distMap)};
  var cur=${JSON.stringify(district)};
  function fill(){
    var list=data[P.value]||[];
    D.innerHTML='';
    var o=document.createElement('option'); o.value=''; o.textContent=${JSON.stringify(t(lang, 'all'))}+' — '+${JSON.stringify(t(lang, 'area'))}; D.appendChild(o);
    list.forEach(function(d){
      var e=document.createElement('option'); e.value=d.s; e.textContent=d.n;
      if(d.s===cur) e.selected=true;
      D.appendChild(e);
    });
  }
  P.addEventListener('change',function(){cur='';fill();});
  fill();
})();
</script>`;

  return page({ lang, path, title, desc: L(lang, '全国のスナック・ガールズバー・健全リラクゼーションを条件検索。料金は税込総額で比較できます。', '전국 스낙크·걸즈바·마사지를 조건 검색. 요금은 세금 포함 총액으로 비교.', 'Search snack bars, girls bars and wholesome relaxation studios nationwide — all compared by tax-inclusive price.'), body, noindex: LISTING_MODE === 'sample' });
}
