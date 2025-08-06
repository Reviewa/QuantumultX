/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/hireader.js

[mitm]
hostname = buy.itunes.apple.com

*/

const Qiq = JSON.parse($response.body);
const bundle = Qiq.receipt?.bundle_id || Qiq.receipt?.Bundle_Id || "com.reader";
const now = new Date();
const futureDate = "2099-12-30T00:00:00Z";

const subid = "com.reader.1year";

const info = {
  "quantity": "1",
  "product_id": subid,
  "transaction_id": "1000000000000000",
  "original_transaction_id": "1000000000000000",
  "purchase_date": now.toISOString(),
  "purchase_date_ms": now.getTime().toString(),
  "purchase_date_pst": now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  "original_purchase_date": now.toISOString(),
  "original_purchase_date_ms": now.getTime().toString(),
  "original_purchase_date_pst": now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  "expires_date": futureDate,
  "expires_date_ms": new Date(futureDate).getTime().toString(),
  "expires_date_pst": new Date(futureDate).toLocaleString("en-US", { timeZone: "America/Los_Angeles" }),
  "is_in_intro_offer_period": "false",
  "is_trial_period": "false",
  "in_app_ownership_type": "PURCHASED",
  "subscription_group_identifier": "99999999"
};

Qiq.status = 0;
Qiq.environment = "Production";
Qiq.receipt.in_app = [info];
Qiq.latest_receipt_info = [info];
Qiq.pending_renewal_info = [{
  "auto_renew_product_id": subid,
  "original_transaction_id": "1000000000000000",
  "product_id": subid,
  "auto_renew_status": "1"
}];

$done({ body: JSON.stringify(Qiq) });