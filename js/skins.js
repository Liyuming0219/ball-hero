// ============================================
// 皮肤系统 - 形态变更 + 攻击特效 + 技能特效
// 支持水果/动物/材质/宇宙等多系列主题
// 画质分档：低/中/高/极致
// ============================================

// --- 画质等级配置 ---
const QualityLevels = {
    low: {
        name: '流畅', desc: '最低粒子，无光影',
        particleMult: 0.3, trailLength: 3,
        glowEnabled: false, shadowEnabled: false, shakeEnabled: false,
        detailLevel: 0, bgEffects: false, reflections: false,
    },
    medium: {
        name: '均衡', desc: '适中粒子，基础光影',
        particleMult: 0.6, trailLength: 6,
        glowEnabled: true, shadowEnabled: false, shakeEnabled: true,
        detailLevel: 1, bgEffects: false, reflections: false,
    },
    high: {
        name: '高画质', desc: '完整粒子，全特效',
        particleMult: 1.0, trailLength: 12,
        glowEnabled: true, shadowEnabled: true, shakeEnabled: true,
        detailLevel: 2, bgEffects: true, reflections: false,
    },
    ultra: {
        name: '极致', desc: '狂拽酷炫吊炸天',
        particleMult: 1.8, trailLength: 20,
        glowEnabled: true, shadowEnabled: true, shakeEnabled: true,
        detailLevel: 3, bgEffects: true, reflections: true,
    },
};

// --- 皮肤系列定义 ---
const SkinSeries = {
    fruit: {
        name: '水果派对', icon: '🍉', tier: 1,
        skins: {
            watermelon: {
                id: 'watermelon', name: '西瓜勇士', series: 'fruit', tier: 1,
                icon: '🍉', price: 500,
                desc: '清凉一夏！圆滚滚的西瓜横冲直撞',
                shape: { type: 'pattern', baseColor: '#2d7a3a', stripeColor: '#1a4d24', innerColor: '#ff4d4d', renderer: 'drawWatermelon' },
                attackFx: { projectileRenderer: 'drawSeedBullet', trailColors: ['#ff4d4d', '#2d7a3a', '#1a4d24'], hitEffect: 'watermelonSplash', hitColors: ['#ff4d4d', '#ff6b6b', '#2d7a3a', '#fff'] },
                skillFx: { castEffect: 'fruitBurst', castColors: ['#ff4d4d', '#2d7a3a', '#ffaa00'], auraColor: 'rgba(45,122,58,0.15)' },
                moveFx: { trailType: 'leaves', trailColors: ['#2d7a3a', '#4d9a5a', '#1a4d24'] },
            },
            strawberry: {
                id: 'strawberry', name: '草莓甜心', series: 'fruit', tier: 1,
                icon: '🍓', price: 500,
                desc: '粉红少女心，每一击带着甜蜜',
                shape: { type: 'pattern', baseColor: '#ff4466', dotColor: '#ffdd44', leafColor: '#44aa44', renderer: 'drawStrawberry' },
                attackFx: { projectileRenderer: 'drawHeartBullet', trailColors: ['#ff4466', '#ff88aa', '#ffccdd'], hitEffect: 'heartBurst', hitColors: ['#ff4466', '#ff88aa', '#fff'] },
                skillFx: { castEffect: 'petalStorm', castColors: ['#ff4466', '#ff88aa', '#ffccdd', '#fff'], auraColor: 'rgba(255,68,102,0.12)' },
                moveFx: { trailType: 'petals', trailColors: ['#ff4466', '#ff88aa', '#ffccdd'] },
            },
            orange: {
                id: 'orange', name: '橙子爆弹', series: 'fruit', tier: 1,
                icon: '🍊', price: 500,
                desc: '维C能量，弹射喷出橙汁',
                shape: { type: 'pattern', baseColor: '#ff8800', segmentColor: '#ffaa33', renderer: 'drawOrange' },
                attackFx: { projectileRenderer: 'drawJuiceDrop', trailColors: ['#ff8800', '#ffaa33', '#ffcc66'], hitEffect: 'juiceSplash', hitColors: ['#ff8800', '#ffaa33', '#fff'] },
                skillFx: { castEffect: 'citrusBurst', castColors: ['#ff8800', '#ffcc00', '#fff'], auraColor: 'rgba(255,136,0,0.12)' },
                moveFx: { trailType: 'sparkle', trailColors: ['#ff8800', '#ffcc66'] },
            },
        },
    },
    animal: {
        name: '萌宠乐园', icon: '🦊', tier: 2,
        skins: {
            fox: {
                id: 'fox', name: '灵狐', series: 'animal', tier: 2,
                icon: '🦊', price: 1500,
                desc: '狡猾灵狐，攻击释放火焰尾巴',
                shape: { type: 'vector', baseColor: '#ff6622', bellyColor: '#fff5e0', earColor: '#cc4400', renderer: 'drawFox' },
                attackFx: { projectileRenderer: 'drawFoxFire', trailColors: ['#ff6622', '#ff8844', '#ffaa66', '#fff'], hitEffect: 'foxFlame', hitColors: ['#ff6622', '#ffaa00', '#fff'] },
                skillFx: { castEffect: 'foxSpirit', castColors: ['#ff6622', '#ff8844', '#fff5e0'], auraColor: 'rgba(255,102,34,0.15)' },
                moveFx: { trailType: 'flame', trailColors: ['#ff6622', '#ff8844', '#ffcc66'] },
            },
            dragon: {
                id: 'dragon', name: '幼龙', series: 'animal', tier: 2,
                icon: '🐲', price: 2000,
                desc: '小龙蕴含远古之力，吐息焚天',
                shape: { type: 'vector', baseColor: '#6644cc', scaleColor: '#8866ee', wingColor: '#9977ff', renderer: 'drawDragon' },
                attackFx: { projectileRenderer: 'drawDragonBreath', trailColors: ['#6644cc', '#9977ff', '#ff6644', '#ffcc00'], hitEffect: 'dragonExplosion', hitColors: ['#6644cc', '#ff6644', '#ffcc00', '#fff'] },
                skillFx: { castEffect: 'dragonRoar', castColors: ['#6644cc', '#ff4422', '#ffcc00', '#fff'], auraColor: 'rgba(102,68,204,0.18)' },
                moveFx: { trailType: 'dragonScale', trailColors: ['#6644cc', '#9977ff', '#ccbbff'] },
            },
            cat: {
                id: 'cat', name: '暗影猫', series: 'animal', tier: 2,
                icon: '🐱', price: 1500,
                desc: '神秘黑猫，攻击附带暗影之爪',
                shape: { type: 'vector', baseColor: '#2a2a3e', earColor: '#ff66aa', eyeColor: '#44ffaa', renderer: 'drawCat' },
                attackFx: { projectileRenderer: 'drawShadowClaw', trailColors: ['#2a2a3e', '#44ffaa', '#66ffcc'], hitEffect: 'shadowSlash', hitColors: ['#2a2a3e', '#44ffaa', '#fff'] },
                skillFx: { castEffect: 'shadowMist', castColors: ['#2a2a3e', '#44ffaa', '#000'], auraColor: 'rgba(42,42,62,0.2)' },
                moveFx: { trailType: 'shadow', trailColors: ['#2a2a3e', '#44ffaa'] },
            },
        },
    },
    material: {
        name: '珍宝奇石', icon: '💎', tier: 3,
        skins: {
            diamond: {
                id: 'diamond', name: '钻石之心', series: 'material', tier: 3,
                icon: '💎', price: 3000,
                desc: '每次攻击折射出七彩棱光',
                shape: { type: 'vector', baseColor: '#88ccff', facetColors: ['#aaddff', '#66bbff', '#44aaee', '#cceeff', '#fff'], renderer: 'drawDiamond' },
                attackFx: { projectileRenderer: 'drawPrismShard', trailColors: ['#88ccff', '#ff88cc', '#88ff88', '#ffff88', '#fff'], hitEffect: 'prismShatter', hitColors: ['#88ccff', '#ff88cc', '#88ff88', '#ffff88', '#fff'] },
                skillFx: { castEffect: 'diamondRefract', castColors: ['#88ccff', '#ff88cc', '#88ff88', '#ffff88'], auraColor: 'rgba(136,204,255,0.2)' },
                moveFx: { trailType: 'crystal', trailColors: ['#88ccff', '#aaddff', '#fff'] },
            },
            ruby: {
                id: 'ruby', name: '红宝石', series: 'material', tier: 3,
                icon: '❤️‍🔥', price: 3000,
                desc: '燃烧的红宝石蕴含毁灭之焰',
                shape: { type: 'vector', baseColor: '#cc2244', facetColors: ['#ff3355', '#aa1133', '#ff6677', '#dd2244'], coreGlow: '#ff4466', renderer: 'drawRuby' },
                attackFx: { projectileRenderer: 'drawRubyBolt', trailColors: ['#cc2244', '#ff3355', '#ff6677', '#ffaa44'], hitEffect: 'rubyIgnite', hitColors: ['#cc2244', '#ff4422', '#ffaa00', '#fff'] },
                skillFx: { castEffect: 'rubyInferno', castColors: ['#cc2244', '#ff4422', '#ffcc00', '#fff'], auraColor: 'rgba(204,34,68,0.2)' },
                moveFx: { trailType: 'ember', trailColors: ['#cc2244', '#ff4422', '#ffaa44'] },
            },
            emerald: {
                id: 'emerald', name: '翡翠之灵', series: 'material', tier: 3,
                icon: '💚', price: 3000,
                desc: '自然之力凝结，治愈与毒素并存',
                shape: { type: 'vector', baseColor: '#22aa55', facetColors: ['#33cc66', '#11883a', '#44dd77', '#22bb55'], coreGlow: '#44ff88', renderer: 'drawEmerald' },
                attackFx: { projectileRenderer: 'drawVineLash', trailColors: ['#22aa55', '#44dd77', '#88ffaa', '#fff'], hitEffect: 'natureBloom', hitColors: ['#22aa55', '#44dd77', '#ffcc44', '#fff'] },
                skillFx: { castEffect: 'emeraldBloom', castColors: ['#22aa55', '#44dd77', '#ffcc44'], auraColor: 'rgba(34,170,85,0.18)' },
                moveFx: { trailType: 'leaves', trailColors: ['#22aa55', '#44dd77', '#88ffaa'] },
            },
        },
    },
    cosmic: {
        name: '星际传说', icon: '🌌', tier: 4,
        skins: {
            nebula: {
                id: 'nebula', name: '星云之子', series: 'cosmic', tier: 4,
                icon: '🌌', price: 5000,
                desc: '宇宙深处的星云生命体，释放恒星之力',
                shape: { type: 'vector', baseColor: '#4422aa', nebulaColors: ['#6644cc', '#aa44ff', '#ff44aa', '#4488ff'], coreColor: '#fff', renderer: 'drawNebula' },
                attackFx: { projectileRenderer: 'drawStarBolt', trailColors: ['#4422aa', '#aa44ff', '#ff44aa', '#fff'], hitEffect: 'supernovaBurst', hitColors: ['#4422aa', '#aa44ff', '#ff44aa', '#ffcc00', '#fff'] },
                skillFx: { castEffect: 'supernovaExplosion', castColors: ['#4422aa', '#aa44ff', '#ff44aa', '#ffcc00', '#fff'], auraColor: 'rgba(68,34,170,0.25)' },
                moveFx: { trailType: 'starfield', trailColors: ['#4422aa', '#aa44ff', '#ff44aa', '#fff'] },
            },
            blackhole: {
                id: 'blackhole', name: '黑洞吞噬者', series: 'cosmic', tier: 4,
                icon: '🕳️', price: 8000,
                desc: '连光都无法逃脱的终极存在',
                shape: { type: 'vector', baseColor: '#0a0a1a', diskColors: ['#ff6600', '#ffcc00', '#ff4400'], accretionGlow: '#ffaa00', renderer: 'drawBlackHole' },
                attackFx: { projectileRenderer: 'drawGravityOrb', trailColors: ['#0a0a1a', '#ff6600', '#ffcc00', '#fff'], hitEffect: 'gravityCollapse', hitColors: ['#0a0a1a', '#ff6600', '#ffcc00', '#fff'] },
                skillFx: { castEffect: 'eventHorizon', castColors: ['#0a0a1a', '#ff6600', '#4400ff', '#fff'], auraColor: 'rgba(10,10,26,0.35)' },
                moveFx: { trailType: 'warp', trailColors: ['#0a0a1a', '#220044', '#ff6600'] },
            },
            phoenix: {
                id: 'phoenix', name: '不死凤凰', series: 'cosmic', tier: 4,
                icon: '🔥', price: 6000,
                desc: '浴火重生的神鸟，烈焰为永恒外衣',
                shape: { type: 'vector', baseColor: '#ff4400', featherColors: ['#ff6600', '#ffaa00', '#ffcc00', '#ff2200'], coreColor: '#fff', renderer: 'drawPhoenix' },
                attackFx: { projectileRenderer: 'drawPhoenixFeather', trailColors: ['#ff4400', '#ffaa00', '#ffcc00', '#fff'], hitEffect: 'phoenixFlare', hitColors: ['#ff4400', '#ff8800', '#ffcc00', '#fff'] },
                skillFx: { castEffect: 'phoenixRebirth', castColors: ['#ff4400', '#ffaa00', '#fff', '#ff2200'], auraColor: 'rgba(255,68,0,0.2)' },
                moveFx: { trailType: 'phoenixTrail', trailColors: ['#ff4400', '#ffaa00', '#ffcc00', '#fff'] },
            },
        },
    },
};

// --- 皮肤管理器 ---
// 金币与 MetaProgress 共享（统一经济系统）
class SkinManager {
    constructor() {
        this.ownedSkins = this._load('ownedSkins', []);
        this.equippedSkins = this._load('equippedSkins', {});
        this.qualityLevel = this._loadQuality();
    }
    // 金币属性：直接读写 MetaProgress 的金币（统一金币池）
    get gold() {
        if (typeof MetaProgress !== 'undefined') return MetaProgress.data.gold;
        return 0;
    }
    set gold(val) {
        if (typeof MetaProgress !== 'undefined') { MetaProgress.data.gold = val; MetaProgress.save(); }
    }
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
        // 全职业通用：同一皮肤装备到所有角色
        if (skinId) {
            for (const cid of Object.keys(CharacterDefs || {})) {
                this.equippedSkins[cid] = skinId;
            }
        } else {
            this.equippedSkins[charId] = null;
        }
        this._save('equippedSkins', this.equippedSkins);
        return true;
    }
    unequipAll() {
        for (const cid of Object.keys(this.equippedSkins)) this.equippedSkins[cid] = null;
        this._save('equippedSkins', this.equippedSkins);
    }
    // 获取当前装备的皮肤（任意角色，用于UI显示）
    getAnyEquippedSkinId() {
        for (const cid of Object.keys(this.equippedSkins)) {
            if (this.equippedSkins[cid]) return this.equippedSkins[cid];
        }
        return null;
    }
    _load(key, def) { try { return JSON.parse(localStorage.getItem(key)) || def; } catch { return def; } }
    _save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
    _loadQuality() { const q = localStorage.getItem('skinQuality'); return QualityLevels[q] ? q : (window.innerWidth > 1200 ? 'high' : 'medium'); }
}

// --- 皮肤渲染器 ---
class SkinRenderer {
    constructor(qualityCfg) {
        this.quality = qualityCfg || QualityLevels.high;
        this._time = 0;
    }
    setQuality(q) { this.quality = q; }
    update(dt) { this._time += dt; }

    // ===== 主渲染入口 =====
    renderBody(ctx, skin, x, y, radius, facingAngle, bob, alpha) {
        if (!skin || !skin.shape) return false;
        const fn = this[skin.shape.renderer];
        if (!fn) return false;
        ctx.save();
        ctx.globalAlpha = alpha || 1;
        fn.call(this, ctx, skin.shape, x, y + (bob || 0), radius, facingAngle);
        ctx.restore();
        return true;
    }

    renderProjectile(ctx, skin, x, y, radius, angle) {
        if (!skin || !skin.attackFx || !skin.attackFx.projectileRenderer) return false;
        const fn = this[skin.attackFx.projectileRenderer];
        if (!fn) return false;
        ctx.save();
        fn.call(this, ctx, skin, x, y, radius, angle);
        ctx.restore();
        return true;
    }

    // ===== 辅助 =====
    _glow(ctx, x, y, r, color, alpha) {
        if (!this.quality.glowEnabled) return;
        ctx.save();
        ctx.globalAlpha = alpha || 0.3;
        const g = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 1.5);
        g.addColorStop(0, color);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    _highlight(ctx, x, y, r) {
        if (this.quality.detailLevel < 1) return;
        const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, 0, x, y, r);
        g.addColorStop(0, 'rgba(255,255,255,0.4)');
        g.addColorStop(0.4, 'rgba(255,255,255,0.08)');
        g.addColorStop(1, 'rgba(0,0,0,0.1)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    _shimmer(ctx, x, y, r) {
        if (this.quality.detailLevel < 3) return;
        const t = this._time * 2;
        const sx = x + Math.cos(t) * r * 0.35;
        const sy = y + Math.sin(t * 0.7) * r * 0.3;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.45);
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // ===== 水果系列 =====
    drawWatermelon(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.baseColor, 0.2);
        // 底色
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 条纹
        ctx.save();
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
        ctx.strokeStyle = shape.stripeColor;
        ctx.lineWidth = r * 0.12;
        const stripeCount = this.quality.detailLevel >= 2 ? 7 : 5;
        for (let i = 0; i < stripeCount; i++) {
            const a = (i / stripeCount) * Math.PI + angle;
            ctx.beginPath();
            ctx.moveTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3);
            ctx.quadraticCurveTo(x, y, x - Math.cos(a) * r * 1.3, y - Math.sin(a) * r * 1.3);
            ctx.stroke();
        }
        ctx.restore();
        this._highlight(ctx, x, y, r);
        this._shimmer(ctx, x, y, r);
    }

    drawStrawberry(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.baseColor, 0.15);
        // 主体（心形轮廓近似）
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y + r * 0.08, r, 0, Math.PI * 2); ctx.fill();
        // 籽粒
        ctx.save();
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
        ctx.fillStyle = shape.dotColor;
        const seeds = this.quality.detailLevel >= 2 ? 14 : 8;
        for (let i = 0; i < seeds; i++) {
            const sa = (i / seeds) * Math.PI * 2 + this._time * 0.15;
            const sd = r * (0.35 + (i % 3) * 0.15);
            ctx.beginPath();
            ctx.ellipse(x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, 1.5, 2.5, sa, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
        // 叶子冠
        ctx.fillStyle = shape.leafColor;
        for (let i = -1; i <= 1; i++) {
            ctx.save();
            ctx.translate(x + i * r * 0.25, y - r * 0.85);
            ctx.rotate(i * 0.3);
            ctx.beginPath(); ctx.ellipse(0, 0, 4, 9, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
        }
        this._highlight(ctx, x, y, r);
        this._shimmer(ctx, x, y, r);
    }

    drawOrange(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.baseColor, 0.15);
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 果瓣纹理
        ctx.save();
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
        ctx.strokeStyle = shape.segmentColor;
        ctx.lineWidth = 1.5;
        const segs = this.quality.detailLevel >= 2 ? 10 : 6;
        for (let i = 0; i < segs; i++) {
            const a = (i / segs) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
            ctx.stroke();
        }
        ctx.restore();
        // 顶部小叶
        ctx.fillStyle = '#44aa22';
        ctx.beginPath(); ctx.ellipse(x, y - r * 0.9, 3, 6, 0, 0, Math.PI * 2); ctx.fill();
        this._highlight(ctx, x, y, r);
        this._shimmer(ctx, x, y, r);
    }

    // ===== 动物系列 =====
    drawFox(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.baseColor, 0.2);
        // 身体
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 肚皮
        ctx.fillStyle = shape.bellyColor;
        ctx.beginPath(); ctx.arc(x, y + r * 0.2, r * 0.6, 0, Math.PI * 2); ctx.fill();
        // 耳朵
        ctx.fillStyle = shape.earColor;
        const earH = r * 0.7;
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(x + side * r * 0.5, y - r * 0.6);
            ctx.lineTo(x + side * r * 0.8, y - r - earH * 0.5);
            ctx.lineTo(x + side * r * 0.2, y - r * 0.8);
            ctx.closePath(); ctx.fill();
        }
        // 眼睛
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.25, y - r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
        // 鼻子
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.arc(x, y + r * 0.15, 2.5, 0, Math.PI * 2); ctx.fill();
        // 尾巴火焰（高画质）
        if (this.quality.detailLevel >= 2) {
            const tailAngle = angle + Math.PI + Math.sin(this._time * 3) * 0.3;
            const tailX = x + Math.cos(tailAngle) * r * 1.3;
            const tailY = y + Math.sin(tailAngle) * r * 1.3;
            const tg = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, r * 0.8);
            tg.addColorStop(0, '#ffcc00');
            tg.addColorStop(0.5, '#ff6600');
            tg.addColorStop(1, 'rgba(255,68,0,0)');
            ctx.fillStyle = tg;
            ctx.beginPath(); ctx.arc(tailX, tailY, r * 0.8, 0, Math.PI * 2); ctx.fill();
        }
        this._highlight(ctx, x, y, r);
    }

    drawDragon(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.baseColor, 0.25);
        // 鳞片身体
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 鳞片纹理
        if (this.quality.detailLevel >= 1) {
            ctx.save();
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
            ctx.strokeStyle = shape.scaleColor;
            ctx.lineWidth = 1;
            const rows = this.quality.detailLevel >= 2 ? 5 : 3;
            for (let row = 0; row < rows; row++) {
                const ry = y - r + (row + 1) * (2 * r / (rows + 1));
                for (let col = 0; col < 6; col++) {
                    const rx = x - r + (col + (row % 2) * 0.5) * (2 * r / 6);
                    ctx.beginPath();
                    ctx.arc(rx, ry, r * 0.18, Math.PI * 0.8, Math.PI * 2.2);
                    ctx.stroke();
                }
            }
            ctx.restore();
        }
        // 小翅膀
        ctx.fillStyle = shape.wingColor;
        ctx.globalAlpha = 0.7;
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(x + side * r * 0.6, y - r * 0.3);
            ctx.quadraticCurveTo(x + side * r * 1.8, y - r * 1.2, x + side * r * 1.4, y + r * 0.2);
            ctx.quadraticCurveTo(x + side * r * 1.0, y, x + side * r * 0.6, y - r * 0.3);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        // 角
        ctx.fillStyle = '#ffcc44';
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(x + side * r * 0.3, y - r * 0.8);
            ctx.lineTo(x + side * r * 0.4, y - r * 1.4);
            ctx.lineTo(x + side * r * 0.15, y - r * 0.9);
            ctx.closePath(); ctx.fill();
        }
        // 眼睛
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.15, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.25, y - r * 0.15, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.15, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.25, y - r * 0.15, 1.5, 0, Math.PI * 2); ctx.fill();
        this._shimmer(ctx, x, y, r);
    }

    drawCat(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.eyeColor, 0.15);
        // 身体
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 耳朵
        ctx.fillStyle = shape.baseColor;
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(x + side * r * 0.4, y - r * 0.7);
            ctx.lineTo(x + side * r * 0.7, y - r * 1.3);
            ctx.lineTo(x + side * r * 0.1, y - r * 0.9);
            ctx.closePath(); ctx.fill();
            // 内耳
            ctx.fillStyle = shape.earColor;
            ctx.beginPath();
            ctx.moveTo(x + side * r * 0.45, y - r * 0.75);
            ctx.lineTo(x + side * r * 0.62, y - r * 1.15);
            ctx.lineTo(x + side * r * 0.2, y - r * 0.85);
            ctx.closePath(); ctx.fill();
            ctx.fillStyle = shape.baseColor;
        }
        // 眼睛（发光猫眼）
        ctx.fillStyle = shape.eyeColor;
        ctx.beginPath(); ctx.ellipse(x - r * 0.25, y - r * 0.05, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.25, y - r * 0.05, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
        // 竖瞳
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(x - r * 0.25, y - r * 0.05, 1.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(x + r * 0.25, y - r * 0.05, 1.5, 4, 0, 0, Math.PI * 2); ctx.fill();
        // 胡须
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 0.8;
        for (let side = -1; side <= 1; side += 2) {
            for (let i = -1; i <= 1; i++) {
                ctx.beginPath();
                ctx.moveTo(x + side * r * 0.3, y + r * 0.15);
                ctx.lineTo(x + side * r * 0.9, y + r * (0.05 + i * 0.12));
                ctx.stroke();
            }
        }
        this._highlight(ctx, x, y, r);
    }

    // ===== 材质系列 =====
    drawDiamond(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, '#88ccff', 0.35);
        // 多面体
        const facets = 8;
        const colors = shape.facetColors;
        for (let i = 0; i < facets; i++) {
            const a1 = (i / facets) * Math.PI * 2 + this._time * 0.5;
            const a2 = ((i + 1) / facets) * Math.PI * 2 + this._time * 0.5;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a1) * r, y + Math.sin(a1) * r);
            ctx.lineTo(x + Math.cos(a2) * r, y + Math.sin(a2) * r);
            ctx.closePath(); ctx.fill();
        }
        // 边线
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < facets; i++) {
            const a = (i / facets) * Math.PI * 2 + this._time * 0.5;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
            ctx.stroke();
        }
        // 彩虹折射（高画质）
        if (this.quality.detailLevel >= 2) {
            const rAngle = this._time * 1.5;
            for (let i = 0; i < 3; i++) {
                const ra = rAngle + i * Math.PI * 2 / 3;
                const rx = x + Math.cos(ra) * r * 0.5;
                const ry = y + Math.sin(ra) * r * 0.5;
                const rg = ctx.createRadialGradient(rx, ry, 0, rx, ry, r * 0.4);
                rg.addColorStop(0, `hsla(${(this._time * 60 + i * 120) % 360}, 100%, 70%, 0.4)`);
                rg.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = rg;
                ctx.beginPath(); ctx.arc(rx, ry, r * 0.4, 0, Math.PI * 2); ctx.fill();
            }
        }
        this._shimmer(ctx, x, y, r);
    }

    drawRuby(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.coreGlow, 0.3);
        // 六面体
        const facets = 6;
        const colors = shape.facetColors;
        for (let i = 0; i < facets; i++) {
            const a1 = (i / facets) * Math.PI * 2;
            const a2 = ((i + 1) / facets) * Math.PI * 2;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a1) * r, y + Math.sin(a1) * r);
            ctx.lineTo(x + Math.cos(a2) * r, y + Math.sin(a2) * r);
            ctx.closePath(); ctx.fill();
        }
        // 内核发光
        const coreR = r * (0.4 + Math.sin(this._time * 3) * 0.1);
        const cg = ctx.createRadialGradient(x, y, 0, x, y, coreR);
        cg.addColorStop(0, '#fff');
        cg.addColorStop(0.5, shape.coreGlow);
        cg.addColorStop(1, 'rgba(255,0,0,0)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(x, y, coreR, 0, Math.PI * 2); ctx.fill();
        // 火焰边缘（极致）
        if (this.quality.detailLevel >= 3) {
            for (let i = 0; i < 8; i++) {
                const fa = (i / 8) * Math.PI * 2 + this._time * 2;
                const fd = r * (0.9 + Math.sin(this._time * 4 + i) * 0.15);
                const fx = x + Math.cos(fa) * fd;
                const fy = y + Math.sin(fa) * fd;
                const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 0.25);
                fg.addColorStop(0, 'rgba(255,68,34,0.5)');
                fg.addColorStop(1, 'rgba(255,68,34,0)');
                ctx.fillStyle = fg;
                ctx.beginPath(); ctx.arc(fx, fy, r * 0.25, 0, Math.PI * 2); ctx.fill();
            }
        }
    }

    drawEmerald(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.coreGlow, 0.25);
        // 六角形
        ctx.fillStyle = shape.baseColor;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        // 内部晶格
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.clip();
        const colors = shape.facetColors;
        ctx.strokeStyle = colors[2];
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            ctx.beginPath(); ctx.moveTo(x, y);
            ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
            ctx.stroke();
        }
        ctx.restore();
        // 自然光环（枝蔓）
        if (this.quality.detailLevel >= 2) {
            ctx.strokeStyle = 'rgba(68,221,119,0.4)';
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 4; i++) {
                const va = (i / 4) * Math.PI * 2 + this._time * 0.5;
                const vr = r * 1.2;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(va) * r * 0.8, y + Math.sin(va) * r * 0.8);
                ctx.quadraticCurveTo(
                    x + Math.cos(va + 0.3) * vr,
                    y + Math.sin(va + 0.3) * vr,
                    x + Math.cos(va + 0.6) * r * 0.9,
                    y + Math.sin(va + 0.6) * r * 0.9
                );
                ctx.stroke();
            }
        }
        this._shimmer(ctx, x, y, r);
    }

    // ===== 宇宙系列 =====
    drawNebula(ctx, shape, x, y, r, angle) {
        this._glow(ctx, x, y, r, shape.nebulaColors[1], 0.4);
        // 星云气体层
        const colors = shape.nebulaColors;
        for (let i = colors.length - 1; i >= 0; i--) {
            const layerR = r * (0.5 + i * 0.2);
            const offsetA = this._time * (0.5 + i * 0.2);
            const ox = Math.cos(offsetA) * r * 0.1 * i;
            const oy = Math.sin(offsetA * 0.7) * r * 0.1 * i;
            ctx.globalAlpha = 0.5 + i * 0.1;
            const g = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, layerR);
            g.addColorStop(0, colors[i]);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(x + ox, y + oy, layerR, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        // 核心白点
        const cg = ctx.createRadialGradient(x, y, 0, x, y, r * 0.3);
        cg.addColorStop(0, '#ffffff');
        cg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = cg;
        ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, Math.PI * 2); ctx.fill();
        // 星点
        if (this.quality.detailLevel >= 1) {
            ctx.fillStyle = '#fff';
            const starCount = this.quality.detailLevel >= 3 ? 15 : 8;
            for (let i = 0; i < starCount; i++) {
                const sa = (i / starCount) * Math.PI * 2 + this._time * 0.3;
                const sd = r * (0.4 + Math.sin(i * 1.7 + this._time) * 0.3);
                const ss = 1 + Math.sin(this._time * 3 + i * 2) * 0.5;
                ctx.globalAlpha = 0.6 + Math.sin(this._time * 2 + i) * 0.3;
                ctx.beginPath(); ctx.arc(x + Math.cos(sa) * sd, y + Math.sin(sa) * sd, ss, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    drawBlackHole(ctx, shape, x, y, r, angle) {
        // 吸积盘
        const diskColors = shape.diskColors;
        const diskR = r * 1.6;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this._time * 1.5);
        for (let i = 0; i < 3; i++) {
            ctx.globalAlpha = 0.4 - i * 0.1;
            ctx.strokeStyle = diskColors[i % diskColors.length];
            ctx.lineWidth = r * (0.15 - i * 0.03);
            ctx.beginPath();
            ctx.ellipse(0, 0, diskR - i * r * 0.15, diskR * 0.35 - i * r * 0.05, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
        ctx.globalAlpha = 1;
        // 事件视界（黑核）
        const eg = ctx.createRadialGradient(x, y, 0, x, y, r);
        eg.addColorStop(0, '#000000');
        eg.addColorStop(0.7, '#000000');
        eg.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = eg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 边缘引力光环
        ctx.strokeStyle = shape.accretionGlow;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6 + Math.sin(this._time * 4) * 0.3;
        ctx.beginPath(); ctx.arc(x, y, r * 1.05, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
        // 引力透镜效果（极致）
        if (this.quality.detailLevel >= 3) {
            for (let i = 0; i < 12; i++) {
                const la = (i / 12) * Math.PI * 2 + this._time * 3;
                const ld = r * (1.1 + Math.sin(this._time * 5 + i) * 0.2);
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = diskColors[i % diskColors.length];
                ctx.beginPath(); ctx.arc(x + Math.cos(la) * ld, y + Math.sin(la) * ld, 2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    drawPhoenix(ctx, shape, x, y, r, angle) {
        // 火焰翅膀
        const wingSpread = Math.sin(this._time * 4) * 0.3 + 1;
        if (this.quality.detailLevel >= 1) {
            ctx.globalAlpha = 0.6;
            for (let side = -1; side <= 1; side += 2) {
                const wAngle = angle + side * (Math.PI / 3) * wingSpread;
                const wx = x + Math.cos(wAngle) * r * 1.5;
                const wy = y + Math.sin(wAngle) * r * 1.5;
                const wg = ctx.createRadialGradient(wx, wy, 0, wx, wy, r * 1.2);
                wg.addColorStop(0, '#ffcc00');
                wg.addColorStop(0.5, '#ff6600');
                wg.addColorStop(1, 'rgba(255,68,0,0)');
                ctx.fillStyle = wg;
                ctx.beginPath(); ctx.arc(wx, wy, r * 1.2, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        this._glow(ctx, x, y, r, '#ff6600', 0.4);
        // 身体（火焰核心）
        const bg = ctx.createRadialGradient(x, y, 0, x, y, r);
        bg.addColorStop(0, '#ffffff');
        bg.addColorStop(0.3, '#ffcc00');
        bg.addColorStop(0.7, '#ff6600');
        bg.addColorStop(1, '#ff2200');
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        // 羽毛粒子（极致）
        if (this.quality.detailLevel >= 3) {
            const feathers = shape.featherColors;
            for (let i = 0; i < 10; i++) {
                const fa = (i / 10) * Math.PI * 2 + this._time * 2;
                const fd = r * (0.8 + Math.sin(this._time * 3 + i * 0.7) * 0.4);
                ctx.globalAlpha = 0.5 + Math.sin(this._time * 2 + i) * 0.3;
                ctx.fillStyle = feathers[i % feathers.length];
                ctx.beginPath(); ctx.arc(x + Math.cos(fa) * fd, y + Math.sin(fa) * fd, 3, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        // 眼睛
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(x - r * 0.2, y - r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(x + r * 0.2, y - r * 0.1, 3, 0, Math.PI * 2); ctx.fill();
    }

    // ===== 弹幕渲染 =====
    drawSeedBullet(ctx, skin, x, y, r, angle) {
        // 西瓜籽
        ctx.fillStyle = '#1a1a1a';
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.6, r, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#3a3a3a';
        ctx.beginPath(); ctx.ellipse(0, -r * 0.2, r * 0.3, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    drawHeartBullet(ctx, skin, x, y, r, angle) {
        ctx.fillStyle = '#ff4466';
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, r * 0.3);
        ctx.bezierCurveTo(-r, -r * 0.3, -r * 0.5, -r, 0, -r * 0.4);
        ctx.bezierCurveTo(r * 0.5, -r, r, -r * 0.3, 0, r * 0.3);
        ctx.fill();
        if (this.quality.glowEnabled) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#ff88aa';
            ctx.beginPath(); ctx.arc(0, 0, r * 1.3, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
    }

    drawJuiceDrop(ctx, skin, x, y, r, angle) {
        ctx.fillStyle = '#ff8800';
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.quadraticCurveTo(r, 0, 0, r);
        ctx.quadraticCurveTo(-r, 0, 0, -r);
        ctx.fill();
        ctx.restore();
        if (this.quality.glowEnabled) {
            this._glow(ctx, x, y, r, '#ffaa33', 0.3);
        }
    }

    drawFoxFire(ctx, skin, x, y, r, angle) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
        g.addColorStop(0, '#fff');
        g.addColorStop(0.3, '#ffaa00');
        g.addColorStop(0.7, '#ff4400');
        g.addColorStop(1, 'rgba(255,68,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 1.5, 0, Math.PI * 2); ctx.fill();
    }

    drawDragonBreath(ctx, skin, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createLinearGradient(-r, 0, r * 2, 0);
        g.addColorStop(0, '#6644cc');
        g.addColorStop(0.5, '#ff4422');
        g.addColorStop(1, '#ffcc00');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, -r * 0.8);
        ctx.lineTo(r * 1.5, 0);
        ctx.lineTo(-r * 0.5, r * 0.8);
        ctx.closePath(); ctx.fill();
        ctx.restore();
    }

    drawShadowClaw(ctx, skin, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.strokeStyle = '#44ffaa';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(-r, i * r * 0.4);
            ctx.lineTo(r, i * r * 0.3);
            ctx.stroke();
        }
        ctx.restore();
        this._glow(ctx, x, y, r, '#44ffaa', 0.3);
    }

    drawPrismShard(ctx, skin, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle + this._time * 5);
        const hue = (this._time * 100) % 360;
        ctx.fillStyle = `hsl(${hue}, 80%, 70%)`;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        ctx.restore();
        this._glow(ctx, x, y, r, `hsl(${hue}, 80%, 70%)`, 0.4);
    }

    drawRubyBolt(ctx, skin, x, y, r, angle) {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.3);
        g.addColorStop(0, '#fff');
        g.addColorStop(0.4, '#ff3355');
        g.addColorStop(1, 'rgba(204,34,68,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r * 1.3, 0, Math.PI * 2); ctx.fill();
    }

    drawVineLash(ctx, skin, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        ctx.strokeStyle = '#44dd77';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.quadraticCurveTo(0, -r * 0.5, r, 0);
        ctx.stroke();
        // 叶子
        ctx.fillStyle = '#22aa55';
        ctx.beginPath(); ctx.ellipse(r * 0.5, -r * 0.3, 3, 6, -0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    drawStarBolt(ctx, skin, x, y, r, angle) {
        // 旋转星光
        ctx.save(); ctx.translate(x, y); ctx.rotate(this._time * 8);
        const hue = (this._time * 80 + 240) % 360;
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            ctx.fillStyle = `hsla(${(hue + i * 40) % 360}, 80%, 70%, 0.7)`;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a - 0.2) * r * 0.5, Math.sin(a - 0.2) * r * 0.5);
            ctx.lineTo(Math.cos(a) * r * 1.5, Math.sin(a) * r * 1.5);
            ctx.lineTo(Math.cos(a + 0.2) * r * 0.5, Math.sin(a + 0.2) * r * 0.5);
            ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        this._glow(ctx, x, y, r, '#aa44ff', 0.5);
    }

    drawGravityOrb(ctx, skin, x, y, r, angle) {
        // 黑色核心 + 扭曲边缘
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(x, y, r * 1.2, 0, Math.PI * 2); ctx.stroke();
        ctx.globalAlpha = 1;
        // 引力线
        if (this.quality.detailLevel >= 1) {
            ctx.strokeStyle = 'rgba(255,170,0,0.4)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                const la = (i / 6) * Math.PI * 2 + this._time * 4;
                ctx.beginPath();
                ctx.moveTo(x + Math.cos(la) * r * 1.3, y + Math.sin(la) * r * 1.3);
                ctx.lineTo(x + Math.cos(la) * r * 2, y + Math.sin(la) * r * 2);
                ctx.stroke();
            }
        }
    }

    drawPhoenixFeather(ctx, skin, x, y, r, angle) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createLinearGradient(-r, 0, r, 0);
        g.addColorStop(0, '#ffcc00');
        g.addColorStop(0.5, '#ff6600');
        g.addColorStop(1, '#ff2200');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.quadraticCurveTo(0, -r * 0.6, r, 0);
        ctx.quadraticCurveTo(0, r * 0.6, -r, 0);
        ctx.fill();
        ctx.restore();
        this._glow(ctx, x, y, r, '#ff6600', 0.4);
    }
}

// --- 皮肤特效系统（攻击命中/技能释放/移动拖尾的特效） ---
class SkinFxSystem {
    constructor(particles, qualityCfg) {
        this.particles = particles;
        this.quality = qualityCfg || QualityLevels.high;
        this._trailHistory = []; // 移动拖尾位置历史
    }

    setQuality(q) { this.quality = q; }

    // 攻击命中特效
    onHit(x, y, skin) {
        if (!skin || !skin.attackFx) return;
        const fx = skin.attackFx;
        const count = Math.floor(12 * this.quality.particleMult);
        this.particles.emit(x, y, count, {
            colors: fx.hitColors,
            speedMin: 2, speedMax: 8,
            sizeMin: 2, sizeMax: 7,
            lifeMin: 0.3, lifeMax: 0.8,
            friction: 0.93,
            glow: this.quality.glowEnabled,
            glowSize: 12,
        });
        if (this.quality.detailLevel >= 2) {
            this.particles.addShockwave(x, y, fx.hitColors[0], 50, 0.3);
        }
        if (this.quality.detailLevel >= 3) {
            // 极致：额外火花/碎片
            this.particles.emit(x, y, Math.floor(6 * this.quality.particleMult), {
                colors: ['#fff', fx.hitColors[1] || '#fff'],
                speedMin: 5, speedMax: 12,
                sizeMin: 1, sizeMax: 3,
                lifeMin: 0.2, lifeMax: 0.4,
                shape: 'spark',
                friction: 0.9,
            });
        }
    }

    // 技能释放特效
    onSkillCast(x, y, skin) {
        if (!skin || !skin.skillFx) return;
        const fx = skin.skillFx;
        const count = Math.floor(25 * this.quality.particleMult);
        // 主爆发
        this.particles.emit(x, y, count, {
            colors: fx.castColors,
            speedMin: 3, speedMax: 10,
            sizeMin: 3, sizeMax: 10,
            lifeMin: 0.5, lifeMax: 1.2,
            friction: 0.95,
            glow: this.quality.glowEnabled,
            glowSize: 15,
        });
        // 冲击波
        if (this.quality.detailLevel >= 1) {
            this.particles.addShockwave(x, y, fx.castColors[0], 80, 0.5);
        }
        // 二层冲击波（高画质）
        if (this.quality.detailLevel >= 2) {
            setTimeout(() => {
                this.particles.addShockwave(x, y, fx.castColors[1] || fx.castColors[0], 120, 0.7);
            }, 100);
        }
        // 极致：星辰碎片环
        if (this.quality.detailLevel >= 3) {
            for (let i = 0; i < 12; i++) {
                const a = (i / 12) * Math.PI * 2;
                const d = 40;
                setTimeout(() => {
                    this.particles.emit(x + Math.cos(a) * d, y + Math.sin(a) * d, 3, {
                        colors: fx.castColors,
                        speedMin: 1, speedMax: 3,
                        sizeMin: 4, sizeMax: 8,
                        lifeMin: 0.6, lifeMax: 1.0,
                        glow: true, glowSize: 10,
                        shape: 'star',
                    });
                }, i * 30);
            }
        }
    }

    // 移动拖尾
    emitMoveTrail(x, y, skin) {
        if (!skin || !skin.moveFx) return;
        const fx = skin.moveFx;
        const count = Math.max(1, Math.floor(2 * this.quality.particleMult));
        let shape = 'circle';
        if (fx.trailType === 'flame' || fx.trailType === 'ember') shape = 'circle';
        else if (fx.trailType === 'leaves' || fx.trailType === 'petals') shape = 'square';
        else if (fx.trailType === 'crystal' || fx.trailType === 'starfield') shape = 'star';
        else if (fx.trailType === 'shadow' || fx.trailType === 'warp') shape = 'spark';

        this.particles.emit(x, y, count, {
            colors: fx.trailColors,
            speedMin: 0.3, speedMax: 1.5,
            sizeMin: 2, sizeMax: 5,
            lifeMin: 0.3, lifeMax: 0.6,
            gravity: (fx.trailType === 'leaves' || fx.trailType === 'petals') ? 0.5 : 0,
            friction: 0.96,
            shape: shape,
            glow: this.quality.glowEnabled && (fx.trailType === 'flame' || fx.trailType === 'starfield'),
            glowSize: 8,
        });
    }

    // 光环渲染（装备皮肤时脚下光环）
    renderAura(ctx, x, y, radius, skin) {
        if (!skin || !skin.skillFx || !skin.skillFx.auraColor) return;
        if (this.quality.detailLevel < 1) return;
        ctx.fillStyle = skin.skillFx.auraColor;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 全局皮肤管理器实例
const skinManager = new SkinManager();
