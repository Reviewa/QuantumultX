/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com

*/

const raw = typeof $response.body === "string" ? JSON.parse($response.body) : $response.body || {};
const bundle = raw?.receipt?.bundle_id || raw?.receipt?.Bundle_Id || "";
const encoded = encodeURIComponent(bundle);
const now = Date.now();
const forever = 4102415999000;
const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

// 常见 product_id 推测策略
const candidates = [
  `${bundle}.lifetime`,
  `${bundle}.year`,
  `${bundle}.yearly`,
  `${bundle}.vip`,
  `${bundle}.vip.year`,
  `${bundle}.pro`,
  `${bundle}.pro.year`,
  `${bundle}.proSubYearly`,
  `${bundle}.ultimate`,
  "10012", // One Markdown fallback
  "me.imgbase.intolive.proSubYearly", // intolive fallback
];

// 静态匹配表（必要时继续扩展）
const map = {
  "com.onemore.markdown": "10012",  // One Markdown
  "me.imgbase.intolive": "me.imgbase.intolive.proSubYearly",  // intolive
  "*": "com.va.adBlocker.lifeTimefree"  // fallback
};

// 精确匹配或 fallback
const fixed = map[bundle] || map[encoded] || map["*"];
if (fixed) candidates.unshift(fixed);

// 自动去重
const uniq = [...new Set(candidates.filter(Boolean))];

const item = (pid) => ({
  quantity: "1",
  product_id: pid,
  transaction_id: tid,
  original_transaction_id: tid,
  purchase_date_ms: `${now}`,
  original_purchase_date_ms: `${now}`,
  expires_date_ms: `${forever}`,
  is_trial_period: "false",
  is_in_intro_offer_period: "false"
});

const products = uniq.map(item);

const result = {
  receipt: {
    bundle_id: bundle,
    in_app: products
  },
  latest_receipt_info: products,
  pending_renewal_info: products.map(i => ({
    product_id: i.product_id,
    auto_renew_status: "1"
  })),
  status: 0
};

console.log(`✅ 注入 ${products.length} 个订阅 ID -> ${bundle || "unknown"}`);
$done({ body: JSON.stringify(result) });