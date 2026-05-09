// ============================================
// 新皮肤特效扩展 - 12款皮肤的 hit/skill/trail/aura
// 使用 this.particles.emit(x, y, count, config)
// ============================================

const TWO_PI_FX = Math.PI * 2;

// === 机械纪元: cyberpunk ===
SkinFxSystem.prototype._hit_cyberpunk = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#00ffcc','#ff00ff','#ffffff'], speedMin:4, speedMax:8, sizeMin:2, sizeMax:5, lifeMin:0.3, lifeMax:0.6, shape:'square', glow:true, glowSize:8 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#ffffff','#ccffff'], speedMin:1, speedMax:3, sizeMin:2, sizeMax:4, lifeMin:0.4, lifeMax:0.6, shape:'spark' });
    this.particles.addFlash(x, y, '#00ffcc', 22, 0.06);
};
SkinFxSystem.prototype._skill_cyberpunk = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(28*m), { colors:['#00ffcc','#ff00ff','#ffffff'], speedMin:5, speedMax:11, sizeMin:3, sizeMax:6, lifeMin:0.5, lifeMax:1.0, shape:'square', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#ffffff','#aaffee'], speedMin:2, speedMax:5, sizeMin:2, sizeMax:4, lifeMin:0.6, lifeMax:1, shape:'spark', glow:true });
    this.particles.addShockwave(x, y, '#00ffcc', 80, 0.3);
    Utils.shake(3);
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
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#cccccc','#999999','#ffffff'], speedMin:3, speedMax:7, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.7, shape:'circle', gravity:0.5 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#ffaa33','#ffcc44'], speedMin:3, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.2, lifeMax:0.5, shape:'spark', glow:true });
    this.particles.addFlash(x, y, '#ffaa33', 20, 0.06);
};
SkinFxSystem.prototype._skill_steambot = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(22*m), { colors:['#cccccc','#ffffff','#888888'], speedMin:5, speedMax:10, sizeMin:4, sizeMax:7, lifeMin:0.5, lifeMax:0.9, shape:'circle', gravity:0.8 });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ffcc44','#ffaa00','#ffffff'], speedMin:3, speedMax:6, sizeMin:2, sizeMax:5, lifeMin:0.6, lifeMax:1, shape:'spark', glow:true });
    this.particles.addShockwave(x, y, '#ffaa33', 70, 0.3);
    Utils.shake(3);
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
    this.particles.emit(x, y, Math.floor(14*m), { colors:['#44ffaa','#88ffdd','#22ddaa','#ffffff'], speedMin:3, speedMax:7, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle', glow:true, glowSize:6 });
    this.particles.addFlash(x, y, '#44ffaa', 18, 0.06);
};
SkinFxSystem.prototype._skill_nanocore = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(35*m), { colors:['#44ffaa','#88ffdd','#ffffff'], speedMin:2, speedMax:9, sizeMin:2, sizeMax:5, lifeMin:0.6, lifeMax:1.2, shape:'circle', glow:true, glowSize:10 });
    this.particles.addShockwave(x, y, '#44ffaa', 80, 0.35);
    Utils.shake(3);
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
    this.particles.emit(x, y, Math.floor(14*m), { colors:['#ffff88','#ffffff','#ffee00'], speedMin:5, speedMax:12, sizeMin:2, sizeMax:5, lifeMin:0.15, lifeMax:0.4, shape:'spark', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ffffff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:10, lifeMin:0.1, lifeMax:0.2, shape:'ring', glow:true, offsetX:10, offsetY:10 });
    this.particles.addFlash(x, y, '#ffee00', 30, 0.08);
    this.particles.addShockwave(x, y, '#ffff88', 40, 0.2);
};
SkinFxSystem.prototype._skill_thunder = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(40*m), { colors:['#ffee00','#ffff88','#ffffff'], speedMin:6, speedMax:14, sizeMin:3, sizeMax:6, lifeMin:0.3, lifeMax:0.7, shape:'spark', glow:true, glowSize:14 });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ffffff','#ffee88'], speedMin:0, speedMax:2, sizeMin:6, sizeMax:12, lifeMin:0.1, lifeMax:0.3, shape:'ring', offsetX:20, offsetY:20 });
    this.particles.addShockwave(x, y, '#ffee00', 120, 0.4);
    this.particles.triggerScreenFlash('#ffff44', 0.2, 0.12);
    Utils.shake(6);
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
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#aaeeff','#88ddff','#ffffff'], speedMin:3, speedMax:8, sizeMin:2, sizeMax:5, lifeMin:0.4, lifeMax:0.8, shape:'diamond', glow:true, glowSize:8 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#ffffff','#ccf0ff'], speedMin:0.5, speedMax:2, sizeMin:3, sizeMax:6, lifeMin:0.6, lifeMax:1, shape:'star', gravity:-0.3, offsetX:8, offsetY:8 });
    this.particles.addFlash(x, y, '#88ddff', 25, 0.08);
    this.particles.addShockwave(x, y, '#aaeeff', 35, 0.2);
};
SkinFxSystem.prototype._skill_glacier = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(35*m), { colors:['#88ddff','#aaeeff','#ffffff','#ccf0ff'], speedMin:5, speedMax:11, sizeMin:3, sizeMax:6, lifeMin:0.5, lifeMax:1.0, shape:'diamond', glow:true, glowSize:12 });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#ffffff','#ccf0ff'], speedMin:1, speedMax:4, sizeMin:4, sizeMax:7, lifeMin:0.8, lifeMax:1.5, shape:'star', gravity:-0.5, offsetX:15, offsetY:15 });
    this.particles.addShockwave(x, y, '#88ddff', 110, 0.45);
    this.particles.triggerScreenFlash('#aaeeff', 0.15, 0.1);
    Utils.shake(5);
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
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#6600aa','#ff00ff','#aa44ff','#cc00ff'], speedMin:3, speedMax:8, sizeMin:3, sizeMax:6, lifeMin:0.3, lifeMax:0.7, shape:'circle', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ff00ff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:10, lifeMin:0.15, lifeMax:0.3, shape:'ring', offsetX:8, offsetY:8 });
    this.particles.addFlash(x, y, '#aa00ff', 28, 0.08);
    this.particles.addShockwave(x, y, '#6600aa', 35, 0.2);
};
SkinFxSystem.prototype._skill_shadow = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(30*m), { colors:['#aa44ff','#6600aa','#4400aa','#ff00ff'], speedMin:5, speedMax:12, sizeMin:3, sizeMax:7, lifeMin:0.4, lifeMax:0.9, shape:'circle', glow:true, glowSize:14 });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#ff00ff','#ff44ff'], speedMin:0, speedMax:2, sizeMin:6, sizeMax:10, lifeMin:0.2, lifeMax:0.5, shape:'ring', offsetX:15, offsetY:15, glow:true });
    this.particles.addShockwave(x, y, '#aa00ff', 100, 0.4);
    this.particles.triggerScreenFlash('#6600aa', 0.15, 0.12);
    Utils.shake(5);
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
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#44aaff','#88ccff','#ffffff'], speedMin:4, speedMax:9, sizeMin:2, sizeMax:5, lifeMin:0.3, lifeMax:0.7, shape:'circle', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(6*m), { colors:['#ff8844','#ffaa22','#ffcc44'], speedMin:3, speedMax:6, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.8, shape:'circle', gravity:-0.5 });
    this.particles.addFlash(x, y, '#44aaff', 25, 0.08);
    this.particles.addShockwave(x, y, '#ff8844', 40, 0.2);
};
SkinFxSystem.prototype._skill_kitsune = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(35*m), { colors:['#44aaff','#ff8844','#ffcc44','#ffffff'], speedMin:5, speedMax:12, sizeMin:3, sizeMax:6, lifeMin:0.5, lifeMax:1.0, shape:'circle', glow:true, glowSize:14 });
    this.particles.emit(x, y, Math.floor(10*m), { colors:['#44aaff','#88ccff'], speedMin:1, speedMax:4, sizeMin:4, sizeMax:7, lifeMin:0.8, lifeMax:1.4, shape:'circle', gravity:-1 });
    this.particles.addShockwave(x, y, '#44aaff', 120, 0.45);
    this.particles.triggerScreenFlash('#44aaff', 0.12, 0.1);
    Utils.shake(6);
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
    this.particles.emit(x, y, Math.floor(16*m), { colors:['#66bbff','#4488ff','#88ddff','#ffffff'], speedMin:4, speedMax:10, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.8, shape:'circle', glow:true, glowSize:12 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#aaddff','#ffffff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:12, lifeMin:0.2, lifeMax:0.4, shape:'ring', glow:true });
    this.particles.addFlash(x, y, '#4488ff', 30, 0.1);
    this.particles.addShockwave(x, y, '#66bbff', 45, 0.25);
};
SkinFxSystem.prototype._skill_dragonking = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(45*m), { colors:['#4488ff','#66bbff','#88ddff','#ffffff'], speedMin:6, speedMax:14, sizeMin:3, sizeMax:7, lifeMin:0.5, lifeMax:1.1, shape:'circle', glow:true, glowSize:16 });
    this.particles.emit(x, y, Math.floor(15*m), { colors:['#88ddff','#aaddff'], speedMin:2, speedMax:6, sizeMin:4, sizeMax:7, lifeMin:0.8, lifeMax:1.5, shape:'circle', gravity:-1.5 });
    this.particles.addShockwave(x, y, '#4488ff', 140, 0.5);
    this.particles.triggerScreenFlash('#4488ff', 0.18, 0.12);
    Utils.shake(7);
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
    this.particles.emit(x, y, Math.floor(18*m), { colors:['#ffcc00','#ff6600','#ffffff','#ffee00'], speedMin:5, speedMax:12, sizeMin:3, sizeMax:6, lifeMin:0.2, lifeMax:0.5, shape:'spark', glow:true, glowSize:12 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#ffffff','#ffee88'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:12, lifeMin:0.1, lifeMax:0.25, shape:'ring', glow:true });
    this.particles.addFlash(x, y, '#ffcc00', 35, 0.1);
    this.particles.addShockwave(x, y, '#ff6600', 50, 0.25);
};
SkinFxSystem.prototype._skill_wukong = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(50*m), { colors:['#ffcc00','#ff6600','#ffffff','#ffee00'], speedMin:7, speedMax:15, sizeMin:3, sizeMax:7, lifeMin:0.4, lifeMax:0.9, shape:'spark', glow:true, glowSize:16 });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#ffffff','#ffee88'], speedMin:1, speedMax:4, sizeMin:5, sizeMax:8, lifeMin:0.8, lifeMax:1.4, shape:'circle', gravity:-1, offsetX:15, offsetY:15 });
    this.particles.addShockwave(x, y, '#ffcc00', 150, 0.5);
    this.particles.triggerScreenFlash('#ffcc00', 0.2, 0.12);
    Utils.shake(8);
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
    this.particles.emit(x, y, Math.floor(14*m), { colors:['#8844ff','#aa66ff','#cc88ff','#ffffff'], speedMin:3, speedMax:8, sizeMin:3, sizeMax:5, lifeMin:0.4, lifeMax:0.8, shape:'circle', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#4400aa','#220066'], speedMin:0, speedMax:0.5, sizeMin:10, sizeMax:18, lifeMin:0.2, lifeMax:0.4, shape:'ring' });
    this.particles.addFlash(x, y, '#8844ff', 25, 0.08);
    this.particles.addShockwave(x, y, '#aa66ff', 40, 0.2);
};
SkinFxSystem.prototype._skill_voidwalker = function(x, y) {
    const m = this.quality.particleMult;
    // 虚空坍缩 - 强力外扩
    this.particles.emit(x, y, Math.floor(35*m), { colors:['#aa66ff','#8844ff','#cc88ff','#ffffff'], speedMin:5, speedMax:13, sizeMin:3, sizeMax:6, lifeMin:0.4, lifeMax:0.9, shape:'circle', glow:true, glowSize:14 });
    this.particles.emit(x, y, Math.floor(8*m), { colors:['#4400aa','#220066'], speedMin:0, speedMax:1, sizeMin:10, sizeMax:16, lifeMin:0.3, lifeMax:0.6, shape:'ring', glow:true });
    this.particles.addShockwave(x, y, '#8844ff', 130, 0.45);
    this.particles.triggerScreenFlash('#4400aa', 0.15, 0.12);
    Utils.shake(6);
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
    this.particles.emit(x, y, Math.floor(14*m), { colors:['#cc0000','#ff4444','#ff0000','#ffffff'], speedMin:4, speedMax:9, sizeMin:3, sizeMax:5, lifeMin:0.3, lifeMax:0.7, shape:'circle', glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(5*m), { colors:['#aa0000','#880000'], speedMin:0.5, speedMax:3, sizeMin:2, sizeMax:4, lifeMin:0.4, lifeMax:0.8, shape:'circle', gravity:1.5 });
    this.particles.addFlash(x, y, '#ff0000', 28, 0.1);
    this.particles.addShockwave(x, y, '#cc0000', 40, 0.2);
};
SkinFxSystem.prototype._skill_bloodmoon = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(38*m), { colors:['#ff0000','#cc0000','#ff4444','#ffffff'], speedMin:6, speedMax:13, sizeMin:3, sizeMax:6, lifeMin:0.5, lifeMax:1.0, shape:'circle', glow:true, glowSize:14 });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#880000','#aa0000'], speedMin:1, speedMax:4, sizeMin:2, sizeMax:4, lifeMin:0.7, lifeMax:1.2, shape:'circle', gravity:2 });
    this.particles.addShockwave(x, y, '#ff0000', 120, 0.5);
    this.particles.triggerScreenFlash('#ff0000', 0.2, 0.12);
    Utils.shake(6);
};
SkinFxSystem.prototype._trail_bloodmoon = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(2*this.quality.particleMult)), { colors:['#cc0000','#aa0000','#ff4444'], speedMin:0.3, speedMax:1.5, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.6, shape:'circle', gravity:1, offsetX:3, offsetY:2 });
};
SkinFxSystem.prototype._aura_bloodmoon = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time;
    ctx.save(); ctx.globalAlpha=0.12+Math.sin(t*2)*0.04; ctx.fillStyle='#aa0000';
    ctx.beginPath(); ctx.arc(x,y,r*2.2+Math.sin(t*1.5)*4,0,TWO_PI_FX); ctx.fill();
    ctx.globalAlpha=0.06; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(x,y,r*2.8,0,TWO_PI_FX); ctx.fill();
    ctx.restore();
};

// === 深渊: chaoseye (tier 5, 10000金) ===
SkinFxSystem.prototype._hit_chaoseye = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(16*m), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff','#ff4444'], speedMin:4, speedMax:9, sizeMin:2, sizeMax:5, lifeMin:0.3, lifeMax:0.6, shape:'circle', hueShift:true, glow:true, glowSize:10 });
    this.particles.emit(x, y, Math.floor(4*m), { colors:['#ffffff'], speedMin:0, speedMax:1, sizeMin:6, sizeMax:10, lifeMin:0.15, lifeMax:0.3, shape:'ring', hueShift:true });
    this.particles.addFlash(x, y, '#ffffff', 30, 0.08);
};
SkinFxSystem.prototype._skill_chaoseye = function(x, y) {
    const m = this.quality.particleMult;
    this.particles.emit(x, y, Math.floor(45*m), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff','#ff4444','#00ffcc'], speedMin:6, speedMax:14, sizeMin:3, sizeMax:6, lifeMin:0.5, lifeMax:1.1, shape:'circle', glow:true, glowSize:14, hueShift:true });
    this.particles.emit(x, y, Math.floor(12*m), { colors:['#ffffff','#ffee88','#ff88cc'], speedMin:0, speedMax:3, sizeMin:6, sizeMax:12, lifeMin:0.2, lifeMax:0.5, shape:'ring', offsetX:20, offsetY:20, hueShift:true });
    this.particles.addShockwave(x, y, '#ff44ff', 140, 0.5);
    this.particles.triggerScreenFlash('#ffffff', 0.25, 0.15);
    Utils.shake(7);
};
SkinFxSystem.prototype._trail_chaoseye = function(x, y) {
    this.particles.emit(x, y, Math.max(1, Math.floor(2*this.quality.particleMult)), { colors:['#ff4488','#44ff88','#4488ff','#ffaa00','#aa44ff'], speedMin:0.5, speedMax:2, sizeMin:2, sizeMax:4, lifeMin:0.3, lifeMax:0.5, shape:'circle', hueShift:true, offsetX:5, offsetY:5 });
};
SkinFxSystem.prototype._aura_chaoseye = function(ctx, x, y, r) {
    if(!this.quality.glowEnabled) return;
    const t = this._time; const hue=(t*40)%360;
    ctx.save(); ctx.globalAlpha=0.1; ctx.strokeStyle=`hsl(${hue},80%,50%)`; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(x,y,r*2+Math.sin(t*2)*4,0,TWO_PI_FX); ctx.stroke();
    ctx.strokeStyle=`hsl(${(hue+120)%360},80%,50%)`; ctx.beginPath(); ctx.arc(x,y,r*2.5+Math.cos(t*1.5)*5,0,TWO_PI_FX); ctx.stroke();
    ctx.strokeStyle=`hsl(${(hue+240)%360},80%,50%)`; ctx.beginPath(); ctx.arc(x,y,r*3+Math.sin(t*1.2)*4,0,TWO_PI_FX); ctx.stroke();
    ctx.restore();
};

