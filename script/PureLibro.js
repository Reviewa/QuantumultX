/*
[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/v1\/subscribers\/(RCAnonymousID%3A)?[a-zA-Z0-9]+ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/purelibro-pro.js

[mitm]
hostname = api.revenuecat.com, api.rc-backup.com
*/

let body = JSON.stringify({
  request_date_ms: Date.now(),
  request_date: new Date().toISOString(),
  subscriber: {
    non_subscriptions: {},
    first_seen: "2023-01-01T00:00:00Z",
    original_application_version: "1",
    entitlements: {
      pro: {
        expires_date: null,
        product_identifier: "reader.lifetime.pro",
        purchase_date: "2023-01-01T00:00:00Z"
      }
    },
    subscriptions: {
      "reader.lifetime.pro": {
        original_purchase_date: "2023-01-01T00:00:00Z",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        ownership_type: "PURCHASED",
        expires_date: null
      }
    }
  }
});

$done({ body });