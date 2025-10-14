// @ts-nocheck
export function get(key: string, defaultValue?: any) {
  try { return globalThis._store?.[key] ?? defaultValue } catch { return defaultValue }
}

export function set(key: string, value: any) {
  globalThis._store = globalThis._store || {}
  globalThis._store[key] = value
}