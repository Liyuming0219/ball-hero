// ============================================
// 新皮肤特效扩展 - 12款皮肤的 hit/skill/trail/aura
// 使用 this.particles.emit(x, y, count, config)
// ============================================

const TWO_PI_FX = Math.PI * 2;

// === 机械纪元: cyberpunk ===
SkinFxSystem.prototype._hit_cyberpunk = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#00ffcc','#ff00ff'], speedMin:3, speedMax:6, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'square' });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ffffff','#ccffff'], speedMin:1, speedMax:3, sizeMin:2, sizeMax:3, lifeMin:0.4, lifeMax:0.6, shape:'spark' });
};
SkinFxSystem.prototype._skill_cyberpunk = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(20*m), { colors:['#00ffcc','#ff00ff','#ffffff'], speedMin:5, speedMax:10, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:0.9, shape:'square' });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ffffff','#aaffee'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:3, lifeMin:0.6, lifeMax:1, shape:'spark', glow:true });
};
SkinFxSystem.prototype._trail_cyberpunk = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#00ffcc','#ff00ff'], speedMin:0.2, speedMax:1, sizeMin:2, sizeMax:3, lifeMin:0.2, lifeMax:0.35, shape:'square', offsetX:4, offsetY:4 });
};
SkinFxSystem.prototype._aura_cyberpunk = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.15+Math.sin(t*4)*0.05; ctx.strokeStyle='#00ffcc'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(x,y,r*1.8+Math.sin(t*3)*3,0,TWO_PI_FX); ctx.stroke();
    ctx.strokeStyle='#ff00ff'; ctx.beginPath(); ctx.arc(x,y,r*2.2+Math.cos(t*2)*4,t,t+Math.PI); ctx.stroke();
    ctx.restore();
};

// === 机械纪元: steambot ===
SkinFxSystem.prototype._hit_steambot = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#cccccc','#999999'], speedMin:2, speedMax:5, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.6, shape:'circle', gravity:0.5 });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ffaa33','#ffcc44'], speedMin:3, speedMax:6, sizeMin:2, sizeMax:3, lifeMin:0.2, lifeMax:0.4, shape:'spark' });
};
SkinFxSystem.prototype._skill_steambot = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(15*m), { colors:['#cccccc','#ffffff','#888888'], speedMin:4, speedMax:8, sizeMin:4, sizeMax:7, lifeMin:0.5, lifeMax:0.8, shape:'circle', gravity:0.8 });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#ffcc44','#ffaa00'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:4, lifeMin:0.6, lifeMax:1, shape:'spark', glow:true });
};
SkinFxSystem.prototype._trail_steambot = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#cccccc','#aaaaaa'], speedMin:0.5, speedMax:2, sizeMin:3, sizeMax:5, lifeMin:0.4, lifeMax:0.7, shape:'circle', gravity:-0.5, offsetX:3, offsetY:3 });
};
SkinFxSystem.prototype._aura_steambot = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.1; ctx.fillStyle='#ffaa33';
    for(let i=0;i<3;i++){const a=t*2+(i/3)*TWO_PI_FX; ctx.beginPath(); ctx.arc(x+Math.cos(a)*r*1.5,y+Math.sin(a)*r*1.5,4,0,TWO_PI_FX); ctx.fill();}
    ctx.restore();
};

// === 机械纪元: nanocore ===
SkinFxSystem.prototype._hit_nanocore = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#44ffaa','#88ffdd','#22ddaa'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:3, lifeMin:0.3, lifeMax:0.6, shape:'circle' });
};
SkinFxSystem.prototype._skill_nanocore = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(30*m), { colors:['#44ffaa','#88ffdd','#ffffff'], speedMin:1, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.6, lifeMax:1.2, shape:'circle', glow:true });
};
SkinFxSystem.prototype._trail_nanocore = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(2*this.quality.particleMult)), { colors:['#44ffaa','#88ffdd'], speedMin:0.5, speedMax:2, sizeMin:2, sizeMax:3, lifeMin:0.3, lifeMax:0.5, shape:'circle', offsetX:6, offsetY:6 });
};
SkinFxSystem.prototype._aura_nanocore = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.12; ctx.strokeStyle='#44ffaa'; ctx.lineWidth=1;
    for(let i=0;i<3;i++){const rad=r*1.5+i*8+Math.sin(t*2+i)*3; ctx.beginPath(); ctx.arc(x,y,rad,0,TWO_PI_FX); ctx.stroke();}
    ctx.restore();
};

// === 元素领主: thunder ===
SkinFxSystem.prototype._hit_thunder = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#ffff88','#ffffff','#ffee00'], speedMin:4, speedMax:9, sizeMin:2, sizeMax:4, lifeMin:0.15, lifeMax:0.35, shape:'spark' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#ffffff'], speedMin:0, speedMax:1, sizeMin:5, sizeMax:8, lifeMin:0.1, lifeMax:0.2, shape:'ring', glow:true, offsetX:10, offsetY:10 });
};
SkinFxSystem.prototype._skill_thunder = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(24*m), { colors:['#ffee00','#ffff88','#ffffff'], speedMin:6, speedMax:12, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'spark', glow:true });
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#ffffff'], speedMin:0, speedMax:2, sizeMin:6, sizeMax:10, lifeMin:0.1, lifeMax:0.25, shape:'ring', offsetX:20, offsetY:20 });
};
SkinFxSystem.prototype._trail_thunder = function(x, y) {
    if(Math.random()<0.3) this.particles.emit(x, y, 1, { colors:['#ffff88','#ffee00'], speedMin:0, speedMax:1, sizeMin:2, sizeMax:4, lifeMin:0.1, lifeMax:0.2, shape:'spark', offsetX:3, offsetY:3 });
};
SkinFxSystem.prototype._aura_thunder = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.08+Math.random()*0.05; ctx.strokeStyle='#ffee88'; ctx.lineWidth=1;
    ctx.beginPath(); for(let i=0;i<12;i++){const a=(i/12)*TWO_PI_FX; const rr=r*2+(Math.random()-0.5)*8; if(i===0)ctx.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);else ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);} ctx.closePath(); ctx.stroke();
    ctx.restore();
};

// === 元素领主: glacier ===
SkinFxSystem.prototype._hit_glacier = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#aaeeff','#88ddff','#ffffff'], speedMin:3, speedMax:6, sizeMin:2, sizeMax:4, lifeMin:0.4, lifeMax:0.7, shape:'diamond' });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ffffff','#ccf0ff'], speedMin:0.5, speedMax:2, sizeMin:3, sizeMax:5, lifeMin:0.6, lifeMax:1, shape:'star', gravity:-0.3, offsetX:8, offsetY:8 });
};
SkinFxSystem.prototype._skill_glacier = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(20*m), { colors:['#88ddff','#aaeeff','#ffffff'], speedMin:5, speedMax:9, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:0.9, shape:'diamond', glow:true });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ffffff','#ccf0ff'], speedMin:1, speedMax:4, sizeMin:4, sizeMax:6, lifeMin:0.8, lifeMax:1.3, shape:'star', gravity:-0.5, offsetX:15, offsetY:15 });
};
SkinFxSystem.prototype._trail_glacier = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#aaeeff','#ffffff'], speedMin:0.3, speedMax:1.5, sizeMin:2, sizeMax:3, lifeMin:0.3, lifeMax:0.5, shape:'diamond', gravity:-0.3, offsetX:4, offsetY:4 });
};
SkinFxSystem.prototype._aura_glacier = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.1; ctx.fillStyle='#88ddff';
    for(let i=0;i<5;i++){const a=t*0.5+(i/5)*TWO_PI_FX; const d=r*2+Math.sin(t+i)*5;
        ctx.beginPath(); ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,3,0,TWO_PI_FX); ctx.fill();}
    ctx.restore();
};

// === 元素领主: shadow ===
SkinFxSystem.prototype._hit_shadow = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#6600aa','#ff00ff','#aa44ff'], speedMin:2, speedMax:5, sizeMin:3, sizeMax:5, lifeMin:0.3, lifeMax:0.6, shape:'circle' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#ff00ff'], speedMin:0, speedMax:1, sizeMin:5, sizeMax:8, lifeMin:0.15, lifeMax:0.3, shape:'ring', offsetX:8, offsetY:8 });
};
SkinFxSystem.prototype._skill_shadow = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(16*m), { colors:['#aa44ff','#6600aa','#4400aa'], speedMin:5, speedMax:10, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.8, shape:'circle' });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#ff00ff','#ff44ff'], speedMin:0, speedMax:2, sizeMin:5, sizeMax:8, lifeMin:0.2, lifeMax:0.4, shape:'ring', offsetX:15, offsetY:15, glow:true });
};
SkinFxSystem.prototype._trail_shadow = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#6600aa','#4400aa'], speedMin:0, speedMax:0.5, sizeMin:3, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'circle', offsetX:5, offsetY:5 });
};
SkinFxSystem.prototype._aura_shadow = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.12; ctx.fillStyle='#4400aa';
    ctx.beginPath(); ctx.arc(x,y,r*2+Math.sin(t*2)*4,0,TWO_PI_FX); ctx.fill();
    ctx.globalAlpha=0.06; ctx.fillStyle='#ff00ff'; ctx.beginPath(); ctx.arc(x,y,r*2.5+Math.cos(t*1.5)*5,0,TWO_PI_FX); ctx.fill();
    ctx.restore();
};

// === 东方神话: kitsune ===
SkinFxSystem.prototype._hit_kitsune = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#44aaff','#88ccff'], speedMin:3, speedMax:6, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle' });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ff8844','#ffaa22','#ffcc44'], speedMin:2, speedMax:4, sizeMin:3, sizeMax:5, lifeMin:0.4, lifeMax:0.7, shape:'circle', gravity:-0.5 });
};
SkinFxSystem.prototype._skill_kitsune = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(18*m), { colors:['#44aaff','#ff8844','#ffcc44'], speedMin:5, speedMax:9, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:0.9, shape:'circle', glow:true });
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#44aaff','#88ccff'], speedMin:1, speedMax:3, sizeMin:4, sizeMax:6, lifeMin:0.8, lifeMax:1.2, shape:'circle', gravity:-1 });
};
SkinFxSystem.prototype._trail_kitsune = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#44aaff','#ff8844'], speedMin:0.3, speedMax:1.5, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'circle', gravity:-0.3, offsetX:4, offsetY:4 });
};
SkinFxSystem.prototype._aura_kitsune = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.12; ctx.fillStyle='#44aaff';
    for(let i=0;i<3;i++){const a=t*1.2+(i/3)*TWO_PI_FX; const d=r*1.8;
        ctx.beginPath(); ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d-r*0.5,5,0,TWO_PI_FX); ctx.fill();}
    ctx.restore();
};

// === 东方神话: dragonking ===
SkinFxSystem.prototype._hit_dragonking = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#66bbff','#4488ff','#88ddff'], speedMin:3, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.4, lifeMax:0.7, shape:'circle' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#aaddff','#ffffff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:10, lifeMin:0.2, lifeMax:0.4, shape:'ring' });
};
SkinFxSystem.prototype._skill_dragonking = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(24*m), { colors:['#4488ff','#66bbff','#88ddff'], speedMin:6, speedMax:11, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:1, shape:'circle', glow:true });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#88ddff','#aaddff'], speedMin:2, speedMax:5, sizeMin:4, sizeMax:6, lifeMin:0.8, lifeMax:1.3, shape:'circle', gravity:-1.5 });
};
SkinFxSystem.prototype._trail_dragonking = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#66bbff','#88ddff'], speedMin:0.5, speedMax:2, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle', gravity:-0.5, offsetX:5, offsetY:5 });
};
SkinFxSystem.prototype._aura_dragonking = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.08; ctx.strokeStyle='#66bbff'; ctx.lineWidth=2;
    for(let i=0;i<2;i++){ctx.beginPath(); for(let j=0;j<16;j++){const a=(j/16)*TWO_PI_FX; const rr=r*2+i*6+Math.sin(a*3+t*2+i)*4; if(j===0)ctx.moveTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);else ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);} ctx.closePath(); ctx.stroke();}
    ctx.restore();
};

// === 东方神话: wukong ===
SkinFxSystem.prototype._hit_wukong = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ffcc00','#ff6600','#ffffff'], speedMin:4, speedMax:8, sizeMin:2, sizeMax:4, lifeMin:0.2, lifeMax:0.5, shape:'spark' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#ffffff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:10, lifeMin:0.1, lifeMax:0.2, shape:'ring', glow:true });
};
SkinFxSystem.prototype._skill_wukong = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(36*m), { colors:['#ffcc00','#ff6600','#ffffff','#ffee00'], speedMin:6, speedMax:12, sizeMin:3, sizeMax:5, lifeMin:0.4, lifeMax:0.8, shape:'spark', glow:true });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#ffffff','#ffee88'], speedMin:1, speedMax:3, sizeMin:4, sizeMax:7, lifeMin:0.8, lifeMax:1.2, shape:'circle', gravity:-1, offsetX:15, offsetY:15 });
};
SkinFxSystem.prototype._trail_wukong = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#ffcc00','#ffee00'], speedMin:0.3, speedMax:1.5, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'circle', gravity:-0.3, offsetX:3, offsetY:3 });
};
SkinFxSystem.prototype._aura_wukong = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.12; ctx.strokeStyle='#ffcc00'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y,r*2+Math.sin(t*3)*3,0,TWO_PI_FX); ctx.stroke();
    ctx.globalAlpha=0.06; ctx.fillStyle='#ffffff';
    for(let i=0;i<4;i++){const a=t*0.8+(i/4)*TWO_PI_FX; const d=r*2.2;
        ctx.beginPath(); ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,6,0,TWO_PI_FX); ctx.fill();}
    ctx.restore();
};

// === 深渊: voidwalker ===
SkinFxSystem.prototype._hit_voidwalker = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#8844ff','#aa66ff','#cc88ff'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:4, lifeMin:0.4, lifeMax:0.7, shape:'circle' });
    this.particles.emit(x, y, Math.floor(2*m), { colors:['#4400aa'], speedMin:0, speedMax:0.5, sizeMin:10, sizeMax:16, lifeMin:0.2, lifeMax:0.4, shape:'ring' });
};
SkinFxSystem.prototype._skill_voidwalker = function(x, y) {
    const m = this.quality.particleMult;
    // 虚空坍缩 - 向内吸收效果用外扩代替（API限制）
    this.particles.emit(x, y, Math.floor(20*m), { colors:['#aa66ff','#8844ff','#cc88ff'], speedMin:5, speedMax:10, sizeMin:3, sizeMax:5, lifeMin:0.4, lifeMax:0.7, shape:'circle', glow:true });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#4400aa','#220066'], speedMin:0, speedMax:1, sizeMin:8, sizeMax:14, lifeMin:0.3, lifeMax:0.5, shape:'ring' });
};
SkinFxSystem.prototype._trail_voidwalker = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#8844ff','#6633aa'], speedMin:0, speedMax:0.8, sizeMin:2, sizeMax:3, lifeMin:0.3, lifeMax:0.6, shape:'circle', offsetX:4, offsetY:4 });
};
SkinFxSystem.prototype._aura_voidwalker = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.08; ctx.fillStyle='#220044';
    ctx.beginPath(); ctx.arc(x,y,r*2.5+Math.sin(t)*5,0,TWO_PI_FX); ctx.fill();
    ctx.globalAlpha=0.1; ctx.strokeStyle='#aa66ff'; ctx.lineWidth=1;
    ctx.save(); ctx.translate(x,y); ctx.rotate(t*0.5);
    ctx.beginPath(); ctx.ellipse(0,0,r*2,r*0.8,0,0,TWO_PI_FX); ctx.stroke(); ctx.restore();
    ctx.restore();
};

// === 深渊: bloodmoon ===
SkinFxSystem.prototype._hit_bloodmoon = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#cc0000','#ff4444','#ff0000'], speedMin:3, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle' });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#aa0000','#880000'], speedMin:0.5, speedMax:2, sizeMin:2, sizeMax:3, lifeMin:0.4, lifeMax:0.7, shape:'circle', gravity:1.5 });
};
SkinFxSystem.prototype._skill_bloodmoon = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(24*m), { colors:['#ff0000','#cc0000','#ff4444'], speedMin:6, speedMax:11, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:0.9, shape:'circle', glow:true });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#880000','#aa0000'], speedMin:1, speedMax:4, sizeMin:2, sizeMax:3, lifeMin:0.7, lifeMax:1.1, shape:'circle', gravity:2 });
};
SkinFxSystem.prototype._trail_bloodmoon = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(1*this.quality.particleMult)), { colors:['#cc0000','#aa0000'], speedMin:0.3, speedMax:1.5, sizeMin:2, sizeMax:3, lifeMin:0.3, lifeMax:0.6, shape:'circle', gravity:1, offsetX:3, offsetY:2 });
};
SkinFxSystem.prototype._aura_bloodmoon = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.1+Math.sin(t*2)*0.03; ctx.fillStyle='#aa0000';
    ctx.beginPath(); ctx.arc(x,y,r*2.2+Math.sin(t*1.5)*4,0,TWO_PI_FX); ctx.fill();
    ctx.globalAlpha=0.05; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(x,y,r*2.8,0,TWO_PI_FX); ctx.fill();
    ctx.restore();
};

// === 深渊: chaoseye ===
SkinFxSystem.prototype._hit_chaoseye = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff','#ff4444'], speedMin:3, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle', hueShift:true });
    this.particles.emit(x, y, Math.floor(3*m), { colors:['#ffffff'], speedMin:0, speedMax:1, sizeMin:5, sizeMax:8, lifeMin:0.15, lifeMax:0.3, shape:'ring', hueShift:true });
};
SkinFxSystem.prototype._skill_chaoseye = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(30*m), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff','#ff4444','#00ffcc'], speedMin:6, speedMax:12, sizeMin:3, sizeMax:5, lifeMin:0.5, lifeMax:1, shape:'circle', glow:true, hueShift:true });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#ffffff','#ffee88','#ff88cc'], speedMin:0, speedMax:2, sizeMin:6, sizeMax:10, lifeMin:0.2, lifeMax:0.4, shape:'ring', offsetX:15, offsetY:15, hueShift:true });
};
SkinFxSystem.prototype._trail_chaoseye = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(2*this.quality.particleMult)), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff'], speedMin:0.5, speedMax:2, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'circle', hueShift:true, offsetX:5, offsetY:5 });
};
SkinFxSystem.prototype._aura_chaoseye = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time; const hue=(t*40)%360;
    ctx.save(); ctx.globalAlpha=0.08; ctx.strokeStyle=`hsl(${hue},80%,50%)`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(x,y,r*2+Math.sin(t*2)*4,0,TWO_PI_FX); ctx.stroke();
    ctx.strokeStyle=`hsl(${(hue+120)%360},80%,50%)`; ctx.beginPath(); ctx.arc(x,y,r*2.5+Math.cos(t*1.5)*5,0,TWO_PI_FX); ctx.stroke();
    ctx.restore();
};
