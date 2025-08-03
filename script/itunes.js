/*
[rewrite_local]
^https?:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const ddm = JSON.parse($response.body);
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
const bundle_id = ddm.receipt["bundle_id"] || ddm.receipt["Bundle_Id"];
const yearid = ${bundle_id}.year;
const yearlyid = ${bundle_id}.yearly;
const yearlysubscription = ${bundle_id}.yearlysubscription;
const lifetimeid = ${bundle_id}.lifetime;

const list = {
  'IPTV%20Flixana': { id: "iptv_flixana_lifetime_sub" },
  'AdBlocker': { id: "com.va.adBlocker.lifeTimefree" },
  'PhotosPK': { id: "indie.davidwang.PicPicks.membership.lifetime" },
  'WatchWallpaper': { id: "indie.davidwang.WatchWallpaper.yearsubscriptegold" },
  'com.beauty.MeiTui': { id: "vip_member_v3_365day" },
  'ChmReader': { id: "EpubReader_ProVersion" },
  'MediaConvert': { id: "MediaConverter_ProVersion" },
  'FDSunAlly': { id: "com.freenotes.sunally.lifetime" },
  'Period': { id: "com.hanchongzan.time.pro" },
  'com.sixiaobo.MusCut': { id: "com.purecollage.pro" },
  'FlashTransportMaster': { id: "com.flashtransport.fightenegery.yearly.base", latest: "Qiq" },
  'com.ideack.ASR': { id: "ASR_Permanent_Plan", latest: "Qiq" },
  'Presets': { id: "com.chromatech.chroma.yearlyAutoRenewable", latest: "Qiq" },
  'GoodTask': { id: "com.hahainteractive.goodtask3.pro", latest: "Qiq" },
  'com.hanchongzan.loverlist': { id: "com.hanchongzan.loverlist.01", latest: "Qiq" },
  'com.hanchongzan.period': { id: "com.hanchongzan.period.girl", latest: "Qiq" },
  'com.hanchongzan.book': { id: "com.hanchongzan.book.vip", latest: "Qiq" },
  'SoundLab': { id: "8001", latest: "Qiq" },
  'ECGANALYZER': { id: "com.wms.hrv.yearlyfamilysharing", latest: "Qiq" },
  'com.RuoG.Pixiu': { id: "com.RuoG.Pixiu.VIPYear", latest: "Qiq" },
  'com.ideack.BusinessCard': { id: "BusinessCardVipPerpetual", latest: "Qiq" },
  'com.ideack.MagicAudio': { id: "MagicAudioPermanent", latest: "Qiq" },
  'DuChuangZhe': { id: "org.zrey.du.main", latest: "Qiq" },
  'PhotoWhite': { id: "org.zrey.photowhite.flash_lifetime", latest: "Qiq" },
  'FETreeVideoChange': { id: "com.dj.videototext.forever", latest: "Qiq" },
  'FoodIdentificationTool': { id: "20002", latest: "Qiq" },
  'com.qingcheng.seal.Seal': { id: "com.qingcheng.seal.Seal.premium.forever", latest: "Qiq" },
  'com.geekapp.VoiceTranslation': { id: "VoiceTranslatorPerpetual", latest: "Qiq" },
  'com.idealityapp.VideoEditing': { id: "MagicVideo_Vip_Permanent", latest: "Qiq" },
  'YinzhangMaster': { id: "com.xiaoqi.seal.forever", latest: "Qiq" },
  'com.cuilingshi.flipclock': { id: "FlipClockProVersion", latest: "Qiq" },
  'com.maine.aifill': { id: "com.maine.aifill.unlimited", latest: "Qiq" },
  'DeviceFinder': { id: "com.wonderfind.lifetime", latest: "Qiq" },
  'Graphionica': { id: "premium_year", latest: "Qiq" },
  'AIAssistant': { id: "AIchat_1w_7.99_trial", latest: "Qiq" },
  'MonitorPlus': { id: "com.unhonin.MonitorPlus.proversion", latest: "Qiq" },
  'MessageHold': { id: "com.messagehold.forever", latest: "Qiq" },
  'co.vulcanlabs': { id: lifetimeid, latest: "Qiq" },
  'Guitar%20Gravitas': { id: "GuitarGravitasChordsScalesArpeggiosLessons", latest: "Qiq" },
  'com.eleven.chatgpt': { id: "com.chatgpt.yearly", latest: "Qiq" },
  'com.casttv.remotetv': { id: "liftetime2", latest: "Qiq" },
  'WallpaperWidget': { id: "com.widget.theme.yearly.3dayfree", latest: "Qiq" },
  'ProREC': { id: "ProAudioCamera_Annual", latest: "Qiq" },
  'TypeOn%20Keyboard': { id: "com.hanchongzan.book.vip", latest: "Qiq" },
  'PhotoCollagePro': { id: "PHOTABLE_PREMIUM", latest: "Qiq" },