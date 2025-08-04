/*
支持：QuantumultX / Surge / Loon

通杀策略：
- 从响应中解析 bundle_id
- 构造多种 product_id 可能性（year / yearly / lifetime）
- 支持本地静态映射表 list（可注释软件名）
- 支持 fallback 默认 ID 注入，提升解锁率

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes_static.js

[mitm]
hostname = buy.itunes.apple.com

*/

const res = typeof $response.body === "string" ? JSON.parse($response.body) : $response.body;
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
const now = Date.now();
const forever = 4102415999000;
const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

let bundle = res?.receipt?.bundle_id || res?.receipt?.Bundle_Id || "";
if (!bundle) {
  console.log("❌ 未获取到 bundle_id，使用 fallback.bundle");
  bundle = "fallback.bundle";
} else {
  console.log("📦 识别到 bundle_id:", bundle);
}

// 构造常见订阅 ID
const yearid = `${bundle}.year`;
const yearlyid = `${bundle}.yearly`;
const yearlysub = `${bundle}.yearlysubscription`;
const lifetimeid = `${bundle}.lifetime`;

// 本地映射（你可以自由添加更多 App）
const list = {
  "com.onemore.markdown": { id: "10012" },                   // One Markdown
  "me.imgbase.intolive": { id: "me.imgbase.intolive.proSubYearly" },  // intolive-实况壁纸
  "IPTV%20Flixana": { id: "iptv_flixana_lifetime_sub" },     // IPTV Flixana
  "*": { id: "com.va.adBlocker.lifeTimefree" }               // 默认 fallback
};

// 优先从 list 查找
let product_id = list[bundle]?.id;

// 否则尝试构造 fallback
if (!product_id) {
  console.log("🔍 未匹配映射表，尝试 fallback 生成");
  const fallbackList = [yearid, yearlyid, yearlysub, lifetimeid];
  product_id = fallbackList[0]; // 默认取第一个
}

// 如果还找不到，使用 "*" fallback
if (!product_id && list["*"]) {
  product_id = list["*"].id;
}

if (!product_id) {
  console.log("❌ 最终未能匹配到 product_id，终止注入");
  return $done({ body: JSON.stringify(res) });
}

console.log("✅ 最终注入 product_id:", product_id);

const item = {
  quantity: "1",
  product_id,
  transaction_id: tid,
  original_transaction_id: tid,
  purchase_date_ms: `${now}`,
  original_purchase_date_ms: `${now}`,
  expires_date_ms: `${forever}`,
  is_trial_period: "false",
  is_in_intro_offer_period: "false"
};

const output = {
  receipt: {
    bundle_id: bundle,
    in_app: [item]
  },
  latest_receipt_info: [item],
  pending_renewal_info: [{
    product_id,
    auto_renew_status: "1"
  }],
  status: 0
};

$done({ body: JSON.stringify(output) });