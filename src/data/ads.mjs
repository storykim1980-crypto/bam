// ============================================================================
// BAM-NIGHT JAPAN — Advertising products & monetisation model (2026.11 rate card)
// ============================================================================

export const PLANS = [
  {
    id: 'free',
    name: { ja: '無料掲載', ko: '무료 게재', en: 'Free Listing' },
    price: 0,
    period: { ja: '月額', ko: '월', en: '/mo' },
    best: false,
    features: {
      ja: ['店舗名・エリア・業種', '営業時間・最寄駅', '料金表（税込総額表示）', 'カテゴリ検索に表示', '初期費用・更新料なし'],
      ko: ['점포명·지역·업종', '영업시간·최근접 역', '요금표(세금 포함 총액)', '카테고리 검색 노출', '초기비용·갱신료 없음'],
      en: ['Name, area & category', 'Hours & nearest station', 'Price list (tax-inclusive totals)', 'Appears in category search', 'No setup or renewal fee'],
    },
    cta: { ja: '無料で掲載する', ko: '무료로 게재', en: 'List for free' },
  },
  {
    id: 'standard',
    name: { ja: 'スタンダード', ko: '스탠다드', en: 'Standard' },
    price: 9800,
    period: { ja: '月額', ko: '월', en: '/mo' },
    best: true,
    features: {
      ja: ['無料掲載の全機能', '詳細ページ（クーポン・写真5枚）', 'エリア検索の上位表示', '韓国語・英語ページに自動掲載', 'Google ビジネスプロフィール連携', '月次の表示回数レポート'],
      ko: ['무료 게재 전체 기능', '상세 페이지(쿠폰·사진 5장)', '지역 검색 상위 노출', '한국어·영어 페이지 자동 게재', 'Google 비즈니스 프로필 연동', '월간 노출수 리포트'],
      en: ['Everything in Free', 'Detail page with coupons & 5 photos', 'Boosted in area search', 'Auto-published on KO & EN editions', 'Google Business Profile sync', 'Monthly impressions report'],
    },
    cta: { ja: 'スタンダードで申し込む', ko: '스탠다드로 신청', en: 'Choose Standard' },
  },
  {
    id: 'premium',
    name: { ja: 'プレミアム', ko: '프리미엄', en: 'Premium' },
    price: 29800,
    period: { ja: '月額', ko: '월', en: '/mo' },
    best: false,
    features: {
      ja: ['スタンダードの全機能', 'エリアPR枠（エリアページ上部）', 'ポイントランキングのブースト', '写真15枚＋動画1本', 'クーポン無制限', '3言語の紹介記事 1本/月', 'メールサポート（翌営業日）'],
      ko: ['스탠다드 전체 기능', '지역 PR 슬롯(지역 페이지 상단)', '포인트 랭킹 부스트', '사진 15장 + 영상 1편', '무제한 쿠폰', '3개 언어 소개 기사 1건/월', '이메일 지원(익영업일)'],
      en: ['Everything in Standard', 'Area PR slot at top of district page', 'Point-ranking boost', '15 photos + 1 video', 'Unlimited coupons', '1 trilingual feature article per month', 'Email support (next business day)'],
    },
    cta: { ja: 'プレミアムで申し込む', ko: '프리미엄으로 신청', en: 'Choose Premium' },
  },
  {
    id: 'areapr',
    name: { ja: 'エリアPR（独占）', ko: '지역 PR(독점)', en: 'Area PR (exclusive)' },
    price: 22000,
    period: { ja: '月額', ko: '월', en: '/mo' },
    best: false,
    features: {
      ja: ['1エリアにつき1社のみ', 'エリアページ最上部に固定表示', '3言語で同時掲載', 'エリア検索の1位に固定', '掲載店舗の競合枠は非表示', '最低契約期間3ヶ月'],
      ko: ['1개 지역당 1개사 독점', '지역 페이지 최상단 고정', '3개 언어 동시 게재', '지역 검색 1위 고정', '해당 지역 경쟁사 슬롯 비노출', '최소 계약 3개월'],
      en: ['One advertiser per district', 'Pinned to the top of the district page', 'Published in all three languages', 'Fixed #1 in district search', 'Competitor slots hidden in that district', '3-month minimum term'],
    },
    cta: { ja: 'エリアPRを相談する', ko: '지역 PR 상담', en: 'Enquire about Area PR' },
  },
];

// Modelled monthly traffic used ONLY by the ROI simulator.
// NOTE: these are projections on an empty inventory (0 listed shops), not
// measured traffic. They MUST be replaced with real analytics before launch
// (景品表示法 / 優良誤認 risk if presented as achieved results).
export const TRAFFIC_IS_MODELLED = true;
export const MEDIA_KIT = {
  monthlyPv: 240_000,
  monthlyUu: 62_000,
  langSplit: { ja: 0.62, ko: 0.23, en: 0.15 },
  avgCtr: { free: 0.008, standard: 0.024, premium: 0.049, areapr: 0.082 },
  avgCvr: { free: 0.028, standard: 0.041, premium: 0.055, areapr: 0.068 },
  mobileShare: 0.83,
  rankings: ['新宿・歌舞伎町', '大阪・北新地', '福岡・中洲', '東京・池袋', '札幌・すすきの'],
};

export const roi = ({ plan = 'standard', avgSpend = 8000, months = 1 }) => {
  const p = PLANS.find((x) => x.id === plan) || PLANS[1];
  const impressions = Math.round(MEDIA_KIT.monthlyPv * (plan === 'areapr' ? 0.34 : plan === 'premium' ? 0.16 : plan === 'standard' ? 0.06 : 0.03) * months);
  const ctr = MEDIA_KIT.avgCtr[plan] ?? 0.02;
  const cvr = MEDIA_KIT.avgCvr[plan] ?? 0.03;
  const clicks = Math.round(impressions * ctr);
  const visits = Math.round(clicks * cvr);
  const revenue = visits * avgSpend;
  const cost = p.price * months;
  return {
    plan: p.id,
    impressions, clicks, visits, revenue, cost,
    roi: cost ? +((revenue - cost) / cost * 100).toFixed(1) : 0,
    roas: cost ? +(revenue / cost).toFixed(2) : 0,
    cpa: visits ? Math.round(cost / visits) : 0,
  };
};

export const AD_SLOTS = {
  heroVip: { id: 'hero-vip', label: { ja: 'トップPR枠', ko: '톱 PR 슬롯', en: 'Homepage PR slot' }, image: '/images/ad-vip-banner.jpg', plan: 'premium' },
  areaPr: { id: 'area-pr', label: { ja: 'エリアPR枠', ko: '지역 PR 슬롯', en: 'Area PR slot' }, plan: 'premium' },
  sidebar: { id: 'sidebar', label: { ja: 'サイドバー枠', ko: '사이드바 슬롯', en: 'Sidebar slot' }, plan: 'standard' },
};
