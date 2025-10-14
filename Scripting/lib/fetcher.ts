/**
 * Author: Reviewa
 * Module: fetcher
 */

export async function fetchHTML(url: string): Promise<string> {
  const req = new Request(url);
  req.headers = {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile Safari/604.1"
  };
  const html = await req.loadString();
  return html;
}
