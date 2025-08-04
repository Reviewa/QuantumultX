/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

(async () => {
  const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";

  let resBody;
  try {
    resBody = typeof $response?.body === "string" ? JSON.parse($response.body) : $response.body;
  } catch (e) {
    console.log("❌ 无法解析响应体:", e);
    return $done({});
  }

  const now = Date.now();
  const forever = 4102415999000;
  const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

  // 尝试获取 bundle_id
  let bundle = resBody?.receipt?.bundle_id || resBody?.receipt?.Bundle_Id;
  let encoded = "";

  if (typeof bundle === "string" && bundle.length > 1) {
    encoded = encodeURIComponent(bundle);
    console.log("🧾 当前 bundle_id:", bundle);
  } else {
    encoded = "*";
    bundle = "fake.bundle.id"; // fallback 时注入用默认 ID
    console.log("⚠️ 未检测到有效 bundle_id，将使用 fallback");
  }

  // 加载远程 subscriptionMap.json
  let map = {};
  try {
    const resp = await new Promise(r => $httpClient.get(remote, r));
    map = JSON.parse(resp?.data || "{}");
  } catch (e) {
    console.log("❌ 配置加载失败:", e);
    return $done({ body: JSON.stringify(resBody) });
  }

  console.log("📦 配置 keys:", Object.keys(map));
  const conf = map[encoded] || map["*"];

  if (!conf?.id) {
    console.log("❌ 无法匹配订阅 ID:", encoded);
    return $done({ body: JSON.stringify({ foo: "bar" }) });
  }

  const pid = conf.id;
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

  const output = {
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

  console.log("✅ 注入成功:", pid);
  $done({ body: JSON.stringify(output) });
})();