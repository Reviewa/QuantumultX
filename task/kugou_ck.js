/*

[rewrite_local]

^https://gateway\.kugou\.com/concepts/v1/bz_mall/get_goods_info http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js
^https://gateway\.kugou\.com/yutc/youth/v1/task/sign_state http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js

[task_local]

0 8 * * * https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugoug_ck.js, tag=酷狗音乐概念版签到, enabled=true

[mitm]

hostname = gateway.kugou.com

*/
const $ = new Env('酷狗音乐概念版CK');
const ckName = 'kugougnbck';

async function main() {
    if ($request.method === 'OPTIONS') return $.done();

    const url = $request.url;
    if (!url.includes('get_goods_info') && !url.includes('sign_state')) return $.done();

    const params = Object.fromEntries(url.split('?')[1].split('&').map(p => p.split('=').map(decodeURIComponent)));
    const userid = params.userid || '';
    const token = params.token || '';
    const mid = params.mid || params.uuid || '';
    const dfid = params.dfid || '';

    if (!userid || !token || !mid) return $.msg('酷狗概念版', '抓取失败', '参数缺失'), $.done();

    const ck = `userid=${userid};token=${token};mid=${mid};dfid=${dfid};`;
    await qlUpdate(ckName, ck, userid);

    const type = url.includes('get_goods_info') ? '白赚挑战' : '每日签到';
    $.msg('酷狗概念版', `✅ ${type} CK获取成功`, `ID: ${userid}`);
    $.done();
}

main();

async function qlUpdate(name, value, remarks) {
    try {
        const { host, clientId, secret } = $.getjson('SAKURA_QL') || {};
        if (!host || !clientId || !secret) return;

        let ql = await loadQL({ host, clientId, secret });
        await ql.checkLogin();
        await ql.getEnvs();

        const env = ql.envs.find(e => e.name === name && e.remarks === remarks);
        if (env) await ql.updateEnv({ id: env.id, value, name, remarks });
        else await ql.addEnv([{ value, name, remarks }]);
    } catch {}
}

async function loadQL(c) {
    let code = $.getdata('qinglong_code');
    if (code) return eval(code), new QingLong(c.host, c.clientId, c.secret);
    return new Promise(r => $.getScript('https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/QingLong.min.js').then(s => {
        $.setdata(s, 'qinglong_code');
        eval(s);
        r(new QingLong(c.host, c.clientId, c.secret));
    }));
}
