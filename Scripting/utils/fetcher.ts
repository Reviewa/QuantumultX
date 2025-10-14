// @ts-nocheck
export async function fetchHTML(url: string): Promise<string> {
  return await fetch(url).then(r => r.text())
}
