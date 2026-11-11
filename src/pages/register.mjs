// ============================================================================
// REGISTER — 店舗オーナー様向け 自己登録フォーム（無料）
// 実在店舗のみを受け付け、管理画面で承認後に公開されます。
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { crumbs, secHead, sideAd } from '../render/components.mjs';
import { CATEGORIES } from '../data/categories.mjs';
import { REGIONS, prefectureList } from '../data/geo.mjs';
import { FEATURES } from '../data/categories.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

export function registerPage(lang) {
  const path = `/${lang}/register/`;
  const title = L(lang,
    '無料掲載のお申し込み｜スナック・ガールズバー・健全リラクゼーションの店舗登録',
    '무료 게재 신청｜스낙크·걸즈바·마사지 점포 등록',
    'Free listing application | Register your snack bar, girls bar or relaxation studio');

  const steps = [
    [L(lang, '入力（3分）', '입력(3분)', 'Submit (3 min)'),
     L(lang, '店舗名・エリア・営業時間・料金を入力します。', '점포명·지역·영업시간·요금을 입력합니다.', 'Enter your venue name, area, hours and prices.')],
    [L(lang, '審査（2営業日）', '심사(2영업일)', 'Review (2 business days)'),
     L(lang, '風営法許可・深夜酒類提供の届出・100%健全であることを確認します。', '풍영법 허가·심야주류제공 신고·100% 건전 여부를 확인합니다.', 'We check the Entertainment Business Act licence, late-night liquor notification and the 100% wholesome condition.')],
    [L(lang, '公開', '공개', 'Published'),
     L(lang, '承認後、日本語・韓国語・英語の3言語ページが自動生成されます。', '승인 후 일본어·한국어·영어 3개 언어 페이지가 자동 생성됩니다.', 'On approval, Japanese, Korean and English pages are generated automatically.')],
  ];

  const body = `
<section class="ph"><div class="wrap wrap-wide">
  ${crumbs(lang, [{ label: t(lang, 'breadcrumbHome'), href: `/${lang}/` }, { label: t(lang, 'navAdvertise'), href: `/${lang}/advertise/` }, { label: L(lang, '無料掲載', '무료 게재', 'Free listing') }])}
  <h1>${esc(L(lang, '無料掲載のお申し込み', '무료 게재 신청', 'Apply for a free listing'))}</h1>
  <p>${esc(L(lang,
    '掲載は無料です。実在し、適法に営業している店舗のみ審査のうえ掲載します。虚偽の申請は掲載拒否・削除の対象となります。',
    '게재는 무료입니다. 실존하며 적법하게 영업하는 점포만 심사 후 게재합니다. 허위 신청은 게재 거절·삭제 대상입니다.',
    'Listing is free. Only real venues operating lawfully are approved. False applications are rejected and removed.'))}</p>
  <div class="ph-row">
    <span class="chip gold">${esc(L(lang, '初期費用0円・月額0円', '초기비용 0엔·월 0엔', 'No setup fee, no monthly fee'))}</span>
    <span class="chip mint">${esc(t(lang, 'legalNote'))}</span>
    <span class="chip">3 ${esc(t(lang, 'langSwitch'))}</span>
  </div>
</div></section>

<section class="sec" style="padding-top:26px"><div class="wrap wrap-wide">
  <div class="split">
    <div class="stack">
      <div class="steps">
        ${steps.map(([a, b]) => `<div class="step"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}
      </div>

      ${secHead(lang, 'FORM', esc(L(lang, '店舗情報の入力', '점포 정보 입력', 'Venue details')), '')}
      <form class="form" id="regForm" action="/api/register" method="post"
        data-msg-invalid="${esc(L(lang, '入力内容をご確認ください', '입력 내용을 확인해 주세요', 'Please check the highlighted fields'))}"
        data-msg-ok="${esc(L(lang, '送信しました。2営業日以内に審査結果をご連絡します。', '전송되었습니다. 2영업일 이내에 심사 결과를 연락드립니다.', 'Submitted. We will contact you with the review result within two business days.'))}"
        data-msg-err="${esc(L(lang, '送信に失敗しました。時間をおいて再度お試しください。', '전송에 실패했습니다. 잠시 후 다시 시도해주세요.', 'Sending failed. Please try again in a moment.'))}"
        data-msg-sending="${esc(t(lang, 'formSending'))}"
        data-msg-mail="${esc(L(lang, 'メールアプリが開きます。内容をご確認のうえ送信してください。', '메일 앱이 열립니다. 내용을 확인한 뒤 전송해 주세요.', 'Your mail app is opening — please check the details and press send.'))}"
        novalidate>
        <div class="form-grid">
          <div class="full">
            <label for="rName">${esc(L(lang, '店舗名（屋号）', '점포명(상호)', 'Venue name'))}<span class="req">*</span></label>
            <input id="rName" name="name" type="text" data-required maxlength="80" autocomplete="organization"
              placeholder="${esc(L(lang, '例）スナック 月あかり', '예) 스낙크 츠키아카리', 'e.g. Snack Bar Tsukiakari'))}">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rCat">${esc(t(lang, 'category'))}<span class="req">*</span></label>
            <select id="rCat" name="cat" data-required>
              <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
              ${CATEGORIES.map((c) => `<option value="${c.slug}">${esc(c[lang])}</option>`).join('')}
            </select>
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rPref">${esc(t(lang, 'prefecture'))}<span class="req">*</span></label>
            <select id="rPref" name="pref" data-required>
              <option value="">${esc(L(lang, '選択してください', '선택해 주세요', 'Please select'))}</option>
              ${prefectureList.map((p) => `<option value="${p.slug}">${esc(p[lang])}</option>`).join('')}
            </select>
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rArea">${esc(L(lang, '繁華街・エリア', '번화가·지역', 'District'))}<span class="req">*</span></label>
            <select id="rArea" name="district" data-required>
              <option value="">${esc(L(lang, '先に都道府県を選択', '먼저 도도부현을 선택', 'Select a prefecture first'))}</option>
            </select>
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div class="full">
            <label for="rAddr">${esc(L(lang, '所在地（番地まで）', '소재지(번지까지)', 'Street address'))}<span class="req">*</span></label>
            <input id="rAddr" name="address" type="text" data-required maxlength="140" autocomplete="street-address"
              placeholder="${esc(L(lang, '例）東京都新宿区歌舞伎町1-2-3 ○○ビル4F', '예) 도쿄도 신주쿠구 가부키초 1-2-3 ○○빌딩 4F', 'e.g. 1-2-3 Kabukicho, Shinjuku-ku, Tokyo, ○○ Bldg 4F'))}">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rTel">${esc(t(lang, 'phone'))}<span class="req">*</span></label>
            <input id="rTel" name="tel" type="tel" data-required maxlength="20" autocomplete="tel"
              placeholder="03-1234-5678">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rMail">${esc(t(lang, 'formEmail'))}<span class="req">*</span></label>
            <input id="rMail" name="email" type="email" data-required maxlength="120" autocomplete="email"
              placeholder="owner@example.jp">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rOpen">${esc(L(lang, '開店時間', '개점 시간', 'Opens'))}<span class="req">*</span></label>
            <input id="rOpen" name="open" type="time" data-required value="18:00">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rClose">${esc(L(lang, '閉店時間', '폐점 시간', 'Closes'))}<span class="req">*</span></label>
            <input id="rClose" name="close" type="time" data-required value="01:00">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rSet">${esc(L(lang, 'セット料金（税別・60分）', '세트 요금(세금 별도·60분)', 'Set fee (tax excl., 60 min)'))}<span class="req">*</span></label>
            <input id="rSet" name="setFee" type="number" data-required min="0" max="200000" step="100" inputmode="numeric" value="3500">
            <div class="err-msg">${esc(L(lang, '必須項目です', '필수 항목입니다', 'Required'))}</div>
          </div>
          <div>
            <label for="rCharge">${esc(t(lang, 'menuCharge'))}</label>
            <input id="rCharge" name="charge" type="number" min="0" max="100000" step="100" inputmode="numeric" value="0">
            <div class="err-msg"></div>
          </div>
          <div class="full">
            <label>${esc(t(lang, 'features'))}</label>
            <div class="fchips" style="gap:6px">
              ${FEATURES.map((f) => `<label style="display:inline-flex;align-items:center;gap:6px;background:#1a1f2e;border:1px solid #272e42;border-radius:999px;padding:7px 12px;font-size:.75rem;font-weight:700;color:var(--ink2);min-height:34px;cursor:pointer">
                <input type="checkbox" name="features" value="${f.id}" style="width:15px;height:15px;accent-color:var(--gold);margin:0">${esc(f[lang])}
              </label>`).join('')}
            </div>
          </div>
          <div class="full">
            <label for="rNote">${esc(L(lang, 'ご質問・補足（任意）', '질문·보충(선택)', 'Notes (optional)'))}</label>
            <textarea id="rNote" name="note" maxlength="600" placeholder="${esc(L(lang, '掲載にあたってのご要望など', '게재 관련 요청 사항 등', 'Anything we should know'))}"></textarea>
          </div>
        </div>

        <fieldset><legend>${esc(L(lang,'情報の出典・写真利用許諾','정보 출처·사진 사용 허락','Sources & photo permission'))}</legend>
        <div class="field"><label for="ownerSourceUrl">${esc(L(lang,'公式サイト・店舗SNS（任意）','공식 사이트·매장 SNS(선택)','Official website / venue SNS (optional)'))}</label><input id="ownerSourceUrl" name="sourceUrl" type="url" placeholder="https://"></div>
        <div class="field mt16"><label for="ownerPhotoUrl">${esc(L(lang,'提供写真のURL（任意）','제공할 사진 URL(선택)','Photo URL (optional)'))}</label><input id="ownerPhotoUrl" name="photoUrl" type="url" placeholder="https://"></div>
        <label class="form-consent mt16"><input type="checkbox" name="photoRightsConfirmed" id="photoRightsConfirmed"><span>${esc(L(lang,'写真の権利を有するか、権利者の許諾を得ており、このサイトでの掲載を許可します。写っている人物の許諾も確認しました。','사진 권리를 보유하거나 권리자의 허락을 받았으며 본 사이트 게재를 허락합니다. 등장인물의 동의도 확인했습니다.','I own or have permission for this photo, permit publication on this site, and have checked consent from identifiable people.'))}</span></label>
        <p class="small muted">${esc(L(lang,'写真は審査前に公開・自動取得しません。許諾の証拠と写真の説明を備考欄に記入してください。','사진은 심사 전에 공개하거나 자동으로 내려받지 않습니다. 허락 증빙과 사진 설명을 비고에 적어주세요.','Photos are not fetched or published before review. Add permission evidence and a caption in the notes.'))}</p></fieldset>
        <div class="notice mint" style="font-size:.8125rem">
          <b>${esc(L(lang, '掲載条件（すべて満たす必要があります）', '게재 조건(모두 충족해야 합니다)', 'Listing conditions (all required)'))}</b>
          <ul style="margin:8px 0 0;padding-left:18px">
            <li>${esc(L(lang, '風営法の許可、または深夜酒類提供飲食店営業の届出を有していること', '풍영법 허가 또는 심야주류제공음식점영업 신고를 보유할 것', 'Holds an Entertainment Business Act licence or late-night liquor service notification'))}</li>
            <li>${esc(L(lang, '性的サービスを一切提供していないこと', '성적 서비스를 전혀 제공하지 않을 것', 'Offers no sexual services whatsoever'))}</li>
            <li>${esc(L(lang, '税込総額を開示できること', '세금 포함 총액을 공개할 수 있을 것', 'Can disclose tax-inclusive totals'))}</li>
            <li>${esc(L(lang, '20歳未満への飲酒提供を行わないこと', '만 20세 미만 음주 제공을 하지 않을 것', 'Does not serve alcohol to anyone under 20'))}</li>
          </ul>
        </div>

        <div class="notice mint" style="font-size:.8125rem">
          ${esc(L(lang,
            '送信いただいた内容（店舗名・所在地・電話番号・メール）は、当サイトのサーバー内の審査待ちファイルにのみ保存します。第三者への提供、転売、外部の広告配信への利用は行いません。掲載前に担当者から確認のご連絡をします。',
            '보내주신 내용(점포명·소재지·전화번호·이메일)은 당 사이트 서버 내의 심사 대기 파일에만 보관합니다. 제3자 제공, 재판매, 외부 광고 게재 이용은 하지 않습니다. 게재 전 담당자가 확인 연락을 드립니다.',
            'What you send (venue name, address, phone, email) is stored only in the pending-review file on our own server. We do not sell it, share it with third parties, or use it for external ad targeting. We will contact you to confirm before publishing.'))}
        </div>
        <label class="form-consent"><input type="checkbox" id="formConsent" name="consent">
          <span>${esc(L(lang,
            '上記の掲載条件を満たすことを確認し、プライバシーポリシーに同意します。虚偽の申告は掲載拒否・削除の対象となることに同意します。',
            '위 게재 조건을 충족함을 확인하며 개인정보 처리방침에 동의합니다. 허위 신고는 게재 거절·삭제 대상이 됨에 동의합니다.',
            'I confirm the listing conditions above, agree to the privacy policy, and understand that false declarations lead to rejection or removal.'))}</span>
        </label>
        <button class="btn btn-gold btn-block" type="submit">${esc(L(lang, '無料で掲載を申し込む', '무료로 게재 신청', 'Apply for a free listing'))}</button>
        <div class="form-status" id="formStatus" role="status" aria-live="polite"></div>
        <p class="small muted" style="margin:12px 0 0">${esc(L(lang,
          '※ 掲載は審査制です。承認前に店舗情報が公開されることはありません。',
          '※ 게재는 심사제입니다. 승인 전에 점포 정보가 공개되지 않습니다.',
          'Listings are reviewed. Your details are never published before approval.'))}</p>
      </form>
    </div>

    <div class="side-stack">${sideAd(lang)}
      <div class="card">
        <h4>${ICONS.shield}${esc(L(lang, 'なぜ無料なのか', '왜 무료인가', 'Why free?'))}</h4>
        <p class="small muted" style="margin:0">${esc(L(lang,
          '掲載店舗数と検索流入を増やすことが、上位表示プランの価値を高めます。まずは無料で掲載いただき、アクセス実績が出てから有料プランをご検討ください。',
          '게재 점포 수와 검색 유입을 늘리는 것이 상위 노출 플랜의 가치를 높입니다. 먼저 무료로 게재하시고, 접속 실적이 나온 뒤 유료 플랜을 검토해 주세요.',
          'More listings and more search traffic raise the value of promoted placement. List for free first, then consider a paid plan once you have traffic data.'))}</p>
      </div>
      <div class="card">
        <h4>${ICONS.megaphone}${esc(L(lang, '有料プラン', '유료 플랜', 'Paid plans'))}</h4>
        <p class="small muted" style="margin:0 0 10px">${esc(L(lang, '上位表示・バナー・3言語同時露出は月額9,800円から。', '상위 노출·배너·3개 언어 동시 노출은 월 9,800엔부터.', 'Promoted placement, banners and simultaneous 3-language exposure from ¥9,800/mo.'))}</p>
        <a class="btn btn-ghost btn-block" href="/${lang}/advertise/">${esc(t(lang, 'navAdvertise'))}</a>
      </div>
    </div>
  </div>
</div></section>

<script>
(function(){
  var P=document.getElementById('rPref'), D=document.getElementById('rArea');
  if(!P||!D) return;
  var data=${JSON.stringify(Object.fromEntries(prefectureList.map((p) => {
    const pref = REGIONS.find((r) => r.slug === p.regionSlug).prefectures.find((x) => x.slug === p.slug);
    return [p.slug, pref.districts.map((d) => ({ s: d.slug, n: d[lang], station: d.station }))];
  })))};
  function fill(){
    var list=data[P.value]||[];
    var html='<option value="">'+${JSON.stringify(L(lang, '選択してください', '선택해 주세요', 'Please select'))}+'</option>';
    list.forEach(function(d){
      html+='<option value="'+d.s+'">'+d.n.replace(/[<>&]/g,'')+'</option>';
    });
    D.innerHTML=html;
  }
  P.addEventListener('change',fill); fill();
})();
</script>`;

  return page({
    lang, path, title,
    desc: L(lang,
      'スナック・ガールズバー・健全リラクゼーションの無料掲載申込フォーム。審査制、3言語ページ自動生成。',
      '스낙크·걸즈바·마사지 무료 게재 신청 양식. 심사제, 3개 언어 페이지 자동 생성.',
      'Free listing form for snack bars, girls bars and wholesome relaxation studios. Reviewed, with automatic trilingual pages.'),
    body,
  });
}
