# QFO量化回测平台教学网站

QFO Quant Platform Website 是 [QFO量化回测平台](https://github.com/yeh2017/QFO-Quant-Platform) 的静态教学网站，面向 A 股量化回测、股票量化回测和量化研究学习场景。

网站覆盖数据中台、智能选股、因子模块、策略回测、组合风控、可视化分析、新闻中心和在线实战沙盒，用于帮助用户理解 QFO 的主要模块和使用路径。

当前版本 **v1.0.5**：累计继承 v1.0.3 的功能修复和 v1.0.4 的安装改进，新增首次／快速启动分离、可见日志与启动进度，并固定 AkShare 1.18.91。[完整更新日志](https://github.com/yeh2017/QFO-Quant-Platform/blob/main/CHANGELOG.md)。

## 在线访问

[https://www.qfo-quant-platform.com/](https://www.qfo-quant-platform.com/)

## 快速开始

### Windows 用户

1. **下载**：[下载最新稳定版安装包](https://github.com/yeh2017/QFO-Quant-Platform/releases/latest/download/QFO-Quant-Platform.zip)。
2. **解压**：将压缩包解压到一个**不包含中文、空格**的路径下，例如 `D:\QFO`。
3. **运行**：双击文件夹内的 **`run_first_time.bat`** 启动；日常快速启动使用 **`run_quick_start.bat`**。

> **注意**
> - 请勿直接在压缩包内运行。
> - 需要 Python 3.12+ 和 Node.js 22.12+。详细步骤见 [Windows 安装教程](https://www.qfo-quant-platform.com/guides/windows-install)。

## 本地预览

```bash
python -m http.server 5177
```

打开 `http://127.0.0.1:5177/`。

## 部署到 Vercel

- Framework Preset: `Other`
- Build Command: 留空
- Output Directory: `.`

连接 GitHub 仓库后，推送到 `main` 会自动触发生产部署。

## 相关仓库

- 主项目：[QFO-Quant-Platform](https://github.com/yeh2017/QFO-Quant-Platform)
- 教学网站：[QFO-Quant-Platform-Website](https://github.com/yeh2017/QFO-Quant-Platform-Website)
- 开源工具：[ChatGPT/Codex 本地历史记录清理工具](https://github.com/yeh2017/chatgpt-codex-local-history-cleanup-tool)（独立的非官方社区工具，与 QFO 功能和数据互不关联）
