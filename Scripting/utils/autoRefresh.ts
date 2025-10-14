// @ts-nocheck
import { get, set } from "./storage"
import { notify } from "./notification"

const DEFAULT_INTERVAL = 60
const LAST_RUN_KEY = "_autoRefresh_lastRun"
const ENABLE_KEY = "_autoRefresh_enable"

export async function autoRefresh(callback: () => Promise<void>, intervalKey = "_autoRefresh_interval") {
  const enabled = get(ENABLE_KEY, true)
  if (!enabled) return

  const interval = get(intervalKey, DEFAULT_INTERVAL)
  const lastRun = get(LAST_RUN_KEY, 0)
  const now = Date.now()

  if (now - lastRun > interval * 60 * 1000) {
    try {
      await callback()
      set(LAST_RUN_KEY, now)
    } catch (e) {
      console.error("autoRefresh 执行失败:", e)
      await notify("自动刷新失败", String(e))
    }
  }
}

export function setAutoRefreshEnabled(v: boolean) {
  set(ENABLE_KEY, v)
}

export function getAutoRefreshEnabled() {
  return get(ENABLE_KEY, true)
}