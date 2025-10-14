// @ts-nocheck
export interface HotItem {
  title: string
  link?: string
}

export interface WidgetConfig {
  title?: string
  maxDisplay?: number
}

export interface ConfigOptions {
  refreshInterval?: number // 分钟
  maxDisplay?: number
  autoRefreshEnabled?: boolean
}