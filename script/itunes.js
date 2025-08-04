/*
[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const ddm = typeof $response.body === "string" ? JSON.parse($response.body) : $response.body;
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

const bundle = ddm?.receipt?.bundle_id || ddm?.receipt?.Bundle_Id || "unknown.bundle";
const now = Date.now();
const forever = 4102415999000;
const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

// 构造多种常见订阅 ID 变量
const yearid = `${bundle}.year`;
const yearlyid = `${bundle}.yearly`;
const yearlysubscription = `${bundle}.yearlysubscription`;
const lifetimeid = `${bundle}.lifetime`;

// 静态匹配表（按需增减）
const list = {
  'com.onemore.markdown': { id: "10012" },                      // One Markdown
  'me.imgbase.intolive': { id: "me.imgbase.intolive.proSubYearly" }, // intolive-实况壁纸
  'IPTV%20Flixana': { id: "iptv_flixana_lifetime_sub" },        // IPTV Flixana
  '*': { id: "com.va.adBlocker.lifeTimefree" }                  // 默认 fallback
};

// 使用 encodeURIComponent(bundle) 作为 key
const encoded = encodeURIComponent(bundle);
const conf = list[encoded] || list[bundle] || list["*"];
const pid = conf?.id || lifetimeid;

if (!pid) {
  console.log("❌ 无有效 product_id，退出");
  $done({ body: JSON.stringify(ddm) });
} else {
  console.log(`✅ 注入订阅 ID: ${pid}`);
}

const item = {
  quantity: "1",
  product_id: pid,
  transaction_id: tid,
  original_transaction_id: tid,
  purchase_date_ms: `${now}`,
  original_purchase_date_ms: `${now}`,
  expires_date_ms: `${forever}`,
  is_trial_period: "false",
  is_in_intro_offer_period: "false"
};

const result = {
  receipt: {
    bundle_id: bundle,
    in_app: [item]
  },
  latest_receipt_info: [item],
  pending_renewal_info: [{
    product_id: pid,
    auto_renew_status: "1"
  }],
  status: 0
};

$done({ body: JSON.stringify(result) });