// ============================================
// 怪物系统 - 生成、AI、波次管理
// ============================================

const EnemyTypes = {
    // 普通小怪 - 骷髅
    skeleton: {
        name: '骷髅',
        color: '#c8e0c0',
        colors: ['#c8e0c0', '#a0d090'],
        radius: 12,
        hp: 25,
        damage: 8,
        speed: 62,
        exp: 3,
        score: 10,
    },
    // 快速小怪 - 蝙蝠
    bat: {
        name: '蝙蝠',
        color: '#9955cc',
        colors: ['#9955cc', '#cc88ff'],
        radius: 10,
        hp: 16,
        damage: 6,
        speed: 105,
        exp: 2,
        score: 8,
    },
    // 肉盾 - 史莱姆
    slime: {
        name: '史莱姆',
        color: '#22ee55',
        colors: ['#22ee55', '#88ffaa'],
        radius: 18,
        hp: 75,
        damage: 12,
        speed: 40,
        exp: 5,
        score: 15,
    },
    // 远程 - 骷髅法师
    skeletonMage: {
        name: '骷髅法师',
        color: '#7733dd',
        colors: ['#7733dd', '#aa66ff'],
        radius: 13,
        hp: 30,
        damage: 15,
        speed: 46,
        exp: 6,
        score: 20,
        ranged: true,
        shootInterval: 4.5,
    },
    // 中期快攻 - 暗影狼
    shadowWolf: {
        name: '暗影狼',
        color: '#3355aa',
        colors: ['#3355aa', '#5588dd'],
        radius: 11,
        hp: 40,
        damage: 12,
        speed: 125,
        exp: 4,
        score: 14,
    },
    // 中期肉盾 - 石像鬼
    gargoyle: {
        name: '石像鬼',
        color: '#bb8844',
        colors: ['#bb8844', '#ddaa66'],
        radius: 20,
        hp: 140,
        damage: 18,
        speed: 36,
        exp: 8,
        score: 22,
    },
    // 后期远程 - 恶魔术士
    demonCaster: {
        name: '恶魔术士',
        color: '#ff2266',
        colors: ['#ff2266', '#ff66aa'],
        radius: 14,
        hp: 60,
        damage: 25,
        speed: 44,
        exp: 10,
        score: 30,
        ranged: true,
        shootInterval: 2.8,
    },
    // 后期群攻 - 爆破虫
    exploder: {
        name: '爆破虫',
        color: '#ff6600',
        colors: ['#ff6600', '#ffcc00'],
        radius: 9,
        hp: 22,
        damage: 35,
        speed: 110,
        exp: 5,
        score: 18,
        isSuicidal: true,  // 近身自爆
    },
    // 精英 - 大骷髅
    eliteSkeleton: {
        name: '骷髅将军',
        color: '#ff3333',
        colors: ['#ff3333', '#ff8844'],
        radius: 22,
        hp: 250,
        damage: 22,
        speed: 52,
        exp: 25,
        score: 50,
        isElite: true,
    },
    // 后期精英 - 暗夜领主
    eliteDemon: {
        name: '暗夜领主',
        color: '#dd22aa',
        colors: ['#dd22aa', '#ff55cc'],
        radius: 24,
        hp: 500,
        damage: 30,
        speed: 56,
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
        hp: 1800,
        damage: 28,
        speed: 38,
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

// 主题专属Boss - 每个地图主题对应一个独特多阶段Boss
const ThemeBosses = {
    void_abyss: {
        name: '虚空裂隙守卫',
        color: '#9944ff',
        colors: ['#6622cc', '#9944ff', '#cc88ff'],
        pattern: 'voidGuardian',
        hpMult: 1.8,
        radiusMult: 1.3,
        desc: '传送+暗能量射线+虚空黑洞',
    },
    crimson_waste: {
        name: '猩红屠夫',
        color: '#cc1111',
        colors: ['#881111', '#cc1111', '#ff4444'],
        pattern: 'crimsonButcher',
        hpMult: 2.0,
        radiusMult: 1.4,
        desc: '狂暴冲锋+旋风斩+血刃风暴',
    },
    frost_realm: {
        name: '永冻冰龙',
        color: '#44ccee',
        colors: ['#2288bb', '#44ccee', '#aaeeff'],
        pattern: 'frostDragon',
        hpMult: 2.2,
        radiusMult: 1.5,
        desc: '冰息吐息+冰晶牢笼+暴风雪',
    },
    dark_forest: {
        name: '腐化之母',
        color: '#44cc44',
        colors: ['#227722', '#44cc44', '#88ff88'],
        pattern: 'corruptionMother',
        hpMult: 2.5,
        radiusMult: 1.6,
        desc: '毒雾区域+触手拍击+分裂增殖',
    },
    nether_volcano: {
        name: '熔岩巨兽',
        color: '#ff6600',
        colors: ['#cc3300', '#ff6600', '#ffaa00'],
        pattern: 'crimsonButcher',
        hpMult: 2.3,
        radiusMult: 1.5,
        desc: '岩浆喷射+地裂冲锋+陨石坠落',
    },
    celestial_ruins: {
        name: '天界守护者',
        color: '#ddaa44',
        colors: ['#aa7722', '#ddaa44', '#ffeebb'],
        pattern: 'voidGuardian',
        hpMult: 2.0,
        radiusMult: 1.4,
        desc: '圣光射线+传送+审判之环',
    },
};

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
        this.bodyBob = Math.random() * TWO_PI;
        this.slowTimer = 0;
        this.slowMult = 1;

        // AI行为模式: direct(直追), orbit(环绕), ambush(伏击), formation(编队)
        this._aiMode = 'direct';
        this._aiTimer = 0;
        this._aiPhase = 0;
        this._orbitAngle = Math.random() * TWO_PI;
        this._orbitDir = Math.random() < 0.5 ? 1 : -1;
        this._ambushReady = false;
        this._formationSlot = 0;
        // 根据类型分配AI模式概率
        if (type === 'bat' || type === 'shadowWolf') {
            // 快速单位：30%环绕，20%伏击
            const r = Math.random();
            if (r < 0.3) this._aiMode = 'orbit';
            else if (r < 0.5) this._aiMode = 'ambush';
        } else if (type === 'skeleton' || type === 'slime' || type === 'gargoyle') {
            // 近战单位：20%编队
            if (Math.random() < 0.2) this._aiMode = 'formation';
        } else if (type === 'skeletonMage' || type === 'demonCaster') {
            // 远程单位：40%环绕(保持距离)
            if (Math.random() < 0.4) this._aiMode = 'orbit';
        }

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

    // 应用主题专属Boss配置
    applyThemeBoss(themeKey) {
        const tb = ThemeBosses[themeKey];
        if (!tb) return;
        this.name = tb.name;
        this.color = tb.color;
        this.colors = tb.colors;
        this.bossPattern = tb.pattern;
        this.maxHp = Math.floor(this.maxHp * tb.hpMult);
        this.hp = this.maxHp;
        this.radius = Math.floor(this.radius * tb.radiusMult);
        this._isThemeBoss = true;
        this._themeKey = themeKey;
        // 主题Boss专属状态
        this._tbPhase = 0; // 当前阶段(多技能循环)
        this._tbSkillTimer = 0;
        this._tbTeleportCooldown = 0;
        this._tbBladeAngle = 0;
        this._tbSpiralAngle = 0;
        this._tbTentacles = [];
        this._tbSplitCount = 0;
        this.speed *= 0.6;
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

        // 受伤粒子(增强V3)
        particles.emit(this.x, this.y, 10, {
            colors: this.colors.concat(['#fff']),
            speedMin: 3,
            speedMax: 8,
            sizeMin: 2,
            sizeMax: 6,
            lifeMin: 0.2,
            lifeMax: 0.55,
            friction: 0.88,
            glow: true, glowSize: 6,
        });

        if (this.hp <= 0) {
            this.hp = 0;
            this.alive = false;
            // 开启死亡动画
            this.dying = true;
            this.deathTimer = 0;
            this.deathDuration = this.isBoss ? 1.0 : (this.isElite ? 0.5 : 0.35);
            this.deathX = this.x;
            this.deathY = this.y;
            // 随机死亡动画风格（普通敌人多样化）
            if (!this.isBoss && !this.isElite) {
                this._deathStyle = Math.floor(Math.random() * 4); // 0=碎片 1=蒸发 2=内爆 3=像素化
            } else {
                this._deathStyle = 0;
            }
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
            const distSq = dx * dx + dy * dy;

            if (this.slowTimer > 0) {
                this.slowTimer -= dt;
                if (this.slowTimer <= 0) this.slowMult = 1;
            }
            const spd = this.speed * this.slowMult;

            // 地图buff：传送能力（虚空深渊）
            if (this._canTeleport && distSq > 250 * 250) {
                if (!this._teleportCd) this._teleportCd = 0;
                this._teleportCd -= dt;
                if (this._teleportCd <= 0) {
                    // 传送到玩家附近
                    const ta = Math.random() * TWO_PI;
                    this.x = tx + Math.cos(ta) * (60 + Math.random() * 40);
                    this.y = ty + Math.sin(ta) * (60 + Math.random() * 40);
                    this._teleportCd = 5 + Math.random() * 3;
                }
            }

            if (distSq > 1) { // > 1px² 避免除零
                const stopDist = this.ranged ? 200 : (this.bossPattern === 'bulletHell' ? 250 : 0);
                const dist = Math.sqrt(distSq);

                // AI行为模式分支（Boss和精英始终直追）
                if (this._aiMode !== 'direct' && !this.isBoss && !this.isElite) {
                    this._aiTimer += dt;
                    switch (this._aiMode) {
                        case 'orbit': {
                            // 环绕型：保持一定距离绕玩家转圈
                            const orbitDist = this.ranged ? 220 : 130;
                            this._orbitAngle += this._orbitDir * (spd / orbitDist) * dt;
                            const targetX = tx + Math.cos(this._orbitAngle) * orbitDist;
                            const targetY = ty + Math.sin(this._orbitAngle) * orbitDist;
                            const odx = targetX - this.x;
                            const ody = targetY - this.y;
                            const oDist = Math.sqrt(odx * odx + ody * ody);
                            if (oDist > 5) {
                                this.x += (odx / oDist) * spd * dt;
                                this.y += (ody / oDist) * spd * dt;
                            }
                            // 距离太远时切回直追接近
                            if (dist > orbitDist * 2.5) {
                                this.x += (dx / dist) * spd * dt * 0.5;
                                this.y += (dy / dist) * spd * dt * 0.5;
                            }
                            break;
                        }
                        case 'ambush': {
                            // 伏击型：先接近到一定距离后停住蓄力，然后冲刺
                            if (!this._ambushReady) {
                                // 接近阶段：缓慢接近到冲刺距离
                                if (dist > 180) {
                                    this.x += (dx / dist) * spd * 0.6 * dt;
                                    this.y += (dy / dist) * spd * 0.6 * dt;
                                } else {
                                    this._ambushReady = true;
                                    this._aiTimer = 0;
                                }
                            } else {
                                // 蓄力后冲刺
                                if (this._aiTimer < 0.8) {
                                    // 蓄力等待（原地抖动）
                                    this.x += (Math.random() - 0.5) * 2;
                                    this.y += (Math.random() - 0.5) * 2;
                                } else if (this._aiTimer < 1.4) {
                                    // 冲刺阶段
                                    this.x += (dx / dist) * spd * 3.0 * dt;
                                    this.y += (dy / dist) * spd * 3.0 * dt;
                                } else {
                                    // 冲刺结束重置
                                    this._ambushReady = false;
                                    this._aiTimer = 0;
                                }
                            }
                            break;
                        }
                        case 'formation': {
                            // 编队型：维持与附近同类的间距，集群移动
                            const formAngle = Utils.angle(this.x, this.y, tx, ty);
                            // 主方向移动
                            this.x += Math.cos(formAngle) * spd * dt;
                            this.y += Math.sin(formAngle) * spd * dt;
                            // 横向微偏移保持编队感（sin波动）
                            const lateralOffset = Math.sin(this._aiTimer * 2 + this._formationSlot) * 0.8;
                            this.x += Math.cos(formAngle + Math.PI / 2) * lateralOffset;
                            this.y += Math.sin(formAngle + Math.PI / 2) * lateralOffset;
                            break;
                        }
                    }
                } else if (distSq > stopDist * stopDist) {
                    // 默认直追逻辑
                    const invDist = 1 / dist;
                    this.x += dx * invDist * spd * dt;
                    this.y += dy * invDist * spd * dt;
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

            // ========== 主题专属Boss AI ==========

            // 虚空裂隙守卫: 传送→暗能量射线→虚空黑洞 三阶段循环
            case 'voidGuardian': {
                this._tbSkillTimer += dt;
                this._tbTeleportCooldown -= dt;
                const phase = this._tbPhase % 3;
                if (phase === 0) {
                    // 阶段0: 传送到玩家附近随机位置
                    if (this._tbSkillTimer >= 2.5) {
                        this._tbSkillTimer = 0;
                        const tpAngle = Math.random() * TWO_PI;
                        const tpDist = 120 + Math.random() * 80;
                        this.x = playerX + Math.cos(tpAngle) * tpDist;
                        this.y = playerY + Math.sin(tpAngle) * tpDist;
                        this._tbPhase++;
                        return { type: 'voidTeleport', x: this.x, y: this.y };
                    }
                } else if (phase === 1) {
                    // 阶段1: 暗能量射线 - 向玩家发射扇形弹幕
                    if (this._tbSkillTimer >= 1.5) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        const aimAngle = Utils.angle(this.x, this.y, playerX, playerY);
                        return { type: 'voidRay', x: this.x, y: this.y, angle: aimAngle, spread: 0.8, count: 7 };
                    }
                } else {
                    // 阶段2: 虚空黑洞 - 在玩家位置生成吸引区域
                    if (this._tbSkillTimer >= 3.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        return { type: 'voidBlackhole', x: playerX, y: playerY, radius: 140, duration: 2.5 };
                    }
                }
                break;
            }

            // 猩红屠夫: 狂暴冲锋→旋风斩→血刃风暴 三阶段循环
            case 'crimsonButcher': {
                this._tbSkillTimer += dt;
                const cPhase = this._tbPhase % 3;
                if (cPhase === 0) {
                    // 阶段0: 狂暴冲锋 - 连续3次短距冲刺
                    if (!this.bossCharging) {
                        if (this._tbSkillTimer >= 2.0) {
                            this._tbSkillTimer = 0;
                            this.bossChargeDir = Utils.angle(this.x, this.y, playerX, playerY);
                            this.bossCharging = true;
                            this.bossChargeSpeed = 550;
                            this._chargeTime = 0;
                            if (!this._tbChargeCount) this._tbChargeCount = 0;
                            this._tbChargeCount++;
                        }
                    } else {
                        this._chargeTime += dt;
                        if (this._chargeTime >= 0.5) {
                            this.bossCharging = false;
                            this.bossChargeSpeed = 0;
                            if (this._tbChargeCount >= 3) {
                                this._tbChargeCount = 0;
                                this._tbPhase++;
                                this._tbSkillTimer = 0;
                            }
                            return { type: 'bossSlam', x: this.x, y: this.y, radius: 60 };
                        }
                    }
                } else if (cPhase === 1) {
                    // 阶段1: 旋风斩 - 持续旋转造成范围伤害
                    this._tbBladeAngle += dt * 12;
                    if (this._tbSkillTimer >= 3.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        this._tbWhirlHitTimer = 0;
                        return { type: 'crimsonWhirlwind', x: this.x, y: this.y, radius: 120, duration: 3.0 };
                    }
                    if (!this._tbWhirlHitTimer) this._tbWhirlHitTimer = 0;
                    this._tbWhirlHitTimer += dt;
                    if (this._tbWhirlHitTimer >= 0.4) {
                        this._tbWhirlHitTimer = 0;
                        return { type: 'bossSlam', x: this.x, y: this.y, radius: 100 };
                    }
                } else {
                    // 阶段2: 血刃风暴 - 全方向投射飞刃
                    if (this._tbSkillTimer >= 2.5) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        return { type: 'bossBullets', x: this.x, y: this.y, baseAngle: Math.random() * TWO_PI, count: 12 };
                    }
                }
                break;
            }

            // 永冻冰龙: 冰息吐息→冰晶牢笼→暴风雪 三阶段循环
            case 'frostDragon': {
                this._tbSkillTimer += dt;
                const fPhase = this._tbPhase % 3;
                if (fPhase === 0) {
                    // 阶段0: 冰息吐息 - 锥形范围持续伤害
                    if (this._tbSkillTimer >= 3.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        const breathAngle = Utils.angle(this.x, this.y, playerX, playerY);
                        return { type: 'frostBreath', x: this.x, y: this.y, angle: breathAngle, coneWidth: 1.0, range: 250, duration: 2.0 };
                    }
                } else if (fPhase === 1) {
                    // 阶段1: 冰晶牢笼 - 在玩家周围生成冰墙阻挡
                    if (this._tbSkillTimer >= 3.5) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        return { type: 'frostCage', x: playerX, y: playerY, radius: 100, pillars: 8 };
                    }
                } else {
                    // 阶段2: 暴风雪 - 全屏减速+散弹
                    if (this._tbSkillTimer >= 4.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        this._tbSpiralAngle = 0;
                        return { type: 'frostStorm', x: this.x, y: this.y, duration: 3.0 };
                    }
                    // 暴风雪期间持续散射冰弹
                    this._tbSpiralAngle += dt * 3;
                    if (this.bossPhaseTimer % 0.5 < dt) {
                        return { type: 'bossBullets', x: this.x, y: this.y, baseAngle: this._tbSpiralAngle, count: 4 };
                    }
                }
                break;
            }

            // 腐化之母: 毒雾区域→触手拍击→分裂增殖 三阶段循环
            case 'corruptionMother': {
                this._tbSkillTimer += dt;
                const mPhase = this._tbPhase % 3;
                if (mPhase === 0) {
                    // 阶段0: 毒雾区域 - 多个持续伤害地带
                    if (this._tbSkillTimer >= 3.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        return { type: 'poisonCloud', x: this.x, y: this.y, targetX: playerX, targetY: playerY, count: 4, radius: 80, duration: 4.0 };
                    }
                } else if (mPhase === 1) {
                    // 阶段1: 触手拍击 - 从Boss周围伸出触手攻击
                    if (this._tbSkillTimer >= 2.5) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        const tentacleAngle = Utils.angle(this.x, this.y, playerX, playerY);
                        return { type: 'tentacleSlam', x: this.x, y: this.y, angle: tentacleAngle, count: 3, range: 200 };
                    }
                } else {
                    // 阶段2: 分裂增殖 - 召唤小怪 + Boss获得短暂护盾
                    if (this._tbSkillTimer >= 4.0) {
                        this._tbSkillTimer = 0;
                        this._tbPhase++;
                        this._tbSplitCount++;
                        // 每次分裂增殖越来越多
                        const spawnCount = Math.min(3 + this._tbSplitCount, 8);
                        return { type: 'corruptionSpawn', x: this.x, y: this.y, count: spawnCount, shieldHp: Math.floor(this.maxHp * 0.1) };
                    }
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

        // 地图buff：隐身（暗影森林）——接近玩家才显现
        if (this._stealth) {
            const pdx = sx - screenW * 0.5, pdy = sy - screenH * 0.5;
            const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
            const stealthAlpha = Math.max(0.08, Math.min(1, 1 - (pDist - 100) / 250));
            ctx.globalAlpha = stealthAlpha;
        }

        // === LOD分级渲染 ===
        // 有精灵图时：所有可见怪物统一用精灵图（drawImage单次调用，性能优秀）
        // 无精灵图回退时：根据距离降级 LOD 0/1/2
        const cx = screenW * 0.5, cy = screenH * 0.5;
        const distSq = (sx - cx) * (sx - cx) + (sy - cy) * (sy - cy);
        const diagHalfSq = cx * cx + cy * cy;
        const hasSpriteReady = spriteLoader && spriteLoader.ready && spriteLoader.sprites[this.type];
        // 有精灵图 → 全部LOD 0；无精灵图 → 按距离分级
        const lod = hasSpriteReady ? 0 : ((this.isBoss || this.isElite) ? 0 : (distSq < diagHalfSq * 0.2025 ? 0 : (distSq < diagHalfSq * 0.3844 ? 1 : 2)));

        const bob = lod < 2 ? Math.sin(this.bodyBob) * 2 : 0; // 低LOD不算bob

        // === LOD 2: 简化渲染 —— 圆形身体 + 血条，无眼睛/特效 ===
        if (lod === 2) {
            ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
            const r = this.radius;
            ctx.beginPath();
            ctx.arc(sx, sy, r, 0, TWO_PI);
            ctx.fill();
            if (this.hp < this.maxHp) {
                const barW = r * 2.5, barH = 4;
                const barY = sy - r - 8;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(sx - barW / 2, barY, barW, barH);
                const ratio = this.hp / this.maxHp;
                ctx.fillStyle = ratio > 0.5 ? '#44ff44' : (ratio > 0.25 ? '#ffaa00' : '#ff4444');
                ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
            }
            return;
        }

        // === LOD 1: 身体fillRect + 眼睛fillRect + 血条，无save/restore ===
        if (lod === 1) {
            const r = this.radius;
            // 精英/Boss光圈
            if ((this.isElite && !this.affixColor) || this.isBoss) {
                ctx.globalAlpha = 0.25;
                ctx.fillStyle = this.isBoss ? '#ff4444' : '#ffaa00';
                const gr = r + 8;
                ctx.fillRect(sx - gr, sy + bob - gr, gr * 2, gr * 2);
                ctx.globalAlpha = 1;
            }
            // 身体
            ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, r, 0, TWO_PI);
            ctx.fill();
            // 眼睛用 fillRect
            ctx.fillStyle = this.isBoss ? '#ffaa00' : '#ff4444';
            const es = r * 0.2;
            const ey = sy - r * 0.1 + bob;
            ctx.fillRect(sx - r * 0.25 - es, ey - es, es * 2, es * 2);
            ctx.fillRect(sx + r * 0.25 - es, ey - es, es * 2, es * 2);
            // 血条
            if (this.hp < this.maxHp && !this.isBoss) {
                const barW = r * 2.5, barH = 4;
                const barY = sy - r - 10 + bob;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(sx - barW / 2, barY, barW, barH);
                const ratio = this.hp / this.maxHp;
                ctx.fillStyle = ratio > 0.5 ? '#44ff44' : (ratio > 0.25 ? '#ffaa00' : '#ff4444');
                ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
            }
            return;
        }

        // === LOD 0: 完整细节渲染 ===
        // 普通敌人快速路径：无精英/Boss/护盾/灼烧/蓄力等特效时，跳过 save/restore
        const hasSpecial = this.isBoss || this.isElite || this.affixColor
            || (this._shielded && this._shieldHp > 0)
            || (this.ranged && this._chargeRatio > 0)
            || this._burnTimer > 0
            || this.bossCharging;
        if (!hasSpecial) {
            // === 尝试使用精灵图渲染 ===
            const spriteFrame = spriteLoader && spriteLoader.ready ? spriteLoader.getFrame(this.type, this.bodyBob) : null;
            if (spriteFrame) {
                const sprSize = spriteLoader.getSpriteSize(this.type);
                const drawX = sx - sprSize / 2;
                const drawY = sy + bob - sprSize / 2;
                // 受伤闪白：先画精灵再叠白色
                if (this.damageFlash > 0) {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(spriteFrame, drawX, drawY, sprSize, sprSize);
                    ctx.globalAlpha = 0.6;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(sx, sy + bob, this.radius + 2, 0, TWO_PI);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                } else {
                    ctx.drawImage(spriteFrame, drawX, drawY, sprSize, sprSize);
                }
                // 近战冷却指示
                if (!this.ranged && this.attackCooldown > 0.3) {
                    ctx.globalAlpha = 0.25;
                    ctx.fillStyle = '#ff4444';
                    ctx.beginPath();
                    ctx.arc(sx, sy + bob, this.radius + 5, 0, TWO_PI);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
                // 血条
                if (this.hp < this.maxHp) {
                    const barW = this.radius * 2.5, barH = 4;
                    const barY = sy - this.radius - 10 + bob;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.fillRect(sx - barW / 2, barY, barW, barH);
                    const ratio = this.hp / this.maxHp;
                    ctx.fillStyle = ratio > 0.5 ? '#44ff44' : (ratio > 0.25 ? '#ffaa00' : '#ff4444');
                    ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
                }
                return;
            }
            // === 回退：原有圆形渲染 ===
            // — 身体 —
            ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius, 0, TWO_PI);
            ctx.fill();
            // 受伤闪白
            if (this.damageFlash > 0) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(sx, sy + bob, this.radius + 4, 0, TWO_PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            // — 近战冷却指示 —
            if (!this.ranged && this.attackCooldown > 0.3) {
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = '#ff4444';
                ctx.beginPath();
                ctx.arc(sx, sy + bob, this.radius + 6, 0, TWO_PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            // — 高光 —
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(sx - this.radius * 0.2, sy - this.radius * 0.2 + bob, this.radius * 0.5, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            // — 眼睛 —
            ctx.fillStyle = '#ff4444';
            const eyeS = this.radius * 0.2;
            ctx.beginPath();
            ctx.arc(sx - this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeS, 0, TWO_PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(sx + this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeS, 0, TWO_PI);
            ctx.fill();
            // — 血条 —
            if (this.hp < this.maxHp) {
                const barW = this.radius * 2.5, barH = 4;
                const barY = sy - this.radius - 10 + bob;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.fillRect(sx - barW / 2, barY, barW, barH);
                const ratio = this.hp / this.maxHp;
                ctx.fillStyle = ratio > 0.5 ? '#44ff44' : (ratio > 0.25 ? '#ffaa00' : '#ff4444');
                ctx.fillRect(sx - barW / 2, barY, barW * ratio, barH);
            }
            return;
        }

        // === LOD 0 完整路径（精英/Boss/特效敌人） ===
        ctx.save();

        // 精英词缀光圈
        if (this.affixColor) {
            ctx.globalAlpha = 0.25 + Math.sin(this.bodyBob * 3) * 0.1;
            ctx.fillStyle = this.affixColor;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 10, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 精英/Boss光圈
        if ((this.isElite && !this.affixColor) || this.isBoss) {
            ctx.globalAlpha = 0.2 + Math.sin(this.bodyBob * 2) * 0.1;
            ctx.fillStyle = this.isBoss ? '#ff4444' : '#ffaa00';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 8, 0, TWO_PI);
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
            ctx.arc(sx, sy + bob, this.radius + 6, 0, TWO_PI);
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
            ctx.arc(sx, sy + bob, this.radius + 4 + cr * 12, 0, TWO_PI);
            ctx.stroke();
            ctx.globalAlpha = cr * 0.2;
            ctx.fillStyle = '#ff4466';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + cr * 8, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 近战攻击冷却指示
        if (!this.ranged && this.attackCooldown > 0.3) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ff4444';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 6, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 身体 - 尝试使用精灵图
        const eliteSpriteFrame = spriteLoader && spriteLoader.ready ? spriteLoader.getFrame(this.type, this.bodyBob) : null;
        if (eliteSpriteFrame) {
            const eSprSize = spriteLoader.getSpriteSize(this.type);
            const eDrawX = sx - eSprSize / 2;
            const eDrawY = sy + bob - eSprSize / 2;
            if (this.damageFlash > 0) {
                ctx.globalAlpha = 0.5;
                ctx.drawImage(eliteSpriteFrame, eDrawX, eDrawY, eSprSize, eSprSize);
                ctx.globalAlpha = 0.5;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(sx, sy + bob, this.radius + 3, 0, TWO_PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            } else {
                ctx.drawImage(eliteSpriteFrame, eDrawX, eDrawY, eSprSize, eSprSize);
            }
        } else {
            // 回退：圆形身体
            ctx.fillStyle = this.damageFlash > 0 ? '#ffffff' : this.color;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius, 0, TWO_PI);
            ctx.fill();
            // 受伤闪白外圈
            if (this.damageFlash > 0) {
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(sx, sy + bob, this.radius + 4, 0, TWO_PI);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            // 高光
            ctx.fillStyle = '#fff';
            ctx.globalAlpha = 0.2;
            ctx.beginPath();
            ctx.arc(sx - this.radius * 0.2, sy - this.radius * 0.2 + bob, this.radius * 0.5, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            // 眼睛
            ctx.fillStyle = this.isBoss ? '#ffaa00' : '#ff4444';
            const eyeSize = this.radius * 0.2;
            ctx.beginPath();
            ctx.arc(sx - this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeSize, 0, TWO_PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(sx + this.radius * 0.25, sy - this.radius * 0.1 + bob, eyeSize, 0, TWO_PI);
            ctx.fill();
        }

        // 灼烧效果
        if (this._burnTimer > 0) {
            ctx.globalAlpha = 0.3 + Math.sin(this.bodyBob * 6) * 0.15;
            ctx.fillStyle = '#ff4422';
            ctx.beginPath();
            ctx.arc(sx, sy + bob, this.radius + 5, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

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
        // 重置隐身透明度
        if (this._stealth) ctx.globalAlpha = 1;
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
            // Boss死亡：多重扩散环+强闪光+内核
            for (let r = 0; r < 5; r++) {
                const rt = Utils.clamp(t * 3 - r * 0.2, 0, 1);
                if (rt <= 0) continue;
                ctx.globalAlpha = (1 - rt) * 0.6;
                ctx.strokeStyle = this.colors[r % this.colors.length];
                ctx.lineWidth = (5 - r) * (1 - rt);
                ctx.beginPath();
                ctx.arc(sx, sy, this.radius * (1 + rt * 5), 0, TWO_PI);
                ctx.stroke();
            }
            // 白热内核
            ctx.globalAlpha = (1 - t) * 0.9;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy, this.radius * (1 - t * 0.5), 0, TWO_PI);
            ctx.fill();
            // 外层辉光
            ctx.globalAlpha = (1 - t) * 0.3;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(sx, sy, this.radius * (1 + t * 2), 0, TWO_PI);
            ctx.fill();
        } else {
            const style = this._deathStyle || 0;
            if (style === 0) {
                // 风格0：经典碎片扩散
                if (t < 0.2) {
                    const ft = t / 0.2;
                    ctx.globalAlpha = (1 - ft) * 0.7;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * (1 + ft * 2.5), 0, TWO_PI);
                    ctx.fill();
                }
                ctx.globalAlpha = (1 - t) * 0.8;
                ctx.fillStyle = this.color;
                const pieces = this.isElite ? 12 : 6;
                for (let i = 0; i < pieces; i++) {
                    const angle = (i / pieces) * TWO_PI + t * 4;
                    const dist = this.radius * t * (this.isElite ? 4 : 2.5);
                    const size = this.radius * (this.isElite ? 0.35 : 0.28) * (1 - t);
                    ctx.beginPath();
                    ctx.arc(sx + Math.cos(angle) * dist, sy + Math.sin(angle) * dist, size, 0, TWO_PI);
                    ctx.fill();
                }
            } else if (style === 1) {
                // 风格1：蒸发（从下向上溶解 + 淡出粒子上升）
                ctx.globalAlpha = (1 - t) * 0.9;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(sx, sy - t * this.radius * 2, this.radius * (1 - t * 0.6), 0, TWO_PI);
                ctx.fill();
                // 上升蒸汽粒子
                for (let i = 0; i < 4; i++) {
                    const px = sx + (Math.random() - 0.5) * this.radius * 2;
                    const py = sy - t * this.radius * 3 - i * 5;
                    ctx.globalAlpha = (1 - t) * 0.4;
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(px, py, 2 * (1 - t), 0, TWO_PI);
                    ctx.fill();
                }
            } else if (style === 2) {
                // 风格2：内爆（先缩小后爆炸环）
                if (t < 0.5) {
                    // 缩小阶段
                    const shrink = 1 - t * 1.8;
                    ctx.globalAlpha = 0.9;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * Math.max(0.1, shrink), 0, TWO_PI);
                    ctx.fill();
                    // 吸收线条
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 1.5;
                    ctx.globalAlpha = (0.5 - t) * 1.2;
                    for (let i = 0; i < 6; i++) {
                        const a = (i / 6) * TWO_PI;
                        const outerD = this.radius * 3 * (0.5 - t);
                        ctx.beginPath();
                        ctx.moveTo(sx + Math.cos(a) * outerD, sy + Math.sin(a) * outerD);
                        ctx.lineTo(sx, sy);
                        ctx.stroke();
                    }
                } else {
                    // 爆发环
                    const et = (t - 0.5) / 0.5;
                    ctx.globalAlpha = (1 - et) * 0.8;
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 3 * (1 - et);
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * (0.5 + et * 3), 0, TWO_PI);
                    ctx.stroke();
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 2 * (1 - et);
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * (0.3 + et * 2), 0, TWO_PI);
                    ctx.stroke();
                }
            } else {
                // 风格3：像素化消散
                ctx.globalAlpha = (1 - t) * 0.85;
                const pixSize = Math.max(2, this.radius * 0.35);
                const gridN = Math.ceil(this.radius * 2 / pixSize);
                for (let gx = 0; gx < gridN; gx++) {
                    for (let gy = 0; gy < gridN; gy++) {
                        // 每个块以不同速率飘散
                        const seed = (gx * 7 + gy * 13) % 17 / 17;
                        if (seed < t * 1.2) continue; // 逐步消失
                        const ox = (gx - gridN / 2) * pixSize + (Math.random() - 0.5) * t * 8;
                        const oy = (gy - gridN / 2) * pixSize + t * seed * 15;
                        ctx.fillStyle = this.color;
                        ctx.fillRect(sx + ox - pixSize / 2, sy + oy - pixSize / 2, pixSize * (1 - t * 0.5), pixSize * (1 - t * 0.5));
                    }
                }
            }
            // 精英额外：双层扩散光环
            if (this.isElite) {
                if (t < 0.6) {
                    ctx.globalAlpha = (0.6 - t) * 0.6;
                    ctx.strokeStyle = this.color;
                    ctx.lineWidth = 3 * (1 - t);
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * (1 + t * 4), 0, TWO_PI);
                    ctx.stroke();
                }
                if (t < 0.4) {
                    ctx.globalAlpha = (0.4 - t) * 0.4;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(sx, sy, this.radius * (1 + t * 2.5), 0, TWO_PI);
                    ctx.stroke();
                }
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

        // 波次配置（14阶段激进难度曲线，压力来得又快又猛）
        this.waveConfigs = [
            // 阶段1 (0~15s)：极短新手期，很快加压
            { time: 0,   types: ['skeleton', 'bat'], spawnRate: 1.0, count: 5, mult: 0.9 },
            // 阶段2 (15~40s)：加入史莱姆，已有精英
            { time: 15,  types: ['skeleton', 'bat', 'slime'], spawnRate: 0.8, count: 7, mult: 1.1, elite: 'eliteSkeleton', eliteChance: 0.04 },
            // 阶段3 (40~80s)：加入骷髅法师+暗影狼
            { time: 40,  types: ['skeleton', 'bat', 'slime', 'shadowWolf'], spawnRate: 0.65, count: 9, mult: 1.4, elite: 'eliteSkeleton', eliteChance: 0.06, rangedType: 'skeletonMage', rangedChance: 0.15 },
            // 阶段4 (80~130s)：全面加压
            { time: 80,  types: ['skeleton', 'bat', 'slime', 'shadowWolf', 'gargoyle'], spawnRate: 0.5, count: 12, mult: 1.8, elite: 'eliteSkeleton', eliteChance: 0.08, rangedType: 'skeletonMage', rangedChance: 0.18 },
            // 阶段5 (130~190s)：中期强敌
            { time: 130, types: ['shadowWolf', 'bat', 'slime', 'gargoyle', 'skeleton'], spawnRate: 0.4, count: 15, mult: 2.3, elite: 'eliteSkeleton', eliteChance: 0.10, rangedType: 'skeletonMage', rangedChance: 0.20 },
            // 阶段6 (190~260s)：加入爆破虫+恶魔术士
            { time: 190, types: ['shadowWolf', 'gargoyle', 'exploder', 'slime', 'bat'], spawnRate: 0.32, count: 18, mult: 2.9, elite: 'eliteDemon', eliteChance: 0.12, rangedType: 'demonCaster', rangedChance: 0.22 },
            // 阶段7 (260~340s)：高密度战斗
            { time: 260, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.26, count: 22, mult: 3.5, elite: 'eliteDemon', eliteChance: 0.15, rangedType: 'demonCaster', rangedChance: 0.26 },
            // 阶段8 (340~420s)：压力爆表
            { time: 340, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.22, count: 28, mult: 4.2, elite: 'eliteDemon', eliteChance: 0.18, rangedType: 'demonCaster', rangedChance: 0.30 },
            // 阶段9 (420~500s)：噩梦开始
            { time: 420, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime', 'skeleton'], spawnRate: 0.18, count: 34, mult: 5.0, elite: 'eliteDemon', eliteChance: 0.22, rangedType: 'demonCaster', rangedChance: 0.33 },
            // 阶段10 (500~600s)：地狱模式
            { time: 500, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.15, count: 40, mult: 6.0, elite: 'eliteDemon', eliteChance: 0.26, rangedType: 'demonCaster', rangedChance: 0.36 },
            // 阶段11 (600~720s)：绝望
            { time: 600, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.12, count: 48, mult: 7.5, elite: 'eliteDemon', eliteChance: 0.30, rangedType: 'demonCaster', rangedChance: 0.38 },
            // 阶段12 (720~900s)：终极考验
            { time: 720, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime', 'skeleton'], spawnRate: 0.10, count: 55, mult: 9.0, elite: 'eliteDemon', eliteChance: 0.35, rangedType: 'demonCaster', rangedChance: 0.40 },
            // 阶段13 (900~1200s)：无尽深渊
            { time: 900, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime'], spawnRate: 0.08, count: 65, mult: 11.0, elite: 'eliteDemon', eliteChance: 0.38, rangedType: 'demonCaster', rangedChance: 0.42 },
            // 阶段14 (1200s+)：真·无尽
            { time: 1200, types: ['shadowWolf', 'gargoyle', 'exploder', 'demonCaster', 'slime', 'skeleton'], spawnRate: 0.06, count: 80, mult: 14.0, elite: 'eliteDemon', eliteChance: 0.42, rangedType: 'demonCaster', rangedChance: 0.45 },
        ];

        // 阶段Boss：首次180秒（3分钟），之后逐步缩短间隔（最短90秒）
        this.stageBossInterval = 180;
        this.nextStageBossTime = this.stageBossInterval;
        this.stageBossCount = 0;
        this.activeStageBoss = null; // 当前存活的阶段Boss引用

        // 精英围攻波次：首次120秒，之后逐步缩短间隔
        this.nextSiegeTime = 120;
        this.siegeCount = 0;
    }

    update(dt, playerX, playerY, enemies, particles) {
        this.gameTime += dt;
        this.timer += dt;
        this.spawnTimer += dt;

        // 难度递增（激进曲线 - 前期快速上压，后期极度凶猛）
        const t = this.gameTime;
        if (t < 60) {
            this.difficulty = 1 + t / 40;                 // 1分钟 → 2.5x（立刻感到压力）
        } else if (t < 180) {
            this.difficulty = 2.5 + (t - 60) / 40;        // 3分钟 → 5.5x（中期压力剧增）
        } else if (t < 400) {
            this.difficulty = 5.5 + (t - 180) / 35;       // 6.7分钟 → 11.8x（后期碾压）
        } else if (t < 700) {
            this.difficulty = 11.8 + (t - 400) / 40;      // 11.7分钟 → 19.3x（极限）
        } else {
            // 11.7分钟后: 无限增长（每分钟 +2x）
            this.difficulty = 19.3 + (t - 700) / 30;
        }

        // 获取当前波次配置
        let config = this.waveConfigs[0];
        for (let i = this.waveConfigs.length - 1; i >= 0; i--) {
            if (this.gameTime >= this.waveConfigs[i].time) {
                config = this.waveConfigs[i];
                break;
            }
        }

        // 生成怪物（设置总数上限，防止低端设备帧率崩溃）
        // 移动端150，桌面端300；接近上限时逐步减少生成量（软上限）
        const ENEMY_CAP = this._isMobile ? 80 : 300;
        const ENEMY_SOFT_CAP = ENEMY_CAP * 0.75; // 达到75%上限时开始减少生成

        if (this.spawnTimer >= config.spawnRate && enemies.length < ENEMY_CAP) {
            this.spawnTimer = 0;
            let count = config.count + Math.floor(this.gameTime / 90);

            // 软上限：接近上限时按比例减少生成数量
            if (enemies.length > ENEMY_SOFT_CAP) {
                const throttle = 1 - (enemies.length - ENEMY_SOFT_CAP) / (ENEMY_CAP - ENEMY_SOFT_CAP);
                count = Math.max(1, Math.ceil(count * throttle));
            }

            for (let i = 0; i < count && enemies.length < ENEMY_CAP; i++) {
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
                if (enemies.length < ENEMY_CAP) {
                    const _eRnd = this.rng ? this.rng() : Math.random();
                    if (config.elite && _eRnd < (config.eliteChance || 0) * this.eliteChanceMult) {
                        const elitePos = this._getSpawnPos(playerX, playerY);
                        const elite = new Enemy(config.elite, elitePos.x, elitePos.y, config.mult * this.difficulty * this.difficultyMultiplier);
                        elite.applyRandomAffix();
                        enemies.push(elite);
                    }
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

            // 主题专属Boss: 每个主题首次Boss使用主题Boss, 之后交替普通变体
            const currentTheme = this._getCurrentMapTheme();
            if (currentTheme && !this._themesBossSpawned) this._themesBossSpawned = {};
            if (currentTheme && !this._themesBossSpawned[currentTheme]) {
                // 该主题首次出Boss → 生成主题专属Boss
                boss.applyThemeBoss(currentTheme);
                this._themesBossSpawned[currentTheme] = true;
            } else {
                boss.applyBossVariant(this.stageBossCount - 1); // 普通变体循环
            }

            // 每日修饰符：Boss血量加成
            if (this.bossHpMult > 1) {
                boss.maxHp = Math.floor(boss.maxHp * this.bossHpMult);
                boss.hp = boss.maxHp;
            }
            enemies.push(boss);
            this.activeStageBoss = boss;

            // 极端修饰符：镜像噩梦 - Boss双生
            if (this.mirrorBoss) {
                const pos2 = this._getSpawnPos(playerX, playerY);
                const mirrorBoss = new Enemy('boss', pos2.x, pos2.y, bossMultiplier * this.difficulty);
                mirrorBoss._isStageBoss = true;
                mirrorBoss.applyBossVariant((this.stageBossCount) % BossVariants.length);
                mirrorBoss.maxHp = Math.floor(mirrorBoss.maxHp * 0.7); // 镜像体血量稍低
                mirrorBoss.hp = mirrorBoss.maxHp;
                if (this.bossHpMult > 1) {
                    mirrorBoss.maxHp = Math.floor(mirrorBoss.maxHp * this.bossHpMult);
                    mirrorBoss.hp = mirrorBoss.maxHp;
                }
                enemies.push(mirrorBoss);
            }

            // Boss间隔逐步缩短：180s → 150s → 120s → 90s（最短）
            this.stageBossInterval = Math.max(90, 180 - this.stageBossCount * 30);
            this.nextStageBossTime = this.gameTime + this.stageBossInterval;
            Utils.shake(10);
        }

        // 精英围攻波次：环形生成一圈精英怪（受上限约束）
        if (this.gameTime >= this.nextSiegeTime && enemies.length < ENEMY_CAP) {
            this.siegeCount++;
            const maxSiege = Math.min(6 + this.siegeCount * 2, 20, ENEMY_CAP - enemies.length);
            const siegeEliteCount = Math.max(1, maxSiege);
            const siegeRadius = 400;
            const eliteTypes = ['eliteSkeleton', 'eliteDemon'];
            const eliteType = this.siegeCount >= 3 ? 'eliteDemon' : 'eliteSkeleton';
            for (let i = 0; i < siegeEliteCount; i++) {
                const angle = (TWO_PI / siegeEliteCount) * i + Math.random() * 0.3;
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
        const angle = this.rng ? this.rng() * TWO_PI : Utils.rand(0, TWO_PI);
        const dist = this.rng ? 500 + this.rng() * 200 : Utils.rand(500, 700);
        return {
            x: playerX + Math.cos(angle) * dist,
            y: playerY + Math.sin(angle) * dist,
        };
    }

    // 获取当前地图主题ID (基于gameTime)
    _getCurrentMapTheme() {
        if (typeof MapThemes === 'undefined') return null;
        for (let i = MapThemes.length - 1; i >= 0; i--) {
            if (this.gameTime >= MapThemes[i].timeRange[0]) return MapThemes[i].id;
        }
        return MapThemes[0].id;
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
        this.bobPhase = Math.random() * TWO_PI;
        this.attractSpeed = 0;
        this.attracted = false;
    }

    update(dt, playerX, playerY, pickupRange, particles) {
        this.bobPhase += 3 * dt;
        this.sparkleTimer += dt;

        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distSq = dx * dx + dy * dy;

        // 吸引范围（用平方比较避免 sqrt）
        if (distSq < pickupRange * pickupRange) {
            this.attracted = true;
        }

        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 800 * dt, 600);
            const dist = Math.sqrt(distSq);
            const invDist = dist > 0.001 ? 1 / dist : 0;
            this.x += dx * invDist * this.attractSpeed * dt;
            this.y += dy * invDist * this.attractSpeed * dt;

            // 吸附拖尾（速度>200时才产生，避免过多粒子）
            if (this.attractSpeed > 200 && Math.random() < 0.3) {
                particles.addTrail(this.x, this.y, this.color, 2.5, 0.15);
            }

            if (distSq < 225) { // 15^2
                this.alive = false;
                // 拾取爆发效果
                particles.addGemSparkle(this.x, this.y, this.color);
                particles.emit(this.x, this.y, 4, {
                    colors: [this.color, '#ffffff'],
                    speedMin: 2, speedMax: 5,
                    sizeMin: 1, sizeMax: 3,
                    lifeMin: 0.15, lifeMax: 0.3,
                    glow: true,
                });
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

    render(ctx, camera, screenW, screenH) {
        const sx = this.x - camera.x;
        const sy = this.y - camera.y + Math.sin(this.bobPhase) * 3;

        // 屏幕外裁剪
        if (sx < -20 || sx > screenW + 20 || sy < -20 || sy > screenH + 20) return;

        const r = this.radius;
        const now = performance.now();
        const pulse = 1 + Math.sin(now * 0.005 + this.bobPhase) * 0.12;

        // 小宝石：增强版 - 外圈发光 + 菱形主体 + 白色高光
        if (r < 7) {
            // 外圈柔光
            ctx.globalAlpha = 0.25 * pulse;
            ctx.fillStyle = this.color;
            const g = r + 5;
            ctx.beginPath();
            ctx.arc(sx, sy, g, 0, TWO_PI);
            ctx.fill();
            // 菱形主体
            ctx.globalAlpha = 0.95;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(sx, sy - r);
            ctx.lineTo(sx + r * 0.6, sy);
            ctx.lineTo(sx, sy + r);
            ctx.lineTo(sx - r * 0.6, sy);
            ctx.closePath();
            ctx.fill();
            // 白色高光点
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(sx - r * 0.2, sy - r * 0.3, r * 0.25, 0, TWO_PI);
            ctx.fill();
            ctx.globalAlpha = 1;
            return;
        }

        // 大宝石：全面增强版
        // 第一层：远距柔光晕（呼吸脉冲）
        ctx.globalAlpha = 0.15 * pulse;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r + 12, 0, TWO_PI);
        ctx.fill();

        // 第二层：近距发光圈
        ctx.globalAlpha = 0.3 * pulse;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, r + 6, 0, TWO_PI);
        ctx.fill();

        // 第三层：白色内辉
        ctx.globalAlpha = 0.12 * pulse;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, r + 3, 0, TWO_PI);
        ctx.fill();

        // 菱形主体（带旋转感）
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        const rot = now * 0.001 + this.bobPhase;
        const cosR = Math.cos(rot) * 0.1;
        ctx.beginPath();
        ctx.moveTo(sx, sy - r * (1.05 + cosR));
        ctx.lineTo(sx + r * (0.7 + cosR * 0.3), sy);
        ctx.lineTo(sx, sy + r * (1.05 + cosR));
        ctx.lineTo(sx - r * (0.7 + cosR * 0.3), sy);
        ctx.closePath();
        ctx.fill();

        // 内部亮面渐变菱形
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(sx, sy - r * 0.5);
        ctx.lineTo(sx + r * 0.25, sy - r * 0.1);
        ctx.lineTo(sx, sy + r * 0.2);
        ctx.lineTo(sx - r * 0.25, sy - r * 0.1);
        ctx.closePath();
        ctx.fill();

        // 顶部高光闪点
        ctx.globalAlpha = 0.7 + Math.sin(now * 0.008 + this.bobPhase * 2) * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx - r * 0.2, sy - r * 0.4, r * 0.18, 0, TWO_PI);
        ctx.fill();

        // 底部反光
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx + r * 0.15, sy + r * 0.3, r * 0.12, 0, TWO_PI);
        ctx.fill();

        ctx.globalAlpha = 1;
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
        this.bobPhase = Math.random() * TWO_PI;
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

        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distSq = dx * dx + dy * dy;

        // 靠近时吸引（用平方比较避免 sqrt）
        const attractR = pickupRange + 20;
        if (distSq < attractR * attractR) {
            this.attracted = true;
        }

        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 600 * dt, 500);
            const dist = Math.sqrt(distSq);
            const invDist = dist > 0.001 ? 1 / dist : 0;
            this.x += dx * invDist * this.attractSpeed * dt;
            this.y += dy * invDist * this.attractSpeed * dt;
        }

        // 拾取
        if (distSq < 400) { // 20^2
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
        ctx.arc(sx, sy, this.radius + 10, 0, TWO_PI);
        ctx.fill();

        // 主体圆
        ctx.globalAlpha = this.life < 3 ? (0.5 + Math.sin(this.life * 10) * 0.5) : 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius, 0, TWO_PI);
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
    constructor(x, y, type, radius, life) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.radius = radius || Utils.rand(60, 100);
        this.timer = 0;
        this.life = life || Utils.rand(20, 40);
        this.alive = true;
        this.damageTimer = 0;

        const defs = {
            poison: { color: '#44aa44', glowColor: '#66cc66', damage: 3, interval: 0.5, icon: '\u2620\uFE0F' },
            fire: { color: '#ff6622', glowColor: '#ff8844', damage: 6, interval: 0.4, icon: '\uD83D\uDD25' },
            slow: { color: '#4488ff', glowColor: '#66aaff', damage: 0, interval: 0, icon: '\u2744\uFE0F' },
            ice: { color: '#44ccee', glowColor: '#88eeff', damage: 2, interval: 0.8, icon: '\u2744\uFE0F' },
            voidHole: { color: '#6622cc', glowColor: '#9944ff', damage: 4, interval: 0.3, icon: '\uD83C\uDF00' },
        };
        const def = defs[type] || defs.poison;
        this.color = def.color;
        this.glowColor = def.glowColor;
        this.damage = def.damage;
        this.damageInterval = def.interval;
        this.icon = def.icon;

        // 扩展属性 (由创建方设置)
        this._pullForce = 0;     // 吸引力
        this._followBoss = null; // 跟随Boss移动
        this._slowAura = 0;      // 减速光环
        this._isWall = false;    // 阻挡物（冰柱）
    }

    update(dt, player) {
        this.timer += dt;
        this.life -= dt;
        if (this.life <= 0) { this.alive = false; return 0; }

        // 跟随Boss移动
        if (this._followBoss && this._followBoss.alive) {
            this.x = this._followBoss.x;
            this.y = this._followBoss.y;
        }

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distSq = dx * dx + dy * dy;
        const r = this.radius + player.radius;

        // 吸引效果 (虚空黑洞)
        if (this._pullForce > 0 && distSq < (this.radius * 2.5) * (this.radius * 2.5)) {
            const dist = Math.sqrt(distSq);
            if (dist > 10) {
                const pullStrength = this._pullForce * dt * (1 - dist / (this.radius * 2.5));
                player.x += (this.x - player.x) / dist * pullStrength;
                player.y += (this.y - player.y) / dist * pullStrength;
            }
        }

        // 减速光环
        if (this._slowAura > 0 && distSq < this.radius * this.radius) {
            player._hazardSlow = this._slowAura;
        }

        // 碰撞阻挡 (冰柱)
        if (this._isWall && distSq < r * r) {
            const dist = Math.sqrt(distSq);
            if (dist > 0) {
                const overlap = r - dist;
                player.x -= dx / dist * overlap;
                player.y -= dy / dist * overlap;
            }
            return 0;
        }

        if (distSq < r * r) {
            if (this.type === 'slow' || this.type === 'ice') {
                player._hazardSlow = 0.5;
                if (this.type === 'ice' && this.damage > 0) {
                    this.damageTimer += dt;
                    if (this.damageTimer >= this.damageInterval) {
                        this.damageTimer = 0;
                        return this.damage;
                    }
                }
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
        ctx.arc(sx, sy, this.radius * pulse + 10, 0, TWO_PI);
        ctx.fill();

        ctx.globalAlpha = 0.18 * fadeAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, TWO_PI);
        ctx.fill();

        ctx.globalAlpha = 0.3 * fadeAlpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, TWO_PI);
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

        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distSq = dx * dx + dy * dy;
        const r = this.radius + player.radius;
        const inRange = distSq < r * r;

        switch (this.type) {
            case 'speed':
                // 在范围内加速
                if (inRange) {
                    player._envSpeedBuff = 1.5; // 50%加速
                    return { type: 'speed' };
                }
                return null;

            case 'portal':
                // 进入传送门范围
                if (inRange && this.linkedPortal && this.linkedPortal.alive && this.teleportCD <= 0) {
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
                if (inRange) {
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
        ctx.arc(sx, sy, this.radius * pulse + 12, 0, TWO_PI);
        ctx.fill();

        // 主区域
        ctx.globalAlpha = 0.2 * fadeAlpha * cdAlpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, TWO_PI);
        ctx.fill();

        // 边框（虚线动画）
        ctx.globalAlpha = 0.4 * fadeAlpha * cdAlpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 5]);
        ctx.lineDashOffset = -this.timer * 30;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, TWO_PI);
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
        this.bobPhase = Math.random() * TWO_PI;
        this.attracted = false;
        this.attractSpeed = 0;
    }

    update(dt, playerX, playerY, pickupRange) {
        if (!this.alive) return false;
        this.bobPhase += 3 * dt;
        this.life -= dt;
        if (this.life <= 0) { this.alive = false; return false; }

        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distSq = dx * dx + dy * dy;
        const attractR = pickupRange + 30;
        if (distSq < attractR * attractR) this.attracted = true;
        if (this.attracted) {
            this.attractSpeed = Math.min(this.attractSpeed + 500 * dt, 400);
            const dist = Math.sqrt(distSq);
            const invDist = dist > 0.001 ? 1 / dist : 0;
            this.x += dx * invDist * this.attractSpeed * dt;
            this.y += dy * invDist * this.attractSpeed * dt;
        }
        if (distSq < 625) { this.alive = false; return true; } // 25^2
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
        ctx.arc(sx, sy, this.radius + 12, 0, TWO_PI);
        ctx.fill();

        // 主体
        ctx.globalAlpha = this.life < 5 ? (0.5 + Math.sin(this.life * 8) * 0.5) : 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius, 0, TWO_PI);
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
        // 拖尾历史 — 环形缓冲（避免shift()的数组搬移开销）
        this._trailBuf = new Float32Array(12); // 6个点 × 2(x,y)
        this._trailHead = 0;
        this._trailLen = 0;
    }

    update(dt) {
        // 记录拖尾到环形缓冲
        const idx = this._trailHead * 2;
        this._trailBuf[idx] = this.x;
        this._trailBuf[idx + 1] = this.y;
        this._trailHead = (this._trailHead + 1) % 6;
        if (this._trailLen < 6) this._trailLen++;

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
        // 拖尾 — 从环形缓冲读取，最旧的先画
        const len = this._trailLen;
        const buf = this._trailBuf;
        const start = (this._trailHead - len + 6) % 6;
        ctx.fillStyle = this.color;
        for (let i = 0; i < len; i++) {
            const slot = ((start + i) % 6) * 2;
            const tx = buf[slot] - camera.x;
            const ty = buf[slot + 1] - camera.y;
            const alpha = (i / len) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(tx, ty, this.radius * (0.3 + 0.7 * i / len), 0, TWO_PI);
            ctx.fill();
        }
        // 脉动外光——更大更明显
        const pulse = 1 + Math.sin(this.age * 12) * 0.25;
        ctx.globalAlpha = 0.35;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * 2.5 * pulse, 0, TWO_PI);
        ctx.fill();
        // 弹体
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * pulse, 0, TWO_PI);
        ctx.fill();
        // 高亮核心
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, this.radius * 0.45, 0, TWO_PI);
        ctx.fill();
        ctx.restore();
    }
}
