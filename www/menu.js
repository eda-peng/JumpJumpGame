// menu.js
let menuContainer, levelSelectContainer, settingsContainer, levelClearContainer;

function initMenu() {
    // 1. 主選單
    menuContainer = new PIXI.Container();
    app.stage.addChild(menuContainer);

    const title = new PIXI.Text({ text: "跑跑小人手遊", style: { fill: 0xffffff, fontSize: 48, fontWeight: 'bold' } });
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

    const lvTitle = new PIXI.Text({ text: "選擇關卡", style: { fill: 0xffffff, fontSize: 32 } });
    lvTitle.anchor.set(0.5);
    lvTitle.position.set(400, 40);
    levelSelectContainer.addChild(lvTitle);

    // 建立 5x5 網格的關卡按鈕
    for (let i = 1; i <= 25; i++) {
        const col = (i - 1) % 5;
        const row = Math.floor((i - 1) / 5);
        const x = 180 + col * 110;
        const y = 110 + row * 60;

        const btn = createLevelButton(i, x, y, () => {
            setupGame(i); // 呼叫 game.js 的函式並傳入數字
        });
        levelSelectContainer.addChild(btn);
    }
    
    levelSelectContainer.addChild(createMenuButton("返回主選單", 400, 415, () => showScreen("MENU"), 160));

    // 3. 設定畫面
    settingsContainer = new PIXI.Container();
    app.stage.addChild(settingsContainer);
    settingsContainer.visible = false;

    const setLabel = new PIXI.Text({ text: "遊戲設定", style: { fill: 0xffffff, fontSize: 32, fontWeight: 'bold' } });
    setLabel.anchor.set(0.5); setLabel.position.set(400, 150);
    
    // 建立自動下一關切換按鈕
    const autoNextBtn = createMenuButton(`自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`, 400, 230, () => {
        isAutoNextEnabled = !isAutoNextEnabled;
        autoNextBtn.children[1].text = `自動下一關: ${isAutoNextEnabled ? "開啟" : "關閉"}`;
    });

    settingsContainer.addChild(setLabel, autoNextBtn);
    settingsContainer.addChild(createMenuButton("返回", 400, 320, () => showScreen("MENU")));

    // 4. 過關畫面
    levelClearContainer = new PIXI.Container();
    app.stage.addChild(levelClearContainer);
    levelClearContainer.visible = false;

    // 1. 半透明背景遮罩
    const overlay = new PIXI.Graphics().rect(0, 0, 800, 450).fill(0x000000, 0.6);
    overlay.eventMode = 'static'; 
    levelClearContainer.addChild(overlay);

    // 2. 中央視窗背景
    const modalBase = new PIXI.Graphics()
        .roundRect(200, 80, 400, 300, 20)
        .fill(0x2c3e50)
        .stroke({ width: 4, color: 0xf1c40f });
    levelClearContainer.addChild(modalBase);

    const clearTitle = new PIXI.Text({ text: "恭喜過關！", style: { fill: 0xf1c40f, fontSize: 48, fontWeight: 'bold' } });
    clearTitle.anchor.set(0.5);
    clearTitle.position.set(400, 150);
    levelClearContainer.addChild(clearTitle);

    levelClearContainer.addChild(createMenuButton("下一關", 400, 250, () => {
        if (currentLevel < 25) {
            setupGame(currentLevel + 1);
        } else {
            alert("你已經破完所有關卡了！");
            showScreen("MENU");
        }
    }));
    levelClearContainer.addChild(createMenuButton("返回關卡選擇", 400, 320, () => showScreen("LEVEL_SELECT"), 220));

    showScreen("MENU");
}

function showScreen(screen) {
    menuContainer.visible = (screen === "MENU");
    levelSelectContainer.visible = (screen === "LEVEL_SELECT");
    settingsContainer.visible = (screen === "SETTINGS");
    levelClearContainer.visible = (screen === "LEVEL_CLEAR");

    if (window.gameContainer) {
        // 當過關時，背景依然顯示遊戲內容
        window.gameContainer.visible = (screen === "GAME" || screen === "LEVEL_CLEAR");
    }
}

function createMenuButton(label, x, y, callback, width = 200) {
    const btn = new PIXI.Container();
    const bg = new PIXI.Graphics().roundRect(-width/2, -25, width, 50, 10).fill(0x34495e);
    const txt = new PIXI.Text({ text: label, style: { fill: 0xffffff, fontSize: 20 } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', callback);
    
    // 滑鼠懸停效果
    btn.on('pointerover', () => bg.tint = 0x5dade2);
    btn.on('pointerout', () => bg.tint = 0xffffff);
    
    return btn;
}

function createLevelButton(num, x, y, callback) {
    const btn = new PIXI.Container();
    const bg = new PIXI.Graphics().roundRect(-45, -20, 90, 40, 5).fill(0x27ae60);
    const txt = new PIXI.Text({ text: num.toString(), style: { fill: 0xffffff, fontSize: 18, fontWeight: 'bold' } });
    txt.anchor.set(0.5);
    btn.addChild(bg, txt);
    btn.position.set(x, y);
    btn.eventMode = 'static';
    btn.cursor = 'pointer';
    btn.on('pointerdown', callback);

    btn.on('pointerover', () => bg.tint = 0x2ecc71);
    btn.on('pointerout', () => bg.tint = 0xffffff);

    return btn;
}
