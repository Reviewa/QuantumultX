// @ts-nocheck
// ===================== Scripting 单文件库 =====================

// --------------------- 存储工具 ---------------------
export function get(key: string, defaultValue?: any) {
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

// --------------------- HTML 获取 ---------------------
export async function fetchHTML(url: string) {
  const response = await fetch(url)
  return await response.text()
}

// --------------------- 自动刷新 ---------------------
export async function autoRefresh(callback: Function, key: string, intervalMin = 5) {
  const last = get(key, 0)
  const now = Date.now()
  if (now - last > intervalMin * 60 * 1000) {
    await callback()
    set(key, now)
  }
}

// --------------------- Widget 栈构建 ---------------------
import { Widget, Link, Spacer, Text as WText, Stack } from "scripting"

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

// --------------------- 可视化配置页面 ---------------------
import { Navigation, List, Section, Toggle, Button, NavigationStack } from "scripting"

export function ConfigPage() {
  return (
    <NavigationStack>
      <List navigationTitle="配置页面">
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

// ===================== 其他工具函数可继续扩展 =====================
