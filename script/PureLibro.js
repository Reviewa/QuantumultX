/*
[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/(RCAnonymousID%3A)?[a-zA-Z0-9]+ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/PureLibro.js

[mitm]
hostname = api.rc-backup.com
*/

let body = {
  subscriber: {
    entitlements: {
      pro: {
        expires_date: null,
        product_identifier: "reader.lifetime.pro",
        purchase_date: "2024-01-01T00:00:00Z"
      }
    },
    first_seen: "2024-01-01T00:00:00Z",
    original_application_version: "1",
    original_purchase_date: "2024-01-01T00:00:00Z",
    subscriptions: {
      "reader.lifetime.pro": {
        purchase_date: "2024-01-01T00:00:00Z",
        original_purchase_date: "2024-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        store: "app_store",
        expires_date: null
      }
    }
  }
};
$done({ body: JSON.stringify(body) });