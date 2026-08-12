## Purpose

提供玩家挑戰模式通關計數與 1-25 關計時模式（Time Attack）的挑戰機制、即時 UI 顯示與最佳紀錄儲存。

## ADDED Requirements

### Requirement: Challenge Mode Clear Count Tracking
系統應於玩家成功通關「挑戰關卡」時增加通關計數，並於關卡選擇畫面正確顯示次數與皇冠圖示。

#### Scenario: Complete challenge mode
- **WHEN** 玩家完成挑戰關卡並觸發過關
- **THEN** 系統將挑戰模式通關次數加 1 並持久化儲存，關卡選擇選單顯示通關次數與 👑 皇冠圖示

### Requirement: Timing Mode Continuous Gameplay
系統應支援從第 1 關起連續遊玩至第 25 關，過關時無縫推進至下一關，且掉落或手動重來時不重置計時器。

#### Scenario: Level progression in timing mode
- **WHEN** 玩家在計時模式中完成第 1 至第 24 關的任一關卡
- **THEN** 系統不顯示過關彈窗，直接載入下一關，且右上角計時器持續計時

#### Scenario: Retry in timing mode
- **WHEN** 玩家在計時模式中角色掉出畫面或點擊「重來」按鈕
- **THEN** 系統重置當前關卡角色與地圖狀態，但總計時器繼續累計不重置

### Requirement: Timing Mode Exit Confirmation Modal
系統應在玩家於計時模式中點擊「退出」按鈕時，顯示自訂 Pixi 視窗提醒計時將中斷。

#### Scenario: Cancel exit from timing mode
- **WHEN** 玩家在計時模式點擊「退出」並在確認彈窗點擊「繼續遊戲」
- **THEN** 系統隱藏彈窗，遊戲與計時器恢復運行

#### Scenario: Confirm exit from timing mode
- **WHEN** 玩家在計時模式點擊「退出」並在確認彈窗點擊「確認退出」
- **THEN** 系統終止當前計時模式，清除計時狀態，並返回關卡選擇選單

### Requirement: Timing Mode Best Record Saving
系統應於玩家完成第 25 關時停止計時，記錄最佳成績，並於關卡選擇選單顯示紀錄與皇冠。

#### Scenario: Complete timing mode with new record
- **WHEN** 玩家完成第 25 關且總耗時少於歷史最佳紀錄（或首次通關）
- **THEN** 系統更新 `timingBestTime` 紀錄，顯示結算視窗，並於關卡選擇選單中更新最佳成績與 👑 皇冠圖示
