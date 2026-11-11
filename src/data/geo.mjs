// ============================================================================
// BAM-NIGHT JAPAN — Nationwide geography master data (2026.11 edition)
// 8 regions / 47 prefectures / 150+ entertainment districts
// Every entity carries ja / ko / en labels for the three language editions.
// p = price index (1.00 = national standard), tier = demand tier (1 = flagship)
// ============================================================================

const D = (slug, ja, ko, en, station, tier = 2, p = 1) => ({ slug, ja, ko, en, station, tier, p });
const P = (slug, ja, ko, en, districts) => ({ slug, ja, ko, en, districts });

export const REGIONS = [
  {
    slug: 'hokkaido',
    ja: '北海道',
    ko: '홋카이도',
    en: 'Hokkaido',
    lead: { ja: 'すすきのを中心に、北の歓楽街の粋を集めた一帯。', ko: '스스키노를 중심으로 북쪽 유흥가의 정수를 모은 지역.', en: 'Susukino and beyond — the refined nightlife of Japan\u2019s north.' },
    prefectures: [
      P('hokkaido', '北海道', '홋카이도', 'Hokkaido', [
        D('susukino', 'すすきの', '스스키노', 'Susukino', 'すすきの駅 3番出口', 1, 1.12),
        D('tanukikoji', '狸小路', '다누키코지', 'Tanukikoji', '大通駅 南一条方面', 2, 1.0),
        D('odori', '大通・薄野西', '오도리', 'Odori', '大通駅 2番出口', 2, 1.0),
        D('kita4jo', '北4条・琴似', '기타4조·고토니', 'Kita 4-jo / Kotoni', '琴似駅 北口', 3, 0.88),
        D('hakodate', '函館・本町', '하코다테 혼초', 'Hakodate Honcho', '函館市電 松風町', 3, 0.9),
        D('asahikawa', '旭川・3条', '아사히카와 3조', 'Asahikawa 3-jo', '旭川駅 北口', 3, 0.86),
        D('obihiro', '帯広・西2条', '오비히로 니시2조', 'Obihiro Nishi 2-jo', '帯広駅 北口', 3, 0.84),
      ]),
    ],
  },
  {
    slug: 'tohoku',
    ja: '東北',
    ko: '도호쿠',
    en: 'Tohoku',
    lead: { ja: '国分町・一番町など、人情味あふれる東北の夜。', ko: '고쿠분초·이치반초 등 인정 넘치는 도호쿠의 밤.', en: 'Kokubuncho and Ichibancho — warm, unhurried northern nights.' },
    prefectures: [
      P('miyagi', '宮城県', '미야기', 'Miyagi', [
        D('sendai-kokubuncho', '仙台・国分町', '센다이 고쿠분초', 'Sendai Kokubuncho', '勾当台公園駅 徒歩3分', 1, 1.06),
        D('sendai-ichibancho', '仙台・一番町', '센다이 이치반초', 'Sendai Ichibancho', '青葉通一番町駅', 2, 1.0),
        D('sendai-ekimae', '仙台駅東口', '센다이역 동쪽', 'Sendai Station East', '仙台駅 東口', 3, 0.92),
      ]),
      P('aomori', '青森県', '아오모리', 'Aomori', [
        D('aomori-honcho', '青森・本町', '아오모리 혼초', 'Aomori Honcho', '青森駅 徒歩8分', 2, 0.86),
        D('hachinohe', '八戸・三日町', '하치노헤 미카노초', 'Hachinohe Mikka-machi', '本八戸駅', 3, 0.82),
      ]),
      P('iwate', '岩手県', '이와테', 'Iwate', [
        D('morioka-odori', '盛岡・大通', '모리오카 오도리', 'Morioka Odori', '盛岡駅 徒歩12分', 3, 0.84),
      ]),
      P('akita', '秋田県', '아키타', 'Akita', [
        D('akita-kawabata', '秋田・川反', '아키타 가와바타', 'Akita Kawabata', '秋田駅 西口', 3, 0.84),
      ]),
      P('yamagata', '山形県', '야마가타', 'Yamagata', [
        D('yamagata-nanukamachi', '山形・七日町', '야마가타 나누카마치', 'Yamagata Nanukamachi', '山形駅 西口', 3, 0.82),
      ]),
      P('fukushima', '福島県', '후쿠시마', 'Fukushima', [
        D('koriyama-ekimae', '郡山駅前', '고리야마역앞', 'Koriyama Ekimae', '郡山駅 西口', 3, 0.86),
        D('fukushima-okitama', '福島・置賜町', '후쿠시마 오키타마초', 'Fukushima Okitama-cho', '福島駅 東口', 3, 0.82),
      ]),
    ],
  },
  {
    slug: 'kanto',
    ja: '関東',
    ko: '간토',
    en: 'Kanto',
    lead: { ja: '歌舞伎町・池袋・渋谷・六本木。日本最大の夜のマーケット。', ko: '가부키초·이케부쿠로·시부야·롯폰기. 일본 최대의 밤 시장.', en: 'Kabukicho, Ikebukuro, Shibuya, Roppongi — Japan\u2019s largest night market.' },
    prefectures: [
      P('tokyo', '東京都', '도쿄', 'Tokyo', [
        D('shinjuku-kabukicho', '新宿・歌舞伎町', '신주쿠 가부키초', 'Shinjuku Kabukicho', '西武新宿駅 北口', 1, 1.32),
        D('shinjuku-gyoen', '新宿御苑周辺', '신주쿠교엔 주변', 'Shinjuku Gyoen', '新宿御苑前駅 3番出口', 1, 1),
        D('shinjuku-west', '新宿西口', '신주쿠 서쪽 출구', 'Shinjuku West Exit', '新宿駅 南口', 1, 1),
        D('shinjuku-5chome', '新宿五丁目', '신주쿠 5초메', 'Shinjuku 5-chome', '新宿三丁目駅', 1, 1),
        D('shinjuku-3chome', '新宿三丁目', '신주쿠 3초메', 'Shinjuku 3-chome', '新宿三丁目駅 C3', 1, 1.24),
        D('shinjuku-2chome', '新宿二丁目', '신주쿠 2초메', 'Shinjuku 2-chome', '新宿三丁目駅 C7', 1, 1),
        D('yaho', '谷保', '야호', 'Yaho', '谷保駅', 3, 1),
        D('kunitachi', '国立', '구니타치', 'Kunitachi', '国立駅 南口', 3, 1),
        D('ikejiriohashi', '池尻大橋', '이케지리오하시', 'Ikejiri-Ohashi', '池尻大橋駅 北口', 3, 1),
        D('ikebukuro', '池袋', '이케부쿠로', 'Ikebukuro', '池袋駅 東口', 1, 1.18),
        D('shibuya', '渋谷', '시부야', 'Shibuya', '渋谷駅 ハチ公口', 1, 1.22),
        D('ebisu', '恵比寿', '에비스', 'Ebisu', '恵比寿駅 西口', 2, 1.16),
        D('roppongi', '六本木', '롯폰기', 'Roppongi', '六本木駅 3番出口', 1, 1.45),
        D('akasaka', '赤坂', '아카사카', 'Akasaka', '赤坂駅 1番出口', 1, 1.32),
        D('ginza', '銀座', '긴자', 'Ginza', '銀座駅 A3出口', 1, 1.62),
        D('shimbashi', '新橋', '신바시', 'Shimbashi', '新橋駅 日比谷口', 1, 1.2),
        D('yurakucho', '有楽町・日比谷', '유라쿠초', 'Yurakucho', '有楽町駅 日比谷口', 2, 1.28),
        D('ueno', '上野', '우에노', 'Ueno', '上野駅 中央口', 2, 1.05),
        D('asakusa', '浅草', '아사쿠사', 'Asakusa', '浅草駅 1番出口', 2, 1.0),
        D('kinshicho', '錦糸町', '긴시초', 'Kinshicho', '錦糸町駅 北口', 2, 1.02),
        D('kichijoji', '吉祥寺', '기치조지', 'Kichijoji', '吉祥寺駅 北口', 2, 1.06),
        D('nakano', '中野', '나카노', 'Nakano', '中野駅 北口', 3, 0.98),
        D('takadanobaba', '高田馬場', '다카다노바바', 'Takadanobaba', '高田馬場駅 早稲田口', 3, 0.96),
        D('gotanda', '五反田', '고탄다', 'Gotanda', '五反田駅 東口', 3, 1.04),
        D('shinagawa', '品川・港南', '시나가와', 'Shinagawa', '品川駅 港南口', 2, 1.1),
        D('omotesando', '表参道・青山', '오모테산도', 'Omotesando', '表参道駅 B2出口', 2, 1.3),
        D('jinbocho', '神保町・水道橋', '진보초', 'Jimbocho', '神保町駅 A5出口', 3, 1.02),
        D('hongo', '本郷・小石川', '혼고·고이시카와', 'Hongo / Koishikawa', '本郷三丁目駅', 2, 1.06),
        D('nihonbashi', '日本橋・八重洲', '니혼바시·야에스', 'Nihonbashi / Yaesu', '東京駅 八重洲口', 2, 1.34),
        D('higashimurayama', '東村山', '히가시무라야마', 'Higashimurayama', '東村山駅 西口', 3, 0.78),
      ]),
      P('kanagawa', '神奈川県', '가나가와', 'Kanagawa', [
        D('yokohama-kannai', '横浜・関内', '요코하마 간나이', 'Yokohama Kannai', '関内駅 南口', 1, 1.12),
        D('yokohama-nogecho', '横浜・野毛', '요코하마 노게초', 'Yokohama Noge', '桜木町駅 東口', 2, 1.02),
        D('kawasaki', '川崎', '가와사키', 'Kawasaki', '川崎駅 東口', 2, 1.04),
        D('sagamihara', '相模原・橋本', '사가미하라', 'Sagamihara', '相模原駅 北口', 3, 0.9),
        D('yokosuka', '横須賀中央', '요코스카', 'Yokosuka Chuo', '横須賀中央駅', 3, 0.9),
      ]),
      P('saitama', '埼玉県', '사이타마', 'Saitama', [
        D('omiya', '大宮', '오미야', 'Omiya', '大宮駅 東口', 1, 1.02),
        D('kawagoe', '川越', '가와고에', 'Kawagoe', '川越駅 東口', 3, 0.9),
        D('kawaguchi', '川口', '가와구치', 'Kawaguchi', '川口駅 東口', 3, 0.94),
      ]),
      P('chiba', '千葉県', '지바', 'Chiba', [
        D('chiba-ekimae', '千葉駅前', '지바역앞', 'Chiba Ekimae', '千葉駅 東口', 2, 0.92),
        D('funabashi', '船橋', '후나바시', 'Funabashi', '船橋駅 南口', 2, 0.94),
        D('kashiwa', '柏', '가시와', 'Kashiwa', '柏駅 東口', 3, 0.9),
      ]),
      P('ibaraki', '茨城県', '이바라키', 'Ibaraki', [
        D('mito', '水戸・大工町', '미토', 'Mito Daiku-cho', '水戸駅 北口', 3, 0.84),
      ]),
      P('tochigi', '栃木県', '도치기', 'Tochigi', [
        D('utsunomiya', '宇都宮・泉町', '우쓰노미야', 'Utsunomiya Izumi-cho', '宇都宮駅 西口', 3, 0.86),
      ]),
      P('gunma', '群馬県', '군마', 'Gunma', [
        D('takasaki', '高崎', '다카사키', 'Takasaki', '高崎駅 東口', 3, 0.84),
      ]),
    ],
  },
  {
    slug: 'chubu',
    ja: '中部・東海',
    ko: '주부·도카이',
    en: 'Chubu & Tokai',
    lead: { ja: '栄・名駅・金沢片町。ものづくり日本の夜を支える街。', ko: '사카에·나고야역·가나자와 가타마치. 제조업 일본의 밤.', en: 'Sakae, Meieki and Katamachi — the industrial heart\u2019s nightlife.' },
    prefectures: [
      P('aichi', '愛知県', '아이치', 'Aichi', [
        D('nagoya-sakae', '名古屋・栄', '나고야 사카에', 'Nagoya Sakae', '栄駅 3番出口', 1, 1.16),
        D('nagoya-meieki', '名古屋・名駅', '나고야 메이에키', 'Nagoya Meieki', '名古屋駅 桜通口', 1, 1.14),
        D('nagoya-kanayama', '金山', '가나야마', 'Kanayama', '金山駅 北口', 2, 1.0),
        D('toyohashi', '豊橋', '도요하시', 'Toyohashi', '豊橋駅 東口', 3, 0.88),
      ]),
      P('shizuoka', '静岡県', '시즈오카', 'Shizuoka', [
        D('shizuoka-aoba', '静岡・青葉', '시즈오카 아오바', 'Shizuoka Aoba', '静岡駅 北口', 2, 0.94),
        D('hamamatsu', '浜松・有楽街', '하마마츠', 'Hamamatsu Yuraku-gai', '浜松駅 北口', 2, 0.9),
      ]),
      P('niigata', '新潟県', '니가타', 'Niigata', [
        D('niigata-furumachi', '新潟・古町', '니가타 후루마치', 'Niigata Furumachi', '新潟駅 万代口', 2, 0.92),
      ]),
      P('toyama', '富山県', '도야마', 'Toyama', [
        D('toyama-sogawa', '富山・総曲輪', '도야마 소가와', 'Toyama Sogawa', '富山駅 南口', 3, 0.86),
      ]),
      P('ishikawa', '石川県', '이시카와', 'Ishikawa', [
        D('kanazawa-katamachi', '金沢・片町', '가나자와 가타마치', 'Kanazawa Katamachi', '野町駅 徒歩8分', 2, 1.02),
      ]),
      P('fukui', '福井県', '후쿠이', 'Fukui', [
        D('fukui-suehiro', '福井・末広', '후쿠이', 'Fukui Suehiro', '福井駅 西口', 3, 0.84),
      ]),
      P('yamanashi', '山梨県', '야마나시', 'Yamanashi', [
        D('kofu', '甲府・愛宕町', '고후', 'Kofu Atago-cho', '甲府駅 南口', 3, 0.84),
      ]),
      P('nagano', '長野県', '나가노', 'Nagano', [
        D('nagano-gondo', '長野・権堂', '나가노 곤도', 'Nagano Gondo', '権堂駅', 3, 0.86),
        D('matsumoto', '松本・伊勢町', '마쓰모토', 'Matsumoto Ise-machi', '松本駅 東口', 3, 0.84),
      ]),
      P('gifu', '岐阜県', '기후', 'Gifu', [
        D('gifu-yanagase', '岐阜・柳ケ瀬', '기후 야나가세', 'Gifu Yanagase', '名鉄岐阜駅', 3, 0.84),
      ]),
      P('mie', '三重県', '미에', 'Mie', [
        D('yokkaichi', '四日市', '욧카이치', 'Yokkaichi', '近鉄四日市駅', 3, 0.84),
      ]),
    ],
  },
  {
    slug: 'kansai',
    ja: '関西',
    ko: '간사이',
    en: 'Kansai',
    lead: { ja: '北新槗・宗右衛門町・祇園。笑いと粋の街の夜。', ko: '기타신치·소에몬초·기온. 웃음과 멋의 도시의 밤.', en: 'Kitashinchi, Soemoncho and Gion — comedy, style and old money.' },
    prefectures: [
      P('osaka', '大阪府', '오사카', 'Osaka', [
        D('osaka-kitashinchi', '北新地', '기타신치', 'Kitashinchi', '北新地駅 11-1番出口', 1, 1.4),
        D('osaka-umeda', '梅田・兎我野町', '우메다', 'Umeda / Usagano-cho', '東梅田駅', 1, 1.1),
        D('osaka-namba', '難波・宗右衛門町', '난바 소에몬초', 'Namba Soemoncho', 'なんば駅 14番出口', 1, 1.14),
        D('osaka-shinsaibashi', '心斎橋', '신사이바시', 'Shinsaibashi', '心斎橋駅 5番出口', 1, 1.1),
        D('osaka-tennoji', '天王寺・阿倍野', '덴노지', 'Tennoji / Abeno', '天王寺駅 北口', 2, 0.98),
        D('osaka-kyobashi', '京橋', '교바시', 'Kyobashi', '京橋駅 北口', 2, 0.96),
        D('osaka-juso', '十三', '주소', 'Juso', '十三駅 東口', 3, 0.92),
      ]),
      P('kyoto', '京都府', '교토', 'Kyoto', [
        D('kyoto-kiyamachi', '木屋町', '기야마치', 'Kiyamachi', '祇園四条駅', 1, 1.18),
        D('kyoto-pontocho', '先斗町', '폰토초', 'Pontocho', '三条駅', 1, 1.22),
        D('kyoto-gion', '祇園', '기온', 'Gion', '祇園四条駅', 1, 1.3),
        D('kyoto-kawaramachi', '河原町', '가와라마치', 'Kawaramachi', '京都河原町駅', 2, 1.06),
      ]),
      P('hyogo', '兵庫県', '효고', 'Hyogo', [
        D('kobe-sannomiya', '神戸・三宮', '고베 산노미야', 'Kobe Sannomiya', '三宮駅 東口', 1, 1.1),
        D('kobe-motomachi', '元町', '모토마치', 'Motomachi', '元町駅 東口', 2, 1.02),
        D('himeji', '姫路・駅前', '히메지', 'Himeji Ekimae', '姫路駅 北口', 3, 0.9),
      ]),
      P('shiga', '滋賀県', '시가', 'Shiga', [
        D('otsu-hamaotsu', '大津・浜大津', '오쓰', 'Otsu Hamaotsu', '浜大津駅', 3, 0.86),
      ]),
      P('nara', '奈良県', '나라', 'Nara', [
        D('nara-kintetsu', '奈良・近鉄前', '나라', 'Nara Kintetsu-mae', '近鉄奈良駅', 3, 0.86),
      ]),
      P('wakayama', '和歌山県', '와카야마', 'Wakayama', [
        D('wakayama-tomoda', '和歌山・友田町', '와카야마', 'Wakayama Tomoda-cho', '和歌山駅 西口', 3, 0.84),
      ]),
    ],
  },
  {
    slug: 'chugoku-shikoku',
    ja: '中四国',
    ko: '주고쿠·시코쿠',
    en: 'Chugoku & Shikoku',
    lead: { ja: '流川・薬研堀・二番町。瀬戸内の夜は濃くてやさしい。', ko: '나가레카와·야겐보리·니반초. 세토우치의 밤.', en: 'Nagarekawa, Yagenbori, Nibancho — Seto Inland Sea nights.' },
    prefectures: [
      P('hiroshima', '広島県', '히로시마', 'Hiroshima', [
        D('hiroshima-nagarekawa', '広島・流川', '히로시마 나가레카와', 'Hiroshima Nagarekawa', '八丁堀駅', 1, 1.02),
        D('hiroshima-yagenbori', '薬研堀', '야겐보리', 'Yagenbori', '銀山町駅', 2, 0.98),
        D('fukuyama', '福山', '후쿠야마', 'Fukuyama', '福山駅 南口', 3, 0.86),
      ]),
      P('okayama', '岡山県', '오카야마', 'Okayama', [
        D('okayama-omotecho', '岡山・表町', '오카야마 오모테초', 'Okayama Omote-cho', '県庁通り駅', 2, 0.92),
        D('kurashiki', '倉敷', '구라시키', 'Kurashiki', '倉敷駅 南口', 3, 0.88),
      ]),
      P('yamaguchi', '山口県', '야마구치', 'Yamaguchi', [
        D('shimonoseki', '下関', '시모노세키', 'Shimonoseki', '下関駅 東口', 3, 0.84),
      ]),
      P('tottori', '鳥取県', '돗토리', 'Tottori', [
        D('tottori-ekimae', '鳥取駅前', '돗토리', 'Tottori Ekimae', '鳥取駅 北口', 3, 0.8),
      ]),
      P('shimane', '島根県', '시마네', 'Shimane', [
        D('matsue', '松江', '마쓰에', 'Matsue', '松江駅 北口', 3, 0.8),
      ]),
      P('kagawa', '香川県', '가가와', 'Kagawa', [
        D('takamatsu-kawaramachi', '高松・瓦町', '다카마쓰 가와라마치', 'Takamatsu Kawaramachi', '瓦町駅', 2, 0.9),
      ]),
      P('ehime', '愛媛県', '에히메', 'Ehime', [
        D('matsuyama-nibancho', '松山・二番町', '마쓰야마 니반초', 'Matsuyama Nibancho', '大街道駅', 2, 0.92),
      ]),
      P('tokushima', '徳島県', '도쿠시마', 'Tokushima', [
        D('tokushima-akamatsu', '徳島・秋田町', '도쿠시마', 'Tokushima Akita-machi', '徳島駅', 3, 0.8),
      ]),
      P('kochi', '高知県', '고치', 'Kochi', [
        D('kochi-harimayabashi', '高知・はりまや橋', '고치', 'Kochi Harimayabashi', 'はりまや橋駅', 3, 0.84),
      ]),
    ],
  },
  {
    slug: 'kyushu-okinawa',
    ja: '九州・沖縄',
    ko: '규슈·오키나와',
    en: 'Kyushu & Okinawa',
    lead: { ja: '中洲・天神・松山。日本一熱い夜の島々。', ko: '나카스·텐진·마쓰야마. 일본에서 가장 뜨거운 밤.', en: 'Nakasu, Tenjin and Matsuyama — Japan\u2019s hottest nights.' },
    prefectures: [
      P('fukuoka', '福岡県', '후쿠오카', 'Fukuoka', [
        D('fukuoka-nakasu', '中洲', '나카스', 'Nakasu', '中洲川端駅 1番出口', 1, 1.12),
        D('fukuoka-tenjin', '天神', '텐진', 'Tenjin', '天神駅 西1出口', 1, 1.08),
        D('fukuoka-daimyo', '大名・今泉', '다이묘', 'Daimyo / Imaizumi', '赤坂駅 2番出口', 2, 1.0),
        D('kitakyushu-kokura', '小倉・魚町', '고쿠라', 'Kokura Uo-machi', '旦過駅', 2, 0.94),
        D('kurume', '久留米', '구루메', 'Kurume', '西鉄久留米駅', 3, 0.86),
      ]),
      P('kumamoto', '熊本県', '구마모토', 'Kumamoto', [
        D('kumamoto-shimotori', '下通', '시모토리', 'Shimotori', '通町筋駅', 2, 0.92),
      ]),
      P('kagoshima', '鹿児島県', '가고시마', 'Kagoshima', [
        D('kagoshima-tenmonkan', '天文館', '덴몬칸', 'Tenmonkan', '天文館通駅', 2, 0.9),
      ]),
      P('nagasaki', '長崎県', '나가사키', 'Nagasaki', [
        D('nagasaki-shianbashi', '思案橋', '시안바시', 'Shianbashi', '思案橋駅', 3, 0.86),
      ]),
      P('oita', '大分県', '오이타', 'Oita', [
        D('oita-miyakomachi', '大分・都町', '오이타', 'Oita Miyako-machi', '大分駅 北口', 3, 0.84),
      ]),
      P('miyazaki', '宮崎県', '미야자키', 'Miyazaki', [
        D('miyazaki-nishitachi', '宮崎・西橘', '미야자키', 'Miyazaki Nishi-tachibana', '宮崎駅 西口', 3, 0.84),
      ]),
      P('saga', '佐賀県', '사가', 'Saga', [
        D('saga-ekimae', '佐賀駅前', '사가', 'Saga Ekimae', '佐賀駅 南口', 3, 0.8),
      ]),
      P('okinawa', '沖縄県', '오키나와', 'Okinawa', [
        D('naha-matsuo', '那覇・松山', '나하 마쓰야마', 'Naha Matsuyama', '美栄橋駅', 2, 1.0),
        D('naha-kokusai', '国際通り', '고쿠사이도리', 'Kokusai Street', '県庁前駅', 2, 0.96),
        D('okinawa-city', '沖縄市・コザ', '오키나와시 고자', 'Okinawa City Koza', 'てだこ浦西駅', 3, 0.86),
      ]),
    ],
  },
];

// ---- flat lookup helpers -------------------------------------------------
export const prefectureList = [];
export const districtList = [];
for (const region of REGIONS) {
  for (const pref of region.prefectures) {
    const prefRec = { ...pref, regionSlug: region.slug, region, districts: undefined, districtSlugs: pref.districts.map((d) => d.slug) };
    delete prefRec.districts;
    prefectureList.push(prefRec);
    for (const d of pref.districts) {
      districtList.push({ ...d, prefSlug: pref.slug, pref, regionSlug: region.slug, region });
    }
  }
}

export const prefBySlug = new Map(prefectureList.map((p) => [p.slug, p]));
export const districtBySlug = new Map(districtList.map((d) => [d.slug, d]));
export const regionBySlug = new Map(REGIONS.map((r) => [r.slug, r]));

// prefecture that owns each district slug
export const prefOfDistrict = new Map();
for (const pref of prefectureList) for (const s of pref.districtSlugs) prefOfDistrict.set(s, pref.slug);

export const GEO_STATS = {
  regions: REGIONS.length,
  prefectures: prefectureList.length,
  districts: districtList.length,
};
