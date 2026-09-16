// docs/graphics.js
// ---- 海洋主題：程序化繪圖元件與章魚主角視覺繪製 ----

class SeaweedZone extends PIXI.Container {
  constructor(x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.objectType = 'speedup';
    this._isTouched = false;
    this.time = Math.random() * 10;

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    this.renderSeaweed();
  }

  update(delta) {
    this.time += 0.05 * (delta || 1);
    this.renderSeaweed();
  }

  renderSeaweed() {
    const g = this.graphics;
    g.clear();

    // 翡翠綠底色光圈 (標示加速區)
    g.rect(0, 0, this.w, this.h).fill({ color: 0x27ae60, alpha: 0.2 });
    g.rect(0, 0, this.w, this.h).stroke({ width: 2, color: 0x2ecc71, alpha: 0.8 });

    // 根據寬度繪製水草葉片叢
    const bladeCount = Math.max(2, Math.floor(this.w / 12));
    const bladeSpacing = this.w / bladeCount;

    for (let i = 0; i < bladeCount; i++) {
      const baseX = bladeSpacing * i + bladeSpacing / 2;
      const baseY = this.h;
      const heightRatio = 0.7 + (i % 3) * 0.15;
      const bladeH = this.h * heightRatio;

      const wave = Math.sin(this.time + i * 0.9) * 6;
      const tipX = baseX + wave;
      const tipY = baseY - bladeH;
      const ctrlX = baseX + wave * 0.5;
      const ctrlY = baseY - bladeH * 0.5;

      // 水草葉片雙向貝茲曲線主體
      g.moveTo(baseX - 3, baseY)
        .quadraticCurveTo(ctrlX - 2, ctrlY, tipX, tipY)
        .quadraticCurveTo(ctrlX + 3, ctrlY, baseX + 3, baseY)
        .fill(0x27ae60);

      // 葉脈亮綠高光
      g.moveTo(baseX, baseY)
        .quadraticCurveTo(ctrlX, ctrlY, tipX, tipY)
        .stroke({ width: 1.5, color: 0x2ecc71 });
    }

    // 根部小岩石顆粒
    g.circle(this.w * 0.2, this.h - 2, 3).fill(0x34495e);
    g.circle(this.w * 0.5, this.h - 3, 4).fill(0x2c3e50);
    g.circle(this.w * 0.8, this.h - 2, 3).fill(0x34495e);
  }
}

class AnemoneZone extends PIXI.Container {
  constructor(x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.objectType = 'speeddown';
    this._isTouched = false;
    this.time = Math.random() * 10;

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    this.renderAnemone();
  }

  update(delta) {
    this.time += 0.06 * (delta || 1);
    this.renderAnemone();
  }

  renderAnemone() {
    const g = this.graphics;
    g.clear();

    // 暗紅色警示區域底色
    g.rect(0, 0, this.w, this.h).fill({ color: 0xc0392b, alpha: 0.2 });
    g.rect(0, 0, this.w, this.h).stroke({ width: 2, color: 0xe74c3c, alpha: 0.8 });

    const baseY = this.h;
    const anemoneCount = Math.max(1, Math.floor(this.w / 20));
    const spacing = this.w / anemoneCount;

    for (let a = 0; a < anemoneCount; a++) {
      const cx = spacing * a + spacing / 2;
      const cy = baseY - 8;
      const pulse = Math.cos(this.time + a * 1.2) * 2;

      // 海葵底座
      g.ellipse(cx, cy, 10 + pulse, 8).fill(0xc0392b);

      // 觸手叢與微動彈力感
      const tentacleCount = 7;
      for (let t = 0; t < tentacleCount; t++) {
        const angle = (Math.PI / (tentacleCount - 1)) * t - Math.PI;
        const len = 12 + Math.sin(this.time * 2 + t) * 3;
        const tx = cx + Math.cos(angle) * len;
        const ty = cy + Math.sin(angle) * len;

        g.moveTo(cx, cy)
          .quadraticCurveTo(cx + Math.cos(angle) * (len * 0.5) + pulse, cy + Math.sin(angle) * (len * 0.5), tx, ty)
          .stroke({ width: 3, color: 0xe74c3c, cap: 'round' });

        // 觸手末端粉紅頂柱
        g.circle(tx, ty, 2).fill(0xff7675);
      }
    }
  }
}

class ShrimpGoal extends PIXI.Container {
  constructor(x, y, w, h) {
    super();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.time = Math.random() * 10;

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
    this.renderShrimp();
  }

  update(delta) {
    this.time += 0.06 * (delta || 1);
    this.renderShrimp();
  }

  renderShrimp() {
    const g = this.graphics;
    g.clear();

    const w = this.w;
    const h = this.h;
    const cx = w / 2;
    const cy = h / 2;
    const bounce = Math.sin(this.time * 2.5) * 3;
    const whiskerWave = Math.sin(this.time * 3.5) * 4;

    // 蝦子目標環狀光暈
    g.circle(cx, cy + bounce, 18).fill({ color: 0xff7675, alpha: 0.25 });
    g.circle(cx, cy + bounce, 25).fill({ color: 0xfab1a0, alpha: 0.15 });

    // 蝦子弧形鮮紅身體
    g.moveTo(cx - 10, cy + 8 + bounce)
      .quadraticCurveTo(cx - 14, cy - 6 + bounce, cx, cy - 10 + bounce)
      .quadraticCurveTo(cx + 12, cy - 6 + bounce, cx + 8, cy + 8 + bounce)
      .quadraticCurveTo(cx - 2, cy + 12 + bounce, cx - 10, cy + 8 + bounce)
      .fill(0xff7675);

    // 蝦身紋理分節
    g.arc(cx - 2, cy - 2 + bounce, 8, Math.PI * 0.8, Math.PI * 1.8).stroke({ width: 2, color: 0xd63031 });
    g.arc(cx + 3, cy + 2 + bounce, 7, Math.PI * 0.8, Math.PI * 1.8).stroke({ width: 2, color: 0xd63031 });

    // 蝦尾 (扇形)
    g.moveTo(cx + 8, cy + 8 + bounce)
      .lineTo(cx + 14, cy + 16 + bounce)
      .lineTo(cx + 8, cy + 14 + bounce)
      .lineTo(cx + 2, cy + 16 + bounce)
      .fill(0xd63031);

    // 卡通大眼睛
    g.circle(cx - 6, cy - 6 + bounce, 3.5).fill(0xffffff);
    g.circle(cx - 6.5, cy - 6 + bounce, 2).fill(0x2d3436);

    // 長鬚搖曳 (鮮明觸角)
    g.moveTo(cx - 8, cy - 8 + bounce)
      .quadraticCurveTo(cx - 16, cy - 16 + bounce, cx - 22 + whiskerWave, cy - 20 + bounce)
      .stroke({ width: 1.8, color: 0xffeaa7 });
    g.moveTo(cx - 6, cy - 8 + bounce)
      .quadraticCurveTo(cx - 14, cy - 20 + bounce, cx - 18 - whiskerWave, cy - 24 + bounce)
      .stroke({ width: 1.8, color: 0xffeaa7 });

    // 閃耀星光 (Sparkles)
    g.poly([
      cx + 12, cy - 12 + bounce,
      cx + 14, cy - 8 + bounce,
      cx + 18, cy - 6 + bounce,
      cx + 14, cy - 4 + bounce,
      cx + 12, cy + bounce,
      cx + 10, cy - 4 + bounce,
      cx + 6, cy - 6 + bounce,
      cx + 10, cy - 8 + bounce
    ]).fill(0xfff200);
  }
}

class OceanBubbleSystem extends PIXI.Container {
  constructor() {
    super();
    this.bubbles = [];
    for (let i = 0; i < 25; i++) {
      this.bubbles.push({
        baseX: Math.random() * 800,
        y: Math.random() * 450,
        radius: 2 + Math.random() * 6,
        speed: 0.4 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2
      });
    }
    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);
  }

  update(delta) {
    const g = this.graphics;
    g.clear();

    const dt = delta || 1;
    this.bubbles.forEach(b => {
      b.y -= b.speed * dt;
      b.phase += 0.03 * dt;
      const currentX = b.baseX + Math.sin(b.phase) * 12;

      if (b.y < -20) {
        b.y = 470;
      }

      g.circle(currentX, b.y, b.radius).fill({ color: 0xffffff, alpha: 0.2 });
      g.circle(currentX, b.y, b.radius).stroke({ width: 1, color: 0xffffff, alpha: 0.4 });
      g.circle(currentX - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25).fill({ color: 0xffffff, alpha: 0.6 });
    });
  }
}

function createOceanFloor(x, y, w, h) {
  const container = new PIXI.Container();
  container.x = x;
  container.y = y;

  const g = new PIXI.Graphics();
  // 金黃砂層
  g.rect(0, 0, w, h).fill(0xdfb06c);
  // 頂部淺粉珊瑚沙線條
  g.rect(0, 0, w, 6).fill(0xf3a683);

  // 小貝殼與沉積石
  for (let px = 30; px < w; px += 50) {
    g.arc(px, 12, 5, Math.PI, 0).fill(0xe84393);
    g.circle(px + 20, 16, 3).fill(0x74b9ff);
  }

  container.addChild(g);
  return container;
}

function createCoralWall(x, y, w, h, isBoundary = false) {
  const container = new PIXI.Container();
  container.x = x;
  container.y = y;

  const g = new PIXI.Graphics();
  if (isBoundary) {
    // 滿版無縫邊界柱 (直角平貼畫布外緣)
    g.rect(0, 0, w, h).fill(0x2c3e50);
    const innerX = x === 0 ? 0 : 2;
    const innerW = (x === 0 || x === 760) ? w - 2 : w - 4;
    g.rect(innerX, 0, innerW, h).fill(0x34495e);

    // 牆頂/地板頂端綠色海藻裝飾
    if (y < 400) {
      g.rect(0, 0, w, 4).fill(0x16a085);
    } else {
      g.rect(0, 0, w, 6).fill(0x16a085);
    }
  } else {
    // 懸空平台 (保留圓角美感)
    g.roundRect(0, 0, w, h, 6).fill(0x2c3e50);
    g.roundRect(2, 2, w - 4, h - 4, 4).fill(0x34495e);
    g.rect(0, 0, w, 4).fill(0x16a085);
  }

  container.addChild(g);
  return container;
}

// ---- 章魚主角類別 (支援 4 態跳躍向量姿態繪製) ----
class CuteOctopusPlayer extends PIXI.Container {
  constructor(w = 32, h = 48) {
    super();
    this.w = w;
    this.h = h;

    // 精準透明碰撞基底框 (100% 鎖定為 32x48 像素，確保碰撞與跳躍軌跡精準一致)
    this.boundsBox = new PIXI.Graphics().rect(0, 0, w, h).fill({ alpha: 0 });
    this.addChild(this.boundsBox);

    // 內部轉向容器
    this.body = new PIXI.Container();
    this.body.position.set(w / 2, h / 2);
    this.body.pivot.set(w / 2, h / 2);
    this.addChild(this.body);

    this.graphics = new PIXI.Graphics();
    this.body.addChild(this.graphics);

    this.currentState = 'IDLE';
    this.renderCuteOctopus();
  }

  setFacing(direction) {
    if (direction > 0) {
      this.body.scale.x = 1;
    } else if (direction < 0) {
      this.body.scale.x = -1;
    }
  }

  updateState(dt = 1, velocityY = 0, isGrounded = true) {
    let newState = 'IDLE';
    if (isGrounded) {
      newState = 'IDLE';
    } else if (velocityY < -2) {
      newState = 'RISING';
    } else if (Math.abs(velocityY) <= 2) {
      newState = 'APEX';
    } else {
      newState = 'FALLING';
    }

    if (this.currentState !== newState) {
      this.currentState = newState;
      this.renderCuteOctopus();
    }
  }

  renderCuteOctopus() {
    const g = this.graphics;
    g.clear();

    const w = this.w;
    const h = this.h;
    const cx = w / 2;
    const state = this.currentState;

    if (state === 'RISING') {
      // ---- 1. RISING 上升狀態 (火箭噴射姿態) ----
      // 垂直延伸圓頭
      g.ellipse(cx, 15, 12, 16).fill(0xff7675);

      // 眼睛向上看
      g.circle(cx - 5, 14, 4).fill(0xffffff);
      g.circle(cx - 4.5, 13.5, 2).fill(0x2d3436);
      g.circle(cx + 5, 14, 4).fill(0xffffff);
      g.circle(cx + 4.5, 13.5, 2).fill(0x2d3436);

      // 可愛紅暈
      g.ellipse(cx - 7, 20, 2.5, 1.8).fill({ color: 0xd63031, alpha: 0.6 });
      g.ellipse(cx + 7, 20, 2.5, 1.8).fill({ color: 0xd63031, alpha: 0.6 });

      // 驚喜嘴型 :O
      g.circle(cx, 20.5, 2.2).fill(0xd63031);
      g.circle(cx, 20.5, 1.1).fill(0xff7675);

      // 觸手向下緊收束攏（噴射狀，腳底精準到 y=46）
      const offsets = [-8, -4, 0, 4, 8];
      offsets.forEach(off => {
        g.moveTo(cx + off, 27)
          .quadraticCurveTo(cx + off * 0.4, 38, cx + off * 0.2, 46)
          .stroke({ width: 5, color: 0xe84393, cap: 'round' });
      });

    } else if (state === 'APEX') {
      // ---- 2. APEX 滯空頂點狀態 (雨傘張開飄浮) ----
      // 完美正圓頭
      g.circle(cx, 16, 14.5).fill(0xff7675);

      // 歡呼亮亮大眼
      g.circle(cx - 5, 15, 4.2).fill(0xffffff);
      g.circle(cx - 4, 15, 2.2).fill(0x2d3436);
      g.circle(cx - 3, 14, 1).fill(0xffffff); // 亮點
      g.circle(cx + 5, 15, 4.2).fill(0xffffff);
      g.circle(cx + 4, 15, 2.2).fill(0x2d3436);
      g.circle(cx + 5, 14, 1).fill(0xffffff);

      // 可愛紅暈
      g.ellipse(cx - 8, 21, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });
      g.ellipse(cx + 8, 21, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });

      // 觸手向四周像雨傘般寬張飄浮 (腳底到 y=46)
      for (let t = -3; t <= 3; t += 2) {
        const spread = t * 4.5;
        g.moveTo(cx + t * 2, 28)
          .quadraticCurveTo(cx + spread * 1.2, 36, cx + spread, 46)
          .stroke({ width: 5, color: 0xe84393, cap: 'round' });
      }

    } else if (state === 'FALLING') {
      // ---- 3. FALLING 下降狀態 (風壓上揚俯衝) ----
      // 橫向微壓扁圓頭
      g.ellipse(cx, 18, 15, 12.5).fill(0xff7675);

      // 眼睛向下看
      g.circle(cx - 5, 18, 4).fill(0xffffff);
      g.circle(cx - 4, 19, 2).fill(0x2d3436);
      g.circle(cx + 5, 18, 4).fill(0xffffff);
      g.circle(cx + 4, 19, 2).fill(0x2d3436);

      // 可愛紅暈
      g.ellipse(cx - 8, 23, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });
      g.ellipse(cx + 8, 23, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });

      // 專注小圓嘴
      g.circle(cx, 23, 1.8).fill(0x2d3436);

      // 觸手受風壓向上彎曲飄起 (末端落在 y=46)
      for (let t = -3; t <= 3; t += 2) {
        g.moveTo(cx + t * 3, 29)
          .quadraticCurveTo(cx + t * 6, 36, cx + t * 4, 46)
          .stroke({ width: 5, color: 0xe84393, cap: 'round' });
      }

    } else {
      // ---- 4. IDLE 平時地面狀態 (經典圓頭下垂觸手) ----
      // 圓形頭部
      g.circle(cx, 17, 14).fill(0xff7675);

      // 水汪汪大眼睛
      g.circle(cx - 5, 16, 4).fill(0xffffff);
      g.circle(cx - 4, 16, 2).fill(0x2d3436);
      g.circle(cx + 5, 16, 4).fill(0xffffff);
      g.circle(cx + 4, 16, 2).fill(0x2d3436);

      // 可愛紅暈
      g.ellipse(cx - 8, 22, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });
      g.ellipse(cx + 8, 22, 3, 2).fill({ color: 0xd63031, alpha: 0.6 });

      // 粗觸手自然排開 (寬度 5，腳底到 y=46)
      for (let t = -3; t <= 3; t += 2) {
        g.moveTo(cx + t * 3, 29)
          .quadraticCurveTo(cx + t * 5, 39, cx + t * 4, 46)
          .stroke({ width: 5, color: 0xe84393, cap: 'round' });
      }
    }
  }
}
