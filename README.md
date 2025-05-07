# Pomodoro Timer

> 一个美观易用的番茄钟桌面应用，专为提升专注力与工作效率而设计。

## 项目简介

Pomodoro Timer 是一款基于 Electron + React + Vite 开发的跨平台番茄钟桌面应用，支持任务管理、专注计时、历史统计、主题切换等功能，界面简洁美观，适合开发者、学生、自由职业者等各类用户。

作者：**niujuqin**

---

## 主要功能

- 番茄钟专注计时（可自定义专注/休息时长）
- 任务（Todo）管理
- 专注历史记录与统计分析
- 主题切换（明亮/暗色）
- 音效提醒（支持静音）
- 键盘快捷键支持
- 支持 Mac DMG 桌面打包

---

## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/你的仓库名.git
cd pomodoro-app（done）
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发环境

```bash
npm run electron:dev
```

---

## 打包桌面应用（以 Mac 为例）

```bash
npm run electron:build
```

打包产物在 `release/` 目录下，双击 DMG 文件即可安装。

---

## 贡献方式

欢迎任何形式的贡献！你可以：
- 提交 Issue 反馈 bug 或建议
- 提交 Pull Request 优化代码或文档
- Fork 本项目自行开发

---

## 开源协议

本项目采用 [MIT License](./LICENSE) 开源，欢迎自由使用和二次开发。

---

## 截图

**主界面（浅色模式）**

![主界面-浅色](screenshot/main-light.png)

**主界面（深色模式）**

![主界面-深色](screenshot/main-dark.png)

**历史记录**

![历史记录](screenshot/hisitory.png)

**统计分析**

![统计分析](screenshot/statics.png)

---

## 联系方式

如有问题或建议，欢迎通过 Issue 联系作者。 