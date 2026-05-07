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
    getEquippedSkin(charId) { const id = this.equippedSkins[charId]; return id ? this.getSkinById(id) : null; }
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
        fn.call(this, ctx, x, y, radius, angle);
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

    // 西瓜 - 略扁椭圆+深色条纹+红色内瓤缺口+瓜籽
    _body_watermelon(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#2a8c3a', 0.15);
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 2) * 0.05);
        const rx = r * 1.08, ry = r * 0.93;
        // 瓜体
        ctx.fillStyle = '#1e7a30';
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TWO_PI_SK); ctx.fill();
        // 深色条纹
        ctx.save();
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TWO_PI_SK); ctx.clip();
        ctx.strokeStyle = '#0c4f1a'; ctx.lineWidth = r * 0.11; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * rx * 1.1, Math.sin(a) * ry * 1.1);
            ctx.quadraticCurveTo(Math.cos(a + 0.8) * r * 0.2, Math.sin(a + 0.8) * r * 0.2, -Math.cos(a) * rx * 1.1, -Math.sin(a) * ry * 1.1);
            ctx.stroke();
        }
        ctx.restore();
        // 红色缺口 - 被啃一口的效果
        ctx.fillStyle = '#ff2233';
        ctx.beginPath(); ctx.arc(r * 0.45, r * 0.15, r * 0.38, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#cc1122';
        ctx.beginPath(); ctx.arc(r * 0.45, r * 0.15, r * 0.25, 0, TWO_PI_SK); ctx.fill();
        // 瓜籽
        ctx.fillStyle = '#111';
        for (let i = 0; i < 5; i++) {
            const sa = i * 1.2 + 0.5, sd = r * 0.18;
            ctx.save(); ctx.translate(r * 0.45 + Math.cos(sa) * sd, r * 0.15 + Math.sin(sa) * sd);
            ctx.rotate(sa); ctx.beginPath(); ctx.ellipse(0, 0, 1.5, 3, 0, 0, TWO_PI_SK); ctx.fill(); ctx.restore();
        }
        ctx.restore();
        this._hl(ctx, x, y, r);
        // 高画质光泽
        if (this.quality.detailLevel >= 2) {
            ctx.save(); ctx.globalAlpha = 0.06 + Math.sin(t * 1.2) * 0.02;
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.ellipse(x - r * 0.2, y - r * 0.25, r * 0.35, r * 0.12, -0.3, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
    }

    _proj_watermelon(ctx, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle + this._time * 15);
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.5, r * 1.0, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath(); ctx.ellipse(-r * 0.12, -r * 0.2, r * 0.1, r * 0.4, 0.2, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.5, '#33aa44', 0.2);
    }

    // 草莓 - 心形轮廓+籽粒+叶冠
    _body_strawberry(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#ff4466', 0.12);
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.5) * 0.03);
        // 草莓形（上窄下宽水滴）
        ctx.fillStyle = '#ee2244';
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.85);
        ctx.bezierCurveTo(-r * 0.3, -r * 1.0, -r * 1.05, -r * 0.3, -r * 0.7, r * 0.2);
        ctx.bezierCurveTo(-r * 0.4, r * 0.75, -r * 0.15, r * 1.0, 0, r * 1.05);
        ctx.bezierCurveTo(r * 0.15, r * 1.0, r * 0.4, r * 0.75, r * 0.7, r * 0.2);
        ctx.bezierCurveTo(r * 1.05, -r * 0.3, r * 0.3, -r * 1.0, 0, -r * 0.85);
        ctx.fill();
        // 渐变暗面
        if (this.quality.detailLevel >= 1) {
            const sg = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
            sg.addColorStop(0, 'rgba(255,100,120,0.3)'); sg.addColorStop(1, 'rgba(100,0,20,0.3)');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_SK); ctx.fill();
        }
        // 金色籽粒
        ctx.fillStyle = '#ffdd44';
        const seeds = this.quality.detailLevel >= 2 ? 14 : 8;
        for (let i = 0; i < seeds; i++) {
            const sa = (i / seeds) * TWO_PI_SK + 0.5;
            const sd = r * (0.3 + (i % 3) * 0.12);
            ctx.save(); ctx.translate(Math.cos(sa) * sd * 0.6, Math.sin(sa) * sd * 0.8 + r * 0.1);
            ctx.rotate(sa * 0.5);
            ctx.beginPath(); ctx.ellipse(0, 0, 1.3, 2.5, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
        // 顶部绿叶
        ctx.fillStyle = '#33bb44';
        for (let i = -2; i <= 2; i++) {
            ctx.save(); ctx.translate(i * r * 0.16, -r * 0.88); ctx.rotate(i * 0.22);
            ctx.beginPath(); ctx.ellipse(0, 0, r * 0.1, r * 0.3, 0, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
        ctx.restore();
        this._hl(ctx, x, y, r);
        // 极致：浮动花瓣
        if (this.quality.detailLevel >= 3) {
            ctx.save(); ctx.globalAlpha = 0.35;
            for (let i = 0; i < 6; i++) {
                const pa = t * 0.7 + i * TWO_PI_SK / 6;
                const pd = r * 1.6 + Math.sin(t * 2 + i) * r * 0.2;
                ctx.fillStyle = i % 2 ? '#ff88aa' : '#ffbbcc';
                ctx.beginPath(); ctx.ellipse(x + Math.cos(pa) * pd, y + Math.sin(pa) * pd, 2.5, 5, pa, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
    }

    _proj_strawberry(ctx, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const s = r * 0.8;
        ctx.fillStyle = '#ff4488';
        ctx.beginPath();
        ctx.moveTo(0, s * 0.5);
        ctx.bezierCurveTo(-s * 0.9, -s * 0.1, -s * 0.5, -s * 0.9, 0, -s * 0.4);
        ctx.bezierCurveTo(s * 0.5, -s * 0.9, s * 0.9, -s * 0.1, 0, s * 0.5);
        ctx.fill();
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.4, '#ff66aa', 0.25);
    }

    // 橙子 - 圆形+柑橘纹理+叶蒂
    _body_orange(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#ff9900', 0.1);
        // 主体渐变
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.08, x + r * 0.1, y + r * 0.1, r);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ff9900'); g.addColorStop(1, '#cc6600');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.fill();
        // 表皮纹理
        if (this.quality.detailLevel >= 1) {
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.clip();
            ctx.fillStyle = 'rgba(255,200,80,0.12)';
            const n = this.quality.detailLevel >= 2 ? 35 : 16;
            for (let i = 0; i < n; i++) {
                const a = i * 2.399; const d = r * 0.15 + (i / n) * r * 0.75;
                ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 1.2, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        // 顶部叶蒂
        ctx.fillStyle = '#44aa22';
        ctx.beginPath(); ctx.ellipse(x + r * 0.05, y - r * 0.92, r * 0.08, r * 0.18, 0.2, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#338811';
        ctx.beginPath(); ctx.arc(x, y - r * 0.88, r * 0.1, 0, TWO_PI_SK); ctx.fill();
        this._hl(ctx, x, y, r);
        // 极致：飘散橙汁
        if (this.quality.detailLevel >= 3) {
            ctx.save(); ctx.globalAlpha = 0.3;
            for (let i = 0; i < 3; i++) {
                const a = t + i * 2.1;
                const d = r * 1.5 + Math.sin(t * 3 + i) * r * 0.2;
                ctx.fillStyle = '#ffaa33';
                ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 2.5, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
    }

    _proj_orange(ctx, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, '#ffdd55'); g.addColorStop(1, '#ff8800');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(r * 1.2, 0);
        ctx.quadraticCurveTo(r * 0.3, -r * 0.6, -r * 0.4, 0);
        ctx.quadraticCurveTo(r * 0.3, r * 0.6, r * 1.2, 0);
        ctx.fill();
        ctx.restore();
    }

    // ============================================
    // 动物系列
    // ============================================

    // 灵狐 - 椭圆体+尖耳+火焰大尾巴
    _body_fox(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        // 火焰尾巴(身后)
        const tailA = angle + Math.PI + Math.sin(t * 3) * 0.35;
        if (this.quality.detailLevel >= 1) {
            const layers = this.quality.detailLevel >= 3 ? 5 : 3;
            for (let l = layers - 1; l >= 0; l--) {
                const td = r * (0.7 + l * 0.3);
                const tx = x + Math.cos(tailA) * td;
                const ty = y + Math.sin(tailA) * td;
                const tr = r * (0.5 + l * 0.15);
                ctx.save(); ctx.globalAlpha = 0.4 - l * 0.06;
                const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, tr);
                tg.addColorStop(0, l === 0 ? '#fff' : '#ffcc00');
                tg.addColorStop(0.4, '#ff6600');
                tg.addColorStop(1, 'transparent');
                ctx.fillStyle = tg;
                ctx.beginPath(); ctx.arc(tx, ty, tr, 0, TWO_PI_SK); ctx.fill();
                ctx.restore();
            }
        }
        this._glow(ctx, x, y, r, '#ff6622', 0.15);
        // 身体(略椭圆)
        const bodyG = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
        bodyG.addColorStop(0, '#ff9944'); bodyG.addColorStop(0.7, '#ff6622'); bodyG.addColorStop(1, '#cc4400');
        ctx.fillStyle = bodyG;
        ctx.beginPath(); ctx.ellipse(x, y, r * 1.0, r * 0.9, 0, 0, TWO_PI_SK); ctx.fill();
        // 肚皮
        ctx.fillStyle = '#fff5e0';
        ctx.beginPath(); ctx.ellipse(x, y + r * 0.15, r * 0.5, r * 0.45, 0, 0, TWO_PI_SK); ctx.fill();
        // 尖耳朵
        for (let s = -1; s <= 1; s += 2) {
            ctx.fillStyle = '#cc4400';
            ctx.beginPath();
            ctx.moveTo(x + s * r * 0.4, y - r * 0.55);
            ctx.lineTo(x + s * r * 0.65, y - r * 1.25);
            ctx.lineTo(x + s * r * 0.15, y - r * 0.7);
            ctx.closePath(); ctx.fill();
            // 内耳
            ctx.fillStyle = '#ffccaa';
            ctx.beginPath();
            ctx.moveTo(x + s * r * 0.42, y - r * 0.6);
            ctx.lineTo(x + s * r * 0.58, y - r * 1.05);
            ctx.lineTo(x + s * r * 0.25, y - r * 0.7);
            ctx.closePath(); ctx.fill();
        }
        // 眼睛
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.ellipse(x - r * 0.22, y - r * 0.08, 3, 3.5, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.22, y - r * 0.08, 3, 3.5, 0, 0, TWO_PI_SK); ctx.fill();
        // 眼睛高光
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.12, 1.5, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.24, y - r * 0.12, 1.5, 0, TWO_PI_SK); ctx.fill();
        // 鼻子
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.ellipse(x, y + r * 0.12, 2.5, 2, 0, 0, TWO_PI_SK); ctx.fill();
        this._hl(ctx, x, y, r);
    }

    _proj_fox(ctx, x, y, r, angle) {
        // 鬼火弹 - 飘忽的蓝白火焰
        const t = this._time;
        ctx.save(); ctx.translate(x, y);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.3);
        g.addColorStop(0, '#fff'); g.addColorStop(0.3, '#88ddff'); g.addColorStop(0.6, '#4488ff'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.3, 0, TWO_PI_SK); ctx.fill();
        // 火焰尾
        ctx.rotate(angle);
        ctx.fillStyle = 'rgba(68,136,255,0.4)';
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, 0);
        ctx.quadraticCurveTo(-r * 1.5, -r * 0.3, -r * 2 + Math.sin(t * 8) * r * 0.3, 0);
        ctx.quadraticCurveTo(-r * 1.5, r * 0.3, -r * 0.5, 0);
        ctx.fill();
        ctx.restore();
    }

    // 幼龙 - 鳞甲纹理+小翅膀+角
    _body_dragon(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#7744dd', 0.2);
        // 小翅膀(身后展开)
        const wingFlap = Math.sin(t * 4) * 0.2 + 0.8;
        if (this.quality.detailLevel >= 1) {
            for (let s = -1; s <= 1; s += 2) {
                ctx.save(); ctx.globalAlpha = 0.6;
                ctx.fillStyle = '#9966ff';
                ctx.beginPath();
                ctx.moveTo(x + s * r * 0.5, y - r * 0.2);
                ctx.quadraticCurveTo(x + s * r * 1.8 * wingFlap, y - r * 1.3 * wingFlap, x + s * r * 1.5 * wingFlap, y + r * 0.1);
                ctx.quadraticCurveTo(x + s * r * 1.2, y + r * 0.1, x + s * r * 0.5, y - r * 0.2);
                ctx.fill();
                // 翼膜纹理
                if (this.quality.detailLevel >= 2) {
                    ctx.strokeStyle = 'rgba(130,80,220,0.5)'; ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(x + s * r * 0.5, y - r * 0.2);
                    ctx.lineTo(x + s * r * 1.4 * wingFlap, y - r * 0.8 * wingFlap);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x + s * r * 0.5, y - r * 0.1);
                    ctx.lineTo(x + s * r * 1.3 * wingFlap, y - r * 0.3 * wingFlap);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
        // 鳞甲身体
        const bg = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
        bg.addColorStop(0, '#9977ff'); bg.addColorStop(0.6, '#6644cc'); bg.addColorStop(1, '#3a2288');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.fill();
        // 鳞片纹理
        if (this.quality.detailLevel >= 1) {
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.clip();
            ctx.strokeStyle = 'rgba(180,140,255,0.35)'; ctx.lineWidth = 0.8;
            const rows = this.quality.detailLevel >= 2 ? 5 : 3;
            for (let row = 0; row < rows; row++) {
                const ry2 = y - r + (row + 1) * (2 * r / (rows + 1));
                for (let col = 0; col < 7; col++) {
                    const rx2 = x - r + (col + (row % 2) * 0.5) * (2 * r / 7);
                    ctx.beginPath(); ctx.arc(rx2, ry2, r * 0.14, Math.PI * 0.7, Math.PI * 2.3); ctx.stroke();
                }
            }
            ctx.restore();
        }
        // 角
        ctx.fillStyle = '#ffcc44';
        for (let s = -1; s <= 1; s += 2) {
            ctx.beginPath();
            ctx.moveTo(x + s * r * 0.3, y - r * 0.75);
            ctx.lineTo(x + s * r * 0.45, y - r * 1.4);
            ctx.lineTo(x + s * r * 0.15, y - r * 0.85);
            ctx.closePath(); ctx.fill();
        }
        // 眼睛(竖瞳红色)
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.ellipse(x - r * 0.22, y - r * 0.1, 3.5, 4, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.22, y - r * 0.1, 3.5, 4, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(x - r * 0.22, y - r * 0.1, 1.2, 3.5, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.22, y - r * 0.1, 1.2, 3.5, 0, 0, TWO_PI_SK); ctx.fill();
        // 鼻烟(高画质)
        if (this.quality.detailLevel >= 2) {
            ctx.save(); ctx.globalAlpha = 0.25 + Math.sin(t * 3) * 0.1;
            const sx = x + Math.cos(angle) * r * 0.6;
            const sy = y + Math.sin(angle) * r * 0.6;
            const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.3);
            sg.addColorStop(0, '#aaa'); sg.addColorStop(1, 'transparent');
            ctx.fillStyle = sg;
            ctx.beginPath(); ctx.arc(sx, sy, r * 0.3, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
        this._hl(ctx, x, y, r);
    }

    _proj_dragon(ctx, x, y, r, angle) {
        // 龙息火焰弹 - 紫金渐变火锥
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createLinearGradient(-r * 0.5, 0, r * 2, 0);
        g.addColorStop(0, '#7744dd'); g.addColorStop(0.4, '#ff6644'); g.addColorStop(0.8, '#ffcc00'); g.addColorStop(1, '#fff');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-r * 0.4, -r * 0.7);
        ctx.lineTo(r * 1.8, 0);
        ctx.lineTo(-r * 0.4, r * 0.7);
        ctx.closePath(); ctx.fill();
        // 热浪扭曲感
        if (this.quality.glowEnabled) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath(); ctx.arc(r * 0.5, 0, r * 0.8, 0, TWO_PI_SK); ctx.fill();
        }
        ctx.restore();
    }

    // 暗影猫 - 圆身+大尖耳+竖瞳+暗影弥漫
    _body_cat(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        // 暗影弥漫(身周)
        if (this.quality.detailLevel >= 2) {
            ctx.save(); ctx.globalAlpha = 0.12 + Math.sin(t * 2) * 0.04;
            for (let i = 0; i < 5; i++) {
                const sa = t * 0.5 + i * TWO_PI_SK / 5;
                const sd = r * 1.3 + Math.sin(t + i) * r * 0.2;
                const sg = ctx.createRadialGradient(x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, 0, x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, r * 0.5);
                sg.addColorStop(0, '#44ffaa'); sg.addColorStop(1, 'transparent');
                ctx.fillStyle = sg;
                ctx.beginPath(); ctx.arc(x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, r * 0.5, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        this._glow(ctx, x, y, r, '#44ffaa', 0.1);
        // 身体
        const bg = ctx.createRadialGradient(x, y - r * 0.2, r * 0.1, x, y, r);
        bg.addColorStop(0, '#3a3a52'); bg.addColorStop(1, '#1a1a2e');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.fill();
        // 大尖耳朵
        for (let s = -1; s <= 1; s += 2) {
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.moveTo(x + s * r * 0.35, y - r * 0.6);
            ctx.lineTo(x + s * r * 0.7, y - r * 1.4);
            ctx.lineTo(x + s * r * 0.05, y - r * 0.8);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#ff66aa';
            ctx.beginPath();
            ctx.moveTo(x + s * r * 0.38, y - r * 0.65);
            ctx.lineTo(x + s * r * 0.6, y - r * 1.2);
            ctx.lineTo(x + s * r * 0.15, y - r * 0.78);
            ctx.closePath(); ctx.fill();
        }
        // 发光猫眼
        const eyeGlow = 0.7 + Math.sin(t * 3) * 0.2;
        ctx.fillStyle = `rgba(68,255,170,${eyeGlow})`;
        ctx.beginPath(); ctx.ellipse(x - r * 0.24, y - r * 0.05, 4.5, 5.5, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.24, y - r * 0.05, 4.5, 5.5, 0, 0, TWO_PI_SK); ctx.fill();
        // 竖瞳
        ctx.fillStyle = '#000';
        const pupilW = 1.2 + Math.sin(t * 2) * 0.4;
        ctx.beginPath(); ctx.ellipse(x - r * 0.24, y - r * 0.05, pupilW, 4.5, 0, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.24, y - r * 0.05, pupilW, 4.5, 0, 0, TWO_PI_SK); ctx.fill();
        // 胡须
        if (this.quality.detailLevel >= 1) {
            ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 0.8;
            for (let s = -1; s <= 1; s += 2) {
                for (let i = -1; i <= 1; i++) {
                    ctx.beginPath();
                    ctx.moveTo(x + s * r * 0.3, y + r * 0.18);
                    ctx.lineTo(x + s * r * 1.0, y + r * (0.08 + i * 0.12));
                    ctx.stroke();
                }
            }
        }
        // 嘴巴
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(x, y + r * 0.25, r * 0.12, 0, Math.PI); ctx.stroke();
        ctx.globalAlpha = 1;
    }

    _proj_cat(ctx, x, y, r, angle) {
        // 暗影爪痕 - 三道绿色能量爪痕
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.shadowColor = '#44ffaa'; ctx.shadowBlur = this.quality.glowEnabled ? 8 : 0;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(-r * 0.8, i * r * 0.5);
            ctx.quadraticCurveTo(0, i * r * 0.35, r * 0.8, i * r * 0.4);
            ctx.stroke();
        }
        ctx.restore();
    }

    // ============================================
    // 宝石系列
    // ============================================

    // 钻石 - 多面体(八面体正面投影)+彩虹折射
    _body_diamond(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#88ccff', 0.25);
        const rot = t * 0.3;
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        // 八面体轮廓(菱形)
        const facetColors = ['#aaddff', '#88ccff', '#66bbee', '#99ddff', '#bbeeFF', '#77ccee', '#55aadd', '#cceeff'];
        const pts = 8;
        for (let i = 0; i < pts; i++) {
            const a1 = (i / pts) * TWO_PI_SK;
            const a2 = ((i + 1) / pts) * TWO_PI_SK;
            ctx.fillStyle = facetColors[i % facetColors.length];
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
            ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
            ctx.closePath(); ctx.fill();
        }
        // 刻面线
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 0.8;
        for (let i = 0; i < pts; i++) {
            const a = (i / pts) * TWO_PI_SK;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
        }
        // 外边
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= pts; i++) {
            const a = (i / pts) * TWO_PI_SK;
            i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.restore();
        // 彩虹折射光斑
        if (this.quality.detailLevel >= 2) {
            ctx.save();
            for (let i = 0; i < 4; i++) {
                const ra = t * 1.8 + i * TWO_PI_SK / 4;
                const rd = r * 0.5;
                const rx = x + Math.cos(ra) * rd;
                const ry = y + Math.sin(ra) * rd;
                ctx.globalAlpha = 0.25 + Math.sin(t * 3 + i) * 0.1;
                ctx.fillStyle = `hsl(${(t * 60 + i * 90) % 360}, 90%, 70%)`;
                ctx.beginPath(); ctx.arc(rx, ry, r * 0.2, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        // 极致：彩虹光线射出
        if (this.quality.detailLevel >= 3) {
            ctx.save(); ctx.globalAlpha = 0.2;
            for (let i = 0; i < 6; i++) {
                const la = t * 0.8 + i * TWO_PI_SK / 6;
                ctx.strokeStyle = `hsl(${(i * 60 + t * 30) % 360}, 80%, 65%)`;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(la) * r * 0.8, y + Math.sin(la) * r * 0.8);
                ctx.lineTo(x + Math.cos(la) * r * 2.2, y + Math.sin(la) * r * 2.2);
                ctx.stroke();
            }
            ctx.restore();
        }
        this._hl(ctx, x, y, r);
    }

    _proj_diamond(ctx, x, y, r, angle) {
        // 彩虹棱形碎片
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle + this._time * 6);
        const hue = (this._time * 120) % 360;
        ctx.fillStyle = `hsl(${hue}, 85%, 70%)`;
        ctx.beginPath();
        ctx.moveTo(0, -r); ctx.lineTo(r * 0.6, 0); ctx.lineTo(0, r); ctx.lineTo(-r * 0.6, 0);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.5, `hsl(${hue}, 85%, 70%)`, 0.3);
    }

    // 红宝石 - 六面宝石+内核脉动火焰
    _body_ruby(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#ff4466', 0.25);
        // 六面体外形
        ctx.save(); ctx.translate(x, y);
        const facets = 6;
        const colors = ['#ff3355', '#cc1133', '#ff5577', '#aa0022', '#ff4466', '#dd2244'];
        for (let i = 0; i < facets; i++) {
            const a1 = (i / facets) * TWO_PI_SK - Math.PI / 6;
            const a2 = ((i + 1) / facets) * TWO_PI_SK - Math.PI / 6;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
            ctx.lineTo(Math.cos(a2) * r, Math.sin(a2) * r);
            ctx.closePath(); ctx.fill();
        }
        // 外边
        ctx.strokeStyle = 'rgba(255,200,200,0.5)'; ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let i = 0; i <= facets; i++) {
            const a = (i / facets) * TWO_PI_SK - Math.PI / 6;
            i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.restore();
        // 内核脉动
        const pulse = 0.35 + Math.sin(t * 3) * 0.1;
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r * pulse);
        cg.addColorStop(0, '#fff'); cg.addColorStop(0.5, '#ff6677'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(x, y, r * pulse, 0, TWO_PI_SK); ctx.fill();
        // 极致：边缘火焰粒子
        if (this.quality.detailLevel >= 3) {
            ctx.save();
            for (let i = 0; i < 8; i++) {
                const fa = (i / 8) * TWO_PI_SK + t * 2;
                const fd = r * (0.95 + Math.sin(t * 4 + i) * 0.12);
                ctx.globalAlpha = 0.35;
                const fg = ctx.createRadialGradient(x + Math.cos(fa) * fd, y + Math.sin(fa) * fd, 0, x + Math.cos(fa) * fd, y + Math.sin(fa) * fd, r * 0.2);
                fg.addColorStop(0, '#ffaa44'); fg.addColorStop(1, 'transparent');
                ctx.fillStyle = fg;
                ctx.beginPath(); ctx.arc(x + Math.cos(fa) * fd, y + Math.sin(fa) * fd, r * 0.2, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        this._hl(ctx, x, y, r);
    }

    _proj_ruby(ctx, x, y, r, angle) {
        // 红色火焰弹 - 核心白+红焰
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.2);
        g.addColorStop(0, '#fff'); g.addColorStop(0.3, '#ff4444'); g.addColorStop(0.7, '#cc1122'); g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 1.2, 0, TWO_PI_SK); ctx.fill();
    }

    // 翡翠 - 六角+藤蔓环绕
    _body_emerald(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#44ff88', 0.15);
        // 藤蔓环绕(身周)
        if (this.quality.detailLevel >= 2) {
            ctx.save(); ctx.strokeStyle = '#33bb55'; ctx.lineWidth = 2; ctx.lineCap = 'round';
            ctx.globalAlpha = 0.5;
            for (let i = 0; i < 3; i++) {
                const va = t * 0.4 + i * TWO_PI_SK / 3;
                ctx.beginPath();
                const steps = 12;
                for (let s = 0; s <= steps; s++) {
                    const sa = va + (s / steps) * Math.PI * 1.5;
                    const sd = r * (1.2 + Math.sin(s * 0.8 + t) * 0.15);
                    const px = x + Math.cos(sa) * sd;
                    const py = y + Math.sin(sa) * sd;
                    s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                ctx.stroke();
                // 小叶子
                if (this.quality.detailLevel >= 3) {
                    for (let l = 0; l < 3; l++) {
                        const la = va + (l / 3) * Math.PI * 1.5;
                        const ld = r * 1.2;
                        ctx.fillStyle = '#55dd77';
                        ctx.beginPath(); ctx.ellipse(x + Math.cos(la) * ld, y + Math.sin(la) * ld, 3, 6, la + 0.5, 0, TWO_PI_SK); ctx.fill();
                    }
                }
            }
            ctx.restore();
        }
        // 六角形宝石
        ctx.save(); ctx.translate(x, y);
        const eg = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        eg.addColorStop(0, '#66ffaa'); eg.addColorStop(0.5, '#22aa55'); eg.addColorStop(1, '#115533');
        ctx.fillStyle = eg;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_SK - Math.PI / 6;
            i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.closePath(); ctx.fill();
        // 晶格线
        ctx.strokeStyle = 'rgba(100,255,180,0.3)'; ctx.lineWidth = 0.8;
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_SK - Math.PI / 6;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); ctx.stroke();
        }
        // 外边
        ctx.strokeStyle = 'rgba(100,255,180,0.6)'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= 6; i++) {
            const a = (i / 6) * TWO_PI_SK - Math.PI / 6;
            i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.restore();
        this._hl(ctx, x, y, r);
    }

    _proj_emerald(ctx, x, y, r, angle) {
        // 荆棘藤鞭
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.strokeStyle = '#44dd77'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.shadowColor = '#44ff88'; ctx.shadowBlur = this.quality.glowEnabled ? 6 : 0;
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, 0);
        ctx.quadraticCurveTo(0, -r * 0.4, r * 0.8, 0);
        ctx.stroke();
        // 刺
        ctx.fillStyle = '#22aa55';
        for (let i = 0; i < 3; i++) {
            const sx = -r * 0.4 + i * r * 0.4;
            ctx.beginPath();
            ctx.moveTo(sx, -r * 0.1); ctx.lineTo(sx + r * 0.08, -r * 0.35); ctx.lineTo(sx + r * 0.16, -r * 0.1);
            ctx.fill();
        }
        ctx.restore();
    }

    // ============================================
    // 宇宙系列
    // ============================================

    // 星云 - 气态不规则+旋转+星点
    _body_nebula(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        this._glow(ctx, x, y, r, '#aa44ff', 0.3);
        // 多层气态云
        const colors = ['#6644cc', '#aa44ff', '#ff44aa', '#4488ff'];
        for (let i = colors.length - 1; i >= 0; i--) {
            const lr = r * (0.5 + i * 0.18);
            const oa = t * (0.4 + i * 0.15);
            const ox = Math.cos(oa) * r * 0.08 * i;
            const oy = Math.sin(oa * 0.8) * r * 0.08 * i;
            ctx.save(); ctx.globalAlpha = 0.45 + i * 0.08;
            const lg = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, lr);
            lg.addColorStop(0, colors[i]); lg.addColorStop(1, 'transparent');
            ctx.fillStyle = lg;
            ctx.beginPath(); ctx.arc(x + ox, y + oy, lr, 0, TWO_PI_SK); ctx.fill();
            ctx.restore();
        }
        // 旋转环
        if (this.quality.detailLevel >= 1) {
            ctx.save(); ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#aa88ff'; ctx.lineWidth = 1.5;
            ctx.translate(x, y); ctx.rotate(t * 0.8);
            ctx.beginPath(); ctx.ellipse(0, 0, r * 0.9, r * 0.35, 0, 0, TWO_PI_SK); ctx.stroke();
            ctx.restore();
        }
        // 核心白点
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 0.25);
        cg.addColorStop(0, '#fff'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(x, y, r * 0.25, 0, TWO_PI_SK); ctx.fill();
        // 星点
        if (this.quality.detailLevel >= 1) {
            ctx.fillStyle = '#fff';
            const cnt = this.quality.detailLevel >= 3 ? 18 : 9;
            for (let i = 0; i < cnt; i++) {
                const sa = (i / cnt) * TWO_PI_SK + t * 0.25;
                const sd = r * (0.3 + Math.sin(i * 1.7 + t) * 0.35);
                const ss = 1 + Math.sin(t * 3 + i * 2) * 0.6;
                ctx.globalAlpha = 0.5 + Math.sin(t * 2 + i) * 0.3;
                ctx.beginPath(); ctx.arc(x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, ss, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    _proj_nebula(ctx, x, y, r, angle) {
        // 星光弹 - 旋转四芒星
        ctx.save(); ctx.translate(x, y); ctx.rotate(this._time * 8);
        const hue = (this._time * 80 + 240) % 360;
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * TWO_PI_SK;
            ctx.fillStyle = `hsla(${(hue + i * 40) % 360}, 85%, 70%, 0.8)`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a - 0.15) * r * 0.4, Math.sin(a - 0.15) * r * 0.4);
            ctx.lineTo(Math.cos(a) * r * 1.6, Math.sin(a) * r * 1.6);
            ctx.lineTo(Math.cos(a + 0.15) * r * 0.4, Math.sin(a + 0.15) * r * 0.4);
            ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r, '#aa44ff', 0.35);
    }

    // 黑洞 - 事件视界+吸积盘+引力透镜
    _body_blackhole(ctx, x, y, r, angle) {
        const t = this._time;
        // 吸积盘
        if (this.quality.detailLevel >= 1) {
            ctx.save(); ctx.translate(x, y); ctx.rotate(t * 1.5);
            const diskColors = ['#ff6600', '#ffcc00', '#ff4400'];
            for (let i = 0; i < 3; i++) {
                ctx.globalAlpha = 0.35 - i * 0.08;
                ctx.strokeStyle = diskColors[i]; ctx.lineWidth = r * (0.12 - i * 0.02);
                ctx.beginPath(); ctx.ellipse(0, 0, r * (1.6 - i * 0.15), r * (0.4 - i * 0.05), 0, 0, TWO_PI_SK); ctx.stroke();
            }
            ctx.restore();
        }
        // 事件视界(黑核)
        const eg = ctx.createRadialGradient(x, y, 0, x, y, r);
        eg.addColorStop(0, '#000'); eg.addColorStop(0.75, '#000'); eg.addColorStop(1, 'rgba(20,0,40,0.8)');
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.fill();
        // 边缘光环
        ctx.save();
        ctx.strokeStyle = '#ffaa00'; ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.5 + Math.sin(t * 4) * 0.25;
        ctx.beginPath(); ctx.arc(x, y, r * 1.05, 0, TWO_PI_SK); ctx.stroke();
        ctx.restore();
        // 引力透镜粒子(极致)
        if (this.quality.detailLevel >= 3) {
            ctx.save();
            for (let i = 0; i < 16; i++) {
                const la = (i / 16) * TWO_PI_SK + t * 3;
                const ld = r * (1.15 + Math.sin(t * 5 + i) * 0.15);
                ctx.globalAlpha = 0.4;
                ctx.fillStyle = i % 3 === 0 ? '#ff6600' : (i % 3 === 1 ? '#ffcc00' : '#ff4400');
                ctx.beginPath(); ctx.arc(x + Math.cos(la) * ld, y + Math.sin(la) * ld, 1.5, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        // 中心微光
        ctx.save(); ctx.globalAlpha = 0.15;
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 0.3);
        cg.addColorStop(0, '#ffaa00'); cg.addColorStop(1, 'transparent');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, TWO_PI_SK); ctx.fill();
        ctx.restore();
    }

    _proj_blackhole(ctx, x, y, r, angle) {
        // 引力球 - 黑核+扭曲环
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, TWO_PI_SK); ctx.fill();
        ctx.save();
        ctx.strokeStyle = '#ff8800'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
        ctx.translate(x, y); ctx.rotate(this._time * 6);
        ctx.beginPath(); ctx.ellipse(0, 0, r * 1.1, r * 0.4, 0, 0, TWO_PI_SK); ctx.stroke();
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.6, '#ff6600', 0.25);
    }

    // 凤凰 - 火焰鸟形+展翼+羽翼
    _body_phoenix(ctx, x, y, r, angle) {
        const t = this._time;
        this._shadow(ctx, x, y, r);
        // 火焰翅膀
        const wingSpread = 0.8 + Math.sin(t * 4) * 0.25;
        if (this.quality.detailLevel >= 1) {
            for (let s = -1; s <= 1; s += 2) {
                ctx.save(); ctx.globalAlpha = 0.55;
                const wAngle = angle + Math.PI * 0.5 * s * wingSpread + Math.PI;
                // 多层翼
                const layers = this.quality.detailLevel >= 3 ? 3 : 2;
                for (let l = layers - 1; l >= 0; l--) {
                    const wr = r * (1.0 + l * 0.35);
                    const wx = x + Math.cos(wAngle) * r * (0.4 + l * 0.2);
                    const wy = y + Math.sin(wAngle) * r * (0.4 + l * 0.2);
                    const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, wr);
                    wg.addColorStop(0, l === 0 ? '#ffee88' : '#ffaa00');
                    wg.addColorStop(0.5, '#ff6600');
                    wg.addColorStop(1, 'transparent');
                    ctx.fillStyle = wg;
                    ctx.beginPath(); ctx.arc(wx, wy, wr, 0, TWO_PI_SK); ctx.fill();
                }
                ctx.restore();
            }
        }
        this._glow(ctx, x, y, r, '#ff6600', 0.3);
        // 身体核心
        const bg = ctx.createRadialGradient(x, y, 0, x, y, r);
        bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.2, '#ffee88'); bg.addColorStop(0.5, '#ffaa00'); bg.addColorStop(0.8, '#ff5500'); bg.addColorStop(1, '#cc2200');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, TWO_PI_SK); ctx.fill();
        // 尾羽(身后拖曳)
        if (this.quality.detailLevel >= 2) {
            const tailA = angle + Math.PI;
            ctx.save(); ctx.globalAlpha = 0.4;
            for (let i = 0; i < 5; i++) {
                const ta = tailA + (i - 2) * 0.2;
                const tl = r * (1.5 + i * 0.3 + Math.sin(t * 3 + i) * 0.3);
                const tx = x + Math.cos(ta) * tl;
                const ty = y + Math.sin(ta) * tl;
                const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, r * 0.35);
                tg.addColorStop(0, i % 2 ? '#ffcc00' : '#ff6600'); tg.addColorStop(1, 'transparent');
                ctx.fillStyle = tg;
                ctx.beginPath(); ctx.arc(tx, ty, r * 0.35, 0, TWO_PI_SK); ctx.fill();
            }
            ctx.restore();
        }
        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.1, 3, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.2, y - r * 0.1, 3, 0, TWO_PI_SK); ctx.fill();
        ctx.fillStyle = '#cc0000';
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.1, 1.5, 0, TWO_PI_SK); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.2, y - r * 0.1, 1.5, 0, TWO_PI_SK); ctx.fill();
    }

    _proj_phoenix(ctx, x, y, r, angle) {
        // 火焰羽毛弹
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createLinearGradient(-r, 0, r * 1.5, 0);
        g.addColorStop(0, '#ffee88'); g.addColorStop(0.3, '#ffaa00'); g.addColorStop(0.7, '#ff4400'); g.addColorStop(1, '#cc1100');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-r * 0.8, 0);
        ctx.quadraticCurveTo(0, -r * 0.5, r * 1.2, 0);
        ctx.quadraticCurveTo(0, r * 0.5, -r * 0.8, 0);
        ctx.fill();
        ctx.restore();
        if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.6, '#ff6600', 0.3);
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
        Utils.shake(5);
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
        Utils.shake(8);
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
        Utils.shake(6);
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
        Utils.shake(5);
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
        Utils.shake(7);
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
        Utils.shake(10);
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
        Utils.shake(6);
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
        Utils.shake(7);
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
        Utils.shake(9);
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
        Utils.shake(5);
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
        Utils.shake(9);
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
        Utils.shake(8);
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
        Utils.shake(12);
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
