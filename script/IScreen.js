/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/IScreen.js

[mitm]
hostname = buy.itunes.apple.com

*/
let obj = JSON.parse($response.body)

obj.status = 0
obj.environment = "Production"
obj.receipt = obj.receipt || {}
obj.receipt.bundle_id = "com.zerone.hidesktop"
obj.receipt.in_app = [
  {
    quantity: "1",
    product_id: "com.zerone.hidesktop.forever",
    transaction_id: "999999999999999",
    original_transaction_id: "999999999999999",
    purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    purchase_date_ms: "32503626054000",
    purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
    original_purchase_date_ms: "32503626054000",
    original_purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    is_trial_period: "false",
    in_app_ownership_type: "PURCHASED"
  }
]

obj.latest_receipt_info = obj.receipt.in_app
obj.latest_receipt = "1"

$done({ body: JSON.stringify(obj) })
