// levels.js
const LEVEL_CONFIGS = {
  1: { // 教學關 牆壁
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 250, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 矮牆
      { x: 510, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 矮牆
    ]
  },
  2: { // 教學關 牆壁
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 250, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 510, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
    ]
  },
  3: { // 教學關 平台
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 60, w: 40, h: 40 },
    customObjects: [
      { x: 300, y: 300, w: 150, h: 40, color: 0x7f8c8d },
      { x: 450, y: 200, w: 150, h: 40, color: 0x7f8c8d },
      { x: 600, y: 100, w: 150, h: 40, color: 0x7f8c8d }
    ]
  },
  4: { // 撞牆後回跳
    playerStart: { x: 100, y: 350 },
    goal: { x: 80, y: 180, w: 40, h: 40 },
    customObjects: [
      { x: 380, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 40, y: 220, w: 250, h: 40, color: 0x7f8c8d }  // 地板
    ]
  },
  5: { // 抓時機跳
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 120, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 250, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 380, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 510, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 630, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
    ]
  },
  6: { // 剛好踩蹬腳處往上爬
    playerStart: { x: 100, y: 350 },
    goal: { x: 720, y: 0, w: 40, h: 40 },
    customObjects: [
      { x: 720, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 40, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      { x: 720, y: 40, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 40, y: 240, w: 720, h: 40, color: 0x7f8c8d },  // 地板
      { x: 40, y: 80, w: 720, h: 40, color: 0x7f8c8d }  // 地板
    ]
  },
  7: { // 不能跳
    playerStart: { x: 100, y: 0 },
    goal: { x: 720, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 90, y: 50, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 40, y: 100, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 90, y: 150, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 40, y: 200, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 90, y: 250, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 40, y: 300, w: 670, h: 40, color: 0x7f8c8d },  // 地板
      { x: 90, y: 350, w: 670, h: 40, color: 0x7f8c8d },  // 地板
    ]
  },
  8: { // 一路跌下來
    playerStart: { x: 40, y: 350 },
    goal: { x: 180, y: 0, w: 40, h: 40 },
    customObjects: [
      { x: 150, y: 280, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
      { x: 350, y: 280, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
      { x: 550, y: 280, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
      { x: 50, y: 160, w: 100, h: 40, color: 0x7f8c8d }, // 中間層
      { x: 250, y: 160, w: 100, h: 40, color: 0x7f8c8d }, // 中間層
      { x: 450, y: 160, w: 100, h: 40, color: 0x7f8c8d }, // 中間層
      { x: 650, y: 160, w: 100, h: 40, color: 0x7f8c8d }, // 中間層
      { x: 150, y: 40, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
      { x: 350, y: 40, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
      { x: 550, y: 40, w: 100, h: 40, color: 0x7f8c8d }, // 最下層
    ]
  },
  9: { // 不能掉到洞裡
    playerStart: { x: 40, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 140, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆
      { x: 290, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 440, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 590, y: 320, w: 40, h: 80, color: 0x7f8c8d } // 矮牆
    ]
  },
  10: { // 神奇的時機
    playerStart: { x: 100, y: 350 },
    goal: { x: 700, y: 360, w: 40, h: 40 },
    customObjects: [
      { x: 60, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 200, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 340, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 480, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 620, y: 200, w: 40, h: 200, color: 0x7f8c8d }, // 高牆
      { x: 160, y: 300, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處1
      { x: 240, y: 300, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處2
      { x: 440, y: 300, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處3
      { x: 520, y: 300, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處4
    ]
  },
  11: { // 
    playerStart: { x: 100, y: 350 },
    goal: { x: 720, y: 40, w: 40, h: 40 },
    customObjects: [
      { x: 620, y: 200, w: 140, h: 40, color: 0x7f8c8d }, // 蹬腳處右上
      { x: 620, y: 360, w: 140, h: 40, color: 0x7f8c8d }, // 蹬腳處右下
      { x: 620, y: 360, w: 40, h: 80, color: 0x7f8c8d }, // 牆壁，貼在地面的地板會可以走進去
      { x: 250, y: 240, w: 100, h: 40, color: 0x7f8c8d },  // 下地板
      { x: 450, y: 240, w: 100, h: 40, color: 0x7f8c8d },  // 下地板
      { x: 250, y: 80, w: 100, h: 40, color: 0x7f8c8d },  // 上地板
      { x: 450, y: 80, w: 100, h: 40, color: 0x7f8c8d },  // 上地板
      { x: 40, y: 40, w: 140, h: 40, color: 0x7f8c8d }, // 蹬腳處左下
      { x: 40, y: 200, w: 140, h: 40, color: 0x7f8c8d }, // 蹬腳處左上
    ]
  },
  12: { // 踩邊邊
    playerStart: { x: 40, y: 350 },
    goal: { x: 380, y: 60, w: 40, h: 40 },
    customObjects: [
      { x: 360, y: 300, w: 80, h: 40, color: 0x7f8c8d }, // 墊腳處
      { x: 280, y: 100, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板1
      { x: 200, y: 150, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板2
      { x: 120, y: 200, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板3
      { x: 40, y: 250, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板4
      { x: 680, y: 100, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板1
      { x: 600, y: 150, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板2
      { x: 520, y: 200, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板3
      { x: 440, y: 250, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板4
      { x: 380, y: 100, w: 40, h: 200, color: 0x7f8c8d }, // 中央大牆
    ]
  },
  13: { // 連3跳
    playerStart: { x: 100, y: 350 },
    goal: { x: 620, y: 30, w: 40, h: 40 },
    customObjects: [
      { x: 620, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 250, y: 240, w: 300, h: 40, color: 0x7f8c8d },  // 下地板
      { x: 140, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      { x: 250, y: 80, w: 300, h: 40, color: 0x7f8c8d },  // 上地板
    ]
  },
  14: { // 踩邊邊
    playerStart: { x: 40, y: 350 },
    goal: { x: 380, y: 60, w: 40, h: 40 },
    customObjects: [
      { x: 360, y: 300, w: 80, h: 40, color: 0x7f8c8d }, // 墊腳處
      { x: 200, y: 150, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板2
      { x: 40, y: 250, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板4
      { x: 680, y: 100, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板1
      { x: 520, y: 200, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板3
      { x: 380, y: 100, w: 40, h: 200, color: 0x7f8c8d }, // 中央大牆
    ]
  },
  15: { // 踩邊邊
    playerStart: { x: 40, y: 350 },
    goal: { x: 380, y: 60, w: 40, h: 40 },
    customObjects: [
      { x: 360, y: 300, w: 80, h: 40, color: 0x7f8c8d }, // 墊腳處
      { x: 280, y: 100, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板1
      { x: 120, y: 200, w: 80, h: 40, color: 0x7f8c8d }, // 左側地板3
      { x: 600, y: 150, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板2
      { x: 440, y: 250, w: 80, h: 40, color: 0x7f8c8d }, // 右側地板4
      { x: 380, y: 100, w: 40, h: 200, color: 0x7f8c8d }, // 中央大牆
    ]
  },
  16: { // 加速教學關卡
    playerStart: { x: 50, y: 350 },
    goal: { x: 720, y: 180, w: 40, h: 40 },
    customObjects: [
      { x: 300, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 蹬腳處
      { x: 540, y: 220, w: 220, h: 40, color: 0x7f8c8d }, // 地板
      { x: 340, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 720, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
    ]
  },
  17: { // 減速教學關卡
    playerStart: { x: 100, y: 350 },
    goal: { x: 640, y: 30, w: 40, h: 40 },
    customObjects: [
      { x: 640, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 190, y: 240, w: 420, h: 30, color: 0x7f8c8d },  // 下地板
      { x: 120, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      { x: 190, y: 80, w: 420, h: 30, color: 0x7f8c8d },  // 上地板
      { x: 40, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 600, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
    ]
  },
  18: { // 加速教學關卡 進階
    playerStart: { x: 50, y: 350 },
    goal: { x: 720, y: 180, w: 40, h: 40 },
    customObjects: [
      { x: 300, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 蹬腳處
      { x: 540, y: 220, w: 220, h: 40, color: 0x7f8c8d }, // 地板
      { x: 340, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 720, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 530, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
    ]
  },
  19: { // 減速教學關卡 進階
    playerStart: { x: 100, y: 350 },
    goal: { x: 640, y: 30, w: 40, h: 40 },
    customObjects: [
      { x: 640, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 190, y: 240, w: 420, h: 30, color: 0x7f8c8d },  // 下地板
      { x: 120, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      { x: 190, y: 80, w: 420, h: 30, color: 0x7f8c8d },  // 上地板
      { x: 40, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 320, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 600, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
    ]
  },
  20: { // 減速後節奏跳躍
    playerStart: { x: 40, y: 350 },
    goal: { x: 720, y: 40, w: 40, h: 40 },
    customObjects: [
      { x: 150, y: 300, w: 60, h: 40, color: 0x7f8c8d },
      { x: 300, y: 240, w: 60, h: 40, color: 0x7f8c8d },
      { x: 450, y: 180, w: 60, h: 40, color: 0x7f8c8d },
      { x: 600, y: 120, w: 60, h: 40, color: 0x7f8c8d },
      { x: 720, y: 80, w: 60, h: 40, color: 0x7f8c8d },
      { x: 340, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 420, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
    ]
  },
  21: { // 上方分路
    playerStart: { x: 40, y: 350 },
    goal: { x: 250, y: 150, w: 40, h: 40 },
    customObjects: [
      { x: 290, y: 100, w: 40, h: 240, color: 0x7f8c8d }, // 左窄牆
      { x: 470, y: 100, w: 40, h: 240, color: 0x7f8c8d }, // 右窄牆
      { x: 110, y: 100, w: 580, h: 40, color: 0x7f8c8d }, // 中央地板1
      { x: 110, y: 200, w: 580, h: 40, color: 0x7f8c8d }, // 中央地板2
      { x: 330, y: 300, w: 140, h: 40, color: 0x7f8c8d }, // 中央地板3
      { x: 40, y: 150, w: 180, h: 40, color: 0x7f8c8d }, // 左側地板1
      { x: 40, y: 250, w: 180, h: 40, color: 0x7f8c8d }, // 左側地板2
      { x: 580, y: 150, w: 180, h: 40, color: 0x7f8c8d }, // 右側地板1
      { x: 580, y: 250, w: 180, h: 40, color: 0x7f8c8d }, // 右側地板2
      { x: 350, y: 0, w: 10, h: 100, color: 0x7f8c8d }, // 中央大牆
      { x: 405, y: 260, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 355, y: 260, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 405, y: 160, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 355, y: 160, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
    ]
  },
  22: { // 加速 跳躍
    playerStart: { x: 40, y: 350 },
    goal: { x: 720, y: 40, w: 40, h: 40 },
    customObjects: [
      { x: 150, y: 300, w: 60, h: 40, color: 0x7f8c8d },
      { x: 300, y: 240, w: 60, h: 40, color: 0x7f8c8d },
      { x: 600, y: 120, w: 60, h: 40, color: 0x7f8c8d },
      { x: 720, y: 80, w: 60, h: 40, color: 0x7f8c8d },
      { x: 340, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 420, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
    ]
  },
  23: { // 減速後加速
    playerStart: { x: 100, y: 350 },
    goal: { x: 640, y: 30, w: 40, h: 40 },
    customObjects: [
      { x: 640, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      { x: 190, y: 240, w: 420, h: 30, color: 0x7f8c8d },  // 下地板
      { x: 120, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      { x: 190, y: 80, w: 420, h: 30, color: 0x7f8c8d },  // 上地板
      { x: 40, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 320, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 600, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 570, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 510, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 450, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 390, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 330, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 270, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 210, y: 200, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
    ]
  },
  24: { // 速度減慢繞一圈
    playerStart: { x: 40, y: 350 },
    goal: { x: 180, y: 140, w: 40, h: 40 },
    customObjects: [
      { x: 140, y: 100, w: 40, h: 240, color: 0x7f8c8d }, // 高牆
      { x: 290, y: 240, w: 40, h: 100, color: 0x7f8c8d }, // 高牆
      { x: 440, y: 240, w: 40, h: 160, color: 0x7f8c8d }, // 高牆
      { x: 620, y: 100, w: 40, h: 240, color: 0x7f8c8d }, // 高牆
      { x: 140, y: 100, w: 480, h: 40, color: 0x7f8c8d }, // 地板
      { x: 40, y: 100, w: 50, h: 40, color: 0x7f8c8d }, // 地板
      { x: 90, y: 200, w: 50, h: 40, color: 0x7f8c8d }, // 地板
      { x: 40, y: 300, w: 50, h: 40, color: 0x7f8c8d }, // 地板
      { x: 480, y: 240, w: 50, h: 40, color: 0x7f8c8d }, // 地板
      { x: 570, y: 300, w: 50, h: 40, color: 0x7f8c8d }, // 地板
      { x: 40, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 400, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
    ]
  },
  25: { // 加速後只小量減速
    playerStart: { x: 80, y: 350 },
    goal: { x: 40, y: 110, w: 40, h: 40 },
    customObjects: [
      { x: 120, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 180, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 240, y: 360, w: 40, h: 40, color: 0x27ae60, type: 'speedup' },
      { x: 40, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆左
      { x: 350, y: 250, w: 40, h: 150, color: 0x7f8c8d }, // 中央大牆
      { x: 390, y: 320, w: 40, h: 80, color: 0x7f8c8d }, // 矮牆中
      { x: 40, y: 150, w: 150, h: 40, color: 0x7f8c8d },  // 左地板
      { x: 500, y: 240, w: 150, h: 40, color: 0x7f8c8d },  // 右地板
      { x: 520, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 580, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
      { x: 640, y: 360, w: 40, h: 40, color: 0xc0392b, type: 'speeddown' },
    ]
  },
  CHALLENGE: { // 挑戰關卡 (與13關相同)
    playerStart: { x: 100, y: 350 },
    // goal: { x: 620, y: 30, w: 40, h: 40 },
    goal: { x: 620, y: 330, w: 40, h: 40 },
    customObjects: [
      // { x: 620, y: 360, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處右
      // { x: 250, y: 240, w: 100, h: 40, color: 0x7f8c8d },  // 下地板
      // { x: 450, y: 240, w: 100, h: 40, color: 0x7f8c8d },  // 下地板
      // { x: 140, y: 200, w: 40, h: 40, color: 0x7f8c8d }, // 蹬腳處左
      // { x: 250, y: 80, w: 100, h: 40, color: 0x7f8c8d },  // 上地板
      // { x: 450, y: 80, w: 100, h: 40, color: 0x7f8c8d },  // 上地板
    ]
  },
};
