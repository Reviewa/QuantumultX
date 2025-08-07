/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Hireader.js

[mitm]
hostname = buy.itunes.apple.com
*/

let product_id = "HiReader_Lifetime"; // 也可以换成 HiReader_Annual、HiReader_Monthly
let transaction_id = "1000000999999999";
let timestamp = 32503626054000; // 2999年

let obj = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    bundle_id: "com.liangpin.hireader",
    application_version: "9999",
    original_application_version: "1",
    receipt_creation_date: "2999-09-09 09:09:09 Etc/GMT",
    receipt_creation_date_ms: `${timestamp}`,
    receipt_creation_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    request_date: "2999-09-09 09:09:09 Etc/GMT",
    request_date_ms: `${timestamp}`,
    request_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    original_purchase_date: "2020-01-01 00:00:00 Etc/GMT",
    original_purchase_date_ms: "1577836800000",
    original_purchase_date_pst: "2019-12-31 16:00:00 America/Los_Angeles",
    in_app: [{
      quantity: "1",
      product_id: product_id,
      transaction_id: transaction_id,
      original_transaction_id: transaction_id,
      purchase_date: "2999-09-09 09:09:09 Etc/GMT",
      purchase_date_ms: `${timestamp}`,
      purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
      original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
      original_purchase_date_ms: `${timestamp}`,
      original_purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
      is_trial_period: "false",
      in_app_ownership_type: "PURCHASED"
    }]
  },
  latest_receipt_info: [{
    quantity: "1",
    product_id: product_id,
    transaction_id: transaction_id,
    original_transaction_id: transaction_id,
    purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    purchase_date_ms: `${timestamp}`,
    purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    original_purchase_date_ms: `${timestamp}`,
    original_purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    is_trial_period: "false",
    in_app_ownership_type: "PURCHASED"
  }],
  latest_receipt: "MIIFakeBase64=="
};

$done({ body: JSON.stringify(obj) });