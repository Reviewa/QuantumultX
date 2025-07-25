/*
[rewrite_local]
^https?:\/\/pan\.baidu\.com\/(youai\/(user\/.+\/getminfo|membership\/.+\/adswitch)|(rest\/.+\/membership\/user|act\/.+\/(bchannel|welfare)\/list|api\/usercfg)) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/YikeAlbum.js

[mitm]
hostname = pan.baidu.com
*/

let body = $response.body;
let url = $request.url;

if (!body) {
  $done({});
}

let obj = JSON.parse(body);

// 解锁会员信息
if (url.includes("/getminfo")) {
  obj = {
    "errno": 0,
    "request_id": 342581654394297800,
    "has_purchased": 1,
    "has_buy_1m_auto_first": 0,
    "can_buy_1m_auto_first": 0,
    "can_buy_1m_auto_first_6": 0,
    "has_received_7dfree": 1,
    "product_tag": 3,
    "sign_status": 1,
    "sign_infos": [{
      "product_id": "12745849497343294855",
      "order_no": "2203060931530010416",
      "ctime": 1646537208,
      "mtime": "2022-05-06 11:26:48",
      "status": 1,
      "sign_price": 1000,
      "sign_channel": 0
    }],
    "vip_tags": ["album_vip"],
    "product_infos": [{
      "product_id": "12745849497343294855",
      "start_time": 1646534568,
      "end_time": 4092599349,
      "buy_time": 1649994533,
      "tag": "album_vip",
      "order_no": "2203060931530010416"
    }],
    "vip_infos": [{
      "tag": "album_vip",
      "start_time": 1646537208,
      "end_time": 4092599349
    }],
    "expire_time": 0
  };
}

// 去广告
if (url.includes("/adswitch")) {
  obj.switch = "close";
}

// 注入 SVIP 产品信息
if (url.includes("/membership/user")) {
  obj.product_infos = [
    {
      "product_id" : "1",
      "end_time" : 4092599349,
      "buy_time" : 1649994533,
      "cluster" : "vip",
      "start_time" : 1646534568,
      "detail_cluster" : "svip",
      "product_name" : "svip2_nd",
      "product_description": "超级会员",
      "status": 1
    }
  ];
  obj.guide_data = {
    "title": "超级会员 SVIP",
    "content": "已拥有极速下载+视频倍速特权",
    "button": {
      "text": "会员中心",
      "action_url": "https://pan.baidu.com/wap/vip/user?from=myvip2#svip"
    }
  };
  obj.identity_icon = {
    "vip": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452237582/78b88bf113b7.png",
    "common": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452539056/bf72cf66fae1.png",
    "svip": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452115696/38c1d743bfe9.png",
    "contentvip": ""
  };
  obj.error_code = 1;
}

// 精简福利引导提示
if (url.includes("/welfare/list")) {
  delete obj.list;
}

// 修改卡片显示
if (url.includes("/usercfg")) {
  obj.user_new_define_cards = [
    {
      "card_id": "1",
      "card_type": "4",
      "card_area_name": "首页笔记-卡片"
    },
    {
      "is_manager": 1,
      "card_area_name": "最近",
      "card_id": "1",
      "card_type": "7"
    },
    {
      "card_id": "1",
      "card_type": "13",
      "card_area_name": "卡片管理-卡片"
    }
  ];
}

$done({ body: JSON.stringify(obj) });
