/*

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/purelibro.js

[mitm]
hostname = api.rc-backup.com

*/

let Qiq = JSON.parse($response.body);

Qiq.subscriber = Qiq.subscriber || {};
Qiq.subscriber.entitlements = {
  pro: {
    expires_date: "2099-12-31T23:59:59Z",
    product_identifier: "reader.lifetime.pro",
    purchase_date: "2023-01-01T00:00:00Z"
  }
};
Qiq.subscriber.original_purchase_date = "2023-01-01T00:00:00Z";
Qiq.subscriber.subscriptions = {
  "reader.lifetime.pro": {
    billing_issues_detected_at: null,
    expires_date: "2099-12-31T23:59:59Z",
    is_sandbox: false,
    original_purchase_date: "2023-01-01T00:00:00Z",
    period_type: "lifetime",
    purchase_date: "2023-01-01T00:00:00Z",
    store: "app_store",
    unsubscribe_detected_at: null
  }
};

$done({ body: JSON.stringify(Qiq) });