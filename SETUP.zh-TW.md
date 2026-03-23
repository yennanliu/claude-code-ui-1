# Claude Code 會話可視化工具 - 設定指南

## 概述
這是一個 Vue 3 + Tailwind CSS 應用程式，用於可視化 Claude Code 會話資料，包括對話歷史、訊息內容、時間戳記和代碼使用統計。

## 專案結構

```
.
├── index.html              # HTML 入口點
├── package.json            # 依賴項和指令碼
├── vite.config.js          # Vite 構建配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── .env                    # 環境變數
├── .gitignore              # Git 忽略檔案
├── src/
│   ├── main.js             # Vue 應用程式入口
│   ├── style.css           # 全球樣式（Tailwind 匯入）
│   ├── App.vue             # 根元件（佈局）
│   └── components/
│       ├── SessionList.vue       # 側邊欄會話列表
│       ├── DialogueViewer.vue    # 主訊息顯示區域
│       ├── MessageCard.vue       # 個別訊息元件
│       ├── StatsOverview.vue     # 右側面板統計
│       └── StatCard.vue          # 統計顯示卡片
├── server/
│   ├── index.js            # Express 伺服器
│   └── claudeDataReader.js # 資料讀取工具
└── dist/                   # 構建輸出（已生成）
```

## 安裝

```bash
# 安裝依賴項
npm install
```

## 執行應用程式

該應用程式需要兩個終端機：

### 終端機 1：啟動後端伺服器
```bash
npm run server
```
在 `http://localhost:3001` 上啟動 Express 伺服器，從 `~/.claude` 目錄提供資料。

### 終端機 2：啟動前端開發伺服器
```bash
npm run dev
```
在 `http://localhost:5173` 上啟動 Vite 開發伺服器，支援熱模組重新載入。

然後在瀏覽器中打開：**http://localhost:5173**

## 功能

### 會話列表（左側邊欄）
- 從 `~/.claude/projects/` 目錄查看所有 Claude Code 會話
- 按專案分組的會話
- 顯示會話日期和訊息計數
- 點擊以選擇會話進行詳細檢視
- 重新整理按鈕以重新載入會話列表

### 對話檢視器（主要區域）
- 顯示所選會話中的所有訊息
- 訊息卡片顯示：
  - 角色（用戶/助手/tool_use/tool_result/thinking）
  - 時間戳記
  - 訊息內容（截斷至 500 個字元）
  - 代碼計數（輸入/輸出）
  - 工具使用詳情（如果適用）

### 統計面板（右側邊欄）
- **整體統計**：
  - 總代碼、輸入和輸出代碼
  - 快取讀取和建立的代碼
- **按模型**：按 AI 模型的代碼使用量分解
- **會話統計**：
  - 總會話數
  - 總訊息數
  - 每個會話的平均訊息數

## 資料來源

該應用程式從 Claude Code 安裝中讀取資料：

1. **會話**：`~/.claude/projects/{project-path}/{sessionId}.jsonl`
   - JSONL 格式（每行一個 JSON 物件）
   - 包含具有類型、內容、時間戳記和代碼信息的訊息

2. **代碼統計**：`~/.claude/stats-cache.json`
   - 按模型和日期的彙總代碼使用

## 為生產環境構建

```bash
npm run build
```

這會在 `dist/` 目錄中建立一個最佳化的構建。

若要在本地預覽生產環境構建：
```bash
npm run preview
```

## 技術棧

- **前端**：Vue 3（組合式 API）
- **樣式**：Tailwind CSS
- **構建工具**：Vite
- **後端**：Express.js
- **HTTP 客戶端**：Axios

## 瀏覽器支援

支援 ES2020+ 的現代瀏覽器：
- Chrome/Edge（最新版）
- Firefox（最新版）
- Safari（最新版）

## 疑難解答

### 「找不到會話」
- 確保 `~/.claude/projects/` 目錄包含會話檔案
- 檢查後端伺服器是否在連接埠 3001 上執行
- 驗證 API 是否可在 `http://localhost:3001/api/sessions` 存取

### 「無法讀取統計」
- 檢查 `~/.claude/stats-cache.json` 是否存在
- 後端伺服器應將任何檔案讀取錯誤記錄到控制台

### 連接埠衝突
- 在 `server/index.js` 中更改後端連接埠：`const PORT = process.env.PORT || 3001`
- 在 `vite.config.js` 中更改前端連接埠：`port: 5173`
- 如果更改後端連接埠，請更新代理目標

### CORS 錯誤
- 後端包括 CORS 標頭。確保瀏覽器允許請求。
- 檢查後端和前端是否都在執行。

## 環境變數

`.env` 檔案：
```
VITE_API_BASE=/api    # API 基礎 URL（用於代理）
PORT=3001             # 後端伺服器連接埠
```

## 開發注意事項

- 已為 Vue 元件啟用熱模組替換
- Tailwind CSS 在生產中清除未使用的樣式
- 元件使用 Vue 3 組合式 API，具有 `<script setup>` 語法
- 後端使用 ES 模組（不支援 CommonJS）

## 未來增強功能

- 即時更新（監視檔案變更）
- 將會話匯出為 markdown/HTML
- 一段時間內的代碼使用趨勢（圖表）
- 訊息搜尋功能
- 按訊息類型篩選
- 暗色模式切換
- 即時會話監視
