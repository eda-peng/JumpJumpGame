## Purpose

定義主選單海底裝飾地板、背景奔跑章魚、關卡選擇畫面動態海洋氣泡與章魚圓臉 Favicon 的視覺呈現與互動規範。

## ADDED Requirements

### Requirement: Main menu bottom floor and background running octopus

系統應在主選單畫面底部鋪設關卡珊瑚地板，並加入一隻由左向右持續流暢奔跑且無法被點擊操控的背景章魚。

#### Scenario: Displaying floor and non-interactive runner octopus on main menu
- **WHEN** 玩家進入或切換至主選單畫面 (`menuContainer.visible === true`)
- **THEN** 畫面底部應顯示關卡珊瑚地板，且一隻不可被點擊觸發的背景章魚持續由左向右移動並在超出邊界時循環出現

### Requirement: Level select screen dynamic bubble background

系統應在關卡選擇畫面載入與更新動態海洋氣泡背景，呈現透明珍珠氣泡由下向上飄浮的視覺效果。

#### Scenario: Floating bubbles on level select screen
- **WHEN** 玩家切換至關卡選擇畫面 (`levelSelectContainer.visible === true`)
- **THEN** 關卡選擇畫面背景應持續向上飄浮動態海洋氣泡

### Requirement: Octopus favicon tab icon

系統應在 HTML 標頭中設定 SVG 格式的章魚圓臉 Favicon，讓瀏覽器視窗頁籤顯示章魚圓臉圖示。

#### Scenario: Displaying octopus icon on browser tab
- **WHEN** 瀏覽器載入遊戲頁面 (`index.html`)
- **THEN** 瀏覽器頁籤標頭應顯示章魚圓臉圖示 (Favicon)
