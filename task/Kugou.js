/*
#!name=酷狗音乐概念版打卡

[Script]
酷狗音乐概念版打卡 = type=http-request, pattern=^https:\/\/gateway\.kugou\.com\/concepts\/v1\/bz_mall\/get_goods_info, script-path=https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/Kugou.js, requires-body=false, timeout=300

[MITM]
hostname = %APPEND% gateway.kugou.com
*/

const $ = new Env('酷狗音乐概念版获取CK');
const ckName = 'kugougnbck';

async function getCookie() {
    try {
        if ($request.method === 'OPTIONS') return;

        const url = $request.url;
        if (!url.includes('get_goods_info')) return;

        const params = getQueries(url.split('?')[1] || '');

        const userid = params.userid || '';
        const token = params.token || '';
        const mid = params.mid || params.uuid || '';
        const dfid = params.dfid || '';

        $.log(`抓取到参数 → userid: ${userid}`);
        $.log(`mid/uuid: ${mid}`);
        $.log(`dfid: ${dfid}`);
        $.log(`token 长度: ${token ? token.length : 0}`);

        if (!userid || !token || !mid) {
            $.msg('酷狗音乐概念版', '❌ 抓取失败', '关键参数缺失（userid/token/mid）');
            return;
        }

        const ckValue = `userid=${userid};token=${token};mid=${mid};dfid=${dfid};`;

        // 上传青龙，使用 userid 作为 remarks 区分多账号
        await refreshQingLong(ckName, ckValue, userid);

        $.msg('酷狗音乐概念版', '✅ CK抓取成功并已上传青龙', `账号ID: ${userid}`);

    } catch (e) {
        $.log(`抓取异常: ${e.message || e}`);
        $.msg('酷狗音乐概念版', '❌ 抓取异常', e.message || '未知错误');
    }
}

!(async () => await getCookie())()
    .catch(e => $.log(`脚本执行错误: ${e.message || e}`))
    .finally(() => $.done());

// ==================== 参数解析 ====================
function getQueries(str) {
    if (!str) return {};
    return str.split('&').reduce((obj, pair) => {
        const [k, v] = pair.split('=');
        if (k) obj[k] = decodeURIComponent(v || '');
        return obj;
    }, {});
}

// ==================== 青龙同步 ====================
async function refreshQingLong(name, value, remarks) {
    try {
        const { host, clientId, secret } = $.getjson('SAKURA_QL') || {};
        if (!host || !clientId || !secret) {
            $.log('未配置青龙面板信息（SAKURA_QL）');
            return;
        }

        let ql = await loadQingLong({ host, clientId, secret });
        await ql.checkLogin();
        await ql.getEnvs();

        const existing = ql.envs.find(env => env.name === name && env.remarks === remarks);

        if (existing) {
            await ql.updateEnv({ id: existing.id, value, name, remarks });
            $.log(`更新青龙变量成功 → ${remarks}`);
        } else {
            await ql.addEnv([{ value, name, remarks }]);
            $.log(`新增青龙变量成功 → ${remarks}`);
        }

    } catch (e) {
        $.log(`青龙同步失败: ${e.message || e}`);
    }
}

async function loadQingLong(QL) {
    let code = $.getdata('qinglong_code') || '';
    if (code) {
        eval(code);
        return new QingLong(QL.host, QL.clientId, QL.secret);
    }
    return new Promise(resolve => {
        $.getScript('https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/QingLong.min.js')
            .then(fn => {
                $.setdata(fn, 'qinglong_code');
                eval(fn);
                resolve(new QingLong(QL.host, QL.clientId, QL.secret));
            });
    });
}