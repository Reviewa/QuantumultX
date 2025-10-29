
/*
飓风相机专业版 - 解锁专业版功能

[rewrite_local]
^https:\/\/base\.ysjf\.com\/storm_auth\/user\/self url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Jfxj.js

[mitm]
hostname = base.ysjf.com

*/

let body = JSON.parse($response.body);
body = {
  msg: "success",
  data: {
    phone: { region: "86", number: "" },
    avatar: "",
    phoneChangeCount: 3,
    id: "100000",
    nickname: "nickname",
    roles: [
      {
        appGroup: "buding",
        id: "100",
        permanent: true,
        name: "VIP",
        description: null,
        expireTime: "2099-12-31 23:59:59"
      },
      {
        appGroup: "buding_scan",
        id: "101",
        name: "SVIP",
        description: null,
        expireTime: "2099-12-31 23:59:59"
      }
    ],
    identifications: []
  },
  code: 200
};
$done({ body: JSON.stringify(body) });