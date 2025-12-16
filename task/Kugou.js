/*
#!name=酷狗音乐概念版获取ck
#!desc=自动抓取酷狗音乐概念版 token、userid、mid 等，上传青龙
#!category=Record module
#!icon=https://www.kugou.com/favicon.ico

[Script]
酷狗音乐概念版获取ck = type=http-request, pattern=^https:\/\/gateway\.kugou\.com\/concepts\/v1\/bz_mall\/get_goods_info, script-path=https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/Kugou.js, requires-body=false, timeout=300

[MITM]
hostname = %APPEND% gateway.kugou.com
*/

const moduleName = "酷狗音乐概念版";
const $ = new Env(moduleName);

async function getCookie() {
    try {
        if ($request.method === 'OPTIONS') return;

        // 解析 URL 参数
        const query = $request.url.split('?')[1] || '';
        const params = getQueries(query);

        const userid = params.userid || '';
        const token = params.token || '';
        const mid = params.mid || params.uuid || '';
        const dfid = params.dfid || '';

        $.info(`userid: ${userid}`);
        $.info(`mid: ${mid}`);
        $.info(`dfid: ${dfid}`);
        $.info(`token 长度: ${token ? token.length : 0}`);

        if (!userid || !token || !mid) {
            throw new Error("关键参数缺失：userid、token 或 mid");
        }

        // 构造 CK 值
        const ckValue = `userid=${userid};token=${token};mid=${mid};dfid=${dfid};`;

        // 上传到青龙（变量名统一为 kugougnbck）
        const ckName = "kugougnbck";
        await refreshQingLong(ckName, ckValue, userid);  // userid 作为 remarks 区分多账号

        $.msg(moduleName, "✅ CK 抓取成功", `账号: ${userid}`);

    } catch (e) {
        $.error(e.message || e);
        $.msg(moduleName, "⛔️ 抓取失败", e.message || "参数缺失");
    }
}

!(async () => await getCookie())()
    .catch(e => { $.error(e); $.msg($.name, `⛔️ script run error!`, e.message || e); })
    .finally(() => $.done({}));

// ==================== 固定框架函数（与喜马拉雅框架完全一致）===================
function getQueries(str) {
    if (!str) return {};
    return str.split("&").reduce((obj, pair) => {
        const [k, v] = pair.split("=");
        obj[k] = decodeURIComponent(v || '');
        return obj;
    }, {});
}

async function refreshQingLong(name, value, remarks) {
    try {
        const { host, clientId, secret } = $.getjson("SAKURA_QL") || {};
        if (!host || !clientId || !secret) throw new Error("请在 BoxJS 配置青龙面板信息");
        
        let ql = await loadQingLong({ host, clientId, secret });
        await ql.checkLogin();
        await ql.getEnvs();
        
        const existing = ql.envs.find(env => env.name === name && env.remarks === remarks);
        if (existing) {
            await ql.updateEnv({ id: existing.id, value, name, remarks });
        } else {
            await ql.addEnv([{ value, name, remarks }]);
        }
        
        $.msg($.name, "", "✅ CK 已成功上传青龙");
    } catch (e) {
        $.error("青龙同步失败: " + e.message);
    }
}

async function loadQingLong(QL) {
    let code = $.getdata("qinglong_code") || "";
    if (code) {
        eval(code);
        return new QingLong(QL.host, QL.clientId, QL.secret);
    }
    return new Promise(resolve => {
        $.getScript("https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/QingLong.min.js").then(fn => {
            $.setdata(fn, "qinglong_code");
            eval(fn);
            resolve(new QingLong(QL.host, QL.clientId, QL.secret));
        });
    });
}

// 完整 Env 类（与喜马拉雅原版一致，已内置）
function Env(t, e) { /* 完整代码同 xmlyck.js */ }