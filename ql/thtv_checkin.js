/*
📌 探花TV论坛签到
👑 navix.site
🔐 变量名：THTV（支持多账号，换行或&分隔）
✅ 抓https://navix.site/api/sign-in
🔄 THTV="loginToken=xxx; SESSION=xxx"
*/
const THTV = process.env.THTV || '';
const cookies = THTV.split(/[\n&]/).filter(Boolean);
const notify = require('./sendNotify');
const axios = require('axios');

(async () => {
  for (let i = 0; i < cookies.length; i++) {
    const ck = cookies[i];
    try {
      const res = await axios.post('https://navix.site/api/sign-in', {}, {
        headers: { Cookie: ck }
      });
      const { success, message, consecutiveDays, expGained, level } = res.data || {};
      if (success) {
        console.log(`✅ 探花TV账号${i + 1} 签到成功｜+${expGained}经验｜连续${consecutiveDays}天｜等级：${level?.title}`);
        await notify.sendNotify(`探花TV账号${i + 1} 签到成功`, `${message}｜+${expGained}经验｜已连续${consecutiveDays}天｜等级：${level?.title}`);
      } else {
        console.log(`❌ 探花TV账号${i + 1} 签到失败｜${message}`);
        await notify.sendNotify(`探花TV账号${i + 1} 签到失败`, `${message}`);
      }
    } catch (err) {
      console.log(`🚨 探花TV账号${i + 1} 请求异常：${err.message}`);
      await notify.sendNotify(`探花TV账号${i + 1} 请求异常`, `${err.message}`);
    }
  }
})();