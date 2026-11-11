// ============================================================================
// PRICING CORE — isomorphic (Node 서버 + 브라우저 정적 빌드 공용)
// server.mjs(/api/quote)와 정적 사이트(build/browser.js)가 이 파일 하나를 공유한다.
// 외부 의존성이 없어야 한다 (브라우저에서 그대로 import).
// ============================================================================

export const TAX_RATE = 0.1;
export const SERVICE_RATE = 0.1;
export const LATE_NIGHT_RATE = 0.1;
export const NOMINATION = { snack: 1000, girlsbar: 1000, massage: 1500 };
export const PLAN_FACTOR = { set60: 1, set90: 1.45, set120: 1.9 };
export const PLAN_MINUTES = { set60: 60, set90: 90, set120: 120 };

const round100 = (n) => Math.round(n / 100) * 100;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export function quote(o = {}) {
  const cat = o.catDef;
  if (!cat) return null;
  const p = clamp(Number(o.priceIndex) || 1, 0.7, 1.8);
  const plan = PLAN_FACTOR[o.plan] ? o.plan : 'set60';
  const drinks = clamp(Number(o.castDrinks) || 0, 0, 20);
  const ext = clamp(Number(o.extensions) || 0, 0, 8);
  const people = clamp(Number(o.people) || 1, 1, 6);
  const b = cat.base;

  const lines = [];
  const push = (id, ja, ko, en, amount) => {
    if (amount > 0) lines.push({ id, ja, ko, en, amount: round100(amount) });
  };

  const setBase = b.set60 * PLAN_FACTOR[plan] * p;
  push('set', `${cat.ja} セット料金（${PLAN_MINUTES[plan]}分）`, `${cat.ko} 세트 요금(${PLAN_MINUTES[plan]}분)`, `${cat.en} set fee (${PLAN_MINUTES[plan]} min)`, setBase);

  if (b.charge > 0) push('charge', 'チャージ・お通し', '차지·오토시', 'Cover / otoshi', b.charge * p);
  push('ext', `延長料金 ×${ext}（30分）`, `연장 요금 ×${ext}(30분)`, `Extension ×${ext} (30 min)`, b.extend30 * p * ext);
  push('cast', `キャストドリンク ×${drinks}`, `캐스트 드링크 ×${drinks}`, `Cast drinks ×${drinks}`, Math.max(b.castDrink, 700) * p * drinks);
  if (o.nomination) push('nom', '指名料', '지명료', 'Nomination fee', (NOMINATION[cat.slug] || 1000) * p);

  const sub = lines.reduce((s, l) => s + l.amount, 0);

  if (o.service) push('svc', `サービス料（${SERVICE_RATE * 100}%）`, `서비스료(${SERVICE_RATE * 100}%)`, `Service charge (${SERVICE_RATE * 100}%)`, sub * SERVICE_RATE);
  if (o.lateNight) push('late', `深夜割増（22時以降 ${LATE_NIGHT_RATE * 100}%）`, `심야 할증(22시 이후 ${LATE_NIGHT_RATE * 100}%)`, `Late-night surcharge (after 22:00, ${LATE_NIGHT_RATE * 100}%)`, sub * LATE_NIGHT_RATE);

  const disc = clamp(Number(o.discount) || 0, 0, sub);
  if (disc > 0) lines.push({ id: 'coupon', ja: 'クーポン割引', ko: '쿠폰 할인', en: 'Coupon discount', amount: -round100(disc) });

  const net = lines.reduce((s, l) => s + l.amount, 0);
  const tax = round100(net * TAX_RATE);
  const totalPerPerson = net + tax;

  return {
    cat: cat.slug, plan, minutes: PLAN_MINUTES[plan], people, priceIndex: p,
    lines, subtotal: net, tax, totalPerPerson,
    totalAll: totalPerPerson * people,
    effectiveHourly: Math.round(totalPerPerson / (PLAN_MINUTES[plan] / 60)),
  };
}

export function areaMedianQuote(catDef, priceIndex, plan = 'set60') {
  return quote({ catDef, priceIndex, plan, castDrinks: 1, nomination: false, service: true, lateNight: false });
}

export const yen = (n) => '¥' + Number(n || 0).toLocaleString('en-US');
