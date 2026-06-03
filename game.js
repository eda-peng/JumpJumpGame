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

  // 初始化遊戲容器
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

function setupGame(levelNumber) {
  currentLevel = levelNumber;
  gameState = "PLAYING";

  // 清除舊物體
  window.gameContainer.removeChildren();
  walls = [];

  // ---- 建立地板 ----
  const floor = new PIXI.Graphics()
    .rect(0, 400, 800, 50)
    .fill(0x7f8c8d);
  window.gameContainer.addChild(floor);
  walls.push(floor);

  // ---- 建立左牆壁 ----
  const leftWall = new PIXI.Graphics()
    .rect(0, 100, 40, 300)
    .fill(0xe74c3c);
  window.gameContainer.addChild(leftWall);
  walls.push(leftWall);

  // ---- 建立右牆壁 ----
  const rightWall = new PIXI.Graphics()
    .rect(760, 100, 40, 300)
    .fill(0xe74c3c);
  window.gameContainer.addChild(rightWall);
  walls.push(rightWall);

  // ---- 建立終點 ----
  goal = new PIXI.Graphics()
    .rect(700, 350, 40, 50)
    .fill(0xf1c40f);
  window.gameContainer.addChild(goal);

  // 難度調整：關卡越高速度越快
  playerVelocityX = 3 + (levelNumber * 0.2);

  // ---- 建立主角小人 ----
  player = new PIXI.Graphics()
    .rect(0, 0, 32, 48)
    .fill(0x3498db);

  player.x = 100;
  player.y = 200;
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
  window.gameContainer.addChild(createSimpleButton("退出", 50, 30, () => showScreen('MENU')));
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
      if (checkCollision(playerBounds, wallBounds)) {
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
    setTimeout(() => {
      alert(`恭喜通過第 ${currentLevel} 關！`);
      if (typeof showScreen === 'function') {
        showScreen('LEVEL_SELECT');
      }
    }, 10);
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
