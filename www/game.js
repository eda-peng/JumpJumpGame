// 1. 初始化 Pixi 應用程式
var app = new PIXI.Application(); // 改為 var 方便全域存取

async function init() {
  // 這裡增加了觸控支援的設定
  await app.init({
    width: 800,
    height: 450,
    backgroundColor: 0x2c3e50,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true // 讓邊緣平滑一點
  });
  document.body.appendChild(app.canvas);

  // ---- 將遊戲畫面設為置中視窗樣式 ----
  const canvasStyle = app.canvas.style;
  canvasStyle.width = '100vw';
  canvasStyle.height = '100vh';
  canvasStyle.objectFit = 'contain'; // 關鍵：維持比例縮放並置中，不被切掉
  canvasStyle.border = '5px solid #34495e';
  canvasStyle.boxSizing = 'border-box'; // 確保邊框不會撐大畫布
  canvasStyle.boxShadow = '0 20px 50px rgba(0,0,0,0.5)';

  document.body.style.backgroundColor = '#1a252f';
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  document.body.style.height = '100vh'; // 確保背景填滿

  // 初始化遊戲容器 (修正：必須先 new 一個 Container)
  window.gameContainer = new PIXI.Container();
  app.stage.addChild(window.gameContainer);
  window.gameContainer.visible = false;

  // 啟動迴圈
  app.ticker.add((ticker) => update(ticker));

  // 初始化選單 (由 menu.js 提供)
  if (typeof initMenu === 'function') {
    initMenu();
  }
}

// 2. 遊戲變數
let player;
let walls = [];
let speedZones = []; // 儲存加速與減速區塊
let goal;
let gameState = "MENU";
let currentLevel = 0;
let isAutoNextEnabled = false; // 自動進入下一關的開關

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
let playerVelocityX = 3;
let playerVelocityY = 0;
let isGrounded = false;

function setupGame(levelNumber) {
  currentLevel = levelNumber;
  gameState = "PLAYING";

  // 清除舊物體
  window.gameContainer.removeChildren();
  walls = [];
  speedZones = [];
  
  // 讀取當前關卡配置，若無則使用預設配置
  const config = LEVEL_CONFIGS[levelNumber] || {
    playerStart: { x: 100, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: []
  };

  // ---- 共通邊界 (地板與左右牆) ----
  const floor = new PIXI.Graphics().rect(0, 400, 800, 50).fill(0x7f8c8d);
  const leftWall = new PIXI.Graphics().rect(0, 0, 40, 450).fill(0x7f8c8d);
  const rightWall = new PIXI.Graphics().rect(760, 0, 40, 450).fill(0x7f8c8d);
  window.gameContainer.addChild(floor, leftWall, rightWall);
  walls.push(floor, leftWall, rightWall);

  // ---- 建立自定義物件 (由資料驅動) ----
  config.customObjects.forEach(obj => {
    const graphics = new PIXI.Graphics().rect(obj.x, obj.y, obj.w, obj.h).fill(obj.color);
    graphics.objectType = obj.type || 'wall'; // 標記類型
    graphics._isTouched = false; // 用於確保一次接觸只觸發一次效果
    window.gameContainer.addChild(graphics);
    
    if (obj.type === 'speedup' || obj.type === 'speeddown') {
      speedZones.push(graphics);
    } else {
      walls.push(graphics);
    }
  });

  // ---- 建立終點 ----
  goal = new PIXI.Graphics().rect(config.goal.x, config.goal.y, config.goal.w, config.goal.h).fill(0xf1c40f);
  window.gameContainer.addChild(goal);

  // 速度
  playerVelocityX = 5;

  // ---- 建立主角小人 ----
  player = new PIXI.Graphics().rect(0, 0, 32, 48).fill(0x3498db);

  player.x = config.playerStart.x;
  player.y = config.playerStart.y;
  window.gameContainer.addChild(player);

  // ---- 3. 點擊偵測 ----
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', () => {
    if (isGrounded && gameState === "PLAYING") {
      playerVelocityY = JUMP_FORCE;
      isGrounded = false;
    }
  });
  
  // 顯示遊戲畫面，隱藏選單
  if (typeof showScreen === 'function') {
    showScreen('GAME');
  }

  // 加入一個簡單的「退出」按鈕回到選單
  window.gameContainer.addChild(createSimpleButton("退出", 50, 30, () => {
    gameState = "MENU"; // 停止遊戲邏輯運算
    showScreen('MENU');
  }));
  // 加入「重來」按鈕在退出按鈕下方
  window.gameContainer.addChild(createSimpleButton("重來", 50, 70, () => setupGame(currentLevel)));

  // 顯示當前關卡文字 (放置於左下角地板區域)
  const levelText = new PIXI.Text({
    text: `第 ${levelNumber} 關`,
    style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' }
  });
  levelText.position.set(20, 415);
  window.gameContainer.addChild(levelText);
}

function update(ticker) {
  if (gameState !== "PLAYING") return;

  // 使用 ticker.deltaTime 確保在不同螢幕重新整理率下速度一致
  const dt = ticker.deltaTime;

  player.x += playerVelocityX * dt;

  // 碰牆偵測
  for (let wall of walls) {
    // 使用 getBounds() 取得最新的位置資訊
    const playerBounds = player.getBounds();
    const wallBounds = wall.getBounds();

    if (wallBounds.width < 50) { // 這是牆壁
      if (checkCollision(playerBounds, wallBounds) && 
          playerBounds.y + playerBounds.height > wallBounds.y + 10) { // 只有非站在頂端時才反彈
        
        // 修正：不僅反轉速度，還需將小人移出牆壁碰撞盒，防止因座標重疊導致的重複反彈（卡住）
        if (playerVelocityX > 0) {
          player.x = wallBounds.x - playerBounds.width;
        } else {
          player.x = wallBounds.x + wallBounds.width;
        }
        
        playerVelocityX *= -1;
        break;
      }
    }
  }

  // 重力
  playerVelocityY += GRAVITY * dt;
  player.y += playerVelocityY * dt;

  // 地板偵測
  isGrounded = false;
  for (let wall of walls) {
    const playerBounds = player.getBounds();
    const wallBounds = wall.getBounds();

    if (checkCollision(playerBounds, wallBounds)) {
      // 只要是向下掉落，且腳底接近平台頂端（容許誤差增加到 15），就判定著地
      if (playerVelocityY >= 0 && playerBounds.y + playerBounds.height - (playerVelocityY + 1) <= wallBounds.y + 10) {
        player.y = wallBounds.y - playerBounds.height;
        playerVelocityY = 0;
        isGrounded = true;
      }
    }
  }

  // 速度區塊偵測 (加速/減速)
  for (let zone of speedZones) {
    const playerBounds = player.getBounds();
    const zoneBounds = zone.getBounds();

    if (checkCollision(playerBounds, zoneBounds)) {
      if (!zone._isTouched) { // 只有在剛進入區塊時觸發
        let currentSpeed = Math.abs(playerVelocityX);
        if (zone.objectType === 'speedup') {
          currentSpeed = Math.min(10, currentSpeed + 0.5);
        } else if (zone.objectType === 'speeddown') {
          currentSpeed = Math.max(2, currentSpeed - 0.5);
        }
        playerVelocityX = (playerVelocityX >= 0 ? 1 : -1) * currentSpeed;
        zone._isTouched = true;
      }
    } else {
      zone._isTouched = false; // 離開區塊後重設，下次進入可再次觸發
    }
  }

  // 終點
  if (checkCollision(player.getBounds(), goal.getBounds())) {
    gameState = "WIN";
    if (isAutoNextEnabled && currentLevel < 25) {
      // 如果開啟自動下一關，等待 0.5 秒後自動載入下一關
      setTimeout(() => setupGame(currentLevel + 1), 500);
    } else {
      if (typeof showScreen === 'function') {
        showScreen('LEVEL_CLEAR');
      }
    }
  }
}

// 輔助函式：遊戲內的簡單按鈕
function createSimpleButton(label, x, y, callback) {
  const btn = new PIXI.Container();
  const bg = new PIXI.Graphics().roundRect(-40, -15, 80, 30, 5).fill(0x000000, 0.5);
  const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 14 } });
  txt.anchor.set(0.5);
  btn.addChild(bg, txt);
  btn.position.set(x, y);
  btn.eventMode = 'static';
  btn.cursor = 'pointer';
  btn.on('pointerdown', (e) => {
    e.stopPropagation(); // 防止觸發跳躍
    callback();
  });
  return btn;
}

// 修改後的碰撞偵測，直接傳入 Bounds 物件
function checkCollision(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function resetLevel() {
  player.x = 100;
  player.y = 200;
  playerVelocityX = Math.abs(playerVelocityX);
  gameState = "PLAYING";
}

init();
