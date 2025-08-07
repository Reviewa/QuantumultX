/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/UniversalReceipt.js

[mitm]
hostname = buy.itunes.apple.com
*/

const now = Date.now();
const expiry = 6707091199000; // 2999年
const UTC = t => new Date(t).toUTCString();
const PST = t => new Date(t).toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
const tid = "1000000999999999";

// App 识别配置：匹配关键字段 → 指定 product_id 和 bundle_id
const appRules = [
  {
    keyword: ["timea", "hxpda"],
    product_id: "com.reader.1year",
    bundle_id: "com.liangpin.hireader"
  },
  {
    keyword: ["timeb", "hxpic"],
    product_id: "com.zerone.hidesktop.forever",
    bundle_id: "com.zerone.hidesktop"
  }
  // 你可以继续添加更多 App 规则
];

const req = typeof $request.body === "string" ? $request.body : "";
let appConfig = null;

// 自动匹配 App 配置
for (let rule of appRules) {
  if (rule.keyword.every(k => req.includes(k))) {
    appConfig = rule;
    break;
  }
}

// 如果未匹配成功，返回原始响应
if (!appConfig) {
  $done({});
  return;
}

// 构造单条内购数据
const item = {
  quantity: "1",
  product_id: appConfig.product_id,
  transaction_id: tid,
  original_transaction_id: tid,
  purchase_date: UTC(now),
  purchase_date_ms: `${now}`,
  purchase_date_pst: PST(now),
  original_purchase_date: UTC(now),
  original_purchase_date_ms: `${now}`,
  original_purchase_date_pst: PST(now),
  expires_date: UTC(expiry),
  expires_date_ms: `${expiry}`,
  expires_date_pst: PST(expiry),
  is_trial_period: "false",
  in_app_ownership_type: "PURCHASED"
};

// 最终输出结构
const result = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    bundle_id: appConfig.bundle_id,
    application_version: "9999",
    original_application_version: "1.0",
    receipt_creation_date: UTC(now),
    receipt_creation_date_ms: `${now}`,
    receipt_creation_date_pst: PST(now),
    request_date: UTC(now),
    request_date_ms: `${now}`,
    request_date_pst: PST(now),
    original_purchase_date: UTC(now),
    original_purchase_date_ms: `${now}`,
    original_purchase_date_pst: PST(now),
    in_app: [item]
  },
  latest_receipt_info: [item],
  pending_renewal_info: [{
    auto_renew_product_id: appConfig.product_id,
    product_id: appConfig.product_id,
    original_transaction_id: tid,
    auto_renew_status: "1"
  }],
  latest_receipt: "MIIFakeUniversalReceiptBase64=="
};

$done({ body: JSON.stringify(result) });