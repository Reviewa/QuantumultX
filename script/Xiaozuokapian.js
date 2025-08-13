/*
 小作卡片 解锁 VIP  3.7.0

[rewrite_local]
^https://api\.rc-backup\.com/v1/subscribers/.* url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Xiaozuokapian.js

[mitm]
hostname = api.rc-backup.com

*/

const url = $request.url;
let response = JSON.parse($response.body);

if (url.includes("api.rc-backup.com/v1/subscribers")) {
    try {
        response.subscriber.entitlements = {
            "vip": {
                "product_identifier": "card_vip",
                "expires_date": "2099-12-31T23:59:59Z",
                "purchase_date": "2025-08-13T05:16:00Z",
                "is_active": true,
                "grace_period_expires_date": null,
                "is_trial_period": false,
                "is_in_billing_retry_period": false,
                "original_transaction_id": "1234567890"
            }
        };
        response.subscriber.subscriptions = {
            "card_vip": {
                "product_identifier": "card_vip",
                "expires_date": "2099-12-31T23:59:59Z",
                "purchase_date": "2025-08-13T05:16:00Z",
                "is_active": true,
                "billing_issues_detected_at": null,
                "auto_resume_date": null,
                "period_type": "normal",
                "store": "app_store",
                "original_transaction_id": "1234567890"
            }
        };
        response.subscriber.last_seen = "2025-08-13T05:16:00Z";
        response.subscriber.first_seen = "2025-08-13T05:16:00Z";
        response.subscriber.original_purchase_date = "2025-08-13T05:16:00Z";
        response.request_date = "2025-08-13T05:16:00Z";
        response.request_date_ms = 1755062160000;
        $done({ body: JSON.stringify(response) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}