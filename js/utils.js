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
    },

    // 每日挑战种子生成（基于日期的伪随机）
    getDailySeed() {
        const d = new Date();
        return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    },

    // 基于种子的伪随机数生成器
    seededRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
            return (s >>> 0) / 4294967296;
        };
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
                critRate: 0,    // 每级+2%暴击率
                armor: 0,       // 每级+1护甲
                hpRegen: 0,     // 每级+0.5生命恢复
                cooldown: 0,    // 每级+3%攻速
                startBuff: 0,   // 每级解锁1个起始buff
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
        player.bonuses.critRateBonus += p.critRate * 0.02;
        player.bonuses.armorBonus += p.armor * 1;
        player.bonuses.hpRegenBonus += p.hpRegen * 0.5;
        player.bonuses.attackSpeedMult += p.cooldown * 0.03;
        // startBuff: 按等级解锁起始buff（由game.js在初始化时处理）
    },

    // 起始buff列表（按startBuff等级依次解锁）
    startingBuffs: [
        { id: 'homing', apply(p) { p.bonuses.homingShot = true; } },
        { id: 'frost', apply(p) { p.bonuses.frostAura = true; } },
        { id: 'vamp', apply(p) { p.bonuses.vampiric = 0.02; } },
        { id: 'orbital', apply(p) { p.bonuses.orbitalBlades = 1; } },
        { id: 'shield', apply(p) { p.bonuses.shield = 20; } },
    ],

    applyStartingBuffs(player) {
        const level = this.data.permUpgrades.startBuff || 0;
        for (let i = 0; i < Math.min(level, this.startingBuffs.length); i++) {
            this.startingBuffs[i].apply(player);
        }
    },

    // 购买永久升级
    buyUpgrade(type) {
        const d = this.data;
        const costs = { maxHp: 50, attack: 80, moveSpeed: 60, pickupRange: 40, expGain: 70, critRate: 90, armor: 60, hpRegen: 50, cooldown: 100, startBuff: 200 };
        const maxLevels = { maxHp: 10, attack: 10, moveSpeed: 8, pickupRange: 8, expGain: 8, critRate: 6, armor: 8, hpRegen: 8, cooldown: 5, startBuff: 5 };
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

// ============================================
// 音效系统 - Web Audio API 程序化音效
// ============================================
const SFX = {
    _ctx: null,
    _enabled: true,
    _volume: 0.3,

    init() {
        try {
            if (!this._ctx) {
                this._ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            // 必须在用户手势中 resume，否则移动端浏览器会一直 suspended
            if (this._ctx && this._ctx.state === 'suspended') {
                this._ctx.resume();
            }
        } catch (e) { this._enabled = false; }
    },

    _ensureCtx() {
        if (!this._ctx) this.init();
        if (this._ctx && this._ctx.state === 'suspended') this._ctx.resume();
        return this._ctx && this._enabled && this._ctx.state === 'running';
    },

    setVolume(v) { this._volume = Utils.clamp(v, 0, 1); },
    toggle(on) { this._enabled = on; },

    // 击中音效
    hit() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this._volume * 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.08);
    },

    // 升级音效
    levelUp() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(this._volume * 0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    },

    // 选择buff音效
    selectBuff() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.06);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(this._volume * 0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
    },

    // 受伤音效
    hurt() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(this._volume * 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.15);
    },

    // 击杀音效
    kill() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(this._volume * 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.06);
    },

    // Boss出现
    bossAlert() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        for (let i = 0; i < 3; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(100 + i * 30, ctx.currentTime + i * 0.15);
            gain.gain.setValueAtTime(this._volume * 0.3, ctx.currentTime + i * 0.15);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.12);
            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.12);
        }
    },

    // 连杀里程碑
    comboMilestone() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
            gain.gain.setValueAtTime(this._volume * 0.2, ctx.currentTime + i * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.12);
            osc.start(ctx.currentTime + i * 0.06);
            osc.stop(ctx.currentTime + i * 0.06 + 0.12);
        });
    },

    // 拾取道具
    pickup() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(this._volume * 0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    },

    // 事件开始提示音
    eventStart() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(660, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(this._volume * 0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    },

    // 边界警告
    boundaryWarn() {
        if (!this._ensureCtx()) return;
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, ctx.currentTime);
        gain.gain.setValueAtTime(this._volume * 0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    },
};

// ============================================
// 武器融合系统定义
// ============================================
const FusionDefs = {
    // 追踪术 + 分裂弹 → 裂变导弹
    fission_missile: {
        name: '裂变导弹',
        desc: '分裂子弹也具有追踪能力',
        icon: '🚀💥',
        requires: ['homing', 'split'],
        apply(p) { p.bonuses._fusionFission = true; },
    },
    // 连锁闪电 + 灼烧光环 → 雷火风暴
    thunder_fire: {
        name: '雷火风暴',
        desc: '闪电造成额外灼烧DOT',
        icon: '⚡🔥',
        requires: ['chain1', 'burn_aura'],
        apply(p) { p.bonuses._fusionThunderFire = true; },
    },
    // 冰霜光环 + 荆棘 → 冰晶护甲
    ice_thorn: {
        name: '冰晶护甲',
        desc: '被攻击时冻结攻击者0.5秒',
        icon: '❄️🌵',
        requires: ['frost', 'thorn'],
        apply(p) { p.bonuses._fusionIceThorn = true; },
    },
    // 吸血 + 狂战士之怒 → 血族狂怒
    blood_rage: {
        name: '血族狂怒',
        desc: '低血量时吸血翻倍，击杀回血+10',
        icon: '🧛😡',
        requires: ['vamp1', 'rage1'],
        apply(p) { p.bonuses._fusionBloodRage = true; p.bonuses.killHeal += 10; },
    },
    // 双重打击 + 爆裂击杀 → 连爆
    chain_explosion: {
        name: '连锁爆破',
        desc: '双重打击触发时爆炸范围翻倍',
        icon: '✨💣',
        requires: ['double', 'explokill'],
        apply(p) { p.bonuses._fusionChainExplosion = true; },
    },
};

// ============================================
// 事件/挑战系统定义
// ============================================
const GameEvents = {
    types: [
        {
            id: 'elite_invasion',
            name: '精英入侵',
            desc: '20秒内击杀所有精英获得额外奖励',
            duration: 20,
            color: '#ff4444',
        },
        {
            id: 'gold_rush',
            name: '金色狂潮',
            desc: '30秒内经验获取翻倍',
            duration: 30,
            color: '#ffcc44',
        },
        {
            id: 'treasure_hunter',
            name: '宝箱怪来袭',
            desc: '击杀宝箱怪获得3选1额外buff',
            duration: 25,
            color: '#44ffaa',
        },
        {
            id: 'speed_frenzy',
            name: '疾速狂乱',
            desc: '所有敌人速度翻倍，但经验+50%',
            duration: 15,
            color: '#44aaff',
        },
    ],
};

// ============================================
// 地图主题系统
// ============================================
const MapThemes = [
    {
        id: 'void',
        name: '虚空深渊',
        timeRange: [0, 90],   // 0~1:30
        bgGrad: ['#06060e', '#0a0a18', '#080814'],
        glowA: 'rgba(40,20,80,0.12)',
        glowB: 'rgba(15,40,60,0.10)',
        gridColor: '#16162a',
        dotColor: '#2a2a44',
        starColor: '#8899bb',
        fogColor: null,
        decorType: 'crystal',  // 水晶碎片
        decorColor: '#6644aa',
    },
    {
        id: 'crimson',
        name: '猩红荒原',
        timeRange: [90, 210],  // 1:30~3:30
        bgGrad: ['#100808', '#180a0a', '#140808'],
        glowA: 'rgba(80,20,20,0.14)',
        glowB: 'rgba(60,30,15,0.10)',
        gridColor: '#2a1616',
        dotColor: '#442a2a',
        starColor: '#bb8877',
        fogColor: 'rgba(60,10,10,0.04)',
        decorType: 'pillar',   // 废墟石柱
        decorColor: '#884433',
    },
    {
        id: 'frost',
        name: '冰封虚域',
        timeRange: [210, 360], // 3:30~6:00
        bgGrad: ['#060810', '#0a0e1a', '#080c16'],
        glowA: 'rgba(20,40,80,0.14)',
        glowB: 'rgba(15,60,80,0.12)',
        gridColor: '#162a2a',
        dotColor: '#2a3a44',
        starColor: '#99bbdd',
        fogColor: 'rgba(10,20,40,0.05)',
        decorType: 'iceSpike',  // 冰刺
        decorColor: '#4488aa',
    },
    {
        id: 'corruption',
        name: '腐化之地',
        timeRange: [360, 99999], // 6:00+
        bgGrad: ['#0a0810', '#0e0a18', '#0c0814'],
        glowA: 'rgba(50,10,60,0.16)',
        glowB: 'rgba(20,50,10,0.10)',
        gridColor: '#221a2a',
        dotColor: '#3a2a44',
        starColor: '#aa88cc',
        fogColor: 'rgba(30,10,40,0.05)',
        decorType: 'tree',      // 腐化树
        decorColor: '#66aa44',
    },
];

// ============================================
// 每日挑战排行榜 - localStorage 持久化
// ============================================
const DailyLeaderboard = {
    _key: 'roguelike_survivor_daily',

    // 获取今日种子
    getSeed() {
        return Utils.getDailySeed();
    },

    // 根据种子选出今日角色（6选1轮转）
    getDailyCharacter(seed) {
        const chars = ['swordsman', 'mage', 'assassin', 'paladin', 'archer', 'necromancer'];
        return chars[seed % chars.length];
    },

    // 获取今日挑战描述（每日不同的特殊修饰词）
    getDailyModifiers(seed) {
        const rng = Utils.seededRandom(seed * 7919); // 用不同种子得到修饰
        const modPool = [
            { name: '精英横行', desc: '精英出现率+50%', key: 'eliteBoost', value: 1.5 },
            { name: '贫瘠之地', desc: '经验获取-20%', key: 'expPenalty', value: 0.8 },
            { name: '疾风骤雨', desc: '敌人移速+15%', key: 'enemySpeedBoost', value: 1.15 },
            { name: '强化护甲', desc: '初始护甲+3', key: 'startArmor', value: 3 },
            { name: '狂暴之夜', desc: '攻速+20% 但生命-15%', key: 'berserker', value: 1 },
            { name: '宝石倾泻', desc: '经验宝石价值+30%', key: 'gemBoost', value: 1.3 },
            { name: '铁壁试炼', desc: 'Boss血量+40%', key: 'bossHpBoost', value: 1.4 },
            { name: '幸运星', desc: '遗物掉率+25%', key: 'relicBoost', value: 1.25 },
        ];
        // 每天选2个修饰
        const shuffled = modPool.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, 2);
    },

    // 读取排行榜数据
    _load() {
        try {
            const raw = localStorage.getItem(this._key);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    },

    _save(data) {
        try {
            localStorage.setItem(this._key, JSON.stringify(data));
        } catch (e) { /* ignore */ }
    },

    // 提交成绩，返回排名
    submitScore(seed, score) {
        const data = this._load();
        const key = String(seed);
        if (!data[key]) data[key] = [];
        data[key].push({
            score: score.score,           // 综合分 = 存活时间(秒) * 10 + 击杀数 * 2 + 等级 * 50
            time: score.time,
            kills: score.kills,
            level: score.level,
            character: score.character,
            timestamp: Date.now(),
        });
        // 按综合分降序排列，只保留前10
        data[key].sort((a, b) => b.score - a.score);
        data[key] = data[key].slice(0, 10);
        // 清理超过7天的旧数据
        const now = Date.now();
        for (const k in data) {
            if (k !== key && data[k].length > 0 && now - data[k][0].timestamp > 7 * 86400 * 1000) {
                delete data[k];
            }
        }
        this._save(data);
        // 返回本次排名
        const rank = data[key].findIndex(e => e.timestamp === score.timestamp) + 1;
        return rank || data[key].length;
    },

    // 获取今日排行榜
    getLeaderboard(seed) {
        const data = this._load();
        return data[String(seed)] || [];
    },

    // 计算综合分
    calcScore(time, kills, level) {
        return Math.floor(time * 10 + kills * 2 + level * 50);
    },

    // 今日是否已完成挑战
    hasPlayedToday() {
        const seed = this.getSeed();
        const data = this._load();
        const entries = data[String(seed)];
        return entries && entries.length > 0;
    },
};
