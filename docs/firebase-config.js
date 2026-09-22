// firebase-config.js - Firebase 連線與排行榜 API 模組

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "jumpjumpgame-demo.firebaseapp.com",
    databaseURL: "https://jumpjumpgame-demo-default-rtdb.firebaseio.com",
    projectId: "jumpjumpgame-demo",
    storageBucket: "jumpjumpgame-demo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

let isFirebaseInitialized = false;
let currentUID = null;

// 計算 ISO 週編號 Key (例如 2026_W38)
function getWeekKey(dateObj = new Date()) {
    const d = new Date(dateObj.getTime());
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    const paddedWeek = String(weekNum).padStart(2, '0');
    return `${d.getFullYear()}_W${paddedWeek}`;
}

// 初始化 Firebase 及 匿名認證
function initFirebaseApp() {
    if (typeof firebase === 'undefined') {
        console.warn("[Firebase] SDK 未載入，進入離線模擬模式");
        initLocalUID();
        return;
    }

    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        isFirebaseInitialized = true;

        // 匿名登入
        firebase.auth().signInAnonymously().then((userCredential) => {
            currentUID = userCredential.user.uid;
            console.log("[Firebase] 匿名登入成功, UID:", currentUID);
            syncUserActiveStatus();
        }).catch((err) => {
            console.warn("[Firebase] 匿名登入失敗，採用離線 UID模式:", err);
            initLocalUID();
        });
    } catch (e) {
        console.warn("[Firebase] 初始化異常，使用離線備份模式:", e);
        initLocalUID();
    }
}

// 本地備份 UID
function initLocalUID() {
    let localUid = localStorage.getItem('JumpJumpGame_LocalUID');
    if (!localUid) {
        localUid = 'local_uid_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('JumpJumpGame_LocalUID', localUid);
    }
    currentUID = localUid;
}

function getUID() {
    if (!currentUID) initLocalUID();
    return currentUID;
}

// 寫入/更新 users/{UID} 資訊 (紀錄暱稱、最後上線時間)
function syncUserActiveStatus() {
    if (!isFirebaseInitialized || !currentUID || currentUID.startsWith('local_')) return;

    const nickname = window.progressManager ? window.progressManager.getNickname() : "匿名章魚";
    const userRef = firebase.database().ref('users/' + currentUID);

    userRef.once('value').then((snapshot) => {
        const now = Date.now();
        if (!snapshot.exists()) {
            userRef.set({
                nickname: nickname,
                createdAt: now,
                lastActiveAt: now
            });
        } else {
            userRef.update({
                nickname: nickname,
                lastActiveAt: now
            });
        }
    }).catch((e) => console.warn("[Firebase] 更新使用者資料失敗:", e));
}

// 更新玩家暱稱（作法 B：同時更新 users 與當週排行榜 name）
function updateUserProfile(newNickname) {
    if (!isFirebaseInitialized || !currentUID || currentUID.startsWith('local_')) return;

    const weekKey = getWeekKey();
    const updates = {};
    updates[`users/${currentUID}/nickname`] = newNickname;
    updates[`users/${currentUID}/lastActiveAt`] = Date.now();
    updates[`weekly_leaderboards/${weekKey}/${currentUID}/name`] = newNickname;

    firebase.database().ref().update(updates).catch((e) => {
        console.warn("[Firebase] 更新暱稱失敗:", e);
    });
}

// 提交每週挑戰成績
function submitWeeklyScore(timeMs, callback) {
    const nickname = window.progressManager ? window.progressManager.getNickname() : "匿名章魚";
    const weekKey = getWeekKey();

    if (!isFirebaseInitialized || !currentUID || currentUID.startsWith('local_')) {
        console.log("[Firebase/離線] 儲存每週最佳紀錄於本地:", timeMs);
        if (callback) callback({ success: true, isLocal: true });
        return;
    }

    const scoreRef = firebase.database().ref(`weekly_leaderboards/${weekKey}/${currentUID}`);

    scoreRef.once('value').then((snapshot) => {
        const existingData = snapshot.val();
        if (!existingData || timeMs < existingData.time) {
            scoreRef.set({
                name: nickname,
                time: timeMs,
                updatedAt: Date.now()
            }).then(() => {
                if (callback) callback({ success: true, isNewBest: true });
            });
        } else {
            if (callback) callback({ success: true, isNewBest: false });
        }
    }).catch((e) => {
        console.warn("[Firebase] 上傳成績失敗:", e);
        if (callback) callback({ success: false, error: e });
    });
}

// 取得當週前 50 名排行榜
function fetchWeeklyLeaderboard(callback) {
    const weekKey = getWeekKey();

    if (!isFirebaseInitialized || !currentUID || currentUID.startsWith('local_')) {
        // 離線模擬排行榜資料
        const localBest = window.progressManager ? window.progressManager.getWeeklyBestTime() : null;
        const mockList = [];
        if (localBest) {
            mockList.push({ name: window.progressManager.getNickname(), time: localBest, isSelf: true });
        }
        mockList.push({ name: "章魚大師", time: 145200, isSelf: false });
        mockList.push({ name: "跑跑高手", time: 168900, isSelf: false });
        mockList.sort((a, b) => a.time - b.time);
        if (callback) callback({ success: true, list: mockList, weekKey: weekKey, isMock: true });
        return;
    }

    const lbRef = firebase.database().ref(`weekly_leaderboards/${weekKey}`).orderByChild('time').limitToFirst(50);

    lbRef.once('value').then((snapshot) => {
        const list = [];
        const uid = getUID();
        snapshot.forEach((childSnap) => {
            const data = childSnap.val();
            list.push({
                uid: childSnap.key,
                name: data.name || "匿名章魚",
                time: data.time,
                isSelf: childSnap.key === uid
            });
        });

        if (callback) callback({ success: true, list: list, weekKey: weekKey });
    }).catch((e) => {
        console.warn("[Firebase] 讀取排行榜失敗:", e);
        if (callback) callback({ success: false, error: e, list: [] });
    });
}

// 頁面載入自動初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebaseApp);
} else {
    initFirebaseApp();
}
