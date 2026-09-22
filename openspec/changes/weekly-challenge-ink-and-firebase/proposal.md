## Why

原本的計時模式（Timing Mode）需連續通關 25 關，遊玩時間過長且缺乏每週重複遊玩動力。為了提高遊戲留存率（Retention）與玩家參與度，將計時模式轉型為「每周挑戰」與「墨汁體力機制」，並整合 Firebase Realtime Database 實現全球每週排行榜、玩家總數統計與暱稱系統。

## What Changes

1. **每週挑戰機制 (Weekly Challenge)**：
   - 替換原計時模式為每週挑戰，每週自動挑選 5 關（從 1~5、6~10、11~15、16~20、21~25 各抽 1 關）。
   - 純前端確定性隨機演算法（PRNG + Date Seed），全球玩家同週關卡一致，且保證隔週絕不重複。
   - 主選單增加「每周挑戰」按鈕，玩家通關第 25 關後解鎖。
2. **墨汁體力與廣告恢復 (Ink System)**：
   - 挑戰每週挑戰需消耗 1 點墨汁（上限 3 點）。
   - 每日台灣時間 12:00 (UTC+8) 自動恢復 1 點墨汁（離線時間戳計算）。
   - 提供「看廣告恢復墨汁」選項（採用 AdMob 測試 ID，支援 APK 直載與 Google Play）。
3. **暱稱與個人化 (Nickname & Profile)**：
   - 首次開啟遊戲彈窗要求玩家輸入暱稱，顯示於主選單左上角。
   - 設定選單（Settings）新增「變更暱稱」按鈕。
4. **Firebase 排行榜與玩家數據 (Firebase Leaderboard & User Tracking)**：
   - 使用 Firebase Realtime Database (匿名 Auth)。
   - 紀錄 `users` 節點（UID、暱稱、上線時間），便於查詢總玩家數與 DAU 活躍度。
   - 紀錄 `weekly_leaderboards/{YEAR_WEEK}` 節點，每週自動獨立排行榜。
   - 變更暱稱時同步更新 `users` 與當週排行榜記錄（作法 B）。
5. **UI 視覺極簡化與統一 (Minimalist UI & Unified Back Button)**：
   - 每周挑戰視窗採用極簡風格：左上 `[ ⬅ ]` 正方形返回按鈕、右上墨汁與下方廣告按鈕、中央 5 關卡直線連接、底部最佳紀錄、左下排行榜與右下開始挑戰按鈕。
   - 統一所有子視窗（關卡選擇、設定、每周挑戰）左上角正方形 `[ ⬅ ]` 返回按鈕。

## Capabilities

### New Capabilities
- `weekly-challenge`: 每週關卡確定性抽籤、通關25關解鎖條件與每週連續5關計時挑戰。
- `ink-system`: 墨汁體力管理（容量3、每日12:00恢復、廣告加墨汁）。
- `nickname-and-profile`: 首次玩家暱稱設定、主畫面暱稱顯示與設定介面修改暱稱。
- `firebase-leaderboard`: Firebase 匿名認證、總玩家數統計節點、每週獨立排行榜與暱稱同步（作法 B）。

### Modified Capabilities
(無需求變更的既存 specs，本變更新增獨立 capabilities)

## Impact

- `docs/index.html`: 引入 Firebase JS SDK (App, Auth, Database) 及 AdMob (Capacitor) 腳本。
- `docs/menu.js`: 主選單新增暱稱顯示與每周挑戰按鈕，重新繪製極簡風格每周挑戰視窗，統一所有子視窗左上角 `[ ⬅ ]` 正方形返回按鈕。
- `docs/progress.js`: 儲存 `nickname`、`inkCount`、`lastInkRestoreTimestamp` 及每週挑戰通關最佳紀錄。
- `docs/game.js`: 每周挑戰 5 關連續計時模式流程控制與成績提交 Firebase。
- 新增 `docs/firebase-config.js`: 初始化 Firebase 配置與排行榜 API。
