// ============================================
// 鏂扮毊鑲ゆ墿灞曞寘 - 12娆惧叏鏂扮毊鑲ゆ覆鏌撳櫒涓庣壒鏁?// 閫氳繃鍘熷瀷鎵╁睍 SkinRenderer 鍜?SkinFxSystem
// ============================================

const TWO_PI_NEW = Math.PI * 2;

// ============================================
// 鏈烘绾厓绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_cyberpunk = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#00ffcc', 0.22);
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t) * 0.015);
    // Armored body - hexagonal + dark metal gradient
    const armorG = ctx.createRadialGradient(-r*0.2, -r*0.3, 0, 0, 0, r*1.1);
    armorG.addColorStop(0, '#2a2a4e'); armorG.addColorStop(0.5, '#1a1a2e'); armorG.addColorStop(1, '#0a0a18');
    ctx.fillStyle = armorG; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = (i/6)*TWO_PI_NEW - Math.PI/6; if(i===0) ctx.moveTo(Math.cos(a)*r, Math.sin(a)*r); else ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r); }
    ctx.closePath(); ctx.fill();
    // Armor plate edge glow
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 2; ctx.shadowColor = '#00ffcc'; ctx.shadowBlur = 4; ctx.stroke();
    ctx.shadowBlur = 0;
    // Panel division lines
    ctx.strokeStyle = 'rgba(0,255,200,0.25)'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(-r*0.7, -r*0.1); ctx.lineTo(r*0.7, -r*0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r*0.5, r*0.4); ctx.lineTo(r*0.5, r*0.4); ctx.stroke();
    // PCB circuit traces
    ctx.globalAlpha = 0.5; ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 0.8;
    for (let i = 0; i < 4; i++) {
        const ly = -r*0.6+i*r*0.35; const xOff = (i%2)*r*0.1;
        ctx.beginPath(); ctx.moveTo(-r*0.55+xOff, ly);
        ctx.lineTo(-r*0.2+xOff, ly); ctx.lineTo(-r*0.2+xOff, ly+r*0.15);
        ctx.lineTo(r*0.15+xOff, ly+r*0.15); ctx.lineTo(r*0.15+xOff, ly);
        ctx.lineTo(r*0.4+xOff, ly); ctx.stroke();
        ctx.fillStyle = '#00ffcc'; ctx.beginPath(); ctx.arc(r*0.4+xOff, ly, 1.5, 0, TWO_PI_NEW); ctx.fill();
    }
    // Holographic scan line
    const scanY = ((t*1.2)%2-1)*r;
    ctx.globalAlpha = 0.45; ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-r*0.8, scanY); ctx.lineTo(r*0.8, scanY); ctx.stroke();
    const scanG = ctx.createLinearGradient(-r*0.8, scanY-r*0.1, -r*0.8, scanY+r*0.1);
    scanG.addColorStop(0, 'transparent'); scanG.addColorStop(0.5, 'rgba(255,0,255,0.15)'); scanG.addColorStop(1, 'transparent');
    ctx.fillStyle = scanG; ctx.fillRect(-r*0.8, scanY-r*0.1, r*1.6, r*0.2);
    // Core energy orb (pulsing)
    ctx.globalAlpha = 0.85+Math.sin(t*4)*0.15;
    const coreG = ctx.createRadialGradient(0,0,0,0,0,r*0.22);
    coreG.addColorStop(0, '#ffffff'); coreG.addColorStop(0.3, '#ff00ff'); coreG.addColorStop(1, '#660066');
    ctx.fillStyle = coreG; ctx.beginPath(); ctx.arc(0,0,r*0.22,0,TWO_PI_NEW); ctx.fill();
    // Cyber eyes (glowing rectangles)
    ctx.globalAlpha = 1;
    for (let s = -1; s <= 1; s += 2) {
        const ex = s * r * 0.25, ey = -r*0.22;
        ctx.fillStyle = '#000'; ctx.fillRect(ex-r*0.12, ey-r*0.06, r*0.24, r*0.12);
        const eyeG = ctx.createLinearGradient(ex-r*0.1, ey, ex+r*0.1, ey);
        eyeG.addColorStop(0, '#00ffcc'); eyeG.addColorStop(0.5, '#ff00ff'); eyeG.addColorStop(1, '#00ffcc');
        ctx.fillStyle = eyeG; ctx.fillRect(ex-r*0.1, ey-r*0.04, r*0.2, r*0.08);
        ctx.globalAlpha = 0.5 + Math.sin(t*5+s)*0.3;
        ctx.fillStyle = '#fff'; ctx.fillRect(ex-r*0.03, ey-r*0.02, r*0.04, r*0.04);
        ctx.globalAlpha = 1;
    }
    // Data stream particles
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.3; ctx.fillStyle = '#00ffcc';
        for (let i = 0; i < 6; i++) {
            const px = -r*0.5 + i*r*0.2;
            const py = (((t*2+i*0.4)%2)-1)*r;
            ctx.fillRect(px, py, 1.5, 3);
        }
    }
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#cc8844', 0.12);
    ctx.save(); ctx.translate(x, y);
    // Brass/copper body with rivet details
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(-r*0.2,-r*0.15,0,0,0,r);
    bg.addColorStop(0,'#eebb66'); bg.addColorStop(0.4,'#cc8833'); bg.addColorStop(0.7,'#996622'); bg.addColorStop(1,'#664411');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Metallic sheen highlight
    ctx.globalAlpha=0.25;
    const hl=ctx.createLinearGradient(-r,-r,r,r);
    hl.addColorStop(0,'#ffffff'); hl.addColorStop(0.5,'transparent'); hl.addColorStop(1,'#ffffff');
    ctx.fillStyle=hl; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Rivet ring
    ctx.globalAlpha=0.7;
    if(this.quality.detailLevel>=1){
        for(let i=0;i<12;i++){
            const ra=(i/12)*TWO_PI_NEW;
            const rx=Math.cos(ra)*r*0.85, ry=Math.sin(ra)*r*0.85;
            // Rivet shadow
            ctx.fillStyle='#553311'; ctx.beginPath(); ctx.arc(rx+0.5,ry+0.5,r*0.04,0,TWO_PI_NEW); ctx.fill();
            // Rivet
            const rg=ctx.createRadialGradient(rx-1,ry-1,0,rx,ry,r*0.04);
            rg.addColorStop(0,'#ffdd88'); rg.addColorStop(1,'#aa7733');
            ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(rx,ry,r*0.04,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Steam pipe (top hat chimney)
    ctx.globalAlpha=1; ctx.fillStyle='#775533';
    ctx.fillRect(-r*0.12,-r*1.3,r*0.24,r*0.5);
    ctx.fillStyle='#664422';
    ctx.fillRect(-r*0.15,-r*0.85,r*0.3,r*0.08);
    // Steam puffs from pipe
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.3;
        for(let i=0;i<3;i++){
            const sy=-r*1.3-i*r*0.25-((t*40+i*20)%60)/60*r*0.5;
            const sx=Math.sin(t*2+i)*r*0.1;
            const sr=r*0.08+i*r*0.04+((t*40+i*20)%60)/60*r*0.05;
            ctx.fillStyle='rgba(200,200,200,'+(0.4-i*0.1)+')';
            ctx.beginPath(); ctx.arc(sx,sy,sr,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Goggle eyes (round brass frames with glass)
    ctx.globalAlpha=1;
    for(let side=-1;side<=1;side+=2){
        const ex=side*r*0.28, ey=-r*0.05;
        // Goggle frame (outer ring)
        ctx.strokeStyle='#886633'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.arc(ex,ey,r*0.2,0,TWO_PI_NEW); ctx.stroke();
        // Frame highlight
        ctx.strokeStyle='#ddaa55'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(ex,ey,r*0.2,-0.5,-0.1); ctx.stroke();
        // Glass lens (blue-green tint)
        const lg=ctx.createRadialGradient(ex-r*0.05,ey-r*0.05,0,ex,ey,r*0.17);
        lg.addColorStop(0,'#aaffee'); lg.addColorStop(0.5,'#44aa99'); lg.addColorStop(1,'#225544');
        ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(ex,ey,r*0.17,0,TWO_PI_NEW); ctx.fill();
        // Lens reflection
        ctx.fillStyle='rgba(255,255,255,0.5)';
        ctx.beginPath(); ctx.arc(ex-r*0.06,ey-r*0.06,r*0.04,0,TWO_PI_NEW); ctx.fill();
        // Inner glow pupil
        ctx.fillStyle='#ffcc00'; ctx.globalAlpha=0.6+Math.sin(t*3+side)*0.2;
        ctx.beginPath(); ctx.arc(ex,ey,r*0.06,0,TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha=1;
    }
    // Nose bridge connector
    ctx.fillStyle='#886633';
    ctx.fillRect(-r*0.08,-r*0.08,r*0.16,r*0.06);
    // Gear decorations
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.4;
        for(let gi=0;gi<2;gi++){
            const gx=gi===0?-r*0.5:r*0.45;
            const gy=gi===0?r*0.3:r*0.35;
            const gr=r*0.12;
            ctx.strokeStyle='#aa7733'; ctx.lineWidth=2;
            ctx.beginPath(); ctx.arc(gx,gy,gr,0,TWO_PI_NEW); ctx.stroke();
            // Gear teeth
            for(let gt=0;gt<8;gt++){
                const ga=(gt/8)*TWO_PI_NEW+t*(gi===0?1:-1);
                ctx.beginPath();
                ctx.moveTo(gx+Math.cos(ga)*gr,gy+Math.sin(ga)*gr);
                ctx.lineTo(gx+Math.cos(ga)*(gr+r*0.03),gy+Math.sin(ga)*(gr+r*0.03));
                ctx.stroke();
            }
            // Center dot
            ctx.fillStyle='#664422';
            ctx.beginPath(); ctx.arc(gx,gy,r*0.03,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Pressure gauge (small circular dial)
    ctx.globalAlpha=0.6; ctx.strokeStyle='#886633'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(r*0.1,r*0.4,r*0.08,0,TWO_PI_NEW); ctx.stroke();
    ctx.fillStyle='#ffffee'; ctx.beginPath(); ctx.arc(r*0.1,r*0.4,r*0.06,0,TWO_PI_NEW); ctx.fill();
    // Gauge needle
    const needleA=-Math.PI*0.5+Math.sin(t*1.5)*1.2;
    ctx.strokeStyle='#cc0000'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(r*0.1,r*0.4);
    ctx.lineTo(r*0.1+Math.cos(needleA)*r*0.05,r*0.4+Math.sin(needleA)*r*0.05); ctx.stroke();
    // Outer ring
    ctx.globalAlpha=0.6; ctx.strokeStyle='#cc8844'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
};;
SkinRenderer.prototype._proj_steambot = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*8);
    ctx.fillStyle='#887744'; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; const or=i%2===0?r*0.8:r*0.5; ctx.lineTo(Math.cos(a)*or,Math.sin(a)*or);}
    ctx.closePath(); ctx.fill(); ctx.restore();
    if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#ffaa33',0.2);
};

SkinRenderer.prototype._body_nanocore = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#00ffcc', 0.2);
    ctx.save(); ctx.translate(x, y);
    // Nanobot swarm body - liquid metal appearance
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(-r*0.15,-r*0.15,0,0,0,r);
    bg.addColorStop(0,'#ccffee'); bg.addColorStop(0.3,'#44ddaa'); bg.addColorStop(0.6,'#228866'); bg.addColorStop(1,'#114433');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Hexagonal nano-structure grid
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.globalAlpha=0.2; ctx.strokeStyle='#00ffaa'; ctx.lineWidth=0.6;
        ctx.beginPath(); ctx.arc(0,0,r*0.95,0,TWO_PI_NEW); ctx.clip();
        const hexR=r*0.12;
        const hexH=hexR*Math.sqrt(3);
        for(let row=-4;row<=4;row++){
            for(let col=-4;col<=4;col++){
                const hx=col*hexR*1.5;
                const hy=row*hexH+(col%2)*hexH*0.5;
                if(hx*hx+hy*hy>r*r*0.85) continue;
                ctx.beginPath();
                for(let v=0;v<6;v++){
                    const va=(v/6)*TWO_PI_NEW-Math.PI/6;
                    const vx=hx+Math.cos(va)*hexR*0.45;
                    const vy=hy+Math.sin(va)*hexR*0.45;
                    v===0?ctx.moveTo(vx,vy):ctx.lineTo(vx,vy);
                }
                ctx.closePath(); ctx.stroke();
            }
        }
        ctx.restore();
    }
    // Core reactor (center glowing sphere)
    const coreR=r*0.3;
    const cg=ctx.createRadialGradient(0,0,0,0,0,coreR);
    cg.addColorStop(0,'#ffffff'); cg.addColorStop(0.3,'#88ffdd'); cg.addColorStop(0.6,'#00cc88'); cg.addColorStop(1,'#004433');
    ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(0,0,coreR,0,TWO_PI_NEW); ctx.fill();
    // Core pulsing ring
    ctx.strokeStyle='#00ffcc'; ctx.lineWidth=1.5; ctx.globalAlpha=0.6+Math.sin(t*4)*0.3;
    ctx.beginPath(); ctx.arc(0,0,coreR+r*0.05+Math.sin(t*4)*r*0.02,0,TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha=1;
    // Data flow lines (circulating around body)
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.4; ctx.strokeStyle='#00ffcc'; ctx.lineWidth=1; ctx.lineCap='round';
        for(let i=0;i<4;i++){
            const orbitR=r*(0.5+i*0.12);
            const startA=t*2*(i%2?1:-1)+i*0.8;
            ctx.beginPath(); ctx.arc(0,0,orbitR,startA,startA+1.2); ctx.stroke();
            // Data packet dot
            ctx.fillStyle='#88ffee';
            const dotA=startA+1.2;
            ctx.beginPath(); ctx.arc(Math.cos(dotA)*orbitR,Math.sin(dotA)*orbitR,2,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Nano-eye (single cyclopean digital eye)
    ctx.globalAlpha=1;
    // Eye frame (hexagonal)
    ctx.strokeStyle='#00ffcc'; ctx.lineWidth=1.5;
    ctx.beginPath();
    for(let v=0;v<6;v++){
        const va=(v/6)*TWO_PI_NEW-Math.PI/6;
        const vx=Math.cos(va)*r*0.18;
        const vy=-r*0.05+Math.sin(va)*r*0.18;
        v===0?ctx.moveTo(vx,vy):ctx.lineTo(vx,vy);
    }
    ctx.closePath(); ctx.stroke();
    // Eye fill
    ctx.fillStyle='#003322'; ctx.fill();
    // Scanning iris
    const scanA=t*3;
    ctx.fillStyle='#00ffaa';
    ctx.beginPath(); ctx.arc(Math.cos(scanA)*r*0.04,-r*0.05+Math.sin(scanA)*r*0.04,r*0.08,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='#ffffff';
    ctx.beginPath(); ctx.arc(Math.cos(scanA)*r*0.04,-r*0.05+Math.sin(scanA)*r*0.04,r*0.03,0,TWO_PI_NEW); ctx.fill();
    // Floating nano-particles
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.5;
        for(let i=0;i<8;i++){
            const pa=t*1.5+i*0.8;
            const pd=r*(0.9+Math.sin(t*2+i*0.7)*0.3);
            const px=Math.cos(pa)*pd, py=Math.sin(pa)*pd;
            if(px*px+py*py>r*r*1.5) continue;
            ctx.fillStyle=i%3===0?'#00ffcc':i%3===1?'#88ffee':'#44ddaa';
            ctx.fillRect(px-1,py-1,2,2);
        }
    }
    // Outer containment field
    ctx.globalAlpha=0.4; ctx.strokeStyle='#00ffcc'; ctx.lineWidth=1;
    ctx.setLineDash([r*0.08,r*0.05]); ctx.lineDashOffset=-t*30;
    ctx.beginPath(); ctx.arc(0,0,r*1.05,0,TWO_PI_NEW); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
};;
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffee00', 0.25);
    ctx.save(); ctx.translate(x, y);
    // Plasma sphere - multi-layer 3D glow
    const cg = ctx.createRadialGradient(-r*0.15, -r*0.2, 0, 0, 0, r);
    cg.addColorStop(0,'#ffffff'); cg.addColorStop(0.15,'#ffffcc');
    cg.addColorStop(0.35,'#ffee44'); cg.addColorStop(0.6,'#ddaa00');
    cg.addColorStop(0.85,'#885500'); cg.addColorStop(1,'#442200');
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Surface arc textures (Lissajous patterns)
    if (this.quality.detailLevel >= 1) {
        ctx.save(); ctx.globalAlpha = 0.2;
        ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.clip();
        ctx.strokeStyle = '#ffff88'; ctx.lineWidth = 0.5;
        for (let wave = 0; wave < 3; wave++) {
            ctx.beginPath();
            for (let s = 0; s <= 30; s++) {
                const frac = s / 30;
                const a = frac * TWO_PI_NEW;
                const wavR = r * (0.4 + 0.35 * Math.sin(a * 3 + t * 2 + wave * 2));
                const px = Math.cos(a) * wavR, py = Math.sin(a) * wavR;
                s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    // Lightning bolts - deterministic pseudo-random
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.globalAlpha=0.6+Math.sin(t*8)*0.3;
    const boltSeed = Math.floor(t * 6);
    for(let b=0;b<5;b++){
        const ba=(b/5)*TWO_PI_NEW+t*0.8;
        ctx.beginPath(); ctx.moveTo(0,0);
        let bx=0, by=0;
        const segs = this.quality.detailLevel >= 2 ? 5 : 3;
        for(let s=0;s<segs;s++){
            const jitter = Math.sin(boltSeed*13.7+b*7.3+s*3.1)*1.2;
            bx+=Math.cos(ba+jitter)*r*0.28; by+=Math.sin(ba+jitter)*r*0.28;
            ctx.lineTo(bx,by);
        }
        ctx.stroke();
        // Inner core (brighter, thinner)
        ctx.save(); ctx.lineWidth=1; ctx.globalAlpha=0.9; ctx.strokeStyle='#ffffee';
        ctx.beginPath(); ctx.moveTo(0,0); bx=0; by=0;
        for(let s=0;s<segs;s++){
            const jitter = Math.sin(boltSeed*13.7+b*7.3+s*3.1)*1.2;
            bx+=Math.cos(ba+jitter)*r*0.28; by+=Math.sin(ba+jitter)*r*0.28;
            ctx.lineTo(bx,by);
        }
        ctx.stroke(); ctx.restore();
    }
    // Outer electric arc ring
    ctx.globalAlpha=0.35; ctx.strokeStyle='#ffee88'; ctx.lineWidth=1.2; ctx.beginPath();
    for(let i=0;i<24;i++){
        const a=(i/24)*TWO_PI_NEW;
        const rr=r*1.15+Math.sin(boltSeed*5.7+i*2.3)*r*0.15;
        if(i===0) ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);
        else ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);
    }
    ctx.closePath(); ctx.stroke();
    // Core pulse glow
    ctx.globalAlpha = 0.6 + Math.sin(t*6)*0.2;
    const coreG = ctx.createRadialGradient(0,0,0,0,0,r*0.25);
    coreG.addColorStop(0,'#ffffff'); coreG.addColorStop(0.5,'#ffffaa'); coreG.addColorStop(1,'transparent');
    ctx.fillStyle=coreG; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    // Thunder eyes
    ctx.globalAlpha=1;
    for(let s=-1;s<=1;s+=2){
        const ex=s*r*0.22, ey=-r*0.12;
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ex,ey,r*0.08,0,TWO_PI_NEW); ctx.fill();
        ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(ex,ey,r*0.05,0,TWO_PI_NEW); ctx.fill();
    }
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#88ddff', 0.22);
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.2);
    // Multi-faceted ice crystal body (irregular octagon)
    const cg = ctx.createRadialGradient(-r*0.2, -r*0.3, 0, 0, 0, r);
    cg.addColorStop(0,'#ffffff'); cg.addColorStop(0.2,'#eef8ff');
    cg.addColorStop(0.45,'#aaddff'); cg.addColorStop(0.7,'#55aadd');
    cg.addColorStop(1,'#224488');
    ctx.fillStyle = cg; ctx.beginPath();
    for(let i=0;i<8;i++){
        const a=(i/8)*TWO_PI_NEW;
        const cr=i%2===0?r:r*0.78;
        ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);
    }
    ctx.closePath(); ctx.fill();
    // Ice facet shading (alternating triangular faces)
    ctx.globalAlpha = 0.25;
    for(let i=0;i<8;i++){
        const a1=(i/8)*TWO_PI_NEW;
        const a2=((i+1)/8)*TWO_PI_NEW;
        const r1=i%2===0?r:r*0.78;
        const r2=(i+1)%2===0?r:r*0.78;
        ctx.fillStyle = i%2===0 ? '#ccf0ff' : '#88ccee';
        ctx.beginPath(); ctx.moveTo(0,0);
        ctx.lineTo(Math.cos(a1)*r1,Math.sin(a1)*r1);
        ctx.lineTo(Math.cos(a2)*r2,Math.sin(a2)*r2);
        ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Internal refraction lines (like light bouncing inside ice)
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.globalAlpha=0.2;
        ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.8;
        for(let i=0;i<6;i++){
            const a=(i/6)*TWO_PI_NEW+0.3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a)*r*0.2,Math.sin(a)*r*0.2);
            ctx.lineTo(Math.cos(a+0.5)*r*0.6,Math.sin(a+0.5)*r*0.6);
            ctx.stroke();
        }
        ctx.restore();
    }
    // Surface frost texture
    if(this.quality.detailLevel>=2){
        ctx.save(); ctx.globalAlpha=0.15;
        ctx.beginPath();
        for(let i=0;i<8;i++){const a=(i/8)*TWO_PI_NEW;const cr=i%2===0?r:r*0.78;ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);}
        ctx.closePath(); ctx.clip();
        ctx.fillStyle='#fff';
        for(let i=0;i<15;i++){
            const fx=Math.cos(i*2.4)*r*0.6;
            const fy=Math.sin(i*3.1)*r*0.5;
            ctx.beginPath(); ctx.arc(fx,fy,1+Math.sin(i)*0.5,0,TWO_PI_NEW); ctx.fill();
        }
        ctx.restore();
    }
    // Large highlight facet (frozen mirror reflection)
    ctx.globalAlpha=0.35;
    ctx.fillStyle='#fff';
    ctx.beginPath();
    ctx.moveTo(0,-r*0.75); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(0,r*0.05); ctx.lineTo(-r*0.2,-r*0.4);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha=1;
    // Outer edge facet lines
    ctx.strokeStyle='rgba(200,240,255,0.5)'; ctx.lineWidth=1.2;
    ctx.beginPath();
    for(let i=0;i<8;i++){const a=(i/8)*TWO_PI_NEW;const cr=i%2===0?r:r*0.78;if(i===0)ctx.moveTo(Math.cos(a)*cr,Math.sin(a)*cr);else ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);}
    ctx.closePath(); ctx.stroke();
    ctx.restore();
    // Floating ice crystals around
    ctx.save(); ctx.globalAlpha=0.45; ctx.fillStyle='#cceeff';
    for(let i=0;i<6;i++){
        const a=t*0.6+(i/6)*TWO_PI_NEW;
        const d=r*1.35+Math.sin(t*1.5+i*1.2)*r*0.12;
        const px=x+Math.cos(a)*d, py=y+Math.sin(a)*d;
        // Small diamond shape
        ctx.beginPath();
        ctx.moveTo(px,py-2.5); ctx.lineTo(px+1.5,py); ctx.lineTo(px,py+2.5); ctx.lineTo(px-1.5,py);
        ctx.closePath(); ctx.fill();
    }
    ctx.restore();
};;
SkinRenderer.prototype._proj_glacier = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*3);
    ctx.fillStyle='#aaeeff'; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; const cr=i%2===0?r*0.9:r*0.4; ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);} ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#88ddff',0.25);
};

SkinRenderer.prototype._body_shadow = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#6600aa', 0.22);
    ctx.save(); ctx.translate(x, y);
    // Shadow tendrils (wispy, organic)
    ctx.globalAlpha=0.4; ctx.strokeStyle='#4400aa'; ctx.lineWidth=2.5; ctx.lineCap='round';
    for(let i=0;i<6;i++){
        const a=(i/6)*TWO_PI_NEW+t*0.4;
        const len=r*1.5+Math.sin(t*1.5+i*0.8)*r*0.35;
        const midA=a+Math.sin(t*1.2+i)*0.5;
        const midD=r*0.7+Math.sin(t*2+i*0.6)*r*0.1;
        ctx.beginPath(); ctx.moveTo(Math.cos(a)*r*0.5,Math.sin(a)*r*0.5);
        ctx.quadraticCurveTo(Math.cos(midA)*midD,Math.sin(midA)*midD,Math.cos(a)*len,Math.sin(a)*len);
        ctx.stroke();
        // Tendril tip glow
        if(this.quality.detailLevel>=2){
            ctx.save(); ctx.globalAlpha=0.3;
            ctx.fillStyle='#aa44ff';
            ctx.beginPath(); ctx.arc(Math.cos(a)*len,Math.sin(a)*len,2,0,TWO_PI_NEW); ctx.fill();
            ctx.restore();
        }
    }
    // Dark core body - multi-layer void
    ctx.globalAlpha=1;
    const sg=ctx.createRadialGradient(0,0,0,0,0,r);
    sg.addColorStop(0,'#1a0033'); sg.addColorStop(0.3,'#0d001a'); sg.addColorStop(0.7,'#050008'); sg.addColorStop(1,'#000000');
    ctx.fillStyle=sg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Void ripple ring
    ctx.globalAlpha=0.4; ctx.strokeStyle='#7744cc'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(0,0,r*0.85+Math.sin(t*3)*r*0.05,0,TWO_PI_NEW); ctx.stroke();
    // Inner swirl pattern
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.globalAlpha=0.12;
        ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.clip();
        ctx.strokeStyle='#aa66ff'; ctx.lineWidth=1;
        for(let arm=0;arm<3;arm++){
            ctx.beginPath();
            const baseA=t*0.6+arm*TWO_PI_NEW/3;
            for(let s=0;s<=20;s++){
                const frac=s/20;
                const spiralA=baseA+frac*Math.PI*2;
                const spiralR=frac*r*0.9;
                const px=Math.cos(spiralA)*spiralR;
                const py=Math.sin(spiralA)*spiralR;
                s===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    // Outer glow ring
    ctx.globalAlpha=0.5; ctx.strokeStyle='#aa44ff'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    // Central cyclopean eye
    ctx.globalAlpha=1;
    // Eye socket shadow
    ctx.fillStyle='#220044';
    ctx.beginPath(); ctx.ellipse(0,-r*0.05,r*0.4,r*0.3,0,0,TWO_PI_NEW); ctx.fill();
    // Sclera (dark purple)
    ctx.fillStyle='#330055';
    ctx.beginPath(); ctx.ellipse(0,-r*0.05,r*0.35,r*0.25,0,0,TWO_PI_NEW); ctx.fill();
    // Iris - glowing magenta/purple gradient
    const irisG=ctx.createRadialGradient(0,-r*0.05,0,0,-r*0.05,r*0.2);
    irisG.addColorStop(0,'#ff88ff'); irisG.addColorStop(0.4,'#cc00ff'); irisG.addColorStop(0.8,'#6600aa'); irisG.addColorStop(1,'#220044');
    ctx.fillStyle=irisG;
    ctx.beginPath(); ctx.arc(0,-r*0.05,r*0.2,0,TWO_PI_NEW); ctx.fill();
    // Pupil (vertical slit, pulsing)
    ctx.fillStyle='#000';
    const pupilW=r*0.06+Math.sin(t*2.5)*r*0.02;
    ctx.beginPath(); ctx.ellipse(0,-r*0.05,pupilW,r*0.17,0,0,TWO_PI_NEW); ctx.fill();
    // Eye highlight
    ctx.fillStyle='rgba(255,200,255,0.7)';
    ctx.beginPath(); ctx.arc(-r*0.08,-r*0.12,r*0.04,0,TWO_PI_NEW); ctx.fill();
    // Eye glow aura
    ctx.save(); ctx.globalAlpha=0.3+Math.sin(t*3)*0.1;
    const eyeGlow=ctx.createRadialGradient(0,-r*0.05,r*0.15,0,-r*0.05,r*0.4);
    eyeGlow.addColorStop(0,'#ff44ff'); eyeGlow.addColorStop(1,'transparent');
    ctx.fillStyle=eyeGlow;
    ctx.beginPath(); ctx.arc(0,-r*0.05,r*0.4,0,TWO_PI_NEW); ctx.fill();
    ctx.restore();
    // Floating shadow particles
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.3;
        for(let i=0;i<5;i++){
            const pa=t*1.2+i*1.3;
            const pd=r*(0.5+Math.sin(t*2+i)*0.2);
            ctx.fillStyle=i%2?'#aa44ff':'#6600aa';
            ctx.beginPath(); ctx.arc(Math.cos(pa)*pd,Math.sin(pa)*pd,1.5,0,TWO_PI_NEW); ctx.fill();
        }
    }
    ctx.restore();
};;
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ff6600', 0.15);
    ctx.save(); ctx.translate(x, y);
    // Fox fire (kitsunebi) - floating flames
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.35;
        for(let i=0;i<5;i++){
            const fa=t*0.8+i*TWO_PI_NEW/5;
            const fd=r*1.3+Math.sin(t*1.5+i*1.1)*r*0.2;
            const fx=Math.cos(fa)*fd, fy=Math.sin(fa)*fd;
            const fg=ctx.createRadialGradient(fx,fy,0,fx,fy,r*0.15);
            fg.addColorStop(0,'#ffffff'); fg.addColorStop(0.3,'#88ccff'); fg.addColorStop(0.7,'#4488ff'); fg.addColorStop(1,'transparent');
            ctx.fillStyle=fg;
            ctx.beginPath(); ctx.arc(fx,fy,r*0.15,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Multi-tailed silhouette (9 tails, fanning)
    ctx.globalAlpha=0.6;
    for(let i=0;i<9;i++){
        const tailA=Math.PI*0.5+(i-4)*0.18+Math.sin(t*1.2+i*0.4)*0.08;
        const len=r*1.6+Math.sin(t*2+i)*r*0.2;
        const cp1x=Math.cos(tailA)*r*0.5, cp1y=Math.sin(tailA)*r*0.5;
        const cp2x=Math.cos(tailA-0.1)*len*0.6, cp2y=Math.sin(tailA-0.1)*len*0.6;
        const endX=Math.cos(tailA+0.1)*len, endY=Math.sin(tailA+0.1)*len;
        ctx.strokeStyle=i%2?'#ff8833':'#ffaa44'; ctx.lineWidth=3-i*0.1; ctx.lineCap='round';
        ctx.beginPath(); ctx.moveTo(0,r*0.3);
        ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,endX,endY); ctx.stroke();
        // Tail tip glow
        if(this.quality.detailLevel>=2){
            ctx.save(); ctx.globalAlpha=0.5;
            ctx.fillStyle='#ffcc00';
            ctx.beginPath(); ctx.arc(endX,endY,2,0,TWO_PI_NEW); ctx.fill();
            ctx.restore();
        }
    }
    // Main body - fox-shaped (slightly elongated circle with warm fur gradient)
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(-r*0.15,-r*0.1,0,0,0,r);
    bg.addColorStop(0,'#fff4e0'); bg.addColorStop(0.4,'#ffcc66'); bg.addColorStop(0.7,'#ff8800'); bg.addColorStop(1,'#cc4400');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Fur texture (subtle short strokes)
    if(this.quality.detailLevel>=2){
        ctx.save(); ctx.globalAlpha=0.15; ctx.strokeStyle='#aa4400'; ctx.lineWidth=0.8;
        for(let i=0;i<20;i++){
            const fa=i/20*TWO_PI_NEW+t*0.05;
            const fr=r*0.6+Math.random()*r*0.3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(fa)*fr,Math.sin(fa)*fr);
            ctx.lineTo(Math.cos(fa)*(fr+r*0.08),Math.sin(fa)*(fr+r*0.08));
            ctx.stroke();
        }
        ctx.restore();
    }
    // White chest/belly marking
    ctx.globalAlpha=0.6; ctx.fillStyle='#fff8ee';
    ctx.beginPath(); ctx.ellipse(0,r*0.15,r*0.4,r*0.35,0,0,Math.PI); ctx.fill();
    // Fox ears (triangles with inner pink)
    ctx.globalAlpha=1;
    // Left ear
    ctx.fillStyle='#ff8800';
    ctx.beginPath(); ctx.moveTo(-r*0.55,-r*0.5); ctx.lineTo(-r*0.3,-r*1.1); ctx.lineTo(-r*0.05,-r*0.5); ctx.fill();
    ctx.fillStyle='#ffccaa';
    ctx.beginPath(); ctx.moveTo(-r*0.45,-r*0.55); ctx.lineTo(-r*0.3,-r*0.9); ctx.lineTo(-r*0.15,-r*0.55); ctx.fill();
    // Right ear
    ctx.fillStyle='#ff8800';
    ctx.beginPath(); ctx.moveTo(r*0.55,-r*0.5); ctx.lineTo(r*0.3,-r*1.1); ctx.lineTo(r*0.05,-r*0.5); ctx.fill();
    ctx.fillStyle='#ffccaa';
    ctx.beginPath(); ctx.moveTo(r*0.45,-r*0.55); ctx.lineTo(r*0.3,-r*0.9); ctx.lineTo(r*0.15,-r*0.55); ctx.fill();
    // Eyes - golden with slit pupils (fox-like)
    const eyeYOff=-r*0.1;
    for(let side=-1;side<=1;side+=2){
        const ex=side*r*0.22, ey=eyeYOff;
        // Eye shape (slightly angular/almond)
        ctx.fillStyle='#ffcc00';
        ctx.beginPath(); ctx.ellipse(ex,ey,r*0.12,r*0.09,side*0.1,0,TWO_PI_NEW); ctx.fill();
        // Pupil - vertical slit
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.ellipse(ex,ey,r*0.03,r*0.08,0,0,TWO_PI_NEW); ctx.fill();
        // Eye highlight
        ctx.fillStyle='rgba(255,255,200,0.8)';
        ctx.beginPath(); ctx.arc(ex-r*0.04,ey-r*0.03,r*0.025,0,TWO_PI_NEW); ctx.fill();
    }
    // Nose
    ctx.fillStyle='#1a0000';
    ctx.beginPath(); ctx.moveTo(0,r*0.08); ctx.lineTo(-r*0.05,r*0.03); ctx.lineTo(r*0.05,r*0.03); ctx.fill();
    // Whiskers (3 per side)
    ctx.strokeStyle='#ffddaa'; ctx.lineWidth=0.8; ctx.globalAlpha=0.5;
    for(let side=-1;side<=1;side+=2){
        for(let w=0;w<3;w++){
            const wa=-0.15+w*0.15;
            ctx.beginPath();
            ctx.moveTo(side*r*0.15,r*0.05+w*r*0.04);
            ctx.lineTo(side*r*0.6,r*0.0+w*r*0.06+Math.sin(t*3+w)*r*0.02);
            ctx.stroke();
        }
    }
    // Forehead marking (mystical symbol)
    ctx.globalAlpha=0.7; ctx.fillStyle='#ff4400';
    ctx.beginPath();
    ctx.moveTo(0,-r*0.35); ctx.lineTo(-r*0.06,-r*0.25); ctx.lineTo(0,-r*0.28); ctx.lineTo(r*0.06,-r*0.25); ctx.fill();
    // Mystical aura ring
    ctx.globalAlpha=0.3; ctx.strokeStyle='#ffaa44'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(0,0,r*1.05,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
};;
SkinRenderer.prototype._proj_kitsune = function(ctx, x, y, r, angle) {
    const t = this._time;
    ctx.save(); ctx.translate(x, y);
    for (let i = 0; i < 9; i++) {
        const ta = t * 8 + i * TWO_PI_NEW / 9;
        const tLen = r * (0.6 + Math.sin(t * 3 + i * 0.7) * 0.2);
        ctx.save(); ctx.globalAlpha = 0.4;
        const tg = ctx.createLinearGradient(0, 0, Math.cos(ta) * tLen, Math.sin(ta) * tLen);
        tg.addColorStop(0, '#88ddff'); tg.addColorStop(0.6, '#44aaff'); tg.addColorStop(1, 'transparent');
        ctx.strokeStyle = tg; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(Math.cos(ta + 0.3) * tLen * 0.6, Math.sin(ta + 0.3) * tLen * 0.6, Math.cos(ta) * tLen, Math.sin(ta) * tLen);
        ctx.stroke(); ctx.restore();
    }
    ctx.globalAlpha = 0.3 + Math.sin(t * 5) * 0.15;
    ctx.strokeStyle = '#88ccff'; ctx.lineWidth = r * 0.04;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.0, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.45);
    cg.addColorStop(0, '#fff'); cg.addColorStop(0.2, '#aaddff'); cg.addColorStop(0.5, '#44aaff'); cg.addColorStop(0.8, '#2266aa'); cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, TWO_PI_NEW); ctx.fill();
    ctx.fillStyle = '#88ccff'; ctx.globalAlpha = 0.5;
    for (let i = 0; i < 7; i++) {
        const pa = t * 10 + i * 0.9;
        const pd = r * (0.4 + Math.sin(t * 4 + i * 1.5) * 0.4);
        ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 2, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.restore();
    if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.7, '#44aaff', 0.35);
};

SkinRenderer.prototype._body_dragonking = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffaa00', 0.2);
    ctx.save(); ctx.translate(x, y);
    // Dragon scale body - gold with iridescent sheen
    ctx.globalAlpha=1;
    const dg=ctx.createRadialGradient(-r*0.2,-r*0.2,0,0,0,r);
    dg.addColorStop(0,'#ffe066'); dg.addColorStop(0.3,'#ffcc00'); dg.addColorStop(0.6,'#cc8800'); dg.addColorStop(1,'#884400');
    ctx.fillStyle=dg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Scale pattern (overlapping arcs)
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.globalAlpha=0.2; ctx.strokeStyle='#664400'; ctx.lineWidth=0.8;
        ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.clip();
        const scaleSize=r*0.18;
        for(let row=-4;row<=4;row++){
            for(let col=-4;col<=4;col++){
                const sx=col*scaleSize*1.6+(row%2)*scaleSize*0.8;
                const sy=row*scaleSize*1.2;
                if(sx*sx+sy*sy>r*r) continue;
                ctx.beginPath(); ctx.arc(sx,sy+scaleSize*0.5,scaleSize,Math.PI+0.3,TWO_PI_NEW-0.3); ctx.stroke();
            }
        }
        ctx.restore();
    }
    // Dragon horns (curved, golden)
    ctx.globalAlpha=1;
    for(let side=-1;side<=1;side+=2){
        const hg=ctx.createLinearGradient(side*r*0.3,-r,side*r*0.6,-r*1.4);
        hg.addColorStop(0,'#ffcc00'); hg.addColorStop(1,'#ffee88');
        ctx.fillStyle=hg; ctx.lineWidth=2; ctx.strokeStyle='#996600';
        ctx.beginPath();
        ctx.moveTo(side*r*0.3,-r*0.6);
        ctx.quadraticCurveTo(side*r*0.5,-r*1.1,side*r*0.7,-r*1.3);
        ctx.quadraticCurveTo(side*r*0.55,-r*1.0,side*r*0.4,-r*0.65);
        ctx.fill(); ctx.stroke();
        // Horn ridges
        if(this.quality.detailLevel>=2){
            ctx.save(); ctx.globalAlpha=0.3; ctx.strokeStyle='#ffee88'; ctx.lineWidth=0.7;
            for(let h=0;h<3;h++){
                const hf=0.3+h*0.2;
                ctx.beginPath();
                ctx.moveTo(side*r*(0.3+hf*0.15),-(r*0.6+hf*r*0.3));
                ctx.lineTo(side*r*(0.35+hf*0.15),-(r*0.55+hf*r*0.3));
                ctx.stroke();
            }
            ctx.restore();
        }
    }
    // Dragon mane/crest (flowing spine ridges)
    ctx.globalAlpha=0.7; ctx.fillStyle='#ff6600';
    for(let i=0;i<5;i++){
        const ca=-Math.PI*0.5+i*0.2-0.4;
        const cr=r*0.95;
        const cx=Math.cos(ca)*cr, cy=Math.sin(ca)*cr;
        const ch=r*0.25+Math.sin(t*2+i)*r*0.05;
        ctx.beginPath();
        ctx.moveTo(cx-r*0.04,cy); ctx.lineTo(cx,cy-ch); ctx.lineTo(cx+r*0.04,cy); ctx.fill();
    }
    // Eyes - fierce reptilian with fire glow
    ctx.globalAlpha=1;
    for(let side=-1;side<=1;side+=2){
        const ex=side*r*0.28, ey=-r*0.15;
        // Eye socket (angular)
        ctx.fillStyle='#331100';
        ctx.beginPath();
        ctx.moveTo(ex-r*0.14,ey); ctx.lineTo(ex,ey-r*0.1); ctx.lineTo(ex+r*0.14,ey); ctx.lineTo(ex,ey+r*0.08); ctx.fill();
        // Iris (fiery orange-red)
        const iG=ctx.createRadialGradient(ex,ey,0,ex,ey,r*0.1);
        iG.addColorStop(0,'#ffff00'); iG.addColorStop(0.5,'#ff6600'); iG.addColorStop(1,'#cc0000');
        ctx.fillStyle=iG;
        ctx.beginPath(); ctx.arc(ex,ey,r*0.1,0,TWO_PI_NEW); ctx.fill();
        // Vertical slit pupil
        ctx.fillStyle='#000';
        ctx.beginPath(); ctx.ellipse(ex,ey,r*0.025,r*0.08,0,0,TWO_PI_NEW); ctx.fill();
        // Eye highlight
        ctx.fillStyle='rgba(255,255,200,0.9)';
        ctx.beginPath(); ctx.arc(ex-side*r*0.03,ey-r*0.03,r*0.02,0,TWO_PI_NEW); ctx.fill();
    }
    // Snout / nose ridge
    ctx.fillStyle='#aa6600'; ctx.globalAlpha=0.5;
    ctx.beginPath(); ctx.moveTo(0,-r*0.25); ctx.lineTo(-r*0.04,r*0.1); ctx.lineTo(r*0.04,r*0.1); ctx.fill();
    // Nostrils
    ctx.fillStyle='#220000'; ctx.globalAlpha=1;
    ctx.beginPath(); ctx.ellipse(-r*0.06,r*0.05,r*0.025,r*0.015,0,0,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r*0.06,r*0.05,r*0.025,r*0.015,0,0,TWO_PI_NEW); ctx.fill();
    // Mouth line (slight snarl)
    ctx.strokeStyle='#441100'; ctx.lineWidth=1.5; ctx.globalAlpha=0.6;
    ctx.beginPath(); ctx.moveTo(-r*0.2,r*0.2);
    ctx.quadraticCurveTo(0,r*0.12,r*0.2,r*0.2); ctx.stroke();
    // Chin whiskers (long, flowing)
    ctx.strokeStyle='#ffcc44'; ctx.lineWidth=1; ctx.lineCap='round'; ctx.globalAlpha=0.5;
    for(let side=-1;side<=1;side+=2){
        ctx.beginPath();
        ctx.moveTo(side*r*0.15,r*0.25);
        ctx.quadraticCurveTo(side*r*0.4,r*0.5+Math.sin(t*1.5+side)*r*0.1,side*r*0.6,r*0.8+Math.sin(t*2)*r*0.1);
        ctx.stroke();
    }
    // Fire breath particles
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.4;
        for(let i=0;i<4;i++){
            const fp=t*2+i*1.5;
            const fx=Math.sin(fp)*r*0.1;
            const fy=r*0.3+((fp%3)/3)*r*0.5;
            const fg=ctx.createRadialGradient(fx,fy,0,fx,fy,r*0.06);
            fg.addColorStop(0,'#ffff88'); fg.addColorStop(0.5,'#ff6600'); fg.addColorStop(1,'transparent');
            ctx.fillStyle=fg;
            ctx.beginPath(); ctx.arc(fx,fy,r*0.06,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Golden aura
    ctx.globalAlpha=0.3; ctx.strokeStyle='#ffcc00'; ctx.lineWidth=2;
    ctx.setLineDash([r*0.1,r*0.1]); ctx.lineDashOffset=-t*20;
    ctx.beginPath(); ctx.arc(0,0,r*1.1,0,TWO_PI_NEW); ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
};;
SkinRenderer.prototype._proj_dragonking = function(ctx, x, y, r, angle) {
    const t = this._time;
    ctx.save(); ctx.translate(x, y);
    for (let i = 0; i < 5; i++) {
        const spiralBase = t * 9 + i * TWO_PI_NEW / 5;
        ctx.save(); ctx.globalAlpha = 0.4;
        ctx.beginPath();
        for (let s = 0; s <= 10; s++) {
            const frac = s / 10;
            const sa = spiralBase + frac * Math.PI * 2;
            const sr = frac * r * 1.2;
            const sx = Math.cos(sa) * sr;
            const sy = Math.sin(sa) * sr;
            s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
        }
        ctx.strokeStyle = i % 2 ? '#88ddff' : '#4488ff'; ctx.lineWidth = r * 0.08;
        ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
    }
    ctx.globalAlpha = 0.3 + Math.sin(t * 4) * 0.1;
    ctx.strokeStyle = '#aaddff'; ctx.lineWidth = r * 0.04;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.1 + Math.sin(t * 5) * r * 0.1, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.5);
    cg.addColorStop(0, '#fff'); cg.addColorStop(0.2, '#ffee88'); cg.addColorStop(0.5, '#4488ff'); cg.addColorStop(0.8, '#2244aa'); cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, TWO_PI_NEW); ctx.fill();
    ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    for (let i = 0; i < 8; i++) {
        const pa = t * 7 + i * 0.78;
        const pd = r * (0.5 + Math.sin(t * 3 + i * 1.4) * 0.5);
        const ps = 2 + Math.sin(t * 4 + i) * 1;
        ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, ps, 0, TWO_PI_NEW); ctx.stroke();
    }
    ctx.restore();
    if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.7, '#4488ff', 0.35);
};

SkinRenderer.prototype._body_wukong = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffaa00', 0.15);
    ctx.save(); ctx.translate(x, y);
    ctx.save();
    for (let i = 0; i < 3; i++) {
        ctx.save(); ctx.rotate(t * 3 + i * 0.15);
        ctx.globalAlpha = 0.4 - i * 0.12;
        const sg = ctx.createLinearGradient(-r * 1.7, 0, r * 1.7, 0);
        sg.addColorStop(0, '#cc8800'); sg.addColorStop(0.2, '#ffdd44'); sg.addColorStop(0.5, '#ffee88'); sg.addColorStop(0.8, '#ffdd44'); sg.addColorStop(1, '#cc8800');
        ctx.strokeStyle = sg; ctx.lineWidth = 3.5 - i; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-r * 1.7, 0); ctx.lineTo(r * 1.7, 0); ctx.stroke();
        if (i === 0) {
            ctx.fillStyle = '#cc7700';
            ctx.fillRect(-r * 1.7 - 2, -3, 5, 6);
            ctx.fillRect(r * 1.7 - 3, -3, 5, 6);
        }
        ctx.restore();
    }
    ctx.restore();
    const bg = ctx.createRadialGradient(-r * 0.15, -r * 0.15, r * 0.1, 0, 0, r);
    bg.addColorStop(0, '#ffee99'); bg.addColorStop(0.3, '#ffcc55'); bg.addColorStop(0.7, '#cc8833'); bg.addColorStop(1, '#774411');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_NEW); ctx.fill();
    const faceG = ctx.createRadialGradient(0, r * 0.05, 0, 0, r * 0.05, r * 0.5);
    faceG.addColorStop(0, '#ffddaa'); faceG.addColorStop(0.6, '#ffcc88'); faceG.addColorStop(1, 'transparent');
    ctx.fillStyle = faceG;
    ctx.beginPath(); ctx.ellipse(0, r * 0.05, r * 0.5, r * 0.42, 0, 0, TWO_PI_NEW); ctx.fill();
    const hbG = ctx.createLinearGradient(-r * 0.5, -r * 0.4, r * 0.5, -r * 0.4);
    hbG.addColorStop(0, '#cc8800'); hbG.addColorStop(0.3, '#ffdd44'); hbG.addColorStop(0.5, '#ffee88'); hbG.addColorStop(0.7, '#ffdd44'); hbG.addColorStop(1, '#cc8800');
    ctx.strokeStyle = hbG; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, -r * 0.3, r * 0.55, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.fillStyle = '#ff3300';
    ctx.beginPath(); ctx.arc(0, -r * 0.48, r * 0.07, 0, TWO_PI_NEW); ctx.fill();
    ctx.save(); ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#ff8844';
    ctx.beginPath(); ctx.arc(0, -r * 0.48, r * 0.1, 0, TWO_PI_NEW); ctx.fill();
    ctx.restore();
    const eyeR = r * 0.11;
    for (let s = -1; s <= 1; s += 2) {
        const ex = s * r * 0.2, ey = -r * 0.02;
        ctx.save(); ctx.globalAlpha = 0.4 + Math.sin(t * 5 + s) * 0.15;
        ctx.fillStyle = '#ff4400';
        ctx.beginPath(); ctx.arc(ex, ey, eyeR * 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.restore();
        const eyeG = ctx.createRadialGradient(ex, ey, 0, ex, ey, eyeR);
        eyeG.addColorStop(0, '#ffee00'); eyeG.addColorStop(0.4, '#ff6600'); eyeG.addColorStop(1, '#cc2200');
        ctx.fillStyle = eyeG;
        ctx.beginPath(); ctx.arc(ex, ey, eyeR, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#220000';
        ctx.beginPath(); ctx.arc(ex, ey, eyeR * 0.35, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,200,0.8)';
        ctx.beginPath(); ctx.arc(ex - eyeR * 0.25, ey - eyeR * 0.25, eyeR * 0.2, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
        const cx = Math.cos(t * 1.5 + i * 1.25) * r * 0.35;
        const cy = r * 0.75 + Math.sin(t * 2 + i * 0.8) * r * 0.08;
        const cSize = r * (0.2 + Math.sin(t + i) * 0.04);
        ctx.beginPath(); ctx.arc(cx, cy, cSize, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
};
SkinRenderer.prototype._proj_wukong = function(ctx, x, y, r, angle) {
    const t = this._time;
    ctx.save(); ctx.translate(x, y);
    for (let i = 0; i < 4; i++) {
        ctx.save(); ctx.rotate(t * 15 + i * TWO_PI_NEW / 4);
        ctx.globalAlpha = 0.5 - i * 0.1;
        const g = ctx.createLinearGradient(-r * 1.3, 0, r * 1.3, 0);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ffee88'); g.addColorStop(1, '#ffcc44');
        ctx.strokeStyle = g; ctx.lineWidth = 3 - i * 0.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-r * 1.3, 0); ctx.lineTo(r * 1.3, 0); ctx.stroke();
        ctx.fillStyle = '#cc8800';
        ctx.fillRect(-r * 1.3 - 2, -2.5, 4, 5);
        ctx.fillRect(r * 1.3 - 2, -2.5, 4, 5);
        ctx.restore();
    }
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#fff';
    for (let i = 0; i < 6; i++) {
        const ca = t * 6 + i * TWO_PI_NEW / 6;
        const cd = r * 0.85;
        ctx.beginPath(); ctx.arc(Math.cos(ca) * cd, Math.sin(ca) * cd, r * 0.2, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const cg = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.4);
    cg.addColorStop(0, '#fff'); cg.addColorStop(0.2, '#ffee88'); cg.addColorStop(0.5, '#ffaa00'); cg.addColorStop(1, 'transparent');
    ctx.fillStyle = cg;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, TWO_PI_NEW); ctx.fill();
    ctx.fillStyle = '#ff6600'; ctx.globalAlpha = 0.5;
    for (let i = 0; i < 8; i++) {
        const pa = t * 11 + i * 0.78;
        const pd = r * (0.4 + Math.sin(t * 5 + i * 1.5) * 0.5);
        ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 1.5, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.restore();
    if (this.quality.glowEnabled) this._glow(ctx, x, y, r * 0.7, '#ffaa00', 0.35);
};

// ============================================
// 娣辨笂绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_voidwalker = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#8800ff', 0.25);
    ctx.save(); ctx.translate(x, y);
    // Void distortion aura (space warping)
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.15;
        for(let ring=0;ring<3;ring++){
            const rr=r*(1.2+ring*0.15)+Math.sin(t*2+ring)*r*0.05;
            ctx.strokeStyle=ring===0?'#aa44ff':ring===1?'#6600cc':'#4400aa';
            ctx.lineWidth=2-ring*0.5;
            ctx.beginPath(); ctx.arc(0,0,rr,0,TWO_PI_NEW); ctx.stroke();
        }
    }
    // Body - deep void purple with event horizon gradient
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(0,0,0,0,0,r);
    bg.addColorStop(0,'#220044'); bg.addColorStop(0.3,'#110022'); bg.addColorStop(0.6,'#080011'); bg.addColorStop(0.85,'#000005'); bg.addColorStop(1,'#000000');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Trapped starlight inside void body
    if(this.quality.detailLevel>=2){
        ctx.save(); ctx.beginPath(); ctx.arc(0,0,r*0.9,0,TWO_PI_NEW); ctx.clip();
        ctx.globalAlpha=0.6;
        for(let i=0;i<12;i++){
            const sx=(Math.sin(i*3.7+t*0.3)*0.7)*r;
            const sy=(Math.cos(i*2.3+t*0.4)*0.7)*r;
            ctx.fillStyle=i%3===0?'#ffffff':i%3===1?'#aaaaff':'#ffaaff';
            ctx.beginPath(); ctx.arc(sx,sy,0.8+Math.sin(t*5+i)*0.4,0,TWO_PI_NEW); ctx.fill();
        }
        ctx.restore();
    }
    // Accretion disk (tilted ring)
    ctx.globalAlpha=0.5; ctx.save();
    ctx.scale(1,0.35); // Perspective squish
    const diskG=ctx.createLinearGradient(-r*1.1,0,r*1.1,0);
    diskG.addColorStop(0,'#ff44ff'); diskG.addColorStop(0.3,'#aa00ff'); diskG.addColorStop(0.5,'#6600cc'); diskG.addColorStop(0.7,'#aa00ff'); diskG.addColorStop(1,'#ff44ff');
    ctx.strokeStyle=diskG; ctx.lineWidth=r*0.08;
    ctx.beginPath(); ctx.arc(0,0,r*1.1,0,Math.PI); ctx.stroke(); // Only bottom half (behind body)
    ctx.restore();
    // Front half of accretion disk
    ctx.globalAlpha=0.6; ctx.save();
    ctx.scale(1,0.35);
    ctx.strokeStyle=diskG; ctx.lineWidth=r*0.08;
    ctx.beginPath(); ctx.arc(0,0,r*1.1,Math.PI,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
    // Void eyes (two glowing singularities)
    ctx.globalAlpha=1;
    for(let side=-1;side<=1;side+=2){
        const ex=side*r*0.25, ey=-r*0.1;
        // Eye void
        ctx.fillStyle='#000000';
        ctx.beginPath(); ctx.arc(ex,ey,r*0.12,0,TWO_PI_NEW); ctx.fill();
        // Event horizon glow
        const eg=ctx.createRadialGradient(ex,ey,r*0.06,ex,ey,r*0.15);
        eg.addColorStop(0,'transparent'); eg.addColorStop(0.6,'#aa00ff'); eg.addColorStop(1,'transparent');
        ctx.fillStyle=eg; ctx.beginPath(); ctx.arc(ex,ey,r*0.15,0,TWO_PI_NEW); ctx.fill();
        // Central singularity point
        ctx.fillStyle='#ff88ff'; ctx.globalAlpha=0.8+Math.sin(t*4+side)*0.2;
        ctx.beginPath(); ctx.arc(ex,ey,r*0.03,0,TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha=1;
    }
    // Dimensional rift (mouth/crack)
    ctx.strokeStyle='#cc44ff'; ctx.lineWidth=1.5; ctx.globalAlpha=0.6;
    ctx.beginPath(); ctx.moveTo(-r*0.15,r*0.15);
    ctx.lineTo(-r*0.05,r*0.18); ctx.lineTo(r*0.05,r*0.15); ctx.lineTo(r*0.15,r*0.18); ctx.stroke();
    // Void energy tendrils (reaching outward)
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.3; ctx.strokeStyle='#bb66ff'; ctx.lineWidth=1.5; ctx.lineCap='round';
        for(let i=0;i<4;i++){
            const ta=t*0.7+i*TWO_PI_NEW/4;
            const tlen=r*1.4+Math.sin(t*2+i)*r*0.2;
            ctx.beginPath(); ctx.moveTo(Math.cos(ta)*r*0.6,Math.sin(ta)*r*0.6);
            ctx.quadraticCurveTo(
                Math.cos(ta+0.3)*r,Math.sin(ta+0.3)*r,
                Math.cos(ta)*tlen,Math.sin(ta)*tlen
            ); ctx.stroke();
        }
    }
    // Gravitational lensing effect (edge distortion arcs)
    ctx.globalAlpha=0.2; ctx.strokeStyle='#ffffff'; ctx.lineWidth=0.8;
    for(let i=0;i<3;i++){
        const la=t*0.3+i*2.1;
        ctx.beginPath(); ctx.arc(0,0,r*0.95,la,la+0.6); ctx.stroke();
    }
    ctx.restore();
};;
SkinRenderer.prototype._proj_voidwalker = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y);
        const vg=ctx.createRadialGradient(0,0,0,0,0,r); vg.addColorStop(0,'#000'); vg.addColorStop(0.5,'#220044'); vg.addColorStop(1,'#8844ff');
    ctx.fillStyle=vg; ctx.beginPath(); ctx.arc(0,0,r*0.8,0,TWO_PI_NEW); ctx.fill();
    ctx.strokeStyle='#aa66ff'; ctx.lineWidth=1; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#8844ff',0.3);
};

SkinRenderer.prototype._body_bloodmoon = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#cc0000', 0.25);
    ctx.save(); ctx.translate(x, y);
    // Blood mist aura
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.15;
        for(let i=0;i<4;i++){
            const ma=t*0.5+i*1.57;
            const md=r*1.2+Math.sin(t*1.5+i)*r*0.15;
            const mg=ctx.createRadialGradient(Math.cos(ma)*r*0.3,Math.sin(ma)*r*0.3,0,0,0,md);
            mg.addColorStop(0,'#ff0000'); mg.addColorStop(0.5,'#880000'); mg.addColorStop(1,'transparent');
            ctx.fillStyle=mg; ctx.beginPath(); ctx.arc(0,0,md,0,TWO_PI_NEW); ctx.fill();
        }
    }
    // Moon body - dark crimson sphere with crater texture
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(-r*0.25,-r*0.2,0,0,0,r);
    bg.addColorStop(0,'#cc3333'); bg.addColorStop(0.3,'#991111'); bg.addColorStop(0.6,'#660000'); bg.addColorStop(1,'#330000');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Lunar craters (dark circles with rim highlights)
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.beginPath(); ctx.arc(0,0,r*0.95,0,TWO_PI_NEW); ctx.clip();
        const craters=[{x:-0.3,y:-0.2,s:0.2},{x:0.4,y:0.1,s:0.15},{x:-0.1,y:0.4,s:0.12},{x:0.2,y:-0.4,s:0.1},{x:0.5,y:-0.2,s:0.08}];
        for(const c of craters){
            const cx=c.x*r, cy=c.y*r, cs=c.s*r;
            // Crater shadow
            ctx.fillStyle='rgba(0,0,0,0.3)';
            ctx.beginPath(); ctx.arc(cx,cy,cs,0,TWO_PI_NEW); ctx.fill();
            // Crater rim highlight
            ctx.strokeStyle='rgba(200,80,80,0.4)'; ctx.lineWidth=1;
            ctx.beginPath(); ctx.arc(cx,cy,cs,-0.8,0.8); ctx.stroke();
        }
        ctx.restore();
    }
    // Blood drip veins (surface blood channels)
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.3; ctx.strokeStyle='#ff2222'; ctx.lineWidth=1.2; ctx.lineCap='round';
        for(let i=0;i<5;i++){
            const va=i*1.2+0.5;
            ctx.beginPath(); ctx.moveTo(Math.cos(va)*r*0.2,Math.sin(va)*r*0.2);
            ctx.quadraticCurveTo(
                Math.cos(va+0.3)*r*0.5,Math.sin(va+0.3)*r*0.5,
                Math.cos(va+0.1)*r*0.85,Math.sin(va+0.1)*r*0.85
            ); ctx.stroke();
        }
    }
    // Eclipsed edge (dark limb)
    ctx.globalAlpha=0.6;
    const limbG=ctx.createRadialGradient(r*0.3,r*0.2,r*0.3,0,0,r);
    limbG.addColorStop(0,'transparent'); limbG.addColorStop(0.7,'transparent'); limbG.addColorStop(1,'rgba(0,0,0,0.6)');
    ctx.fillStyle=limbG; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Central eye (eldritch moon eye)
    ctx.globalAlpha=1;
    // Eyelid top/bottom (dark red)
    ctx.fillStyle='#440000';
    ctx.beginPath(); ctx.ellipse(0,0,r*0.4,r*0.25,0,Math.PI,TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0,0,r*0.4,r*0.25,0,0,Math.PI); ctx.fill();
    // Sclera (bloodshot)
    ctx.fillStyle='#ffcccc';
    ctx.beginPath(); ctx.ellipse(0,0,r*0.35,r*0.2,0,0,TWO_PI_NEW); ctx.fill();
    // Bloodshot veins in sclera
    ctx.strokeStyle='#cc0000'; ctx.lineWidth=0.6; ctx.globalAlpha=0.5;
    for(let i=0;i<6;i++){
        const va=(i/6)*TWO_PI_NEW;
        ctx.beginPath(); ctx.moveTo(Math.cos(va)*r*0.1,Math.sin(va)*r*0.06);
        ctx.lineTo(Math.cos(va)*r*0.32,Math.sin(va)*r*0.18); ctx.stroke();
    }
    ctx.globalAlpha=1;
    // Iris (deep blood red)
    const ig=ctx.createRadialGradient(0,0,0,0,0,r*0.15);
    ig.addColorStop(0,'#ffaa00'); ig.addColorStop(0.4,'#ff4400'); ig.addColorStop(0.8,'#990000'); ig.addColorStop(1,'#440000');
    ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(0,0,r*0.15,0,TWO_PI_NEW); ctx.fill();
    // Pupil (irregular, pulsing)
    ctx.fillStyle='#000';
    const pupilR=r*0.06+Math.sin(t*3)*r*0.01;
    ctx.beginPath(); ctx.arc(0,0,pupilR,0,TWO_PI_NEW); ctx.fill();
    // Eye highlight
    ctx.fillStyle='rgba(255,200,200,0.8)';
    ctx.beginPath(); ctx.arc(-r*0.05,-r*0.05,r*0.03,0,TWO_PI_NEW); ctx.fill();
    // Corona glow (red/orange outer ring)
    ctx.globalAlpha=0.4; ctx.strokeStyle='#ff4400'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.stroke();
    // Solar flares (small eruptions)
    if(this.quality.detailLevel>=2){
        ctx.globalAlpha=0.3;
        for(let i=0;i<3;i++){
            const fa=t*0.8+i*2.1;
            const fx=Math.cos(fa)*r, fy=Math.sin(fa)*r;
            const flen=r*0.2+Math.sin(t*3+i)*r*0.1;
            ctx.strokeStyle='#ff6600'; ctx.lineWidth=2; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(fx,fy);
            ctx.lineTo(fx+Math.cos(fa)*flen,fy+Math.sin(fa)*flen); ctx.stroke();
        }
    }
    ctx.restore();
};;
SkinRenderer.prototype._proj_bloodmoon = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
        ctx.fillStyle='#cc0000'; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(r*1.2,0); ctx.quadraticCurveTo(r*0.5,-r*0.4,0,-r*0.1); ctx.lineTo(-r*0.5,0); ctx.lineTo(0,r*0.1); ctx.quadraticCurveTo(r*0.5,r*0.4,r*1.2,0); ctx.fill();
    ctx.fillStyle='#ff4444'; ctx.globalAlpha=0.4; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#ff0000',0.3);
};

SkinRenderer.prototype._body_chaoseye = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ff00ff', 0.3);
    ctx.save(); ctx.translate(x, y);
    // Chaos tentacles (writhing appendages)
    if(this.quality.detailLevel>=1){
        ctx.globalAlpha=0.5;
        for(let i=0;i<8;i++){
            const ta=t*0.6+i*TWO_PI_NEW/8;
            const tlen=r*1.5+Math.sin(t*2+i*0.9)*r*0.3;
            const midA=ta+Math.sin(t*1.5+i*0.7)*0.6;
            const midD=r*0.8;
            ctx.strokeStyle=['#ff00ff','#ff4488','#aa00ff','#ff8800'][i%4];
            ctx.lineWidth=3-i*0.2; ctx.lineCap='round';
            ctx.beginPath(); ctx.moveTo(Math.cos(ta)*r*0.6,Math.sin(ta)*r*0.6);
            ctx.quadraticCurveTo(
                Math.cos(midA)*midD,Math.sin(midA)*midD,
                Math.cos(ta)*tlen,Math.sin(ta)*tlen
            ); ctx.stroke();
            // Sucker dots on tentacles
            if(this.quality.detailLevel>=2){
                ctx.fillStyle='rgba(255,0,200,0.4)';
                for(let s=0;s<3;s++){
                    const sf=(s+1)/4;
                    const sx=Math.cos(ta)*r*0.6*(1-sf)+Math.cos(ta)*tlen*sf;
                    const sy=Math.sin(ta)*r*0.6*(1-sf)+Math.sin(ta)*tlen*sf;
                    ctx.beginPath(); ctx.arc(sx,sy,1.5,0,TWO_PI_NEW); ctx.fill();
                }
            }
        }
    }
    // Main body - organic chaos mass
    ctx.globalAlpha=1;
    const bg=ctx.createRadialGradient(0,0,0,0,0,r);
    bg.addColorStop(0,'#440044'); bg.addColorStop(0.3,'#330033'); bg.addColorStop(0.6,'#220022'); bg.addColorStop(1,'#110011');
    ctx.fillStyle=bg; ctx.beginPath(); ctx.arc(0,0,r,0,TWO_PI_NEW); ctx.fill();
    // Organic texture (bumpy surface)
    if(this.quality.detailLevel>=2){
        ctx.save(); ctx.beginPath(); ctx.arc(0,0,r*0.95,0,TWO_PI_NEW); ctx.clip();
        ctx.globalAlpha=0.15;
        for(let i=0;i<15;i++){
            const bx=Math.sin(i*2.7)*r*0.6;
            const by=Math.cos(i*3.1)*r*0.6;
            const br=r*0.1+Math.sin(i*1.3)*r*0.05;
            ctx.fillStyle=i%2?'#550055':'#330033';
            ctx.beginPath(); ctx.arc(bx,by,br,0,TWO_PI_NEW); ctx.fill();
        }
        ctx.restore();
    }
    // THE EYE - massive central all-seeing eye
    ctx.globalAlpha=1;
    // Eye opening (vertical almond shape)
    ctx.fillStyle='#000';
    ctx.beginPath();
    ctx.moveTo(-r*0.6,0); 
    ctx.quadraticCurveTo(0,-r*0.5,r*0.6,0);
    ctx.quadraticCurveTo(0,r*0.5,-r*0.6,0);
    ctx.fill();
    // Sclera (sickly yellow-green)
    ctx.fillStyle='#cccc44';
    ctx.beginPath();
    ctx.moveTo(-r*0.55,0);
    ctx.quadraticCurveTo(0,-r*0.4,r*0.55,0);
    ctx.quadraticCurveTo(0,r*0.4,-r*0.55,0);
    ctx.fill();
    // Iris - multi-ring chaos colors
    const irisR=r*0.28;
    const ig=ctx.createRadialGradient(0,0,0,0,0,irisR);
    ig.addColorStop(0,'#ff00ff'); ig.addColorStop(0.3,'#ff4400'); ig.addColorStop(0.5,'#aa00ff'); ig.addColorStop(0.7,'#6600aa'); ig.addColorStop(1,'#220044');
    ctx.fillStyle=ig; ctx.beginPath(); ctx.arc(0,0,irisR,0,TWO_PI_NEW); ctx.fill();
    // Iris detail rings
    ctx.strokeStyle='#ff88ff'; ctx.lineWidth=0.5; ctx.globalAlpha=0.3;
    ctx.beginPath(); ctx.arc(0,0,irisR*0.6,0,TWO_PI_NEW); ctx.stroke();
    ctx.beginPath(); ctx.arc(0,0,irisR*0.8,0,TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha=1;
    // Iris radial streaks
    if(this.quality.detailLevel>=1){
        ctx.save(); ctx.beginPath(); ctx.arc(0,0,irisR,0,TWO_PI_NEW); ctx.clip();
        ctx.globalAlpha=0.2; ctx.strokeStyle='#ff44ff'; ctx.lineWidth=1;
        for(let i=0;i<12;i++){
            const sa=(i/12)*TWO_PI_NEW+t*0.2;
            ctx.beginPath(); ctx.moveTo(0,0);
            ctx.lineTo(Math.cos(sa)*irisR,Math.sin(sa)*irisR); ctx.stroke();
        }
        ctx.restore();
    }
    // Pupil (irregular, shifting shape)
    ctx.fillStyle='#000';
    ctx.beginPath();
    const pupilR=r*0.1;
    for(let i=0;i<8;i++){
        const pa=(i/8)*TWO_PI_NEW;
        const pr=pupilR*(1+Math.sin(t*4+i*1.3)*0.2);
        const px=Math.cos(pa)*pr, py=Math.sin(pa)*pr;
        i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
    }
    ctx.closePath(); ctx.fill();
    // Pupil inner glow
    ctx.fillStyle='#ff00ff'; ctx.globalAlpha=0.3+Math.sin(t*5)*0.2;
    ctx.beginPath(); ctx.arc(0,0,r*0.04,0,TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha=1;
    // Eye highlight
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(-r*0.12,-r*0.12,r*0.05,0,TWO_PI_NEW); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.beginPath(); ctx.arc(r*0.08,r*0.08,r*0.025,0,TWO_PI_NEW); ctx.fill();
    // Eyelid veins
    ctx.strokeStyle='#990066'; ctx.lineWidth=0.8; ctx.globalAlpha=0.4;
    for(let i=0;i<4;i++){
        const side=i<2?-1:1;
        const vx=(i%2)*r*0.2*side;
        ctx.beginPath();
        ctx.moveTo(side*r*0.5,Math.sin(i)*r*0.1);
        ctx.quadraticCurveTo(vx,side*r*0.35*((i%2)?-1:1),0,(i%2?-1:1)*r*0.4);
        ctx.stroke();
    }
    // Chaos energy outer ring
    ctx.globalAlpha=0.5; ctx.lineWidth=2;
    const cg=ctx.createConicGradient(t*2,0,0);
    cg.addColorStop(0,'#ff00ff'); cg.addColorStop(0.25,'#ff4400'); cg.addColorStop(0.5,'#ffff00'); cg.addColorStop(0.75,'#00ff88'); cg.addColorStop(1,'#ff00ff');
    ctx.strokeStyle=cg;
    ctx.beginPath(); ctx.arc(0,0,r*1.05,0,TWO_PI_NEW); ctx.stroke();
    ctx.restore();
};;
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

