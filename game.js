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
  canvasStyle.position = 'absolute';
  canvasStyle.top = '50%';
  canvasStyle.left = '50%';
  canvasStyle.transform = 'translate(-50%, -50%)';
  canvasStyle.border = '5px solid #34495e';
  canvasStyle.borderRadius = '15px';
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
let goal;
let gameState = "MENU";
let currentLevel = 0;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
let playerVelocityX = 3;
let playerVelocityY = 0;
let isGrounded = false;

// ---- 關卡資料定義 ----
const LEVEL_CONFIGS = {
  1: { // 教學關 牆壁
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 350, w: 40, h: 50 },
    customObjects: [
      { x: 250, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 510, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
    ]
  },
  2: { // 教學關 平台
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 50, w: 40, h: 50 },
    customObjects: [
      { x: 300, y: 300, w: 150, h: 30, color: 0x7f8c8d },
      { x: 450, y: 200, w: 150, h: 30, color: 0x7f8c8d },
      { x: 600, y: 100, w: 150, h: 30, color: 0x7f8c8d }
    ]
  },
  3: { // 撞牆後回跳
    playerStart: { x: 100, y: 350 },
    goal: { x: 80, y: 170, w: 40, h: 50 },
    customObjects: [
      { x: 380, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 40, y: 220, w: 250, h: 30, color: 0x7f8c8d }  // 地板
    ]
  },
  4: { // 抓時機跳
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 350, w: 40, h: 50 },
    customObjects: [
      { x: 120, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 250, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 380, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 510, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 630, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
    ]
  },
  5: { // 剛好踩蹬腳處往上爬
    playerStart: { x: 100, y: 350 },
    goal: { x: 720, y: 20, w: 40, h: 50 },
    customObjects: [
      { x: 720, y: 360, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處右
      { x: 40, y: 200, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處左
      { x: 40, y: 240, w: 720, h: 30, color: 0x7f8c8d },  // 地板
      { x: 40, y: 80, w: 720, h: 30, color: 0x7f8c8d }  // 地板
    ]
  },
  6: { // 不能跳
    playerStart: { x: 100, y: 0 },
    goal: { x: 720, y: 350, w: 40, h: 50 },
    customObjects: [
      { x: 90, y: 40, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 40, y: 80, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 90, y: 120, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 40, y: 160, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 90, y: 200, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 40, y: 240, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 90, y: 280, w: 670, h: 30, color: 0x7f8c8d },  // 地板
      { x: 40, y: 320, w: 670, h: 30, color: 0x7f8c8d }  // 地板
    ]
  },
  7: { // 跳躍撞牆連跳往上爬
    playerStart: { x: 40, y: 350 },
    goal: { x: 180, y: 0, w: 40, h: 40 },
    customObjects: [
      { x: 150, y: 280, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
      { x: 350, y: 280, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
      { x: 550, y: 280, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
      { x: 50, y: 160, w: 100, h: 40, color: 0x95a5a6 }, // 中間層
      { x: 250, y: 160, w: 100, h: 40, color: 0x95a5a6 }, // 中間層
      { x: 450, y: 160, w: 100, h: 40, color: 0x95a5a6 }, // 中間層
      { x: 650, y: 160, w: 100, h: 40, color: 0x95a5a6 }, // 中間層
      { x: 150, y: 40, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
      { x: 350, y: 40, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
      { x: 550, y: 40, w: 100, h: 40, color: 0x95a5a6 }, // 最下層
    ]
  },
  8: { // 不能掉到洞裡
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 350, w: 40, h: 50 },
    customObjects: [
      { x: 140, y: 320, w: 40, h: 80, color: 0x95a5a6 }, // 矮牆
      { x: 290, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 440, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 590, y: 320, w: 40, h: 80, color: 0x95a5a6 } // 矮牆
    ]
  },
  9: { // 連3跳
    playerStart: { x: 100, y: 350 },
    goal: { x: 720, y: 20, w: 40, h: 50 },
    customObjects: [
      { x: 620, y: 360, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處右
      { x: 250, y: 240, w: 300, h: 30, color: 0x7f8c8d },  // 下地板
      { x: 140, y: 200, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處左
      { x: 250, y: 80, w: 300, h: 30, color: 0x7f8c8d },  // 上地板
    ]
  },
  10: { // 神奇的時機
    playerStart: { x: 100, y: 350 },
    goal: { x: 700, y: 350, w: 40, h: 50 },
    customObjects: [
      { x: 60, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 200, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 340, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 480, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 620, y: 200, w: 40, h: 200, color: 0x95a5a6 }, // 高牆
      { x: 160, y: 300, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處1
      { x: 240, y: 300, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處2(假)
      { x: 440, y: 300, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處3
      { x: 520, y: 300, w: 40, h: 40, color: 0x95a5a6 }, // 蹬腳處4(假)
    ]
  },
};

function setupGame(levelNumber) {
  currentLevel = levelNumber;
  gameState = "PLAYING";

  // 清除舊物體
  window.gameContainer.removeChildren();
  walls = [];
  
  // 讀取當前關卡配置，若無則使用預設配置
  const config = LEVEL_CONFIGS[levelNumber] || {
    playerStart: { x: 100, y: 350 },
    goal: { x: 700, y: 350, w: 40, h: 50 },
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
    window.gameContainer.addChild(graphics);
    walls.push(graphics);
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

    if (wallBounds.width < 100) { // 這是牆壁
      if (checkCollision(playerBounds, wallBounds) && 
          playerBounds.y + playerBounds.height > wallBounds.y + 10) { // 只有非站在頂端時才反彈
        playerVelocityX *= -1;
        player.x += playerVelocityX * dt;
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
      if (playerVelocityY > 0 && playerBounds.y + playerBounds.height - playerVelocityY <= wallBounds.y + 10) {
        player.y = wallBounds.y - playerBounds.height;
        playerVelocityY = 0;
        isGrounded = true;
      }
    }
  }

  // 終點
  if (checkCollision(player.getBounds(), goal.getBounds())) {
    gameState = "WIN";
    if (typeof showScreen === 'function') {
      showScreen('LEVEL_CLEAR');
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
