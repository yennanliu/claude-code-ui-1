# Claude Code 會話可視化工具

一個 Vue 3 + Tailwind CSS 應用程式，用於可視化 Claude Code 會話資料，包括對話歷史、訊息內容、時間戳記和代碼使用統計。

## 快速開始

### 1. 安裝依賴項
```bash
npm install
```

### 2. 啟動後端伺服器（終端機 1）
```bash
npm run server
```
在 `http://localhost:3001` 上執行

### 3. 啟動前端開發伺服器（終端機 2）
```bash
npm run dev
```
在 `http://localhost:5173` 上打開

## 功能特色

✨ **會話管理**
- 查看 `~/.claude/projects/` 中的所有 Claude Code 會話
- 按專案分組的會話
- 快速會話選擇

💬 **訊息檢視器**
- 顯示完整的對話歷史
- 格式化的訊息卡片，包含時間戳記
- 每條訊息的代碼使用量
- 工具使用詳情（如果適用）

📊 **統計儀表板**
- 按模型的總代碼使用量
- 快取命中統計
- 會話分析
- 日常代碼追蹤

## 專案結構

```
├── src/
│   ├── App.vue                    # 主佈局容器
│   ├── components/
│   │   ├── SessionList.vue        # 會話側邊欄
│   │   ├── DialogueViewer.vue     # 訊息顯示
│   │   ├── MessageCard.vue        # 個別訊息
│   │   ├── StatsOverview.vue      # 統計面板
│   │   └── StatCard.vue           # 統計顯示
│   ├── main.js                    # Vue 應用程式入口
│   └── style.css                  # Tailwind 樣式
├── server/
│   ├── index.js                   # Express 伺服器
│   └── claudeDataReader.js        # 資料工具程式
└── index.html                     # HTML 入口點
```

## 資料來源

- **會話**: `~/.claude/projects/{project}/{sessionId}.jsonl`
- **統計**: `~/.claude/stats-cache.json`

## 開發

### 為生產環境構建
```bash
npm run build
```

### 預覽生產環境構建
```bash
npm run preview
```

## 技術棧

- **Vue 3** - 組合式 API，使用 `<script setup>` 語法
- **Tailwind CSS** - 工具優先的樣式設計
- **Vite** - 快速建構工具
- **Express** - 後端伺服器
- **Axios** - HTTP 客戶端

## 疑難解答

**「找不到會話」**
- 確保 `~/.claude/projects/` 目錄存在
- 後端伺服器必須執行
- 檢查瀏覽器控制台是否有 API 錯誤

**連接埠衝突**
- 後端連接埠：在 `.env` 或 `server/index.js` 中設定 `PORT`
- 前端連接埠：編輯 `vite.config.js`

**CORS 問題**
- 驗證後端伺服器是否執行
- 檢查前端是否正確訪問 `/api`

## 瀏覽器支援

現代瀏覽器（Chrome、Firefox、Safari、Edge）

## 後續步驟

查看 [SETUP.zh-TW.md](./SETUP.zh-TW.md) 以取得詳細的設定說明和配置選項。

## 未來增強功能

- 即時會話更新
- 將會話匯出為 markdown/HTML
- 訊息搜尋和篩選
- 代碼使用圖表和趨勢
- 暗色模式支援
- 訊息類型篩選
