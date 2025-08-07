/*
// 通用 Apple 内购解锁脚本 - 

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/iTunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const apps = [
  {
    match: ["hireader", "liangpin"],
    bundle: "com.liangpin.hireader",
    product: "HiReader_Lifetime"
  },
  {
    match: ["iscreen", "hidesktop"],
    bundle: "com.zerone.hidesktop",
    product: "com.zerone.hidesktop.forever"
  },
  {
    match: ["intolive", "imgbase"],
    bundle: "me.imgbase.intolive",
    product: "me.imgbase.intolive.proSubYearly"
  }
];

// 匹配当前请求中的 bundle_id
function matchApp(body) {
  try {
    const req = JSON.parse(body);
    const receipt = req?.['receipt-data'] || '';
    const decoded = Buffer.from(receipt, 'base64').toString();
    const info = JSON.parse(decoded);
    const bundle = info?.bundle_id || info?.receipt?.bundle_id || "";
    return apps.find(app => app.match.some(k => bundle.includes(k)));
  } catch (e) {
    return null;
  }
}

// 生成伪造收据
function generateReceipt(bundleId, productId) {
  const fakePurchase = {
    quantity: "1",
    product_id: productId,
    transaction_id: "1000000000000000",
    original_transaction_id: "1000000000000000",
    purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    purchase_date_ms: "32503626000000",
    purchase_date_pst: "2999-09-09 01:09:09 America/Los_Angeles",
    original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    original_purchase_date_ms: "32503626000000",
    original_purchase_date_pst: "2999-09-09 01:09:09 America/Los_Angeles",
    is_trial_period: "false",
    in_app_ownership_type: "PURCHASED"
  };

  return {
    status: 0,
    environment: "Production",
    receipt: {
      receipt_type: "Production",
      bundle_id: bundleId,
      application_version: "1.0",
      original_application_version: "1.0",
      receipt_creation_date: "2999-09-09 09:09:09 Etc/GMT",
      receipt_creation_date_ms: "32503626000000",
      receipt_creation_date_pst: "2999-09-09 01:09:09 America/Los_Angeles",
      request_date: "2999-09-09 09:09:09 Etc/GMT",
      request_date_ms: "32503626000000",
      request_date_pst: "2999-09-09 01:09:09 America/Los_Angeles",
      original_purchase_date: "2023-01-01 00:00:00 Etc/GMT",
      original_purchase_date_ms: "1672531200000",
      original_purchase_date_pst: "2022-12-31 16:00:00 America/Los_Angeles",
      in_app: [fakePurchase]
    },
    latest_receipt_info: [fakePurchase]
  };
}

// 主逻辑
const app = matchApp($request?.body || "");
if (app) {
  const result = generateReceipt(app.bundle, app.product);
  $done({ body: JSON.stringify(result) });
} else {
  // 没有匹配，返回原始内容（或者 status 21010 错误）
  $done({ body: JSON.stringify({ status: 21010 }) });
}