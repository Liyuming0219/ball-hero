// ============================================
// 怪物系统 - 生成、AI、波次管理
// ============================================

const EnemyTypes = {
    // 普通小怪 - 骷髅
    skeleton: {
        name: '骷髅',
        color: '#aabbaa',
        colors: ['#aabbaa', '#88aa88'],
        radius: 12,
        hp: 15,
        damage: 5,
        speed: 55,
        exp: 3,
        score: 10,
    },
    // 快速小怪 - 蝙蝠
    bat: {
        name: '蝙蝠',
        color: '#8866aa',
        colors: ['#8866aa', '#aa88cc'],
        radius: 10,
        hp: 10,
        damage: 3,
        speed: 90,
        exp: 2,
        score: 8,
    },
    // 肉盾 - 史莱姆
    slime: {
        name: '史莱姆',
        color: '#44cc66',
        colors: ['#44cc66', '#66ee88'],
        radius: 18,
        hp: 45,
        damage: 8,
        speed: 35,
        exp: 5,
        score: 15,
    },
    // 远程 - 骷髅法师
    skeletonMage: {
        name: '骷髅法师',
        color: '#6644aa',
        colors: ['#6644aa', '#8866cc'],
        radius: 13,
        hp: 20,
        damage: 10,
        speed: 42,
        exp: 6,
        score: 20,
        ranged: true,
        shootInterval: 6.0,
    },
    // 中期快攻 - 暗影狼
    shadowWolf: {
        name: '暗影狼',
        color: '#445566',
        colors: ['#445566', '#667788'],
        radius: 11,
        hp: 25,
        damage: 7,
        speed: 110,
        exp: 4,
        score: 14,
    },
    // 中期肉盾 - 石像鬼
    gargoyle: {
        name: '石像鬼',
        color: '#887766',
        colors: ['#887766', '#aa9988'],
        radius: 20,
        hp: 80,
        damage: 12,
        speed: 30,
        exp: 8,
        score: 22,
    },
    // 后期远程 - 恶魔术士
    demonCaster: {
        name: '恶魔术士',
        color: '#cc3366',
        colors: ['#cc3366', '#ee5588'],
        radius: 14,
        hp: 40,
        damage: 18,
        speed: 38,
        exp: 10,
        score: 30,
        ranged: true,
        shootInterval: 4.0,
    },
    // 后期群攻 - 爆破虫
    exploder: {
        name: '爆破虫',
        color: '#ff8800',
        colors: ['#ff8800', '#ffaa22'],
        radius: 9,
        hp: 18,
        damage: 25,
        speed: 100,
        exp: 5,
        score: 18,
        isSuicidal: true,  // 近身自爆
    },
    // 精英 - 大骷髅
    eliteSkeleton: {
        name: '骷髅将军',
        color: '#cc4444',
        colors: ['#cc4444', '#ff6644'],
        radius: 22,
        hp: 150,
        damage: 15,
        speed: 45,
        exp: 25,
        score: 50,
        isElite: true,
    },
    // 后期精英 - 暗夜领主
    eliteDemon: {
        name: '暗夜领主',
        color: '#aa2255',
        colors: ['#aa2255', '#cc4477'],
        radius: 24,
        hp: 300,
        damage: 22,
        speed: 50,
        exp: 40,
        score: 80,
        isElite: true,
    },
    // Boss - 骷髅王（基础定义，实际Boss通过BossVariants增强）
    boss: {
        name: '骷髅王',
        color: '#ff2222',
        colors: ['#ff2222', '#ff4444', '#ffaa00'],
        radius: 35,
        hp: 1000,
        damage: 20,
        speed: 32,
        exp: 120,
        score: 500,
        isBoss: true,
    },
};

// ============================================
// 精英词缀系统 - 随机词缀让精英更有特色
// ============================================
const EliteAffixes = {
    swift: {
        name: '疾速',
        color: '#44ddff',
        apply(e) { e.speed *= 1.5; e.affixName = '疾速'; e.affixColor = '#44ddff'; }
    },
    thorny: {
        name: '荆棘',
        color: '#44ff44',
        apply(e) { e._thorny = true; e.affixName = '荆棘'; e.affixColor = '#44ff44'; }
    },
    vampiric: {
        name: '吸血',
        color: '#ff44aa',
        apply(e) { e._vampiric = true; e.affixName = '吸血'; e.affixColor = '#ff44aa'; }
    },
    shielded: {
        name: '护盾',
        color: '#aaaaff',
        apply(e) {
            e._shielded = true;
            e._shieldHp = e.maxHp * 0.3;
            e._maxShieldHp = e._shieldHp;
            e.affixName = '护盾';
            e.affixColor = '#aaaaff';
        }
    },
    splitting: {
        name: '分裂',
        color: '#ffaa44',
        apply(e) { e._splitting = true; e.affixName = '分裂'; e.affixColor = '#ffaa44'; }
    },
};
const ELITE_AFFIX_KEYS = Object.keys(EliteAffixes);

// ============================================
// Boss变体定义 - 不同Boss有不同攻击模式
// ============================================
const BossVariants = [
    { name: '骷髅王', color: '#ff2222', colors: ['#ff2222', '#ff4444', '#ffaa00'], pattern: 'charge' },
    { name: '亡灵巫师', color: '#8844ff', colors: ['#8844ff', '#aa66ff', '#cc88ff'], pattern: 'summoner' },
    { name: '深渊巨兽', color: '#44aaff', colors: ['#44aaff', '#66ccff', '#88eeff'], pattern: 'slam' },
    { name: '虚空射手', color: '#ff44aa', colors: ['#ff44aa', '#ff66cc', '#ff88ee'], pattern: 'bulletHell' },
    { name: '炎魔领主', color: '#ff6600', colors: ['#ff6600', '#ff8822', '#ffaa44'], pattern: 'charge' },
    { name: '冰霜女巫', color: '#66bbff', colors: ['#66bbff', '#88ddff', '#aaeeff'], pattern: 'summoner' },
    { name: '末日巨龙', color: '#cc2244', colors: ['#cc2244', '#ee4466', '#ff6688'], pattern: 'slam' },
    { name: '混沌之眼', color: '#bb44dd', colors: ['#bb44dd', '#dd66ff', '#ff88ff'], pattern: 'bulletHell' },
];

class Enemy {
    constructor(type, x, y, waveMultiplier = 1) {
        this.type = type;
        const def = EnemyTypes[type];
        this.x = x;
        this.y = y;
        this.radius = def.radius;
        this.maxHp = Math.floor(def.hp * waveMultiplier);
        this.hp = this.maxHp;
        this.damage = Math.floor(def.damage * waveMultiplier);
        this.speed = def.speed;
        this.exp = Math.floor(def.exp * Math.sqrt(waveMultiplier));
        this.score = def.score;
        this.color = def.color;
        this.colors = def.colors;
        this.name = def.name;
        this.isElite = def.isElite || false;
        this.isBoss = def.isBoss || false;
        this.ranged = def.ranged || false;
        this.shootTimer = 0;
        this.shootInterval = def.shootInterval || 2;

        // 状态
        this.alive = true;
        this.damageFlash = 0;
        this.knockbackX = 0;
        this.knockbackY = 0;
        this.hitStun = 0;
        this.bodyBob = Math.random() * Math.PI * 2;
        this.slowTimer = 0;
        this.slowMult = 1;

        // 攻击冷却
        this.attackCooldown = 0;

        // 精英词缀字段
        this.affixName = null;
        this.affixColor = null;

        // Boss AI 字段
        this.bossPattern = null;
        this.bossPhaseTimer = 0;
        this.bossCharging = false;
        this.bossChargeDir = 0;
        this.bossChargeSpeed = 0;
        this._chargeTime = 0;
        this.bossSummonTimer = 0;
        this.bossSlamTimer = 0;
        this.bossBulletTimer = 0;
        this.bossBulletAngle = 0;

        // 死亡动画
        this.dying = false;
        this.deathTimer = 0;
        this.deathDuration = 0;
        this.deathX = 0;
        this.deathY = 0;
    }

    // 给精英随机一个词缀
    applyRandomAffix() {
        const key = Utils.randPick(ELITE_AFFIX_KEYS);
        EliteAffixes[key].apply(this);
    }

    // Boss变体
    applyBossVariant(variantIndex) {
        const v = BossVariants[variantIndex % BossVariants.length];
        this.name = v.name;
        this.color = v.color;
        this.colors = v.colors;
        this.bossPattern = v.pattern;
        if (v.pattern === 'charge') { this.speed *= 0.8; }
        else if (v.pattern === 'summoner') { this.maxHp = Math.floor(this.maxHp * 1.3); this.hp = this.maxHp; this.speed *= 0.7; this.bossSummonTimer = 5; }
        else if (v.pattern === 'slam') { this.radius = 42; this.maxHp = Math.floor(this.maxHp * 1.5); this.hp = this.maxHp; this.speed *= 0.6; this.bossSlamTimer = 4; }
        else if (v.pattern === 'bulletHell') { this.speed *= 0.5; }
    }

    takeDamage(amount, particles, knockbackAngle = 0, knockbackForce = 0) {
        // 精英护盾吸收
        if (this._shielded && this._shieldHp > 0) {
            const absorbed = Math.min(this._shieldHp, amount);
            this._shieldHp -= absorbed;
            amount -= absorbed;
            if (this._shieldHp <= 0) this._shielded = false;
            if (amount <= 0) { this.damageFlash = 0.1; return false; }
        }

        this.hp -= amount;
        this.damageFlash = 0.15;
        this.hitStun = 0.1;

        // 击退（Boss减弱）
        if (knockbackForce > 0) {
            const kbMult = this.isBoss ? 0.3 : 1;
            this.knockbackX = Math.cos(knockbackAngle) * knockbackForce * kbMult;
            this.knockbackY = Math.sin(knockbackAngle) * knockbackForce * kbMult;
        }

        // 受伤粒子
        particles.emit(this.x, this.y, 6, {
            colors: this.colors,
            speedMin: 2,
            speedMax: 5,
            sizeMin: 2,
            sizeMax: 5,
            lifeMin: 0.2,
            lifeMax: 0.5,
            friction: 0.9,
        });

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            // 开启死亡动画
            this.dying = true;
            this.deathTimer = 0;
            this.deathDuration = this.isBoss ? 1.0 : (this.isElite ? 0.5 : 0.3);
            this.deathX = this.x;
            this.deathY = this.y;
            return true; // died
        }
        return false;
    }

    update(dt, playerX, playerY) {
        if (!this.alive) return null;

        this.bodyBob += 6 * dt;
        if (this.damageFlash > 0) this.damageFlash -= dt;
        if (this.hitStun > 0) this.hitStun -= dt;
        if (this.attackCooldown > 0) this.attackCooldown -= dt;

        // 击退物理
        if (Math.abs(this.knockbackX) > 0.1 || Math.abs(this.knockbackY) > 0.1) {
            this.x += this.knockbackX * dt * 10;
            this.y += this.knockbackY * dt * 10;
            this.knockbackX *= 0.85;
            this.knockbackY *= 0.85;
        }

        if (this.hitStun > 0) return null;

        // 嘲讽计时衰减
        if (this._tauntTime > 0) {
            this._tauntTime -= dt;
            if (this._tauntTime <= 0) this._tauntTarget = null;
        }

        // Boss AI 更新（返回事件）
        let bossEvent = null;
        if (this.isBoss && this.bossPattern) {
            bossEvent = this._updateBossAI(dt, playerX, playerY);
        }

        // 移向目标（冲锋中不走普通移动）
        if (!this.bossCharging) {
            let tx = playerX, ty = playerY;
            if (this._tauntTarget && this._tauntTarget.alive) {
                tx = this._tauntTarget.x;
                ty = this._tauntTarget.y;
            }
            const dx = tx - this.x;
            const dy = ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 0) {
                const stopDist = this.ranged ? 200 : (this.bossPattern === 'bulletHell' ? 250 : 0);
                if (dist > stopDist) {
                    if (this.slowTimer > 0) {
                        this.slowTimer -= dt;
                        if (this.slowTimer <= 0) this.slowMult = 1;
                    }
                    const spd = this.speed * this.slowMult;
                    this.x += (dx / dist) * spd * dt;
                    this.y += (dy / dist) * spd * dt;
                }
            }
        } else {
            // Boss冲锋中
            this.x += Math.cos(this.bossChargeDir) * this.bossChargeSpeed * dt;
            this.y += Math.sin(this.bossChargeDir) * this.bossChargeSpeed * dt;
        }

        // 远程射击计时 & 蓄力预警
        if (this.ranged) {
            this.shootTimer += dt;
            this._chargeRatio = Math.max(0, (this.shootTimer - (this.shootInterval - 0.6)) / 0.6);
        }

        // 灼烧DOT
        if (this._burnTimer > 0) {
            this._burnTimer -= dt;
            if (!this._burnTick) this._burnTick = 0;
            this._burnTick += dt;
            if (this._burnTick >= 0.5) {
                this._burnTick -= 0.5;
                this.hp -= this._burnDamage || 0;
                if (this.hp <= 0) {
                    this.hp = 0;
                    this.alive = false;
                }
            }
        }

        return bossEvent;
    }

    // Boss AI 状态机
    _updateBossAI(dt, playerX, playerY) {
        this.bossPhaseTimer += dt;
        switch (this.bossPattern) {
            case 'charge': {
                if (!this.bossCharging) {
                    if (this.bossPhaseTimer >= 4) {
                        this.bossPhaseTimer = 0;
                        this.bossChargeDir = Utils.angle(this.x, this.y, playerX, playerY);
                        this.bossCharging = true;
                        this.bossChargeSpeed = 400;
                        this._chargeTime = 0;
                    }
                } else {
                    this._chargeTime += dt;
                    if (this._chargeTime >= 1.0) {
                        this.bossCharging = false;
                        this.bossChargeSpeed = 0;
                        return { type: 'bossSlam', x: this.x, y: this.y, radius: 80 };
                    }
                }
                break;
            }
            case 'summoner': {
                this.bossSummonTimer -= dt;
                if (this.bossSummonTimer <= 0) {
                    this.bossSummonTimer = 5;
                    return { type: 'bossSummon', x: this.x, y: this.y, count: 4 };
                }
                break;
            }
            case 'slam': {
                this.bossSlamTimer -= dt;
                if (this.bossSlamTimer <= 0) {
                    this.bossSlamTimer = 4;
                    return { type: 'bossSlam', x: this.x, y: this.y, radius: 150 };
                }
                break;
            }
            case 'bulletHell': {
                this.bossBulletTimer += dt;
                if (this.bossBulletTimer >= 0.3) {
                    this.bossBulletTimer = 0;
                    this.bossBulletAngle += 0.5;
                    return { type: 'bossBullets', x: this.x, y: this.y, baseAngle: this.bossBulletAngle, count: 5 };
                }
                break;
            }
        }
        return null;
    }

    canShoot() {
        if (!this.ranged) return false;
        if (this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            return true;
        }
        return false;
    }

    canAttack() {
        if (this.attackCooldown <= 0) {
            this.attackCooldown = 0.5;
            return true;
        }
        return false;
    }

    render(ctx, camera, screenW, screenH) {
        if (!this.alive) return;
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;

        // 屏幕外剔除
        const margin = this.radius + 40;
        if (sx < -margin || sx > screenW + margin || sy < -margin || sy > screenH + margin) return;

        const bob = Math.sin(this.bodyBob) * 2;

        ctx.save();

        // 精英词缀光圈
        if (this.affixColor) {
            ctx.globalAlpha = 0.25 + Math.sin(this.bodyBob * 3) * 0.1;
            ctx.fillStyle = this.affixColor;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 精英/Boss光圈
        if ((this.isElite && !this.affixColor) || this.isBoss) {
            ctx.globalAlpha = 0.2 + Math.sin(this.bodyBob * 2) * 0.1;
            ctx.fillStyle = this.isBoss ? '#ff4444' : '#ffaa00';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // Boss冲锋预警线
        if (this.bossCharging) {
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#ff4444';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(this.bossChargeDir) * 200, sy + Math.sin(this.bossChargeDir) * 200);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // 精英护盾视觉
        if (this._shielded && this._shieldHp > 0) {
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#8888ff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // 远程蓄力预警
        if (this.ranged && this._chargeRatio > 0) {
            const cr = this._chargeRatio;
            ctx.globalAlpha = cr * (0.4 + Math.sin(this.bodyBob * 10) * 0.2);
            ctx.strokeStyle = '#ff2244';
            ctx.lineWidth = 2 + cr * 2;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 4 + cr * 12, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = cr * 0.2;
            ctx.fillStyle = '#ff4466';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + cr * 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 近战攻击冷却指示
        if (!this.ranged && this.attackCooldown > 0.3) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 身体
        ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 受伤闪白外圈
        if (this.damageFlash > 0) {
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 灼烧效果
        if (this._burnTimer > 0) {
            ctx.globalAlpha = 0.3 + Math.sin(this.bodyBob * 6) * 0.15;
            ctx.fillStyle = '#ff4422';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 高光
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(sx - this.radius * 0.2, sy - this.radius * 0.2 + bob, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // 眼睛
        ctx.fillStyle = this.isBoss ? '#ffaa00' : '#ff4444';
        const eyeSize = this.radius * 0.2;
        ctx.beginPath();
        ctx.arc(sx - this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sx + this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeSize, 0, Math.PI * 2);
        ctx.fill();

        // 血条 (Boss血条在UI层绘制)
        if (this.hp < this.maxHp && !this.isBoss) {
            const barWidth = this.radius * 2.5;
            const barHeight = 4;
            const barY = sy - this.radius - 10 + bob;
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(sx - barWidth / 2, barY, barWidth, barHeight);
            const ratio = this.hp / this.maxHp;
            const barColor = ratio > 0.5 ? '#44ff44' : (ratio > 0.25 ? '#ffaa00' : '#ff4444');
            ctx.fillStyle = barColor;
            ctx.fillRect(sx - barWidth / 2, barY, barWidth * ratio, barHeight);
        }

        // Boss/精英名字
        if (this.isBoss || this.affixName) {
            ctx.font = "bold 14px 'Microsoft YaHei','PingFang SC','Helvetica Neue',Arial,sans-serif";
            ctx.fillStyle = this.isBoss ? '#ff4444' : (this.affixColor || '#ffaa00');
            ctx.textAlign = 'center';
            const label = this.affixName ? ('[' + this.affixName + '] ' + this.name) : this.name;
            ctx.fillText(label, sx, sy - this.radius - 18 + bob);
        }

        ctx.restore();
    }

    // 死亡动画渲染
    renderDeath(ctx, camera, dt) {
        if (!this.dying) return false;
        this.deathTimer += dt;
        const t = this.deathTimer / this.deathDuration;
        if (t >= 1) { this.dying = false; return false; }

        const sx = this.deathX - camera.x;
        const sy = this.deathY - camera.y;
        ctx.save();
        if (this.isBoss) {
            // Boss死亡：多重扩散环
            for (let r = 0; r < 3; r++) {
                const rt = Utils.clamp(t * 3 - r * 0.3, 0, 1);
                if (rt <= 0) continue;
                ctx.globalAlpha = (1 - rt) * 0.5;
                ctx.strokeStyle = this.colors[r % this.colors.length];
                ctx.lineWidth = 4 * (1 - rt);
                ctx.beginPath();
                ctx.arc(sx, sy, this.radius * (1 + rt * 4), 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = (1 - t) * 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy, this.radius * (1 - t * 0.5), 0, Math.PI * 2);
            ctx.fill();
        } else {
            // 普通/精英死亡：碎片扩散
            ctx.globalAlpha = (1 - t) * 0.6;
            ctx.fillStyle = this.color;
            const pieces = this.isElite ? 6 : 4;
            for (let i = 0; i < pieces; i++) {
                const angle = (i / pieces) * Math.PI * 2 + t * 2;
                const dist = this.radius * t * 2;
                ctx.beginPath();
                ctx.arc(sx + Math.cos(angle) * dist, sy + Math.sin(angle) * dist, this.radius * 0.3 * (1 - t), 0, Math.PI * 2);
                ctx.fill();
            }
        }
        ctx.restore();
        return true;
    }
}

// --- 怪物波次管理 ---
class WaveManager {
    constructor(rng) {
        this.rng = rng || null; // 可选的种子随机数生成器（每日挑战模式）
        this.eliteChanceMult = 1;  // 每日修饰符：精英概率倍率
        this.enemySpeedMult = 1;   // 每日修饰符：敌人移速倍率
        this.bossHpMult = 1;       // 每日修饰符：Boss血量倍率
        this.wave = 0;
        this.timer = 0;
        this.spawnTimer = 0;
        this.gameTime = 0;
        this.difficulty = 1;
        this.difficultyMultiplier = 1.0; // 由设置界面控制: easy=0.6, normal=1.0, hard=1.5

        // 波次配置（12阶段渐进式难度，前期更友好）
        this.waveConfigs = [
            // 阶段1 (0~30s)：新手入门 - 少量骷髅让玩家熟悉操作
            { time: 0,   types: ['skeleton'], spawnRate: 1.8, count: 2, mult: 0.5 },
            // 阶段2 (30~75s)：加入蝙蝠，缓步加压
            { time: 30,  types: ['skeleton', 'bat'], spawnRate: 1.5, count: 3, mult: 0.65 },
            // 阶段3 (75~150s)：加入史莱姆，开始出精英
            { time: 75,  types: ['skeleton', 'bat', 'slime'], spawnRate: 1.2, count: 4, mult: 0.8, elite: 'eliteSkeleton', eliteChance: 0.015 },
            // 阶段4 (150~240s)：加入骷髅法师，精英频率提升
            { time: 150, types: ['skeleton', 'bat', 'slime', 'skeleton', 'bat'], spawnRate: 1.0, count: 5, mult: 1.0, elite: 'eliteSkeleton', eliteChance: 0.03, rangedType: 'skeletonMage', rangedChance: 0.08 },
            // 阶段5 (240~360s)：数量渐增，更多远程
            { time: 240, types: ['skeleton', 'bat', 'slime', 'skeleton', 'bat'], spawnRate: 0.85, count: 7, mult: 1.3, elite: 'eliteSkeleton', eliteChance: 0.05, rangedType: 'skeletonMage', rangedChance: 0.10 },
            // 阶段6 (360~480s)：加入暗影狼和石像鬼
            { time: 360, types: ['skeleton', 'bat', 'slime', 'shadowWolf', 'gargoyle'], spawnRate: 0.7, count: 9, mult: 1.7, elite: 'eliteSkeleton', eliteChance: 0.06, rangedType: 'skeletonMage', rangedChance: 0.12 },
            // 阶段7 (480~600s)：加入恶魔术士，精英多样化
            { time: 480, types: ['shadowWolf', 'bat', 'slime', 'gargoyle', 'skeleton'], spawnRate: 0.6, count: 12, mult: 2.2, elite: 'eliteDemon', eliteChance: 0.08, rangedType: 'demonCaster', rangedChance: 0.15 },
            // 阶段8 (600~750s)：加入爆破虫，全面强敌（降低mult，靠difficulty曲线提供压力）
            { time: 600, types: ['shadowWolf', 'gargoyle', 'exploder', 'slime', 'bat'], spawnRate: 0.5, count: 15, mult: 2.2, elite: 'eliteDemon', eliteChance: 0.10, rangedType: 'demonCaster', rangedChance: 0.18 },
            // 阶段9 (750~900s)：高难度密度
            { time: 750, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.4, count: 18, mult: 2.8, elite: 'eliteDemon', eliteChance: 0.12, rangedType: 'demonCaster', rangedChance: 0.20 },
            // 阶段10 (900~1080s)：无尽噩梦
            { time: 900, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime', 'skeleton'], spawnRate: 0.35, count: 22, mult: 3.2, elite: 'eliteDemon', eliteChance: 0.15, rangedType: 'demonCaster', rangedChance: 0.22 },
            // 阶段11 (1080~1260s)：终极考验
            { time: 1080, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.3, count: 28, mult: 3.8, elite: 'eliteDemon', eliteChance: 0.18, rangedType: 'demonCaster', rangedChance: 0.25 },
            // 阶段12 (1260s+)：真·无尽
            { time: 1260, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime', 'skeleton'], spawnRate: 0.25, count: 35, mult: 4.5, elite: 'eliteDemon', eliteChance: 0.22, rangedType: 'demonCaster', rangedChance: 0.28 },
        ];

        // 阶段Boss：首次270秒（4.5分钟），之后逐步缩短间隔（最短120秒）
        this.stageBossInterval = 270;
        this.nextStageBossTime = this.stageBossInterval;
        this.stageBossCount = 0;
        this.activeStageBoss = null; // 当前存活的阶段Boss引用

        // 精英围攻波次：首次180秒，之后逐步缩短间隔
        this.nextSiegeTime = 180;
        this.siegeCount = 0;
    }

    update(dt, playerX, playerY, enemies, particles) {
        this.gameTime += dt;
        this.timer += dt;
        this.spawnTimer += dt;

        // 难度递增（分段曲线 - 后期增长大幅放缓，匹配英雄成长节奏）
        // 0~5分钟: 缓慢增长; 5~10分钟: 中速增长; 10~20分钟: 放缓增长; 20分钟+: 接近线性
        const t = this.gameTime;
        if (t < 300) {
            this.difficulty = 1 + t / 200;                // 5分钟 → 2.5x
        } else if (t < 600) {
            this.difficulty = 2.5 + (t - 300) / 120;      // 10分钟 → 5.0x（原5.5x）
        } else if (t < 1200) {
            // 10~20分钟: 对数增长，大幅放缓（原pow 1.4指数增长）
            // 10分钟=5.0x → 15分钟≈7.3x → 20分钟≈8.9x
            this.difficulty = 5.0 + 3.0 * Math.log2(1 + (t - 600) / 200);
        } else {
            // 20分钟后: 非常缓慢的线性增长（每分钟 +0.3x）
            this.difficulty = 8.9 + (t - 1200) / 200;
        }

        // 获取当前波次配置
        let config = this.waveConfigs[0];
        for (let i = this.waveConfigs.length - 1; i >= 0; i--) {
            if (this.gameTime >= this.waveConfigs[i].time) {
                config = this.waveConfigs[i];
                break;
            }
        }

        // 生成怪物
        if (this.spawnTimer >= config.spawnRate) {
            this.spawnTimer = 0;
            const count = config.count + Math.floor(this.gameTime / 90);
            for (let i = 0; i < count; i++) {
                // 远程怪独立低概率生成，不再混入普通池
                const _rnd = this.rng ? this.rng() : Math.random();
                let type;
                if (config.rangedType && _rnd < (config.rangedChance || 0)) {
                    type = config.rangedType;
                } else {
                    // 种子模式用rng挑选类型
                    if (this.rng) {
                        type = config.types[Math.floor(this.rng() * config.types.length)];
                    } else {
                        type = Utils.randPick(config.types);
                    }
                }
                const pos = this._getSpawnPos(playerX, playerY);
                const newEnemy = new Enemy(type, pos.x, pos.y, config.mult * this.difficulty * this.difficultyMultiplier);
                // 每日修饰符：敌人移速加成
                if (this.enemySpeedMult > 1) newEnemy.speed *= this.enemySpeedMult;
                enemies.push(newEnemy);

                // 精英怪概率（附带随机词缀，受每日修饰符影响）
                const _eRnd = this.rng ? this.rng() : Math.random();
                if (config.elite && _eRnd < (config.eliteChance || 0) * this.eliteChanceMult) {
                    const elitePos = this._getSpawnPos(playerX, playerY);
                    const elite = new Enemy(config.elite, elitePos.x, elitePos.y, config.mult * this.difficulty * this.difficultyMultiplier);
                    elite.applyRandomAffix();
                    enemies.push(elite);
                }
            }
        }

        // 精英怪附加随机词缀
        // (在刚生成的精英怪上调用)

        // 阶段Boss生成（每3.5分钟一次，使用Boss变体）
        if (this.gameTime >= this.nextStageBossTime && (!this.activeStageBoss || !this.activeStageBoss.alive)) {
            const pos = this._getSpawnPos(playerX, playerY);
            this.stageBossCount++;
            const bossMultiplier = 1 + (this.stageBossCount - 1) * 0.5;
            const boss = new Enemy('boss', pos.x, pos.y, bossMultiplier * this.difficulty);
            boss._isStageBoss = true;
            boss.applyBossVariant(this.stageBossCount - 1); // 每次不同变体
            // 每日修饰符：Boss血量加成
            if (this.bossHpMult > 1) {
                boss.maxHp = Math.floor(boss.maxHp * this.bossHpMult);
                boss.hp = boss.maxHp;
            }
            enemies.push(boss);
            this.activeStageBoss = boss;
            // Boss间隔逐步缩短：270s → 240s → 210s → 180s → 150s → 120s（最短）
            this.stageBossInterval = Math.max(120, 270 - this.stageBossCount * 30);
            this.nextStageBossTime = this.gameTime + this.stageBossInterval;
            Utils.shake(10);
        }

        // 精英围攻波次：环形生成一圈精英怪
        if (this.gameTime >= this.nextSiegeTime) {
            this.siegeCount++;
            const siegeEliteCount = Math.min(6 + this.siegeCount * 2, 20);
            const siegeRadius = 400;
            const eliteTypes = ['eliteSkeleton', 'eliteDemon'];
            const eliteType = this.siegeCount >= 3 ? 'eliteDemon' : 'eliteSkeleton';
            for (let i = 0; i < siegeEliteCount; i++) {
                const angle = (Math.PI * 2 / siegeEliteCount) * i + Math.random() * 0.3;
                const ex = playerX + Math.cos(angle) * siegeRadius;
                const ey = playerY + Math.sin(angle) * siegeRadius;
                const mult = config.mult * this.difficulty * this.difficultyMultiplier * (1 + this.siegeCount * 0.15);
                const elite = new Enemy(eliteType, ex, ey, mult);
                elite.applyRandomAffix();
                elite._isSiegeElite = true;
                enemies.push(elite);
            }
            this.nextSiegeTime = this.gameTime + Math.max(60, 100 - this.siegeCount * 5);
            Utils.shake(8);
            return { type: 'siegeWave', count: siegeEliteCount };
        }

        // 检测阶段Boss是否被击败（返回信号让 game.js 处理奖励）
        if (this.activeStageBoss && !this.activeStageBoss.alive) {
            const defeated = this.activeStageBoss;
            this.activeStageBoss = null;
            return { type: 'stageBossDefeated', boss: defeated };
        }

        return null;
    }

    _getSpawnPos(playerX, playerY) {
        const angle = this.rng ? this.rng() * Math.PI * 2 : Utils.rand(0, Math.PI * 2);
        const dist = this.rng ? 500 + this.rng() * 200 : Utils.rand(500, 700);
        return {
            x: playerX + Math.cos(angle) * dist,
            y: playerY + Math.sin(angle) * dist,
        };
    }
}

// --- 经验宝石 ---
class ExpGem {
    constructor(x, y, value, color = '#44ff88') {
        this.x = x;
        this.y = y;
        this.value = value;
        this.radius = Math.min(4 + value * 0.5, 10);
        this.color = color;
        this.alive = true;
        this.sparkleTimer = 0;
        this.bobPhase = Math.random() * Math.PI * 2;
        this.attractSpeed = 0;
        this.attracted = false;
    }

    update(dt, playerX, playerY, pickupRange, particles) {
        this.bobPhase += 3 * dt;
        this.sparkleTimer += dt;

        const dist = Utils.dist(this.x, this.y, playerX, playerY);

        // 吸引范围
        if (dist < pickupRange) {
            this.attracted = true;
        }

        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 800 * dt, 600);
            const angle = Utils.angle(this.x, this.y, playerX, playerY);
            this.x += Math.cos(angle) * this.attractSpeed * dt;
            this.y += Math.sin(angle) * this.attractSpeed * dt;

            if (dist < 15) {
                this.alive = false;
                particles.addGemSparkle(this.x, this.y, this.color);
                return this.value;
            }
        }

        // 闪烁粒子（降低频率优化性能）
        if (this.sparkleTimer > 1.5) {
            this.sparkleTimer = 0;
            particles.addGemSparkle(this.x, this.y, this.color);
        }

        return 0;
    }

    render(ctx, camera) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y + Math.sin(this.bobPhase) * 3;

        ctx.save();

        // 光晕
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius + 6, 0, Math.PI * 2);
        ctx.fill();

        // 宝石
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;

        // 菱形
        ctx.beginPath();
        ctx.moveTo(sx, sy - this.radius);
        ctx.lineTo(sx + this.radius * 0.7, sy);
        ctx.lineTo(sx, sy + this.radius);
        ctx.lineTo(sx - this.radius * 0.7, sy);
        ctx.closePath();
        ctx.fill();

        // 高光
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy - this.radius * 0.5);
        ctx.lineTo(sx + this.radius * 0.3, sy);
        ctx.lineTo(sx, sy + this.radius * 0.2);
        ctx.lineTo(sx - this.radius * 0.3, sy - this.radius * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}

// --- 掉落道具 ---
const DropItemTypes = {
    heal: {
        name: '治疗药水',
        icon: '❤️',
        color: '#ff4466',
        glowColor: '#ff6688',
        desc: '恢复30%最大生命值',
        dropChance: 0.015,   // 1.5%概率
    },
    bomb: {
        name: '全屏炸弹',
        icon: '💣',
        color: '#ff8844',
        glowColor: '#ffaa66',
        desc: '消灭屏幕内所有敌人',
        dropChance: 0.005,   // 0.5%概率
    },
    magnet: {
        name: '经验磁铁',
        icon: '🧲',
        color: '#44aaff',
        glowColor: '#66ccff',
        desc: '吸收场地上所有经验宝石',
        dropChance: 0.01,    // 1%概率
    },
};

class DropItem {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        const def = DropItemTypes[type];
        this.name = def.name;
        this.color = def.color;
        this.glowColor = def.glowColor;
        this.icon = def.icon;
        this.radius = 14;
        this.alive = true;
        this.life = 15;        // 15秒后消失
        this.bobPhase = Math.random() * Math.PI * 2;
        this.sparkleTimer = 0;
        this.attracted = false;
        this.attractSpeed = 0;
    }

    update(dt, playerX, playerY, pickupRange) {
        if (!this.alive) return false;
        this.bobPhase += 4 * dt;
        this.sparkleTimer += dt;
        this.life -= dt;
        if (this.life <= 0) {
            this.alive = false;
            return false;
        }

        const dist = Utils.dist(this.x, this.y, playerX, playerY);

        // 靠近时吸引
        if (dist < pickupRange + 20) {
            this.attracted = true;
        }

        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 600 * dt, 500);
            const angle = Utils.angle(this.x, this.y, playerX, playerY);
            this.x += Math.cos(angle) * this.attractSpeed * dt;
            this.y += Math.sin(angle) * this.attractSpeed * dt;
        }

        // 拾取
        if (dist < 20) {
            this.alive = false;
            return true; // 拾取成功
        }
        return false;
    }

    render(ctx, camera) {
        if (!this.alive) return;
        const sx = this.x - camera.x;
        const sy = this.y - camera.y + Math.sin(this.bobPhase) * 4;

        ctx.save();

        // 即将消失时闪烁
        if (this.life < 3) {
            ctx.globalAlpha = 0.5 + Math.sin(this.life * 10) * 0.5;
        }

        // 外圈光晕
        ctx.globalAlpha *= 0.25;
        ctx.fillStyle = this.glowColor;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius + 10, 0, Math.PI * 2);
        ctx.fill();

        // 主体圆
        ctx.globalAlpha = this.life < 3 ? (0.5 + Math.sin(this.life * 10) * 0.5) : 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 图标
        ctx.font = '16px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, sx, sy);

        ctx.restore();
    }
}

// ============================================
// 地图危险区域
// ============================================
class MapHazard {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = Utils.rand(60, 100);
        this.timer = 0;
        this.life = Utils.rand(20, 40);
        this.alive = true;
        this.damageTimer = 0;

        const defs = {
            poison: { color: '#44aa44', glowColor: '#66cc66', damage: 3, interval: 0.5, icon: '\u2620\uFE0F' },
            fire: { color: '#ff6622', glowColor: '#ff8844', damage: 6, interval: 0.4, icon: '\uD83D\uDD25' },
            slow: { color: '#4488ff', glowColor: '#66aaff', damage: 0, interval: 0, icon: '\u2744\uFE0F' },
        };
        const def = defs[type] || defs.poison;
        this.color = def.color;
        this.glowColor = def.glowColor;
        this.damage = def.damage;
        this.damageInterval = def.interval;
        this.icon = def.icon;
    }

    update(dt, player) {
        this.timer += dt;
        this.life -= dt;
        if (this.life <= 0) { this.alive = false; return 0; }

        const dist = Utils.dist(this.x, this.y, player.x, player.y);
        if (dist < this.radius + player.radius) {
            if (this.type === 'slow') {
                player._hazardSlow = 0.5;
                return 0;
            }
            this.damageTimer += dt;
            if (this.damageTimer >= this.damageInterval) {
                this.damageTimer = 0;
                return this.damage;
            }
        }
        return 0;
    }

    render(ctx, camera, screenW, screenH) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;
        if (sx < -this.radius - 20 || sx > screenW + this.radius + 20 ||
            sy < -this.radius - 20 || sy > screenH + this.radius + 20) return;

        const fadeAlpha = this.life < 3 ? this.life / 3 : 1;
        const pulse = 1 + Math.sin(this.timer * 2) * 0.08;

        ctx.save();
        ctx.globalAlpha = 0.12 * fadeAlpha;
        ctx.fillStyle = this.glowColor;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse + 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.18 * fadeAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.globalAlpha = 0.6 * fadeAlpha;
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, sx, sy);
        ctx.restore();
    }
}

// ============================================
// 环境交互物（加速区 / 传送门 / 陷阱）
// ============================================
class EnvObject {
    constructor(x, y, type, linkedPortal) {
        this.x = x;
        this.y = y;
        this.type = type;      // 'speed' | 'portal' | 'trap'
        this.alive = true;
        this.timer = 0;
        this.linkedPortal = linkedPortal || null; // 传送门配对

        const defs = {
            speed:  { radius: 70, life: 25, color: '#44ffaa', glowColor: '#88ffdd', icon: '⚡' },
            portal: { radius: 30, life: 60, color: '#aa66ff', glowColor: '#cc88ff', icon: '🌀' },
            trap:   { radius: 55, life: 20, color: '#ff4466', glowColor: '#ff6688', icon: '⚠' },
        };
        const def = defs[type] || defs.speed;
        this.radius = def.radius;
        this.life = def.life;
        this.maxLife = def.life;
        this.color = def.color;
        this.glowColor = def.glowColor;
        this.icon = def.icon;

        // 传送门冷却
        this.teleportCD = 0;
        // 陷阱伤害计时
        this.damageTimer = 0;
    }

    update(dt, player, particles) {
        this.timer += dt;
        this.life -= dt;
        if (this.life <= 0) { this.alive = false; return null; }
        if (this.teleportCD > 0) this.teleportCD -= dt;

        const dist = Utils.dist(this.x, this.y, player.x, player.y);

        switch (this.type) {
            case 'speed':
                // 在范围内加速
                if (dist < this.radius + player.radius) {
                    player._envSpeedBuff = 1.5; // 50%加速
                    return { type: 'speed' };
                }
                return null;

            case 'portal':
                // 进入传送门范围
                if (dist < this.radius + player.radius && this.linkedPortal && this.linkedPortal.alive && this.teleportCD <= 0) {
                    this.teleportCD = 3.0;            // 3秒冷却
                    this.linkedPortal.teleportCD = 3.0;
                    // 传送粒子
                    if (particles) {
                        particles.addShockwave(this.x, this.y, this.color, 60, 0.3);
                        particles.addShockwave(this.linkedPortal.x, this.linkedPortal.y, this.color, 60, 0.3);
                    }
                    return { type: 'portal', destX: this.linkedPortal.x, destY: this.linkedPortal.y };
                }
                return null;

            case 'trap':
                // 在范围内：减速 + 伤害
                if (dist < this.radius + player.radius) {
                    player._envTrapSlow = 0.6; // 40%减速
                    this.damageTimer += dt;
                    if (this.damageTimer >= 0.8) { // 每0.8秒伤害
                        this.damageTimer = 0;
                        return { type: 'trap', damage: Math.ceil(player.getMaxHp() * 0.03) };
                    }
                }
                return null;
        }
        return null;
    }

    render(ctx, camera) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;

        const fadeAlpha = this.life < 4 ? this.life / 4 : 1;
        const pulse = 1 + Math.sin(this.timer * 3) * 0.1;
        const cdAlpha = this.teleportCD > 0 ? 0.3 : 1;

        ctx.save();

        // 外发光
        ctx.globalAlpha = 0.1 * fadeAlpha * cdAlpha;
        ctx.fillStyle = this.glowColor;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse + 12, 0, Math.PI * 2);
        ctx.fill();

        // 主区域
        ctx.globalAlpha = 0.2 * fadeAlpha * cdAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, Math.PI * 2);
        ctx.fill();

        // 边框（虚线动画）
        ctx.globalAlpha = 0.4 * fadeAlpha * cdAlpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.lineDashOffset = -this.timer * 30;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 传送门：额外旋转光线
        if (this.type === 'portal' && this.teleportCD <= 0) {
            ctx.globalAlpha = 0.25 * fadeAlpha;
            ctx.strokeStyle = this.glowColor;
            ctx.lineWidth = 2;
            for (let i = 0; i < 4; i++) {
                const a = this.timer * 2 + i * Math.PI / 2;
                const r1 = this.radius * 0.4;
                const r2 = this.radius * 0.9;
                ctx.beginPath();
                ctx.moveTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1);
                ctx.lineTo(sx + Math.cos(a) * r2, sy + Math.sin(a) * r2);
                ctx.stroke();
            }
        }

        // 图标
        ctx.globalAlpha = 0.7 * fadeAlpha * cdAlpha;
        ctx.font = '18px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, sx, sy);

        // 传送门冷却提示
        if (this.type === 'portal' && this.teleportCD > 0) {
            ctx.globalAlpha = 0.6;
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#aaa';
            ctx.fillText(this.teleportCD.toFixed(1) + 's', sx, sy + this.radius + 14);
        }

        ctx.restore();
    }
}

// ============================================
// 遗物掉落物
// ============================================
class RelicDrop {
    constructor(x, y, relicId) {
        this.x = x;
        this.y = y;
        this.relicId = relicId;
        const def = RelicDefs[relicId];
        this.name = def ? def.name : relicId;
        this.icon = def ? def.icon : '?';
        this.color = def ? def.color : '#ffaa44';
        this.rarity = def ? def.rarity : 'rare';
        this.radius = 18;
        this.alive = true;
        this.life = 30;
        this.bobPhase = Math.random() * Math.PI * 2;
        this.attracted = false;
        this.attractSpeed = 0;
    }

    update(dt, playerX, playerY, pickupRange) {
        if (!this.alive) return false;
        this.bobPhase += 3 * dt;
        this.life -= dt;
        if (this.life <= 0) { this.alive = false; return false; }

        const dist = Utils.dist(this.x, this.y, playerX, playerY);
        if (dist < pickupRange + 30) this.attracted = true;
        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 500 * dt, 400);
            const angle = Utils.angle(this.x, this.y, playerX, playerY);
            this.x += Math.cos(angle) * this.attractSpeed * dt;
            this.y += Math.sin(angle) * this.attractSpeed * dt;
        }
        if (dist < 25) { this.alive = false; return true; }
        return false;
    }

    render(ctx, camera) {
        if (!this.alive) return;
        const sx = this.x - camera.x;
        const sy = this.y - camera.y + Math.sin(this.bobPhase) * 5;
        const rarityColors = { rare: '#4488ff', epic: '#aa44ff', legendary: '#ffaa00' };

        ctx.save();
        if (this.life < 5) ctx.globalAlpha = 0.5 + Math.sin(this.life * 8) * 0.5;

        // 稀有度光柱
        ctx.globalAlpha *= 0.15;
        ctx.fillStyle = rarityColors[this.rarity] || '#ffffff';
        ctx.fillRect(sx - 4, sy - 60, 8, 60);

        ctx.globalAlpha = this.life < 5 ? (0.5 + Math.sin(this.life * 8) * 0.5) : 1;
        // 外圈
        ctx.fillStyle = this.color;
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius + 12, 0, Math.PI * 2);
        ctx.fill();

        // 主体
        ctx.globalAlpha = this.life < 5 ? (0.5 + Math.sin(this.life * 8) * 0.5) : 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 图标
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.icon, sx, sy);

        // 名字
        ctx.font = "bold 11px 'Microsoft YaHei','PingFang SC','Helvetica Neue',Arial,sans-serif";
        ctx.fillStyle = rarityColors[this.rarity] || '#ffffff';
        ctx.fillText(this.name, sx, sy - this.radius - 10);

        ctx.restore();
    }
}

// 敌人弹幕
class EnemyBullet {
    constructor(x, y, angle, speed, damage, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.damage = damage;
        this.color = color || '#ff4488';
        this.radius = 8;
        this.alive = true;
        this.life = 3;
        this.age = 0;
        // 拖尾历史
        this.trail = [];
    }

    update(dt) {
        // 记录拖尾
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 6) this.trail.shift();

        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.life -= dt;
        this.age += dt;
        if (this.life <= 0) this.alive = false;
    }

    render(ctx, camera) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;
        ctx.save();
        // 拖尾
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const tx = t.x - camera.x;
            const ty = t.y - camera.y;
            const alpha = (i / this.trail.length) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(tx, ty, this.radius * (0.3 + 0.7 * i / this.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        // 脉动外光——更大更明显
        const pulse = 1 + Math.sin(this.age * 12) * 0.25;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * 2.5 * pulse, 0, Math.PI * 2);
        ctx.fill();
        // 弹体
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, Math.PI * 2);
        ctx.fill();
        // 高亮核心
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
