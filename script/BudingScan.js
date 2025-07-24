/*
[rewrite_local]
布丁扫码VIP解锁 = type=http-response,pattern=^https:\/\/api\.budingscan\.com\/[^/]+/user/info,requires-body=true,script-path=https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/BudingScan.js

[MITM]
hostname = api.budingscan.com
*/
let body = $response.body;
let obj = JSON.parse(body);

if (obj.result) {
  if (Array.isArray(obj.result)) {
    for (let i of obj.result) {
      i.price = "0";
      i.org_price = "";
      i.rich_text = "已解锁";
      i.desc = "已解锁所有会员权益";
      i.dlabel = "";
      i.plan_renewal_status = 0;
    }
  } else {
    obj.result.user_type = 3;
    obj.result.subscribe_plan_validity = 999999999;
    obj.result.subscribe_plan_name = "终身会员";
    obj.result.end_time = "4102415999000";
    obj.result.next_pay_time = null;
    obj.result.next_pay_price = null;
    obj.result.renewal_status = 0;
    obj.result.vip_storage = 107374182400;
  }
}

if (obj.data) {
  if (obj.data.newer_status !== undefined) obj.data.newer_status = 0;
  if (obj.data.daily_status !== undefined) obj.data.daily_status = 0;
  if (obj.data.status !== undefined) obj.data.status = 0;
  if (obj.data.size !== undefined) obj.data.size = 107374182400;
}

$done({ body: JSON.stringify(obj) });
