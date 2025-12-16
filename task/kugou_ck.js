/*

[rewrite_local]

^https://gateway\.kugou\.com/concepts/v1/bz_mall/get_goods_info http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js
^https://gateway\.kugou\.com/yutc/youth/v1/task/sign_state http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js

[task_local]

0 8 * * * https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugoug_ck.js, tag=酷狗音乐概念版签到, enabled=true

[mitm]

hostname = gateway.kugou.com

*/

const $ = new Env('酷狗音乐概念版');
const ckName = 'kugougnbck';

if ($request && $request.url) {
    // ============ 抓CK部分 ============
    const url = $request.url;
    if (url.includes('get_goods_info') || url.includes('sign_state')) {
        const params = Object.fromEntries(
            (url.split('?')[1] || '').split('&').map(p => p.split('=').map(decodeURIComponent))
        );

        const userid = params.userid || '';
        const token = params.token || '';
        const mid = params.mid || params.uuid || '';
        const dfid = params.dfid || '';

        if (userid && token && mid) {
            const ck = `userid=${userid};token=${token};mid=${mid};dfid=${dfid};`;

            (async () => {
                try {
                    const { host, clientId, secret } = $.getjson('SAKURA_QL') || {};
                    if (host && clientId && secret) {
                        let ql = await loadQL({ host, clientId, secret });
                        await ql.checkLogin();
                        await ql.getEnvs();
                        const env = ql.envs.find(e => e.name === ckName && e.remarks === userid);
                        if (env) await ql.updateEnv({ id: env.id, value: ck, name: ckName, remarks: userid });
                        else await ql.addEnv([{ value: ck, name: ckName, remarks: userid }]);
                    }
                } catch {}
            })();

            const type = url.includes('get_goods_info') ? '白赚挑战' : '每日签到';
            $.msg('酷狗音乐概念版', `✅ ${type} CK获取成功`, `ID: ${userid}`);
        } else {
            $.msg('酷狗音乐概念版', '抓取失败', '参数缺失');
        }
        $.done();
    }
} else {
    // ============ 签到部分 ============
    !(async () => {
        const envs = await $.getEnvsByName(ckName);
        if (!envs.length) return $.msg('酷狗音乐概念版', '无CK', '请先进入白赚或签到页面抓取'), $.done();

        for (let i = 0; i < envs.length; i++) {
            const ck = envs[i].value.trim();
            const p = Object.fromEntries(ck.split(';').filter(Boolean).map(x => x.split('=')));
            const { userid, token, mid, dfid = '' } = p;
            if (!userid || !token || !mid) continue;

            $.log(`\n账号 ${i+1} (${userid})`);

            // 白赚挑战
            try {
                const t = Date.now();
                const q = new URLSearchParams({appid:'3114',mid,uuid:mid,dfid,userid,token,clientver:'12324',clienttime:t,goods_id:'11',tenant_id:'2',progress_id:'',srcappid:'2919',signature:''});
                const res = await $.get({url:`https://gateway.kugou.com/concepts/v1/bz_mall/get_goods_info?${q}`});
                const d = JSON.parse(res.body);
                if (d.errcode === 0) {
                    const sign = d.data.task_list.find(t=>t.task_type==='sign');
                    const days = d.data.progress_info?.finish_days || 0;
                    const target = d.data.goods_info?.challenge_days || 20;
                    const name = d.data.goods_info?.goods_name || 'VIP月卡';
                    $.log(sign?.finish_num >= sign.total_count ? `✅ 白赚签到成功，连续 ${days} 天（目标 ${target} 天领 ${name}）` : `⚠️ 白赚未签到，当前 ${days} 天`);
                }
            } catch {}

            // 每日概念币
            try {
                const t = Date.now();
                const q = new URLSearchParams({srcappid:'2919',clientver:'12324',clienttime:t,mid,uuid:mid,dfid,appid:'3114',userid,token,from:'client',source:'1',signature:''});
                const res = await $.get({url:`https://gateway.kugou.com/yutc/youth/v1/task/sign_state?${q}`});
                const d = JSON.parse(res.body);
                if (d.errcode === 0) {
                    const today = d.data.list.find(x=>x.today===1);
                    const signed = d.data.list.filter(x=>x.state===1).length;
                    $.log(today?.state===1 ? `✅ 每日签到成功，得 ${today.award_coins} 概念币` : `⚠️ 每日签到未触发`);
                    $.log(`本轮已签 ${signed}/7 天`);
                }
            } catch {}

            if (i < envs.length - 1) await $.wait(5000);
        }
        $.done();
    })().catch(e => $.logErr(e)).finally(() => $.done());
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