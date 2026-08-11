## Context

參見 `proposal.md`。遊戲目前使用 `PIXI.Graphics().rect(0, 0, 32, 48)` 建立玩家。圖片檔 `docs/octopus.png` 已存在且比例為 2:3。

## Goals / Non-Goals

**Goals:**
- 在 `init()` 階段載入 `docs/octopus.png`。
- 在 `setupGame()` 建立章魚 `PIXI.Sprite` 並保持 32x48 大小。
- 在 `update()` 階段依據 `playerVelocityX` 自動處理 Sprite 的水平翻轉。
- 採用方案 A (Top-Left 錨點)，確保不改動既有碰撞檢測與位置算式。

**Non-Goals:**
- 不改變主角物理參數（重力、跳躍力、移動速度）。
- 不調整地圖或牆壁碰撞範圍。

## Decisions

### 1. 異步資源預載入
- **決策**: 在 `game.js` 的 `init()` 函式中使用 `await PIXI.Assets.load('octopus.png')` 預先載入紋理。
- **替代方案**: 在 `setupGame()` 時呼叫 `PIXI.Sprite.from('octopus.png')`。選擇 `Assets.load` 能確保繪圖時紋理已載入，避免短暫閃爍或維度為 0 的問題。

### 2. 方案 A：Top-Left 錨點 (0, 0) 與轉向處理
- **決策**: 維持 `player.anchor.set(0)`。翻轉視覺時，透過調整 Sprite 的 `scale.x` 與位移 `position.x`（或 `pivot.x`）實現向左翻轉但不影響包覆盒 (bounds) 計算。
- **替代方案**: 方案 B (Center 錨點 0.5, 0.5)。因為選擇方案 A 可以完全相容原先所有關卡配置與物理補償演算法。

## Risks / Trade-offs

- [圖片未正確讀取] → 補齊 `try...catch` 載入機制或回退至原矩形繪畫。
- [轉向翻轉導致邊界偏移] → 設定 `pivot.x` 或使用內部容器控制反轉點。
