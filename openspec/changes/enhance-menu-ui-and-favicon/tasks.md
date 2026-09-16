## 1. 主選單與關卡選擇裝飾實作

- [x] 1.1 在 `docs/menu.js` 的 `menuContainer` 底層加入關卡珊瑚地板 (`createCoralWall(0, 400, 800, 50, true)`)
- [x] 1.2 在 `docs/menu.js` 的 `menuContainer` 加入非互動跑動章魚 (`CuteOctopusPlayer`)，設 `eventMode = 'none'` 並於 ticker 實現由左向右循環奔跑動畫
- [x] 1.3 在 `docs/menu.js` 的 `levelSelectContainer` 底層加入動態海洋氣泡背景 (`OceanBubbleSystem`)，並於 ticker 實現氣泡向上飄浮動畫

## 2. 章魚圓臉 Favicon 實作與引入

- [x] 2.1 創建 `docs/favicon.svg` 向量圖檔，繪製章魚粉紅圓臉、大眼睛與腮紅圖示
- [x] 2.2 在 `docs/index.html` 的 `<head>` 中引入 `<link rel="icon" type="image/svg+xml" href="favicon.svg">`

## 3. 測試與驗證

- [x] 3.1 驗證主選單底部顯示珊瑚地板，章魚自左向右順暢奔跑且不影響按鈕點擊
- [x] 3.2 驗證關卡選擇畫面背景氣泡正常飄浮
- [x] 3.3 驗證瀏覽器分頁頁籤成功顯示章魚圓臉 Favicon
