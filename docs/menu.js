// menu.js
let menuContainer, levelSelectContainer, settingsContainer, levelClearContainer;

function initMenu() {
    // 1. 主選單
    menuContainer = new PIXI.Container();
    app.stage.addChild(menuContainer);

    // 底部關卡珊瑚地板 (背景裝飾)
    if (typeof createCoralWall === 'function') {
        const menuFloor = createCoralWall(0, 400, 800, 50, true);
        menuContainer.addChild(menuFloor);
    }

    // 主選單背景裝飾：左側 2 個水草與右側 2 個海葵
    const menuDecorations = [];
    if (typeof SeaweedZone === 'function') {
        const seaweed1 = new SeaweedZone(100, 365, 40, 35);
        const seaweed2 = new SeaweedZone(150, 365, 40, 35);
        seaweed1.eventMode = 'none';
        seaweed2.eventMode = 'none';
        menuContainer.addChild(seaweed1, seaweed2);
        menuDecorations.push(seaweed1, seaweed2);
    }
    if (typeof AnemoneZone === 'function') {
        const anemone1 = new AnemoneZone(600, 370, 40, 30);
        const anemone2 = new AnemoneZone(650, 370, 40, 30);
        anemone1.eventMode = 'none';
        anemone2.eventMode = 'none';
        menuContainer.addChild(anemone1, anemone2);
        menuDecorations.push(anemone1, anemone2);
    }

    // 非互動快跑章魚 (純背景動態，自動跳躍過海葵)
    let menuRunnerOctopus = null;
    const groundY = 352;
    if (typeof CuteOctopusPlayer === 'function') {
        menuRunnerOctopus = new CuteOctopusPlayer(32, 48);
        menuRunnerOctopus.eventMode = 'none';
        menuRunnerOctopus.position.set(-40, groundY);
        menuRunnerOctopus.vy = 0;
        menuRunnerOctopus.isGrounded = true;
        menuContainer.addChild(menuRunnerOctopus);
    }

    const title = new PIXI.Text({ text: "跳跳章魚", style: { fill: 0xffffff, fontSize: 48, fontWeight: 'bold' } });
    title.anchor.set(0.5);
    title.position.set(400, 100);
    menuContainer.addChild(title);

    menuContainer.addChild(createMenuButton("開始遊戲", 400, 220, () => showScreen("LEVEL_SELECT")));
    menuContainer.addChild(createMenuButton("設定", 400, 290, () => showScreen("SETTINGS")));
    menuContainer.addChild(createMenuButton("離開", 400, 360, () => alert("請關閉瀏覽器分頁以離開遊戲")));

    // 2. 關卡選擇 (1-25)
    levelSelectContainer = new PIXI.Container();
    app.stage.addChild(levelSelectContainer);
    levelSelectContainer.visible = false;
    levelSelectContainer.levelButtonsGroup = null; // 用來儲存按鈕容器以便更新

    // 關卡選擇畫面動態海洋氣泡背景
    let levelSelectBubbles = null;
    if (typeof OceanBubbleSystem === 'function') {
        levelSelectBubbles = new OceanBubbleSystem();
        levelSelectContainer.addChild(levelSelectBubbles);
    }

    // 3. 設定畫面
    settingsContainer = new PIXI.Container();
    app.stage.addChild(settingsContainer);
    settingsContainer.visible = false;

    const setLabel = new PIXI.Text({ text: "遊戲設定", style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' } });
    setLabel.anchor.set(0.5); setLabel.position.set(400, 120);

    // 建立自動下一關切換按鈕
    const autoNextBtn = createMenuButton(`自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`, 400, 200, () => {
        isAutoNextEnabled = !isAutoNextEnabled;
        autoNextBtn.children[1].text = `自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`;
    });

    // 建立重置進度按鈕
    const resetBtn = createMenuButton("重置進度", 400, 270, () => {
        if (confirm("確定要重置所有進度嗎？")) {
            window.progressManager.resetProgress();
            alert("進度已重置");
            showScreen("MENU");
        }
    });

    settingsContainer.addChild(setLabel, autoNextBtn, resetBtn);
    settingsContainer.addChild(createMenuButton("返回", 400, 340, () => showScreen("MENU")));

    // 4. 過關畫面
    levelClearContainer = new PIXI.Container();
    app.stage.addChild(levelClearContainer);
    levelClearContainer.visible = false;

    // 4.1 半透明背景遮罩
    const overlay = new PIXI.Graphics().rect(0, 0, 800, 450).fill(0x000000, 0.6);
    overlay.eventMode = 'static';
    levelClearContainer.addChild(overlay);

    // 4.2 中央彈窗背景 (400x220, 居中)
    const modalBase = new PIXI.Graphics()
        .roundRect(200, 115, 400, 220, 20)
        .fill(0x2c3e50)
        .stroke({ width: 4, color: 0x16a085 });
    levelClearContainer.addChild(modalBase);

    // 4.3 主標題與副標題
    const clearTitle = new PIXI.Text({ text: "恭喜過關", style: { fill: 0xf1c40f, fontSize: 40, fontWeight: 'bold' } });
    clearTitle.anchor.set(0.5);
    clearTitle.position.set(400, 165);

    const clearSubText = new PIXI.Text({ text: "", style: { fill: 0xffffff, fontSize: 16, align: 'center' } });
    clearSubText.anchor.set(0.5);
    clearSubText.position.set(400, 205);

    levelClearContainer.addChild(clearTitle, clearSubText);

    // 4.4 操作按鈕
    const nextBtn = createMenuButton("下一關", 400, 225, () => {
        if (currentLevel < 25) {
            setupGame(currentLevel + 1);
        } else {
            alert("恭喜破關\n 歡迎嘗試挑戰關卡及計時模式！");
            showScreen("MENU");
        }
    }, 220);

    const returnBtn = createMenuButton("返回關卡選擇", 400, 280, () => showScreen("LEVEL_SELECT"), 220);

    levelClearContainer.addChild(nextBtn, returnBtn);

    // 將元件引用直接掛載於容器上，避免動態搜尋子節點
    levelClearContainer.clearTitle = clearTitle;
    levelClearContainer.clearSubText = clearSubText;
    levelClearContainer.nextBtn = nextBtn;
    levelClearContainer.returnBtn = returnBtn;

    // 5. 選單背景動畫 ticker
    app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        if (menuContainer && menuContainer.visible) {
            // 更新水草與海葵波浪動畫
            menuDecorations.forEach(dec => {
                if (dec && typeof dec.update === 'function') dec.update(dt);
            });

            // 章魚快跑與跳躍過海葵邏輯
            if (menuRunnerOctopus) {
                // 加速奔跑 (速率提升至 4.2 * dt)
                menuRunnerOctopus.x += 4.2 * dt;

                // 靠近海葵時自動起跳
                if (menuRunnerOctopus.x >= 550 && menuRunnerOctopus.x <= 570 && menuRunnerOctopus.isGrounded) {
                    menuRunnerOctopus.vy = -9.2;
                    menuRunnerOctopus.isGrounded = false;
                }

                // 物理重力與落地
                if (!menuRunnerOctopus.isGrounded) {
                    menuRunnerOctopus.vy += 0.45 * dt;
                    menuRunnerOctopus.y += menuRunnerOctopus.vy * dt;

                    if (menuRunnerOctopus.y >= groundY) {
                        menuRunnerOctopus.y = groundY;
                        menuRunnerOctopus.vy = 0;
                        menuRunnerOctopus.isGrounded = true;
                    }
                }

                // 離開右邊緣後循環重置
                if (menuRunnerOctopus.x > 840) {
                    menuRunnerOctopus.x = -40;
                    menuRunnerOctopus.y = groundY;
                    menuRunnerOctopus.vy = 0;
                    menuRunnerOctopus.isGrounded = true;
                }

                if (typeof menuRunnerOctopus.updateState === 'function') {
                    menuRunnerOctopus.updateState(dt, menuRunnerOctopus.vy, menuRunnerOctopus.isGrounded);
                }
            }
        }
        if (levelSelectContainer && levelSelectContainer.visible && levelSelectBubbles) {
            if (typeof levelSelectBubbles.update === 'function') {
                levelSelectBubbles.update(dt);
            }
        }
    });

    showScreen("MENU");
}

function showScreen(screen) {
    menuContainer.visible = (screen === "MENU");
    levelSelectContainer.visible = (screen === "LEVEL_SELECT");
    settingsContainer.visible = (screen === "SETTINGS");
    levelClearContainer.visible = (screen === "LEVEL_CLEAR");

    // 當顯示關卡選擇時，重新渲染按鈕以反映最新進度
    if (screen === "LEVEL_SELECT") {
        updateLevelButtons();
    }

    // 當顯示過關畫面時，動態更新彈窗內容與佈局
    if (screen === "LEVEL_CLEAR") {
        updateClearModalLayout();
    }

    if (window.gameContainer) {
        // 當過關時，背景依然顯示遊戲內容
        window.gameContainer.visible = (screen === "GAME" || screen === "LEVEL_CLEAR");
    }
}

// 根據不同遊戲模式更新過關彈窗 (Level Clear Modal) 的內容與排版
function updateClearModalLayout() {
    const { clearTitle, clearSubText, nextBtn, returnBtn } = levelClearContainer;
    if (!clearTitle || !clearSubText || !nextBtn || !returnBtn) return;

    if (currentLevel === 'TIMING') {
        // 【計時模式】標題在 y=160、成績在 y=205、單按鈕在 y=265
        clearTitle.position.set(400, 170);
        const timeMs = typeof timingElapsedTime !== 'undefined' ? timingElapsedTime : 0;
        const formattedTime = window.progressManager ? window.progressManager.formatTime(timeMs) : '';
        const bestMs = window.progressManager ? window.progressManager.getTimingBestTime() : null;
        const isNew = bestMs === timeMs;
        clearSubText.text = `本次成績: ${formattedTime}${isNew ? ' (新紀錄!)' : ''}`;
        clearSubText.position.set(400, 210);

        nextBtn.visible = false;
        returnBtn.visible = true;
        returnBtn.position.set(400, 270);
    } else if (currentLevel === 'CHALLENGE') {
        // 【挑戰模式】標題在 y=175、無副標題、單按鈕在 y=250
        clearTitle.position.set(400, 175);
        clearSubText.text = "";

        nextBtn.visible = false;
        returnBtn.visible = true;
        returnBtn.position.set(400, 250);
    } else {
        // 【一般關卡】標題在 y=165、無副標題、雙按鈕在 y=225 與 y=280
        clearTitle.position.set(400, 165);
        clearSubText.text = "";

        nextBtn.visible = true;
        nextBtn.position.set(400, 225);
        returnBtn.visible = true;
        returnBtn.position.set(400, 280);
    }
}

// 動態更新關卡按鈕 (即時反映進度)
function updateLevelButtons() {
    // 移除舊的按鈕組 (但保留標題)
    if (levelSelectContainer.levelButtonsGroup) {
        levelSelectContainer.removeChild(levelSelectContainer.levelButtonsGroup);
    }

    // 建立新的容器放所有按鈕
    const buttonsGroup = new PIXI.Container();
    levelSelectContainer.levelButtonsGroup = buttonsGroup;

    const lvTitle = new PIXI.Text({ text: "關卡選擇", style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' } });
    lvTitle.anchor.set(0.5);
    lvTitle.position.set(400, 40);
    buttonsGroup.addChild(lvTitle);

    // // 顯示已解鎖的最高關卡
    // const maxUnlockedText = new PIXI.Text({
    //     text: `已解鎖: 第 1-${window.progressManager.getMaxUnlockedLevel()} 關`,
    //     style: { fill: 0x95a5a6, fontSize: 12 }
    // });
    // maxUnlockedText.anchor.set(0.5);
    // maxUnlockedText.position.set(400, 50);
    // buttonsGroup.addChild(maxUnlockedText);

    // 建立 5x5 網格的關卡按鈕
    for (let i = 1; i <= 25; i++) {
        const col = (i - 1) % 5;
        const row = Math.floor((i - 1) / 5);
        const x = 180 + col * 110;
        const y = 100 + row * 60;

        // 檢查關卡是否已解鎖（這次會實時檢查最新進度）
        const isUnlocked = window.progressManager.isLevelUnlocked(i);
        const isCompleted = window.progressManager.isLevelCompleted(i);

        const btn = createLevelButton(i, x, y, () => {
            if (isUnlocked) {
                setupGame(i); // 呼叫 game.js 的函式並傳入數字
            } else {
                // 如果還沒解鎖，提示玩家
                alert(`請先完成第 ${i - 1} 關來解鎖此關卡`);
            }
        }, isUnlocked, isCompleted);
        buttonsGroup.addChild(btn);
    }

    // 只有在完成25關時才顯示特殊模式按鈕
    if (window.progressManager.isLevelCompleted(25)) {
        // 新增"挑戰"按鈕（在第21關下方）
        const challengeCount = window.progressManager.getChallengeClearCount();
        const challengeBtn = createSpecialModeButton(
            "挑戰",
            180, 395,
            () => setupGame('CHALLENGE'),
            true,
            challengeCount > 0,
            `通關次數: ${challengeCount} 次`
        );
        buttonsGroup.addChild(challengeBtn);

        // 新增"計時模式"按鈕（在第25關下方）
        const bestTimeMs = window.progressManager.getTimingBestTime();
        const isTimingCompleted = window.progressManager.isSpecialModeCompleted('TIMING');
        const timingSubText = bestTimeMs !== null
            ? `最佳紀錄: ${window.progressManager.formatTime(bestTimeMs)}`
            : `最佳紀錄: --:--.--`;

        const timingModeBtn = createSpecialModeButton(
            "計時模式",
            620, 395,
            () => setupGame('TIMING'),
            true,
            isTimingCompleted,
            timingSubText
        );
        buttonsGroup.addChild(timingModeBtn);
    }

    buttonsGroup.addChild(createMenuButton("返回主選單", 400, 415, () => showScreen("MENU"), 160));
    levelSelectContainer.addChild(buttonsGroup);
}

function createMenuButton(label, x, y, callback, width = 200) {
    const btn = new PIXI.Container();
    const drawBg = (strokeColor) => {
        bg.clear()
            .roundRect(-width / 2, -25, width, 50, 10)
            .fill(0x34495e)
            .stroke({ width: 3, color: strokeColor });
    };
    const bg = new PIXI.Graphics();
    drawBg(0x16a085);
    const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 20 } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', callback);

    // 滑鼠懸停效果：背景微亮 + 邊框變金色
    btn.on('pointerover', () => {
        bg.tint = 0x5dade2;
        drawBg(0xf9ca24);
    });
    btn.on('pointerout', () => {
        bg.tint = 0xffffff;
        drawBg(0x16a085);
    });

    return btn;
}

function createLevelButton(num, x, y, callback, isUnlocked = true, isCompleted = false) {
    const btn = new PIXI.Container();

    // 根據解鎖狀態決定顏色
    let bgColor = isUnlocked ? 0x27ae60 : 0x7f8c8d;  // 綠色=已解鎖，灰色=鎖定
    if (isCompleted) {
        bgColor = 0xf39c12;  // 橙色=已完成
    }

    const bg = new PIXI.Graphics().roundRect(-45, -20, 90, 40, 5).fill(bgColor);

    // 關卡按鈕本身的文字
    let displayText = num.toString();
    const txt = new PIXI.Text({ text: displayText, style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);

    if (isUnlocked) {
        // 已解鎖：可點擊
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => bg.tint = isCompleted ? 0xf9ca24 : 0x2ecc71);
        btn.on('pointerout', () => bg.tint = 0xffffff);
    } else {
        // 鎖定：不可點擊，顯示鎖頭圖標在左上角
        btn.eventMode = 'static';
        btn.cursor = 'not-allowed';

        // 在按鈕的左上角添加鎖頭符號
        const lockIcon = new PIXI.Text({
            text: "🔒",
            style: { fontSize: 16 }
        });
        lockIcon.anchor.set(0.5);
        lockIcon.position.set(-45, -20);  // 左上角位置
        btn.addChild(lockIcon);

        // 鎖定狀態沒有懸停效果
        btn.on('pointerdown', (e) => {
            e.stopPropagation();
            // 被點擊時提示已在 levelSelectContainer 中處理
        });
    }

    return btn;
}

function createSpecialModeButton(label, x, y, callback, isUnlocked = false, isCompleted = false, subText = '') {
    const btn = new PIXI.Container();

    // 根據解鎖狀態決定顏色
    let bgColor = isUnlocked ? 0x9b59b6 : 0x7f8c8d;  // 紫色=已解鎖，灰色=鎖定

    const bg = new PIXI.Graphics().roundRect(-50, -22, 100, 44, 8).fill(bgColor);

    const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 16, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);

    // 如果已完成特殊模式，在右上角顯示皇冠圖示
    if (isCompleted) {
        const crownIcon = new PIXI.Text({
            text: "👑",
            style: { fontSize: 16 }
        });
        crownIcon.anchor.set(0.5);
        crownIcon.position.set(-45, -22);
        btn.addChild(crownIcon);
    }

    // 按鈕下方次要標籤 (如通關次數或最佳時間)
    if (subText) {
        const subTxt = new PIXI.Text({
            text: subText,
            style: { fill: 0xf1c40f, fontSize: 12, fontWeight: 'bold' }
        });
        subTxt.anchor.set(0.5, 0);
        subTxt.position.set(0, 25);
        btn.addChild(subTxt);
    }

    if (isUnlocked) {
        // 已解鎖：可點擊
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => bg.tint = 0xc39bd3);
        btn.on('pointerout', () => bg.tint = 0xffffff);
    }

    return btn;
}
