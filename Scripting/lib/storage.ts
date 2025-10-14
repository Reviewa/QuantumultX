/**
 * Author: Reviewa
 * Module: storage
 */

export function get(key: string, def?: any) {
  const value = Keychain.get(key);
  return value ? JSON.parse(value) : def;
}

export function set(key: string, value: any) {
  Keychain.set(key, JSON.stringify(value));
}