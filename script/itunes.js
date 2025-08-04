/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

(async () => {
  const remote = "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/config/subscriptionMap.json";

  try {
    const resBody = typeof $response?.body === "string" ? JSON.parse($response.body) : $response.body;
    const headers = $request?.headers || {};
    const ua = headers["User-Agent"] || headers["user-agent"] || "";

    const bundle = resBody?.receipt?.bundle_id || resBody?.receipt?.Bundle_Id || "";
    const encoded = encodeURIComponent(bundle);
    const now = Date.now();
    const forever = 4102415999000;
    const tid = "66" + Math.floor(1e12 + Math.random() * 9e12);

    // 拉取远程配置
    let map = {};
    try {
      const resp = await new Promise(r => $httpClient.get(remote, r));
      map = JSON.parse(resp?.data || "{}");
    } catch (e) {
      console.log("❌ 远程配置拉取失败:", e);
    }

    // 查找匹配 ID（支持 fallback）
    const conf = map[encoded] || map["*"];
    if (!conf?.id) {
      console.log("❌ 无法匹配订阅 ID:", encoded, "| UA:", ua);
      return $done({ body: JSON.stringify(resBody) });
    }

    // 构造订阅项目（4 种形式）
    const ids = [
      conf.id,
      `${bundle}.year`,
      `${bundle}.yearly`,
      `${bundle}.lifetime`
    ];

    const items = ids.map(pid => ({
      quantity: "1",
      product_id: pid,
      transaction_id: tid,
      original_transaction_id: tid,
      purchase_date_ms: `${now}`,
      original_purchase_date_ms: `${now}`,
      expires_date_ms: `${forever}`,
      is_trial_period: "false",
      is_in_intro_offer_period: "false"
    }));

    const result = {
      receipt: {
        bundle_id: bundle,
        in_app: items
      },
      latest_receipt_info: items,
      pending_renewal_info: ids.map(id => ({
        product_id: id,
        auto_renew_status: "1"
      })),
      status: 0
    };

    $done({ body: JSON.stringify(result) });

  } catch (err) {
    console.log("❌ 解锁脚本异常:", err);
    $done({});
  }
})();