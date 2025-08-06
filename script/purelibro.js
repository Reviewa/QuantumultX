/*

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/purelibro.js

[mitm]
hostname = api.rc-backup.com
*/

let Qiq = {
  request_date_ms: Date.now(),
  request_date: new Date().toISOString(),
  subscriber: {
    entitlements: {
      pro: {
        grace_period_expires_date: null,
        product_identifier: "reader.lifetime.pro",
        purchase_date: "2023-01-01T00:00:00Z"
      }
    },
    first_seen: "2023-01-01T00:00:00Z",
    last_seen: new Date().toISOString(),
    original_application_version: "1",
    original_purchase_date: "2023-01-01T00:00:00Z",
    other_purchases: {
      "reader.lifetime.pro": {
        purchase_date: "2023-01-01T00:00:00Z"
      },
      "reader.lifetimeFamily.pro": {
        purchase_date: "2023-01-01T00:00:00Z"
      },
      "com.reader.permanentlyPro": {
        purchase_date: "2023-01-01T00:00:00Z"
      },
      "com.reader.autoRenewableYearly": {
        purchase_date: "2023-01-01T00:00:00Z"
      },
      "com.reader.autoRenewableSeason": {
        purchase_date: "2023-01-01T00:00:00Z"
      },
      "com.reader.autoRenewableMonth": {
        purchase_date: "2023-01-01T00:00:00Z"
      }
    },
    management_url: null,
    subscriptions: {
      "reader.lifetime.pro": {
        billing_issues_detected_at: null,
        expires_date: null,
        is_sandbox: false,
        original_purchase_date: "2023-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        period_type: "normal",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      "reader.lifetimeFamily.pro": {
        billing_issues_detected_at: null,
        expires_date: null,
        is_sandbox: false,
        original_purchase_date: "2023-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        period_type: "normal",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      "com.reader.permanentlyPro": {
        billing_issues_detected_at: null,
        expires_date: null,
        is_sandbox: false,
        original_purchase_date: "2023-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        period_type: "normal",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      "com.reader.autoRenewableYearly": {
        billing_issues_detected_at: null,
        expires_date: "2099-12-31T23:59:59Z",
        is_sandbox: false,
        original_purchase_date: "2023-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        period_type: "normal",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      "com.reader.autoRenewableSeason": {
        billing_issues_detected_at: null,
        expires_date: "2099-12-31T23:59:59Z",
        is_sandbox: false,
        original_purchase_date: "2023-01-01T00:00:00Z",
        ownership_type: "PURCHASED",
        period_type: "normal",
        purchase_date: "2023-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      "com.reader.autoRenewableMonth": {
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

$done({ body: JSON.stringify(Qiq) });