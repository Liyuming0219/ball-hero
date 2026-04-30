// ============================================
// 工具函数库
// ============================================

const Utils = {
    // 两点距离
    dist(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // 两点角度
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // 随机范围
    rand(min, max) {
        return Math.random() * (max - min) + min;
    },

    // 随机整数
    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // 随机数组元素
    randPick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 随机颜色
    randColor(colors) {
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // HSL颜色
    hsl(h, s, l, a = 1) {
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    },

    // 线性插值
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    // 限制范围
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    // 圆形碰撞检测
    circleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = dx * dx + dy * dy;
        const radii = r1 + r2;
        return dist < radii * radii;
    },

    // 屏幕震动
    screenShake: { x: 0, y: 0, intensity: 0, decay: 0.9 },

    shake(intensity) {
        this.screenShake.intensity = Math.max(this.screenShake.intensity, intensity);
    },

    updateShake() {
        if (this.screenShake.intensity > 0.5) {
            this.screenShake.x = Utils.rand(-1, 1) * this.screenShake.intensity;
            this.screenShake.y = Utils.rand(-1, 1) * this.screenShake.intensity;
            this.screenShake.intensity *= this.screenShake.decay;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
            this.screenShake.intensity = 0;
        }
    },

    // 冻帧系统（击杀大怪时短暂暂停）
    freezeFrame: { timer: 0, duration: 0 },

    triggerFreeze(duration = 0.05) {
        this.freezeFrame.timer = duration;
        this.freezeFrame.duration = duration;
    },

    updateFreeze(dt) {
        if (this.freezeFrame.timer > 0) {
            this.freezeFrame.timer -= dt;
            return true; // 正在冻帧
        }
        return false;
    },

    // 对象池
    createPool(factory, initialSize = 50) {
        const pool = [];
        const active = [];
        for (let i = 0; i < initialSize; i++) {
            pool.push(factory());
        }
        return {
            get() {
                let obj = pool.pop();
                if (!obj) obj = factory();
                active.push(obj);
                return obj;
            },
            release(obj) {
                const idx = active.indexOf(obj);
                if (idx > -1) {
                    active.splice(idx, 1);
                    pool.push(obj);
                }
            },
            getActive() { return active; },
            clear() {
                while (active.length) {
                    pool.push(active.pop());
                }
            }
        };
    },

    // 格式化时间
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    // 格式化数字 (1000 -> 1.0K)
    formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
        return Math.floor(n).toString();
    },

    // 缓动函数
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    },

    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
};

// ============================================
// 空间哈希网格 - 碰撞检测优化
// ============================================
class SpatialHash {
    constructor(cellSize = 100) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }

    clear() {
        this.grid.clear();
    }

    _key(cx, cy) {
        return cx * 73856093 ^ cy * 19349669; // 快速哈希
    }

    insert(entity) {
        const cs = this.cellSize;
        const minCX = Math.floor((entity.x - entity.radius) / cs);
        const minCY = Math.floor((entity.y - entity.radius) / cs);
        const maxCX = Math.floor((entity.x + entity.radius) / cs);
        const maxCY = Math.floor((entity.y + entity.radius) / cs);
        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const key = this._key(cx, cy);
                let cell = this.grid.get(key);
                if (!cell) {
                    cell = [];
                    this.grid.set(key, cell);
                }
                cell.push(entity);
            }
        }
    }

    query(x, y, radius) {
        const cs = this.cellSize;
        const minCX = Math.floor((x - radius) / cs);
        const minCY = Math.floor((y - radius) / cs);
        const maxCX = Math.floor((x + radius) / cs);
        const maxCY = Math.floor((y + radius) / cs);
        const result = [];
        const seen = new Set();
        for (let cx = minCX; cx <= maxCX; cx++) {
            for (let cy = minCY; cy <= maxCY; cy++) {
                const key = this._key(cx, cy);
                const cell = this.grid.get(key);
                if (!cell) continue;
                for (const e of cell) {
                    if (seen.has(e)) continue;
                    seen.add(e);
                    result.push(e);
                }
            }
        }
        return result;
    }

    // 批量插入所有活着的敌人
    rebuild(enemies) {
        this.clear();
        for (const e of enemies) {
            if (e.alive) this.insert(e);
        }
    }
}

// ============================================
// 元进度系统 - localStorage 持久化
// ============================================
const MetaProgress = {
    _data: null,

    _defaults() {
        return {
            totalKills: 0,
            totalPlayTime: 0,
            totalRuns: 0,
            bestTime: 0,
            bestKills: 0,
            bestLevel: 0,
            achievements: {},
            unlockedRelics: ['haste_ring', 'thorn_shell', 'soul_lantern'],
            gold: 0,       // 永久货币
            permUpgrades: { // 永久升级
                maxHp: 0,       // 每级+5最大生命
                attack: 0,      // 每级+3%攻击力
                moveSpeed: 0,   // 每级+2%移速
                pickupRange: 0, // 每级+10拾取范围
                expGain: 0,     // 每级+5%经验获取
            }
        };
    },

    load() {
        try {
            const raw = localStorage.getItem('roguelike_survivor_meta');
            this._data = raw ? JSON.parse(raw) : this._defaults();
            // 确保新字段存在
            const def = this._defaults();
            for (const key in def) {
                if (this._data[key] === undefined) this._data[key] = def[key];
            }
            if (!this._data.permUpgrades) this._data.permUpgrades = def.permUpgrades;
            for (const key in def.permUpgrades) {
                if (this._data.permUpgrades[key] === undefined) this._data.permUpgrades[key] = 0;
            }
        } catch (e) {
            this._data = this._defaults();
        }
    },

    save() {
        try {
            localStorage.setItem('roguelike_survivor_meta', JSON.stringify(this._data));
        } catch (e) { /* ignore */ }
    },

    get data() {
        if (!this._data) this.load();
        return this._data;
    },

    recordRun(player, gameTime) {
        const d = this.data;
        d.totalRuns++;
        d.totalKills += player.kills;
        d.totalPlayTime += gameTime;
        d.bestTime = Math.max(d.bestTime, gameTime);
        d.bestKills = Math.max(d.bestKills, player.kills);
        d.bestLevel = Math.max(d.bestLevel, player.level);
        // 金币奖励（根据击杀和存活时间 + 金币加成buff）
        const goldMult = 1 + (player.bonuses.goldBonus || 0);
        const goldEarned = Math.floor((player.kills * 0.5 + gameTime * 0.2) * goldMult);
        d.gold += goldEarned;
        this.save();
        return goldEarned;
    },

    // 应用永久升级到玩家
    applyPermUpgrades(player) {
        const p = this.data.permUpgrades;
        player.bonuses.maxHpBonus += p.maxHp * 5;
        player.stats.hp += p.maxHp * 5;
        player.bonuses.attackMult += p.attack * 0.03;
        player.bonuses.moveSpeedMult += p.moveSpeed * 0.02;
        player.bonuses.pickupRangeBonus += p.pickupRange * 10;
        player.bonuses.expMult += p.expGain * 0.05;
    },

    // 购买永久升级
    buyUpgrade(type) {
        const d = this.data;
        const costs = { maxHp: 50, attack: 80, moveSpeed: 60, pickupRange: 40, expGain: 70 };
        const maxLevels = { maxHp: 10, attack: 10, moveSpeed: 8, pickupRange: 8, expGain: 8 };
        const cost = (costs[type] || 100) * (1 + d.permUpgrades[type]);
        if (d.gold >= cost && d.permUpgrades[type] < (maxLevels[type] || 10)) {
            d.gold -= cost;
            d.permUpgrades[type]++;
            this.save();
            return true;
        }
        return false;
    },

    // 成就检查
    checkAchievements(player, gameTime) {
        const d = this.data;
        const newAchievements = [];
        const checks = [
            { id: 'first_blood', name: '初次猎杀', desc: '击杀第一个敌人', check: () => d.totalKills >= 1 },
            { id: 'centurion', name: '百夫长', desc: '单局击杀100个敌人', check: () => player.kills >= 100 },
            { id: 'slayer_500', name: '屠杀者', desc: '单局击杀500个敌人', check: () => player.kills >= 500 },
            { id: 'survivor_5min', name: '幸存者', desc: '存活超过5分钟', check: () => gameTime >= 300 },
            { id: 'survivor_10min', name: '老兵', desc: '存活超过10分钟', check: () => gameTime >= 600 },
            { id: 'survivor_20min', name: '不死传说', desc: '存活超过20分钟', check: () => gameTime >= 1200 },
            { id: 'max_weapon', name: '武器大师', desc: '武器升到满级', check: () => player.weaponLevel >= 7 },
            { id: 'level_20', name: '精英战士', desc: '角色等级达到20', check: () => player.level >= 20 },
            { id: 'veteran', name: '久经沙场', desc: '累计游玩10局', check: () => d.totalRuns >= 10 },
            { id: 'total_kills_1000', name: '千人斩', desc: '累计击杀1000个敌人', check: () => d.totalKills >= 1000 },
        ];
        for (const ach of checks) {
            if (!d.achievements[ach.id] && ach.check()) {
                d.achievements[ach.id] = { name: ach.name, desc: ach.desc, time: Date.now() };
                newAchievements.push(ach);
            }
        }
        if (newAchievements.length > 0) this.save();
        return newAchievements;
    }
};

// ============================================
// 遗物系统定义
// ============================================
const RelicDefs = {
    haste_ring: {
        name: '疾速之戒',
        icon: '💨',
        desc: '攻速+15%，移速+10%',
        color: '#44aaff',
        rarity: 'rare',
        apply(p) { p.bonuses.attackSpeedMult += 0.15; p.bonuses.moveSpeedMult += 0.1; }
    },
    thorn_shell: {
        name: '荆棘外壳',
        icon: '🐚',
        desc: '护甲+5，受伤反弹150%伤害',
        color: '#44ff88',
        rarity: 'rare',
        apply(p) { p.bonuses.armorBonus += 5; p.bonuses.thornAura = true; }
    },
    soul_lantern: {
        name: '灵魂灯笼',
        icon: '🏮',
        desc: '经验获取+30%，拾取范围+50',
        color: '#ffaa44',
        rarity: 'rare',
        apply(p) { p.bonuses.expMult += 0.3; p.bonuses.pickupRangeBonus += 50; }
    },
    berserker_mask: {
        name: '狂战士面具',
        icon: '👹',
        desc: '攻击力+25%，攻速+20%，受伤+10%',
        color: '#ff4444',
        rarity: 'epic',
        apply(p) { p.bonuses.attackMult += 0.25; p.bonuses.attackSpeedMult += 0.2; }
    },
    phoenix_feather: {
        name: '凤凰之羽',
        icon: '🪶',
        desc: '生命恢复+5/秒，最大生命+50',
        color: '#ff8844',
        rarity: 'epic',
        apply(p) { p.bonuses.hpRegenBonus += 5; p.bonuses.maxHpBonus += 50; p.stats.hp += 50; }
    },
    void_crystal: {
        name: '虚空水晶',
        icon: '💎',
        desc: '暴击率+12%，暴击伤害+40%',
        color: '#aa44ff',
        rarity: 'legendary',
        apply(p) { p.bonuses.critRateBonus += 0.12; p.bonuses.critDamageBonus += 0.4; }
    },
    crown_of_thorns: {
        name: '荆棘王冠',
        icon: '👑',
        desc: '全属性+10%，攻击范围+20%',
        color: '#ffcc44',
        rarity: 'legendary',
        apply(p) {
            p.bonuses.attackMult += 0.1; p.bonuses.attackSpeedMult += 0.1;
            p.bonuses.moveSpeedMult += 0.1; p.bonuses.areaMult += 0.2;
        }
    },
};
