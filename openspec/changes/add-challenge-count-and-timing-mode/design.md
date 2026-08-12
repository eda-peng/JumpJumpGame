## Context

詳見 `proposal.md`。遊戲基於 Pixi.js 渲染與全域單例 `window.progressManager` 進行 LocalStorage 進度管理。

## Goals / Non-Goals

**Goals:**
- 在 `ProgressManager` 中擴充挑戰次數與計時最佳時間的存取。
- 在 `menu.js` 的 `updateLevelButtons()` 中調整次數與時間顯示。
- 在 `game.js` 中建立計時器機制、右上角 HUD、Option A 無縫關卡切換、與 Option B 自訂 Pixi 退出 confirmation modal。

**Non-Goals:**
- 不修改既有 1~25 關卡的地形配置。
- 不增加線上排行榜或伺服器端同步。

## Decisions

### Decision 1: ProgressManager 資料結構擴充與向下相容
- **做法**:
  - `challengeClearCount`: 數字 (預設 `0`)。
  - `timingBestTime`: 數字 (毫秒，預設 `null`)。
  - 在 `getProgress()` 中自動給予預設值，確保舊紀錄不受影響。
- **替代方案**: 使用獨立的 LocalStorage key。選擇目前做法可維護單一存檔狀態。

### Decision 2: 計時器狀態與 HUD (右上角)
- **做法**:
  - 於 `game.js` 中新增 `timingStartTime` 與 `timingElapsedTime` 變數。
  - 在 `update(ticker)` 中更新計時，並於 `window.gameContainer` 的右上角 (`x = 780`, `anchor.x = 1.0`, `y = 15`) 渲染 PIXI.Text。
  - 格式為 `⏱️ MM:SS.ss`。

### Decision 3: Option B 自訂 Pixi 退出確認彈窗 (Modal)
- **做法**:
  - 於 `gameContainer` 或獨立 overlay 中建立 `timingExitModalContainer`。
  - 包含半透明黑色背景遮罩、彈窗背景圖案、提示文字及兩個按鈕：「繼續遊戲」與「確認退出」。
  - 點擊退出按鈕時暫停 `gameState = "PAUSED"` 並顯示彈窗。

## Risks / Trade-offs

- [Ticker 暫停與時間計算] → 切換關卡或開啟退出彈窗時，使用累計毫秒數 (Elapsed Time) 以避免 `Date.now()` 在暫停期間繼續計時問題。
- [Pixi Text 頻繁重新創建] → 避免每幀 `new PIXI.Text()`，改為在 `setupGame` 初始化一次文字物件，在 `update` 僅修改 `text` 屬性。
