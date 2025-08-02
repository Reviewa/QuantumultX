/*
[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/PureLibro.js

[mitm]
hostname = api.rc-backup.com
*/

let body = {
  request_date_ms: Date.now(),
  request_date: new Date().toISOString(),
  subscriber: {
    non_subscriptions: {},
    first_seen: "2025-06-18T16:30:38Z",
    original_application_version: "184",
    other_purchases: {},
    management_url: null,
    subscriptions: {
      "vd_monthly_999": {
        store: "app_store",
        purchase_date: "2023-09-01T11:00:00Z",
        ownership_type: "PURCHASED",
        original_purchase_date: "2023-09-01T11:00:00Z",
        expires_date: "2099-12-31T12:00:00Z"
      }
    },
    entitlements: {
      "standard": {
        store: "app_store",
        purchase_date: "2023-09-01T11:00:00Z",
        ownership_type: "PURCHASED",
        original_purchase_date: "2023-09-01T11:00:00Z",
        product_identifier: "vd_monthly_999",
        expires_date: "2099-12-31T12:00:00Z"
      }
    },
    original_purchase_date: "2023-07-22T00:13:15Z",
    original_app_user_id: "$RCAnonymousID:9368C18C930C4AE3AAA325933DBB9409",
    last_seen: new Date().toISOString()
  }
};

$done({ body: JSON.stringify(body) });