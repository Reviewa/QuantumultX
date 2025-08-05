/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const Qiq = {
  "status": 0,
  "environment": "Production",
  "receipt": {
    "receipt_type": "Production",
    "bundle_id": "me.imgbase.intolive.proSubMonthly",
    "in_app": [
      {
        "quantity": "1",
        "product_id": "me.imgbase.intolive.proSubYearly",
        "transaction_id": "1000000000000000",
        "original_transaction_id": "1000000000000000",
        "purchase_date": "2023-01-01T00:00:00Z",
        "original_purchase_date": "2023-01-01T00:00:00Z",
        "expires_date": "2099-12-31T23:59:59Z",
        "is_in_intro_offer_period": "false",
        "is_trial_period": "false"
      }
    ],
    "application_version": "1",
    "original_purchase_date": "2023-01-01T00:00:00Z"
  },
  "latest_receipt_info": [
    {
      "quantity": "1",
      "product_id": "me.imgbase.intolive.proSubYearly",
      "transaction_id": "1000000000000000",
      "original_transaction_id": "1000000000000000",
      "purchase_date": "2023-01-01T00:00:00Z",
      "original_purchase_date": "2023-01-01T00:00:00Z",
      "expires_date": "2099-12-31T23:59:59Z",
      "is_in_intro_offer_period": "false",
      "is_trial_period": "false"
    }
  ],
  "latest_receipt": "Qiq_Fake_Receipt_Base64==",
  "pending_renewal_info": [
    {
      "product_id": "me.imgbase.intolive.proSubYearly",
      "auto_renew_status": "1"
    }
  ]
};

$done({ body: JSON.stringify(Qiq) });