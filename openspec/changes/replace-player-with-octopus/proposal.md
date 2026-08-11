## Why

將主角從原本簡單的藍色幾何方塊改為可愛的章魚圖片 `octopus.png`，提升遊戲視覺品質與玩家沉浸感。

## What Changes

- 將主角物理與視覺呈現從 `PIXI.Graphics` 矩形改為使用 `docs/octopus.png` 圖片資源的 `PIXI.Sprite`。
- 採用 Top-Left 錨點模式（方案 A），維持既有的地圖邊界與碰撞算式不變。
- 新增向左/向右移動時的左右視覺自動翻轉機制。

## Capabilities

### New Capabilities
- `player-character`: 定義主角外觀圖片載入、顯示比例 (2:3) 與轉向畫面的行為規範。

### Modified Capabilities

(無修改既有規範)

## Impact

- **前端繪圖與載入**: `docs/game.js` 中的 `init()` 異步預載入資源，以及 `setupGame()` 中的主角初始化 logic。
- **碰撞機制**: 無影響，持續採用既有碰撞算式。
