/*
#!name=酷狗音乐概念版

[rewrite_local]

^https://gateway\.kugou\.com/concepts/v1/bz_mall/get_goods_info http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js
^https://gateway\.kugou\.com/yutc/youth/v1/task/sign_state http-request https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js

[task_local]

0 8 * * * https://raw.githubusercontent.com/Reviewa/QuantumultX/main/task/kugou_ck.js, tag=酷狗音乐概念版签到, enabled=true

[mitm]

hostname = gateway.kugou.com
*/

const $ = new Env('酷狗音乐概念版');
const ckName = 'kugougnbck';

if ($request && $request.url) {
    // ==================== 抓CK部分 ====================
    getCookie();
} else {
    // ==================== 签到部分 ====================
    main();
}

// ==================== 抓CK函数 ====================
async function getCookie() {
    try {
        if ($request.method === 'OPTIONS') return $.done();

        const url = $request.url;
        if (!url.includes('get_goods_info') && !url.includes('sign_state')) return $.done();

        const params = getQueries(url.split('?')[1] || '');
        const userid = params.userid || '';
        const token = params.token || '';
        const mid = params.mid || params.uuid || '';
        const dfid = params.dfid || '';

        if (!userid || !token || !mid) {
            $.msg($.name, '⛔️ 抓取失败', '关键参数缺失');
            return $.done();
        }

        const ckValue = `userid=${userid};token=${token};mid=${mid};dfid=${dfid};`;
        await refreshQingLong(ckName, ckValue, userid);

        const type = url.includes('get_goods_info') ? '白赚挑战' : '每日签到';
        $.msg($.name, `✅ ${type} CK获取成功`, `账号ID: ${userid}`);

    } catch (e) {
        $.logErr(e);
        $.msg($.name, '⛔️ 抓取异常', e.message || e);
    } finally {
        $.done();
    }
}

// ==================== 签到主函数 ====================
async function main() {
    try {
        const envs = await $.getEnvsByName(ckName);
        if (!envs || envs.length === 0) {
            $.msg($.name, '❌ 未找到CK', '请先进入白赚挑战或签到页面抓取');
            return $.done();
        }

        $.log(`\n========== ${$.name} 开始执行 ==========\n共 ${envs.length} 个账号\n`);

        for (let i = 0; i < envs.length; i++) {
            const ck = envs[i].value.trim();
            const remarks = envs[i].remarks || `账号${i + 1}`;
            $.log(`\n【${remarks}】`);

            const params = parseCK(ck);
            if (!params.userid || !params.token || !params.mid) {
                $.log(`❌ CK参数不完整`);
                continue;
            }

            // 白赚挑战签到
            await baizhuanSign(params);

            // 每日概念币签到
            await dailyCoinSign(params);

            if (i < envs.length - 1) await $.wait(5000);
        }

        $.log(`\n========== 执行完成 ==========\n`);
    } catch (e) {
        $.logErr(e);
    } finally {
        $.done();
    }
}

function parseCK(ck) {
    const obj = {};
    ck.split(';').filter(Boolean).forEach(item => {
        const [k, v] = item.split('=');
        if (k && v) obj[k.trim()] = v.trim();
    });
    return obj;
}

async function baizhuanSign(p) {
    const { userid, token, mid, dfid = '' } = p;
    const clienttime = Date.now();
    const query = new URLSearchParams({
        appid: '3114', mid, uuid: mid, dfid, userid, token,
        clientver: '12324', clienttime, goods_id: '11', tenant_id: '2',
        progress_id: '', srcappid: '2919', signature: ''
    });

    try {
        const { body } = await $.get({ url: `https://gateway.kugou.com/concepts/v1/bz_mall/get_goods_info?${query}` });
        const data = JSON.parse(body);

        if (data.errcode === 0 && data.data?.task_list) {
            const signTask = data.data.task_list.find(t => t.task_type === 'sign');
            const days = data.data.progress_info?.finish_days || 0;
            const target = data.data.goods_info?.challenge_days || 20;
            const name = data.data.goods_info?.goods_name || 'VIP月卡';

            if (signTask?.finish_num >= signTask.total_count) {
                $.log(`✅ 白赚挑战签到成功 | 连续 ${days} 天 | 目标 ${target} 天领 ${name}`);
            } else {
                $.log(`⚠️ 白赚挑战今日未签到 | 当前连续 ${days} 天`);
            }
        } else {
            $.log(`❌ 白赚挑战接口异常`);
        }
    } catch (e) {
        $.log(`❌ 白赚挑战请求失败`);
    }
}

async function dailyCoinSign(p) {
    const { userid, token, mid, dfid = '' } = p;
    const clienttime = Date.now();
    const query = new URLSearchParams({
        srcappid: '2919', clientver: '12324', clienttime, mid, uuid: mid, dfid,
        appid: '3114', userid, token, from: 'client', source: '1', signature: ''
    });

    try {
        const { body } = await $.get({ url: `https://gateway.kugou.com/yutc/youth/v1/task/sign_state?${query}` });
        const data = JSON.parse(body);

        if (data.errcode === 0 && data.data?.list) {
            const today = data.data.list.find(item => item.today === 1);
            const signed = data.data.list.filter(item => item.state === 1).length;

            if (today?.state === 1) {
                $.log(`✅ 每日签到成功，得 ${today.award_coins} 概念币`);
            } else {
                $.log(`⚠️ 每日签到未触发`);
            }
            $.log(`本轮已签到 ${signed}/7 天`);
        } else {
            $.log(`❌ 每日签到接口异常`);
        }
    } catch (e) {
        $.log(`❌ 每日签到请求失败`);
    }
}


function getQueries(str) {
    if (!str) return {};
    return str.split('&').reduce((obj, pair) => {
        const [k, v] = pair.split('=');
        if (k) obj[k] = decodeURIComponent(v || '');
        return obj;
    }, {});
}

async function refreshQingLong(name, value, remarks) {
    try {
        const { host, clientId, secret } = $.getjson('SAKURA_QL') || {};
        if (!host || !clientId || !secret) throw new Error('青龙配置缺失');

        let ql = await loadQingLong({ host, clientId, secret });
        await ql.checkLogin();
        await ql.getEnvs();

        const existing = ql.envs.find(env => env.name === name && env.remarks === remarks);
        if (existing) {
            await ql.updateEnv({ id: existing.id, value, name, remarks });
        } else {
            await ql.addEnv([{ value, name, remarks }]);
        }
    } catch (e) {
        $.log(`青龙同步失败: ${e.message}`);
    }
}

async function loadQingLong(QL) {
    let code = $.getdata('qinglong_code') || '';
    if (code) {
        eval(code);
        return new QingLong(QL.host, QL.clientId, QL.secret);
    }
    return new Promise(resolve => {
        $.getScript('https://fastly.jsdelivr.net/gh/Sliverkiss/QuantumultX@main/Utils/QingLong.min.js').then(fn => {
            $.setdata(fn, 'qinglong_code');
            eval(fn);
            resolve(new QingLong(QL.host, QL.clientId, QL.secret));
        });
    });
}


function Env(t,e){class s{constructor(t){this.env=t}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.map(t=>t??String(t)).join(' '))}msg(t='',e='',s='',o){}}return new class{constructor(t,e={}){this.name=t,this.startTime=Date.now(),this.logSeparator='\n',this.logs=[],this.logLevel='info',this.logLevels={debug:0,info:1,warn:2,error:3},this.logLevelPrefixs={debug:'[DEBUG] ',info:'[INFO] ',warn:'[WARN] ',error:'[ERROR] '},this.env=new s(t),this.env.logs=this.logs}getEnv(){let t='Quantumult X';return'undefined'!=typeof $task&&(t='Surge'),'undefined'!=typeof $loon&&(t='Loon'),'undefined'!=typeof $httpClient&&(t='Quantumult X'),t}getdata(t){let e=this.getval(t);return null==e||''===e?null:e}setdata(t,e){return this.setval(t,e)}getval(t){return this.getdata(t)}setval(t,e){return this.setdata(t,e)}msg(t='',e='',s='',o){const i=$.name||t;$.msg(i,e,s,o)}log(t){this.env.log(t)}logErr(t){this.log(`❗️${this.name}, 错误!`,t.message||t,t.stack)}done(t={}){$.done(t)}}(t,e)}