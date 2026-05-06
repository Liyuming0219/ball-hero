// ============================================
// 精灵图系统 V2 - 高精度程序化怪物外形
// ============================================
// 设计原则：
// 1. 所有精灵在游戏加载时一次性生成（offscreen canvas），运行时零开销
// 2. 每种怪物 8 帧动画（idle 呼吸/移动循环），帧率由 bodyBob 驱动
// 3. 大量使用多层渐变、纹理、子像素细节模拟3D质感
// 4. 精灵图尺寸根据怪物 radius 自适应，保持像素密度一致

class SpriteLoader {
    constructor() {
        this.sprites = {};
        this.frameCount = 8;
        this.ready = false;
    }

    generateAll() {
        var types = Object.keys(EnemyTypes);
        for (var i = 0; i < types.length; i++) {
            this._generateType(types[i]);
        }
        this.ready = true;
    }

    getFrame(type, bodyBob) {
        var frames = this.sprites[type];
        if (!frames) return null;
        var norm = ((bodyBob % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        var frameIndex = Math.floor(norm / (Math.PI * 2) * this.frameCount) % this.frameCount;
        return frames[frameIndex];
    }

    getSpriteSize(type) {
        var def = EnemyTypes[type];
        if (!def) return 0;
        return Math.ceil(def.radius * 3.6);
    }

    _generateType(type) {
        var def = EnemyTypes[type];
        if (!def) return;
        var size = this.getSpriteSize(type);
        var frames = [];

        for (var f = 0; f < this.frameCount; f++) {
            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            var ctx = canvas.getContext('2d');
            var phase = f / this.frameCount;
            var cx = size / 2;
            var cy = size / 2;
            var r = def.radius;

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

    // ─── 通用工具方法 ───
    _shadow(ctx, cx, cy, r) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + r * 0.9, r * 0.75, r * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    _rimLight(ctx, cx, cy, r, color, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha || 0.3;
        ctx.strokeStyle = color || '#ffffff';
        ctx.lineWidth = r * 0.06;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.88, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();
        ctx.restore();
    }

    _noise(ctx, cx, cy, r, density, color) {
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = color || '#000000';
        for (var i = 0; i < density; i++) {
            var angle = (i / density) * Math.PI * 2;
            var dist = (0.3 + (i * 7 % 13) / 13 * 0.55) * r;
            var nx = cx + Math.cos(angle) * dist;
            var ny = cy + Math.sin(angle) * dist;
            ctx.fillRect(nx, ny, 1.2, 1.2);
        }
        ctx.restore();
    }

    // ============================================
    // 骷髅 - 完整骨骼头颅 + 肋骨 + 脊椎 + 武器
    // ============================================
    _drawSkeleton(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var breathe = Math.sin(phase * Math.PI * 2) * r * 0.02;

        // 脊椎
        ctx.strokeStyle = '#8a9a7a';
        ctx.lineWidth = r * 0.08;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.1);
        ctx.lineTo(cx, cy + r * 0.65);
        ctx.stroke();
        // 椎骨节
        ctx.fillStyle = '#9aaa8a';
        for (var v = 0; v < 4; v++) {
            var vy = cy + r * 0.05 + v * r * 0.17;
            ctx.beginPath();
            ctx.ellipse(cx, vy, r * 0.07, r * 0.04, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // 肋骨（6对弧形）
        ctx.strokeStyle = '#a0b090';
        ctx.lineWidth = r * 0.04;
        for (var i = 0; i < 6; i++) {
            var ry = cy + r * 0.0 + i * r * 0.1;
            var ribW = r * (0.45 - i * 0.03);
            ctx.beginPath();
            ctx.ellipse(cx, ry + breathe, ribW, r * 0.06, 0, Math.PI * 0.1, Math.PI * 0.9);
            ctx.stroke();
        }

        // 头颅（多层球体感）
        var headCy = cy - r * 0.35 + breathe;
        var headR = r * 0.48;
        // 底色
        var skullGrad = ctx.createRadialGradient(cx - headR * 0.2, headCy - headR * 0.2, headR * 0.1, cx, headCy, headR);
        skullGrad.addColorStop(0, '#e8e8d8');
        skullGrad.addColorStop(0.5, '#c8c8b0');
        skullGrad.addColorStop(0.8, '#98a888');
        skullGrad.addColorStop(1, '#6a7a5a');
        ctx.fillStyle = skullGrad;
        ctx.beginPath();
        ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
        ctx.fill();

        // 颧骨突起
        ctx.fillStyle = 'rgba(200,200,180,0.4)';
        ctx.beginPath();
        ctx.ellipse(cx - headR * 0.5, headCy + headR * 0.1, headR * 0.2, headR * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + headR * 0.5, headCy + headR * 0.1, headR * 0.2, headR * 0.15, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // 眼眶（深凹）
        var eyeGrad1 = ctx.createRadialGradient(cx - headR * 0.32, headCy - headR * 0.05, 0, cx - headR * 0.32, headCy - headR * 0.05, headR * 0.2);
        eyeGrad1.addColorStop(0, '#1a2a1a');
        eyeGrad1.addColorStop(0.7, '#2a3a2a');
        eyeGrad1.addColorStop(1, '#4a5a4a');
        ctx.fillStyle = eyeGrad1;
        ctx.beginPath();
        ctx.ellipse(cx - headR * 0.32, headCy - headR * 0.05, headR * 0.2, headR * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + headR * 0.32, headCy - headR * 0.05, headR * 0.2, headR * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();

        // 红光瞳孔
        var eyeGlow = 0.5 + Math.sin(phase * Math.PI * 2) * 0.4;
        ctx.save();
        ctx.globalAlpha = eyeGlow;
        ctx.shadowColor = '#ff2200';
        ctx.shadowBlur = r * 0.15;
        ctx.fillStyle = '#ff3300';
        ctx.beginPath();
        ctx.arc(cx - headR * 0.32, headCy - headR * 0.05, headR * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + headR * 0.32, headCy - headR * 0.05, headR * 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 鼻腔（倒三角）
        ctx.fillStyle = '#3a4a3a';
        ctx.beginPath();
        ctx.moveTo(cx - headR * 0.08, headCy + headR * 0.15);
        ctx.lineTo(cx + headR * 0.08, headCy + headR * 0.15);
        ctx.lineTo(cx, headCy + headR * 0.3);
        ctx.closePath();
        ctx.fill();

        // 牙齿
        ctx.fillStyle = '#d8d8c0';
        ctx.strokeStyle = '#8a8a6a';
        ctx.lineWidth = 0.5;
        for (var t = 0; t < 6; t++) {
            var tx = cx - headR * 0.3 + t * headR * 0.12;
            ctx.fillRect(tx, headCy + headR * 0.37, headR * 0.09, headR * 0.12);
            ctx.strokeRect(tx, headCy + headR * 0.37, headR * 0.09, headR * 0.12);
        }

        // 颅缝裂纹
        ctx.strokeStyle = 'rgba(60,80,50,0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - headR * 0.05, headCy - headR * 0.9);
        ctx.quadraticCurveTo(cx + headR * 0.1, headCy - headR * 0.5, cx - headR * 0.05, headCy - headR * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + headR * 0.3, headCy - headR * 0.7);
        ctx.quadraticCurveTo(cx + headR * 0.5, headCy - headR * 0.3, cx + headR * 0.35, headCy + headR * 0.1);
        ctx.stroke();

        // 短骨刀（右手）
        ctx.save();
        ctx.translate(cx + r * 0.6, cy + r * 0.2);
        ctx.rotate(-0.4 + Math.sin(phase * Math.PI * 2) * 0.1);
        ctx.fillStyle = '#aabbaa';
        ctx.fillRect(-r * 0.03, -r * 0.5, r * 0.06, r * 0.5);
        ctx.fillStyle = '#887766';
        ctx.fillRect(-r * 0.06, -r * 0.05, r * 0.12, r * 0.12);
        ctx.restore();

        this._rimLight(ctx, cx, headCy, headR, '#ccddbb', 0.2);
    }

    // ============================================
    // 蝙蝠 - 膜翼骨架 + 毛皮纹理 + 尖牙
    // ============================================
    _drawBat(ctx, cx, cy, r, phase, def) {
        var wingAngle = Math.sin(phase * Math.PI * 2) * 0.5;
        var wingSpan = r * 2.0;
        this._shadow(ctx, cx, cy, r);

        // 翅膀骨架 + 膜
        var wingAlpha = 0.85;
        ctx.save();
        ctx.globalAlpha = wingAlpha;
        // 左翼膜
        var wingGrad = ctx.createLinearGradient(cx - wingSpan, cy, cx, cy);
        wingGrad.addColorStop(0, '#1a1020');
        wingGrad.addColorStop(0.5, '#3a2535');
        wingGrad.addColorStop(1, '#5a3a4a');
        ctx.fillStyle = wingGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy - r * 0.1);
        ctx.quadraticCurveTo(cx - wingSpan * 0.5, cy - r * (0.8 + wingAngle), cx - wingSpan * 0.85, cy - r * (0.3 + wingAngle * 0.5));
        ctx.lineTo(cx - wingSpan * 0.7, cy + r * 0.1);
        ctx.lineTo(cx - wingSpan * 0.45, cy + r * 0.3);
        ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.2, cx - r * 0.3, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        // 右翼膜
        var wingGrad2 = ctx.createLinearGradient(cx, cy, cx + wingSpan, cy);
        wingGrad2.addColorStop(0, '#5a3a4a');
        wingGrad2.addColorStop(0.5, '#3a2535');
        wingGrad2.addColorStop(1, '#1a1020');
        ctx.fillStyle = wingGrad2;
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy - r * 0.1);
        ctx.quadraticCurveTo(cx + wingSpan * 0.5, cy - r * (0.8 + wingAngle), cx + wingSpan * 0.85, cy - r * (0.3 + wingAngle * 0.5));
        ctx.lineTo(cx + wingSpan * 0.7, cy + r * 0.1);
        ctx.lineTo(cx + wingSpan * 0.45, cy + r * 0.3);
        ctx.quadraticCurveTo(cx + r * 0.5, cy + r * 0.2, cx + r * 0.3, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 翼骨
        ctx.strokeStyle = '#2a1525';
        ctx.lineWidth = r * 0.05;
        ctx.lineCap = 'round';
        // 左翼骨
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy);
        ctx.lineTo(cx - wingSpan * 0.85, cy - r * (0.3 + wingAngle * 0.5));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy);
        ctx.lineTo(cx - wingSpan * 0.7, cy + r * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy);
        ctx.lineTo(cx - wingSpan * 0.45, cy + r * 0.3);
        ctx.stroke();
        // 右翼骨
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy);
        ctx.lineTo(cx + wingSpan * 0.85, cy - r * (0.3 + wingAngle * 0.5));
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy);
        ctx.lineTo(cx + wingSpan * 0.7, cy + r * 0.1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy);
        ctx.lineTo(cx + wingSpan * 0.45, cy + r * 0.3);
        ctx.stroke();

        // 毛茸茸身体
        var bodyGrad = ctx.createRadialGradient(cx - r * 0.1, cy - r * 0.2, 0, cx, cy, r * 0.7);
        bodyGrad.addColorStop(0, '#5a4555');
        bodyGrad.addColorStop(0.6, '#3a2535');
        bodyGrad.addColorStop(1, '#1a0a15');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 0.55, r * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();

        // 毛皮纹理线
        ctx.strokeStyle = 'rgba(80,50,70,0.5)';
        ctx.lineWidth = 0.7;
        for (var i = 0; i < 12; i++) {
            var fa = (i / 12) * Math.PI * 2;
            var fl = r * (0.3 + (i % 3) * 0.08);
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(fa) * r * 0.2, cy + Math.sin(fa) * r * 0.25);
            ctx.lineTo(cx + Math.cos(fa) * fl, cy + Math.sin(fa) * (fl * 0.9));
            ctx.stroke();
        }

        // 尖耳（大三角）
        ctx.fillStyle = '#3a2030';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.4, cy - r * 0.5);
        ctx.lineTo(cx - r * 0.2, cy - r * 1.0);
        ctx.lineTo(cx - r * 0.05, cy - r * 0.45);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.05, cy - r * 0.45);
        ctx.lineTo(cx + r * 0.2, cy - r * 1.0);
        ctx.lineTo(cx + r * 0.4, cy - r * 0.5);
        ctx.closePath();
        ctx.fill();
        // 耳内粉色
        ctx.fillStyle = 'rgba(180,80,100,0.4)';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.35, cy - r * 0.55);
        ctx.lineTo(cx - r * 0.2, cy - r * 0.85);
        ctx.lineTo(cx - r * 0.1, cy - r * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.1, cy - r * 0.5);
        ctx.lineTo(cx + r * 0.2, cy - r * 0.85);
        ctx.lineTo(cx + r * 0.35, cy - r * 0.55);
        ctx.closePath();
        ctx.fill();

        // 眼睛（发光黄色 + 瞳孔）
        var eyeGlow = 0.7 + Math.sin(phase * Math.PI * 2) * 0.2;
        ctx.save();
        ctx.globalAlpha = eyeGlow;
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = r * 0.12;
        ctx.fillStyle = '#ffdd22';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.2, cy - r * 0.08, r * 0.13, r * 0.09, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.2, cy - r * 0.08, r * 0.13, r * 0.09, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // 瞳孔
        ctx.fillStyle = '#110800';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.2, cy - r * 0.08, r * 0.04, r * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + r * 0.2, cy - r * 0.08, r * 0.04, r * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();

        // 吸血尖牙
        ctx.fillStyle = '#eeeeee';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.12, cy + r * 0.18);
        ctx.lineTo(cx - r * 0.07, cy + r * 0.38);
        ctx.lineTo(cx - r * 0.02, cy + r * 0.18);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.02, cy + r * 0.18);
        ctx.lineTo(cx + r * 0.07, cy + r * 0.38);
        ctx.lineTo(cx + r * 0.12, cy + r * 0.18);
        ctx.closePath();
        ctx.fill();
        // 嘴巴线
        ctx.strokeStyle = '#2a1020';
        ctx.lineWidth = r * 0.03;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.2, cy + r * 0.15);
        ctx.quadraticCurveTo(cx, cy + r * 0.22, cx + r * 0.2, cy + r * 0.15);
        ctx.stroke();
    }

    // ============================================
    // 史莱姆 - 半透明果冻 + 内部气泡 + 反光
    // ============================================
    _drawSlime(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var wobble = Math.sin(phase * Math.PI * 2) * r * 0.08;
        var wobble2 = Math.cos(phase * Math.PI * 2 + 1) * r * 0.05;

        // 身体底层（深色）
        var bodyGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy + r * 0.2, r * 1.2);
        bodyGrad.addColorStop(0, '#aaffcc');
        bodyGrad.addColorStop(0.3, '#44cc66');
        bodyGrad.addColorStop(0.7, '#228844');
        bodyGrad.addColorStop(1, '#115522');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.95, cy + r * 0.35);
        ctx.quadraticCurveTo(cx - r * 1.1, cy - r * 0.3 + wobble, cx - r * 0.45, cy - r * 0.85);
        ctx.quadraticCurveTo(cx - r * 0.1, cy - r * 1.1 - wobble, cx + r * 0.1, cy - r * 1.05 + wobble2);
        ctx.quadraticCurveTo(cx + r * 0.45, cy - r * 0.85, cx + r * 1.1, cy - r * 0.3 - wobble);
        ctx.quadraticCurveTo(cx + r * 0.95, cy + r * 0.6 + wobble, cx + r * 0.5, cy + r * 0.85);
        ctx.quadraticCurveTo(cx + r * 0.1, cy + r * 0.95 + wobble2, cx - r * 0.1, cy + r * 0.92);
        ctx.quadraticCurveTo(cx - r * 0.5, cy + r * 0.88 - wobble2, cx - r * 0.95, cy + r * 0.35);
        ctx.fill();

        // 内部气泡
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#aaffbb';
        var bubbles = [[0.2, 0.3, 0.08], [-0.3, 0.15, 0.06], [0.05, -0.2, 0.05], [-0.15, 0.45, 0.07], [0.3, -0.1, 0.04]];
        for (var b = 0; b < bubbles.length; b++) {
            var bx = cx + bubbles[b][0] * r;
            var by = cy + bubbles[b][1] * r + Math.sin(phase * Math.PI * 2 + b) * r * 0.04;
            ctx.beginPath();
            ctx.arc(bx, by, bubbles[b][2] * r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 表面高光层
        ctx.save();
        ctx.globalAlpha = 0.2;
        var shineGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.4, r * 0.05, cx, cy, r * 0.8);
        shineGrad.addColorStop(0, '#ffffff');
        shineGrad.addColorStop(0.4, 'rgba(255,255,255,0.1)');
        shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = shineGrad;
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.1, cy - r * 0.2, r * 0.7, r * 0.5, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 主高光
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.3, cy - r * 0.5, r * 0.18, r * 0.12, -0.4, 0, Math.PI * 2);
        ctx.fill();
        // 次高光
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.ellipse(cx - r * 0.1, cy - r * 0.35, r * 0.08, r * 0.05, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛（大瞳孔 Q 弹）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.28, cy - r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.28, cy - r * 0.15, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        // 虹膜
        ctx.fillStyle = '#116622';
        ctx.beginPath();
        ctx.arc(cx - r * 0.25, cy - r * 0.12, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.31, cy - r * 0.12, r * 0.13, 0, Math.PI * 2);
        ctx.fill();
        // 瞳孔
        ctx.fillStyle = '#001100';
        ctx.beginPath();
        ctx.arc(cx - r * 0.24, cy - r * 0.11, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.32, cy - r * 0.11, r * 0.07, 0, Math.PI * 2);
        ctx.fill();
        // 眼高光
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.18, r * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + r * 0.26, cy - r * 0.18, r * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // 微笑嘴巴
        ctx.strokeStyle = '#115522';
        ctx.lineWidth = r * 0.04;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.2, r * 0.2, 0.2, Math.PI - 0.2);
        ctx.stroke();
    }

    // ============================================
    // 骷髅法师 - 暗色法袍 + 符文 + 悬浮 + 法杖
    // ============================================
    _drawSkeletonMage(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var floatY = Math.sin(phase * Math.PI * 2) * r * 0.06;

        // 法袍（梯形 + 渐变）
        var robeGrad = ctx.createLinearGradient(cx, cy - r * 0.5, cx, cy + r);
        robeGrad.addColorStop(0, '#4a2266');
        robeGrad.addColorStop(0.5, '#33155a');
        robeGrad.addColorStop(1, '#1a0a33');
        ctx.fillStyle = robeGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.45, cy - r * 0.35 + floatY);
        ctx.lineTo(cx + r * 0.45, cy - r * 0.35 + floatY);
        ctx.lineTo(cx + r * 0.85, cy + r * 0.9 + floatY);
        ctx.quadraticCurveTo(cx, cy + r * 1.0 + floatY, cx - r * 0.85, cy + r * 0.9 + floatY);
        ctx.closePath();
        ctx.fill();

        // 袍边纹理
        ctx.strokeStyle = 'rgba(150,80,200,0.3)';
        ctx.lineWidth = r * 0.03;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.7, cy + r * 0.7 + floatY);
        ctx.lineTo(cx + r * 0.7, cy + r * 0.7 + floatY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy + r * 0.5 + floatY);
        ctx.lineTo(cx + r * 0.6, cy + r * 0.5 + floatY);
        ctx.stroke();

        // 符文（袍子上）
        ctx.save();
        ctx.globalAlpha = 0.35 + Math.sin(phase * Math.PI * 2) * 0.15;
        ctx.strokeStyle = '#aa66ff';
        ctx.lineWidth = r * 0.025;
        // 三角符文
        ctx.beginPath();
        ctx.moveTo(cx, cy + r * 0.1 + floatY);
        ctx.lineTo(cx - r * 0.15, cy + r * 0.35 + floatY);
        ctx.lineTo(cx + r * 0.15, cy + r * 0.35 + floatY);
        ctx.closePath();
        ctx.stroke();
        // 圆形符文
        ctx.beginPath();
        ctx.arc(cx, cy + r * 0.22 + floatY, r * 0.08, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 头颅（枯骨）
        var headCy = cy - r * 0.45 + floatY;
        var headR = r * 0.35;
        var skGrad = ctx.createRadialGradient(cx, headCy, headR * 0.1, cx, headCy, headR);
        skGrad.addColorStop(0, '#ddddc8');
        skGrad.addColorStop(0.6, '#bbbb99');
        skGrad.addColorStop(1, '#888866');
        ctx.fillStyle = skGrad;
        ctx.beginPath();
        ctx.arc(cx, headCy, headR, 0, Math.PI * 2);
        ctx.fill();

        // 兜帽
        var hoodGrad = ctx.createLinearGradient(cx, headCy - headR * 1.2, cx, headCy + headR * 0.5);
        hoodGrad.addColorStop(0, '#2a1144');
        hoodGrad.addColorStop(1, '#4a2266');
        ctx.fillStyle = hoodGrad;
        ctx.beginPath();
        ctx.moveTo(cx, headCy - headR * 1.5);
        ctx.quadraticCurveTo(cx - headR * 1.2, headCy - headR * 0.3, cx - r * 0.5, headCy + headR * 0.4);
        ctx.lineTo(cx + r * 0.5, headCy + headR * 0.4);
        ctx.quadraticCurveTo(cx + headR * 1.2, headCy - headR * 0.3, cx, headCy - headR * 1.5);
        ctx.closePath();
        ctx.fill();

        // 紫色发光眼
        ctx.save();
        ctx.globalAlpha = 0.7 + Math.sin(phase * Math.PI * 2) * 0.3;
        ctx.shadowColor = '#bb44ff';
        ctx.shadowBlur = r * 0.15;
        ctx.fillStyle = '#cc55ff';
        ctx.beginPath();
        ctx.arc(cx - headR * 0.3, headCy + headR * 0.1, headR * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + headR * 0.3, headCy + headR * 0.1, headR * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 法杖
        ctx.strokeStyle = '#554433';
        ctx.lineWidth = r * 0.06;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.65, cy - r * 0.7 + floatY);
        ctx.lineTo(cx - r * 0.55, cy + r * 0.85 + floatY);
        ctx.stroke();
        // 法杖顶部水晶
        var crystalY = cy - r * 0.75 + floatY;
        var cGrad = ctx.createRadialGradient(cx - r * 0.65, crystalY, 0, cx - r * 0.65, crystalY, r * 0.14);
        cGrad.addColorStop(0, '#ffffff');
        cGrad.addColorStop(0.3, '#dd88ff');
        cGrad.addColorStop(1, '#7700aa');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(cx - r * 0.65, crystalY, r * 0.12, 0, Math.PI * 2);
        ctx.fill();
    }

    // ============================================
    // 暗影狼 - 肌肉线条 + 深色毛发 + 利爪 + 獠牙
    // ============================================
    _drawShadowWolf(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var runPhase = Math.sin(phase * Math.PI * 2);

        // 身体（长椭圆 + 多层毛色）
        var bodyGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.15, r * 0.1, cx, cy, r * 1.1);
        bodyGrad.addColorStop(0, '#4a4a5a');
        bodyGrad.addColorStop(0.4, '#2a2a3a');
        bodyGrad.addColorStop(0.8, '#1a1a2a');
        bodyGrad.addColorStop(1, '#0a0a15');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r * 1.1, r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 暗色毛纹
        ctx.strokeStyle = 'rgba(20,20,40,0.4)';
        ctx.lineWidth = r * 0.03;
        for (var i = 0; i < 15; i++) {
            var mx = cx - r * 0.8 + (i / 15) * r * 1.6;
            var my = cy - r * 0.2 + (i % 3) * r * 0.15;
            ctx.beginPath();
            ctx.moveTo(mx, my);
            ctx.lineTo(mx + r * 0.08, my + r * 0.2);
            ctx.stroke();
        }

        // 尾巴（蓬松）
        ctx.save();
        var tailGrad = ctx.createLinearGradient(cx + r * 0.8, cy, cx + r * 1.4, cy - r * 0.6);
        tailGrad.addColorStop(0, '#2a2a3a');
        tailGrad.addColorStop(1, '#1a1a25');
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = r * 0.22;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.85, cy);
        ctx.quadraticCurveTo(cx + r * 1.3, cy - r * 0.2 + runPhase * r * 0.15, cx + r * 1.25, cy - r * 0.55 + runPhase * r * 0.1);
        ctx.stroke();
        ctx.restore();

        // 头部
        var headX = cx - r * 0.7;
        var headY = cy - r * 0.05;
        var headGrad = ctx.createRadialGradient(headX, headY, r * 0.05, headX, headY, r * 0.45);
        headGrad.addColorStop(0, '#3a3a4a');
        headGrad.addColorStop(0.7, '#2a2a3a');
        headGrad.addColorStop(1, '#1a1a25');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.ellipse(headX, headY, r * 0.45, r * 0.35, -0.1, 0, Math.PI * 2);
        ctx.fill();
        // 口吻（前突）
        ctx.fillStyle = '#2a2a35';
        ctx.beginPath();
        ctx.ellipse(headX - r * 0.35, headY + r * 0.08, r * 0.2, r * 0.13, -0.1, 0, Math.PI * 2);
        ctx.fill();

        // 尖耳
        ctx.fillStyle = '#1a1a25';
        ctx.beginPath();
        ctx.moveTo(headX - r * 0.15, headY - r * 0.3);
        ctx.lineTo(headX - r * 0.25, headY - r * 0.7);
        ctx.lineTo(headX + r * 0.0, headY - r * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(headX + r * 0.1, headY - r * 0.3);
        ctx.lineTo(headX + r * 0.15, headY - r * 0.65);
        ctx.lineTo(headX + r * 0.3, headY - r * 0.25);
        ctx.closePath();
        ctx.fill();

        // 眼睛（凶狠黄色）
        ctx.save();
        ctx.shadowColor = '#ffdd00';
        ctx.shadowBlur = r * 0.1;
        ctx.fillStyle = '#ffee22';
        ctx.beginPath();
        ctx.ellipse(headX - r * 0.15, headY - r * 0.08, r * 0.1, r * 0.06, -0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(headX + r * 0.1, headY - r * 0.08, r * 0.1, r * 0.06, 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // 瞳孔（竖瞳）
        ctx.fillStyle = '#110800';
        ctx.beginPath();
        ctx.ellipse(headX - r * 0.15, headY - r * 0.08, r * 0.03, r * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(headX + r * 0.1, headY - r * 0.08, r * 0.03, r * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();

        // 獠牙
        ctx.fillStyle = '#dddddd';
        ctx.beginPath();
        ctx.moveTo(headX - r * 0.4, headY + r * 0.12);
        ctx.lineTo(headX - r * 0.37, headY + r * 0.28);
        ctx.lineTo(headX - r * 0.34, headY + r * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(headX - r * 0.28, headY + r * 0.14);
        ctx.lineTo(headX - r * 0.25, headY + r * 0.26);
        ctx.lineTo(headX - r * 0.22, headY + r * 0.14);
        ctx.closePath();
        ctx.fill();

        // 四肢（带关节）
        ctx.strokeStyle = '#1a1a25';
        ctx.lineWidth = r * 0.09;
        ctx.lineCap = 'round';
        var legOff = runPhase * r * 0.1;
        // 前左
        ctx.beginPath(); ctx.moveTo(cx - r * 0.4, cy + r * 0.45); ctx.lineTo(cx - r * 0.45, cy + r * 0.7 + legOff); ctx.lineTo(cx - r * 0.42, cy + r * 0.85 + legOff); ctx.stroke();
        // 前右
        ctx.beginPath(); ctx.moveTo(cx - r * 0.15, cy + r * 0.45); ctx.lineTo(cx - r * 0.1, cy + r * 0.7 - legOff); ctx.lineTo(cx - r * 0.12, cy + r * 0.85 - legOff); ctx.stroke();
        // 后左
        ctx.beginPath(); ctx.moveTo(cx + r * 0.3, cy + r * 0.45); ctx.lineTo(cx + r * 0.25, cy + r * 0.7 - legOff); ctx.lineTo(cx + r * 0.27, cy + r * 0.85 - legOff); ctx.stroke();
        // 后右
        ctx.beginPath(); ctx.moveTo(cx + r * 0.55, cy + r * 0.45); ctx.lineTo(cx + r * 0.6, cy + r * 0.7 + legOff); ctx.lineTo(cx + r * 0.57, cy + r * 0.85 + legOff); ctx.stroke();

        // 利爪
        ctx.fillStyle = '#aaaaaa';
        ctx.beginPath(); ctx.arc(cx - r * 0.42, cy + r * 0.87 + legOff, r * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx - r * 0.12, cy + r * 0.87 - legOff, r * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.27, cy + r * 0.87 - legOff, r * 0.04, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.57, cy + r * 0.87 + legOff, r * 0.04, 0, Math.PI * 2); ctx.fill();
    }

    // ============================================
    // 石像鬼 - 厚重石质 + 裂痕纹理 + 苔藓
    // ============================================
    _drawGargoyle(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var wingFlap = Math.sin(phase * Math.PI * 2) * 0.12;

        // 石翅
        ctx.save();
        var wGrad = ctx.createLinearGradient(cx - r * 1.3, cy, cx, cy);
        wGrad.addColorStop(0, '#5a4a3a');
        wGrad.addColorStop(1, '#7a6a55');
        ctx.fillStyle = wGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy - r * 0.15);
        ctx.quadraticCurveTo(cx - r * 1.0, cy - r * 0.8 - wingFlap * r, cx - r * 1.3, cy - r * 0.3);
        ctx.lineTo(cx - r * 1.15, cy + r * 0.1);
        ctx.lineTo(cx - r * 0.8, cy + r * 0.3);
        ctx.quadraticCurveTo(cx - r * 0.6, cy + r * 0.2, cx - r * 0.45, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.5, cy - r * 0.15);
        ctx.quadraticCurveTo(cx + r * 1.0, cy - r * 0.8 + wingFlap * r, cx + r * 1.3, cy - r * 0.3);
        ctx.lineTo(cx + r * 1.15, cy + r * 0.1);
        ctx.lineTo(cx + r * 0.8, cy + r * 0.3);
        ctx.quadraticCurveTo(cx + r * 0.6, cy + r * 0.2, cx + r * 0.45, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 主体（石块质感）
        var stoneGrad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.3, r * 0.1, cx, cy + r * 0.1, r);
        stoneGrad.addColorStop(0, '#b09a80');
        stoneGrad.addColorStop(0.3, '#8a7a65');
        stoneGrad.addColorStop(0.7, '#6a5a45');
        stoneGrad.addColorStop(1, '#4a3a28');
        ctx.fillStyle = stoneGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.75, cy - r * 0.55);
        ctx.lineTo(cx - r * 0.6, cy - r * 0.7);
        ctx.lineTo(cx + r * 0.6, cy - r * 0.7);
        ctx.lineTo(cx + r * 0.75, cy - r * 0.55);
        ctx.lineTo(cx + r * 0.85, cy + r * 0.6);
        ctx.quadraticCurveTo(cx, cy + r * 0.8, cx - r * 0.85, cy + r * 0.6);
        ctx.closePath();
        ctx.fill();

        // 石纹裂痕
        ctx.strokeStyle = 'rgba(30,20,10,0.4)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.3, cy - r * 0.5);
        ctx.quadraticCurveTo(cx - r * 0.1, cy - r * 0.1, cx - r * 0.35, cy + r * 0.3);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.2, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.35, cy + r * 0.1);
        ctx.lineTo(cx + r * 0.2, cy + r * 0.45);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy + r * 0.2);
        ctx.lineTo(cx - r * 0.2, cy + r * 0.15);
        ctx.stroke();

        // 苔藓斑点
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#4a7a3a';
        ctx.beginPath(); ctx.arc(cx - r * 0.4, cy + r * 0.4, r * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.5, cy + r * 0.3, r * 0.06, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.1, cy + r * 0.55, r * 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 角（弯曲 + 环纹）
        ctx.fillStyle = '#3a2a1a';
        // 左角
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.45, cy - r * 0.6);
        ctx.quadraticCurveTo(cx - r * 0.7, cy - r * 1.0, cx - r * 0.55, cy - r * 1.15);
        ctx.quadraticCurveTo(cx - r * 0.35, cy - r * 1.0, cx - r * 0.3, cy - r * 0.6);
        ctx.closePath();
        ctx.fill();
        // 右角
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.3, cy - r * 0.6);
        ctx.quadraticCurveTo(cx + r * 0.35, cy - r * 1.0, cx + r * 0.55, cy - r * 1.15);
        ctx.quadraticCurveTo(cx + r * 0.7, cy - r * 1.0, cx + r * 0.45, cy - r * 0.6);
        ctx.closePath();
        ctx.fill();
        // 角纹
        ctx.strokeStyle = 'rgba(80,60,40,0.5)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(cx - r * 0.52, cy - r * 0.8); ctx.lineTo(cx - r * 0.35, cy - r * 0.78); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.56, cy - r * 0.9); ctx.lineTo(cx - r * 0.38, cy - r * 0.88); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.38, cy - r * 0.88); ctx.lineTo(cx + r * 0.56, cy - r * 0.9); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.35, cy - r * 0.78); ctx.lineTo(cx + r * 0.52, cy - r * 0.8); ctx.stroke();

        // 发光眼
        ctx.save();
        ctx.globalAlpha = 0.7 + Math.sin(phase * Math.PI * 2) * 0.25;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = r * 0.12;
        ctx.fillStyle = '#ff7700';
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 嘴（石刻感）
        ctx.strokeStyle = '#2a1a0a';
        ctx.lineWidth = r * 0.04;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.25, cy + r * 0.15);
        ctx.lineTo(cx - r * 0.15, cy + r * 0.22);
        ctx.lineTo(cx + r * 0.15, cy + r * 0.22);
        ctx.lineTo(cx + r * 0.25, cy + r * 0.15);
        ctx.stroke();
    }

    // ============================================
    // 恶魔术士 - 暗红袍 + 恶魔角 + 多法球环绕
    // ============================================
    _drawDemonCaster(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);

        // 暗红法袍
        var robeGrad = ctx.createLinearGradient(cx, cy - r * 0.5, cx, cy + r);
        robeGrad.addColorStop(0, '#6a1133');
        robeGrad.addColorStop(0.5, '#4a0a22');
        robeGrad.addColorStop(1, '#2a0511');
        ctx.fillStyle = robeGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r * 0.7);
        ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.4, cx - r * 0.8, cy + r * 0.85);
        ctx.quadraticCurveTo(cx, cy + r * 0.95, cx + r * 0.8, cy + r * 0.85);
        ctx.quadraticCurveTo(cx + r * 0.55, cy - r * 0.4, cx, cy - r * 0.7);
        ctx.closePath();
        ctx.fill();

        // 袍子细节纹
        ctx.strokeStyle = 'rgba(200,50,80,0.2)';
        ctx.lineWidth = r * 0.02;
        for (var i = 0; i < 5; i++) {
            var ly = cy + r * 0.1 + i * r * 0.15;
            ctx.beginPath();
            ctx.moveTo(cx - r * 0.4 - i * r * 0.06, ly);
            ctx.quadraticCurveTo(cx, ly + r * 0.03, cx + r * 0.4 + i * r * 0.06, ly);
            ctx.stroke();
        }

        // 头部
        var headGrad = ctx.createRadialGradient(cx, cy - r * 0.45, r * 0.05, cx, cy - r * 0.4, r * 0.35);
        headGrad.addColorStop(0, '#cc5555');
        headGrad.addColorStop(0.6, '#881133');
        headGrad.addColorStop(1, '#550a1a');
        ctx.fillStyle = headGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - r * 0.4, r * 0.32, 0, Math.PI * 2);
        ctx.fill();

        // 恶魔角
        ctx.fillStyle = '#331111';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.25, cy - r * 0.6);
        ctx.quadraticCurveTo(cx - r * 0.4, cy - r * 1.0, cx - r * 0.5, cy - r * 1.1);
        ctx.quadraticCurveTo(cx - r * 0.35, cy - r * 0.8, cx - r * 0.15, cy - r * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.15, cy - r * 0.6);
        ctx.quadraticCurveTo(cx + r * 0.35, cy - r * 0.8, cx + r * 0.5, cy - r * 1.1);
        ctx.quadraticCurveTo(cx + r * 0.4, cy - r * 1.0, cx + r * 0.25, cy - r * 0.6);
        ctx.closePath();
        ctx.fill();

        // 发光眼
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = r * 0.1;
        ctx.fillStyle = '#ffcc33';
        ctx.beginPath(); ctx.arc(cx - r * 0.12, cy - r * 0.42, r * 0.07, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.12, cy - r * 0.42, r * 0.07, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 3个环绕法球
        ctx.save();
        for (var orb = 0; orb < 3; orb++) {
            var orbAngle = phase * Math.PI * 2 + orb * (Math.PI * 2 / 3);
            var orbX = cx + Math.cos(orbAngle) * r * 0.7;
            var orbY = cy + r * 0.15 + Math.sin(orbAngle) * r * 0.35;
            var orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, r * 0.12);
            orbGrad.addColorStop(0, '#ffffff');
            orbGrad.addColorStop(0.3, '#ff88aa');
            orbGrad.addColorStop(1, 'rgba(255,50,100,0)');
            ctx.fillStyle = orbGrad;
            ctx.beginPath();
            ctx.arc(orbX, orbY, r * 0.12, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // ============================================
    // 爆破虫 - 膨胀甲虫 + 裂纹发光 + 不稳定粒子
    // ============================================
    _drawExploder(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var pulse = 1 + Math.sin(phase * Math.PI * 2) * 0.12;
        var pr = r * pulse;

        // 外壳
        var shellGrad = ctx.createRadialGradient(cx - pr * 0.2, cy - pr * 0.2, pr * 0.1, cx, cy, pr);
        shellGrad.addColorStop(0, '#ffaa44');
        shellGrad.addColorStop(0.3, '#cc5522');
        shellGrad.addColorStop(0.7, '#883311');
        shellGrad.addColorStop(1, '#551a08');
        ctx.fillStyle = shellGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, pr * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // 甲壳分节线
        ctx.strokeStyle = 'rgba(40,15,5,0.5)';
        ctx.lineWidth = r * 0.03;
        ctx.beginPath(); ctx.moveTo(cx, cy - pr * 0.8); ctx.lineTo(cx, cy + pr * 0.8); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy, pr * 0.5, pr * 0.82, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 能量裂纹（发光）
        ctx.save();
        ctx.globalAlpha = 0.6 + Math.sin(phase * Math.PI * 4) * 0.3;
        ctx.shadowColor = '#ffee44';
        ctx.shadowBlur = r * 0.15;
        ctx.strokeStyle = '#ffee66';
        ctx.lineWidth = r * 0.04;
        for (var i = 0; i < 6; i++) {
            var a = (i / 6) * Math.PI * 2 + phase * Math.PI;
            var midA = a + (Math.PI / 12) * ((i % 2) * 2 - 1);
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(a) * pr * 0.15, cy + Math.sin(a) * pr * 0.15);
            ctx.quadraticCurveTo(
                cx + Math.cos(midA) * pr * 0.45,
                cy + Math.sin(midA) * pr * 0.45,
                cx + Math.cos(a) * pr * 0.75,
                cy + Math.sin(a) * pr * 0.75
            );
            ctx.stroke();
        }
        ctx.restore();

        // 不稳定小火花
        ctx.save();
        ctx.fillStyle = '#ffff88';
        ctx.globalAlpha = 0.5;
        for (var s = 0; s < 5; s++) {
            var sa = (s / 5) * Math.PI * 2 + phase * Math.PI * 3;
            var sd = pr * (0.85 + Math.sin(sa * 2 + s) * 0.1);
            ctx.beginPath();
            ctx.arc(cx + Math.cos(sa) * sd, cy + Math.sin(sa) * sd, r * 0.04, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 小眼睛（警觉）
        ctx.fillStyle = '#ffff88';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.15, r * 0.12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#220000';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.15, r * 0.05, 0, Math.PI * 2); ctx.fill();

        // 短腿（甲虫）
        ctx.strokeStyle = '#663311';
        ctx.lineWidth = r * 0.05;
        ctx.lineCap = 'round';
        var legP = Math.sin(phase * Math.PI * 2) * r * 0.05;
        ctx.beginPath(); ctx.moveTo(cx - r * 0.5, cy + r * 0.4); ctx.lineTo(cx - r * 0.65, cy + r * 0.7 + legP); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.5, cy + r * 0.4); ctx.lineTo(cx + r * 0.65, cy + r * 0.7 - legP); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.6, cy + r * 0.15); ctx.lineTo(cx - r * 0.8, cy + r * 0.35 - legP); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy + r * 0.15); ctx.lineTo(cx + r * 0.8, cy + r * 0.35 + legP); ctx.stroke();
    }

    // ============================================
    // 精英骷髅 - 铠甲 + 火焰王冠 + 巨剑
    // ============================================
    _drawEliteSkeleton(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);

        // 暗红光环
        ctx.save();
        ctx.globalAlpha = 0.15 + Math.sin(phase * Math.PI * 2) * 0.05;
        var auraGrad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.15);
        auraGrad.addColorStop(0, 'rgba(255,50,50,0.3)');
        auraGrad.addColorStop(1, 'rgba(255,50,50,0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 铠甲身体
        var armorGrad = ctx.createRadialGradient(cx - r * 0.1, cy - r * 0.2, r * 0.1, cx, cy, r * 0.85);
        armorGrad.addColorStop(0, '#ccbbaa');
        armorGrad.addColorStop(0.3, '#8a6655');
        armorGrad.addColorStop(0.6, '#664433');
        armorGrad.addColorStop(1, '#442211');
        ctx.fillStyle = armorGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.55, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.55, cy - r * 0.4);
        ctx.lineTo(cx + r * 0.7, cy + r * 0.7);
        ctx.lineTo(cx - r * 0.7, cy + r * 0.7);
        ctx.closePath();
        ctx.fill();

        // 铠甲纹路
        ctx.strokeStyle = 'rgba(200,160,100,0.3)';
        ctx.lineWidth = r * 0.02;
        ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.35); ctx.lineTo(cx, cy + r * 0.65); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.5, cy); ctx.lineTo(cx + r * 0.5, cy); ctx.stroke();
        // 肩甲
        ctx.fillStyle = '#776655';
        ctx.beginPath(); ctx.ellipse(cx - r * 0.55, cy - r * 0.3, r * 0.2, r * 0.12, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + r * 0.55, cy - r * 0.3, r * 0.2, r * 0.12, 0.3, 0, Math.PI * 2); ctx.fill();

        // 头颅
        var headCy = cy - r * 0.55;
        var headR = r * 0.3;
        var skullGrad = ctx.createRadialGradient(cx, headCy, headR * 0.1, cx, headCy, headR);
        skullGrad.addColorStop(0, '#eeddcc');
        skullGrad.addColorStop(0.6, '#ccaa88');
        skullGrad.addColorStop(1, '#886644');
        ctx.fillStyle = skullGrad;
        ctx.beginPath(); ctx.arc(cx, headCy, headR, 0, Math.PI * 2); ctx.fill();

        // 火焰王冠
        ctx.save();
        var flamePhase = phase * Math.PI * 2;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.4, headCy - headR * 0.3);
        ctx.lineTo(cx - r * 0.25, headCy - headR * 1.5 - Math.sin(flamePhase) * r * 0.05);
        ctx.lineTo(cx - r * 0.1, headCy - headR * 1.0);
        ctx.lineTo(cx, headCy - headR * 1.7 + Math.sin(flamePhase + 1) * r * 0.05);
        ctx.lineTo(cx + r * 0.1, headCy - headR * 1.0);
        ctx.lineTo(cx + r * 0.25, headCy - headR * 1.5 - Math.sin(flamePhase + 2) * r * 0.05);
        ctx.lineTo(cx + r * 0.4, headCy - headR * 0.3);
        ctx.closePath();
        ctx.fill();
        // 王冠宝石
        ctx.fillStyle = '#ff2222';
        ctx.beginPath(); ctx.arc(cx, headCy - headR * 0.6, r * 0.06, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 火焰眼
        ctx.save();
        ctx.globalAlpha = 0.8 + Math.sin(phase * Math.PI * 2) * 0.2;
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = r * 0.12;
        ctx.fillStyle = '#ff3300';
        ctx.beginPath(); ctx.arc(cx - headR * 0.4, headCy + headR * 0.1, headR * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + headR * 0.4, headCy + headR * 0.1, headR * 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 巨剑
        ctx.save();
        ctx.translate(cx + r * 0.7, cy - r * 0.1);
        ctx.rotate(-0.5 + Math.sin(phase * Math.PI * 2) * 0.08);
        // 剑身
        var swordGrad = ctx.createLinearGradient(0, -r * 0.9, r * 0.08, 0);
        swordGrad.addColorStop(0, '#dddddd');
        swordGrad.addColorStop(0.5, '#aaaaaa');
        swordGrad.addColorStop(1, '#777777');
        ctx.fillStyle = swordGrad;
        ctx.beginPath();
        ctx.moveTo(-r * 0.04, 0);
        ctx.lineTo(0, -r * 0.95);
        ctx.lineTo(r * 0.04, 0);
        ctx.closePath();
        ctx.fill();
        // 剑刃发光
        ctx.strokeStyle = 'rgba(255,200,150,0.4)';
        ctx.lineWidth = r * 0.02;
        ctx.beginPath(); ctx.moveTo(0, -r * 0.9); ctx.lineTo(0, r * 0.0); ctx.stroke();
        // 护手
        ctx.fillStyle = '#aa8833';
        ctx.fillRect(-r * 0.1, -r * 0.02, r * 0.2, r * 0.06);
        // 手柄
        ctx.fillStyle = '#553322';
        ctx.fillRect(-r * 0.025, 0, r * 0.05, r * 0.15);
        ctx.restore();
    }

    // ============================================
    // 暗夜领主（精英恶魔）- 翅膀 + 符文铠甲 + 暗能量
    // ============================================
    _drawEliteDemon(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);

        // 暗紫光环
        ctx.save();
        ctx.globalAlpha = 0.12;
        var auraGrad = ctx.createRadialGradient(cx, cy, r * 0.6, cx, cy, r * 1.2);
        auraGrad.addColorStop(0, 'rgba(170,34,100,0.4)');
        auraGrad.addColorStop(1, 'rgba(100,20,60,0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 恶魔翅膀
        var wf = Math.sin(phase * Math.PI * 2) * 0.1;
        ctx.fillStyle = '#2a0a1a';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.4, cy - r * 0.2);
        ctx.quadraticCurveTo(cx - r * 1.0, cy - r * 0.8 - wf * r, cx - r * 1.2, cy - r * 0.2);
        ctx.quadraticCurveTo(cx - r * 0.9, cy + r * 0.2, cx - r * 0.4, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.4, cy - r * 0.2);
        ctx.quadraticCurveTo(cx + r * 1.0, cy - r * 0.8 + wf * r, cx + r * 1.2, cy - r * 0.2);
        ctx.quadraticCurveTo(cx + r * 0.9, cy + r * 0.2, cx + r * 0.4, cy + r * 0.1);
        ctx.closePath();
        ctx.fill();

        // 主体铠甲
        var bodyGrad = ctx.createRadialGradient(cx, cy - r * 0.1, r * 0.1, cx, cy, r * 0.85);
        bodyGrad.addColorStop(0, '#993366');
        bodyGrad.addColorStop(0.4, '#661144');
        bodyGrad.addColorStop(0.8, '#440a2a');
        bodyGrad.addColorStop(1, '#220515');
        ctx.fillStyle = bodyGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.fill();

        // 铠甲刻纹
        ctx.strokeStyle = 'rgba(255,100,180,0.25)';
        ctx.lineWidth = r * 0.02;
        ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.7); ctx.lineTo(cx, cy + r * 0.7); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(cx, cy, r * 0.45, r * 0.45, 0, 0, Math.PI * 2); ctx.stroke();

        // 弯角
        ctx.fillStyle = '#330a15';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.35, cy - r * 0.55);
        ctx.quadraticCurveTo(cx - r * 0.6, cy - r * 0.9, cx - r * 0.7, cy - r * 1.05);
        ctx.quadraticCurveTo(cx - r * 0.55, cy - r * 0.7, cx - r * 0.25, cy - r * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + r * 0.25, cy - r * 0.55);
        ctx.quadraticCurveTo(cx + r * 0.55, cy - r * 0.7, cx + r * 0.7, cy - r * 1.05);
        ctx.quadraticCurveTo(cx + r * 0.6, cy - r * 0.9, cx + r * 0.35, cy - r * 0.55);
        ctx.closePath();
        ctx.fill();

        // 旋转符文环
        ctx.save();
        var runeAngle = phase * Math.PI * 2;
        ctx.globalAlpha = 0.5 + Math.sin(phase * Math.PI * 4) * 0.2;
        ctx.strokeStyle = '#ff55aa';
        ctx.lineWidth = r * 0.03;
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, runeAngle, runeAngle + Math.PI * 0.8); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, runeAngle + Math.PI, runeAngle + Math.PI * 1.8); ctx.stroke();
        // 符文符号
        ctx.fillStyle = '#ff55aa';
        for (var rn = 0; rn < 4; rn++) {
            var ra = runeAngle + rn * (Math.PI / 2);
            ctx.beginPath();
            ctx.arc(cx + Math.cos(ra) * r * 0.6, cy + Math.sin(ra) * r * 0.6, r * 0.04, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // 发光眼
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.shadowColor = '#ff88dd';
        ctx.shadowBlur = r * 0.12;
        ctx.fillStyle = '#ff88cc';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, cy - r * 0.15, r * 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, cy - r * 0.15, r * 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    // ============================================
    // Boss骷髅王 - 完整铠甲 + 火焰披风 + 巨型王冠
    // ============================================
    _drawBoss(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);

        // 火焰光环（多层）
        var flicker = 0.7 + Math.sin(phase * Math.PI * 6) * 0.3;
        ctx.save();
        ctx.globalAlpha = 0.1 * flicker;
        var fireGrad = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 1.3);
        fireGrad.addColorStop(0, 'rgba(255,100,0,0.5)');
        fireGrad.addColorStop(0.5, 'rgba(255,50,0,0.2)');
        fireGrad.addColorStop(1, 'rgba(255,30,0,0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath(); ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 火焰披风（背后）
        ctx.save();
        ctx.globalAlpha = 0.5;
        var capeGrad = ctx.createLinearGradient(cx, cy - r * 0.3, cx, cy + r);
        capeGrad.addColorStop(0, '#ff4400');
        capeGrad.addColorStop(0.5, '#cc2200');
        capeGrad.addColorStop(1, 'rgba(100,10,0,0)');
        ctx.fillStyle = capeGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.5, cy - r * 0.3);
        ctx.quadraticCurveTo(cx - r * 0.7, cy + r * 0.5, cx - r * 0.55 + Math.sin(phase * Math.PI * 2) * r * 0.05, cy + r * 0.95);
        ctx.lineTo(cx + r * 0.55 - Math.sin(phase * Math.PI * 2) * r * 0.05, cy + r * 0.95);
        ctx.quadraticCurveTo(cx + r * 0.7, cy + r * 0.5, cx + r * 0.5, cy - r * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 重甲身体
        var armorGrad = ctx.createRadialGradient(cx - r * 0.1, cy - r * 0.15, r * 0.1, cx, cy + r * 0.1, r * 0.85);
        armorGrad.addColorStop(0, '#aa4422');
        armorGrad.addColorStop(0.3, '#882211');
        armorGrad.addColorStop(0.6, '#661100');
        armorGrad.addColorStop(1, '#440800');
        ctx.fillStyle = armorGrad;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.6, cy - r * 0.45);
        ctx.lineTo(cx + r * 0.6, cy - r * 0.45);
        ctx.lineTo(cx + r * 0.75, cy + r * 0.7);
        ctx.quadraticCurveTo(cx, cy + r * 0.85, cx - r * 0.75, cy + r * 0.7);
        ctx.closePath();
        ctx.fill();

        // 铠甲装饰
        ctx.strokeStyle = 'rgba(255,180,80,0.3)';
        ctx.lineWidth = r * 0.025;
        ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.4); ctx.lineTo(cx, cy + r * 0.7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r * 0.55, cy - r * 0.1); ctx.lineTo(cx + r * 0.55, cy - r * 0.1); ctx.stroke();
        // 胸甲宝石
        var gemGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.1);
        gemGrad.addColorStop(0, '#ffffff');
        gemGrad.addColorStop(0.4, '#ff4444');
        gemGrad.addColorStop(1, '#880000');
        ctx.fillStyle = gemGrad;
        ctx.beginPath(); ctx.arc(cx, cy - r * 0.05, r * 0.09, 0, Math.PI * 2); ctx.fill();

        // 肩甲（大型）
        var spGrad = ctx.createRadialGradient(cx - r * 0.55, cy - r * 0.35, 0, cx - r * 0.55, cy - r * 0.35, r * 0.22);
        spGrad.addColorStop(0, '#bb7744');
        spGrad.addColorStop(1, '#553311');
        ctx.fillStyle = spGrad;
        ctx.beginPath(); ctx.ellipse(cx - r * 0.6, cy - r * 0.35, r * 0.22, r * 0.16, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(cx + r * 0.6, cy - r * 0.35, r * 0.22, r * 0.16, 0.3, 0, Math.PI * 2); ctx.fill();
        // 肩甲尖刺
        ctx.fillStyle = '#443322';
        ctx.beginPath(); ctx.moveTo(cx - r * 0.7, cy - r * 0.4); ctx.lineTo(cx - r * 0.75, cy - r * 0.65); ctx.lineTo(cx - r * 0.6, cy - r * 0.42); ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx + r * 0.6, cy - r * 0.42); ctx.lineTo(cx + r * 0.75, cy - r * 0.65); ctx.lineTo(cx + r * 0.7, cy - r * 0.4); ctx.fill();

        // 头颅
        var headCy = cy - r * 0.55;
        var headR = r * 0.3;
        var skGrad = ctx.createRadialGradient(cx, headCy, headR * 0.1, cx, headCy, headR);
        skGrad.addColorStop(0, '#ffeecc');
        skGrad.addColorStop(0.5, '#ddbb88');
        skGrad.addColorStop(1, '#996633');
        ctx.fillStyle = skGrad;
        ctx.beginPath(); ctx.arc(cx, headCy, headR, 0, Math.PI * 2); ctx.fill();

        // 巨型火焰王冠
        ctx.save();
        var fp = phase * Math.PI * 2;
        // 王冠底座
        ctx.fillStyle = '#cc8800';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.45, headCy - headR * 0.2);
        ctx.lineTo(cx + r * 0.45, headCy - headR * 0.2);
        ctx.lineTo(cx + r * 0.4, headCy - headR * 0.5);
        ctx.lineTo(cx - r * 0.4, headCy - headR * 0.5);
        ctx.closePath();
        ctx.fill();
        // 火焰王冠尖
        ctx.fillStyle = '#ffbb00';
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.4, headCy - headR * 0.5);
        ctx.lineTo(cx - r * 0.3, headCy - headR * 2.0 - Math.sin(fp) * r * 0.03);
        ctx.lineTo(cx - r * 0.15, headCy - headR * 1.3);
        ctx.lineTo(cx, headCy - headR * 2.2 + Math.sin(fp + 1) * r * 0.04);
        ctx.lineTo(cx + r * 0.15, headCy - headR * 1.3);
        ctx.lineTo(cx + r * 0.3, headCy - headR * 2.0 - Math.sin(fp + 2) * r * 0.03);
        ctx.lineTo(cx + r * 0.4, headCy - headR * 0.5);
        ctx.closePath();
        ctx.fill();
        // 王冠宝石
        ctx.fillStyle = '#ff0000';
        ctx.beginPath(); ctx.arc(cx, headCy - headR * 0.35, r * 0.05, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0044ff';
        ctx.beginPath(); ctx.arc(cx - r * 0.2, headCy - headR * 0.35, r * 0.035, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.2, headCy - headR * 0.35, r * 0.035, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 燃烧眼
        ctx.save();
        ctx.globalAlpha = 0.85 + Math.sin(phase * Math.PI * 2) * 0.15;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = r * 0.2;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.arc(cx - headR * 0.5, headCy + headR * 0.15, headR * 0.22, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + headR * 0.5, headCy + headR * 0.15, headR * 0.22, 0, Math.PI * 2); ctx.fill();
        // 内核
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(cx - headR * 0.5, headCy + headR * 0.15, headR * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + headR * 0.5, headCy + headR * 0.15, headR * 0.08, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // 下颚骨齿
        ctx.fillStyle = '#eeddbb';
        for (var j = 0; j < 7; j++) {
            var tx = cx - headR * 0.55 + j * headR * 0.18;
            ctx.beginPath();
            ctx.moveTo(tx, headCy + headR * 0.6);
            ctx.lineTo(tx + headR * 0.05, headCy + headR * 0.85);
            ctx.lineTo(tx + headR * 0.1, headCy + headR * 0.6);
            ctx.closePath();
            ctx.fill();
        }

        // 骨纹（环绕铠甲）
        ctx.strokeStyle = 'rgba(255,150,80,0.2)';
        ctx.lineWidth = r * 0.02;
        for (var k = 0; k < 3; k++) {
            var ba = phase * 0.5 + k * (Math.PI * 2 / 3);
            ctx.beginPath();
            ctx.arc(cx, cy + r * 0.1, r * (0.35 + k * 0.13), ba, ba + Math.PI * 0.6);
            ctx.stroke();
        }
    }

    // ============================================
    // 通用回退
    // ============================================
    _drawGeneric(ctx, cx, cy, r, phase, def) {
        this._shadow(ctx, cx, cy, r);
        var grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r);
        grad.addColorStop(0, def.colors[1] || def.color);
        grad.addColorStop(0.6, def.colors[0] || def.color);
        grad.addColorStop(1, '#111111');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
        ctx.fill();

        // 表面纹理
        this._noise(ctx, cx, cy, r, 20, def.colors[0]);

        // 眼睛
        ctx.save();
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = r * 0.1;
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // 瞳孔
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(cx - r * 0.25, cy - r * 0.1, r * 0.06, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + r * 0.25, cy - r * 0.1, r * 0.06, 0, Math.PI * 2); ctx.fill();

        this._rimLight(ctx, cx, cy, r, '#ffffff', 0.15);
    }
}

// 全局精灵加载器实例
var spriteLoader = null;
