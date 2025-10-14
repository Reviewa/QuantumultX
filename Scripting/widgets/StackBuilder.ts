// @ts-nocheck
import { VStack, Text, Spacer, Link } from "scripting"
import type { HotItem, WidgetConfig } from "../types"

export function buildStack(items: HotItem[], titleText: string, config?: WidgetConfig) {
  const maxDisplay = config?.maxDisplay ?? 5
  const stack = new VStack()
  stack.spacing = 8
  stack.padding = 16
  stack.alignment = "leading"

  stack.add(new Text(titleText).font("headline"))

  for (let i = 0; i < Math.min(items.length, maxDisplay); i++) {
    const item = items[i]
    if (item.link) {
      const link = new Link(item.link)
      const t = new Text("• " + item.title)
      t.font = "footnote"
      t.lineLimit = 1
      link.add(t)
      stack.add(link)
    } else {
      const t = new Text("• " + item.title)
      t.font = "footnote"
      t.lineLimit = 1
      stack.add(t)
    }
  }

  stack.add(new Spacer())
  return stack
}
