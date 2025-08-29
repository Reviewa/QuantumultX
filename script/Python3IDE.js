/*

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/v1\/product_entitlement_mapping url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Python3IDE.js
^https:\/\/api\.revenuecat\.com\/v1\/subscribers\/.*\/offerings.* url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Python3IDE.js

[mitm]
hostname = api.revenuecat.com

*/

let obj = JSON.parse($response.body);

// -------- 处理 product_entitlement_mapping --------
if (obj.product_entitlement_mapping) {
    for (let key in obj.product_entitlement_mapping) {
        obj.product_entitlement_mapping[key].entitlements = ["pro","unlock"];
        obj.product_entitlement_mapping[key].product_identifier = key;
    }
}

// -------- 处理 subscriber / offerings --------
if (obj.offerings) {
    for (let offering of obj.offerings) {
        if (offering.packages) {
            for (let pkg of offering.packages) {
                pkg.purchased = true;
                pkg.is_active = true;
            }
        }
    }
    obj.current_offering_id = "default";
} else if (obj.subscriber && obj.subscriber.entitlements) {
    for (let key in obj.subscriber.entitlements) {
        obj.subscriber.entitlements[key].product_identifier = key;
        obj.subscriber.entitlements[key].expires_date = "2099-12-31T23:59:59Z";
        obj.subscriber.entitlements[key].purchase_date = "2025-01-01T00:00:00Z";
        obj.subscriber.entitlements[key].ownership_type = "PURCHASED";
    }
}

// -------- 去广告、去充值提示 --------
if (!obj.display) obj.display = {};
obj.display.ads = 0;
obj.display.purchasePrompt = 0;
obj.display.promo = 0;

$done({ body: JSON.stringify(obj) });