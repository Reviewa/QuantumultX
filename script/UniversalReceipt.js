/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/UniversalReceipt.js

[mitm]
hostname = buy.itunes.apple.com
*/

// App 匹配表：可添加多个 App
const appMap = {
  'BookReader': {
    cm: 'timea',
    hx: 'hxpda',
    id: 'com.reader.1year',
    latest: 'ddm1023'
  },
  'IScreen': {
    cm: 'timeb',
    hx: 'hxpic',
    id: 'com.zerone.hidesktop.forever',
    latest: 'screenmagic'
  },
  // 可继续添加其他 App 映射
};

const reqBody = typeof $request.body === 'string' ? $request.body : '';
let appMatch = null;

// 匹配关键字段：只要匹配上 cm 和 hx 的，就认为是对应 App
for (const key in appMap) {
  const app = appMap[key];
  if (reqBody.includes(app.cm) && reqBody.includes(app.hx)) {
    appMatch = app;
    break;
  }
}

// 没匹配到就返回原始数据
if (!appMatch) {
  $done({});
  return;
}

// 构造基础信息
const now = Date.now();
const expire_ms = 6707091199000; // 2999年
const utc = t => new Date(t).toUTCString();
const pst = t => new Date(t).toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
const pid = appMatch.id;
const tid = '1000000999999999';

// 单条订阅结构
const receiptItem = {
  quantity: "1",
  product_id: pid,
  transaction_id: tid,
  original_transaction_id: tid,
  purchase_date: utc(now),
  purchase_date_ms: now.toString(),
  purchase_date_pst: pst(now),
  original_purchase_date: utc(now),
  original_purchase_date_ms: now.toString(),
  original_purchase_date_pst: pst(now),
  expires_date: utc(expire_ms),
  expires_date_ms: expire_ms.toString(),
  expires_date_pst: pst(expire_ms),
  is_trial_period: "false",
  in_app_ownership_type: "PURCHASED"
};

// 构造完整收据结构
const obj = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    bundle_id: "com.auto.match." + appMatch.latest,
    application_version: "9999",
    original_application_version: "1",
    receipt_creation_date: utc(now),
    receipt_creation_date_ms: now.toString(),
    receipt_creation_date_pst: pst(now),
    request_date: utc(now),
    request_date_ms: now.toString(),
    request_date_pst: pst(now),
    original_purchase_date: utc(now),
    original_purchase_date_ms: now.toString(),
    original_purchase_date_pst: pst(now),
    in_app: [receiptItem]
  },
  latest_receipt_info: [receiptItem],
  pending_renewal_info: [{
    auto_renew_product_id: pid,
    product_id: pid,
    original_transaction_id: tid,
    auto_renew_status: "1"
  }],
  latest_receipt: "MIIFakeUniversalReceiptBase64=="
};

$done({ body: JSON.stringify(obj) });