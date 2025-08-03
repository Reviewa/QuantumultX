/*
[rewrite_local]
^https:\/\/buy\.itunes\.apple\.com\/verifyReceipt$ url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/itunes.js

[mitm]
hostname = buy.itunes.apple.com
*/

const data = JSON.parse($response.body);
const bundle = data?.receipt?.bundle_id || data?.receipt?.Bundle_Id || "";
const encoded = encodeURIComponent(bundle);

const now = Date.now();
const forever = 4102415999000;

const subscriptions = {
  "One%20Markdown": { id: "10012" },
  "ChmReader": { id: "EpubReader_ProVersion" },
  "com.bplreader.ios": { id: "bpl_pro_001" },
  "com.pinkwriter.markdown": { id: "com.pinkwriter.markdown.pro" },
  "org.quran.muslim": { id: "unlock_all_forever" },
  "com.journey.cloud": { id: "journey_yearly_2022" },
  "com.planner.vault": { id: "com.planner.vault.lifetime" },
  "com.pdf.reader.pro": { id: "pdfreader_premium_lifetime" },
  "com.mindmap.diagram": { id: "mindmap.vip.yearly" },
  "com.scan.documents": { id: "scanpro_lifetime" },
};

const match = subscriptions[encoded];

if (!match?.id) {
  $done({ body: JSON.stringify(data) });
} else {
  const pid = match.id;
  const tid = "6600000000" + Math.floor(Math.random() * 1e8);

  const item = {
    quantity: "1",
    product_id: pid,
    transaction_id: tid,
    original_transaction_id: tid,
    purchase_date_ms: `${now}`,
    original_purchase_date_ms: `${now}`,
    expires_date_ms: `${forever}`,
    is_trial_period: "false",
    is_in_intro_offer_period: "false"
  };

  const output = {
    receipt: {
      bundle_id: bundle,
      in_app: [item]
    },
    latest_receipt_info: [item],
    pending_renewal_info: [{
      product_id: pid,
      auto_renew_status: "1"
    }],
    status: 0
  };

  $done({ body: JSON.stringify(output) });
}