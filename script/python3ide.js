/*

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/python3ide.js

[mitm]
hostname = api.revenuecat.com

*/

let Qiq = JSON.parse($response.body);

let now = new Date();
let expire = new Date("2099-12-31T23:59:59Z").toISOString();

Qiq.subscriber = {
  non_subscriptions: {},
  other_purchases: {},
  first_seen: now.toISOString(),
  original_purchase_date: "2025-01-01T00:00:00Z",
  original_app_user_id: "$RCAnonymousID:mocked",
  last_seen: now.toISOString(),
  management_url: null,
  subscriptions: {
    "python3ide_one_month": {
      purchase_date: "2025-01-01T00:00:00Z",
      original_purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire,
      store: "app_store",
      ownership_type: "PURCHASED"
    },
    "python3ide_six_month": {
      purchase_date: "2025-01-01T00:00:00Z",
      original_purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire,
      store: "app_store",
      ownership_type: "PURCHASED"
    },
    "python3ide_annual": {
      purchase_date: "2025-01-01T00:00:00Z",
      original_purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire,
      store: "app_store",
      ownership_type: "PURCHASED"
    },
    "baobaowang.Python3IDE": {
      purchase_date: "2025-01-01T00:00:00Z",
      original_purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire,
      store: "app_store",
      ownership_type: "PURCHASED"
    }
  },
  entitlements: {
    pro: {
      product_identifier: "python3ide_annual",
      purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire
    },
    lifetime: {
      product_identifier: "baobaowang.Python3IDE",
      purchase_date: "2025-01-01T00:00:00Z",
      expires_date: expire
    }
  }
};

$done({ body: JSON.stringify(Qiq) });