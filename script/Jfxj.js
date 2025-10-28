








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