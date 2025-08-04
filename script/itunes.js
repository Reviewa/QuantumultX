/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";
const latestKey = "ddo"; // 统一结构 key

(async () => {
  const raw = typeof $response?.body === "string" ? $response.body : "";
  const body = raw ? JSON.parse(raw) : {};
  const now = Date.now();

  const bundle = body?.receipt?.bundle_id || body?.receipt?.Bundle_Id || "";
  if (!bundle) {
    console.log("⚠️ 未检测到有效 bundle_id，将使用 fallback");
  } else {
    console.log("🧾 当前 bundle_id:", bundle);
  }

  let map = {};
  try {
    const resp = await new Promise((r) => $httpClient.get(remote, r));
    map = JSON.parse(resp?.data || "{}");
  } catch (e) {
    console.log("⚠️ 加载 subscriptionMap 失败:", e);
  }

  const conf = map[encodeURIComponent(bundle)] || map[bundle] || map["*"] || null;
  const pid = conf?.id;
  const cm = conf?.cm || "default";
  const hx = conf?.hx || "hxdefault";
  const tid = hx + now;

  if (!pid) {
    console.log("❌ 无法匹配订阅 ID");
    $done({ body: JSON.stringify(body) });
    return;
  }

  const dateOffset = cm === "timea" ? now - 20000 * 1000
                    : cm === "timeb" ? now - 10000 * 1000
                    : now;

  const exp = 4102415999000;
  const item = {
    quantity: "1",
    product_id: pid,
    transaction_id: tid,
    original_transaction_id: tid,
    purchase_date_ms: `${dateOffset}`,
    original_purchase_date_ms: `${dateOffset}`,
    expires_date_ms: `${exp}`,
    is_trial_period: "false",
    is_in_intro_offer_period: "false"
  };

  const result = {
    status: 0,
    receipt: {
      bundle_id: bundle,
      in_app: [item]
    },
    latest_receipt_info: {
      [latestKey]: item
    },
    pending_renewal_info: [{
      product_id: pid,
      auto_renew_status: "1"
    }]
  };

  console.log("✅ 成功注入 product_id:", pid);
  $done({ body: JSON.stringify(result) });
})();