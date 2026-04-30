// ============================================
// 角色系统 - 3个角色各有特色
// ============================================

const CharacterDefs = {
    // --- 剑客 ---
    swordsman: {
        id: 'swordsman',
        name: '剑客·影',
        desc: '近战剑术大师，挥剑形成弧形刀光',
        color: '#44aaff',
        colors: ['#44aaff', '#2288dd', '#66ccff'],
        icon: '⚔️',
        baseStats: {
            maxHp: 150,
            hp: 150,
            attack: 20,
            attackSpeed: 1.3,     // 攻击/秒
            critRate: 0.12,
            critDamage: 1.8,
            moveSpeed: 210,
            hpRegen: 1.0,        // 每秒回血
            pickupRange: 80,
            armor: 3,
        },
        passive: {
            name: '疾风剑意',
        desc: '每次攻击叠加剑意，每层提升攻速和移速；满4层释放三道龙卷风，裹挟减速一切敌人',
        stacks: 0,
        maxStacks: 4,
        },
        weaponType: 'sword',
    },

    // --- 法师 ---
    mage: {
        id: 'mage',
        name: '法师·焰',
        desc: '远程法术攻击，发射追踪火球',
        color: '#ff6644',
        colors: ['#ff6644', '#ff4422', '#ffaa00'],
        icon: '🔥',
        baseStats: {
            maxHp: 120,
            hp: 120,
            attack: 32,
            attackSpeed: 1.1,
            critRate: 0.18,
            critDamage: 2.2,
            moveSpeed: 190,
            hpRegen: 1.0,
            pickupRange: 90,
            armor: 2,
        },
        passive: {
            name: '元素共鸣',
            desc: '每隔6秒释放火焰新星灼烧敌人；被灼烧的敌人叠加烈焰印记，每层使后续火焰伤害+25%',
            timer: 0,
            interval: 6,
        },
        weaponType: 'fireball',
    },

    // --- 刺客 ---
    assassin: {
        id: 'assassin',
        name: '刺客·影',
        desc: '瞬移突进近身暗杀，背刺造成双倍伤害',
        color: '#aa44ff',
        colors: ['#aa44ff', '#8822dd', '#cc66ff'],
        icon: '🗡️',
        baseStats: {
            maxHp: 95,
            hp: 95,
            attack: 30,
            attackSpeed: 1.8,
            critRate: 0.30,
            critDamage: 2.5,
            moveSpeed: 250,
            hpRegen: 0.6,
            pickupRange: 70,
            armor: 1,
        },
        passive: {
            name: '暗影步',
            desc: '每5秒瞬移至敌人身后背刺并标记目标；击杀标记目标100%重置冷却；标记敌人受到额外30%伤害',
            timer: 0,
            interval: 5,
            blinkReady: false,
        },
        weaponType: 'dagger',
    },
    // --- 圣骑士 ---
    paladin: {
        id: 'paladin',
        name: '圣骑士·盾',
        desc: '重锤横扫，神圣冲击波震退敌人',
        color: '#ffcc44',
        colors: ['#ffcc44', '#ffdd66', '#ffffff'],
        icon: '🛡️',
        baseStats: {
            maxHp: 200,
            hp: 200,
            attack: 22,
            attackSpeed: 0.9,
            critRate: 0.08,
            critDamage: 1.6,
            moveSpeed: 170,
            hpRegen: 2.0,
            pickupRange: 75,
            armor: 6,
        },
        passive: {
            name: '神圣格挡',
            desc: '受伤时25%概率格挡并反击范围圣光伤害、回复5%最大生命；每次格挡叠加坚韧层(最多8层)，每层减伤3%',
            chance: 0.25,
            fortifyStacks: 0,
            maxFortify: 8,
        },
        weaponType: 'hammer',
    },

    // --- 弓箭手 ---
    archer: {
        id: 'archer',
        name: '弓箭手·风',
        desc: '远程弓箭弹幕大师，万箭齐发覆盖战场',
        color: '#44ddaa',
        colors: ['#44ddaa', '#66eebb', '#88ffcc'],
        icon: '🏹',
        baseStats: {
            maxHp: 110,
            hp: 110,
            attack: 20,
            attackSpeed: 1.5,
            critRate: 0.12,
            critDamage: 1.8,
            moveSpeed: 205,
            hpRegen: 0.8,
            pickupRange: 100,
            armor: 2,
        },
        passive: {
            name: '箭雨·专注',
            desc: '连续攻击叠加专注(最多10层)，每层暴击率+2%、箭雨冷却-0.3秒；满层触发箭雨后重置',
            timer: 0,
            interval: 7,
            focusStacks: 0,
            maxFocus: 10,
        },
        weaponType: 'bow',
    },

    // --- 亡灵师 ---
    necromancer: {
        id: 'necromancer',
        name: '亡灵师·冥',
        desc: '召唤骷髅兵与灵魂巨兽为你而战',
        color: '#44ccaa',
        colors: ['#44ccaa', '#22aa88', '#66eedd'],
        icon: '💀',
        baseStats: {
            maxHp: 120,
            hp: 120,
            attack: 30,
            attackSpeed: 1.0,
            critRate: 0.15,
            critDamage: 2.0,
            moveSpeed: 190,
            hpRegen: 1.0,
            pickupRange: 80,
            armor: 2,
        },
        passive: {
            name: '灵魂收割',
            desc: '击杀积攒灵魂(满8个召唤巨兽)；每个灵魂为所有召唤物提供+5%伤害和+3%攻速的灵魂光环',
            souls: 0,
            maxSouls: 8,
        },
        weaponType: 'necro',
    },
};

class Player {
    constructor(charDef) {
        this.def = JSON.parse(JSON.stringify(charDef));
        this.x = 0;
        this.y = 0;
        this.radius = 16;

        // 属性
        this.stats = { ...charDef.baseStats };
        this.level = 1;
        this.exp = 0;
        this.expToNext = 15;
        this.kills = 0;

        // 状态
        this.invincibleTime = 0;
        this.damageFlash = 0;
        this.healFlash = 0;

        // 被动
        this.passive = JSON.parse(JSON.stringify(charDef.passive));

        // 动画
        this.facingAngle = 0;
        this.bodyBob = 0;
        this.bodyBobSpeed = 8;
        this.isMoving = false;

        // 武器等级
        this.weaponLevel = 1;
        this.weaponMaxLevel = 7;

        // 升级属性加成
        this.bonuses = {
            attackMult: 1,
            attackSpeedMult: 1,
            critRateBonus: 0,
            critDamageBonus: 0,
            moveSpeedMult: 1,
            maxHpBonus: 0,
            hpRegenBonus: 0,
            pickupRangeBonus: 0,
            armorBonus: 0,
            projectileBonus: 0,   // 额外投射物
            areaMult: 1,          // 攻击范围
            expMult: 1,           // 经验获取倍率（默认1=100%）

            // === 技能形态改变型Buff ===
            orbitalBlades: 0,     // 环绕刀刃数量
            fireTrail: false,     // 移动时留下火焰尾迹
            chainLightning: 0,    // 攻击时触发连锁闪电的次数
            thornAura: false,     // 荆棘光环，接触敌人受伤时反弹伤害
            splitShot: false,     // 投射物命中后分裂3个小弹
            homingShot: false,    // 投射物微弱追踪效果
            focusFire: false,     // 集火追踪：投射物强力锁定最近敌人，目标死亡后转火
            explosiveKill: false, // 击杀敌人时触发爆炸
            frostAura: false,     // 冰霜光环，减缓周围敌人
            vampiric: 0,          // 攻击吸血比例
            doubleStrike: 0,      // 双重打击概率

            // === 亡灵师召唤系统加成 ===
            summonDamageMult: 1,      // 召唤物伤害倍率
            summonMaxBonus: 0,        // 额外召唤物上限
            summonSpeedBonus: 0,      // 召唤物移速加成比例
            summonInheritBonus: 0,    // 召唤物属性继承额外比例
            summonDeathExplode: false, // 召唤物死亡爆炸
            summonHealAura: false,    // 召唤物回血光环

            // === 新增生存/战斗型Buff ===
            dodgeChance: 0,           // 闪避几率 (0~1)
            damageReduction: 0,       // 伤害减免比例 (0~0.5)
            shieldMax: 0,             // 护盾上限
            shieldRegen: 0,           // 护盾每秒回复量
            burnAura: false,          // 灬烧光环，对周围敌人持续火焰伤害
            killHeal: 0,              // 击杀回血量（固定值）
            goldBonus: 0,             // 额外金币获取比例
            projectileSpeed: 0,       // 投射物速度加成比例
            revive: 0,                // 复活次数
            rageMult: 0,              // 低血量时额外伤害加成 (0~1)
            luckyDrop: 0,             // 额外掉落率加成比例
            thornsReflect: 0,         // 反射伤害比例（如果thornAura是true时的反射率）
        };

        // 护盾系统
        this.shield = 0;          // 当前护盾值
        this.shieldRegenCD = 0;   // 护盾回复延迟（受伤后3秒才开始回复）

        // 连杀系统
        this.comboCount = 0;
        this.comboTimer = 0;
        this.comboDecay = 3;      // 3秒不击杀则重置
        this.maxCombo = 0;

        // 遗物列表
        this.relics = [];

        // 武器进化标记
        this.weaponEvolved = false;

        // 危险区域减速
        this._hazardSlow = 0;
    }

    // 获取实际属性
    getAttack() {
        let mult = this.bonuses.attackMult;
        // 怒气加伤：血量低于50%时触发
        if (this.bonuses.rageMult > 0 && this.stats.hp < this.getMaxHp() * 0.5) {
            mult += this.bonuses.rageMult;
        }
        return this.stats.attack * mult;
    }
    getAttackSpeed() {
        let mult = this.bonuses.attackSpeedMult;
        // 剑客被动：每层剑意+6%攻速
        if (this.def.id === 'swordsman' && this.passive.stacks > 0) {
            mult *= 1 + this.passive.stacks * 0.06;
        }
        return this.stats.attackSpeed * mult;
    }
    getCritRate() {
        let bonus = this.bonuses.critRateBonus;
        // 弓箭手被动：每层专注+2%暴击率
        if (this.def.id === 'archer' && this.passive.focusStacks > 0) {
            bonus += this.passive.focusStacks * 0.02;
        }
        return Math.min(1, this.stats.critRate + bonus);
    }
    getCritDamage() {
        return this.stats.critDamage + this.bonuses.critDamageBonus;
    }
    getMoveSpeed() {
        let mult = this.bonuses.moveSpeedMult;
        // 剑客被动：每层剑意+4%移速
        if (this.def.id === 'swordsman' && this.passive.stacks > 0) {
            mult *= 1 + this.passive.stacks * 0.04;
        }
        return this.stats.moveSpeed * mult;
    }
    getMaxHp() {
        return this.stats.maxHp + this.bonuses.maxHpBonus;
    }
    getHpRegen() {
        return this.stats.hpRegen + this.bonuses.hpRegenBonus;
    }
    getPickupRange() {
        return this.stats.pickupRange + this.bonuses.pickupRangeBonus;
    }
    getArmor() {
        return this.stats.armor + this.bonuses.armorBonus;
    }

    // 获得经验值
    addExp(amount) {
        const actual = Math.floor(amount * this.bonuses.expMult);
        this.exp += actual;
        let leveledUp = false;
        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            // 经验曲线：基础15，增长率1.35，使升级节奏明显放缓
            // Lv2=15, Lv5=40, Lv10=115, Lv15=330, Lv20=950
            this.expToNext = Math.floor(15 * Math.pow(1.35, this.level - 1));
            leveledUp = true;
        }
        return leveledUp;
    }

    // 受伤
    takeDamage(amount, particles) {
        if (this.invincibleTime > 0) return false;

        // 闪避判定
        if (this.bonuses.dodgeChance > 0 && Math.random() < this.bonuses.dodgeChance) {
            particles.addDamageText(this.x, this.y - 20, '闪避!', false, '#88ddff');
            this.invincibleTime = 0.2;
            return false;
        }

        // 圣骑士被动：坚韧减伤
        let fortifyReduction = 1;
        if (this.def.id === 'paladin' && this.passive.fortifyStacks > 0) {
            fortifyReduction = 1 - this.passive.fortifyStacks * 0.03;
        }

        // 圣骑士被动：神圣格挡 → 反击+回血+叠坚韧
        if (this.def.id === 'paladin' && Math.random() < this.passive.chance) {
            this.invincibleTime = 0.3;
            // 叠加坚韧层
            this.passive.fortifyStacks = Math.min(this.passive.maxFortify, this.passive.fortifyStacks + 1);
            // 回复5%最大生命
            const healAmt = this.getMaxHp() * 0.05;
            this.stats.hp = Math.min(this.getMaxHp(), this.stats.hp + healAmt);
            // 格挡特效 — 金色冲击波 + 反击伤害由 game.js 处理
            particles.addShockwave(this.x, this.y, '#ffcc44', 100, 0.35);
            particles.emit(this.x, this.y, 18, {
                colors: ['#ffcc44', '#ffdd66', '#ffffff'],
                speedMin: 3,
                speedMax: 8,
                sizeMin: 2,
                sizeMax: 5,
                lifeMin: 0.2,
                lifeMax: 0.5,
                glow: true,
            });
            particles.addDamageText(this.x, this.y - 20, `格挡! 坚韧x${this.passive.fortifyStacks}`, false, '#ffcc44');
            particles.addDamageText(this.x, this.y - 35, `+${Math.floor(healAmt)}`, false, '#44ff44');
            Utils.shake(4);
            return 'blocked';
        }

        let actualDamage = Math.max(1, (amount - this.getArmor()) * fortifyReduction);

        // 伤害减免
        if (this.bonuses.damageReduction > 0) {
            actualDamage *= (1 - Math.min(0.5, this.bonuses.damageReduction));
        }

        // 护盾吸收
        if (this.shield > 0) {
            const absorbed = Math.min(this.shield, actualDamage);
            this.shield -= absorbed;
            actualDamage -= absorbed;
            this.shieldRegenCD = 3; // 受伤后3秒才回复护盾
            particles.addDamageText(this.x, this.y - 35, `护盾-${Math.floor(absorbed)}`, false, '#8888ff');
            if (actualDamage <= 0) {
                this.invincibleTime = 0.2;
                this.damageFlash = 0.1;
                return false;
            }
        }

        this.stats.hp -= actualDamage;
        this.invincibleTime = 0.5;
        this.damageFlash = 0.2;
        this.shieldRegenCD = 3; // 受伤后3秒才回复护盾

        // 受伤粒子
        particles.emit(this.x, this.y, 10, {
            colors: ['#ff4444', '#ff6666', '#ff8888'],
            speedMin: 2,
            speedMax: 5,
            sizeMin: 2,
            sizeMax: 5,
            lifeMin: 0.3,
            lifeMax: 0.6,
        });
        Utils.shake(5);

        if (this.stats.hp <= 0) {
            // 复活检测
            if (this.bonuses.revive > 0) {
                this.bonuses.revive--;
                this.stats.hp = this.getMaxHp() * 0.3;
                this.invincibleTime = 2.0;
                particles.addDamageText(this.x, this.y - 40, '复活!', false, '#ffff44');
                particles.addShockwave(this.x, this.y, '#ffff44', 120, 0.4);
                particles.emit(this.x, this.y, 30, {
                    colors: ['#ffff44', '#ffdd00', '#ffffff'],
                    speedMin: 3, speedMax: 8,
                    sizeMin: 3, sizeMax: 7,
                    lifeMin: 0.4, lifeMax: 0.8,
                    glow: true,
                });
                return 'revived';
            }
            this.stats.hp = 0;
            return 'dead';
        }
        return true;
    }

    // 回血
    heal(amount, particles) {
        const before = this.stats.hp;
        this.stats.hp = Math.min(this.getMaxHp(), this.stats.hp + amount);
        const healed = this.stats.hp - before;
        if (healed > 0) {
            this.healFlash = 0.2;
            particles.addDamageText(this.x, this.y - 20, `+${Math.floor(healed)}`, false, '#44ff44');
        }
    }

    // 连杀
    addComboKill() {
        this.comboCount++;
        this.comboTimer = this.comboDecay;
        this.maxCombo = Math.max(this.maxCombo, this.comboCount);
    }

    getComboMultiplier() {
        // 每10连杀+5%伤害，上限50%
        return 1 + Math.min(0.5, Math.floor(this.comboCount / 10) * 0.05);
    }

    // 拾取遗物
    addRelic(relicId) {
        if (this.relics.includes(relicId)) return false;
        this.relics.push(relicId);
        const def = RelicDefs[relicId];
        if (def && def.apply) def.apply(this);
        return true;
    }

    // 更新
    update(dt, inputDir, particles) {
        // 连杀计时衰减
        if (this.comboTimer > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) this.comboCount = 0;
        }

        // 移动（含危险区域减速）
        if (inputDir.x !== 0 || inputDir.y !== 0) {
            const len = Math.sqrt(inputDir.x * inputDir.x + inputDir.y * inputDir.y);
            const nx = inputDir.x / len;
            const ny = inputDir.y / len;
            let speed = this.getMoveSpeed();
            if (this._hazardSlow > 0) {
                speed *= this._hazardSlow;
                this._hazardSlow = 0; // 每帧重置
            }
            this.x += nx * speed * dt;
            this.y += ny * speed * dt;
            this.facingAngle = Math.atan2(ny, nx);
            this.isMoving = true;
        } else {
            this.isMoving = false;
            this._hazardSlow = 0;
        }

        // 身体晃动
        if (this.isMoving) {
            this.bodyBob += this.bodyBobSpeed * dt;
        }

        // 无敌时间
        if (this.invincibleTime > 0) this.invincibleTime -= dt;
        if (this.damageFlash > 0) this.damageFlash -= dt;
        if (this.healFlash > 0) this.healFlash -= dt;

        // 回血
        if (this.stats.hp < this.getMaxHp()) {
            this.stats.hp = Math.min(this.getMaxHp(), this.stats.hp + this.getHpRegen() * dt);
        }

        // 护盾回复
        if (this.bonuses.shieldMax > 0) {
            if (this.shieldRegenCD > 0) {
                this.shieldRegenCD -= dt;
            } else if (this.shield < this.bonuses.shieldMax) {
                const regenRate = this.bonuses.shieldRegen > 0 ? this.bonuses.shieldRegen : this.bonuses.shieldMax * 0.1;
                this.shield = Math.min(this.bonuses.shieldMax, this.shield + regenRate * dt);
            }
        }

        // 被动技能更新
        this._updatePassive(dt, particles);
    }

    _updatePassive(dt, particles) {
        if (this.def.id === 'mage') {
            // 法师：元素共鸣计时
            this.passive.timer += dt;
            // 共鸣在 game.js 中触发
        } else if (this.def.id === 'assassin') {
            // 刺客：暗影步计时
            this.passive.timer += dt;
            // 瞬移在 weapons.js 中触发
        } else if (this.def.id === 'archer') {
            // 弓箭手：箭雨计时（专注层减少冷却）
            this.passive.timer += dt;
            const focusReduction = (this.passive.focusStacks || 0) * 0.3;
            const actualInterval = Math.max(2, this.passive.interval - focusReduction);
            if (this.passive.timer >= actualInterval) {
                this.passive.timer = 0;
                // 标记就绪，由 game.js 的 _updateArcherArrowRain 触发
                this.passive.ready = true;
                // 满层触发后重置专注层
                if (this.passive.focusStacks >= this.passive.maxFocus) {
                    this.passive.focusStacks = 0;
                }
            }
        }
    }

    // 渲染
    render(ctx, camera) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y;
        const bob = this.isMoving ? Math.sin(this.bodyBob) * 3 : 0;

        ctx.save();

        // 无敌闪烁
        if (this.invincibleTime > 0 && Math.floor(this.invincibleTime * 20) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        // 脚下光圈
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = this.def.color;
        ctx.beginPath();
        ctx.ellipse(sx, sy + this.radius + 2, this.radius * 1.2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = this.invincibleTime > 0 && Math.floor(this.invincibleTime * 20) % 2 === 0 ? 0.4 : 1;

        // 身体外圈光晕（用半透明圆代替shadowBlur）
        ctx.globalAlpha *= 0.25;
        ctx.fillStyle = this.def.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius + 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = this.invincibleTime > 0 && Math.floor(this.invincibleTime * 20) % 2 === 0 ? 0.4 : 1;

        // 身体
        ctx.fillStyle = this.def.color;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 受伤/回血闪光效果（用额外圆代替shadowBlur）
        if (this.damageFlash > 0) {
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
        if (this.healFlash > 0) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#00ff00';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 内圈
        ctx.fillStyle = '#fff';
        ctx.globalAlpha *= 0.3;
        ctx.beginPath();
        ctx.arc(sx - 3, sy - 3 + bob, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // 眼睛方向
        ctx.globalAlpha = 1;
        const eyeDist = 6;
        const eyeX = sx + Math.cos(this.facingAngle) * eyeDist;
        const eyeY = sy + Math.sin(this.facingAngle) * eyeDist + bob;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(eyeX - 3, eyeY - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 3, eyeY - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        // 瞳孔
        ctx.fillStyle = '#111';
        const pupilOff = 1.5;
        ctx.beginPath();
        ctx.arc(eyeX - 3 + Math.cos(this.facingAngle) * pupilOff, eyeY - 2 + Math.sin(this.facingAngle) * pupilOff, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 3 + Math.cos(this.facingAngle) * pupilOff, eyeY - 2 + Math.sin(this.facingAngle) * pupilOff, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}
