/*

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/receipts$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/PicSeed.js

[mitm]
hostname = api.rc-backup.com

*/

let obj = JSON.parse($response.body || '{}');

// 覆盖或插入 product_entitlement_mapping（使用你提供的映射）
obj.product_entitlement_mapping = {
  "com.picseed.sub.pro.event.monthly": {
    "product_identifier": "com.picseed.sub.pro.event.monthly",
    "entitlements": ["Pro"]
  },
  "com.picseed.sub.pro.monthly": {
    "product_identifier": "com.picseed.sub.pro.monthly",
    "entitlements": ["Pro"]
  },
  "com.picseed.sub.pro.annual": {
    "product_identifier": "com.picseed.sub.pro.annual",
    "entitlements": ["Pro"]
  },
  "com.picseed.sub.pro.event.annual": {
    "product_identifier": "com.picseed.sub.pro.event.annual",
    "entitlements": ["Pro"]
  }
};

// 远期到期时间（你要求的时间段）
const FAR_EXPIRES = "2099-12-31T23:59:59Z";

// 覆盖 subscriber（用于调试 / 开发环境），并把 expires_date 改为具体远期时间
obj.subscriber = {
  "non_subscriptions": {},
  "first_seen": "2025-10-13T03:21:53Z",
  "original_application_version": "57",
  "other_purchases": {},
  "management_url": null,
  "subscriptions": {
    "com.picseed.sub.pro.annual": {
      "billing_issues_detected_at": null,
      "expires_date": FAR_EXPIRES,
      "grace_period_expires_date": null,
      "is_sandbox": true,
      "original_purchase_date": "2025-10-13T03:22:21Z",
      "period_type": "normal",
      "purchase_date": "2025-10-13T03:22:21Z",
      "store": "app_store",
      "unsubscribe_detected_at": null
    },
    "com.picseed.sub.pro.monthly": {
      "billing_issues_detected_at": null,
      "expires_date": FAR_EXPIRES,
      "grace_period_expires_date": null,
      "is_sandbox": true,
      "original_purchase_date": "2025-10-13T03:22:21Z",
      "period_type": "normal",
      "purchase_date": "2025-10-13T03:22:21Z",
      "store": "app_store",
      "unsubscribe_detected_at": null
    }
  },
  "entitlements": {
    "Pro": {
      "product_identifier": "com.picseed.sub.pro.annual",
      "expires_date": FAR_EXPIRES,
      "purchase_date": "2025-10-13T03:22:21Z"
    }
  },
  "original_purchase_date": "2024-07-04T21:31:10Z",
  "original_app_user_id": "$RCAnonymousID:937e50881e8147be8746bb20bc8a9027",
  "last_seen": "2025-10-13T03:21:53Z"
};

// 保留原 request_date 字段（如需更新为当前时间可在此修改）
// obj.request_date = "2025-10-13T03:22:21Z";
// obj.request_date_ms = 1760325741120;

$done({ body: JSON.stringify(obj) });