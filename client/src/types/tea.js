/**
 * @file Type definitions for Tea Atlas domain objects.
 *
 * JSDoc-only. No TypeScript. No runtime code.
 * All field names and types mirror the actual data in ../data/demoTeas.js.
 */

/**
 * @typedef {Object} Tea
 * @property {string} id - unique slug, e.g. "longjing"
 * @property {string} name - Chinese name, e.g. "龙井"
 * @property {string} province - province name, e.g. "浙江"
 * @property {string} city - city or region, e.g. "杭州"
 * @property {number} latitude - decimal degrees
 * @property {number} longitude - decimal degrees
 * @property {string} category - tea category, e.g. "绿茶"
 * @property {'green'|'oolong'|'black'|'white'|'yellow'|'dark'|'flower'} categoryEn - English category folder key
 * @property {string} maturity_months - range string, e.g. "3月 4月"
 * @property {string} seasons - season description, e.g. "spring"
 * @property {string} meaning - cultural significance or etymology
 * @property {string} brewingTemp - recommended brewing water temperature, e.g. "80-85°C"
 * @property {string} brewingTime - recommended steeping time, e.g. "2-3分钟"
 * @property {string} story - legend or historical anecdote
 * @property {string[]} checkinSpots - real scenic spots near the tea origin
 */
