/*

[rewrite_local]
^https?:\/\/[^\/]+\.api\.moji\.com\/(sns\/json\/profile\/get_info.*|json\/member_new\/homepage_info.*|user\/personal\/json\/profile.*|flycard\/novice|shortvideo\/.*) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/Mojitianqi.js

[mitm]
hostname = *.api.moji.com

*/

var obj = JSON.parse($response.body)

if ($request.url.includes('/sns/json/profile/get_info')) {
  obj.is_vip = 1
  obj.type = 7
  obj.grade = 1
  obj.is_adver_free = 0
  obj.expire_time = 4092599349000
  obj.member_type = 1
  obj.member_level = 1
  obj.max_expiration_days = 9999999
  obj.is_expire = 0
  obj.remain_day = 9999999
  obj.inkrity = 9999999
  obj.status = 1
  obj.is_purchase = true
}

if ($request.url.includes('/json/member_new/homepage_info')) {
  obj.userTips = ["将在2099-09-09到期"]
  obj.user_tips = ["将在2099-09-09到期"]
  obj.is_member = true
  if (obj.user_member_info) {
    obj.user_member_info.vip = 1
    obj.user_member_info.is_auto_member = 1
  }
}

if ($request.url.includes('/user/personal/json/profile')) {
  if (obj.personal_profile) {
    obj.personal_profile.inkrity = 9999999
    obj.personal_profile.is_vip = true
    obj.personal_profile.grade = 1
    obj.personal_profile.user_flag = true
  }
}

if ($request.url.includes('/flycard/novice')) {
  if (obj.data && obj.data.novice) {
    obj.data.novice.adShow = 0
    obj.data.novice.expireTime = 4092599349000
    obj.data.novice.vipShow = 1
  }
}

if ($request.url.includes('/shortvideo')) {
  obj.item_list = []
  obj.rcmList = []
  obj.add_card_list = []
}

$done({ body: JSON.stringify(obj) })