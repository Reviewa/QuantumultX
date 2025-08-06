/*

[rewrite_local]
^https:\/\/api\.rc-backup\.com\/v1\/subscribers\/.+\/offerings url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/hireader.js
^https:\/\/api\.rc-backup\.com\/v1\/product_entitlement_mapping url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/hireader.js

[mitm]
hostname = api.rc-backup.com
*/

let Qiq = {
  request_date_ms: Date.now(),
  request_date: new Date().toISOString(),
  subscriber: {
    entitlements: {
      pro: {
        expires_date: "2099-09-09T09:09:09Z",
        product_identifier: "HiReader_Annual",
        purchase_date: "2020-09-09T09:09:09Z"
      },
      forever: {
        expires_date: null,
        product_identifier: "HiReader_Lifetime",
        purchase_date: "2020-09-09T09:09:09Z"
      }
    },
    first_seen: "2020-09-09T09:09:09Z",
    original_application_version: "1",
    original_purchase_date: "2020-09-09T09:09:09Z",
    other_purchases: {
      HiReader_Annual: {
        purchase_date: "2020-09-09T09:09:09Z"
      },
      HiReader_Monthly: {
        purchase_date: "2020-09-09T09:09:09Z"
      },
      HiReader_Lifetime: {
        purchase_date: "2020-09-09T09:09:09Z"
      }
    },
    management_url: null,
    subscriptions: {
      HiReader_Annual: {
        billing_issues_detected_at: null,
        expires_date: "2099-09-09T09:09:09Z",
        is_sandbox: false,
        original_purchase_date: "2020-09-09T09:09:09Z",
        period_type: "active",
        purchase_date: "2020-09-09T09:09:09Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      HiReader_Monthly: {
        billing_issues_detected_at: null,
        expires_date: "2099-09-09T09:09:09Z",
        is_sandbox: false,
        original_purchase_date: "2020-09-09T09:09:09Z",
        period_type: "active",
        purchase_date: "2020-09-09T09:09:09Z",
        store: "app_store",
        unsubscribe_detected_at: null
      },
      HiReader_Lifetime: {
        billing_issues_detected_at: null,
        expires_date: null,
        is_sandbox: false,
        original_purchase_date: "2020-09-09T09:09:09Z",
        period_type: "active",
        purchase_date: "2020-09-09T09:09:09Z",
        store: "app_store",
        unsubscribe_detected_at: null
      }
    }
  }
};

$done({ body: JSON.stringify(Qiq) });