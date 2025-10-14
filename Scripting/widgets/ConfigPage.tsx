// @ts-nocheck
import { Navigation, NavigationStack, List, Section, Text, Slider, Toggle, Button, useState } from "scripting"
import { get, set } from "../utils/storage"
import { setAutoRefreshEnabled, getAutoRefreshEnabled } from "../utils/autoRefresh"

const REFRESH_KEY = "_autoRefresh_interval"
const DISPLAY_KEY = "_widget_maxDisplay"

export function ConfigPage() {
  const dismiss = Navigation.useDismiss()
  const [interval, setInterval] = useState(get(REFRESH_KEY, 60))
  const [maxDisplay, setMaxDisplay] = useState(get(DISPLAY_KEY, 5))
  const [enabled, setEnabled] = useState(getAutoRefreshEnabled())

  return (
    <NavigationStack>
      <List navigationTitle="Scripting 配置" navigationBarTitleDisplayMode="inline"
        toolbar={{ topBarLeading: <Button title="关闭" action={dismiss} /> }}
      >
        <Section footer={<Text>自动刷新开关</Text>}>
          <Toggle title="启用自动刷新" value={enabled} onChanged={v => { setEnabled(v); setAutoRefreshEnabled(v) }} />
        </Section>
        <Section footer={<Text>刷新间隔（分钟）</Text>}>
          <Slider min={5} max={120} step={5} value={interval} onChanged={v => { setInterval(v); set(REFRESH_KEY, v) }} />
          <Text>当前间隔: {interval} 分钟</Text>
        </Section>
        <Section footer={<Text>Widget 最大显示条目</Text>}>
          <Slider min={1} max={20} step={1} value={maxDisplay} onChanged={v => { setMaxDisplay(v); set(DISPLAY_KEY, v) }} />
          <Text>当前最大显示: {maxDisplay}</Text>
        </Section>
      </List>
    </NavigationStack>
  )
}