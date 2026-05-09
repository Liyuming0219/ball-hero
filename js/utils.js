// ============================================
// 工具函数库
// ============================================

// 常用数学常量（避免每帧重复计算）
const TWO_PI = Math.PI * 2;
const HALF_PI = Math.PI * 0.5;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// 高性能数组元素移除（尾部交换，O(1) 但不保序）
function swapRemove(arr, index) {
    arr[index] = arr[arr.length - 1];
    arr.pop();
}

// 高性能数组过滤移除（从后向前遍历 + swap，避免 splice/filter 产生新数组）
function swapRemoveIf(arr, predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i], i)) {
            arr[i] = arr[arr.length - 1];
            arr.pop();
        }
    }
}

const Utils = {
    // 两点距离
    dist(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    // 两点距离平方（用于距离比较，避免开方）
    distSq(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return dx * dx + dy * dy;
    },

    // 两点角度
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // 将角度规范化到 [-PI, PI]
    normalizeAngle(a) {
        while (a > Math.PI) a -= TWO_PI;
        while (a < -Math.PI) a += TWO_PI;
        return a;
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
            // 皮肤系统数据迁移
            if (!this._data.ownedSkins) this._data.ownedSkins = [];
            if (!this._data.equippedSkins) this._data.equippedSkins = {};
        } catch (e) {
            this._data = this._defaults();
        }
        // 临时：初始金币100000
        if (this._data.gold < 100000) this._data.gold = 100000;
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
    },

    // 购买永久升级
    buyUpgrade(type) {
        const d = this.data;
        const costs = { maxHp: 50, attack: 80, moveSpeed: 60, pickupRange: 40, expGain: 70, critRate: 90, armor: 60, hpRegen: 50, cooldown: 100 };
        const maxLevels = { maxHp: 10, attack: 10, moveSpeed: 8, pickupRange: 8, expGain: 8, critRate: 6, armor: 8, hpRegen: 8, cooldown: 5 };
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
// 背景音乐系统 - Web Audio API 程序化生成
// ============================================
const BGM = {
    _ctx: null,
    _playing: false,
    _enabled: true,
    _volume: 0.25,
    _nodes: [],
    _loopTimer: null,

    init() {
        if (this._ctx) return;
        try {
            this._ctx = SFX._ctx || new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { this._enabled = false; }
    },

    setVolume(v) { this._volume = Utils.clamp(v, 0, 1); if (this._masterGain) this._masterGain.gain.value = this._volume; },
    toggle(on) { this._enabled = on; if (!on) this.stop(); },

    play(scene) {
        if (!this._enabled || this._playing) return;
        this.init();
        if (!this._ctx) return;
        if (this._ctx.state === 'suspended') this._ctx.resume();
        this._playing = true;
        this._scene = scene || 'menu';
        this._masterGain = this._ctx.createGain();
        this._masterGain.gain.value = this._volume;
        this._masterGain.connect(this._ctx.destination);
        this._startLoop();
    },

    stop() {
        this._playing = false;
        if (this._loopTimer) { clearTimeout(this._loopTimer); this._loopTimer = null; }
        for (const n of this._nodes) { try { n.stop(); } catch (e) {} }
        this._nodes = [];
        if (this._masterGain) { this._masterGain.disconnect(); this._masterGain = null; }
    },

    switchScene(scene) {
        if (this._scene === scene) return;
        this.stop();
        this.play(scene);
    },

    _startLoop() {
        if (!this._playing || !this._ctx) return;
        const scene = this._scene;
        if (scene === 'battle') {
            this._playBattlePhrase();
        } else {
            this._playMenuPhrase();
        }
    },

    // --- 8-bit chiptune 工具 ---
    _chip(freq, type, startT, dur, vol, dest) {
        const ctx = this._ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, startT);
        gain.gain.setValueAtTime(vol * 0.8, startT + dur * 0.6);
        gain.gain.linearRampToValueAtTime(0, startT + dur - 0.01);
        osc.connect(gain).connect(dest);
        osc.start(startT);
        osc.stop(startT + dur);
        this._nodes.push(osc);
    },

    _noise(startT, dur, vol, dest) {
        const ctx = this._ctx;
        const bufSize = ctx.sampleRate * dur;
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, startT);
        gain.gain.linearRampToValueAtTime(0, startT + dur * 0.3);
        const hp = ctx.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = 8000;
        src.connect(hp).connect(gain).connect(dest);
        src.start(startT);
        src.stop(startT + dur);
        this._nodes.push(src);
    },

    _playMenuPhrase() {
        if (!this._playing) return;
        const ctx = this._ctx;
        const now = ctx.currentTime;
        const bpm = 110;
        const beat = 60 / bpm;

        // 8-bit 梦幻菜单曲 — 明亮方波琶音 + 三角波低音衬底
        // C大调 → Am → F → G 进行，16拍一轮
        const arpPatterns = [
            // C: C4 E4 G4 C5
            [261.6, 329.6, 392, 523.3],
            // Am: A3 C4 E4 A4
            [220, 261.6, 329.6, 440],
            // F: F3 A3 C4 F4
            [174.6, 220, 261.6, 349.2],
            // G: G3 B3 D4 G4
            [196, 246.9, 293.7, 392],
        ];
        const bassNotes = [130.8, 110, 87.3, 98];

        let t = now;
        for (let chord = 0; chord < 4; chord++) {
            const arp = arpPatterns[chord];
            const bass = bassNotes[chord];
            // 低音 — 每和弦持续4拍
            this._chip(bass, 'triangle', t, beat * 3.8, 0.07, this._masterGain);
            // 琶音 — 16分音符循环
            for (let n = 0; n < 16; n++) {
                const freq = arp[n % 4];
                const noteT = t + n * (beat / 4);
                this._chip(freq, 'square', noteT, beat / 4 - 0.02, 0.03, this._masterGain);
            }
            t += beat * 4;
        }

        const totalDur = (t - now) * 1000;
        this._loopTimer = setTimeout(() => { this._nodes = []; this._playMenuPhrase(); }, totalDur - 50);
    },

    _playBattlePhrase() {
        if (!this._playing) return;
        const ctx = this._ctx;
        const now = ctx.currentTime;
        const bpm = 150;
        const beat = 60 / bpm;

        // 8-bit 战斗曲 — 激烈方波旋律 + 脉冲低音 + 噪声鼓点
        // Em 调性，16拍一循环
        const melody = [
            659.3, 0, 659.3, 784, 880, 0, 784, 659.3,
            587.3, 0, 587.3, 659.3, 784, 0, 659.3, 587.3,
            523.3, 0, 587.3, 659.3, 784, 880, 784, 659.3,
            587.3, 0, 523.3, 587.3, 659.3, 0, 523.3, 493.9,
        ];
        const bass = [
            164.8, 0, 164.8, 164.8, 196, 0, 196, 196,
            146.8, 0, 146.8, 146.8, 164.8, 0, 164.8, 164.8,
            130.8, 0, 130.8, 130.8, 164.8, 0, 164.8, 164.8,
            146.8, 0, 146.8, 146.8, 130.8, 0, 130.8, 123.5,
        ];
        // 鼓点模式: 1=kick(低噪声), 2=snare(高噪声), 0=无
        const drums = [
            1, 0, 0, 2, 1, 0, 0, 2,
            1, 0, 0, 2, 1, 0, 1, 2,
            1, 0, 0, 2, 1, 0, 0, 2,
            1, 0, 1, 2, 1, 2, 1, 2,
        ];

        const eighthNote = beat / 2;
        let t = now;

        for (let i = 0; i < melody.length; i++) {
            const noteT = t + i * eighthNote;
            // 旋律（方波，经典8-bit音色）
            if (melody[i] > 0) {
                this._chip(melody[i], 'square', noteT, eighthNote * 0.85, 0.045, this._masterGain);
            }
            // 低音（锯齿波，厚实低频）
            if (bass[i] > 0) {
                this._chip(bass[i], 'sawtooth', noteT, eighthNote * 0.7, 0.05, this._masterGain);
            }
            // 鼓
            if (drums[i] === 1) {
                // Kick — 短促低频方波模拟
                this._chip(55, 'square', noteT, 0.08, 0.09, this._masterGain);
            } else if (drums[i] === 2) {
                // Snare — 白噪声脉冲
                this._noise(noteT, 0.1, 0.06, this._masterGain);
            }
        }

        const totalDur = melody.length * eighthNote * 1000;
        this._loopTimer = setTimeout(() => { this._nodes = []; this._playBattlePhrase(); }, totalDur - 50);
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
    // 环绕刀刃 + 连锁闪电 → 雷电旋刃
    thunder_blade: {
        name: '雷电旋刃',
        desc: '环绕刀刃每次切割触发闪电链，跳跃3个目标',
        icon: '🔪⚡',
        requires: ['orbital1', 'chain1'],
        apply(p) { p.bonuses._fusionThunderBlade = true; },
    },
    // 火焰尾迹 + 分裂弹 → 岩浆裂变
    magma_fission: {
        name: '岩浆裂变',
        desc: '火焰尾迹变为岩浆池，敌人踩上时触发小型爆炸分裂',
        icon: '🔥💥',
        requires: ['firetrail', 'split'],
        apply(p) { p.bonuses._fusionMagmaFission = true; },
    },
    // 冰霜光环 + 能量护盾 → 极寒领域
    cryo_field: {
        name: '极寒领域',
        desc: '护盾破碎时释放冰冻冲击波，冻结全屏敌人1.5秒',
        icon: '❄️🛡️',
        requires: ['frost', 'shield1'],
        apply(p) { p.bonuses._fusionCryoField = true; },
    },
    // 吸血 + 爆裂击杀 → 暗影收割
    shadow_harvest: {
        name: '暗影收割',
        desc: '爆裂击杀回复爆炸伤害30%的生命，爆炸范围+50%',
        icon: '🧛💣',
        requires: ['vamp1', 'explokill'],
        apply(p) { p.bonuses._fusionShadowHarvest = true; },
    },
    // 追踪术 + 额外弹幕 → 弹幕矩阵
    bullet_matrix: {
        name: '弹幕矩阵',
        desc: '追踪弹获得穿透能力，穿透后换目标继续追踪',
        icon: '🎯🌟',
        requires: ['homing', 'proj1'],
        apply(p) { p.bonuses._fusionBulletMatrix = true; },
    },
    // 荆棘 + 铁骨铮铮 → 圣盾荆棘
    holy_thorns: {
        name: '圣盾荆棘',
        desc: '荆棘反伤提升至400%，反伤附带击退效果',
        icon: '🌵🏛️',
        requires: ['thorn', 'dmgred1'],
        apply(p) { p.bonuses._fusionHolyThorns = true; },
    },
    // 狂战士之怒 + 双重打击 → 狂暴连击
    fury_combo: {
        name: '狂暴连击',
        desc: '低血量时双重打击概率翻倍，且每次触发回复15HP',
        icon: '😡✨',
        requires: ['rage1', 'double'],
        apply(p) { p.bonuses._fusionFuryCombo = true; },
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
// 可选地图系统（玩家选择）
// ============================================
const GameMaps = [
    {
        id: 'void_abyss',
        name: '虚空深渊',
        desc: '紫色水晶漂浮的无尽虚空，神秘而幽深',
        icon: '🌌',
        // 视觉主题配置
        bgGrad: ['#0a0a20', '#141438', '#0e0e2a'],
        glowA: 'rgba(60,20,140,0.35)',
        glowB: 'rgba(20,30,100,0.28)',
        gridColor: 'rgba(60,40,140,0.55)',
        dotColor: '#3a3a88',
        starColor: '#9988dd',
        fogColor: 'rgba(40,20,100,0.25)',
        decorType: 'crystal',
        decorColor: '#7744cc',
        // 环境特色
        ambientParticles: { color: '#8855ff', count: 35, speed: 0.3, glow: true },
        specialEffect: 'floatingCrystals', // 漂浮的紫色水晶碎片
    },
    {
        id: 'crimson_waste',
        name: '猩红荒原',
        desc: '炽热的红色荒漠，残破石柱矗立在血色天空下',
        icon: '🔥',
        bgGrad: ['#180808', '#281010', '#200c0c'],
        glowA: 'rgba(140,20,10,0.38)',
        glowB: 'rgba(100,40,10,0.28)',
        gridColor: 'rgba(120,35,20,0.55)',
        dotColor: '#553322',
        starColor: '#cc7744',
        fogColor: 'rgba(120,20,10,0.28)',
        decorType: 'pillar',
        decorColor: '#aa5533',
        ambientParticles: { color: '#ff4422', count: 40, speed: 0.6, glow: true },
        specialEffect: 'embers', // 飘舞的火焰灰烬
    },
    {
        id: 'frost_realm',
        name: '冰封虚域',
        desc: '永恒冰雪覆盖的极寒之地，冰晶折射着幽蓝光芒',
        icon: '❄️',
        bgGrad: ['#081428', '#102840', '#0c1e34'],
        glowA: 'rgba(20,50,140,0.35)',
        glowB: 'rgba(10,80,120,0.30)',
        gridColor: 'rgba(40,80,150,0.55)',
        dotColor: '#2a4a77',
        starColor: '#77bbee',
        fogColor: 'rgba(20,45,110,0.28)',
        decorType: 'iceSpike',
        decorColor: '#3399bb',
        ambientParticles: { color: '#88ccff', count: 45, speed: 0.2, glow: true },
        specialEffect: 'snowfall', // 飘落的雪花
    },
    {
        id: 'dark_forest',
        name: '暗影森林',
        desc: '腐化蔓延的远古密林，萤火虫在毒雾中闪烁',
        icon: '🌲',
        bgGrad: ['#0c1a10', '#163018', '#102410'],
        glowA: 'rgba(10,70,25,0.32)',
        glowB: 'rgba(50,80,10,0.26)',
        gridColor: 'rgba(35,80,25,0.55)',
        dotColor: '#2a5518',
        starColor: '#66cc66',
        fogColor: 'rgba(20,70,15,0.30)',
        decorType: 'tree',
        decorColor: '#448833',
        ambientParticles: { color: '#44ff88', count: 50, speed: 0.15, glow: true },
        specialEffect: 'fireflies', // 闪烁的萤火虫
    },
    {
        id: 'nether_volcano',
        name: '熔岩地狱',
        desc: '岩浆翻涌的地下世界，热浪扭曲着空气',
        icon: '🌋',
        bgGrad: ['#180800', '#2c1200', '#220e00'],
        glowA: 'rgba(180,40,0,0.38)',
        glowB: 'rgba(150,70,0,0.28)',
        gridColor: 'rgba(160,50,10,0.55)',
        dotColor: '#773300',
        starColor: '#dd8822',
        fogColor: 'rgba(130,40,0,0.30)',
        decorType: 'lavaRock',
        decorColor: '#cc4400',
        ambientParticles: { color: '#ff8800', count: 35, speed: 0.8, glow: true },
        specialEffect: 'lavaDrops', // 上浮的岩浆液滴
    },
    {
        id: 'celestial_ruins',
        name: '天界废墟',
        desc: '崩塌的天空神殿，金色碎片在虚空中缓慢旋转',
        icon: '✨',
        bgGrad: ['#101028', '#1a1a40', '#141432'],
        glowA: 'rgba(80,60,10,0.35)',
        glowB: 'rgba(40,25,90,0.28)',
        gridColor: 'rgba(80,65,35,0.55)',
        dotColor: '#554422',
        starColor: '#ccaa66',
        fogColor: 'rgba(55,45,15,0.26)',
        decorType: 'ruins',
        decorColor: '#bb8833',
        ambientParticles: { color: '#ffdd66', count: 30, speed: 0.1, glow: true },
        specialEffect: 'goldenDust', // 金色光尘缓慢飘落
    },
];

// 旧版 MapThemes 兼容（敌人系统引用）—— 映射为第一张地图
const MapThemes = GameMaps.map((m, i) => ({
    ...m,
    id: m.id,
    name: m.name,
    timeRange: [i * 90, (i + 1) * 90],
}));

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
        // 极端修饰符（高风险高回报，有概率在周末出现）
        const extremePool = [
            { name: '玻璃大炮', desc: '伤害x2 但生命上限=1', key: 'glassCannon', value: 1, extreme: true },
            { name: '无尽潮涌', desc: '敌人数量x2 经验x1.5', key: 'endlessTide', value: 1, extreme: true },
            { name: '时间加速', desc: '全局2倍速 包括玩家', key: 'timeWarp', value: 2.0, extreme: true },
            { name: '黑暗降临', desc: '视野缩小50% 但暴击率+30%', key: 'darkness', value: 1, extreme: true },
            { name: '武器封印', desc: '随机封印1个武器槽 攻击力+50%', key: 'weaponSeal', value: 1, extreme: true },
            { name: '死神契约', desc: '每30秒失去10%当前血量 击杀回血', key: 'deathPact', value: 1, extreme: true },
            { name: '巨人化', desc: '体积x2 伤害x1.5 移速-30%', key: 'gigantism', value: 1, extreme: true },
            { name: '镜像噩梦', desc: 'Boss同时出现2只 经验x2', key: 'mirrorBoss', value: 1, extreme: true },
        ];
        // 每天选2个普通修饰 + 周末(seed%7 < 2)额外加1个极端修饰
        const shuffled = modPool.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const result = shuffled.slice(0, 2);
        // 约30%概率出现极端修饰符(seed决定)
        if (rng() < 0.3) {
            const eShuffled = extremePool.slice();
            for (let i = eShuffled.length - 1; i > 0; i--) {
                const j = Math.floor(rng() * (i + 1));
                [eShuffled[i], eShuffled[j]] = [eShuffled[j], eShuffled[i]];
            }
            result.push(eShuffled[0]);
        }
        return result;
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

// ============================================
// 战斗日志 / DPS 统计系统
// ============================================
class CombatLog {
    constructor() {
        this.sources = {};
        this._dpsEntries = [];
        this.currentDPS = 0;
        this.peakDPS = 0;
        this.entries = [];
        this.visible = false;
    }

    record(source, amount, isCrit, isKill) {
        if (!this.sources[source]) {
            this.sources[source] = { total: 0, hits: 0, crits: 0, kills: 0 };
        }
        const s = this.sources[source];
        s.total += amount;
        s.hits++;
        if (isCrit) s.crits++;
        if (isKill) s.kills++;
        this._dpsEntries.push({ time: performance.now(), amount });
    }

    addEntry(text, color = '#ccc') {
        this.entries.push({ text, color, time: performance.now() });
        if (this.entries.length > 12) this.entries.shift();
    }

    updateDPS() {
        const now = performance.now();
        const window = 5000;
        // 移除过期条目（使用指针而非shift减少数组操作）
        let startIdx = 0;
        while (startIdx < this._dpsEntries.length && now - this._dpsEntries[startIdx].time > window) {
            startIdx++;
        }
        if (startIdx > 0) this._dpsEntries.splice(0, startIdx);

        let sum = 0;
        for (let i = 0; i < this._dpsEntries.length; i++) sum += this._dpsEntries[i].amount;
        this.currentDPS = sum / (window / 1000);
        if (this.currentDPS > this.peakDPS) this.peakDPS = this.currentDPS;
    }

    getTotalDamage() {
        let total = 0;
        for (const key in this.sources) total += this.sources[key].total;
        return total;
    }

    getSorted() {
        const arr = [];
        for (const key in this.sources) {
            arr.push({ name: key, ...this.sources[key] });
        }
        arr.sort((a, b) => b.total - a.total);
        return arr;
    }

    reset() {
        this.sources = {};
        this._dpsEntries = [];
        this.currentDPS = 0;
        this.peakDPS = 0;
        this.entries = [];
    }
}
