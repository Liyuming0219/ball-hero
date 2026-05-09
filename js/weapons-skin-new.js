// ===== 全12个皮肤的 _weapon_ 方法完整重写 =====
// 每个都区分: sword/dagger/hammer, fireball, bow, necro

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
    } else if (weaponType === 'fireball') {
        // 妖狐法杖 — 狐火法杖
        ctx.fillStyle = '#553322'; ctx.fillRect(-6, -1.5, 22, 3);
        // 杖头狐火
        const fireG = ctx.createRadialGradient(18, 0, 0, 18, 0, 7);
        fireG.addColorStop(0, '#ffffff'); fireG.addColorStop(0.3, '#ffcc44');
        fireG.addColorStop(0.7, '#ff6600'); fireG.addColorStop(1, 'transparent');
        ctx.fillStyle = fireG; ctx.globalAlpha = 0.7 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        // 火焰飘动
        ctx.fillStyle = '#ff8844'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(18, -5 - Math.sin(t * 6) * 2, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 妖狐弓 — 火焰弯弓
        ctx.strokeStyle = '#cc4422'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        // 弦
        ctx.strokeStyle = '#ffcc88'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        // 火焰箭
        if (attacking) {
            ctx.fillStyle = '#ff6600'; ctx.globalAlpha = 0.8;
            ctx.fillRect(8, -1, 16, 2);
            ctx.fillStyle = '#ffcc44';
            ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else {
        // 亡灵法器 — 狐灵骷髅
        ctx.fillStyle = '#553322'; ctx.fillRect(-6, -1.5, 22, 3);
        ctx.fillStyle = '#ff8844'; ctx.globalAlpha = 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 6, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#ffddaa';
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#ff4400';
        ctx.beginPath(); ctx.arc(16, -1, 1.5, 0, TWO_PI_NEW); ctx.fill();
        ctx.beginPath(); ctx.arc(20, -1, 1.5, 0, TWO_PI_NEW); ctx.fill();
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
    } else if (weaponType === 'fireball') {
        // 龙息法杖 — 金色龙珠杖
        ctx.fillStyle = '#886600'; ctx.fillRect(-6, -2, 22, 4);
        // 龙珠
        const pearlG = ctx.createRadialGradient(18, 0, 0, 18, 0, 7);
        pearlG.addColorStop(0, '#ffffff'); pearlG.addColorStop(0.3, '#ffee88');
        pearlG.addColorStop(0.6, '#ffcc00'); pearlG.addColorStop(1, '#aa8800');
        ctx.fillStyle = pearlG;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        // 龙爪托珠
        ctx.strokeStyle = '#ddaa22'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(18, 0, 9, -0.5, 0.5); ctx.stroke();
        ctx.beginPath(); ctx.arc(18, 0, 9, Math.PI - 0.5, Math.PI + 0.5); ctx.stroke();
    } else if (weaponType === 'bow') {
        // 龙骨弓
        ctx.strokeStyle = '#ddaa22'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        // 龙牙装饰
        ctx.fillStyle = '#ffee88';
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(-0.8) * 14, Math.sin(-0.8) * 14); ctx.lineTo(8 + Math.cos(-0.6) * 12, Math.sin(-0.6) * 12); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 14, Math.sin(0.8) * 14); ctx.lineTo(8 + Math.cos(0.6) * 12, Math.sin(0.6) * 12); ctx.fill();
        // 弦
        ctx.strokeStyle = '#ffcc44'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        // 金色箭
        if (attacking) {
            ctx.fillStyle = '#ffcc44';
            ctx.fillRect(8, -1, 16, 2);
            ctx.beginPath(); ctx.moveTo(24, -2.5); ctx.lineTo(28, 0); ctx.lineTo(24, 2.5); ctx.closePath(); ctx.fill();
        }
    } else {
        // 龙灵法器
        ctx.fillStyle = '#886600'; ctx.fillRect(-6, -2, 22, 4);
        ctx.fillStyle = '#ffcc44'; ctx.globalAlpha = attacking ? 0.7 : 0.4;
        ctx.beginPath(); ctx.arc(18, 0, 7, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(18, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        // 小龙头装饰
        ctx.fillStyle = '#ddaa22';
        ctx.beginPath(); ctx.moveTo(18, -7); ctx.lineTo(16, -9); ctx.lineTo(20, -9); ctx.closePath(); ctx.fill();
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
    } else if (weaponType === 'fireball') {
        // 悟空法杖 — 缩小版金箍棒+火云
        const g = ctx.createLinearGradient(-6, 0, 22, 0);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ffee88'); g.addColorStop(1, '#ffcc44');
        ctx.fillStyle = g; ctx.fillRect(-6, -2, 28, 4);
        ctx.fillStyle = '#cc8800'; ctx.fillRect(-6, -2.5, 3, 5); ctx.fillRect(19, -2.5, 3, 5);
        // 筋斗云火球
        ctx.fillStyle = '#ff6633'; ctx.globalAlpha = 0.5 + Math.sin(t * 5) * 0.2;
        ctx.beginPath(); ctx.arc(24, 0, 5, 0, TWO_PI_NEW); ctx.fill();
        ctx.fillStyle = '#ffcc44'; ctx.beginPath(); ctx.arc(24, 0, 3, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    } else if (weaponType === 'bow') {
        // 悟空弓 — 金箍弓
        const bowG = ctx.createLinearGradient(0, -12, 0, 12);
        bowG.addColorStop(0, '#ffcc44'); bowG.addColorStop(0.5, '#ffee88'); bowG.addColorStop(1, '#ffcc44');
        ctx.strokeStyle = bowG; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(8, 0, 12, -0.8, 0.8); ctx.stroke();
        // 金箍装饰
        ctx.fillStyle = '#cc8800';
        ctx.fillRect(8 + Math.cos(-0.8) * 11 - 1.5, Math.sin(-0.8) * 12 - 1.5, 3, 3);
        ctx.fillRect(8 + Math.cos(0.8) * 11 - 1.5, Math.sin(0.8) * 12 - 1.5, 3, 3);
        // 弦
        ctx.strokeStyle = '#ff3333'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(8 + Math.cos(-0.8) * 12, Math.sin(-0.8) * 12);
        ctx.lineTo(8 + Math.cos(0.8) * 12, Math.sin(0.8) * 12); ctx.stroke();
        if (attacking) {
            ctx.fillStyle = '#ffcc44'; ctx.fillRect(8, -1, 16, 2);
            ctx.fillStyle = '#ff3333';
            ctx.beginPath(); ctx.moveTo(24, -2); ctx.lineTo(28, 0); ctx.lineTo(24, 2); ctx.closePath(); ctx.fill();
        }
    } else {
        // 亡灵法器 — 缩小金箍棒+灵魂
        const g = ctx.createLinearGradient(-6, 0, 22, 0);
        g.addColorStop(0, '#ffcc44'); g.addColorStop(0.5, '#ffee88'); g.addColorStop(1, '#ffcc44');
        ctx.fillStyle = g; ctx.fillRect(-6, -2, 28, 4);
        ctx.fillStyle = '#cc8800'; ctx.fillRect(-6, -2.5, 3, 5); ctx.fillRect(19, -2.5, 3, 5);
        ctx.fillStyle = '#44ffaa'; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(24, 0, 5, 0, TWO_PI_NEW); ctx.fill();
        ctx.globalAlpha = 1;
    }
};

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
