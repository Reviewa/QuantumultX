/*
 * @name RevenueCat 通杀接口模拟
 * @version 1.0.0
 * @description 伪造 RevenueCat 响应，实现通杀
 * @compatible QuantumultX, Loon
 * @author Reviewa
 * @github https://github.com/Reviewa/QuantumultX
 */

const body = {
  request_date: "2025-01-01T00:00:00Z",
  request_date_ms: 1735689600000,
  subscriber: {
    entitlements: {
      pro: {
        expires_date: "2099-12-31T23:59:59Z",
        grace_period_expires_date: null,
        product_identifier: "com.yourapp.pro",
        purchase_date: "2020-01-01T00:00:00Z"
      }
    },
    first_seen: "2020-01-01T00:00:00Z",
    last_seen: "2025-01-01T00:00:00Z",
    management_url: null,
    original_app_user_id: "$RCAnonymousID:00000000000000000000000000",
    original_application_version: "1.0",
    original_purchase_date: "2020-01-01T00:00:00Z",
    other_purchases: {},
    subscriptions: {
      "com.yourapp.pro": {
        billing_issues_detected_at: null,
        expires_date: "2099-12-31T23:59:59Z",
        is_sandbox: false,
        original_purchase_date: "2020-01-01T00:00:00Z",
        period_type: "active",
        purchase_date: "2020-01-01T00:00:00Z",
        store: "app_store",
        unsubscribe_detected_at: null
      }
    }
  }
};

$done({ body: JSON.stringify(body) });
