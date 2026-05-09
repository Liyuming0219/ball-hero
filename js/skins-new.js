// ============================================
// 鏂扮毊鑲ゆ墿灞曞寘 - 12娆惧叏鏂扮毊鑲ゆ覆鏌撳櫒涓庣壒鏁?// 閫氳繃鍘熷瀷鎵╁睍 SkinRenderer 鍜?SkinFxSystem
// ============================================

const TWO_PI_NEW = Math.PI * 2;

// ============================================
// 鏈烘绾厓绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_cyberpunk = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#00ffff', 0.18);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形轮廓：六边形+切角的机甲外壳 ===
    const mechPath = () => {
        ctx.beginPath();
        // 上方平头（头盔）
        ctx.moveTo(-r * 0.5, -r * 0.9);
        ctx.lineTo(r * 0.5, -r * 0.9);
        // 右上斜切
        ctx.lineTo(r * 0.85, -r * 0.5);
        // 右侧肩甲突出
        ctx.lineTo(r * 1.0, -r * 0.2);
        ctx.lineTo(r * 0.9, r * 0.3);
        // 右下收窄
        ctx.lineTo(r * 0.6, r * 0.85);
        // 底部
        ctx.lineTo(-r * 0.6, r * 0.85);
        // 左下
        ctx.lineTo(-r * 0.9, r * 0.3);
        ctx.lineTo(-r * 1.0, -r * 0.2);
        // 左上
        ctx.lineTo(-r * 0.85, -r * 0.5);
        ctx.closePath();
    };
    // 主装甲 - 深灰金属底色+拉丝纹理
    ctx.save(); mechPath(); ctx.clip();
    const armorG = ctx.createLinearGradient(-r, -r, r * 0.5, r);
    armorG.addColorStop(0, '#3a3a4a'); armorG.addColorStop(0.3, '#2a2a35');
    armorG.addColorStop(0.6, '#1a1a25'); armorG.addColorStop(1, '#0a0a15');
    ctx.fillStyle = armorG; ctx.fillRect(-r * 1.1, -r * 1.0, r * 2.2, r * 2.0);
    // 拉丝金属纹理
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.06; ctx.strokeStyle = '#aaaacc'; ctx.lineWidth = 0.4;
        for (let i = 0; i < 20; i++) {
            const ly = -r + i * r * 0.1;
            ctx.beginPath(); ctx.moveTo(-r, ly); ctx.lineTo(r, ly + r * 0.02); ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 外壳描边
    ctx.strokeStyle = '#00ccff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
    mechPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 装甲板分割线（panel lines）===
    ctx.strokeStyle = 'rgba(0,200,255,0.3)'; ctx.lineWidth = 0.8;
    // 横向分割
    ctx.beginPath(); ctx.moveTo(-r * 0.8, -r * 0.1); ctx.lineTo(r * 0.8, -r * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-r * 0.7, r * 0.4); ctx.lineTo(r * 0.7, r * 0.4); ctx.stroke();
    // 中线
    ctx.beginPath(); ctx.moveTo(0, -r * 0.85); ctx.lineTo(0, r * 0.8); ctx.stroke();
    // === 赛博眼/面甲：T形面罩 ===
    // 面罩底板
    ctx.fillStyle = '#0a0a12';
    ctx.beginPath();
    ctx.moveTo(-r * 0.55, -r * 0.55); ctx.lineTo(r * 0.55, -r * 0.55);
    ctx.lineTo(r * 0.45, -r * 0.2); ctx.lineTo(-r * 0.45, -r * 0.2); ctx.closePath(); ctx.fill();
    // 横条LED眼（赛博朋克标志性）
    const eyeY = -r * 0.4;
    const ledG = ctx.createLinearGradient(-r * 0.45, eyeY, r * 0.45, eyeY);
    ledG.addColorStop(0, '#ff0066'); ledG.addColorStop(0.3, '#ff00ff');
    ledG.addColorStop(0.5, '#ffffff'); ledG.addColorStop(0.7, '#00ffff');
    ledG.addColorStop(1, '#0088ff');
    ctx.fillStyle = ledG;
    ctx.fillRect(-r * 0.42, eyeY - r * 0.06, r * 0.84, r * 0.12);
    // LED条纹扫描动画
    ctx.save(); ctx.globalAlpha = 0.6;
    const scanX = (Math.sin(t * 4) * 0.5 + 0.5) * r * 0.84 - r * 0.42;
    const scanG = ctx.createRadialGradient(scanX, eyeY, 0, scanX, eyeY, r * 0.15);
    scanG.addColorStop(0, '#ffffff'); scanG.addColorStop(1, 'transparent');
    ctx.fillStyle = scanG;
    ctx.fillRect(-r * 0.42, eyeY - r * 0.06, r * 0.84, r * 0.12);
    ctx.restore();
    // 面罩边框
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1;
    ctx.strokeRect(-r * 0.44, eyeY - r * 0.07, r * 0.88, r * 0.14);
    // === PCB电路板纹路（覆盖在装甲表面）===
    if (this.quality.detailLevel >= 1) {
        ctx.save(); mechPath(); ctx.clip();
        ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.25;
        // 主总线
        const buses = [
            [[-r*0.6, r*0.1], [-r*0.3, r*0.1], [-r*0.3, r*0.4], [0, r*0.4], [0, r*0.7]],
            [[r*0.6, r*0.15], [r*0.3, r*0.15], [r*0.3, r*0.5], [r*0.1, r*0.5]],
            [[-r*0.4, -r*0.65], [-r*0.4, -r*0.3], [-r*0.2, -r*0.3]],
            [[r*0.3, -r*0.7], [r*0.3, -r*0.4], [r*0.5, -r*0.4], [r*0.5, 0]]
        ];
        for (const bus of buses) {
            ctx.beginPath();
            for (let i = 0; i < bus.length; i++) {
                i === 0 ? ctx.moveTo(bus[i][0], bus[i][1]) : ctx.lineTo(bus[i][0], bus[i][1]);
            }
            ctx.stroke();
            // 端点节点
            if (this.quality.detailLevel >= 2) {
                for (const [nx, ny] of bus) {
                    ctx.fillStyle = '#00ff88';
                    ctx.fillRect(nx - 1.5, ny - 1.5, 3, 3);
                }
            }
        }
        ctx.restore();
    }
    // === 肩甲装饰 ===
    for (let side = -1; side <= 1; side += 2) {
        ctx.save();
        // 肩甲块
        const sx = side * r * 0.75, sy = -r * 0.3;
        ctx.fillStyle = '#2a3040';
        ctx.beginPath();
        ctx.moveTo(sx, sy - r * 0.15); ctx.lineTo(sx + side * r * 0.25, sy);
        ctx.lineTo(sx + side * r * 0.2, sy + r * 0.2); ctx.lineTo(sx - side * r * 0.05, sy + r * 0.15);
        ctx.closePath(); ctx.fill();
        // 肩甲霓虹条
        ctx.strokeStyle = '#ff0066'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
        ctx.beginPath(); ctx.moveTo(sx, sy - r * 0.1);
        ctx.lineTo(sx + side * r * 0.2, sy + r * 0.05); ctx.stroke();
        ctx.restore();
    }
    // === 胸部反应堆/核心 ===
    const coreY = r * 0.15;
    // 核心外框（六角形）
    ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TWO_PI_NEW + Math.PI / 6;
        const hx = Math.cos(a) * r * 0.15, hy = coreY + Math.sin(a) * r * 0.15;
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
    }
    ctx.closePath(); ctx.stroke();
    // 核心发光
    ctx.globalAlpha = 0.8 + Math.sin(t * 5) * 0.2;
    const coreG = ctx.createRadialGradient(0, coreY, 0, 0, coreY, r * 0.12);
    coreG.addColorStop(0, '#ffffff'); coreG.addColorStop(0.4, '#00ffff');
    coreG.addColorStop(0.8, '#0066ff'); coreG.addColorStop(1, 'transparent');
    ctx.fillStyle = coreG;
    ctx.beginPath(); ctx.arc(0, coreY, r * 0.12, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 头部天线 ===
    ctx.strokeStyle = '#667788'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(r * 0.3, -r * 0.9);
    ctx.lineTo(r * 0.35, -r * 1.2); ctx.stroke();
    // 天线顶端LED
    ctx.fillStyle = t % 1.5 < 0.75 ? '#ff0044' : '#ff4488'; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(r * 0.35, -r * 1.2, 2, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 数据流粒子 ===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 6; i++) {
            const py = ((t * 60 + i * 30) % (r * 2)) - r;
            const px = (i < 3 ? -1 : 1) * r * (0.5 + (i % 3) * 0.15);
            ctx.fillStyle = i % 2 ? '#00ffff' : '#ff00ff';
            ctx.fillRect(px - 1, py - 1, 2, 2);
        }
    }
    // === 全息投影环 ===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.2; ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 0.8;
        ctx.setLineDash([r * 0.05, r * 0.03]); ctx.lineDashOffset = -t * 40;
        ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 1.1, r * 0.3, 0, 0, TWO_PI_NEW); ctx.stroke();
        ctx.setLineDash([]);
    }
    ctx.restore();
};;
SkinRenderer.prototype._proj_cyberpunk = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.fillStyle = '#00ffcc'; ctx.fillRect(-r*1.2,-r*0.15,r*2.4,r*0.3);
    ctx.globalAlpha = 0.5; ctx.fillStyle = '#ff00ff'; ctx.fillRect(-r*0.8,-r*0.3,r*1.6,r*0.6);
    ctx.restore(); if (this.quality.glowEnabled) this._glow(ctx, x, y, r*0.4, '#00ffcc', 0.3);
};

SkinRenderer.prototype._body_steambot = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#cc8844', 0.1);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形轮廓：圆顶方身的蒸汽机器人 ===
    // 身体（带铆钉的金属桶形）
    const bodyPath = () => {
        ctx.beginPath();
        // 半圆形顶部（头盔）
        ctx.arc(0, -r * 0.2, r * 0.7, Math.PI, 0);
        // 方形身体右侧
        ctx.lineTo(r * 0.75, r * 0.7);
        // 底部（略圆）
        ctx.quadraticCurveTo(r * 0.6, r * 0.9, 0, r * 0.9);
        ctx.quadraticCurveTo(-r * 0.6, r * 0.9, -r * 0.75, r * 0.7);
        // 左侧
        ctx.lineTo(-r * 0.7, -r * 0.2);
        ctx.closePath();
    };
    // 黄铜金属体 - 温暖金属质感多层渐变
    ctx.save(); bodyPath(); ctx.clip();
    const brassG = ctx.createLinearGradient(-r, -r, r * 0.8, r);
    brassG.addColorStop(0, '#ddaa55'); brassG.addColorStop(0.25, '#cc8833');
    brassG.addColorStop(0.5, '#aa6622'); brassG.addColorStop(0.75, '#cc8833');
    brassG.addColorStop(1, '#eebb66');
    ctx.fillStyle = brassG; ctx.fillRect(-r, -r, r * 2, r * 2);
    // 金属拉丝纹理（水平弧线）
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.06; ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5;
        for (let i = 0; i < 15; i++) {
            const ly = -r * 0.8 + i * r * 0.12;
            ctx.beginPath(); ctx.moveTo(-r, ly);
            ctx.quadraticCurveTo(0, ly + r * 0.01, r, ly); ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 外壳描边
    ctx.strokeStyle = '#885522'; ctx.lineWidth = 2;
    bodyPath(); ctx.stroke();
    // === 铆钉环（两排）===
    if (this.quality.detailLevel >= 1) {
        const rivetRows = [[-r * 0.1], [r * 0.5]];
        for (const [ry] of rivetRows) {
            for (let i = 0; i < 8; i++) {
                const ra = Math.PI + (i / 8) * Math.PI;
                const rx = Math.cos(ra) * r * 0.65;
                const riy = ry + Math.sin(ra) * r * 0.03;
                if (Math.abs(rx) > r * 0.7) continue;
                // 铆钉阴影
                ctx.fillStyle = '#553311';
                ctx.beginPath(); ctx.arc(rx + 0.5, riy + 0.5, r * 0.035, 0, TWO_PI_NEW); ctx.fill();
                // 铆钉体
                const rivG = ctx.createRadialGradient(rx - 1, riy - 1, 0, rx, riy, r * 0.035);
                rivG.addColorStop(0, '#ffdd88'); rivG.addColorStop(0.5, '#cc9944'); rivG.addColorStop(1, '#886633');
                ctx.fillStyle = rivG;
                ctx.beginPath(); ctx.arc(rx, riy, r * 0.035, 0, TWO_PI_NEW); ctx.fill();
            }
        }
    }
    // === 烟囱（头顶铜管）===
    const chimneyX = r * 0.15;
    // 管身
    const pipeG = ctx.createLinearGradient(chimneyX - r * 0.1, 0, chimneyX + r * 0.1, 0);
    pipeG.addColorStop(0, '#885533'); pipeG.addColorStop(0.3, '#aa7744');
    pipeG.addColorStop(0.7, '#775522'); pipeG.addColorStop(1, '#664411');
    ctx.fillStyle = pipeG;
    ctx.fillRect(chimneyX - r * 0.08, -r * 1.2, r * 0.16, r * 0.4);
    // 管口法兰
    ctx.fillStyle = '#996633';
    ctx.fillRect(chimneyX - r * 0.11, -r * 1.22, r * 0.22, r * 0.06);
    ctx.fillRect(chimneyX - r * 0.1, -r * 0.83, r * 0.2, r * 0.05);
    // 蒸汽喷出
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.25;
        for (let i = 0; i < 4; i++) {
            const steamY = -r * 1.25 - i * r * 0.18 - ((t * 50 + i * 25) % 80) / 80 * r * 0.4;
            const steamX = chimneyX + Math.sin(t * 2 + i * 1.5) * r * 0.08;
            const steamR = r * 0.06 + i * r * 0.03 + ((t * 50 + i * 25) % 80) / 80 * r * 0.04;
            ctx.fillStyle = `rgba(220,220,220,${0.35 - i * 0.07})`;
            ctx.beginPath(); ctx.arc(steamX, steamY, steamR, 0, TWO_PI_NEW); ctx.fill();
            ctx.beginPath(); ctx.arc(steamX + steamR * 0.5, steamY - steamR * 0.3, steamR * 0.6, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 护目镜眼睛（圆形黄铜框+蓝绿色镜片）===
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.28, ey = -r * 0.3;
        // 镜框外环（厚重黄铜）
        ctx.lineWidth = 3;
        const frameG = ctx.createLinearGradient(ex - r * 0.15, ey - r * 0.15, ex + r * 0.15, ey + r * 0.15);
        frameG.addColorStop(0, '#ddaa44'); frameG.addColorStop(0.5, '#886633'); frameG.addColorStop(1, '#ddaa44');
        ctx.strokeStyle = frameG;
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.18, 0, TWO_PI_NEW); ctx.stroke();
        // 镜片（凹面玻璃渐变）
        const lensG = ctx.createRadialGradient(ex - r * 0.05, ey - r * 0.05, 0, ex, ey, r * 0.15);
        lensG.addColorStop(0, '#ccffee'); lensG.addColorStop(0.4, '#66bbaa');
        lensG.addColorStop(0.8, '#336655'); lensG.addColorStop(1, '#224444');
        ctx.fillStyle = lensG;
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.15, 0, TWO_PI_NEW); ctx.fill();
        // 镜片反光
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath(); ctx.ellipse(ex - r * 0.05, ey - r * 0.05, r * 0.04, r * 0.025, -0.5, 0, TWO_PI_NEW); ctx.fill();
        // 内部瞳孔发光
        ctx.globalAlpha = 0.6 + Math.sin(t * 3 + side) * 0.2;
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.04, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 铆钉固定点
        if (this.quality.detailLevel >= 2) {
            for (let rv = 0; rv < 4; rv++) {
                const rva = (rv / 4) * TWO_PI_NEW + 0.4;
                const rvx = ex + Math.cos(rva) * r * 0.17;
                const rvy = ey + Math.sin(rva) * r * 0.17;
                ctx.fillStyle = '#aa8844';
                ctx.beginPath(); ctx.arc(rvx, rvy, 1.5, 0, TWO_PI_NEW); ctx.fill();
            }
        }
    }
    // 护目镜鼻梁连接
    ctx.strokeStyle = '#886633'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-r * 0.1, -r * 0.3);
    ctx.lineTo(r * 0.1, -r * 0.3); ctx.stroke();
    // === 齿轮装饰（侧面）===
    if (this.quality.detailLevel >= 2) {
        for (let gi = 0; gi < 2; gi++) {
            const gx = (gi === 0 ? -1 : 1) * r * 0.55;
            const gy = r * 0.35;
            const gr = r * 0.13;
            // 齿轮主圈
            ctx.strokeStyle = '#aa7733'; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.arc(gx, gy, gr, 0, TWO_PI_NEW); ctx.stroke();
            // 齿
            for (let gt = 0; gt < 10; gt++) {
                const ga = (gt / 10) * TWO_PI_NEW + t * (gi === 0 ? 2 : -2);
                ctx.beginPath();
                ctx.moveTo(gx + Math.cos(ga) * gr, gy + Math.sin(ga) * gr);
                ctx.lineTo(gx + Math.cos(ga) * (gr + r * 0.03), gy + Math.sin(ga) * (gr + r * 0.03));
                ctx.stroke();
            }
            // 齿轮中心轴
            ctx.fillStyle = '#664422'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(gx, gy, r * 0.03, 0, TWO_PI_NEW); ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    // === 压力表（小圆仪表）===
    if (this.quality.detailLevel >= 1) {
        const gaugeX = r * 0.05, gaugeY = r * 0.4;
        // 表盘
        ctx.fillStyle = '#ffffee';
        ctx.beginPath(); ctx.arc(gaugeX, gaugeY, r * 0.09, 0, TWO_PI_NEW); ctx.fill();
        ctx.strokeStyle = '#886633'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(gaugeX, gaugeY, r * 0.09, 0, TWO_PI_NEW); ctx.stroke();
        // 刻度
        ctx.strokeStyle = '#333'; ctx.lineWidth = 0.5;
        for (let mk = 0; mk < 8; mk++) {
            const ma = (mk / 8) * TWO_PI_NEW;
            ctx.beginPath();
            ctx.moveTo(gaugeX + Math.cos(ma) * r * 0.065, gaugeY + Math.sin(ma) * r * 0.065);
            ctx.lineTo(gaugeX + Math.cos(ma) * r * 0.08, gaugeY + Math.sin(ma) * r * 0.08);
            ctx.stroke();
        }
        // 指针（动态）
        const needleA = -Math.PI * 0.7 + Math.sin(t * 1.5) * Math.PI * 0.5;
        ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(gaugeX, gaugeY);
        ctx.lineTo(gaugeX + Math.cos(needleA) * r * 0.06, gaugeY + Math.sin(needleA) * r * 0.06); ctx.stroke();
        // 中心点
        ctx.fillStyle = '#333';
        ctx.beginPath(); ctx.arc(gaugeX, gaugeY, 1.5, 0, TWO_PI_NEW); ctx.fill();
    }
    // === 胸部装甲板缝 ===
    ctx.strokeStyle = 'rgba(80,50,20,0.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-r * 0.5, r * 0.1); ctx.lineTo(r * 0.5, r * 0.1); ctx.stroke();
    
    // Enhanced: More steam puffs and glowing rivets
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 4; i++) {
        const sa = t * 2 + i * 1.57;
        const sx = Math.cos(sa) * r * 0.3;
        const sy = -r * 0.8 - Math.sin(t*3+i) * r * 0.15 - ((t*20+i*10)%30)/30 * r * 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(sx, sy, r*0.06 + Math.sin(t*2+i)*r*0.02, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Glowing pressure indicator
    ctx.fillStyle = (Math.sin(t*2) > 0.5) ? '#ff4400' : '#44ff00';
    ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.arc(r*0.4, -r*0.3, r*0.05, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
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
    // === 非圆形：流体金属形态（变形中的液态金属球）===
    // 外形在圆形基础上有液态金属的流动凸起
    const blobPath = () => {
        ctx.beginPath();
        const segs = 32;
        for (let i = 0; i <= segs; i++) {
            const a = (i / segs) * TWO_PI_NEW;
            // 液态金属表面张力波动
            const wave1 = Math.sin(a * 3 + t * 4) * r * 0.06;
            const wave2 = Math.sin(a * 5 + t * 6) * r * 0.03;
            const wave3 = Math.sin(a * 2 + t * 2.5) * r * 0.04;
            const pr = r + wave1 + wave2 + wave3;
            const px = Math.cos(a) * pr, py = Math.sin(a) * pr;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
    };
    // 液态金属底色 — 银色金属+环境反射
    ctx.save(); blobPath(); ctx.clip();
    // 环境映射模拟（用多层渐变）
    const metalG = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, r * 0.1, r * 0.1, r * 1.1);
    metalG.addColorStop(0, '#eeffff'); metalG.addColorStop(0.2, '#88ddcc');
    metalG.addColorStop(0.4, '#44aa99'); metalG.addColorStop(0.6, '#227766');
    metalG.addColorStop(0.8, '#115544'); metalG.addColorStop(1, '#0a3333');
    ctx.fillStyle = metalG; ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
    // 环境反射带（侧面亮条，模拟金属球的环境映射）
    ctx.globalAlpha = 0.2;
    const reflG = ctx.createLinearGradient(-r, 0, r, 0);
    reflG.addColorStop(0, 'transparent'); reflG.addColorStop(0.3, '#aaffee');
    reflG.addColorStop(0.5, 'transparent'); reflG.addColorStop(0.7, '#88ffdd');
    reflG.addColorStop(1, 'transparent');
    ctx.fillStyle = reflG; ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.globalAlpha = 1;
    // 六角纳米网格结构（覆盖在金属表面）
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.12; ctx.strokeStyle = '#00ffbb'; ctx.lineWidth = 0.5;
        const hexR = r * 0.1;
        const hexH = hexR * Math.sqrt(3);
        for (let row = -5; row <= 5; row++) {
            for (let col = -5; col <= 5; col++) {
                const hx = col * hexR * 1.5;
                const hy = row * hexH + (col % 2) * hexH * 0.5;
                if (hx * hx + hy * hy > r * r * 0.9) continue;
                ctx.beginPath();
                for (let v = 0; v < 6; v++) {
                    const va = (v / 6) * TWO_PI_NEW - Math.PI / 6;
                    const vx = hx + Math.cos(va) * hexR * 0.45;
                    const vy = hy + Math.sin(va) * hexR * 0.45;
                    v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
                }
                ctx.closePath(); ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 外轮廓（发光边缘）
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    blobPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 核心反应堆（中心发光球）===
    const coreR = r * 0.25;
    // 核心外壳（六角框架）
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TWO_PI_NEW + t * 0.5;
        const hx = Math.cos(a) * coreR, hy = Math.sin(a) * coreR;
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
    }
    ctx.closePath(); ctx.stroke();
    // 核心发光
    ctx.globalAlpha = 0.9;
    const cG = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
    cG.addColorStop(0, '#ffffff'); cG.addColorStop(0.3, '#88ffee');
    cG.addColorStop(0.6, '#00cc88'); cG.addColorStop(1, 'transparent');
    ctx.fillStyle = cG;
    ctx.beginPath(); ctx.arc(0, 0, coreR, 0, TWO_PI_NEW); ctx.fill();
    // 核心脉冲环
    const pulseR = coreR + r * 0.05 + Math.sin(t * 5) * r * 0.03;
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4 + Math.sin(t * 5) * 0.2;
    ctx.beginPath(); ctx.arc(0, 0, pulseR, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
    // === 数据流管道（从核心到边缘的流动线）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.35; ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1; ctx.lineCap = 'round';
        for (let i = 0; i < 6; i++) {
            const pipeA = (i / 6) * TWO_PI_NEW + t * 0.3;
            ctx.beginPath();
            ctx.moveTo(Math.cos(pipeA) * coreR, Math.sin(pipeA) * coreR);
            ctx.lineTo(Math.cos(pipeA) * r * 0.85, Math.sin(pipeA) * r * 0.85);
            ctx.stroke();
            // 流动数据点
            const dotPos = (t * 2 + i * 0.3) % 1;
            const dotD = coreR + (r * 0.85 - coreR) * dotPos;
            ctx.fillStyle = '#88ffee';
            ctx.beginPath(); ctx.arc(Math.cos(pipeA) * dotD, Math.sin(pipeA) * dotD, 2, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 扫描眼（单独的赛博之眼）===
    const eyeY = -r * 0.1;
    // 眼框
    ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TWO_PI_NEW;
        const hx = Math.cos(a) * r * 0.14, hy = eyeY + Math.sin(a) * r * 0.14;
        i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
    }
    ctx.closePath(); ctx.stroke();
    // 眼内底色
    ctx.fillStyle = '#002222';
    ctx.beginPath(); ctx.arc(0, eyeY, r * 0.12, 0, TWO_PI_NEW); ctx.fill();
    // 扫描光束（旋转扫描）
    const scanA = t * 4;
    ctx.strokeStyle = '#00ffaa'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    ctx.beginPath(); ctx.moveTo(0, eyeY);
    ctx.lineTo(Math.cos(scanA) * r * 0.1, eyeY + Math.sin(scanA) * r * 0.1); ctx.stroke();
    ctx.globalAlpha = 1;
    // 中心瞳孔
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath(); ctx.arc(0, eyeY, r * 0.04, 0, TWO_PI_NEW); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, eyeY, r * 0.02, 0, TWO_PI_NEW); ctx.fill();
    // === 浮游纳米粒子 ===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 10; i++) {
            const pa = t * 1.2 + i * 0.63;
            const pd = r * (0.95 + Math.sin(t * 2 + i * 0.7) * 0.25);
            ctx.fillStyle = i % 3 === 0 ? '#00ffcc' : i % 3 === 1 ? '#88ffee' : '#44ddaa';
            ctx.fillRect(Math.cos(pa) * pd - 1, Math.sin(pa) * pd - 1, 2, 2);
        }
    }
    // === 外层护盾波纹 ===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.15; ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 0.8;
        ctx.setLineDash([r * 0.06, r * 0.04]); ctx.lineDashOffset = -t * 35;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, TWO_PI_NEW); ctx.stroke();
        ctx.setLineDash([]);
    }
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
    this._shadow(ctx, x, y, r);
    ctx.save(); ctx.translate(x, y);
    // 外圈电弧光晕 (大范围闪电笼罩)
    if (this.quality.glowEnabled) {
        ctx.globalAlpha = 0.2 + Math.sin(t*6)*0.08;
        const outerGlow = ctx.createRadialGradient(0, 0, r*0.8, 0, 0, r*2.2);
        outerGlow.addColorStop(0, '#4488ff'); outerGlow.addColorStop(0.4, '#2244aa44');
        outerGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = outerGlow;
        ctx.beginPath(); ctx.arc(0, 0, r*2.2, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // 电蓝核心球体
    const coreG = ctx.createRadialGradient(-r*0.15, -r*0.15, 0, 0, 0, r);
    coreG.addColorStop(0, '#ffffff'); coreG.addColorStop(0.15, '#ddeeff');
    coreG.addColorStop(0.4, '#4488ff'); coreG.addColorStop(0.7, '#2244aa');
    coreG.addColorStop(1, '#112266');
    ctx.fillStyle = coreG;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_NEW); ctx.fill();
    // 内部电浆脉动 (波动的亮斑)
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.25;
    for (let i = 0; i < 4; i++) {
        const px = Math.cos(t*3+i*1.57)*r*0.35;
        const py = Math.sin(t*3+i*1.57)*r*0.35;
        const pg = ctx.createRadialGradient(px, py, 0, px, py, r*0.35);
        pg.addColorStop(0, '#ffffff'); pg.addColorStop(0.5, '#88ccff');
        pg.addColorStop(1, 'transparent');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(px, py, r*0.35, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    // *** 外圈闪电 — 多条粗壮分叉闪电从球体射出 ***
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (let bolt = 0; bolt < 6; bolt++) {
        const boltAngle = t * 2.5 + bolt * TWO_PI_NEW / 6 + Math.sin(t*4+bolt*2)*0.4;
        const boltLen = r * (0.8 + Math.sin(t*6+bolt*1.7)*0.35);
        // 确定性伪随机 (避免闪烁)
        const seed = bolt * 137.5 + Math.floor(t*8)*0.1;
        // 主干闪电路径 (粗锯齿)
        const points = [{x: Math.cos(boltAngle)*r*0.9, y: Math.sin(boltAngle)*r*0.9}];
        const segs = 5;
        for (let s = 1; s <= segs; s++) {
            const frac = s / segs;
            const baseX = Math.cos(boltAngle) * (r*0.9 + boltLen*frac);
            const baseY = Math.sin(boltAngle) * (r*0.9 + boltLen*frac);
            const perpX = -Math.sin(boltAngle);
            const perpY = Math.cos(boltAngle);
            const jitter = Math.sin(seed + s*3.7) * r * 0.3 * (1 - frac*0.3);
            points.push({x: baseX + perpX*jitter, y: baseY + perpY*jitter});
        }
        // 外发光层 (宽+半透明)
        ctx.strokeStyle = '#4488ff'; ctx.lineWidth = 4; ctx.globalAlpha = 0.35;
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length; p++) ctx.lineTo(points[p].x, points[p].y);
        ctx.stroke();
        // 主干亮白色
        ctx.strokeStyle = '#ffee44'; ctx.lineWidth = 2.5; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length; p++) ctx.lineTo(points[p].x, points[p].y);
        ctx.stroke();
        // 内芯超亮白
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.9;
        ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);
        for (let p = 1; p < points.length; p++) ctx.lineTo(points[p].x, points[p].y);
        ctx.stroke();
        // 分叉闪电 (从中间点分出小枝)
        if (bolt % 2 === 0 && points.length > 3) {
            const branchPt = points[2];
            const branchAngle = boltAngle + Math.sin(seed+bolt)*0.8;
            const branchLen = boltLen * 0.4;
            ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(branchPt.x, branchPt.y);
            let bx = branchPt.x, by = branchPt.y;
            for (let bs = 0; bs < 3; bs++) {
                bx += Math.cos(branchAngle)*branchLen/3 + Math.sin(seed+bs*5)*r*0.12;
                by += Math.sin(branchAngle)*branchLen/3 + Math.cos(seed+bs*5)*r*0.12;
                ctx.lineTo(bx, by);
            }
            ctx.stroke();
        }
        // 末端爆裂闪光
        const tip = points[points.length-1];
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7 + Math.sin(t*12+bolt)*0.3;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, 3, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // 球面电弧环 (贴着球面的快速弧线)
    ctx.strokeStyle = '#88ddff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    for (let i = 0; i < 3; i++) {
        const arcStart = t*8 + i*2.1;
        ctx.beginPath(); ctx.arc(0, 0, r*0.92, arcStart, arcStart + Math.PI*0.5 + Math.sin(t*3+i)*0.3);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // 中心白热点
    const centerG = ctx.createRadialGradient(0, 0, 0, 0, 0, r*0.25);
    centerG.addColorStop(0, 'rgba(255,255,255,0.7)'); centerG.addColorStop(1, 'transparent');
    ctx.fillStyle = centerG;
    ctx.beginPath(); ctx.arc(0, 0, r*0.25, 0, TWO_PI_NEW); ctx.fill();
    ctx.restore();
};;
SkinRenderer.prototype._proj_thunder = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle);
    ctx.strokeStyle='#ffff88'; ctx.lineWidth=3; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(-r*0.3,-r*0.3); ctx.lineTo(0,0); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(r,0); ctx.stroke();
    ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.moveTo(-r,0); ctx.lineTo(-r*0.3,-r*0.3); ctx.lineTo(0,0); ctx.lineTo(r*0.3,-r*0.2); ctx.lineTo(r,0); ctx.stroke();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.5,'#ffee00',0.3);
};

SkinRenderer.prototype._body_glacier = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r);
    ctx.save(); ctx.translate(x, y);
    // 外圈冰霜光晕
    if (this.quality.glowEnabled) {
        ctx.globalAlpha = 0.15;
        const frostGlow = ctx.createRadialGradient(0, 0, r*0.6, 0, 0, r*2.0);
        frostGlow.addColorStop(0, '#66ccff'); frostGlow.addColorStop(0.5, '#3388aa44');
        frostGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = frostGlow;
        ctx.beginPath(); ctx.arc(0, 0, r*2.0, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // 不规则冰晶体外形 (非圆形, 8角冰棱)
    const icePath = () => {
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i/8)*TWO_PI_NEW - Math.PI/8;
            const pr = r * (0.85 + Math.sin(a*3+1.5)*0.15);
            ctx.lineTo(Math.cos(a)*pr, Math.sin(a)*pr);
        }
        ctx.closePath();
    };
    // 冰体填充
    ctx.save(); icePath(); ctx.clip();
    const iceG = ctx.createRadialGradient(-r*0.2, -r*0.2, 0, 0, 0, r);
    iceG.addColorStop(0, '#ffffff'); iceG.addColorStop(0.15, '#e8f8ff');
    iceG.addColorStop(0.4, '#88ddff'); iceG.addColorStop(0.7, '#3399cc');
    iceG.addColorStop(1, '#1a5577');
    ctx.fillStyle = iceG; ctx.fillRect(-r, -r, r*2, r*2);
    // 内部冰裂纹 (分叉裂缝, 从中心放射)
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    for (let i = 0; i < 5; i++) {
        const ca = i * TWO_PI_NEW / 5 + 0.3;
        ctx.beginPath(); ctx.moveTo(0, 0);
        let cx = 0, cy = 0;
        for (let seg = 0; seg < 4; seg++) {
            cx += Math.cos(ca + Math.sin(i+seg)*0.4) * r * 0.2;
            cy += Math.sin(ca + Math.sin(i+seg)*0.4) * r * 0.2;
            ctx.lineTo(cx, cy);
        }
        ctx.stroke();
        // 裂缝小分支
        if (i % 2 === 0) {
            const bx = Math.cos(ca)*r*0.35, by = Math.sin(ca)*r*0.35;
            ctx.beginPath(); ctx.moveTo(bx, by);
            ctx.lineTo(bx + Math.cos(ca+0.7)*r*0.2, by + Math.sin(ca+0.7)*r*0.2);
            ctx.stroke();
        }
    }
    ctx.restore();
    // 冰晶体外轮廓描边
    ctx.strokeStyle = '#aaeeff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.8;
    icePath(); ctx.stroke();
    ctx.globalAlpha = 1;
    // *** 大型冰刺突出 (粗锥形, 有体积感) ***
    for (let i = 0; i < 6; i++) {
        const sa = (i/6)*TWO_PI_NEW + t*0.08;
        const sLen = r * (0.45 + Math.sin(t*1.5+i*1.2)*0.12);
        const sWidth = r * 0.12;
        ctx.save(); ctx.rotate(sa);
        // 冰刺渐变
        const spikeG = ctx.createLinearGradient(r*0.75, 0, r*0.75+sLen, 0);
        spikeG.addColorStop(0, '#aaeeff'); spikeG.addColorStop(0.4, '#66ccee');
        spikeG.addColorStop(0.8, '#88eeff'); spikeG.addColorStop(1, '#ffffff');
        ctx.fillStyle = spikeG; ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(r*0.7, -sWidth); ctx.lineTo(r*0.75+sLen, 0);
        ctx.lineTo(r*0.7, sWidth); ctx.closePath(); ctx.fill();
        // 冰刺高光边
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.moveTo(r*0.72, -sWidth*0.5); ctx.lineTo(r*0.75+sLen*0.8, 0); ctx.stroke();
        ctx.restore();
    }
    ctx.globalAlpha = 1;
    // 飘落冰晶粒子 (更大更亮)
    for (let i = 0; i < 8; i++) {
        const fa = t*1.2 + i*0.79;
        const fd = r*(1.3 + Math.sin(t*1.5+i)*0.2);
        ctx.globalAlpha = 0.4 + Math.sin(t*2+i)*0.25;
        // 六角雪花形状
        ctx.save(); ctx.translate(Math.cos(fa)*fd, Math.sin(fa)*fd); ctx.rotate(t*2+i);
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8;
        for (let arm = 0; arm < 6; arm++) {
            const aa = arm * TWO_PI_NEW / 6;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(aa)*2.5, Math.sin(aa)*2.5); ctx.stroke();
        }
        ctx.restore();
    }
    ctx.globalAlpha = 1;
    // 高光
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.arc(-r*0.22, -r*0.28, r*0.14, 0, TWO_PI_NEW); ctx.fill();
    ctx.restore();
};;;
SkinRenderer.prototype._proj_glacier = function(ctx, x, y, r, angle) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(angle+this._time*3);
    ctx.fillStyle='#aaeeff'; ctx.beginPath();
    for(let i=0;i<6;i++){const a=(i/6)*TWO_PI_NEW; const cr=i%2===0?r*0.9:r*0.4; ctx.lineTo(Math.cos(a)*cr,Math.sin(a)*cr);} ctx.closePath(); ctx.fill();
    ctx.fillStyle='#fff'; ctx.globalAlpha=0.5; ctx.beginPath(); ctx.arc(0,0,r*0.25,0,TWO_PI_NEW); ctx.fill();
    ctx.restore(); if(this.quality.glowEnabled) this._glow(ctx,x,y,r*0.4,'#88ddff',0.25);
};

SkinRenderer.prototype._body_shadow = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r);
    ctx.save(); ctx.translate(x, y);
    // Swirling wind sphere (cyan/green/gray wind energy)
    const windG = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    windG.addColorStop(0, '#ccffee'); windG.addColorStop(0.3, '#66ddaa');
    windG.addColorStop(0.6, '#338866'); windG.addColorStop(1, '#1a4433');
    ctx.fillStyle = windG;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TWO_PI_NEW); ctx.fill();
    // Wind vortex lines (swirling streaks)
    ctx.strokeStyle = '#aaffdd'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 5; i++) {
        const sa = t * 4 + i * TWO_PI_NEW / 5;
        const spiralR = r * (0.3 + i * 0.12);
        ctx.beginPath();
        ctx.arc(0, 0, spiralR, sa, sa + Math.PI * 0.8);
        ctx.stroke();
    }
    // Outer tornado ring (fast spinning debris)
    ctx.globalAlpha = 0.3; ctx.strokeStyle = '#88ffcc'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.95, t*6, t*6 + Math.PI * 1.4); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 0.95, t*6 + Math.PI, t*6 + Math.PI * 2.2); ctx.stroke();
    ctx.globalAlpha = 1;
    // Floating debris particles
    ctx.fillStyle = '#77bb99';
    for (let i = 0; i < 8; i++) {
        const pa = t * 5 + i * 0.79;
        const pd = r * (0.4 + Math.sin(t*2 + i) * 0.3);
        ctx.globalAlpha = 0.4 + Math.sin(t*3+i)*0.3;
        ctx.beginPath(); ctx.arc(Math.cos(pa)*pd, Math.sin(pa)*pd, 1.5 + Math.sin(t+i)*0.5, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Central eye of the storm (calm bright center)
    const eyeG = ctx.createRadialGradient(0, 0, 0, 0, 0, r*0.25);
    eyeG.addColorStop(0, '#ffffff'); eyeG.addColorStop(0.5, '#aaffdd'); eyeG.addColorStop(1, 'transparent');
    ctx.fillStyle = eyeG;
    ctx.beginPath(); ctx.arc(0, 0, r*0.25, 0, TWO_PI_NEW); ctx.fill();
    ctx.restore();
};;
SkinRenderer.prototype._proj_shadow = function(ctx, x, y, r, angle) {
    const t = this._time;
    ctx.save(); ctx.translate(x, y);
    // Wind projectile: spinning vortex with debris
    const vortG = ctx.createRadialGradient(0, 0, 0, 0, 0, r*0.8);
    vortG.addColorStop(0, '#ffffff'); vortG.addColorStop(0.3, '#aaffdd');
    vortG.addColorStop(0.7, '#66ddaa'); vortG.addColorStop(1, '#338866');
    ctx.fillStyle = vortG; ctx.globalAlpha = 0.7;
    ctx.beginPath(); ctx.arc(0, 0, r*0.8, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // Spiral wind lines
    ctx.strokeStyle = '#aaffdd'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath(); ctx.arc(0, 0, r*(0.3+i*0.2), t*10+i*2.1, t*10+i*2.1+Math.PI*0.8); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // Debris particles
    ctx.fillStyle = '#66ddaa';
    for (let i = 0; i < 4; i++) {
        const pa = t*8 + i*1.57;
        const pd = r*(0.3 + Math.sin(t*4+i)*0.15);
        ctx.beginPath(); ctx.arc(Math.cos(pa)*pd, Math.sin(pa)*pd, 1.5, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.restore();
    if (this.quality.glowEnabled) this._glow(ctx, x, y, r*0.6, '#66ddaa', 0.2);
};

// ============================================
// 涓滄柟绁炶瘽绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
;;
;

;;
;

;;
;

// ============================================
// 娣辨笂绯诲垪 - SkinRenderer 韬綋+寮逛綋
// ============================================
SkinRenderer.prototype._body_voidwalker = function(ctx, x, y, r, angle) {
    const t = this._time;
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#4400ff', 0.2);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形：虚空行者 — 人形上半身轮廓（带披风和虚空裂隙）===
    // 主体轮廓：人形胸像，有宽肩和三角形铠甲
    const voidPath = () => {
        ctx.beginPath();
        // 头顶（微尖的头盔）
        ctx.moveTo(0, -r * 0.95);
        // 头盔左侧
        ctx.bezierCurveTo(-r * 0.2, -r * 0.9, -r * 0.3, -r * 0.7, -r * 0.32, -r * 0.5);
        // 左肩甲（宽大的尖角肩甲）
        ctx.lineTo(-r * 0.5, -r * 0.45);
        ctx.lineTo(-r * 0.95, -r * 0.3);
        ctx.lineTo(-r * 0.85, -r * 0.1);
        // 左臂到腰部
        ctx.bezierCurveTo(-r * 0.75, r * 0.1, -r * 0.6, r * 0.4, -r * 0.5, r * 0.6);
        // 左下角披风
        ctx.bezierCurveTo(-r * 0.45, r * 0.8, -r * 0.3, r * 0.95, -r * 0.15, r);
        // 底部
        ctx.lineTo(r * 0.15, r);
        // 右下角披风
        ctx.bezierCurveTo(r * 0.3, r * 0.95, r * 0.45, r * 0.8, r * 0.5, r * 0.6);
        // 右臂
        ctx.bezierCurveTo(r * 0.6, r * 0.4, r * 0.75, r * 0.1, r * 0.85, -r * 0.1);
        // 右肩甲
        ctx.lineTo(r * 0.95, -r * 0.3);
        ctx.lineTo(r * 0.5, -r * 0.45);
        ctx.lineTo(r * 0.32, -r * 0.5);
        // 头盔右侧
        ctx.bezierCurveTo(r * 0.3, -r * 0.7, r * 0.2, -r * 0.9, 0, -r * 0.95);
        ctx.closePath();
    };
    // 填充主体
    ctx.save(); voidPath(); ctx.clip();
    // 虚空铠甲底色（深紫-黑）
    const armorG = ctx.createLinearGradient(0, -r, 0, r);
    armorG.addColorStop(0, '#1a0044'); armorG.addColorStop(0.3, '#0a0022');
    armorG.addColorStop(0.5, '#110033'); armorG.addColorStop(0.7, '#0a0015');
    armorG.addColorStop(1, '#050010');
    ctx.fillStyle = armorG; ctx.fillRect(-r, -r, r * 2, r * 2);
    // 铠甲分段线条
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.15; ctx.strokeStyle = '#6622cc'; ctx.lineWidth = 0.8;
        // 胸甲中线
        ctx.beginPath(); ctx.moveTo(0, -r * 0.5); ctx.lineTo(0, r * 0.4); ctx.stroke();
        // 肩甲分界线
        ctx.beginPath(); ctx.moveTo(-r * 0.32, -r * 0.5); ctx.lineTo(-r * 0.4, r * 0.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(r * 0.32, -r * 0.5); ctx.lineTo(r * 0.4, r * 0.1); ctx.stroke();
        // 腰部横线
        ctx.beginPath(); ctx.moveTo(-r * 0.4, r * 0.15); ctx.lineTo(r * 0.4, r * 0.15); ctx.stroke();
        ctx.globalAlpha = 1;
    }
    // 虚空裂隙纹理（在铠甲上的发光裂缝）
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.5; ctx.strokeStyle = '#7744ff'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
        // 动态裂缝
        for (let i = 0; i < 5; i++) {
            const cx = -r * 0.3 + i * r * 0.15 + Math.sin(t + i) * r * 0.02;
            const cy = -r * 0.2 + Math.sin(t * 0.7 + i * 1.2) * r * 0.15;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.sin(t + i * 0.8) * r * 0.08, cy + r * 0.12);
            ctx.stroke();
        }
        // 裂缝发光（内层更亮）
        ctx.globalAlpha = 0.3; ctx.strokeStyle = '#bb88ff'; ctx.lineWidth = 0.5;
        for (let i = 0; i < 5; i++) {
            const cx = -r * 0.3 + i * r * 0.15 + Math.sin(t + i) * r * 0.02;
            const cy = -r * 0.2 + Math.sin(t * 0.7 + i * 1.2) * r * 0.15;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.sin(t + i * 0.8) * r * 0.08, cy + r * 0.12);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 外轮廓发光
    ctx.strokeStyle = '#6622ee'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
    voidPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 头盔面甲（T型视窗）===
    const visorY = -r * 0.6;
    // 面甲背景
    ctx.fillStyle = '#000011';
    ctx.beginPath();
    // T形面罩
    ctx.moveTo(-r * 0.2, visorY - r * 0.05);
    ctx.lineTo(r * 0.2, visorY - r * 0.05);
    ctx.lineTo(r * 0.2, visorY + r * 0.02);
    ctx.lineTo(r * 0.04, visorY + r * 0.02);
    ctx.lineTo(r * 0.04, visorY + r * 0.15);
    ctx.lineTo(-r * 0.04, visorY + r * 0.15);
    ctx.lineTo(-r * 0.04, visorY + r * 0.02);
    ctx.lineTo(-r * 0.2, visorY + r * 0.02);
    ctx.closePath(); ctx.fill();
    // 面罩内发光
    const visorGlow = ctx.createLinearGradient(-r * 0.2, visorY, r * 0.2, visorY);
    visorGlow.addColorStop(0, '#4400aa'); visorGlow.addColorStop(0.5, '#7744ff');
    visorGlow.addColorStop(1, '#4400aa');
    ctx.fillStyle = visorGlow; ctx.globalAlpha = 0.7 + Math.sin(t * 3) * 0.15;
    ctx.beginPath();
    ctx.moveTo(-r * 0.18, visorY - r * 0.03);
    ctx.lineTo(r * 0.18, visorY - r * 0.03);
    ctx.lineTo(r * 0.18, visorY + r * 0.0);
    ctx.lineTo(r * 0.03, visorY + r * 0.0);
    ctx.lineTo(r * 0.03, visorY + r * 0.12);
    ctx.lineTo(-r * 0.03, visorY + r * 0.12);
    ctx.lineTo(-r * 0.03, visorY + r * 0.0);
    ctx.lineTo(-r * 0.18, visorY + r * 0.0);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // === 肩甲宝石（虚空能量核心）===
    for (let side = -1; side <= 1; side += 2) {
        const gemX = side * r * 0.65, gemY = -r * 0.25;
        // 宝石底座
        ctx.fillStyle = '#1a0044'; ctx.strokeStyle = '#5522aa'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gemX, gemY - r * 0.08);
        ctx.lineTo(gemX + r * 0.06, gemY);
        ctx.lineTo(gemX, gemY + r * 0.08);
        ctx.lineTo(gemX - r * 0.06, gemY);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // 宝石发光
        ctx.globalAlpha = 0.7;
        const gemG = ctx.createRadialGradient(gemX, gemY, 0, gemX, gemY, r * 0.06);
        gemG.addColorStop(0, '#ffffff'); gemG.addColorStop(0.3, '#aa88ff');
        gemG.addColorStop(0.7, '#5522cc'); gemG.addColorStop(1, 'transparent');
        ctx.fillStyle = gemG;
        ctx.beginPath(); ctx.arc(gemX, gemY, r * 0.06, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // === 虚空传送门（背后的次元裂隙环）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.2;
        ctx.strokeStyle = '#5522cc'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, r * 0.1, r * 0.9, r * 0.4, 0, Math.PI * 0.8, Math.PI * 0.2, true);
        ctx.stroke();
        // 传送门内能量
        ctx.globalAlpha = 0.08;
        const portalG = ctx.createRadialGradient(0, r * 0.1, 0, 0, r * 0.1, r * 0.7);
        portalG.addColorStop(0, '#7744ff'); portalG.addColorStop(1, 'transparent');
        ctx.fillStyle = portalG;
        ctx.beginPath(); ctx.ellipse(0, r * 0.1, r * 0.8, r * 0.35, 0, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // === 虚空能量粒子 ===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 8; i++) {
            const pa = t * 0.8 + i * 0.785;
            const pd = r * (0.7 + Math.sin(t + i * 1.3) * 0.35);
            const px = Math.cos(pa) * pd, py = Math.sin(pa) * pd;
            ctx.fillStyle = i % 2 === 0 ? '#7744ff' : '#aa88ff';
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 胸口虚空之心（中央能量源）===
    const heartY = -r * 0.05;
    ctx.globalAlpha = 0.8;
    const heartG = ctx.createRadialGradient(0, heartY, 0, 0, heartY, r * 0.12);
    heartG.addColorStop(0, '#ffffff'); heartG.addColorStop(0.2, '#bb88ff');
    heartG.addColorStop(0.5, '#5522cc'); heartG.addColorStop(1, 'transparent');
    ctx.fillStyle = heartG;
    ctx.beginPath(); ctx.arc(0, heartY, r * 0.12, 0, TWO_PI_NEW); ctx.fill();
    // 心脏脉冲
    const hPulse = r * 0.14 + Math.sin(t * 4) * r * 0.02;
    ctx.strokeStyle = '#7744ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(0, heartY, hPulse, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#cc0000', 0.2);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形：血月狼人造型 — 狼头正面（尖耳+狼鼻+獠牙）===
    // 狼头轮廓
    const wolfPath = () => {
        ctx.beginPath();
        // 左耳尖
        ctx.moveTo(-r * 0.4, -r * 0.98);
        // 左耳内侧
        ctx.lineTo(-r * 0.3, -r * 0.6);
        // 头顶弧线
        ctx.quadraticCurveTo(-r * 0.15, -r * 0.68, 0, -r * 0.65);
        ctx.quadraticCurveTo(r * 0.15, -r * 0.68, r * 0.3, -r * 0.6);
        // 右耳尖
        ctx.lineTo(r * 0.4, -r * 0.98);
        // 右耳外侧回到头部
        ctx.lineTo(r * 0.5, -r * 0.5);
        // 右脸颊（狼脸比狐狸更宽更粗犷）
        ctx.bezierCurveTo(r * 0.6, -r * 0.25, r * 0.6, r * 0.0, r * 0.5, r * 0.15);
        // 右下颌（狼嘴突出）
        ctx.bezierCurveTo(r * 0.4, r * 0.3, r * 0.3, r * 0.5, r * 0.2, r * 0.6);
        // 嘴部前突（狼的口鼻突出）
        ctx.quadraticCurveTo(r * 0.1, r * 0.7, 0, r * 0.65);
        ctx.quadraticCurveTo(-r * 0.1, r * 0.7, -r * 0.2, r * 0.6);
        // 左下颌
        ctx.bezierCurveTo(-r * 0.3, r * 0.5, -r * 0.4, r * 0.3, -r * 0.5, r * 0.15);
        ctx.bezierCurveTo(-r * 0.6, r * 0.0, -r * 0.6, -r * 0.25, -r * 0.5, -r * 0.5);
        ctx.closePath();
    };
    // 背景血月
    ctx.globalAlpha = 0.2;
    const moonG = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.1);
    moonG.addColorStop(0, '#660000'); moonG.addColorStop(0.5, '#330000');
    moonG.addColorStop(1, 'transparent');
    ctx.fillStyle = moonG;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.1, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // 填充狼头
    ctx.save(); wolfPath(); ctx.clip();
    // 狼毛底色（深灰+血红色调）
    const furG = ctx.createLinearGradient(0, -r, 0, r * 0.7);
    furG.addColorStop(0, '#4a3535'); furG.addColorStop(0.3, '#3a2525');
    furG.addColorStop(0.5, '#2a1515'); furG.addColorStop(0.8, '#1a0a0a');
    furG.addColorStop(1, '#110505');
    ctx.fillStyle = furG; ctx.fillRect(-r * 0.7, -r * 1.1, r * 1.4, r * 1.8);
    // 毛发纹理（粗犷的毛发线条）
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.1; ctx.strokeStyle = '#552222'; ctx.lineWidth = 0.8;
        for (let i = 0; i < 25; i++) {
            const fx = -r * 0.45 + (i % 9) * r * 0.11;
            const fy = -r * 0.7 + Math.floor(i / 9) * r * 0.4;
            const fLen = r * 0.06 + Math.sin(i * 1.7) * r * 0.03;
            ctx.beginPath(); ctx.moveTo(fx, fy);
            ctx.lineTo(fx + Math.sin(i + t * 0.5) * r * 0.02, fy + fLen);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    // 胸部浅色毛（狼胸前的灰白毛）
    ctx.fillStyle = '#5a4a4a'; ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.3, r * 0.2, r * 0.25, 0, 0, TWO_PI_NEW);
    ctx.fill(); ctx.globalAlpha = 1;
    ctx.restore();
    // 轮廓描边
    ctx.strokeStyle = '#660022'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.4;
    wolfPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 耳朵内部 ===
    for (let side = -1; side <= 1; side += 2) {
        ctx.fillStyle = '#552222'; ctx.globalAlpha = 0.5;
        const earX = side * r * 0.35;
        ctx.beginPath();
        ctx.moveTo(earX, -r * 0.9);
        ctx.lineTo(earX - side * r * 0.06, -r * 0.6);
        ctx.lineTo(earX + side * r * 0.06, -r * 0.62);
        ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // === 狼眼（发光的血红色眼睛）===
    const eyeY = -r * 0.2;
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.2;
        // 眼部发光
        ctx.globalAlpha = 0.3;
        const eyeGlow = ctx.createRadialGradient(ex, eyeY, 0, ex, eyeY, r * 0.1);
        eyeGlow.addColorStop(0, '#ff2200'); eyeGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = eyeGlow;
        ctx.beginPath(); ctx.arc(ex, eyeY, r * 0.1, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 眼形（锐利的三角眼）
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.moveTo(ex - r * 0.09, eyeY + r * 0.01);
        ctx.quadraticCurveTo(ex, eyeY - r * 0.05, ex + r * 0.09, eyeY - r * 0.01);
        ctx.quadraticCurveTo(ex, eyeY + r * 0.04, ex - r * 0.09, eyeY + r * 0.01);
        ctx.closePath(); ctx.fill();
        // 瞳孔（圆形，血月下瞳孔扩大）
        ctx.fillStyle = '#cc0000';
        ctx.beginPath(); ctx.arc(ex, eyeY, r * 0.03, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.arc(ex, eyeY, r * 0.015, 0, TWO_PI_NEW); ctx.fill();
        // 高光
        ctx.fillStyle = '#ffaaaa';
        ctx.beginPath(); ctx.arc(ex + r * 0.02, eyeY - r * 0.015, r * 0.008, 0, TWO_PI_NEW); ctx.fill();
    }
    // === 狼鼻 ===
    ctx.fillStyle = '#1a0505';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.3);
    ctx.bezierCurveTo(-r * 0.06, r * 0.28, -r * 0.06, r * 0.35, 0, r * 0.37);
    ctx.bezierCurveTo(r * 0.06, r * 0.35, r * 0.06, r * 0.28, 0, r * 0.3);
    ctx.closePath(); ctx.fill();
    // === 獠牙（露出的尖牙）===
    ctx.fillStyle = '#eeeeee';
    for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.moveTo(side * r * 0.08, r * 0.45);
        ctx.lineTo(side * r * 0.06, r * 0.58);
        ctx.lineTo(side * r * 0.1, r * 0.45);
        ctx.closePath(); ctx.fill();
    }
    // === 伤疤（左眼上方的战斗疤痕）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.4; ctx.strokeStyle = '#aa3333'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-r * 0.3, -r * 0.4);
        ctx.lineTo(-r * 0.12, -r * 0.15);
        ctx.stroke();
        // 交叉疤
        ctx.beginPath();
        ctx.moveTo(-r * 0.28, -r * 0.2);
        ctx.lineTo(-r * 0.14, -r * 0.35);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    // === 血滴粒子（飘散的血雾）===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 8; i++) {
            const bx = Math.sin(t * 1.5 + i * 0.8) * r * 0.8;
            const by = Math.cos(t * 1.2 + i * 1.1) * r * 0.8;
            ctx.fillStyle = '#cc0000';
            ctx.beginPath(); ctx.arc(bx, by, r * 0.015 + Math.sin(t + i) * r * 0.005, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 血月光环 ===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.1; ctx.strokeStyle = '#cc0000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.05, 0, TWO_PI_NEW); ctx.stroke();
        ctx.globalAlpha = 0.05; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.15, 0, TWO_PI_NEW); ctx.stroke();
        ctx.globalAlpha = 1;
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ff00ff', 0.2);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形：混沌之眼 — 巨大的竖瞳魔眼（类似索伦之眼）===
    // 外形：垂直菱形的大眼，上下尖锐，中间宽
    const eyeOuterPath = () => {
        ctx.beginPath();
        // 上尖
        ctx.moveTo(0, -r * 1.0);
        // 左上弧到最宽处
        ctx.bezierCurveTo(-r * 0.3, -r * 0.7, -r * 0.8, -r * 0.3, -r * 0.9, 0);
        // 左下弧到下尖
        ctx.bezierCurveTo(-r * 0.8, r * 0.3, -r * 0.3, r * 0.7, 0, r * 1.0);
        // 右下弧
        ctx.bezierCurveTo(r * 0.3, r * 0.7, r * 0.8, r * 0.3, r * 0.9, 0);
        // 右上弧回到上尖
        ctx.bezierCurveTo(r * 0.8, -r * 0.3, r * 0.3, -r * 0.7, 0, -r * 1.0);
        ctx.closePath();
    };
    // 外层眼眶（暗色肉质边框）
    ctx.save(); eyeOuterPath(); ctx.clip();
    // 眼眶外圈（深红肉色）
    const lidG = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r * 1.0);
    lidG.addColorStop(0, '#440022'); lidG.addColorStop(0.4, '#330011');
    lidG.addColorStop(0.7, '#220011'); lidG.addColorStop(1, '#110005');
    ctx.fillStyle = lidG; ctx.fillRect(-r, -r * 1.1, r * 2, r * 2.2);
    // 血管纹理（眼球表面的血丝）
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.15; ctx.strokeStyle = '#cc0044'; ctx.lineWidth = 0.6; ctx.lineCap = 'round';
        for (let i = 0; i < 12; i++) {
            const va = (i / 12) * TWO_PI_NEW;
            const vx1 = Math.cos(va) * r * 0.7, vy1 = Math.sin(va) * r * 0.7;
            const vx2 = Math.cos(va) * r * 0.4, vy2 = Math.sin(va) * r * 0.4;
            ctx.beginPath(); ctx.moveTo(vx1, vy1);
            ctx.quadraticCurveTo(
                vx1 * 0.7 + Math.sin(t + i) * r * 0.05,
                vy1 * 0.7 + Math.cos(t + i) * r * 0.05,
                vx2, vy2
            );
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 外轮廓线
    ctx.strokeStyle = '#880044'; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
    eyeOuterPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 眼球（内层——白色/黄色巩膜）===
    const innerPath = () => {
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.65);
        ctx.bezierCurveTo(-r * 0.2, -r * 0.45, -r * 0.55, -r * 0.2, -r * 0.6, 0);
        ctx.bezierCurveTo(-r * 0.55, r * 0.2, -r * 0.2, r * 0.45, 0, r * 0.65);
        ctx.bezierCurveTo(r * 0.2, r * 0.45, r * 0.55, r * 0.2, r * 0.6, 0);
        ctx.bezierCurveTo(r * 0.55, -r * 0.2, r * 0.2, -r * 0.45, 0, -r * 0.65);
        ctx.closePath();
    };
    ctx.save(); innerPath(); ctx.clip();
    // 巩膜渐变（淡黄色带血丝感）
    const scleraG = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.6);
    scleraG.addColorStop(0, '#ffffee'); scleraG.addColorStop(0.5, '#ffeecc');
    scleraG.addColorStop(0.8, '#ffccaa'); scleraG.addColorStop(1, '#cc8866');
    ctx.fillStyle = scleraG; ctx.fillRect(-r * 0.7, -r * 0.7, r * 1.4, r * 1.4);
    // 巩膜血丝
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.1; ctx.strokeStyle = '#cc3300'; ctx.lineWidth = 0.4;
        for (let i = 0; i < 8; i++) {
            const ba = (i / 8) * TWO_PI_NEW + t * 0.1;
            ctx.beginPath();
            ctx.moveTo(Math.cos(ba) * r * 0.55, Math.sin(ba) * r * 0.55);
            ctx.quadraticCurveTo(
                Math.cos(ba + 0.2) * r * 0.35,
                Math.sin(ba + 0.2) * r * 0.35,
                Math.cos(ba) * r * 0.2,
                Math.sin(ba) * r * 0.2
            );
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 内层边缘
    ctx.strokeStyle = '#aa5533'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
    innerPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 虹膜（混沌多色的旋涡虹膜）===
    const irisR = r * 0.3;
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, irisR, 0, TWO_PI_NEW); ctx.clip();
    // 虹膜底色（紫红渐变）
    const irisG = ctx.createRadialGradient(0, 0, 0, 0, 0, irisR);
    irisG.addColorStop(0, '#ff44aa'); irisG.addColorStop(0.3, '#cc22aa');
    irisG.addColorStop(0.6, '#8800cc'); irisG.addColorStop(1, '#440066');
    ctx.fillStyle = irisG;
    ctx.beginPath(); ctx.arc(0, 0, irisR, 0, TWO_PI_NEW); ctx.fill();
    // 虹膜旋涡纹理
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.2; ctx.strokeStyle = '#ff66cc'; ctx.lineWidth = 0.8;
        for (let i = 0; i < 8; i++) {
            const sa = (i / 8) * TWO_PI_NEW + t * 1.5;
            ctx.beginPath();
            for (let s = 0; s < 20; s++) {
                const sp = s / 20;
                const sAngle = sa + sp * 1.5;
                const sR = sp * irisR;
                const sx = Math.cos(sAngle) * sR, sy = Math.sin(sAngle) * sR;
                s === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 虹膜外环
    ctx.strokeStyle = '#aa00ff'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.arc(0, 0, irisR, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
    // === 竖瞳（猫科竖瞳，中间收缩的裂缝）===
    const pupilW = r * 0.04 + Math.sin(t * 2) * r * 0.01;
    const pupilH = irisR * 0.9;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(0, -pupilH);
    ctx.bezierCurveTo(-pupilW, -pupilH * 0.3, -pupilW, pupilH * 0.3, 0, pupilH);
    ctx.bezierCurveTo(pupilW, pupilH * 0.3, pupilW, -pupilH * 0.3, 0, -pupilH);
    ctx.closePath(); ctx.fill();
    // 瞳孔内反光
    ctx.fillStyle = '#220011'; ctx.globalAlpha = 0.3;
    ctx.beginPath(); ctx.ellipse(0, 0, pupilW * 0.5, pupilH * 0.3, 0, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 高光（多个光斑）===
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(-r * 0.1, -r * 0.15, r * 0.04, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.arc(r * 0.08, r * 0.1, r * 0.025, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 混沌能量触手（从眼睛向外延伸的触须）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.35; ctx.lineCap = 'round';
        for (let i = 0; i < 8; i++) {
            const tAngle = (i / 8) * TWO_PI_NEW + t * 0.5;
            const tLen = r * (0.3 + Math.sin(t * 2 + i * 0.9) * 0.15);
            const startR = r * 0.85;
            const tx1 = Math.cos(tAngle) * startR, ty1 = Math.sin(tAngle) * startR;
            const tx2 = Math.cos(tAngle + Math.sin(t + i) * 0.2) * (startR + tLen);
            const ty2 = Math.sin(tAngle + Math.sin(t + i) * 0.2) * (startR + tLen);
            ctx.strokeStyle = i % 2 === 0 ? '#ff00ff' : '#aa00cc';
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(tx1, ty1);
            ctx.quadraticCurveTo(
                (tx1 + tx2) / 2 + Math.sin(t * 3 + i) * r * 0.05,
                (ty1 + ty2) / 2 + Math.cos(t * 3 + i) * r * 0.05,
                tx2, ty2
            );
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    // === 混沌粒子 ===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 10; i++) {
            const px = Math.sin(t * 1.3 + i * 0.63) * r * (0.9 + Math.sin(t + i) * 0.2);
            const py = Math.cos(t * 1.1 + i * 0.77) * r * (0.9 + Math.cos(t + i) * 0.2);
            ctx.fillStyle = ['#ff00ff', '#ff4488', '#aa00ff', '#ff88cc'][i % 4];
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 外层混沌之环 ===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.12; ctx.strokeStyle = '#ff00ff'; ctx.lineWidth = 1;
        ctx.setLineDash([r * 0.03, r * 0.06]); ctx.lineDashOffset = t * 30;
        eyeOuterPath(); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
    }
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
        ctx.fillStyle = '#005566'; ctx.fillRect(0, -2.5, 24, 5);
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(2, -1); ctx.lineTo(8, -1); ctx.lineTo(10, -2); ctx.lineTo(16, -2); ctx.lineTo(18, 0); ctx.lineTo(22, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(2, 1); ctx.lineTo(6, 1); ctx.lineTo(8, 2); ctx.lineTo(14, 2); ctx.lineTo(16, 1); ctx.lineTo(22, 1); ctx.stroke();
        ctx.fillStyle = '#00ffff';
        ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(28, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#333'; ctx.fillRect(-6, -2, 6, 4);
    } else if (weaponType === 'fireball') {
        // 赛博等离子炮
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -2.5, 24, 5);
        ctx.fillStyle = '#005566'; ctx.fillRect(-4, -2, 20, 4);
        // 炮口能量聚集
        ctx.fillStyle = '#00ffff'; ctx.globalAlpha = 0.4 + Math.sin(t * 8) * 0.3;
        ctx.beginPath(); ctx.arc(20, 0, 5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(20, 0, 2, 0, TWO_PI_NEW); ctx.fill();
        // 散热口
        ctx.strokeStyle = '#00aaaa'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(4, -3); ctx.lineTo(4, 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8, -3); ctx.lineTo(8, 3); ctx.stroke();
    } else if (weaponType === 'bow') {
        // 赛博轨道枪（弓→磁轨发射器）
        ctx.fillStyle = '#333'; ctx.fillRect(-4, -1.5, 26, 3);
        // 双轨道
        ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(22, -3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(22, 3); ctx.stroke();
        // 电弧
        ctx.globalAlpha = 0.5 + Math.sin(t * 10) * 0.3;
        ctx.beginPath(); ctx.moveTo(6, -3); ctx.lineTo(8, 0); ctx.lineTo(10, 3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(14, -3); ctx.lineTo(16, 0); ctx.lineTo(18, 3); ctx.stroke();
        ctx.globalAlpha = 1;
        // 弹头
        ctx.fillStyle = '#00ffff';
        ctx.beginPath(); ctx.moveTo(22, -2); ctx.lineTo(26, 0); ctx.lineTo(22, 2); ctx.closePath(); ctx.fill();
    } else {
        // necro: 赛博骷髅无人机控制器
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -2, 20, 4);
        ctx.fillStyle = '#003333'; ctx.fillRect(-4, -3, 16, 6);
        // 全息骷髅投影
        ctx.strokeStyle = '#00ffcc'; ctx.lineWidth = 1; ctx.globalAlpha = 0.5 + Math.sin(t * 3) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 5, 0, TWO_PI_NEW); ctx.stroke();
        ctx.beginPath(); ctx.arc(16, -2, 2, 0, Math.PI, true); ctx.stroke();
        ctx.beginPath(); ctx.arc(20, -2, 2, 0, Math.PI, true); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(17, 2); ctx.lineTo(19, 2); ctx.stroke();
        ctx.globalAlpha = 1;
    }
};

// 蒸汽机器人 — 齿轮锤
SkinRenderer.prototype._weapon_steambot = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        ctx.fillStyle = '#664422'; ctx.fillRect(-4, -2, 18, 4);
        ctx.fillStyle = '#aa8844';
        ctx.beginPath(); ctx.arc(18, 0, 8, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#886633';
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * TWO_PI_NEW + t * 3;
            ctx.fillRect(18 + Math.cos(a) * 7 - 2, Math.sin(a) * 7 - 2, 4, 4);
        }
        ctx.fillStyle = '#553311'; ctx.beginPath(); ctx.arc(18, 0, 4, 0, TWO_PI_NEW); ctx.fill();
        if (attacking) {
            ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.3;
            ctx.beginPath(); ctx.arc(18, -10 - Math.random() * 3, 3, 0, TWO_PI_NEW); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else if (weaponType === 'fireball') {
        // 蒸汽喷火器
        ctx.fillStyle = '#664422'; ctx.fillRect(-6, -2.5, 22, 5);
        ctx.fillStyle = '#aa6633'; ctx.fillRect(14, -3.5, 8, 7); // 燃烧室
        // 管道
        ctx.strokeStyle = '#886633'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, -3); ctx.lineTo(14, -3); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, 3); ctx.lineTo(14, 3); ctx.stroke();
        // 火焰喷口
        if (attacking) {
            ctx.fillStyle = '#ff6600'; ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.moveTo(22, -2); ctx.lineTo(30, 0); ctx.lineTo(22, 2); ctx.fill();
            ctx.fillStyle = '#ffcc00'; ctx.globalAlpha = 0.4;
            ctx.beginPath(); ctx.moveTo(22, -1); ctx.lineTo(28, 0); ctx.lineTo(22, 1); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else if (weaponType === 'bow') {
        // 蒸汽弩
        ctx.fillStyle = '#664422'; ctx.fillRect(-4, -1.5, 20, 3);
        // 弩臂
        ctx.strokeStyle = '#aa8844'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(4, -8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(4, 8); ctx.stroke();
        // 弦
        ctx.strokeStyle = '#ccaa66'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(4, -8); ctx.lineTo(12, 0); ctx.lineTo(4, 8); ctx.stroke();
        // 齿轮装饰
        ctx.fillStyle = '#886633';
        ctx.beginPath(); ctx.arc(8, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        // 箭矢
        ctx.fillStyle = '#553311'; ctx.fillRect(10, -0.8, 14, 1.6);
        ctx.fillStyle = '#888'; ctx.beginPath(); ctx.moveTo(24, -1.5); ctx.lineTo(26, 0); ctx.lineTo(24, 1.5); ctx.closePath(); ctx.fill();
    } else {
        // necro: 蒸汽灵魂瓶
        ctx.fillStyle = '#664422'; ctx.fillRect(-6, -1.5, 18, 3);
        // 球形瓶子
        ctx.fillStyle = '#88aa66'; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#664422'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_NEW); ctx.stroke();
        // 瓶中灵魂
        ctx.fillStyle = '#ccffaa'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.2;
        ctx.beginPath(); ctx.arc(16 + Math.sin(t * 2) * 2, Math.cos(t * 2.5) * 2, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
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
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const px = 4 + i * 3.5;
            ctx.beginPath(); ctx.moveTo(px, -2); ctx.lineTo(px, 2); ctx.stroke();
        }
        ctx.fillStyle = '#112222'; ctx.fillRect(-5, -2, 5, 4);
    } else if (weaponType === 'fireball') {
        // 纳米聚变发射器
        ctx.fillStyle = '#112222'; ctx.fillRect(-6, -2, 22, 4);
        // 六角发射口
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * TWO_PI_NEW;
            const hx = 18 + Math.cos(a) * 5, hy = Math.sin(a) * 5;
            i === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
        }
        ctx.closePath(); ctx.stroke();
        // 核心能量
        ctx.fillStyle = '#44ffaa'; ctx.globalAlpha = 0.5 + Math.sin(t * 6) * 0.3;
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 纳米粒子加速器（弓→线性加速器）
        ctx.fillStyle = '#112222'; ctx.fillRect(-4, -1, 26, 2);
        // 加速环
        ctx.strokeStyle = '#44ffaa'; ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
            const rx = 4 + i * 6;
            ctx.beginPath(); ctx.ellipse(rx, 0, 2, 4, 0, 0, TWO_PI_NEW); ctx.stroke();
        }
        // 加速粒子
        const pPos = (t * 20) % 24;
        ctx.fillStyle = '#aaffdd';
        ctx.beginPath(); ctx.arc(pPos, 0, 1.5, 0, TWO_PI_NEW); ctx.fill();
    } else {
        // necro: 纳米虫群控制器
        ctx.fillStyle = '#112222'; ctx.fillRect(-6, -2, 20, 4);
        // 虫群云
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 8; i++) {
            const nx = 16 + Math.sin(t * 3 + i * 0.8) * 4;
            const ny = Math.cos(t * 2.5 + i * 1.1) * 4;
            ctx.fillStyle = i % 2 === 0 ? '#44ffaa' : '#88ffcc';
            ctx.fillRect(nx - 1, ny - 1, 2, 2);
        }
        ctx.globalAlpha = 1;
    }
};

// 雷霆 — 闪电锤
SkinRenderer.prototype._weapon_thunder = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.7 : 0.3;
        ctx.globalAlpha = glow; ctx.fillStyle = '#ffee44';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath(); ctx.moveTo(4, -3); ctx.lineTo(12, -3); ctx.lineTo(10, -1); ctx.lineTo(18, -1);
        ctx.lineTo(16, 1); ctx.lineTo(26, 0); ctx.lineTo(16, 1); ctx.lineTo(18, 3);
        ctx.lineTo(10, 1); ctx.lineTo(12, 3); ctx.lineTo(4, 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4 + Math.sin(t * 10) * 0.3;
        ctx.beginPath(); ctx.moveTo(14, -1); ctx.lineTo(20, 0); ctx.lineTo(14, 1); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#554400'; ctx.fillRect(-6, -2, 6, 4);
    } else if (weaponType === 'fireball') {
        // 雷霆法杖（顶部球状放电）
        ctx.fillStyle = '#554400'; ctx.fillRect(-6, -1.5, 22, 3);
        // 杖头特斯拉线圈
        ctx.fillStyle = '#ffee44'; ctx.globalAlpha = 0.5 + Math.sin(t * 8) * 0.3;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 随机电弧
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            const a = Math.sin(t * 12 + i * 2.1) * TWO_PI_NEW;
            ctx.globalAlpha = 0.4 + Math.sin(t * 15 + i) * 0.3;
            ctx.beginPath(); ctx.moveTo(18, 0);
            ctx.lineTo(18 + Math.cos(a) * 8, Math.sin(a) * 8);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 雷电弓（闪电形弓臂）
        ctx.fillStyle = '#554400'; ctx.fillRect(6, -1, 10, 2);
        // 闪电弓臂上
        ctx.strokeStyle = '#ffdd00'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(6, -3); ctx.lineTo(4, -5); ctx.lineTo(2, -8); ctx.stroke();
        // 闪电弓臂下
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(6, 3); ctx.lineTo(4, 5); ctx.lineTo(2, 8); ctx.stroke();
        // 弦（电弧）
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6 + Math.sin(t * 8) * 0.3;
        ctx.beginPath(); ctx.moveTo(2, -8); ctx.lineTo(12, 0); ctx.lineTo(2, 8); ctx.stroke();
        ctx.globalAlpha = 1;
        // 电箭
        ctx.fillStyle = '#ffee44';
        ctx.beginPath(); ctx.moveTo(12, -1); ctx.lineTo(26, 0); ctx.lineTo(12, 1); ctx.closePath(); ctx.fill();
    } else {
        // necro: 雷霆图腾杖
        ctx.fillStyle = '#554400'; ctx.fillRect(-6, -1.5, 22, 3);
        // 图腾头（骷髅+闪电眼）
        ctx.fillStyle = '#aaa';
        ctx.beginPath(); ctx.arc(18, 0, 5, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#ffee44'; ctx.globalAlpha = 0.6 + Math.sin(t * 5) * 0.3;
        ctx.beginPath(); ctx.arc(16, -1, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(20, -1, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#555'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(16, 2); ctx.lineTo(18, 3); ctx.lineTo(20, 2); ctx.stroke();
    }
};

// 冰川 — 冰晶戟
SkinRenderer.prototype._weapon_glacier = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.5 : 0.2;
        ctx.globalAlpha = glow; ctx.fillStyle = '#88ddff';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        ctx.fillStyle = '#aaeeff';
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(20, -4); ctx.lineTo(12, -2); ctx.lineTo(4, -3);
        ctx.lineTo(4, 3); ctx.lineTo(12, 2); ctx.lineTo(20, 4); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(18, -2); ctx.lineTo(18, 0); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#446688'; ctx.fillRect(-6, -2, 6, 4);
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(10 + Math.sin(t * 3) * 2, -4, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(16 + Math.cos(t * 4) * 2, 4, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else if (weaponType === 'fireball') {
        // 冰霜法杖（顶部冰晶球）
        ctx.fillStyle = '#446688'; ctx.fillRect(-6, -1.5, 22, 3);
        // 冰球
        const iceG = ctx.createRadialGradient(18, 0, 0, 18, 0, 6);
        iceG.addColorStop(0, '#ffffff'); iceG.addColorStop(0.4, '#aaeeff');
        iceG.addColorStop(1, '#4488aa');
        ctx.fillStyle = iceG;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        // 冰晶刺
        ctx.fillStyle = '#ccf0ff'; ctx.globalAlpha = 0.7;
        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * TWO_PI_NEW + t * 0.5;
            ctx.beginPath(); ctx.moveTo(18, 0);
            ctx.lineTo(18 + Math.cos(a) * 9, Math.sin(a) * 9);
            ctx.lineTo(18 + Math.cos(a + 0.3) * 6, Math.sin(a + 0.3) * 6);
            ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 冰弓（冰晶弓臂）
        ctx.fillStyle = '#aaeeff';
        // 弓臂上（冰晶形状）
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(6, -4); ctx.lineTo(3, -7); ctx.lineTo(1, -9);
        ctx.lineTo(3, -8); ctx.lineTo(5, -5); ctx.lineTo(9, -1); ctx.closePath(); ctx.fill();
        // 弓臂下
        ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(6, 4); ctx.lineTo(3, 7); ctx.lineTo(1, 9);
        ctx.lineTo(3, 8); ctx.lineTo(5, 5); ctx.lineTo(9, 1); ctx.closePath(); ctx.fill();
        // 弦（冰丝）
        ctx.strokeStyle = '#ccf0ff'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(1, -9); ctx.lineTo(12, 0); ctx.lineTo(1, 9); ctx.stroke();
        // 冰箭
        ctx.fillStyle = '#88ddff';
        ctx.fillRect(10, -0.8, 14, 1.6);
        ctx.fillStyle = '#ccf0ff';
        ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
    } else {
        // necro: 冰封灵魂灯笼
        ctx.fillStyle = '#446688'; ctx.fillRect(-6, -1.5, 18, 3);
        // 冰灯笼
        ctx.strokeStyle = '#88ccdd'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(16, 0, 6, 0, TWO_PI_NEW); ctx.stroke();
        // 内部灵魂冰火
        ctx.fillStyle = '#aaeeff'; ctx.globalAlpha = 0.4 + Math.sin(t * 3) * 0.2;
        ctx.beginPath(); ctx.arc(16, 0, 4, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(16, -1, 2, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
};

// 暗影 — 虚空匕首
SkinRenderer.prototype._weapon_shadow = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.5 : 0.15;
        ctx.globalAlpha = glow; ctx.fillStyle = '#6622aa';
        ctx.fillRect(-2, -3, 22, 6); ctx.globalAlpha = 1;
        ctx.fillStyle = '#331166'; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.moveTo(22, 0); ctx.lineTo(6, -2.5); ctx.lineTo(0, 0); ctx.lineTo(6, 2.5); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.moveTo(4, 0);
        for (let i = 1; i <= 8; i++) { ctx.lineTo(4 + i * 2.2, Math.sin(t * 6 + i) * 2); }
        ctx.stroke(); ctx.globalAlpha = 1;
        ctx.fillStyle = '#220044'; ctx.fillRect(-5, -2, 5, 4);
    } else if (weaponType === 'fireball') {
        // 暗影法球杖
        ctx.fillStyle = '#220044'; ctx.fillRect(-6, -1.5, 20, 3);
        // 暗影球
        ctx.fillStyle = '#6622aa'; ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        // 暗影漩涡
        ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(18, 0, 4, t * 3, t * 3 + Math.PI * 1.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(18, 0, 3, t * 3 + Math.PI, t * 3 + Math.PI * 2.2); ctx.stroke();
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 暗影弓（影刃弓）
        ctx.fillStyle = '#331166';
        // 弓臂（弯曲暗影）
        ctx.beginPath(); ctx.moveTo(8, 0);
        ctx.quadraticCurveTo(4, -6, 2, -9); ctx.lineTo(3, -8);
        ctx.quadraticCurveTo(5, -5, 9, 0); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8, 0);
        ctx.quadraticCurveTo(4, 6, 2, 9); ctx.lineTo(3, 8);
        ctx.quadraticCurveTo(5, 5, 9, 0); ctx.closePath(); ctx.fill();
        // 暗影弦
        ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(2, -9); ctx.lineTo(12, 0); ctx.lineTo(2, 9); ctx.stroke();
        ctx.globalAlpha = 1;
        // 暗影箭
        ctx.fillStyle = '#6622aa'; ctx.globalAlpha = 0.7;
        ctx.fillRect(10, -0.8, 14, 1.6);
        ctx.fillStyle = '#aa66ff';
        ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(27, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
    } else {
        // necro: 暗影召唤之书
        ctx.fillStyle = '#220044'; ctx.fillRect(-4, -4, 18, 8);
        ctx.fillStyle = '#331166'; ctx.fillRect(-3, -3.5, 16, 7);
        // 符文
        ctx.strokeStyle = '#aa66ff'; ctx.lineWidth = 0.8; ctx.globalAlpha = 0.5 + Math.sin(t * 2) * 0.2;
        ctx.beginPath(); ctx.arc(6, 0, 3, 0, TWO_PI_NEW); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(4, -2); ctx.lineTo(8, 0); ctx.lineTo(4, 2); ctx.stroke();
        ctx.globalAlpha = 1;
    }
};

// 九尾 — 妖狐火扇;

// 龙王 — 金龙鳞剑;

// 悟空 — 如意金箍棒;

// 虚空行者 — 空间裂隙刃
SkinRenderer.prototype._weapon_voidwalker = function(ctx, weaponType, attacking) {
    const t = this._time;
    if (weaponType === 'sword' || weaponType === 'dagger' || weaponType === 'hammer') {
        const glow = attacking ? 0.6 : 0.2;
        ctx.globalAlpha = glow; ctx.fillStyle = '#8800ff';
        ctx.fillRect(-2, -4, 28, 8); ctx.globalAlpha = 1;
        // 裂隙刃
        ctx.fillStyle = '#440088';
        ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(18, -4); ctx.lineTo(4, -1.5); ctx.lineTo(4, 1.5); ctx.lineTo(18, 4); ctx.closePath(); ctx.fill();
        // 虚空裂纹
        ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.6 + Math.sin(t * 7) * 0.3;
        ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(10, -2); ctx.lineTo(14, 1); ctx.lineTo(18, -1); ctx.lineTo(24, 0); ctx.stroke();
        ctx.globalAlpha = 1; ctx.fillStyle = '#220044'; ctx.fillRect(-5, -2, 5, 4);
    } else if (weaponType === 'fireball') {
        // 虚空法杖 — 次元裂隙杖
        ctx.fillStyle = '#220044'; ctx.fillRect(-6, -1.5, 22, 3);
        // 虚空球
        ctx.fillStyle = '#8800ff'; ctx.globalAlpha = 0.4 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 旋转裂隙
        ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(18, 0, 5, t * 3, t * 3 + Math.PI); ctx.stroke();
        ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_NEW); ctx.fill();
    } else if (weaponType === 'bow') {
        // 虚空弓 — 裂隙弓
        ctx.strokeStyle = '#6622cc'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        // 虚空能量弦
        ctx.strokeStyle = '#cc88ff'; ctx.lineWidth = 1; ctx.globalAlpha = 0.7 + Math.sin(t * 4) * 0.2;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        ctx.globalAlpha = 1;
        if (attacking) {
            ctx.fillStyle = '#8800ff'; ctx.globalAlpha = 0.7;
            ctx.fillRect(8, -1, 16, 2);
            ctx.fillStyle = '#cc88ff';
            ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else {
        // 亡灵法器 — 虚空骷髅权杖
        ctx.fillStyle = '#220044'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#8800ff'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 骷髅头
        ctx.fillStyle = '#cc88ff';
        ctx.beginPath(); ctx.arc(18, 0, 4, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#440088';
        ctx.beginPath(); ctx.arc(16.5, -1, 1.2, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(19.5, -1, 1.2, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.moveTo(17, 2); ctx.lineTo(19, 2); ctx.lineTo(18, 3); ctx.closePath(); ctx.fill();
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
    } else if (weaponType === 'fireball') {
        // 血月法杖 — 月牙杖
        ctx.fillStyle = '#331111'; ctx.fillRect(-6, -1.5, 22, 3);
        // 血月球
        ctx.fillStyle = '#cc0000'; ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 月牙
        ctx.fillStyle = '#ff4444';
        ctx.beginPath(); ctx.arc(18, 0, 5, 0.3, TWO_PI_NEW - 0.3); ctx.arc(18, -1, 4, TWO_PI_NEW - 0.3, 0.3, true); ctx.fill();
    } else if (weaponType === 'bow') {
        // 血月弓 — 骨弓
        ctx.strokeStyle = '#880000'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        // 骨节装饰
        ctx.fillStyle = '#ddccbb';
        for (let i = 0; i < 3; i++) {
            const ba = -0.5 + i * 0.5;
            ctx.beginPath(); ctx.arc(8 + Math.cos(ba) * 12, Math.sin(ba) * 12, 2, 0, TWO_PI_NEW); ctx.fill();
        }
        // 血色弦
        ctx.strokeStyle = '#ff2222'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        if (attacking) {
            ctx.fillStyle = '#880000'; ctx.fillRect(8, -1, 16, 2);
            ctx.fillStyle = '#ff2222';
            ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
        }
    } else {
        // 亡灵法器 — 血骨权杖
        ctx.fillStyle = '#331111'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#cc0000'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 血色骷髅
        ctx.fillStyle = '#ffcccc';
        ctx.beginPath(); ctx.arc(18, -1, 4, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#cc0000';
        ctx.beginPath(); ctx.arc(16.5, -2, 1.2, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(19.5, -2, 1.2, 0, TWO_PI_NEW); ctx.fill();
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
    } else if (weaponType === 'fireball') {
        // 混沌法杖 — 多彩能量球
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = `hsl(${hue},80%,50%)`; ctx.globalAlpha = 0.5 + Math.sin(t * 4) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 旋转眼球
        ctx.fillStyle = `hsl(${(hue + 120) % 360},80%,60%)`;
        ctx.beginPath(); ctx.ellipse(18, 0, 5, 3, t * 2, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(18, 0, 2, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(17, -1, 1, 0, TWO_PI_NEW); ctx.fill();
    } else if (weaponType === 'bow') {
        // 混沌弓 — 色变弓
        ctx.strokeStyle = `hsl(${hue},80%,50%)`; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        ctx.strokeStyle = `hsl(${(hue + 180) % 360},80%,60%)`; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        if (attacking) {
            ctx.fillStyle = `hsl(${hue},80%,50%)`; ctx.globalAlpha = 0.7;
            ctx.fillRect(8, -1, 16, 2);
            ctx.fillStyle = `hsl(${(hue + 60) % 360},80%,60%)`;
            ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else {
        // 亡灵法器 — 混沌魔眼权杖
        ctx.fillStyle = '#222'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = `hsl(${hue},80%,50%)`; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
        // 多彩眼球
        ctx.fillStyle = `hsl(${(hue + 90) % 360},80%,50%)`;
        ctx.beginPath(); ctx.ellipse(18, 0, 5, 3, t, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.ellipse(18, 0, 2, 2.5, 0, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(17, -1, 1, 0, TWO_PI_NEW); ctx.fill();
    }
};

