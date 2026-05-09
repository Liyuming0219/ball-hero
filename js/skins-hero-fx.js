// ============================================
// Per-Hero Skin Effects System
// Each skin has UNIQUE effects for EVERY hero class's:
//   - Normal attack (hit visual)
//   - Passive skill trigger
//   - Projectile appearance
// ============================================
// Hero classes: swordsman, mage, assassin, paladin, archer, necromancer
// This extends SkinFxSystem with hero-aware methods

const TWO_PI_HFX = Math.PI * 2;

// Master dispatch: called by weapon system on hit
SkinFxSystem.prototype.onHitForHero = function(x, y, skin, heroId) {
    if (!skin || this.quality.particleMult <= 0) return;
    const fn = this['_heroHit_' + skin.id + '_' + heroId];
    if (fn) { fn.call(this, x, y); return; }
    // Fallback to generic skin hit
    this.onHit(x, y, skin);
};

// Master dispatch: called on passive trigger
SkinFxSystem.prototype.onPassiveForHero = function(x, y, skin, heroId) {
    if (!skin || this.quality.particleMult <= 0) return;
    const fn = this['_heroPassive_' + skin.id + '_' + heroId];
    if (fn) { fn.call(this, x, y); return; }
    this.onSkillCast(x, y, skin);
};

// Master dispatch: projectile tint/trail per skin per hero
SkinFxSystem.prototype.getProjConfig = function(skin, heroId) {
    if (!skin) return null;
    const fn = this['_heroProj_' + skin.id + '_' + heroId];
    if (fn) return fn.call(this);
    return null; // use default
};

// ====================================================================
// WATERMELON - Per Hero Effects
// Theme: green/red, seeds, juice splatter
// ====================================================================
// Swordsman: Watermelon Cleave - green arc slash with seed spray
SkinFxSystem.prototype._heroHit_watermelon_swordsman = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#1e7a30','#33cc55','#88ff88'], speedMin:5, speedMax:12, sizeMin:2, sizeMax:5, lifeMin:0.15, lifeMax:0.4, shape:'spark' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#111','#222'], speedMin:8, speedMax:15, sizeMin:1.5, sizeMax:3, lifeMin:0.2, lifeMax:0.5, shape:'diamond' });
    this.particles.addFlash(x, y, '#33cc55', 20, 0.08);
};
// Mage: Watermelon Burst - red juice explosion
SkinFxSystem.prototype._heroHit_watermelon_mage = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#ff2233','#ff6666','#ffaaaa'], speedMin:4, speedMax:10, sizeMin:3, sizeMax:7, lifeMin:0.3, lifeMax:0.6, glow:true, glowSize:8 });
    this.particles.addShockwave(x, y, '#ff2233', 30, 0.15);
};
// Assassin: Watermelon Shuriken - spinning seed blades
SkinFxSystem.prototype._heroHit_watermelon_assassin = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#111','#333','#1e7a30'], speedMin:8, speedMax:16, sizeMin:2, sizeMax:4, lifeMin:0.1, lifeMax:0.3, shape:'diamond' });
    this.particles.addFlash(x, y, '#44ff66', 15, 0.06);
};
// Paladin: Watermelon Shield Smash - green shockwave
SkinFxSystem.prototype._heroHit_watermelon_paladin = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(14*m), { colors:['#1e7a30','#44cc55','#ffffff'], speedMin:3, speedMax:8, sizeMin:3, sizeMax:6, lifeMin:0.3, lifeMax:0.7 });
    this.particles.addShockwave(x, y, '#33aa44', 45, 0.25);
    this.particles.addFlash(x, y, '#33aa44', 30, 0.1);
};
// Archer: Watermelon Seed Shot - rapid seed impacts
SkinFxSystem.prototype._heroHit_watermelon_archer = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#111','#1e7a30','#44ff66'], speedMin:6, speedMax:12, sizeMin:1.5, sizeMax:3, lifeMin:0.1, lifeMax:0.3, shape:'diamond' });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ff2233','#ffaaaa'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:4, lifeMin:0.2, lifeMax:0.4 });
};
// Necromancer: Watermelon Spirit Rot - green ghostly seeds
SkinFxSystem.prototype._heroHit_watermelon_necromancer = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#1e7a30','#88ff88','#aaffaa'], speedMin:2, speedMax:6, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.8, gravity:-0.5 });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#222','#444'], speedMin:1, speedMax:3, sizeMin:2, sizeMax:4, lifeMin:0.5, lifeMax:1.0, gravity:-0.3 });
};

// Passive effects per hero
SkinFxSystem.prototype._heroPassive_watermelon_swordsman = function(x, y) {
    this.particles.emit(x, y, Math.floor(25*this.quality.particleMult), { colors:['#33cc55','#88ff88','#ffffff','#1e7a30'], speedMin:6, speedMax:14, sizeMin:3, sizeMax:7, lifeMin:0.3, lifeMax:0.7, glow:true });
    this.particles.addShockwave(x, y, '#33cc55', 80, 0.3);
};
SkinFxSystem.prototype._heroPassive_watermelon_mage = function(x, y) {
    this.particles.emit(x, y, Math.floor(30*this.quality.particleMult), { colors:['#ff2233','#ff6644','#ffcc00','#1e7a30'], speedMin:5, speedMax:12, sizeMin:4, sizeMax:10, lifeMin:0.5, lifeMax:1.0, glow:true, glowSize:14 });
    this.particles.addShockwave(x, y, '#ff2233', 100, 0.4);
    this.particles.triggerScreenFlash('#ff2233', 0.12, 0.08);
};
SkinFxSystem.prototype._heroPassive_watermelon_assassin = function(x, y) {
    this.particles.emit(x, y, Math.floor(20*this.quality.particleMult), { colors:['#111','#1e7a30','#44ff66'], speedMin:10, speedMax:20, sizeMin:2, sizeMax:4, lifeMin:0.2, lifeMax:0.5, shape:'diamond' });
    this.particles.addFlash(x, y, '#44ff66', 40, 0.15);
};
SkinFxSystem.prototype._heroPassive_watermelon_paladin = function(x, y) {
    this.particles.emit(x, y, Math.floor(20*this.quality.particleMult), { colors:['#33aa44','#88ff88','#ffffff'], speedMin:4, speedMax:10, sizeMin:4, sizeMax:8, lifeMin:0.4, lifeMax:0.9 });
    this.particles.addShockwave(x, y, '#33aa44', 90, 0.35);
};
SkinFxSystem.prototype._heroPassive_watermelon_archer = function(x, y) {
    this.particles.emit(x, y, Math.floor(30*this.quality.particleMult), { colors:['#111','#1e7a30','#ff2233'], speedMin:8, speedMax:18, sizeMin:2, sizeMax:5, lifeMin:0.3, lifeMax:0.6, shape:'diamond' });
    this.particles.addShockwave(x, y, '#33cc55', 70, 0.3);
};
SkinFxSystem.prototype._heroPassive_watermelon_necromancer = function(x, y) {
    this.particles.emit(x, y, Math.floor(25*this.quality.particleMult), { colors:['#1e7a30','#88ffaa','#aaffcc','#ffffff'], speedMin:3, speedMax:8, sizeMin:4, sizeMax:8, lifeMin:0.6, lifeMax:1.2, gravity:-1 });
    this.particles.addShockwave(x, y, '#88ff88', 80, 0.35);
};

// Projectile configs per hero
SkinFxSystem.prototype._heroProj_watermelon_swordsman = function() { return { colors: ['#1e7a30','#44cc55'], trailColor: '#33aa44' }; };
SkinFxSystem.prototype._heroProj_watermelon_mage = function() { return { colors: ['#ff2233','#1e7a30','#ffcc00'], trailColor: '#ff4444' }; };
SkinFxSystem.prototype._heroProj_watermelon_assassin = function() { return { colors: ['#111','#1e7a30'], trailColor: '#44ff66' }; };
SkinFxSystem.prototype._heroProj_watermelon_paladin = function() { return { colors: ['#33aa44','#ffffff'], trailColor: '#88ff88' }; };
SkinFxSystem.prototype._heroProj_watermelon_archer = function() { return { colors: ['#1e7a30','#111'], trailColor: '#33cc55' }; };
SkinFxSystem.prototype._heroProj_watermelon_necromancer = function() { return { colors: ['#88ffaa','#1e7a30'], trailColor: '#aaffcc' }; };

// ====================================================================
// Generate hero effects for ALL remaining skins using a data-driven approach
// Each skin defines its color palette and effect style per hero
// ====================================================================
const SKIN_HERO_FX_DATA = {
    strawberry: {
        palette: { primary: '#ff3366', secondary: '#ff88aa', accent: '#ffccdd', dark: '#8a0a22', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[5,12], passiveGlow:true },
        mage: { hitShape:'circle', hitSpeed:[4,10], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'diamond', hitSpeed:[8,16] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:50 },
        archer: { hitShape:'spark', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.5 },
    },
    orange: {
        palette: { primary: '#ff8800', secondary: '#ffcc44', accent: '#ffe488', dark: '#a34400', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[5,11] },
        mage: { hitShape:'circle', hitSpeed:[4,10], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'diamond', hitSpeed:[8,15] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:45 },
        archer: { hitShape:'spark', hitSpeed:[7,14] },
        necromancer: { hitShape:'circle', hitSpeed:[2,5], gravity:-0.4 },
    },
    fox: {
        palette: { primary: '#88ccff', secondary: '#4488ff', accent: '#aaddff', dark: '#223366', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[4,9], passiveGlow:true },
        assassin: { hitShape:'spark', hitSpeed:[9,18] },
        paladin: { hitShape:'circle', hitSpeed:[3,7], passiveShockwave:40 },
        archer: { hitShape:'spark', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.6 },
    },
    dragon: {
        palette: { primary: '#aa44ff', secondary: '#cc88ff', accent: '#ffcc44', dark: '#220e45', bright: '#ffee88' },
        swordsman: { hitShape:'spark', hitSpeed:[6,13] },
        mage: { hitShape:'circle', hitSpeed:[5,11], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'diamond', hitSpeed:[9,17] },
        paladin: { hitShape:'circle', hitSpeed:[4,9], passiveShockwave:55 },
        archer: { hitShape:'spark', hitSpeed:[7,14] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.4 },
    },
    cat: {
        palette: { primary: '#7744bb', secondary: '#aa66dd', accent: '#cc88ff', dark: '#220044', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[6,14] },
        mage: { hitShape:'circle', hitSpeed:[4,10], passiveGlow:true },
        assassin: { hitShape:'spark', hitSpeed:[10,20] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:40 },
        archer: { hitShape:'spark', hitSpeed:[7,15] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.5 },
    },
    diamond: {
        palette: { primary: '#88ccff', secondary: '#ffffff', accent: '#ddeeff', dark: '#446688', bright: '#ffffff' },
        swordsman: { hitShape:'star', hitSpeed:[5,12] },
        mage: { hitShape:'diamond', hitSpeed:[4,10], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'diamond', hitSpeed:[9,18] },
        paladin: { hitShape:'star', hitSpeed:[3,8], passiveShockwave:50 },
        archer: { hitShape:'diamond', hitSpeed:[7,14] },
        necromancer: { hitShape:'star', hitSpeed:[2,6], gravity:-0.3 },
    },
    ruby: {
        palette: { primary: '#ff2222', secondary: '#ff6644', accent: '#ffaa44', dark: '#660000', bright: '#ffee88' },
        swordsman: { hitShape:'spark', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[5,11], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'spark', hitSpeed:[8,16] },
        paladin: { hitShape:'circle', hitSpeed:[4,9], passiveShockwave:50 },
        archer: { hitShape:'spark', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.3 },
    },
    emerald: {
        palette: { primary: '#22cc66', secondary: '#66ff88', accent: '#aaffcc', dark: '#114422', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[5,11] },
        mage: { hitShape:'circle', hitSpeed:[4,9], passiveGlow:true },
        assassin: { hitShape:'spark', hitSpeed:[8,15] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:45 },
        archer: { hitShape:'spark', hitSpeed:[6,12] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.6 },
    },
    nebula: {
        palette: { primary: '#8844cc', secondary: '#cc4488', accent: '#4488ff', dark: '#0d0520', bright: '#ffffff' },
        swordsman: { hitShape:'circle', hitSpeed:[4,10] },
        mage: { hitShape:'circle', hitSpeed:[5,12], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'spark', hitSpeed:[7,15] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:55 },
        archer: { hitShape:'circle', hitSpeed:[5,11] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.8 },
    },
    blackhole: {
        palette: { primary: '#4400aa', secondary: '#8844ff', accent: '#ffcc44', dark: '#000000', bright: '#ffffff' },
        swordsman: { hitShape:'circle', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[5,13], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'circle', hitSpeed:[8,16] },
        paladin: { hitShape:'circle', hitSpeed:[4,9], passiveShockwave:60 },
        archer: { hitShape:'circle', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.3 },
    },
    phoenix: {
        palette: { primary: '#ff6600', secondary: '#ffcc00', accent: '#ffee88', dark: '#882200', bright: '#ffffee' },
        swordsman: { hitShape:'spark', hitSpeed:[6,14] },
        mage: { hitShape:'circle', hitSpeed:[5,12], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'spark', hitSpeed:[9,18] },
        paladin: { hitShape:'circle', hitSpeed:[4,10], passiveShockwave:55 },
        archer: { hitShape:'spark', hitSpeed:[7,15] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.4 },
    },
    cyberpunk: {
        palette: { primary: '#00ffcc', secondary: '#ff00ff', accent: '#ffffff', dark: '#003333', bright: '#ccffff' },
        swordsman: { hitShape:'square', hitSpeed:[5,12] },
        mage: { hitShape:'square', hitSpeed:[4,10], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'square', hitSpeed:[9,18] },
        paladin: { hitShape:'square', hitSpeed:[3,8], passiveShockwave:50 },
        archer: { hitShape:'square', hitSpeed:[7,14] },
        necromancer: { hitShape:'square', hitSpeed:[2,6], gravity:-0.3 },
    },
    steambot: {
        palette: { primary: '#ffaa33', secondary: '#cccccc', accent: '#ffffff', dark: '#553311', bright: '#ffeecc' },
        swordsman: { hitShape:'circle', hitSpeed:[4,10] },
        mage: { hitShape:'circle', hitSpeed:[5,11], passiveGlow:true },
        assassin: { hitShape:'spark', hitSpeed:[7,14] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:45 },
        archer: { hitShape:'circle', hitSpeed:[5,11] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:0.5 },
    },
    nanocore: {
        palette: { primary: '#44ffaa', secondary: '#88ffdd', accent: '#ffffff', dark: '#112222', bright: '#aaffee' },
        swordsman: { hitShape:'circle', hitSpeed:[4,10] },
        mage: { hitShape:'circle', hitSpeed:[4,10], passiveGlow:true },
        assassin: { hitShape:'circle', hitSpeed:[8,16] },
        paladin: { hitShape:'circle', hitSpeed:[3,8], passiveShockwave:45 },
        archer: { hitShape:'circle', hitSpeed:[6,12] },
        necromancer: { hitShape:'circle', hitSpeed:[2,5], gravity:-0.3 },
    },
    thunder: {
        palette: { primary: '#ffee44', secondary: '#ffffff', accent: '#ffff88', dark: '#554400', bright: '#ffffff' },
        swordsman: { hitShape:'spark', hitSpeed:[6,15] },
        mage: { hitShape:'spark', hitSpeed:[7,16], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'spark', hitSpeed:[10,20] },
        paladin: { hitShape:'spark', hitSpeed:[5,12], passiveShockwave:55 },
        archer: { hitShape:'spark', hitSpeed:[8,16] },
        necromancer: { hitShape:'spark', hitSpeed:[4,10] },
    },
    glacier: {
        palette: { primary: '#88ddff', secondary: '#aaeeff', accent: '#ffffff', dark: '#224466', bright: '#ccf0ff' },
        swordsman: { hitShape:'diamond', hitSpeed:[4,10] },
        mage: { hitShape:'diamond', hitSpeed:[4,10], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'diamond', hitSpeed:[8,15] },
        paladin: { hitShape:'diamond', hitSpeed:[3,8], passiveShockwave:50 },
        archer: { hitShape:'diamond', hitSpeed:[6,12] },
        necromancer: { hitShape:'diamond', hitSpeed:[2,6], gravity:-0.3 },
    },
    shadow: {
        palette: { primary: '#66ddaa', secondary: '#aaffdd', accent: '#88ffcc', dark: '#1a4433', bright: '#ffffff' },
        swordsman: { hitShape:'circle', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[5,11], passiveGlow:true },
        assassin: { hitShape:'circle', hitSpeed:[9,17] },
        paladin: { hitShape:'circle', hitSpeed:[3,9], passiveShockwave:50 },
        archer: { hitShape:'circle', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[2,6], gravity:-0.5 },
    },
    voidwalker: {
        palette: { primary: '#8844ff', secondary: '#aa66ff', accent: '#cc88ff', dark: '#220044', bright: '#ffffff' },
        swordsman: { hitShape:'circle', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[5,12], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'circle', hitSpeed:[9,18] },
        paladin: { hitShape:'circle', hitSpeed:[4,9], passiveShockwave:55 },
        archer: { hitShape:'circle', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.4 },
    },
    bloodmoon: {
        palette: { primary: '#cc0000', secondary: '#ff4444', accent: '#ff8888', dark: '#330000', bright: '#ffcccc' },
        swordsman: { hitShape:'circle', hitSpeed:[5,12] },
        mage: { hitShape:'circle', hitSpeed:[5,12], passiveGlow:true, passiveScreen:true },
        assassin: { hitShape:'circle', hitSpeed:[9,17] },
        paladin: { hitShape:'circle', hitSpeed:[4,9], passiveShockwave:50 },
        archer: { hitShape:'circle', hitSpeed:[6,13] },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:1.0 },
    },
    chaoseye: {
        palette: { primary: '#ff4488', secondary: '#44ff88', accent: '#4488ff', dark: '#222222', bright: '#ffffff' },
        swordsman: { hitShape:'circle', hitSpeed:[5,13], hueShift:true },
        mage: { hitShape:'circle', hitSpeed:[5,13], passiveGlow:true, passiveScreen:true, hueShift:true },
        assassin: { hitShape:'circle', hitSpeed:[9,18], hueShift:true },
        paladin: { hitShape:'circle', hitSpeed:[4,10], passiveShockwave:60, hueShift:true },
        archer: { hitShape:'circle', hitSpeed:[7,14], hueShift:true },
        necromancer: { hitShape:'circle', hitSpeed:[3,7], gravity:-0.3, hueShift:true },
    },
};

// Auto-generate hero FX methods from data
const HEROES = ['swordsman', 'mage', 'assassin', 'paladin', 'archer', 'necromancer'];

for (const [skinId, data] of Object.entries(SKIN_HERO_FX_DATA)) {
    const p = data.palette;
    for (const hero of HEROES) {
        const h = data[hero];
        if (!h) continue;

        // Hit effect
        SkinFxSystem.prototype['_heroHit_' + skinId + '_' + hero] = function(x, y) {
            const m = this.quality.particleMult;
            const count = hero === 'paladin' ? 14 : (hero === 'assassin' ? 8 : 10);
            this.particles.emit(x, y, Math.floor(count*m), {
                colors: [p.primary, p.secondary, p.accent, p.bright],
                speedMin: h.hitSpeed[0], speedMax: h.hitSpeed[1],
                sizeMin: 2, sizeMax: 5,
                lifeMin: 0.2, lifeMax: 0.5,
                shape: h.hitShape || 'circle',
                glow: true, glowSize: 8,
                hueShift: h.hueShift || false,
                gravity: h.gravity || 0,
            });
            if (hero === 'paladin') {
                this.particles.addShockwave(x, y, p.primary, 35, 0.2);
            }
            this.particles.addFlash(x, y, p.primary, 20, 0.07);
        };

        // Passive effect
        SkinFxSystem.prototype['_heroPassive_' + skinId + '_' + hero] = function(x, y) {
            const m = this.quality.particleMult;
            const count = hero === 'mage' ? 35 : (hero === 'necromancer' ? 25 : 20);
            this.particles.emit(x, y, Math.floor(count*m), {
                colors: [p.primary, p.secondary, p.accent, p.bright],
                speedMin: h.hitSpeed[0]+1, speedMax: h.hitSpeed[1]+3,
                sizeMin: 3, sizeMax: 7,
                lifeMin: 0.4, lifeMax: 0.9,
                shape: h.hitShape || 'circle',
                glow: true, glowSize: 12,
                hueShift: h.hueShift || false,
                gravity: h.gravity || 0,
            });
            if (h.passiveShockwave) {
                this.particles.addShockwave(x, y, p.primary, h.passiveShockwave, 0.35);
            } else {
                this.particles.addShockwave(x, y, p.primary, 80, 0.3);
            }
            if (h.passiveScreen) {
                this.particles.triggerScreenFlash(p.primary, 0.12, 0.08);
            }
            if (h.passiveGlow) {
                this.particles.addFlash(x, y, p.bright, 40, 0.15);
            }
        };

        // Proj config
        SkinFxSystem.prototype['_heroProj_' + skinId + '_' + hero] = function() {
            return { colors: [p.primary, p.secondary], trailColor: p.primary, hueShift: h.hueShift || false };
        };
    }
}
