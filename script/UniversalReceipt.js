/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/UniversalReceipt.js

[mitm]
hostname = buy.itunes.apple.com
*/

const now = Date.now();
const expireAt = 6707091199000; // 2999年
const toUTC = t => new Date(t).toUTCString();
const toPST = t => new Date(t).toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
const txn = "1000000999999999";

// 可支持多个 App，根据请求体关键词判断
const apps = [
  {
    match: ["timea", "hxpda"],
    bundle: "com.liangpin.hireader",
    product: "com.reader.1year"
  },//HiReader阅读器
  {
    match: ["timeb", "hxpic"],
    bundle: "com.zerone.hidesktop",
    product: "com.zerone.hidesktop.forever"
  },//iScreen-桌面小组件
  {
];

// 获取请求体（用字符串做匹配）
const bodyText = typeof $request.body === "string" ? $request.body : "";
let matched = null;

for (const app of apps) {
  if (app.match.every(key => bodyText.includes(key))) {
    matched = app;
    break;
  }
}

if (!matched) {
  // 匹配失败则忽略，不响应
  $done({});
  return;
}

// 构造 in_app 订阅数据
const sub = {
  quantity: "1",
  product_id: matched.product,
  transaction_id: txn,
  original_transaction_id: txn,
  purchase_date: toUTC(now),
  purchase_date_ms: `${now}`,
  purchase_date_pst: toPST(now),
  original_purchase_date: toUTC(now),
  original_purchase_date_ms: `${now}`,
  original_purchase_date_pst: toPST(now),
  expires_date: toUTC(expireAt),
  expires_date_ms: `${expireAt}`,
  expires_date_pst: toPST(expireAt),
  is_trial_period: "false",
  in_app_ownership_type: "PURCHASED"
};

// 构造完整响应体
const output = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    bundle_id: matched.bundle,
    application_version: "9999",
    original_application_version: "1.0",
    receipt_creation_date: toUTC(now),
    receipt_creation_date_ms: `${now}`,
    receipt_creation_date_pst: toPST(now),
    request_date: toUTC(now),
    request_date_ms: `${now}`,
    request_date_pst: toPST(now),
    original_purchase_date: toUTC(now),
    original_purchase_date_ms: `${now}`,
    original_purchase_date_pst: toPST(now),
    in_app: [sub]
  },
  latest_receipt_info: [sub],
  pending_renewal_info: [{
    auto_renew_product_id: matched.product,
    product_id: matched.product,
    original_transaction_id: txn,
    auto_renew_status: "1"
  }],
  latest_receipt: "MIIFakeBase64Universal=="
};

$done({ body: JSON.stringify(output) });