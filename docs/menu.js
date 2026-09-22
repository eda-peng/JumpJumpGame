// menu.js - 選單與視窗管理模組
let menuContainer, levelSelectContainer, settingsContainer, weeklyChallengeContainer, leaderboardContainer, levelClearContainer;
let menuNicknameText = null;

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

    // 左上角顯示玩家暱稱 (Task 4.1)
    menuNicknameText = new PIXI.Text({
        text: "👤 玩家",
        style: { fill: 0x4cd137, fontSize: 18, fontWeight: 'bold' }
    });
    menuNicknameText.position.set(20, 20);
    menuNicknameText.eventMode = 'static';
    menuNicknameText.cursor = 'pointer';
    menuNicknameText.on('pointerdown', promptChangeNickname);
    menuContainer.addChild(menuNicknameText);

    // 主標題
    const title = new PIXI.Text({ text: "跳跳章魚", style: { fill: 0xffffff, fontSize: 48, fontWeight: 'bold' } });
    title.anchor.set(0.5);
    title.position.set(400, 90);
    menuContainer.addChild(title);

    // 主選單按鈕
    menuContainer.addChild(createMenuButton("開始遊戲", 400, 180, () => showScreen("LEVEL_SELECT")));

    // 每周挑戰按鈕 (Task 4.2)
    const isWeeklyUnlocked = window.progressManager && window.progressManager.isLevelCompleted(25);
    const weeklyBtn = createMenuButton("每周挑戰", 400, 240, () => {
        if (isWeeklyUnlocked) {
            showScreen("WEEKLY_CHALLENGE");
        }
    }, 200, isWeeklyUnlocked);
    menuContainer.addChild(weeklyBtn);

    menuContainer.addChild(createMenuButton("設定", 400, 300, () => showScreen("SETTINGS")));
    menuContainer.addChild(createMenuButton("離開", 400, 360, () => alert("請關閉瀏覽器分頁以離開遊戲")));

    // 2. 關卡選擇 (1-25)
    levelSelectContainer = new PIXI.Container();
    app.stage.addChild(levelSelectContainer);
    levelSelectContainer.visible = false;
    levelSelectContainer.levelButtonsGroup = null;

    let levelSelectBubbles = null;
    if (typeof OceanBubbleSystem === 'function') {
        levelSelectBubbles = new OceanBubbleSystem();
        levelSelectContainer.addChild(levelSelectBubbles);
    }

    // 3. 設定畫面
    settingsContainer = new PIXI.Container();
    app.stage.addChild(settingsContainer);
    settingsContainer.visible = false;

    // 統一左上角正方形返回按鈕 (Task 4.6)
    settingsContainer.addChild(createSquareBackButton(35, 35, () => showScreen("MENU")));

    const setLabel = new PIXI.Text({ text: "遊戲設定", style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' } });
    setLabel.anchor.set(0.5);
    setLabel.position.set(400, 100);

    const autoNextBtn = createMenuButton(`自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`, 400, 180, () => {
        isAutoNextEnabled = !isAutoNextEnabled;
        autoNextBtn.children[1].text = `自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`;
    });

    // Task 4.5: 設定選單新增變更暱稱按鈕
    const changeNickBtn = createMenuButton("變更暱稱", 400, 245, promptChangeNickname);

    const resetBtn = createMenuButton("重置進度", 400, 310, () => {
        if (confirm("確定要重置所有進度嗎？")) {
            window.progressManager.resetProgress();
            alert("進度已重置");
            showScreen("MENU");
        }
    });

    settingsContainer.addChild(setLabel, autoNextBtn, changeNickBtn, resetBtn);

    // 4. 每周挑戰視窗 (Task 4.3)
    weeklyChallengeContainer = new PIXI.Container();
    app.stage.addChild(weeklyChallengeContainer);
    weeklyChallengeContainer.visible = false;

    // 5. 排行榜視窗 (Task 4.4)
    leaderboardContainer = new PIXI.Container();
    app.stage.addChild(leaderboardContainer);
    leaderboardContainer.visible = false;

    // 6. 過關畫面
    levelClearContainer = new PIXI.Container();
    app.stage.addChild(levelClearContainer);
    levelClearContainer.visible = false;

    const overlay = new PIXI.Graphics().rect(0, 0, 800, 450).fill(0x000000, 0.6);
    overlay.eventMode = 'static';
    levelClearContainer.addChild(overlay);

    const modalBase = new PIXI.Graphics()
        .roundRect(200, 115, 400, 220, 20)
        .fill(0x2c3e50)
        .stroke({ width: 4, color: 0x16a085 });
    levelClearContainer.addChild(modalBase);

    const clearTitle = new PIXI.Text({ text: "恭喜過關", style: { fill: 0xf1c40f, fontSize: 40, fontWeight: 'bold' } });
    clearTitle.anchor.set(0.5);
    clearTitle.position.set(400, 165);

    const clearSubText = new PIXI.Text({ text: "", style: { fill: 0xffffff, fontSize: 16, align: 'center' } });
    clearSubText.anchor.set(0.5);
    clearSubText.position.set(400, 205);

    levelClearContainer.addChild(clearTitle, clearSubText);

    const nextBtn = createMenuButton("下一關", 400, 225, () => {
        if (currentLevel < 25) {
            setupGame(currentLevel + 1);
        } else {
            alert("恭喜破關！歡迎體驗每週挑戰模式。");
            showScreen("MENU");
        }
    }, 220);

    const returnBtn = createMenuButton("返回主選單", 400, 280, () => showScreen("MENU"), 220);

    levelClearContainer.addChild(nextBtn, returnBtn);

    levelClearContainer.clearTitle = clearTitle;
    levelClearContainer.clearSubText = clearSubText;
    levelClearContainer.nextBtn = nextBtn;
    levelClearContainer.returnBtn = returnBtn;

    // 7. 選單背景動畫 ticker
    app.ticker.add((ticker) => {
        const dt = ticker.deltaTime;
        if (menuContainer && menuContainer.visible) {
            menuDecorations.forEach(dec => {
                if (dec && typeof dec.update === 'function') dec.update(dt);
            });

            if (menuRunnerOctopus) {
                menuRunnerOctopus.x += 4.2 * dt;
                if (menuRunnerOctopus.x >= 550 && menuRunnerOctopus.x <= 570 && menuRunnerOctopus.isGrounded) {
                    menuRunnerOctopus.vy = -9.2;
                    menuRunnerOctopus.isGrounded = false;
                }
                if (!menuRunnerOctopus.isGrounded) {
                    menuRunnerOctopus.vy += 0.45 * dt;
                    menuRunnerOctopus.y += menuRunnerOctopus.vy * dt;
                    if (menuRunnerOctopus.y >= groundY) {
                        menuRunnerOctopus.y = groundY;
                        menuRunnerOctopus.vy = 0;
                        menuRunnerOctopus.isGrounded = true;
                    }
                }
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

    checkInitialNickname();
    showScreen("MENU");
}

// 檢查與提示設定暱稱
function checkInitialNickname() {
    if (!window.progressManager) return;
    let nick = window.progressManager.getNickname();
    if (!nick) {
        setTimeout(() => {
            nick = prompt("歡迎來到跳跳章魚！請輸入您的玩家暱稱:", "跳跳章魚");
            if (!nick || !nick.trim()) nick = "玩家" + Math.floor(Math.random() * 1000);
            window.progressManager.setNickname(nick);
            updateNicknameUI();
        }, 300);
    } else {
        updateNicknameUI();
    }
}

function promptChangeNickname() {
    if (!window.progressManager) return;
    const currentNick = window.progressManager.getNickname() || "";
    const newNick = prompt("請輸入新暱稱 (最長12字):", currentNick);
    if (newNick && newNick.trim()) {
        window.progressManager.setNickname(newNick.trim());
        updateNicknameUI();
        alert("暱稱修改成功！");
    }
}

function updateNicknameUI() {
    if (menuNicknameText && window.progressManager) {
        const nick = window.progressManager.getNickname() || "匿名章魚";
        menuNicknameText.text = `👤 ${nick}`;
    }
}

function showScreen(screen) {
    menuContainer.visible = (screen === "MENU");
    levelSelectContainer.visible = (screen === "LEVEL_SELECT");
    settingsContainer.visible = (screen === "SETTINGS");
    weeklyChallengeContainer.visible = (screen === "WEEKLY_CHALLENGE");
    leaderboardContainer.visible = (screen === "LEADERBOARD");
    levelClearContainer.visible = (screen === "LEVEL_CLEAR");

    if (screen === "MENU") {
        updateNicknameUI();
    }

    if (screen === "LEVEL_SELECT") {
        updateLevelButtons();
    }

    if (screen === "WEEKLY_CHALLENGE") {
        renderWeeklyChallengeView();
    }

    if (screen === "LEADERBOARD") {
        renderLeaderboardView();
    }

    if (screen === "LEVEL_CLEAR") {
        updateClearModalLayout();
    }

    if (window.gameContainer) {
        window.gameContainer.visible = (screen === "GAME" || screen === "LEVEL_CLEAR");
    }
}

// 渲染極簡風格每周挑戰視窗 (Task 4.3)
function renderWeeklyChallengeView() {
    weeklyChallengeContainer.removeChildren();

    // 1. 背景氣泡
    if (typeof OceanBubbleSystem === 'function') {
        weeklyChallengeContainer.addChild(new OceanBubbleSystem());
    }

    // 2. 左上角正方形返回按鈕 (Task 4.6)
    weeklyChallengeContainer.addChild(createSquareBackButton(35, 35, () => showScreen("MENU")));

    // 3. 右上角墨汁數量 + 下方看廣告按鈕
    const inkCount = window.progressManager ? window.progressManager.getInkCount() : 3;
    const inkText = new PIXI.Text({
        text: `💧 ${inkCount}/3`,
        style: { fill: 0x00d2d3, fontSize: 24, fontWeight: 'bold' }
    });
    inkText.anchor.set(1, 0);
    inkText.position.set(765, 20);
    weeklyChallengeContainer.addChild(inkText);

    const watchAdBtn = createSmallButton("📺 看廣告", 715, 65, () => {
        if (window.progressManager) {
            window.progressManager.watchRewardAdForInk(() => renderWeeklyChallengeView());
        }
    }, 90, 30);
    weeklyChallengeContainer.addChild(watchAdBtn);

    // 4. 中央 5 關卡正方形 + 連接線
    const challengeData = typeof getWeeklyChallengeLevels === 'function'
        ? getWeeklyChallengeLevels()
        : { weekKey: "2026_W38", levels: [3, 8, 11, 19, 22] };

    const startX = 140;
    const spacingX = 130;
    const centerY = 200;

    // 繪製連接直線
    const lineGraphic = new PIXI.Graphics();
    lineGraphic.rect(startX, centerY - 3, spacingX * 4, 6).fill(0x34495e);
    weeklyChallengeContainer.addChild(lineGraphic);

    challengeData.levels.forEach((lvl, idx) => {
        const posX = startX + idx * spacingX;
        const box = new PIXI.Container();

        const boxBg = new PIXI.Graphics()
            .roundRect(-40, -40, 80, 80, 12)
            .fill(0x2c3e50)
            .stroke({ width: 3, color: 0x16a085 });

        const boxText = new PIXI.Text({
            text: `第${lvl}關`,
            style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' }
        });
        boxText.anchor.set(0.5);

        box.addChild(boxBg, boxText);
        box.position.set(posX, centerY);
        weeklyChallengeContainer.addChild(box);
    });

    // 5. 底部最佳紀錄時間
    const weekKey = typeof getWeekKey === 'function' ? getWeekKey() : "2026_W38";
    const bestMs = window.progressManager ? window.progressManager.getWeeklyBestTime(weekKey) : null;
    const formattedBest = window.progressManager ? window.progressManager.formatTime(bestMs) : "--:--.--";

    const bestTimeText = new PIXI.Text({
        text: formattedBest,
        style: { fill: 0xf1c40f, fontSize: 28, fontWeight: 'bold' }
    });
    bestTimeText.anchor.set(0.5);
    bestTimeText.position.set(400, 310);
    weeklyChallengeContainer.addChild(bestTimeText);

    // 6. 底部按鈕：左邊 [ 📊 排行榜 ]，右邊 [ ⚔️ 開始挑戰 ]
    const leaderboardBtn = createMenuButton("📊 排行榜", 280, 385, () => showScreen("LEADERBOARD"), 160);
    const startBtn = createMenuButton("⚔️ 開始挑戰", 520, 385, () => {
        if (typeof startWeeklyChallenge === 'function') {
            if (startWeeklyChallenge()) {
                showScreen("GAME");
            }
        }
    }, 180);

    weeklyChallengeContainer.addChild(leaderboardBtn, startBtn);
}

// 渲染全球排行榜視窗 (Task 4.4)
function renderLeaderboardView() {
    leaderboardContainer.removeChildren();

    if (typeof OceanBubbleSystem === 'function') {
        leaderboardContainer.addChild(new OceanBubbleSystem());
    }

    // 左上角正方形返回按鈕 (返回每周挑戰視窗)
    leaderboardContainer.addChild(createSquareBackButton(35, 35, () => showScreen("WEEKLY_CHALLENGE")));

    const modalBase = new PIXI.Graphics()
        .roundRect(100, 50, 600, 360, 20)
        .fill(0x1e272e)
        .stroke({ width: 4, color: 0x00d2d3 });
    leaderboardContainer.addChild(modalBase);

    const titleText = new PIXI.Text({
        text: "全球排行榜",
        style: { fill: 0x00d2d3, fontSize: 28, fontWeight: 'bold' }
    });
    titleText.anchor.set(0.5);
    titleText.position.set(400, 85);
    leaderboardContainer.addChild(titleText);

    const loadingText = new PIXI.Text({
        text: "載入中...",
        style: { fill: 0xffffff, fontSize: 20 }
    });
    loadingText.anchor.set(0.5);
    loadingText.position.set(400, 230);
    leaderboardContainer.addChild(loadingText);

    if (typeof fetchWeeklyLeaderboard === 'function') {
        fetchWeeklyLeaderboard((res) => {
            if (!leaderboardContainer.visible) return;
            leaderboardContainer.removeChild(loadingText);

            if (res && res.success && res.list && res.list.length > 0) {
                const listContainer = new PIXI.Container();
                res.list.slice(0, 8).forEach((item, idx) => {
                    const rowY = 130 + idx * 32;
                    const rankStr = `#${idx + 1}`;
                    const timeStr = window.progressManager ? window.progressManager.formatTime(item.time) : String(item.time);

                    const rankTxt = new PIXI.Text({
                        text: rankStr,
                        style: { fill: idx === 0 ? 0xf1c40f : (idx === 1 ? 0xbdc3c7 : (idx === 2 ? 0xe67e22 : 0x7f8c8d)), fontSize: 18, fontWeight: 'bold' }
                    });
                    rankTxt.position.set(140, rowY);

                    const nameTxt = new PIXI.Text({
                        text: item.name.substring(0, 10),
                        style: { fill: item.isSelf ? 0x4cd137 : 0xffffff, fontSize: 18 }
                    });
                    nameTxt.position.set(220, rowY);

                    const timeTxt = new PIXI.Text({
                        text: timeStr,
                        style: { fill: 0x00d2d3, fontSize: 18, fontWeight: 'bold' }
                    });
                    timeTxt.anchor.set(1, 0);
                    timeTxt.position.set(660, rowY);

                    listContainer.addChild(rankTxt, nameTxt, timeTxt);
                });
                leaderboardContainer.addChild(listContainer);
            } else {
                const emptyText = new PIXI.Text({
                    text: "尚無本週成績，快成為第一位挑戰者！",
                    style: { fill: 0x95a5a6, fontSize: 18 }
                });
                emptyText.anchor.set(0.5);
                emptyText.position.set(400, 230);
                leaderboardContainer.addChild(emptyText);
            }
        });
    }
}

// 根據不同遊戲模式更新過關彈窗 (Level Clear Modal) 的內容與排版
function updateClearModalLayout() {
    const { clearTitle, clearSubText, nextBtn, returnBtn } = levelClearContainer;
    if (!clearTitle || !clearSubText || !nextBtn || !returnBtn) return;

    if (currentLevel === 'WEEKLY') {
        clearTitle.position.set(400, 165);
        const timeMs = typeof weeklyChallengeElapsedTime !== 'undefined' ? weeklyChallengeElapsedTime : 0;
        const formattedTime = window.progressManager ? window.progressManager.formatTime(timeMs) : '';
        clearSubText.text = `每周挑戰完成！\n總耗時: ${formattedTime}`;
        clearSubText.position.set(400, 210);

        nextBtn.visible = false;
        returnBtn.visible = true;
        returnBtn.position.set(400, 275);
        returnBtn.children[1].text = "返回每周挑戰";
        returnBtn.off('pointerdown');
        returnBtn.on('pointerdown', () => showScreen("WEEKLY_CHALLENGE"));
    } else if (currentLevel === 'TIMING') {
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
        clearTitle.position.set(400, 175);
        clearSubText.text = "";

        nextBtn.visible = false;
        returnBtn.visible = true;
        returnBtn.position.set(400, 250);
    } else {
        clearTitle.position.set(400, 165);
        clearSubText.text = "";

        nextBtn.visible = true;
        nextBtn.position.set(400, 225);
        returnBtn.visible = true;
        returnBtn.position.set(400, 280);
        returnBtn.children[1].text = "返回關卡選擇";
        returnBtn.off('pointerdown');
        returnBtn.on('pointerdown', () => showScreen("LEVEL_SELECT"));
    }
}

// 動態更新關卡按鈕 (即時反映進度)
function updateLevelButtons() {
    if (levelSelectContainer.levelButtonsGroup) {
        levelSelectContainer.removeChild(levelSelectContainer.levelButtonsGroup);
    }

    const buttonsGroup = new PIXI.Container();
    levelSelectContainer.levelButtonsGroup = buttonsGroup;

    // 統一左上角正方形返回按鈕 (Task 4.6)
    buttonsGroup.addChild(createSquareBackButton(35, 35, () => showScreen("MENU")));

    const lvTitle = new PIXI.Text({ text: "關卡選擇", style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' } });
    lvTitle.anchor.set(0.5);
    lvTitle.position.set(400, 40);
    buttonsGroup.addChild(lvTitle);

    for (let i = 1; i <= 25; i++) {
        const col = (i - 1) % 5;
        const row = Math.floor((i - 1) / 5);
        const x = 180 + col * 110;
        const y = 100 + row * 60;

        const isUnlocked = window.progressManager.isLevelUnlocked(i);
        const isCompleted = window.progressManager.isLevelCompleted(i);

        const btn = createLevelButton(i, x, y, () => {
            if (isUnlocked) {
                setupGame(i);
            } else {
                alert(`請先完成第 ${i - 1} 關來解鎖此關卡`);
            }
        }, isUnlocked, isCompleted);
        buttonsGroup.addChild(btn);
    }

    // 當完成 25 關時，在關卡選擇畫面正下方顯示「挑戰」關卡按鈕
    if (window.progressManager && window.progressManager.isLevelCompleted(25)) {
        const isCompleted = window.progressManager.getChallengeClearCount() > 0;
        const challengeBtn = createSpecialModeButton(
            "挑戰",
            400, 395,
            () => setupGame('CHALLENGE'),
            true,
            isCompleted,
            isCompleted ? "已通關" : ""
        );
        buttonsGroup.addChild(challengeBtn);
    }

    levelSelectContainer.addChild(buttonsGroup);
}

// 建立統一樣式的左上角正方形 `[ ⬅ ]` 返回按鈕 (Task 4.6)
function createSquareBackButton(x = 35, y = 35, callback) {
    const btn = new PIXI.Container();
    const bg = new PIXI.Graphics()
        .roundRect(-22, -22, 44, 44, 10)
        .fill(0x34495e)
        .stroke({ width: 3, color: 0x16a085 });

    const txt = new PIXI.Text({ text: "⬅", style: { fill: 0xffffff, fontSize: 22 } });
    txt.anchor.set(0.5);

    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        callback();
    });

    btn.on('pointerover', () => {
        bg.tint = 0x5dade2;
    });
    btn.on('pointerout', () => {
        bg.tint = 0xffffff;
    });

    return btn;
}

function createSmallButton(label, x, y, callback, width = 90, height = 30) {
    const btn = new PIXI.Container();
    const bg = new PIXI.Graphics()
        .roundRect(-width / 2, -height / 2, width, height, 8)
        .fill(0x2980b9)
        .stroke({ width: 2, color: 0x3498db });
    const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 13, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', callback);
    return btn;
}

function createMenuButton(label, x, y, callback, width = 200, enabled = true) {
    const btn = new PIXI.Container();
    const drawBg = (strokeColor) => {
        bg.clear()
            .roundRect(-width / 2, -25, width, 50, 10)
            .fill(enabled ? 0x34495e : 0x7f8c8d)
            .stroke({ width: 3, color: enabled ? strokeColor : 0x95a5a6 });
    };
    const bg = new PIXI.Graphics();
    drawBg(enabled ? 0x16a085 : 0x95a5a6);
    const txt = new PIXI.Text({ text: label, style: { fill: enabled ? 0xffffff : 0xbdc3c7, fontSize: 20 } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);

    if (enabled) {
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => {
            bg.tint = 0x5dade2;
            drawBg(0xf9ca24);
        });
        btn.on('pointerout', () => {
            bg.tint = 0xffffff;
            drawBg(0x16a085);
        });
    } else {
        btn.eventMode = 'static';
        btn.cursor = 'not-allowed';
    }

    return btn;
}

function createLevelButton(num, x, y, callback, isUnlocked = true, isCompleted = false) {
    const btn = new PIXI.Container();

    let bgColor = isUnlocked ? 0x27ae60 : 0x7f8c8d;
    if (isCompleted) {
        bgColor = 0xf39c12;
    }

    const bg = new PIXI.Graphics().roundRect(-45, -20, 90, 40, 5).fill(bgColor);

    let displayText = num.toString();
    const txt = new PIXI.Text({ text: displayText, style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);

    if (isUnlocked) {
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => bg.tint = isCompleted ? 0xf9ca24 : 0x2ecc71);
        btn.on('pointerout', () => bg.tint = 0xffffff);
    } else {
        btn.eventMode = 'static';
        btn.cursor = 'not-allowed';

        const lockIcon = new PIXI.Text({
            text: "🔒",
            style: { fontSize: 16 }
        });
        lockIcon.anchor.set(0.5);
        lockIcon.position.set(-45, -20);
        btn.addChild(lockIcon);
    }

    return btn;
}

function createSpecialModeButton(label, x, y, callback, isUnlocked = false, isCompleted = false, subText = '') {
    const btn = new PIXI.Container();
    let bgColor = isUnlocked ? 0x9b59b6 : 0x7f8c8d;
    const bg = new PIXI.Graphics().roundRect(-50, -22, 100, 44, 8).fill(bgColor);

    const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 16, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);

    if (isCompleted) {
        const crownIcon = new PIXI.Text({
            text: "👑",
            style: { fontSize: 16 }
        });
        crownIcon.anchor.set(0.5);
        crownIcon.position.set(-45, -22);
        btn.addChild(crownIcon);
    }

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
        btn.eventMode = 'static';
        btn.cursor = 'pointer';
        btn.on('pointerdown', callback);
        btn.on('pointerover', () => bg.tint = 0xc39bd3);
        btn.on('pointerout', () => bg.tint = 0xffffff);
    }

    return btn;
}
