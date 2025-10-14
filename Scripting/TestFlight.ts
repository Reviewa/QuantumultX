// Author: Reviewa
// TestFlight departures.to 监控脚本

import { fetchHTML, buildStack, autoRefresh, ConfigPage, get, set } 
  from "https://raw.githubusercontent.com/Reviewa/QuantumultX/main/Scripting/Scripting.ts"
import { Widget, Navigation, Script } from "scripting"

const STORAGE_KEY = "_departures_lastTitle"
const REFRESH_KEY = "_autoRefresh_interval"

async function fetchDepartures() {
  const html = await fetchHTML("https://departures.to/latest")
  const regex = /<h2[^>]*>.*?<a href="(.*?)".*?>(.*?)<\/a>.*?<\/h2>/g
  const items: { title: string; link: string }[] = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const link = match[1].trim()
    const title = match[2].replace(/<[^>]+>/g, "").trim()
    if (title && link) items.push({ title, link })
  }
  return items
}

async function notifyNew(items: { title: string; link: string }[]) {
  if (!items.length) return
  const lastTitle = get(STORAGE_KEY, "")
  if (items[0].title !== lastTitle) {
    await Widget.notify("Departures 新条目", items[0].title)
    set(STORAGE_KEY, items[0].title)
  }
}

async function main() {
  await autoRefresh(async () => {
    const items = await fetchDepartures()
    await notifyNew(items)
  }, REFRESH_KEY)

  const items = await fetchDepartures()

  if (Script.parameter === "config") {
    await Navigation.present({ element: ConfigPage() })
  } else if (globalThis.runsInWidget) {
    Widget.present(buildStack(items, "📦 Departures 更新"))
  } else {
    await Navigation.present({ element: buildStack(items, "📦 Departures 更新") })
  }

  Script.exit()
}

main()