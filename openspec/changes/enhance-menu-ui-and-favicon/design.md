## Context

參見 `proposal.md`。主選單與關卡選擇畫面目前缺乏動態裝飾。將透過在 `menu.js` 呼叫 `graphics.js` 的既有繪圖元件（`createCoralWall`、`CuteOctopusPlayer` 與 `OceanBubbleSystem`），在選單背景加入多層次動態效果，並加入向量 SVG Favicon。

## Goals / Non-Goals

**Goals:**
- 在 `menuContainer` 底層加入 `createCoralWall(0, 400, 800, 50, true)` 地板。
- 在 `menuContainer` 加入跑動章魚 (`CuteOctopusPlayer`)，並設置 `eventMode = 'none'` 防止阻擋按鈕點擊，以 `x += 2.5 * dt` 速率由左向右移動與循環。
- 在 `levelSelectContainer` 背景加入 `OceanBubbleSystem`，於選單顯示時持續向上飄浮。
- 創建精緻章魚圓臉 `docs/favicon.svg`，並於 `docs/index.html` 引入。

**Non-Goals:**
- 不改變原本主選單的按鈕功能與關卡選擇轉場流程。

## Decisions

- **決策 1: 禁用背景章魚事件傳遞 (`eventMode = 'none'`)**
  - **原因**: 避免背景動畫章魚覆蓋「開始遊戲」或「設定」按鈕時誤擋玩家點擊。
- **決策 2: 使用純向量 SVG 作為 Favicon**
  - **原因**: SVG 向量檔案極小且在各解析度下皆無損高清。

## Risks / Trade-offs

- [Risk] 選單 Ticker 重複加入 → [Mitigation] 使用單一全局選單 update 邏輯或防呆檢查，確保選單隱藏時不耗費額外效能。
