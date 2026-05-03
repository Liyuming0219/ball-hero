// ============================================
// 粒子特效系统 - 华丽炫酷的核心
// ============================================

class ParticleSystem {
    constructor(isMobile) {
        this.isMobile = !!isMobile;
        this.particles = [];
        this.textParticles = [];
        this.flashEffects = [];
        this.trailEffects = [];
        this.shockwaves = [];
        this.lightnings = [];

        // 性能上限 —— 移动端大幅削减
        if (this.isMobile) {
            this.MAX_PARTICLES = 100;
            this.MAX_TEXT = 20;
            this.MAX_TRAIL = 30;
            this.MAX_SHOCKWAVES = 6;
            this.MAX_FLASH = 6;
            this.MAX_LIGHTNING = 3;
        } else {
            this.MAX_PARTICLES = 300;
            this.MAX_TEXT = 50;
            this.MAX_TRAIL = 100;
            this.MAX_SHOCKWAVES = 15;
            this.MAX_FLASH = 15;
            this.MAX_LIGHTNING = 8;
        }
    }

    // --- 基础粒子 ---
    emit(x, y, count, config) {
        // 性能保护：接近上限时减少生成
        const headroom = this.MAX_PARTICLES - this.particles.length;
        if (headroom <= 0) return;
        count = Math.min(count, headroom);
        for (let i = 0; i < count; i++) {
            const angle = config.angle !== undefined
                ? config.angle + Utils.rand(-config.spread || 0, config.spread || 0)
                : Utils.rand(0, Math.PI * 2);
            const speed = Utils.rand(config.speedMin || 1, config.speedMax || 5);
            const size = Utils.rand(config.sizeMin || 2, config.sizeMax || 6);
            const life = Utils.rand(config.lifeMin || 0.3, config.lifeMax || 1.0);

            this.particles.push({
                x: x + Utils.rand(-config.offsetX || 0, config.offsetX || 0),
                y: y + Utils.rand(-config.offsetY || 0, config.offsetY || 0),
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size,
                maxSize: size,
                life,
                maxLife: life,
                color: config.colors ? Utils.randColor(config.colors) : (config.color || '#fff'),
                gravity: config.gravity || 0,
                friction: config.friction || 0.98,
                shrink: config.shrink !== false,
                glow: config.glow || false,
                glowSize: config.glowSize || 10,
                shape: config.shape || 'circle', // circle, square, star, spark
                rotation: Utils.rand(0, Math.PI * 2),
                rotSpeed: Utils.rand(-0.2, 0.2),
                fadeOut: config.fadeOut !== false,
            });
        }
    }

    // --- 爆炸效果 ---
    explode(x, y, color, count = 20, power = 5) {
        const colors = Array.isArray(color) ? color : [color, '#fff', '#ffaa00'];
        this.emit(x, y, count, {
            colors,
            speedMin: power * 0.5,
            speedMax: power * 1.5,
            sizeMin: 2,
            sizeMax: 8,
            lifeMin: 0.3,
            lifeMax: 0.8,
            friction: 0.95,
            glow: true,
            glowSize: 15,
        });
        // 火花
        this.emit(x, y, Math.floor(count * 0.5), {
            colors: ['#fff', '#ffffaa'],
            speedMin: power * 1.0,
            speedMax: power * 2.5,
            sizeMin: 1,
            sizeMax: 3,
            lifeMin: 0.2,
            lifeMax: 0.5,
            friction: 0.92,
            shape: 'spark',
        });
        // 冲击波
        this.addShockwave(x, y, color[0] || color, power * 15, 0.4);
    }

    // --- 超级爆炸 (Boss死亡等) ---
    superExplode(x, y, colors, count = 80) {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.explode(
                    x + Utils.rand(-30, 30),
                    y + Utils.rand(-30, 30),
                    colors,
                    Math.floor(count / 3),
                    8
                );
            }, i * 100);
        }
        this.addShockwave(x, y, '#fff', 200, 0.6);
        Utils.shake(15);
    }

    // --- 伤害数字（增强版：大数字更大字号，暴击更夸张） ---
    addDamageText(x, y, damage, isCrit = false, color = '#fff') {
        if (this.textParticles.length >= this.MAX_TEXT) return;
        const isText = typeof damage === 'string';
        // 数字大小随伤害值缩放
        let baseSize = 18;
        let bigScale = 1.0;
        if (!isText) {
            const dmg = Math.abs(typeof damage === 'number' ? damage : 0);
            if (dmg >= 500) { baseSize = 32; bigScale = 1.8; }
            else if (dmg >= 200) { baseSize = 26; bigScale = 1.4; }
            else if (dmg >= 100) { baseSize = 22; bigScale = 1.2; }
        }
        this.textParticles.push({
            x: x + Utils.rand(-10, 10),
            y: y - 10,
            text: isText ? damage : (isCrit ? Math.floor(damage) + '!' : Math.floor(damage).toString()),
            size: isText ? 22 : (isCrit ? baseSize + 10 : baseSize),
            maxSize: isText ? 26 : (isCrit ? baseSize + 16 : baseSize + 4),
            color: isText ? color : (isCrit ? '#ff4444' : color),
            outlineColor: isText ? '#000' : (isCrit ? '#ffaa00' : '#000'),
            life: isText ? 1.0 : (isCrit ? 1.2 : 0.8),
            maxLife: isText ? 1.0 : (isCrit ? 1.2 : 0.8),
            vy: -3,
            vx: Utils.rand(-1, 1),
            isCrit: isText ? false : isCrit,
            scale: isText ? 1.3 : (isCrit ? 1.5 * bigScale : bigScale),
        });
        if (isCrit) {
            this.emit(x, y, 8, {
                colors: ['#ff4444', '#ffaa00', '#ffff00'],
                speedMin: 2,
                speedMax: 5,
                sizeMin: 2,
                sizeMax: 5,
                lifeMin: 0.3,
                lifeMax: 0.6,
                shape: 'star',
                glow: true,
                glowSize: 8,
            });
        }
    }

    // --- 连杀通知 ---
    addComboText(x, y, comboCount) {
        if (this.textParticles.length >= this.MAX_TEXT) return;
        const milestones = [10, 25, 50, 100, 200, 500];
        if (!milestones.includes(comboCount)) return;
        const colors = { 10: '#ffaa00', 25: '#ff8844', 50: '#ff4444', 100: '#ff44aa', 200: '#aa44ff', 500: '#ff2222' };
        this.textParticles.push({
            x, y: y - 40,
            text: comboCount + ' COMBO!',
            size: 30,
            maxSize: 40,
            color: colors[comboCount] || '#ffaa00',
            outlineColor: '#000',
            life: 1.5,
            maxLife: 1.5,
            vy: -2,
            vx: 0,
            isCrit: true,
            scale: 2.0,
        });
        this.addShockwave(x, y, colors[comboCount] || '#ffaa00', 100, 0.3);
    }

    // --- 经验宝石闪光 ---
    addGemSparkle(x, y, color) {
        this.emit(x, y, 3, {
            colors: [color, '#fff'],
            speedMin: 0.5,
            speedMax: 2,
            sizeMin: 1,
            sizeMax: 3,
            lifeMin: 0.2,
            lifeMax: 0.5,
            glow: true,
            glowSize: 6,
        });
    }

    // --- 拖尾效果 ---
    addTrail(x, y, color, size = 4, life = 0.3) {
        if (this.trailEffects.length >= this.MAX_TRAIL) return;
        this.trailEffects.push({
            x, y, color, size, maxSize: size,
            life, maxLife: life,
            glow: true,
        });
    }

    // --- 冲击波 ---
    addShockwave(x, y, color, maxRadius, life = 0.4) {
        if (this.shockwaves.length >= this.MAX_SHOCKWAVES) return;
        this.shockwaves.push({
            x, y, color,
            radius: 5,
            maxRadius,
            life,
            maxLife: life,
            lineWidth: 4,
        });
    }

    // --- 闪光 ---
    addFlash(x, y, color, radius, life = 0.15) {
        if (this.flashEffects.length >= this.MAX_FLASH) return;
        this.flashEffects.push({
            x, y, color, radius, maxRadius: radius,
            life, maxLife: life,
        });
    }

    // --- 闪电 ---
    addLightning(x1, y1, x2, y2, color = '#88aaff', branches = 3, life = 0.2) {
        if (this.lightnings.length >= this.MAX_LIGHTNING) return;
        const points = this._generateLightningPath(x1, y1, x2, y2, 5);
        this.lightnings.push({
            points,
            color,
            life,
            maxLife: life,
            lineWidth: 3,
            branches: [],
        });
        // 生成分支
        for (let b = 0; b < branches; b++) {
            const idx = Utils.randInt(2, points.length - 2);
            const p = points[idx];
            const branchEnd = {
                x: p.x + Utils.rand(-60, 60),
                y: p.y + Utils.rand(-60, 60),
            };
            const branchPoints = this._generateLightningPath(p.x, p.y, branchEnd.x, branchEnd.y, 3);
            this.lightnings[this.lightnings.length - 1].branches.push(branchPoints);
        }
    }

    _generateLightningPath(x1, y1, x2, y2, detail) {
        const points = [{ x: x1, y: y1 }];
        const segments = detail + Utils.randInt(2, 5);
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const midX = Utils.lerp(x1, x2, t) + Utils.rand(-25, 25);
            const midY = Utils.lerp(y1, y2, t) + Utils.rand(-25, 25);
            points.push({ x: midX, y: midY });
        }
        points.push({ x: x2, y: y2 });
        return points;
    }

    // --- 武器拖尾/刀光 ---
    addSlashArc(x, y, startAngle, endAngle, radius, color, life = 0.3) {
        const steps = 12;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = Utils.lerp(startAngle, endAngle, t);
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            this.trailEffects.push({
                x: px, y: py,
                color,
                size: Utils.lerp(8, 2, t),
                maxSize: Utils.lerp(8, 2, t),
                life: life * (1 - t * 0.5),
                maxLife: life,
                glow: true,
            });
        }
    }

    // --- 更新所有粒子 (使用swap-and-pop替代splice提升性能) ---
    update(dt) {
        // 基础粒子
        let len = this.particles.length;
        for (let i = len - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.particles[i] = this.particles[len - 1];
                len--;
                continue;
            }
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity * dt;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;
            if (p.shrink) {
                p.size = p.maxSize * (p.life / p.maxLife);
            }
        }
        this.particles.length = len;

        // 文字粒子
        len = this.textParticles.length;
        for (let i = len - 1; i >= 0; i--) {
            const p = this.textParticles[i];
            p.life -= dt;
            if (p.life <= 0) {
                this.textParticles[i] = this.textParticles[len - 1];
                len--;
                continue;
            }
            p.x += p.vx;
            p.y += p.vy;
            p.vy -= 3 * dt;
            if (p.isCrit) {
                const t = 1 - p.life / p.maxLife;
                p.scale = t < 0.1 ? Utils.easeOutElastic(t / 0.1) * 1.5 : Utils.lerp(1.5, 1.0, (t - 0.1) / 0.9);
            }
        }
        this.textParticles.length = len;

        // 闪光
        len = this.flashEffects.length;
        for (let i = len - 1; i >= 0; i--) {
            this.flashEffects[i].life -= dt;
            if (this.flashEffects[i].life <= 0) {
                this.flashEffects[i] = this.flashEffects[len - 1];
                len--;
            }
        }
        this.flashEffects.length = len;

        // 拖尾
        len = this.trailEffects.length;
        for (let i = len - 1; i >= 0; i--) {
            const t = this.trailEffects[i];
            t.life -= dt;
            if (t.life <= 0) {
                this.trailEffects[i] = this.trailEffects[len - 1];
                len--;
                continue;
            }
            t.size = t.maxSize * (t.life / t.maxLife);
        }
        this.trailEffects.length = len;

        // 冲击波
        len = this.shockwaves.length;
        for (let i = len - 1; i >= 0; i--) {
            const s = this.shockwaves[i];
            s.life -= dt;
            if (s.life <= 0) {
                this.shockwaves[i] = this.shockwaves[len - 1];
                len--;
                continue;
            }
            const progress = 1 - s.life / s.maxLife;
            s.radius = s.maxRadius * Utils.easeOutCubic(progress);
            s.lineWidth = Utils.lerp(4, 1, progress);
        }
        this.shockwaves.length = len;

        // 闪电
        len = this.lightnings.length;
        for (let i = len - 1; i >= 0; i--) {
            this.lightnings[i].life -= dt;
            if (this.lightnings[i].life <= 0) {
                this.lightnings[i] = this.lightnings[len - 1];
                len--;
            }
        }
        this.lightnings.length = len;
    }

    // --- 渲染所有粒子 ---
    render(ctx, camera, screenW, screenH) {
        ctx.save();
        const margin = 30; // 屏幕外裁剪余量

        // 拖尾
        for (const t of this.trailEffects) {
            const sx = t.x - camera.x;
            const sy = t.y - camera.y;
            if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) continue;
            const alpha = t.life / t.maxLife;
            if (t.glow) {
                ctx.globalAlpha = alpha * 0.6;
                ctx.fillStyle = t.color;
                ctx.beginPath();
                ctx.arc(sx, sy, t.size * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = alpha;
            ctx.fillStyle = t.color;
            ctx.beginPath();
            ctx.arc(sx, sy, t.size, 0, Math.PI * 2);
            ctx.fill();
        }

        // 基础粒子
        for (const p of this.particles) {
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;
            if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) continue;
            const alpha = p.fadeOut ? (p.life / p.maxLife) : 1;

            if (p.glow) {
                ctx.globalAlpha = alpha * 0.5;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(sx, sy, p.size + p.glowSize, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;

            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.shape === 'square') {
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
                ctx.restore();
            } else if (p.shape === 'star') {
                this._drawStar(ctx, sx, sy, p.size, p.rotation);
            } else if (p.shape === 'spark') {
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(p.rotation);
                ctx.fillRect(-p.size * 3, -p.size * 0.3, p.size * 6, p.size * 0.6);
                ctx.restore();
            }
        }

        // 冲击波
        for (const s of this.shockwaves) {
            const sx = s.x - camera.x;
            const sy = s.y - camera.y;
            const r = s.radius;
            if (sx + r < -margin || sx - r > screenW + margin || sy + r < -margin || sy - r > screenH + margin) continue;
            const alpha = s.life / s.maxLife;
            ctx.globalAlpha = alpha * 0.75;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.lineWidth;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, Math.PI * 2);
            ctx.stroke();
            // 内圈
            ctx.globalAlpha = alpha * 0.35;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = s.lineWidth * 0.5;
            ctx.beginPath();
            ctx.arc(sx, sy, r * 0.8, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 闪光（用两层半透明圆代替createRadialGradient，性能更好）
        for (const f of this.flashEffects) {
            const sx = f.x - camera.x;
            const sy = f.y - camera.y;
            if (sx + f.radius < -margin || sx - f.radius > screenW + margin || sy + f.radius < -margin || sy - f.radius > screenH + margin) continue;
            const alpha = f.life / f.maxLife;
            ctx.fillStyle = f.color;
            ctx.globalAlpha = alpha * 0.25;
            ctx.beginPath();
            ctx.arc(sx, sy, f.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = alpha * 0.65;
            ctx.beginPath();
            ctx.arc(sx, sy, f.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }

        // 闪电
        for (const l of this.lightnings) {
            const alpha = l.life / l.maxLife;
            ctx.globalAlpha = alpha;
            this._drawLightningPath(ctx, l.points, l.color, l.lineWidth, camera);
            ctx.globalAlpha = alpha * 0.6;
            for (const branch of l.branches) {
                this._drawLightningPath(ctx, branch, l.color, l.lineWidth * 0.5, camera);
            }
        }

        // 伤害文字
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const t of this.textParticles) {
            const sx = t.x - camera.x;
            const sy = t.y - camera.y;
            if (sx < -80 || sx > screenW + 80 || sy < -40 || sy > screenH + 40) continue;
            const alpha = Math.min(1, t.life / t.maxLife * 2);
            const scale = t.scale || 1;
            const fontSize = Math.floor(t.size * scale);

            ctx.globalAlpha = alpha;
            ctx.font = `bold ${fontSize}px 'Microsoft YaHei','PingFang SC','Helvetica Neue',Arial,sans-serif`;

            // 描边
            ctx.strokeStyle = t.outlineColor;
            ctx.lineWidth = 3;
            ctx.strokeText(t.text, sx, sy);

            // 填充
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, sx, sy);
        }

        ctx.restore();
    }

    _drawStar(ctx, x, y, size, rotation) {
        const spikes = 4;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? size : size * 0.4;
            const angle = (i * Math.PI) / spikes;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    _drawLightningPath(ctx, points, color, lineWidth, camera) {
        if (points.length < 2) return;
        // 外光
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth + 4;
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.moveTo(points[0].x - camera.x, points[0].y - camera.y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x - camera.x, points[i].y - camera.y);
        }
        ctx.stroke();

        // 内芯
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha *= 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x - camera.x, points[0].y - camera.y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x - camera.x, points[i].y - camera.y);
        }
        ctx.stroke();
    }

    // 清空所有粒子
    clear() {
        this.particles.length = 0;
        this.textParticles.length = 0;
        this.flashEffects.length = 0;
        this.trailEffects.length = 0;
        this.shockwaves.length = 0;
        this.lightnings.length = 0;
    }
}
