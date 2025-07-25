/*
[rewrite_local]
^https?:\/\/pan\.baidu\.com\/(youai\/(user\/.+\/getminfo|membership\/.+\/adswitch|sign\/getstrategy)|(rest\/.+\/membership\/user|act\/.+\/(bchannel|welfare)\/list|api\/usercfg)) url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/YikeAlbum.js

[mitm]
hostname = pan.baidu.com
*/

let body = $response.body;
let url = $request.url;

try {
  const obj = JSON.parse(body);

  if (url.includes("/membership")) {
    // 解锁会员信息（伪造已购买）
    obj.sign_status = 1;
    obj.has_buy_1m_auto_first = 1;
    obj.can_buy_1m_auto_first = 0;
    obj.can_buy_1m_auto_first_6 = 0;
    obj.has_purchased = 1;
    obj.product_tag = 3;
    obj.has_received_7dfree = 1;
    obj.vip_tags = ["album_vip"];
    obj.product_infos = [{
      "product_id": "12745849497343294855",
      "order_no": "2203060931530010416",
      "buy_time": 1649994533,
      "start_time": 1646534568,
      "end_time": 4092599349,
      "tag": "album_vip"
    }];
    obj.vip_infos = [{
      "tag": "album_vip",
      "start_time": 1646537208,
      "end_time": 4092599349
    }];
    obj.sign_infos = [{
      "product_id": "12745849497343294855",
      "order_no": "2203060931530010416",
      "ctime": 1646537208,
      "mtime": "2022-05-06 11:26:48",
      "status": 1,
      "sign_channel": 0,
      "sign_price": 1000
    }];
    obj.expire_time = 0;
  }

  if (url.includes("/adswitch")) {
    // 关闭广告开关
    obj.switch = "close";
  }

  if (url.includes("/welfare")) {
    // 启用福利任务
    if (obj.welfare_task_info) {
      obj.welfare_task_info.status = 1;
    }
    if (obj.list?.length > 0) {
      obj.list = obj.list.map(task => {
        task.task_status = 2;
        return task;
      });
    }
  }

  if (url.includes("/sign")) {
    // 伪造每日签到完成
    obj.list = obj.list.map(i => {
      i.is_sign = true;
      return i;
    });
    obj.today_id = 7;
  }

  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done({});
}
