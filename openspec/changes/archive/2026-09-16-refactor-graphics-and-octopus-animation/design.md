## Context

參見 `proposal.md`。遊戲原本將所有 PixiJS 繪圖元件與主邏輯混合寫在 `docs/game.js`。為了使模组更加清晰，將繪圖邏輯移至 `docs/graphics.js`，並在其內部為 `CuteOctopusPlayer` 實作 4 種狀態向量姿態繪製。

## Goals / Non-Goals

**Goals:**
- 將繪圖與視覺裝飾元件（`CuteOctopusPlayer`, `createCoralWall`, `createOceanFloor`, `SeaweedZone`, `AnemoneZone`, `ShrimpGoal`, `OceanBubbleSystem`）抽離至 `docs/graphics.js`。
- 在 `CuteOctopusPlayer` 中實現以狀態驅動的 4 態向量跳躍姿態動畫 (`IDLE`, `RISING`, `APEX`, `FALLING`)。
- 確保物理碰撞邊界始終鎖定為 32x48，且碰撞邊界與實際跳躍軌跡不受到姿態切換影響。

**Non-Goals:**
- 不修改 `levels.js` 或關卡佈局資料。
- 不改變原本的重力 (GRAVITY) 與跳躍初速 (JUMP_FORCE) 物理常數。

## Decisions

- **決策 1: 建立獨立的 `docs/graphics.js` 檔案**
  - **原因**: `game.js` 檔案長度已接近 900 行，抽離 350+ 行繪圖邏輯能大幅提升程式碼可讀性與維護性。
  - **替代方案**: 保持單一 `game.js` 檔案。但這會使狀態動畫邏輯與碰撞主迴圈混雜在一起。

- **決策 2: 採用向量狀態渲染 `renderOctopusState(state)` (方案 A)**
  - **原因**: 原生 PixiJS `PIXI.Graphics` 向量繪製不需外帶 PNG 圖檔即可動態變形，解析度無損且高度彈性。
  - **替代方案**: 使用多張外部 PNG 圖片切換。但向量繪製更符合目前遊戲的程序化美術風格。

- **決策 3: 碰撞箱解耦與對齊**
  - **原因**: 保持 `boundsBox` 固定為 `32x48` 像素，內部 `graphics` 觸手底部永遠對齊 `y = 48`，確保物理判定 100% 一致。

## Risks / Trade-offs

- [Risk] `graphics.js` 未於 `game.js` 之前載入 → [Mitigation] 在 `docs/index.html` 的 `<head>` 或 `<body>` 中將 `<script src="graphics.js"></script>` 放置於 `<script src="game.js"></script>` 之前。
