// Author: Reviewa
// Scripting 公共库函数
import { Stack, Link, Text as WText, Spacer, Navigation, List, Section, Toggle, Button, NavigationStack } from "scripting"

export function get(key: string, defaultValue: any) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : defaultValue
  } catch {
    return defaultValue
  }
}

export function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value))
}

export async function fetchHTML(url: string) {
  const response = await fetch(url)
  return await response.text()
}

export async function autoRefresh(callback: Function, key: string, intervalMin = 5) {
  const last = get(key, 0)
  const now = Date.now()
  if (now - last > intervalMin * 60 * 1000) {
    await callback()
    set(key, now)
  }
}

export function buildStack(items: { title: string; link: string }[], titleText: string, maxDisplay = 5) {
  const stack = new Stack()
  stack.spacing = 8
  stack.padding = 16
  stack.add(new WText(titleText).font("headline"))

  for (let i = 0; i < Math.min(items.length, maxDisplay); i++) {
    const item = items[i]
    const link = new Link(item.link)
    const t = new WText("• " + item.title)
    t.font = "footnote"
    t.lineLimit = 1
    link.add(t)
    stack.add(link)
  }

  stack.add(new Spacer())
  return stack
}

export function ConfigPage() {
  return (
    <NavigationStack>
      <List navigationTitle="配置">
        <Section footer={<WText>调整刷新间隔和显示条目数</WText>}>
          <Toggle
            title="自动刷新开关"
            value={get("_autoRefresh_enabled", true)}
            onChanged={v => set("_autoRefresh_enabled", v)}
          />
        </Section>
        <Section>
          <Button title="关闭" action={() => Navigation.dismiss()} />
        </Section>
      </List>
    </NavigationStack>
  )
}