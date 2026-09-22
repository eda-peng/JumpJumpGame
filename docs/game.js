// 1. 初始化 Pixi 應用程式
var app = new PIXI.Application(); // 改為 var 方便全域存取
let octopusTexture = null; // 全域宣告章魚紋理

// ---- 海洋主題繪圖元件與章魚主角視覺已抽離至 graphics.js ----


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

  // ---- 預載入主角章魚圖片資源 ----
  try {
    octopusTexture = await PIXI.Assets.load('octopus.png');
  } catch (e) {
    console.error('Failed to load octopus.png texture:', e);
  }

  // ---- 將遊戲畫面設為置中視窗樣式 ----
  const canvasStyle = app.canvas.style;
  canvasStyle.maxWidth = '100vw';
  canvasStyle.maxHeight = '100vh';
  canvasStyle.width = 'auto';
  canvasStyle.height = 'auto';
  canvasStyle.border = '4px solid #1b2631'; // 平滑沉穩的邊框顏色
  canvasStyle.boxSizing = 'border-box'; // 確保邊框不會撐大畫布
  canvasStyle.boxShadow = '0 20px 50px rgba(0,0,0,0.6)';

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

// 開發者快捷鍵：
// 1. 順序按下 C → R → E (1秒內)：將所有 25 關標記為已通關
// 2. 順序按下 F → I → N 或同時按下 F+I+N：立即通關當前關卡 / 計時模式
const devMode = {
  sequence: [],
  lastKeyTime: 0,
  timeout: 1000
};
const keysPressed = {};

function instantClearLevel() {
  if (typeof gameState === 'undefined' || (gameState !== "PLAYING" && gameState !== "GAME")) return;
  console.log("⚡ [DevMode] FIN shortcut triggered - instant level clear!");
  if (isWeeklyChallengeMode) {
    gameState = "WIN";
    weeklyChallengeElapsedTime = Date.now() - weeklyChallengeStartTime;
    const weekKey = typeof getWeekKey === 'function' ? getWeekKey() : 'current';
    if (window.progressManager) {
      window.progressManager.saveWeeklyBestTime(weeklyChallengeElapsedTime, weekKey);
    }
    if (typeof submitWeeklyScore === 'function') {
      submitWeeklyScore(weeklyChallengeElapsedTime);
    }
    currentLevel = 'WEEKLY';
    if (typeof showScreen === 'function') {
      showScreen('LEVEL_CLEAR');
    }
  } else if (isTimingMode) {
    gameState = "WIN";
    timingElapsedTime = Date.now() - timingStartTime;
    if (window.progressManager) {
      window.progressManager.completeSpecialMode('TIMING', timingElapsedTime);
    }
    currentLevel = 'TIMING';
    if (typeof showScreen === 'function') {
      showScreen('LEVEL_CLEAR');
    }
  } else {
    gameState = "WIN";
    if (typeof currentLevel === 'number' && window.progressManager) {
      window.progressManager.completeLevel(currentLevel);
    }
    if (currentLevel === 'CHALLENGE' && window.progressManager) {
      window.progressManager.completeSpecialMode('CHALLENGE');
    }
    if (typeof showScreen === 'function') {
      showScreen('LEVEL_CLEAR');
    }
  }
}

document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  keysPressed[key] = true;

  // 同時按下 F + I + N
  if (keysPressed['f'] && keysPressed['i'] && keysPressed['n']) {
    instantClearLevel();
    keysPressed['f'] = false;
    keysPressed['i'] = false;
    keysPressed['n'] = false;
    return;
  }

  // 順序按下鍵
  const now = Date.now();
  if (now - devMode.lastKeyTime > devMode.timeout) {
    devMode.sequence = [];
  }

  devMode.sequence.push(key);
  devMode.lastKeyTime = now;
  const seqStr = devMode.sequence.join('');

  if (seqStr.endsWith('cre')) {
    if (confirm('🔓 開發者模式：確定要把所有25關設為已通關？')) {
      const progress = window.progressManager.getProgress();
      progress.completedLevels = Array.from({ length: 25 }, (_, i) => i + 1);
      progress.unlockedLevels = Array.from({ length: 25 }, (_, i) => i + 1);
      localStorage.setItem(window.progressManager.storageKey, JSON.stringify(progress));
      alert('✅ 所有25關已標記為通關！重新整理頁面後生效。');
      location.reload();
    }
    devMode.sequence = [];
  } else if (seqStr.endsWith('fin')) {
    instantClearLevel();
    devMode.sequence = [];
  }
});

document.addEventListener('keyup', (event) => {
  keysPressed[event.key.toLowerCase()] = false;
});

// 2. 遊戲變數
let player;
let walls = [];
let speedZones = []; // 儲存加速與減速區塊
let goal;
let oceanBubbles = null; // 海洋氣泡背景系統
let gameState = "MENU";
let currentLevel = 0;
let isAutoNextEnabled = false; // 自動進入下一關的開關

// 計時模式相關變數 (歷史相容)
let isTimingMode = false;
let timingCurrentLevel = 1;
let timingStartTime = 0;
let timingElapsedTime = 0;

// 每周挑戰相關變數
let isWeeklyChallengeMode = false;
let weeklyChallengeLevels = [1, 6, 11, 16, 21];
let weeklyChallengeCurrentIndex = 0;
let weeklyChallengeStartTime = 0;
let weeklyChallengeElapsedTime = 0;

// 純偽隨機數產生器 (Mulberry32)
function seededPRNG(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 確定性每週關卡抽籤演算法
function getWeeklyChallengeLevels(dateObj = new Date()) {
  const weekKey = typeof getWeekKey === 'function' ? getWeekKey(dateObj) : "2026_W38";
  let weekNum = parseInt(weekKey.replace(/[^0-9]/g, ''), 10) || 202638;

  const prevDate = new Date(dateObj.getTime() - 7 * 86400000);
  const prevWeekKey = typeof getWeekKey === 'function' ? getWeekKey(prevDate) : "2026_W37";
  let prevWeekNum = parseInt(prevWeekKey.replace(/[^0-9]/g, ''), 10) || 202637;

  const brackets = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25]
  ];

  const prevRnd = seededPRNG(prevWeekNum);
  const currentRnd = seededPRNG(weekNum);

  const selectedLevels = [];
  for (let k = 0; k < 5; k++) {
    const prevOffset = Math.floor(prevRnd() * 5);
    const r = Math.floor(currentRnd() * 4);
    const currentOffset = (prevOffset + 1 + r) % 5;
    selectedLevels.push(brackets[k][currentOffset]);
  }
  return { weekKey, levels: selectedLevels };
}

// 發起每週挑戰
function startWeeklyChallenge() {
  if (!window.progressManager || window.progressManager.getInkCount() <= 0) {
    alert("墨汁不足！無法發起每週挑戰。");
    return false;
  }

  window.progressManager.useInk();

  const challengeData = getWeeklyChallengeLevels();
  weeklyChallengeLevels = challengeData.levels;
  weeklyChallengeCurrentIndex = 0;
  weeklyChallengeStartTime = Date.now();
  isWeeklyChallengeMode = true;
  isTimingMode = false;

  loadLevel(weeklyChallengeLevels[0]);
  return true;
}
let timerHudText = null;
let timingExitModalContainer = null;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
let playerVelocityX = 3;
let playerVelocityY = 0;
let isGrounded = false;

function setupGame(levelNumber) {
  if (levelNumber === 'TIMING') {
    isTimingMode = true;
    timingCurrentLevel = 1;
    timingStartTime = Date.now();
    timingElapsedTime = 0;
    loadLevel(1);
  } else {
    isTimingMode = false;
    loadLevel(levelNumber);
  }
}

function loadLevel(levelNum) {
  currentLevel = levelNum;
  gameState = "PLAYING";

  // 清除舊物體
  window.gameContainer.removeChildren();
  walls = [];
  speedZones = [];

  // 清除退出彈窗 (若存在)
  if (timingExitModalContainer && timingExitModalContainer.parent) {
    timingExitModalContainer.parent.removeChild(timingExitModalContainer);
    timingExitModalContainer = null;
  }

  // 讀取當前關卡配置，若無則使用預設配置
  const configKey = isTimingMode ? timingCurrentLevel : levelNum;
  const config = LEVEL_CONFIGS[configKey] || {
    playerStart: { x: 100, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: []
  };

  // ---- 1. 關卡內海洋背景與陽光折射 ----
  const oceanBg = new PIXI.Graphics();
  oceanBg.rect(0, 0, 800, 450).fill(0x0f3460);
  oceanBg.poly([0, 0, 160, 0, 320, 450, 0, 450]).fill({ color: 0x00d2d3, alpha: 0.08 });
  oceanBg.poly([360, 0, 520, 0, 720, 450, 420, 450]).fill({ color: 0x00d2d3, alpha: 0.08 });
  window.gameContainer.addChild(oceanBg);

  // ---- 2. 海洋漂浮氣泡系統 ----
  oceanBubbles = new OceanBubbleSystem();
  window.gameContainer.addChild(oceanBubbles);

  // ---- 3. 共通邊界 (滿版無縫貼合) ----
  const floor = createCoralWall(0, 400, 800, 50, true);
  const leftWall = createCoralWall(0, 0, 40, 450, true);
  const rightWall = createCoralWall(760, 0, 40, 450, true);
  window.gameContainer.addChild(floor, leftWall, rightWall);
  walls.push(floor, leftWall, rightWall);

  // ---- 4. 建立自定義物件 (由資料驅動) ----
  config.customObjects.forEach(obj => {
    let graphics;
    if (obj.type === 'speedup') {
      graphics = new SeaweedZone(obj.x, obj.y, obj.w, obj.h);
    } else if (obj.type === 'speeddown') {
      graphics = new AnemoneZone(obj.x, obj.y, obj.w, obj.h);
    } else {
      graphics = createCoralWall(obj.x, obj.y, obj.w, obj.h);
      graphics.objectType = obj.type || 'wall';
      graphics._isTouched = false;
    }
    window.gameContainer.addChild(graphics);

    if (obj.type === 'speedup' || obj.type === 'speeddown') {
      speedZones.push(graphics);
    } else {
      walls.push(graphics);
    }
  });

  // ---- 5. 建立終點 (可愛發光蝦子 🦐✨) ----
  goal = new ShrimpGoal(config.goal.x, config.goal.y, config.goal.w, config.goal.h);
  window.gameContainer.addChild(goal);

  // 速度
  playerVelocityX = 5;

  // ---- 6. 建立主角章魚 (可愛章魚元件) ----
  player = new CuteOctopusPlayer(32, 48);
  player.x = config.playerStart.x;
  player.y = config.playerStart.y;
  window.gameContainer.addChild(player);

  // ---- 點擊跳躍偵測 ----
  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.removeAllListeners('pointerdown');
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

  // 退出按鈕
  window.gameContainer.addChild(createSimpleButton("退出", 50, 30, () => {
    if (isTimingMode) {
      showTimingExitModal();
    } else {
      gameState = "MENU";
      showScreen('MENU');
    }
  }));

  // 重來按鈕
  window.gameContainer.addChild(createSimpleButton("重來", 50, 70, () => {
    if (isTimingMode) {
      loadLevel(timingCurrentLevel);
    } else {
      setupGame(currentLevel);
    }
  }));

  // 顯示當前關卡文字 (放置於左下角地板區域)
  let displayText = '';
  if (isTimingMode) {
    displayText = `計時模式 (第 ${timingCurrentLevel}/25 關)`;
  } else if (levelNum === 'CHALLENGE') {
    displayText = '挑戰關卡';
  } else {
    displayText = `第 ${levelNum} 關`;
  }
  const levelText = new PIXI.Text({
    text: displayText,
    style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' }
  });
  levelText.position.set(20, 415);
  window.gameContainer.addChild(levelText);

  // 右上角 HUD 計時器 (僅計時模式下建立)
  if (isTimingMode) {
    timerHudText = new PIXI.Text({
      text: "⏱️ " + (window.progressManager ? window.progressManager.formatTime(timingElapsedTime) : "00:00.00"),
      style: { fill: 0xf1c40f, fontSize: 18, fontWeight: 'bold' }
    });
    timerHudText.anchor.set(1.0, 0.5);
    timerHudText.position.set(780, 25);
    window.gameContainer.addChild(timerHudText);
  } else {
    timerHudText = null;
  }
}

function showTimingExitModal() {
  gameState = "PAUSED";
  const pausedAt = Date.now();

  if (timingExitModalContainer && timingExitModalContainer.parent) {
    timingExitModalContainer.parent.removeChild(timingExitModalContainer);
  }

  timingExitModalContainer = new PIXI.Container();

  // 背景半透明遮罩
  const mask = new PIXI.Graphics().rect(0, 0, 800, 450).fill(0x000000, 0.7);
  mask.eventMode = 'static';
  timingExitModalContainer.addChild(mask);

  // 對話框底板
  const dialog = new PIXI.Graphics()
    .roundRect(200, 110, 400, 230, 15)
    .fill(0x2c3e50)
    .stroke({ width: 3, color: 0xe74c3c });
  timingExitModalContainer.addChild(dialog);

  // 標題
  const title = new PIXI.Text({
    text: "⚠️ 退出確認",
    style: { fill: 0xe74c3c, fontSize: 24, fontWeight: 'bold' }
  });
  title.anchor.set(0.5);
  title.position.set(400, 150);
  timingExitModalContainer.addChild(title);

  // 說明文字
  const msg = new PIXI.Text({
    text: "計時模式進行中，確定要退出嗎？\n（當前的計時與進度將會遺失）",
    style: { fill: 0xffffff, fontSize: 16, align: 'center' }
  });
  msg.anchor.set(0.5);
  msg.position.set(400, 205);
  timingExitModalContainer.addChild(msg);

  // 按鈕 1: 繼續遊戲
  const resumeBtn = createCustomModalBtn("繼續遊戲", 310, 280, 0x27ae60, () => {
    if (timingExitModalContainer && timingExitModalContainer.parent) {
      timingExitModalContainer.parent.removeChild(timingExitModalContainer);
    }
    timingExitModalContainer = null;
    timingStartTime += (Date.now() - pausedAt);
    gameState = "PLAYING";
  });

  // 按鈕 2: 確認退出
  const exitBtn = createCustomModalBtn("確認退出", 490, 280, 0xc0392b, () => {
    if (timingExitModalContainer && timingExitModalContainer.parent) {
      timingExitModalContainer.parent.removeChild(timingExitModalContainer);
    }
    timingExitModalContainer = null;
    isTimingMode = false;
    gameState = "MENU";
    if (typeof showScreen === 'function') {
      showScreen('MENU');
    }
  });

  timingExitModalContainer.addChild(resumeBtn, exitBtn);
  app.stage.addChild(timingExitModalContainer);
}

function createCustomModalBtn(label, x, y, bgColor, callback) {
  const btn = new PIXI.Container();
  const bg = new PIXI.Graphics().roundRect(-60, -20, 120, 40, 8).fill(bgColor);
  const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 16, fontWeight: 'bold' } });
  txt.anchor.set(0.5);
  btn.addChild(bg, txt);
  btn.position.set(x, y);
  btn.eventMode = 'static';
  btn.cursor = 'pointer';
  btn.on('pointerdown', (e) => {
    e.stopPropagation();
    callback();
  });
  btn.on('pointerover', () => bg.tint = 0xbdc3c7);
  btn.on('pointerout', () => bg.tint = 0xffffff);
  return btn;
}

function update(ticker) {
  if (gameState !== "PLAYING") return;

  // 使用 ticker.deltaTime 確保在不同螢幕重新整理率下速度一致
  const dt = ticker.deltaTime;

  // 更新海洋氣泡背景與終點珍珠蚌殼動畫
  if (oceanBubbles) {
    oceanBubbles.update(dt);
  }
  if (goal && typeof goal.update === 'function') {
    goal.update(dt);
  }

  // 計時模式更新累計時間與 HUD
  if (isTimingMode) {
    timingElapsedTime = Date.now() - timingStartTime;
    if (timerHudText && window.progressManager) {
      timerHudText.text = "⏱️ " + window.progressManager.formatTime(timingElapsedTime);
    }
  }

  player.x += playerVelocityX * dt;

  // 處理章魚轉向 (依 playerVelocityX 水平翻轉內部 body)
  if (player && typeof player.setFacing === 'function') {
    player.setFacing(playerVelocityX);
  }

  // 碰牆偵測
  for (let wall of walls) {
    const playerBounds = player.getBounds();
    const wallBounds = wall.getBounds();

    if (wallBounds.width < 50) { // 這是牆壁
      if (checkCollision(playerBounds, wallBounds) &&
        playerBounds.y + playerBounds.height > wallBounds.y + 10) { // 只有非站在頂端時才反彈

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

  // 檢查是否跳出畫面左右兩側 (自動重來)
  if (player.x + player.width < 0 || player.x > 800) {
    if (isTimingMode) {
      loadLevel(timingCurrentLevel);
    } else {
      setupGame(currentLevel);
    }
    return;
  }

  // 地板偵測
  isGrounded = false;
  for (let wall of walls) {
    const playerBounds = player.getBounds();
    const wallBounds = wall.getBounds();

    if (checkCollision(playerBounds, wallBounds)) {
      if (playerVelocityY >= 0 && playerBounds.y + playerBounds.height - (playerVelocityY + 1) <= wallBounds.y + 10) {
        player.y = wallBounds.y - playerBounds.height;
        playerVelocityY = 0;
        isGrounded = true;
      }
    }
  }

  // 更新主角章魚 4 態運動姿態與轉向
  if (player && typeof player.updateState === 'function') {
    player.updateState(dt, playerVelocityY, isGrounded);
  }

  // 速度區塊偵測 (加速/減速)
  for (let zone of speedZones) {
    if (typeof zone.update === 'function') {
      zone.update(dt);
    }

    const playerBounds = player.getBounds();
    const zoneBounds = zone.getBounds();

    if (checkCollision(playerBounds, zoneBounds)) {
      if (!zone._isTouched) {
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
      zone._isTouched = false;
    }
  }

  // 終點
  if (checkCollision(player.getBounds(), goal.getBounds())) {
    if (isWeeklyChallengeMode) {
      if (weeklyChallengeCurrentIndex < 4) {
        // 無縫進入每周挑戰的下一關
        weeklyChallengeCurrentIndex++;
        loadLevel(weeklyChallengeLevels[weeklyChallengeCurrentIndex]);
      } else {
        // 完成每週 5 關挑戰！
        gameState = "WIN";
        weeklyChallengeElapsedTime = Date.now() - weeklyChallengeStartTime;
        const weekKey = typeof getWeekKey === 'function' ? getWeekKey() : 'current';
        if (window.progressManager) {
          window.progressManager.saveWeeklyBestTime(weeklyChallengeElapsedTime, weekKey);
        }
        if (typeof submitWeeklyScore === 'function') {
          submitWeeklyScore(weeklyChallengeElapsedTime);
        }
        currentLevel = 'WEEKLY';
        if (typeof showScreen === 'function') {
          showScreen('LEVEL_CLEAR');
        }
      }
    } else if (isTimingMode) {
      if (timingCurrentLevel < 25) {
        // Option A: 無縫進入下一關
        timingCurrentLevel++;
        loadLevel(timingCurrentLevel);
      } else {
        // 通關第 25 關！
        gameState = "WIN";
        timingElapsedTime = Date.now() - timingStartTime;
        if (window.progressManager) {
          window.progressManager.completeSpecialMode('TIMING', timingElapsedTime);
        }
        currentLevel = 'TIMING';
        if (typeof showScreen === 'function') {
          showScreen('LEVEL_CLEAR');
        }
      }
    } else {
      gameState = "WIN";

      // 只為數字型關卡標記進度
      if (typeof currentLevel === 'number' && window.progressManager) {
        window.progressManager.completeLevel(currentLevel);
      }

      // 如果是挑戰關
      if (currentLevel === 'CHALLENGE') {
        if (window.progressManager) {
          window.progressManager.completeSpecialMode('CHALLENGE');
        }
        if (typeof showScreen === 'function') {
          showScreen('LEVEL_CLEAR');
        }
      } else if (isAutoNextEnabled && currentLevel < 25) {
        const nextLevelUnlocked = window.progressManager && window.progressManager.isLevelUnlocked(currentLevel + 1);
        if (nextLevelUnlocked) {
          setTimeout(() => setupGame(currentLevel + 1), 500);
        } else {
          if (typeof showScreen === 'function') {
            showScreen('LEVEL_CLEAR');
          }
        }
      } else {
        if (typeof showScreen === 'function') {
          showScreen('LEVEL_CLEAR');
        }
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
