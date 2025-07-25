/*
[rewrite_local]
^https?:\/\/pan\.baidu\.com\/(youai\/(user\/.+\/getminfo|membership\/.+\/adswitch)|(rest\/.+\/membership\/user|act\/.+\/(bchannel|welfare)\/list|api\/usercfg)) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/YikeAlbum.js

[mitm]
hostname = pan.baidu.com
*/
var body = JSON.parse($response.body);
var url = $request.url;

if (url.includes("/membership/user")) {
  body.product_infos = [
    {
      "product_id": "1",
      "end_time": 4092599349,
      "buy_time": 1417260485,
      "cluster": "offlinedl",
      "start_time": 1417260485,
      "detail_cluster": "offlinedl",
      "product_name": "gz_telecom_exp"
    },
    {
      "product_name": "svip2_nd",
      "product_description": "超级会员",
      "function_num": 0,
      "start_time": 1417260485,
      "buy_time": 1417260485,
      "product_id": "1",
      "auto_upgrade_to_svip": 1,
      "end_time": 4092599349,
      "cluster": "vip",
      "detail_cluster": "svip",
      "status": 1
    }
  ];
  body.guide_data = {
    "title": "超级会员 SVIP",
    "content": "已拥有极速下载+视频倍速特权",
    "button": {
      "text": "会员中心",
      "action_url": "https://pan.baidu.com/wap/vip/user?from=myvip2#svip"
    }
  };
  body.identity_icon = {
    "vip": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452237582/78b88bf113b7.png",
    "common": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452539056/bf72cf66fae1.png",
    "svip": "https://internal-amis-res.cdn.bcebos.com/images/2019-8/1566452115696/38c1d743bfe9.png",
    "contentvip": ""
  };
  body.error_code = 1;
  delete body.tips_data_list;
  delete body.status_data_arr;
  delete body.sub_card_list;
}

if (url.includes("/adswitch")) {
  body.switch = "open";
}

if (url.includes("/welfare/list")) {
  delete body.data;
}

if (url.includes("/bchannel/list")) {
  body.data = [
    {
      "sub_title": "",
      "id": 856,
      "type": 3,
      "name": "已解锁SVIP，未完整解锁"
    },
    {
      "sub_title": "",
      "id": 460,
      "type": 3,
      "name": "已拥有极速下载+视频倍速特权"
    }
  ];
}

if (url.includes("/api/usercfg")) {
  body.user_new_define_cards = [
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

$done({ body: JSON.stringify(body) });
