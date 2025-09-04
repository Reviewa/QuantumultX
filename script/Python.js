/*

[rewrite_local]
^https?:\/\/api\.revenuecat\.com\/v1\/subscribers\/\S+\/offerings url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumltX/main/python3ide_vip.js

[mitm]
hostname = api.revenuecat.com

*/

let obj = {
  "placements": {"fallback_offering_id": "default"},
  "offerings": [{
    "metadata": null,
    "description": "default",
    "identifier": "default",
    "packages": [
      {"platform_product_identifier": "python3ide_six_month","identifier": "$rc_six_month","purchased": true,"expires_date": "2099-12-31T23:59:59Z"},
      {"platform_product_identifier": "python3ide_annual","identifier": "$rc_annual","purchased": true,"expires_date": "2099-12-31T23:59:59Z"},
      {"platform_product_identifier": "baobaowang.Python3IDE","identifier": "$rc_lifetime","purchased": true,"expires_date": "2099-12-31T23:59:59Z"},
      {"platform_product_identifier": "python3ide_one_month","identifier": "$rc_monthly","purchased": true,"expires_date": "2099-12-31T23:59:59Z"}
    ]
  }],
  "current_offering_id": "default"
};

$done({ body: JSON.stringify(obj) });