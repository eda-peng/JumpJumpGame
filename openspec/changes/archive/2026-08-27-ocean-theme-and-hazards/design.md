## Context

當前 `docs/game.js` 在 `loadLevel()` 中透過單色 `PIXI.Graphics().rect()` 建立牆壁、加速帶與減速帶。詳細動機請參閱 `proposal.md`。

## Goals / Non-Goals

**Goals:**
- 在 `docs/game.js` 中實作 `Seaweed` 與 `SeaAnemone` 之動態物件類別。
- 將 `speedZones` 中的繪製邏輯替換為動態類別實例，並於 `app.ticker` 更新搖曳與脈動動畫。
- 將 `goal` 物件渲染為金黃寶箱樣式。
- 完全保持原有的加速 (`+0.5`, 上限 10) 與減速 (`-0.5`, 下限 2) 碰撞與觸發機制。

**Non-Goals:**
- 不改變 `levels.js` 中關卡座標與數據定義。
- 不重構基礎碰撞檢測 (`checkCollision`)。

## Decisions

### 1. 使用 `PIXI.Container` 封裝程序化圖像與動畫
- **決定**：建立繼承 `PIXI.Container` 的繪製元件（如 `SeaweedZone` 與 `AnemoneZone`），內部維護自己的 `PIXI.Graphics` 與 `time` 時間相位變數。
- **替代方案**：使用單一靜態 PNG 圖片。
- **考量**：PixiJS 程序化渲染無需加載額外圖片檔案，且能實現無縫流暢的動態波浪動畫效果。

### 2. 動畫更新註冊
- **決定**：將所有劃入 `speedZones` 的動態物件集合於陣列，在 `update(ticker)` 中遍歷呼叫 `zone.update(ticker.deltaTime)`。

## Risks / Trade-offs

- **[Risk] 動畫運算開銷**：多個動態水草同時在畫面上時，貝茲曲線計算可能增加 Ticker 負擔。
  - **緩解措施**：每個水草叢僅繪製 3 條簡單貝茲曲線葉片，效能極佳。
