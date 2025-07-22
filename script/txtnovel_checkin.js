/**
 * 书香门第(txtnovel.vip)自动签到脚本
 * 环境变量: TXTNOVEL_COOKIE
 * 功能: 自动获取formhash并完成签到，支持青龙通知推送
 */

const axios = require('axios');
const path = require('path');
const sendNotify = require(path.join(__dirname, 'sendNotify'));

// 获取环境变量中的Cookie
const cookie = process.env.TXTNOVEL_COOKIE;
if (!cookie) {
    console.log('❌ 未设置 TXTNOVEL_COOKIE 环境变量');
    sendNotify.sendNotify('书香门第签到', '❌ 未设置 TXTNOVEL_COOKIE 环境变量，签到失败！');
    process.exit(1);
}

// 根据抓包数据定义请求URL
const signPageUrl = 'http://www.txtnovel.vip/plugin.php?id=dsu_paulsign:sign&mobile=yes';
const signPostUrl = 'http://www.txtnovel.vip/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=0&inajax=0&mobile=yes';

// 签到心情选项: kx(开心) wl(无聊) ym(郁闷) nu(怒) chuai(衰) shui(睡) se(色)
const qdxq = 'kx';

// 主函数
(async () => {
    try {
        console.log('🚀 开始书香门第自动签到...');
        
        // Step 1: 获取签到页面，提取formhash
        console.log('📖 正在获取签到页面...');
        const getResponse = await axios.get(signPageUrl, {
            headers: {
                'Host': 'www.txtnovel.vip',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2.1 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': 'http://www.txtnovel.vip/',
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Cookie': cookie
            },
            timeout: 30000
        });

        // 提取formhash
        const formhashMatch = getResponse.data.match(/name="formhash"\s+value="([^"]+)"/);
        const formhash = formhashMatch ? formhashMatch[1] : '';
        
        if (!formhash) {
            console.log('❌ 未能获取formhash，可能Cookie失效或页面结构已变');
            await sendNotify.sendNotify('书香门第签到', '❌ 未能获取formhash，可能Cookie失效或页面结构已变！');
            return;
        }
        
        console.log('✅ 成功获取formhash:', formhash);

        // Step 2: 执行签到请求
        console.log('✍️ 正在执行签到...');
        const postData = `formhash=${formhash}&qdxq=${qdxq}&qdmode=1&todaysay=`;
        
        const postResponse = await axios.post(signPostUrl, postData, {
            headers: {
                'Host': 'www.txtnovel.vip',
                'Connection': 'keep-alive',
                'Content-Length': postData.length.toString(),
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': '1',
                'Origin': 'http://www.txtnovel.vip',
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2.1 Mobile/15E148 Safari/604.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Referer': signPageUrl,
                'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Cookie': cookie
            },
            timeout: 30000,
            maxRedirects: 5
        });

        // Step 3: 解析签到结果
        const responseText = postResponse.data;
        let resultMessage = '';
        let isSuccess = false;

        // 检查各种签到结果
        if (/签到成功|恭喜你签到成功/.test(responseText)) {
            resultMessage = '✅ 签到成功！';
            isSuccess = true;
        } else if (/已经签到|您今天已经签到|今日已签/.test(responseText)) {
            resultMessage = '✅ 今日已签到！';
            isSuccess = true;
        } else if (/请先登录|需要登录|登录后才能/.test(responseText)) {
            resultMessage = '❌ Cookie失效，请重新获取Cookie';
        } else if (/验证码|安全验证/.test(responseText)) {
            resultMessage = '❌ 需要验证码，脚本无法自动处理';
        } else if (/系统繁忙|请稍后再试/.test(responseText)) {
            resultMessage = '⚠️ 系统繁忙，请稍后再试';
        } else {
            // 输出部分响应内容用于调试
            const debugInfo = responseText.slice(0, 300).replace(/\s+/g, ' ');
            resultMessage = `⚠️ 未知返回，可能签到失败\n调试信息: ${debugInfo}`;
        }

        console.log(resultMessage);
        
        // Step 4: 发送通知
        await sendNotify.sendNotify('书香门第签到', resultMessage);
        
        console.log('🎉 签到流程完成');

    } catch (error) {
        console.log('❌ 脚本执行异常:', error.message);
        await sendNotify.sendNotify('书香门第签到', `❌ 脚本执行异常: ${error.message}`);
    }
})();
