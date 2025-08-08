/*
#!name=一同弹幕 VIP 解锁
#!desc=解锁一同弹幕永久VIP
#!author=bgcode🅥
*******************************/

[rewrite_local]
^https?:\/\/ytbarrage\.sky808\.com\/api\/(user\?method=user_info|index\?method=login_phone) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Yitongtanmu.js

[mitm]
hostname = ytbarrage.sky808.com

*/

var obj = JSON.parse($response.body);

// user_info 接口
if ($request.url.includes("/api/user?method=user_info")) {
    obj.is_vip = 1;
    obj.level = 3;
    obj.is_vip_test = true;
    obj.vip_start = 1700000000; // 2023
    obj.vip_end = 6707091199;   // 永久
    obj.vip_day = "9999";
}

// login_phone 接口
if ($request.url.includes("/api/index?method=login_phone")) {
    if (obj.code === 0) {
        obj.data = obj.data || {};
        obj.data.is_vip = 1;
        obj.data.level = 3;
        obj.data.is_vip_test = true;
        obj.data.vip_start = 1700000000;
        obj.data.vip_end = 6707091199;
        obj.data.vip_day = "9999";
    }
}

$done({ body: JSON.stringify(obj) });