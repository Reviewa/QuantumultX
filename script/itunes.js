/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";

(async () => {
  const body = typeof $response?.body === "string" ? JSON.parse($response.body) : $response.body;
  const bundle = body?.receipt?.bundle_id || body?.receipt?.Bundle_Id || "";
  const encoded = encodeURIComponent(bundle);
  const now = Date.now();
  const forever = 4102415999000;

  let map = {};
  try {
    const resp = await new Promise((r) => $httpClient.get(remote, r));
    map = JSON.parse(resp?.data || "{}");
  } catch (e) {
    console.log("❌ subscriptionMap 加载失败:", e);
    $done({ body: JSON.stringify(body) });
    return;
  }

  const conf = map[encoded];
  if (!conf?.id) {
    console.log("⚠️ 未匹配订阅配置:", encoded);
    $done({ body: JSON.stringify(body) });
    return;
  }

  const ids = Array.isArray(conf.id) ? conf.id : [conf.id];
  const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

  const item = {
    quantity: "1",
    product_id: ids[0], // 强制返回第一个订阅 ID
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
      product_id: ids[0],
      auto_renew_status: "1"
    }],
    status: 0
  };

  $done({ body: JSON.stringify(output) });
})();