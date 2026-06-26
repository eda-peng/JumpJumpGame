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
        completedLevels: []
      };
      localStorage.setItem(this.storageKey, JSON.stringify(initialProgress));
    }
  }

  // 取得當前進度物件
  getProgress() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : { unlockedLevels: [1], completedLevels: [] };
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
}

// 創建全域進度管理器實例
window.progressManager = new ProgressManager();
