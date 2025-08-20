/*

[rewrite_local]
^https?:\/\/[^\/]+\.api\.moji\.com\/(sns\/json\/profile\/get_info.*|json\/member_new\/homepage_info.*|user\/personal\/json\/profile.*|flycard\/novice|shortvideo\/.*) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Mojitianqi.js

[mitm]
hostname = *.api.moji.com

*/

let o = JSON.parse($response.body)
let u = $request.url

if (u.includes("get_info")) {
  Object.assign(o, {
    is_vip: 1,
    type: 7,
    grade: 1,
    is_adver_free: 0,
    expire_time: 4092599349000,
    member_type: 1,
    member_level: 1,
    max_expiration_days: 9999999,
    is_expire: 0,
    remain_day: 9999999,
    inkrity: 9999999,
    status: 1,
    is_purchase: true
  })
}

if (u.includes("homepage_info")) {
  Object.assign(o, {
    userTips: ["到期时间：2099-09-09"],
    user_tips: ["到期时间：2099-09-09"],
    is_member: true
  })
  if (o.user_member_info) {
    Object.assign(o.user_member_info, {
      vip: 1,
      is_auto_member: 1
    })
  }
}

if (u.includes("profile")) {
  if (o.personal_profile) {
    Object.assign(o.personal_profile, {
      inkrity: 9999999,
      is_vip: true,
      grade: 1,
      user_flag: true
    })
  }
}

if (u.includes("novice")) {
  if (o.data?.novice) {
    Object.assign(o.data.novice, {
      adShow: 0,
      expireTime: 4092599349000,
      vipShow: 1
    })
  }
}

if (u.includes("shortvideo")) {
  o.item_list = []
  o.rcmList = []
  o.add_card_list = []
}

$done({ body: JSON.stringify(o) })