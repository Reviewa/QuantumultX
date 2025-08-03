/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";

(async () => {
  const r = typeof $response?.body === "string" ? JSON.parse($response.body) : $response.body;
  const h = $request.headers || {};
  const ua = h["User-Agent"] || h["user-agent"] || "";
  const b = r?.receipt?.bundle_id || r?.receipt?.Bundle_Id || "";
  const now = Date.now();
  const long = 4102415999000;
  const keys = [ua, b].map(i => encodeURIComponent(i).trim()).filter(Boolean);

  let map = {};
  try {
    const res = await new Promise(cb => $httpClient.get(remote, cb));
    map = JSON.parse(res?.data || "{}");
  } catch (e) {
    $done({ body: JSON.stringify(r) });
    return;
  }

  let id;
  for (const k of keys) {
    if (map[k]?.id) {
      id = map[k].id;
      break;
    }
  }
  if (!id && map["*"]?.id) {
    id = map["*"].id;
  }
  if (!id) {
    $done({ body: JSON.stringify(r) });
    return;
  }

  const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);
  const item = {
    quantity: "1",
    product_id: id,
    transaction_id: tid,
    original_transaction_id: tid,
    purchase_date_ms: `${now}`,
    original_purchase_date_ms: `${now}`,
    expires_date_ms: `${long}`,
    is_trial_period: "false",
    is_in_intro_offer_period: "false"
  };

  const output = {
    receipt: {
      bundle_id: b,
      in_app: [item]
    },
    latest_receipt_info: [item],
    pending_renewal_info: [{
      product_id: id,
      auto_renew_status: "1"
    }],
    status: 0
  };

  $done({ body: JSON.stringify(output) });
})();