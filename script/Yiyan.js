/*

[rewrite_local]
^https?:\/\/app\.yiyan\.art\/yiyan url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Yiyan.js

[mitm]
hostname = app.yiyan.art

*/
let obj = JSON.parse($response.body);
if (obj.u) {
  obj.u.viptype = "4";
  obj.u.device = "0";
}
if (obj.product) {
  obj.product.permanenttitle = "终身会员";
  obj.product.permanentdesc = "已解锁永久享用";
  obj.product.permanentprice = "0";
  obj.product.yearprice = "0";
  obj.product.yeartitle = "";
  obj.product.yeardesc = "";
  obj.product.yearprice_origin = "0";
  obj.product.permanentprice_origin = "0";
}
$done({ body: JSON.stringify(obj) });
