#!/usr/bin/env node
// ============================================================================
// BAM-NIGHT — 「無料で掲載して問題ない情報源」ホワイトリスト
// ----------------------------------------------------------------------------
// この1ファイルが“何を掲載してよいか”の唯一の基準です。
// ここに載っているソース以外から店舗情報を取り込むことは禁止します。
//
//   区分A: PUBLIC-DATA   … 行政のオープンデータ（CC BY / 政府標準利用規約）
//   区分B: ASSOCIATION   … 業界団体・組合が「掲載許諾つき」で提供するリスト
//   区分C: OWNER         … 店主本人の自己申告（/register）
//   区分D: REFERENCE     … 事実確認のみに使い、本文・写真は転載しない
//
// 除外（永久）: 競合ポータル（ホットペッパー/食べログ/Retty/エキテン 等）、
//              レビュー・写真の転載、公開データに無い項目の推測補完。
// ============================================================================

export const TIERS = {
  'public-data': {
    label: { ja: '行政オープンデータ', ko: '행정 공개 데이터', en: 'Government open data' },
    ok: true,
    legal: { ja: 'CC BY 4.0 / 政府標準利用規約 2.0', ko: 'CC BY 4.0 / 정부표준이용약관 2.0', en: 'CC BY 4.0 / Government Standard Terms 2.0' },
    duty: { ja: '出典・加工した旨の明記', ko: '출처·가공 사실 명기', en: 'Credit the source and note that it was adapted' },
  },
  association: {
    label: { ja: '業界団体（許諾を得たリスト）', ko: '업계단체(허락받은 리스트)', en: 'Trade body (licensed list)' },
    ok: true,
    legal: { ja: '団体との個別許諾契約', ko: '단체와의 개별 허락 계약', en: 'Individual agreement with the body' },
    duty: { ja: '許諾範囲・出典・更新頻度を契約書に明記', ko: '허락 범위·출처·갱신 주기를 계약서에 명기', en: 'Record scope, credit and refresh cadence in the agreement' },
  },
  owner: {
    label: { ja: '店主の自己申告', ko: '점주 자기신고', en: 'Owner-submitted' },
    ok: true,
    legal: { ja: '本人同意（/register の同意チェック）', ko: '본인 동의(/register 동의 체크)', en: "Owner's consent via /register" },
    duty: { ja: '同意ログの保存・削除依頼への対応', ko: '동의 기록 보관·삭제 요청 대응', en: 'Keep the consent record and honour deletion requests' },
  },
  reference: {
    label: { ja: '照合のみ（転載不可）', ko: '대조 전용(전재 불가)', en: 'Verification only (no copying)' },
    ok: true,
    copy: false,
    legal: { ja: '引用の範囲に留める', ko: '인용 범위에 한정', en: 'Stay within fair-quotation limits' },
    duty: { ja: '本文・写真・評価は転載しない', ko: '본문·사진·평가는 전재 금지', en: 'Never copy text, photos or ratings' },
  },
  forbidden: {
    label: { ja: '使用禁止', ko: '사용 금지', en: 'Not allowed' },
    ok: false,
    legal: { ja: '規約違反・不正競争防止法2条1項7号のリスク', ko: '약관 위반·부정경쟁방지법 2조1항7호 리스크', en: 'Terms violation / unfair-competition risk' },
    duty: { ja: '—', ko: '—', en: '—' },
  },
};

/** 掲載してよい情報源（このリストのみ） */
export const SOURCES = [
  // ---------------------------------------------------------------- スナック / ガールズバー / バー
  {
    id: 'tokyo-food-licence',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: '食品等営業許可・届け出一覧（自治体標準データセット）', ko: '식품 등 영업허가·신고 일람(자치단체 표준 데이터세트)', en: 'Food business licence register (municipal standard dataset)' },
    publisher: { ja: '東京都・各区（東京都オープンデータカタログ）', ko: '도쿄도·각 구(도쿄도 오픈데이터 카탈로그)', en: 'Tokyo Metropolitan Government / wards' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t131041d0000000124',
    licence: 'CC BY 4.0',
    gives: { ja: '店名・町丁目・業種の手がかり・許可番号', ko: '점명·정쵸메·업종 힌트·허가번호', en: 'Name, town, industry hint, licence no.' },
    missing: { ja: '電話・料金・営業時間・出勤情報', ko: '전화·요금·영업시간·출근 정보', en: 'Phone, prices, hours, shifts' },
    cli: 'node tools/fetch-opendata.mjs tokyo-shinjuku',
  },
  {
    id: 'tokyo-chuo-licence',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: '中央区 食品等営業許可・届出一覧', ko: '中央区 食品等営業許可・届出一覧', en: '中央区 食品等営業許可・届出一覧' },
    publisher: { ja: '中央区（東京都オープンデータカタログ）', ko: '中央区（東京都オープンデータカタログ）', en: '中央区（東京都オープンデータカタログ）' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t131024d0000000037',
    licence: 'CC BY 4.0',
    gives: { ja: '店名・町丁目・業種・許可番号', ko: '店名・町丁目・業種・許可番号', en: '店名・町丁目・業種・許可番号' },
    missing: { ja: '電話・料金・営業時間', ko: '電話・料金・営業時間', en: '電話・料金・営業時間' },
    cli: 'node tools/fetch-opendata.mjs tokyo-chuo',
  },
  {
    id: 'tokyo-nakano-licence',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: '中野区 食品等営業許可届出一覧', ko: '中野区 食品等営業許可届出一覧', en: '中野区 食品等営業許可届出一覧' },
    publisher: { ja: '中野区（東京都オープンデータカタログ）', ko: '中野区（東京都オープンデータカタログ）', en: '中野区（東京都オープンデータカタログ）' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t131148d0000000129',
    licence: 'CC BY 4.0',
    gives: { ja: '店名・町丁目・業種・許可番号・座標', ko: '店名・町丁目・業種・許可番号・座標', en: '店名・町丁目・業種・許可番号・座標' },
    missing: { ja: '料金・営業時間', ko: '料金・営業時間', en: '料金・営業時間' },
    cli: 'node tools/fetch-opendata.mjs tokyo-nakano',
  },
  {
    id: 'tokyo-taito-licence',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: '台東区 食品衛生営業施設一覧', ko: '台東区 食品衛生営業施設一覧', en: '台東区 食品衛生営業施設一覧' },
    publisher: { ja: '台東区（東京都オープンデータカタログ）', ko: '台東区（東京都オープンデータカタログ）', en: '台東区（東京都オープンデータカタログ）' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t131067d3100000006',
    licence: 'CC BY 4.0',
    gives: { ja: '店名・町丁目・業種・許可番号', ko: '店名・町丁目・業種・許可番号', en: '店名・町丁目・業種・許可番号' },
    missing: { ja: '電話・料金・営業時間', ko: '電話・料金・営業時間', en: '電話・料金・営業時間' },
    cli: 'node tools/fetch-opendata.mjs tokyo-taito',
  },
  {
    id: 'tokyo-higashimurayama-licence',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: '東村山市 食品等営業許可・届け出一覧', ko: '東村山市 食品等営業許可・届け出一覧', en: '東村山市 食品等営業許可・届け出一覧' },
    publisher: { ja: '東村山市（東京都オープンデータカタログ）', ko: '東村山市（東京都オープンデータカタログ）', en: '東村山市（東京都オープンデータカタログ）' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t132136d3100000018',
    licence: 'CC BY 4.0',
    gives: { ja: '店名・町丁目・業種・許可番号', ko: '店名・町丁目・業種・許可番号', en: '店名・町丁目・業種・許可番号' },
    missing: { ja: '電話・料金・営業時間', ko: '電話・料金・営業時間', en: '電話・料金・営業時間' },
    cli: 'node tools/fetch-opendata.mjs tokyo-higashimurayama',
  },
  {
    id: 'osm-nightlife',
    tier: 'public-data',
    category: ['snack', 'girlsbar'],
    title: { ja: 'OpenStreetMap（bar / pub / nightclub）', ko: 'OpenStreetMap(bar/pub/nightclub)', en: 'OpenStreetMap (bar / pub / nightclub)' },
    publisher: { ja: 'OpenStreetMap contributors', ko: 'OpenStreetMap contributors', en: 'OpenStreetMap contributors' },
    url: 'https://www.openstreetmap.org/',
    licence: 'ODbL 1.0',
    gives: { ja: '名称・座標・opening_hours・公式サイトURL', ko: '명칭·좌표·opening_hours·공식 사이트 URL', en: 'Name, coordinates, opening_hours, website' },
    missing: { ja: '料金・電話・キャスト', ko: '요금·전화·캐스트', en: 'Prices, phone, staff' },
    cli: 'node tools/fetch-opendata.mjs osm-kabukicho',
  },
  {
    id: 'tokyo-assoc-nightlife',
    tier: 'association',
    category: ['snack', 'girlsbar'],
    title: { ja: '東京都社交飲食業生活衛生同業組合（支部）加盟店リスト', ko: '도쿄도 사교음식업 생활위생동업조합(지부) 가맹점 리스트', en: 'Tokyo Nightlife Trade Association — member list' },
    publisher: { ja: '東京都社交飲食業生活衛生同業組合', ko: '도쿄도 사교음식업 생활위생동업조합', en: 'Tokyo Nightlife Trade Association' },
    url: 'https://www.tokyo-syakoh.or.jp/shibu.html',
    licence: '個別許諾（掲載許諾契約）',
    gives: { ja: '加盟店の店名・所在地・連絡先（許諾範囲内）', ko: '가맹점 점명·소재지·연락처(허락 범위 내)', en: 'Member names, addresses, contacts (within agreed scope)' },
    missing: { ja: '許諾外の項目', ko: '허락 범위 밖 항목', en: 'Anything outside the agreed scope' },
    note: { ja: 'サイトの一覧ページをコピーせず、必ず文書で許諾を得てから受け取る', ko: '사이트 목록 페이지를 복사하지 말고 반드시 문서로 허락을 받은 뒤 제공받는다', en: 'Do not copy their web pages — obtain a written licence first' },
  },
  // ---------------------------------------------------------------- 健全マッサージ / リラクゼーション
  {
    id: 'tokyo-sejutsu',
    tier: 'public-data',
    category: ['massage'],
    title: { ja: '施術所台帳（あん摩マッサージ指圧・はり・きゅう）', ko: '시술소 대장(마사지·지압·침·뜸)', en: 'Treatment office register (massage / acupuncture)' },
    publisher: { ja: '東京都・各区保健所', ko: '도쿄도·각 구 보건소', en: 'Tokyo Metropolitan Government / ward health centres' },
    url: 'https://www.city.bunkyo.lg.jp/documents/6059/sejutsusyo.csv',
    licence: 'CC BY 4.0',
    gives: { ja: '施術所名・所在地・電話番号・業務種別（あん摩/はり/きゅう）', ko: '시술소명·소재지·전화번호·업무 종별(마사지/침/뜸)', en: 'Office name, address, phone, treatment type' },
    missing: { ja: '料金・コース・営業時間', ko: '요금·코스·영업시간', en: 'Prices, courses, hours' },
    cli: 'node tools/fetch-opendata.mjs tokyo-sejutsu',
    note: { ja: '「あん摩マッサージ指圧師」の国家資格施術所のみ。性的サービスは制度上存在しません。文京区の本郷・小石川は「本郷・小石川」エリアとして収録しています。', ko: '"마사지마사지지압사" 국가자격 시술소만. 성적 서비스는 제도상 존재하지 않습니다.', en: 'Licensed practitioners only — sexual services do not exist in this category by law.' },
  },
  {
    id: 'tokyo-sejutsu-minato',
    tier: 'public-data',
    category: ['massage'],
    title: { ja: '港区の施術所情報', ko: '미나토구 시술소 정보', en: 'Minato ward treatment offices' },
    publisher: { ja: '港区', ko: '미나토구', en: 'Minato City' },
    url: 'https://catalog.data.metro.tokyo.lg.jp/dataset/t131032d0000000209',
    licence: 'CC BY 4.0',
    gives: { ja: '施術所名・所在地・業務種別', ko: '시술소명·소재지·업무 종별', en: 'Office name, address, treatment type' },
    missing: { ja: '料金・営業時間', ko: '요금·영업시간', en: 'Prices, hours' },
  },
  {
    id: 'assoc-seitai',
    tier: 'association',
    category: ['massage'],
    title: { ja: '柔道整復師会・鍼灸師会などの組合名簿（許諾ベース）', ko: '접골원·침구사 협회 등 단체 명부(허락 기반)', en: 'Judotherapy / acupuncture association rosters (licensed)' },
    publisher: { ja: '各都道府県の柔道整復師会・鍼灸マッサージ師会', ko: '각 도도부현 접골원·침구마사지사 협회', en: 'Prefectural judotherapy / acupuncture associations' },
    url: 'https://www.tokyo-seitai.or.jp/',
    licence: '個別許諾',
    gives: { ja: '会員院の名称・所在地（許諾範囲内）', ko: '회원원 명칭·소재지(허락 범위 내)', en: 'Member clinic names and addresses (as agreed)' },
    missing: { ja: '許諾外の項目', ko: '허락 범위 밖 항목', en: 'Outside agreed scope' },
  },
  // ---------------------------------------------------------------- 共通
  {
    id: 'owner-register',
    tier: 'owner',
    category: ['snack', 'girlsbar', 'massage'],
    title: { ja: '店主からの掲載申込（/register）', ko: '점주 게재 신청(/register)', en: 'Owner submission (/register)' },
    publisher: { ja: '本人', ko: '본인', en: 'The venue itself' },
    url: '/ja/register/',
    licence: '本人同意',
    gives: { ja: '料金・営業時間・電話・特徴（本人申告）', ko: '요금·영업시간·전화·특징(본인 신고)', en: 'Prices, hours, phone, features (owner-stated)' },
    missing: { ja: '第三者が検証しない限り「自己申告」表示', ko: '제3자 검증 전까지 "자기신고" 표시', en: 'Shown as self-declared until verified' },
  },
  {
    id: 'official-sns',
    tier: 'reference',
    category: ['snack', 'girlsbar', 'massage'],
    title: { ja: '店舗公式のX / Instagram 投稿', ko: '점포 공식 X·Instagram 게시물', en: "Venue's official X / Instagram posts" },
    publisher: { ja: '各店', ko: '각 점', en: 'Each venue' },
    url: 'https://x.com/',
    licence: '引用の範囲（転載不可）',
    gives: { ja: '営業時間・休業の有無の「確認」', ko: '영업시간·휴무 여부의 "확인"', en: 'Verification of hours / closures' },
    missing: { ja: '本文・写真の転載は不可', ko: '본문·사진 전재 불가', en: 'Text and photos may not be copied' },
  },
];

/** 永久に使用しない情報源（明示） */
export const FORBIDDEN = [
  { id: 'hotpepper', name: 'ホットペッパー / リクルート系', why: { ja: '規約で転載禁止・限定提供データ', ko: '약관상 전재 금지·한정제공 데이터', en: 'Terms forbid copying; protected database' } },
  { id: 'tabelog', name: '食べログ', why: { ja: '規約で転載禁止・評価の転載は信用毀損リスク', ko: '약관상 전재 금지·평가 전재는 신용훼손 리스크', en: 'Terms forbid copying; re-publishing ratings is defamation risk' } },
  { id: 'retty', name: 'Retty', why: { ja: '同上', ko: '동일', en: 'Same as above' } },
  { id: 'ekiten', name: 'エキテン', why: { ja: '同上（マッサージ領域を含む）', ko: '동일(마사지 영역 포함)', en: 'Same (also covers massage)' } },
  { id: 'snacknavi', name: 'snacknavi / caba2 等の加盟店ポータル', why: { ja: '提携交渉先であって転載元ではない', ko: '제휴 협상 대상이며 전재원이 아니다', en: 'A partnership target, not a copying source' } },
  { id: 'google-maps', name: 'Google マップ / 口コミ', why: { ja: '利用規約でスクレイピング禁止', ko: '이용약관상 스크래핑 금지', en: 'Terms prohibit scraping' } },
];

export const sourceById = (id) => SOURCES.find((s) => s.id === id);

/** 業種ごとに「無料・合法で使えるソース」を返す */
export const sourcesForCategory = (cat) => SOURCES.filter((s) => s.category.includes(cat));

/** そのソースが掲載に使えるか（forbidden は常に false） */
export const canPublishFrom = (id) => {
  const s = sourceById(id);
  return !!s && TIERS[s.tier].ok === true && TIERS[s.tier].copy !== false;
};

/** 出典義務の一覧（フッター/ライセンスページ用） */
export const attributionDuties = () =>
  SOURCES.filter((s) => s.tier === 'public-data' || s.tier === 'association')
    .map((s) => ({ id: s.id, licence: s.licence, duty: TIERS[s.tier].duty, url: s.url }));
