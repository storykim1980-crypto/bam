// ============================================================================
// BAM-NIGHT JAPAN — Transparent all-in pricing engine (明朗会計エンジン)
// 실제 계산은 pricing-core.mjs(브라우저와 공용)에서 수행한다.
// 이 파일은 서버/페이지용 얇은 래퍼다.
// ============================================================================

import { catBySlug } from './categories.mjs';
import { quote as coreQuote, areaMedianQuote, yen } from './pricing-core.mjs';

export { TAX_RATE, SERVICE_RATE, LATE_NIGHT_RATE, NOMINATION, PLAN_FACTOR, PLAN_MINUTES, yen } from './pricing-core.mjs';

/**
 * @param {object} o  cat / priceIndex / plan / castDrinks / extensions /
 *                    nomination / service / lateNight / discount / people
 */
export function quote(o = {}) {
  const catDef = catBySlug.get(o.cat || 'snack');
  if (!catDef) return null;
  return coreQuote({ ...o, catDef });
}

// Median "all-in 60-min, 1 drink, 1 person" used for area price tables.
export function areaMedian(catSlug, priceIndex, plan = 'set60') {
  const catDef = catBySlug.get(catSlug);
  if (!catDef) return 0;
  const q = areaMedianQuote(catDef, priceIndex, plan);
  return q ? q.totalPerPerson : 0;
}
