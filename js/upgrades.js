// ============================================
// 升级系统 - 随机3选1
// ============================================

const UpgradePool = {
    // --- 武器升级（形态进化） ---
    weaponUpgrades: {
        sword: [
            { level: 2, name: '利刃', desc: '剑的范围增加15%', icon: '🗡️', apply(p) { p.bonuses.areaMult += 0.15; } },
            { level: 3, name: '旋风斩', desc: '剑弧度增加，同时攻速+10%', icon: '🌀', apply(p) { p.bonuses.attackSpeedMult += 0.1; p.bonuses.areaMult += 0.1; } },
            { level: 4, name: '连斩', desc: '攻速+15%', icon: '⚡', apply(p) { p.bonuses.attackSpeedMult += 0.15; } },
            { level: 5, name: '魔剑', desc: '攻击力+20%，暴击率+5%', icon: '💎', apply(p) { p.bonuses.attackMult += 0.2; p.bonuses.critRateBonus += 0.05; } },
            { level: 6, name: '剑气纵横', desc: '范围+20%，剑意只需3层即可释放龙卷风', icon: '🔮', apply(p) { p.bonuses.areaMult += 0.2; p.passive.maxStacks = 3; } },
            { level: 7, name: '万剑归宗', desc: '全属性+20%，剑气波宽度和伤害大幅提升', icon: '👑', apply(p) { p.bonuses.attackMult += 0.2; p.bonuses.attackSpeedMult += 0.2; p.bonuses.areaMult += 0.2; } },
        ],
        fireball: [
            { level: 2, name: '灼烧', desc: '火球伤害+20%', icon: '🔥', apply(p) { p.bonuses.attackMult += 0.2; } },
            { level: 3, name: '分裂弹', desc: '额外+1枚火球', icon: '💫', apply(p) { p.bonuses.projectileBonus += 1; } },
            { level: 4, name: '炙焰', desc: '火球变大，范围+25%', icon: '☄️', apply(p) { p.bonuses.areaMult += 0.25; } },
            { level: 5, name: '陨石', desc: '攻击力+25%，穿透+1', icon: '🌠', apply(p) { p.bonuses.attackMult += 0.25; } },
            { level: 6, name: '火焰风暴', desc: '共鸣间隔-2秒，额外+1枚火球', icon: '🌋', apply(p) { p.passive.interval = Math.max(3, p.passive.interval - 2); p.bonuses.projectileBonus += 1; } },
            { level: 7, name: '地狱烈焰', desc: '全属性增强', icon: '👑', apply(p) { p.bonuses.attackMult += 0.3; p.bonuses.projectileBonus += 1; p.bonuses.areaMult += 0.2; } },
        ],
        dagger: [
            { level: 2, name: '淬毒短刃', desc: '攻击力+15%，暴击率+5%', icon: '🗡️', apply(p) { p.bonuses.attackMult += 0.15; p.bonuses.critRateBonus += 0.05; } },
            { level: 3, name: '双刃突刺', desc: '攻速+15%，暴击率+3%', icon: '✨', apply(p) { p.bonuses.attackSpeedMult += 0.15; p.bonuses.critRateBonus += 0.03; } },
            { level: 4, name: '影步强化', desc: '暗影步冷却-1秒，背刺范围+20%', icon: '⚡', apply(p) { p.passive.interval = Math.max(2, p.passive.interval - 1); p.bonuses.areaMult += 0.2; } },
            { level: 5, name: '嗜血之刃', desc: '暴击伤害+30%，击杀回血3%最大生命', icon: '🌑', apply(p) { p.bonuses.critDamageBonus += 0.3; } },
            { level: 6, name: '幻影连斩', desc: '攻速+18%，暴击率+5%', icon: '🌟', apply(p) { p.bonuses.attackSpeedMult += 0.18; p.bonuses.critRateBonus += 0.05; } },
            { level: 7, name: '暗影主宰', desc: '全面强化，暗影步冷却-2秒', icon: '👑', apply(p) { p.bonuses.attackMult += 0.3; p.bonuses.critDamageBonus += 0.5; p.passive.interval = Math.max(2, p.passive.interval - 2); } },
        ],
        hammer: [
            { level: 2, name: '重锤', desc: '锤击范围+15%，击退+20%', icon: '🔨', apply(p) { p.bonuses.areaMult += 0.15; } },
            { level: 3, name: '神圣之力', desc: '攻击力+20%，护甲+2', icon: '✝️', apply(p) { p.bonuses.attackMult += 0.2; p.bonuses.armorBonus += 2; } },
            { level: 4, name: '地震波', desc: '锤击范围+25%，格挡概率+10%', icon: '🌍', apply(p) { p.bonuses.areaMult += 0.25; p.passive.chance = Math.min(0.6, p.passive.chance + 0.1); } },
            { level: 5, name: '制裁之锤', desc: '攻击力+20%，回血+2/秒', icon: '⚡', apply(p) { p.bonuses.attackMult += 0.2; p.bonuses.hpRegenBonus += 2; } },
            { level: 6, name: '神罚', desc: '全范围+30%，格挡触发双倍冲击波', icon: '🌟', apply(p) { p.bonuses.areaMult += 0.3; } },
            { level: 7, name: '圣光审判', desc: '全属性大幅提升，格挡率50%', icon: '👑', apply(p) { p.bonuses.attackMult += 0.3; p.bonuses.areaMult += 0.2; p.bonuses.armorBonus += 3; p.passive.chance = 0.5; } },
        ],
        bow: [
            { level: 2, name: '强弓', desc: '箭矢攻击力+20%', icon: '🏹', apply(p) { p.bonuses.attackMult += 0.2; } },
            { level: 3, name: '连珠箭', desc: '攻速+12%，额外+1箭矢', icon: '⚡', apply(p) { p.bonuses.attackSpeedMult += 0.12; p.bonuses.projectileBonus += 1; } },
            { level: 4, name: '扇形射击', desc: '箭矢散射角度更大，穿透+1', icon: '🌬️', apply(p) { p.bonuses.areaMult += 0.2; } },
            { level: 5, name: '穿甲箭', desc: '暴击率+10%，攻击力+25%', icon: '🎯', apply(p) { p.bonuses.critRateBonus += 0.1; p.bonuses.attackMult += 0.25; } },
            { level: 6, name: '万箭齐发', desc: '额外+1箭矢，攻速+10%', icon: '🌧️', apply(p) { p.bonuses.projectileBonus += 1; p.bonuses.attackSpeedMult += 0.10; } },
            { level: 7, name: '弓箭大师', desc: '全面强化，箭雨冷却减半', icon: '👑', apply(p) { p.bonuses.attackMult += 0.2; p.bonuses.attackSpeedMult += 0.15; p.bonuses.projectileBonus += 1; p.passive.interval = Math.max(3, Math.floor(p.passive.interval / 2)); } },
        ],
        necro: [
            { level: 2, name: '亡灵强化', desc: '召唤物伤害+30%，移速+15%', icon: '💀', apply(p) { p.bonuses.summonDamageMult += 0.3; p.bonuses.summonSpeedBonus += 0.15; } },
            { level: 3, name: '骷髅法师', desc: '解锁法术型召唤物，喷火攻击远程敌人', icon: '🔥', apply(p) { if (p._summonManager) p._summonManager.unlockType('skeleton_mage'); } },
            { level: 4, name: '灵魂汲取', desc: '召唤物伤害+40%，灵魂积攒需求-2', icon: '🩸', apply(p) { p.bonuses.summonDamageMult += 0.4; p.passive.maxSouls = Math.max(4, p.passive.maxSouls - 2); } },
            { level: 5, name: '骷髅守卫', desc: '解锁坦克型召唤物，嘲讽吸引敌人', icon: '🛡️', apply(p) { if (p._summonManager) p._summonManager.unlockType('skeleton_tank'); } },
            { level: 6, name: '亡者军团', desc: '召唤物伤害+50%，死亡爆炸', icon: '💀', apply(p) { p.bonuses.summonDamageMult += 0.5; p.bonuses.summonDeathExplode = true; } },
            { level: 7, name: '死亡主宰', desc: '全召唤物伤害+60%，移速+30%，上限+2', icon: '👑', apply(p) { p.bonuses.summonDamageMult += 0.6; p.bonuses.summonSpeedBonus += 0.3; p.bonuses.summonMaxBonus += 2; } },
        ],
    },

    // --- 通用属性升级 ---
    // classBonus: 哪些职业获得此buff时权重×3（更容易出现）
    // classOnly: 仅限这些职业可以获得
    statUpgrades: [
        // 基础数值类（所有职业通用）
        { id: 'atk1', name: '力量提升', desc: '攻击力+8%', icon: '⚔️', weight: 8, rarity: 'common', apply(p) { p.bonuses.attackMult += 0.08; } },
        { id: 'atk2', name: '强力打击', desc: '攻击力+15%', icon: '💪', weight: 4, rarity: 'rare', apply(p) { p.bonuses.attackMult += 0.15; } },
        { id: 'aspd1', name: '疾速', desc: '攻速+10%', icon: '⚡', weight: 8, rarity: 'common', apply(p) { p.bonuses.attackSpeedMult += 0.10; } },
        { id: 'aspd2', name: '狂暴', desc: '攻速+15%', icon: '🔥', weight: 4, rarity: 'rare', apply(p) { p.bonuses.attackSpeedMult += 0.15; } },
        { id: 'crit1', name: '精准', desc: '暴击率+3%', icon: '🎯', weight: 6, rarity: 'common', classBonus: ['assassin', 'archer'], apply(p) { p.bonuses.critRateBonus += 0.03; } },
        { id: 'crit2', name: '致命一击', desc: '暴击伤害+20%', icon: '💀', weight: 5, rarity: 'rare', classBonus: ['assassin'], apply(p) { p.bonuses.critDamageBonus += 0.2; } },
        { id: 'hp1', name: '生命提升', desc: '最大生命+50', icon: '❤️', weight: 6, rarity: 'common', classBonus: ['paladin', 'swordsman'], apply(p) { p.bonuses.maxHpBonus += 50; p.stats.hp = Math.min(p.stats.hp + 50, p.getMaxHp()); } },
        { id: 'regen1', name: '再生', desc: '每秒回血+2', icon: '💚', weight: 5, rarity: 'common', classBonus: ['paladin'], apply(p) { p.bonuses.hpRegenBonus += 2; } },
        { id: 'spd1', name: '轻盈', desc: '移动速度+8%', icon: '👟', weight: 6, rarity: 'common', classBonus: ['assassin'], apply(p) { p.bonuses.moveSpeedMult += 0.08; } },
        { id: 'pickup', name: '磁铁', desc: '拾取范围+40', icon: '🧲', weight: 5, rarity: 'common', apply(p) { p.bonuses.pickupRangeBonus += 40; } },
        { id: 'armor1', name: '铁壁', desc: '护甲+5', icon: '🛡️', weight: 5, rarity: 'common', classBonus: ['paladin', 'swordsman'], apply(p) { p.bonuses.armorBonus += 5; } },
        { id: 'area1', name: '扩散', desc: '攻击范围+10%', icon: '🌐', weight: 5, rarity: 'common', classBonus: ['mage', 'necromancer'], apply(p) { p.bonuses.areaMult += 0.10; } },

        // === 技能形态改变型Buff（maxCount: 1 = 不可叠加，选过不再出现） ===
        { id: 'orbital1', name: '环绕刀刃', desc: '召唤两把环绕刀刃，自动旋转切割附近敌人', icon: '🕰️', weight: 6, rarity: 'rare', maxCount: 1, classBonus: ['swordsman', 'paladin'], apply(p) { p.bonuses.orbitalBlades += 2; } },
        { id: 'orbital2', name: '刀刃风暴', desc: '再增加两把环绕刀刃，转速提升', icon: '🌀', weight: 3, rarity: 'epic', maxCount: 1, requires: 'orbital1', apply(p) { p.bonuses.orbitalBlades += 2; } },
        { id: 'firetrail', name: '火焰尾迹', desc: '移动时身后留下火焰，持续烤伤踩上的敌人', icon: '🔥', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['mage', 'assassin'], apply(p) { p.bonuses.fireTrail = true; } },
        { id: 'chain1', name: '连锁闪电', desc: '攻击命中敌人时，闪电跳到附近2个敌人', icon: '⚡', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['mage', 'necromancer'], apply(p) { p.bonuses.chainLightning = 2; } },
        { id: 'chain2', name: '雷神之怒', desc: '闪电连锁增加到4个目标，伤害提升', icon: '🌩️', weight: 2, rarity: 'epic', maxCount: 1, requires: 'chain1', apply(p) { p.bonuses.chainLightning = 4; } },
        { id: 'thorn', name: '荆棘护甲', desc: '受伤时反弹200%伤害给周围敌人，护甲+2', icon: '🌵', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['paladin'], apply(p) { p.bonuses.thornAura = true; p.bonuses.armorBonus += 2; } },
        { id: 'split', name: '分裂弹', desc: '投射物命中敌人后分裂为3个小弹', icon: '💥', weight: 4, rarity: 'epic', maxCount: 1, classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.splitShot = true; } },
        { id: 'homing', name: '追踪术', desc: '所有投射物获得微弱追踪能力', icon: '🎯', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.homingShot = true; } },
{ id: 'focusfire', name: '集火追踪', desc: '投射物强力锁定最近敌人，目标死亡后自动转火新目标', icon: '🔥🎯', weight: 3, rarity: 'epic', maxCount: 1, requires: 'homing', classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.focusFire = true; } },
        { id: 'explokill', name: '爆裂击杀', desc: '击杀敌人时触发爆炸，对周围造成范围伤害', icon: '💣', weight: 4, rarity: 'epic', maxCount: 1, classBonus: ['assassin', 'swordsman'], apply(p) { p.bonuses.explosiveKill = true; } },
        { id: 'frost', name: '冰霜光环', desc: '周围敌人移动速度降低40%，护甲+1', icon: '❄️', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['paladin', 'archer'], apply(p) { p.bonuses.frostAura = true; p.bonuses.armorBonus += 1; } },
        { id: 'vamp1', name: '吸血之刃', desc: '攻击伤害的3%转化为生命恢复', icon: '🧛', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['assassin', 'necromancer'], apply(p) { p.bonuses.vampiric = 0.03; } },
        { id: 'vamp2', name: '生命窃取', desc: '吸血比例提升到8%', icon: '🩸', weight: 2, rarity: 'epic', maxCount: 1, requires: 'vamp1', apply(p) { p.bonuses.vampiric = 0.08; } },
        { id: 'double', name: '双重打击', desc: '20%概率触发两次攻击', icon: '✨', weight: 4, rarity: 'rare', maxCount: 1, classBonus: ['swordsman', 'assassin'], apply(p) { p.bonuses.doubleStrike = 0.2; } },
        { id: 'double2', name: '连击大师', desc: '双重打击概率提升到40%', icon: '🌟', weight: 2, rarity: 'epic', maxCount: 1, requires: 'double', apply(p) { p.bonuses.doubleStrike = 0.4; } },
        { id: 'combo_burst', name: '爆裂暴击', desc: '暴击时触发小型爆炸，暴击率+8%', icon: '💢', weight: 4, rarity: 'epic', maxCount: 1, classBonus: ['assassin'], apply(p) { p.bonuses.critRateBonus += 0.08; } },
        { id: 'magnet_burst', name: '经验磁场', desc: '升级时吸取屏幕内所有经验宝石，拾取范围+50', icon: '🧲', weight: 4, rarity: 'rare', maxCount: 1, apply(p) { p.bonuses.pickupRangeBonus += 50; } },

        // === 职业专属升级 ===
        // 剑客专属
        { id: 'sword_fury', name: '剑怒', desc: '剑气波暴击率+15%，剑气波贯穿伤害提升', icon: '⚔️', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['swordsman'], apply(p) { p.bonuses.critRateBonus += 0.15; } },
        // 法师专属
        { id: 'mage_nova_cd', name: '元素亲和', desc: '元素共鸣间隔减少2秒', icon: '🔥', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['mage'], apply(p) { p.passive.interval = Math.max(2, p.passive.interval - 2); } },
        // 刺客专属
        { id: 'assassin_blink_cd', name: '残影', desc: '暗影步冷却减少1.5秒', icon: '🗡️', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['assassin'], apply(p) { p.passive.interval = Math.max(2, p.passive.interval - 1.5); } },
        { id: 'assassin_backstab', name: '致命背刺', desc: '背刺伤害由2倍提升到3倍', icon: '🌑', weight: 4, rarity: 'legendary', maxCount: 1, classOnly: ['assassin'], apply(p) { p.bonuses.attackMult += 0.5; } },
        // 圣骑士专属
        { id: 'paladin_shield', name: '圣盾', desc: '格挡概率+15%，格挡回复5%最大生命', icon: '🛡️', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['paladin'], apply(p) { p.passive.chance = Math.min(0.6, p.passive.chance + 0.15); } },
        // 弓箭手专属
        { id: 'archer_barrage', name: '箭雨强化', desc: '箭雨冷却减少2秒，箭雨伤害+30%', icon: '🏹', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['archer'], apply(p) { p.passive.interval = Math.max(3, p.passive.interval - 2); p.bonuses.attackMult += 0.15; } },
        { id: 'archer_multishot', name: '漫天箭雨', desc: '每次攻击额外+1箭矢，穿透力+1', icon: '🎯', weight: 3, rarity: 'legendary', maxCount: 1, classOnly: ['archer'], apply(p) { p.bonuses.projectileBonus += 1; p.bonuses.attackMult += 0.15; } },
        // 亡灵师专属
        { id: 'necro_soul_fast', name: '灵魂虹吸', desc: '灵魂积攒需求-2，更快召唤巨兽', icon: '💀', weight: 5, rarity: 'epic', maxCount: 1, classOnly: ['necromancer'], apply(p) { p.passive.maxSouls = Math.max(3, p.passive.maxSouls - 2); } },
        { id: 'necro_heal_aura', name: '亡灵光环', desc: '召唤物持续回复玩家生命', icon: '💚', weight: 4, rarity: 'epic', maxCount: 1, classOnly: ['necromancer'], apply(p) { p.bonuses.summonHealAura = true; } },
        { id: 'necro_army', name: '亡灵大军', desc: '召唤物上限+3，召唤物伤害+40%', icon: '☠️', weight: 4, rarity: 'legendary', maxCount: 1, classOnly: ['necromancer'], apply(p) { p.bonuses.summonMaxBonus += 3; p.bonuses.summonDamageMult += 0.4; } },
        { id: 'necro_inherit', name: '灵魂共鸣', desc: '召唤物属性继承比例+25%，伤害+30%', icon: '💪', weight: 4, rarity: 'legendary', maxCount: 1, classOnly: ['necromancer'], apply(p) { p.bonuses.summonInheritBonus = (p.bonuses.summonInheritBonus || 0) + 0.25; p.bonuses.summonDamageMult += 0.3; } },

        // === 新增可叠加升级（保持升级池丰富） ===
        { id: 'crit3', name: '精确打击', desc: '暴击率+4%', icon: '🎯', weight: 5, rarity: 'common', classBonus: ['assassin'], apply(p) { p.bonuses.critRateBonus += 0.04; } },
        { id: 'crit4', name: '致命连击', desc: '暴击伤害+15%', icon: '💀', weight: 4, rarity: 'common', classBonus: ['assassin'], apply(p) { p.bonuses.critDamageBonus += 0.15; } },
        { id: 'hp2', name: '生命强化', desc: '最大生命+80', icon: '❤️', weight: 5, rarity: 'rare', classBonus: ['paladin'], apply(p) { p.bonuses.maxHpBonus += 80; p.stats.hp = Math.min(p.stats.hp + 80, p.getMaxHp()); } },
        { id: 'regen2', name: '强力再生', desc: '每秒回血+4', icon: '💚', weight: 4, rarity: 'rare', classBonus: ['paladin', 'necromancer'], apply(p) { p.bonuses.hpRegenBonus += 4; } },
        { id: 'spd2', name: '疾风步', desc: '移动速度+10%', icon: '👟', weight: 4, rarity: 'rare', classBonus: ['assassin'], apply(p) { p.bonuses.moveSpeedMult += 0.10; } },
        { id: 'armor2', name: '钢铁壁垒', desc: '护甲+8', icon: '🛡️', weight: 4, rarity: 'rare', classBonus: ['paladin', 'swordsman'], apply(p) { p.bonuses.armorBonus += 8; } },
        { id: 'area2', name: '大范围扩散', desc: '攻击范围+12%', icon: '🌐', weight: 4, rarity: 'rare', classBonus: ['mage', 'necromancer'], apply(p) { p.bonuses.areaMult += 0.12; } },
        { id: 'pickup2', name: '强力磁场', desc: '拾取范围+60', icon: '🧲', weight: 4, rarity: 'common', apply(p) { p.bonuses.pickupRangeBonus += 60; } },
        { id: 'atk3', name: '怒火中烧', desc: '攻击力+10%', icon: '⚔️', weight: 6, rarity: 'common', apply(p) { p.bonuses.attackMult += 0.10; } },
        { id: 'aspd3', name: '疾风连击', desc: '攻速+12%', icon: '⚡', weight: 5, rarity: 'common', classBonus: ['swordsman', 'assassin'], apply(p) { p.bonuses.attackSpeedMult += 0.12; } },

        // === 经验获取类 ===
        { id: 'exp1', name: '求知欲', desc: '经验获取+8%', icon: '📖', weight: 5, rarity: 'common', apply(p) { p.bonuses.expMult += 0.08; } },
        { id: 'exp2', name: '博学多才', desc: '经验获取+12%', icon: '📚', weight: 3, rarity: 'rare', apply(p) { p.bonuses.expMult += 0.12; } },
        { id: 'exp3', name: '知识渴望', desc: '经验获取+15%，拾取范围+30', icon: '🎓', weight: 2, rarity: 'epic', maxCount: 1, apply(p) { p.bonuses.expMult += 0.15; p.bonuses.pickupRangeBonus += 30; } },

        // === 新增·护盾类 ===
        { id: 'shield1', name: '能量护盾', desc: '获得40点护盾，受伤后3秒自动回复', icon: '🛡️', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['mage', 'archer'], apply(p) { p.bonuses.shieldMax += 40; p.bonuses.shieldRegen += 5; p.shield = Math.min(p.shield + 40, p.bonuses.shieldMax); } },
        { id: 'shield2', name: '符文屏障', desc: '护盾上限+60，回复速度翻倍', icon: '🔰', weight: 3, rarity: 'epic', maxCount: 1, requires: 'shield1', apply(p) { p.bonuses.shieldMax += 60; p.bonuses.shieldRegen *= 2; p.shield = Math.min(p.shield + 60, p.bonuses.shieldMax); } },

        // === 新增·闪避类 ===
        { id: 'dodge1', name: '影步闪避', desc: '8%几率闪避攻击', icon: '💨', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['assassin'], apply(p) { p.bonuses.dodgeChance += 0.08; } },
        { id: 'dodge2', name: '幻影身法', desc: '闪避率提升至18%，移速+8%', icon: '🌬️', weight: 3, rarity: 'epic', maxCount: 1, requires: 'dodge1', apply(p) { p.bonuses.dodgeChance = 0.18; p.bonuses.moveSpeedMult += 0.08; } },

        // === 新增·伤害减免类 ===
        { id: 'dmgred1', name: '铁骨铮铮', desc: '所有受到的伤害减少10%', icon: '🏛️', weight: 5, rarity: 'rare', maxCount: 1, classBonus: ['paladin', 'swordsman'], apply(p) { p.bonuses.damageReduction += 0.10; } },
        { id: 'dmgred2', name: '不动如山', desc: '伤害减免提升至25%，护甲+3', icon: '🗻', weight: 3, rarity: 'epic', maxCount: 1, requires: 'dmgred1', apply(p) { p.bonuses.damageReduction = 0.25; p.bonuses.armorBonus += 3; } },

        // === 新增·灼烧光环 ===
        { id: 'burn_aura', name: '灼烧光环', desc: '对周围敌人每秒造成攻击力25%的火焰伤害', icon: '🌋', weight: 4, rarity: 'rare', maxCount: 1, classBonus: ['mage', 'swordsman'], apply(p) { p.bonuses.burnAura = true; } },

        // === 新增·击杀回血 ===
        { id: 'killheal1', name: '生命收割', desc: '每次击杀敌人回复8点生命', icon: '💖', weight: 5, rarity: 'common', maxCount: 1, apply(p) { p.bonuses.killHeal += 8; } },
        { id: 'killheal2', name: '灵魂掠夺', desc: '击杀回血提升至20点', icon: '💗', weight: 3, rarity: 'rare', maxCount: 1, requires: 'killheal1', apply(p) { p.bonuses.killHeal = 20; } },

        // === 新增·怒气系统 ===
        { id: 'rage1', name: '狂战士之怒', desc: '生命值低于50%时，伤害+25%', icon: '😡', weight: 4, rarity: 'rare', maxCount: 1, classBonus: ['swordsman', 'assassin'], apply(p) { p.bonuses.rageMult += 0.25; } },
        { id: 'rage2', name: '不屈意志', desc: '低血怒伤害提升至50%，攻速+15%', icon: '🔥', weight: 2, rarity: 'epic', maxCount: 1, requires: 'rage1', apply(p) { p.bonuses.rageMult = 0.5; p.bonuses.attackSpeedMult += 0.15; } },

        // === 新增·弹速加成 ===
        { id: 'projspd1', name: '急速弹道', desc: '投射物飞行速度+30%', icon: '🚀', weight: 5, rarity: 'common', maxCount: 1, classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.projectileSpeed += 0.3; } },

        // === 新增·复活 ===
        { id: 'revive1', name: '不死鸟之羽', desc: '致死伤害时复活一次，恢复30%生命', icon: '🪶', weight: 2, rarity: 'legendary', maxCount: 1, apply(p) { p.bonuses.revive += 1; } },

        // === 新增·金币掉落 ===
        { id: 'gold1', name: '贪婪之心', desc: '金币获取+30%', icon: '💰', weight: 5, rarity: 'common', apply(p) { p.bonuses.goldBonus += 0.3; } },
        { id: 'gold2', name: '拜金大师', desc: '金币获取+50%', icon: '🏆', weight: 3, rarity: 'rare', apply(p) { p.bonuses.goldBonus += 0.5; } },

        // === 新增·幸运掉落 ===
        { id: 'lucky1', name: '幸运星', desc: '道具掉落率+50%', icon: '🍀', weight: 4, rarity: 'rare', maxCount: 1, apply(p) { p.bonuses.luckyDrop += 0.5; } },
        { id: 'lucky2', name: '天选之人', desc: '道具掉落率+100%，经验获取+20%', icon: '⭐', weight: 2, rarity: 'epic', maxCount: 1, requires: 'lucky1', apply(p) { p.bonuses.luckyDrop = 1.0; p.bonuses.expMult += 0.2; } },

        // === 新增·综合提升 ===
        { id: 'allstat1', name: '全能战士', desc: '攻击+10%，攻速+10%，移速+8%', icon: '🌈', weight: 3, rarity: 'epic', maxCount: 1, apply(p) { p.bonuses.attackMult += 0.10; p.bonuses.attackSpeedMult += 0.10; p.bonuses.moveSpeedMult += 0.08; } },
        { id: 'allstat2', name: '超凡入圣', desc: '全属性+15%，暴击率+5%，护甲+4', icon: '✨', weight: 1, rarity: 'legendary', maxCount: 1, requires: 'allstat1', apply(p) { p.bonuses.attackMult += 0.15; p.bonuses.attackSpeedMult += 0.15; p.bonuses.moveSpeedMult += 0.15; p.bonuses.critRateBonus += 0.05; p.bonuses.armorBonus += 4; } },

        // === 新增·投射物数量 ===
        { id: 'proj1', name: '额外弹幕', desc: '额外投射物+1', icon: '🌟', weight: 3, rarity: 'epic', maxCount: 1, classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.projectileBonus += 1; } },
        { id: 'proj2', name: '弹幕风暴', desc: '额外投射物+1', icon: '💥', weight: 2, rarity: 'legendary', maxCount: 1, requires: 'proj1', classBonus: ['mage', 'archer', 'swordsman'], irrelevantFor: ['paladin', 'assassin'], apply(p) { p.bonuses.projectileBonus += 1; } },
    ],

    // 武器进化定义（满级后可进化）
    weaponEvolutions: {
        sword: { name: '天罚·灭世剑', desc: '剑气贯穿全屏，攻击力+50%，范围+50%', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.bonuses.attackMult += 0.5; p.bonuses.areaMult += 0.5; } },
        fireball: { name: '混沌·毁灭之炎', desc: '火球爆炸范围翻倍，自动追踪，+3火球', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.bonuses.attackMult += 0.4; p.bonuses.projectileBonus += 3; p.bonuses.areaMult += 1.0; } },
        dagger: { name: '虚无·影杀术', desc: '暗影步无冷却，暴击率+20%，暴击伤害+80%', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.passive.interval = 1; p.bonuses.critRateBonus += 0.2; p.bonuses.critDamageBonus += 0.8; } },
        hammer: { name: '裁决·圣光之锤', desc: '锤击范围+80%，格挡率60%，护甲+8', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.bonuses.areaMult += 0.8; p.passive.chance = 0.6; p.bonuses.armorBonus += 8; } },
        bow: { name: '星陨·万矢穿心', desc: '+8箭矢，追踪，暴击率+15%', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.bonuses.projectileBonus += 8; p.bonuses.critRateBonus += 0.15; p.bonuses.homingShot = true; } },
        necro: { name: '冥王·亡灵天灾', desc: '召唤物上限+5，伤害+100%，死亡爆炸', icon: '🌟',
            apply(p) { p.weaponEvolved = true; p.bonuses.summonMaxBonus += 5; p.bonuses.summonDamageMult += 1.0; p.bonuses.summonDeathExplode = true; } },
    },

    // 已选升级记录（用于判断requires和唯一性）
    _chosenIds: new Set(),
    _chosenCounts: {},

    // 生成随机3选1
    generateChoices(player, count = 3) {
        const choices = [];
        const usedIds = new Set();

        // 武器进化（满级且未进化时，100%出现）
        const weaponType = player.def.weaponType;
        if (player.weaponLevel >= player.weaponMaxLevel && !player.weaponEvolved) {
            const evo = this.weaponEvolutions[weaponType];
            if (evo) {
                choices.push({
                    ...evo,
                    isWeapon: false,
                    isEvolution: true,
                    rarity: 'legendary',
                });
                usedIds.add('evolution');
            }
        }

        // 武器升级优先（如果有的话）
        const weaponUps = this.weaponUpgrades[weaponType];
        if (weaponUps && player.weaponLevel < player.weaponMaxLevel) {
            const nextWeaponUp = weaponUps.find(u => u.level === player.weaponLevel + 1);
            if (nextWeaponUp && Math.random() < 0.15) {
                choices.push({
                    ...nextWeaponUp,
                    isWeapon: true,
                    rarity: this._getWeaponRarity(nextWeaponUp.level),
                });
                usedIds.add('weapon');
            }
        }

        // 过滤可用升级（检查requires前置条件 + 唯一性 + 职业限制 + 相关性）
        const classId = player.def.id; // 'swordsman', 'mage', 'assassin', etc.
        const available = this.statUpgrades.filter(u => {
            if (usedIds.has(u.id)) return false;
            if (u.requires && !this._chosenIds.has(u.requires)) return false;
            // 检查是否已达到最大可选次数（maxCount: 1 表示不可叠加）
            if (u.maxCount !== undefined) {
                const chosen = this._chosenCounts[u.id] || 0;
                if (chosen >= u.maxCount) return false;
            }
            // classOnly: 仅限指定职业
            if (u.classOnly && !u.classOnly.includes(classId)) return false;
            // 相关性过滤：隐藏对当前英雄完全无效的buff
            if (u.irrelevantFor && u.irrelevantFor.includes(classId)) return false;
            return true;
        });

        // 加权：classBonus 职业匹配的buff权重×3
        const weighted = [];
        for (const u of available) {
            const mult = (u.classBonus && u.classBonus.includes(classId)) ? 3 : 1;
            for (let i = 0; i < u.weight * mult; i++) weighted.push(u);
        }

        while (choices.length < count && weighted.length > 0) {
            const idx = Utils.randInt(0, weighted.length - 1);
            const pick = weighted[idx];
            if (!usedIds.has(pick.id)) {
                usedIds.add(pick.id);
                choices.push({
                    ...pick,
                    isWeapon: false,
                    rarity: pick.rarity || 'common',
                });
                // 移除同id
                for (let i = weighted.length - 1; i >= 0; i--) {
                    if (weighted[i].id === pick.id) weighted.splice(i, 1);
                }
            }
        }

        // 打乱顺序
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Utils.randInt(0, i);
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }

        return choices;
    },

    applyUpgrade(player, choice) {
        choice.apply(player);
        if (choice.isWeapon) {
            player.weaponLevel++;
        }
        // 记录已选择的升级ID（用于解锁进阶Buff + 唯一性判断）
        if (choice.id) {
            this._chosenIds.add(choice.id);
            this._chosenCounts[choice.id] = (this._chosenCounts[choice.id] || 0) + 1;
        }
        // 检查武器融合
        this._checkFusions(player);
    },

    // 武器融合检测：当满足所有requires时自动触发
    _activatedFusions: new Set(),

    _checkFusions(player) {
        for (const [fid, fdef] of Object.entries(FusionDefs)) {
            if (this._activatedFusions.has(fid)) continue;
            const met = fdef.requires.every(rid => this._chosenIds.has(rid));
            if (met) {
                this._activatedFusions.add(fid);
                fdef.apply(player);
                // 标记融合已激活，供UI展示
                if (!player._activeFusions) player._activeFusions = [];
                player._activeFusions.push(fid);
            }
        }
    },

    // 重置已选记录（新游戏时调用）
    resetChoices() {
        this._chosenIds.clear();
        this._chosenCounts = {};
        this._activatedFusions.clear();
    },

    _getWeaponRarity(level) {
        if (level >= 6) return 'legendary';
        if (level >= 4) return 'epic';
        if (level >= 2) return 'rare';
        return 'common';
    },
};

const RarityColors = {
    common: { bg: '#2a3040', border: '#556677', text: '#aabbcc', glow: '' },
    rare: { bg: '#1a2a40', border: '#4488ff', text: '#66aaff', glow: '#4488ff' },
    epic: { bg: '#2a1a40', border: '#aa44ff', text: '#cc88ff', glow: '#aa44ff' },
    legendary: { bg: '#3a2a10', border: '#ffaa00', text: '#ffcc44', glow: '#ffaa00' },
};
