/*
[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/purelibro.js

[mitm]
hostname = api.rc-backup.com
*/
let body = {
  request_date_ms: Date.now(),
  request_date: new Date().toISOString(),
  subscriber: {
    entitlements: {
      standard: {
        expires_date: "2099-12-31T12:00:00Z",
        product_identifier: "reader.lifetime.pro",
        purchase_date: "2023-09-01T11:00:00Z"
      }
    },
    first_seen: "2025-01-01T00:00:00Z",
    last_seen: "2025-01-01T00:00:00Z",
    original_app_user_id: "$RCAnonymousID:xxxxxx",
    subscriptions: {
      "reader.lifetime.pro": {
        expires_date: "2099-12-31T12:00:00Z",
        original_purchase_date: "2023-09-01T11:00:00Z",
        purchase_date: "2023-09-01T11:00:00Z",
        ownership_type: "PURCHASED",
        store: "app_store"
      }
    }
  }
};
$done({ body: JSON.stringify(body) });