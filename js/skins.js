// ============================================
// 皮肤系统 - 全新外观 + 技能/攻击特效
// ============================================
// 皮肤分级：普通(200金) / 稀有(500金) / 史诗(1000金) / 传说(2000金)
// 高品质皮肤改变角色外观、技能特效颜色和攻击粒子效果

const SkinRarity = {
    COMMON: { name: '普通', color: '#aabbcc', price: 200 },
    RARE: { name: '稀有', color: '#44aaff', price: 500 },
    EPIC: { name: '史诗', color: '#aa44ff', price: 1000 },
    LEGENDARY: { name: '传说', color: '#ff8800', price: 2000 },
};

// 皮肤定义（每个角色多款皮肤）
const SkinDefs = {
    // ======== 剑客皮肤 ========
    swordsman_ice: {
        id: 'swordsman_ice',
        charId: 'swordsman',
        name: '寒冰剑客',
        rarity: 'RARE',
        desc: '北境冰霜赐予的剑术',
        bodyColors: ['#88ddff', '#44aadd', '#aaeeff'],
        glowColor: '#88ddff',
        eyeColor: '#00ccff',
        // 特效覆盖
        effects: {
            projectileColor: '#88ddff',
            projectileGlow: '#44ccff',
            projectileCore: '#ffffff',
            trailColors: ['#88ddff', '#44aadd', '#ffffff'],
            hitParticles: ['#88ddff', '#aaeeff', '#ffffff', '#44ccff'],
        },
    },
    swordsman_flame: {
        id: 'swordsman_flame',
        charId: 'swordsman',
        name: '烈焰剑圣',
        rarity: 'EPIC',
        desc: '以灼热之焰铸就剑意',
        bodyColors: ['#ff6622', '#ff4400', '#ffaa00'],
        glowColor: '#ff6622',
        eyeColor: '#ffcc00',
        effects: {
            projectileColor: '#ff6622',
            projectileGlow: '#ffaa00',
            projectileCore: '#ffff44',
            trailColors: ['#ff6622', '#ff4400', '#ffaa00'],
            hitParticles: ['#ff6622', '#ffaa00', '#ffff44', '#ff4400'],
        },
    },
    swordsman_void: {
        id: 'swordsman_void',
        charId: 'swordsman',
        name: '虚空剑魔',
        rarity: 'LEGENDARY',
        desc: '撕裂虚空的禁忌剑技，斩击带有空间裂痕',
        bodyColors: ['#6622aa', '#4400aa', '#aa44ff'],
        glowColor: '#8844ff',
        eyeColor: '#ff44ff',
        effects: {
            projectileColor: '#8844ff',
            projectileGlow: '#aa66ff',
            projectileCore: '#ff88ff',
            trailColors: ['#8844ff', '#6622aa', '#ff44ff'],
            hitParticles: ['#8844ff', '#aa66ff', '#ff44ff', '#6622aa'],
            // 传说特效：攻击时产生空间裂痕粒子
            legendaryTrail: true,
            trailShape: 'rift',
        },
    },

    // ======== 法师皮肤 ========
    mage_frost: {
        id: 'mage_frost',
        charId: 'mage',
        name: '霜寒法师',
        rarity: 'RARE',
        desc: '冰霜法术冻结一切',
        bodyColors: ['#66ccff', '#4488dd', '#aaddff'],
        glowColor: '#66ccff',
        eyeColor: '#88eeff',
        effects: {
            projectileColor: '#66ccff',
            projectileGlow: '#88eeff',
            projectileCore: '#ffffff',
            trailColors: ['#66ccff', '#4488dd', '#ffffff'],
            hitParticles: ['#66ccff', '#88eeff', '#ffffff', '#aaddff'],
        },
    },
    mage_dark: {
        id: 'mage_dark',
        charId: 'mage',
        name: '暗黑法师',
        rarity: 'EPIC',
        desc: '操控暗影烈焰的堕落法师',
        bodyColors: ['#8800aa', '#660088', '#cc44ff'],
        glowColor: '#aa22cc',
        eyeColor: '#ff00ff',
        effects: {
            projectileColor: '#aa22cc',
            projectileGlow: '#cc44ff',
            projectileCore: '#ff88ff',
            trailColors: ['#aa22cc', '#660088', '#ff44ff'],
            hitParticles: ['#aa22cc', '#cc44ff', '#ff88ff', '#660088'],
        },
    },
    mage_celestial: {
        id: 'mage_celestial',
        charId: 'mage',
        name: '星辰法神',
        rarity: 'LEGENDARY',
        desc: '引动星辰之力，火球化为流星陨落',
        bodyColors: ['#ffcc00', '#ff8800', '#ffffaa'],
        glowColor: '#ffdd44',
        eyeColor: '#ffffff',
        effects: {
            projectileColor: '#ffcc00',
            projectileGlow: '#ffdd44',
            projectileCore: '#ffffff',
            trailColors: ['#ffcc00', '#ff8800', '#ffffff'],
            hitParticles: ['#ffcc00', '#ffdd44', '#ffffff', '#ff8800'],
            legendaryTrail: true,
            trailShape: 'star',
        },
    },

    // ======== 刺客皮肤 ========
    assassin_shadow: {
        id: 'assassin_shadow',
        charId: 'assassin',
        name: '暗夜刺客',
        rarity: 'RARE',
        desc: '融入黑暗的致命杀手',
        bodyColors: ['#334455', '#1a2233', '#556677'],
        glowColor: '#445566',
        eyeColor: '#ff4444',
        effects: {
            projectileColor: '#445566',
            projectileGlow: '#667788',
            projectileCore: '#aabbcc',
            trailColors: ['#334455', '#1a2233', '#667788'],
            hitParticles: ['#445566', '#667788', '#aabbcc', '#334455'],
        },
    },
    assassin_blood: {
        id: 'assassin_blood',
        charId: 'assassin',
        name: '血影刺客',
        rarity: 'EPIC',
        desc: '以鲜血淬炼的暗杀术',
        bodyColors: ['#cc0022', '#880011', '#ff4444'],
        glowColor: '#cc0022',
        eyeColor: '#ff0000',
        effects: {
            projectileColor: '#cc0022',
            projectileGlow: '#ff2244',
            projectileCore: '#ff8888',
            trailColors: ['#cc0022', '#880011', '#ff4444'],
            hitParticles: ['#cc0022', '#ff2244', '#ff8888', '#880011'],
        },
    },
    assassin_phantom: {
        id: 'assassin_phantom',
        charId: 'assassin',
        name: '幻影刺神',
        rarity: 'LEGENDARY',
        desc: '化为幻影穿梭时空，留下残影分身',
        bodyColors: ['#22ffaa', '#00cc88', '#88ffcc'],
        glowColor: '#44ffbb',
        eyeColor: '#ffffff',
        effects: {
            projectileColor: '#44ffbb',
            projectileGlow: '#66ffcc',
            projectileCore: '#ffffff',
            trailColors: ['#44ffbb', '#22ffaa', '#ffffff'],
            hitParticles: ['#44ffbb', '#66ffcc', '#ffffff', '#22ffaa'],
            legendaryTrail: true,
            trailShape: 'phantom',
        },
    },

    // ======== 圣骑士皮肤 ========
    paladin_dark: {
        id: 'paladin_dark',
        charId: 'paladin',
        name: '暗黑骑士',
        rarity: 'RARE',
        desc: '堕入黑暗的圣骑士',
        bodyColors: ['#555555', '#333333', '#888888'],
        glowColor: '#666666',
        eyeColor: '#ff4444',
        effects: {
            projectileColor: '#666666',
            projectileGlow: '#888888',
            projectileCore: '#cccccc',
            trailColors: ['#555555', '#333333', '#aaaaaa'],
            hitParticles: ['#555555', '#888888', '#cccccc', '#333333'],
        },
    },
    paladin_holy: {
        id: 'paladin_holy',
        charId: 'paladin',
        name: '神圣审判者',
        rarity: 'EPIC',
        desc: '神圣之光的化身，冲击波净化一切邪恶',
        bodyColors: ['#ffffff', '#eeddaa', '#ffffcc'],
        glowColor: '#ffffaa',
        eyeColor: '#ffdd00',
        effects: {
            projectileColor: '#ffffaa',
            projectileGlow: '#ffffff',
            projectileCore: '#ffff88',
            trailColors: ['#ffffaa', '#ffdd88', '#ffffff'],
            hitParticles: ['#ffffaa', '#ffffff', '#ffdd88', '#ffcc44'],
        },
    },
    paladin_inferno: {
        id: 'paladin_inferno',
        charId: 'paladin',
        name: '炎狱战神',
        rarity: 'LEGENDARY',
        desc: '浴火重生的战神，锤击引发地狱烈焰',
        bodyColors: ['#ff4400', '#cc2200', '#ffaa00'],
        glowColor: '#ff6600',
        eyeColor: '#ffff00',
        effects: {
            projectileColor: '#ff6600',
            projectileGlow: '#ffaa00',
            projectileCore: '#ffff44',
            trailColors: ['#ff4400', '#cc2200', '#ffaa00'],
            hitParticles: ['#ff4400', '#ffaa00', '#ffff44', '#cc2200'],
            legendaryTrail: true,
            trailShape: 'flame',
        },
    },

    // ======== 弓箭手皮肤 ========
    archer_nature: {
        id: 'archer_nature',
        charId: 'archer',
        name: '自然猎手',
        rarity: 'RARE',
        desc: '森林精灵赐予的箭术',
        bodyColors: ['#44aa44', '#228822', '#88dd88'],
        glowColor: '#44cc44',
        eyeColor: '#88ff88',
        effects: {
            projectileColor: '#44cc44',
            projectileGlow: '#88ff88',
            projectileCore: '#ccffcc',
            trailColors: ['#44aa44', '#228822', '#88dd88'],
            hitParticles: ['#44cc44', '#88ff88', '#ccffcc', '#228822'],
        },
    },
    archer_thunder: {
        id: 'archer_thunder',
        charId: 'archer',
        name: '雷霆射手',
        rarity: 'EPIC',
        desc: '箭矢携带雷电之力',
        bodyColors: ['#ffdd00', '#ccaa00', '#ffff44'],
        glowColor: '#ffee44',
        eyeColor: '#ffffff',
        effects: {
            projectileColor: '#ffee44',
            projectileGlow: '#ffff88',
            projectileCore: '#ffffff',
            trailColors: ['#ffdd00', '#ccaa00', '#ffffff'],
            hitParticles: ['#ffdd00', '#ffee44', '#ffffff', '#ccaa00'],
        },
    },
    archer_cosmic: {
        id: 'archer_cosmic',
        charId: 'archer',
        name: '星矢猎神',
        rarity: 'LEGENDARY',
        desc: '以星辰为箭，引天河之力倾泻而下',
        bodyColors: ['#4466ff', '#2244cc', '#88aaff'],
        glowColor: '#6688ff',
        eyeColor: '#ffffff',
        effects: {
            projectileColor: '#6688ff',
            projectileGlow: '#88aaff',
            projectileCore: '#ffffff',
            trailColors: ['#4466ff', '#2244cc', '#88aaff'],
            hitParticles: ['#4466ff', '#88aaff', '#ffffff', '#2244cc'],
            legendaryTrail: true,
            trailShape: 'star',
        },
    },

    // ======== 亡灵师皮肤 ========
    necro_ice: {
        id: 'necro_ice',
        charId: 'necromancer',
        name: '寒骨亡灵师',
        rarity: 'RARE',
        desc: '以冰霜之力召唤冻骨亡灵',
        bodyColors: ['#88ccdd', '#4488aa', '#aaddee'],
        glowColor: '#88ccdd',
        eyeColor: '#aaeeff',
        effects: {
            projectileColor: '#88ccdd',
            projectileGlow: '#aaeeff',
            projectileCore: '#ffffff',
            trailColors: ['#88ccdd', '#4488aa', '#ffffff'],
            hitParticles: ['#88ccdd', '#aaeeff', '#ffffff', '#4488aa'],
        },
    },
    necro_blood: {
        id: 'necro_blood',
        charId: 'necromancer',
        name: '血祭亡灵师',
        rarity: 'EPIC',
        desc: '以鲜血为代价召唤强大亡灵',
        bodyColors: ['#aa0033', '#770022', '#dd4466'],
        glowColor: '#cc0044',
        eyeColor: '#ff0044',
        effects: {
            projectileColor: '#cc0044',
            projectileGlow: '#dd4466',
            projectileCore: '#ff88aa',
            trailColors: ['#aa0033', '#770022', '#ff4466'],
            hitParticles: ['#cc0044', '#dd4466', '#ff88aa', '#770022'],
        },
    },
    necro_void: {
        id: 'necro_void',
        charId: 'necromancer',
        name: '虚空亡神',
        rarity: 'LEGENDARY',
        desc: '撕裂生死界限，召唤虚空巨灵',
        bodyColors: ['#220044', '#110022', '#6600aa'],
        glowColor: '#4400aa',
        eyeColor: '#cc00ff',
        effects: {
            projectileColor: '#4400aa',
            projectileGlow: '#6600cc',
            projectileCore: '#cc88ff',
            trailColors: ['#4400aa', '#220044', '#cc00ff'],
            hitParticles: ['#4400aa', '#6600cc', '#cc88ff', '#220044'],
            legendaryTrail: true,
            trailShape: 'rift',
        },
    },
};

// 皮肤管理器（处理购买、装备、渲染覆盖）
const SkinManager = {
    // 获取角色所有可用皮肤
    getSkinsForChar(charId) {
        const result = [];
        for (const key in SkinDefs) {
            if (SkinDefs[key].charId === charId) result.push(SkinDefs[key]);
        }
        // 按稀有度排序：普通→稀有→史诗→传说
        const order = { COMMON: 0, RARE: 1, EPIC: 2, LEGENDARY: 3 };
        result.sort((a, b) => order[a.rarity] - order[b.rarity]);
        return result;
    },

    // 获取皮肤价格
    getPrice(skinId) {
        const skin = SkinDefs[skinId];
        if (!skin) return 0;
        return SkinRarity[skin.rarity].price;
    },

    // 是否已购买
    isOwned(skinId) {
        if (typeof MetaProgress === 'undefined') return false;
        const d = MetaProgress.data;
        return d.ownedSkins && d.ownedSkins.indexOf(skinId) !== -1;
    },

    // 是否装备中
    isEquipped(charId, skinId) {
        if (typeof MetaProgress === 'undefined') return false;
        const d = MetaProgress.data;
        return d.equippedSkins && d.equippedSkins[charId] === skinId;
    },

    // 购买皮肤
    buy(skinId) {
        if (typeof MetaProgress === 'undefined') return false;
        const price = this.getPrice(skinId);
        const d = MetaProgress.data;
        if (d.gold < price) return false;
        if (this.isOwned(skinId)) return false;
        d.gold -= price;
        if (!d.ownedSkins) d.ownedSkins = [];
        d.ownedSkins.push(skinId);
        MetaProgress.save();
        return true;
    },

    // 装备皮肤
    equip(charId, skinId) {
        if (typeof MetaProgress === 'undefined') return;
        const d = MetaProgress.data;
        if (!d.equippedSkins) d.equippedSkins = {};
        d.equippedSkins[charId] = skinId;
        MetaProgress.save();
    },

    // 卸下皮肤（恢复默认）
    unequip(charId) {
        if (typeof MetaProgress === 'undefined') return;
        const d = MetaProgress.data;
        if (!d.equippedSkins) return;
        delete d.equippedSkins[charId];
        MetaProgress.save();
    },

    // 获取当前装备的皮肤定义（没有则返回null）
    getEquippedSkin(charId) {
        if (typeof MetaProgress === 'undefined') return null;
        const d = MetaProgress.data;
        if (!d.equippedSkins || !d.equippedSkins[charId]) return null;
        return SkinDefs[d.equippedSkins[charId]] || null;
    },

    // 获取当前皮肤的特效配置（没装备皮肤则返回null）
    getEffects(charId) {
        const skin = this.getEquippedSkin(charId);
        return skin ? skin.effects : null;
    },

    // 渲染皮肤化的玩家身体（替代默认渲染）
    renderSkinBody(ctx, player, sx, sy, bob, now) {
        const skin = this.getEquippedSkin(player.def.id);
        if (!skin) return false; // 没有皮肤，使用默认渲染

        const r = player.radius;

        // 传说皮肤额外光环
        if (skin.rarity === 'LEGENDARY') {
            const pulse = 0.15 + Math.sin(now * 0.003) * 0.08;
            ctx.globalAlpha = pulse;
            ctx.fillStyle = skin.glowColor;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, r + 22, 0, TWO_PI);
            ctx.fill();
            // 旋转粒子环
            ctx.globalAlpha = 0.6;
            for (let i = 0; i < 6; i++) {
                const a = now * 0.002 + i * (TWO_PI / 6);
                const pr = r + 18;
                ctx.fillStyle = skin.effects.trailColors[i % skin.effects.trailColors.length];
                ctx.beginPath();
                ctx.arc(sx + Math.cos(a) * pr, sy + bob + Math.sin(a) * pr, 2.5, 0, TWO_PI);
                ctx.fill();
            }
        }

        // 史诗皮肤脉冲光环
        if (skin.rarity === 'EPIC') {
            const pulse = 0.12 + Math.sin(now * 0.004) * 0.06;
            ctx.globalAlpha = pulse;
            ctx.fillStyle = skin.glowColor;
            ctx.beginPath();
            ctx.arc(sx, sy + bob, r + 16, 0, TWO_PI);
            ctx.fill();
        }

        // 脚下光圈（使用皮肤颜色）
        const footPulse = 1 + Math.sin(now * 0.003) * 0.15;
        ctx.globalAlpha = 0.2 * footPulse;
        ctx.fillStyle = skin.glowColor;
        ctx.beginPath();
        ctx.ellipse(sx, sy + r + 2, r * 1.2 * footPulse, 6, 0, 0, TWO_PI);
        ctx.fill();

        // 外圈光晕
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = skin.glowColor;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, r + 8, 0, TWO_PI);
        ctx.fill();

        // 身体渐变球（使用皮肤配色）
        ctx.globalAlpha = 1;
        const bodyGrad = ctx.createRadialGradient(
            sx - r * 0.25, sy + bob - r * 0.25, r * 0.05,
            sx + r * 0.1, sy + bob + r * 0.1, r
        );
        bodyGrad.addColorStop(0, skin.bodyColors[2] || skin.bodyColors[0]);
        bodyGrad.addColorStop(0.4, skin.bodyColors[0]);
        bodyGrad.addColorStop(1, skin.bodyColors[1]);
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(sx, sy + bob, r, 0, TWO_PI);
        ctx.fill();

        // 高光
        const hlGrad = ctx.createRadialGradient(
            sx - r * 0.28, sy + bob - r * 0.3, 0,
            sx - r * 0.28, sy + bob - r * 0.3, r * 0.5
        );
        hlGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
        hlGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
        hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = hlGrad;
        ctx.beginPath();
        ctx.arc(sx - r * 0.28, sy + bob - r * 0.3, r * 0.5, 0, TWO_PI);
        ctx.fill();

        // 眼睛（使用皮肤眼色）
        const eyeDist = 6;
        const eyeX = sx + Math.cos(player.facingAngle) * eyeDist;
        const eyeY = sy + Math.sin(player.facingAngle) * eyeDist + bob;
        ctx.fillStyle = skin.eyeColor;
        ctx.beginPath();
        ctx.arc(eyeX - 3, eyeY - 2, 4, 0, TWO_PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 3, eyeY - 2, 4, 0, TWO_PI);
        ctx.fill();
        // 瞳孔
        ctx.fillStyle = '#111';
        const pupilOff = 1.5;
        ctx.beginPath();
        ctx.arc(eyeX - 3 + Math.cos(player.facingAngle) * pupilOff, eyeY - 2 + Math.sin(player.facingAngle) * pupilOff, 2, 0, TWO_PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX + 3 + Math.cos(player.facingAngle) * pupilOff, eyeY - 2 + Math.sin(player.facingAngle) * pupilOff, 2, 0, TWO_PI);
        ctx.fill();

        return true; // 渲染完成，跳过默认渲染
    },

    // 渲染皮肤化投射物（在武器渲染中调用）
    renderSkinProjectile(ctx, proj, sx, sy, charId) {
        const effects = this.getEffects(charId);
        if (!effects) return false; // 没有特效覆盖

        const r = proj.radius || 6;

        // 外层光晕
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = effects.projectileGlow;
        ctx.beginPath();
        ctx.arc(sx, sy, r * 1.8, 0, TWO_PI);
        ctx.fill();

        // 主体
        ctx.globalAlpha = 1;
        ctx.fillStyle = effects.projectileColor;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, TWO_PI);
        ctx.fill();

        // 核心
        ctx.fillStyle = effects.projectileCore;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(sx, sy, r * 0.4, 0, TWO_PI);
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
    },

    // 获取皮肤命中粒子颜色（用于伤害粒子发射）
    getHitParticleColors(charId) {
        const effects = this.getEffects(charId);
        return effects ? effects.hitParticles : null;
    },

    // 传说皮肤是否有尾迹特效
    hasLegendaryTrail(charId) {
        const effects = this.getEffects(charId);
        return effects && effects.legendaryTrail;
    },

    // 获取尾迹配置
    getTrailConfig(charId) {
        const effects = this.getEffects(charId);
        if (!effects || !effects.legendaryTrail) return null;
        return {
            colors: effects.trailColors,
            shape: effects.trailShape || 'default',
        };
    },
};
