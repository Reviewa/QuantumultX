/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/purelibro.js

[mitm]
hostname = buy.itunes.apple.com

*/

var Qiq = JSON.parse($response.body);

Qiq.receipt = {
  "receipt_type": "Production",
  "bundle_id": "com.purelibro.reader",
  "in_app": [
    {
      "quantity": "1",
      "product_id": "reader.lifetime.pro",
      "transaction_id": "400000000000001",
      "original_transaction_id": "400000000000001",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    },
    {
      "quantity": "1",
      "product_id": "com.reader.autoRenewableMonth",
      "transaction_id": "400000000000002",
      "original_transaction_id": "400000000000002",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    },
    {
      "quantity": "1",
      "product_id": "com.reader.autoRenewableSeason",
      "transaction_id": "400000000000003",
      "original_transaction_id": "400000000000003",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    },
    {
      "quantity": "1",
      "product_id": "com.reader.permanentlyPro",
      "transaction_id": "400000000000004",
      "original_transaction_id": "400000000000004",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    },
    {
      "quantity": "1",
      "product_id": "com.reader.autoRenewableYearly",
      "transaction_id": "400000000000005",
      "original_transaction_id": "400000000000005",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    },
    {
      "quantity": "1",
      "product_id": "reader.lifetimeFamily.pro",
      "transaction_id": "400000000000006",
      "original_transaction_id": "400000000000006",
      "purchase_date": "2025-08-06T08:00:00Z",
      "original_purchase_date": "2025-08-06T08:00:00Z",
      "expires_date": "2099-08-06T08:00:00Z"
    }
  ]
};

Qiq.latest_receipt_info = Qiq.receipt.in_app;
Qiq.latest_receipt = "base64_placeholder";
Qiq.pending_renewal_info = [];

$done({ body: JSON.stringify(Qiq) });