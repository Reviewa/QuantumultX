/*

[rewrite_local]
^https?:\/\/api\.revenuecat\.com\/v1\/subscribers\/\S+\/offerings url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Python.js

[mitm]
hostname = api.revenuecat.com

*/

var body = {
  "subscriber": {
    "entitlements": {
      "trial": {
        "expires_date": "2099-12-31T23:59:59Z",
        "product_identifier": "python3ide_trial",
        "purchase_date": "2025-09-04T00:00:00Z",
        "ownership_type": "PURCHASED"
      }
    },
    "subscriptions": {
      "python3ide_trial": {
        "billing_issues_detected_at": null,
        "expires_date": "2099-12-31T23:59:59Z",
        "is_sandbox": false,
        "original_purchase_date": "2025-09-04T00:00:00Z",
        "period_type": "trial",
        "purchase_date": "2025-09-04T00:00:00Z",
        "store": "app_store",
        "ownership_type": "PURCHASED"
      }
    },
    "non_subscriptions": {},
    "first_seen": "2025-09-04T00:00:00Z",
    "original_app_user_id": "$RCAnonymousID:da169ebb547b42a091d2dbdafb8cd4db",
    "last_seen": "2025-09-04T00:00:00Z",
    "management_url": null
  },
  "offerings": [
    {
      "identifier": "default",
      "description": "default",
      "packages": [
        {"platform_product_identifier": "python3ide_one_month", "identifier": "$rc_monthly"},
        {"platform_product_identifier": "python3ide_six_month", "identifier": "$rc_six_month"},
        {"platform_product_identifier": "python3ide_annual", "identifier": "$rc_annual"},
        {"platform_product_identifier": "baobaowang.Python3IDE", "identifier": "$rc_lifetime"}
      ]
    }
  ],
  "current_offering_id": "default",
  "placements": {"fallback_offering_id": "default"}
};

// 返回修改后的 JSON
$done({body: JSON.stringify(body)});