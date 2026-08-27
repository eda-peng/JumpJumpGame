## 1. 程序化視覺繪製類別 (Procedural Graphics Components)

- [x] 1.1 在 `docs/game.js` 中實作 `SeaweedZone` (綠色水草) 類別與貝茲曲線畫法及波浪搖曳更新邏輯
- [x] 1.2 在 `docs/game.js` 中實作 `AnemoneZone` (紅色海葵) 類別與觸手脈動更新邏輯
- [x] 1.3 在 `docs/game.js` 中實作 `TreasureChest` (金黃寶箱) 終點繪製函式

## 2. 關卡載入與遊戲迴圈整合 (Level Loading & Game Loop Integration)

- [x] 2.1 修改 `loadLevel()`：當 `customObjects` 中出現 `type: 'speedup'` 時載入 `SeaweedZone`，出現 `type: 'speeddown'` 時載入 `AnemoneZone`
- [x] 2.2 修改 `loadLevel()`：將 `goal` 替換為繪製的金黃寶箱
- [x] 2.3 在 `app.ticker` 更新迴圈中呼叫 `speedZones` 每個元件的 `update()`，驅動視覺搖曳動畫
- [x] 2.4 驗證碰撞加速度 (+0.5, 上限 10) 與減速度 (-0.5, 下限 2) 邏輯運作正常
