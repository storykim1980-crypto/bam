// ============================================================================
// BAM-NIGHT JAPAN — Category master + legal positioning (2026.11)
// Only three categories, all 100% legal & compliant in Japan.
// ============================================================================

export const CATEGORIES = [
  {
    slug: 'snack',
    key: 'snack',
    ja: 'スナック',
    ko: '스낙크',
    en: 'Snack Bar',
    icon: 'glass',
    color: '#e0a83c',
    // Base (national standard, price index 1.00) — 税別 / before 10% consumption tax
    base: {
      set60: 3500,        // セット料金 60min
      extend30: 1800,     // 延長 30min
      castDrink: 900,     // キャストドリンク
      charge: 1000,       // チャージ / お通し
      bottle: 8000,       // ボトルキープ (standard)
      nomihodai: 0,
    },
    plans: [
      { id: 'set60', ja: 'セット 60分', ko: '세트 60분', en: 'Set 60 min' },
      { id: 'set90', ja: 'セット 90分', ko: '세트 90분', en: 'Set 90 min' },
      { id: 'set120', ja: 'セット 120分', ko: '세트 120분', en: 'Set 120 min' },
    ],
    title: {
      ja: 'スナックを探す｜掲載エリアと公開資料',
      ko: '스낙크 찾기｜등록 지역과 공개 자료',
      en: 'Snack Bar Store Search | Find Japan\u2019s snack bars & mama-san venues by area',
    },
    lead: {
      ja: 'スナックをエリアと公開資料から探せます。チャージ・ボトル・時間条件は店ごとに異なり、総額と現行条件は来店前に確認してください。',
      ko: '지역과 공개 자료로 스낙크를 찾아보세요. 차지·보틀·시간 조건은 매장마다 다르며 총액과 현행 조건은 방문 전에 확인하세요.',
      en: 'Find snack bars by area and public information. Cover,bottle and time conditions vary;confirm the final total and current terms before visiting.',
    },
    legality: {
      ja: '掲載は許可・現在営業・安全の確認済みを意味しません。',
      ko: '게재가 허가·현재 영업·안전의 확인을 의미하지 않습니다.',
      en: 'Inclusion does not verify licensing,current operation or safety.',
    },
    priceLabel: { ja: 'セット料金（60分・税別）', ko: '세트 요금(60분·세금 별도)', en: 'Set fee (60 min, tax excl.)' },
    avgLabel: '¥3,500〜¥9,000',
  },
  {
    slug: 'girlsbar',
    key: 'girlsbar',
    ja: 'ガールズバー',
    ko: '걸즈바',
    en: 'Girls Bar',
    icon: 'heart',
    color: '#e2608c',
    base: {
      set60: 3000,
      extend30: 1500,
      castDrink: 800,
      charge: 500,
      bottle: 0,
      nomihodai: 3000,    // 60min all-you-can-drink included in set
    },
    plans: [
      { id: 'set60', ja: '飲み放題 60分', ko: '무제한 음주 60분', en: 'All-you-can-drink 60 min' },
      { id: 'set90', ja: '飲み放題 90分', ko: '무제한 음주 90분', en: 'All-you-can-drink 90 min' },
      { id: 'set120', ja: '飲み放題 120分', ko: '무제한 음주 120분', en: 'All-you-can-drink 120 min' },
    ],
    title: {
      ja: 'ガールズバーを探す｜地域から見つける次の一軒',
      ko: '걸즈바 찾기｜지역에서 발견하는 다음 목적지',
      en: 'Find girls bars | Discover your next stop by neighbourhood',
    },
    lead: {
      ja: '地域と公開資料からガールズバーを比較。接客方法、延長、税・サービス料、入店条件は来店前に店舗へ確認してください。',
      ko: '지역과 공개 자료로 걸즈바를 비교하세요. 접객 방식·연장·세금·서비스료·입장 조건은 방문 전에 확인하세요.',
      en: 'Compare girls bars by area and public material. Confirm service style,extensions,tax,service fees and admission before visiting.',
    },
    legality: {
      ja: '掲載は許可・現在営業・安全の確認済みを意味しません。',
      ko: '게재가 허가·현재 영업·안전의 확인을 의미하지 않습니다.',
      en: 'Inclusion does not verify licensing,current operation or safety.',
    },
    priceLabel: { ja: '60分飲み放題（税別）', ko: '60분 무제한(세금 별도)', en: '60 min all-you-can-drink (tax excl.)' },
    avgLabel: '¥3,000〜¥8,500',
  },
  {
    slug: 'massage',
    key: 'massage',
    ja: '健全リラクゼーション',
    ko: '마사지',
    en: 'Wholesome Relaxation',
    icon: 'leaf',
    color: '#5fa88b',
    base: {
      set60: 7500,
      extend30: 3200,
      castDrink: 0,
      charge: 0,
      bottle: 0,
      nomihodai: 0,
      nominate: 1500,
      visit: 2000,
    },
    plans: [
      { id: 'set60', ja: '60分コース', ko: '60분 코스', en: '60 min course' },
      { id: 'set90', ja: '90分コース', ko: '90분 코스', en: '90 min course' },
      { id: 'set120', ja: '120分コース', ko: '120분 코스', en: '120 min course' },
    ],
    title: {
      ja: '健全リラクゼーション｜掲載コースと条件',
      ko: '건전 릴랙세이션｜등록 코스와 이용 조건',
      en: 'Non-sexual relaxation | Listed courses and conditions',
    },
    lead: {
      ja: '非性的リラクゼーションのコースと条件を比較。医療効果や資格の確認済みを意味しません。内容・時間・予約条件は公式窓口で確認してください。',
      ko: '비성적 릴랙세이션의 코스와 조건을 비교하세요. 의료 효과나 자격을 확인했다는 뜻은 아닙니다. 내용·시간·예약 조건은 공식 채널에서 확인하세요.',
      en: 'Compare non-sexual relaxation courses and conditions. This does not verify medical effects or qualifications. Confirm services,duration and booking requirements through official channels.',
    },
    legality: {
      ja: '掲載は許可・現在営業・安全の確認済みを意味しません。',
      ko: '게재가 허가·현재 영업·안전의 확인을 의미하지 않습니다.',
      en: 'Inclusion does not verify licensing,current operation or safety.',
    },
    priceLabel: { ja: '60分コース（税別）', ko: '60분 코스(세금 별도)', en: '60 min course (tax excl.)' },
    avgLabel: '¥7,500〜¥16,000',
  },
];

export const catBySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

// Plan multipliers on the 60-minute base fee
export const PLAN_FACTOR = { set60: 1, set90: 1.45, set120: 1.9 };
export const PLAN_MINUTES = { set60: 60, set90: 90, set120: 120 };

export const FEATURES = [
  { id: 'english', ja: '英語OK', ko: '영어 가능', en: 'English OK' },
  { id: 'korean', ja: '韓国語OK', ko: '한국어 가능', en: 'Korean OK' },
  { id: 'chinese', ja: '中国語OK', ko: '중국어 가능', en: 'Chinese OK' },
  { id: 'nonomi', ja: '飲み放題', ko: '무제한 음주', en: 'All-you-can-drink' },
  { id: 'card', ja: 'カード可', ko: '카드 가능', en: 'Cards accepted' },
  { id: 'smoking', ja: '喫煙可', ko: '흡연 가능', en: 'Smoking allowed' },
  { id: 'nonsmoking', ja: '禁煙', ko: '금연', en: 'Non-smoking' },
  { id: 'private', ja: '個室あり', ko: '개별 룸', en: 'Private room' },
  { id: 'first', ja: '初見OK', ko: '첫 방문 OK', en: 'First-timers welcome' },
  { id: 'nocharge', ja: 'チャージ無料', ko: '차지 무료', en: 'No cover charge' },
  { id: 'couple', ja: '女性同伴OK', ko: '여성 동반 OK', en: 'Couples welcome' },
  { id: 'station', ja: '駅徒歩3分以内', ko: '역 도보 3분 이내', en: 'Within 3 min of station' },
];
export const featureById = new Map(FEATURES.map((f) => [f.id, f]));
