// ============================================================================
// BAM-NIGHT JAPAN — Trilingual dictionary (ja / ko / en)
// t(lang, key) with a safe fallback chain so a missing key never breaks a page.
// ============================================================================

export const LANGS = ['ja', 'ko', 'en'];
export const LANG_LABEL = { ja: '日本語', ko: '한국어', en: 'English' };
export const LANG_HTML = { ja: 'ja-JP', ko: 'ko-KR', en: 'en-US' };
export const DEFAULT_LANG = 'ja';

export const DICT = {
  // ---- brand -------------------------------------------------------------
  brand: { ja: 'BAM-NIGHT', ko: '밤나이트 BAM-NIGHT', en: 'BAM-NIGHT' },
  brandSub: { ja: 'ジャパン・ナイトガイド 2026', ko: '재팬 나이트 가이드 2026', en: 'JAPAN NIGHT GUIDE 2026' },
  brandLong: { ja: 'バムナイト｜全国の夜の店舗検索ポータル', ko: '밤나이트｜전국 나이트 점포 검색 포털', en: 'BAM-NIGHT | Nationwide Night Venue Directory' },
  tagline: { ja: 'スナック・ガールズバー・健全リラクゼーションを全国から探す', ko: '스낙크·걸즈바·마사지을 전국에서 찾다', en: 'Snack bars, girls bars & wholesome relaxation — nationwide' },

  // ---- legal / gate ------------------------------------------------------
  ageGateTitle: { ja: '18歳未満の方はご利用いただけません', ko: '만 18세 미만은 이용하실 수 없습니다', en: 'This site is for adults aged 18 and over' },
  ageGateBody: {
    ja: '当サイトはお酒を提供する飲食店情報を含みます。18歳未満の方、および20歳未満で飲酒を目的とする方はご利用いただけません。すべての掲載店舗は適法営業店舗で、性的サービスは一切ありません。',
    ko: '본 사이트는 주류를 제공하는 음식점 정보를 포함합니다. 만 18세 미만, 및 만 20세 미만으로 음주를 목적으로 하는 분은 이용하실 수 없습니다. 모든 게재 점포는 적법 영업점이며 성적 서비스는 전혀 없습니다.',
    en: 'This site contains information about licensed venues that serve alcohol. Persons under 18, and persons under 20 intending to drink alcohol, may not use this site. Every listed venue is legally licensed and offers no sexual services whatsoever.',
  },
  ageGateYes: { ja: '18歳以上です（同意して入る）', ko: '만 18세 이상입니다 (동의하고 입장)', en: 'I am 18 or older — enter' },
  ageGateNo: { ja: '18歳未満です', ko: '만 18세 미만입니다', en: 'I am under 18' },
  ageGateDenied: { ja: 'ご利用いただけません。閲覧ありがとうございました。', ko: '이용하실 수 없습니다. 방문해 주셔서 감사합니다.', en: 'You cannot use this site. Thank you for visiting.' },
  ageGateRemember: { ja: 'この端末では7日間表示しない', ko: '이 기기에서는 7일간 표시하지 않음', en: 'Do not show again for 7 days on this device' },
  age185: { ja: '18歳未満閲覧禁止', ko: '만 18세 미만 열람 금지', en: '18+' },
  age205: { ja: '20歳未満飲酒禁止', ko: '만 20세 미만 음주 금지', en: 'No drinking under 20' },
  legalNote: { ja: '出典・確認状況を明記', ko: '출처·확인 상태 명시', en: 'Sources & verification status' },
  noSexual: { ja: '性的サービス一切なし', ko: '성적 서비스 전혀 없음', en: 'No sexual services' },

  // ---- nav ---------------------------------------------------------------
  navHome: { ja: 'ホーム', ko: '홈', en: 'Home' },
  navArea: { ja: '地域から探す', ko: '지역에서 찾기', en: 'Browse by area' },
  navSnack: { ja: 'スナック', ko: '스낙크', en: 'Snack bars' },
  navGirlsbar: { ja: 'ガールズバー', ko: '걸즈바', en: 'Girls bars' },
  navMassage: { ja: '健全リラクゼーション', ko: '마사지', en: 'Relaxation' },
  navRanking: { ja: 'ランキング', ko: '랭킹', en: 'Rankings' },
  navPrice: { ja: '料金ガイド', ko: '요금 가이드', en: 'Price guide' },
  navGuide: { ja: 'はじめての方へ', ko: '처음 오신 분께', en: 'First-timer guide' },
  navAdvertise: { ja: '広告掲載', ko: '광고 게재', en: 'Advertise' },
  navSearch: { ja: '店舗検索', ko: '점포 검색', en: 'Store search' },
  closeHint: { ja: '右上の×で閉じます', ko: '오른쪽 위 ×로 닫습니다', en: 'Close with the × at top right' },
  menu: { ja: 'メニュー', ko: '메뉴', en: 'Menu' },
  close: { ja: '閉じる', ko: '닫기', en: 'Close' },

  // ---- common UI ---------------------------------------------------------
  search: { ja: '検索', ko: '검색', en: 'Search' },
  searchPlaceholder: { ja: '店名・エリア・駅名で検索', ko: '가게명·지역·역명으로 검색', en: 'Search by shop, area or station' },
  all: { ja: 'すべて', ko: '전체', en: 'All' },
  area: { ja: 'エリア', ko: '지역', en: 'Area' },
  prefecture: { ja: '都道府県', ko: '도도부현', en: 'Prefecture' },
  region: { ja: '地方', ko: '지방', en: 'Region' },
  category: { ja: '業種', ko: '업종', en: 'Category' },
  price: { ja: '料金', ko: '요금', en: 'Price' },
  openNow: { ja: '営業中', ko: '영업 중', en: 'Open now' },
  closedNow: { ja: '営業時間外', ko: '영업 시간 외', en: 'Closed now' },
  more: { ja: 'もっと見る', ko: '더 보기', en: 'Show more' },
  detail: { ja: '詳細を見る', ko: '상세 보기', en: 'View details' },
  viewAll: { ja: 'すべて見る', ko: '전체 보기', en: 'View all' },
  back: { ja: '戻る', ko: '뒤로', en: 'Back' },
  shops: { ja: '店舗', ko: '점포', en: 'venues' },
  shopsCount: { ja: '店舗掲載数', ko: '점포 게재 수', en: 'Listed venues' },
  reviews: { ja: '件の口コミ', ko: '건의 리뷰', en: 'reviews' },
  coupon: { ja: 'クーポン', ko: '쿠폰', en: 'Coupon' },
  coupons: { ja: 'クーポン', ko: '쿠폰', en: 'Coupons' },
  features: { ja: '特徴・設備', ko: '특징·설비', en: 'Features' },
  hours: { ja: '営業時間', ko: '영업 시간', en: 'Hours' },
  station: { ja: '最寄駅', ko: '가까운 역', en: 'Nearest station' },
  address: { ja: '所在地', ko: '주소', en: 'Address' },
  seats: { ja: '席数', ko: '좌석 수', en: 'Seats' },
  closedDay: { ja: '定休日', ko: '휴무일', en: 'Closed' },
  none: { ja: 'なし', ko: '없음', en: 'None' },
  phone: { ja: '電話', ko: '전화', en: 'Phone' },
  hiddenPhone: { ja: '番号は掲載店舗のプライバシー保護のため非公開です', ko: '번호는 게재 점포의 프라이버시 보호를 위해 비공개입니다', en: 'Number hidden to protect venue privacy' },
  points: { ja: 'pt', ko: 'pt', en: 'pt' },
  pointRank: { ja: 'デイリーポイントランキング', ko: '데일리 포인트 랭킹', en: 'Daily point ranking' },
  updated: { ja: '更新', ko: '업데이트', en: 'Updated' },
  dailyUpdate: { ja: '毎日9:00更新', ko: '매일 09:00 갱신', en: 'Updated daily at 09:00 JST' },
  sort: { ja: '並び替え', ko: '정렬', en: 'Sort' },
  sortPoints: { ja: 'ポイント順', ko: '포인트순', en: 'Points' },
  sortPriceLow: { ja: '料金が安い順', ko: '요금 낮은순', en: 'Price: low to high' },
  sortPriceHigh: { ja: '料金が高い順', ko: '요금 높은순', en: 'Price: high to low' },
  sortRating: { ja: '評価順', ko: '평점순', en: 'Rating' },
  filter: { ja: '絞り込み', ko: '필터', en: 'Filter' },
  reset: { ja: 'リセット', ko: '초기화', en: 'Reset' },
  results: { ja: '件', ko: '건', en: 'results' },
  noResults: { ja: '条件に合う店舗が見つかりませんでした。条件を変えてお試しください。', ko: '조건에 맞는 점포를 찾지 못했습니다. 조건을 변경해 보세요.', en: 'No venues matched. Try changing your filters.' },
  langSwitch: { ja: '言語', ko: '언어', en: 'Language' },
  ad: { ja: '広告', ko: '광고', en: 'AD' },
  pr: { ja: 'PR', ko: 'PR', en: 'PR' },
  sponsored: { ja: 'スポンサー', ko: '스폰서', en: 'Sponsored' },
  aiConcept: { ja: 'AIコンセプト画像', ko: 'AI 콘셉트 이미지', en: 'AI concept visual' },
  aiConceptShort: { ja: 'AI画像', ko: 'AI 이미지', en: 'AI image' },
  verified: { ja: '公開資料に基づく情報', ko: '공개자료 기반 정보', en: 'Public-source information' },
  newOpen: { ja: '新規掲載', ko: '신규 게재', en: 'New' },
  vip: { ja: 'VIP', ko: 'VIP', en: 'VIP' },

  // ---- sections ----------------------------------------------------------
  heroTitle: { ja: '日本の夜を、総額で選ぶ。', ko: '일본의 밤을, 총액으로 선택하다.', en: 'Choose Japan\u2019s nightlife by the all-in price.' },
  heroLead: {
    ja: '全国47都道府県・109エリアを網羅。スナック、ガールズバー、健全リラクゼーションを、税込総額と明朗会計で比較できる唯一のポータルです。',
    ko: '전국 47개 도도부현·109개 지역을 커버. 스낙크, 걸즈바, 마사지을 세금 포함 총액과 투명 정찰제로 비교할 수 있는 유일한 포털.',
    en: '47 prefectures, 109 districts. The only portal that compares snack bars, girls bars and wholesome relaxation studios by their full tax-inclusive price.',
  },
  heroBadge: { ja: '2026年11月 最新版', ko: '2026년 11월 최신판', en: 'November 2026 edition' },
  ctaSearch: { ja: '店舗を検索する', ko: '점포 검색하기', en: 'Search venues' },
  ctaPrice: { ja: '総額シミュレーター', ko: '총액 시뮬레이터', en: 'All-in calculator' },

  trustTransparent: { ja: '完全明朗会計', ko: '완전 투명 정찰제', en: 'Fully transparent pricing' },
  trustTransparentD: { ja: 'チャージ・指名料・深夜割増まで税込総額で事前表示', ko: '차지·지명료·심야 할증까지 세금 포함 총액으로 사전 표시', en: 'Cover, nomination and late-night surcharges shown up front, tax included' },
  trustLegal: { ja: '適法営業店のみ', ko: '적법 영업점만', en: 'Licensed venues only' },
  trustLegalD: { ja: '風営法許可・深夜酒類提供飲食店営業の確認済み店舗のみ掲載', ko: '풍영법 허가·심야주류제공음식점영업 확인 점포만 게재', en: 'Only venues with verified Entertainment Business Act / late-night liquor licences' },
  trustWholesome: { ja: '100%健全宣言', ko: '100% 건전 선언', en: '100% wholesome pledge' },
  trustWholesomeD: { ja: 'リラクゼーションは性的サービス一切なし。違反報告は24時間受付', ko: '릴랙세이션은 성적 서비스 전혀 없음. 위반 신고 24시간 접수', en: 'Relaxation listings offer zero sexual services. Violations reported 24/7' },
  trustMultilingual: { ja: '3言語対応', ko: '3개 언어 지원', en: '3 languages' },
  trustMultilingualD: { ja: '日本語・韓国語・英語のすべてのページに対応', ko: '일본어·한국어·영어 모든 페이지 지원', en: 'Every page is available in Japanese, Korean and English' },

  areaTitle: { ja: '地域から探す', ko: '지역에서 찾기', en: 'Browse by region' },
  areaLead: { ja: '全国8地方・47都道府県・109の繁華街をエリア別に。', ko: '전국 8지방·47도도부현·109개 번화가를 지역별로.', en: 'Eight regions, 47 prefectures and 109 entertainment districts.' },
  categoryTitle: { ja: '業種から探す', ko: '업종에서 찾기', en: 'Browse by category' },
  rankingTitle: { ja: 'デイリーポイントランキング', ko: '데일리 포인트 랭킹', en: 'Daily point ranking' },
  rankingLead: {
    ja: 'アクセス・お気に入り・口コミで貯まるポイントの本日ランキング。毎日9:00に更新されます。',
    ko: '접속·즐겨찾기·리뷰로 쌓이는 포인트의 오늘 랭킹. 매일 09:00에 갱신됩니다.',
    en: 'Today\u2019s ranking by accumulated access, favourite and review points. Updated daily at 09:00 JST.',
  },
  priceTitle: { ja: '料金ガイド・総額シミュレーター', ko: '요금 가이드·총액 시뮬레이터', en: 'Price guide & all-in calculator' },
  priceLead: {
    ja: 'セット料金・チャージ・指名料・深夜割増・消費税まで、来店前に総額がわかる唯一の計算機です。',
    ko: '세트 요금·차지·지명료·심야 할증·소비세까지 방문 전에 총액을 알 수 있는 유일한 계산기.',
    en: 'Set fee, cover charge, nomination, late-night surcharge and consumption tax — see your true total before you go.',
  },
  guideTitle: { ja: 'はじめての方へ｜日本の夜の店 完全ガイド', ko: '처음 오신 분께｜일본 나이트 가게 완전 가이드', en: 'First-timer guide | Japan nightlife, explained' },
  advertiseTitle: { ja: '広告掲載のご案内', ko: '광고 게재 안내', en: 'Advertise with us' },
  noticeTitle: { ja: 'お知らせ', ko: '공지사항', en: 'Notice' },

  // ---- price calculator --------------------------------------------------
  calcTitle: { ja: '総額シミュレーター', ko: '총액 시뮬레이터', en: 'All-in total calculator' },
  calcSub: { ja: '条件を選ぶと税込総額がその場でわかります', ko: '조건을 선택하면 세금 포함 총액이 바로 표시됩니다', en: 'Pick your options and see the tax-inclusive total instantly' },
  calcCat: { ja: '業種', ko: '업종', en: 'Category' },
  calcArea: { ja: 'エリア', ko: '지역', en: 'Area' },
  calcPlan: { ja: 'コース', ko: '코스', en: 'Course' },
  calcDrinks: { ja: 'キャストドリンク数', ko: '캐스트 드링크 수', en: 'Cast drinks' },
  calcExt: { ja: '延長回数（30分）', ko: '연장 횟수(30분)', en: 'Extensions (30 min)' },
  calcNomination: { ja: '指名する', ko: '지명하기', en: 'Nominate a cast' },
  calcService: { ja: 'サービス料を表示（10%）', ko: '서비스료 표시(10%)', en: 'Show 10% service charge' },
  calcLate: { ja: '22時以降（深夜割増10%）', ko: '22시 이후(심야 할증 10%)', en: 'After 22:00 (+10%)' },
  calcPeople: { ja: '人数', ko: '인원', en: 'People' },
  calcTotalPP: { ja: '1名あたり税込総額', ko: '1인당 세금 포함 총액', en: 'Total per person (tax incl.)' },
  calcTotalAll: { ja: '合計（税込）', ko: '합계(세금 포함)', en: 'Grand total (tax incl.)' },
  calcHourly: { ja: '時間単価（税込）', ko: '시간 단가(세금 포함)', en: 'Effective hourly rate' },
  calcBreakdown: { ja: '内訳', ko: '내역', en: 'Breakdown' },
  calcSubtotal: { ja: '小計（税別）', ko: '소계(세금 별도)', en: 'Subtotal (tax excl.)' },
  calcTax: { ja: '消費税 10%', ko: '소비세 10%', en: 'Consumption tax 10%' },
  calcDisclaimer: {
    ja: '※ 表示額は全国標準料金にエリア指数を掛けた目安です。実際の料金は各店舗の掲載情報をご確認ください。',
    ko: '※ 표시 금액은 전국 표준 요금에 지역 지수를 곱한 기준값입니다. 실제 요금은 각 점포의 게재 정보를 확인하세요.',
    en: 'Note: figures apply an area index to the national standard rate and are indicative only. Always confirm with the venue.',
  },
  calcAreaIndex: { ja: 'エリア料金指数', ko: '지역 요금 지수', en: 'Area price index' },

  // ---- shop card / detail ------------------------------------------------
  allInFrom: { ja: '税込総額（60分・1ドリンク）', ko: '세금 포함 총액(60분·1드링크)', en: 'All-in total (60 min, 1 drink)' },
  menuTitle: { ja: '料金表（税別）', ko: '요금표(세금 별도)', en: 'Price list (tax excl.)' },
  menuSet: { ja: 'セット料金', ko: '세트 요금', en: 'Set fee' },
  menuExt: { ja: '延長 30分', ko: '연장 30분', en: 'Extension 30 min' },
  menuCast: { ja: 'キャストドリンク', ko: '캐스트 드링크', en: 'Cast drink' },
  menuCharge: { ja: 'チャージ', ko: '차지', en: 'Cover charge' },
  menuNom: { ja: '指名料', ko: '지명료', en: 'Nomination' },
  menuBottle: { ja: 'ボトルキープ', ko: '보틀 키프', en: 'Bottle keep' },
  couponTitle: { ja: 'クーポン', ko: '쿠폰', en: 'Coupons' },
  couponNote: { ja: '来店時にこの画面をご提示ください', ko: '방문 시 이 화면을 제시해 주세요', en: 'Show this screen when you arrive' },
  mapTitle: { ja: '地図・アクセス', ko: '지도·오시는 길', en: 'Map & access' },
  mapNote: { ja: '地図はエリア単位の参考表示です', ko: '지도는 지역 단위 참고 표시입니다', en: 'Map shows the district for reference only' },
  conceptTitle: { ja: '店内イメージ（AIコンセプト）', ko: '매장 이미지(AI 콘셉트)', en: 'Interior image (AI concept)' },
  conceptNote: {ja:'参考用イメージです。実店舗の写真や再現ではありません。',ko:'참고용 이미지이며 실제 매장의 사진이나 재현이 아닙니다.',en:'Illustrative imagery,not a photograph or reconstruction of the venue.'},
  reviewsTitle: { ja: '口コミ', ko: '리뷰', en: 'Reviews' },
  relatedTitle: { ja: '同じエリアの店舗', ko: '같은 지역의 점포', en: 'More in this area' },
  reserveNote: { ja: '予約・空席確認は各店舗へ直接お問い合わせください', ko: '예약·좌석 확인은 각 점포로 직접 문의하세요', en: 'For reservations, contact the venue directly' },
  safetyTitle: { ja: '安心してご利用いただくために', ko: '안심하고 이용하시기 위해', en: 'Keeping your visit safe' },

  // ---- advertise ---------------------------------------------------------
  advLead: {
    ja: 'BAM-NIGHTは3言語で全国に届く夜の店舗メディアです。全国の夜の店舗オーナー様向けに、掲載プランからVIP枠・エリアPRまでご用意しています。',
    ko: 'BAM-NIGHT는 3개 언어로 전국에 닿는 나이트 점포 미디어입니다. 전국 나이트 점포 오너를 위해 게재 플랜부터 VIP 슬롯·지역 PR까지 준비했습니다.',
    en: 'BAM-NIGHT is a nightlife directory that reaches readers nationwide in three languages. Plans run from a basic listing to VIP hero slots and area PR.',
  },
  planTitle: { ja: '掲載プラン', ko: '게재 플랜', en: 'Listing plans' },
  planNote: { ja: 'すべて税別・初期費用0円・最低契約期間1か月', ko: '모두 세금 별도·초기비용 0엔·최소 계약 기간 1개월', en: 'All prices exclude tax. No setup fee. One-month minimum term.' },
  roiTitle: { ja: '広告効果シミュレーター', ko: '광고 효과 시뮬레이터', en: 'Ad ROI simulator' },
  roiLead: { ja: 'プランと来店単価を入力すると、想定CVとROIを試算できます。※試算値はローンチ前の予測モデルに基づくもので、成果を保証するものではありません。', ko: '플랜과 객단가를 입력하면 예상 CV와 ROI를 산출합니다. ※산출값은 론치 전 예측 모델에 근거한 것이며 성과를 보장하지 않습니다.', en: 'Enter a plan and average spend to model expected conversions and ROI. Figures use a pre-launch projection model and are not a guarantee of results.' },
  formTitle: { ja: '掲載・広告のお申し込み', ko: '게재·광고 신청', en: 'Listing & advertising enquiry' },
  formLead: {
    ja: '必要事項をご記入ください。担当者より2営業日以内にご連絡します。特定商取引法に基づく表記は下記リンクよりご確認ください。',
    ko: '필요 사항을 기입해 주세요. 담당자가 2영업일 이내에 연락드립니다. 특정상거래법에 따른 표기는 아래 링크에서 확인하세요.',
    en: 'Fill in the form and our team will reply within two business days. See our legally required disclosure for details.',
  },
  formShop: { ja: '店舗名・屋号', ko: '점포명·상호', en: 'Venue / business name' },
  formName: { ja: 'ご担当者名', ko: '담당자명', en: 'Contact name' },
  formEmail: { ja: 'メールアドレス', ko: '이메일 주소', en: 'Email address' },
  formPhone: { ja: '電話番号（任意）', ko: '전화번호(선택)', en: 'Phone (optional)' },
  formArea: { ja: '店舗エリア', ko: '점포 지역', en: 'Venue area' },
  formPlan: { ja: 'ご希望プラン', ko: '희망 플랜', en: 'Preferred plan' },
  formMessage: { ja: 'ご要望・ご質問', ko: '요청·질문', en: 'Requirements / questions' },
  formConsent: {
    ja: 'プライバシーポリシーに同意のうえ、適法営業店舗であることを確認します。',
    ko: '개인정보 처리방침에 동의하며, 적법 영업점임을 확인합니다.',
    en: 'I agree to the privacy policy and confirm that my venue is legally licensed.',
  },
  formSubmit: { ja: '送信する', ko: '보내기', en: 'Send enquiry' },
  formSending: { ja: '送信中…', ko: '전송 중…', en: 'Sending…' },
  formSuccess: { ja: '送信しました。担当者よりご連絡いたします。', ko: '전송되었습니다. 담당자가 연락드립니다.', en: 'Sent. Our team will be in touch shortly.' },
  formError: { ja: '送信に失敗しました。時間をおいて再度お試しください。', ko: '전송에 실패했습니다. 잠시 후 다시 시도해주세요.', en: 'Sending failed. Please try again in a moment.' },
  formRequired: { ja: '必須', ko: '필수', en: 'required' },
  formInvalid: { ja: '入力内容をご確認ください', ko: '입력 내용을 확인해 주세요', en: 'Please check the highlighted fields' },

  // ---- guide -------------------------------------------------------------
  guideIntro: {
    ja: '日本の夜の店は、初めての方には少し独特です。このガイドでは、料金の仕組み、マナー、ぼったくりの回避方法、韓国語・英語で安心して楽しむコツをまとめました。',
    ko: '일본의 나이트 가게는 처음 방문자에게 조금 독특합니다. 이 가이드에서는 요금 구조, 매너, 바가지 요금 회피법, 한국어·영어로 안심하고 즐기는 요령을 정리했습니다.',
    en: 'Japanese night venues have their own etiquette. This guide covers how pricing works, the house rules, how to avoid rip-offs, and how to enjoy yourself confidently in Korean or English.',
  },

  // ---- footer ------------------------------------------------------------
  footerAbout: {
    ja: 'BAM-NIGHTは、全国のスナック・ガールズバー・健全リラクゼーションを掲載する情報ポータルです。性的サービス・違法営業の掲載は一切行いません。',
    ko: 'BAM-NIGHT는 전국의 스낙크·걸즈바·마사지을 게재하는 정보 포털입니다. 성적 서비스·불법 영업 게재는 일절 하지 않습니다.',
    en: 'BAM-NIGHT JAPAN is a directory of snack bars, girls bars and wholesome relaxation studios nationwide. We never list sexual services or illegal businesses.',
  },
  footerLinks: { ja: 'サイト情報', ko: '사이트 정보', en: 'Site information' },
  footerLegal: { ja: '法務・コンプライアンス', ko: '법무·컴플라이언스', en: 'Legal & compliance' },
  footerBiz: { ja: '店舗オーナー様へ', ko: '점포 오너에게', en: 'For venue owners' },
  footerRegion: { ja: 'エリア一覧', ko: '지역 목록', en: 'All areas' },
  lkTerms: { ja: '利用規約', ko: '이용약관', en: 'Terms of service' },
  lkPrivacy: { ja: 'プライバシーポリシー', ko: '개인정보 처리방침', en: 'Privacy policy' },
  lkTokushoho: { ja: '特定商取引法に基づく表記', ko: '특정상거래법에 따른 표기', en: 'Commercial disclosure' },
  lkCompliance: { ja: '風営法・健全営業ガイドライン', ko: '풍영법·건전 영업 가이드라인', en: 'Entertainment Act & compliance' },
  lkAi: { ja: 'AI画像の取り扱い', ko: 'AI 이미지 취급', en: 'AI image policy' },
  lkAge: { ja: '年齢確認について', ko: '연령 확인에 대하여', en: 'Age verification' },
  lkReport: { ja: '違反店舗の通報', ko: '위반 점포 신고', en: 'Report a listing' },
  lkCompany: { ja: '運営会社', ko: '운영 회사', en: 'Company' },
  lkContact: { ja: 'お問い合わせ', ko: '문의', en: 'Contact' },
  lkMediaKit: { ja: '広告媒体資料', ko: '광고 미디어 자료', en: 'Media kit' },
  lkListing: { ja: '掲載のお申し込み', ko: '게재 신청', en: 'Get listed' },
  copyright: { ja: '© 2026 BAM-NIGHT JAPAN. All rights reserved.', ko: '© 2026 BAM-NIGHT JAPAN. All rights reserved.', en: '© 2026 BAM-NIGHT JAPAN. All rights reserved.' },
  operator: { ja: '運営：バムナイト株式会社（所在地は会社概要をご覧ください）', ko: '운영: 밤나이트 주식회사(소재지는 회사 개요 참조)', en: 'Operated by BAM-NIGHT Inc. — see Company profile for the registered address' },

  // ---- misc --------------------------------------------------------------
  breadcrumbHome: { ja: 'ホーム', ko: '홈', en: 'Home' },
  relatedLinks: { ja: '関連リンク', ko: '관련 링크', en: 'Related links' },
  popularAreas: { ja: '人気エリア', ko: '인기 지역', en: 'Popular areas' },
  popularCats: { ja: '人気の業種・料金', ko: '인기 업종·요금', en: 'Popular categories & prices' },
  seoTitleArea: { ja: '{area}の{cat}一覧｜料金・地図・口コミ', ko: '{area} {cat} 목록｜요금·지도·리뷰', en: '{cat} in {area} | prices, map & reviews' },
  free: { ja: '無料', ko: '무료', en: 'Free' },
  yen: { ja: '円', ko: '엔', en: 'JPY' },
  taxIncl: { ja: '税込', ko: '세금 포함', en: 'tax incl.' },
  taxExcl: { ja: '税別', ko: '세금 별도', en: 'tax excl.' },
  perHour: { ja: '/時', ko: '/시간', en: '/hr' },
  person: { ja: '名', ko: '명', en: 'people' },
  minuteUnit: { ja: '分', ko: '분', en: 'min' },
};

export function t(lang, key, vars) {
  const entry = DICT[key];
  let s = entry ? entry[lang] ?? entry.ja ?? key : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

// pick the right field from a trilingual data record: pick(lang, district, 'ja')
export function pick(lang, obj, field = 'name') {
  if (!obj) return '';
  const cap = field.charAt(0).toUpperCase() + field.slice(1);
  return obj[field + cap] ?? obj[field + cap.replace('En', 'En')] ?? obj[field + 'Ja'] ?? '';
}
