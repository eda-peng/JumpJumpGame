## Purpose

定義主角角色採用章魚圖片 (octopus.png) 進行繪製、碰撞邊界維護與移動轉向呈現。

## ADDED Requirements

### Requirement: Player octopus avatar rendering
系統應採用 2:3 比例的 octopus.png 圖片作為遊戲主角，並且保持 32px 寬與 48px 高的物理邊界。

#### Scenario: Preloading and rendering octopus sprite
- **WHEN** 遊戲初始化並開始關卡
- **THEN** 主角應呈現為 octopus.png 圖片精靈 (PIXI.Sprite)，而非原先的藍色矩形

### Requirement: Directional sprite flipping
主角在左右移動時，圖片視覺應自動隨移動方向水平翻轉。

#### Scenario: Moving right
- **WHEN** 主角水平速度 `playerVelocityX > 0`
- **THEN** 章魚圖片應朝向右側 (scale.x = 1)

#### Scenario: Moving left
- **WHEN** 主角水平速度 `playerVelocityX < 0`
- **THEN** 章魚圖片應朝向左側 (scale.x = -1)，且維持相同的碰撞盒尺寸 (32x48)
