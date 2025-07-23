/*
[Script]
布丁扫码VIP解锁 = type=http-response,pattern=^https:\/\/api\.budingscan\.com\/[^/]+/user/info,requires-body=true,script-path=https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/BudingScan.js

[MITM]
hostname = %APPEND% api.budingscan.com
*/
let obj = JSON.parse($response.body);
if (obj.result) {
  obj.result.user_type = 4;
  obj.result.subscribe_pay_type = 1;
  obj.result.subscribe_plan_validity = 1;
  obj.result.subscribe_plan_name = "终身会员";
  obj.result.end_time = "2099-09-09T00:00:00Z";
}
$done({ body: JSON.stringify(obj) });
