# 📦 Scripting Module Hub

> 一套兼容 <a href="https://apps.apple.com/cn/app/scripting/id6479691128" target="_blank"><button style="background-color:#007aff; color:white; border:none; border-radius:6px; padding:4px 12px; font-size:14px; cursor:pointer;">Scripting</button></a> 的模块化脚本库，支持远程导入与自定义扩展，让你在 iOS 上像写现代 JavaScript 一样组织代码。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20iPadOS-lightgrey)](https://apps.apple.com/cn/app/scripting/id6479691128)
[![Scripting](https://img.shields.io/badge/Scripting-1.0+-blue)](https://apps.apple.com/cn/app/scripting/id6479691128)

---

## ✨ 特性

- 🧩 **模块化设计** – 按功能拆分脚本，通过 `importModule` 或自定义加载器动态引入。
- 🌐 **远程导入** – 直接通过 URL 加载云端模块，无需手动下载到本地。
- 🧠 **自定义扩展** – 提供标准化的模块接口，你可以轻松编写、分享自己的模块。
- 🔁 **本地缓存** – 远程模块自动缓存，支持离线使用和版本控制。
- 📱 **专为 Scripting 优化** – 兼容 Scripting 的文件管理、面板、图表等 API。

---

## 🚀 快速开始

### 1. 安装核心模块

将以下代码复制到你的 Scripting 脚本中，或者保存为 `ModuleHub.js` 到本地：

```javascript
// ModuleHub.js - 核心加载器
const MODULE_CACHE = FileManager.local().joinPath(FileManager.local().documentsDirectory(), "ModuleCache");

function ensureCacheDir() {
  const fm = FileManager.local();
  if (!fm.fileExists(MODULE_CACHE)) fm.createDirectory(MODULE_CACHE);
}

async function importRemote(url, version = "latest") {
  ensureCacheDir();
  const fileName = `${encodeURIComponent(url)}_${version}.js`;
  const cachePath = FileManager.local().joinPath(MODULE_CACHE, fileName);
  const fm = FileManager.local();
  
  if (fm.fileExists(cachePath)) {
    return importModule(cachePath);
  }
  
  const req = new Request(url);
  const code = await req.loadString();
  fm.writeString(cachePath, code);
  return importModule(cachePath);
}

// 导出全局可用
const ModuleHub = { importRemote };
ModuleHub.importRemote = importRemote;
ModuleHub.cacheDir = MODULE_CACHE;