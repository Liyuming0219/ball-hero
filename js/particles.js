// ============================================
// 粒子特效系统 V3 - 极致视觉升级
// 新增：环形粒子、螺旋轨迹、彩虹粒子、
//       多层冲击波、能量柱、屏幕闪白/染色
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
        this.beams = [];        // 新增: 能量光柱
        this.screenFlash = null; // 新增: 全屏闪光/染色

        // 性能上限 —— PC大幅提高上限
        if (this.isMobile) {
            this.MAX_PARTICLES = 120;
            this.MAX_TEXT = 20;
            this.MAX_TRAIL = 40;
            this.MAX_SHOCKWAVES = 8;
            this.MAX_FLASH = 8;
            this.MAX_LIGHTNING = 4;
            this.MAX_BEAMS = 4;
        } else {
            this.MAX_PARTICLES = 1200;
            this.MAX_TEXT = 80;
            this.MAX_TRAIL = 400;
            this.MAX_SHOCKWAVES = 40;
            this.MAX_FLASH = 40;
            this.MAX_LIGHTNING = 20;
            this.MAX_BEAMS = 12;
        }
    }

    // --- 基础粒子(增强) ---
    emit(x, y, count, config) {
        const headroom = this.MAX_PARTICLES - this.particles.length;
        if (headroom <= 0) return;
        count = Math.min(count, headroom);
        for (let i = 0; i < count; i++) {
            const angle = config.angle !== undefined
                ? config.angle + Utils.rand(-config.spread || 0, config.spread || 0)
                : Utils.rand(0, TWO_PI);
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
                grow: config.grow || false,     // 新增: 先大后小
                glow: config.glow || false,
                glowSize: config.glowSize || 10,
                glowColor: config.glowColor || null, // 新增: 独立辉光色
                shape: config.shape || 'circle', // circle, square, star, spark, ring, diamond, cross, heart
                rotation: Utils.rand(0, TWO_PI),
                rotSpeed: config.rotSpeed !== undefined ? config.rotSpeed : Utils.rand(-0.2, 0.2),
                fadeOut: config.fadeOut !== false,
                pulse: config.pulse || false,   // 新增: 脉冲明暗
                trail: config.trail || false,   // 新增: 粒子本身带短尾
                hueShift: config.hueShift || false, // 新增: 彩虹色相偏移
                _hue: Math.random() * 360,
                blend: config.blend || null,   // 新增: 混合模式(lighter等)
            });
        }
    }

    // --- 环形发射(新增) ---
    emitRing(x, y, count, radius, config) {
        const headroom = this.MAX_PARTICLES - this.particles.length;
        if (headroom <= 0) return;
        count = Math.min(count, headroom);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * TWO_PI;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            const speed = Utils.rand(config.speedMin || 2, config.speedMax || 5);
            const size = Utils.rand(config.sizeMin || 2, config.sizeMax || 5);
            const life = Utils.rand(config.lifeMin || 0.3, config.lifeMax || 0.8);
            this.particles.push({
                x: px, y: py,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size, maxSize: size, life, maxLife: life,
                color: config.colors ? Utils.randColor(config.colors) : (config.color || '#fff'),
                gravity: config.gravity || 0, friction: config.friction || 0.96,
                shrink: true, glow: config.glow || true,
                glowSize: config.glowSize || 12, glowColor: null,
                shape: config.shape || 'circle',
                rotation: angle, rotSpeed: 0,
                fadeOut: true, pulse: false, trail: false,
                hueShift: false, _hue: 0, blend: config.blend || null,
                grow: false,
            });
        }
    }

    // --- 螺旋发射(新增) ---
    emitSpiral(x, y, count, config) {
        const headroom = this.MAX_PARTICLES - this.particles.length;
        if (headroom <= 0) return;
        count = Math.min(count, headroom);
        const arms = config.arms || 3;
        for (let i = 0; i < count; i++) {
            const arm = i % arms;
            const t = i / count;
            const angle = arm * (TWO_PI / arms) + t * TWO_PI * 2 + (config.offset || 0);
            const dist = t * (config.radius || 50);
            const speed = Utils.rand(config.speedMin || 1, config.speedMax || 4);
            const size = Utils.rand(config.sizeMin || 2, config.sizeMax || 5);
            const life = Utils.rand(config.lifeMin || 0.5, config.lifeMax || 1.2);
            this.particles.push({
                x: x + Math.cos(angle) * dist,
                y: y + Math.sin(angle) * dist,
                vx: Math.cos(angle + Math.PI * 0.5) * speed,
                vy: Math.sin(angle + Math.PI * 0.5) * speed,
                size, maxSize: size, life, maxLife: life,
                color: config.colors ? Utils.randColor(config.colors) : '#fff',
                gravity: 0, friction: config.friction || 0.97,
                shrink: true, glow: config.glow || true,
                glowSize: config.glowSize || 10, glowColor: null,
                shape: config.shape || 'star',
                rotation: angle, rotSpeed: 0.1,
                fadeOut: true, pulse: false, trail: config.trail || false,
                hueShift: config.hueShift || false, _hue: (i / count) * 360,
                blend: config.blend || null, grow: false,
            });
        }
    }

    // --- 爆炸效果(增强) ---
    explode(x, y, color, count = 30, power = 6) {
        const colors = Array.isArray(color) ? color : [color, '#fff', '#ffaa00'];
        // 核心爆裂
        this.emit(x, y, count, {
            colors,
            speedMin: power * 0.5,
            speedMax: power * 1.8,
            sizeMin: 2,
            sizeMax: 9,
            lifeMin: 0.3,
            lifeMax: 0.9,
            friction: 0.93,
            glow: true,
            glowSize: 18,
        });
        // 外圈火花(spark形状)
        this.emit(x, y, Math.floor(count * 0.6), {
            colors: ['#fff', '#ffffaa', colors[0]],
            speedMin: power * 1.2,
            speedMax: power * 3.0,
            sizeMin: 1,
            sizeMax: 3,
            lifeMin: 0.15,
            lifeMax: 0.45,
            friction: 0.88,
            shape: 'spark',
            glow: true,
            glowSize: 6,
        });
        // 环形扩散粒子
        this.emitRing(x, y, Math.floor(count * 0.4), power * 3, {
            colors: [colors[0], '#fff'],
            speedMin: power * 0.3,
            speedMax: power * 0.8,
            sizeMin: 2,
            sizeMax: 5,
            lifeMin: 0.2,
            lifeMax: 0.5,
            glow: true, glowSize: 10,
        });
        // 冲击波
        this.addShockwave(x, y, colors[0] || color, power * 18, 0.45);
        // 中心闪光
        this.addFlash(x, y, '#fff', power * 8, 0.12);
    }

    // --- 超级爆炸 (Boss死亡等)(增强) ---
    superExplode(x, y, colors, count = 120) {
        // 多波次连环爆炸
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.explode(
                    x + Utils.rand(-40, 40),
                    y + Utils.rand(-40, 40),
                    colors,
                    Math.floor(count / 4),
                    9
                );
            }, i * 80);
        }
        // 大冲击波
        this.addShockwave(x, y, '#fff', 280, 0.7);
        this.addShockwave(x, y, colors[0], 200, 0.5);
        // 螺旋粒子
        this.emitSpiral(x, y, 40, {
            colors, radius: 80,
            speedMin: 3, speedMax: 8,
            sizeMin: 3, sizeMax: 7,
            lifeMin: 0.6, lifeMax: 1.2,
            glow: true, glowSize: 12,
        });
        // 全屏闪白
        this.triggerScreenFlash('#ffffff', 0.4, 0.2);
        Utils.shake(18);
    }

    // --- 新增: 全屏闪光/染色 ---
    triggerScreenFlash(color, alpha, duration) {
        this.screenFlash = { color, alpha, maxAlpha: alpha, life: duration, maxLife: duration };
    }

    // --- 新增: 能量光柱 ---
    addBeam(x, y, height, width, color, life = 0.5) {
        if (this.beams.length >= this.MAX_BEAMS) return;
        this.beams.push({ x, y, height, width, color, life, maxLife: life });
    }

    // --- 伤害数字（增强版：大数字更大字号，暴击更夸张） ---
    addDamageText(x, y, damage, isCrit = false, color = '#fff') {
        if (this.textParticles.length >= this.MAX_TEXT) return;
        const isText = typeof damage === 'string';
        let baseSize = 18;
        let bigScale = 1.0;
        if (!isText) {
            const dmg = Math.abs(typeof damage === 'number' ? damage : 0);
            if (dmg >= 500) { baseSize = 34; bigScale = 2.0; }
            else if (dmg >= 200) { baseSize = 28; bigScale = 1.5; }
            else if (dmg >= 100) { baseSize = 24; bigScale = 1.3; }
        }
        this.textParticles.push({
            x: x + Utils.rand(-12, 12),
            y: y - 12,
            text: isText ? damage : (isCrit ? Math.floor(damage) + '!' : Math.floor(damage).toString()),
            size: isText ? 22 : (isCrit ? baseSize + 12 : baseSize),
            maxSize: isText ? 26 : (isCrit ? baseSize + 18 : baseSize + 4),
            color: isText ? color : (isCrit ? '#ff4444' : color),
            outlineColor: isText ? '#000' : (isCrit ? '#ffaa00' : '#000'),
            life: isText ? 1.0 : (isCrit ? 1.4 : 0.9),
            maxLife: isText ? 1.0 : (isCrit ? 1.4 : 0.9),
            vy: -3.5,
            vx: Utils.rand(-1.5, 1.5),
            isCrit: isText ? false : isCrit,
            scale: isText ? 1.3 : (isCrit ? 1.6 * bigScale : bigScale),
        });
        if (isCrit) {
            // 更强暴击粒子效果
            this.emit(x, y, 12, {
                colors: ['#ff4444', '#ffaa00', '#ffff00', '#fff'],
                speedMin: 3,
                speedMax: 7,
                sizeMin: 2,
                sizeMax: 6,
                lifeMin: 0.3,
                lifeMax: 0.7,
                shape: 'star',
                glow: true,
                glowSize: 10,
            });
            this.addShockwave(x, y, '#ffaa00', 30, 0.2);
        }
    }

    // --- 连杀通知(增强) ---
    addComboText(x, y, comboCount) {
        if (this.textParticles.length >= this.MAX_TEXT) return;
        const milestones = [10, 25, 50, 100, 200, 500];
        if (!milestones.includes(comboCount)) return;
        const colors = { 10: '#ffaa00', 25: '#ff8844', 50: '#ff4444', 100: '#ff44aa', 200: '#aa44ff', 500: '#ff2222' };
        const c = colors[comboCount] || '#ffaa00';
        this.textParticles.push({
            x, y: y - 40,
            text: comboCount + ' COMBO!',
            size: 32,
            maxSize: 44,
            color: c,
            outlineColor: '#000',
            life: 1.8,
            maxLife: 1.8,
            vy: -2.5,
            vx: 0,
            isCrit: true,
            scale: 2.2,
        });
        this.addShockwave(x, y, c, 120, 0.35);
        this.emitRing(x, y, 16, 30, {
            colors: [c, '#fff'], speedMin: 3, speedMax: 7,
            sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.6,
            glow: true, glowSize: 8,
        });
    }

    // --- 经验宝石闪光(增强) ---
    addGemSparkle(x, y, color) {
        this.emit(x, y, 4, {
            colors: [color, '#fff'],
            speedMin: 0.5,
            speedMax: 2.5,
            sizeMin: 1,
            sizeMax: 4,
            lifeMin: 0.2,
            lifeMax: 0.6,
            glow: true,
            glowSize: 8,
            shape: 'star',
        });
    }

    // --- 拖尾效果 ---
    addTrail(x, y, color, size = 5, life = 0.35) {
        if (this.trailEffects.length >= this.MAX_TRAIL) return;
        this.trailEffects.push({
            x, y, color, size, maxSize: size,
            life, maxLife: life,
            glow: true,
        });
    }

    // --- 冲击波(增强: 双层+发光) ---
    addShockwave(x, y, color, maxRadius, life = 0.4) {
        if (this.shockwaves.length >= this.MAX_SHOCKWAVES) return;
        this.shockwaves.push({
            x, y, color,
            radius: 5,
            maxRadius,
            life,
            maxLife: life,
            lineWidth: 5,
            inner: true,
        });
    }

    // --- 闪光(增强: 多层辉光) ---
    addFlash(x, y, color, radius, life = 0.15) {
        if (this.flashEffects.length >= this.MAX_FLASH) return;
        this.flashEffects.push({
            x, y, color, radius, maxRadius: radius,
            life, maxLife: life,
        });
    }

    // --- 闪电(增强: 更粗更亮) ---
    addLightning(x1, y1, x2, y2, color = '#88aaff', branches = 4, life = 0.25) {
        if (this.lightnings.length >= this.MAX_LIGHTNING) return;
        const points = this._generateLightningPath(x1, y1, x2, y2, 6);
        this.lightnings.push({
            points,
            color,
            life,
            maxLife: life,
            lineWidth: 4,
            branches: [],
        });
        for (let b = 0; b < branches; b++) {
            const idx = Utils.randInt(2, points.length - 2);
            const p = points[idx];
            const branchEnd = {
                x: p.x + Utils.rand(-70, 70),
                y: p.y + Utils.rand(-70, 70),
            };
            const branchPoints = this._generateLightningPath(p.x, p.y, branchEnd.x, branchEnd.y, 3);
            this.lightnings[this.lightnings.length - 1].branches.push(branchPoints);
        }
    }

    _generateLightningPath(x1, y1, x2, y2, detail) {
        const points = [{ x: x1, y: y1 }];
        const segments = detail + Utils.randInt(3, 6);
        for (let i = 1; i < segments; i++) {
            const t = i / segments;
            const midX = Utils.lerp(x1, x2, t) + Utils.rand(-30, 30);
            const midY = Utils.lerp(y1, y2, t) + Utils.rand(-30, 30);
            points.push({ x: midX, y: midY });
        }
        points.push({ x: x2, y: y2 });
        return points;
    }

    // --- 武器拖尾/刀光(增强) ---
    addSlashArc(x, y, startAngle, endAngle, radius, color, life = 0.35) {
        const steps = 18;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const angle = Utils.lerp(startAngle, endAngle, t);
            // 主弧线：带随机径向偏移增加动感
            const rOff = 1 + (Math.random() - 0.5) * 0.1;
            const px = x + Math.cos(angle) * radius * rOff;
            const py = y + Math.sin(angle) * radius * rOff;
            const sz = Utils.lerp(12, 3, t);
            this.trailEffects.push({
                x: px, y: py,
                color,
                size: sz,
                maxSize: sz,
                life: life * (1 - t * 0.35),
                maxLife: life,
                glow: true,
            });
        }
        // 内层速度线（稍短半径，更快消失）
        for (let i = 0; i <= steps; i += 2) {
            const t = i / steps;
            const angle = Utils.lerp(startAngle, endAngle, t);
            const px = x + Math.cos(angle) * radius * 0.85;
            const py = y + Math.sin(angle) * radius * 0.85;
            const sz = Utils.lerp(6, 1.5, t);
            this.trailEffects.push({
                x: px, y: py,
                color: '#fff',
                size: sz,
                maxSize: sz,
                life: life * 0.65 * (1 - t * 0.5),
                maxLife: life * 0.65,
                glow: true,
            });
        }
        // 外层散射火花（少量随机飞溅，增强视觉丰富度）
        const sparkCount = Math.min(6, Math.ceil(steps * 0.3));
        for (let i = 0; i < sparkCount; i++) {
            const t = Math.random();
            const angle = Utils.lerp(startAngle, endAngle, t);
            const sparkR = radius * (1.05 + Math.random() * 0.2);
            const px = x + Math.cos(angle) * sparkR;
            const py = y + Math.sin(angle) * sparkR;
            this.trailEffects.push({
                x: px, y: py,
                color: color === '#ffffff' ? '#ffeecc' : '#ffffff',
                size: 2 + Math.random() * 2,
                maxSize: 3,
                life: life * 0.4,
                maxLife: life * 0.4,
                glow: true,
            });
        }
    }

    // --- 更新所有粒子 ---
    update(dt) {
        // 屏幕闪光
        if (this.screenFlash) {
            this.screenFlash.life -= dt;
            if (this.screenFlash.life <= 0) this.screenFlash = null;
        }

        // 能量光柱
        let bLen = this.beams.length;
        for (let i = bLen - 1; i >= 0; i--) {
            this.beams[i].life -= dt;
            if (this.beams[i].life <= 0) {
                this.beams[i] = this.beams[bLen - 1];
                bLen--;
            }
        }
        this.beams.length = bLen;

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
            const lifeRatio = p.life / p.maxLife;
            if (p.grow) {
                // 先膨胀到1.5倍再缩小
                const t = 1 - lifeRatio;
                p.size = t < 0.2 ? p.maxSize * (t / 0.2) * 1.5 : p.maxSize * lifeRatio * 1.2;
            } else if (p.shrink) {
                p.size = p.maxSize * lifeRatio;
            }
            if (p.hueShift) {
                p._hue = (p._hue + dt * 200) % 360;
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
            s.lineWidth = Utils.lerp(5, 1.5, progress);
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

    // --- 渲染拖尾（在玩家之前调用，避免遮挡皮肤） ---
    renderTrails(ctx, camera, screenW, screenH) {
        ctx.save();
        const margin = 40;
        for (const t of this.trailEffects) {
            const sx = t.x - camera.x;
            const sy = t.y - camera.y;
            if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) continue;
            const alpha = t.life / t.maxLife;
            if (t.glow && t.size > 2) {
                // 柔和光晕拖尾：外圈半透明大圆 + 内圈同色小圆（无白色球心）
                // 视觉上像平滑光斑，不像一个实心球
                ctx.fillStyle = t.color;
                ctx.globalAlpha = alpha * 0.25;
                ctx.beginPath();
                ctx.arc(sx, sy, t.size * 2, 0, TWO_PI);
                ctx.fill();
                ctx.globalAlpha = alpha * 0.6;
                ctx.beginPath();
                ctx.arc(sx, sy, t.size, 0, TWO_PI);
                ctx.fill();
            } else {
                ctx.globalAlpha = alpha * 0.8;
                ctx.fillStyle = t.color;
                const s = t.size;
                ctx.fillRect(sx - s, sy - s, s * 2, s * 2);
            }
        }
        ctx.restore();
    }

    // --- 渲染所有粒子(增强版，不含拖尾) ---
    render(ctx, camera, screenW, screenH) {
        ctx.save();
        const margin = 40;

        // 基础粒子(增强渲染)
        for (const p of this.particles) {
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;
            if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) continue;
            const alpha = p.fadeOut ? (p.life / p.maxLife) : 1;
            const pulseAlpha = p.pulse ? alpha * (0.6 + 0.4 * Math.sin(p.life * 15)) : alpha;

            // 混合模式
            if (p.blend) ctx.globalCompositeOperation = p.blend;

            // 色相偏移
            let fillColor = p.color;
            if (p.hueShift) {
                fillColor = `hsl(${Math.floor(p._hue)}, 80%, 65%)`;
            }
            ctx.fillStyle = fillColor;

            // 小圆形粒子快速路径
            if (p.shape === 'circle' && p.size < 4 && !p.glow) {
                ctx.globalAlpha = pulseAlpha;
                const s = p.size;
                ctx.fillRect(sx - s, sy - s, s * 2, s * 2);
                if (p.blend) ctx.globalCompositeOperation = 'source-over';
                continue;
            }

            // 辉光
            if (p.glow) {
                const gc = p.glowColor || fillColor;
                ctx.globalAlpha = pulseAlpha * 0.35;
                ctx.fillStyle = gc;
                ctx.beginPath();
                ctx.arc(sx, sy, p.size + p.glowSize, 0, TWO_PI);
                ctx.fill();
                ctx.fillStyle = fillColor;
            }

            ctx.globalAlpha = pulseAlpha;

            if (p.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(sx, sy, p.size, 0, TWO_PI);
                ctx.fill();
                // 中心亮点(大粒子)
                if (p.size > 4) {
                    ctx.globalAlpha = pulseAlpha * 0.6;
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(sx, sy, p.size * 0.35, 0, TWO_PI);
                    ctx.fill();
                }
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
                ctx.fillRect(-p.size * 3.5, -p.size * 0.35, p.size * 7, p.size * 0.7);
                ctx.restore();
            } else if (p.shape === 'ring') {
                ctx.beginPath();
                ctx.arc(sx, sy, p.size, 0, TWO_PI);
                ctx.lineWidth = Math.max(1, p.size * 0.3);
                ctx.strokeStyle = fillColor;
                ctx.globalAlpha = pulseAlpha;
                ctx.stroke();
            } else if (p.shape === 'diamond') {
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(p.rotation);
                ctx.beginPath();
                ctx.moveTo(0, -p.size * 1.4);
                ctx.lineTo(p.size * 0.7, 0);
                ctx.lineTo(0, p.size * 1.4);
                ctx.lineTo(-p.size * 0.7, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else if (p.shape === 'cross') {
                ctx.save();
                ctx.translate(sx, sy);
                ctx.rotate(p.rotation);
                const w = p.size * 0.3;
                ctx.fillRect(-p.size, -w, p.size * 2, w * 2);
                ctx.fillRect(-w, -p.size, w * 2, p.size * 2);
                ctx.restore();
            } else if (p.shape === 'heart') {
                this._drawHeart(ctx, sx, sy, p.size, p.rotation);
            }

            if (p.blend) ctx.globalCompositeOperation = 'source-over';
        }

        // 冲击波(增强: 双层+辉光)
        for (const s of this.shockwaves) {
            const sx = s.x - camera.x;
            const sy = s.y - camera.y;
            const r = s.radius;
            if (sx + r < -margin || sx - r > screenW + margin || sy + r < -margin || sy - r > screenH + margin) continue;
            const alpha = s.life / s.maxLife;

            // 外圈辉光
            ctx.globalAlpha = alpha * 0.3;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.lineWidth + 6;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, TWO_PI);
            ctx.stroke();

            // 主环
            ctx.globalAlpha = alpha * 0.8;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.lineWidth;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, TWO_PI);
            ctx.stroke();

            // 内环(白芯)
            if (s.inner) {
                ctx.globalAlpha = alpha * 0.5;
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = s.lineWidth * 0.4;
                ctx.beginPath();
                ctx.arc(sx, sy, r * 0.85, 0, TWO_PI);
                ctx.stroke();
            }
        }

        // 闪光(增强: 三层渐变)
        for (const f of this.flashEffects) {
            const sx = f.x - camera.x;
            const sy = f.y - camera.y;
            if (sx + f.radius < -margin || sx - f.radius > screenW + margin || sy + f.radius < -margin || sy - f.radius > screenH + margin) continue;
            const alpha = f.life / f.maxLife;
            ctx.fillStyle = f.color;
            // 外层
            ctx.globalAlpha = alpha * 0.15;
            ctx.beginPath();
            ctx.arc(sx, sy, f.radius * 1.3, 0, TWO_PI);
            ctx.fill();
            // 中层
            ctx.globalAlpha = alpha * 0.35;
            ctx.beginPath();
            ctx.arc(sx, sy, f.radius * 0.7, 0, TWO_PI);
            ctx.fill();
            // 核心
            ctx.globalAlpha = alpha * 0.7;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(sx, sy, f.radius * 0.25, 0, TWO_PI);
            ctx.fill();
        }

        // 能量光柱
        for (const b of this.beams) {
            const sx = b.x - camera.x;
            const sy = b.y - camera.y;
            const alpha = b.life / b.maxLife;
            // 宽辉光
            ctx.globalAlpha = alpha * 0.2;
            ctx.fillStyle = b.color;
            ctx.fillRect(sx - b.width * 2, sy - b.height, b.width * 4, b.height);
            // 中间
            ctx.globalAlpha = alpha * 0.5;
            ctx.fillRect(sx - b.width, sy - b.height, b.width * 2, b.height);
            // 白芯
            ctx.globalAlpha = alpha * 0.8;
            ctx.fillStyle = '#fff';
            ctx.fillRect(sx - b.width * 0.3, sy - b.height, b.width * 0.6, b.height);
        }

        // 闪电(增强: 更亮更粗)
        for (const l of this.lightnings) {
            const alpha = l.life / l.maxLife;
            // 外辉光
            ctx.globalAlpha = alpha * 0.4;
            this._drawLightningPath(ctx, l.points, l.color, l.lineWidth + 6, camera);
            // 主干
            ctx.globalAlpha = alpha;
            this._drawLightningPath(ctx, l.points, l.color, l.lineWidth, camera);
            // 白芯
            ctx.globalAlpha = alpha * 0.9;
            this._drawLightningPath(ctx, l.points, '#fff', l.lineWidth * 0.5, camera);
            // 分支
            ctx.globalAlpha = alpha * 0.6;
            for (const branch of l.branches) {
                this._drawLightningPath(ctx, branch, l.color, l.lineWidth * 0.4, camera);
            }
        }

        // 伤害文字
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (const t of this.textParticles) {
            const sx = t.x - camera.x;
            const sy = t.y - camera.y;
            if (sx < -100 || sx > screenW + 100 || sy < -50 || sy > screenH + 50) continue;
            const lifeRatio = t.life / t.maxLife;
            const alpha = Math.min(1, lifeRatio * 2.5);
            const scale = t.scale || 1;

            // 弹出缩放动画：出现时放大后回弹
            const popProgress = 1 - lifeRatio; // 0→1 over lifetime
            let popScale = 1;
            if (popProgress < 0.1) {
                popScale = 1 + (1 - popProgress / 0.1) * 0.4; // 出现瞬间1.4x→1x
            }
            const fontSize = Math.floor(t.size * scale * popScale);

            ctx.globalAlpha = alpha;
            ctx.font = `bold ${fontSize}px 'Microsoft YaHei','PingFang SC','Helvetica Neue',Arial,sans-serif`;

            if (t.isCrit) {
                // 暴击增强：多层辉光 + 闪电纹理
                // 第一层：远距模糊辉光
                ctx.globalAlpha = alpha * 0.2;
                ctx.fillStyle = '#ffaa00';
                ctx.fillText(t.text, sx + 1, sy + 1);
                ctx.fillText(t.text, sx - 1, sy - 1);

                // 第二层：中距辉光
                ctx.globalAlpha = alpha * 0.4;
                ctx.fillStyle = t.outlineColor === '#ffaa00' ? '#ffaa00' : t.color;
                ctx.fillText(t.text, sx, sy);

                // 闪电线条（暴击数字周围随机短线）
                ctx.globalAlpha = alpha * 0.6;
                ctx.strokeStyle = '#ffff88';
                ctx.lineWidth = 1.5;
                const boltCount = 3;
                for (let b = 0; b < boltCount; b++) {
                    const ba = (b / boltCount) * Math.PI * 2 + lifeRatio * 10;
                    const bLen = fontSize * 0.4 + Math.sin(lifeRatio * 20 + b * 3) * fontSize * 0.2;
                    const bx1 = sx + Math.cos(ba) * fontSize * 0.35;
                    const by1 = sy + Math.sin(ba) * fontSize * 0.35;
                    const bx2 = sx + Math.cos(ba) * (fontSize * 0.35 + bLen);
                    const by2 = sy + Math.sin(ba) * (fontSize * 0.35 + bLen);
                    ctx.beginPath();
                    ctx.moveTo(bx1, by1);
                    // 中间折点
                    ctx.lineTo((bx1 + bx2) / 2 + (Math.random() - 0.5) * 4, (by1 + by2) / 2 + (Math.random() - 0.5) * 4);
                    ctx.lineTo(bx2, by2);
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = alpha;
            // 加粗描边（增强对比度）
            ctx.strokeStyle = t.outlineColor;
            ctx.lineWidth = t.isCrit ? 5 : 4;
            ctx.strokeText(t.text, sx, sy);
            // 主填充
            ctx.fillStyle = t.color;
            ctx.fillText(t.text, sx, sy);

            // 暴击白色高光叠加
            if (t.isCrit) {
                ctx.globalAlpha = alpha * 0.3 * popScale;
                ctx.fillStyle = '#ffffff';
                ctx.fillText(t.text, sx, sy - 1);
            }
        }

        ctx.restore();

        // 全屏闪光覆盖(在最上层)
        if (this.screenFlash) {
            const sf = this.screenFlash;
            ctx.save();
            ctx.globalAlpha = sf.maxAlpha * (sf.life / sf.maxLife);
            ctx.fillStyle = sf.color;
            ctx.fillRect(0, 0, screenW, screenH);
            ctx.restore();
        }
    }

    _drawStar(ctx, x, y, size, rotation) {
        const spikes = 5;
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

    _drawHeart(ctx, x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        const s = size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.7);
        ctx.bezierCurveTo(-s * 1.2, -s * 0.3, -s * 0.4, -s * 1.5, 0, -s * 0.6);
        ctx.bezierCurveTo(s * 0.4, -s * 1.5, s * 1.2, -s * 0.3, 0, s * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    _drawLightningPath(ctx, points, color, lineWidth, camera) {
        if (points.length < 2) return;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
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
        this.beams.length = 0;
        this.screenFlash = null;
    }
}
