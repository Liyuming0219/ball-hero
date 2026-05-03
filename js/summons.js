// ============================================
// 召唤物系统 - 亡灵师的亡灵军团
// 三种类型: skeleton(近战), skeleton_mage(法术), skeleton_tank(坦克嘲讽)
// + 灵魂巨兽 beast(被动满灵魂召唤)
// ============================================

// 召唤物属性继承配置表
const SummonDefs = {
    skeleton: {
        name: '骷髅战士',
        radius: 10,
        hpRatio: 0.35,          // 继承玩家 maxHp 的 35%
        baseHp: 30,
        speed: 185,
        dmgRatio: 0.5,          // 继承玩家攻击力的 50%
        attackRange: 30,
        attackInterval: 0.8,
        color: '#55ddbb',
        colors: ['#55ddbb', '#33bb99', '#88ffdd'],
        searchRange: 300,
    },
    skeleton_mage: {
        name: '骷髅法师',
        radius: 9,
        hpRatio: 0.25,          // 较脆
        baseHp: 20,
        speed: 150,
        dmgRatio: 0.7,          // 高伤害
        attackRange: 180,       // 远程
        attackInterval: 1.4,
        color: '#ff8844',
        colors: ['#ff8844', '#ff6622', '#ffaa66'],
        searchRange: 350,
    },
    skeleton_tank: {
        name: '骷髅守卫',
        radius: 14,
        hpRatio: 0.8,           // 高血量
        baseHp: 60,
        speed: 130,
        dmgRatio: 0.3,          // 低伤害
        attackRange: 25,
        attackInterval: 1.0,
        tauntRange: 120,        // 嘲讽范围
        color: '#4488ff',
        colors: ['#4488ff', '#2266dd', '#66aaff'],
        searchRange: 250,
    },
    beast: {
        name: '灵魂巨兽',
        radius: 22,
        hpRatio: 1.5,
        baseHp: 120,
        speed: 120,
        dmgRatio: 1.6,
        attackRange: 60,
        attackInterval: 1.2,
        color: '#66eedd',
        colors: ['#66eedd', '#44ccbb', '#aaffee'],
        searchRange: 400,
    },
};

// 牵引绳最大距离 — 召唤物不能跑太远
const LEASH_DIST = 250;
const LEASH_SNAP_DIST = 400; // 超过此距离直接传送回来

class Summon {
    constructor(x, y, type, owner) {
        this.x = x;
        this.y = y;
        this.type = type;       // 'skeleton' | 'skeleton_mage' | 'skeleton_tank' | 'beast'
        this.owner = owner;
        this.alive = true;
        this.bodyBob = Math.random() * Math.PI * 2;
        this.facingAngle = 0;
        this.attackTimer = 0;
        this.target = null;
        this._searchTimer = 0;

        const def = SummonDefs[type];
        this.def = def;
        this.radius = def.radius;
        this.speed = def.speed;
        this.attackRange = def.attackRange;
        this.attackInterval = def.attackInterval;
        this.color = def.color;
        this.colors = def.colors;

        // 属性继承玩家（可被 summonInheritBonus 加成提升）
        const inheritMult = 1 + (owner.bonuses.summonInheritBonus || 0);
        const ownerMaxHp = owner.getMaxHp();
        this.maxHp = Math.floor(def.baseHp + ownerMaxHp * def.hpRatio * inheritMult);
        this.hp = this.maxHp;

        this.damageFlash = 0;
        this.knockbackX = 0;
        this.knockbackY = 0;

        // 嘲讽光环计时 (仅 tank)
        this._tauntTimer = 0;
        // 法师火焰喷射状态
        this._flameActive = false;     // 是否正在喷火
        this._flameAngle = 0;          // 喷火方向
        this._flameDmgTimer = 0;       // 伤害tick计时器
        this._flameParticleTimer = 0;  // 粒子发射计时器
    }

    getDamage() {
        const summonDmgMult = this.owner.bonuses.summonDamageMult || 1;
        const inheritMult = 1 + (this.owner.bonuses.summonInheritBonus || 0);
        // 灵魂光环：每个灵魂+5%伤害
        const soulBonus = 1 + (this.owner.passive.souls || 0) * 0.05;
        return this.owner.getAttack() * this.def.dmgRatio * inheritMult * summonDmgMult * soulBonus;
    }

    getAttackInterval() {
        // 灵魂光环：每个灵魂-3%攻击间隔
        const soulReduction = 1 - (this.owner.passive.souls || 0) * 0.03;
        return this.attackInterval * Math.max(0.5, soulReduction);
    }

    // 召唤物按比例继承玩家暴击率和暴击伤害
    getCritRate() {
        const inheritMult = 1 + (this.owner.bonuses.summonInheritBonus || 0);
        return this.owner.getCritRate() * 0.5 * inheritMult; // 继承50%暴击率
    }

    getCritDamage() {
        return this.owner.getCritDamage(); // 暴击伤害完全继承
    }

    // 计算一次攻击的最终伤害（含暴击判定）
    calcDamage() {
        const base = this.getDamage();
        const isCrit = Math.random() < this.getCritRate();
        const damage = isCrit ? base * this.getCritDamage() : base;
        return { damage: Math.floor(damage), isCrit };
    }

    update(dt, enemies, particles, spatialHash) {
        if (!this.alive) return;

        this.bodyBob += 6 * dt;
        if (this.damageFlash > 0) this.damageFlash -= dt;
        this.attackTimer += dt;

        // 击退物理
        if (Math.abs(this.knockbackX) > 0.1 || Math.abs(this.knockbackY) > 0.1) {
            this.x += this.knockbackX * dt * 8;
            this.y += this.knockbackY * dt * 8;
            this.knockbackX *= 0.85;
            this.knockbackY *= 0.85;
        }

        // === 牵引绳机制：不能离主人太远 ===
        const dxOwner = this.owner.x - this.x;
        const dyOwner = this.owner.y - this.y;
        const distOwner = Math.sqrt(dxOwner * dxOwner + dyOwner * dyOwner);

        if (distOwner > LEASH_SNAP_DIST) {
            // 太远了，直接传送到主人身边
            const snapAngle = Math.random() * Math.PI * 2;
            this.x = this.owner.x + Math.cos(snapAngle) * 50;
            this.y = this.owner.y + Math.sin(snapAngle) * 50;
            particles.emit(this.x, this.y, 8, {
                colors: this.colors,
                speedMin: 2, speedMax: 5,
                sizeMin: 2, sizeMax: 4,
                lifeMin: 0.2, lifeMax: 0.5,
            });
            return;
        }

        const leashing = distOwner > LEASH_DIST;

        // 坦克嘲讽光环（每0.5秒刷新）
        if (this.type === 'skeleton_tank') {
            this._tauntTimer += dt;
            if (this._tauntTimer >= 0.5) {
                this._tauntTimer = 0;
                this._tauntNearby(enemies);
            }
        }

        // 寻找目标（每0.3秒搜索一次）
        this._searchTimer += dt;
        if (!this.target || !this.target.alive || this._searchTimer >= 0.3) {
            this._searchTimer = 0;
            // 牵引绳拉扯时不寻找新目标，回主人身边
            if (!leashing) {
                this.target = this._findTarget(enemies, spatialHash);
            } else {
                this.target = null;
            }
        }

        // AI行为
        if (leashing) {
            // 被拉回 — 快速移向主人
            this._flameActive = false;
            const nx = dxOwner / distOwner;
            const ny = dyOwner / distOwner;
            this.x += nx * this.speed * 1.5 * dt;
            this.y += ny * this.speed * 1.5 * dt;
            this.facingAngle = Math.atan2(dyOwner, dxOwner);
        } else if (this.target && this.target.alive) {
            const dx = this.target.x - this.x;
            const dy = this.target.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            this.facingAngle = Math.atan2(dy, dx);

            const effectiveRange = this.attackRange * (this.owner.bonuses.areaMult || 1);

            if (this.type === 'skeleton_mage') {
                // 火法师特殊逻辑：进入射程后持续喷火，超出射程则追赶
                if (dist > effectiveRange + this.target.radius) {
                    this._flameActive = false;
                    this.x += (dx / dist) * this.speed * dt;
                    this.y += (dy / dist) * this.speed * dt;
                } else {
                    // 在射程内：持续喷火
                    this._flameActive = true;
                    this._flameAngle = this.facingAngle;
                    this._updateFlameBreath(dt, enemies, particles, spatialHash);
                }
            } else if (dist > effectiveRange + this.target.radius) {
                this.x += (dx / dist) * this.speed * dt;
                this.y += (dy / dist) * this.speed * dt;
            } else {
                if (this.attackTimer >= this.getAttackInterval()) {
                    this.attackTimer = 0;
                    this._attack(this.target, enemies, particles);
                }
            }
        } else {
            // 无目标时跟随主人（保持一定距离）
            this._flameActive = false;
            if (distOwner > 80) {
                const nx = dxOwner / distOwner;
                const ny = dyOwner / distOwner;
                this.x += nx * this.speed * 0.8 * dt;
                this.y += ny * this.speed * 0.8 * dt;
                this.facingAngle = Math.atan2(dyOwner, dxOwner);
            }
        }
    }

    // ====== 骷髅法师：持续锥形火焰喷射 ======
    _updateFlameBreath(dt, enemies, particles, spatialHash) {
        const angle = this._flameAngle;
        const fireRange = this.attackRange * (this.owner.bonuses.areaMult || 1);
        const coneHalf = 0.45; // 锥形半角 ~25度

        // 伤害tick：每0.25秒对锥形内敌人造成一次伤害
        this._flameDmgTimer += dt;
        if (this._flameDmgTimer >= 0.25) {
            this._flameDmgTimer -= 0.25;
            const { damage, isCrit } = this.calcDamage();
            // 持续伤害为单次的40%（但每秒4次 = 1.6x DPS）
            const tickDmg = Math.floor(damage * 0.4);
            // 空间哈希缩小候选范围（只查火焰射程内的敌人）
            const candidates = spatialHash ? spatialHash.query(this.x, this.y, fireRange + 30) : enemies;
            for (const e of candidates) {
                if (!e.alive) continue;
                const dx = e.x - this.x, dy = e.y - this.y;
                const eDist = Math.sqrt(dx * dx + dy * dy);
                if (eDist > fireRange + e.radius) continue;
                const eAngle = Math.atan2(dy, dx);
                let angleDiff = eAngle - angle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                if (Math.abs(angleDiff) <= coneHalf) {
                    const a = eAngle;
                    e.takeDamage(tickDmg, particles, a, 3);
                    particles.addDamageText(e.x, e.y, tickDmg, isCrit, '#ffaa44');
                }
            }
        }

        // 火焰粒子：每帧持续喷射
        this._flameParticleTimer += dt;
        if (this._flameParticleTimer >= 0.04) {
            this._flameParticleTimer -= 0.04;
            // 沿锥形散射多个火焰粒子
            const count = 3;
            for (let i = 0; i < count; i++) {
                const spread = (Math.random() - 0.5) * coneHalf * 2;
                const a = angle + spread;
                const speed = 180 + Math.random() * 120;
                const startDist = this.radius + 4;
                particles.emit(
                    this.x + Math.cos(a) * startDist,
                    this.y + Math.sin(a) * startDist,
                    1,
                    {
                        colors: ['#ff4400', '#ff8822', '#ffcc44', '#ffff66'],
                        speedMin: speed * 0.8,
                        speedMax: speed * 1.2,
                        sizeMin: 3,
                        sizeMax: 6,
                        lifeMin: 0.15,
                        lifeMax: 0.35,
                        glow: true,
                        angle: a,
                        spread: 0.15,
                    }
                );
            }
        }
    }

    // 坦克嘲讽：让范围内敌人的目标锁定为自己
    _tauntNearby(enemies) {
        const range = this.def.tauntRange || 0;
        if (range <= 0) return;
        for (const e of enemies) {
            if (!e.alive) continue;
            if (Utils.dist(this.x, this.y, e.x, e.y) < range + e.radius) {
                e._tauntTarget = this;  // 敌人 AI 优先攻击此目标
                e._tauntTime = 1.5;     // 嘲讽持续 1.5 秒
            }
        }
    }

    _findTarget(enemies, spatialHash) {
        let nearest = null;
        let nearestDistSq = this.def.searchRange * this.def.searchRange;
        // 用空间哈希缩小候选范围（从N个敌人→只查附近格子里的）
        const candidates = spatialHash ? spatialHash.query(this.x, this.y, this.def.searchRange) : enemies;
        for (const e of candidates) {
            if (!e.alive) continue;
            const dx = e.x - this.x, dy = e.y - this.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < nearestDistSq) {
                nearestDistSq = dSq;
                nearest = e;
            }
        }
        return nearest;
    }

    _attack(target, enemies, particles) {
        const angle = Utils.angle(this.x, this.y, target.x, target.y);

        if (this.type === 'skeleton') {
            // 近战骷髅：单体挥砍（含暴击）
            const { damage, isCrit } = this.calcDamage();
            const died = target.takeDamage(damage, particles, angle, 5);
            particles.addDamageText(target.x, target.y, damage, isCrit, this.color);
            particles.addFlash(target.x, target.y, this.color, 20, 0.1);
            particles.addSlashArc(
                this.x, this.y,
                angle - 0.4, angle + 0.4,
                this.attackRange + 10,
                this.color, 0.15
            );
            if (isCrit) particles.explode(target.x, target.y, this.colors, 6, 3);
            Utils.shake(isCrit ? 3 : 1);
            return died;

        } else if (this.type === 'skeleton_mage') {
            // 法师骷髅：喷火/火球（扇形AOE，含暴击）
            const fireRange = this.attackRange * (this.owner.bonuses.areaMult || 1);
            const fireAngle = 0.6; // 扇形半角约35度

            // 喷火特效 — 扇形粒子
            particles.addSlashArc(
                this.x, this.y,
                angle - fireAngle, angle + fireAngle,
                fireRange,
                '#ff6622', 0.25
            );
            particles.emit(this.x + Math.cos(angle) * 20, this.y + Math.sin(angle) * 20, 12, {
                colors: this.colors,
                speedMin: 3, speedMax: 8,
                sizeMin: 2, sizeMax: 5,
                lifeMin: 0.15, lifeMax: 0.4,
                glow: true,
            });

            // 对扇形范围内的敌人造成伤害
            const { damage, isCrit } = this.calcDamage();
            let hitAny = false;
            for (const e of enemies) {
                if (!e.alive) continue;
                const eDist = Utils.dist(this.x, this.y, e.x, e.y);
                if (eDist > fireRange + e.radius) continue;
                // 检查是否在扇形内
                const eAngle = Utils.angle(this.x, this.y, e.x, e.y);
                let angleDiff = eAngle - angle;
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                if (Math.abs(angleDiff) <= fireAngle + 0.2) {
                    const a = Utils.angle(this.x, this.y, e.x, e.y);
                    const d = e.takeDamage(damage, particles, a, 6);
                    particles.addDamageText(e.x, e.y, damage, isCrit, '#ffaa44');
                    if (d) hitAny = true;
                }
            }
            Utils.shake(2);
            return hitAny;

        } else if (this.type === 'skeleton_tank') {
            // 坦克骷髅：锤击 + 小范围击退（含暴击）
            const { damage, isCrit } = this.calcDamage();
            const smashRange = (this.attackRange + 15) * (this.owner.bonuses.areaMult || 1);
            particles.addShockwave(this.x, this.y, this.color, smashRange, 0.2);
            particles.addFlash(this.x, this.y, '#6699ff', 30, 0.15);
            Utils.shake(2);

            let hitAny = false;
            for (const e of enemies) {
                if (!e.alive) continue;
                if (Utils.dist(this.x, this.y, e.x, e.y) < smashRange + e.radius) {
                    const a = Utils.angle(this.x, this.y, e.x, e.y);
                    const d = e.takeDamage(damage, particles, a, 12); // 强击退
                    particles.addDamageText(e.x, e.y, damage, isCrit, '#66aaff');
                    if (d) hitAny = true;
                }
            }
            return hitAny;

        } else if (this.type === 'beast') {
            // 灵魂巨兽：范围重击（含暴击）
            const { damage, isCrit } = this.calcDamage();
            const range = this.attackRange * (this.owner.bonuses.areaMult || 1);
            particles.addShockwave(this.x, this.y, '#66eedd', range, 0.3);
            particles.emit(this.x, this.y, 15, {
                colors: ['#66eedd', '#44ccbb', '#aaffee'],
                speedMin: 2, speedMax: 6,
                sizeMin: 2, sizeMax: 5,
                lifeMin: 0.2, lifeMax: 0.5,
                glow: true,
            });
            Utils.shake(isCrit ? 5 : 3);

            for (const e of enemies) {
                if (!e.alive) continue;
                if (Utils.dist(this.x, this.y, e.x, e.y) < range + e.radius) {
                    const a = Utils.angle(this.x, this.y, e.x, e.y);
                    const d = e.takeDamage(damage, particles, a, 10);
                    particles.addDamageText(e.x, e.y, damage, isCrit, '#aaffee');
                    if (d) return true;
                }
            }
            return false;
        }
    }

    takeDamage(amount, particles) {
        this.hp -= amount;
        this.damageFlash = 0.15;
        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            particles.explode(this.x, this.y, this.colors, 12, 4);
            if (this.owner.bonuses.summonDeathExplode) {
                return { explode: true, x: this.x, y: this.y, damage: this.getDamage() * 1.5 };
            }
        }
        return null;
    }

    // ===================== 渲染 =====================
    render(ctx, camera, screenW, screenH) {
        if (!this.alive) return;
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;

        const margin = this.radius + 30;
        if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) return;

        const bob = Math.sin(this.bodyBob) * 2;

        ctx.save();
        ctx.globalAlpha = 1;

        if (this.type === 'skeleton') {
            this._renderSkeleton(ctx, sx, sy, bob);
        } else if (this.type === 'skeleton_mage') {
            this._renderMage(ctx, sx, sy, bob);
        } else if (this.type === 'skeleton_tank') {
            this._renderTank(ctx, sx, sy, bob);
        } else if (this.type === 'beast') {
            this._renderBeast(ctx, sx, sy, bob);
        }

        // 血条
        if (this.hp < this.maxHp) {
            const barW = this.radius * 2.5;
            const barH = 3;
            const barY = sy - this.radius - 8 + bob;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(sx - barW / 2, barY, barW, barH);
            const ratio = this.hp / this.maxHp;
            ctx.fillStyle = ratio > 0.5 ? '#44ffaa' : '#ffaa44';
            ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
        }

        ctx.restore();
    }

    // --- 近战骷髅渲染 ---
    _renderSkeleton(ctx, sx, sy, bob) {
        // 脚下阴影
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy + this.radius + 2, this.radius * 1.1, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 身体外光晕
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius + 5, 0, Math.PI * 2);
        ctx.fill();

        // 身体
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 头骨高光
        ctx.fillStyle = '#ddfff8';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(sx - 1, sy - 2 + bob, this.radius * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#22ff88';
        const ex = sx + Math.cos(this.facingAngle) * 3;
        const ey = sy + Math.sin(this.facingAngle) * 3 + bob;
        ctx.beginPath(); ctx.arc(ex - 3.5, ey - 1, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 3.5, ey - 1, 2.5, 0, Math.PI * 2); ctx.fill();

        // 武器（骨棒）
        const wpnDist = this.radius + 3;
        const wpnX = sx + Math.cos(this.facingAngle) * wpnDist;
        const wpnY = sy + Math.sin(this.facingAngle) * wpnDist + bob;
        ctx.save();
        ctx.translate(wpnX, wpnY);
        ctx.rotate(this.facingAngle + (this.attackTimer < 0.15 ? 0.5 : 0));
        ctx.fillStyle = '#ccddcc';
        ctx.fillRect(-1.5, -7, 3, 14);
        ctx.fillStyle = '#aabbaa';
        ctx.beginPath(); ctx.arc(0, -7, 3, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    // --- 法师骷髅渲染（橙红色 + 法杖 + 火焰喷射） ---
    _renderMage(ctx, sx, sy, bob) {
        // 阴影
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy + this.radius + 2, this.radius * 1.1, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // 喷火时：渲染逼真锥形火焰（多层渐变 + 湍流扰动 + 热浪）
        if (this._flameActive) {
            const flameRange = this.attackRange * (this.owner.bonuses.areaMult || 1);
            const coneHalf = 0.45;
            const time = this.bodyBob * 6; // 动画时间驱动
            const flicker = 0.92 + Math.sin(time * 2.3) * 0.08;

            ctx.save();
            ctx.translate(sx, sy + bob);
            ctx.rotate(this._flameAngle);
            // 现在 +X 方向 = 喷火方向

            // --- 辅助：沿火焰方向 d (0~1) 处的锥形半宽，带湍流 ---
            const coneWidthAt = (d, seed) => {
                const base = d * flameRange * Math.tan(coneHalf) * flicker;
                const turb = Math.sin(time * 5 + d * 8 + seed) * base * 0.15
                           + Math.sin(time * 8 + d * 13 + seed * 2.7) * base * 0.08;
                return Math.max(1, base + turb);
            };

            // --- 辅助：画带湍流的火焰锥路径 ---
            const flamePath = (rangeMult, widthMult, seed) => {
                const steps = 16;
                const maxR = flameRange * rangeMult * flicker;
                ctx.beginPath();
                // 上边缘
                ctx.moveTo(0, 0);
                for (let i = 1; i <= steps; i++) {
                    const d = i / steps;
                    const px = d * maxR;
                    const py = -coneWidthAt(d, seed) * widthMult;
                    ctx.lineTo(px, py);
                }
                // 下边缘（反向）
                for (let i = steps; i >= 1; i--) {
                    const d = i / steps;
                    const px = d * maxR;
                    const py = coneWidthAt(d, seed + 3) * widthMult;
                    ctx.lineTo(px, py);
                }
                ctx.closePath();
            };

            // Layer 1: 最外层热浪扭曲（极淡，宽范围）
            ctx.globalAlpha = 0.06;
            const heatGrad = ctx.createLinearGradient(0, 0, flameRange * 1.1, 0);
            heatGrad.addColorStop(0, 'rgba(255,100,0,0.2)');
            heatGrad.addColorStop(0.5, 'rgba(255,60,0,0.08)');
            heatGrad.addColorStop(1, 'rgba(255,30,0,0)');
            ctx.fillStyle = heatGrad;
            flamePath(1.1, 1.4, 0);
            ctx.fill();

            // Layer 2: 外层红焰（暗红→透明）
            ctx.globalAlpha = 0.15;
            const outerGrad = ctx.createLinearGradient(0, 0, flameRange, 0);
            outerGrad.addColorStop(0, 'rgba(255,80,0,0.7)');
            outerGrad.addColorStop(0.3, 'rgba(255,50,0,0.5)');
            outerGrad.addColorStop(0.7, 'rgba(200,30,0,0.25)');
            outerGrad.addColorStop(1, 'rgba(120,10,0,0)');
            ctx.fillStyle = outerGrad;
            flamePath(1.0, 1.15, 1);
            ctx.fill();

            // Layer 3: 中层橙焰（主体）
            ctx.globalAlpha = 0.25;
            const midGrad = ctx.createLinearGradient(0, 0, flameRange * 0.8, 0);
            midGrad.addColorStop(0, 'rgba(255,180,40,0.8)');
            midGrad.addColorStop(0.3, 'rgba(255,140,20,0.6)');
            midGrad.addColorStop(0.6, 'rgba(255,100,10,0.35)');
            midGrad.addColorStop(1, 'rgba(220,60,0,0.05)');
            ctx.fillStyle = midGrad;
            flamePath(0.8, 0.85, 2);
            ctx.fill();

            // Layer 4: 内层亮黄核心
            ctx.globalAlpha = 0.35;
            const coreGrad = ctx.createLinearGradient(0, 0, flameRange * 0.5, 0);
            coreGrad.addColorStop(0, 'rgba(255,255,180,0.9)');
            coreGrad.addColorStop(0.3, 'rgba(255,240,100,0.7)');
            coreGrad.addColorStop(0.7, 'rgba(255,200,50,0.3)');
            coreGrad.addColorStop(1, 'rgba(255,160,30,0)');
            ctx.fillStyle = coreGrad;
            flamePath(0.5, 0.5, 3);
            ctx.fill();

            // Layer 5: 最内层白热（极亮短距离）
            ctx.globalAlpha = 0.45;
            const whiteGrad = ctx.createLinearGradient(0, 0, flameRange * 0.25, 0);
            whiteGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
            whiteGrad.addColorStop(0.5, 'rgba(255,255,200,0.5)');
            whiteGrad.addColorStop(1, 'rgba(255,240,150,0)');
            ctx.fillStyle = whiteGrad;
            flamePath(0.25, 0.3, 4);
            ctx.fill();

            // === 火焰舌状扰动线（沿锥体的不规则火舌） ===
            const tongueCount = 6;
            for (let t = 0; t < tongueCount; t++) {
                const tAngle = (t / tongueCount - 0.5) * coneHalf * 1.6;
                const tLen = flameRange * (0.5 + Math.sin(time * 4 + t * 2.1) * 0.3) * flicker;
                const tWobbleY = Math.sin(time * 6 + t * 1.7) * tLen * 0.06;
                const brightness = 200 + Math.floor(Math.sin(time * 3 + t) * 55);
                const r = Math.min(255, brightness + 55);
                const g = Math.min(255, Math.floor(brightness * 0.55));
                const b2 = Math.floor(brightness * 0.1);
                ctx.globalAlpha = (0.2 + Math.sin(time * 5 + t * 1.3) * 0.1);
                ctx.strokeStyle = `rgba(${r},${g},${b2},0.6)`;
                ctx.lineWidth = 1.5 + Math.sin(time + t) * 0.5;
                ctx.beginPath();
                ctx.moveTo(6, tAngle * 8);
                // 多段贝塞尔模拟火舌弯曲
                const mid1 = tLen * 0.35;
                const mid2 = tLen * 0.7;
                ctx.quadraticCurveTo(mid1, tAngle * mid1 + tWobbleY, mid2, tAngle * mid2 - tWobbleY * 0.5);
                ctx.lineTo(tLen, tAngle * tLen + tWobbleY * 1.5);
                ctx.stroke();
            }

            // === 火花飞溅（锥形末端小亮点） ===
            ctx.globalAlpha = 0.5;
            for (let sp = 0; sp < 4; sp++) {
                const spDist = flameRange * (0.6 + Math.sin(time * 3 + sp * 1.8) * 0.35) * flicker;
                const spAngle = (Math.sin(time * 4.5 + sp * 2.3) * 0.5) * coneHalf;
                const spX = spDist;
                const spY = spAngle * spDist;
                const spR = 1.5 + Math.sin(time * 6 + sp) * 0.8;
                const sparkGrad = ctx.createRadialGradient(spX, spY, 0, spX, spY, spR * 3);
                sparkGrad.addColorStop(0, 'rgba(255,255,200,0.8)');
                sparkGrad.addColorStop(0.4, 'rgba(255,200,50,0.3)');
                sparkGrad.addColorStop(1, 'rgba(255,100,0,0)');
                ctx.fillStyle = sparkGrad;
                ctx.beginPath();
                ctx.arc(spX, spY, spR * 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        // 火焰光环（脉动）
        const pulse = 1 + Math.sin(this.bodyBob * 3) * 0.15;
        ctx.globalAlpha = this._flameActive ? 0.2 : 0.12;
        ctx.fillStyle = '#ff6622';
        ctx.beginPath();
        ctx.arc(sx, sy + bob, (this.radius + 10) * pulse, 0, Math.PI * 2);
        ctx.fill();

        // 身体
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 头骨高光
        ctx.fillStyle = '#ffe8cc';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(sx - 1, sy - 2 + bob, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 火焰眼睛
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffdd00';
        const ex = sx + Math.cos(this.facingAngle) * 2.5;
        const ey = sy + Math.sin(this.facingAngle) * 2.5 + bob;
        ctx.beginPath(); ctx.arc(ex - 3, ey - 1, 2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 3, ey - 1, 2, 0, Math.PI * 2); ctx.fill();
        // 眼睛光晕
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = '#ff8800';
        ctx.beginPath(); ctx.arc(ex - 3, ey - 1, 4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 3, ey - 1, 4, 0, Math.PI * 2); ctx.fill();

        // 法杖
        ctx.globalAlpha = 1;
        const staffDist = this.radius + 5;
        const staffX = sx + Math.cos(this.facingAngle) * staffDist;
        const staffY = sy + Math.sin(this.facingAngle) * staffDist + bob;
        ctx.save();
        ctx.translate(staffX, staffY);
        ctx.rotate(this.facingAngle + 0.2);
        ctx.fillStyle = '#8B4513'; // 木棒
        ctx.fillRect(-1.5, -10, 3, 20);
        // 杖顶火焰
        ctx.fillStyle = '#ff4400';
        ctx.beginPath(); ctx.arc(0, -10, 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.arc(0, -10, 6, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    // --- 坦克骷髅渲染（蓝色 + 盾牌 + 嘲讽光环） ---
    _renderTank(ctx, sx, sy, bob) {
        // 阴影
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy + this.radius + 3, this.radius * 1.2, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // 嘲讽光环（蓝色脉动圈）
        if (this.def.tauntRange) {
            const pulse = 1 + Math.sin(this.bodyBob * 2) * 0.08;
            ctx.globalAlpha = 0.08;
            ctx.strokeStyle = '#4488ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.def.tauntRange * pulse, 0, Math.PI * 2);
            ctx.stroke();
        }

        // 身体外光晕
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        // 身体（较大）
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 头骨高光
        ctx.fillStyle = '#ccddef';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(sx - 1, sy - 2 + bob, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // 蓝色眼睛
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#88ccff';
        const ex = sx + Math.cos(this.facingAngle) * 4;
        const ey = sy + Math.sin(this.facingAngle) * 4 + bob;
        ctx.beginPath(); ctx.arc(ex - 4, ey - 1, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex + 4, ey - 1, 2.5, 0, Math.PI * 2); ctx.fill();

        // 盾牌（在面朝方向）
        const shieldDist = this.radius + 2;
        const shieldX = sx + Math.cos(this.facingAngle) * shieldDist;
        const shieldY = sy + Math.sin(this.facingAngle) * shieldDist + bob;
        ctx.save();
        ctx.translate(shieldX, shieldY);
        ctx.rotate(this.facingAngle);
        // 盾牌形状
        ctx.fillStyle = '#3366cc';
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(6, -4);
        ctx.lineTo(6, 4);
        ctx.lineTo(0, 9);
        ctx.lineTo(-6, 4);
        ctx.lineTo(-6, -4);
        ctx.closePath();
        ctx.fill();
        // 盾牌高光
        ctx.fillStyle = '#6699ff';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(3, -2);
        ctx.lineTo(0, 5);
        ctx.lineTo(-3, -2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // --- 灵魂巨兽渲染 ---
    _renderBeast(ctx, sx, sy, bob) {
        // 脚下阴影
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy + this.radius + 3, this.radius * 1.3, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // 灵魂光环（外圈脉动）
        const pulse = 1 + Math.sin(this.bodyBob * 2) * 0.1;
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#aaffee';
        ctx.beginPath();
        ctx.arc(sx, sy + bob, (this.radius + 15) * pulse, 0, Math.PI * 2);
        ctx.fill();

        // 外光晕
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius + 8, 0, Math.PI * 2);
        ctx.fill();

        // 主体
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 头骨纹路
        ctx.fillStyle = '#eeffee';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy - 3 + bob, this.radius * 0.65, 0, Math.PI * 2);
        ctx.fill();

        // 下巴
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#ddeedd';
        ctx.fillRect(sx - 8, sy + 7 + bob, 16, 6);

        // 大眼睛
        ctx.globalAlpha = 1;
        const eyeSize = 4;
        const eyeOff = 6;
        ctx.fillStyle = '#22ffaa';
        ctx.beginPath(); ctx.arc(sx - eyeOff, sy - 4 + bob, eyeSize, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx + eyeOff, sy - 4 + bob, eyeSize, 0, Math.PI * 2); ctx.fill();

        // 眼睛内光
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(sx - eyeOff, sy - 4 + bob, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(sx + eyeOff, sy - 4 + bob, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();

        // 头顶角
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#44ccaa';
        ctx.beginPath();
        ctx.moveTo(sx - 10, sy - this.radius + 2 + bob);
        ctx.lineTo(sx - 6, sy - this.radius - 8 + bob);
        ctx.lineTo(sx - 2, sy - this.radius + 2 + bob);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx + 2, sy - this.radius + 2 + bob);
        ctx.lineTo(sx + 6, sy - this.radius - 8 + bob);
        ctx.lineTo(sx + 10, sy - this.radius + 2 + bob);
        ctx.closePath();
        ctx.fill();

        // 灵魂粒子环绕
        for (let i = 0; i < 4; i++) {
            const orbAngle = this.bodyBob * 1.5 + (i / 4) * Math.PI * 2;
            const orbR = this.radius + 10;
            const ox = sx + Math.cos(orbAngle) * orbR;
            const oy = sy + Math.sin(orbAngle) * orbR + bob;
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#aaffee';
            ctx.beginPath(); ctx.arc(ox, oy, 3, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 0.2;
            ctx.beginPath(); ctx.arc(ox, oy, 6, 0, Math.PI * 2); ctx.fill();
        }
    }
}

// ===================== 召唤物管理器 =====================
class SummonManager {
    constructor(player, particles) {
        this.player = player;
        this.particles = particles;
        this.summons = [];
        this.maxSummons = 5;       // 总上限（不含巨兽）
        // 已解锁的召唤物种类
        this.unlockedTypes = ['skeleton']; // 初始只有近战骷髅
    }

    getCountByType(type) {
        return this.summons.filter(s => s.alive && s.type === type).length;
    }

    getTotalCount() {
        // 不含巨兽
        return this.summons.filter(s => s.alive && s.type !== 'beast').length;
    }

    getBeastCount() {
        return this.summons.filter(s => s.alive && s.type === 'beast').length;
    }

    // 解锁新的召唤物种类
    unlockType(type) {
        if (!this.unlockedTypes.includes(type)) {
            this.unlockedTypes.push(type);
        }
    }

    // 智能召唤：轮换已解锁的类型
    spawnNext(x, y) {
        if (this.getTotalCount() >= this.maxSummons) {
            // 已满，替换最老的
            this._removeOldest();
        }

        // 选择当前数量最少的已解锁类型
        let bestType = this.unlockedTypes[0];
        let bestCount = Infinity;
        for (const type of this.unlockedTypes) {
            const count = this.getCountByType(type);
            if (count < bestCount) {
                bestCount = count;
                bestType = type;
            }
        }

        return this._spawn(x, y, bestType);
    }

    // 指定类型召唤
    spawnType(x, y, type) {
        if (this.getTotalCount() >= this.maxSummons) {
            this._removeOldest();
        }
        return this._spawn(x, y, type);
    }

    _removeOldest() {
        for (let i = 0; i < this.summons.length; i++) {
            const s = this.summons[i];
            if (s.type !== 'beast' && s.alive) {
                s.alive = false;
                this.particles.emit(s.x, s.y, 6, {
                    colors: s.colors,
                    speedMin: 1, speedMax: 3,
                    sizeMin: 2, sizeMax: 4,
                    lifeMin: 0.2, lifeMax: 0.4,
                });
                break;
            }
        }
    }

    _spawn(x, y, type) {
        const s = new Summon(x, y, type, this.player);
        // 应用移速加成
        if (this.player.bonuses.summonSpeedBonus) {
            s.speed *= (1 + this.player.bonuses.summonSpeedBonus);
        }
        this.summons.push(s);

        // 召唤特效
        const def = SummonDefs[type];
        this.particles.addShockwave(x, y, def.color, 40, 0.25);
        this.particles.emit(x, y, 12, {
            colors: def.colors,
            speedMin: 2, speedMax: 5,
            sizeMin: 2, sizeMax: 5,
            lifeMin: 0.3, lifeMax: 0.6,
            glow: true,
        });

        return s;
    }

    // 召唤灵魂巨兽（不占普通上限）
    spawnBeast(x, y) {
        // 一次最多一只巨兽
        for (const s of this.summons) {
            if (s.type === 'beast' && s.alive) {
                s.hp = s.maxHp;
                this.particles.addShockwave(s.x, s.y, '#66eedd', 80, 0.4);
                return s;
            }
        }

        const s = new Summon(x, y, 'beast', this.player);
        if (this.player.bonuses.summonSpeedBonus) {
            s.speed *= (1 + this.player.bonuses.summonSpeedBonus);
        }
        this.summons.push(s);

        // 大型召唤特效
        this.particles.addShockwave(x, y, '#66eedd', 100, 0.4);
        this.particles.addShockwave(x, y, '#44ccbb', 70, 0.3);
        this.particles.emit(x, y, 25, {
            colors: ['#66eedd', '#44ccbb', '#aaffee', '#ffffff'],
            speedMin: 3, speedMax: 8,
            sizeMin: 3, sizeMax: 7,
            lifeMin: 0.4, lifeMax: 0.9,
            glow: true,
            glowSize: 10,
        });
        this.particles.addFlash(x, y, '#aaffee', 80, 0.3);
        Utils.shake(6);

        return s;
    }

    update(dt, enemies, spatialHash) {
        for (let i = this.summons.length - 1; i >= 0; i--) {
            const s = this.summons[i];
            s.update(dt, enemies, this.particles, spatialHash);
            if (!s.alive) {
                this.summons[i] = this.summons[this.summons.length - 1]; this.summons.pop();
            }
        }
    }

    render(ctx, camera, screenW, screenH) {
        for (const s of this.summons) {
            s.render(ctx, camera, screenW, screenH);
        }
    }

    checkEnemyCollisions(enemies) {
        const results = [];
        for (const s of this.summons) {
            if (!s.alive) continue;
            for (const e of enemies) {
                if (!e.alive) continue;
                if (Utils.circleCollision(s.x, s.y, s.radius, e.x, e.y, e.radius)) {
                    if (!s._collisionCD || s._collisionCD <= 0) {
                        s._collisionCD = 0.5;
                        // 坦克受到的碰撞伤害减半
                        const dmgMult = s.type === 'skeleton_tank' ? 0.25 : 0.5;
                        const result = s.takeDamage(e.damage * dmgMult, this.particles);
                        if (result && result.explode) {
                            results.push(result);
                        }
                    }
                    const pushAngle = Utils.angle(s.x, s.y, e.x, e.y);
                    e.x += Math.cos(pushAngle) * 2;
                    e.y += Math.sin(pushAngle) * 2;
                }
            }
        }
        return results;
    }

    updateCollisionCD(dt) {
        for (const s of this.summons) {
            if (s._collisionCD > 0) s._collisionCD -= dt;
        }
    }

    clear() {
        this.summons.length = 0;
    }
}
