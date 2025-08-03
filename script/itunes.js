/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";

(async () => {
  const body = typeof $response?.body === "string" ? JSON.parse($response.body) : $response.body;
  const receipt = body?.receipt;
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

  // 收集所有配置的 id ➝ 反向映射
  const idMap = {};
  for (const key in map) {
    const entry = map[key];
    if (!entry?.id) continue;
    const ids = Array.isArray(entry.id) ? entry.id : [entry.id];
    ids.forEach(id => { idMap[id] = entry; });
  }

  // 查找 App 请求的所有 product_id
  const inApp = receipt?.in_app || [];
  const requestedIds = inApp.map(i => i.product_id).filter(Boolean);

  // 匹配你配置中的某个 ID
  let matchedId = null;
  let matchedConf = null;
  for (const pid of requestedIds) {
    if (idMap[pid]) {
      matchedId = pid;
      matchedConf = idMap[pid];
      break;
    }
  }

  // 找不到匹配 ID，返回原始响应
  if (!matchedId) {
    console.log("⚠️ 未识别出有效 product_id：", requestedIds);
    $done({ body: JSON.stringify(body) });
    return;
  }

  const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);
  const item = {
    quantity: "1",
    product_id: matchedId,
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
      bundle_id: receipt.bundle_id,
      in_app: [item]
    },
    latest_receipt_info: [item],
    pending_renewal_info: [{
      product_id: matchedId,
      auto_renew_status: "1"
    }],
    status: 0
  };

  $done({ body: JSON.stringify(output) });
})();