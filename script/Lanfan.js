/*

[rewrite_local]
^https:\/\/lanfanapp\.com\/api\/v1\/account\/login_via_wechat\.json url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Lanfan.js
^https:\/\/lanfanapp\.com\/api\/v1\/goods\/prime\/get_all_v2\.json url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Lanfan.js

[mitm]
hostname = lanfanapp.com

*/

const url = $request.url;
let body = JSON.parse($response.body);

if (url.includes("/api/v1/account/login_via_wechat.json")) {
  body.content.user.is_prime = true;
}

if (url.includes("/api/v1/goods/prime/get_all_v2.json")) {
  body.content.prime_goods = [{
    id: 999,
    policy_text: "已激活永久会员",
    display_price: "￥0",
    desc: "永久会员，无需续费",
    months: 0,
    price: 0,
    product_id: "com.xiachufang.lanfan.prime.permanent",
    remark: "永久有效",
    buy_button_text: "您已是会员",
    promotion: "解锁成功",
    kind: 1,
    original_price: 0,
    name: "永久会员",
    strike_text: ""
  }];
}

$done({ body: JSON.stringify(body) });