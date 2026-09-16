## 1. 創立繪圖模組與 HTML 載入重構

- [x] 1.1 創建 `docs/graphics.js` 檔案，移入 `createCoralWall`, `createOceanFloor`, `SeaweedZone`, `AnemoneZone`, `ShrimpGoal`, `OceanBubbleSystem` 與 `CuteOctopusPlayer` 類別定義
- [x] 1.2 在 `docs/index.html` 中引入 `<script src="graphics.js"></script>`（位於 `game.js` 前）
- [x] 1.3 重構 `docs/game.js` 移除已移出的繪圖類別，確保全域引用正常

## 2. 實作章魚 4 態向量姿態動畫 (Option A)

- [x] 2.1 在 `CuteOctopusPlayer` 中加入運動狀態判定邏輯 `updateState(velocityY, isGrounded)`
- [x] 2.2 實現 `IDLE` 狀態繪製（圓形頭部、微垂觸手、微笑表情）
- [x] 2.3 實現 `RISING` 狀態繪製（垂直伸長頭部、向下方緊收包裹的噴射觸手、驚喜嘴型 `:O`）
- [x] 2.4 實現 `APEX` 狀態繪製（正圓頭部、雨傘狀張開飄浮觸手、歡呼表情）
- [x] 2.5 實現 `FALLING` 狀態繪製（微壓扁頭部、受風壓向上飄起觸手、專注表情）
- [x] 2.6 鎖定 `boundsBox` 邊界為 32x48 像素，確保觸手腳底對齊 `y=48`

## 3. 測試與驗證

- [x] 3.1 驗證遊戲正常載入且無主台 console 報錯
- [x] 3.2 驗證章魚跳躍在起跳、頂點與下降過程中有流暢姿態切換
- [x] 3.3 驗證章魚碰撞箱與跳躍高度與原本 100% 完全一致
