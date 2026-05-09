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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#4488ff', 0.22);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形轮廓：电球/等离子体形态，边缘不规则 ===
    const plasmaPath = (wobble) => {
        ctx.beginPath();
        const points = 24;
        for (let i = 0; i <= points; i++) {
            const a = (i / points) * TWO_PI_NEW;
            const noise = wobble ? Math.sin(a * 5 + t * 8) * r * 0.06 + Math.sin(a * 3 + t * 5) * r * 0.04 : 0;
            const pr = r + noise;
            const px = Math.cos(a) * pr, py = Math.sin(a) * pr;
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
    };
    // 电磁场外环（透明蓝色脉冲）
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.12 + Math.sin(t * 6) * 0.05;
        ctx.strokeStyle = '#4488ff'; ctx.lineWidth = r * 0.08;
        plasmaPath(true); ctx.stroke();
        ctx.globalAlpha = 1;
    }
    // 主体 - 等离子球核心（多层渐变，从白热中心到蓝紫边缘）
    ctx.save(); plasmaPath(true); ctx.clip();
    const coreG = ctx.createRadialGradient(-r * 0.15, -r * 0.1, 0, 0, 0, r);
    coreG.addColorStop(0, '#ffffff'); coreG.addColorStop(0.15, '#ddeeff');
    coreG.addColorStop(0.3, '#88bbff'); coreG.addColorStop(0.55, '#3366dd');
    coreG.addColorStop(0.8, '#1133aa'); coreG.addColorStop(1, '#0a1155');
    ctx.fillStyle = coreG; ctx.fillRect(-r * 1.1, -r * 1.1, r * 2.2, r * 2.2);
    // 内部电流涟漪
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 0.5;
        for (let ring = 1; ring <= 4; ring++) {
            const rr = r * ring * 0.2 + Math.sin(t * 4 + ring) * r * 0.03;
            ctx.beginPath(); ctx.arc(0, 0, rr, 0, TWO_PI_NEW); ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // === 表面利萨如闪电纹路 ===
    if (this.quality.detailLevel >= 1) {
        ctx.save(); plasmaPath(false); ctx.clip();
        ctx.globalAlpha = 0.3; ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
        for (let arm = 0; arm < 4; arm++) {
            ctx.beginPath();
            const baseA = arm * TWO_PI_NEW / 4 + t * 2;
            for (let s = 0; s <= 16; s++) {
                const frac = s / 16;
                const lx = Math.sin(baseA + frac * 6 + t * 3) * r * frac * 0.7;
                const ly = Math.cos(baseA + frac * 4 + t * 2.5) * r * frac * 0.7;
                s === 0 ? ctx.moveTo(lx, ly) : ctx.lineTo(lx, ly);
            }
            ctx.stroke();
        }
        ctx.restore();
    }
    // === 闪电链 - 从核心向外延伸的真实闪电 ===
    ctx.globalAlpha = 0.8; ctx.lineCap = 'round';
    const boltCount = this.quality.detailLevel >= 2 ? 6 : 4;
    for (let b = 0; b < boltCount; b++) {
        const boltAngle = (b / boltCount) * TWO_PI_NEW + t * 1.5 + Math.sin(t * 3 + b * 1.7) * 0.3;
        const boltLen = r * (0.7 + Math.sin(t * 4 + b * 2.3) * 0.3);
        // 使用确定性随机生成闪电路径
        const segments = 6;
        const pts = [{x: 0, y: 0}];
        for (let s = 1; s <= segments; s++) {
            const frac = s / segments;
            const baseX = Math.cos(boltAngle) * boltLen * frac;
            const baseY = Math.sin(boltAngle) * boltLen * frac;
            // 正弦偏移模拟锯齿
            const perpA = boltAngle + Math.PI * 0.5;
            const offset = Math.sin(s * 3.7 + t * 8 + b * 2.1) * r * 0.12 * (1 - frac * 0.5);
            pts.push({x: baseX + Math.cos(perpA) * offset, y: baseY + Math.sin(perpA) * offset});
        }
        // 外发光层
        ctx.strokeStyle = 'rgba(100,180,255,0.4)'; ctx.lineWidth = 4;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) i === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        // 主闪电
        ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) i === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        // 内核（白色）
        ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.8;
        ctx.beginPath();
        for (let i = 0; i < pts.length; i++) i === 0 ? ctx.moveTo(pts[i].x, pts[i].y) : ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
        // 分支闪电
        if (this.quality.detailLevel >= 2 && b % 2 === 0) {
            const branchFrom = 3;
            const branchA = boltAngle + (b % 2 ? 0.5 : -0.5);
            ctx.strokeStyle = 'rgba(150,200,255,0.4)'; ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[branchFrom].x, pts[branchFrom].y);
            ctx.lineTo(pts[branchFrom].x + Math.cos(branchA) * r * 0.2,
                       pts[branchFrom].y + Math.sin(branchA) * r * 0.2);
            ctx.stroke();
        }
    }
    // === 眼睛 - 纯白光点（雷神之眼）===
    ctx.globalAlpha = 0.9;
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.22, ey = -r * 0.15;
        // 眼眶电弧
        ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.09, 0, TWO_PI_NEW); ctx.stroke();
        // 眼球发光
        const eyeG = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 0.07);
        eyeG.addColorStop(0, '#ffffff'); eyeG.addColorStop(0.6, '#88ccff'); eyeG.addColorStop(1, '#2244aa');
        ctx.fillStyle = eyeG;
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.07, 0, TWO_PI_NEW); ctx.fill();
    }
    // === 电弧环（围绕身体的旋转电弧）===
    ctx.globalAlpha = 0.5; ctx.strokeStyle = '#66aaff'; ctx.lineWidth = 1.5;
    const arcStart = t * 6;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.1, arcStart, arcStart + Math.PI * 0.7); ctx.stroke();
    ctx.strokeStyle = '#aaddff'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.15, arcStart + Math.PI, arcStart + Math.PI * 1.5); ctx.stroke();
    // === 电火花粒子 ===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.6;
        for (let i = 0; i < 8; i++) {
            const pa = t * 3 + i * 0.8;
            const pd = r * (0.9 + Math.sin(t * 5 + i * 1.7) * 0.3);
            ctx.fillStyle = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#88ccff' : '#4466ff';
            ctx.beginPath(); ctx.arc(Math.cos(pa) * pd, Math.sin(pa) * pd, 1.2, 0, TWO_PI_NEW); ctx.fill();
        }
    }
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#88ddff', 0.15);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形轮廓：不规则多面体冰晶形态 ===
    const crystalPoints = [];
    const faces = 8;
    for (let i = 0; i < faces; i++) {
        const a = (i / faces) * TWO_PI_NEW - Math.PI / 8;
        const cr = r * (0.85 + (i % 2) * 0.2 + Math.sin(i * 2.1) * 0.05);
        crystalPoints.push({x: Math.cos(a) * cr, y: Math.sin(a) * cr});
    }
    const crystalPath = () => {
        ctx.beginPath();
        for (let i = 0; i <= faces; i++) {
            const p = crystalPoints[i % faces];
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
    };
    // 主冰体 - 半透明冰蓝色多层渐变
    ctx.save(); crystalPath(); ctx.clip();
    const iceG = ctx.createRadialGradient(-r * 0.2, -r * 0.25, 0, r * 0.1, r * 0.1, r * 1.1);
    iceG.addColorStop(0, '#e8f8ff'); iceG.addColorStop(0.2, '#bbeeff');
    iceG.addColorStop(0.45, '#66ccee'); iceG.addColorStop(0.7, '#2299bb');
    iceG.addColorStop(1, '#0d4466');
    ctx.fillStyle = iceG; ctx.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
    // 冰体内部气泡/裂纹
    if (this.quality.detailLevel >= 2) {
        // 气泡
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ffffff';
        const bubbles = [[0.2, -0.3, 0.04], [-0.3, 0.1, 0.03], [0.1, 0.3, 0.025], [-0.15, -0.4, 0.02], [0.35, 0.15, 0.018]];
        for (const [bx, by, bs] of bubbles) {
            ctx.beginPath(); ctx.arc(bx * r, by * r, bs * r, 0, TWO_PI_NEW); ctx.fill();
        }
        // 内部裂纹
        ctx.globalAlpha = 0.12; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.6;
        for (let i = 0; i < 4; i++) {
            const cx = (Math.sin(i * 2.7) * 0.4) * r;
            const cy = (Math.cos(i * 3.2) * 0.4) * r;
            ctx.beginPath(); ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.sin(i * 1.3) * r * 0.25, cy + Math.cos(i * 1.8) * r * 0.25);
            ctx.lineTo(cx + Math.sin(i * 2.1) * r * 0.35, cy + Math.cos(i * 0.7) * r * 0.3);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 冰晶面分割 - 每个面独立着色（明暗面）
    if (this.quality.detailLevel >= 1) {
        for (let i = 0; i < faces; i++) {
            const p1 = crystalPoints[i];
            const p2 = crystalPoints[(i + 1) % faces];
            // 从中心到边的三角面
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.closePath();
            // 根据面的角度决定明暗
            const faceAngle = Math.atan2((p1.y + p2.y) / 2, (p1.x + p2.x) / 2);
            const lightFactor = (Math.cos(faceAngle + 0.8) + 1) / 2; // 光源从左上
            ctx.fillStyle = `rgba(200,240,255,${0.02 + lightFactor * 0.08})`;
            ctx.fill();
            // 面的边线
            ctx.strokeStyle = `rgba(150,220,255,${0.2 + lightFactor * 0.2})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            // 到中心的棱线
            ctx.strokeStyle = 'rgba(150,220,255,0.1)'; ctx.lineWidth = 0.4;
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2); ctx.stroke();
        }
    }
    // 外轮廓描边
    ctx.strokeStyle = 'rgba(180,240,255,0.6)'; ctx.lineWidth = 1.5;
    crystalPath(); ctx.stroke();
    // === 表面霜花纹理 ===
    if (this.quality.detailLevel >= 2) {
        ctx.save(); crystalPath(); ctx.clip();
        ctx.globalAlpha = 0.08; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.5;
        // 树突状霜花（分形）
        for (let i = 0; i < 6; i++) {
            const fa = (i / 6) * TWO_PI_NEW + 0.3;
            const fd = r * 0.3;
            const fx = Math.cos(fa) * fd, fy = Math.sin(fa) * fd;
            ctx.beginPath(); ctx.moveTo(fx, fy);
            const tipX = fx + Math.cos(fa) * r * 0.4;
            const tipY = fy + Math.sin(fa) * r * 0.4;
            ctx.lineTo(tipX, tipY); ctx.stroke();
            // 分支
            for (let b = 1; b <= 2; b++) {
                const bf = b / 3;
                const bx = fx + (tipX - fx) * bf;
                const by = fy + (tipY - fy) * bf;
                for (let s = -1; s <= 1; s += 2) {
                    const brA = fa + s * 0.6;
                    ctx.beginPath(); ctx.moveTo(bx, by);
                    ctx.lineTo(bx + Math.cos(brA) * r * 0.12, by + Math.sin(brA) * r * 0.12);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();
    }
    // === 核心冷光（内部发光的冷核）===
    ctx.globalAlpha = 0.4 + Math.sin(t * 2) * 0.1;
    const coldG = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.35);
    coldG.addColorStop(0, '#ffffff'); coldG.addColorStop(0.5, '#88ddff');
    coldG.addColorStop(1, 'transparent');
    ctx.fillStyle = coldG;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 主高光（大块白色反射面）===
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.6); ctx.lineTo(-r * 0.1, -r * 0.7);
    ctx.lineTo(r * 0.1, -r * 0.3); ctx.lineTo(-r * 0.3, -r * 0.25);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    // === 浮冰碎片（围绕主体）===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 5; i++) {
            const fa = t * 0.5 + i * TWO_PI_NEW / 5;
            const fd = r * (1.2 + Math.sin(t * 1.5 + i) * 0.15);
            const fx = Math.cos(fa) * fd, fy = Math.sin(fa) * fd;
            const fs = r * 0.06 + Math.sin(i * 1.7) * r * 0.02;
            ctx.save(); ctx.translate(fx, fy); ctx.rotate(t + i);
            // 小菱形冰碎片
            ctx.fillStyle = '#aaeeff';
            ctx.beginPath();
            ctx.moveTo(0, -fs); ctx.lineTo(fs * 0.6, 0);
            ctx.lineTo(0, fs); ctx.lineTo(-fs * 0.6, 0);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = 'rgba(200,240,255,0.5)'; ctx.lineWidth = 0.5;
            ctx.stroke();
            ctx.restore();
        }
    }
    // === 冷气雾（底部升起的冷气）===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 4; i++) {
            const mx = (i - 1.5) * r * 0.4;
            const my = r * 0.7 + Math.sin(t * 1.5 + i) * r * 0.1;
            const mg = ctx.createRadialGradient(mx, my, 0, mx, my, r * 0.2);
            mg.addColorStop(0, '#cceeFF'); mg.addColorStop(1, 'transparent');
            ctx.fillStyle = mg;
            ctx.beginPath(); ctx.arc(mx, my, r * 0.2, 0, TWO_PI_NEW); ctx.fill();
        }
    }
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#6600cc', 0.15);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形：暗影斗篷造型 — 上半身带兜帽的幽灵形态 ===
    // 底层暗影雾气轮廓（不规则，带飘逸的边缘）
    const cloakPath = () => {
        ctx.beginPath();
        // 兜帽顶部（尖头）
        ctx.moveTo(0, -r * 1.05);
        // 兜帽左侧弧线
        ctx.bezierCurveTo(-r * 0.3, -r * 0.95, -r * 0.7, -r * 0.65, -r * 0.8, -r * 0.3);
        // 左肩到左下角（飘逸边缘）
        ctx.bezierCurveTo(-r * 0.9, -r * 0.05, -r * 0.85, r * 0.3, -r * 0.7, r * 0.5);
        // 左下飘带
        const waveL = Math.sin(t * 3) * r * 0.05;
        ctx.bezierCurveTo(-r * 0.65 + waveL, r * 0.7, -r * 0.5 + waveL, r * 0.9, -r * 0.3, r * 0.95);
        // 底部（碎裂边缘）
        ctx.bezierCurveTo(-r * 0.15, r * 1.0, 0, r * 0.9, r * 0.15, r * 0.95);
        ctx.bezierCurveTo(r * 0.3, r * 1.0, r * 0.5, r * 0.9, r * 0.3, r * 0.95);
        // 右下飘带
        const waveR = Math.sin(t * 3 + 1) * r * 0.05;
        ctx.bezierCurveTo(r * 0.5 + waveR, r * 0.7, r * 0.65 + waveR, r * 0.5, r * 0.7, r * 0.4);
        // 右肩到右侧兜帽
        ctx.bezierCurveTo(r * 0.85, r * 0.1, r * 0.9, -r * 0.1, r * 0.8, -r * 0.3);
        ctx.bezierCurveTo(r * 0.7, -r * 0.65, r * 0.3, -r * 0.95, 0, -r * 1.05);
        ctx.closePath();
    };
    // 外层暗影剪影
    ctx.save(); cloakPath(); ctx.clip();
    // 斗篷深色渐变
    const cloakG = ctx.createLinearGradient(0, -r, 0, r);
    cloakG.addColorStop(0, '#1a0033'); cloakG.addColorStop(0.3, '#0d001a');
    cloakG.addColorStop(0.7, '#110022'); cloakG.addColorStop(1, '#050008');
    ctx.fillStyle = cloakG; ctx.fillRect(-r, -r * 1.1, r * 2, r * 2.2);
    // 布料褶皱纹理
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.08; ctx.strokeStyle = '#6600cc'; ctx.lineWidth = 0.7;
        for (let i = 0; i < 8; i++) {
            const foldX = -r * 0.5 + i * r * 0.13;
            ctx.beginPath();
            ctx.moveTo(foldX, -r * 0.6);
            ctx.quadraticCurveTo(foldX + Math.sin(t + i) * r * 0.03, 0, foldX - r * 0.02, r * 0.8);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    // 暗紫雾气层
    ctx.globalAlpha = 0.15;
    const fogG = ctx.createRadialGradient(0, r * 0.3, 0, 0, 0, r * 0.9);
    fogG.addColorStop(0, '#6600cc'); fogG.addColorStop(0.5, '#330066');
    fogG.addColorStop(1, 'transparent');
    ctx.fillStyle = fogG; ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.globalAlpha = 1;
    ctx.restore();
    // 斗篷轮廓边缘（发光暗影边）
    ctx.strokeStyle = '#6600cc'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.35;
    cloakPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 兜帽内的面部区域（深邃的黑暗，只有眼睛）===
    // 兜帽内部阴影
    const hoodG = ctx.createRadialGradient(0, -r * 0.3, 0, 0, -r * 0.3, r * 0.4);
    hoodG.addColorStop(0, '#000000'); hoodG.addColorStop(0.5, '#050005');
    hoodG.addColorStop(1, '#0d001a');
    ctx.fillStyle = hoodG;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.3, r * 0.45, r * 0.4, 0, 0, TWO_PI_NEW);
    ctx.fill();
    // === 幽灵之眼 — 两个发光的紫色眼睛 ===
    const eyeW = r * 0.12, eyeH = r * 0.05;
    const eyeSpacing = r * 0.18, eyeY = -r * 0.35;
    const blinkFactor = Math.max(0, Math.sin(t * 0.5));
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * eyeSpacing;
        // 眼部发光光晕
        ctx.globalAlpha = 0.4; ctx.fillStyle = '#aa44ff';
        ctx.beginPath(); ctx.ellipse(ex, eyeY, eyeW * 1.5, eyeH * 2.5, 0, 0, TWO_PI_NEW); ctx.fill();
        // 眼形（菱形狭长眼）
        ctx.globalAlpha = 0.9; ctx.fillStyle = '#cc66ff';
        ctx.beginPath();
        ctx.moveTo(ex - eyeW, eyeY);
        ctx.quadraticCurveTo(ex, eyeY - eyeH * blinkFactor, ex + eyeW, eyeY);
        ctx.quadraticCurveTo(ex, eyeY + eyeH * blinkFactor, ex - eyeW, eyeY);
        ctx.closePath(); ctx.fill();
        // 瞳孔
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(ex, eyeY, eyeW * 0.25, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // === 暗影刀刃 / 锋刃手臂（左右飘出的暗影锋刃）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.3;
        for (let side = -1; side <= 1; side += 2) {
            const bladeA = side * 0.6 + Math.sin(t * 2 + side) * 0.1;
            ctx.save(); ctx.rotate(bladeA);
            // 锋刃形状
            ctx.fillStyle = '#4400aa';
            ctx.beginPath();
            ctx.moveTo(r * 0.5, 0);
            ctx.lineTo(r * 1.1, -r * 0.04);
            ctx.lineTo(r * 1.2, 0);
            ctx.lineTo(r * 1.1, r * 0.04);
            ctx.closePath(); ctx.fill();
            // 刃边发光
            ctx.strokeStyle = '#aa44ff'; ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
    // === 底部消散粒子（暗影碎片向下消散）===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.4;
        for (let i = 0; i < 12; i++) {
            const px = -r * 0.4 + i * r * 0.07 + Math.sin(t * 2 + i * 0.5) * r * 0.03;
            const py = r * 0.7 + Math.sin(t * 1.5 + i * 0.4) * r * 0.15 + (t * 10 + i * 7) % (r * 0.3);
            const pSize = 1 + Math.random() * 1.5;
            ctx.fillStyle = i % 2 === 0 ? '#330055' : '#6600aa';
            ctx.fillRect(px - pSize / 2, py - pSize / 2, pSize, pSize);
        }
        ctx.globalAlpha = 1;
    }
    // === 暗影符文环 ===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.1; ctx.strokeStyle = '#8844cc'; ctx.lineWidth = 0.6;
        ctx.setLineDash([r * 0.02, r * 0.05]); ctx.lineDashOffset = t * 20;
        ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, TWO_PI_NEW); ctx.stroke();
        ctx.setLineDash([]);
        // 几个符文符号
        ctx.globalAlpha = 0.12; ctx.font = (r * 0.12) + 'px serif';
        ctx.fillStyle = '#aa55ff'; ctx.textAlign = 'center';
        const runes = ['\u2666', '\u2605', '\u2667', '\u2662'];
        for (let i = 0; i < 4; i++) {
            const ra = (i / 4) * TWO_PI_NEW + t * 0.4;
            ctx.fillText(runes[i], Math.cos(ra) * r * 0.7, Math.sin(ra) * r * 0.7 + r * 0.04);
        }
        ctx.globalAlpha = 1;
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
    // === 非圆形：九尾妖狐头部造型 — 尖耳三角脸+九尾 ===
    // 狐狸头部轮廓（三角形脸+尖耳朵）
    const foxHeadPath = () => {
        ctx.beginPath();
        // 左耳尖
        ctx.moveTo(-r * 0.35, -r * 0.95);
        // 左耳内侧到头顶
        ctx.lineTo(-r * 0.25, -r * 0.6);
        ctx.quadraticCurveTo(-r * 0.1, -r * 0.75, 0, -r * 0.7);
        // 头顶到右耳
        ctx.quadraticCurveTo(r * 0.1, -r * 0.75, r * 0.25, -r * 0.6);
        ctx.lineTo(r * 0.35, -r * 0.95);
        // 右耳外侧
        ctx.lineTo(r * 0.45, -r * 0.55);
        // 右脸颊（圆润的狐狸脸）
        ctx.bezierCurveTo(r * 0.55, -r * 0.3, r * 0.5, -r * 0.05, r * 0.4, r * 0.1);
        // 下颌到下巴（V形尖下巴）
        ctx.bezierCurveTo(r * 0.3, r * 0.25, r * 0.15, r * 0.4, 0, r * 0.45);
        // 左脸颊
        ctx.bezierCurveTo(-r * 0.15, r * 0.4, -r * 0.3, r * 0.25, -r * 0.4, r * 0.1);
        ctx.bezierCurveTo(-r * 0.5, -r * 0.05, -r * 0.55, -r * 0.3, -r * 0.45, -r * 0.55);
        ctx.closePath();
    };
    // 九尾（在头部后方扇形展开）
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.7;
        for (let i = 0; i < 9; i++) {
            const tailA = (-0.6 + i * 0.15) + Math.sin(t * 2 + i * 0.4) * 0.08;
            const tailLen = r * (0.7 + Math.sin(t * 1.5 + i * 0.5) * 0.1);
            const tailW = r * 0.06;
            ctx.save(); ctx.rotate(tailA + Math.PI * 0.5);
            // 尾巴渐变
            const tailG = ctx.createLinearGradient(0, r * 0.3, 0, r * 0.3 + tailLen);
            tailG.addColorStop(0, '#ff8833'); tailG.addColorStop(0.7, '#ffaa44');
            tailG.addColorStop(1, '#ffffff');
            ctx.fillStyle = tailG;
            ctx.beginPath();
            ctx.moveTo(-tailW, r * 0.3);
            ctx.quadraticCurveTo(-tailW * 1.3, r * 0.3 + tailLen * 0.5, -tailW * 0.3, r * 0.3 + tailLen);
            ctx.lineTo(tailW * 0.3, r * 0.3 + tailLen);
            ctx.quadraticCurveTo(tailW * 1.3, r * 0.3 + tailLen * 0.5, tailW, r * 0.3);
            ctx.closePath(); ctx.fill();
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
    // 头部填充
    ctx.save(); foxHeadPath(); ctx.clip();
    // 狐狸毛色渐变（金橙色）
    const furG = ctx.createRadialGradient(0, -r * 0.2, 0, 0, 0, r * 0.7);
    furG.addColorStop(0, '#ffcc66'); furG.addColorStop(0.4, '#ff9933');
    furG.addColorStop(0.7, '#ee7711'); furG.addColorStop(1, '#cc5500');
    ctx.fillStyle = furG; ctx.fillRect(-r * 0.6, -r, r * 1.2, r * 1.5);
    // 毛发纹理
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.08; ctx.strokeStyle = '#cc5500'; ctx.lineWidth = 0.6;
        for (let i = 0; i < 20; i++) {
            const fx = -r * 0.4 + Math.random() * r * 0.8;
            const fy = -r * 0.7 + Math.random() * r * 1.0;
            ctx.beginPath(); ctx.moveTo(fx, fy);
            ctx.lineTo(fx + Math.sin(t + i) * r * 0.03, fy + r * 0.08);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
    // 白色面部区域（狐狸脸中间白毛）
    ctx.fillStyle = '#fff8ee'; ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, -r * 0.4);
    ctx.quadraticCurveTo(0, -r * 0.5, r * 0.15, -r * 0.4);
    ctx.bezierCurveTo(r * 0.2, -r * 0.2, r * 0.15, r * 0.1, 0, r * 0.35);
    ctx.bezierCurveTo(-r * 0.15, r * 0.1, -r * 0.2, -r * 0.2, -r * 0.15, -r * 0.4);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    // 轮廓描边
    ctx.strokeStyle = '#cc5500'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.5;
    foxHeadPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 耳朵内部（粉色耳内）===
    for (let side = -1; side <= 1; side += 2) {
        const earX = side * r * 0.32, earTipY = -r * 0.9;
        ctx.fillStyle = '#ffaaaa'; ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(earX, earTipY + r * 0.1);
        ctx.lineTo(earX - side * r * 0.04, earTipY + r * 0.25);
        ctx.lineTo(earX + side * r * 0.04, earTipY + r * 0.25);
        ctx.closePath(); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // === 狐狸眼睛（狭长妖艳的眼睛）===
    const eyeY = -r * 0.25;
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.16;
        // 眼白
        ctx.fillStyle = '#ffffee';
        ctx.beginPath();
        ctx.moveTo(ex - r * 0.1, eyeY);
        ctx.quadraticCurveTo(ex, eyeY - r * 0.06, ex + r * 0.1, eyeY);
        ctx.quadraticCurveTo(ex, eyeY + r * 0.04, ex - r * 0.1, eyeY);
        ctx.closePath(); ctx.fill();
        // 虹膜（金色）
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.ellipse(ex, eyeY, r * 0.04, r * 0.035, 0, 0, TWO_PI_NEW); ctx.fill();
        // 竖瞳
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.ellipse(ex, eyeY, r * 0.015, r * 0.03, 0, 0, TWO_PI_NEW); ctx.fill();
        // 高光
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(ex + r * 0.02, eyeY - r * 0.015, r * 0.01, 0, TWO_PI_NEW); ctx.fill();
    }
    // === 鼻子（小三角黑鼻）===
    ctx.fillStyle = '#331100';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.05);
    ctx.lineTo(-r * 0.03, r * 0.1);
    ctx.lineTo(r * 0.03, r * 0.1);
    ctx.closePath(); ctx.fill();
    // === 妖狐火焰光球（浮在周围的狐火）===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 5; i++) {
            const fa = t * 1.2 + i * 1.26;
            const fd = r * (0.7 + Math.sin(t + i) * 0.15);
            const fx = Math.cos(fa) * fd, fy = Math.sin(fa) * fd - r * 0.2;
            const fireG = ctx.createRadialGradient(fx, fy, 0, fx, fy, r * 0.06);
            fireG.addColorStop(0, '#ffffff'); fireG.addColorStop(0.3, '#ffcc44');
            fireG.addColorStop(0.7, '#ff6600'); fireG.addColorStop(1, 'transparent');
            ctx.fillStyle = fireG;
            ctx.beginPath(); ctx.arc(fx, fy, r * 0.06, 0, TWO_PI_NEW); ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
    // === 面部标记（狐妖纹路）===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.3; ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 0.8;
        // 眼角延伸线
        for (let side = -1; side <= 1; side += 2) {
            ctx.beginPath();
            ctx.moveTo(side * r * 0.26, eyeY);
            ctx.quadraticCurveTo(side * r * 0.32, eyeY + r * 0.02, side * r * 0.35, eyeY + r * 0.05);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
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
    this._shadow(ctx, x, y, r); this._glow(ctx, x, y, r, '#ffcc00', 0.2);
    ctx.save(); ctx.translate(x, y);
    // === 非圆形：东方龙首造型 — 龙王头部正面（龙角+龙鳞+龙须）===
    // 龙头轮廓（方长脸型+头顶龙角）
    const dragonPath = () => {
        ctx.beginPath();
        // 左角
        ctx.moveTo(-r * 0.5, -r * 1.0);
        ctx.lineTo(-r * 0.35, -r * 0.6);
        // 头顶左侧
        ctx.quadraticCurveTo(-r * 0.25, -r * 0.65, -r * 0.15, -r * 0.6);
        // 额头
        ctx.quadraticCurveTo(0, -r * 0.65, r * 0.15, -r * 0.6);
        // 头顶右侧到右角
        ctx.quadraticCurveTo(r * 0.25, -r * 0.65, r * 0.35, -r * 0.6);
        ctx.lineTo(r * 0.5, -r * 1.0);
        // 右角回到右侧
        ctx.lineTo(r * 0.4, -r * 0.55);
        // 右太阳穴到右腮
        ctx.bezierCurveTo(r * 0.55, -r * 0.4, r * 0.6, -r * 0.15, r * 0.55, r * 0.05);
        // 右下颌（方形龙嘴）
        ctx.bezierCurveTo(r * 0.5, r * 0.25, r * 0.4, r * 0.4, r * 0.3, r * 0.5);
        // 下巴
        ctx.quadraticCurveTo(r * 0.15, r * 0.6, 0, r * 0.55);
        // 左下颌
        ctx.quadraticCurveTo(-r * 0.15, r * 0.6, -r * 0.3, r * 0.5);
        ctx.bezierCurveTo(-r * 0.4, r * 0.4, -r * 0.5, r * 0.25, -r * 0.55, r * 0.05);
        // 左腮到左太阳穴
        ctx.bezierCurveTo(-r * 0.6, -r * 0.15, -r * 0.55, -r * 0.4, -r * 0.4, -r * 0.55);
        ctx.closePath();
    };
    // 填充龙头
    ctx.save(); dragonPath(); ctx.clip();
    // 龙鳞底色（金色渐变）
    const scaleG = ctx.createLinearGradient(0, -r, 0, r * 0.6);
    scaleG.addColorStop(0, '#ffdd44'); scaleG.addColorStop(0.3, '#ddaa22');
    scaleG.addColorStop(0.5, '#cc8800'); scaleG.addColorStop(0.8, '#996600');
    scaleG.addColorStop(1, '#664400');
    ctx.fillStyle = scaleG; ctx.fillRect(-r * 0.7, -r * 1.1, r * 1.4, r * 1.7);
    // 龙鳞纹理（六角鳞片网格）
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.12; ctx.strokeStyle = '#885500'; ctx.lineWidth = 0.6;
        const sR = r * 0.06;
        const sH = sR * 1.7;
        for (let row = -7; row <= 7; row++) {
            for (let col = -7; col <= 7; col++) {
                const sx = col * sR * 1.5;
                const sy = row * sH * 0.5 + (col % 2) * sH * 0.25;
                if (sx * sx + sy * sy > r * r * 0.9) continue;
                ctx.beginPath();
                ctx.ellipse(sx, sy, sR * 0.6, sR * 0.8, 0, 0, TWO_PI_NEW);
                ctx.stroke();
            }
        }
        ctx.globalAlpha = 1;
    }
    ctx.restore();
    // 龙头轮廓描边
    ctx.strokeStyle = '#aa7700'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.5;
    dragonPath(); ctx.stroke(); ctx.globalAlpha = 1;
    // === 龙角细节 ===
    for (let side = -1; side <= 1; side += 2) {
        const hornX = side * r * 0.43, hornBaseY = -r * 0.57;
        // 角的渐变
        const hornG = ctx.createLinearGradient(hornX, hornBaseY, side * r * 0.5, -r * 1.0);
        hornG.addColorStop(0, '#996633'); hornG.addColorStop(0.5, '#ccaa55');
        hornG.addColorStop(1, '#ffdd88');
        ctx.fillStyle = hornG;
        ctx.beginPath();
        ctx.moveTo(hornX - side * r * 0.04, hornBaseY);
        ctx.lineTo(side * r * 0.5, -r * 1.0);
        ctx.lineTo(hornX + side * r * 0.04, hornBaseY);
        ctx.closePath(); ctx.fill();
        // 角纹（横纹）
        if (this.quality.detailLevel >= 2) {
            ctx.globalAlpha = 0.2; ctx.strokeStyle = '#664400'; ctx.lineWidth = 0.5;
            for (let s = 0; s < 5; s++) {
                const sy = hornBaseY - s * r * 0.08;
                const sw = r * 0.03 - s * r * 0.004;
                ctx.beginPath(); ctx.moveTo(hornX - sw, sy); ctx.lineTo(hornX + sw, sy); ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }
    }
    // === 龙眼（威严的金色大眼）===
    const eyeY = -r * 0.2;
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.22;
        // 眼眶（厚眉骨）
        ctx.fillStyle = '#553300'; ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY - r * 0.02, r * 0.13, r * 0.08, side * 0.15, 0, TWO_PI_NEW);
        ctx.fill(); ctx.globalAlpha = 1;
        // 眼白
        ctx.fillStyle = '#ffffcc';
        ctx.beginPath();
        ctx.moveTo(ex - r * 0.1, eyeY);
        ctx.quadraticCurveTo(ex, eyeY - r * 0.06, ex + r * 0.1, eyeY);
        ctx.quadraticCurveTo(ex, eyeY + r * 0.05, ex - r * 0.1, eyeY);
        ctx.closePath(); ctx.fill();
        // 虹膜（金黄）
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath(); ctx.ellipse(ex, eyeY, r * 0.05, r * 0.04, 0, 0, TWO_PI_NEW); ctx.fill();
        // 竖瞳（龙之瞳孔）
        ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.ellipse(ex, eyeY, r * 0.015, r * 0.035, 0, 0, TWO_PI_NEW); ctx.fill();
        // 高光
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(ex + r * 0.02, eyeY - r * 0.02, r * 0.012, 0, TWO_PI_NEW); ctx.fill();
    }
    // === 龙鼻（宽鼻梁，两个鼻孔）===
    ctx.fillStyle = '#664400'; ctx.globalAlpha = 0.4;
    ctx.beginPath(); ctx.ellipse(-r * 0.05, r * 0.15, r * 0.03, r * 0.02, 0, 0, TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.05, r * 0.15, r * 0.03, r * 0.02, 0, 0, TWO_PI_NEW); ctx.fill();
    ctx.globalAlpha = 1;
    // === 龙嘴（紧闭的威严嘴巴）===
    ctx.strokeStyle = '#553300'; ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r * 0.15, r * 0.3);
    ctx.quadraticCurveTo(0, r * 0.35, r * 0.15, r * 0.3);
    ctx.stroke();
    // === 龙须（两侧飘逸的长须）===
    ctx.globalAlpha = 0.5; ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = 1; ctx.lineCap = 'round';
    for (let side = -1; side <= 1; side += 2) {
        for (let w = 0; w < 2; w++) {
            const wx = side * r * 0.3, wy = r * 0.2 + w * r * 0.1;
            const wWave = Math.sin(t * 2 + w + side) * r * 0.08;
            ctx.beginPath(); ctx.moveTo(wx, wy);
            ctx.quadraticCurveTo(wx + side * r * 0.3, wy + wWave, wx + side * r * 0.6, wy + r * 0.15 + wWave);
            ctx.stroke();
        }
    }
    ctx.globalAlpha = 1;
    // === 额头龙珠（发光的金色宝珠）===
    const pearlY = -r * 0.45;
    ctx.globalAlpha = 0.9;
    const pearlG = ctx.createRadialGradient(0, pearlY, 0, 0, pearlY, r * 0.08);
    pearlG.addColorStop(0, '#ffffff'); pearlG.addColorStop(0.3, '#ffee88');
    pearlG.addColorStop(0.6, '#ffcc00'); pearlG.addColorStop(1, '#aa8800');
    ctx.fillStyle = pearlG;
    ctx.beginPath(); ctx.arc(0, pearlY, r * 0.08, 0, TWO_PI_NEW); ctx.fill();
    // 龙珠脉冲光晕
    ctx.strokeStyle = '#ffdd44'; ctx.lineWidth = 1; ctx.globalAlpha = 0.3 + Math.sin(t * 4) * 0.15;
    ctx.beginPath(); ctx.arc(0, pearlY, r * 0.11 + Math.sin(t * 4) * r * 0.01, 0, TWO_PI_NEW); ctx.stroke();
    ctx.globalAlpha = 1;
    // === 周围祥云（低细节时跳过）===
    if (this.quality.detailLevel >= 3) {
        ctx.globalAlpha = 0.12;
        const drawCloud = (cx, cy, cr) => {
            ctx.beginPath();
            ctx.arc(cx, cy, cr, 0, TWO_PI_NEW);
            ctx.arc(cx + cr * 0.7, cy - cr * 0.2, cr * 0.7, 0, TWO_PI_NEW);
            ctx.arc(cx - cr * 0.5, cy - cr * 0.3, cr * 0.6, 0, TWO_PI_NEW);
            ctx.fill();
        };
        ctx.fillStyle = '#ffdd88';
        drawCloud(-r * 0.7, r * 0.3, r * 0.08);
        drawCloud(r * 0.65, -r * 0.1, r * 0.07);
        ctx.globalAlpha = 1;
    }
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
    // === 猴头造型（非圆形：上宽下窄的猴脸+毛发轮廓）===
    // 金色毛发外轮廓（蓬松感）
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = '#cc8800';
    for (let i = 0; i < 16; i++) {
        const fa = (i / 16) * TWO_PI_NEW;
        const fr = r * (1.0 + Math.sin(i * 3.7 + t * 0.5) * 0.08);
        const fx = Math.cos(fa) * fr, fy = Math.sin(fa) * fr;
        ctx.beginPath(); ctx.arc(fx, fy, r * 0.15, 0, TWO_PI_NEW); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // 主脸部 - 心形猴脸（桃形）
    const facePath = () => {
        ctx.beginPath();
        ctx.moveTo(0, r * 0.75);  // 下巴
        ctx.bezierCurveTo(-r * 0.35, r * 0.6, -r * 0.8, r * 0.1, -r * 0.75, -r * 0.2);
        ctx.bezierCurveTo(-r * 0.7, -r * 0.5, -r * 0.45, -r * 0.85, 0, -r * 0.8);
        ctx.bezierCurveTo(r * 0.45, -r * 0.85, r * 0.7, -r * 0.5, r * 0.75, -r * 0.2);
        ctx.bezierCurveTo(r * 0.8, r * 0.1, r * 0.35, r * 0.6, 0, r * 0.75);
    };
    // 金色毛皮底
    const furG = ctx.createRadialGradient(-r * 0.15, -r * 0.2, 0, 0, 0, r);
    furG.addColorStop(0, '#ffe066'); furG.addColorStop(0.3, '#ffcc33');
    furG.addColorStop(0.6, '#cc8800'); furG.addColorStop(1, '#885500');
    ctx.fillStyle = furG; facePath(); ctx.fill();
    // 桃脸（肉粉色面部区域）
    ctx.fillStyle = '#ffccaa';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.55);
    ctx.bezierCurveTo(-r * 0.25, r * 0.45, -r * 0.45, r * 0.05, -r * 0.4, -r * 0.15);
    ctx.bezierCurveTo(-r * 0.35, -r * 0.35, -r * 0.15, -r * 0.45, 0, -r * 0.4);
    ctx.bezierCurveTo(r * 0.15, -r * 0.45, r * 0.35, -r * 0.35, r * 0.4, -r * 0.15);
    ctx.bezierCurveTo(r * 0.45, r * 0.05, r * 0.25, r * 0.45, 0, r * 0.55);
    ctx.fill();
    // 面部阴影层
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.1;
        const faceShade = ctx.createRadialGradient(0, r * 0.2, 0, 0, 0, r * 0.5);
        faceShade.addColorStop(0, 'transparent'); faceShade.addColorStop(1, '#884400');
        ctx.fillStyle = faceShade;
        ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // === 金箍（紧箍咒）===
    const bandY = -r * 0.55;
    // 箍带本体
    const bandG = ctx.createLinearGradient(-r * 0.6, bandY, r * 0.6, bandY);
    bandG.addColorStop(0, '#ffdd00'); bandG.addColorStop(0.2, '#fff088');
    bandG.addColorStop(0.5, '#ffcc00'); bandG.addColorStop(0.8, '#fff088');
    bandG.addColorStop(1, '#ffdd00');
    ctx.fillStyle = bandG;
    ctx.beginPath();
    ctx.ellipse(0, bandY, r * 0.62, r * 0.08, 0, 0, Math.PI);
    ctx.ellipse(0, bandY, r * 0.62, r * 0.05, 0, Math.PI, TWO_PI_NEW);
    ctx.fill();
    // 箍的金属纹饰
    ctx.strokeStyle = '#aa7700'; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.ellipse(0, bandY, r * 0.62, r * 0.07, 0, 0, Math.PI); ctx.stroke();
    // 箍上宝石
    if (this.quality.detailLevel >= 1) {
        ctx.fillStyle = '#ff3300';
        ctx.beginPath(); ctx.arc(0, bandY - r * 0.01, r * 0.04, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.arc(-r * 0.015, bandY - r * 0.025, r * 0.012, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // === 火眼金睛 ===
    for (let side = -1; side <= 1; side += 2) {
        const ex = side * r * 0.22, ey = -r * 0.15;
        // 眼眶（棱角分明的孙悟空怒目）
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(ex - r * 0.12, ey + r * 0.01);
        ctx.quadraticCurveTo(ex, ey - r * 0.1, ex + r * 0.12, ey - r * 0.02);
        ctx.quadraticCurveTo(ex, ey + r * 0.08, ex - r * 0.12, ey + r * 0.01);
        ctx.fill();
        // 金色虹膜
        const irisG = ctx.createRadialGradient(ex, ey, 0, ex, ey, r * 0.06);
        irisG.addColorStop(0, '#ffee00'); irisG.addColorStop(0.5, '#ff8800');
        irisG.addColorStop(1, '#cc4400');
        ctx.fillStyle = irisG;
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.06, 0, TWO_PI_NEW); ctx.fill();
        // 瞳孔
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(ex, ey, r * 0.025, 0, TWO_PI_NEW); ctx.fill();
        // 火焰反光（火眼标志性）
        ctx.fillStyle = '#ff4400'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(ex + side * r * 0.02, ey - r * 0.02, r * 0.015, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(ex - side * r * 0.02, ey - r * 0.03, r * 0.01, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // 眉毛（怒眉）
    ctx.strokeStyle = '#664400'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    for (let side = -1; side <= 1; side += 2) {
        ctx.beginPath();
        ctx.moveTo(side * r * 0.08, -r * 0.28);
        ctx.quadraticCurveTo(side * r * 0.2, -r * 0.34, side * r * 0.35, -r * 0.26);
        ctx.stroke();
    }
    // === 鼻子 ===
    ctx.fillStyle = '#eebb88';
    ctx.beginPath();
    ctx.moveTo(0, -r * 0.05); ctx.lineTo(-r * 0.06, r * 0.08);
    ctx.quadraticCurveTo(0, r * 0.12, r * 0.06, r * 0.08);
    ctx.closePath(); ctx.fill();
    // 鼻孔
    ctx.fillStyle = '#885544';
    ctx.beginPath(); ctx.ellipse(-r * 0.03, r * 0.07, r * 0.02, r * 0.015, 0, 0, TWO_PI_NEW); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.03, r * 0.07, r * 0.02, r * 0.015, 0, 0, TWO_PI_NEW); ctx.fill();
    // === 嘴 ===
    ctx.strokeStyle = '#884433'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(-r * 0.12, r * 0.25);
    ctx.quadraticCurveTo(0, r * 0.35, r * 0.12, r * 0.25); ctx.stroke();
    // 嘴角上扬（嬉笑）
    ctx.beginPath(); ctx.moveTo(-r * 0.12, r * 0.25);
    ctx.quadraticCurveTo(-r * 0.15, r * 0.22, -r * 0.14, r * 0.2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(r * 0.12, r * 0.25);
    ctx.quadraticCurveTo(r * 0.15, r * 0.22, r * 0.14, r * 0.2); ctx.stroke();
    // === 头顶毛发（竖起的金色猴毛）===
    ctx.strokeStyle = '#ddaa00'; ctx.lineWidth = 1.5; ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
        const ha = -Math.PI * 0.5 + (i - 3) * 0.2;
        const hlen = r * (0.3 + Math.sin(t * 3 + i) * 0.05);
        const hx = Math.cos(ha) * r * 0.4;
        const hy = Math.sin(ha) * r * 0.4;
        ctx.beginPath(); ctx.moveTo(hx, hy);
        ctx.lineTo(hx + Math.cos(ha) * hlen, hy + Math.sin(ha) * hlen); ctx.stroke();
    }
    // === 凤翅紫金冠头饰 ===
    if (this.quality.detailLevel >= 2) {
        ctx.fillStyle = '#cc00cc';
        // 左翼
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, -r * 0.65);
        ctx.quadraticCurveTo(-r * 0.7, -r * 1.0, -r * 0.85, -r * 1.1);
        ctx.quadraticCurveTo(-r * 0.65, -r * 0.85, -r * 0.45, -r * 0.7);
        ctx.fill();
        // 右翼
        ctx.beginPath();
        ctx.moveTo(r * 0.5, -r * 0.65);
        ctx.quadraticCurveTo(r * 0.7, -r * 1.0, r * 0.85, -r * 1.1);
        ctx.quadraticCurveTo(r * 0.65, -r * 0.85, r * 0.45, -r * 0.7);
        ctx.fill();
        // 凤翅上金边
        ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.65);
        ctx.quadraticCurveTo(-r * 0.7, -r * 1.0, -r * 0.85, -r * 1.1); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(r * 0.5, -r * 0.65);
        ctx.quadraticCurveTo(r * 0.7, -r * 1.0, r * 0.85, -r * 1.1); ctx.stroke();
    }
    // === 战斗灵气/金色光环 ===
    if (this.quality.detailLevel >= 1) {
        ctx.globalAlpha = 0.2 + Math.sin(t * 4) * 0.08;
        ctx.strokeStyle = '#ffcc00'; ctx.lineWidth = 2;
        ctx.setLineDash([r * 0.08, r * 0.05]); ctx.lineDashOffset = -t * 30;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.15, 0, TWO_PI_NEW); ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
    }
    // === 筋斗云碎片（脚下） ===
    if (this.quality.detailLevel >= 2) {
        ctx.globalAlpha = 0.25;
        const clouds = [[-r * 0.3, r * 0.85, r * 0.15], [r * 0.1, r * 0.9, r * 0.12], [r * 0.35, r * 0.8, r * 0.1]];
        for (const [cx, cy, cs] of clouds) {
            ctx.fillStyle = '#ffffff';
            ctx.beginPath(); ctx.arc(cx + Math.sin(t * 2) * r * 0.03, cy, cs, 0, TWO_PI_NEW); ctx.fill();
            ctx.beginPath(); ctx.arc(cx + cs * 0.5, cy - cs * 0.2, cs * 0.7, 0, TWO_PI_NEW); ctx.fill();
        }
    }
    ctx.restore();
};;
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

