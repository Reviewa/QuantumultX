/*

[rewrite_local]
^https?:\/\/[^\/]+\.api\.moji\.com\/(sns\/json\/profile\/get_info.*|json\/member_new\/homepage_info.*|user\/personal\/json\/profile.*|flycard\/novice|shortvideo\/.*) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Mojitianqi.js

[mitm]
hostname = *.api.moji.com

*/

let body = JSON.parse($response.body)
let url = $request.url

function genExpire() {
  return new Date("2099-12-31T23:59:59Z").getTime()
}

function genTid() {
  return String(Math.floor(1e15 + Math.random() * 9e15)) // 16位数字
}

let expire = genExpire()
let tid = genTid()

const rules = [
  {
    key: "/sns/json/profile/get_info",
    action: d => {
      Object.assign(d, {
        is_vip: 1,
        member_type: 1,
        vip_expire_time: expire,
        is_year_vip: 1,
        is_purchase: true,
        grade: 1,
        level: 7,
        is_follow_vip: 1,
        transaction_id: tid,
        original_transaction_id: tid
      })
    }
  },
  {
    key: "/json/member_new/homepage_info",
    action: d => {
      d.vip_types = ["normal_vip"]
      d.expire_descs = ["将在2099-12-31到期"]
      d.is_member = true
      if (d.user_member_info) {
        d.user_member_info.is_member = 1
        d.user_member_info.expire_time = expire
        d.user_member_info.transaction_id = tid
      }
    }
  },
  {
    key: "/sns/json/personal/info",
    action: d => {
      if (d.personal_profile) {
        Object.assign(d.personal_profile, {
          vip_expire_time: expire,
          is_vip_user: true,
          is_follow_vip: 1,
          is_year_vip: true,
          transaction_id: tid
        })
      }
    }
  },
  {
    key: "/flycard/novice",
    action: d => {
      if (d.data?.novice) {
        Object.assign(d.data.novice, {
          adShow: 0,
          vip_expire_time: expire,
          is_year_vip: 1,
          transaction_id: tid
        })
      }
    }
  },
  {
    key: "/shortvideo",
    action: d => {
      d.item_list = []
      d.rcmList = []
      d.feeds = []
      d.add_card_list = []
    }
  }
]

for (let r of rules) {
  if (url.includes(r.key)) {
    r.action(body)
    break
  }
}

$done({ body: JSON.stringify(body) })