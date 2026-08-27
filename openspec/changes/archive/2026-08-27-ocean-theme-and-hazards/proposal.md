## Why

遊戲目前使用簡單的單色方塊表示加速與減速區塊，視覺較為平淡。透過引進 PixiJS 程序動態繪圖（貝茲曲線動態水草、彈性觸手海葵與金黃寶箱），在不改變現有遊戲平衡的前提下，顯著提升遊戲的美術質感與海洋主題氛圍。

## What Changes

- 用 PixiJS 貝茲曲線繪製的波浪擺動綠色水草替換 `type: 'speedup'` 物件。
- 用 PixiJS 橢圓底座與動態脈動觸手繪製的紅色海葵替換 `type: 'speeddown'` 物件。
- 將終點 (Goal) 替換為具金黃光澤的寶箱圖案。
- 維持原本加速帶 (`+0.5`, 上限 10) 與減速帶 (`-0.5`, 下限 2) 的碰撞計算與速度調整機制。

## Capabilities

### New Capabilities
- `ocean-speed-zones`: 海洋主題之動態水草加速區、海葵減速區與寶箱終點之 PixiJS 繪製與動畫渲染能力。

### Modified Capabilities
<!-- None -->

## Impact

- `docs/game.js`: 引入程序化水草與海葵類別，並於更新迴圈 (`app.ticker`) 驅動波浪動畫與碰撞處理。
- `docs/levels.js`: 現有關卡資料保持完全相容。
