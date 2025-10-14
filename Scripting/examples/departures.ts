// @ts-nocheck
import { fetchHTML } from "../fetcher"
import { get, set } from "../storage"
import { notify } from "../notification"
import { buildStack } from "../widgets/StackBuilder"
import { autoRefresh } from "../autoRefresh"
import { Widget, Navigation, Script } from "scripting"
import { ConfigPage } from "../widgets/ConfigPage"

const STORAGE_KEY = "_departures_lastTitle"
const REFRESH_KEY = "_autoRefresh_interval"
const DISPLAY_KEY = "_widget_maxDisplay"

async function fetchDepartures() {
  const html = await fetchHTML("https://departures.to/latest")
  const regex = /<h2[^>]*>.*?<a href="(.*?)".*?>(.*?)<\/a>.*?<\/h2>/g
  const items = []
  let match
  while ((match = regex.exec(html)) !== null) {
    const link = match[1].trim()
    const title = match[2].replace(/<[^>]+>/g, "").trim()
    if (title && link) items.push({ title, link })
  }
  return items
}

async function notifyNew(items) {
  if (!items.length) return
  const lastTitle = get(STORAGE_KEY, "")
  if (items[0].title !== lastTitle) {
    await notify("Departures 新条目", items[0].title)
    set(STORAGE_KEY, items[0].title)
  }
}

async function main() {
  // 自动刷新
  await autoRefresh(async () => {
    const items = await fetchDepartures()
    await notifyNew(items)
  }, REFRESH_KEY)

  const items = await fetchDepartures()

  if (Script.parameter === "config") {
    await Navigation.present({ element: ConfigPage() })
  } else if (globalThis.runsInWidget) {
    const stack = buildStack(items, "📦 Departures 更新", { maxDisplay: get(DISPLAY_KEY, 5) })
    Widget.present(stack)
  } else {
    const stack = buildStack(items, "📦 Departures 更新", { maxDisplay: get(DISPLAY_KEY, 5) })
    await Navigation.present({ element: stack })
  }

  Script.exit()
}

main()
