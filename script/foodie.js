/*

#!name=Foodie 解锁 Pro
#!desc=解锁 Foodie 美食相机永久 Pro
#!author=bgcode🅥

[rewrite_local]
^https:\/\/purchase-foodiecn-api\.yiruikecorp\.com\/v1\/purchase\/subscription\/status url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumltX/main/foodie.js

[mitm]
hostname = purchase-foodiecn-api.yiruikecorp.com

*/

var obj = JSON.parse($response.body);

obj.result = {
  "products": [
    {
      "productId": "com.linecorp.Foodiecn.subscribe.oneyear",
      "expireDate": "2099-12-31T23:59:59Z",
      "purchaseDate": "2024-01-01T00:00:00Z",
      "platform": "APPLE"
    }
  ],
  "vipSegments": [
    "ACTIVE_VIP"
  ],
  "activated": true
};

$done({body: JSON.stringify(obj)});