## Why

目前遊戲內的所有視覺繪圖類別（章魚主角、珊瑚牆壁、海底沙灘、水草、海葵、終點蝦子、海洋氣泡）全部混合寫在 `docs/game.js` 中，導致檔案長度膨脹至近 900 行，難以維持與擴充。此外，主角章魚在跳躍時缺乏明顯的動態動作變化。

將繪圖元件獨立為 `docs/graphics.js` 並加入章魚 4 態跳躍向量動畫（IDLE、RISING、APEX、FALLING），能提升遊戲碼結構清晰度，同時賦予章魚更生動的躍動打擊感與視覺反饋，且 100% 保持原本的 32x48 像素碰撞高度不變。

## What Changes

- **新增 `docs/graphics.js` 模組**：將 `game.js` 中的 6 個繪圖與裝飾類別（`CuteOctopusPlayer`, `createCoralWall`, `createOceanFloor`, `SeaweedZone`, `AnemoneZone`, `ShrimpGoal`, `OceanBubbleSystem`）抽離並獨立為 `docs/graphics.js`。
- **升級章魚 4 態跳躍動畫 (Option A)**：在 `CuteOctopusPlayer` 中實現 4 種狀態的動態向量繪製：
  - `IDLE` (地面)：圓形頭部、自然垂下觸手、微笑表情。
  - `RISING` (上升)：圓頭稍微延伸、觸手向下包裹（火箭噴射姿態）、張大嘴 `:O`。
  - `APEX` (頂點)：正圓頭、觸手向四周雨傘狀張開飄浮、驚喜表情。
  - `FALLING` (下降)：圓頭微壓扁、觸手受風壓向上飄起、專注表情。
- **固定物理碰撞**：明確鎖定 `32x48` 像素為物理碰撞 boundsBox，確保章魚跳躍高度、距離與碰撞邊界完全一致。
- **更新 `docs/index.html`**：在 `game.js` 之前引入 `graphics.js`。
- **重構 `docs/game.js`**：精簡 `game.js`，將其聚焦於物理運算、碰撞判斷與遊戲主迴圈。

## Capabilities

### New Capabilities
- `player-character`: 定義主角章魚在不同運動狀態（地面站立、跳躍上升、頂點滯空、下降俯衝）下的姿態呈現、狀態切換規則與物理邊界對齊標準。

### Modified Capabilities
（無，不影響現有的關卡與障礙物規則）

## Impact

- **修改檔案**：
  - [`docs/index.html`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/index.html)
  - [`docs/game.js`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/game.js)
  - 新增 [`docs/graphics.js`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/graphics.js)
- **相容性**：100% 相容現有 25 關與關卡資料，不影響原本的物理參數 (GRAVITY, JUMP_FORCE)。
