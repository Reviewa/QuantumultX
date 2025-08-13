/*
 小作卡片 解锁 VIP  3.7.0

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/(subscribers|receipts|product_entitlement_mapping) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Xiaozuokapian.js

[mitm]
hostname = api.rc-backup.com

*/

const url = $request.url;
let body = {};

if (url.includes("/v1/product_entitlement_mapping")) {
  body = {
    product_entitlement_mapping: {
      card_y_28: {
        product_identifier: "card_y_28",
        entitlements: ["vip"]
      },
      card_m_3: {
        product_identifier: "card_m_3",
        entitlements: ["vip"]
      },
      card_vip: {
        product_identifier: "card_vip",
        entitlements: ["vip"]
      }
    }
  };
}

if (url.includes("/v1/subscribers") || url.includes("/v1/receipts")) {
  body = {
    request_date_ms: Date.now(),
    request_date: new Date().toISOString(),
    subscriber: {
      entitlements: {
        vip: {
          expires_date: "2099-12-31T23:59:59Z",
          purchase_date: "2023-01-01T00:00:00Z",
          product_identifier: "card_y_28"
        }
      },
      first_seen: "2023-01-01T00:00:00Z",
      last_seen: new Date().toISOString(),
      original_app_user_id: "$RCAnonymousID:00000000000000000000000000000000",
      subscriptions: {
        card_y_28: {
          billing_issues_detected_at: null,
          expires_date: "2099-12-31T23:59:59Z",
          is_sandbox: false,
          original_purchase_date: "2023-01-01T00:00:00Z",
          ownership_type: "PURCHASED",
          period_type: "normal",
          purchase_date: "2023-01-01T00:00:00Z",
          store: "app_store",
          unsubscribe_detected_at: null
        }
      }
    }
  };
}

$done({ body: JSON.stringify(body) });