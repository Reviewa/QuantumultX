/*

[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Hireader.js

[mitm]
hostname = buy.itunes.apple.com

*/

let o = JSON.parse($response.body);
let p = "com.reader.1year";
let t = Math.floor(Date.now() / 1000);
let e = 6707091199;
let f = {
    "quantity": "1",
    "product_id": p,
    "transaction_id": "520000000000000",
    "original_transaction_id": "520000000000000",
    "purchase_date_ms": `${t}000`,
    "purchase_date": new Date(t * 1000).toUTCString(),
    "purchase_date_pst": new Date(t * 1000).toLocaleString(),
    "original_purchase_date": new Date(t * 1000).toUTCString(),
    "original_purchase_date_ms": `${t}000`,
    "original_purchase_date_pst": new Date(t * 1000).toLocaleString(),
    "expires_date": new Date(e * 1000).toUTCString(),
    "expires_date_ms": `${e}000`,
    "expires_date_pst": new Date(e * 1000).toLocaleString(),
    "web_order_line_item_id": "520000000000000",
    "is_trial_period": "false",
    "is_in_intro_offer_period": "false"
};
o.receipt.in_app = [f];
o.latest_receipt_info = [f];
o.pending_renewal_info = [{
    "auto_renew_product_id": p,
    "product_id": p,
    "original_transaction_id": "520000000000000",
    "auto_renew_status": "1"
}];
$done({ body: JSON.stringify(o) });