/*

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/receipts$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/PicSeed.js

[mitm]
hostname = api.rc-backup.com

*/

let obj = JSON.parse($response.body);

obj.subscriber = {
  non_subscriptions: {},
  first_seen: "2025-10-13T03:21:53Z",
  original_application_version: "57",
  other_purchases: {},
  management_url: "https://apps.apple.com/account/subscriptions",
  subscriptions: {
    "com.yourapp.premium.lifetime": {
      billing_issues_detected_at: null,
      expires_date: null,
      grace_period_expires_date: null,
      is_sandbox: false,
      original_purchase_date: "2025-10-13T03:22:21Z",
      period_type: "normal",
      purchase_date: "2025-10-13T03:22:21Z",
      store: "app_store",
      unsubscribe_detected_at: null
    }
  },
  entitlements: {
    premium: {
      product_identifier: "com.yourapp.premium.lifetime",
      expires_date: null,
      purchase_date: "2025-10-13T03:22:21Z"
    }
  },
  original_purchase_date: "2024-07-04T21:31:10Z",
  original_app_user_id: "$RCAnonymousID:937e50881e8147be8746bb20bc8a9027",
  last_seen: "2025-10-13T03:21:53Z"
};

$done({ body: JSON.stringify(obj) });