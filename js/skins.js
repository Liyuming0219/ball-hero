// ============================================
// 皮肤系统 V2 - 完全重做
// 每个皮肤独特外观(不局限球形) + 独特特效
// 画质分档差异显著
// ============================================
const TWO_PI_SK = Math.PI * 2;

// --- 画质等级(差异拉大) ---
const QualityLevels = {
    low: {
        name: '流畅', desc: '极简，无粒子无光影',
        particleMult: 0, trailLength: 0,
        glowEnabled: false, shadowEnabled: false, shakeEnabled: false,
        detailLevel: 0, bgEffects: false, reflections: false,
    },
    medium: {
        name: '均衡', desc: '基础粒子+光晕',
        particleMult: 0.5, trailLength: 5,
        glowEnabled: true, shadowEnabled: true, shakeEnabled: true,
        detailLevel: 1, bgEffects: false, reflections: false,
    },
    high: {
        name: '高画质', desc: '完整粒子+全光影+动态细节',
        particleMult: 1.0, trailLength: 14,
        glowEnabled: true, shadowEnabled: true, shakeEnabled: true,
        detailLevel: 2, bgEffects: true, reflections: true,
    },
    ultra: {
        name: '极致', desc: '满粒子+环绕特效+光线追踪感',
        particleMult: 2.0, trailLength: 24,
        glowEnabled: true, shadowEnabled: true, shakeEnabled: true,
        detailLevel: 3, bgEffects: true, reflections: true,
    },
};

// --- 皮肤系列定义 ---
const SkinSeries = {
    fruit: {
        name: '水果派对', icon: '🍉', tier: 1,
        skins: {
            watermelon: { id: 'watermelon', name: '西瓜勇士', series: 'fruit', tier: 1, icon: '🍉', price: 500, desc: '圆滚滚的西瓜横冲直撞，瓜籽如子弹射出' },
            strawberry: { id: 'strawberry', name: '草莓甜心', series: 'fruit', tier: 1, icon: '🍓', price: 500, desc: '心形草莓散播花瓣，爱心弹幕致命又甜蜜' },
            orange: { id: 'orange', name: '橙子爆弹', series: 'fruit', tier: 1, icon: '🍊', price: 500, desc: '酸爆橙汁四溅，维C能量射穿一切' },
        },
    },
    animal: {
        name: '萌宠乐园', icon: '🦊', tier: 2,
        skins: {
            fox: { id: 'fox', name: '灵狐焰尾', series: 'animal', tier: 2, icon: '🦊', price: 1500, desc: '九尾灵狐化身，狐火缭绕身周' },
            dragon: { id: 'dragon', name: '幼龙之息', series: 'animal', tier: 2, icon: '🐲', price: 2000, desc: '远古幼龙觉醒，鳞甲紫金光' },
            cat: { id: 'cat', name: '暗影魅猫', series: 'animal', tier: 2, icon: '🐱', price: 1500, desc: '暗夜致命猎手，暗影爪撕裂空间' },
        },
    },
    gem: {
        name: '珍宝奇石', icon: '💎', tier: 3,
        skins: {
            diamond: { id: 'diamond', name: '钻石棱光', series: 'gem', tier: 3, icon: '💎', price: 3000, desc: '万千棱光璀璨钻石，每击碎虹彩' },
            ruby: { id: 'ruby', name: '炎晶红宝', series: 'gem', tier: 3, icon: '❤️‍🔥', price: 3000, desc: '燃烧红宝石，内蕴毁灭烈焰' },
            emerald: { id: 'emerald', name: '翡翠藤蔓', series: 'gem', tier: 3, icon: '💚', price: 3000, desc: '自然之心翡翠，藤蔓缠绕为甲' },
        },
    },
    cosmic: {
        name: '星际传说', icon: '🌌', tier: 4,
        skins: {
            nebula: { id: 'nebula', name: '星云之子', series: 'cosmic', tier: 4, icon: '🌌', price: 5000, desc: '宇宙深处的星云生命体，恒星能量倾泻' },
            blackhole: { id: 'blackhole', name: '黑洞吞噬者', series: 'cosmic', tier: 4, icon: '🕳️', price: 8000, desc: '连光都无法逃脱的终极存在' },
            phoenix: { id: 'phoenix', name: '不死凤凰', series: 'cosmic', tier: 4, icon: '🔥', price: 6000, desc: '浴火重生神鸟，烈焰羽翼划破苍穹' },
        },
    },
    mech: {
        name: '机械纪元', icon: '⚙️', tier: 3,
        skins: {
            cyberpunk: { id: 'cyberpunk', name: '赛博朋克', series: 'mech', tier: 3, icon: '🤖', price: 3500, desc: '霓虹闪烁的赛博义体，数据洪流贯穿全身' },
            steambot: { id: 'steambot', name: '蒸汽机甲', series: 'mech', tier: 3, icon: '⚙️', price: 3000, desc: '复古蒸汽朋克巨兽，铜齿轮与蒸汽共鸣' },
            nanocore: { id: 'nanocore', name: '纳米核心', series: 'mech', tier: 3, icon: '🔬', price: 4000, desc: '亿万纳米粒子组成的可变形态战士' },
        },
    },
    element: {
        name: '元素领主', icon: '⚡', tier: 4,
        skins: {
            thunder: { id: 'thunder', name: '雷霆之神', series: 'element', tier: 4, icon: '⚡', price: 5000, desc: '掌控雷霆的远古神灵，每一击引来天罚' },
            glacier: { id: 'glacier', name: '寒冰领主', series: 'element', tier: 4, icon: '❄️', price: 5000, desc: '绝对零度的冰霜化身，冻结万物的呼吸' },
            shadow: { id: 'shadow', name: '暗影主宰', series: 'element', tier: 4, icon: '🌑', price: 5500, desc: '黑暗深渊的统治者，影子是最锋利的刀刃' },
        },
    },
    myth: {
        name: '东方神话', icon: '🐉', tier: 5,
        skins: {
            kitsune: { id: 'kitsune', name: '九尾天狐', series: 'myth', tier: 5, icon: '🦊', price: 8000, desc: '千年修炼的九尾天狐，幻术与狐火并济' },
            dragonking: { id: 'dragonking', name: '东海龙王', series: 'myth', tier: 5, icon: '🐉', price: 10000, desc: '四海之主，翻江倒海、呼风唤雨' },
            wukong: { id: 'wukong', name: '齐天大圣', series: 'myth', tier: 5, icon: '🐵', price: 12000, desc: '大闹天宫的美猴王，金箍棒横扫三界' },
        },
    },
    abyss: {
        name: '深渊秘境', icon: '👁️', tier: 5,
        skins: {
            voidwalker: { id: 'voidwalker', name: '虚空行者', series: 'abyss', tier: 5, icon: '🌀', price: 8000, desc: '穿梭虚空夹缝的神秘存在，扭曲空间本身' },
            bloodmoon: { id: 'bloodmoon', name: '血月猎人', series: 'abyss', tier: 5, icon: '🌙', price: 7000, desc: '血月之夜苏醒的永恒猎手，鲜血是力量源泉' },
            chaoseye: { id: 'chaoseye', name: '混沌之眼', series: 'abyss', tier: 5, icon: '👁️', price: 10000, desc: '窥探一切的深渊之眼，令凝视者疯狂' },
        },
    },
};

// --- 皮肤管理器 ---
class SkinManager {
    constructor() {
        this.ownedSkins = this._load('ownedSkins', []);
        this.equippedSkins = this._load('equippedSkins', {});
        this.qualityLevel = this._loadQuality();
    }
    get gold() { if (typeof MetaProgress !== 'undefined') return MetaProgress.data.gold; return 0; }
    set gold(val) { if (typeof MetaProgress !== 'undefined') { MetaProgress.data.gold = val; MetaProgress.save(); } }
    getQuality() { return QualityLevels[this.qualityLevel] || QualityLevels.high; }
    setQuality(level) { if (QualityLevels[level]) { this.qualityLevel = level; localStorage.setItem('skinQuality', level); } }
    getAllSkins() {
        const list = [];
        for (const sk of Object.keys(SkinSeries)) for (const id of Object.keys(SkinSeries[sk].skins)) list.push(SkinSeries[sk].skins[id]);
        return list;
    }
    getEquippedSkin(charId) {
        // 试玩模式优先使用临时皮肤
        if (this._trialSkinId) { const s = this.getSkinById(this._trialSkinId); if (s) return s; }
        const id = this.equippedSkins[charId]; return id ? this.getSkinById(id) : null;
    }
    getSkinById(skinId) {
        for (const sk of Object.keys(SkinSeries)) if (SkinSeries[sk].skins[skinId]) return SkinSeries[sk].skins[skinId];
        return null;
    }
    buySkin(skinId) {
        const skin = this.getSkinById(skinId);
        if (!skin || this.ownedSkins.includes(skinId) || this.gold < skin.price) return false;
        this.gold -= skin.price;
        this.ownedSkins.push(skinId);
        this._save('ownedSkins', this.ownedSkins);
        return true;
    }
    equipSkin(charId, skinId) {
        if (skinId && !this.ownedSkins.includes(skinId)) return false;
        if (skinId) { for (const cid of Object.keys(CharacterDefs || {})) this.equippedSkins[cid] = skinId; }
        else { this.equippedSkins[charId] = null; }
        this._save('equippedSkins', this.equippedSkins);
        return true;
    }
    unequipAll() { for (const cid of Object.keys(this.equippedSkins)) this.equippedSkins[cid] = null; this._save('equippedSkins', this.equippedSkins); }
    getAnyEquippedSkinId() { for (const cid of Object.keys(this.equippedSkins)) { if (this.equippedSkins[cid]) return this.equippedSkins[cid]; } return null; }
    _load(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } }
    _save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
    _loadQuality() { const q = localStorage.getItem('skinQuality'); return QualityLevels[q] ? q : (window.innerWidth > 1200 ? 'high' : 'medium'); }
}

// ============================================
// 皮肤渲染器 V2
// ============================================
class SkinRenderer {
    constructor(qualityCfg) {
        this.quality = qualityCfg || QualityLevels.high;
        this._time = 0;
    }
    setQuality(q) { this.quality = q; }
    update(dt) { this._time += dt; }

    renderBody(ctx, skin, x, y, radius, facingAngle, bob, alpha) {
        if (!skin) return false;
        const fn = this['_body_' + skin.id];
        if (!fn) return false;
        ctx.save();
        ctx.globalAlpha = alpha || 1;
        fn.call(this, ctx, x, y + (bob || 0), radius, facingAngle);
        ctx.restore();
        return true;
    }

    renderProjectile(ctx, skin, x, y, radius, angle) {
        if (!skin) return false;
        const fn = this['_proj_' + skin.id];
        if (!fn) return false;
        ctx.save();
        // 保障投射物最小尺寸（箭矢等小弹幕radius很小，皮肤特效按比例缩放后几乎不可见）
        const safeRadius = Math.max(radius, 10);
        ctx.globalAlpha = 1;
        fn.call(this, ctx, x, y, safeRadius, angle);
        ctx.restore();
        return true;
    }

    // 皮肤武器外观覆盖 — 返回 true 表示已由皮肤接管绘制
    renderWeapon(ctx, skin, weaponType, attacking) {
        if (!skin) return false;
        const fn = this['_weapon_' + skin.id];
        if (!fn) return false;
        ctx.save();
        fn.call(this, ctx, weaponType, attacking);
        ctx.restore();
        return true;
    }

    // ========= 工具 =========
    _glow(ctx, x, y, r, color, alpha) {
        if (!this.quality.glowEnabled) return;
        ctx.save(); ctx.globalAlpha = alpha;
        const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r * 1.8);
        g.addColorStop(0, color); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 1.8, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }
    _shadow(ctx, x, y, r) {
        if (!this.quality.shadowEnabled) return;
        ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(x, y + r + 3, r * 0.75, r * 0.2, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }
    _hl(ctx, x, y, r) {
        if (this.quality.detailLevel < 1) return;
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x - r * 0.3, y - r * 0.35, r * 0.6);
        g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.35, r * 0.6, 0, TWO_PI_SK); ctx.fill();
    }

    // ============================================
    // 水果系列
    // ============================================

    // 西瓜 - 高度真实的3D西瓜，多层渐变+凹凸条纹+露出红瓤+汁液光泽
    _body_watermelon(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        const g = ctx.createRadialGradient(-r*0.3, -r*0.3, 0, 0, 0, r);
        g.addColorStop(0, '#5fd47a'); g.addColorStop(0.5, '#3aad52');
        g.addColorStop(0.8, '#1e7a35'); g.addColorStop(1, '#0d4d1f');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        ctx.strokeStyle = '#0a3013'; ctx.lineWidth = r * 0.14;
        ctx.lineCap = 'round'; ctx.globalAlpha = 0.6;
        for (let i = 0; i < 5; i++) {
            const a = i * TWO_PI_SK / 5 + angle * 0.1;
            ctx.beginPath(); ctx.arc(0, 0, r * 0.7, a - 0.5, a + 0.5); ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(-r*0.3, -r*0.3, r*0.15, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_watermelon(ctx, x, y, r, angle) {
        // 巨型瓜刃旋风 — 多层旋转的西瓜切片刀锋
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层绿色旋风气流
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 3; i++) {
            const a = t * 12 + i * TWO_PI_SK / 3;
            const gr = ctx.createRadialGradient(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, 0, 0, 0, r * 1.5);
            gr.addColorStop(0, '#44ff66'); gr.addColorStop(0.5, '#228844'); gr.addColorStop(1, 'transparent');
            ctx.fillStyle = gr;
            ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, r * 1.4, 0, TWO_PI_SK); ctx.fill();
        }
        // 旋转瓜刃（3片弧形刀刃）
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < 3; i++) {
            const ba = t * 14 + i * TWO_PI_SK / 3;
            ctx.save(); ctx.rotate(ba);
            const bg = ctx.createLinearGradient(0, 0, r * 1.3, 0);
            bg.addColorStop(0, '#1e7a30'); bg.addColorStop(0.6, '#44cc55'); bg.addColorStop(1, '#88ffaa');
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.moveTo(r * 0.15, -r * 0.12);
            ctx.quadraticCurveTo(r * 0.7, -r * 0.25, r * 1.3, 0);
            ctx.quadraticCurveTo(r * 0.7, r * 0.25, r * 0.15, r * 0.12);
            ctx.closePath(); ctx.fill();
            // 红瓤边缘
            ctx.fillStyle = '#ff3344';
            ctx.beginPath();
            ctx.moveTo(r * 0.2, -r * 0.05);
            ctx.quadraticCurveTo(r * 0.5, -r * 0.1, r * 0.9, 0);
            ctx.quadraticCurveTo(r * 0.5, r * 0.1, r * 0.2, r * 0.05);
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        // 中心核
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.4, '#88ff88'); cg.addColorStop(1, '#228833');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, TWO_PI_SK); ctx.fill();
        // 瓜籽碎片飞散
        ctx.fillStyle = '#111';
        for (let i = 0; i < 6; i++) {
            const sa = t * 8 + i * 1.05;
            const sd = r * (0.5 + Math.sin(t * 4 + i) * 0.3);
            ctx.save(); ctx.translate(Math.cos(sa) * sd, Math.sin(sa) * sd); ctx.rotate(sa * 2);
            ctx.beginPath(); ctx.ellipse(0, 0, 2, 3.5, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.2, '#33cc55', 0.25);
    }

    // 草莓 - 高度真实的3D草莓，心形轮廓+凹陷籽粒+叶冠+露水
    _body_strawberry(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        const g = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, r*0.1, r);
        g.addColorStop(0, '#ff6b7a'); g.addColorStop(0.4, '#e63350');
        g.addColorStop(0.75, '#bf1e3d'); g.addColorStop(1, '#8b0a2a');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#ffe44d';
        var seeds = [[0.3,0.1],[-0.35,0.15],[0.1,0.45],[-0.15,-0.3],[0.35,-0.2],[-0.4,-0.1],[0.05,-0.55],[0.25,0.5],[-0.25,0.45]];
        for (var i = 0; i < seeds.length; i++) {
            var sx = seeds[i][0], sy = seeds[i][1];
            if (sx*sx+sy*sy > 0.7) continue;
            ctx.beginPath(); ctx.arc(sx*r, sy*r, r*0.06, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.fillStyle = '#2cb84b';
        for (var j = -1; j <= 1; j++) {
            ctx.beginPath();
            ctx.ellipse(j*r*0.2, -r*0.85, r*0.2, r*0.08, j*0.3, 0, TWO_PI_SK);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath(); ctx.arc(-r*0.25, -r*0.3, r*0.12, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_strawberry(ctx, x, y, r, angle) {
        // 草莓花瓣风暴 — 旋转的粉色花瓣漩涡+中心能量核
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层花瓣漩涡
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 8; i++) {
            const pa = t * 10 + i * TWO_PI_SK / 8;
            const pd = r * (0.8 + Math.sin(t * 3 + i) * 0.2);
            ctx.save(); ctx.translate(Math.cos(pa) * pd, Math.sin(pa) * pd); ctx.rotate(pa + t * 5);
            const pg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.45);
            pg.addColorStop(0, '#ffaacc'); pg.addColorStop(1, 'transparent');
            ctx.fillStyle = pg;
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.4);
            ctx.bezierCurveTo(-r * 0.25, -r * 0.2, -r * 0.25, r * 0.2, 0, r * 0.1);
            ctx.bezierCurveTo(r * 0.25, r * 0.2, r * 0.25, -r * 0.2, 0, -r * 0.4);
            ctx.fill();
            ctx.restore();
        }
        // 中层粉色能量环
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#ff66aa'; ctx.lineWidth = r * 0.08;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.9, 0, TWO_PI_SK); ctx.stroke();
        ctx.strokeStyle = '#ff88cc'; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.2, t * 6, t * 6 + Math.PI * 1.5); ctx.stroke();
        // 核心
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.3, '#ff88bb'); cg.addColorStop(0.7, '#ff2266'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, TWO_PI_SK); ctx.fill();
        // 金色籽粒飞散
        ctx.fillStyle = '#ffdd44'; ctx.globalAlpha = 0.7;
        for (let i = 0; i < 5; i++) {
            const sa = t * 7 + i * 1.3;
            const sd = r * (0.3 + i * 0.15);
            ctx.beginPath(); ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, 2, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.0, '#ff66aa', 0.3);
    }

    // 橙子 - 高度真实的3D橙子，凹凸表皮+自然渐变+叶蒂+纤维质感
    _body_orange(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        const g = ctx.createRadialGradient(-r*0.2, -r*0.25, 0, 0, 0, r);
        g.addColorStop(0, '#ffb347'); g.addColorStop(0.4, '#ff8c1a');
        g.addColorStop(0.75, '#e06600'); g.addColorStop(1, '#a34400');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        if (this.quality.detailLevel >= 1) {
            ctx.fillStyle = 'rgba(255,200,100,0.15)';
            for (var i = 0; i < 12; i++) {
                var a = i * 1.37, d = r * (0.3 + (i%3)*0.2);
                ctx.beginPath(); ctx.arc(Math.cos(a)*d, Math.sin(a)*d, r*0.04, 0, TWO_PI_SK); ctx.fill();
            }
        }
        ctx.fillStyle = '#3aaa50';
        ctx.beginPath(); ctx.ellipse(0, -r*0.85, r*0.12, r*0.06, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(-r*0.25, -r*0.28, r*0.13, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_orange(ctx, x, y, r, angle) {
        // 柑橘爆裂弹 — 旋转的橙瓣能量球+汁液飞溅
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层橙色能量旋涡
        ctx.globalAlpha = 0.25;
        for (let i = 0; i < 5; i++) {
            const a = t * 9 + i * TWO_PI_SK / 5;
            const d = r * 0.3;
            const sg = ctx.createRadialGradient(Math.cos(a) * d, Math.sin(a) * d, 0, 0, 0, r * 1.4);
            sg.addColorStop(0, '#ffcc44'); sg.addColorStop(0.5, '#ff8800'); sg.addColorStop(1, 'transparent');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 1.3, 0, TWO_PI_SK); ctx.fill();
        }
        // 橙瓣（旋转的6瓣）
        ctx.globalAlpha = 0.8;
        for (let i = 0; i < 6; i++) {
            const ba = t * 11 + i * TWO_PI_SK / 6;
            ctx.save(); ctx.rotate(ba);
            const pg = ctx.createLinearGradient(0, 0, r, 0);
            pg.addColorStop(0, '#ffcc55'); pg.addColorStop(1, '#ff8800');
            ctx.fillStyle = pg;
            ctx.beginPath();
            ctx.moveTo(r * 0.15, 0);
            ctx.quadraticCurveTo(r * 0.6, -r * 0.2, r * 1.1, 0);
            ctx.quadraticCurveTo(r * 0.6, r * 0.2, r * 0.15, 0);
            ctx.fill();
            ctx.restore();
        }
        // 核心白光
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.35);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.5, '#ffee66'); cg.addColorStop(1, '#ff9900');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, TWO_PI_SK); ctx.fill();
        // 汁液飞溅粒子
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#ffdd44';
        for (let i = 0; i < 6; i++) {
            const sa = t * 6 + i * 1.05;
            const sd = r * (0.9 + Math.sin(t * 5 + i * 2) * 0.3);
            ctx.beginPath(); ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, 2.5, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.0, '#ff9900', 0.25);
    }

    // ============================================
    // 动物系列
    // ============================================

    // 灵狐焰尾 - 优雅九尾狐形象，多层火焰尾+流线身体+灵动大眼
    _body_fox(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        var g = ctx.createRadialGradient(-r*0.15, -r*0.1, 0, 0, 0, r);
        g.addColorStop(0, '#ffaa55'); g.addColorStop(0.5, '#ee7722');
        g.addColorStop(0.85, '#cc5500'); g.addColorStop(1, '#883300');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        // White belly
        ctx.fillStyle = '#fff5ee';
        ctx.beginPath(); ctx.ellipse(0, r*0.3, r*0.55, r*0.45, 0, 0, Math.PI); ctx.fill();
        // Big pointy ears
        ctx.fillStyle = '#ee7722';
        for (var s = -1; s <= 1; s += 2) {
            ctx.beginPath();
            ctx.moveTo(s*r*0.4, -r*0.6);
            ctx.lineTo(s*r*0.7, -r*1.4);
            ctx.lineTo(s*r*0.9, -r*0.5);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffaaaa';
            ctx.beginPath();
            ctx.moveTo(s*r*0.48, -r*0.65);
            ctx.lineTo(s*r*0.68, -r*1.2);
            ctx.lineTo(s*r*0.8, -r*0.58);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ee7722';
        }
        // Eyes
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(-r*0.25, -r*0.1, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(r*0.25, -r*0.1, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-r*0.22, -r*0.13, r*0.04, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(r*0.28, -r*0.13, r*0.04, 0, TWO_PI_SK); ctx.fill();
        // Nose
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(0, r*0.05, r*0.06, 0, TWO_PI_SK); ctx.fill();
        // Bushy tail
        if (this.quality.detailLevel >= 1) {
            ctx.fillStyle = '#ee7722'; ctx.globalAlpha = 0.8;
            var ta = Math.PI * 0.7 + Math.sin(t*2) * 0.2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ta)*r*0.5, Math.sin(ta)*r*0.5);
            ctx.quadraticCurveTo(Math.cos(ta)*r*1.5, Math.sin(ta)*r*1.2,
                Math.cos(ta+0.5)*r*1.3, Math.sin(ta+0.5)*r*1.0);
            ctx.quadraticCurveTo(Math.cos(ta+0.3)*r*0.8, Math.sin(ta+0.3)*r*0.8,
                Math.cos(ta)*r*0.5, Math.sin(ta)*r*0.5);
            ctx.fill();
            ctx.fillStyle = '#fff5ee';
            ctx.beginPath(); ctx.arc(Math.cos(ta+0.4)*r*1.2, Math.sin(ta+0.4)*r*0.9, r*0.15, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.restore();
    }

    _proj_fox(ctx, x, y, r, angle) {
        // 九尾狐火漩涡 — 多层蓝白鬼火旋涡+狐尾拖尾
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 多层鬼火旋涡
        for (let layer = 3; layer >= 0; layer--) {
            const lr = r * (1.4 - layer * 0.2);
            const la = t * (8 + layer * 2);
            ctx.globalAlpha = 0.2 + layer * 0.1;
            const lg = ctx.createRadialGradient(0, 0, 0, 0, 0, lr);
            lg.addColorStop(0, layer === 0 ? '#ffffff' : '#aaeeff');
            lg.addColorStop(0.4, '#4488ff');
            lg.addColorStop(0.7, '#2244aa');
            lg.addColorStop(1, 'transparent');
            ctx.fillStyle = lg;
            ctx.beginPath(); ctx.arc(0, 0, lr, 0, TWO_PI_SK); ctx.fill();
        }
        // 旋转的狐火尾焰（3条）
        ctx.globalAlpha = 0.6;
        ctx.rotate(angle);
        for (let i = 0; i < 3; i++) {
            const ta = (i / 3) * TWO_PI_SK + t * 6;
            const tailLen = r * (1.8 + Math.sin(t * 4 + i) * 0.4);
            ctx.save(); ctx.rotate(ta);
            const tg = ctx.createLinearGradient(0, 0, -tailLen, 0);
            tg.addColorStop(0, 'rgba(136,221,255,0.8)'); tg.addColorStop(0.5, 'rgba(68,136,255,0.4)'); tg.addColorStop(1, 'transparent');
            ctx.fillStyle = tg;
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.08);
            ctx.quadraticCurveTo(-tailLen * 0.5, -r * 0.2, -tailLen, 0);
            ctx.quadraticCurveTo(-tailLen * 0.5, r * 0.2, 0, r * 0.08);
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        // 核心白焰
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.5, '#aaddff'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, TWO_PI_SK); ctx.fill();
        // 飘忽火星
        ctx.fillStyle = '#88ddff';
        for (let i = 0; i < 6; i++) {
            const sa = t * 5 + i * 1.1;
            const sd = r * (0.5 + Math.sin(t * 3 + i) * 0.4);
            ctx.globalAlpha = 0.4 + Math.sin(t * 4 + i) * 0.3;
            ctx.beginPath(); ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, 2, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.2, '#4488ff', 0.35);
    }

    // 幼龙之息 - 紫金幼龙，展翅+鳞甲+弯角+鼻烟，萌系但威严
    _body_dragon(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        var g = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, 0, r);
        g.addColorStop(0, '#c495f0'); g.addColorStop(0.4, '#9955dd');
        g.addColorStop(0.75, '#6633aa'); g.addColorStop(1, '#331166');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        // Pale belly
        ctx.fillStyle = '#eeddff'; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.ellipse(0, r*0.2, r*0.4, r*0.35, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 1;
        // Wings
        ctx.fillStyle = '#aa55ee';
        for (var s = -1; s <= 1; s += 2) {
            ctx.beginPath();
            ctx.moveTo(s*r*0.7, -r*0.2);
            ctx.lineTo(s*r*1.5, -r*0.7);
            ctx.lineTo(s*r*1.4, r*0.1);
            ctx.lineTo(s*r*0.8, r*0.2);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = '#7733bb'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(s*r*0.8, -r*0.1);
            ctx.lineTo(s*r*1.3, -r*0.5); ctx.stroke();
        }
        // Horns
        ctx.fillStyle = '#ffcc44';
        for (var s2 = -1; s2 <= 1; s2 += 2) {
            ctx.beginPath();
            ctx.moveTo(s2*r*0.2, -r*0.8);
            ctx.lineTo(s2*r*0.35, -r*1.3);
            ctx.lineTo(s2*r*0.45, -r*0.7);
            ctx.closePath(); ctx.fill();
        }
        // Eyes
        ctx.fillStyle = '#ffee44';
        ctx.beginPath(); ctx.arc(-r*0.25, -r*0.1, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(r*0.25, -r*0.1, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(-r*0.25, -r*0.1, r*0.05, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(r*0.25, -r*0.1, r*0.05, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_dragon(ctx, x, y, r, angle) {
        // 龙息烈焰漩涡 — 紫金双色火焰龙卷+鳞片碎片
        const t = this._time;
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        // 外层火焰龙卷（多层漏斗形）
        for (let layer = 2; layer >= 0; layer--) {
            const lw = r * (1.2 + layer * 0.3);
            const lh = r * (0.5 + layer * 0.2);
            ctx.globalAlpha = 0.25 + layer * 0.08;
            ctx.save(); ctx.rotate(t * (6 + layer * 3));
            const fg = ctx.createLinearGradient(-lw, 0, lw, 0);
            fg.addColorStop(0, layer === 0 ? '#fff' : '#ffcc00');
            fg.addColorStop(0.3, '#ff6644');
            fg.addColorStop(0.6, '#cc44aa');
            fg.addColorStop(1, '#7744dd');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.ellipse(0, 0, lw, lh, 0, 0, TWO_PI_SK);
            ctx.fill();
            ctx.restore();
        }
        // 主体火锥（前方喷射）
        ctx.globalAlpha = 0.85;
        const mg = ctx.createLinearGradient(-r * 0.5, 0, r * 2.2, 0);
        mg.addColorStop(0, '#7744dd'); mg.addColorStop(0.3, '#ff4466'); mg.addColorStop(0.6, '#ffaa00'); mg.addColorStop(0.9, '#ffee88'); mg.addColorStop(1, '#fff');
        ctx.fillStyle = mg;
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, -r * 0.6);
        ctx.quadraticCurveTo(r * 0.8, -r * 0.3, r * 2.0, 0);
        ctx.quadraticCurveTo(r * 0.8, r * 0.3, -r * 0.3, r * 0.6);
        ctx.closePath(); ctx.fill();
        // 火焰中心白热核
        ctx.globalAlpha = 0.9;
        const cg = ctx.createRadialGradient(r * 0.3, 0, 0, r * 0.3, 0, r * 0.5);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.4, '#ffee88'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(r * 0.3, 0, r * 0.5, 0, TWO_PI_SK); ctx.fill();
        // 鳞片碎片飞散
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#9966ff';
        for (let i = 0; i < 5; i++) {
            const sa = t * 7 + i * 1.3;
            const sx = r * (0.2 + i * 0.25) + Math.sin(t * 4 + i) * r * 0.1;
            const sy = Math.sin(sa) * r * 0.4;
            ctx.save(); ctx.translate(sx, sy); ctx.rotate(t * 8 + i);
            ctx.beginPath();
            ctx.moveTo(0, -3); ctx.lineTo(2.5, 0); ctx.lineTo(0, 3); ctx.lineTo(-2.5, 0);
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.3, '#ff6644', 0.3);
    }

    // 暗影猫 - 深渊暗影猫，幽灵般飘浮+大尖耳+发光竖瞳+暗影粒子+飘动尾巴
    _body_cat(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        var g = ctx.createRadialGradient(-r*0.15, -r*0.15, 0, 0, 0, r);
        g.addColorStop(0, '#8888aa'); g.addColorStop(0.5, '#555577');
        g.addColorStop(0.85, '#333355'); g.addColorStop(1, '#1a1a33');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        // Cat ears
        ctx.fillStyle = '#555577';
        for (var s = -1; s <= 1; s += 2) {
            ctx.beginPath();
            ctx.moveTo(s*r*0.3, -r*0.7);
            ctx.lineTo(s*r*0.55, -r*1.35);
            ctx.lineTo(s*r*0.75, -r*0.6);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffaacc';
            ctx.beginPath();
            ctx.moveTo(s*r*0.38, -r*0.72);
            ctx.lineTo(s*r*0.55, -r*1.15);
            ctx.lineTo(s*r*0.67, -r*0.65);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#555577';
        }
        // Green slit eyes
        for (var s2 = -1; s2 <= 1; s2 += 2) {
            ctx.fillStyle = '#44ff88';
            ctx.beginPath(); ctx.arc(s2*r*0.28, -r*0.05, r*0.14, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.ellipse(s2*r*0.28, -r*0.05, r*0.04, r*0.12, 0, 0, TWO_PI_SK); ctx.fill();
        }
        // Nose
        ctx.fillStyle = '#ffaaaa';
        ctx.beginPath(); ctx.arc(0, r*0.15, r*0.05, 0, TWO_PI_SK); ctx.fill();
        // Tail
        if (this.quality.detailLevel >= 1) {
            ctx.strokeStyle = '#555577'; ctx.lineWidth = r*0.15; ctx.lineCap = 'round';
            var ta = Math.sin(t*3) * 0.4;
            ctx.beginPath(); ctx.moveTo(r*0.5, r*0.3);
            ctx.quadraticCurveTo(r*1.2, r*0.1+ta*r*0.3, r*1.0, -r*0.3+ta*r*0.2);
            ctx.stroke();
        }
        ctx.restore();
    }

    _proj_cat(ctx, x, y, r, angle) {
        // 暗影裂空爪 — 多层暗影漩涡+能量爪痕+暗物质粒子
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 暗影漩涡底层
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 4; i++) {
            const a = t * 7 + i * TWO_PI_SK / 4;
            const d = r * 0.2;
            const sg = ctx.createRadialGradient(Math.cos(a) * d, Math.sin(a) * d, 0, 0, 0, r * 1.3);
            sg.addColorStop(0, '#44ffaa'); sg.addColorStop(0.4, '#228866'); sg.addColorStop(1, 'transparent');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 1.2, 0, TWO_PI_SK); ctx.fill();
        }
        // 旋转能量爪痕（5道弧形）
        ctx.globalAlpha = 0.8;
        ctx.rotate(angle);
        ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
            const clawA = (i - 2) * 0.25 + Math.sin(t * 5 + i) * 0.05;
            ctx.save(); ctx.rotate(clawA);
            const cg = ctx.createLinearGradient(-r * 1.2, 0, r * 1.2, 0);
            cg.addColorStop(0, 'transparent'); cg.addColorStop(0.3, '#44ffaa'); cg.addColorStop(0.7, '#88ffcc'); cg.addColorStop(1, '#fff');
            ctx.strokeStyle = cg;
            ctx.lineWidth = 3 - Math.abs(i - 2) * 0.5;
            ctx.beginPath();
            ctx.moveTo(-r * 1.2, 0);
            ctx.quadraticCurveTo(0, (i - 2) * r * 0.15, r * 1.2, (i - 2) * r * 0.08);
            ctx.stroke();
            ctx.restore();
        }
        // 核心暗影球
        ctx.globalAlpha = 0.9;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
        cg.addColorStop(0, '#88ffcc'); cg.addColorStop(0.4, '#227755'); cg.addColorStop(1, 'rgba(0,20,10,0.8)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, TWO_PI_SK); ctx.fill();
        // 暗物质粒子
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 8; i++) {
            const pa = t * 6 + i * 0.8;
            const pd = r * (0.6 + Math.sin(t * 3 + i * 1.5) * 0.4);
            ctx.fillStyle = i % 2 === 0 ? '#44ffaa' : '#88ffdd';
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 1.5 + Math.sin(t * 5 + i) * 0.5, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.2, '#44ffaa', 0.3);
    }

    // ============================================
    // 宝石系列
    // ============================================

    // 钻石 - 高真实感明亮式切割钻石，多层冠面+pavilion+火彩+内部折射
    _body_diamond(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#88ccff', 0.1);
        ctx.save(); ctx.translate(x, y);
        var sides = 8;
        var diamondPath = function() {
            ctx.beginPath();
            for (var i = 0; i < sides; i++) {
                var a = (i/sides) * TWO_PI_SK - Math.PI/2;
                var pr = r * (i%2 === 0 ? 1.0 : 0.88);
                var px = Math.cos(a)*pr, py = Math.sin(a)*pr;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
        };
        var dg = ctx.createLinearGradient(-r, -r, r, r);
        dg.addColorStop(0, '#e8f4ff'); dg.addColorStop(0.3, '#aaddff');
        dg.addColorStop(0.5, '#ffffff'); dg.addColorStop(0.7, '#88ccee');
        dg.addColorStop(1, '#446688');
        ctx.fillStyle = dg; diamondPath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
        for (var i = 0; i < sides; i++) {
            var a2 = (i/sides) * TWO_PI_SK - Math.PI/2;
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a2)*r*0.85, Math.sin(a2)*r*0.85); ctx.stroke();
        }
        if (this.quality.detailLevel >= 1) {
            var colors = ['#ff4444','#44ff44','#4444ff','#ffff44','#ff44ff'];
            ctx.globalAlpha = 0.25;
            for (var j = 0; j < colors.length; j++) {
                var ra = t*1.5 + j*TWO_PI_SK/colors.length;
                ctx.fillStyle = colors[j];
                ctx.beginPath(); ctx.arc(Math.cos(ra)*r*0.35, Math.sin(ra)*r*0.35, r*0.12, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 1.5; diamondPath(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(-r*0.2, -r*0.3, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_diamond(ctx, x, y, r, angle) {
        // 棱光爆裂 — 多彩旋转菱形碎片群+折射光芒
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 彩虹光芒射线
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 8; i++) {
            const la = t * 4 + i * TWO_PI_SK / 8;
            const hue = (t * 60 + i * 45) % 360;
            ctx.strokeStyle = `hsl(${hue}, 90%, 70%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(la) * r * 0.3, Math.sin(la) * r * 0.3);
            ctx.lineTo(Math.cos(la) * r * 1.5, Math.sin(la) * r * 1.5);
            ctx.stroke();
        }
        // 旋转菱形碎片群
        ctx.globalAlpha = 0.75;
        for (let i = 0; i < 6; i++) {
            const da = t * 8 + i * TWO_PI_SK / 6;
            const dd = r * (0.4 + Math.sin(t * 3 + i) * 0.15);
            const hue = (t * 80 + i * 60) % 360;
            ctx.save();
            ctx.translate(Math.cos(da) * dd, Math.sin(da) * dd);
            ctx.rotate(t * 12 + i * 1.5);
            ctx.fillStyle = `hsl(${hue}, 85%, 70%)`;
            ctx.beginPath();
            const sr = r * 0.35;
            ctx.moveTo(0, -sr); ctx.lineTo(sr * 0.5, 0); ctx.lineTo(0, sr); ctx.lineTo(-sr * 0.5, 0);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 0.8; ctx.stroke();
            ctx.restore();
        }
        // 中心白核
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.5, '#ccddff'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
        if (this.quality.glowEnabled) { const hue = (t * 120) % 360; this._glow(ctx, x, y, r * 1.2, `hsl(${hue}, 85%, 70%)`, 0.3); }
    }

    // 红宝石 - 高真实感椭圆切割红宝石，丝绢光泽+内含物+六射星光
    _body_ruby(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#ff3333', 0.12);
        ctx.save(); ctx.translate(x, y);
        var hexPath = function() {
            ctx.beginPath();
            for (var i = 0; i < 6; i++) {
                var a = (i/6)*TWO_PI_SK - Math.PI/2;
                var px = Math.cos(a)*r, py = Math.sin(a)*r;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.closePath();
        };
        var rg = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, 0, r);
        rg.addColorStop(0, '#ff6666'); rg.addColorStop(0.3, '#ee2222');
        rg.addColorStop(0.7, '#aa0000'); rg.addColorStop(1, '#550000');
        ctx.fillStyle = rg; hexPath(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,150,150,0.4)'; ctx.lineWidth = 1;
        for (var i = 0; i < 6; i++) {
            var a2 = (i/6)*TWO_PI_SK - Math.PI/2;
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a2)*r*0.9, Math.sin(a2)*r*0.9); ctx.stroke();
        }
        if (this.quality.detailLevel >= 1) {
            ctx.globalAlpha = 0.3;
            var fg = ctx.createRadialGradient(0, 0, 0, 0, 0, r*0.5);
            fg.addColorStop(0, '#ffaa44'); fg.addColorStop(0.5, '#ff4400'); fg.addColorStop(1, 'transparent');
            ctx.fillStyle = fg;
            ctx.beginPath(); ctx.arc(0, 0, r*0.5, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        }
        ctx.strokeStyle = '#ff8888'; ctx.lineWidth = 1.5; hexPath(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(-r*0.2, -r*0.25, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_ruby(ctx, x, y, r, angle) {
        // 红莲业火 — 多层火焰旋涡+红色能量脉冲
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层火焰旋涡
        for (let i = 0; i < 5; i++) {
            const fa = t * 9 + i * TWO_PI_SK / 5;
            const fd = r * (0.3 + Math.sin(t * 2 + i) * 0.1);
            ctx.globalAlpha = 0.3;
            ctx.save(); ctx.translate(Math.cos(fa) * fd, Math.sin(fa) * fd); ctx.rotate(fa + t * 6);
            const fg = ctx.createLinearGradient(-r * 0.8, 0, r * 0.8, 0);
            fg.addColorStop(0, 'transparent'); fg.addColorStop(0.3, '#ff4444'); fg.addColorStop(0.7, '#ffaa00'); fg.addColorStop(1, 'transparent');
            ctx.fillStyle = fg;
            ctx.beginPath();
            ctx.moveTo(-r * 0.8, 0); ctx.quadraticCurveTo(0, -r * 0.3, r * 0.8, 0);
            ctx.quadraticCurveTo(0, r * 0.3, -r * 0.8, 0); ctx.fill();
            ctx.restore();
        }
        // 能量环脉冲
        ctx.globalAlpha = 0.4 + Math.sin(t * 6) * 0.2;
        ctx.strokeStyle = '#ff4444'; ctx.lineWidth = r * 0.06;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, TWO_PI_SK); ctx.stroke();
        ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = r * 0.03;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.3, t * 8, t * 8 + Math.PI); ctx.stroke();
        // 核心
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.6);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.2, '#ffcc88'); cg.addColorStop(0.5, '#ff4444'); cg.addColorStop(0.8, '#cc1122'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, TWO_PI_SK); ctx.fill();
        // 火星粒子
        ctx.fillStyle = '#ffaa44'; ctx.globalAlpha = 0.6;
        for (let i = 0; i < 8; i++) {
            const pa = t * 7 + i * 0.8;
            const pd = r * (0.7 + Math.sin(t * 4 + i) * 0.4);
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 2, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.2, '#ff4444', 0.35);
    }

    // 翡翠 - 六角+藤蔓环绕
    _body_emerald(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#33ff88', 0.1);
        ctx.save(); ctx.translate(x, y);
        var rr = r * 0.85;
        var emeraldPath = function() {
            ctx.beginPath();
            ctx.moveTo(-rr*0.7, -rr); ctx.lineTo(rr*0.7, -rr);
            ctx.lineTo(rr, -rr*0.7); ctx.lineTo(rr, rr*0.7);
            ctx.lineTo(rr*0.7, rr); ctx.lineTo(-rr*0.7, rr);
            ctx.lineTo(-rr, rr*0.7); ctx.lineTo(-rr, -rr*0.7);
            ctx.closePath();
        };
        var eg = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, 0, r);
        eg.addColorStop(0, '#66ff99'); eg.addColorStop(0.3, '#33cc66');
        eg.addColorStop(0.6, '#228844'); eg.addColorStop(1, '#114422');
        ctx.fillStyle = eg; emeraldPath(); ctx.fill();
        ctx.strokeStyle = 'rgba(150,255,200,0.3)'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(-rr*0.5, -rr*0.5); ctx.lineTo(rr*0.5, rr*0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(rr*0.5, -rr*0.5); ctx.lineTo(-rr*0.5, rr*0.5); ctx.stroke();
        ctx.strokeStyle = '#88ffaa'; ctx.lineWidth = 1.5; emeraldPath(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.arc(-r*0.2, -r*0.25, r*0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_emerald(ctx, x, y, r, angle) {
        // 翡翠风暴 — 六角晶体旋风+叶刃碎片+绿光涟漪
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层旋转叶刃
        for (let i = 0; i < 6; i++) {
            const ba = t * 10 + i * TWO_PI_SK / 6;
            const bd = r * (0.6 + Math.sin(t * 3 + i * 1.3) * 0.15);
            ctx.save(); ctx.translate(Math.cos(ba) * bd, Math.sin(ba) * bd); ctx.rotate(ba + t * 5);
            ctx.globalAlpha = 0.55;
            const lg = ctx.createLinearGradient(-r * 0.5, 0, r * 0.5, 0);
            lg.addColorStop(0, 'transparent'); lg.addColorStop(0.3, '#44ffaa'); lg.addColorStop(0.7, '#22aa55'); lg.addColorStop(1, 'transparent');
            ctx.fillStyle = lg;
            ctx.beginPath();
            ctx.moveTo(-r * 0.5, 0); ctx.lineTo(-r * 0.15, -r * 0.12);
            ctx.lineTo(r * 0.5, 0); ctx.lineTo(-r * 0.15, r * 0.12); ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        // 绿光涟漪
        ctx.globalAlpha = 0.3 + Math.sin(t * 5) * 0.15;
        ctx.strokeStyle = '#66ffcc'; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.0 + Math.sin(t * 4) * r * 0.1, 0, TWO_PI_SK); ctx.stroke();
        ctx.strokeStyle = '#22cc66'; ctx.lineWidth = r * 0.03;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.3, t * 7, t * 7 + Math.PI * 1.2); ctx.stroke();
        // 核心六角宝石
        ctx.globalAlpha = 1;
        ctx.save(); ctx.rotate(t * 3);
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.2, '#aaffcc'); cg.addColorStop(0.6, '#22aa55'); cg.addColorStop(1, '#115533');
        ctx.fillStyle = cg;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_SK;
            i === 0 ? ctx.moveTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5) : ctx.lineTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
        // 能量碎片粒子
        ctx.fillStyle = '#88ffbb'; ctx.globalAlpha = 0.5;
        for (let i = 0; i < 10; i++) {
            const pa = t * 8 + i * 0.63;
            const pd = r * (0.4 + Math.sin(t * 3 + i * 1.7) * 0.5);
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 1.5, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.1, '#44ff88', 0.3);
    }

    // ============================================
    // 宇宙系列
    // ============================================

    // 星云 - 高真实感发射星云，多层气态云+柱状结构+新生恒星+暗尘带
    _body_nebula(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#8844ff', 0.15);
        ctx.save(); ctx.translate(x, y);
        var ng = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        ng.addColorStop(0, '#4422aa'); ng.addColorStop(0.4, '#220066');
        ng.addColorStop(0.8, '#110033'); ng.addColorStop(1, '#000011');
        ctx.fillStyle = ng;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        if (this.quality.detailLevel >= 1) {
            var nColors = ['#ff44aa', '#4488ff', '#aa44ff'];
            for (var i = 0; i < 3; i++) {
                var a = t * 0.3 + i * TWO_PI_SK / 3;
                var cx2 = Math.cos(a) * r * 0.3, cy2 = Math.sin(a) * r * 0.3;
                var sg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r * 0.5);
                sg.addColorStop(0, nColors[i]); sg.addColorStop(1, 'transparent');
                ctx.globalAlpha = 0.3; ctx.fillStyle = sg;
                ctx.beginPath(); ctx.arc(cx2, cy2, r * 0.5, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        ctx.fillStyle = '#fff';
        for (var j = 0; j < 8; j++) {
            var sa = j * 1.7 + t * 0.5;
            var sd = r * (0.3 + (j % 3) * 0.2);
            ctx.globalAlpha = 0.5 + Math.sin(t * 3 + j) * 0.3;
            ctx.beginPath(); ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, 1, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _proj_nebula(ctx, x, y, r, angle) {
        // 星云漩涡 — 多色气态旋臂+内核脉冲星+环绕星尘
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 4条旋臂
        const armColors = ['#aa44ff', '#ff44aa', '#4488ff', '#44ffaa'];
        for (let i = 0; i < 4; i++) {
            const baseA = t * 6 + i * TWO_PI_SK / 4;
            ctx.save(); ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let s = 0; s <= 12; s++) {
                const frac = s / 12;
                const spiralA = baseA + frac * Math.PI * 1.5;
                const spiralR = frac * r * 1.3;
                const sx = Math.cos(spiralA) * spiralR;
                const sy = Math.sin(spiralA) * spiralR;
                s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
            }
            ctx.strokeStyle = armColors[i]; ctx.lineWidth = r * 0.12 * (1 - 0.3 * Math.sin(t * 3 + i));
            ctx.lineCap = 'round'; ctx.stroke();
            ctx.restore();
        }
        // 外环涟漪
        ctx.globalAlpha = 0.25 + Math.sin(t * 4) * 0.1;
        const hue = (t * 60) % 360;
        ctx.strokeStyle = `hsl(${hue}, 80%, 70%)`; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.2, 0, TWO_PI_SK); ctx.stroke();
        // 核心脉冲星
        ctx.globalAlpha = 1;
        const pulse = 0.25 + Math.sin(t * 8) * 0.1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * pulse);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.3, '#ddaaff'); cg.addColorStop(0.7, '#6622cc'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * pulse, 0, TWO_PI_SK); ctx.fill();
        // 八芒星射线
        ctx.save(); ctx.rotate(t * 12); ctx.globalAlpha = 0.5;
        for (let i = 0; i < 8; i++) {
            const ra = (i / 8) * TWO_PI_SK;
            const rg = ctx.createLinearGradient(0, 0, Math.cos(ra) * r * 1.4, Math.sin(ra) * r * 1.4);
            rg.addColorStop(0, '#fff'); rg.addColorStop(0.3, `hsl(${(hue + i * 45) % 360}, 85%, 70%)`); rg.addColorStop(1, 'transparent');
            ctx.strokeStyle = rg; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ra) * r * 1.4, Math.sin(ra) * r * 1.4); ctx.stroke();
        }
        ctx.restore();
        // 星尘粒子
        ctx.globalAlpha = 0.6; ctx.fillStyle = '#fff';
        for (let i = 0; i < 12; i++) {
            const pa = t * 5 + i * 0.52;
            const pd = r * (0.5 + Math.sin(t * 2 + i * 2.1) * 0.5);
            const ps = 1 + Math.sin(t * 4 + i) * 0.5;
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, ps, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.0, '#aa44ff', 0.35);
    }

    // 黑洞 - 事件视界+吸积盘+引力透镜
    _body_blackhole(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        ctx.save(); ctx.translate(x, y);
        // Accretion disk glow
        if (this.quality.glowEnabled) {
            var glowR = r * 1.8;
            var gg = ctx.createRadialGradient(0, 0, r * 0.9, 0, 0, glowR);
            gg.addColorStop(0, '#ff8800'); gg.addColorStop(0.3, '#ff4400');
            gg.addColorStop(0.6, '#aa2200'); gg.addColorStop(1, 'transparent');
            ctx.fillStyle = gg; ctx.globalAlpha = 0.4;
            ctx.beginPath(); ctx.arc(0, 0, glowR, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        }
        // Accretion disk ring - elliptical perspective
        ctx.save();
        ctx.rotate(t * 0.3);
        ctx.scale(1, 0.4);
        for (var i = 0; i < 3; i++) {
            var diskR = r * (1.2 + i * 0.15);
            ctx.globalAlpha = 0.7 - i * 0.2;
            ctx.strokeStyle = i === 0 ? '#ffcc44' : (i === 1 ? '#ff8800' : '#ff4400');
            ctx.lineWidth = r * 0.15 - i * 2;
            ctx.beginPath(); ctx.arc(0, 0, diskR, 0, TWO_PI_SK); ctx.stroke();
        }
        ctx.globalAlpha = 0.8; ctx.fillStyle = '#ffffff';
        for (var j = 0; j < 4; j++) {
            var pa = t * 2 + j * TWO_PI_SK / 4;
            ctx.beginPath(); ctx.arc(Math.cos(pa) * r * 1.2, Math.sin(pa) * r * 1.2, 1.5, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        // Pure black core
        ctx.globalAlpha = 1;
        var bg = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        bg.addColorStop(0, '#000000'); bg.addColorStop(0.7, '#000000');
        bg.addColorStop(0.85, '#110000'); bg.addColorStop(1, '#220000');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        // Event horizon edge glow
        ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _proj_blackhole(ctx, x, y, r, angle) {
        // 奇点坍缩 — 引力透镜扭曲+吸积盘旋转+时空撕裂线
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层吸积盘(多色旋转椭圆)
        for (let i = 0; i < 3; i++) {
            ctx.save(); ctx.rotate(t * (5 + i * 2) + i * 0.7);
            ctx.globalAlpha = 0.35 - i * 0.05;
            const diskColors = ['#ff8800', '#ffcc00', '#ff4400'];
            ctx.strokeStyle = diskColors[i]; ctx.lineWidth = r * (0.1 - i * 0.02);
            ctx.beginPath(); ctx.ellipse(0, 0, r * (1.4 - i * 0.15), r * (0.45 - i * 0.08), 0, 0, TWO_PI_SK); ctx.stroke();
            ctx.restore();
        }
        // 引力透镜弧线(扭曲光线)
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 6; i++) {
            const la = t * 4 + i * TWO_PI_SK / 6;
            ctx.strokeStyle = i % 2 ? '#ffaa44' : '#ff6600'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            const startA = la; const endA = la + Math.PI * 0.4;
            ctx.arc(0, 0, r * (1.0 + Math.sin(t * 3 + i) * 0.15), startA, endA); ctx.stroke();
        }
        // 事件视界(纯黑核心)
        ctx.globalAlpha = 1;
        const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.6);
        eg.addColorStop(0, '#000'); eg.addColorStop(0.7, '#000'); eg.addColorStop(0.85, '#220044'); eg.addColorStop(1, 'transparent');
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, TWO_PI_SK); ctx.fill();
        // 霍金辐射环
        ctx.globalAlpha = 0.6 + Math.sin(t * 7) * 0.2;
        ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, TWO_PI_SK); ctx.stroke();
        // 碎片粒子被吸入
        ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.5;
        for (let i = 0; i < 10; i++) {
            const pa = t * 9 + i * 0.63;
            const pd = r * (0.7 + Math.sin(t * 6 + i * 1.5) * 0.4);
            const ps = 1.5 * (1 - Math.sin(t * 6 + i * 1.5) * 0.5);
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, ps, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.7, '#ff6600', 0.3);
    }

    // 凤凰 - 火焰鸟形+展翼+羽翼 (enhanced with feather detail, crest, and ember particles)
    _body_phoenix(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        // Corona rays
        if (this.quality.detailLevel >= 1) {
            ctx.save(); ctx.translate(x, y);
            var rayCount = 12;
            ctx.globalAlpha = 0.35;
            for (var i = 0; i < rayCount; i++) {
                var ra = i * TWO_PI_SK / rayCount + t * 0.5;
                var rayLen = r * (0.4 + Math.sin(t * 3 + i * 2) * 0.15);
                ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = r * 0.12;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(Math.cos(ra) * r * 0.9, Math.sin(ra) * r * 0.9);
                ctx.lineTo(Math.cos(ra) * (r + rayLen), Math.sin(ra) * (r + rayLen));
                ctx.stroke();
            }
            ctx.globalAlpha = 1; ctx.restore();
        }
        this._glow(ctx, x, y, r, '#ff8800', 0.25);
        ctx.save(); ctx.translate(x, y);
        // Sun body
        var sg = ctx.createRadialGradient(-r * 0.15, -r * 0.15, 0, 0, 0, r);
        sg.addColorStop(0, '#ffffff'); sg.addColorStop(0.15, '#ffee66');
        sg.addColorStop(0.4, '#ffaa00'); sg.addColorStop(0.7, '#ff6600');
        sg.addColorStop(1, '#cc3300');
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        // Sunspots
        if (this.quality.detailLevel >= 1) {
            ctx.fillStyle = '#cc4400'; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(r * 0.2, r * 0.1, r * 0.12, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.arc(-r * 0.3, r * 0.25, r * 0.08, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        }
        // Highlight
        ctx.globalAlpha = 0.6; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(-r * 0.25, -r * 0.3, r * 0.1, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    _proj_phoenix(ctx, x, y, r, angle) {
        // 涅槃之焰 — 火凤旋翼+金色羽翼散射+烈焰尾迹
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        // 外层火焰旋翼(3对翼)
        for (let i = 0; i < 6; i++) {
            const wa = t * 8 + i * TWO_PI_SK / 6;
            const wd = r * (0.5 + Math.sin(t * 3 + i * 1.1) * 0.15);
            ctx.save(); ctx.translate(Math.cos(wa) * wd, Math.sin(wa) * wd); ctx.rotate(wa + t * 4 + Math.PI / 2);
            ctx.globalAlpha = 0.5;
            const wg = ctx.createLinearGradient(0, -r * 0.7, 0, r * 0.2);
            wg.addColorStop(0, 'transparent'); wg.addColorStop(0.2, '#ffee88'); wg.addColorStop(0.5, '#ffaa00'); wg.addColorStop(0.8, '#ff4400'); wg.addColorStop(1, 'transparent');
            ctx.fillStyle = wg;
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.7); ctx.quadraticCurveTo(-r * 0.12, -r * 0.3, 0, r * 0.2);
            ctx.quadraticCurveTo(r * 0.12, -r * 0.3, 0, -r * 0.7); ctx.fill();
            ctx.restore();
        }
        // 金色能量环
        ctx.globalAlpha = 0.4 + Math.sin(t * 6) * 0.2;
        ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = r * 0.05;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, TWO_PI_SK); ctx.stroke();
        ctx.strokeStyle = '#ff6600'; ctx.lineWidth = r * 0.03;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.3, t * 9, t * 9 + Math.PI * 0.8); ctx.stroke();
        // 核心烈焰球
        ctx.globalAlpha = 1;
        const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.55);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.15, '#ffee88'); cg.addColorStop(0.4, '#ffaa00'); cg.addColorStop(0.7, '#ff4400'); cg.addColorStop(1, '#cc1100');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.55, 0, TWO_PI_SK); ctx.fill();
        // 散射羽翼粒子
        ctx.globalAlpha = 0.55;
        for (let i = 0; i < 10; i++) {
            const pa = t * 7 + i * 0.63;
            const pd = r * (0.6 + Math.sin(t * 4 + i * 1.4) * 0.5);
            const hue = 30 + (i * 8) % 30;
            ctx.fillStyle = `hsl(${hue}, 100%, ${60 + Math.sin(t * 3 + i) * 15}%)`;
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 2, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 1.0, '#ff6600', 0.35);
    }

    // ============================================
    // 皮肤武器外观 — 每个皮肤独特武器造型
    // ctx 已经 translate+rotate 到武器位置
    // ============================================

    // 西瓜 — 绿色瓜皮刀
    _weapon_watermelon(ctx, weaponType, attacking) {
        const glow = attacking ? 0.5 : 0.2;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            ctx.globalAlpha = glow; ctx.fillStyle = '#2a8c3a';
            ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
            ctx.fillStyle = '#1e7a30';
            ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(6, -3.5); ctx.lineTo(0, -2); ctx.lineTo(0, 2); ctx.lineTo(6, 3.5); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ff2233'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(14, 0, 3, 0, TWO_PI_SK); ctx.fill(); ctx.globalAlpha = 1;
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.ellipse(12, -1.5, 1, 2, 0.3, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.ellipse(16, 1, 1, 2, -0.2, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#553311'; ctx.fillRect(-6, -2, 6, 4);
        } else if (weaponType === 'fireball') {
            // 西瓜法杖 — 西瓜球顶杖
            ctx.fillStyle = '#553311'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#1e7a30';
            ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_SK); ctx.fill();
            // 瓜纹
            ctx.strokeStyle = '#145520'; ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) { const a = (i / 4) * Math.PI; ctx.beginPath(); ctx.arc(18, 0, 7, a, a + 0.3); ctx.stroke(); }
            ctx.fillStyle = '#ff2233'; ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_SK); ctx.fill();
        } else if (weaponType === 'bow') {
            // 西瓜藤弓
            ctx.strokeStyle = '#1e7a30'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
            ctx.strokeStyle = '#553311'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
            ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#1e7a30'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ff2233'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 西瓜灯笼
            ctx.fillStyle = '#553311'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#1e7a30'; ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#ff2233'; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(16, 0, 3, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.ellipse(15, -1, 1, 1.5, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.ellipse(17, 1, 1, 1.5, 0, 0, TWO_PI_SK); ctx.fill();
        }
    }

    // 草莓 — 粉色爱心杖
    _weapon_strawberry(ctx, weaponType, attacking) {
        const glow = attacking ? 0.5 : 0.2;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            ctx.globalAlpha = glow; ctx.fillStyle = '#ff6699';
            ctx.fillRect(-2, -3, 26, 6); ctx.globalAlpha = 1;
            ctx.fillStyle = '#ff3366';
            ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(6, -3); ctx.lineTo(0, 0); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffccdd'; ctx.beginPath(); ctx.arc(16, -1, 2, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#ff88aa'; ctx.fillRect(-5, -2, 5, 4);
        } else if (weaponType === 'fireball') {
            // 爱心法杖
            ctx.fillStyle = '#88443a'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#ff3366'; ctx.globalAlpha = attacking ? 0.8 : 0.5;
            ctx.beginPath(); ctx.arc(18, -2, 4, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.arc(22, -2, 4, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.moveTo(14, -2); ctx.lineTo(20, 6); ctx.lineTo(26, -2); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (weaponType === 'bow') {
            // 草莓弓 — 弯曲的草莓藤弓
            ctx.strokeStyle = '#ff3366'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 12, -0.9, 0.9); ctx.stroke();
            ctx.strokeStyle = '#ff88aa'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.9) * 12, Math.sin(-0.9) * 12);
            ctx.lineTo(8 + Math.cos(0.9) * 12, Math.sin(0.9) * 12); ctx.stroke();
            // 草莓装饰
            ctx.fillStyle = '#ff3366'; ctx.beginPath(); ctx.arc(8, -14, 3, 0, TWO_PI_SK); ctx.fill();
            if (attacking) { ctx.fillStyle = '#ff88aa'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ff3366'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 草莓骷髅杖
            ctx.fillStyle = '#88443a'; ctx.fillRect(-6, -1.5, 20, 3);
            ctx.fillStyle = '#ff3366'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(16, 0, 5, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffccdd';
            ctx.beginPath(); ctx.arc(16, -1, 2, 0, Math.PI, true); ctx.fill();
            ctx.beginPath(); ctx.arc(16, 1, 2, 0, Math.PI); ctx.fill();
        }
    }

    // 橙子 — 橙瓣飞旋刀
    _weapon_orange(ctx, weaponType, attacking) {
        const glow = attacking ? 0.5 : 0.2;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            ctx.globalAlpha = glow; ctx.fillStyle = '#ffaa33';
            ctx.fillRect(-2, -3, 24, 6); ctx.globalAlpha = 1;
            ctx.fillStyle = '#ff8800';
            ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(6, -3); ctx.lineTo(2, 0); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffcc66'; ctx.globalAlpha = 0.7;
            for (let i = 0; i < 3; i++) {
                ctx.beginPath(); ctx.ellipse(12 + i * 3, 0, 2, 3, 0, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1; ctx.fillStyle = '#885522'; ctx.fillRect(-5, -2, 5, 4);
        } else if (weaponType === 'fireball') {
            // 橙子法杖 — 旋转橙瓣杖头
            ctx.fillStyle = '#885522'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#ff8800';
            ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#ffcc66';
            for (let i = 0; i < 4; i++) {
                const a = i * Math.PI / 2 + this._time * 2;
                ctx.beginPath(); ctx.ellipse(18 + Math.cos(a) * 3, Math.sin(a) * 3, 1.5, 3, a, 0, TWO_PI_SK); ctx.fill();
            }
        } else if (weaponType === 'bow') {
            // 橙子弓 — 橙皮弯弓
            ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 弓弦
            ctx.strokeStyle = '#ffcc66'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            // 橙瓣装饰
            ctx.fillStyle = '#ffcc66'; ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.ellipse(8, -14, 2.5, 4, -0.3, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.ellipse(8, 14, 2.5, 4, 0.3, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            if (attacking) { ctx.fillStyle = '#ff8800'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ffcc66'; ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(28, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 橙皮灵灯
            ctx.fillStyle = '#885522'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#ff8800'; ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffcc66';
            for (let i = 0; i < 3; i++) {
                const a = i * TWO_PI_SK / 3 + this._time * 1.5;
                ctx.beginPath(); ctx.arc(16 + Math.cos(a) * 4, Math.sin(a) * 4, 1.5, 0, TWO_PI_SK); ctx.fill();
            }
        }
    }

    // 灵狐 — 蓝色鬼火爪
    _weapon_fox(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.7 : 0.3;
            ctx.globalAlpha = glow; ctx.fillStyle = '#88ccff';
            ctx.fillRect(0, -5, 22, 10); ctx.globalAlpha = 1;
            ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath(); ctx.moveTo(4, i * 3);
                ctx.quadraticCurveTo(14, i * 4 + Math.sin(t * 8 + i) * 2, 24, i * 2);
                ctx.stroke();
            }
        } else if (weaponType === 'fireball') {
            // 狐火法杖 — 悬浮蓝色鬼火球
            ctx.fillStyle = '#554433'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#88ccff'; ctx.globalAlpha = 0.4 + Math.sin(t * 4) * 0.2;
            ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ccddff';
            ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_SK); ctx.fill();
        } else if (weaponType === 'bow') {
            // 灵狐弓 — 幽蓝弧弓
            ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 12, -0.85, 0.85); ctx.stroke();
            // 弦
            ctx.strokeStyle = '#ccddff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 12, Math.sin(-0.85) * 12);
            ctx.lineTo(8 + Math.cos(0.85) * 12, Math.sin(0.85) * 12); ctx.stroke();
            // 狐火装饰
            ctx.fillStyle = '#88ccff'; ctx.globalAlpha = 0.5 + Math.sin(t * 5) * 0.2;
            ctx.beginPath(); ctx.arc(8, -13, 3, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.arc(8, 13, 3, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            if (attacking) { ctx.fillStyle = '#aaddff'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#88ccff'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 狐灵灯笼
            ctx.fillStyle = '#554433'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#88ccff'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.2;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 0.7; ctx.fillStyle = '#ccddff';
            // 小鬼火飘散
            for (let i = 0; i < 3; i++) {
                const a = i * TWO_PI_SK / 3 + t * 2;
                ctx.beginPath(); ctx.arc(16 + Math.cos(a) * 4, Math.sin(a) * 4, 1.5, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    // 幼龙 — 紫金龙牙剑
    _weapon_dragon(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.5 : 0.2;
            ctx.globalAlpha = glow; ctx.fillStyle = '#aa44ff';
            ctx.fillRect(-2, -4, 30, 8); ctx.globalAlpha = 1;
            ctx.fillStyle = '#9933cc';
            ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(20, -4); ctx.lineTo(5, -2); ctx.lineTo(0, 0);
            ctx.lineTo(5, 2); ctx.lineTo(20, 4); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffcc44';
            for (let i = 0; i < 4; i++) {
                ctx.beginPath(); ctx.moveTo(8 + i * 5, -3); ctx.lineTo(10 + i * 5, -5); ctx.lineTo(12 + i * 5, -3); ctx.fill();
            }
            ctx.fillStyle = '#553388'; ctx.fillRect(-6, -2.5, 7, 5);
            ctx.fillStyle = '#ffcc44'; ctx.fillRect(-1, -4.5, 3, 9);
        } else if (weaponType === 'fireball') {
            // 龙晶法杖 — 紫金晶球顶
            ctx.fillStyle = '#553388'; ctx.fillRect(-6, -2, 22, 4);
            ctx.fillStyle = '#aa44ff'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
            ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffcc44';
            ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_SK); ctx.fill();
            // 龙纹环
            ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(18, 0, 6, 6, t * 1.5, 0, TWO_PI_SK); ctx.stroke();
        } else if (weaponType === 'bow') {
            // 龙骨弓 — 紫金弧
            ctx.strokeStyle = '#9933cc'; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 金色龙牙装饰
            ctx.fillStyle = '#ffcc44';
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13); ctx.lineTo(8 + Math.cos(-0.85) * 13 + 2, Math.sin(-0.85) * 13 - 3); ctx.lineTo(8 + Math.cos(-0.85) * 13 + 4, Math.sin(-0.85) * 13); ctx.fill();
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.lineTo(8 + Math.cos(0.85) * 13 + 2, Math.sin(0.85) * 13 + 3); ctx.lineTo(8 + Math.cos(0.85) * 13 + 4, Math.sin(0.85) * 13); ctx.fill();
            ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#aa44ff'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ffcc44'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 龙魂召唤杖
            ctx.fillStyle = '#553388'; ctx.fillRect(-6, -1.5, 20, 3);
            ctx.fillStyle = '#aa44ff'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.15;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffcc44';
            // 龙眼
            ctx.beginPath(); ctx.ellipse(16, 0, 2, 3, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(16, 0, 1, 2, 0, 0, TWO_PI_SK); ctx.fill();
        }
    }

    // 暗影猫 — 绿色毒爪
    _weapon_cat(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.6 : 0.2;
            ctx.globalAlpha = glow; ctx.fillStyle = '#44ff88';
            ctx.fillRect(0, -4, 20, 8); ctx.globalAlpha = 1;
            ctx.strokeStyle = '#33dd66'; ctx.lineWidth = 3; ctx.lineCap = 'round';
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath(); ctx.moveTo(2, i * 3);
                ctx.quadraticCurveTo(12, i * 4.5, 22, i * 2 + Math.sin(t * 6) * 1.5);
                ctx.stroke();
            }
            ctx.fillStyle = '#66ffaa'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(20, Math.sin(t * 3) * 2, 2, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (weaponType === 'fireball') {
            // 毒液法杖 — 绿色毒球顶
            ctx.fillStyle = '#334433'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#44ff88'; ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#88ffcc';
            ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_SK); ctx.fill();
            // 毒气泡
            ctx.fillStyle = '#44ff88'; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(18 + Math.sin(t * 3) * 3, -5, 2, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.arc(18 - Math.sin(t * 2.5) * 2, -7, 1.5, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (weaponType === 'bow') {
            // 暗影弓 — 毒藤弓
            ctx.strokeStyle = '#33dd66'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 12, -0.85, 0.85); ctx.stroke();
            // 毒液弦
            ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 12, Math.sin(-0.85) * 12);
            ctx.lineTo(8 + Math.cos(0.85) * 12, Math.sin(0.85) * 12); ctx.stroke();
            // 毒液滴
            ctx.fillStyle = '#66ffaa'; ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(8, Math.sin(t * 4) * 8, 2, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            if (attacking) { ctx.fillStyle = '#33dd66'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#44ff88'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 暗影猫灵杖
            ctx.fillStyle = '#334433'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#44ff88'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.2;
            ctx.beginPath(); ctx.arc(16, 0, 5, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#88ffcc';
            // 猫眼
            ctx.beginPath(); ctx.ellipse(14, -1, 1.5, 2, -0.2, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.ellipse(18, -1, 1.5, 2, 0.2, 0, TWO_PI_SK); ctx.fill();
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.ellipse(14, -1, 0.7, 1.5, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.ellipse(18, -1, 0.7, 1.5, 0, 0, TWO_PI_SK); ctx.fill();
        }
    }

    // 钻石 — 彩虹棱形刃
    _weapon_diamond(ctx, weaponType, attacking) {
        const t = this._time;
        const hue = (t * 60) % 360;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.5 : 0.2;
            ctx.globalAlpha = glow; ctx.fillStyle = `hsl(${hue},80%,70%)`;
            ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
            ctx.fillStyle = `hsl(${hue},70%,85%)`;
            ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(16, -4); ctx.lineTo(4, -2); ctx.lineTo(4, 2); ctx.lineTo(16, 4); ctx.closePath(); ctx.fill();
            ctx.fillStyle = `hsl(${(hue + 60) % 360},70%,90%)`; ctx.globalAlpha = 0.7;
            ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(16, -2); ctx.lineTo(10, 0); ctx.lineTo(16, 2); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#aaa'; ctx.fillRect(-5, -2, 5, 4);
            ctx.fillStyle = `hsl(${(hue + 120) % 360},80%,60%)`; ctx.fillRect(-1, -4, 2.5, 8);
        } else if (weaponType === 'fireball') {
            // 钻石法杖 — 彩虹棱形顶
            ctx.fillStyle = '#888'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = `hsl(${hue},80%,70%)`; ctx.globalAlpha = attacking ? 0.7 : 0.4;
            ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(18, -5); ctx.lineTo(14, 0); ctx.lineTo(18, 5); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_SK); ctx.fill();
            // 折光线
            ctx.strokeStyle = `hsl(${(hue + 180) % 360},80%,80%)`; ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(14, -3); ctx.lineTo(22, 3); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(14, 3); ctx.lineTo(22, -3); ctx.stroke();
        } else if (weaponType === 'bow') {
            // 钻石弓 — 彩虹弧
            ctx.strokeStyle = `hsl(${hue},70%,70%)`; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 棱面反光
            ctx.strokeStyle = `hsl(${(hue + 120) % 360},80%,85%)`; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(8, 0, 11, -0.5, 0.5); ctx.stroke();
            ctx.strokeStyle = '#ccc'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = `hsl(${hue},80%,70%)`; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 钻石灵球杖
            ctx.fillStyle = '#888'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = `hsl(${hue},80%,70%)`; ctx.globalAlpha = 0.4;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
            // 内部切面菱形
            ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(19, 0); ctx.lineTo(16, 4); ctx.lineTo(13, 0); ctx.closePath(); ctx.fill();
            ctx.strokeStyle = `hsl(${(hue + 90) % 360},60%,60%)`; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(19, 0); ctx.lineTo(16, 4); ctx.lineTo(13, 0); ctx.closePath(); ctx.stroke();
        }
    }

    // 红宝石 — 烈焰之刃
    _weapon_ruby(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.6 : 0.25;
            ctx.globalAlpha = glow; ctx.fillStyle = '#ff3322';
            ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
            ctx.fillStyle = '#cc2211';
            ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(6, -3); ctx.lineTo(0, 0); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ff6644'; ctx.globalAlpha = 0.6 + Math.sin(t * 6) * 0.2;
            ctx.beginPath(); ctx.moveTo(10, -2); ctx.quadraticCurveTo(16, -4, 22, 0);
            ctx.quadraticCurveTo(16, 4, 10, 2); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#661100'; ctx.fillRect(-6, -2, 6, 4);
            ctx.fillStyle = '#ff4422'; ctx.fillRect(-1, -4, 2.5, 8);
        } else if (weaponType === 'fireball') {
            // 红宝石法杖 — 烈焰球顶
            ctx.fillStyle = '#661100'; ctx.fillRect(-6, -2, 22, 4);
            ctx.fillStyle = '#ff3322'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
            ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffaa88';
            ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_SK); ctx.fill();
            // 火焰纹理
            ctx.fillStyle = '#ff6644'; ctx.globalAlpha = 0.5 + Math.sin(t * 5) * 0.2;
            ctx.beginPath(); ctx.moveTo(14, 0); ctx.quadraticCurveTo(16, -5, 18, -3); ctx.quadraticCurveTo(20, -6, 22, 0); ctx.fill();
            ctx.globalAlpha = 1;
        } else if (weaponType === 'bow') {
            // 红宝石弓 — 熔岩弓
            ctx.strokeStyle = '#cc2211'; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 弓臂火焰
            ctx.strokeStyle = '#ff6644'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.2;
            ctx.beginPath(); ctx.arc(8, 0, 11, -0.6, 0.6); ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ff8866'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#ff3322'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ffaa44'; ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(29, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 红宝石灵焰杖
            ctx.fillStyle = '#661100'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#ff3322'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.15;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#ffaa88';
            // 骷髅火焰
            ctx.beginPath(); ctx.arc(16, -2, 2.5, 0, Math.PI, true); ctx.fill();
            ctx.fillRect(14, -2, 4, 3);
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.arc(15, -1, 0.8, 0, TWO_PI_SK); ctx.fill();
            ctx.beginPath(); ctx.arc(17, -1, 0.8, 0, TWO_PI_SK); ctx.fill();
        }
    }

    // 翡翠 — 荆棘藤杖
    _weapon_emerald(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.5 : 0.2;
            ctx.globalAlpha = glow; ctx.fillStyle = '#22cc66';
            ctx.fillRect(-2, -3, 26, 6); ctx.globalAlpha = 1;
            ctx.fillStyle = '#118844';
            ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(6, -2.5); ctx.lineTo(0, 0); ctx.lineTo(6, 2.5); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#66ff99';
            for (let i = 0; i < 5; i++) {
                const px = 6 + i * 4, py = (i % 2 === 0 ? -3.5 : 3.5);
                ctx.beginPath(); ctx.moveTo(px, py * 0.5); ctx.lineTo(px + 1, py); ctx.lineTo(px + 2, py * 0.5); ctx.fill();
            }
            ctx.fillStyle = '#2a5533'; ctx.fillRect(-5, -2, 5, 4);
        } else if (weaponType === 'fireball') {
            // 翡翠法杖 — 缠绕藤蔓顶
            ctx.fillStyle = '#2a5533'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.strokeStyle = '#22cc66'; ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const px = -4 + i * 2.5, py = Math.sin(t * 3 + i * 0.8) * 2;
                if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
            ctx.fillStyle = '#44ff88'; ctx.beginPath(); ctx.arc(18, 0, 5, 0, TWO_PI_SK); ctx.fill();
        } else if (weaponType === 'bow') {
            // 翡翠弓 — 荆棘长弓
            ctx.strokeStyle = '#118844'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.9, 0.9); ctx.stroke();
            // 荆棘
            ctx.fillStyle = '#66ff99';
            for (let i = 0; i < 5; i++) {
                const angle = -0.9 + i * 0.36;
                const bx = 8 + Math.cos(angle) * 13, by = Math.sin(angle) * 13;
                ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(angle) * 3, by + Math.sin(angle) * 3); ctx.lineTo(bx + 2, by); ctx.fill();
            }
            ctx.strokeStyle = '#22cc66'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.9) * 13, Math.sin(-0.9) * 13);
            ctx.lineTo(8 + Math.cos(0.9) * 13, Math.sin(0.9) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#22cc66'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#66ff99'; ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 翡翠灵杖
            ctx.fillStyle = '#2a5533'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#22cc66'; ctx.globalAlpha = 0.4 + Math.sin(t * 2.5) * 0.2;
            ctx.beginPath(); ctx.arc(16, 0, 5, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            // 缠绕的灵魂藤蔓
            ctx.strokeStyle = '#44ff88'; ctx.lineWidth = 1.5;
            for (let i = 0; i < 3; i++) {
                const a = i * TWO_PI_SK / 3 + t * 2;
                ctx.beginPath(); ctx.arc(16 + Math.cos(a) * 3.5, Math.sin(a) * 3.5, 1.5, 0, TWO_PI_SK); ctx.stroke();
            }
        }
    }

    // 星云 — 星光权杖
    _weapon_nebula(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.5 : 0.2;
            ctx.globalAlpha = glow; ctx.fillStyle = '#8844ff';
            ctx.fillRect(-2, -3, 26, 6); ctx.globalAlpha = 1;
            ctx.fillStyle = '#6633cc';
            ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(6, -3); ctx.lineTo(0, 0); ctx.lineTo(6, 3); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 4; i++) {
                const sx = 8 + i * 4 + Math.sin(t * 3 + i) * 1.5;
                const sy = Math.cos(t * 4 + i * 2) * 2;
                ctx.beginPath(); ctx.arc(sx, sy, 1, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.fillStyle = '#332255'; ctx.fillRect(-5, -2, 5, 4);
        } else if (weaponType === 'fireball') {
            // 星云法杖 — 四芒星顶
            ctx.fillStyle = '#332255'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#8844ff'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.2;
            ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.moveTo(18, -4); ctx.lineTo(19, 0); ctx.lineTo(18, 4); ctx.lineTo(17, 0); ctx.closePath(); ctx.fill();
            ctx.beginPath(); ctx.moveTo(14, 0); ctx.lineTo(18, -1); ctx.lineTo(22, 0); ctx.lineTo(18, 1); ctx.closePath(); ctx.fill();
        } else if (weaponType === 'bow') {
            // 星云弓 — 星轨弧弓
            ctx.strokeStyle = '#6633cc'; ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 星光点缀
            ctx.fillStyle = '#fff';
            for (let i = 0; i < 4; i++) {
                const angle = -0.85 + i * 0.425;
                const sx = 8 + Math.cos(angle) * 13, sy = Math.sin(angle) * 13;
                ctx.beginPath(); ctx.arc(sx + Math.sin(t * 3 + i) * 1, sy, 1, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.strokeStyle = '#aa88ff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#8844ff'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(26, 0, 2, 0, TWO_PI_SK); ctx.fill(); }
        } else {
            // necro: 星云亡灵杖
            ctx.fillStyle = '#332255'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#8844ff'; ctx.globalAlpha = 0.4 + Math.sin(t * 2) * 0.2;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
            // 小星云粒子
            for (let i = 0; i < 5; i++) {
                const a = i * TWO_PI_SK / 5 + t * 1.5;
                ctx.beginPath(); ctx.arc(16 + Math.cos(a) * 4, Math.sin(a) * 4, 0.8, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.fillStyle = '#aa88ff'; ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(16, 0, 2, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    // 黑洞 — 引力锤
    _weapon_blackhole(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            ctx.fillStyle = '#333'; ctx.fillRect(-4, -2, 20, 4);
            const glow = attacking ? 0.6 : 0.3;
            ctx.globalAlpha = glow; ctx.fillStyle = '#6600cc';
            ctx.beginPath(); ctx.arc(18, 0, 10, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.arc(18, 0, 5, 0, TWO_PI_SK); ctx.fill();
            ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(18, 0, 8, 3, t * 2, 0, TWO_PI_SK); ctx.stroke();
        } else if (weaponType === 'fireball') {
            // 黑洞法杖 — 奇点球
            ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 22, 3);
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(18, 0, 8, 3, t * 2, 0, TWO_PI_SK); ctx.stroke();
            ctx.fillStyle = '#6600cc'; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(18, 0, 9, 0, TWO_PI_SK); ctx.fill(); ctx.globalAlpha = 1;
        } else if (weaponType === 'bow') {
            // 黑洞弓 — 引力弧弓
            ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.85, 0.85); ctx.stroke();
            // 吸积环装饰
            ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.ellipse(8, 0, 13, 5, t * 1.5, -0.85, 0.85); ctx.stroke();
            // 弦
            ctx.strokeStyle = '#6600cc'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.85) * 13, Math.sin(-0.85) * 13);
            ctx.lineTo(8 + Math.cos(0.85) * 13, Math.sin(0.85) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#111'; ctx.fillRect(8, -1.5, 16, 3); ctx.fillStyle = '#6600cc'; ctx.beginPath(); ctx.arc(26, 0, 3, 0, TWO_PI_SK); ctx.fill(); ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(26, 0, 1.5, 0, TWO_PI_SK); ctx.fill(); }
        } else {
            // necro: 黑洞灵核杖
            ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 18, 3);
            ctx.fillStyle = '#111';
            ctx.beginPath(); ctx.arc(16, 0, 5, 0, TWO_PI_SK); ctx.fill();
            ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.ellipse(16, 0, 7, 3, t * 2, 0, TWO_PI_SK); ctx.stroke();
            // 灵魂被吸入
            ctx.fillStyle = '#aa66ff'; ctx.globalAlpha = 0.4;
            for (let i = 0; i < 4; i++) {
                const a = i * TWO_PI_SK / 4 + t * 3;
                const r = 5 - Math.sin(t * 2 + i) * 2;
                ctx.beginPath(); ctx.arc(16 + Math.cos(a) * r, Math.sin(a) * r, 1, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    // 凤凰 — 烈焰翼刃
    _weapon_phoenix(ctx, weaponType, attacking) {
        const t = this._time;
        if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
            const glow = attacking ? 0.6 : 0.25;
            ctx.globalAlpha = glow; ctx.fillStyle = '#ff6600';
            ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
            const g = ctx.createLinearGradient(0, 0, 26, 0);
            g.addColorStop(0, '#ffcc00'); g.addColorStop(0.5, '#ff6600'); g.addColorStop(1, '#cc2200');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(18, -4); ctx.lineTo(4, -2); ctx.lineTo(4, 2); ctx.lineTo(18, 4); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.6 + Math.sin(t * 8) * 0.2;
            ctx.beginPath(); ctx.moveTo(20, -3); ctx.quadraticCurveTo(24, -6, 26, -2); ctx.lineTo(22, -2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(20, 3); ctx.quadraticCurveTo(24, 6, 26, 2); ctx.lineTo(22, 2); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#553300'; ctx.fillRect(-6, -2, 6, 4);
        } else if (weaponType === 'fireball') {
            // 凤凰法杖 — 涅槃火球
            ctx.fillStyle = '#553300'; ctx.fillRect(-6, -2, 22, 4);
            const g = ctx.createRadialGradient(18, 0, 0, 18, 0, 8);
            g.addColorStop(0, '#ffee88'); g.addColorStop(0.5, '#ff6600'); g.addColorStop(1, '#cc2200');
            ctx.fillStyle = g; ctx.globalAlpha = attacking ? 0.8 : 0.5;
            ctx.beginPath(); ctx.arc(18, 0, 8, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_SK); ctx.fill();
        } else if (weaponType === 'bow') {
            // 凤凰弓 — 火翼弓
            const gBow = ctx.createLinearGradient(8, -13, 8, 13);
            gBow.addColorStop(0, '#ffcc00'); gBow.addColorStop(0.5, '#ff6600'); gBow.addColorStop(1, '#cc2200');
            ctx.strokeStyle = gBow; ctx.lineWidth = 3.5;
            ctx.beginPath(); ctx.arc(8, 0, 13, -0.9, 0.9); ctx.stroke();
            // 火羽翼尖
            ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.6 + Math.sin(t * 6) * 0.2;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.9) * 13, Math.sin(-0.9) * 13); ctx.quadraticCurveTo(4, -16, 8, -18); ctx.lineTo(8 + Math.cos(-0.9) * 13 + 2, Math.sin(-0.9) * 13); ctx.fill();
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(0.9) * 13, Math.sin(0.9) * 13); ctx.quadraticCurveTo(4, 16, 8, 18); ctx.lineTo(8 + Math.cos(0.9) * 13 + 2, Math.sin(0.9) * 13); ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.9) * 13, Math.sin(-0.9) * 13);
            ctx.lineTo(8 + Math.cos(0.9) * 13, Math.sin(0.9) * 13); ctx.stroke();
            if (attacking) { ctx.fillStyle = '#ff6600'; ctx.fillRect(8, -1, 16, 2); ctx.fillStyle = '#ffcc00'; ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(29, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill(); }
        } else {
            // necro: 凤凰灵焰杖
            ctx.fillStyle = '#553300'; ctx.fillRect(-6, -1.5, 18, 3);
            const gN = ctx.createRadialGradient(16, 0, 0, 16, 0, 6);
            gN.addColorStop(0, '#ffee88'); gN.addColorStop(0.5, '#ff6600'); gN.addColorStop(1, '#cc2200');
            ctx.fillStyle = gN; ctx.globalAlpha = 0.5 + Math.sin(t * 3) * 0.2;
            ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_SK); ctx.fill();
            ctx.globalAlpha = 1;
            // 灵魂凤凰微型
            ctx.fillStyle = '#ffaa00'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(16, -3); ctx.quadraticCurveTo(19, -5, 20, -2); ctx.lineTo(16, 0); ctx.fill();
            ctx.beginPath(); ctx.moveTo(16, 3); ctx.quadraticCurveTo(19, 5, 20, 2); ctx.lineTo(16, 0); ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
}

// ============================================
// 皮肤特效系统 V3 - 极致视觉冲击力
// 粒子数翻倍、多层次组合特效、屏幕震动+闪光
// ============================================
class SkinFxSystem {
    constructor(particles, qualityCfg) {
        this.particles = particles;
        this.quality = qualityCfg || QualityLevels.high;
        this._time = 0;
    }
    setQuality(q) { this.quality = q; }
    update(dt) { this._time += dt; }

    // 命中特效 - 根据皮肤ID分发
    onHit(x, y, skin) {
        if (!skin || this.quality.particleMult <= 0) return;
        const fn = this['_hit_' + skin.id];
        if (fn) { fn.call(this, x, y); return; }
        // 通用fallback(增强)
        this.particles.emit(x, y, Math.floor(14 * this.quality.particleMult), {
            colors: ['#fff', '#ffcc00', '#ffee88'], speedMin: 3, speedMax: 9,
            sizeMin: 2, sizeMax: 6, lifeMin: 0.2, lifeMax: 0.6, friction: 0.9,
            glow: true, glowSize: 12,
        });
        this.particles.addFlash(x, y, '#fff', 20, 0.08);
    }

    // 技能(升级)特效
    onSkillCast(x, y, skin) {
        if (!skin || this.quality.particleMult <= 0) return;
        const fn = this['_skill_' + skin.id];
        if (fn) { fn.call(this, x, y); return; }
        // 通用fallback(增强)
        this.particles.emit(x, y, Math.floor(35 * this.quality.particleMult), {
            colors: ['#fff', '#88ddff', '#44aaff'], speedMin: 4, speedMax: 12,
            sizeMin: 3, sizeMax: 10, lifeMin: 0.5, lifeMax: 1.2, friction: 0.94,
            glow: true, glowSize: 16,
        });
        this.particles.addShockwave(x, y, '#88ddff', 100, 0.5);
        this.particles.triggerScreenFlash('#88ddff', 0.15, 0.12);
        // Utils.shake(5);
    }

    // 移动拖尾
    emitMoveTrail(x, y, skin) {
        if (!skin || this.quality.particleMult <= 0) return;
        const fn = this['_trail_' + skin.id];
        if (fn) { fn.call(this, x, y); return; }
        this.particles.addTrail(x, y, '#aaa', 3, 0.3);
    }

    // 光环(增强: 脉冲呼吸+多层)
    renderAura(ctx, x, y, radius, skin) {
        if (!skin || this.quality.detailLevel < 1) return;
        const fn = this['_aura_' + skin.id];
        if (fn) { fn.call(this, ctx, x, y, radius); return; }
    }

    // ===== 水果系列特效 =====

    // 西瓜 - 命中：瓜汁四溅+瓜籽弹射
    _hit_watermelon(x, y) {
        const n = Math.floor(18 * this.quality.particleMult);
        // 瓜汁
        this.particles.emit(x, y, n, {
            colors: ['#ff2233', '#ff6666', '#1e7a30', '#fff'],
            speedMin: 4, speedMax: 12, sizeMin: 3, sizeMax: 9,
            lifeMin: 0.3, lifeMax: 0.8, friction: 0.88,
            glow: this.quality.glowEnabled, glowSize: 12,
        });
        // 瓜籽
        this.particles.emit(x, y, Math.floor(4 * this.quality.particleMult), {
            colors: ['#111', '#222'], speedMin: 8, speedMax: 16,
            sizeMin: 1.5, sizeMax: 3, lifeMin: 0.3, lifeMax: 0.6, friction: 0.85,
            shape: 'diamond',
        });
        this.particles.addShockwave(x, y, '#33aa44', 50, 0.3);
        this.particles.addFlash(x, y, '#ff2233', 25, 0.1);
    }
    _skill_watermelon(x, y) {
        const n = Math.floor(50 * this.quality.particleMult);
        // 大爆裂 - 瓜瓤爆炸
        this.particles.emit(x, y, n, {
            colors: ['#ff2233', '#ff4455', '#1e7a30', '#ffcc00', '#fff'],
            speedMin: 6, speedMax: 18, sizeMin: 4, sizeMax: 14,
            lifeMin: 0.6, lifeMax: 1.4, friction: 0.93,
            glow: true, glowSize: 18,
        });
        // 环形扩散
        this.particles.emitRing(x, y, Math.floor(16 * this.quality.particleMult), 30, {
            colors: ['#ff2233', '#33aa44', '#fff'],
            speedMin: 3, speedMax: 8, sizeMin: 3, sizeMax: 7,
            lifeMin: 0.4, lifeMax: 0.8, glow: true, glowSize: 10,
        });
        this.particles.addShockwave(x, y, '#ff2233', 110, 0.55);
        setTimeout(() => this.particles.addShockwave(x, y, '#33aa44', 140, 0.65), 80);
        // 飞出大量瓜籽
        this.particles.emit(x, y, Math.floor(12 * this.quality.particleMult), {
            colors: ['#111', '#333'], speedMin: 10, speedMax: 20,
            sizeMin: 2, sizeMax: 4, lifeMin: 0.5, lifeMax: 1.0, friction: 0.86,
            shape: 'diamond',
        });
        this.particles.triggerScreenFlash('#ff2233', 0.2, 0.12);
        this.particles.addBeam(x, y, 200, 8, '#33aa44', 0.4);
        // Utils.shake(8);
    }
    _trail_watermelon(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#1e7a30', '#33aa44', '#66cc66'],
            speedMin: 0.3, speedMax: 1.5, sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.5,
            gravity: 0.3, shape: 'square', glow: this.quality.glowEnabled, glowSize: 4,
        });
    }
    _aura_watermelon(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 3) * 0.1;
        ctx.save(); ctx.globalAlpha = 0.12 * pulse;
        ctx.fillStyle = '#33aa44';
        ctx.beginPath(); ctx.arc(x, y, r * 1.7 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = '#ff2233';
        ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 草莓 - 命中：粉色花瓣+爱心爆发
    _hit_strawberry(x, y) {
        const n = Math.floor(16 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#ff4488', '#ff88aa', '#ffbbcc', '#fff'],
            speedMin: 3, speedMax: 9, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.4, lifeMax: 0.9, friction: 0.92, gravity: 0.3,
            shape: 'heart', glow: this.quality.glowEnabled, glowSize: 10,
        });
        // 粉色闪光
        this.particles.addFlash(x, y, '#ff88aa', 30, 0.1);
    }
    _skill_strawberry(x, y) {
        // 花瓣风暴+爱心爆发
        const n = Math.floor(50 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#ff4488', '#ff88aa', '#ffccdd', '#fff', '#ff66aa'],
            speedMin: 5, speedMax: 15, sizeMin: 4, sizeMax: 12,
            lifeMin: 0.8, lifeMax: 1.6, friction: 0.95, gravity: 0.15,
            shape: 'heart', glow: true, glowSize: 14,
        });
        // 螺旋花瓣
        this.particles.emitSpiral(x, y, Math.floor(20 * this.quality.particleMult), {
            colors: ['#ff4488', '#ffaacc', '#fff'], radius: 60,
            speedMin: 2, speedMax: 5, sizeMin: 3, sizeMax: 7,
            lifeMin: 0.6, lifeMax: 1.0, glow: true, glowSize: 8,
            shape: 'heart',
        });
        this.particles.addShockwave(x, y, '#ff88aa', 100, 0.55);
        this.particles.addShockwave(x, y, '#ffccdd', 70, 0.4);
        // 放射状花瓣圈
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * TWO_PI_SK;
            setTimeout(() => {
                this.particles.emit(x + Math.cos(a) * 50, y + Math.sin(a) * 50, 5, {
                    colors: ['#ff4488', '#ffaacc', '#fff'], speedMin: 1, speedMax: 4,
                    sizeMin: 4, sizeMax: 8, lifeMin: 0.5, lifeMax: 0.9,
                    shape: 'heart', gravity: 0.4, glow: true, glowSize: 6,
                });
            }, i * 30);
        }
        this.particles.triggerScreenFlash('#ff88aa', 0.15, 0.12);
        // Utils.shake(6);
    }
    _trail_strawberry(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#ff88aa', '#ffbbcc', '#ffddee'],
            speedMin: 0.3, speedMax: 1.5, sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.55,
            gravity: 0.4, shape: 'heart', glow: this.quality.glowEnabled, glowSize: 5,
        });
    }
    _aura_strawberry(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 4) * 0.08;
        ctx.save(); ctx.globalAlpha = 0.1 * pulse;
        ctx.fillStyle = '#ff88aa';
        ctx.beginPath(); ctx.arc(x, y, r * 1.7 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 橙子 - 命中：橙汁喷溅+酸爆
    _hit_orange(x, y) {
        this.particles.emit(x, y, Math.floor(16 * this.quality.particleMult), {
            colors: ['#ff9900', '#ffcc44', '#ffee88', '#fff'],
            speedMin: 4, speedMax: 11, sizeMin: 2, sizeMax: 7,
            lifeMin: 0.2, lifeMax: 0.6, friction: 0.86,
            glow: this.quality.glowEnabled, glowSize: 10,
        });
        this.particles.addShockwave(x, y, '#ffaa33', 45, 0.25);
        this.particles.addFlash(x, y, '#ffcc00', 22, 0.08);
    }
    _skill_orange(x, y) {
        const n = Math.floor(40 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#ff8800', '#ffcc00', '#ffee66', '#fff'],
            speedMin: 6, speedMax: 16, sizeMin: 3, sizeMax: 12,
            lifeMin: 0.5, lifeMax: 1.2, friction: 0.92,
            glow: true, glowSize: 14,
        });
        // 环形橙汁
        this.particles.emitRing(x, y, Math.floor(12 * this.quality.particleMult), 25, {
            colors: ['#ff9900', '#ffcc44'], speedMin: 4, speedMax: 9,
            sizeMin: 3, sizeMax: 6, lifeMin: 0.3, lifeMax: 0.7, glow: true, glowSize: 8,
        });
        this.particles.addShockwave(x, y, '#ff9900', 100, 0.5);
        this.particles.addShockwave(x, y, '#ffcc44', 70, 0.35);
        this.particles.triggerScreenFlash('#ffcc00', 0.12, 0.1);
        // Utils.shake(5);
    }
    _trail_orange(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(2 * this.quality.particleMult)), {
            colors: ['#ffaa33', '#ffcc66', '#ffee88'], speedMin: 0.3, speedMax: 1.2,
            sizeMin: 2, sizeMax: 5, lifeMin: 0.25, lifeMax: 0.45,
            glow: this.quality.glowEnabled, glowSize: 5,
        });
    }
    _aura_orange(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 3.5) * 0.08;
        ctx.save(); ctx.globalAlpha = 0.1 * pulse; ctx.fillStyle = '#ff9900';
        ctx.beginPath(); ctx.arc(x, y, r * 1.6 * pulse, 0, TWO_PI_SK); ctx.fill(); ctx.restore();
    }

    // ===== 动物系列特效 =====

    // 灵狐 - 命中：蓝色鬼火爆散+火星
    _hit_fox(x, y) {
        const n = Math.floor(14 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#88ddff', '#4488ff', '#aaeeff', '#fff'],
            speedMin: 3, speedMax: 9, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.3, lifeMax: 0.8, friction: 0.93,
            glow: true, glowSize: 14,
        });
        // 狐火分裂
        for (let i = 0; i < 4; i++) {
            const a = Math.random() * TWO_PI_SK;
            const d = 12 + Math.random() * 18;
            this.particles.emit(x + Math.cos(a) * d, y + Math.sin(a) * d, 3, {
                colors: ['#4488ff', '#88ddff'], speedMin: 0.5, speedMax: 3,
                sizeMin: 3, sizeMax: 6, lifeMin: 0.5, lifeMax: 1.0,
                glow: true, glowSize: 10,
            });
        }
        this.particles.addFlash(x, y, '#88ddff', 28, 0.1);
    }
    _skill_fox(x, y) {
        const n = Math.floor(40 * this.quality.particleMult);
        // 九尾狐火爆发
        this.particles.emit(x, y, n, {
            colors: ['#ff6622', '#ffaa44', '#88ddff', '#4488ff', '#fff'],
            speedMin: 5, speedMax: 14, sizeMin: 3, sizeMax: 10,
            lifeMin: 0.5, lifeMax: 1.3, friction: 0.93,
            glow: true, glowSize: 16,
        });
        // 九尾扩散(9方向)
        for (let i = 0; i < 9; i++) {
            const a = (i / 9) * TWO_PI_SK;
            this.particles.emit(x, y, 4, {
                colors: ['#88ddff', '#4488ff'], angle: a, spread: 0.15,
                speedMin: 8, speedMax: 14, sizeMin: 2, sizeMax: 5,
                lifeMin: 0.4, lifeMax: 0.8, glow: true, glowSize: 8, friction: 0.92,
            });
        }
        this.particles.addShockwave(x, y, '#ff6622', 90, 0.5);
        this.particles.addShockwave(x, y, '#88ddff', 120, 0.6);
        this.particles.triggerScreenFlash('#88ddff', 0.15, 0.1);
        // Utils.shake(7);
    }
    _trail_fox(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#ff6622', '#ff8844', '#ffcc66', '#88ddff'],
            speedMin: 0.4, speedMax: 2, sizeMin: 2, sizeMax: 6, lifeMin: 0.3, lifeMax: 0.55,
            glow: true, glowSize: 7,
        });
    }
    _aura_fox(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 4) * 0.12;
        ctx.save();
        ctx.globalAlpha = 0.12 * pulse; ctx.fillStyle = '#ff6622';
        ctx.beginPath(); ctx.arc(x, y, r * 1.6 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.06; ctx.fillStyle = '#88ddff';
        ctx.beginPath(); ctx.arc(x, y, r * 1.9, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 幼龙 - 命中：紫金火焰爆裂+龙息碎片
    _hit_dragon(x, y) {
        const n = Math.floor(18 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#7744dd', '#9966ff', '#ffcc00', '#ff4422', '#fff'],
            speedMin: 4, speedMax: 12, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.25, lifeMax: 0.7, friction: 0.88,
            glow: true, glowSize: 12,
        });
        // 龙鳞碎片
        this.particles.emit(x, y, Math.floor(5 * this.quality.particleMult), {
            colors: ['#ffcc00', '#aa8800'], speedMin: 5, speedMax: 12,
            sizeMin: 2, sizeMax: 4, lifeMin: 0.3, lifeMax: 0.6, friction: 0.85,
            shape: 'diamond', glow: true, glowSize: 6,
        });
        this.particles.addShockwave(x, y, '#7744dd', 55, 0.3);
        this.particles.addFlash(x, y, '#ffcc00', 25, 0.09);
    }
    _skill_dragon(x, y) {
        const n = Math.floor(55 * this.quality.particleMult);
        // 龙啸 - 紫金风暴
        this.particles.emit(x, y, n, {
            colors: ['#6644cc', '#9966ff', '#ffcc00', '#ff4422', '#fff'],
            speedMin: 6, speedMax: 18, sizeMin: 4, sizeMax: 14,
            lifeMin: 0.6, lifeMax: 1.5, friction: 0.93,
            glow: true, glowSize: 20,
        });
        // 螺旋龙息
        this.particles.emitSpiral(x, y, Math.floor(24 * this.quality.particleMult), {
            colors: ['#7744dd', '#ffcc00', '#fff'], radius: 70, arms: 4,
            speedMin: 3, speedMax: 7, sizeMin: 3, sizeMax: 7,
            lifeMin: 0.5, lifeMax: 1.0, glow: true, glowSize: 10,
            shape: 'diamond',
        });
        this.particles.addShockwave(x, y, '#6644cc', 120, 0.6);
        setTimeout(() => this.particles.addShockwave(x, y, '#ffcc00', 160, 0.75), 100);
        this.particles.addBeam(x, y, 250, 10, '#7744dd', 0.5);
        this.particles.triggerScreenFlash('#7744dd', 0.18, 0.14);
        // Utils.shake(10);
    }
    _trail_dragon(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#6644cc', '#9977ff', '#ccbbff'],
            speedMin: 0.4, speedMax: 1.5, sizeMin: 2, sizeMax: 6, lifeMin: 0.3, lifeMax: 0.55,
            glow: true, glowSize: 7, shape: 'diamond',
        });
    }
    _aura_dragon(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 3) * 0.1;
        ctx.save();
        ctx.globalAlpha = 0.14 * pulse; ctx.fillStyle = '#7744dd';
        ctx.beginPath(); ctx.arc(x, y, r * 1.8 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.07; ctx.fillStyle = '#ffcc00';
        ctx.beginPath(); ctx.arc(x, y, r * 1.4, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 暗影猫 - 命中：暗影爪痕撕裂+暗绿闪电
    _hit_cat(x, y) {
        const n = Math.floor(14 * this.quality.particleMult);
        // 爪痕(spark形状)
        this.particles.emit(x, y, n, {
            colors: ['#44ffaa', '#22cc77', '#1a1a2e', '#000'],
            speedMin: 5, speedMax: 12, sizeMin: 2, sizeMax: 6,
            lifeMin: 0.15, lifeMax: 0.5, friction: 0.85, shape: 'spark',
            glow: true, glowSize: 10,
        });
        // 闪电爪
        if (this.quality.detailLevel >= 2) {
            const a = Math.random() * TWO_PI_SK;
            this.particles.addLightning(x, y, x + Math.cos(a) * 40, y + Math.sin(a) * 40, '#44ffaa', 2, 0.15);
        }
        this.particles.addFlash(x, y, '#44ffaa', 22, 0.08);
    }
    _skill_cat(x, y) {
        const n = Math.floor(40 * this.quality.particleMult);
        // 暗影爆发
        this.particles.emit(x, y, n, {
            colors: ['#44ffaa', '#22cc77', '#1a1a2e', '#000', '#88ffcc'],
            speedMin: 5, speedMax: 15, sizeMin: 3, sizeMax: 9,
            lifeMin: 0.4, lifeMax: 1.1, friction: 0.91, shape: 'spark',
            glow: true, glowSize: 12,
        });
        // 多方向爪痕闪电
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_SK + Math.random() * 0.3;
            const d = 50 + Math.random() * 40;
            this.particles.addLightning(x, y, x + Math.cos(a) * d, y + Math.sin(a) * d, '#44ffaa', 2, 0.2);
        }
        this.particles.addShockwave(x, y, '#44ffaa', 90, 0.45);
        this.particles.addShockwave(x, y, '#1a1a2e', 60, 0.3);
        this.particles.triggerScreenFlash('#44ffaa', 0.12, 0.1);
        // Utils.shake(6);
    }
    _trail_cat(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(2 * this.quality.particleMult)), {
            colors: ['#1a1a2e', '#44ffaa', '#22cc77'],
            speedMin: 0.3, speedMax: 1.5, sizeMin: 2, sizeMax: 5, lifeMin: 0.2, lifeMax: 0.4, shape: 'spark',
            glow: this.quality.glowEnabled, glowSize: 5,
        });
    }
    _aura_cat(ctx, x, y, r) {
        const flicker = 0.8 + Math.random() * 0.4; // 闪烁效果
        ctx.save(); ctx.globalAlpha = 0.1 * flicker; ctx.fillStyle = '#44ffaa';
        ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.05; ctx.fillStyle = '#1a1a2e';
        ctx.beginPath(); ctx.arc(x, y, r * 2.0, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // ===== 宝石系列特效 =====

    // 钻石 - 命中：棱光碎片散射+彩虹闪光
    _hit_diamond(x, y) {
        const n = Math.floor(16 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#88ccff', '#ff88cc', '#88ff88', '#ffff88', '#fff'],
            speedMin: 4, speedMax: 11, sizeMin: 2, sizeMax: 7,
            lifeMin: 0.3, lifeMax: 0.7, friction: 0.89, shape: 'diamond',
            glow: true, glowSize: 12, hueShift: true,
        });
        this.particles.addShockwave(x, y, '#88ccff', 50, 0.3);
        this.particles.addFlash(x, y, '#fff', 28, 0.1);
    }
    _skill_diamond(x, y) {
        const n = Math.floor(50 * this.quality.particleMult);
        // 彩虹棱光大爆发
        this.particles.emit(x, y, n, {
            colors: ['#88ccff', '#ff88cc', '#88ff88', '#ffff88', '#fff', '#ff8888'],
            speedMin: 6, speedMax: 16, sizeMin: 4, sizeMax: 12,
            lifeMin: 0.6, lifeMax: 1.4, friction: 0.94, shape: 'diamond',
            glow: true, glowSize: 16, hueShift: true,
        });
        // 彩虹环
        this.particles.emitRing(x, y, Math.floor(20 * this.quality.particleMult), 35, {
            colors: ['#ff4444', '#ff8800', '#ffff00', '#44ff44', '#4488ff', '#aa44ff'],
            speedMin: 4, speedMax: 10, sizeMin: 3, sizeMax: 7, lifeMin: 0.5, lifeMax: 0.9,
            glow: true, glowSize: 10, shape: 'star',
        });
        // 六芒星方向射线
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_SK;
            setTimeout(() => {
                this.particles.emit(x + Math.cos(a) * 40, y + Math.sin(a) * 40, 5, {
                    colors: [`hsl(${i * 60}, 80%, 70%)`, '#fff'],
                    speedMin: 2, speedMax: 5, sizeMin: 3, sizeMax: 7, lifeMin: 0.5, lifeMax: 0.9,
                    shape: 'star', glow: true, glowSize: 10,
                });
            }, i * 25);
        }
        this.particles.addShockwave(x, y, '#fff', 110, 0.55);
        this.particles.addShockwave(x, y, '#88ccff', 80, 0.4);
        this.particles.addBeam(x, y, 220, 8, '#88ccff', 0.4);
        this.particles.triggerScreenFlash('#ffffff', 0.2, 0.12);
        // Utils.shake(7);
    }
    _trail_diamond(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(2.5 * this.quality.particleMult)), {
            colors: ['#88ccff', '#aaddff', '#fff', '#ff88cc'],
            speedMin: 0.3, speedMax: 1.5, sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.5,
            shape: 'diamond', glow: true, glowSize: 6, hueShift: true,
        });
    }
    _aura_diamond(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 5) * 0.1;
        const hue = (this._time * 60) % 360;
        ctx.save();
        ctx.globalAlpha = 0.12 * pulse;
        ctx.fillStyle = `hsl(${hue}, 60%, 70%)`;
        ctx.beginPath(); ctx.arc(x, y, r * 1.8 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = `hsl(${(hue + 120) % 360}, 60%, 70%)`;
        ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 红宝石 - 命中：火焰爆裂+熔岩飞溅
    _hit_ruby(x, y) {
        const n = Math.floor(16 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#ff3355', '#ff6644', '#ffaa00', '#ffee00', '#fff'],
            speedMin: 4, speedMax: 11, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.25, lifeMax: 0.7, friction: 0.88,
            glow: true, glowSize: 12,
        });
        this.particles.addShockwave(x, y, '#ff4444', 55, 0.3);
        this.particles.addFlash(x, y, '#ff6644', 28, 0.1);
    }
    _skill_ruby(x, y) {
        const n = Math.floor(50 * this.quality.particleMult);
        // 熔岩大爆发
        this.particles.emit(x, y, n, {
            colors: ['#cc2244', '#ff4422', '#ffcc00', '#ffee88', '#fff'],
            speedMin: 6, speedMax: 18, sizeMin: 4, sizeMax: 14,
            lifeMin: 0.5, lifeMax: 1.4, friction: 0.92,
            glow: true, glowSize: 18,
        });
        // 火山喷射(向上)
        this.particles.emit(x, y, Math.floor(15 * this.quality.particleMult), {
            colors: ['#ff4422', '#ffaa00', '#ffcc00'],
            angle: -Math.PI / 2, spread: 0.6,
            speedMin: 10, speedMax: 20, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.6, lifeMax: 1.2, gravity: 3, friction: 0.96,
            glow: true, glowSize: 10,
        });
        this.particles.addShockwave(x, y, '#ff4422', 110, 0.55);
        setTimeout(() => this.particles.addShockwave(x, y, '#ffcc00', 140, 0.65), 80);
        this.particles.addBeam(x, y, 280, 12, '#ff4422', 0.5);
        this.particles.triggerScreenFlash('#ff4422', 0.2, 0.14);
        // Utils.shake(9);
    }
    _trail_ruby(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#cc2244', '#ff4422', '#ffaa44', '#ffcc66'],
            speedMin: 0.5, speedMax: 2, sizeMin: 2, sizeMax: 6, lifeMin: 0.25, lifeMax: 0.5,
            glow: true, glowSize: 7,
        });
    }
    _aura_ruby(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 3.5) * 0.12;
        ctx.save();
        ctx.globalAlpha = 0.14 * pulse; ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(x, y, r * 1.7 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.06; ctx.fillStyle = '#ffcc00';
        ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 翡翠 - 命中：自然能量+藤蔓爆发
    _hit_emerald(x, y) {
        const n = Math.floor(14 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#22aa55', '#44dd77', '#88ffaa', '#ccffcc', '#fff'],
            speedMin: 3, speedMax: 9, sizeMin: 2, sizeMax: 7,
            lifeMin: 0.3, lifeMax: 0.7, friction: 0.9, gravity: 0.2,
            shape: 'cross', glow: this.quality.glowEnabled, glowSize: 10,
        });
        this.particles.addFlash(x, y, '#44dd77', 22, 0.08);
    }
    _skill_emerald(x, y) {
        const n = Math.floor(45 * this.quality.particleMult);
        // 自然风暴
        this.particles.emit(x, y, n, {
            colors: ['#22aa55', '#44dd77', '#88ffaa', '#ffcc44', '#fff'],
            speedMin: 5, speedMax: 14, sizeMin: 3, sizeMax: 11,
            lifeMin: 0.6, lifeMax: 1.3, friction: 0.93, gravity: 0.1,
            shape: 'cross', glow: true, glowSize: 14,
        });
        // 藤蔓螺旋
        this.particles.emitSpiral(x, y, Math.floor(18 * this.quality.particleMult), {
            colors: ['#22aa55', '#44dd77', '#88ffaa'], radius: 60, arms: 5,
            speedMin: 2, speedMax: 5, sizeMin: 2, sizeMax: 6,
            lifeMin: 0.5, lifeMax: 1.0, glow: true, glowSize: 8,
            shape: 'cross',
        });
        this.particles.addShockwave(x, y, '#44dd77', 95, 0.5);
        this.particles.addShockwave(x, y, '#88ffaa', 65, 0.35);
        this.particles.triggerScreenFlash('#44dd77', 0.12, 0.1);
        // Utils.shake(5);
    }
    _trail_emerald(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(2 * this.quality.particleMult)), {
            colors: ['#22aa55', '#44dd77', '#88ffaa'],
            speedMin: 0.3, speedMax: 1.2, sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.55,
            gravity: 0.3, shape: 'cross', glow: this.quality.glowEnabled, glowSize: 5,
        });
    }
    _aura_emerald(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 2.5) * 0.1;
        ctx.save(); ctx.globalAlpha = 0.12 * pulse; ctx.fillStyle = '#44dd77';
        ctx.beginPath(); ctx.arc(x, y, r * 1.6 * pulse, 0, TWO_PI_SK); ctx.fill(); ctx.restore();
    }

    // ===== 宇宙系列特效 =====

    // 星云 - 命中：星光碎裂+彩色星尘
    _hit_nebula(x, y) {
        const n = Math.floor(16 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#aa44ff', '#ff44aa', '#4488ff', '#fff', '#ffcc44'],
            speedMin: 4, speedMax: 10, sizeMin: 2, sizeMax: 7,
            lifeMin: 0.3, lifeMax: 0.8, friction: 0.9, shape: 'star',
            glow: true, glowSize: 12, hueShift: true,
        });
        this.particles.addFlash(x, y, '#aa44ff', 25, 0.1);
    }
    _skill_nebula(x, y) {
        const n = Math.floor(55 * this.quality.particleMult);
        // 星云爆发
        this.particles.emit(x, y, n, {
            colors: ['#4422aa', '#aa44ff', '#ff44aa', '#ffcc00', '#fff'],
            speedMin: 6, speedMax: 18, sizeMin: 4, sizeMax: 14,
            lifeMin: 0.7, lifeMax: 1.6, friction: 0.94, shape: 'star',
            glow: true, glowSize: 20, hueShift: true,
        });
        // 星云螺旋
        this.particles.emitSpiral(x, y, Math.floor(30 * this.quality.particleMult), {
            colors: ['#aa44ff', '#ff44aa', '#4488ff', '#fff'], radius: 80, arms: 6,
            speedMin: 3, speedMax: 7, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.6, lifeMax: 1.2, glow: true, glowSize: 12,
            shape: 'star', hueShift: true,
        });
        this.particles.addShockwave(x, y, '#aa44ff', 130, 0.65);
        setTimeout(() => this.particles.addShockwave(x, y, '#ff44aa', 170, 0.8), 100);
        this.particles.addBeam(x, y, 260, 10, '#aa44ff', 0.5);
        this.particles.triggerScreenFlash('#aa44ff', 0.2, 0.14);
        // Utils.shake(9);
    }
    _trail_nebula(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(3 * this.quality.particleMult)), {
            colors: ['#aa44ff', '#ff44aa', '#4488ff', '#fff'],
            speedMin: 0.4, speedMax: 2, sizeMin: 2, sizeMax: 6, lifeMin: 0.3, lifeMax: 0.6,
            shape: 'star', glow: true, glowSize: 7, hueShift: true,
        });
    }
    _aura_nebula(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 3) * 0.12;
        const hue = (this._time * 40) % 360;
        ctx.save();
        ctx.globalAlpha = 0.15 * pulse;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.beginPath(); ctx.arc(x, y, r * 2.0 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = `hsl(${(hue + 180) % 360}, 70%, 50%)`;
        ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 黑洞 - 命中：引力坍缩+时空扭曲
    _hit_blackhole(x, y) {
        const n = Math.floor(14 * this.quality.particleMult);
        // 向内吸引
        this.particles.emit(x, y, n, {
            colors: ['#ff6600', '#ffcc00', '#fff', '#000'],
            speedMin: -8, speedMax: -3, sizeMin: 2, sizeMax: 6,
            lifeMin: 0.2, lifeMax: 0.5, friction: 0.8,
            glow: true, glowSize: 8,
        });
        // 外圈向外
        this.particles.emitRing(x, y, 8, 20, {
            colors: ['#ff6600', '#ffcc00'], speedMin: -2, speedMax: -0.5,
            sizeMin: 1, sizeMax: 3, lifeMin: 0.2, lifeMax: 0.4,
        });
        this.particles.addShockwave(x, y, '#ff6600', 45, 0.2);
    }
    _skill_blackhole(x, y) {
        const n = Math.floor(40 * this.quality.particleMult);
        // 坍缩大爆发
        this.particles.emit(x, y, n, {
            colors: ['#000', '#220044', '#ff6600', '#ffcc00', '#fff'],
            speedMin: 4, speedMax: 13, sizeMin: 3, sizeMax: 10,
            lifeMin: 0.5, lifeMax: 1.2, friction: 0.9,
            glow: true, glowSize: 14,
        });
        // 吸积盘环
        this.particles.emitRing(x, y, Math.floor(16 * this.quality.particleMult), 40, {
            colors: ['#ff6600', '#ffcc00', '#fff'], speedMin: 1, speedMax: 4,
            sizeMin: 2, sizeMax: 5, lifeMin: 0.5, lifeMax: 1.0, glow: true, glowSize: 8,
        });
        // 向内吸的第二波
        setTimeout(() => {
            this.particles.emit(x, y, Math.floor(20 * this.quality.particleMult), {
                colors: ['#ff6600', '#ffcc00', '#000'], speedMin: -10, speedMax: -4,
                sizeMin: 2, sizeMax: 5, lifeMin: 0.3, lifeMax: 0.6, friction: 0.8,
            });
        }, 150);
        this.particles.addShockwave(x, y, '#000', 100, 0.5);
        this.particles.addShockwave(x, y, '#ff6600', 140, 0.7);
        this.particles.triggerScreenFlash('#000000', 0.25, 0.15);
        // Utils.shake(8);
    }
    _trail_blackhole(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(2 * this.quality.particleMult)), {
            colors: ['#220044', '#000', '#ff6600'],
            speedMin: 0.2, speedMax: 1, sizeMin: 3, sizeMax: 6, lifeMin: 0.2, lifeMax: 0.45,
            glow: true, glowSize: 5,
        });
    }
    _aura_blackhole(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 2) * 0.15;
        ctx.save();
        ctx.globalAlpha = 0.2 * pulse;
        const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.2 * pulse);
        g.addColorStop(0, '#000'); g.addColorStop(0.6, '#220033');
        g.addColorStop(0.85, 'rgba(255,102,0,0.3)'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 2.2 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    // 凤凰 - 命中：烈焰爆裂+余烬升腾
    _hit_phoenix(x, y) {
        const n = Math.floor(18 * this.quality.particleMult);
        this.particles.emit(x, y, n, {
            colors: ['#ff4400', '#ffaa00', '#ffcc00', '#ffee88', '#fff'],
            speedMin: 4, speedMax: 12, sizeMin: 3, sizeMax: 8,
            lifeMin: 0.3, lifeMax: 0.8, friction: 0.88,
            glow: true, glowSize: 14,
        });
        // 余烬上升
        this.particles.emit(x, y, Math.floor(5 * this.quality.particleMult), {
            colors: ['#ff4400', '#ffaa00'], speedMin: 1, speedMax: 3,
            sizeMin: 1, sizeMax: 3, lifeMin: 0.5, lifeMax: 1.0, gravity: -1.5,
            glow: true, glowSize: 5,
        });
        this.particles.addShockwave(x, y, '#ff6600', 60, 0.3);
        this.particles.addFlash(x, y, '#ffaa00', 30, 0.1);
    }
    _skill_phoenix(x, y) {
        const n = Math.floor(60 * this.quality.particleMult);
        // 浴火重生大爆发
        this.particles.emit(x, y, n, {
            colors: ['#ff4400', '#ffaa00', '#ffee88', '#fff', '#ff2200', '#ffcc00'],
            speedMin: 7, speedMax: 20, sizeMin: 4, sizeMax: 15,
            lifeMin: 0.7, lifeMax: 1.6, friction: 0.93,
            glow: true, glowSize: 22,
        });
        // 凤凰翼展(左右两翼)
        for (let side = -1; side <= 1; side += 2) {
            this.particles.emit(x, y, Math.floor(12 * this.quality.particleMult), {
                colors: ['#ff4400', '#ffaa00', '#ffcc00', '#fff'],
                angle: side * Math.PI * 0.4, spread: 0.4,
                speedMin: 8, speedMax: 16, sizeMin: 3, sizeMax: 9,
                lifeMin: 0.5, lifeMax: 1.0, friction: 0.94,
                glow: true, glowSize: 12,
            });
        }
        // 余烬柱
        this.particles.emit(x, y, Math.floor(15 * this.quality.particleMult), {
            colors: ['#ff4400', '#ffaa00', '#ffee88'], speedMin: 2, speedMax: 6,
            sizeMin: 1.5, sizeMax: 4, lifeMin: 1.0, lifeMax: 2.5, gravity: -2,
            glow: true, glowSize: 6,
        });
        this.particles.addShockwave(x, y, '#ff6600', 120, 0.6);
        setTimeout(() => this.particles.addShockwave(x, y, '#ffcc00', 160, 0.8), 90);
        this.particles.addBeam(x, y, 300, 12, '#ff6600', 0.55);
        this.particles.triggerScreenFlash('#ff6600', 0.22, 0.15);
        // Utils.shake(12);
    }
    _trail_phoenix(x, y) {
        this.particles.emit(x, y, Math.max(1, Math.floor(4 * this.quality.particleMult)), {
            colors: ['#ff4400', '#ffaa00', '#ffcc00', '#ffee88'],
            speedMin: 0.5, speedMax: 2.5, sizeMin: 2, sizeMax: 7, lifeMin: 0.3, lifeMax: 0.65,
            glow: true, glowSize: 9,
        });
        // 额外余烬
        if (this.quality.detailLevel >= 2) {
            this.particles.emit(x, y, 1, {
                colors: ['#ffaa00'], speedMin: 0.3, speedMax: 1,
                sizeMin: 1, sizeMax: 2, lifeMin: 0.6, lifeMax: 1.2, gravity: -1,
                glow: true, glowSize: 4,
            });
        }
    }
    _aura_phoenix(ctx, x, y, r) {
        const pulse = 1 + Math.sin(this._time * 4) * 0.15;
        const flicker = 0.9 + Math.random() * 0.2;
        ctx.save();
        ctx.globalAlpha = 0.16 * pulse * flicker; ctx.fillStyle = '#ff6600';
        ctx.beginPath(); ctx.arc(x, y, r * 1.9 * pulse, 0, TWO_PI_SK); ctx.fill();
        ctx.globalAlpha = 0.08 * flicker; ctx.fillStyle = '#ffcc00';
        ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }
}

// 全局实例
const skinManager = new SkinManager();
