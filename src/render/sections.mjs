// ============================================================================
// INTERACTIVE SECTIONS — 料金シミュレーター & 無料相談フォーム
// 専用の料金ページのみで使用する。
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, ICONS } from '../render/layout.mjs';
import { CATEGORIES } from '../data/categories.mjs';
import { prefectureList } from '../data/geo.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

// クーポン割引率 → 円（概算: セット料金ベース）
const DISC_PCT = [0, 10, 20];

// ---------------------------------------------------------------------------
// PRICE CALCULATOR
// The client fetches /api/quote and paints #calcLines / #calcTotal.
// ---------------------------------------------------------------------------
export function calculator(lang, opts = {}) {
  const compact = opts.compact === true;
  return `
<div class="calc" id="calc" data-lang="${lang}">
  <div class="calc-head">
    <span class="calc-ic">${ICONS.calc || ICONS.coin || ICONS.yen}</span>
    <div>
      <h3>${esc(L(lang, '料金シミュレーター', '요금 시뮬레이터', 'Price simulator'))}</h3>
      <p>${esc(L(lang,
        '条件を選ぶと、税金・サービス料まで含めた総額がその場で出ます。',
        '조건을 고르면 세금·서비스료까지 포함한 총액이 즉시 나옵니다.',
        'Pick your conditions to see the tax- and service-inclusive total immediately.'))}</p>
    </div>
  </div>

  <div class="calc-workspace"><div class="calc-inputs"><div class="calc-grid">
    <div class="calc-field"><label for="cCat">${esc(t(lang, 'category'))}</label>
    <select id="cCat" name="cat">
      ${CATEGORIES.map((c) => `<option value="${c.slug}"${c.slug === 'snack' ? ' selected' : ''}>${esc(c[lang])}</option>`).join('')}
    </select></div>

    <div class="calc-field"><label for="cPlan">${esc(L(lang, 'コース', '코스', 'Course'))}</label>
    <select id="cPlan" name="plan">
      <option value="set60" selected>60${esc(L(lang, '分', '분', ' min'))}</option>
      <option value="set90">90${esc(L(lang, '分', '분', ' min'))}</option>
      <option value="set120">120${esc(L(lang, '分', '분', ' min'))}</option>
    </select></div>

    <div class="calc-field"><label for="cPeople">${esc(t(lang, 'calcPeople'))}</label>
    <select id="cPeople" name="people">
      ${[1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">${n}${esc(L(lang, '名', '명', ' people'))}</option>`).join('')}
    </select></div>

    <div class="calc-field"><label for="cExt">${esc(L(lang, '延長', '연장', 'Extension'))}</label>
    <select id="cExt" name="ext">
      <option value="0" selected>${esc(L(lang, 'なし', '없음', 'None'))}</option>
      <option value="1">30${esc(L(lang, '分', '분', ' min'))}</option>
      <option value="2">60${esc(L(lang, '分', '분', ' min'))}</option>
    </select></div>

    <div class="calc-field"><label for="cDrinks">${esc(L(lang, 'キャストドリンク（杯）', '캐스트 드링크(잔)', 'Cast drinks (glasses)'))}</label>
    <select id="cDrinks" name="drinks">
      ${[0, 1, 2, 3, 4, 5].map((n) => `<option value="${n}">${n}</option>`).join('')}
    </select></div>

    <div class="calc-field"><label for="cNom">${esc(L(lang, '指名', '지명', 'Nomination'))}</label>
    <select id="cNom" name="nomination">
      <option value="0" selected>${esc(L(lang, 'なし', '없음', 'None'))}</option>
      <option value="1">${esc(L(lang, '本指名', '본지명', 'Regular nomination'))}</option>

    </select></div>

    <div class="calc-field"><label for="cLate">${esc(t(lang, 'calcLate'))}</label>
    <select id="cLate" name="late">
      <option value="0" selected>${esc(L(lang, 'なし', '없음', 'None'))}</option>
      <option value="1">${esc(L(lang, 'あり（22時以降）', '있음(22시 이후)', 'Yes (after 22:00)'))}</option>
    </select></div>

    <div class="calc-field"><label for="cDisc">${esc(L(lang, 'クーポン割引', '쿠폰 할인', 'Coupon discount'))}</label>
    <select id="cDisc" name="discount" data-pct="1">
      <option value="0" selected>${esc(L(lang, 'なし', '없음', 'None'))}</option>
      <option value="10">10% OFF</option>
      <option value="20">20% OFF</option>
    </select></div>

    <div class="calc-field"><label for="cSvc">${esc(L(lang, 'サービス料10%', '서비스료 10%', '10% service charge'))}</label>
    <select id="cSvc" name="service">
      <option value="1" selected>${esc(L(lang, '含む', '포함', 'Included'))}</option>
      <option value="0">${esc(L(lang, '含まない', '미포함', 'Excluded'))}</option>
    </select></div>
  </div>

  <div class="calc-actions"><button type="button" id="calcReset">${esc(L(lang, "条件をリセット", "조건 초기화", "Reset conditions"))}</button><span>${esc(L(lang,"変更すると自動計算","변경 즉시 자동 계산","Updates automatically"))}</span></div></div><aside class="calc-result"><div class="calc-result-heading">${esc(L(lang,"YOUR ESTIMATE · 料金明細","YOUR ESTIMATE · 예상 요금","YOUR ESTIMATE · Breakdown"))}</div>
  <div class="calc-lines" id="calcLines" aria-live="polite">
    <div class="calc-empty">${esc(L(lang, '条件を選ぶと明細が表示されます', '조건을 선택하면 내역이 표시됩니다', 'Choose your conditions to see the breakdown'))}</div>
  </div>

  <div class="calc-total">
    <span>${esc(t(lang, 'calcTotalPP'))}</span>
    <b id="calcTotal">—</b>
  </div>
  <div class="calc-mini"><div><small>${esc(t(lang, "calcTotalAll"))}</small><b id="calcTotalAll">—</b></div><div><small>${esc(L(lang,"1時間あたり / 1名","1시간 기준 / 1인","Per hour / person"))}</small><b id="calcHourly">—</b></div></div></aside></div>
  <p class="calc-note">${esc(L(lang,
    '※ 表示額はモデル料金に基づく試算です。実際の料金は店舗により異なります。',
    '※ 표시 금액은 모델 요금에 따른 예상 금액입니다. 실제 요금은 점포마다 다릅니다.',
    'Estimates use model pricing, not verified venue quotations. Actual prices vary by venue.'))}</p>
  ${compact ? '' : `<p class="calc-note">${esc(L(lang,
    '※ サービス料・深夜料金・消費税は店舗ごとに設定が異なります。ご来店前に店舗へご確認ください。',
    '※ 서비스료·심야요금·소비세는 점포마다 설정이 다릅니다. 방문 전에 점포에 확인해 주세요.',
    'Service charge, late-night fee and consumption tax differ by venue. Please confirm with the venue before you visit.'))}</p>`}
</div>
`;
}

// ---------------------------------------------------------------------------
// LEAD FORM — 無料相談 / 掲載問い合わせ
// data-msg-* attributes feed CLIENT_JS status messaging.
// ---------------------------------------------------------------------------
export function leadForm(lang, opts = {}) {
  const kind = opts.kind || 'general';
  return `
<form class="form" id="inqForm" action="/api/inquiry" method="post"
  data-kind="${esc(kind)}"
  data-msg-invalid="${esc(L(lang, '必須項目を入力してください', '필수 항목을 입력해 주세요', 'Please fill in the required fields'))}"
  data-msg-sending="${esc(t(lang, 'formSending'))}"
  data-msg-ok="${esc(L(lang, '送信しました。担当者より2営業日以内にご連絡します。', '전송되었습니다. 담당자가 2영업일 이내에 연락드립니다.', 'Sent. Our team will contact you within two business days.'))}"
  data-msg-err="${esc(L(lang, '送信に失敗しました。時間をおいて再度お試しください。', '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'Sending failed. Please try again in a moment.'))}"
  data-msg-mail="${esc(L(lang, 'メールアプリが開きます。内容をご確認のうえ送信してください。', '메일 앱이 열립니다. 내용을 확인한 뒤 전송해 주세요.', 'Your mail app is opening — please check the details and press send.'))}"
  novalidate>

  <div class="form-grid">
    <div>
      <label for="iShop">${esc(L(lang, '店舗名', '점포명', 'Venue name'))}<span class="req">*</span></label>
      <input id="iShop" name="shop" type="text" data-required maxlength="80" autocomplete="organization"
        placeholder="${esc(L(lang, '例）スナック 月あかり', '예) 스낙크 츠키아카리', 'e.g. Snack Tsukiakari'))}">
      <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
    </div>
    <div>
      <label for="iName">${esc(L(lang, 'ご担当者名', '담당자명', 'Your name'))}<span class="req">*</span></label>
      <input id="iName" name="name" type="text" data-required maxlength="60" autocomplete="name"
        placeholder="${esc(L(lang, '例）山田 太郎', '예) 야마다 타로', 'e.g. Taro Yamada'))}">
      <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
    </div>
    <div>
      <label for="iEmail">${esc(t(lang, 'formEmail'))}<span class="req">*</span></label>
      <input id="iEmail" name="email" type="email" data-required maxlength="120" autocomplete="email"
        placeholder="owner@example.jp">
      <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
    </div>
    <div>
      <label for="iArea">${esc(L(lang, 'エリア', '지역', 'Area'))}<span class="req">*</span></label>
      <select id="iArea" name="area" data-required>
        <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
        ${prefectureList.map((p) => `<option value="${p.slug}">${esc(p[lang])}</option>`).join('')}
      </select>
      <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
    </div>
    <div class="full">
      <label for="iPlan">${esc(L(lang, 'ご希望のプラン', '희망 플랜', 'Preferred plan'))}<span class="req">*</span></label>
      <select id="iPlan" name="plan" data-required>
        <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
        <option value="free">${esc(L(lang, '無料掲載（審査あり）', '무료 게재(심사 있음)', 'Free listing (reviewed)'))}</option>
        <option value="free">${esc(L(lang, '無料掲載 0円/月', '무료 게재 0엔/월', 'Free ¥0/mo'))}</option>
        <option value="standard">${esc(L(lang, 'スタンダード 9,800円/月', '스탠다드 9,800엔/월', 'Standard ¥9,800/mo'))}</option>
        <option value="premium">${esc(L(lang, 'プレミアム 29,800円/月', '프리미엄 29,800엔/월', 'Premium ¥29,800/mo'))}</option>
        <option value="areapr">${esc(L(lang, 'エリアPR 22,000円/月', '지역 PR 22,000엔/월', 'Area PR ¥22,000/mo'))}</option>
        <option value="other">${esc(L(lang, '相談したい', '상담하고 싶다', 'I would like advice'))}</option>
      </select>
      <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
    </div>
    <div class="full">
      <label for="iMsg">${esc(L(lang, 'ご相談内容', '상담 내용', 'How can we help?'))}</label>
      <textarea id="iMsg" name="message" maxlength="800" rows="4"
        placeholder="${esc(L(lang, '例）韓国語対応のキャストを増やしたい／掲載料金の内訳を知りたい', '예) 한국어 대응 캐스트를 늘리고 싶다 / 게재 요금 내역을 알고 싶다', 'e.g. I want more Korean-speaking cast / please explain the pricing breakdown'))}"></textarea>
    </div>
  </div>

  <label class="form-consent"><input type="checkbox" id="formConsent" name="consent">
    <span>${esc(L(lang,
      'プライバシーポリシーに同意のうえ送信します。',
      '개인정보 처리방침에 동의하고 전송합니다.',
      'I agree to the privacy policy before sending.'))}</span>
  </label>

  <button class="btn btn-gold btn-block" type="submit">${esc(L(lang, 'この内容で送信する', '이 내용으로 전송', 'Send this enquiry'))}</button>
  <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
  <p class="small muted" style="margin:12px 0 0">${esc(L(lang,
    '※ 入力内容は掲載審査・ご連絡の目的にのみ使用します。第三者に販売することはありません。',
    '※ 입력 내용은 게재 심사·연락 목적으로만 사용합니다. 제3자에게 판매하지 않습니다.',
    'We use your details only to review the listing and contact you. We never sell them to third parties.'))}</p>
</form>`;
}
