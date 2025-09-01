/*

[rewrite_local]
^https:\/\/lanfanapp\.com\/api\/v1\/account\/login_via_wechat\.json url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Lanfan.js
^https:\/\/lanfanapp\.com\/api\/v1\/recipe\/get_last_prime_recipes\.json url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Lanfan.js
^https:\/\/lanfanapp\.com\/api\/v1\/goods\/prime\/get_all_v2\.json url script-response-body https://raw.githubusercontent.com/Reviewa/QuantumultX/main/script/Lanfan.js

[mitm]
hostname = lanfanapp.com

*/

let body = $response.body;
if (body) {
  try {
    let url = $request.url;
    let obj = JSON.parse(body);

    if (url.includes("/api/v1/account/login_via_wechat.json")) {
      if (obj.content && obj.content.user) {
        obj.content.user.is_prime = true;
      }
    }

    if (url.includes("/api/v1/recipe/get_last_prime_recipes.json")) {
      if (obj.content && obj.content.recipes) {
        obj.content.recipes = obj.content.recipes.map(r => {
          r.is_prime = false;
          r.need_prime = false;
          return r;
        });
      }
    }

    if (url.includes("/api/v1/goods/prime/get_all_v2.json")) {
      if (obj.content && obj.content.prime_goods) {
        obj.content.prime_goods = [];
      }
    }

    body = JSON.stringify(obj);
  } catch (e) {
    console.log("lanfan 脚本错误: " + e);
  }
}
$done({ body });