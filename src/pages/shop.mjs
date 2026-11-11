import {sourceReviewPanel} from '../render/source-review.mjs';
import { researchedSnackPage } from './snack-detail.mjs';
// ============================================================================
// SHOP DETAIL — full venue page with transparent menu, AI-concept disclosure,
// coupons, reviews, map, and sponsored slots.
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS } from '../render/layout.mjs';
import { crumbs, shopCard, catName, shopName, distName, sideAd, aiBadge } from '../render/components.mjs';
import { catBySlug, featureById } from '../data/categories.mjs';
import { shopsByDistrict, shopsByPref } from '../data/shops.mjs';
import { LISTING_MODE } from '../data/registry.mjs';
import { areaMedian, yen, quote, NOMINATION } from '../data/pricing.mjs';
import { districtList, prefBySlug } from '../data/geo.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

const CLOSED_LABEL = {
  none: { ja: '年中無休', ko: '연중무휴', en: 'Open every day' },
  sun: { ja: '日曜', ko: '일요일', en: 'Sunday' },
  wed: { ja: '水曜', ko: '수요일', en: 'Wednesday' },
};

export function shopPage(lang, s) {
  if(s.researchProfile)return researchedSnackPage(lang,s);
  const cat = catBySlug.get(s.cat);
  const pref = prefBySlug.get(s.prefSlug);
  const district = districtList.find((d) => d.slug === s.districtSlug);
  const path = `/${lang}/shop/${s.slug}/`;
  const name = shopName(lang, s);
  const title = L(lang,
    `${s.nameJa}（${s.districtJa}）｜料金・口コミ・アクセス｜BAM-NIGHT`,
    `${s.nameKo} (${s.districtKo})｜요금·리뷰·오시는 길｜BAM-NIGHT`,
    `${s.nameEn} (${s.districtEn}) | prices, reviews & access | BAM-NIGHT`);

  const base = cat.base;
  const p = s.priceIndex;
  const r100 = (n) => Math.round(n / 100) * 100;
  // 실점포는 등록된 실제 요금만, 샘플은 기존 모델 요금을 쓴다 (섞지 않는다)
  const rows = s.realData ? (s.priceLines || []).map((l) => [l[lang] || l.ja, l.amount]) : [
    [t(lang, 'menuSet'), refline(base.set60, p)],
    [t(lang, 'menuExt'), refline(base.extend30, p)],
    [t(lang, 'menuCast'), refline(base.castDrink, p)],
    [t(lang, 'menuCharge'), refline(base.charge, p)],
    [t(lang, 'menuNom'), refline(NOMINATION[s.cat] || 1000, p)],
    [t(lang, 'menuBottle'), refline(base.bottle, p)],
  ].filter(([, v]) => v > 0);

  const allIn = s.avgAllIn60;
  const sameArea = (shopsByDistrict.get(s.districtSlug) || []).filter((x) => x.slug !== s.slug).slice(0, 4);
  const others = (shopsByPref.get(s.prefSlug) || []).filter((x) => x.slug !== s.slug && x.cat === s.cat).slice(0, 8);

  const body = `${sourceReviewPanel(lang,s)}
<section class="ph" style="padding-bottom:22px"><div class="wrap wrap-wide">
  ${crumbs(lang, [
    { label: t(lang, 'breadcrumbHome'), href: `/${lang}/` },
    { label: pref[lang], href: `/${lang}/area/${pref.slug}/` },
    { label: district[lang], href: `/${lang}/area/${pref.slug}/${district.slug}/` },
    { label: name },
  ])}
  ${s.sample ? `<div class="notice amber" role="note" style="margin-top:14px;font-size:.8125rem">
    <b>${esc(L(lang, 'このページはサンプルです', '이 페이지는 샘플입니다', 'This page is a sample'))}</b>
    <span style="display:block;margin-top:4px">${esc(L(lang,
      'この店舗は実在しません。サイトの機能とデザインをご確認いただくために用意した架空の掲載例です。実在店舗の登録は無料です。',
      '이 점포는 실존하지 않습니다. 사이트 기능과 디자인을 확인하기 위한 가상 게재 예시입니다. 실점포 등록은 무료입니다.',
      'This venue does not exist. It is an invented example so you can review the site\u2019s features and design. Registering a real venue is free.'))}</span>
    <a class="btn btn-ghost" style="margin-top:10px" href="/${lang}/register/">${esc(L(lang, '実店舗を無料で登録', '실점포 무료 등록', 'Register a real venue'))}</a>
  </div>` : ''}
</div></section>

<section class="sec" style="padding-top:22px"><div class="wrap wrap-wide">
  <div class="det-hero${s.images.length ? '' : ' no-media'}">
    ${s.images.length ? `<div class="det-gal">
      ${s.images.slice(0, 3).map((im, i) => `<a href="${im}" data-lb="${im}" data-alt="${esc(name)}" aria-label="${esc(t(lang, 'viewAll'))}">
        <img src="${im}" alt="${esc(name)} — ${esc(t(lang, 'conceptTitle'))} ${i + 1}" width="800" height="550"${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}>
      </a>`).join('')}
    </div>` : ''}
    <div class="det-info">
      <div class="pill-row" style="margin-bottom:8px">
        ${s.badge === 'vip' ? `<span class="bdg bdg-vip">${esc(t(lang, 'vip'))}</span>` : ''}
        <span class="bdg bdg-cat" style="position:static">${esc(cat[lang])}</span>
        ${s.realData ? `<span class="bdg bdg-new" style="position:static">${esc(L(lang, '実店舗', '실점포', 'Listed venue'))}</span>` : aiBadge(lang)}
        ${s.verifiedLegal ? `<span class="chip mint">${s.realData
          ? esc(L(lang, '営業許可を確認', '영업허가 확인', 'Operating licence on file'))
          : esc(t(lang, 'verified'))}</span>` : ''}
      </div>
      <h1>${esc(name)}</h1>
      <div class="sub">${esc(distName(lang, s))}${s.distanceJa ? `・${esc(lang === 'ko' ? s.distanceKo : lang === 'en' ? s.distanceEn : s.distanceJa)}` : ''}
        ｜${esc(lang === 'ko' ? s.addressKo : lang === 'en' ? s.addressEn : s.addressJa)}</div>
      <div class="det-boxes">
        <div class="dbox"><small>${esc(t(lang, 'allInFrom'))}</small><b style="color:var(--gold2);font-size:17px">${s.realData && !s.priceKnown ? esc(L(lang, '未確認', '미확인', 'n/a')) : yen(allIn)}</b></div>
        <div class="dbox"><small>${esc(t(lang, 'rating'))}</small><b>${s.realData ? (s.reviewCount ? `★ ${s.rating.toFixed(1)} <span class="muted" style="font-size:11px">(${s.reviewCount})</span>` : `<span class="muted" style="font-size:13px">${esc(L(lang, '口コミ募集中', '리뷰 모집 중', 'No reviews yet'))}</span>`) : `★ ${s.rating.toFixed(1)} <span class="muted" style="font-size:11px">(${s.reviewCount})</span>`}</b></div>
        <div class="dbox"><small>${esc(s.realData ? L(lang, '情報確認日', '정보 확인일', 'Data checked') : t(lang, 'points'))}</small><b>${s.realData ? esc(s.verifiedAt || L(lang, '未確認', '미확인', 'n/a')) : `🐾 ${s.points.toLocaleString('en-US')}`}</b></div>
        <div class="dbox"><small>${esc(t(lang, 'hours'))}</small><b>${(s.hoursStart && s.hoursEnd) ? `${esc(s.hoursStart)} – ${esc(s.hoursEnd)}` : `<span class="muted" style="font-size:13px">${esc(L(lang, '未確認', '미확인', 'n/a'))}</span>`}</b></div>
      </div>
      <div class="pill-row" style="margin-bottom:14px">
        ${s.features.map((f) => {
          const fd = featureById.get(f);
          return fd ? `<span class="fchip${f === 'korean' ? ' on-ko' : f === 'english' ? ' on-en' : ''}">${esc(fd[lang])}</span>` : '';
        }).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn btn-gold" href="#menu">${ICONS.coins}${esc(t(lang, 'menuTitle'))}</a>
        ${s.coupon ? `<a class="btn btn-ghost" href="#coupon">${ICONS.ticket}${esc(t(lang, 'couponTitle'))}</a>` : ''}
        <a class="btn btn-line" href="/${lang}/price/">${ICONS.calc}${esc(t(lang, 'ctaPrice'))}</a>
      </div>
    </div>
  </div>

  <div class="split mt24">
    <div class="stack">
      <div class="card" id="menu">
        <h4>${ICONS.coins}${esc(t(lang, 'menuTitle'))} ${s.realData ? `<span class="chip" style="margin-left:auto">${esc(t(lang, 'taxExcl'))}</span>` : `<span class="chip gold" style="margin-left:auto">${esc(t(lang, 'calcAreaIndex'))} ×${p.toFixed(2)}</span>`}</h4>
        ${s.realData && !s.priceKnown ? `<div class="notice amber">
          <b>${esc(L(lang, '料金表は未登録です', '요금표 미등록', 'Price list not published'))}</b> —
          ${esc(L(lang, '公開データには料金情報が含まれていないため、推測値は表示しません。総額シミュレーターで概算をご確認ください。', '공개 데이터에는 요금 정보가 없기 때문에 추정값은 표시하지 않습니다. 총액 시뮬레이터로 개산을 확인해 주세요.', 'Public data does not include pricing, so we do not display estimates. Use the total-cost simulator for an estimate.'))}
        </div>` : `<div class="tbl-wrap"><table class="tbl" style="min-width:0">
          <tbody>${rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="num">${yen(v)}</td></tr>`).join('')}
          <tr><td><b>${esc(t(lang, 'allInFrom'))}</b><br><small class="muted">${esc(t(lang, 'taxIncl'))}</small></td>
            <td class="num" style="color:var(--gold2);font-size:16px"><b>${yen(allIn)}</b></td></tr>
          </tbody>
        </table></div>`}
        <div class="notice mint mt16"><b>${esc(t(lang, 'trustTransparent'))}</b> — ${esc(t(lang, 'trustTransparentD'))}</div>
        ${s.realData ? `<div class="srcbox mt16">
          <b>${esc(L(lang, 'この掲載の根拠（オープンデータ）', '이 게시의 근거(공개 데이터)', 'Where this listing comes from'))}</b>
          <p>${esc(s.licence || L(lang, '行政の公開データに基づく掲載', '행정 공개 데이터에 기반한 게시', 'Based on published public data'))}</p>
          ${s.catNote ? `<p class="warnline">${esc(L(lang, '※ ' + s.catNote, '※ ' + s.catNote, 'Note: ' + s.catNote))}</p>` : ''}
          <p class="mono">${esc(s.sourceUrl || s.origin || '')}</p>
          <p class="small muted">${esc(L(lang, `情報確認日: ${s.verifiedAt || '未確認'}／電話番号・料金・営業時間は未確認です。`, `정보 확인일: ${s.verifiedAt || '미확인'} / 전화번호·요금·영업시간은 미확인입니다.`, `Checked: ${s.verifiedAt || 'n/a'} — phone, pricing and hours are not confirmed.`))}</p>
        </div>` : ''}
        <a class="btn btn-ghost btn-block" href="/${lang}/price/?cat=${s.cat}&idx=${p.toFixed(2)}">${ICONS.calc}${esc(L(lang, 'この店舗の条件で総額を計算する', '이 점포 조건으로 총액 계산', 'Calculate the total for this venue'))}</a>
      </div>

      ${s.coupon ? `<div class="card" id="coupon">
        <h4>${ICONS.ticket}${esc(t(lang, 'couponTitle'))}</h4>
        <div class="sc-coupon" style="padding:14px;font-size:14px">${ICONS.ticket}<span><b>${esc(s.coupon[lang])}</b></span></div>
        <p class="small muted mt8">${esc(t(lang, 'couponNote'))}</p>
      </div>` : ''}

      ${s.images.length ? `<div class="card">
        <h4>${ICONS.leaf}${esc(s.realData ? L(lang, '店舗フォト', '점포 사진', 'Venue photos') : t(lang, 'conceptTitle'))}</h4>
        <p class="small muted" style="margin:0 0 12px">${esc(t(lang, 'conceptNote'))}</p>
        <div class="grid3">
          ${s.images.map((im, i) => `<a href="${im}" data-lb="${im}" data-alt="${esc(name)}" style="border-radius:11px;overflow:hidden;display:block">
            <img src="${im}" alt="${esc(name)} — ${esc(t(lang, 'conceptTitle'))} ${i + 1}" loading="lazy" width="400" height="260" style="aspect-ratio:3/2;object-fit:cover">
          </a>`).join('')}
        </div>
      </div>` : ''}

      <div class="card"><h4>${esc(L(lang,'情報確認について','정보 확인 안내','Verification status'))}</h4><p class="small">${esc(L(lang,'行政の公開記録から取り込んだ情報です。現在の営業・サービス内容・店舗の掲載同意を確認したものではありません。来店前に直接確認してください。','행정 공개기록에서 가져온 정보입니다. 현재 영업·서비스 내용·매장 게재 동의를 확인한 것은 아닙니다. 방문 전에 직접 확인하세요.','Imported from public administrative records. Current operation, services and owner consent have not been confirmed. Contact the venue before visiting.'))}</p></div>
      <div class="card" id="map">
        <h4>${ICONS.pin}${esc(t(lang, 'mapTitle'))}</h4>
        <div class="grid2">
          <div class="maplike"><div class="pin">${ICONS.pin}</div><span class="lbl">${esc(district[lang])}</span></div>
          <div>
            <div class="dbox" style="margin-bottom:8px"><small>${esc(t(lang, 'address'))}</small><b>${esc(lang === 'ko' ? s.addressKo : lang === 'en' ? s.addressEn : s.addressJa)}</b></div>
            <div class="dbox" style="margin-bottom:8px"><small>${esc(t(lang, 'station'))}</small><b>${esc(s.station)} · ${esc(lang === 'ko' ? s.distanceKo : lang === 'en' ? s.distanceEn : s.distanceJa)}</b></div>
            <div class="dbox"><small>${esc(t(lang, 'closedDay'))}</small><b>${esc(s.closed?(CLOSED_LABEL[s.closed]||{} )[lang]||s.closed:L(lang,'未確認','미확인','Not confirmed'))}</b></div>
          </div>
        </div>
        <p class="small muted mt8">${esc(t(lang, 'mapNote'))}</p>
      </div>

      <div class="ad-strip">
        <div><b><span class="ad-tag" style="margin-right:8px">${esc(t(lang, 'ad'))}</span>${esc(L(lang, 'この店舗の上位表示枠', '이 점포 상위 노출 슬롯', 'Promote this listing'))}</b>
          <small>${esc(L(lang, '同エリアのライバル店より上に表示されます。', '같은 지역 경쟁 점포보다 위에 표시됩니다.', 'Appear above competing venues in the same district.'))}</small></div>
        <a class="btn btn-ghost" href="/${lang}/advertise/#form">${esc(t(lang, 'navAdvertise'))}</a>
      </div>

      <div>
        ${`<h2 style="font-size:18px;margin:6px 0 12px">${esc(t(lang, 'relatedTitle'))}</h2>`}
        <div class="shops">${sameArea.slice(0, 4).map((x) => shopCard(lang, x)).join('')}</div>
      </div>
    </div>

    <div class="side-stack">
      ${sideAd(lang)}
      <div class="card">
        <h4>${ICONS.clock}${esc(t(lang, 'hours'))}</h4>
        <p class="small" style="margin:0 0 6px"><b>${esc(s.hoursStart)} – ${esc(s.hoursEnd)}</b></p>
        <p class="small muted" style="margin:0">${esc(s.realData && !s.closed ? L(lang, '定休日：未確認', '휴무일: 미확인', 'Closed: not confirmed') : L(lang, `定休日：${(CLOSED_LABEL[s.closed] || CLOSED_LABEL.none).ja}`, `휴무일: ${(CLOSED_LABEL[s.closed] || CLOSED_LABEL.none).ko}`, `Closed: ${(CLOSED_LABEL[s.closed] || CLOSED_LABEL.none).en}`))}</p>
      </div>
      <div class="card">
        <h4>${ICONS.pin}${esc(t(lang, 'station'))}</h4>
        <p class="small" style="margin:0 0 4px">${esc(s.station)}</p>
        <p class="small muted" style="margin:0">${esc(lang === 'ko' ? s.distanceKo : lang === 'en' ? s.distanceEn : s.distanceJa)}</p>
      </div>
      <div class="card">
        <h4>${ICONS.chart}${esc(L(lang, '同じ都道府県の店舗', '같은 도도부현 점포', 'More in this prefecture'))}</h4>
        <div class="dlist">${others.slice(0, 8).map((x) => `<a href="/${lang}/shop/${x.slug}/">${esc(shopName(lang, x))}</a>`).join('')}</div>
      </div>
    </div>
  </div>
</div></section>`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: lang === 'ja' ? s.nameJa : lang === 'ko' ? s.nameKo : s.nameEn,
      description: cat.legality[lang],
      ...(s.images.length ? { image: `https://bam-night.com${s.images[0]}` } : {}),
      address: { '@type': 'PostalAddress', addressCountry: 'JP', addressRegion: pref.en, addressLocality: district.en, streetAddress: s.addressEn },
      // 実店舗は「確認できた情報だけ」を構造化データに出す（推測値・架空の評価は出さない）
      ...(s.hoursStart && s.hoursEnd ? { openingHours: `${s.hoursStart}-${s.hoursEnd}` } : {}),
      ...(s.priceKnown ? { priceRange: `¥${Math.round(allIn / 1000) * 1000}` } : {}),
      ...(s.reviewCount ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: s.rating, reviewCount: s.reviewCount, bestRating: 5 } } : {}),
      url: `https://bam-night.com${path}`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t(lang, 'breadcrumbHome'), item: `https://bam-night.com/${lang}/` },
        { '@type': 'ListItem', position: 2, name: pref[lang], item: `https://bam-night.com/${lang}/area/${pref.slug}/` },
        { '@type': 'ListItem', position: 3, name: district[lang], item: `https://bam-night.com/${lang}/area/${pref.slug}/${district.slug}/` },
        { '@type': 'ListItem', position: 4, name },
      ],
    },
  ];

  // 説明文も実データでは「確認できた事実」だけにする（¥0表記・AI画像の注記は出さない）
  const desc = s.realData
    ? L(lang,
      `${s.nameJa}（${s.districtJa}）の掲載情報。行政の公開データに基づく実店舗。${s.priceKnown ? `税込総額${yen(allIn)}。` : '料金は未確認です。'}電話番号・営業時間は未確認の場合があります。`,
      `${s.nameKo}(${s.districtKo}) 게재 정보. 행정 공개 데이터 기반 실점포. ${s.priceKnown ? `세금 포함 총액 ${yen(allIn)}.` : '요금은 미확인입니다.'} 전화번호·영업시간은 미확인일 수 있습니다.`,
      `${s.nameEn} in ${s.districtEn}: listing based on published public data. ${s.priceKnown ? `Tax-inclusive total ${yen(allIn)}.` : 'Pricing not confirmed.'} Phone and hours may be unconfirmed.`)
    : L(lang, `${s.nameJa}（${s.districtJa}）の料金表・口コミ・アクセス。税込総額${yen(allIn)}。${cat.ja}の適法営業店。画像はAIコンセプトです。`, `${s.nameKo}(${s.districtKo})의 요금표·리뷰·오시는 길. 세금 포함 총액 ${yen(allIn)}. ${cat.ko} 적법 영업점. 이미지는 AI 콘셉트입니다.`, `${s.nameEn} in ${s.districtEn}: menu, reviews and access. Tax-inclusive total ${yen(allIn)}. Licensed ${cat.en}. Images are AI concept visuals.`);
  return page({ lang, path, title, desc, body, jsonLd, noindex: s.sample === true });
}

function refline(base, p) {
  return Math.round((base * p) / 100) * 100;
}
