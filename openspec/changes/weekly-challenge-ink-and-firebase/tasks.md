## 1. Firebase 整合與數據模組 (Firebase & Data Module)

- [x] 1.1 在 `docs/index.html` 引入 Firebase JS SDK (App, Auth, Database) 腳本。
- [x] 1.2 建立 `docs/firebase-config.js`，初始化 Firebase App、匿名認證 (Anonymous Auth) 與 Realtime Database 實例。
- [x] 1.3 實現 `users/{UID}` 寫入與更新邏輯（含暱稱、創建時間與最後上線時間戳記）。
- [x] 1.4 實現每週獨立排行榜 `weekly_leaderboards/{YEAR_WEEK}` 上傳與前 50 名查詢邏輯。
- [x] 1.5 實現暱稱同步邏輯（作法 B）：變更暱稱時透過多路更新同時修改 `users` 與當週排行榜節點。

## 2. 進度與墨汁體力系統 (Progress & Ink Stamina System)

- [x] 2.1 擴充 `docs/progress.js` 的進度資料結構，新增 `nickname`、`inkCount` (預設3)、`lastInkRestoreDate` 及每週最佳紀錄欄位。
- [x] 2.2 在 `progress.js` 實現每日 12:00 (UTC+8) 墨汁自動恢復邏輯（離線時間戳比較）。
- [x] 2.3 實現看廣告恢復墨汁介面鉤子與 AdMob 測試 ID 整合。

## 3. 每週關卡抽籤與遊戲流程 (Weekly Stage Generator & Game Loop)

- [x] 3.1 在 `docs/game.js` 或新模組實現每週關卡確定性抽籤演算法（計算 weekIndex，PRNG 抽 5 關且隔週不重複）。
- [x] 3.2 改造遊戲流程，支援每週挑戰 5 關連續計時模式與關卡間自動推進。
- [x] 3.3 實現每週挑戰結算與成績上傳 Firebase 及本地存檔更新。

## 4. UI 介面重構與統一 (UI Refactoring & Redesign)

- [x] 4.1 在 `docs/menu.js` 主選單左上角加入玩家暱稱顯示 `👤 玩家暱稱`，若未設定則觸發首次暱稱輸入彈窗。
- [x] 4.2 實現主選單「每周挑戰」按鈕解鎖邏輯（檢查 `isLevelCompleted(25)`，未解鎖呈灰色停用）。
- [x] 4.3 實作極簡風格每週挑戰視窗（左上 `[ ⬅ ]` 正方形按鈕、右上墨汁與下方看廣告按鈕、中央 5 關卡直線連接、底部最佳紀錄、左下排行榜、右下開始挑戰）。
- [x] 4.4 實作全球排行榜彈出視窗（顯示前 50 名與玩家個人排名）。
- [x] 4.5 在設定選單（Settings）新增「變更暱稱」按鈕與彈窗輸入邏輯。
- [x] 4.6 統一所有子視窗（關卡選擇、設定、每周挑戰）左上角正方形 `[ ⬅ ]` 返回按鈕元件。
