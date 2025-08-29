/*

[rewrite_local]
^https:\/\/api\.revenuecat\.com\/v1\/product_entitlement_mapping url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Python3IDE.js
^https:\/\/api\.revenuecat\.com\/v1\/subscribers\/.*\/offerings url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Python3IDE.js

[mitm]
hostname = api.revenuecat.com

*/

let obj = JSON.parse($response.body);

if (obj.product_entitlement_mapping) {
    for (let key in obj.product_entitlement_mapping) {
        obj.product_entitlement_mapping[key].entitlements = ["pro","unlock"];
        obj.product_entitlement_mapping[key].product_identifier = key;
    }
}

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
}

if (!obj.display) obj.display = {};
obj.display.ads = 0;
obj.display.purchasePrompt = 0;
obj.display.promo = 0;

$done({ body: JSON.stringify(obj) });