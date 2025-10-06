/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/IScreen.js
^https:\/\/cs\.kuso\.xyz\/configs\?.* url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/IScreen.js

[mitm]
hostname = buy.itunes.apple.com, cs.kuso.xyz
*/
let obj = {
  status: 0,
  environment: "Production",
  receipt: {
    receipt_type: "Production",
    app_item_id: 1534704608,
    bundle_id: "com.zerone.hidesktop",
    application_version: "4.2.71",
    original_application_version: "4.0",
    receipt_creation_date: "2999-09-09 09:09:09 Etc/GMT",
    receipt_creation_date_ms: "32503626054000",
    receipt_creation_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    request_date: "2999-09-09 09:09:09 Etc/GMT",
    request_date_ms: "32503626054000",
    request_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
    original_purchase_date: "2023-04-10 01:33:52 Etc/GMT",
    original_purchase_date_ms: "1681090432000",
    original_purchase_date_pst: "2023-04-09 18:33:52 America/Los_Angeles",
    in_app: [
      {
        quantity: "1",
        product_id: "com.zerone.hidesktop.forever",
        transaction_id: "1000000999999999",
        original_transaction_id: "1000000999999999",
        purchase_date: "2999-09-09 09:09:09 Etc/GMT",
        purchase_date_ms: "32503626054000",
        purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
        original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
        original_purchase_date_ms: "32503626054000",
        original_purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
        is_trial_period: "false",
        in_app_ownership_type: "PURCHASED"
      }
    ]
  },
  latest_receipt_info: [
    {
      quantity: "1",
      product_id: "com.zerone.hidesktop.forever",
      transaction_id: "1000000999999999",
      original_transaction_id: "1000000999999999",
      purchase_date: "2999-09-09 09:09:09 Etc/GMT",
      purchase_date_ms: "32503626054000",
      purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
      original_purchase_date: "2999-09-09 09:09:09 Etc/GMT",
      original_purchase_date_ms: "32503626054000",
      original_purchase_date_pst: "2999-09-09 02:09:09 America/Los_Angeles",
      is_trial_period: "false",
      in_app_ownership_type: "PURCHASED"
    }
  ],
  latest_receipt: "MIIFakeBase64ContentForIScreenApp==="
}

$done({body: JSON.stringify(obj)})

let body = $response.body
let data = JSON.parse(body)

if (data && data.data) {
  data.data.noAds = 1
  data.data.rewardAd = 0
  data.data.BannerAd = 0
  data.data.launchAd = 0
  data.data.IsandBannerAd = 0
  data.data.ThemeFeedAd = 0
  data.data.FeedAd = 0
  data.data.interstitial_ad = "0"
  data.data.vipPopupType = 0
  data.data.iapVipPopupEnable = 0
  data.data.trial_duration = 315360000
  data.data.interstitial_ad_interval = 999999
  data.data.ShowVipClaimViewInterval = 999999
  data.data.iapRetainPopupInterval = 999999
  data.data.pic_lock_count = 999
  data.data.interstitialWallpaper = 999999
}

$done({body: JSON.stringify(data)})