// ============================================================================
// ADVERTISE — media kit, rate card, ROI simulator, listing enquiry form
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { crumbs, secHead, planCards, sideAd } from '../render/components.mjs';
import { PLANS, MEDIA_KIT } from '../data/ads.mjs';
import { CATEGORIES } from '../data/categories.mjs';
import { REGIONS, prefectureList, GEO_STATS } from '../data/geo.mjs';
import { SHOP_COUNT } from '../data/shops.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

export function advertisePage(lang) {
  const path = `/${lang}/advertise/`;
  const title = L(lang,
    '広告掲載のご案内｜全国スナック・ガールズバー・リラクゼーション集客メディア BAM-NIGHT',
    '광고 게재 안내｜전국 스낙크·걸즈바·마사지 집객 미디어 BAM-NIGHT',
    'Advertise with BAM-NIGHT | Nationwide nightlife media kit & rate card');

  const body = `
<section class="ph"><div class="wrap wrap-wide">
  ${crumbs(lang, [{ label: t(lang, 'breadcrumbHome'), href: `/${lang}/` }, { label: t(lang, 'navAdvertise') }])}
  <h1>${esc(t(lang, 'advertiseTitle'))}</h1>
  <p>${esc(t(lang, 'advLead'))}</p>
  <div class="ph-row">
    <span class="chip gold">${esc(L(lang, '初期費用0円', '초기비용 0엔', 'No setup fee'))}</span>
    <span class="chip">${esc(L(lang, '無料掲載あり・月額9,800円〜', '무료 게재 가능·월 9,800엔~' , 'Free tier · from ¥9,800/mo'))}</span>
    <span class="chip mint">47${esc(L(lang, '都道府県', '도도부현', 'prefectures'))}</span>
    <span class="chip">3 ${esc(t(lang, 'langSwitch'))}</span>
  </div>
</div></section>

<section class="sec alt"><div class="wrap wrap-wide">
  ${secHead(lang, 'RATE CARD', esc(t(lang, 'planTitle')), esc(t(lang, 'planNote')))}
  ${planCards(lang, PLANS)}
  <div class="ad-strip mt24">
    <div><b>${esc(L(lang, '年間契約で2ヶ月分無料', '연간 계약 시 2개월 무료', 'Annual contracts: two months free'))}</b>
      <small>${esc(L(lang, '12ヶ月契約で10ヶ月分のお支払い。表示はすべて税別です。', '12개월 계약 시 10개월분 결제. 표시는 모두 세금 별도입니다.', 'Pay for 10 months on a 12-month term. All prices exclude tax.'))}</small></div>
    <a class="btn btn-gold" href="#form">${esc(t(lang, 'lkListing'))}</a>
  </div>
</div></section>

<section class="sec"><div class="wrap wrap-wide">
  ${secHead(lang, 'ROI', esc(t(lang, 'roiTitle')), esc(t(lang, 'roiLead')))}
  <div class="roi" id="roi">
    <div class="calc-form">
      <div class="calc-row">
        <div class="field">
          <label for="roiPlan">${esc(t(lang, 'formPlan'))}</label>
          <select id="roiPlan">
            ${PLANS.map((p) => `<option value="${p.id}"${p.best ? ' selected' : ''}>${esc(p.name[lang])} — ${esc(p.period[lang])} ¥${p.price.toLocaleString('en-US')}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="roiMonths">${esc(L(lang, '契約月数', '계약 개월', 'Contract months'))}</label>
          <select id="roiMonths">${[1, 3, 6, 12].map((m) => `<option value="${m}">${m}${esc(L(lang, 'ヶ月', '개월', ' mo'))}</option>`).join('')}</select>
        </div>
      </div>
      <div class="field" style="margin-bottom:14px">
        <label for="roiSpend">${esc(L(lang, '平均客単価（税込・1組あたり）', '평균 객단가(세금 포함·1팀당)', 'Average spend per party (tax incl.)'))}</label>
        <input type="number" id="roiSpend" value="8000" min="1000" max="100000" step="500" inputmode="numeric">
      </div>
      <p class="small muted" style="margin:0">${esc(L(lang, '※ 想定値であり成果を保証するものではありません。実際のCTR・CVRは掲載内容により変動します。', '※ 예상치이며 성과를 보장하지 않습니다. 실제 CTR·CVR은 게재 내용에 따라 달라집니다.', 'Estimates only — not a guarantee of results. Actual CTR and CVR vary with your listing.'))}</p>
    </div>
    <div class="calc-out">
      <div class="roi-out">
        <div class="roi-k"><small>${esc(L(lang, '想定インプレッション', '예상 노출', 'Est. impressions'))}</small><b id="roiImpr">—</b></div>
        <div class="roi-k"><small>${esc(L(lang, '想定クリック', '예상 클릭', 'Est. clicks'))}</small><b id="roiClicks">—</b></div>
        <div class="roi-k"><small>${esc(L(lang, '想定来店数', '예상 방문', 'Est. visits'))}</small><b id="roiVisits">—</b></div>
        <div class="roi-k"><small>${esc(L(lang, '想定売上', '예상 매출', 'Est. revenue'))}</small><b id="roiRev">—</b></div>
        <div class="roi-k"><small>${esc(L(lang, '広告費', '광고비', 'Ad cost'))}</small><b id="roiCost">—</b></div>
        <div class="roi-k good"><small>ROAS</small><b id="roiRoas">—</b></div>
        <div class="roi-bar">
          <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--ink2)"><b>${esc(L(lang, 'ROI', 'ROI', 'ROI'))}</b><b id="roiPct" style="color:var(--mint)">—</b></div>
          <div class="roi-track"><div class="roi-fill" id="roiFill" style="width:0%"></div></div>
        </div>
      </div>
      <a class="btn btn-gold btn-block mt16" href="#form">${esc(L(lang, 'このプランで相談する', '이 플랜으로 상담', 'Enquire about this plan'))}</a>
    </div>
  </div>
</div></section>

<section class="sec alt"><div class="wrap wrap-wide">
  ${secHead(lang, 'WHY US', esc(L(lang, '選ばれる理由', '선택받는 이유', 'Why venues choose us')), '')}
  <div class="steps">
    ${[
      [L(lang, '3言語×全国', '3개 언어×전국', '3 languages, nationwide'), L(lang, '日本語・韓国語・英語の全ページに同時掲載。訪日客と在日外国人に直接リーチします。', '일본어·한국어·영어 전 페이지에 동시 게재. 방일객과 재일 외국인에게 직접 도달.', 'Published simultaneously in Japanese, Korean and English — reaching inbound visitors and foreign residents directly.')],
      [L(lang, '適法店舗のみ', '적법 점포만', 'Licensed venues only'), L(lang, '風営法・深夜酒類提供の許可を確認できた店舗のみ掲載する基準です。無許可営業の掲載依頼はお断りします。', '풍영법·심야주류제공 허가를 확인할 수 있는 점포만 게재하는 기준입니다. 무허가 영업 게재 의뢰는 거절합니다.', 'Our listing standard admits only venues whose Entertainment Business Act and late-night liquor licences we can verify. We decline unlicensed operators.')],
      [L(lang, '明朗会計の標準化', '투명 정찰제 표준화', 'Transparent pricing standard'), L(lang, '税込総額表示が標準。料金トラブルが減り、リピート率が上がります。', '세금 포함 총액 표시가 표준. 요금 트러블이 줄고 재방문율이 올라갑니다.', 'Tax-inclusive totals are the default, which reduces billing disputes and lifts repeat visits.')],
      [L(lang, 'AIコンセプト画像', 'AI 콘셉트 이미지', 'AI concept imagery'), L(lang, '掲載画像はAI生成のコンセプト画像で、実在の人物・店舗ではありません。撮影費や出演モデル契約は不要です。', '게재 이미지는 AI 생성 콘셉트 이미지로 실존 인물·점포가 아닙니다. 촬영비나 모델 계약이 필요 없습니다.', 'Imagery is AI-generated concept art, not real people or venues — so there are no shoot costs or model releases to arrange.')],
    ].map(([a, b]) => `<div class="step"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}
  </div>
</div></section>

<section class="sec" id="form"><div class="wrap wrap-wide">
  <div class="split">
    <div>
      ${secHead(lang, 'CONTACT', esc(t(lang, 'formTitle')), esc(t(lang, 'formLead')))}
      <form class="form" id="inqForm"
        data-msg-invalid="${esc(t(lang, 'formInvalid'))}"
        data-msg-ok="${esc(t(lang, 'formSuccess'))}"
        data-msg-err="${esc(t(lang, 'formError'))}"
        data-msg-sending="${esc(t(lang, 'formSending'))}" novalidate>
        <div class="form-grid">
          <div class="full">
            <label for="shop">${esc(t(lang, 'formShop'))}<span class="req">*</span></label>
            <input id="shop" name="shop" type="text" data-required autocomplete="organization" placeholder="${esc(L(lang, '例）スナック 月あかり', '예) 스낙크 츠키아카리', 'e.g. Snack Bar Tsukiakari'))}">
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div>
            <label for="name">${esc(t(lang, 'formName'))}<span class="req">*</span></label>
            <input id="name" name="name" type="text" data-required autocomplete="name">
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div>
            <label for="email">${esc(t(lang, 'formEmail'))}<span class="req">*</span></label>
            <input id="email" name="email" type="email" data-required autocomplete="email" placeholder="you@example.jp">
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div>
            <label for="phone">${esc(t(lang, 'formPhone'))}</label>
            <input id="phone" name="phone" type="tel" autocomplete="tel" placeholder="03-0000-0000">
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div>
            <label for="area">${esc(t(lang, 'formArea'))}<span class="req">*</span></label>
            <select id="area" name="area" data-required>
              <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
              ${REGIONS.flatMap((r) => r.prefectures.flatMap((p) => p.districts.map((d) =>
                `<option value="${p.slug}/${d.slug}">${esc(p[lang])}・${esc(d[lang])}</option>`))).join('')}
            </select>
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div>
            <label for="plan">${esc(t(lang, 'formPlan'))}<span class="req">*</span></label>
            <select id="plan" name="plan" data-required>
              <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
              ${PLANS.map((p) => `<option value="${p.id}">${esc(p.name[lang])} — ¥${p.price.toLocaleString('en-US')}${esc(p.period[lang])}</option>`).join('')}
            </select>
            <div class="err-msg">${esc(t(lang, 'formInvalid'))}</div>
          </div>
          <div class="full">
            <label for="message">${esc(t(lang, 'formMessage'))}</label>
            <textarea id="message" name="message" placeholder="${esc(L(lang, 'ご質問やご要望をご記入ください（任意）', '질문·요청을 기입해 주세요(선택)', 'Questions or requirements (optional)'))}"></textarea>
          </div>
        </div>
        <label class="form-consent"><input type="checkbox" id="formConsent"><span>${esc(t(lang, 'formConsent'))}</span></label>
        <button class="btn btn-gold btn-block" type="submit">${esc(t(lang, 'formSubmit'))}</button>
        <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
        <p class="small muted" style="margin:14px 0 0">${esc(L(lang, '送信内容は掲載審査のみに使用し、第三者に提供しません。', '전송 내용은 게재 심사에만 사용하며 제3자에게 제공하지 않습니다.', 'Your enquiry is used only to review your listing and is never shared with third parties.'))}</p>
      </form>
    </div>
    <div class="side-stack">
      ${sideAd(lang)}
      <div class="card">
        <h4>${ICONS.shield}${esc(L(lang, '掲載基準', '게재 기준', 'Listing standards'))}</h4>
        <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;font-size:12px;color:var(--ink2)">
          <li>${ICONS.check} ${esc(L(lang, '風営法・深夜酒類提供の許可を保有', '풍영법·심야주류제공 허가 보유', 'Holds Entertainment Act / late-night liquor licence'))}</li>
          <li>${ICONS.check} ${esc(L(lang, '性的サービスを一切提供しない', '성적 서비스를 전혀 제공하지 않음', 'Offers no sexual services'))}</li>
          <li>${ICONS.check} ${esc(L(lang, '税込総額を開示できる', '세금 포함 총액 공개 가능', 'Can disclose tax-inclusive totals'))}</li>
          <li>${ICONS.check} ${esc(L(lang, '20歳未満の飲酒を防止する', '만 20세 미만 음주 방지', 'Prevents under-20 drinking'))}</li>
        </ul>
      </div>
      <div class="card">
        <h4>${ICONS.book}${esc(L(lang, '関連情報', '관련 정보', 'Related'))}</h4>
        <div class="dlist">
          <a href="/${lang}/legal/tokushoho/">${esc(t(lang, 'lkTokushoho'))}</a>
          <a href="/${lang}/legal/terms/">${esc(t(lang, 'lkTerms'))}</a>
          <a href="/${lang}/legal/privacy/">${esc(t(lang, 'lkPrivacy'))}</a>
          <a href="/${lang}/legal/compliance/">${esc(t(lang, 'lkCompliance'))}</a>
        </div>
      </div>
    </div>
  </div>
</div></section>`;

  return page({ lang, path, title, desc: L(lang, 'BAM-NIGHTへの広告掲載のご案内。3言語・全国47都道府県。無料掲載からエリアPR月額22,000円まで。ROIシミュレーター付き。', '밤나이트 광고 게재 안내. 3개 언어·전국 47개 도도부현. 무료 게재부터 지역 PR 월 22,000엔까지. ROI 시뮬레이터 제공.', 'Advertise on BAM-NIGHT: three languages, all 47 prefectures. Free listing up to Area PR at ¥22,000 per month, with an ROI simulator.'), body });
}
