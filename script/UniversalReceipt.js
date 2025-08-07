/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/UniversalReceipt.js

[mitm]
hostname = buy.itunes.apple.com
*/

const body = JSON.parse($request.body || "{}");
const headers = $request.headers || {};
const bundle = body["bundle_id"] || body["bid"] || "unknown.app";

const productList = [
  "com.reader.1year",
  "HiReader_Annual",
  "HiReader_Lifetime",
  "HiReader_Monthly",
  "com.zerone.hidesktop.forever",
  "com.liangpin.hireader.vip",
  "forever",
  "year",
  "month"
];

// 默认选第一个匹配的 product_id
const product_id = productList.find(id => true) || "com.fake.product";
const transaction_id = "1000000999999999";
const expires_timestamp = 6707091199000; // 2999年
const now = Date.now();

const receiptItem = {
  quantity: "1",
  product_id,
  transaction_id,
  original_transaction_id: transaction_id,
  purchase_date: new Date(now).toUTCString(),
  purchase_date_ms: now.toString(),
  purchase_date_pst: new Date(now).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  original_purchase_date: new Date(now).toUTCString(),
  original_purchase_date_ms: now.toString(),
  original_purchase_date_pst: new Date(now).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  expires_date: new Date(expires_timestamp).toUTCString(),
  expires_date_ms: expires_timestamp.toString(),
  expires_date_pst: new Date(expires_timestamp).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  is_trial_period: "false",
  in_app_ownership_type: "PURCHASED"
};

const result = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    bundle_id: bundle,
    application_version: "9999",
    original_application_version: "1",
    receipt_creation_date: new Date(now).toUTCString(),
    receipt_creation_date_ms: now.toString(),
    receipt_creation_date_pst: new Date(now).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    request_date: new Date(now).toUTCString(),
    request_date_ms: now.toString(),
    request_date_pst: new Date(now).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    original_purchase_date: new Date(now).toUTCString(),
    original_purchase_date_ms: now.toString(),
    original_purchase_date_pst: new Date(now).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
    in_app: [receiptItem]
  },
  latest_receipt_info: [receiptItem],
  pending_renewal_info: [{
    auto_renew_product_id: product_id,
    product_id,
    original_transaction_id: transaction_id,
    auto_renew_status: "1"
  }],
  latest_receipt: "MIIFakeBase64=="
};

$done({ body: JSON.stringify(result) });