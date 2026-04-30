// ============================================
// 武器系统 - 华丽的攻击方式
// ============================================

class WeaponSystem {
    constructor(player, particles) {
        this.player = player;
        this.particles = particles;
        this.projectiles = [];
        this.attackTimer = 0;
        this.slashAngle = 0;
        this.comboCount = 0;
        this.summonManager = null; // 由 game.js 注入（亡灵师使用）

        // 武器挥舞动画状态
        this.weaponAnim = {
            active: false,
            timer: 0,
            duration: 0.25,
            angle: 0,          // 攻击方向
            swingDir: 1,       // 左/右挥
            type: player.def.weaponType,
        };
    }

    update(dt, enemies, camera) {
        this._lastEnemies = enemies; // 保存引用给连锁闪电/爆裂击杀用
        this.attackTimer += dt;
        const interval = 1 / this.player.getAttackSpeed();

        // 武器动画更新
        if (this.weaponAnim.active) {
            this.weaponAnim.timer += dt;
            if (this.weaponAnim.timer >= this.weaponAnim.duration) {
                this.weaponAnim.active = false;
            }
        }

        // 自动攻击
        if (this.attackTimer >= interval) {
            this.attackTimer -= interval;
            this._autoAttack(enemies, camera);
            // 双重打击
            if (this.player.bonuses.doubleStrike > 0 && Math.random() < this.player.bonuses.doubleStrike) {
                this._autoAttack(enemies, camera);
            }
        }

        // 更新投射物
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt);

            // 拖尾
            if (p.trail) {
                this.particles.addTrail(p.x, p.y, p.color, p.trailSize || 3, 0.2);
            }
            // 龙卷风侧视拖尾：沿漏斗轮廓散发风屑
            if (p.type === 'wind_slash' && p.alive) {
                const lifeRatio = p.life / p.maxLife;
                // 垂直于运动方向的轴
                const perpX = -Math.sin(p.angle);
                const perpY = Math.cos(p.angle);
                // 沿漏斗宽端（顶部区域）散发粒子
                for (let ti = 0; ti < 2; ti++) {
                    const spread = p.width * 0.6 * (Math.random() * 0.5 + 0.5);
                    const side = Math.random() > 0.5 ? 1 : -1;
                    this.particles.addTrail(
                        p.x + perpX * spread * side,
                        p.y + perpY * spread * side,
                        ['#88ddff', '#aaeeff', '#ccf4ff', '#ffffff'][Math.floor(Math.random() * 4)],
                        (2 + Math.random() * 2) * lifeRatio,
                        0.18 + Math.random() * 0.12
                    );
                }
            }

            // 追踪弹 / 集火追踪
            if (this.player.bonuses.homingShot && enemies.length > 0 && p.type !== 'split') {
                let target = null;
                let turnSpeed = 2.0 * dt; // 默认微弱追踪

                if (this.player.bonuses.focusFire) {
                    // 集火追踪模式：锁定目标，目标死亡后转火
                    // 如果投射物已命中过敌人（有穿透），不转火，保持原有微弱追踪
                    const hasHit = p.hitEnemies && p.hitEnemies.size > 0;
                    if (!hasHit) {
                        // 检查当前锁定目标是否仍存活
                        if (p._focusTarget && p._focusTarget.alive) {
                            target = p._focusTarget;
                        } else {
                            // 锁定最近敌人（从投射物位置搜索）
                            target = this._findNearestFrom(p.x, p.y, enemies, 600);
                            p._focusTarget = target;
                        }
                        turnSpeed = 8.0 * dt; // 强力追踪
                    } else {
                        // 已穿透过的投射物：保持微弱追踪
                        target = this._findNearestFrom(p.x, p.y, enemies, 300);
                    }
                } else {
                    // 普通追踪模式
                    target = this._findNearestFrom(p.x, p.y, enemies, 300);
                }

                if (target) {
                    const targetAngle = Utils.angle(p.x, p.y, target.x, target.y);
                    const currentAngle = Math.atan2(p.vy, p.vx);
                    let diff = targetAngle - currentAngle;
                    while (diff > Math.PI) diff -= Math.PI * 2;
                    while (diff < -Math.PI) diff += Math.PI * 2;
                    const newAngle = currentAngle + Utils.clamp(diff, -turnSpeed, turnSpeed);
                    const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                    p.vx = Math.cos(newAngle) * speed;
                    p.vy = Math.sin(newAngle) * speed;
                    if (p.angle !== undefined) p.angle = newAngle;
                }
            }

            if (!p.alive) {
                this.projectiles.splice(i, 1);
                continue;
            }

            // 碰撞检测
            for (const enemy of enemies) {
                if (!enemy.alive) continue;
                if (p.hitEnemies && p.hitEnemies.has(enemy)) continue;

                if (Utils.circleCollision(p.x, p.y, p.radius, enemy.x, enemy.y, enemy.radius)) {
                    this._hitEnemy(enemy, p);
                    if (p.pierce > 0) {
                        p.pierce--;
                        if (!p.hitEnemies) p.hitEnemies = new Set();
                        p.hitEnemies.add(enemy);
                        // 剑气波命中特效：风刃切割粒子
                        if (p.type === 'wind_slash') {
                            this.particles.emit(enemy.x, enemy.y, 6, {
                                colors: ['#88ddff', '#aaeeff', '#ffffff'],
                                speedMin: 3,
                                speedMax: 7,
                                sizeMin: 1,
                                sizeMax: 4,
                                lifeMin: 0.15,
                                lifeMax: 0.35,
                                glow: true,
                            });
                        }
                    } else {
                        p.alive = false;
                        // 弹幕消失粒子
                        this.particles.emit(p.x, p.y, 5, {
                            colors: [p.color, '#fff'],
                            speedMin: 1,
                            speedMax: 3,
                            sizeMin: 1,
                            sizeMax: 3,
                            lifeMin: 0.1,
                            lifeMax: 0.3,
                        });
                    }
                    break;
                }
            }
        }

        // 剑客被动：疾风剑意 —— 剑意叠满时释放贯穿剑气波
        if (this.player.def.id === 'swordsman' && this.player.passive.stacks >= this.player.passive.maxStacks) {
            this.player.passive.stacks = 0;
            this._swordWindSlash(enemies);
        }

        // 法师被动：元素共鸣
        if (this.player.def.id === 'mage' && this.player.passive.timer >= this.player.passive.interval) {
            this.player.passive.timer = 0;
            this._fireNova(enemies);
        }

        // 刺客被动：暗影步（瞬移到敌人身后背刺）
        if (this.player.def.id === 'assassin' && this.player.passive.timer >= this.player.passive.interval) {
            this.player.passive.timer = 0;
            this._shadowBlinkAttack(enemies);
        }

        // 亡灵师被动：灵魂风暴（灵魂满时释放）
        if (this.player.def.id === 'necromancer' && this.player.passive.souls >= this.player.passive.maxSouls) {
            this.player.passive.souls = 0;
            this._soulStorm(enemies);
        }
    }

    _autoAttack(enemies, camera) {
        const nearestEnemy = this._findNearest(enemies, 500);
        if (!nearestEnemy) return;

        const type = this.player.def.weaponType;
        const level = this.player.weaponLevel;

        // 触发武器挥舞动画
        const atkAngle = Utils.angle(this.player.x, this.player.y, nearestEnemy.x, nearestEnemy.y);
        this.weaponAnim.active = true;
        this.weaponAnim.timer = 0;
        this.weaponAnim.angle = atkAngle;
        this.weaponAnim.swingDir *= -1;
        this.weaponAnim.type = type;
        // 近战攻击动画时长短，远程长一些
        this.weaponAnim.duration = (type === 'fireball' || type === 'bow' || type === 'necro') ? 0.3 : 0.2;

        switch (type) {
            case 'sword':
                this._swordAttack(enemies, nearestEnemy, level);
                break;
            case 'fireball':
                this._fireballAttack(nearestEnemy, level);
                break;
            case 'dagger':
                this._daggerAttack(enemies, nearestEnemy, level);
                break;
            case 'hammer':
                this._hammerAttack(enemies, nearestEnemy, level);
                break;
            case 'bow':
                this._bowAttack(enemies, nearestEnemy, level);
                break;
            case 'necro':
                this._necroAttack(enemies, nearestEnemy, level);
                break;
        }
    }

    // --- 剑攻击 ---
    _swordAttack(enemies, target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const angle = Utils.angle(px, py, target.x, target.y);

        // 弧形范围
        const range = (80 + level * 12) * this.player.bonuses.areaMult;
        const arcWidth = (Math.PI * 0.6) + level * 0.1;

        this.comboCount++;
        const swingDir = this.comboCount % 2 === 0 ? 1 : -1;

        // 刀光特效
        this.particles.addSlashArc(
            px, py,
            angle - arcWidth / 2 * swingDir,
            angle + arcWidth / 2 * swingDir,
            range,
            this.player.def.color,
            0.25
        );

        // 范围伤害
        let hitCount = 0;
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(px, py, enemy.x, enemy.y);
            if (dist > range + enemy.radius) continue;

            const enemyAngle = Utils.angle(px, py, enemy.x, enemy.y);
            let angleDiff = enemyAngle - angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            if (Math.abs(angleDiff) <= arcWidth / 2) {
                const { damage, isCrit } = this._calcDamage();
                const died = enemy.takeDamage(damage, this.particles, enemyAngle, 8);
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit);
                hitCount++;

                // 吸血
                if (this.player.bonuses.vampiric > 0) {
                    this.player.heal(damage * this.player.bonuses.vampiric, this.particles);
                }
                // 连锁闪电（近战首次命中触发）
                if (this.player.bonuses.chainLightning > 0 && hitCount === 1) {
                    this._triggerChainLightning(enemy, damage * 0.5, this.player.bonuses.chainLightning);
                }
                // 爆裂暴击
                if (isCrit && this.player.bonuses.critRateBonus > 0.07) {
                    this.particles.explode(enemy.x, enemy.y, ['#ff4444', '#ffaa00'], 6, 3);
                }

                if (died) {
                    this._onKill(enemy);
                }
            }
        }

        if (hitCount > 0) {
            Utils.shake(3);
            this.particles.addFlash(px + Math.cos(angle) * range * 0.5, py + Math.sin(angle) * range * 0.5, this.player.def.color, 30, 0.1);
        }

        // 叠加剑意
        this.player.passive.stacks = Math.min(this.player.passive.maxStacks, this.player.passive.stacks + 1);
    }

    // 疾风剑气波（类似亚索Q）—— 朝最近敌人方向发出贯穿剑气投射物
    _swordWindSlash(enemies) {
        const px = this.player.x;
        const py = this.player.y;
        const level = this.player.weaponLevel;

        // 与其他投射物一致：优先瞄准最近敌人，无敌人时用面朝方向
        const nearest = this._findNearest(enemies, 500);
        const angle = nearest
            ? Utils.angle(px, py, nearest.x, nearest.y)
            : this.player.facingAngle;

        // 剑气波参数：随等级成长
        const slashSpeed = (350 + level * 20) * (1 + this.player.bonuses.projectileSpeed);
        const slashWidth = (40 + level * 5) * this.player.bonuses.areaMult;  // 剑气宽度
        const slashLength = (60 + level * 8) * this.player.bonuses.areaMult; // 剑气长度
        const slashLife = 0.9 + level * 0.06;
        const pierce = 999; // 无限贯穿

        // 三道扇形龙卷风（-18°/ 0° / +18°）
        const spawnDist = this.player.radius + 10;
        const spread = Math.PI / 10;  // 18°
        const offsets = [-spread, 0, spread];

        for (const off of offsets) {
            const a = angle + off;
            const sx = px + Math.cos(a) * spawnDist;
            const sy = py + Math.sin(a) * spawnDist;

            this.projectiles.push({
                x: sx,
                y: sy,
                vx: Math.cos(a) * slashSpeed,
                vy: Math.sin(a) * slashSpeed,
                radius: slashWidth,
                width: slashWidth,
                length: slashLength,
                angle: a,
                color: '#88ddff',
                colors: ['#44aaff', '#88ddff', '#aaeeff', '#ffffff'],
                alive: true,
                life: slashLife,
                maxLife: slashLife,
                pierce: pierce,
                trail: false,
                type: 'wind_slash',
                spin: off * 2,     // 每道初始旋转相位不同，视觉更丰富
                hitEnemies: new Set(),
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.spin += dt * 14;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }

        // 发射特效：剑气波的起始冲击
        this.particles.addSlashArc(
            px, py,
            angle - 0.4,
            angle + 0.4,
            slashLength * 1.5,
            '#88ddff',
            0.25
        );
        this.particles.emit(px, py, 18, {
            colors: ['#44aaff', '#88ddff', '#aaeeff', '#ffffff'],
            speedMin: 4,
            speedMax: 12,
            sizeMin: 2,
            sizeMax: 5,
            lifeMin: 0.2,
            lifeMax: 0.5,
            glow: true,
        });
        this.particles.addFlash(px, py, '#88ddff', 40, 0.15);
        Utils.shake(5);
    }

    // --- 火球攻击 ---
    _fireballAttack(target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const angle = Utils.angle(px, py, target.x, target.y);

        const numBalls = 1 + Math.floor(level / 2) + this.player.bonuses.projectileBonus;
        const spreadAngle = numBalls > 1 ? 0.25 : 0;

        for (let i = 0; i < numBalls; i++) {
            const a = angle + (i - (numBalls - 1) / 2) * spreadAngle;
            const speed = (400 + level * 25) * (1 + this.player.bonuses.projectileSpeed);
            const size = (12 + level * 2) * this.player.bonuses.areaMult;

            this.projectiles.push({
                x: px,
                y: py,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                radius: size,
                damage: 0, // 计算在碰撞时
                color: '#ff6644',
                colors: ['#ff6644', '#ffaa00', '#ffff44'],
                alive: true,
                life: 2.5,
                pierce: 1 + Math.floor(level / 2),
                trail: true,
                trailSize: size * 0.6,
                type: 'fireball',
                hitEnemies: new Set(),
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }

        // 发射闪光
        this.particles.addFlash(px, py, '#ff6644', 25, 0.1);
    }

    // 火焰新星
    _fireNova(enemies) {
        const px = this.player.x;
        const py = this.player.y;
        // 范围随等级成长：基础220 + 每级8
        const range = (220 + this.player.level * 8) * this.player.bonuses.areaMult;

        this.particles.addShockwave(px, py, '#ff4422', range, 0.5);
        this.particles.emit(px, py, 40, {
            colors: ['#ff4422', '#ff6644', '#ffaa00', '#ffff44'],
            speedMin: 3,
            speedMax: 10,
            sizeMin: 3,
            sizeMax: 8,
            lifeMin: 0.3,
            lifeMax: 0.8,
            glow: true,
            glowSize: 12,
        });
        this.particles.addFlash(px, py, '#ff6644', range * 0.6, 0.25);
        Utils.shake(8);

        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            if (Utils.dist(px, py, enemy.x, enemy.y) < range + enemy.radius) {
                // 烈焰印记增伤
                const blazeMult = 1 + (enemy._blazeStacks || 0) * 0.25;
                // 伤害倍率2.5x，随等级提升
                const { damage, isCrit } = this._calcDamage((2.5 + this.player.level * 0.05) * blazeMult);
                const angle = Utils.angle(px, py, enemy.x, enemy.y);
                const died = enemy.takeDamage(damage, this.particles, angle, 15);
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, '#ff6644');
                // 灼烧效果 + 叠加烈焰印记
                if (!died && enemy.alive) {
                    enemy._burnTimer = 3.0;
                    enemy._burnDamage = this.player.getAttack() * 0.3;
                    // 叠加烈焰印记（最多5层）
                    enemy._blazeStacks = Math.min(5, (enemy._blazeStacks || 0) + 1);
                    enemy._blazeTimer = 6.0; // 印记持续6秒
                }
                if (died) this._onKill(enemy);
            }
        }
    }

    // --- 匕首攻击（刺客）---
    _daggerAttack(enemies, target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const angle = Utils.angle(px, py, target.x, target.y);

        // 近距前刺 + 扇形连击
        const range = (60 + level * 8) * this.player.bonuses.areaMult;
        const arcWidth = Math.PI * 0.4;

        this.comboCount++;
        const swingDir = this.comboCount % 3; // 三连击

        // 刺击特效 - 紫色细长斩痕
        const slashAngleOffset = (swingDir - 1) * 0.3;
        this.particles.addSlashArc(
            px, py,
            angle - arcWidth / 2 + slashAngleOffset,
            angle + arcWidth / 2 + slashAngleOffset,
            range,
            '#cc66ff',
            0.15
        );

        let hitCount = 0;
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(px, py, enemy.x, enemy.y);
            if (dist > range + enemy.radius) continue;

            const enemyAngle = Utils.angle(px, py, enemy.x, enemy.y);
            let angleDiff = enemyAngle - angle;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            if (Math.abs(angleDiff) <= arcWidth / 2) {
                // 背刺判定：敌人正在移向玩家方向（面朝玩家）= 背刺
                const enemyMoveAngle = Utils.angle(enemy.x, enemy.y, px, py);
                const faceDiff = Math.abs(enemyAngle - enemyMoveAngle);
                const isBackstab = faceDiff < Math.PI * 0.5 || faceDiff > Math.PI * 1.5;
                const backstabMult = isBackstab ? 2.0 : 1.0;

                const { damage, isCrit } = this._calcDamage(backstabMult);
                const died = enemy.takeDamage(damage, this.particles, enemyAngle, 6);
                const textColor = isBackstab ? '#ff44ff' : '#cc66ff';
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, textColor);
                if (isBackstab) {
                    // 背刺闪光
                    this.particles.addFlash(enemy.x, enemy.y, '#ff44ff', 20, 0.1);
                }
                hitCount++;

                if (this.player.bonuses.vampiric > 0) {
                    this.player.heal(damage * this.player.bonuses.vampiric, this.particles);
                }
                if (died) this._onKill(enemy);
            }
        }

        if (hitCount > 0) Utils.shake(2);
    }

    // 刺客被动：暗影步瞬移
    _shadowBlinkAttack(enemies) {
        const nearest = this._findNearest(enemies, 350);
        if (!nearest) return;

        const px = this.player.x;
        const py = this.player.y;

        // 瞬移到敌人身后
        const behindAngle = Utils.angle(nearest.x, nearest.y, px, py);
        const blinkX = nearest.x + Math.cos(behindAngle) * (nearest.radius + 30);
        const blinkY = nearest.y + Math.sin(behindAngle) * (nearest.radius + 30);

        // 起始位残影
        this.particles.emit(px, py, 15, {
            colors: ['#aa44ff', '#cc66ff', '#8822dd'],
            speedMin: 1, speedMax: 4,
            sizeMin: 2, sizeMax: 6,
            lifeMin: 0.3, lifeMax: 0.6,
            glow: true,
        });

        // 瞬移
        this.player.x = blinkX;
        this.player.y = blinkY;
        this.player.invincibleTime = 1.0;

        // 到达位爆发
        this.particles.addShockwave(blinkX, blinkY, '#aa44ff', 80, 0.3);
        this.particles.emit(blinkX, blinkY, 20, {
            colors: ['#aa44ff', '#cc66ff', '#ffffff'],
            speedMin: 3, speedMax: 8,
            sizeMin: 2, sizeMax: 6,
            lifeMin: 0.2, lifeMax: 0.5,
            glow: true,
        });

        // 背刺伤害（3倍）+ 标记敌人
        const range = 100 * this.player.bonuses.areaMult;
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            if (Utils.dist(blinkX, blinkY, enemy.x, enemy.y) < range + enemy.radius) {
                // 标记增伤
                const markMult = enemy._shadowMark ? 1.3 : 1.0;
                const { damage, isCrit } = this._calcDamage(3.0 * markMult);
                const a = Utils.angle(blinkX, blinkY, enemy.x, enemy.y);
                const died = enemy.takeDamage(damage, this.particles, a, 12);
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, '#ff44ff');
                // 暗影步标记命中的敌人
                if (!died && enemy.alive) {
                    enemy._shadowMark = true;
                    enemy._shadowMarkTimer = 5.0; // 标记持续5秒
                }
                if (died) this._onKill(enemy);
            }
        }
        Utils.shake(6);
    }

    // --- 锤击攻击（圣骑士）---
    _hammerAttack(enemies, target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const angle = Utils.angle(px, py, target.x, target.y);

        // 360度锤击冲击波，范围比剑略小但全方位
        const range = (70 + level * 10) * this.player.bonuses.areaMult;

        // 冲击波视觉
        this.particles.addShockwave(px, py, '#ffcc44', range, 0.3);
        this.particles.addFlash(px, py, '#ffdd66', range * 0.5, 0.15);
        this.particles.emit(px, py, 12, {
            colors: ['#ffcc44', '#ffdd66', '#ffffff'],
            speedMin: 2, speedMax: 6,
            sizeMin: 2, sizeMax: 5,
            lifeMin: 0.2, lifeMax: 0.5,
        });
        Utils.shake(4);

        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(px, py, enemy.x, enemy.y);
            if (dist > range + enemy.radius) continue;

            const { damage, isCrit } = this._calcDamage(1.1);
            const a = Utils.angle(px, py, enemy.x, enemy.y);
            // 更强的击退
            const died = enemy.takeDamage(damage, this.particles, a, 15);
            this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, '#ffcc44');

            if (this.player.bonuses.vampiric > 0) {
                this.player.heal(damage * this.player.bonuses.vampiric, this.particles);
            }
            if (died) this._onKill(enemy);
        }
    }

    // --- 弓箭弹幕攻击（弓箭手）---
    _bowAttack(enemies, target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const angle = Utils.angle(px, py, target.x, target.y);

        // 弓箭手发射大量箭矢，数量随等级增长
        const numArrows = 2 + Math.floor(level / 2) + this.player.bonuses.projectileBonus;
        const spreadAngle = 0.15 + numArrows * 0.04; // 扇形展开角度

        for (let i = 0; i < numArrows; i++) {
            const a = angle + (i - (numArrows - 1) / 2) * spreadAngle;
            const speed = (420 + level * 20 + Utils.rand(-30, 30)) * (1 + this.player.bonuses.projectileSpeed);

            this.projectiles.push({
                x: px + Utils.rand(-4, 4),
                y: py + Utils.rand(-4, 4),
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                radius: 5 * this.player.bonuses.areaMult,
                angle: a,
                color: '#44ddaa',
                alive: true,
                life: 2.0,
                pierce: Math.floor(level / 3),
                trail: true,
                trailSize: 2,
                type: 'arrow',
                hitEnemies: new Set(),
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }

        // 发射闪光
        this.particles.addFlash(px, py, '#44ddaa', 22, 0.1);

        // 弓箭手被动：每次攻击叠加专注层
        if (this.player.def.id === 'archer' && this.player.passive.focusStacks !== undefined) {
            this.player.passive.focusStacks = Math.min(
                this.player.passive.maxFocus,
                this.player.passive.focusStacks + 1
            );
        }
    }

    // 弓箭手被动：箭雨（由 game.js 触发）
    _arrowRain(enemies) {
        const px = this.player.x;
        const py = this.player.y;

        // 找到敌人最密集的区域
        let bestX = px, bestY = py, bestCount = 0;
        for (const e of enemies) {
            if (!e.alive) continue;
            let count = 0;
            for (const e2 of enemies) {
                if (!e2.alive) continue;
                if (Utils.dist(e.x, e.y, e2.x, e2.y) < 120) count++;
            }
            if (count > bestCount) {
                bestCount = count;
                bestX = e.x;
                bestY = e.y;
            }
        }

        // 在目标区域释放箭雨
        const rainRadius = (100 + this.player.level * 3) * this.player.bonuses.areaMult;
        const arrowCount = 12 + this.player.level * 2;

        // 视觉警告圈
        this.particles.addShockwave(bestX, bestY, '#44ddaa', rainRadius, 0.5);

        // 箭雨箭矢（从天而降的效果）
        for (let i = 0; i < arrowCount; i++) {
            const offX = Utils.rand(-rainRadius, rainRadius);
            const offY = Utils.rand(-rainRadius, rainRadius);
            const ax = bestX + offX;
            const ay = bestY + offY;

            // 延迟生成粒子（模拟箭矢落下）
            this.projectiles.push({
                x: ax, y: ay - 200 - Utils.rand(0, 100),
                vx: Utils.rand(-20, 20),
                vy: 500 + Utils.rand(0, 200),
                radius: 4 * this.player.bonuses.areaMult,
                angle: Math.PI / 2,
                color: '#88ffcc',
                alive: true,
                life: 0.6,
                pierce: 0,
                trail: true,
                trailSize: 2,
                type: 'rain_arrow',
                hitEnemies: new Set(),
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }

        // 范围伤害（即时结算）
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            if (Utils.dist(bestX, bestY, enemy.x, enemy.y) < rainRadius + enemy.radius) {
                const { damage, isCrit } = this._calcDamage(2.0 + this.player.level * 0.03);
                const a = Utils.angle(bestX, bestY, enemy.x, enemy.y);
                const died = enemy.takeDamage(damage, this.particles, a, 8);
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, '#88ffcc');
                if (died) this._onKill(enemy);
            }
        }

        // 落地爆发粒子
        this.particles.emit(bestX, bestY, 25, {
            colors: ['#44ddaa', '#88ffcc', '#aaffdd'],
            speedMin: 2, speedMax: 7,
            sizeMin: 2, sizeMax: 5,
            lifeMin: 0.3, lifeMax: 0.7,
            glow: true,
        });
        Utils.shake(6);
    }

    // --- 召唤攻击（亡灵师）---
    _necroAttack(enemies, target, level) {
        const px = this.player.x;
        const py = this.player.y;
        const totalCount = this.summonManager ? this.summonManager.getTotalCount() : 0;
        const maxSummons = this.summonManager ? this.summonManager.maxSummons : 5;

        if (this.summonManager && totalCount < maxSummons) {
            // 召唤物未满时：智能轮换召唤已解锁的类型
            const offsetAngle = Utils.rand(0, Math.PI * 2);
            const offsetDist = Utils.rand(30, 60);
            const sx = px + Math.cos(offsetAngle) * offsetDist;
            const sy = py + Math.sin(offsetAngle) * offsetDist;
            this.summonManager.spawnNext(sx, sy);
        } else if (target) {
            // 召唤物已满时：发射灵魂弹攻击
            const angle = Utils.angle(px, py, target.x, target.y);
            this.projectiles.push({
                x: px, y: py,
                vx: Math.cos(angle) * 350 * (1 + this.player.bonuses.projectileSpeed),
                vy: Math.sin(angle) * 350 * (1 + this.player.bonuses.projectileSpeed),
                radius: 10 * this.player.bonuses.areaMult,
                color: '#44ccaa',
                colors: ['#44ccaa', '#22aa88', '#66eedd'],
                alive: true,
                life: 2.0,
                pierce: 1 + Math.floor(level / 3),
                trail: true,
                trailSize: 5,
                type: 'necro_bolt',
                hitEnemies: new Set(),
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }
    }

    // 亡灵师被动：灵魂收割满时召唤灵魂巨兽
    _soulStorm(enemies) {
        const px = this.player.x;
        const py = this.player.y;

        if (this.summonManager) {
            // 在前方召唤灵魂巨兽
            const angle = this.player.facingAngle;
            const bx = px + Math.cos(angle) * 60;
            const by = py + Math.sin(angle) * 60;
            this.summonManager.spawnBeast(bx, by);
        }

        // 召唤灵魂巨兽的同时释放一次小范围冲击波
        const range = 120 * this.player.bonuses.areaMult;
        this.particles.addShockwave(px, py, '#44ccaa', range, 0.4);
        this.particles.emit(px, py, 20, {
            colors: ['#44ccaa', '#22aa88', '#66eedd', '#aaffee'],
            speedMin: 2, speedMax: 6,
            sizeMin: 2, sizeMax: 6,
            lifeMin: 0.3, lifeMax: 0.7,
            glow: true,
        });
        Utils.shake(5);

        // 对范围内敌人造成一次伤害
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            if (Utils.dist(px, py, enemy.x, enemy.y) < range + enemy.radius) {
                const { damage, isCrit } = this._calcDamage(1.5);
                const a = Utils.angle(px, py, enemy.x, enemy.y);
                const died = enemy.takeDamage(damage, this.particles, a, 10);
                this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, '#aaffee');
                if (died) this._onKill(enemy);
            }
        }
    }

    _hitEnemy(enemy, projectile) {
        let baseMult = projectile.type === 'fireball' ? 1.2 : (projectile.type === 'rain_arrow' ? 1.5 : (projectile.type === 'wind_slash' ? 2.0 : 1.0));
        // 刺客被动：标记敌人受额外30%伤害
        if (this.player.def.id === 'assassin' && enemy._shadowMark) {
            baseMult *= 1.3;
        }
        // 法师被动：烈焰印记增伤（每层+25%）
        if (this.player.def.id === 'mage' && enemy._blazeStacks > 0) {
            baseMult *= 1 + enemy._blazeStacks * 0.25;
        }
        const { damage, isCrit } = this._calcDamage(baseMult);
        const angle = Utils.angle(this.player.x, this.player.y, enemy.x, enemy.y);
        const died = enemy.takeDamage(damage, this.particles, angle, 5);
        this.particles.addDamageText(enemy.x, enemy.y, damage, isCrit, projectile.color);

        // 火球爆炸溅射AOE
        if (projectile.type === 'fireball' && (died || projectile.pierce <= 0)) {
            const splashRadius = (50 + projectile.radius * 2) * this.player.bonuses.areaMult;
            const splashDamage = damage * 0.6;
            for (const e2 of this._lastEnemies || []) {
                if (!e2.alive || e2 === enemy) continue;
                if (Utils.dist(projectile.x, projectile.y, e2.x, e2.y) < splashRadius + e2.radius) {
                    const splashAngle = Utils.angle(projectile.x, projectile.y, e2.x, e2.y);
                    const splashDied = e2.takeDamage(splashDamage, this.particles, splashAngle, 6);
                    this.particles.addDamageText(e2.x, e2.y, Math.floor(splashDamage), false, '#ffaa00');
                    if (splashDied) this._onKill(e2);
                }
            }
            this.particles.explode(projectile.x, projectile.y, projectile.colors || ['#ff6644', '#ffaa00'], 18, 5);
            this.particles.addShockwave(projectile.x, projectile.y, '#ff6644', splashRadius * 0.8, 0.2);
        }

        // 龙卷风减速：命中敌人降低60%移速，持续1.5秒
        if (projectile.type === 'wind_slash' && enemy.alive) {
            enemy.slowMult = 0.4;
            enemy.slowTimer = 1.5;
        }

        // 吸血
        if (this.player.bonuses.vampiric > 0) {
            const healAmt = damage * this.player.bonuses.vampiric;
            if (healAmt > 0) this.player.heal(healAmt, this.particles);
        }

        // 连锁闪电
        if (this.player.bonuses.chainLightning > 0 && !projectile._chainDone) {
            projectile._chainDone = true;
            this._triggerChainLightning(enemy, damage * 0.6, this.player.bonuses.chainLightning);
        }

        // 爆裂暴击效果
        if (isCrit && this.player.bonuses.critRateBonus > 0.07) {
            // 如果拥有爆裂暴击（通过critRateBonus>0.07简单判断）
            this.particles.explode(enemy.x, enemy.y, ['#ff4444', '#ffaa00', '#ffff44'], 8, 3);
        }

        // 分裂弹
        if (this.player.bonuses.splitShot && !projectile._hasSplit && projectile.type !== 'split') {
            projectile._hasSplit = true;
            this._triggerSplitShot(enemy.x, enemy.y, damage * 0.4, projectile.color);
        }

        if (died) {
            this._onKill(enemy);
        }
    }

    _calcDamage(multiplier = 1) {
        const base = this.player.getAttack() * multiplier;
        const isCrit = Math.random() < this.player.getCritRate();
        const damage = isCrit ? base * this.player.getCritDamage() : base;
        return { damage: Math.floor(damage), isCrit };
    }

    _onKill(enemy) {
        this.player.kills++;
        // 刺客被动：击杀标记目标100%重置暗影步，其他25%重置
        if (this.player.def.id === 'assassin') {
            if (enemy._shadowMark) {
                this.player.passive.timer = this.player.passive.interval;
                enemy._shadowMark = false;
                this.particles.addFlash(enemy.x, enemy.y, '#cc66ff', 40, 0.2);
                this.particles.addDamageText(enemy.x, enemy.y - 30, '重置!', false, '#cc66ff');
            } else if (Math.random() < 0.25) {
                this.player.passive.timer = this.player.passive.interval;
            }
        }
        // 亡灵师被动：积攒灵魂
        if (this.player.def.id === 'necromancer') {
            this.player.passive.souls = Math.min(this.player.passive.maxSouls, this.player.passive.souls + 1);
        }
        // 爆裂击杀
        if (this.player.bonuses.explosiveKill) {
            const explodeDmg = this.player.getAttack() * 0.8;
            const explodeRange = 80;
            for (const e2 of this._lastEnemies || []) {
                if (!e2.alive || e2 === enemy) continue;
                if (Utils.dist(enemy.x, enemy.y, e2.x, e2.y) < explodeRange) {
                    const a = Utils.angle(enemy.x, enemy.y, e2.x, e2.y);
                    e2.takeDamage(explodeDmg, this.particles, a, 8);
                    this.particles.addDamageText(e2.x, e2.y, Math.floor(explodeDmg), false, '#ffaa00');
                }
            }
            this.particles.explode(enemy.x, enemy.y, ['#ff6644', '#ffaa00', '#ffff44'], 12, 5);
            Utils.shake(4);
        }
        // 击杀回血
        if (this.player.bonuses.killHeal > 0) {
            this.player.heal(this.player.bonuses.killHeal, this.particles);
        }
    }

    // _shadowCloneAttack removed - replaced by _shadowBlinkAttack

    // --- 连锁闪电 ---
    _triggerChainLightning(sourceEnemy, damage, maxChains) {
        let current = sourceEnemy;
        const hit = new Set([current]);
        for (let c = 0; c < maxChains; c++) {
            let nearest = null;
            let nearestDist = 200; // 闪电跳跃范围
            for (const enemy of this._lastEnemies || []) {
                if (!enemy.alive || hit.has(enemy)) continue;
                const dist = Utils.dist(current.x, current.y, enemy.x, enemy.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = enemy;
                }
            }
            if (!nearest) break;
            hit.add(nearest);
            // 闪电视觉
            this.particles.addLightning(current.x, current.y, nearest.x, nearest.y, '#88aaff', 1, 0.3);
            // 造成伤害
            const angle = Utils.angle(current.x, current.y, nearest.x, nearest.y);
            const died = nearest.takeDamage(damage, this.particles, angle, 3);
            this.particles.addDamageText(nearest.x, nearest.y, Math.floor(damage), false, '#88aaff');
            if (died) this._onKill(nearest);
            current = nearest;
        }
    }

    // --- 分裂弹 ---
    _triggerSplitShot(x, y, damage, color) {
        for (let i = 0; i < 3; i++) {
            const a = (i / 3) * Math.PI * 2 + Utils.rand(-0.3, 0.3);
            this.projectiles.push({
                x, y,
                vx: Math.cos(a) * 250,
                vy: Math.sin(a) * 250,
                radius: 4 * this.player.bonuses.areaMult,
                color: color,
                alive: true,
                life: 0.6,
                pierce: 0,
                trail: true,
                trailSize: 2,
                type: 'split',
                hitEnemies: new Set(),
                _hasSplit: true, // 防止递归分裂
                update(dt) {
                    this.x += this.vx * dt;
                    this.y += this.vy * dt;
                    this.life -= dt;
                    if (this.life <= 0) this.alive = false;
                },
            });
        }
    }

    _findNearest(enemies, maxDist) {
        let nearest = null;
        let nearestDist = maxDist;
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        }
        return nearest;
    }

    // 从指定位置搜索最近敌人（用于投射物追踪）
    _findNearestFrom(x, y, enemies, maxDist) {
        let nearest = null;
        let nearestDist = maxDist;
        for (const enemy of enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(x, y, enemy.x, enemy.y);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        }
        return nearest;
    }

    // ==========================================
    // 武器外观 + 攻击动画渲染
    // ==========================================
    renderWeapon(ctx, camera) {
        const p = this.player;
        const sx = p.x - camera.x;
        const sy = p.y - camera.y + (p.isMoving ? Math.sin(p.bodyBob) * 3 : 0);
        const anim = this.weaponAnim;
        const type = p.def.weaponType;

        // 计算武器角度：攻击中用攻击角度，否则用面朝角度
        let baseAngle = p.facingAngle;
        let swingOffset = 0;

        if (anim.active) {
            baseAngle = anim.angle;
            const t = anim.timer / anim.duration; // 0→1 进度
            // 挥舞弧度：从-60°到+60°（近战），远程是后坐力
            if (type === 'sword' || type === 'dagger' || type === 'hammer') {
                swingOffset = (t < 0.5)
                    ? Utils.lerp(-1.0, 1.0, t * 2) * anim.swingDir
                    : Utils.lerp(1.0, 0, (t - 0.5) * 2) * anim.swingDir;
            } else {
                // 远程武器：后坐力动画
                swingOffset = (t < 0.3)
                    ? Utils.lerp(0, -0.3, t / 0.3)
                    : Utils.lerp(-0.3, 0, (t - 0.3) / 0.7);
            }
        }

        const weaponAngle = baseAngle + swingOffset;
        const weaponDist = p.radius + 6;
        const wx = sx + Math.cos(weaponAngle) * weaponDist;
        const wy = sy + Math.sin(weaponAngle) * weaponDist;

        ctx.save();
        ctx.translate(wx, wy);
        ctx.rotate(weaponAngle);

        switch (type) {
            case 'sword': this._drawSword(ctx, anim.active); break;
            case 'dagger': this._drawDagger(ctx, anim.active); break;
            case 'hammer': this._drawHammer(ctx, anim.active); break;
            case 'fireball': this._drawStaff(ctx, anim.active); break;
            case 'bow': this._drawBow(ctx, anim.active); break;
            case 'necro': this._drawSkull(ctx, anim.active); break;
        }

        ctx.restore();
    }

    // --- 剑（蓝色长剑）---
    _drawSword(ctx, attacking) {
        const glow = attacking ? 0.5 : 0.2;
        // 剑光
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#88ccff';
        ctx.fillRect(-2, -3, 28, 6);
        ctx.globalAlpha = 1;
        // 剑身
        ctx.fillStyle = '#ccddef';
        ctx.beginPath();
        ctx.moveTo(26, 0);
        ctx.lineTo(4, -3);
        ctx.lineTo(0, -2);
        ctx.lineTo(0, 2);
        ctx.lineTo(4, 3);
        ctx.closePath();
        ctx.fill();
        // 剑刃高光
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(26, 0);
        ctx.lineTo(10, -1.5);
        ctx.lineTo(10, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        // 剑柄
        ctx.fillStyle = '#886633';
        ctx.fillRect(-6, -2.5, 7, 5);
        // 护手
        ctx.fillStyle = '#ffcc44';
        ctx.fillRect(-1, -5, 3, 10);
    }

    // --- 匕首（紫色短刃双刀）---
    _drawDagger(ctx, attacking) {
        const glow = attacking ? 0.5 : 0.15;
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#cc88ff';
        ctx.fillRect(-1, -2, 18, 4);
        ctx.globalAlpha = 1;
        // 刀身
        ctx.fillStyle = '#bb99dd';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(4, -2.5);
        ctx.lineTo(0, -1.5);
        ctx.lineTo(0, 1.5);
        ctx.lineTo(4, 2.5);
        ctx.closePath();
        ctx.fill();
        // 高光
        ctx.fillStyle = '#eeddff';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(8, -1);
        ctx.lineTo(8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
        // 柄
        ctx.fillStyle = '#553366';
        ctx.fillRect(-5, -2, 6, 4);
    }

    // --- 战锤（金色重锤）---
    _drawHammer(ctx, attacking) {
        const glow = attacking ? 0.4 : 0.15;
        // 柄
        ctx.fillStyle = '#886644';
        ctx.fillRect(-4, -2, 20, 4);
        // 锤头光晕
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#ffdd66';
        ctx.beginPath();
        ctx.arc(18, 0, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // 锤头
        ctx.fillStyle = '#ccaa44';
        ctx.fillRect(10, -8, 14, 16);
        // 锤面高光
        ctx.fillStyle = '#ffeeaa';
        ctx.globalAlpha = 0.4;
        ctx.fillRect(12, -6, 4, 12);
        ctx.globalAlpha = 1;
        // 锤头边框
        ctx.strokeStyle = '#997722';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(10, -8, 14, 16);
    }

    // --- 法杖（红色火焰杖）---
    _drawStaff(ctx, attacking) {
        // 杖身
        ctx.fillStyle = '#664422';
        ctx.fillRect(-8, -2, 26, 4);
        // 顶端装饰
        ctx.fillStyle = '#aa4422';
        ctx.beginPath();
        ctx.arc(20, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        // 火焰核心
        const glow = attacking ? 0.8 : 0.4;
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#ff6633';
        ctx.beginPath();
        ctx.arc(20, 0, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffaa33';
        ctx.beginPath();
        ctx.arc(20, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        // 杖尾
        ctx.fillStyle = '#553311';
        ctx.beginPath();
        ctx.arc(-8, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- 弓（绿色长弓）---
    _drawBow(ctx, attacking) {
        // 弓身（弧形）
        ctx.strokeStyle = '#558866';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(4, 0, 16, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();
        // 弓弦
        ctx.strokeStyle = '#aaddbb';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const stringPull = attacking ? -6 : 0;
        ctx.moveTo(4 + Math.cos(-Math.PI * 0.4) * 16, Math.sin(-Math.PI * 0.4) * 16);
        ctx.lineTo(stringPull, 0);
        ctx.lineTo(4 + Math.cos(Math.PI * 0.4) * 16, Math.sin(Math.PI * 0.4) * 16);
        ctx.stroke();
        // 箭矢
        if (!attacking) {
            ctx.fillStyle = '#88ffcc';
            ctx.beginPath();
            ctx.moveTo(24, 0);
            ctx.lineTo(2, -1.5);
            ctx.lineTo(2, 1.5);
            ctx.closePath();
            ctx.fill();
            // 箭羽
            ctx.fillStyle = '#66ddaa';
            ctx.beginPath();
            ctx.moveTo(2, -1.5);
            ctx.lineTo(-4, -4);
            ctx.lineTo(0, 0);
            ctx.lineTo(-4, 4);
            ctx.lineTo(2, 1.5);
            ctx.closePath();
            ctx.fill();
        }
        // 握把装饰
        ctx.fillStyle = '#446655';
        ctx.fillRect(-2, -2, 6, 4);
    }

    // --- 亡灵法杖（骷髅权杖）---
    _drawSkull(ctx, attacking) {
        // 杖身
        ctx.fillStyle = '#336655';
        ctx.fillRect(-8, -2, 24, 4);
        // 骷髅头
        const glow = attacking ? 0.6 : 0.25;
        ctx.globalAlpha = glow;
        ctx.fillStyle = '#66eedd';
        ctx.beginPath();
        ctx.arc(18, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        // 骷髅外形
        ctx.fillStyle = '#ddeedd';
        ctx.beginPath();
        ctx.arc(18, -1, 6, 0, Math.PI * 2);
        ctx.fill();
        // 下巴
        ctx.fillRect(14, 3, 8, 3);
        // 眼睛
        ctx.fillStyle = '#22aa88';
        ctx.beginPath();
        ctx.arc(16, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(20, -2, 2, 0, Math.PI * 2);
        ctx.fill();
        // 杖尾宝石
        ctx.fillStyle = '#44ccaa';
        ctx.beginPath();
        ctx.arc(-8, 0, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    renderProjectiles(ctx, camera, screenW, screenH) {
        const margin = 30;
        for (const p of this.projectiles) {
            if (!p.alive) continue;
            const sx = p.x - camera.x;
            const sy = p.y - camera.y;
            if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) continue;

            ctx.save();

            if (p.type === 'fireball') {
                // 外光
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#ffaa00';
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius * 1.8, 0, Math.PI * 2);
                ctx.fill();
                // 火球
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#ff6644';
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
                ctx.fill();
                // 内核
                ctx.fillStyle = '#ffff44';
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius * 0.4, 0, Math.PI * 2);
                ctx.fill();
            } else if (p.type === 'arrow' || p.type === 'rain_arrow') {
                ctx.translate(sx, sy);
                ctx.rotate(p.angle || Math.atan2(p.vy, p.vx));
                ctx.fillStyle = p.color;
                // 箭头
                ctx.beginPath();
                ctx.moveTo(p.radius * 2.5, 0);
                ctx.lineTo(p.radius * 0.5, -p.radius * 0.6);
                ctx.lineTo(p.radius * 0.5, p.radius * 0.6);
                ctx.closePath();
                ctx.fill();
                // 箭身
                ctx.fillStyle = '#88ffcc';
                ctx.fillRect(-p.radius * 2, -1, p.radius * 2.5, 2);
                // 箭羽
                ctx.fillStyle = '#66ddaa';
                ctx.beginPath();
                ctx.moveTo(-p.radius * 2, 0);
                ctx.lineTo(-p.radius * 2.5, -p.radius * 0.5);
                ctx.lineTo(-p.radius * 1.5, 0);
                ctx.lineTo(-p.radius * 2.5, p.radius * 0.5);
                ctx.closePath();
                ctx.fill();
            } else if (p.type === 'wind_slash') {
                // ===== 真实龙卷风：多层渐变漏斗 + 湍流扰动 + 旋转碎片 =====
                const lifeRatio = p.life / p.maxLife;
                const spin = p.spin || 0;
                const H = p.length * 1.2;
                const topW = p.width * 0.75;
                const botW = p.width * 0.10;
                const halfH = H * 0.5;

                ctx.translate(sx, sy);

                // --- 辅助：获取某高度t(0=顶,1=底)处的半宽，带湍流扰动 ---
                const widthAt = (t, turbSeed) => {
                    const base = topW + (botW - topW) * t;
                    const turb = Math.sin(spin * 4 + t * 9 + turbSeed) * base * 0.12
                               + Math.sin(spin * 7 + t * 14 + turbSeed * 2.3) * base * 0.06;
                    return base + turb;
                };

                // --- 辅助：画一个带湍流的漏斗路径 ---
                const funnelPath = (wMult, hMult, turbSeed) => {
                    const steps = 20;
                    const hh = halfH * hMult;
                    ctx.beginPath();
                    // 左侧从顶到底
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        const yy = -hh + t * hh * 2;
                        const w = widthAt(t, turbSeed) * wMult;
                        if (i === 0) ctx.moveTo(-w, yy);
                        else ctx.lineTo(-w, yy);
                    }
                    // 右侧从底到顶
                    for (let i = steps; i >= 0; i--) {
                        const t = i / steps;
                        const yy = -hh + t * hh * 2;
                        const w = widthAt(t, turbSeed + 5) * wMult;
                        ctx.lineTo(w, yy);
                    }
                    ctx.closePath();
                };

                // Layer 1: 最外层大气扰动光晕
                ctx.globalAlpha = 0.12 * lifeRatio;
                const outerGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
                outerGrad.addColorStop(0, 'rgba(120,180,220,0.3)');
                outerGrad.addColorStop(0.5, 'rgba(160,200,230,0.15)');
                outerGrad.addColorStop(1, 'rgba(80,130,170,0.05)');
                ctx.fillStyle = outerGrad;
                funnelPath(1.7, 1.05, 0);
                ctx.fill();

                // Layer 2: 外层暗色漏斗体
                ctx.globalAlpha = 0.38 * lifeRatio;
                const midGrad = ctx.createLinearGradient(0, -halfH, 0, halfH);
                midGrad.addColorStop(0, 'rgba(85,110,130,0.45)');
                midGrad.addColorStop(0.3, 'rgba(100,140,170,0.4)');
                midGrad.addColorStop(0.7, 'rgba(75,105,130,0.35)');
                midGrad.addColorStop(1, 'rgba(60,80,100,0.2)');
                ctx.fillStyle = midGrad;
                funnelPath(1.15, 1.0, 1);
                ctx.fill();

                // Layer 3: 中层亮色旋转体（向内收）
                ctx.globalAlpha = 0.5 * lifeRatio;
                const innerGrad = ctx.createLinearGradient(0, -halfH * 0.9, 0, halfH * 0.9);
                innerGrad.addColorStop(0, 'rgba(160,210,235,0.5)');
                innerGrad.addColorStop(0.4, 'rgba(190,225,245,0.4)');
                innerGrad.addColorStop(1, 'rgba(130,180,210,0.2)');
                ctx.fillStyle = innerGrad;
                funnelPath(0.75, 0.92, 2);
                ctx.fill();

                // Layer 4: 内核明亮通道
                ctx.globalAlpha = 0.6 * lifeRatio;
                const coreGrad = ctx.createLinearGradient(0, -halfH * 0.7, 0, halfH * 0.7);
                coreGrad.addColorStop(0, 'rgba(210,240,255,0.6)');
                coreGrad.addColorStop(0.5, 'rgba(235,248,255,0.5)');
                coreGrad.addColorStop(1, 'rgba(180,220,245,0.3)');
                ctx.fillStyle = coreGrad;
                funnelPath(0.35, 0.8, 3);
                ctx.fill();

                // === 旋转云带（多条沿漏斗体包裹的弧线，模拟旋转气流） ===
                const bandCount = 8;
                for (let b = 0; b < bandCount; b++) {
                    const baseT = ((b / bandCount) + spin * 0.12) % 1.0;
                    const ry = -halfH + baseT * H;
                    const wAtT = widthAt(baseT, b * 0.7);
                    // 用正弦波扰动宽度和位置模拟湍流
                    const waveOff = Math.sin(spin * 5 + b * 2.1) * wAtT * 0.08;
                    const bandW = wAtT * (0.9 + Math.sin(spin * 3.5 + b * 1.7) * 0.1) + waveOff;
                    const bandH = H * 0.018 + H * 0.012 * Math.sin(spin * 2.5 + b * 1.3);
                    const bandAlpha = (0.55 + Math.sin(spin * 4 + b) * 0.1 - Math.abs(baseT - 0.5) * 0.25) * lifeRatio;

                    ctx.globalAlpha = Math.max(0, bandAlpha);
                    // 颜色从暗灰蓝到亮白交替，模拟真实云层明暗
                    const brightness = 160 + Math.floor(Math.sin(b * 1.5 + spin) * 60);
                    ctx.strokeStyle = `rgba(${brightness},${brightness + 20},${brightness + 40},0.7)`;
                    ctx.lineWidth = (2.0 - baseT * 0.7) * lifeRatio;
                    ctx.beginPath();
                    ctx.ellipse(waveOff * 0.5, ry, bandW, bandH, Math.sin(spin + b) * 0.15, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // === 5条螺旋气流线（有粗细渐变和深度遮挡） ===
                const spiralArms = 5;
                const spiralSteps = 32;
                for (let arm = 0; arm < spiralArms; arm++) {
                    const armOffset = (arm / spiralArms) * Math.PI * 2;
                    ctx.beginPath();
                    let prevAlpha = 0;
                    for (let s = 0; s <= spiralSteps; s++) {
                        const t = s / spiralSteps;
                        const sy2 = -halfH + t * H;
                        const wAtT = widthAt(t, arm * 1.3);
                        const spiralAngle = armOffset + spin * 1.5 + t * Math.PI * 4;
                        const sx2 = Math.cos(spiralAngle) * wAtT;
                        // 模拟前后深度：cos > 0 = 前面亮，cos < 0 = 后面暗
                        const depthFade = 0.3 + Math.max(0, Math.cos(spiralAngle)) * 0.5;
                        if (s === 0) ctx.moveTo(sx2, sy2);
                        else ctx.lineTo(sx2, sy2);
                        prevAlpha = depthFade;
                    }
                    const armBright = 180 + arm * 15;
                    ctx.strokeStyle = `rgba(${armBright},${armBright + 15},${Math.min(255, armBright + 35)},0.5)`;
                    ctx.lineWidth = (2.5 - arm * 0.25) * lifeRatio;
                    ctx.globalAlpha = (0.6 + arm * 0.05) * lifeRatio;
                    ctx.stroke();
                }

                // === 顶部云团扩散（蘑菇云状喷射物） ===
                ctx.globalAlpha = 0.4 * lifeRatio;
                for (let c = 0; c < 5; c++) {
                    const ca = spin * 1.5 + c * 1.26;
                    const cx = Math.cos(ca) * topW * (1.0 + Math.sin(spin * 2.5 + c * 0.8) * 0.3);
                    const cy = -halfH - 3 - Math.abs(Math.sin(spin * 3 + c * 1.1)) * 8;
                    const cr = 4 + Math.sin(spin + c * 2) * 2;
                    const cloudGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 2);
                    cloudGrad.addColorStop(0, 'rgba(200,225,245,0.4)');
                    cloudGrad.addColorStop(1, 'rgba(160,200,230,0)');
                    ctx.fillStyle = cloudGrad;
                    ctx.beginPath();
                    ctx.arc(cx, cy, cr * 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                // === 底部尘土/碎屑飞扬 ===
                ctx.globalAlpha = 0.45 * lifeRatio;
                for (let d = 0; d < 6; d++) {
                    const da = spin * 2 + d * 1.05;
                    const dist = botW * (2 + Math.sin(spin * 3 + d * 1.4) * 1.5);
                    const dx = Math.cos(da) * dist;
                    const dy = halfH + Math.abs(Math.sin(da * 0.7)) * 5;
                    const dLen = 3 + Math.random() * 4;
                    const tang = da + Math.PI * 0.5;
                    const dustBright = 150 + Math.floor(Math.random() * 60);
                    ctx.strokeStyle = `rgba(${dustBright},${dustBright - 10},${dustBright - 30},0.5)`;
                    ctx.lineWidth = 1 + Math.random();
                    ctx.beginPath();
                    ctx.moveTo(dx, dy);
                    ctx.lineTo(dx + Math.cos(tang) * dLen, dy + Math.sin(tang) * dLen);
                    ctx.stroke();
                }
            } else if (p.type === 'necro_bolt') {
                // 灵魂弹外光
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#66eedd';
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius * 1.8, 0, Math.PI * 2);
                ctx.fill();
                // 核心
                ctx.globalAlpha = 1;
                ctx.fillStyle = '#44ccaa';
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius, 0, Math.PI * 2);
                ctx.fill();
                // 内核
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(sx, sy, p.radius * 0.35, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    clear() {
        this.projectiles.length = 0;
        this.attackTimer = 0;
    }
}
