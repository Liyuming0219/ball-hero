// ============================================
// 鏂扮毊鑲ゆ墿灞曞寘 - 12娆惧叏鏂扮毊鑲ゆ覆鏌撳櫒涓庣壒鏁?// 閫氳繃鍘熷瀷鎵╁睍 SkinRenderer 鍜?SkinFxSystem
// ============================================

const TWO_PI_NEW = Math.PI * 2;

// ============================================
// 鏈烘绾厓绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_cyberpunk = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#00ffcc', 0.18);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t) * 0.02);
        ctx.fillStyle = '#1a1a2e'; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = (i/6)*TWO_PI_NEW - Math.PI/6; if(i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r); else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 2; ctx.stroke();
        const scanY = ((t*1.5)%2-1)*r; ctx.globalAlpha = 0.6; ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-r*0.8, scanY); ctx.lineTo(r*0.8, scanY); ctx.stroke();
    // 鐢佃矾绾硅矾
    ctx.globalAlpha = 0.4; ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) { const ly = -r*0.5+i*r*0.4; ctx.beginPath(); ctx.moveTo(-r*0.6,ly); ctx.lineTo(-r*0.2,ly); ctx.lineTo(-r*0.2,ly+r*0.2); ctx.lineTo(r*0.3,ly+r*0.2); ctx.stroke(); }
    // 鏍稿績
    ctx.globalAlpha = 0.8+Math.sin(t*4)*0.2; ctx.fillStyle = '#ff00ff'; ctx.beginPath(); ctx.arc(0,0,r*0.2,0,TWO_PI_NEW); ctx.fill();
    // 鐪肩潧
    ctx.globalAlpha = 1; ctx.fillStyle = '#ff00ff'; ctx.fillRect(-r*0.35,-r*0.25,r*0.2,r*0.08); ctx.fillRect(r*0.15,-r*0.25,r*0.2,r*0.08);
    ctx.restore();
};
SkinRenderer.prototype._proj_cyberpunk = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.fillStyle = '#00ffcc'; ctx.fillRect(-r*1.2,-r*0.15,r*2.4,r*0.3);
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#ff00ff'; ctx.fillRect(-r*0.8,-r*0.3,r*1.6,r*0.6);
    ctx.restore(); if (this.quality.glowEnabled) this._glow(ctx, x, y, r*0.4, '#00ffcc', 0.3);
};

SkinRenderer.prototype._body_steambot = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#cc8833', 0.12);
    ctx.save(); ctx.translate(x, y);
    // 榛勯摐韬綋
    const bodyG = ctx.createRadialGradient(-r*0.3,-r*0.3,0,0,0,r);
    bodyG.addColorStop(0,'#dda855'); bodyG.addColorStop(0.6,'#aa6622'); bodyG.addColorStop(1,'#664411');
    ctx.fillStyle = bodyG; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // 閾嗛拤
    ctx.fillStyle = '#887744'; for (let i=0;i<8;i++){const a=(i/8)*TWO_PI_NEW; ctx.beginPath(); ctx.arc(Math.cos(a)*r*0.78,Math.sin(a)*r*0.78,2,0,TWO_PI_NEW); ctx.fill();}
    // 榻胯疆
    ctx.save(); ctx.rotate(t*2); ctx.strokeStyle='#887744'; ctx.lineWidth=2.5; ctx.beginPath(); ctx.arc(0,0,r*0.45,0,TWO_PI_NEW); ctx.stroke();
    for(let i=0;i<8;i++){const a=(i/8)*TWO_PI_NEW; ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.35,Math.sin(a)*r*0.35); ctx.lineTo(Math.cos(a)*r*0.55,Math.sin(a)*r*0.55); ctx.stroke();}
    ctx.restore();
    // 鐑熷洷
    ctx.fillStyle='#555'; ctx.fillRect(-r*0.12,-r*1.1,r*0.24,r*0.3);
    // 钂告苯
    if(this.quality.detailLevel>=1){ctx.globalAlpha=0.3+Math.sin(t*3)*0.1; ctx.fillStyle='#ccc'; for(let i=0;i<3;i++){const sy=-r*1.1-i*r*0.25-(t%1)*r*0.3; ctx.beginPath(); ctx.arc(Math.sin(t*2+i)*r*0.1,sy,r*0.12+i*r*0.08,0,TWO_PI_NEW); ctx.fill();}}
    // 鐪肩潧
    ctx.globalAlpha=1; ctx.fillStyle='#ffcc44'; ctx.strokeStyle='#887744'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(-r*0.25,-r*0.1,r*0.18,0,TWO_PI_NEW); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(r*0.25,-r*0.1,r*0.18,0,TWO_PI_NEW); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(-r*0.25,-r*0.1,r*0.08,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.25,-r*0.1,r*0.08,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
};
SkinRenderer.prototype._proj_steambot = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*8);
    ctx.fillStyle='#887744'; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; const or=i%2===0?r*0.8:r*0.5; ctx.lineTo(Math.cos(a)*or,Math.sin(a)*or);}
    ctx.closePath(); ctx.fill(); ctx.restore();
    if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#ffaa33',0.2);
};

SkinRenderer.prototype._body_nanocore = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#44ffaa', 0.15);
    ctx.save(); ctx.translate(x, y);
        ctx.globalAlpha = 0.3; ctx.fillStyle = '#22ddaa';
    for (let i=0;i<12;i++){const a=(i/12)*TWO_PI_NEW+Math.sin(t*2+i*0.8)*0.3; const d=r*(0.7+Math.sin(t*3+i*1.5)*0.25); ctx.beginPath(); ctx.arc(Math.cos(a)*d,Math.sin(a)*d,r*0.12+Math.sin(t*4+i)*r*0.04,0,TWO_PI_NEW); ctx.fill();}
        if(this.quality.detailLevel>=1){ctx.globalAlpha=0.15; ctx.strokeStyle='#44ffaa'; ctx.lineWidth=0.5; for(let i=0;i<6;i++){const a1=(i/6)*TWO_PI_NEW+t*0.5; const a2=((i+2)/6)*TWO_PI_NEW+t*0.5; ctx.beginPath(); ctx.moveTo(Math.cos(a1)*r*0.6,Math.sin(a1)*r*0.6); ctx.lineTo(Math.cos(a2)*r*0.6,Math.sin(a2)*r*0.6); ctx.stroke();}}
        ctx.globalAlpha=0.9; const coreG=ctx.createRadialGradient(0,0,0,0,0,r*0.45); coreG.addColorStop(0,'#ffffff'); coreG.addColorStop(0.4,'#88ffdd'); coreG.addColorStop(1,'#22aa88');
    ctx.fillStyle=coreG; ctx.beginPath(); ctx.arc(0,0,r*0.45,0,TWO_PI_NEW); ctx.fill();
    // 澶栫幆
    ctx.globalAlpha=0.5; ctx.strokeStyle='#44ffaa'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(0,0,r*0.65+Math.sin(t*3)*r*0.05,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
};
SkinRenderer.prototype._proj_nanocore = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.fillStyle='#44ffaa'; ctx.globalAlpha=0.7;
    for(let i=0;i<5;i++){const a=angle+(i-2)*0.3+Math.sin(this._time*5+i)*0.2; const d=r*0.3*i; ctx.beginPath(); ctx.arc(Math.cos(a)*d,Math.sin(a)*d,r*0.3,0,TWO_PI_NEW); ctx.fill();}
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#44ffaa',0.25);
};

// ============================================
// 鍏冪礌棰嗕富绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_thunder = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffee00', 0.2);
    ctx.save(); ctx.translate(x, y);
    // 闆风悆
    const cg = ctx.createRadialGradient(0,0,0,0,0,r); cg.addColorStop(0,'#ffffff'); cg.addColorStop(0.3,'#ffff88'); cg.addColorStop(0.7,'#ffcc00'); cg.addColorStop(1,'#886600');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // 闂數
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2; ctx.globalAlpha=0.7+Math.random()*0.3;
    for(let b=0;b<4;b++){const ba=(b/4)*TWO_PI_NEW+t*1.5; ctx.beginPath(); ctx.moveTo(0,0); let bx=0,by=0; for(let s=0;s<4;s++){bx+=Math.cos(ba+(Math.random()-0.5)*1.5)*r*0.35; by+=Math.sin(ba+(Math.random()-0.5)*1.5)*r*0.35; ctx.lineTo(bx,by);} ctx.stroke();}
    // 鐢靛姬澶栫幆
    ctx.globalAlpha=0.4; ctx.strokeStyle='#ffee88'; ctx.lineWidth=1; ctx.beginPath();
    for(let i=0;i<20;i++){const a=(i/20)*TWO_PI_NEW; const rr=r*1.2+(Math.random()-0.5)*r*0.3; if(i===0) ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr); else ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);} ctx.closePath(); ctx.stroke();
        ctx.globalAlpha=1; ctx.fillStyle='#ffee00'; ctx.beginPath(); ctx.arc(-r*0.25,-r*0.1,3,0,TWO_PI_NEW); ctx.fill(); ctx.beginPath(); ctx.arc(r*0.25,-r*0.1,3,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
};
SkinRenderer.prototype._proj_thunder = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.strokeStyle='#ffff88'; ctx.lineWidth=3; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(-r*0.3,-r*0.3); ctx.lineTo(0,0); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(r,0); ctx.stroke();
    ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(-r*0.3,-r*0.3); ctx.lineTo(0,0); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(r,0); ctx.stroke();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#ffee00',0.3);
};

SkinRenderer.prototype._body_glacier = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#88ddff', 0.18);
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.3);
        const cg = ctx.createRadialGradient(0,0,0,0,0,r); cg.addColorStop(0,'#ffffff'); cg.addColorStop(0.3,'#ccf0ff'); cg.addColorStop(0.7,'#66bbdd'); cg.addColorStop(1,'#2266aa');
    ctx.fillStyle = cg; ctx.beginPath();
    for(let i=0;i<8;i++){const a=(i/8)*TWO_PI_NEW; const cr=i%2===0?r:r*0.75; ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);} ctx.closePath(); ctx.fill();
        ctx.globalAlpha=0.3; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.moveTo(0,-r*0.8); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(0,0); ctx.lineTo(-r*0.2,-r*0.4); ctx.closePath(); ctx.fill();
        if(this.quality.detailLevel>=1){ctx.globalAlpha=0.3; ctx.strokeStyle='#ffffff'; ctx.lineWidth=1; for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6); ctx.stroke();}}
    ctx.restore();
    // 椋樻暎鍐版櫠
    ctx.save(); ctx.globalAlpha=0.4; ctx.fillStyle='#aaeeff';
    for(let i=0;i<5;i++){const a=t*0.8+(i/5)*TWO_PI_NEW; const d=r*1.3+Math.sin(t*2+i)*r*0.15; ctx.beginPath(); ctx.arc(x+Math.cos(a)*d,y+Math.sin(a)*d,2,0,TWO_PI_NEW); ctx.fill();} ctx.restore();
};
SkinRenderer.prototype._proj_glacier = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*3);
    ctx.fillStyle='#aaeeff'; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; const cr=i%2===0?r*0.9:r*0.4; ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);} ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#88ddff',0.25);
};

SkinRenderer.prototype._body_shadow = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#6600aa', 0.2);
    ctx.save(); ctx.translate(x, y);
    // 鏆楀奖瑙︽墜
    ctx.globalAlpha=0.4; ctx.strokeStyle='#4400aa'; ctx.lineWidth=2.5; ctx.lineCap='round';
    for(let i=0;i<5;i++){const a=(i/5)*TWO_PI_NEW+t*0.5; ctx.beginPath(); ctx.moveTo(0,0); const ex=Math.cos(a)*r*1.4+Math.sin(t*2+i)*r*0.2; const ey=Math.sin(a)*r*1.4+Math.cos(t*2+i)*r*0.2; ctx.quadraticCurveTo(Math.cos(a+Math.sin(t+i)*0.5)*r*0.8,Math.sin(a+Math.sin(t+i)*0.5)*r*0.8,ex,ey); ctx.stroke();}
    // 鏆楀奖鏍稿績
    ctx.globalAlpha=0.9; const sg=ctx.createRadialGradient(0,0,0,0,0,r); sg.addColorStop(0,'#2a0044'); sg.addColorStop(0.5,'#110022'); sg.addColorStop(1,'#000000');
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha=0.5; ctx.strokeStyle='#aa44ff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    // 鐙溂
    ctx.globalAlpha=1; ctx.fillStyle='#ff00ff'; ctx.beginPath(); ctx.arc(0,-r*0.05,r*0.35,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(0,-r*0.05,r*0.18,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#ff44ff'; ctx.globalAlpha=0.6+Math.sin(t*3)*0.2; ctx.beginPath(); ctx.arc(r*0.05,-r*0.1,r*0.06,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
};
SkinRenderer.prototype._proj_shadow = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.fillStyle='#6600aa'; ctx.globalAlpha=0.8; ctx.beginPath(); ctx.moveTo(r,0); ctx.lineTo(-r*0.5,-r*0.6); ctx.lineTo(-r*0.2,0); ctx.lineTo(-r*0.5,r*0.6); ctx.closePath(); ctx.fill();
    ctx.fillStyle='#ff00ff'; ctx.globalAlpha=0.4; ctx.beginPath(); ctx.arc(0,0,r*0.2,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#aa00ff',0.3);
};

// ============================================
// 涓滄柟绁炶瘽绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_kitsune = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ff8844', 0.15);
    ctx.save(); ctx.translate(x, y);
    // 涔濇潯灏惧反
    ctx.globalAlpha=0.5;
    for(let i=0;i<9;i++){
        const baseA=Math.PI*0.5+(i-4)*0.22; const wa=baseA+Math.sin(t*2+i*0.7)*0.15;
        const tailLen=r*(1.6+Math.sin(t+i*0.5)*0.25);
        const grad=ctx.createLinearGradient(0,0,Math.cos(wa)*tailLen,Math.sin(wa)*tailLen);
        grad.addColorStop(0,'#ff8844'); grad.addColorStop(1,i%2===0?'#ffcc44':'#ffaa22');
        ctx.strokeStyle=grad; ctx.lineWidth=3-i*0.15; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,r*0.3);
        ctx.quadraticCurveTo(Math.cos(wa)*tailLen*0.5,Math.sin(wa)*tailLen*0.5+r*0.3,Math.cos(wa)*tailLen,Math.sin(wa)*tailLen);
        ctx.stroke();
    }
    // 韬綋
    ctx.globalAlpha=1; const bg=ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r);
    bg.addColorStop(0,'#ffcc88'); bg.addColorStop(0.5,'#ff8844'); bg.addColorStop(1,'#cc5522');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
        ctx.fillStyle='#ff8844';
    ctx.beginPath(); ctx.moveTo(-r*0.5,-r*0.7); ctx.lineTo(-r*0.2,-r*1.3); ctx.lineTo(r*0.05,-r*0.7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(r*0.5,-r*0.7); ctx.lineTo(r*0.2,-r*1.3); ctx.lineTo(-r*0.05,-r*0.7); ctx.fill();
    // 鐙愮溂
    ctx.fillStyle='#ffee44'; ctx.beginPath(); ctx.arc(-r*0.22,-r*0.1,r*0.16,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.22,-r*0.1,r*0.16,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.ellipse(-r*0.22,-r*0.1,r*0.05,r*0.12,0,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r*0.22,-r*0.1,r*0.05,r*0.12,0,0,TWO_PI_NEW); ctx.fill();
    // 鐙愮伀
    ctx.globalAlpha=0.5;
    for(let i=0;i<3;i++){const a=t*1.2+(i/3)*TWO_PI_NEW; const fd=r*1.5+Math.sin(t*2+i)*r*0.2;
        ctx.fillStyle=i===0?'#44aaff':'#88ccff'; ctx.beginPath(); ctx.arc(Math.cos(a)*fd,Math.sin(a)*fd-r*0.3,r*0.15,0,TWO_PI_NEW); ctx.fill();}
    ctx.restore();
};
SkinRenderer.prototype._proj_kitsune = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.fillStyle='#44aaff'; ctx.globalAlpha=0.8; ctx.beginPath(); ctx.arc(0,0,r*0.7,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#ffffff'; ctx.globalAlpha=0.4; ctx.beginPath(); ctx.arc(-r*0.15,-r*0.15,r*0.3,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#44aaff',0.3);
};

SkinRenderer.prototype._body_dragonking = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#4488ff', 0.2);
    ctx.save(); ctx.translate(x, y);
    // 姘存氮鍏夌幆
    ctx.globalAlpha=0.2; ctx.strokeStyle='#66bbff'; ctx.lineWidth=2;
    for(let i=0;i<2;i++){ctx.beginPath(); for(let j=0;j<20;j++){const a=(j/20)*TWO_PI_NEW; const wr=r*1.5+i*r*0.3+Math.sin(a*3+t*2+i)*r*0.15; if(j===0) ctx.moveTo(Math.cos(a)*wr,Math.sin(a)*wr); else ctx.lineTo(Math.cos(a)*wr,Math.sin(a)*wr);} ctx.closePath(); ctx.stroke();}
    // 榫欎綋
    ctx.globalAlpha=1; const dg=ctx.createRadialGradient(-r*0.2,-r*0.3,0,0,0,r);
    dg.addColorStop(0,'#88ddff'); dg.addColorStop(0.4,'#2266cc'); dg.addColorStop(1,'#112266');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha=0.2; ctx.strokeStyle='#aaddff'; ctx.lineWidth=0.8;
    for(let row=-2;row<=2;row++){for(let col=-2;col<=2;col++){const sx=col*r*0.3+row*r*0.15; const sy=row*r*0.3; if(sx*sx+sy*sy<r*r*0.7){ctx.beginPath(); ctx.arc(sx,sy,r*0.13,0,Math.PI); ctx.stroke();}}}
    // 榫欒
    ctx.globalAlpha=1; ctx.fillStyle='#ffcc44';
    ctx.beginPath(); ctx.moveTo(-r*0.4,-r*0.6); ctx.lineTo(-r*0.55,-r*1.4); ctx.lineTo(-r*0.2,-r*0.7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(r*0.4,-r*0.6); ctx.lineTo(r*0.55,-r*1.4); ctx.lineTo(r*0.2,-r*0.7); ctx.fill();
    // 榫欑溂
    ctx.fillStyle='#ffee00'; ctx.beginPath(); ctx.arc(-r*0.25,-r*0.1,r*0.15,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.25,-r*0.1,r*0.15,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(-r*0.25,-r*0.1,r*0.04,r*0.12,0,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r*0.25,-r*0.1,r*0.04,r*0.12,0,0,TWO_PI_NEW); ctx.fill();
    // 榫欓』
    ctx.strokeStyle='#aaddff'; ctx.lineWidth=1.5; ctx.globalAlpha=0.5;
    ctx.beginPath(); ctx.moveTo(-r*0.3,r*0.2); ctx.quadraticCurveTo(-r*0.8,r*0.5+Math.sin(t*2)*r*0.1,-r*1.2,r*0.3+Math.sin(t*3)*r*0.15); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r*0.3,r*0.2); ctx.quadraticCurveTo(r*0.8,r*0.5+Math.sin(t*2+1)*r*0.1,r*1.2,r*0.3+Math.sin(t*3+1)*r*0.15); ctx.stroke();
    ctx.restore();
};
SkinRenderer.prototype._proj_dragonking = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
        const g=ctx.createLinearGradient(-r,0,r*1.5,0); g.addColorStop(0,'#88ddff'); g.addColorStop(0.5,'#4488ff'); g.addColorStop(1,'#2244aa');
    ctx.fillStyle=g; ctx.beginPath(); ctx.moveTo(r*1.2,0); ctx.quadraticCurveTo(r*0.5,-r*0.5,0,-r*0.3); ctx.quadraticCurveTo(-r*0.5,-r*0.2,-r,0); ctx.quadraticCurveTo(-r*0.5,r*0.2,0,r*0.3); ctx.quadraticCurveTo(r*0.5,r*0.5,r*1.2,0); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#4488ff',0.3);
};

SkinRenderer.prototype._body_wukong = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffaa00', 0.18);
    ctx.save(); ctx.translate(x, y);
        ctx.save(); ctx.rotate(t*3);
    ctx.strokeStyle='#ffcc00'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-r*1.8,0); ctx.lineTo(r*1.8,0); ctx.stroke();
    ctx.fillStyle='#ffaa00'; ctx.beginPath(); ctx.arc(-r*1.8,0,3,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*1.8,0,3,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
    // 韬綋
    const bg=ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r);
    bg.addColorStop(0,'#ffdd88'); bg.addColorStop(0.5,'#cc8833'); bg.addColorStop(1,'#884411');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // 閲戠畭
    ctx.strokeStyle='#ffcc00'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,-r*0.3,r*0.55,Math.PI*1.2,Math.PI*1.8); ctx.stroke();
    ctx.fillStyle='#ff4400'; ctx.beginPath(); ctx.arc(0,-r*0.45,r*0.08,0,TWO_PI_NEW); ctx.fill();
    // 鐚磋劯
    ctx.fillStyle='#ffcc88'; ctx.beginPath(); ctx.ellipse(0,r*0.1,r*0.5,r*0.4,0,0,TWO_PI_NEW); ctx.fill();
    // 鐏溂閲戠潧
    ctx.fillStyle='#ff4400'; ctx.globalAlpha=0.8+Math.sin(t*5)*0.2;
    ctx.beginPath(); ctx.arc(-r*0.2,0,r*0.12,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.2,0,r*0.12,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#ffee00'; ctx.globalAlpha=1;
    ctx.beginPath(); ctx.arc(-r*0.2,0,r*0.06,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(r*0.2,0,r*0.06,0,TWO_PI_NEW); ctx.fill();
    // 浜戞湹搴曞骇
    ctx.globalAlpha=0.3; ctx.fillStyle='#ffffff';
    for(let i=0;i<4;i++){const cx=Math.cos(t*1.5+i*1.5)*r*0.3; const cy=r*0.8+Math.sin(t*2+i)*r*0.1; ctx.beginPath(); ctx.arc(cx,cy,r*0.25,0,TWO_PI_NEW); ctx.fill();}
    ctx.restore();
};
SkinRenderer.prototype._proj_wukong = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*10);
        ctx.strokeStyle='#ffcc00'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-r*1.2,0); ctx.lineTo(r*1.2,0); ctx.stroke();
    ctx.fillStyle='#ff6600'; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.3,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#ffaa00',0.3);
};

// ============================================
// 娣辨笂绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_voidwalker = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#220066', 0.25);
    ctx.save(); ctx.translate(x, y);
    // 铏氱┖瑁傜紳
    ctx.globalAlpha=0.3; ctx.strokeStyle='#8844ff'; ctx.lineWidth=1.5;
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW+t*0.3; const len=r*1.5+Math.sin(t*2+i*1.2)*r*0.3;
        ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6);
        ctx.lineTo(Math.cos(a)*len,Math.sin(a)*len); ctx.stroke();}
    // 韬綋 - 铏氱┖榛戞礊
    ctx.globalAlpha=1; const vg=ctx.createRadialGradient(0,0,0,0,0,r);
    vg.addColorStop(0,'#000000'); vg.addColorStop(0.4,'#110033'); vg.addColorStop(0.7,'#220066'); vg.addColorStop(1,'#4400aa');
    ctx.fillStyle=vg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
        ctx.save(); ctx.rotate(t*1.5); ctx.globalAlpha=0.4; ctx.strokeStyle='#aa66ff'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.ellipse(0,0,r*0.9,r*0.35,0,0,TWO_PI_NEW); ctx.stroke();
    ctx.strokeStyle='#cc88ff'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(0,0,r*0.7,r*0.25,0.5,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
        ctx.fillStyle='#aa44ff'; ctx.globalAlpha=0.7+Math.sin(t*3)*0.3;
    ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.1,0,TWO_PI_NEW); ctx.fill();
    // 婕傛诞纰庣墖
    ctx.globalAlpha=0.5; ctx.fillStyle='#6633aa';
    for(let i=0;i<8;i++){const a=t*0.8+(i/8)*TWO_PI_NEW; const d=r*1.2+Math.sin(t*1.5+i)*r*0.2;
        ctx.save(); ctx.translate(Math.cos(a)*d,Math.sin(a)*d); ctx.rotate(t*2+i);
        ctx.fillRect(-2,-2,4,4); ctx.restore();}
    ctx.restore();
};
SkinRenderer.prototype._proj_voidwalker = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y);
        const vg=ctx.createRadialGradient(0,0,0,0,0,r); vg.addColorStop(0,'#000'); vg.addColorStop(0.5,'#220044'); vg.addColorStop(1,'#8844ff');
    ctx.fillStyle=vg; ctx.beginPath(); ctx.arc(0,0,r*0.8,0,TWO_PI_NEW); ctx.fill();
    ctx.strokeStyle='#aa66ff'; ctx.lineWidth=1; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#8844ff',0.3);
};

SkinRenderer.prototype._body_bloodmoon = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#aa0000', 0.22);
    ctx.save(); ctx.translate(x, y);
        ctx.globalAlpha=0.2; ctx.fillStyle='#aa0000';
    for(let i=0;i<6;i++){const a=t*0.5+(i/6)*TWO_PI_NEW; const d=r*1.2+Math.sin(t*2+i*1.1)*r*0.2;
        ctx.beginPath(); ctx.arc(Math.cos(a)*d,Math.sin(a)*d,r*0.2+Math.sin(t*3+i)*r*0.05,0,TWO_PI_NEW); ctx.fill();}
        ctx.globalAlpha=1; const mg=ctx.createRadialGradient(r*0.1,-r*0.1,0,0,0,r);
    mg.addColorStop(0,'#ff2200'); mg.addColorStop(0.4,'#cc0000'); mg.addColorStop(0.7,'#880000'); mg.addColorStop(1,'#330000');
    ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // 鏈堥潰闃村奖
    ctx.globalAlpha=0.3; ctx.fillStyle='#000';
    ctx.beginPath(); ctx.arc(r*0.2,-r*0.1,r*0.5,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.arc(-r*0.3,r*0.3,r*0.25,0,TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha=0.5; ctx.strokeStyle='#ff4444'; ctx.lineWidth=1.5;
    for(let i=0;i<5;i++){const a=(i/5)*TWO_PI_NEW+Math.sin(t+i)*0.2; ctx.beginPath(); ctx.moveTo(0,0);
        const mx=Math.cos(a+0.3)*r*0.4; const my=Math.sin(a+0.3)*r*0.4;
        ctx.quadraticCurveTo(mx,my,Math.cos(a)*r*0.85,Math.sin(a)*r*0.85); ctx.stroke();}
        ctx.globalAlpha=1; ctx.fillStyle='#ff0000'; ctx.beginPath(); ctx.arc(0,0,r*0.2,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(0,0,r*0.05,r*0.15,0,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
};
SkinRenderer.prototype._proj_bloodmoon = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
        ctx.fillStyle='#cc0000'; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(r*1.2,0); ctx.quadraticCurveTo(r*0.5,-r*0.4,0,-r*0.1); ctx.lineTo(-r*0.5,0); ctx.lineTo(0,r*0.1); ctx.quadraticCurveTo(r*0.5,r*0.4,r*1.2,0); ctx.fill();
    ctx.fillStyle='#ff4444'; ctx.globalAlpha=0.4; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#ff0000',0.3);
};

SkinRenderer.prototype._body_chaoseye = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ff4488', 0.2);
    ctx.save(); ctx.translate(x, y);
    // 娣锋矊瑙﹂』
    ctx.globalAlpha=0.35; ctx.lineCap='round';
    for(let i=0;i<8;i++){
        const a=(i/8)*TWO_PI_NEW+t*0.4; const len=r*1.4+Math.sin(t*1.5+i*0.8)*r*0.3;
        const hue=(i/8)*360; ctx.strokeStyle=`hsl(${hue},80%,60%)`; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.6,Math.sin(a)*r*0.6);
        ctx.quadraticCurveTo(Math.cos(a+Math.sin(t+i)*.4)*r,Math.sin(a+Math.sin(t+i)*.4)*r,Math.cos(a)*len,Math.sin(a)*len); ctx.stroke();
    }
    // 鍙樿壊涓讳綋
    ctx.globalAlpha=1; const hMain=(t*30)%360;
    const cg=ctx.createRadialGradient(0,0,0,0,0,r);
    cg.addColorStop(0,`hsl(${hMain},60%,70%)`); cg.addColorStop(0.5,`hsl(${(hMain+60)%360},70%,40%)`); cg.addColorStop(1,`hsl(${(hMain+120)%360},80%,20%)`);
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha=0.3; ctx.strokeStyle=`hsl(${(hMain+180)%360},90%,60%)`; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r*0.7,0,TWO_PI_NEW); ctx.stroke();
    // 娣锋矊涔嬬溂锛堝法澶э級
    ctx.globalAlpha=1; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.ellipse(0,0,r*0.45,r*0.3,0,0,TWO_PI_NEW); ctx.fill();
    // 铏硅啘
    const irisG=ctx.createRadialGradient(0,0,0,0,0,r*0.25);
    irisG.addColorStop(0,`hsl(${(hMain+90)%360},100%,50%)`); irisG.addColorStop(1,`hsl(${(hMain+180)%360},100%,30%)`);
    ctx.fillStyle=irisG; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    // 鐬冲瓟
    ctx.fillStyle='#000'; ctx.beginPath(); ctx.ellipse(0,0,r*0.08,r*0.15+Math.sin(t*2)*r*0.03,0,0,TWO_PI_NEW); ctx.fill();
    // 楂樺厜
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.6; ctx.beginPath(); ctx.arc(-r*0.1,-r*0.08,r*0.06,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
};
SkinRenderer.prototype._proj_chaoseye = function(ctx, x, y, r, angle) {
    const t = this._time; const hue=(t*50)%360;
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+t*5);
    ctx.fillStyle=`hsl(${hue},80%,50%)`; ctx.globalAlpha=0.8;
        ctx.beginPath(); for(let i=0;i<5;i++){const a=(i/5)*TWO_PI_NEW-Math.PI/2; const ir=(i*2%5)/5*TWO_PI_NEW-Math.PI/2; ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r); ctx.lineTo(Math.cos((a+ir)/2)*r*0.4,Math.sin((a+ir)/2)*r*0.4);} ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.3; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,`hsl(${hue},80%,50%)`,0.3);
};

// ============================================
// 新增皮肤武器外观 — 12个新皮肤独特武器造型
// ============================================

// 赛博朋克 — 激光光刃
SkinRenderer.prototype._weapon_cyberpunk = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.7 : 0.3;
        ctx.globalAlpha = glow; ctx.fillStyle = '#00ffff';
        ctx.fillRect(-2, -3, 28, 6); ctx.globalAlpha = 1;
        // 电路纹光刃
        ctx.fillStyle = '#005566'; ctx.fillRect(0, -2.5, 24, 5);
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(2, -1); ctx.lineTo(8, -1); ctx.lineTo(10, -2); ctx.lineTo(16, -2); ctx.lineTo(18, 0); ctx.lineTo(22, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(2, 1); ctx.lineTo(6, 1); ctx.lineTo(8, 2); ctx.lineTo(14, 2); ctx.lineTo(16, 1); ctx.lineTo(22, 1); ctx.stroke();
        // 尖端
        ctx.fillStyle = '#00ffff';
        ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(28, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#333'; ctx.fillRect(-6, -2, 6, 4);
    } else {
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#00ffff'; ctx.globalAlpha = 0.3 + Math.sin(t * 6) * 0.2;
        ctx.fillRect(14, -4, 8, 8); ctx.globalAlpha = 1;
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1;
        ctx.strokeRect(14, -4, 8, 8);
        ctx.fillStyle = '#00ffff'; ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 蒸汽机器人 — 齿轮锤
SkinRenderer.prototype._weapon_steambot = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        ctx.fillStyle = '#664422'; ctx.fillRect(-4, -2, 18, 4);
        // 齿轮锤头
        ctx.fillStyle = '#aa8844';
        ctx.beginPath(); ctx.arc(18, 0, 8, 0, TWO_PI_NEW); ctx.fill();
        // 齿轮齿
        ctx.fillStyle = '#886633';
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * TWO_PI_NEW + t * 3;
            ctx.fillRect(18 + Math.cos(a) * 7 - 2, Math.sin(a) * 7 - 2, 4, 4);
        }
        ctx.fillStyle = '#553311'; ctx.beginPath(); ctx.arc(18, 0, 4, 0, TWO_PI_NEW); ctx.fill();
        // 蒸汽
        if (attacking) {
            ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(18, -10 - Math.random() * 3, 3, 0, TWO_PI_NEW); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else {
        ctx.fillStyle = '#664422'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#aa8844';
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#886633';
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_NEW + t * 2;
            ctx.fillRect(18 + Math.cos(a) * 5 - 1.5, Math.sin(a) * 5 - 1.5, 3, 3);
        }
    }
};

// 纳米核心 — 能量棒
SkinRenderer.prototype._weapon_nanocore = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.25;
        ctx.globalAlpha = glow; ctx.fillStyle = '#44ffaa';
        ctx.fillRect(-2, -3, 26, 6); ctx.globalAlpha = 1;
        ctx.fillStyle = '#225544';
        ctx.beginPath(); ctx.moveTo(24, 0); ctx.lineTo(6, -2.5); ctx.lineTo(0, 0); ctx.lineTo(6, 2.5); ctx.closePath(); ctx.fill();
        // 纳米线
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const px = 4 + i * 3.5;
            ctx.beginPath(); ctx.moveTo(px, -2); ctx.lineTo(px, 2); ctx.stroke();
        }
        ctx.fillStyle = '#112222'; ctx.fillRect(-5, -2, 5, 4);
    } else {
        ctx.fillStyle = '#112222'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#44ffaa'; ctx.globalAlpha = 0.5 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#aaffdd';
        ctx.beginPath(); ctx.arc(18, 0, 2.5, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 雷霆 — 闪电锤
SkinRenderer.prototype._weapon_thunder = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.7 : 0.3;
        ctx.globalAlpha = glow; ctx.fillStyle = '#ffee44';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        // 闪电形刃
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath(); ctx.moveTo(4, -3); ctx.lineTo(12, -3); ctx.lineTo(10, -1); ctx.lineTo(18, -1);
        ctx.lineTo(16, 1); ctx.lineTo(26, 0); ctx.lineTo(16, 1); ctx.lineTo(18, 3);
        ctx.lineTo(10, 1); ctx.lineTo(12, 3); ctx.lineTo(4, 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4 + Math.sin(t * 10) * 0.3;
        ctx.beginPath(); ctx.moveTo(14, -1); ctx.lineTo(20, 0); ctx.lineTo(14, 1); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#554400'; ctx.fillRect(-6, -2, 6, 4);
    } else {
        ctx.fillStyle = '#554400'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#ffee44'; ctx.globalAlpha = attacking ? 0.8 : 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 闪电符号
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.moveTo(16, -4); ctx.lineTo(14, 0); ctx.lineTo(17, 0); ctx.lineTo(15, 4); ctx.lineTo(20, -1); ctx.lineTo(17, -1); ctx.closePath(); ctx.fill();
    }
};

// 冰川 — 冰晶戟
SkinRenderer.prototype._weapon_glacier = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.5 : 0.2;
        ctx.globalAlpha = glow; ctx.fillStyle = '#88ddff';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        // 冰晶刃
        ctx.fillStyle = '#aaeeff';
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(20, -4); ctx.lineTo(12, -2); ctx.lineTo(4, -3);
        ctx.lineTo(4, 3); ctx.lineTo(12, 2); ctx.lineTo(20, 4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(18, -2); ctx.lineTo(18, 0); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#446688'; ctx.fillRect(-6, -2, 6, 4);
        // 冰霜粒子
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(10 + Math.sin(t * 3) * 2, -4, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(16 + Math.cos(t * 4) * 2, 4, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else {
        ctx.fillStyle = '#446688'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#88ddff'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
        // 雪花
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_NEW;
            ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(18 + Math.cos(a) * 5, Math.sin(a) * 5); ctx.stroke();
        }
    }
};

// 暗影 — 虚空匕首
SkinRenderer.prototype._weapon_shadow = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.5 : 0.15;
        ctx.globalAlpha = glow; ctx.fillStyle = '#6622aa';
        ctx.fillRect(-2, -3, 22, 6); ctx.globalAlpha = 1;
        // 暗影刃 — 半透明
        ctx.fillStyle = '#331166'; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(6, -2.5); ctx.lineTo(0, 0); ctx.lineTo(6, 2.5); ctx.closePath(); ctx.fill();
        // 暗影波动
        ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.moveTo(4, 0);
        for (let i = 1; i <= 8; i++) { ctx.lineTo(4 + i * 2.2, Math.sin(t * 6 + i) * 2); }
        ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = '#220044'; ctx.fillRect(-5, -2, 5, 4);
    } else {
        ctx.fillStyle = '#220044'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#6622aa'; ctx.globalAlpha = 0.4 + Math.sin(t * 4) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#aa66ff';
        ctx.beginPath(); ctx.arc(18, 0, 2.5, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 九尾 — 妖狐火扇
SkinRenderer.prototype._weapon_kitsune = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        // 扇形武器
        const glow = attacking ? 0.5 : 0.2;
        ctx.globalAlpha = glow; ctx.fillStyle = '#ff8844';
        ctx.beginPath(); ctx.arc(10, 0, 18, -0.5, 0.5); ctx.lineTo(10, 0); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#cc4422';
        ctx.beginPath(); ctx.arc(10, 0, 15, -0.4, 0.4); ctx.lineTo(10, 0); ctx.fill();
        // 扇骨
        ctx.strokeStyle = '#ffcc88'; ctx.lineWidth = 1;
        for (let i = -2; i <= 2; i++) {
            const a = i * 0.15;
            ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10 + Math.cos(a) * 14, Math.sin(a) * 14); ctx.stroke();
        }
        ctx.fillStyle = '#553322'; ctx.fillRect(-4, -2, 6, 4);
    } else {
        ctx.fillStyle = '#553322'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#ff8844'; ctx.globalAlpha = 0.5 + Math.sin(t * 4) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#ffddaa';
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 龙王 — 金龙鳞剑
SkinRenderer.prototype._weapon_dragonking = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.25;
        ctx.globalAlpha = glow; ctx.fillStyle = '#ffcc44';
        ctx.fillRect(-2, -4, 30, 8); ctx.globalAlpha = 1;
        // 金色龙鳞刃
        ctx.fillStyle = '#ddaa22';
        ctx.beginPath(); ctx.moveTo(28, 0); ctx.lineTo(22, -4); ctx.lineTo(4, -2.5); ctx.lineTo(4, 2.5); ctx.lineTo(22, 4); ctx.closePath(); ctx.fill();
        // 鳞片纹理
        ctx.fillStyle = '#ffee88'; ctx.globalAlpha = 0.6;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath(); ctx.arc(8 + i * 4, (i % 2 === 0 ? -1 : 1), 2.5, 0, Math.PI); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.fillStyle = '#886600'; ctx.fillRect(-6, -2.5, 7, 5);
        ctx.fillStyle = '#ffee44'; ctx.fillRect(-1, -5, 3, 10);
    } else {
        ctx.fillStyle = '#886600'; ctx.fillRect(-6, -2, 22, 4);
        ctx.fillStyle = '#ffcc44'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 悟空 — 如意金箍棒
SkinRenderer.prototype._weapon_wukong = function(ctx, weaponType, attacking) {
    const t = this._time;
    const len = attacking ? 30 : 24;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        // 金箍棒
        const g = ctx.createLinearGradient(-6, 0, len, 0);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ffee88'); g.addColorStop(1, '#ffcc44');
        ctx.fillStyle = g; ctx.fillRect(-6, -2.5, len + 6, 5);
        // 金箍
        ctx.fillStyle = '#cc8800';
        ctx.fillRect(-6, -3, 4, 6); ctx.fillRect(len - 4, -3, 4, 6);
        // 红缨
        ctx.fillStyle = '#ff3333'; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.arc(-4, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else {
        const g = ctx.createLinearGradient(-6, 0, 22, 0);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ffee88'); g.addColorStop(1, '#ffcc44');
        ctx.fillStyle = g; ctx.fillRect(-6, -2, 28, 4);
        ctx.fillStyle = '#cc8800'; ctx.fillRect(-6, -2.5, 3, 5); ctx.fillRect(19, -2.5, 3, 5);
        ctx.fillStyle = '#ff3333'; ctx.beginPath(); ctx.arc(22, 0, 4, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 虚空行者 — 空间裂隙刃
SkinRenderer.prototype._weapon_voidwalker = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.2;
        ctx.globalAlpha = glow; ctx.fillStyle = '#8800ff';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        // 裂隙刃 — 深紫+闪烁
        ctx.fillStyle = '#440088';
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(18, -4); ctx.lineTo(4, -1.5); ctx.lineTo(4, 1.5); ctx.lineTo(18, 4); ctx.closePath(); ctx.fill();
        // 虚空裂纹
        ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6 + Math.sin(t * 7) * 0.3;
        ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(10, -2); ctx.lineTo(14, 1); ctx.lineTo(18, -1); ctx.lineTo(24, 0); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = '#220044'; ctx.fillRect(-5, -2, 5, 4);
    } else {
        ctx.fillStyle = '#220044'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#8800ff'; ctx.globalAlpha = 0.4 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#cc88ff';
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
    }
};

// 血月 — 血红弯刀
SkinRenderer.prototype._weapon_bloodmoon = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.25;
        ctx.globalAlpha = glow; ctx.fillStyle = '#cc0000';
        ctx.fillRect(-2, -4, 26, 8); ctx.globalAlpha = 1;
        // 弯刀刃
        ctx.fillStyle = '#880000';
        ctx.beginPath(); ctx.moveTo(24, -1); ctx.quadraticCurveTo(14, -5, 4, -2); ctx.lineTo(4, 1);
        ctx.quadraticCurveTo(14, 3, 24, 1); ctx.closePath(); ctx.fill();
        // 血滴
        ctx.fillStyle = '#ff2222'; ctx.globalAlpha = 0.5 + Math.sin(t * 4) * 0.3;
        ctx.beginPath(); ctx.arc(16, 3 + Math.sin(t * 3) * 1, 2, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#331111'; ctx.fillRect(-5, -2, 5, 4);
    } else {
        ctx.fillStyle = '#331111'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#cc0000'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 月牙
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(18, 0, 5, 0.3, TWO_PI_NEW - 0.3); ctx.arc(18, -1, 4, TWO_PI_NEW - 0.3, 0.3, true); ctx.fill();
    }
};

// 混沌之眼 — 多彩虚空杖
SkinRenderer.prototype._weapon_chaoseye = function(ctx, weaponType, attacking) {
    const t = this._time;
    const hue = (t * 50) % 360;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.25;
        ctx.globalAlpha = glow; ctx.fillStyle = `hsl(${hue},80%,50%)`;
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(8, -3); ctx.lineTo(4, 0); ctx.lineTo(8, 3); ctx.closePath(); ctx.fill();
        // 混沌之眼
        ctx.fillStyle = `hsl(${hue},80%,60%)`;
        ctx.beginPath(); ctx.ellipse(16, 0, 6, 3, 0, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(16, 0, 2, 3, 0, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(15, -1, 1, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#222'; ctx.fillRect(-5, -2, 5, 4);
    } else {
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = `hsl(${hue},80%,50%)`; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 旋转眼球
        ctx.fillStyle = `hsl(${(hue + 120) % 360},80%,60%)`;
        ctx.beginPath(); ctx.ellipse(18, 0, 5, 3, t * 2, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_NEW); ctx.fill();
    }
};

