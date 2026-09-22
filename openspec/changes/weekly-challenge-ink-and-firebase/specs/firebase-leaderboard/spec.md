## Purpose

整合 Firebase Realtime Database 實現全球每週排行榜、玩家總數與活躍度統計（`users` 節點），以及變更暱稱時的排行榜即時同步（作法 B）。

## ADDED Requirements

### Requirement: 玩家數據與總數統計登錄
系統 SHALL 在玩家登入時，於 Firebase `users/{UID}` 節點上記錄暱稱、首次註冊時間與最後上線時間戳記。

#### Scenario: 玩家開啟遊戲連線 Firebase
- **WHEN** 遊戲初始化並完成 Firebase 匿名驗證
- **THEN** 寫入/更新 `users/{UID}` 節點的 `nickname` 與 `lastActiveAt` 時間戳記

### Requirement: 每週獨立排行榜與極簡呈現
系統 SHALL 在玩家完成當週 5 關挑戰時，將通關時間（毫秒）與暱稱寫入當週排行榜節點 `weekly_leaderboards/{YEAR_WEEK}/{UID}`。

#### Scenario: 每週挑戰完成刷新個人最佳紀錄
- **WHEN** 玩家完成每週挑戰且總耗時優於本週歷史紀錄
- **THEN** 系統將最新通關時間與暱稱寫入當週 Firebase 排行榜

#### Scenario: 查看全球排行榜視窗
- **WHEN** 玩家點擊每周挑戰視窗左下角的「排行榜」按鈕
- **THEN** 彈出極簡風格排行榜視窗，顯示前 50 名玩家暱稱與成績及個人排名

### Requirement: 變更暱稱即時同步 (作法 B)
系統 SHALL 在玩家修改暱稱時，同時更新 `users/{UID}/nickname` 以及當週排行榜 `weekly_leaderboards/{YEAR_WEEK}/{UID}/name`。

#### Scenario: 玩家在設定修改暱稱
- **WHEN** 玩家提交新的暱稱
- **THEN** 系統更新本地暱稱、Firebase `users` 節點，並同步更新當週排行榜上的名字顯示
