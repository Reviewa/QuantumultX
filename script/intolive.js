/*
 * name: intoLive 通杀解锁
 * appstore: https://apps.apple.com/cn/app/id1061859052
 * 适配平台：Surge / QuantumultX / Loon
 */

const list = [
  "me.imgbase.intolive.proSubWeekly",
  "me.imgbase.intolive.proSubMonthly",
  "me.imgbase.intolive.proSubYearly",
  "me.imgbase.intolive.proSubYearly2024",
  "me.imgbase.intolive.removead"
];

const now = Math.floor(Date.now() / 1000);
const expire = now + 10 * 365 * 24 * 3600;

const subscriptions = {};
const entitlements = {};

for (const id of list) {
  subscriptions[id] = {
    "expires_date": new Date(expire * 1000).toISOString(),
    "original_purchase_date": new Date(now * 1000).toISOString(),
    "purchase_date": new Date(now * 1000).toISOString(),
    "ownership_type": "PURCHASED",
    "store": "app_store"
  };

  entitlements[id] = {
    "expires_date": new Date(expire * 1000).toISOString(),
    "product_identifier": id,
    "purchase_date": new Date(now * 1000).toISOString()
  };
}

const body = {
  "request_date": new Date(now * 1000).toISOString(),
  "request_date_ms": now * 1000,
  "subscriber": {
    "entitlements": entitlements,
    "first_seen": new Date(now * 1000).toISOString(),
    "last_seen": new Date(now * 1000).toISOString(),
    "original_app_user_id": "$RCAnonymousID:" + $persistentStore.read("intolive_id") || "random_" + Math.random().toString(36).substring(2),
    "subscriptions": subscriptions
  }
};

$done({ body: JSON.stringify(body) });