## Context

參見 [proposal.md](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/openspec/changes/weekly-challenge-ink-and-firebase/proposal.md)。本遊戲為基於 PixiJS + HTML5 的單機手機遊戲（搭配 Capacitor 打包 APK/Google Play）。過去的計時模式無網路連結且關卡過長。

## Goals / Non-Goals

**Goals:**
- 實現純前端確定性關卡抽籤（確定性 PRNG + Date Seed）。
- 實現墨汁體力機制（容量 3，每日 12:00 UTC+8 自動恢復 1 點）與 AdMob 獎勵影片整合。
- 實現 Firebase 匿名驗證、`users` 總玩家數統計節點及 `weekly_leaderboards/{YEAR_WEEK}` 排行榜。
- 實現暱稱同步（作法 B）：設定修改暱稱時同時更新本地存檔、Firebase `users` 及當週排行榜 `weekly_leaderboards`。
- 統一所有視窗（關卡選擇、設定、每周挑戰）左上角正方形 `[ ⬅ ]` 返回按鈕風格。

**Non-Goals:**
- 不架設任何專用伺服器或微服務後端（純依賴 Firebase Realtime Database BaaS）。
- 不強制要求玩家綁定第三方社群帳號（僅使用 Firebase Anonymous Auth）。

## Decisions

### 1. 關卡抽籤演算法 (Deterministic PRNG & Week Index)
- **決策**: 透過 `Math.floor((today - baseSunday) / (7 * 86400000))` 計算當週索引 `weekIndex`。
- 對於 5 個難度區間 $k \in \{0,1,2,3,4\}$（對應 1~5, 6~10, ... 21~25）：
  - 上週 offset $O_{last} \in [0, 4]$。
  - 本週 offset $O_{this} = (O_{last} + 1 + r) \pmod 5$，其中 $r \in [0, 3]$ 由以 `(weekIndex, k)` 為 Seed 的 PRNG 產生。
- **替代方案**: 伺服器每週動態下發（廢棄，因增加維護成本與離線不可用風險）。

### 2. 墨汁體力與時間點復原 (Timestamp-based Stamina Recovery)
- **決策**: 於 `localStorage` 保存 `lastInkRestoreDate` (格式 `"YYYY-MM-DD"`)。每次檢查時，若當前台灣時間 $\ge$ 今日 12:00:00 且 `lastInkRestoreDate < 今日`，則 `inkCount = min(3, inkCount + 1)`，並更新 `lastInkRestoreDate = 今日`。

### 3. Firebase 資料結構與暱稱同步 (作法 B)
- **決策**:
  - `users/{UID}` 節點：`{ nickname, createdAt, lastActiveAt }`
  - `weekly_leaderboards/{YEAR_WEEK}/{UID}` 節點：`{ name, time, updatedAt }`
  - 修改暱稱時，發起多路寫入 (Multi-location Update)：
    ```javascript
    const updates = {};
    updates[`users/${uid}/nickname`] = newName;
    updates[`weekly_leaderboards/${currentWeekKey}/${uid}/name`] = newName;
    firebase.database().ref().update(updates);
    ```

### 4. 極簡視覺 UI 規範
- 所有子畫面右上角或底部不必要的引導文字移除，畫面僅留功能圖像與關鍵數值。
- 所有非主選單 Container（`levelSelectContainer`, `settingsContainer`, `weeklyChallengeContainer`, `leaderboardContainer`）左上角統一呼叫 `createSquareBackButton()`，尺寸固定為 $44 \times 44 \text{ px}$。

## Risks / Trade-offs

- **[Risk] Firebase 讀寫安全風險（作弊刷榜）**
  - *Mitigation*: 於 Firebase Console 設定簡單的 Security Rules，限定時間格式與長度範圍（例如 `newData.val() > 0` 且長度合理），並在客戶端過濾不合理的時間數值。
- **[Risk] 廣告載入失敗或無網路**
  - *Mitigation*: 若 AdMob 無法播廣告或離線，顯示提示「網路連線失敗」，不影響每日 12:00 自動恢復機制。
