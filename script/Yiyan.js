/*

[rewrite_local]
^https?:\/\/app\.yiyan\.art\/yiyan url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Yiyan.js

[mitm]
hostname = app.yiyan.art

*/
let obj = JSON.parse($response.body);
if (obj.user) {
  obj.user.viptype = "4";
  obj.user.intro = "VIP 已解锁";
}
$done({ body: JSON.stringify(obj) });
