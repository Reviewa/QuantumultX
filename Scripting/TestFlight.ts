// @ts-nocheck
// ===================== 引用库 =====================
import { fetchHTML, buildStack, autoRefresh, ConfigPage, get, set } from "./Scripting"
import { Widget, Navigation, Script, Link } from "scripting"

// ===================== 常量 =====================
const STORAGE_KEY = "_departures_lastTitle"
const REFRESH_KEY = "_autoRefresh_interval"
const DISPLAY_KEY = "_widget_maxDisplay"

// ===================== 获取 departures 最新条目 =====================
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

// ===================== 检查新条目并通知 =====================
async function notifyNew(items: { title: string; link: string }[]) {
  if (!items.length) return
  const lastTitle = get(STORAGE_KEY, "")
  if (items[0].title !== lastTitle) {
    await Widget.notify("Departures 新条目", items[0].title)
    set(STORAGE_KEY, items[0].title)
  }
}

// ===================== 构建 Widget 栈（点击跳转） =====================
function buildStackWithLinks(items: { title: string; link: string }[], titleText: string) {
  const maxDisplay = get(DISPLAY_KEY, 5)
  const stack = new Widget.Stack()
  stack.spacing = 8
  stack.padding = 16
  stack.add(new Widget.Text(titleText).font("headline"))

  for (let i = 0; i < Math.min(items.length, maxDisplay); i++) {
    const item = items[i]
    const link = new Link(item.link)
    const t = new Widget.Text("• " + item.title)
    t.font = "footnote"
    t.lineLimit = 1
    link.add(t)
    stack.add(link)
  }

  stack.add(new Widget.Spacer())
  return stack
}

// ===================== 主函数 =====================
async function main() {
  // 自动刷新
  await autoRefresh(async () => {
    const items = await fetchDepartures()
    await notifyNew(items)
  }, REFRESH_KEY)

  const items = await fetchDepartures()

  if (Script.parameter === "config") {
    // 可视化配置页面
    await Navigation.present({ element: ConfigPage() })
  } else if (globalThis.runsInWidget) {
    // Widget 模式
    const stack = buildStackWithLinks(items, "📦 Departures 更新")
    Widget.present(stack)
  } else {
    // 非 Widget 模式也可点击跳转
    const stack = buildStackWithLinks(items, "📦 Departures 更新")
    await Navigation.present({ element: stack })
  }

  Script.exit()
}

main()