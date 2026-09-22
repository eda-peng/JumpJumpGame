// progress.js - 關卡進度管理系統

class ProgressManager {
  constructor() {
    this.storageKey = 'JumpJumpGame_Progress';
    this.initProgress();
  }

  // 初始化進度 (第一次遊玩時執行)
  initProgress() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialProgress = {
        unlockedLevels: [1], // 只有第一關預設解鎖
        completedLevels: [],
        specialModes: {
          CHALLENGE: false,
          TIMING: false
        },
        challengeClearCount: 0,
        timingBestTime: null
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialProgress));
    }
  }

  // 取得當前進度物件
  getProgress() {
    const data = localStorage.getItem(this.storageKey);
    const defaultProgress = { 
      unlockedLevels: [1], 
      completedLevels: [],
      specialModes: { CHALLENGE: false, TIMING: false },
      challengeClearCount: 0,
      timingBestTime: null
    };
    if (!data) return defaultProgress;
    
    const progress = JSON.parse(data);
    // 確保 specialModes 存在（向後相容舊存檔）
    if (!progress.specialModes) {
      progress.specialModes = { CHALLENGE: false, TIMING: false };
    }
    // 向後相容舊存檔之 challengeClearCount 與 timingBestTime
    if (progress.challengeClearCount === undefined) {
      progress.challengeClearCount = progress.specialModes.CHALLENGE ? 1 : 0;
    }
    if (progress.timingBestTime === undefined) {
      progress.timingBestTime = null;
    }
    return progress;
  }

  // 檢查某個關卡是否已解鎖
  isLevelUnlocked(levelNumber) {
    const progress = this.getProgress();
    return progress.unlockedLevels.includes(levelNumber);
  }

  // 檢查某個關卡是否已完成
  isLevelCompleted(levelNumber) {
    const progress = this.getProgress();
    return progress.completedLevels.includes(levelNumber);
  }

  // 完成某個關卡 (同時解鎖下一關)
  completeLevel(levelNumber) {
    const progress = this.getProgress();

    // 將該關卡標記為已完成
    if (!progress.completedLevels.includes(levelNumber)) {
      progress.completedLevels.push(levelNumber);
    }

    // 解鎖下一關 (如果不是最後一關)
    const nextLevel = levelNumber + 1;
    if (nextLevel <= 25 && !progress.unlockedLevels.includes(nextLevel)) {
      progress.unlockedLevels.push(nextLevel);
    }

    // 存入 localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  // 取得已解鎖的最高關卡
  getMaxUnlockedLevel() {
    const progress = this.getProgress();
    return Math.max(...progress.unlockedLevels);
  }

  // 取得已完成的最高關卡
  getMaxCompletedLevel() {
    const progress = this.getProgress();
    return progress.completedLevels.length > 0 ? Math.max(...progress.completedLevels) : 0;
  }

  // 重置進度 (用於開發或玩家主動重置)
  resetProgress() {
    localStorage.removeItem(this.storageKey);
    this.initProgress();
  }

  // 取得進度百分比
  getProgressPercentage() {
    const progress = this.getProgress();
    return Math.round((progress.completedLevels.length / 25) * 100);
  }

  // 取得挑戰模式通關次數
  getChallengeClearCount() {
    const progress = this.getProgress();
    return progress.challengeClearCount || 0;
  }

  // 增加挑戰模式通關次數
  incrementChallengeClearCount() {
    const progress = this.getProgress();
    progress.specialModes = progress.specialModes || { CHALLENGE: false, TIMING: false };
    progress.specialModes.CHALLENGE = true;
    progress.challengeClearCount = (progress.challengeClearCount || 0) + 1;
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
    return progress.challengeClearCount;
  }

  // 取得計時模式最佳成績 (毫秒, ms)
  getTimingBestTime() {
    const progress = this.getProgress();
    return progress.timingBestTime;
  }

  // 保存計時模式成績 (傳入毫秒，回傳是否打破紀錄)
  saveTimingTime(timeMs) {
    const progress = this.getProgress();
    progress.specialModes = progress.specialModes || { CHALLENGE: false, TIMING: false };
    progress.specialModes.TIMING = true;

    let isNewRecord = false;
    if (progress.timingBestTime === null || progress.timingBestTime === undefined || timeMs < progress.timingBestTime) {
      progress.timingBestTime = timeMs;
      isNewRecord = true;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
    return isNewRecord;
  }

  // 標記特殊模式為已完成
  completeSpecialMode(modeName, extraData) {
    if (modeName === 'CHALLENGE') {
      this.incrementChallengeClearCount();
    } else if (modeName === 'TIMING' && typeof extraData === 'number') {
      return this.saveTimingTime(extraData);
    } else {
      const progress = this.getProgress();
      if (!progress.specialModes) {
        progress.specialModes = { CHALLENGE: false, TIMING: false };
      }
      progress.specialModes[modeName] = true;
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }
  }

  // 檢查特殊模式是否已完成
  isSpecialModeCompleted(modeName) {
    const progress = this.getProgress();
    return progress.specialModes && progress.specialModes[modeName] === true;
  }

  // 格式化毫秒時間為 MM:SS.ss (例如 01:23.45)
  formatTime(timeMs) {
    if (timeMs === null || timeMs === undefined) return "--:--.--";
    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const ms = Math.floor((timeMs % 1000) / 10);
    const mmStr = String(minutes).padStart(2, '0');
    const ssStr = String(seconds).padStart(2, '0');
    const msStr = String(ms).padStart(2, '0');
    return `${mmStr}:${ssStr}.${msStr}`;
  }

  // --- 新增：玩家暱稱管理 ---
  getNickname() {
    const progress = this.getProgress();
    return progress.nickname || null;
  }

  setNickname(name) {
    const cleanName = (name || "").trim().substring(0, 12);
    if (!cleanName) return false;
    const progress = this.getProgress();
    progress.nickname = cleanName;
    localStorage.setItem(this.storageKey, JSON.stringify(progress));

    // 同步更新 Firebase (作法 B)
    if (typeof updateUserProfile === 'function') {
      updateUserProfile(cleanName);
    }
    return true;
  }

  // --- 新增：墨汁 (體力) 系統管理 ---
  getTaiwanDateInfo() {
    const now = new Date();
    const utc8Ms = now.getTime() + (now.getTimezoneOffset() * 60000) + (8 * 3600000);
    const twDate = new Date(utc8Ms);
    const year = twDate.getFullYear();
    const month = String(twDate.getMonth() + 1).padStart(2, '0');
    const date = String(twDate.getDate()).padStart(2, '0');
    const hours = twDate.getHours();
    return {
      dateStr: `${year}-${month}-${date}`,
      isPastNoon: hours >= 12
    };
  }

  checkAndRestoreInk() {
    const progress = this.getProgress();
    if (progress.inkCount === undefined) progress.inkCount = 3;
    if (progress.lastInkRestoreDate === undefined) progress.lastInkRestoreDate = null;

    const twInfo = this.getTaiwanDateInfo();
    let updated = false;

    // 若當前已過每日中午 12:00 且今天尚未領取自動恢復
    if (twInfo.isPastNoon && progress.lastInkRestoreDate !== twInfo.dateStr) {
      if (progress.inkCount < 3) {
        progress.inkCount = Math.min(3, progress.inkCount + 1);
        updated = true;
      }
      progress.lastInkRestoreDate = twInfo.dateStr;
      localStorage.setItem(this.storageKey, JSON.stringify(progress));
    }
    return progress.inkCount;
  }

  getInkCount() {
    this.checkAndRestoreInk();
    const progress = this.getProgress();
    return progress.inkCount !== undefined ? progress.inkCount : 3;
  }

  useInk() {
    const currentInk = this.getInkCount();
    if (currentInk <= 0) return false;
    const progress = this.getProgress();
    progress.inkCount = currentInk - 1;
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
    return true;
  }

  addInk(amount = 1) {
    const progress = this.getProgress();
    const currentInk = progress.inkCount !== undefined ? progress.inkCount : 3;
    progress.inkCount = Math.min(3, currentInk + amount);
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
    return progress.inkCount;
  }

  // 看廣告恢復墨汁
  watchRewardAdForInk(callback) {
    if (typeof Capacitor !== 'undefined' && Capacitor.Plugins && Capacitor.Plugins.AdMob) {
      console.log("[AdMob] 撥放測試獎勵影片廣告...");
      // Capacitor AdMob 整合點
      setTimeout(() => {
        this.addInk(1);
        if (callback) callback({ success: true, inkCount: this.getInkCount() });
      }, 1000);
    } else {
      // 網頁版/模擬看廣告
      const confirmed = confirm("觀看廣告模擬影片？\n(按下確定完成播放可獲得 1 點墨汁)");
      if (confirmed) {
        this.addInk(1);
        alert("感謝觀看！墨汁 +1");
        if (callback) callback({ success: true, inkCount: this.getInkCount() });
      } else {
        if (callback) callback({ success: false });
      }
    }
  }

  // --- 新增：每周挑戰成績管理 ---
  getWeeklyBestTime(weekKey) {
    const progress = this.getProgress();
    if (!progress.weeklyBests) return null;
    const wk = weekKey || (typeof getWeekKey === 'function' ? getWeekKey() : 'current');
    return progress.weeklyBests[wk] || null;
  }

  saveWeeklyBestTime(timeMs, weekKey) {
    const progress = this.getProgress();
    if (!progress.weeklyBests) progress.weeklyBests = {};
    const wk = weekKey || (typeof getWeekKey === 'function' ? getWeekKey() : 'current');

    let isNewBest = false;
    if (!progress.weeklyBests[wk] || timeMs < progress.weeklyBests[wk]) {
      progress.weeklyBests[wk] = timeMs;
      isNewBest = true;
    }
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
    return isNewBest;
  }
}

// 創建全域進度管理器實例
window.progressManager = new ProgressManager();
