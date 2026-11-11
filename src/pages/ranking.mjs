import {t} from '../i18n.mjs';
import {page,esc} from '../render/layout.mjs';
import {crumbs,secHead,rankList,shopCard} from '../render/components.mjs';
import {SHOPS} from '../data/shops.mjs';
import {CATEGORIES} from '../data/categories.mjs';
const L=(l,ja,ko,en)=>({ja,ko,en})[l]||ja;
export function rankingPage(lang){
 const path=`/${lang}/ranking/`;
 const title=L(lang,'次の一軒を見つける｜掲載店インデックス','다음 방문을 위한 발견｜매장 인덱스','Discover your next stop | Venue index');
 const real=SHOPS.filter(s=>s.realData).sort((a,b)=>(a.nameJa||'').localeCompare(b.nameJa||'','ja'));
 const entries=real.length?real:SHOPS;
 const top=entries.slice(0,20);const ids=new Set(top.map(s=>s.slug));
 const body=`<section class="ph"><div class="wrap wrap-wide">${crumbs(lang,[{label:t(lang,'breadcrumbHome'),href:`/${lang}/`},{label:t(lang,'navRanking')}])}<h1>${esc(L(lang,'次の一軒の、ヒントに。','다음 방문을 위한 발견.','A good night starts with a little discovery.'))}</h1><p>${esc(L(lang,'人気を装う数字より、お店を選ぶための情報を。','인기를 꾸민 숫자보다, 선택에 도움이 되는 정보를.','Useful venue information, without invented popularity scores.'))}</p></div></section>
 <section class="sec"><div class="wrap wrap-wide"><div class="notice">${esc(L(lang,'実測の来店数・口コミ順位はありません。以下は名称順の掲載店インデックスで、人気順位や営業内容の保証ではありません。','실측 방문·리뷰 순위가 없습니다. 아래는 이름순 매장 인덱스이며 인기 순위나 영업 내용의 보증이 아닙니다.','This is a name-ordered venue index, not a measured popularity ranking or a guarantee of venue operations.'))}</div><div class="tabs mt24"><a href="#all">${esc(t(lang,'all'))}</a>${CATEGORIES.map(c=>`<a href="#${c.slug}">${esc(c[lang])}</a>`).join('')}</div><div id="all">${secHead(lang,'VENUE INDEX',esc(L(lang,'掲載店を知る','매장 알아보기','Meet the listings')),'')}${rankList(lang,top,20)}</div>${CATEGORIES.map(c=>`<section class="mt24" id="${c.slug}">${secHead(lang,c.en.toUpperCase(),esc(c[lang]),'')}<div class="shops">${entries.filter(s=>s.cat===c.slug&&!ids.has(s.slug)).slice(0,6).map(s=>shopCard(lang,s)).join('')}</div><a class="btn btn-line mt16" href="/${lang}/${c.slug}/">${esc(t(lang,'viewAll'))} →</a></section>`).join('')}</div></section>`;
 return page({lang,path,title,desc:title,body});
}
