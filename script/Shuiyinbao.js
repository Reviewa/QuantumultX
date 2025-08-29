/*

[rewrite_local]
^https:\/\/newappapi\.fntmob\.com\/api\/v1\/qsy\/user-info url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Shuiyinbao.js

[mitm]
hostname = newappapi.fntmob.com

*/

let body = $response.body;
let obj = JSON.parse(body);

if (obj && obj.data) {
  obj.data.is_vip = 1;
  obj.data.is_buy = 1;
  obj.data.grade = 1;
  obj.data.level_expire = 4102415999;
  obj.data.mobile = "One more time";
  obj.data.nickname = "One more time";
}

$done({ body: JSON.stringify(obj) });