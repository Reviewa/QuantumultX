/**
 * Author: Reviewa
 * Module: autoRefresh
 */

import { get, set } from "./storage";

const KEY = "auto_refresh_interval";

export function getInterval(): number {
  return get(KEY, 60); // 默认60分钟
}

export function setInterval(min: number) {
  set(KEY, min);
}