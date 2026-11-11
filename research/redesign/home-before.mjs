import {categoryOverview} from './category-overview.mjs';
// ============================================================================
// HOME — nationwide landing page (JA / KO / EN)
// ============================================================================

import { t } from '../i18n.mjs';
import { esc, page, ICONS, SITE } from '../render/layout.mjs';
import { CATEGORIES } from '../data/categories.mjs';
import { REGIONS, prefectureList, GEO_STATS } from '../data/geo.mjs';

const L = (lang, ja, ko, en) => ({ ja, ko, en })[lang] ?? ja;

const distMapFor = (lang) => Object.fromEntries(prefectureList.map((p) => {
  const pref = REGIONS.find((r) => r.slug === p.regionSlug).prefectures.find((x) => x.slug === p.slug);
  return [p.slug, pref.districts.map((d) => ({ s: d.slug, n: d[lang] }))];
}));

const CAT_IMG = {
  snack: '/images/ai-snack-editorial.jpg',
  girlsbar: '/images/ai-girlsbar-editorial.jpg',
  massage: '/images/ai-massage-editorial.jpg',
};

export function homePage(lang) {
 const path=`/${lang}/`;
 const DIST_MAP=distMapFor(lang);
 const title=L(lang,'BAM-NIGHT｜今夜を、あなたらしく。','BAM-NIGHT｜오늘 밤, 당신의 취향으로.','BAM-NIGHT | A night that feels like you.');
 const desc=L(lang,'スナック、ガールズバー、マッサージ。街と過ごし方から、次の一軒を。','스낙크부터 걸즈바, 마사지까지. 지역과 취향으로 찾는 일본의 밤.','Snack bars, girls bars and massage. Find your next stop by neighbourhood and mood.');
 const hooks=[
  L(lang,'会話を楽しむ、もう一軒。','이야기가 머무는 작은 바.','Good conversation. One more stop.'),
  L(lang,'華やかな夜に、乾杯。','조금 더 특별한 밤을 위해.','A brighter kind of night.'),
  L(lang,'街を歩いたあとは、ひと息。','여행의 끝에, 편안한 쉼.','Slow down. Feel recharged.')];
 const body=`
 <section class="night-hero"><div class="night-hero-photo" role="img" aria-label="${esc(L(lang,'AIコンセプトの東京の夜景','AI 콘셉트 도쿄 야경','AI concept Tokyo nightscape'))}"></div>
 <div class="wrap wrap-wide night-hero-content"><div class="night-eyebrow">JAPAN AFTER HOURS · BAM-NIGHT</div>
 <h1>${esc(L(lang,'今夜を、\nあなたらしく。','오늘 밤,\n당신의 취향으로.','Find your night.\nMake it yours.')).replaceAll('\n','<br>')}</h1>
 <p>${esc(desc)}</p>
 <div class="night-hero-links"><a class="night-primary" href="/${lang}/area/">${esc(L(lang,'街から探す','지역으로 발견하기','Explore neighbourhoods'))} ↗</a><a href="/${lang}/guide/">${esc(L(lang,'はじめての夜ガイド','처음이라면, 나이트 가이드','Your first night, made simple'))} →</a></div>
 <small class="night-photo-label">${esc(L(lang,'AIコンセプト画像 · 実店舗の写真ではありません','AI 콘셉트 이미지 · 실제 매장 사진이 아닙니다','AI concept image · not an actual venue'))}</small></div></section>
 <section class="night-find wrap wrap-wide"><div class="night-find-label"><span>YOUR NEXT STOP</span><h2>${esc(L(lang,'どこで、どう過ごす？','어디서, 어떤 밤을 보낼까요?','Where will the night take you?'))}</h2></div>
      <form class="sbox sbox-hero hero-search" action="/${lang}/search/" method="get" role="search" id="heroSearch">
        <input class="grow" type="search" name="q" placeholder="${esc(t(lang, 'searchPlaceholder'))}" aria-label="${esc(t(lang, 'search'))}">
        <select name="cat" aria-label="${esc(t(lang, 'category'))}">
          <option value="">${esc(L(lang, '業種を選択', '업종 선택', 'All categories'))}</option>
          ${CATEGORIES.map((c) => `<option value="${c.slug}">${esc(c[lang])}</option>`).join('')}
        </select>
        <select name="pref" id="heroPref" aria-label="${esc(t(lang, 'prefecture'))}">
          <option value="">${esc(L(lang, '都道府県を選択', '도도부현 선택', 'All prefectures'))}</option>
          ${prefectureList.map((p) => `<option value="${p.slug}">${esc(p[lang])}</option>`).join('')}
        </select>
        <select name="district" id="heroDist" aria-label="${esc(t(lang, 'area'))}">
          <option value="">${esc(L(lang, 'エリアを選択', '지역 선택', 'All areas'))}</option>
        </select>
        <button class="btn btn-gold" type="submit">${ICONS.search}${esc(t(lang, 'search'))}</button>
      </form>

 </section>
 <section class="night-section wrap wrap-wide"><div class="night-section-top"><div><span class="night-eyebrow">01 / CHOOSE YOUR MOOD</span><h2>${esc(L(lang,'気分から、選ぶ。','취향으로 고르는 밤.','Three ways to unwind.'))}</h2></div><p>${esc(L(lang,'いつもの一日を、少し特別に。','낯선 도시에서도, 나다운 시간을.','A new city. A familiar feeling.'))}</p></div>
 <nav class="night-category-grid" id="home-main-menu" aria-label="${esc(L(lang,'業種別の店舗検索','업종별 매장 찾기','Browse venues by category'))}">${CATEGORIES.map((c,i)=>`<a class="night-category" href="/${lang}/${c.slug}/"><div class="night-category-photo"><img src="${CAT_IMG[c.slug]}" alt="${esc(c[lang])} · ${esc(t(lang,'aiConcept'))}" width="640" height="400" loading="lazy"><span>0${i+1}</span></div><div class="night-category-text"><h3>${esc(c[lang])}</h3><p>${esc(hooks[i])}</p><span class="night-round-arrow">↗</span></div></a>`).join('')}</nav>
 <p class="night-disclosure">${esc(L(lang,'掲載情報は来店前に店舗へご確認ください。画像はAIによるイメージです。','방문 전 영업 정보와 요금은 매장에 확인해 주세요. 이미지는 AI 콘셉트입니다.','Confirm hours and prices with the venue before visiting. Images are AI concepts.'))}</p></section>
 ${categoryOverview(lang)}
 <section class="night-destinations"><div class="wrap wrap-wide"><div class="night-section-top"><div><span class="night-eyebrow">02 / THE NEIGHBOURHOOD EDIT</span><h2>${esc(L(lang,'街が変わると、夜も変わる。','동네마다 다른, 밤의 표정.','Different streets. Different stories.'))}</h2></div><a href="/${lang}/area/">${esc(L(lang,'すべてのエリア','전체 지역 보기','All neighbourhoods'))} ↗</a></div><div class="night-area-grid">${[
 ['shinjuku-kabukicho','tokyo',L(lang,'新宿・歌舞伎町','신주쿠·가부키초','Shinjuku / Kabukicho'),L(lang,'眠らない街の、その先へ。','잠들지 않는 거리, 그 너머로.','Beyond the neon.')],
 ['ginza','tokyo',L(lang,'銀座','긴자','Ginza'),L(lang,'大人の夜を、ゆっくりと。','여유롭게 즐기는 어른의 밤.','Take the evening slowly.')],
 ['ueno','tokyo',L(lang,'上野','우에노','Ueno'),L(lang,'路地に出会う、あたたかな一杯。','골목에서 만나는 따뜻한 한 잔.','A warm welcome, down a side street.')]
 ].map((a,i)=>`<a href="/${lang}/area/${a[1]}/${a[0]}/"><span class="night-area-number">0${i+1}</span><h3>${esc(a[2])}</h3><p>${esc(a[3])}</p><span>↗</span></a>`).join('')}</div></div></section>
 <section class="night-section night-essentials wrap wrap-wide"><div class="night-section-top"><div><span class="night-eyebrow">03 / BEFORE YOU GO</span><h2>${esc(L(lang,'出かける前に、ひとつだけ。','좋은 밤을 위한, 작은 준비.','A little planning. A better night.'))}</h2></div><p>${esc(L(lang,'必要な情報だけ、迷わずに。','필요한 정보만, 한눈에.','The essentials, all in one place.'))}</p></div>
 <nav class="night-essential-grid" aria-label="${esc(L(lang,'お出かけガイド','방문 준비 메뉴','Plan your visit'))}">
 ${[
 ['area',ICONS.map,L(lang,'エリアから探す','지역별 매장 찾기','Browse by area'),L(lang,'都道府県と街を選んで、掲載店を探せます。','도도부현과 동네를 골라 등록된 매장을 찾아보세요.','Choose a prefecture and neighbourhood to find listed venues.')],
 ['guide',ICONS.book,L(lang,'はじめての方へ','처음 방문 가이드','First-visit guide'),L(lang,'お店の違いと訪問マナー。初めてでも、心地よく。','가게의 차이와 방문 매너. 처음이어도 편안하게.','Venue types and local etiquette, for a more comfortable first visit.')],
 ['search',ICONS.search,L(lang,'店舗名・条件で検索','매장명·조건 검색','Search venues'),L(lang,'店名・業種・地域を組み合わせて検索。','매장명·업종·지역을 조합해 검색하세요.','Search by venue name, category and location.')]
 ].map(([route,icon,label,text],i)=>`<a class="night-essential" href="/${lang}/${route}/"><span class="night-essential-icon" aria-hidden="true">${icon}</span><span class="night-essential-number">0${i+1}</span><h3>${esc(label)}</h3><p>${esc(text)}</p><span class="night-essential-link">${esc(L(lang,'詳しく見る','살펴보기','Explore'))} ↗</span></a>`).join('')}
 </nav></section>
 <script>
(function(){
  var D=document.getElementById('heroDist'),P=document.getElementById('heroPref');
  if(!D||!P) return;
  var data=${JSON.stringify(DIST_MAP)};
  function fill(){
    var list = data[P.value] || [];
    var all = document.createElement('option');
    all.value=''; all.textContent=${JSON.stringify(L(lang, 'エリアを選択', '지역 선택', 'All areas'))};
    D.innerHTML=''; D.appendChild(all);
    list.forEach(function(d){
      var o=document.createElement('option'); o.value=d.s; o.textContent=d.n; D.appendChild(o);
    });
    D.disabled = !list.length;
  }
  P.addEventListener('change',fill); fill();
})();
</script>
 `;
 return page({lang,path,title,desc,body,gate:true});
}
