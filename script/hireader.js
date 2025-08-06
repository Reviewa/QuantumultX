/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/hireader.js

[mitm]
hostname = buy.itunes.apple.com

*/

const Qiq = {
  receipt: {
    receipt_type: "Production",
    bundle_id: "com.hireader.reader",
    in_app: [
      {
        quantity: "1",
        product_id: "com.reader.1year",
        transaction_id: "2000000000000000",
        original_transaction_id: "2000000000000000",
        purchase_date: "2025-08-06T08:08:08Z",
        original_purchase_date: "2025-08-06T08:08:08Z",
        expires_date: "2099-08-06T08:08:08Z",
        expires_date_ms: "4080000000000",
        expires_date_pst: "2099-08-06T00:08:08Z",
        is_in_intro_offer_period: "false",
        is_trial_period: "false",
        original_purchase_date_ms: "1691285288000",
        purchase_date_ms: "1691285288000"
      }
    ]
  },
  latest_receipt_info: [
    {
      quantity: "1",
      product_id: "com.reader.1year",
      transaction_id: "2000000000000000",
      original_transaction_id: "2000000000000000",
      purchase_date: "2025-08-06T08:08:08Z",
      original_purchase_date: "2025-08-06T08:08:08Z",
      expires_date: "2099-08-06T08:08:08Z",
      expires_date_ms: "4080000000000",
      expires_date_pst: "2099-08-06T00:08:08Z",
      is_in_intro_offer_period: "false",
      is_trial_period: "false",
      original_purchase_date_ms: "1691285288000",
      purchase_date_ms: "1691285288000"
    }
  ],
  latest_receipt: "Qiq_Fake_Receipt",
  pending_renewal_info: [
    {
      auto_renew_product_id: "com.reader.1year",
      original_transaction_id: "2000000000000000",
      product_id: "com.reader.1year",
      auto_renew_status: "1"
    }
  ],
  status: 0
};

$done({ body: JSON.stringify(Qiq) });