// ============================================
// 精灵图系统 - 程序化生成怪物外形 + 动画帧
// ============================================
// 设计原则：
// 1. 所有精灵在游戏加载时一次性生成（offscreen canvas），运行时零开销
// 2. 每种怪物 8 帧动画（idle 呼吸/移动循环），帧率由 bodyBob 驱动
// 3. LOD 0 使用精灵图，LOD 1/2 保持原有圆形渲染（性能回退）
// 4. 精灵图尺寸根据怪物 radius 自适应，保持像素密度一致

class SpriteLoader {
    constructor() {
        this.sprites = {};
        this.frameCount = 8;
        this.ready = false;
    }

    generateAll() {
        const types = Object.keys(EnemyTypes);
        for (const type of types) {
            this._generateType(type);
        }
        this.ready = true;
    }

    getFrame(type, bodyBob) {
        const frames = this.sprites[type];
        if (!frames) return null;
        const norm = ((bodyBob % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const frameIndex = Math.floor(norm / (Math.PI * 2) * this.frameCount) % this.frameCount;
        return frames[frameIndex];
    }

    getSpriteSize(type) {
        const def = EnemyTypes[type];
        if (!def) return 0;
        return Math.ceil(def.radius * 3.2);
    }

    _generateType(type) {
        const def = EnemyTypes[type];
        if (!def) return;
        const size = this.getSpriteSize(type);
        const frames = [];

        for (let f = 0; f < this.frameCount; f++) {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            const phase = f / this.frameCount;
            const cx = size / 2;
            const cy = size / 2;
            const r = def.radius;

            ctx.save();
            this._drawType(ctx, type, cx, cy, r, phase, def);
            ctx.restore();
            frames.push(canvas);
        }
        this.sprites[type] = frames;
    }

    _drawType(ctx, type, cx, cy, r, phase, def) {
        switch (type) {
            case 'skeleton': this._drawSkeleton(ctx, cx, cy, r, phase, def); break;
            case 'bat': this._drawBat(ctx, cx, cy, r, phase, def); break;
            case 'slime': this._drawSlime(ctx, cx, cy, r, phase, def); break;
            case 'skeletonMage': this._drawSkeletonMage(ctx, cx, cy, r, phase, def); break;
            case 'shadowWolf': this._drawShadowWolf(ctx, cx, cy, r, phase, def); break;
            case 'gargoyle': this._drawGargoyle(ctx, cx, cy, r, phase, def); break;
            case 'demonCaster': this._drawDemonCaster(ctx, cx, cy, r, phase, def); break;
            case 'exploder': this._drawExploder(ctx, cx, cy, r, phase, def); break;
            case 'eliteSkeleton': this._drawEliteSkeleton(ctx, cx, cy, r, phase, def); break;
            case 'eliteDemon': this._drawEliteDemon(ctx, cx, cy, r, phase, def); break;
            case 'boss': this._drawBoss(ctx, cx, cy, r, phase, def); break;
            default: this._drawGeneric(ctx, cx, cy, r, phase, def); break;
        }
    }

    // --- 阴影 ---
    _shadow(ctx, cx, cy, r) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * 0.85, r * 0.7, r * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- 高光 ---
    _highlight(ctx, cx, cy, r) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================
    // 骷髅 - 骨骼感头颅+裂缝+三角眼眶+红光
    // ============================================
    _drawSkeleton(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 身体
        var grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, '#ccddcc');
        grad.addColorStop(0.7, def.colors[0]);
        grad.addColorStop(1, def.colors[1]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 0.9, r, 0, 0, Math.PI * 2);
        ctx.fill();
        // 裂缝
        ctx.strokeStyle = 'rgba(50,70,50,0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.1, cy - r * 0.6);
        ctx.lineTo(cx, cy - r * 0.2);
        ctx.lineTo(cx + r * 0.15, cy - r * 0.5);
        ctx.stroke();
        // 肋骨
        ctx.strokeStyle = 'rgba(50,70,50,0.25)';
        ctx.lineWidth = 1;
        for (var i = 0; i < 3; i++) {
            var ly = cy + r * 0.1 + i * r * 0.2;
            ctx.beginPath();
            ctx.moveTo(cx - r * 0.4, ly);
            ctx.lineTo(cx + r * 0.4, ly);
            ctx.stroke();
        }
        // 三角眼眶
        ctx.fillStyle = '#223322';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.35, cy - r * 0.2);
        ctx.lineTo(cx - r * 0.15, cy - r * 0.2);
        ctx.lineTo(cx - r * 0.25, cy + r * 0.0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.15, cy - r * 0.2);
        ctx.lineTo(cx + r * 0.35, cy - r * 0.2);
        ctx.lineTo(cx + r * 0.25, cy + r * 0.0);
        ctx.fill();
        // 眼中红光
        ctx.fillStyle = '#ff4444';
        ctx.globalAlpha = 0.6 + Math.sin(phase * Math.PI * 2) * 0.3;
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.08, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.25, cy - r * 0.08, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        this._highlight(ctx, cx, cy, r);
    }

    // ============================================
    // 蝙蝠 - 翼展动画+尖耳+尖牙
    // ============================================
    _drawBat(ctx, cx, cy, r, phase, def) {
        var wingAngle = Math.sin(phase * Math.PI * 2) * 0.4;
        var wingSpan = r * 1.8;
        this._shadow(ctx, cx, cy, r);
        // 翅膀
        ctx.fillStyle = def.colors[0];
        // 左翅
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy);
        ctx.quadraticCurveTo(cx - wingSpan * 0.8, cy - r * (0.6 + wingAngle), cx - wingSpan, cy + r * (0.2 - wingAngle * 0.5));
        ctx.quadraticCurveTo(cx - wingSpan * 0.5, cy + r * 0.3, cx - r * 0.3, cy + r * 0.2);
        ctx.fill();
        // 右翅
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy);
        ctx.quadraticCurveTo(cx + wingSpan * 0.8, cy - r * (0.6 + wingAngle), cx + wingSpan, cy + r * (0.2 - wingAngle * 0.5));
        ctx.quadraticCurveTo(cx + wingSpan * 0.5, cy + r * 0.3, cx + r * 0.3, cy + r * 0.2);
        ctx.fill();
        // 身体
        var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.7);
        grad.addColorStop(0, def.colors[1]);
        grad.addColorStop(1, def.colors[0]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 0.6, r * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        // 尖耳
        ctx.fillStyle = def.colors[0];
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.35, cy - r * 0.45);
        ctx.lineTo(cx - r * 0.15, cy - r * 0.85);
        ctx.lineTo(cx - r * 0.05, cy - r * 0.4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.05, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.15, cy - r * 0.85);
        ctx.lineTo(cx + r * 0.35, cy - r * 0.45);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.2, cy - r * 0.05, r * 0.12, r * 0.08, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.2, cy - r * 0.05, r * 0.12, r * 0.08, 0.2, 0, Math.PI * 2);
        ctx.fill();
        // 尖牙
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.08, cy + r * 0.15);
        ctx.lineTo(cx - r * 0.03, cy + r * 0.32);
        ctx.lineTo(cx + r * 0.02, cy + r * 0.15);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.03, cy + r * 0.15);
        ctx.lineTo(cx + r * 0.08, cy + r * 0.32);
        ctx.lineTo(cx + r * 0.13, cy + r * 0.15);
        ctx.fill();
    }

    // ============================================
    // 史莱姆 - Q弹果冻波浪边缘
    // ============================================
    _drawSlime(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var wobble = Math.sin(phase * Math.PI * 2) * r * 0.06;
        var grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.3, r * 0.1, cx, cy + r * 0.2, r * 1.1);
        grad.addColorStop(0, '#88ffaa');
        grad.addColorStop(0.4, def.colors[1]);
        grad.addColorStop(1, def.colors[0]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - r, cy + r * 0.3);
        ctx.quadraticCurveTo(cx - r * 1.05, cy - r * 0.3 + wobble, cx - r * 0.4, cy - r * 0.8);
        ctx.quadraticCurveTo(cx, cy - r * 1.05 - wobble, cx + r * 0.4, cy - r * 0.8);
        ctx.quadraticCurveTo(cx + r * 1.05, cy - r * 0.3 - wobble, cx + r, cy + r * 0.3);
        ctx.quadraticCurveTo(cx + r * 0.6, cy + r * 0.9 + wobble, cx, cy + r * 0.85);
        ctx.quadraticCurveTo(cx - r * 0.6, cy + r * 0.9 - wobble, cx - r, cy + r * 0.3);
        ctx.fill();
        // 光泽
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.15, cy - r * 0.2, r * 0.5, r * 0.4, -0.3, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.15, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.25, cy - r * 0.15, r * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#224422';
        ctx.beginPath();
        ctx.arc(cx - r * 0.22, cy - r * 0.12, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.28, cy - r * 0.12, r * 0.1, 0, Math.PI * 2);
        ctx.fill();
        // 大高光
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.4, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================
    // 骷髅法师 - 紫色法袍+浮动法球
    // ============================================
    _drawSkeletonMage(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 法袍
        var grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
        grad.addColorStop(0, def.colors[1]);
        grad.addColorStop(1, def.colors[0]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy - r * 0.5);
        ctx.lineTo(cx + r * 0.5, cy - r * 0.5);
        ctx.lineTo(cx + r * 0.85, cy + r * 0.9);
        ctx.lineTo(cx - r * 0.85, cy + r * 0.9);
        ctx.closePath();
        ctx.fill();
        // 头颅
        ctx.fillStyle = '#ccccbb';
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.3, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // 兜帽
        ctx.fillStyle = def.colors[0];
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.3, r * 0.48, Math.PI + 0.4, Math.PI * 2 - 0.4);
        ctx.lineTo(cx + r * 0.5, cy - r * 0.05);
        ctx.lineTo(cx - r * 0.5, cy - r * 0.05);
        ctx.closePath();
        ctx.fill();
        // 紫色发光眼
        ctx.fillStyle = '#cc44ff';
        ctx.globalAlpha = 0.7 + Math.sin(phase * Math.PI * 2) * 0.3;
        ctx.beginPath();
        ctx.arc(cx - r * 0.15, cy - r * 0.3, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.15, cy - r * 0.3, r * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // 浮动法球
        var orbY = cy + r * 0.3 + Math.sin(phase * Math.PI * 2) * r * 0.15;
        var orbGrad = ctx.createRadialGradient(cx, orbY, 0, cx, orbY, r * 0.22);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.4, '#cc88ff');
        orbGrad.addColorStop(1, 'rgba(100,50,180,0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(cx, orbY, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================
    // 暗影狼 - 修长四足+尖耳+尾巴
    // ============================================
    _drawShadowWolf(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var runPhase = Math.sin(phase * Math.PI * 2);
        // 身体 - 横椭圆
        var grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, def.colors[1]);
        grad.addColorStop(1, def.colors[0]);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.05, r * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        // 尾巴
        ctx.strokeStyle = def.colors[0];
        ctx.lineWidth = r * 0.18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.85, cy);
        ctx.quadraticCurveTo(cx + r * 1.3, cy - r * 0.3 + runPhase * r * 0.2, cx + r * 1.2, cy - r * 0.55);
        ctx.stroke();
        // 头部
        ctx.fillStyle = def.colors[1];
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.65, cy - r * 0.05, r * 0.45, r * 0.35, -0.15, 0, Math.PI * 2);
        ctx.fill();
        // 尖耳
        ctx.fillStyle = def.colors[0];
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.75, cy - r * 0.35);
        ctx.lineTo(cx - r * 0.9, cy - r * 0.8);
        ctx.lineTo(cx - r * 0.55, cy - r * 0.4);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy - r * 0.35);
        ctx.lineTo(cx - r * 0.45, cy - r * 0.75);
        ctx.lineTo(cx - r * 0.3, cy - r * 0.35);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.75, cy - r * 0.1, r * 0.09, r * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.55, cy - r * 0.1, r * 0.09, r * 0.05, 0, 0, Math.PI * 2);
        ctx.fill();
        // 腿
        ctx.strokeStyle = def.colors[0];
        ctx.lineWidth = r * 0.1;
        var legOff = runPhase * r * 0.12;
        ctx.beginPath(); ctx.moveTo(cx - r * 0.35, cy + r * 0.5); ctx.lineTo(cx - r * 0.35, cy + r * 0.85 + legOff); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.25, cy + r * 0.5); ctx.lineTo(cx + r * 0.25, cy + r * 0.85 - legOff); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.1, cy + r * 0.5); ctx.lineTo(cx - r * 0.1, cy + r * 0.85 - legOff); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy + r * 0.5); ctx.lineTo(cx + r * 0.5, cy + r * 0.85 + legOff); ctx.stroke();
    }

    // ============================================
    // 石像鬼 - 厚重石质+小翅膀+角
    // ============================================
    _drawGargoyle(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var wingFlap = Math.sin(phase * Math.PI * 2) * 0.15;
        // 翅膀
        ctx.fillStyle = 'rgba(100,80,60,0.6)';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy - r * 0.2);
        ctx.quadraticCurveTo(cx - r * 1.2, cy - r * 0.7 - wingFlap * r, cx - r * 0.95, cy + r * 0.1);
        ctx.lineTo(cx - r * 0.5, cy + r * 0.1);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.5, cy - r * 0.2);
        ctx.quadraticCurveTo(cx + r * 1.2, cy - r * 0.7 + wingFlap * r, cx + r * 0.95, cy + r * 0.1);
        ctx.lineTo(cx + r * 0.5, cy + r * 0.1);
        ctx.fill();
        // 身体（圆角方形感）
        var grad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy + r * 0.2, r);
        grad.addColorStop(0, '#aa9977');
        grad.addColorStop(0.6, def.colors[0]);
        grad.addColorStop(1, '#554433');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.8, cy - r * 0.6);
        ctx.lineTo(cx + r * 0.8, cy - r * 0.6);
        ctx.lineTo(cx + r * 0.9, cy + r * 0.7);
        ctx.lineTo(cx - r * 0.9, cy + r * 0.7);
        ctx.closePath();
        ctx.fill();
        // 石纹
        ctx.strokeStyle = 'rgba(40,30,20,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy - r * 0.2); ctx.lineTo(cx - r * 0.1, cy + r * 0.4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.3, cy - r * 0.4); ctx.lineTo(cx + r * 0.5, cy + r * 0.3); ctx.stroke();
        // 角
        ctx.fillStyle = '#443322';
        ctx.beginPath(); ctx.moveTo(cx - r * 0.5, cy - r * 0.55); ctx.lineTo(cx - r * 0.35, cy - r * 0.95); ctx.lineTo(cx - r * 0.2, cy - r * 0.55); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.2, cy - r * 0.55); ctx.lineTo(cx + r * 0.35, cy - r * 0.95); ctx.lineTo(cx + r * 0.5, cy - r * 0.55); ctx.fill();
        // 发光眼
        ctx.fillStyle = '#ff6600';
        ctx.globalAlpha = 0.7 + Math.sin(phase * Math.PI * 2) * 0.2;
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.11, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.11, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
    }

    // ============================================
    // 恶魔术士 - 尖帽+旋转法球
    // ============================================
    _drawDemonCaster(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 身体
        var grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy + r * 0.2, r);
        grad.addColorStop(0, def.colors[1]);
        grad.addColorStop(0.5, def.colors[0]);
        grad.addColorStop(1, '#881144');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.1, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
        // 尖帽
        ctx.fillStyle = '#661133';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 1.3);
        ctx.lineTo(cx - r * 0.4, cy - r * 0.3);
        ctx.lineTo(cx + r * 0.4, cy - r * 0.3);
        ctx.closePath();
        ctx.fill();
        // 帽檐
        ctx.fillStyle = '#881144';
        ctx.beginPath();
        ctx.ellipse(cx, cy - r * 0.3, r * 0.55, r * 0.12, 0, 0, Math.PI * 2);
        ctx.fill();
        // 旋转法球
        var orbAngle = phase * Math.PI * 2;
        var orbX = cx + Math.cos(orbAngle) * r * 0.65;
        var orbY = cy + r * 0.25 + Math.sin(orbAngle) * r * 0.3;
        var orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, r * 0.15);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.5, '#ff66aa');
        orbGrad.addColorStop(1, 'rgba(255,100,170,0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(orbX, orbY, r * 0.15, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#ffdd44';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.05, r * 0.09, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.05, r * 0.09, 0, Math.PI * 2); ctx.fill();
    }

    // ============================================
    // 爆破虫 - 膨胀脉动+裂纹
    // ============================================
    _drawExploder(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var pulse = 1 + Math.sin(phase * Math.PI * 2) * 0.1;
        var pr = r * pulse;
        // 身体
        var grad = ctx.createRadialGradient(cx, cy, pr * 0.1, cx, cy, pr);
        grad.addColorStop(0, '#ffcc44');
        grad.addColorStop(0.4, def.colors[0]);
        grad.addColorStop(1, '#cc4400');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, pr * 0.85, 0, Math.PI * 2);
        ctx.fill();
        // 爆裂纹
        ctx.strokeStyle = '#ffee66';
        ctx.lineWidth = 1.5;
        for (var i = 0; i < 5; i++) {
            var a = (i / 5) * Math.PI * 2 + phase * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * pr * 0.2, cy + Math.sin(a) * pr * 0.2);
            ctx.lineTo(cx + Math.cos(a) * pr * 0.7, cy + Math.sin(a) * pr * 0.7);
            ctx.stroke();
        }
        // 眼睛
        ctx.fillStyle = '#ffff88';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.15, r * 0.05, 0, Math.PI * 2); ctx.fill();
    }

    // ============================================
    // 精英骷髅 - 王冠+火焰眼+大剑
    // ============================================
    _drawEliteSkeleton(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 光环
        ctx.fillStyle = 'rgba(255,68,68,0.12)';
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2); ctx.fill();
        // 身体
        var grad = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.1, cx, cy, r * 0.9);
        grad.addColorStop(0, '#ffeecc');
        grad.addColorStop(0.5, def.colors[0]);
        grad.addColorStop(1, '#881111');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2); ctx.fill();
        // 王冠
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.55, cy - r * 0.4);
        ctx.lineTo(cx - r * 0.3, cy - r * 0.85);
        ctx.lineTo(cx, cy - r * 0.6);
        ctx.lineTo(cx + r * 0.3, cy - r * 0.85);
        ctx.lineTo(cx + r * 0.55, cy - r * 0.4);
        ctx.closePath();
        ctx.fill();
        // 火焰眼
        ctx.fillStyle = '#ff2222';
        ctx.globalAlpha = 0.8 + Math.sin(phase * Math.PI * 2) * 0.2;
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.05, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.05, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        // 剑
        ctx.fillStyle = '#cccccc';
        ctx.strokeStyle = '#999999';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.7, cy - r * 0.2);
        ctx.lineTo(cx + r * 1.2, cy - r * 0.8);
        ctx.lineTo(cx + r * 1.05, cy - r * 0.65);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    // ============================================
    // 暗夜领主 - 紫黑+角+旋转符文
    // ============================================
    _drawEliteDemon(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 暗紫光环
        ctx.fillStyle = 'rgba(170,34,85,0.15)';
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2); ctx.fill();
        // 主体
        var grad = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.1, cx, cy, r);
        grad.addColorStop(0, def.colors[1]);
        grad.addColorStop(0.5, def.colors[0]);
        grad.addColorStop(1, '#661133');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.fill();
        // 角
        ctx.fillStyle = '#441122';
        ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy - r * 0.5); ctx.lineTo(cx - r * 0.55, cy - r * 1.1); ctx.lineTo(cx - r * 0.2, cy - r * 0.55); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.2, cy - r * 0.55); ctx.lineTo(cx + r * 0.55, cy - r * 1.1); ctx.lineTo(cx + r * 0.4, cy - r * 0.5); ctx.fill();
        // 旋转符文
        var runeAngle = phase * Math.PI * 2;
        ctx.strokeStyle = '#ff44aa';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.65, runeAngle, runeAngle + Math.PI * 1.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.65, runeAngle + Math.PI, runeAngle + Math.PI * 2.2); ctx.stroke();
        ctx.globalAlpha = 1;
        // 眼
        ctx.fillStyle = '#ff88cc';
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.12, 0, Math.PI * 2); ctx.fill();
    }

    // ============================================
    // Boss骷髅王 - 火焰光环+王冠+骨齿
    // ============================================
    _drawBoss(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        // 火焰光环
        var flicker = 0.8 + Math.sin(phase * Math.PI * 6) * 0.2;
        ctx.fillStyle = 'rgba(255,68,0,' + (0.12 * flicker) + ')';
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill();
        // 主体
        var grad = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.15, cx, cy, r);
        grad.addColorStop(0, '#ff6644');
        grad.addColorStop(0.4, def.colors[0]);
        grad.addColorStop(1, '#880000');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2); ctx.fill();
        // 骨纹
        ctx.strokeStyle = 'rgba(255,200,150,0.3)';
        ctx.lineWidth = 2;
        for (var i = 0; i < 4; i++) {
            var a = (i / 4) * Math.PI * 2 + phase * 0.5;
            ctx.beginPath(); ctx.arc(cx, cy, r * (0.35 + i * 0.12), a, a + Math.PI * 0.5); ctx.stroke();
        }
        // 王冠
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.45, cy - r * 0.45);
        ctx.lineTo(cx - r * 0.3, cy - r * 0.9);
        ctx.lineTo(cx - r * 0.12, cy - r * 0.65);
        ctx.lineTo(cx, cy - r * 1.0);
        ctx.lineTo(cx + r * 0.12, cy - r * 0.65);
        ctx.lineTo(cx + r * 0.3, cy - r * 0.9);
        ctx.lineTo(cx + r * 0.45, cy - r * 0.45);
        ctx.closePath();
        ctx.fill();
        // 宝石
        ctx.fillStyle = '#ff2222';
        ctx.beginPath(); ctx.arc(cx, cy - r * 0.7, r * 0.07, 0, Math.PI * 2); ctx.fill();
        // 燃烧眼
        ctx.fillStyle = '#ffaa00';
        ctx.globalAlpha = 0.8 + Math.sin(phase * Math.PI * 2) * 0.2;
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.05, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.05, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        // 骨齿
        ctx.fillStyle = '#ffddcc';
        for (var j = 0; j < 5; j++) {
            var tx = cx - r * 0.25 + j * r * 0.12;
            ctx.fillRect(tx, cy + r * 0.2, r * 0.07, r * 0.13);
        }
    }

    // ============================================
    // 通用回退
    // ============================================
    _drawGeneric(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
        grad.addColorStop(0, def.colors[1] || def.color);
        grad.addColorStop(1, def.colors[0] || def.color);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
        ctx.fill();
        // 眼睛
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.15, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.15, 0, Math.PI * 2); ctx.fill();
        this._highlight(ctx, cx, cy, r);
    }
}

// 全局精灵加载器实例
var spriteLoader = null;
