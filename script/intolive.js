/*
QuantumultX
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/intolive.js

[mitm]
hostname = buy.itunes.apple.com
*/

let Qiq = JSON.parse($response.body);

Qiq.status = 0;
Qiq.environment = 'Production';

Qiq.receipt = Qiq.receipt || {};
Qiq.receipt.in_app = [
  {
    quantity: "1",
    product_id: "me.imgbase.intolive.proSubYearly2024",
    transaction_id: "666000666000666",
    original_transaction_id: "666000666000666",
    purchase_date: "2025-08-01 00:00:00 Etc/GMT",
    purchase_date_ms: "1754006400000",
    purchase_date_pst: "2025-07-31 17:00:00 America/Los_Angeles",
    original_purchase_date: "2025-08-01 00:00:00 Etc/GMT",
    original_purchase_date_ms: "1754006400000",
    original_purchase_date_pst: "2025-07-31 17:00:00 America/Los_Angeles",
    expires_date: "2099-12-31 23:59:59 Etc/GMT",
    expires_date_ms: "4102415999000",
    expires_date_pst: "2099-12-31 15:59:59 America/Los_Angeles",
    is_in_intro_offer_period: "false",
    is_trial_period: "false",
    ownership_type: "PURCHASED",
    web_order_line_item_id: "666000666000666"
  }
];

Qiq.latest_receipt_info = Qiq.receipt.in_app;
Qiq.pending_renewal_info = [
  {
    auto_renew_product_id: "me.imgbase.intolive.proSubYearly2024",
    original_transaction_id: "666000666000666",
    product_id: "me.imgbase.intolive.proSubYearly2024",
    auto_renew_status: "1"
  }
];

$done({ body: JSON.stringify(Qiq) });