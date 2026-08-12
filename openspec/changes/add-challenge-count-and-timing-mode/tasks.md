## 1. Progress Manager Updates

- [x] 1.1 於 `docs/progress.js` 擴充 `challengeClearCount` 與 `timingBestTime` 存取方法
- [x] 1.2 實作完成挑戰模式時加總通關次數與完成計時模式時保存最佳成績邏輯

## 2. Menu UI Updates

- [x] 2.1 於 `docs/menu.js` 的 `updateLevelButtons()` 中調整挑戰模式按鈕下方顯示 `通關次數: X 次`
- [x] 2.2 於 `docs/menu.js` 的 `updateLevelButtons()` 中調整計時模式按鈕下方顯示 `最佳紀錄: MM:SS.ss` 與 👑 皇冠圖示
- [x] 2.3 點擊計時模式按鈕時呼叫 `setupGame('TIMING')`

## 3. Timing Mode Core Logic & HUD

- [x] 3.1 於 `docs/game.js` 的 `setupGame('TIMING')` 初始化連貫計時狀態（第 1 關，計時器歸零）
- [x] 3.2 於 `docs/game.js` 的 `update(ticker)` 中實作右上角計時器 HUD 顯示（`⏱️ MM:SS.ss`）
- [x] 3.3 實作計時模式中掉落或按下「重來」時，重設當前關卡但計時不中斷邏輯
- [x] 3.4 實作計時模式關卡無縫自動切換（第 1~24 關抵達終點時自動載入下一關）

## 4. Exit Confirmation Modal & Clear Settlement

- [x] 4.1 於 `docs/game.js` 實作自訂 Pixi 退出確認對話框 (Option B modal)
- [x] 4.2 於 `docs/game.js` 實作第 25 關完成時的計時停止、最佳紀錄比對保存與過關結算畫面
