/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/hireader.js

[mitm]
hostname = buy.itunes.apple.com

*/

const Qiq = JSON.parse($response.body);
const headers = $request.headers;
const ua = headers["User-Agent"] || headers["user-agent"] || "";
const receipt = Qiq.receipt || {};
const bundle = receipt.bundle_id || receipt.Bundle_Id || "com.reader.epub";

const now = Math.floor(Date.now() / 1000);
const future = now + 10 * 365 * 24 * 60 * 60;

const subs = [
  "com.reader.1year",
  `${bundle}.year`,
  `${bundle}.yearly`,
  `${bundle}.yearlysubscription`,
  `${bundle}.lifetime`,
];

Qiq.status = 0;
Qiq.environment = "Production";
Qiq.latest_receipt_info = subs.map((id, idx) => ({
  quantity: "1",
  product_id: id,
  transaction_id: `${now}000${idx}`,
  original_transaction_id: `${now}000001`,
  purchase_date_ms: `${now * 1000}`,
  original_purchase_date_ms: `${now * 1000}`,
  expires_date_ms: `${future * 1000}`,
  is_in_intro_offer_period: "false",
  is_trial_period: "false",
  in_app_ownership_type: "PURCHASED",
  subscription_group_identifier: "99999999",
}));

Qiq.receipt.in_app = Qiq.latest_receipt_info;
Qiq.latest_receipt = "Qiq_Generated_Fake_Receipt";
Qiq.pending_renewal_info = subs.map((id) => ({
  auto_renew_product_id: id,
  original_transaction_id: `${now}000001`,
  product_id: id,
  auto_renew_status: "1",
}));

$done({ body: JSON.stringify(Qiq) });