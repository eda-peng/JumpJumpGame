## 1. 資源與玩家初始化

- [x] 1.1 在 `docs/game.js` 的 `init()` 中異步預載入 `octopus.png` 紋理資源
- [x] 1.2 在 `setupGame()` 中將原本建立 `PIXI.Graphics` 矩形改為建立 32x48 的 `PIXI.Sprite`（採用方案 A Top-Left 錨點）

## 2. 轉向與視覺維護

- [x] 2.1 在 `update()` 函式中，依據 `playerVelocityX` 方向自動更新精靈水平翻轉視覺

## 3. 測試與驗證

- [x] 3.1 驗證主角章魚圖片顯示正常，且撞牆與著地物理邊界與先前完全一致
