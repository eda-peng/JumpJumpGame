## Why

目前遊戲的主選單與關卡選擇畫面較為單調，缺乏遊戲內的動態氛圍與主題元素；同時瀏覽器分頁頁籤缺少專屬的圖示 (Favicon)。

在主選單新增海底地形與純背景跑動的非互動章魚、在關卡選擇畫面加入動態海洋氣泡背景，並新增可愛章魚圓臉的 Favicon 標籤圖示，能顯著提升遊戲的整體視覺品質與主題一致性。

## What Changes

- **主選單動態背景與地板**：在主選單 `menuContainer` 底部鋪設關卡珊瑚地板 (`createCoralWall`)，並新增一隻由左往右無限循環奔跑的非互動背景章魚 (`CuteOctopusPlayer`)。
- **關卡選擇畫面氣泡背景**：在 `levelSelectContainer` 載入動態氣泡背景 (`OceanBubbleSystem`)，並於選單顯示時持續向上飄浮。
- **章魚圓臉 Favicon**：新增 `docs/favicon.svg` 向量圖檔，並在 `docs/index.html` 中引入，使瀏覽器頁籤顯示章魚圓臉圖示。

## Capabilities

### New Capabilities
- `menu-decorations`: 定義主選單裝飾地板、背景奔跑章魚、關卡選擇畫面動態氣泡與章魚圓臉 Favicon 的視覺呈現與互動規範。

### Modified Capabilities
（無）

## Impact

- **修改檔案**：
  - [`docs/index.html`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/index.html)
  - [`docs/menu.js`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/menu.js)
  - 新增 [`docs/favicon.svg`](file:///c:/Users/peng4/Documents/JS/05JumpJumpGame/docs/favicon.svg)
- **系統影響**：僅擴充選單介面與背景裝飾，不影響遊戲關卡邏輯與存檔進度。
