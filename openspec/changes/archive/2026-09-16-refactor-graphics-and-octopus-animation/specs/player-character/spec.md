## Purpose

定義遊戲主角章魚角色的視覺姿態呈現、狀態變換規則與物理邊界對齊標準，確保跳躍打擊感與幾何碰撞高度精準一致。

## ADDED Requirements

### Requirement: State-based octopus jump visual animation

系統應根據主角章魚的運動方向與重力狀態（地面站立、上升跳躍、頂點滯空、下降俯衝），呈現對應的 4 種動態姿態動畫。

#### Scenario: Standing on ground (IDLE)
- **WHEN** 主角章魚站在地面或平台上 (`isGrounded === true`)
- **THEN** 主角姿態應呈現圓形頭部、垂放觸手與微笑表情

#### Scenario: Rising in air (JUMP_RISING)
- **WHEN** 主角章魚在空中且向上跳躍 (`!isGrounded && velocityY < -2`)
- **THEN** 主角姿態應呈現縱向稍微延伸的頭部、觸手向下方緊收呈噴射姿態，以及驚喜嘴型 `:O`

#### Scenario: Apex in air (JUMP_APEX)
- **WHEN** 主角章魚在空中達到跳躍最高點滯空區 (`!isGrounded && Math.abs(velocityY) <= 2`)
- **THEN** 主角姿態應呈現正圓頭部、觸手如雨傘般向四周張開飄浮，以及歡呼表情

#### Scenario: Falling in air (JUMP_FALLING)
- **WHEN** 主角章魚在空中向下墜落 (`!isGrounded && velocityY > 2`)
- **THEN** 主角姿態應呈現微壓扁頭部、觸手受風壓向上飄起，以及專注表情

### Requirement: Fixed collision boundary alignment

主角章魚無論處於何種姿態動畫，物理碰撞邊界邊框必須固定鎖定為 32px 寬與 48px 高，且最下方觸手邊緣必須精準貼合於邊界底部。

#### Scenario: Maintaining precise jump height
- **WHEN** 章魚切換任意動態姿態動畫
- **THEN** 物理碰撞邊界與實際跳躍高度軌跡保持 100% 絕對不變
