// ============================================
// UI系统 - 菜单、HUD、升级面板
// 所有尺寸基于 scale = min(W/1280, H/720) 自适应
// ============================================

class UISystem {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.W = canvas.width;
        this.H = canvas.height;
        this.scale = 1;
        this._calcScale();

        // 状态
        this.upgradeChoices = null;
        this.selectedUpgrade = -1;
        this.hoverUpgrade = -1;

        // 暂停按钮点击
        this.pauseClicked = false;

        // 角色选择
        this.selectedCharacter = 0;
        this.hoverCharacter = -1;
        this.characterList = ['swordsman', 'mage', 'assassin', 'paladin', 'archer', 'necromancer'];

        // 天赋商店
        this._shopOpen = false;

        // 游戏设置
        this.settings = {
            soundEnabled: true,
            musicEnabled: true,
            difficulty: 'normal', // easy, normal, hard
            showFps: true,
            showControls: false, // 操作说明弹窗
        };

        // 封面动画
        this.titleGlow = 0;
        this.titleGlowDir = 1;
        this.fadeAlpha = 0;
        this.fadeTarget = 0;
        this._titleBalls = []; // 封面浮动球球
        this._titleTime = 0;
        this._initTitleBalls();

        // 鼠标
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.clicked = false;

        this._setupInput();
    }

    _calcScale() {
        this.scale = Math.min(this.W / 1280, this.H / 720);
        // 保底：确保UI元素不会缩得过小
        if (this.scale < 0.45) this.scale = 0.45;
        // 判断是否为小屏设备（手机竖屏或窄窗口）
        this.isSmallScreen = this.W < 600;
    }

    _setupInput() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mousedown', () => {
            this.mouseDown = true;
            this.clicked = true;
        });
        this.canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        // 触屏支持：将 touch 事件映射为 mouse 事件
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = t.clientX - rect.left;
            this.mouseY = t.clientY - rect.top;
            this.mouseDown = true;
            this.clicked = true;
        }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const t = e.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = t.clientX - rect.left;
            this.mouseY = t.clientY - rect.top;
        }, { passive: false });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.mouseDown = false;
        }, { passive: false });
    }

    consumeClick() {
        const was = this.clicked;
        this.clicked = false;
        return was;
    }

    resize(w, h, dpr) {
        this.W = w;
        this.H = h;
        if (dpr !== undefined) this.dpr = dpr;
        this._calcScale();
    }

    // 辅助：缩放字体大小（保留小数精度，让浏览器/DPR做亚像素渲染）
    _font(weight, sizePx, family) {
        // 保留1位小数，避免过度取整导致小字号模糊
        const s = Math.round(sizePx * this.scale * 10) / 10;
        // 小屏设备最小字号提高到12px，保证可读性
        const minSize = this.isSmallScreen ? 12 : 10;
        const finalSize = Math.max(s, minSize);
        family = family || "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif";
        return weight ? `${weight} ${finalSize}px ${family}` : `${finalSize}px ${family}`;
    }

    // --- 主菜单（英雄选择界面 - 可爱卡通风） ---
    renderMainMenu(dt) {
        // 如果在商店界面，渲染商店
        if (this._shopOpen) {
            return this._renderShop(dt);
        }

        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;
        this._titleTime += dt;

        // 每个角色对应的彩色球球色系
        const charBallColors = {
            swordsman: '#ff6b6b', mage: '#54a0ff', assassin: '#5f27cd',
            paladin: '#feca57', archer: '#96e6a1', necromancer: '#ff9ff3',
        };

        // ── 背景：与封面完全一致的深蓝星空渐变 ──
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#1a0533');
        bgGrad.addColorStop(0.5, '#0d1b3e');
        bgGrad.addColorStop(1, '#0a2647');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // ── 星星背景（与封面完全一致） ──
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const sx = (Math.sin(i * 127.1 + this._titleTime * 0.1) * 0.5 + 0.5) * W;
            const sy = (Math.cos(i * 311.7 + this._titleTime * 0.05) * 0.5 + 0.5) * H;
            const sr = 1 + Math.sin(this._titleTime * 2 + i) * 0.5;
            ctx.globalAlpha = 0.3 + Math.sin(this._titleTime * 3 + i * 0.7) * 0.2;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── 背景浮动球球（与封面同款可见球球，略小） ──
        for (const ball of this._titleBalls) {
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;
            if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
            if (ball.y < ball.r || ball.y > H - ball.r) ball.vy *= -1;
            ball.x = Math.max(ball.r, Math.min(W - ball.r, ball.x));
            ball.y = Math.max(ball.r, Math.min(H - ball.r, ball.y));

            const bob = Math.sin(this._titleTime * 2 + ball.phase) * 3;
            const bx = ball.x;
            const by = ball.y + bob;
            const drawR = ball.r * 0.55;

            // 光晕
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(bx, by, drawR + 5, 0, Math.PI * 2);
            ctx.fill();
            // 球体
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = ball.color;
            ctx.beginPath();
            ctx.arc(bx, by, drawR, 0, Math.PI * 2);
            ctx.fill();
            // 高光
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(bx - drawR * 0.3, by - drawR * 0.3, drawR * 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // === 布局计算 ===
        const titleY = H * 0.06;
        const cardAreaTop = H * 0.14;
        const cardAreaBottom = H * 0.79;
        const btnAreaY = H * 0.81;

        // ── 标题：与封面统一的彩色渐变 ──
        ctx.font = this._font('bold', 36);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // 标题阴影
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillText('球球英雄', W / 2 + 2, titleY + 2);
        // 彩色渐变
        const titleGrad = ctx.createLinearGradient(W / 2 - 120 * S, titleY - 20 * S, W / 2 + 120 * S, titleY + 20 * S);
        titleGrad.addColorStop(0, '#ff6b6b');
        titleGrad.addColorStop(0.25, '#feca57');
        titleGrad.addColorStop(0.5, '#4ecdc4');
        titleGrad.addColorStop(0.75, '#45b7d1');
        titleGrad.addColorStop(1, '#96e6a1');
        ctx.fillStyle = titleGrad;
        ctx.fillText('球球英雄', W / 2, titleY);
        ctx.textBaseline = 'alphabetic';

        // "选择你的球球" 副标题
        ctx.font = this._font('bold', 16);
        ctx.fillStyle = '#ccddef';
        ctx.fillText('— 选择你的球球 —', W / 2, cardAreaTop - 8 * S);

        // === 角色卡片：根据窗口宽度自适应列数 ===
        const cols = W < 750 ? 2 : 3;
        const rows = W < 750 ? 3 : 2;
        const availH = cardAreaBottom - cardAreaTop;
        const gapX = Math.round((this.isSmallScreen ? 10 : 18) * S);
        const gapY = Math.round((this.isSmallScreen ? 8 : 16) * S);
        const cardW = Math.min(Math.round(240 * S), Math.floor((W - gapX * (cols + 1)) / cols));
        const cardH = Math.min(Math.round(290 * S), Math.floor((availH - gapY * (rows - 1)) / rows));
        const gridW = cols * cardW + (cols - 1) * gapX;
        const gridH = rows * cardH + (rows - 1) * gapY;
        const gridStartX = (W - gridW) / 2;
        const gridStartY = cardAreaTop + (availH - gridH) / 2;

        this.hoverCharacter = -1;

        for (let i = 0; i < this.characterList.length; i++) {
            const charId = this.characterList[i];
            const def = CharacterDefs[charId];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const cx = gridStartX + col * (cardW + gapX);
            const cy = gridStartY + row * (cardH + gapY);
            const isSelected = i === this.selectedCharacter;
            const isHover = this.mouseX >= cx && this.mouseX <= cx + cardW && this.mouseY >= cy && this.mouseY <= cy + cardH;
            const ballColor = charBallColors[charId] || def.color;

            if (isHover) this.hoverCharacter = i;

            // ── 卡片：圆角毛玻璃，明亮半透明白 ──
            ctx.save();
            if (isSelected) {
                ctx.shadowColor = ballColor;
                ctx.shadowBlur = 22 * S;
            } else if (isHover) {
                ctx.shadowColor = ballColor;
                ctx.shadowBlur = 12 * S;
            }
            ctx.fillStyle = isSelected ? 'rgba(255,255,255,0.22)' : (isHover ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)');
            this._roundRect(ctx, cx, cy, cardW, cardH, 18 * S);
            ctx.fill();
            // 彩色顶部装饰条
            ctx.fillStyle = ballColor;
            ctx.globalAlpha = isSelected ? 0.8 : (isHover ? 0.55 : 0.35);
            this._roundRect(ctx, cx, cy, cardW, 4 * S, 18 * S);
            ctx.fill();
            ctx.globalAlpha = 1;
            // 边框
            ctx.strokeStyle = isSelected ? ballColor : (isHover ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)');
            ctx.lineWidth = isSelected ? 2 : 1;
            this._roundRect(ctx, cx, cy, cardW, cardH, 18 * S);
            ctx.stroke();
            ctx.restore();

            // ── 卡片裁剪区域（防止文字溢出） ──
            ctx.save();
            this._roundRect(ctx, cx, cy, cardW, cardH, 18 * S);
            ctx.clip();

            // ── 卡片内部垂直分区 ──
            // 球球展示区：上部 38% | 信息区：下部 62%
            const ballZoneH = cardH * 0.38;
            const infoTop = cy + ballZoneH;

            // ── 角色球球形象（加大，居中在展示区） ──
            const ballCX = cx + cardW / 2;
            const ballCY = cy + ballZoneH * 0.52;
            const ballR = Math.min(28 * S, ballZoneH * 0.38);
            const ballBob = Math.sin(this._titleTime * 2.5 + i * 1.2) * 3 * S;

            // 球球阴影
            ctx.globalAlpha = 0.12;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(ballCX, ballCY + ballR + 6 * S, ballR * 0.6, ballR * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
            // 球球光晕
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = ballColor;
            ctx.beginPath();
            ctx.arc(ballCX, ballCY + ballBob, ballR + 5 * S, 0, Math.PI * 2);
            ctx.fill();
            // 球球身体（径向渐变立体感）
            ctx.globalAlpha = 1;
            const bLx = ballCX - ballR * 0.25;
            const bLy = ballCY + ballBob - ballR * 0.25;
            const cardBodyGrad = ctx.createRadialGradient(bLx, bLy, ballR * 0.05, ballCX + ballR * 0.1, ballCY + ballBob + ballR * 0.1, ballR);
            cardBodyGrad.addColorStop(0, this._lightenColor(ballColor, 0.5));
            cardBodyGrad.addColorStop(0.35, ballColor);
            cardBodyGrad.addColorStop(0.75, this._darkenColor(ballColor, 0.7));
            cardBodyGrad.addColorStop(1, this._darkenColor(ballColor, 0.45));
            ctx.fillStyle = cardBodyGrad;
            ctx.beginPath();
            ctx.arc(ballCX, ballCY + ballBob, ballR, 0, Math.PI * 2);
            ctx.fill();
            // 球球高光（柔和渐变）
            const cHlR = ballR * 0.26;
            const cHlX = ballCX - ballR * 0.26;
            const cHlY = ballCY + ballBob - ballR * 0.3;
            const cHlGrad = ctx.createRadialGradient(cHlX, cHlY, 0, cHlX, cHlY, cHlR);
            cHlGrad.addColorStop(0, 'rgba(255,255,255,0.55)');
            cHlGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
            cHlGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = cHlGrad;
            ctx.beginPath();
            ctx.arc(cHlX, cHlY, cHlR, 0, Math.PI * 2);
            ctx.fill();
            // 球球眼睛
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#fff';
            const eOff = ballR * 0.25;
            ctx.beginPath();
            ctx.arc(ballCX - eOff, ballCY + ballBob - ballR * 0.05, ballR * 0.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ballCX + eOff, ballCY + ballBob - ballR * 0.05, ballR * 0.2, 0, Math.PI * 2);
            ctx.fill();
            // 瞳孔
            ctx.fillStyle = '#222';
            const pupil = Math.sin(this._titleTime * 0.8 + i) * 1.5;
            ctx.beginPath();
            ctx.arc(ballCX - eOff + pupil, ballCY + ballBob - ballR * 0.05, ballR * 0.1, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ballCX + eOff + pupil, ballCY + ballBob - ballR * 0.05, ballR * 0.1, 0, Math.PI * 2);
            ctx.fill();
            // 嘴巴
            ctx.strokeStyle = 'rgba(0,0,0,0.3)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ballCX, ballCY + ballBob + ballR * 0.18, ballR * 0.18, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();
            // 角色小标识
            ctx.font = this._font(null, 15, 'serif');
            ctx.textAlign = 'center';
            ctx.globalAlpha = 0.85;
            ctx.fillText(def.icon, ballCX + ballR * 0.8, ballCY + ballBob - ballR * 0.7);
            ctx.globalAlpha = 1;

            // ── 信息区：名称 / 标签 / 描述 / 被动 ──
            // 使用 infoTop 作为基准，所有文字相对于信息区顶部排布
            const textCX = cx + cardW / 2;

            // 角色名（加粗 + 文字阴影增强清晰度）
            const nameY = infoTop + 5 * S;
            ctx.font = this._font('bold', 16);
            ctx.textAlign = 'center';
            // 文字底部投影（增强可读性）
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillText(def.name, textCX + 1, nameY + 1);
            ctx.fillStyle = '#ffffff';
            ctx.fillText(def.name, textCX, nameY);

            // 属性标签
            const tagY = nameY + 16 * S;
            ctx.font = this._font(null, 11);
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            const tags = this._getCharTags(def);
            ctx.fillText(tags, textCX + 0.5, tagY + 0.5);
            ctx.fillStyle = 'rgba(255,255,255,0.75)';
            ctx.fillText(tags, textCX, tagY);

            // 描述（字号提升 + 高对比度 + 阴影 + 限制最多2行）
            const descY = tagY + 15 * S;
            ctx.font = this._font(null, 12);
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            this._wrapText(ctx, def.desc, textCX + 0.5, descY + 0.5, cardW - 20 * S, 15 * S, 2);
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            const descEndY = this._wrapText(ctx, def.desc, textCX, descY, cardW - 20 * S, 15 * S, 2);

            // 分隔线（紧跟描述下方）
            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
            ctx.lineWidth = 1;
            const sepY = descEndY + 10 * S;
            ctx.beginPath();
            ctx.moveTo(cx + 14 * S, sepY);
            ctx.lineTo(cx + cardW - 14 * S, sepY);
            ctx.stroke();

            // 被动标题（加粗 + 阴影）
            ctx.font = this._font('bold', 11);
            const passiveY = sepY + 13 * S;
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillText('被动: ' + def.passive.name, textCX + 0.5, passiveY + 0.5);
            ctx.fillStyle = '#feca57';
            ctx.fillText('被动: ' + def.passive.name, textCX, passiveY);
            // 被动描述（字号提升 + 高对比度 + 限制最多2行）
            ctx.font = this._font(null, 10);
            ctx.fillStyle = 'rgba(0,0,0,0.35)';
            this._wrapText(ctx, def.passive.desc, textCX + 0.5, passiveY + 14 * S + 0.5, cardW - 18 * S, 13 * S, 2);
            ctx.fillStyle = 'rgba(254,202,87,0.85)';
            this._wrapText(ctx, def.passive.desc, textCX, passiveY + 14 * S, cardW - 18 * S, 13 * S, 2);

            // 关闭卡片裁剪
            ctx.restore();

            // 点击选择
            if (isHover && this.consumeClick()) {
                this.selectedCharacter = i;
            }
        }

        // === 金币显示（按钮区域上方） ===
        const gold = (typeof MetaProgress !== 'undefined') ? MetaProgress.data.gold : 0;
        ctx.font = this._font('bold', 16);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#feca57';
        ctx.fillText(`💰 ${gold} 金币`, W / 2, btnAreaY - 14 * S);

        // === 按钮区域：开始战斗 + 天赋商店 ===
        const btnW = Math.round(180 * S);
        const btnH = Math.round(50 * S);
        const btnGap = Math.round(24 * S);
        const totalBtnW = btnW * 2 + btnGap;
        const btnStartX = (W - totalBtnW) / 2;
        const btnY = btnAreaY;

        // --- 开始战斗按钮（与封面"开始游戏"同款渐变） ---
        const startBtnX = btnStartX;
        const startHover = this.mouseX >= startBtnX && this.mouseX <= startBtnX + btnW && this.mouseY >= btnY && this.mouseY <= btnY + btnH;

        const startGrad = ctx.createLinearGradient(startBtnX, btnY, startBtnX + btnW, btnY + btnH);
        startGrad.addColorStop(0, startHover ? '#66eebb' : '#4ecdc4');
        startGrad.addColorStop(1, startHover ? '#45d9a8' : '#45b7d1');
        ctx.fillStyle = startGrad;
        this._roundRect(ctx, startBtnX, btnY, btnW, btnH, 25 * S);
        ctx.fill();

        if (startHover) {
            ctx.shadowColor = '#4ecdc4';
            ctx.shadowBlur = 15;
            this._roundRect(ctx, startBtnX, btnY, btnW, btnH, 25 * S);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.font = this._font('bold', 20);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('开始战斗', startBtnX + btnW / 2, btnY + btnH / 2 + 1);

        // --- 天赋商店按钮（描边透明风格，与封面"游戏设置"同款） ---
        const shopBtnX = startBtnX + btnW + btnGap;
        const shopHover = this.mouseX >= shopBtnX && this.mouseX <= shopBtnX + btnW && this.mouseY >= btnY && this.mouseY <= btnY + btnH;

        ctx.fillStyle = shopHover ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)';
        ctx.strokeStyle = shopHover ? '#feca57' : 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        this._roundRect(ctx, shopBtnX, btnY, btnW, btnH, 25 * S);
        ctx.fill();
        this._roundRect(ctx, shopBtnX, btnY, btnW, btnH, 25 * S);
        ctx.stroke();

        ctx.font = this._font('bold', 20);
        ctx.fillStyle = shopHover ? '#feca57' : 'rgba(255,255,255,0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('天赋商店', shopBtnX + btnW / 2, btnY + btnH / 2 + 1);

        // 操作提示（区分PC和触屏）
        ctx.font = this._font(null, 13);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.textAlign = 'center';
        const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        const hintText = isMobile
            ? '触屏拖拽移动 · 自动攻击 · 双指点击暂停'
            : 'WASD / 方向键移动 · 自动攻击 · 升级后选择强化';
        ctx.fillText(hintText, W / 2, btnY + btnH + 24 * S);

        if (startHover && this.consumeClick()) {
            return this.characterList[this.selectedCharacter];
        }
        if (shopHover && this.consumeClick()) {
            this._shopOpen = true;
            return null;
        }
        this.clicked = false;
        return null;
    }

    // --- 天赋商店界面 ---
    _renderShop(dt) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        // 背景
        ctx.fillStyle = '#08080f';
        ctx.fillRect(0, 0, W, H);

        // 装饰粒子
        const time = Date.now() / 1000;
        for (let i = 0; i < 30; i++) {
            const x = (Math.sin(time * 0.2 + i * 2.3) * 0.5 + 0.5) * W;
            const y = (Math.cos(time * 0.15 + i * 1.7) * 0.5 + 0.5) * H;
            ctx.globalAlpha = 0.06 + Math.sin(time + i) * 0.03;
            ctx.fillStyle = Utils.hsl(30 + i * 8, 70, 55);
            ctx.beginPath();
            ctx.arc(x, y, (1 + Math.sin(time * 0.5 + i) * 0.8) * S, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        const meta = (typeof MetaProgress !== 'undefined') ? MetaProgress : null;
        const data = meta ? meta.data : null;
        const gold = data ? data.gold : 0;
        const perms = data ? data.permUpgrades : {};

        // 标题
        ctx.save();
        ctx.shadowColor = '#ffaa00';
        ctx.shadowBlur = 20 * S;
        ctx.font = this._font('bold', 38);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffcc44';
        ctx.fillText('天赋商店', W / 2, H * 0.08);
        ctx.restore();

        // 金币
        ctx.font = this._font('bold', 20);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffcc44';
        ctx.fillText(`💰 ${gold} 金币`, W / 2, H * 0.14);

        // 升级项定义
        const upgrades = [
            { id: 'maxHp', name: '生命强化', icon: '❤️', desc: '每级 +5 最大生命', color: '#44ff44', baseCost: 50, maxLv: 10 },
            { id: 'attack', name: '攻击强化', icon: '⚔️', desc: '每级 +3% 攻击力', color: '#ff6644', baseCost: 80, maxLv: 10 },
            { id: 'moveSpeed', name: '疾步', icon: '💨', desc: '每级 +2% 移速', color: '#44aaff', baseCost: 60, maxLv: 8 },
            { id: 'pickupRange', name: '磁力', icon: '🧲', desc: '每级 +10 拾取范围', color: '#ffaa44', baseCost: 40, maxLv: 8 },
            { id: 'expGain', name: '悟性', icon: '📖', desc: '每级 +5% 经验获取', color: '#aa88ff', baseCost: 70, maxLv: 8 },
        ];

        // 卡片布局
        const cols = upgrades.length;
        const cardW = Math.min(Math.round(200 * S), Math.floor((W - 60 * S) / cols - 16 * S));
        const cardH = Math.round(280 * S);
        const gap = Math.round(16 * S);
        const totalW = cols * cardW + (cols - 1) * gap;
        const startX = (W - totalW) / 2;
        const cardY = H * 0.20;

        for (let i = 0; i < upgrades.length; i++) {
            const upg = upgrades[i];
            const currentLv = perms[upg.id] || 0;
            const cost = upg.baseCost * (1 + currentLv);
            const isMax = currentLv >= upg.maxLv;
            const canBuy = !isMax && gold >= cost;

            const cx = startX + i * (cardW + gap);
            const isHover = this.mouseX >= cx && this.mouseX <= cx + cardW && this.mouseY >= cardY && this.mouseY <= cardY + cardH;

            // 卡片背景
            ctx.save();
            if (isHover && canBuy) {
                ctx.shadowColor = upg.color;
                ctx.shadowBlur = 18 * S;
            }
            ctx.fillStyle = isHover ? '#1a1a2a' : '#101020';
            ctx.strokeStyle = isMax ? '#333355' : (canBuy ? upg.color : '#333355');
            ctx.lineWidth = isMax ? 1 : (canBuy ? 2 : 1);
            this._roundRect(ctx, cx, cardY, cardW, cardH, 12 * S);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // 图标
            ctx.font = this._font(null, 36, 'serif');
            ctx.textAlign = 'center';
            ctx.fillText(upg.icon, cx + cardW / 2, cardY + 44 * S);

            // 名称
            ctx.font = this._font('bold', 17);
            ctx.fillStyle = upg.color;
            ctx.fillText(upg.name, cx + cardW / 2, cardY + 78 * S);

            // 描述
            ctx.font = this._font(null, 12);
            ctx.fillStyle = '#8899aa';
            ctx.fillText(upg.desc, cx + cardW / 2, cardY + 102 * S);

            // 等级进度条
            const barW = cardW - 30 * S;
            const barH = 10 * S;
            const barX = cx + 15 * S;
            const barY = cardY + 120 * S;
            ctx.fillStyle = '#1a1a2a';
            this._roundRect(ctx, barX, barY, barW, barH, 4 * S);
            ctx.fill();

            if (currentLv > 0) {
                const ratio = currentLv / upg.maxLv;
                ctx.fillStyle = upg.color;
                ctx.globalAlpha = 0.7;
                this._roundRect(ctx, barX, barY, barW * ratio, barH, 4 * S);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            // 等级文字
            ctx.font = this._font('bold', 13);
            ctx.fillStyle = isMax ? '#88ffaa' : '#aabbcc';
            ctx.textAlign = 'center';
            ctx.fillText(isMax ? 'MAX' : `Lv.${currentLv} / ${upg.maxLv}`, cx + cardW / 2, cardY + 155 * S);

            // 效果数值
            ctx.font = this._font(null, 12);
            ctx.fillStyle = '#667788';
            let effectText = '';
            if (upg.id === 'maxHp') effectText = `当前: +${currentLv * 5} HP`;
            else if (upg.id === 'attack') effectText = `当前: +${currentLv * 3}% 攻击`;
            else if (upg.id === 'moveSpeed') effectText = `当前: +${currentLv * 2}% 移速`;
            else if (upg.id === 'pickupRange') effectText = `当前: +${currentLv * 10} 范围`;
            else if (upg.id === 'expGain') effectText = `当前: +${currentLv * 5}% 经验`;
            ctx.fillText(effectText, cx + cardW / 2, cardY + 176 * S);

            // 购买按钮区域
            const buyBtnW = cardW - 30 * S;
            const buyBtnH = 36 * S;
            const buyBtnX = cx + 15 * S;
            const buyBtnY = cardY + cardH - 56 * S;
            const buyHover = isHover && this.mouseY >= buyBtnY && this.mouseY <= buyBtnY + buyBtnH;

            ctx.save();
            if (isMax) {
                ctx.fillStyle = '#222244';
            } else if (canBuy) {
                ctx.fillStyle = buyHover ? '#445522' : '#334411';
                ctx.shadowColor = '#88ff44';
                ctx.shadowBlur = buyHover ? 10 * S : 0;
            } else {
                ctx.fillStyle = '#221111';
            }
            this._roundRect(ctx, buyBtnX, buyBtnY, buyBtnW, buyBtnH, 8 * S);
            ctx.fill();
            ctx.strokeStyle = isMax ? '#444466' : (canBuy ? '#88ff44' : '#554433');
            ctx.lineWidth = 1;
            this._roundRect(ctx, buyBtnX, buyBtnY, buyBtnW, buyBtnH, 8 * S);
            ctx.stroke();
            ctx.restore();

            ctx.font = this._font('bold', 14);
            ctx.textAlign = 'center';
            if (isMax) {
                ctx.fillStyle = '#88ffaa';
                ctx.fillText('已满级', cx + cardW / 2, buyBtnY + buyBtnH / 2 + 1);
            } else if (canBuy) {
                ctx.fillStyle = '#88ff44';
                ctx.fillText(`升级 (${cost}💰)`, cx + cardW / 2, buyBtnY + buyBtnH / 2 + 1);
            } else {
                ctx.fillStyle = '#884433';
                ctx.fillText(`需要 ${cost}💰`, cx + cardW / 2, buyBtnY + buyBtnH / 2 + 1);
            }

            // 点击购买
            if (buyHover && canBuy && this.consumeClick()) {
                if (meta) meta.buyUpgrade(upg.id);
            }
        }

        // 返回按钮
        const backW = Math.round(140 * S);
        const backH = Math.round(44 * S);
        const backX = (W - backW) / 2;
        const backY = H - 80 * S;
        const backHover = this.mouseX >= backX && this.mouseX <= backX + backW && this.mouseY >= backY && this.mouseY <= backY + backH;

        ctx.save();
        ctx.fillStyle = backHover ? '#443333' : '#332222';
        ctx.shadowColor = '#ff6644';
        ctx.shadowBlur = backHover ? 12 * S : 4 * S;
        this._roundRect(ctx, backX, backY, backW, backH, 22 * S);
        ctx.fill();
        ctx.strokeStyle = '#ff6644';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, backX, backY, backW, backH, 22 * S);
        ctx.stroke();
        ctx.restore();

        ctx.font = this._font('bold', 17);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('← 返回', W / 2, backY + backH / 2 + 1);

        if (backHover && this.consumeClick()) {
            this._shopOpen = false;
        }

        // 提示
        ctx.font = this._font(null, 12);
        ctx.fillStyle = '#555566';
        ctx.fillText('击杀敌人获得金币，永久升级在每局开始时自动生效', W / 2, backY + backH + 20 * S);

        this.clicked = false;
        return null;
    }

    _getCharTags(def) {
        const id = def.id;
        const tagMap = {
            swordsman: '近战 · 剑气 · 均衡',
            mage: '远程 · AOE · 爆发',
            assassin: '近战 · 瞬移 · 暗杀',
            paladin: '近战 · 坦克 · 格挡',
            archer: '远程 · 弹幕 · 箭雨',
            necromancer: '召唤 · 持续 · 灵魂',
        };
        return tagMap[id] || '';
    }

    // --- 游戏HUD ---
    renderHUD(player, waveManager) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        ctx.save();

        // ---- 左上区域：血条 + 经验条 + 等级信息 ----
        const pad = Math.round(16 * S);
        const hpBarW = Math.round(Math.min(320 * S, W * 0.28));
        const hpBarH = Math.round(24 * S);
        const hpX = pad;
        const hpY = pad;
        const hpRatio = player.stats.hp / player.getMaxHp();
        const lowHp = hpRatio <= 0.25;
        const pulse = lowHp ? 0.15 * Math.sin(Date.now() / 150) : 0;

        // 黑底
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this._roundRect(ctx, hpX - 1, hpY - 1, hpBarW + 2, hpBarH + 2, 10 * S);
        ctx.fill();

        const hpColor = hpRatio > 0.5 ? '#44ff44' : (hpRatio > 0.25 ? '#ffaa00' : '#ff4444');
        ctx.globalAlpha = 0.85 + pulse;
        ctx.fillStyle = hpColor;
        if (hpBarW * hpRatio > 1) {
            this._roundRect(ctx, hpX, hpY, hpBarW * hpRatio, hpBarH, 9 * S);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // 白色外框
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, hpX - 1, hpY - 1, hpBarW + 2, hpBarH + 2, 10 * S);
        ctx.stroke();

        // HP文字
        ctx.font = this._font('bold', 13);
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        const hpText = `${Math.floor(player.stats.hp)} / ${player.getMaxHp()}`;
        ctx.strokeText(hpText, hpX + hpBarW / 2, hpY + hpBarH / 2 + 1);
        ctx.fillStyle = '#fff';
        ctx.fillText(hpText, hpX + hpBarW / 2, hpY + hpBarH / 2 + 1);

        // 护盾条（在血条下方，仅有护盾时显示）
        let shieldBarOffset = 0;
        if (player.bonuses.shieldMax > 0) {
            const shieldBarH = Math.round(10 * S);
            const shieldY = hpY + hpBarH + Math.round(3 * S);
            const shieldRatio = player.shield / player.bonuses.shieldMax;
            shieldBarOffset = shieldBarH + Math.round(3 * S);

            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this._roundRect(ctx, hpX, shieldY, hpBarW, shieldBarH, 5 * S);
            ctx.fill();

            if (hpBarW * shieldRatio > 1) {
                ctx.fillStyle = '#6688ff';
                ctx.globalAlpha = 0.85;
                this._roundRect(ctx, hpX, shieldY, hpBarW * shieldRatio, shieldBarH, 5 * S);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            ctx.font = this._font('bold', 10);
            ctx.fillStyle = '#aabbff';
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            const shieldText = `🛡 ${Math.floor(player.shield)} / ${player.bonuses.shieldMax}`;
            ctx.strokeText(shieldText, hpX + hpBarW / 2, shieldY + shieldBarH / 2 + 1);
            ctx.fillText(shieldText, hpX + hpBarW / 2, shieldY + shieldBarH / 2 + 1);
        }

        // 经验条
        const expBarW = Math.round(hpBarW * 0.88);
        const expBarH = Math.round(8 * S);
        const expY = hpY + hpBarH + shieldBarOffset + Math.round(6 * S);
        const expRatio = player.exp / player.expToNext;

        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        this._roundRect(ctx, hpX, expY, expBarW, expBarH, 4 * S);
        ctx.fill();

        ctx.fillStyle = '#44aaff';
        if (expBarW * expRatio > 1) {
            this._roundRect(ctx, hpX, expY, expBarW * expRatio, expBarH, 4 * S);
            ctx.fill();
        }

        // 等级 + 武器等级（同一行，经验条下方）
        const infoY = expY + expBarH + Math.round(16 * S);
        ctx.font = this._font('bold', 14);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#44aaff';
        ctx.fillText(`Lv.${player.level}`, hpX, infoY);

        ctx.fillStyle = '#ffaa44';
        ctx.fillText(`武器 Lv.${player.weaponLevel}`, hpX + 72 * S, infoY);

        // ---- 被动状态（等级行右侧） ----
        const passiveX = hpX + 180 * S;
        if (player.def.id === 'swordsman') {
            const stackText = '疾风剑意: ' + '●'.repeat(player.passive.stacks) + '○'.repeat(player.passive.maxStacks - player.passive.stacks);
            ctx.fillStyle = '#44aaff';
            ctx.fillText(stackText, passiveX, infoY);
        } else if (player.def.id === 'mage') {
            const cdRatio = player.passive.timer / player.passive.interval;
            ctx.fillStyle = cdRatio > 0.8 ? '#ff6644' : '#666688';
            ctx.fillText(`共鸣: ${Math.floor(cdRatio * 100)}%`, passiveX, infoY);
        } else if (player.def.id === 'paladin') {
            ctx.fillStyle = '#ffcc44';
            ctx.fillText(`格挡: ${Math.floor(player.passive.chance * 100)}%`, passiveX, infoY);
        } else if (player.def.id === 'archer') {
            const rainCd = player.passive.timer / player.passive.interval;
            ctx.fillStyle = rainCd >= 1 ? '#44ffaa' : '#666688';
            ctx.fillText(`箭雨: ${Math.floor(rainCd * 100)}%`, passiveX, infoY);
        } else if (player.def.id === 'assassin') {
            const blinkCd = player.passive.timer / player.passive.interval;
            ctx.fillStyle = blinkCd >= 1 ? '#cc66ff' : '#666688';
            ctx.fillText(`暗影步: ${Math.floor(blinkCd * 100)}%`, passiveX, infoY);
        } else if (player.def.id === 'necromancer') {
            const soulText = '灵魂: ' + '●'.repeat(player.passive.souls) + '○'.repeat(player.passive.maxSouls - player.passive.souls);
            ctx.fillStyle = '#44ccaa';
            ctx.fillText(soulText, passiveX, infoY);
        }

        // ---- 右上角：暂停按钮 + 时间 + 击杀 ----
        const pauseSize = Math.round(36 * S);
        const pauseX = W - pauseSize - pad;
        const pauseY = pad;
        const pauseHover = this.mouseX >= pauseX && this.mouseX <= pauseX + pauseSize && this.mouseY >= pauseY && this.mouseY <= pauseY + pauseSize;

        ctx.fillStyle = pauseHover ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.3)';
        this._roundRect(ctx, pauseX, pauseY, pauseSize, pauseSize, 7 * S);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        this._roundRect(ctx, pauseX, pauseY, pauseSize, pauseSize, 7 * S);
        ctx.stroke();

        // 暂停图标
        ctx.fillStyle = '#fff';
        const barW = Math.round(4.5 * S);
        const barH = Math.round(16 * S);
        const barY = pauseY + (pauseSize - barH) / 2;
        const barGap = Math.round(10 * S);
        const barsTotal = barW * 2 + barGap;
        const bar1X = pauseX + (pauseSize - barsTotal) / 2;
        ctx.fillRect(bar1X, barY, barW, barH);
        ctx.fillRect(bar1X + barW + barGap, barY, barW, barH);

        if (pauseHover && this.consumeClick()) {
            this.pauseClicked = true;
        }

        // 时间 & 击杀（暂停按钮左侧）
        ctx.textAlign = 'right';
        ctx.font = this._font('bold', 20);
        ctx.fillStyle = '#fff';
        ctx.fillText(Utils.formatTime(waveManager.gameTime), pauseX - Math.round(14 * S), pad + Math.round(18 * S));

        ctx.font = this._font(null, 15);
        ctx.fillStyle = '#aaa';
        ctx.fillText(`击杀: ${Utils.formatNumber(player.kills)}`, pauseX - Math.round(14 * S), pad + Math.round(42 * S));

        // ---- 连杀显示（右侧中上） ----
        if (player.comboCount >= 5) {
            const comboX = W - pad;
            const comboY = pad + Math.round(65 * S);
            ctx.textAlign = 'right';
            ctx.font = this._font('bold', 24);
            const comboAlpha = 0.6 + Math.sin(Date.now() / 200) * 0.2;
            ctx.globalAlpha = comboAlpha;
            const comboColor = player.comboCount >= 50 ? '#ff4444' : (player.comboCount >= 25 ? '#ff8844' : '#ffaa00');
            ctx.fillStyle = comboColor;
            ctx.fillText(player.comboCount + ' COMBO', comboX, comboY);
            ctx.font = this._font(null, 12);
            ctx.fillStyle = '#aaa';
            ctx.globalAlpha = 0.6;
            ctx.fillText('x' + player.getComboMultiplier().toFixed(2) + ' DMG', comboX, comboY + 20 * S);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    // --- Boss血条（屏幕顶部居中） ---
    renderBossHP(boss) {
        if (!boss || !boss.alive) return;
        const ctx = this.ctx;
        const W = this.W;
        const S = this.scale;

        const barW = Math.min(Math.round(500 * S), W * 0.5);
        const barH = Math.round(16 * S);
        const barX = (W - barW) / 2;
        const barY = Math.round(12 * S);

        ctx.save();
        // 背景
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this._roundRect(ctx, barX - 2, barY - 2, barW + 4, barH + 4, 6 * S);
        ctx.fill();
        // 血量
        const ratio = boss.hp / boss.maxHp;
        const hpColor = ratio > 0.5 ? '#ff4444' : (ratio > 0.25 ? '#ff8800' : '#ff2222');
        ctx.fillStyle = hpColor;
        if (barW * ratio > 1) {
            this._roundRect(ctx, barX, barY, barW * ratio, barH, 4 * S);
            ctx.fill();
        }
        // 边框
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, barX - 2, barY - 2, barW + 4, barH + 4, 6 * S);
        ctx.stroke();
        // Boss名字
        ctx.font = this._font('bold', 14);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffcc44';
        ctx.fillText(boss.name, W / 2, barY + barH + 16 * S);
        ctx.restore();
    }

    // --- 小地图（右下角） ---
    renderMinimap(player, enemies, camera) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        const mapSize = Math.round(120 * S);
        const mapX = W - mapSize - Math.round(12 * S);
        const mapY = H - mapSize - Math.round(12 * S);
        const mapRange = 800; // 小地图显示半径

        ctx.save();
        // 背景
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#0a0a1a';
        ctx.beginPath();
        ctx.arc(mapX + mapSize / 2, mapY + mapSize / 2, mapSize / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334466';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // 裁剪圆形
        ctx.beginPath();
        ctx.arc(mapX + mapSize / 2, mapY + mapSize / 2, mapSize / 2 - 2, 0, Math.PI * 2);
        ctx.clip();

        const cx = mapX + mapSize / 2;
        const cy = mapY + mapSize / 2;
        const scale = mapSize / (mapRange * 2);

        // 敌人点
        ctx.fillStyle = '#ff4444';
        for (const e of enemies) {
            if (!e.alive) continue;
            const dx = (e.x - player.x) * scale;
            const dy = (e.y - player.y) * scale;
            if (Math.abs(dx) > mapSize / 2 || Math.abs(dy) > mapSize / 2) continue;
            const dotSize = e.isBoss ? 4 : (e.isElite ? 2.5 : 1.2);
            ctx.globalAlpha = e.isBoss ? 1 : 0.6;
            ctx.beginPath();
            ctx.arc(cx + dx, cy + dy, dotSize * S, 0, Math.PI * 2);
            ctx.fill();
        }

        // 玩家中心点
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#44aaff';
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * S, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // --- 屏幕边缘警告（敌人从屏幕外接近） ---
    renderEdgeWarnings(player, enemies, camera, screenW, screenH) {
        const ctx = this.ctx;
        const margin = 40;
        const warningDist = 600;

        ctx.save();
        for (const e of enemies) {
            if (!e.alive || (!e.isBoss && !e.isElite)) continue;
            const sx = e.x - camera.x;
            const sy = e.y - camera.y;
            // 仅对屏外的Boss/精英显示
            if (sx > -margin && sx < screenW + margin && sy > -margin && sy < screenH + margin) continue;

            const dist = Utils.dist(e.x, e.y, player.x, player.y);
            if (dist > warningDist) continue;

            // 计算边缘位置
            const angle = Utils.angle(camera.x + screenW / 2, camera.y + screenH / 2, e.x, e.y);
            const edgeX = Utils.clamp(sx, 30, screenW - 30);
            const edgeY = Utils.clamp(sy, 30, screenH - 30);

            const alpha = 0.4 + Math.sin(Date.now() / 150) * 0.2;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = e.isBoss ? '#ff2222' : '#ffaa00';

            // 箭头
            ctx.save();
            ctx.translate(edgeX, edgeY);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(12, 0);
            ctx.lineTo(-6, -8);
            ctx.lineTo(-6, 8);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }

    // --- 屏幕闪光（受伤/击杀时短暂红/白闪） ---
    renderScreenFlash(color, alpha) {
        if (alpha <= 0) return;
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.restore();
    }

    // --- 成就弹窗 ---
    renderAchievement(achievement, timer) {
        if (!achievement || timer <= 0) return;
        const ctx = this.ctx;
        const W = this.W;
        const S = this.scale;

        const alpha = timer > 2.5 ? ((3 - timer) * 2) : (timer < 0.5 ? timer * 2 : 1);
        ctx.save();
        ctx.globalAlpha = alpha;

        const boxW = Math.round(280 * S);
        const boxH = Math.round(60 * S);
        const boxX = (W - boxW) / 2;
        const boxY = Math.round(60 * S);

        ctx.fillStyle = 'rgba(20, 15, 0, 0.9)';
        this._roundRect(ctx, boxX, boxY, boxW, boxH, 10 * S);
        ctx.fill();
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        this._roundRect(ctx, boxX, boxY, boxW, boxH, 10 * S);
        ctx.stroke();

        ctx.font = this._font('bold', 14);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffcc44';
        ctx.fillText('Achievement Unlocked!', W / 2, boxY + 22 * S);
        ctx.font = this._font(null, 15);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(achievement.name + ' - ' + achievement.desc, W / 2, boxY + 44 * S);

        ctx.restore();
    }

    // --- 升级面板 ---
    renderUpgradePanel(choices, isBossReward) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        // 防误触保护：面板刚弹出的前 0.2 秒不接受点击
        if (!this._upgradePanelTimer) this._upgradePanelTimer = 0;
        this._upgradePanelTimer += 1 / 60; // 近似每帧累加
        if (this._upgradePanelTimer < 0.2) {
            this.clicked = false;
        }

        // 半透明背景
        ctx.fillStyle = isBossReward ? 'rgba(20, 5, 0, 0.8)' : 'rgba(0, 0, 10, 0.75)';
        ctx.fillRect(0, 0, W, H);

        // 标题
        ctx.save();
        ctx.shadowColor = isBossReward ? '#ff4400' : '#ffaa00';
        ctx.shadowBlur = (isBossReward ? 25 : 15) * S;
        ctx.font = this._font('bold', 36);
        ctx.textAlign = 'center';
        ctx.fillStyle = isBossReward ? '#ff6644' : '#ffcc44';
        ctx.fillText(isBossReward ? 'Boss击破奖励！' : '升级！', W / 2, H * 0.18);
        ctx.restore();

        ctx.font = this._font(null, 17);
        ctx.fillStyle = isBossReward ? '#ffaa88' : '#8888aa';
        ctx.textAlign = 'center';
        ctx.fillText(isBossReward ? '选择一项强力增益' : '选择一项强化', W / 2, H * 0.18 + 38 * S);

        // === 选项卡（自适应大小） ===
        const count = choices.length;
        const cardW = Math.min(Math.round(250 * S), Math.floor((W - 60 * S) / count - 24 * S));
        const cardH = Math.min(Math.round(220 * S), Math.round(H * 0.36));
        const gap = Math.round(24 * S);
        const totalW = count * cardW + (count - 1) * gap;
        const startX = (W - totalW) / 2;
        const cardY = H * 0.5 - cardH / 2;

        this.hoverUpgrade = -1;
        let result = -1;

        for (let i = 0; i < count; i++) {
            const choice = choices[i];
            const cx = startX + i * (cardW + gap);
            const isHover = this.mouseX >= cx && this.mouseX <= cx + cardW && this.mouseY >= cardY && this.mouseY <= cardY + cardH;
            if (isHover) this.hoverUpgrade = i;

            const rarity = RarityColors[choice.rarity || 'common'];

            // 卡片
            ctx.save();
            if (isHover) {
                ctx.shadowColor = rarity.glow || '#4488ff';
                ctx.shadowBlur = 22 * S;
            }
            if (choice.rarity === 'legendary') {
                ctx.shadowColor = '#ffaa00';
                ctx.shadowBlur = (25 + Math.sin(Date.now() / 200) * 10) * S;
            }

            ctx.fillStyle = isHover ? '#1e2030' : rarity.bg;
            ctx.strokeStyle = rarity.border;
            ctx.lineWidth = choice.isWeapon ? 3 : 2;
            this._roundRect(ctx, cx, cardY, cardW, cardH, 14 * S);
            ctx.fill();
            ctx.stroke();
            ctx.restore();

            // 武器标签
            if (choice.isWeapon) {
                ctx.save();
                ctx.fillStyle = rarity.border;
                ctx.font = this._font('bold', 12);
                ctx.textAlign = 'center';
                ctx.fillText('⬆ 武器进化', cx + cardW / 2, cardY + 20 * S);
                ctx.restore();
            }

            // 稀有度标签
            if (choice.rarity && choice.rarity !== 'common') {
                const rarityNames = { rare: '稀有', epic: '史诗', legendary: '传说' };
                ctx.save();
                ctx.font = this._font(null, 11);
                ctx.fillStyle = rarity.text;
                ctx.textAlign = 'right';
                ctx.fillText(rarityNames[choice.rarity] || '', cx + cardW - 12 * S, cardY + 20 * S);
                ctx.restore();
            }

            // 图标
            ctx.font = this._font(null, 40, 'serif');
            ctx.textAlign = 'center';
            ctx.fillText(choice.icon, cx + cardW / 2, cardY + 65 * S);

            // 名称
            ctx.font = this._font('bold', 19);
            ctx.fillStyle = rarity.text;
            ctx.fillText(choice.name, cx + cardW / 2, cardY + 105 * S);

            // 描述
            ctx.font = this._font(null, 13);
            ctx.fillStyle = '#8899aa';
            this._wrapText(ctx, choice.desc, cx + cardW / 2, cardY + 130 * S, cardW - 26 * S, 17 * S);

            // 悬停高亮
            if (isHover) {
                ctx.fillStyle = '#ffffff11';
                this._roundRect(ctx, cx, cardY, cardW, cardH, 14 * S);
                ctx.fill();
            }

            if (isHover && this.consumeClick()) {
                result = i;
            }
        }

        this.clicked = false;
        return result;
    }

    // --- 死亡画面 ---
    renderDeathScreen(player, gameTime, goldEarned) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        ctx.fillStyle = 'rgba(10, 0, 0, 0.8)';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.shadowColor = '#ff2222';
        ctx.shadowBlur = 30 * S;
        ctx.font = this._font('bold', 52);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff4444';
        ctx.fillText('灵魂消散...', W / 2, H * 0.22);
        ctx.restore();

        // 统计
        ctx.font = this._font(null, 24);
        ctx.fillStyle = '#aabbcc';
        ctx.textAlign = 'center';

        const stats = [
            `存活时间: ${Utils.formatTime(gameTime)}`,
            `等级: ${player.level}`,
            `击杀: ${Utils.formatNumber(player.kills)}`,
            `武器等级: Lv.${player.weaponLevel}`,
        ];

        stats.forEach((text, i) => {
            ctx.fillText(text, W / 2, H * 0.36 + i * 36 * S);
        });

        // 获得金币
        if (goldEarned > 0) {
            const goldY = H * 0.36 + stats.length * 36 * S + 16 * S;
            ctx.font = this._font('bold', 22);
            ctx.fillStyle = '#ffcc44';
            ctx.fillText(`💰 +${goldEarned} 金币`, W / 2, goldY);
        }

        // 重新开始按钮
        const btnW = Math.round(220 * S);
        const btnH = Math.round(54 * S);
        const btnX = (W - btnW) / 2;
        const btnY = H * 0.72;
        const btnHover = this.mouseX >= btnX && this.mouseX <= btnX + btnW && this.mouseY >= btnY && this.mouseY <= btnY + btnH;

        ctx.save();
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = btnHover ? 22 * S : 10 * S;
        ctx.fillStyle = btnHover ? '#aa2222' : '#882222';
        ctx.strokeStyle = '#ff4444';
        ctx.lineWidth = 2;
        this._roundRect(ctx, btnX, btnY, btnW, btnH, 27 * S);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.font = this._font('bold', 22);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('再来一次', W / 2, btnY + btnH / 2 + 1);

        if (btnHover && this.consumeClick()) {
            return true;
        }
        this.clicked = false;
        return false;
    }

    // --- 暂停画面 ---
    renderPauseScreen(player, showStats) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;

        // 半透明遮罩
        ctx.fillStyle = 'rgba(0, 0, 10, 0.6)';
        ctx.fillRect(0, 0, W, H);

        let result = null;

        if (showStats) {
            // === 属性面板（动态高度，自适应缩放） ===
            const panelW = Math.round(380 * S);

            // 属性列表
            const stats = [
                { label: '生命值', value: `${Math.floor(player.stats.hp)} / ${player.getMaxHp()}`, color: '#44ff44' },
                { label: '攻击力', value: `${player.getAttack().toFixed(1)}`, color: '#ff6644' },
                { label: '攻击速度', value: `${player.getAttackSpeed().toFixed(2)}/秒`, color: '#ffaa44' },
                { label: '暴击率', value: `${(player.getCritRate() * 100).toFixed(1)}%`, color: '#ff44aa' },
                { label: '暴击伤害', value: `×${player.getCritDamage().toFixed(1)}`, color: '#ff44aa' },
                { label: '移动速度', value: `${player.getMoveSpeed().toFixed(0)}`, color: '#44aaff' },
                { label: '生命恢复', value: `${player.getHpRegen().toFixed(1)}/秒`, color: '#44ff88' },
                { label: '护甲', value: `${player.getArmor().toFixed(1)}`, color: '#aabbcc' },
                { label: '拾取范围', value: `${player.getPickupRange().toFixed(0)}`, color: '#ffcc44' },
                { label: '攻击范围', value: `×${player.bonuses.areaMult.toFixed(1)}`, color: '#88aaff' },
                { label: '额外弹幕', value: `+${player.bonuses.projectileBonus}`, color: '#cc88ff' },
            ];

            // 额外特殊buff
            const specials = [];
            if (player.bonuses.orbitalBlades > 0) specials.push(`环绕刀刃 ×${player.bonuses.orbitalBlades}`);
            if (player.bonuses.fireTrail) specials.push('火焰尾迹');
            if (player.bonuses.chainLightning > 0) specials.push(`连锁闪电 ×${player.bonuses.chainLightning}`);
            if (player.bonuses.thornAura) specials.push('荆棘光环');
            if (player.bonuses.splitShot) specials.push('弹幕分裂');
            if (player.bonuses.homingShot) specials.push('追踪弹');
            if (player.bonuses.explosiveKill) specials.push('爆杀');
            if (player.bonuses.frostAura) specials.push('冰霜光环');
            if (player.bonuses.vampiric > 0) specials.push(`吸血 ${(player.bonuses.vampiric * 100).toFixed(0)}%`);
            if (player.bonuses.doubleStrike > 0) specials.push(`双击 ${(player.bonuses.doubleStrike * 100).toFixed(0)}%`);

            // 动态计算面板高度
            const lineH = Math.round(28 * S);
            const headerH = Math.round(72 * S);
            const statsH = stats.length * lineH;
            const specialsH = specials.length > 0 ? (Math.round(6 * S) + Math.round(22 * S) + specials.length * Math.round(22 * S) + Math.round(10 * S)) : 0;
            const bottomPad = Math.round(18 * S);
            const panelH = headerH + statsH + specialsH + bottomPad;

            // 面板居中
            const maxPy = H - panelH - Math.round(100 * S);
            const py = Math.max(Math.round(20 * S), Math.min((H - panelH) / 2 - Math.round(20 * S), maxPy));
            const px = (W - panelW) / 2;

            // 面板背景
            ctx.fillStyle = 'rgba(10, 12, 25, 0.92)';
            this._roundRect(ctx, px, py, panelW, panelH, 14 * S);
            ctx.fill();
            ctx.strokeStyle = player.def.color;
            ctx.lineWidth = 2;
            this._roundRect(ctx, px, py, panelW, panelH, 14 * S);
            ctx.stroke();

            // 标题
            ctx.save();
            ctx.font = this._font('bold', 22);
            ctx.textAlign = 'center';
            ctx.fillStyle = player.def.color;
            ctx.fillText(`${player.def.icon} ${player.def.name} — 属性`, W / 2, py + Math.round(36 * S));
            ctx.restore();

            // 分割线
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 20 * S, py + Math.round(52 * S));
            ctx.lineTo(px + panelW - 20 * S, py + Math.round(52 * S));
            ctx.stroke();

            const lx = px + Math.round(28 * S);
            const rx = px + panelW - Math.round(28 * S);
            let sy = py + headerH;

            ctx.font = this._font(null, 15);
            for (const s of stats) {
                ctx.textAlign = 'left';
                ctx.fillStyle = '#8899aa';
                ctx.fillText(s.label, lx, sy);
                ctx.textAlign = 'right';
                ctx.fillStyle = s.color;
                ctx.fillText(s.value, rx, sy);
                sy += lineH;
            }

            // 特殊buff区域
            if (specials.length > 0) {
                sy += Math.round(6 * S);
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.moveTo(px + 20 * S, sy - Math.round(14 * S));
                ctx.lineTo(px + panelW - 20 * S, sy - Math.round(14 * S));
                ctx.stroke();

                ctx.font = this._font('bold', 13);
                ctx.textAlign = 'left';
                ctx.fillStyle = '#ffaa44';
                ctx.fillText('已激活技能', lx, sy);
                sy += Math.round(22 * S);

                ctx.font = this._font(null, 14);
                ctx.fillStyle = '#ccddee';
                for (const sp of specials) {
                    ctx.fillText(`◆ ${sp}`, lx, sy);
                    sy += Math.round(22 * S);
                }
            }

            // 记录面板底部 Y 坐标供按钮使用
            this._statsPanelBottom = py + panelH;
        } else {
            // === 暂停标题 ===
            ctx.save();
            ctx.shadowColor = '#6644ff';
            ctx.shadowBlur = 20 * S;
            ctx.font = this._font('bold', 44);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText('⏸ 暂停', W / 2, H * 0.3);
            ctx.restore();
        }

        // 底部按钮（跟随面板底部）
        const btnW = Math.round(160 * S);
        const btnH = Math.round(44 * S);
        const btnGap = Math.round(22 * S);
        const totalBtnW = btnW * 3 + btnGap * 2;
        const btnStartX = (W - totalBtnW) / 2;
        const btnY = showStats ? (this._statsPanelBottom + Math.round(18 * S)) : (H * 0.48);

        const buttons = [
            { label: '继续', action: 'resume', color: '#44aa44', hoverColor: '#55cc55', glow: '#44ff44' },
            { label: showStats ? '关闭属性' : '查看属性', action: 'stats', color: '#4466aa', hoverColor: '#5588cc', glow: '#4488ff' },
            { label: '退出', action: 'quit', color: '#884444', hoverColor: '#aa5555', glow: '#ff4444' },
        ];

        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];
            const bx = btnStartX + i * (btnW + btnGap);
            const isHover = this.mouseX >= bx && this.mouseX <= bx + btnW && this.mouseY >= btnY && this.mouseY <= btnY + btnH;

            ctx.save();
            ctx.shadowColor = btn.glow;
            ctx.shadowBlur = isHover ? 15 * S : 6 * S;
            ctx.fillStyle = isHover ? btn.hoverColor : btn.color;
            this._roundRect(ctx, bx, btnY, btnW, btnH, 10 * S);
            ctx.fill();
            ctx.restore();

            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            ctx.lineWidth = 1;
            this._roundRect(ctx, bx, btnY, btnW, btnH, 10 * S);
            ctx.stroke();

            ctx.font = this._font('bold', 16);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText(btn.label, bx + btnW / 2, btnY + btnH / 2 + 1);

            if (isHover && this.consumeClick()) {
                result = btn.action;
            }
        }

        // 快捷键提示
        ctx.font = this._font(null, 13);
        ctx.fillStyle = '#555577';
        ctx.textAlign = 'center';
        const pauseIsMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        const pauseHint = pauseIsMobile ? '双指点击继续' : 'ESC 继续 · Tab 查看属性';
        ctx.fillText(pauseHint, W / 2, btnY + btnH + Math.round(28 * S));

        this.clicked = false;
        return result;
    }

// 辅助：颜色加深
_darkenColor(hex, factor) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);
    return `rgb(${r},${g},${b})`;
}

// 辅助：颜色提亮（向白色混合）
_lightenColor(hex, amount) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    r = Math.round(r + (255 - r) * amount);
    g = Math.round(g + (255 - g) * amount);
    b = Math.round(b + (255 - b) * amount);
    return `rgb(${r},${g},${b})`;
}

// 辅助：圆角矩形
_roundRect(ctx, x, y, w, h, r) {
        if (r > w / 2) r = w / 2;
        if (r > h / 2) r = h / 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // 辅助：自动换行文字（支持最大行数限制）
    _wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
        const words = text.split('');
        let line = '';
        let lineY = y;
        let lineCount = 1;
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i];
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line.length > 0) {
                // 如果达到最大行数，截断并加省略号
                if (maxLines && lineCount >= maxLines) {
                    line = line.slice(0, -1) + '…';
                    ctx.fillText(line, x, lineY);
                    return lineY;
                }
                ctx.fillText(line, x, lineY);
                line = words[i];
                lineY += lineHeight;
                lineCount++;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, lineY);
        return lineY;
    }

    // ============================================
    // 封面 / 标题界面
    // ============================================

    _initTitleBalls() {
        this._titleBalls = [];
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
        for (let i = 0; i < 12; i++) {
            this._titleBalls.push({
                x: Math.random() * 1280,
                y: Math.random() * 720,
                r: 25 + Math.random() * 40,
                color: colors[i % colors.length],
                vx: (Math.random() - 0.5) * 30,
                vy: (Math.random() - 0.5) * 30,
                phase: Math.random() * Math.PI * 2,
                eyeDir: Math.random() * Math.PI * 2,
            });
        }
    }

    renderTitleScreen(dt) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;
        this._titleTime += dt;
        const t = this._titleTime;

        // ── 多层背景渐变（更丰富的色彩层次） ──
        const bgGrad = ctx.createLinearGradient(0, 0, W * 0.3, H);
        bgGrad.addColorStop(0, '#0f0326');
        bgGrad.addColorStop(0.3, '#1a0533');
        bgGrad.addColorStop(0.6, '#0d1b3e');
        bgGrad.addColorStop(1, '#071a30');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // ── 大面积径向光晕（营造深空质感） ──
        // 中央主光晕 - 紫蓝色
        const cGlow = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, H * 0.7);
        cGlow.addColorStop(0, 'rgba(90, 50, 180, 0.18)');
        cGlow.addColorStop(0.4, 'rgba(40, 80, 160, 0.08)');
        cGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cGlow;
        ctx.fillRect(0, 0, W, H);

        // 右上角暖色光晕
        const rGlow = ctx.createRadialGradient(W * 0.82, H * 0.15, 0, W * 0.82, H * 0.15, H * 0.5);
        rGlow.addColorStop(0, 'rgba(255, 120, 80, 0.07)');
        rGlow.addColorStop(0.5, 'rgba(200, 60, 120, 0.03)');
        rGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = rGlow;
        ctx.fillRect(0, 0, W, H);

        // 左下角青色光晕
        const lGlow = ctx.createRadialGradient(W * 0.15, H * 0.85, 0, W * 0.15, H * 0.85, H * 0.5);
        lGlow.addColorStop(0, 'rgba(78, 205, 196, 0.06)');
        lGlow.addColorStop(0.5, 'rgba(40, 130, 180, 0.03)');
        lGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = lGlow;
        ctx.fillRect(0, 0, W, H);

        // ── 细密噪点纹理（增加质感） ──
        if (!this._noiseCanvas) {
            this._noiseCanvas = document.createElement('canvas');
            this._noiseCanvas.width = 128;
            this._noiseCanvas.height = 128;
            const nctx = this._noiseCanvas.getContext('2d');
            const ndata = nctx.createImageData(128, 128);
            for (let i = 0; i < ndata.data.length; i += 4) {
                const v = Math.random() * 255;
                ndata.data[i] = v;
                ndata.data[i + 1] = v;
                ndata.data[i + 2] = v;
                ndata.data[i + 3] = 12;
            }
            nctx.putImageData(ndata, 0, 0);
        }
        ctx.globalAlpha = 0.35;
        const pat = ctx.createPattern(this._noiseCanvas, 'repeat');
        ctx.fillStyle = pat;
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;

        // ── 舞台射灯（多色锥形聚光灯，从顶部垂直射下） ──
        // 初始化射灯配置（只执行一次）
        if (!this._spotlights) {
            this._spotlights = [
                { baseX: 0.10, color1: [255, 80, 80],  color2: [255, 180, 60],  phase: 0,    width: 0.10, pulseSpd: 1.2 },
                { baseX: 0.28, color1: [180, 60, 255],  color2: [80, 160, 255],  phase: 1.2,  width: 0.12, pulseSpd: 0.9 },
                { baseX: 0.46, color1: [60, 220, 180],  color2: [50, 120, 255],  phase: 2.5,  width: 0.13, pulseSpd: 1.5 },
                { baseX: 0.64, color1: [255, 200, 50],  color2: [255, 100, 150], phase: 3.8,  width: 0.11, pulseSpd: 1.1 },
                { baseX: 0.82, color1: [80, 180, 255],  color2: [160, 80, 255],  phase: 5.1,  width: 0.12, pulseSpd: 0.8 },
                { baseX: 0.50, color1: [255, 130, 200], color2: [100, 255, 180], phase: 6.3,  width: 0.15, pulseSpd: 1.4 },
            ];
        }
        // 存储每帧射灯实时数据，供球球光照检测用
        this._spotlightLive = [];
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        for (const sp of this._spotlights) {
            // X 轴固定不动 — 射灯垂直打下
            const srcX = W * sp.baseX;
            const srcY = -H * 0.02;
            // 射灯底部扩散宽度呼吸微变
            const spread = W * sp.width * (1 + Math.sin(t * 0.6 + sp.phase * 2) * 0.12);
            const botY = H * 1.05;

            // 色彩在 color1 / color2 之间渐变循环
            const colorT = Math.sin(t * 0.5 + sp.phase) * 0.5 + 0.5;
            const r = Math.round(sp.color1[0] + (sp.color2[0] - sp.color1[0]) * colorT);
            const g = Math.round(sp.color1[1] + (sp.color2[1] - sp.color1[1]) * colorT);
            const b = Math.round(sp.color1[2] + (sp.color2[2] - sp.color1[2]) * colorT);

            // 透明度脉冲 — 比之前亮 2~3 倍
            const alpha = 0.10 + Math.sin(t * sp.pulseSpd + sp.phase) * 0.04;

            // 存储实时数据供球球光照用
            this._spotlightLive.push({ x: srcX, spread, botY, r, g, b, alpha });

            // 绘制锥形光束（梯形路径 + 线性渐变填充）
            ctx.beginPath();
            ctx.moveTo(srcX - 4, srcY);
            ctx.lineTo(srcX + 4, srcY);
            ctx.lineTo(srcX + spread, botY);
            ctx.lineTo(srcX - spread, botY);
            ctx.closePath();

            const beamGrad = ctx.createLinearGradient(srcX, srcY, srcX, botY);
            beamGrad.addColorStop(0, `rgba(${r},${g},${b},${(alpha * 2.0).toFixed(3)})`);
            beamGrad.addColorStop(0.08, `rgba(${r},${g},${b},${(alpha * 1.5).toFixed(3)})`);
            beamGrad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha.toFixed(3)})`);
            beamGrad.addColorStop(0.75, `rgba(${r},${g},${b},${(alpha * 0.4).toFixed(3)})`);
            beamGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = beamGrad;
            ctx.fill();

            // 顶部光源亮点（射灯灯头发光 — 更亮）
            const headR = 34 * this.scale;
            const headGlow = ctx.createRadialGradient(srcX, srcY + 4, 0, srcX, srcY + 4, headR);
            headGlow.addColorStop(0, `rgba(${r},${g},${b},0.6)`);
            headGlow.addColorStop(0.3, `rgba(${r},${g},${b},0.2)`);
            headGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);
            ctx.fillStyle = headGlow;
            ctx.beginPath();
            ctx.arc(srcX, srcY + 4, headR, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();

        // ── 多层星星（大小/亮度不同，营造深度） ──
        // 远景小星星
        ctx.fillStyle = '#aabbdd';
        for (let i = 0; i < 60; i++) {
            const sx = (Math.sin(i * 127.1 + t * 0.03) * 0.5 + 0.5) * W;
            const sy = (Math.cos(i * 311.7 + t * 0.02) * 0.5 + 0.5) * H;
            const sr = 0.5 + Math.sin(t * 1.5 + i * 0.9) * 0.3;
            ctx.globalAlpha = 0.15 + Math.sin(t * 2 + i * 1.1) * 0.1;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
        // 中景星星
        ctx.fillStyle = '#ddeeff';
        for (let i = 0; i < 35; i++) {
            const sx = (Math.sin(i * 87.3 + t * 0.08) * 0.5 + 0.5) * W;
            const sy = (Math.cos(i * 213.1 + t * 0.04) * 0.5 + 0.5) * H;
            const sr = 0.8 + Math.sin(t * 2.5 + i * 0.6) * 0.5;
            ctx.globalAlpha = 0.3 + Math.sin(t * 3 + i * 0.7) * 0.2;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
        // 近景亮星 + 十字星芒
        for (let i = 0; i < 8; i++) {
            const sx = (Math.sin(i * 53.7 + 100) * 0.4 + 0.5) * W;
            const sy = (Math.cos(i * 179.3 + 200) * 0.4 + 0.5) * H;
            const bright = 0.35 + Math.sin(t * 1.8 + i * 2.1) * 0.25;
            ctx.globalAlpha = bright;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
            ctx.fill();
            // 十字星芒
            ctx.globalAlpha = bright * 0.4;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.5;
            const armLen = 4 + Math.sin(t * 2.5 + i) * 2;
            ctx.beginPath();
            ctx.moveTo(sx - armLen, sy); ctx.lineTo(sx + armLen, sy);
            ctx.moveTo(sx, sy - armLen); ctx.lineTo(sx, sy + armLen);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // ── 浮动球球们（更鲜明、更有立体感） ──
        for (const ball of this._titleBalls) {
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;
            if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
            if (ball.y < ball.r || ball.y > H - ball.r) ball.vy *= -1;
            ball.x = Math.max(ball.r, Math.min(W - ball.r, ball.x));
            ball.y = Math.max(ball.r, Math.min(H - ball.r, ball.y));

            const bob = Math.sin(t * 2 + ball.phase) * 4;
            const bx = ball.x;
            const by = ball.y + bob;

            // 地面阴影
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.ellipse(bx, by + ball.r + 6, ball.r * 0.7, ball.r * 0.18, 0, 0, Math.PI * 2);
            ctx.fill();

            // 外发光
            ctx.globalAlpha = 0.2;
            const outerGlow = ctx.createRadialGradient(bx, by, ball.r * 0.8, bx, by, ball.r + 10);
            outerGlow.addColorStop(0, ball.color);
            outerGlow.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = outerGlow;
            ctx.beginPath();
            ctx.arc(bx, by, ball.r + 10, 0, Math.PI * 2);
            ctx.fill();

            // 球体（径向渐变立体感，光源偏左上）
            ctx.globalAlpha = 1;
            const lightX = bx - ball.r * 0.25;
            const lightY = by - ball.r * 0.25;
            const bodyGrad = ctx.createRadialGradient(lightX, lightY, ball.r * 0.05, bx + ball.r * 0.1, by + ball.r * 0.1, ball.r);
            bodyGrad.addColorStop(0, this._lightenColor(ball.color, 0.55));
            bodyGrad.addColorStop(0.35, ball.color);
            bodyGrad.addColorStop(0.75, this._darkenColor(ball.color, 0.7));
            bodyGrad.addColorStop(1, this._darkenColor(ball.color, 0.45));
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.arc(bx, by, ball.r, 0, Math.PI * 2);
            ctx.fill();

            // 高光（柔和径向渐变，不是实心圆）
            const hlR = ball.r * 0.28;
            const hlX = bx - ball.r * 0.28;
            const hlY = by - ball.r * 0.32;
            const hlGrad = ctx.createRadialGradient(hlX, hlY, 0, hlX, hlY, hlR);
            hlGrad.addColorStop(0, 'rgba(255,255,255,0.6)');
            hlGrad.addColorStop(0.5, 'rgba(255,255,255,0.2)');
            hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = hlGrad;
            ctx.beginPath();
            ctx.arc(hlX, hlY, hlR, 0, Math.PI * 2);
            ctx.fill();
            // 边缘反光（底部微弱环境光）
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(bx + ball.r * 0.2, by + ball.r * 0.28, ball.r * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            // 眼睛
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#fff';
            const eyeOff = ball.r * 0.25;
            ctx.beginPath();
            ctx.arc(bx - eyeOff, by - ball.r * 0.1, ball.r * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + eyeOff, by - ball.r * 0.1, ball.r * 0.22, 0, Math.PI * 2);
            ctx.fill();
            // 瞳孔
            ctx.fillStyle = '#222';
            const pupilOff = Math.sin(t + ball.phase) * 2;
            ctx.beginPath();
            ctx.arc(bx - eyeOff + pupilOff, by - ball.r * 0.1, ball.r * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(bx + eyeOff + pupilOff, by - ball.r * 0.1, ball.r * 0.12, 0, Math.PI * 2);
            ctx.fill();

            // 嘴巴
            ctx.strokeStyle = 'rgba(0,0,0,0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(bx, by + ball.r * 0.15, ball.r * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
            ctx.stroke();

            // ── 射灯光照效果：球球进入光柱时被打亮 ──
            if (this._spotlightLive) {
                for (const sl of this._spotlightLive) {
                    // 锥形判断：球球Y位置对应的光柱半宽（线性插值）
                    const progress = (by - 0) / sl.botY; // 0=顶部, 1=底部
                    if (progress < 0 || progress > 1) continue;
                    const halfW = 4 + (sl.spread - 4) * progress; // 顶部宽4px 到底部spread
                    const dist = Math.abs(bx - sl.x);
                    if (dist < halfW + ball.r * 0.5) {
                        // 在光柱内 — 距离中心越近越亮
                        const intensity = 1 - dist / (halfW + ball.r * 0.5);
                        const litAlpha = intensity * sl.alpha * 2.5;
                        // 从球顶打下的光照光晕
                        ctx.globalAlpha = Math.min(litAlpha, 0.55);
                        const litGrad = ctx.createRadialGradient(bx, by - ball.r * 0.4, 0, bx, by, ball.r * 1.2);
                        litGrad.addColorStop(0, `rgba(${sl.r},${sl.g},${sl.b},0.7)`);
                        litGrad.addColorStop(0.5, `rgba(${sl.r},${sl.g},${sl.b},0.25)`);
                        litGrad.addColorStop(1, `rgba(${sl.r},${sl.g},${sl.b},0)`);
                        ctx.fillStyle = litGrad;
                        ctx.beginPath();
                        ctx.arc(bx, by, ball.r * 1.2, 0, Math.PI * 2);
                        ctx.fill();
                        // 顶部高光条（模拟光从上方射入的反光）
                        ctx.globalAlpha = Math.min(litAlpha * 0.8, 0.4);
                        const topHlGrad = ctx.createRadialGradient(bx, by - ball.r * 0.55, 0, bx, by - ball.r * 0.4, ball.r * 0.5);
                        topHlGrad.addColorStop(0, `rgba(${sl.r},${sl.g},${sl.b},0.6)`);
                        topHlGrad.addColorStop(1, `rgba(${sl.r},${sl.g},${sl.b},0)`);
                        ctx.fillStyle = topHlGrad;
                        ctx.beginPath();
                        ctx.arc(bx, by - ball.r * 0.4, ball.r * 0.5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            ctx.globalAlpha = 1;
        }

        // ── 标题区域（艺术字逐字绘制） ──
        const titleY = H * 0.26;
        const glowPulse = Math.sin(t * 2) * 0.3 + 0.7;

        // 标题背后的大光晕盘
        const titleGlowR = 220 * S;
        const titleGlow = ctx.createRadialGradient(W / 2, titleY, 0, W / 2, titleY, titleGlowR);
        titleGlow.addColorStop(0, 'rgba(120, 100, 255, 0.14)');
        titleGlow.addColorStop(0.4, 'rgba(60, 80, 200, 0.06)');
        titleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = titleGlow;
        ctx.globalAlpha = glowPulse;
        ctx.fillRect(W / 2 - titleGlowR, titleY - titleGlowR, titleGlowR * 2, titleGlowR * 2);
        ctx.globalAlpha = 1;

        // 逐字绘制艺术标题
        const chars = ['球', '球', '英', '雄'];
        const charColors = [
            ['#ff6b6b', '#ff3b3b'],  // 球1: 红粉
            ['#feca57', '#ff9f43'],  // 球2: 金黄
            ['#4ecdc4', '#0abde3'],  // 英: 青绿
            ['#45b7d1', '#54a0ff'],  // 雄: 蓝
        ];
        const mainSize = 78;
        const charSpacing = 82 * S;
        const totalW = (chars.length - 1) * charSpacing;
        const startX = W / 2 - totalW / 2;

        for (let ci = 0; ci < chars.length; ci++) {
            const ch = chars[ci];
            const cx = startX + ci * charSpacing;
            // 每个字有独立的弹跳节奏
            const bounce = Math.sin(t * 2.8 + ci * 0.7) * 6 * S;
            // "球球"字做额外的缩放脉冲（Q弹效果）
            const isBall = ci < 2;
            const scaleX = isBall ? (1 + Math.sin(t * 3.2 + ci * 1.1) * 0.04) : 1;
            const scaleY = isBall ? (1 + Math.cos(t * 3.2 + ci * 1.1) * 0.04) : 1;
            const cy = titleY + bounce;

            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(scaleX, scaleY);

            const fontSize = isBall ? mainSize + 4 : mainSize;
            const fontFamily = isBall
                ? "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"
                : "'Microsoft YaHei', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // ① 深色外阴影
            ctx.font = `bold ${Math.round(fontSize * S)}px ${fontFamily}`;
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillText(ch, 3 * S, 4 * S);

            // ② 彩色粗描边（给字体厚度感）
            ctx.lineWidth = 6 * S;
            ctx.strokeStyle = this._darkenColor(charColors[ci][0], 0.6);
            ctx.lineJoin = 'round';
            ctx.strokeText(ch, 0, 0);

            // ③ 主体彩色渐变填充
            const cGrad = ctx.createLinearGradient(0, -fontSize * S * 0.5, 0, fontSize * S * 0.5);
            cGrad.addColorStop(0, charColors[ci][0]);
            cGrad.addColorStop(0.5, '#ffffff');
            cGrad.addColorStop(1, charColors[ci][1]);
            ctx.fillStyle = cGrad;
            ctx.fillText(ch, 0, 0);

            // ④ 白色内高光（上半部分亮面）
            ctx.globalAlpha = 0.35;
            const hiGrad = ctx.createLinearGradient(0, -fontSize * S * 0.5, 0, 0);
            hiGrad.addColorStop(0, '#ffffff');
            hiGrad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = hiGrad;
            ctx.fillText(ch, 0, -1 * S);
            ctx.globalAlpha = 1;

            // ⑤ 亮色细描边（轮廓精致感）
            ctx.lineWidth = 1.5 * S;
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.strokeText(ch, 0, 0);

            // ⑥ "球球"字额外添加小圆球装饰
            if (isBall) {
                const decoBob = Math.sin(t * 4 + ci * 2) * 3 * S;
                const decoR = 7 * S;
                const decoX = (ci === 0 ? -1 : 1) * (fontSize * S * 0.48);
                const decoY = -fontSize * S * 0.35 + decoBob;
                // 小球身体
                const dGrad = ctx.createRadialGradient(decoX - decoR * 0.3, decoY - decoR * 0.3, decoR * 0.1, decoX, decoY, decoR);
                dGrad.addColorStop(0, '#fff');
                dGrad.addColorStop(0.3, charColors[ci][0]);
                dGrad.addColorStop(1, this._darkenColor(charColors[ci][1], 0.6));
                ctx.fillStyle = dGrad;
                ctx.beginPath();
                ctx.arc(decoX, decoY, decoR, 0, Math.PI * 2);
                ctx.fill();
                // 小球高光
                ctx.fillStyle = '#fff';
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(decoX - decoR * 0.25, decoY - decoR * 0.3, decoR * 0.35, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            ctx.restore();
        }

        // 标题整体呼吸光晕
        ctx.globalAlpha = glowPulse * 0.08;
        ctx.font = `bold ${Math.round(82 * S)}px 'Microsoft YaHei', 'PingFang SC', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('\u7403\u7403\u82f1\u96c4', W / 2, titleY);
        ctx.globalAlpha = 1;
        ctx.textBaseline = 'alphabetic';

        // 副标题（带装饰线）
        ctx.font = this._font(null, 17);
        const subY = titleY + 60 * S;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#aaccdd';
        ctx.fillText('Roguelike \u00b7 \u751f\u5b58 \u00b7 \u5192\u9669', W / 2, subY);
        // 两侧装饰线
        const subW = ctx.measureText('Roguelike \u00b7 \u751f\u5b58 \u00b7 \u5192\u9669').width;
        ctx.strokeStyle = 'rgba(150,180,220,0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - subW / 2 - 30 * S, subY); ctx.lineTo(W / 2 - subW / 2 - 6 * S, subY);
        ctx.moveTo(W / 2 + subW / 2 + 6 * S, subY); ctx.lineTo(W / 2 + subW / 2 + 30 * S, subY);
        ctx.stroke();

        // ── 按钮区域 ──
        const btnW = Math.round(220 * S);
        const btnH = Math.round(54 * S);
        const btnGap = Math.round(22 * S);
        const btnBaseY = H * 0.58;

        // 开始游戏按钮
        const startBtnX = W / 2 - btnW / 2;
        const startBtnY = btnBaseY;
        const startHover = this.mouseX >= startBtnX && this.mouseX <= startBtnX + btnW &&
                           this.mouseY >= startBtnY && this.mouseY <= startBtnY + btnH;

        // 按钮发光底
        if (startHover) {
            ctx.globalAlpha = 0.15;
            ctx.shadowColor = '#4ecdc4';
            ctx.shadowBlur = 30;
            ctx.fillStyle = '#4ecdc4';
            this._roundRect(ctx, startBtnX - 4, startBtnY - 4, btnW + 8, btnH + 8, 30 * S);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }

        const startGrad = ctx.createLinearGradient(startBtnX, startBtnY, startBtnX + btnW, startBtnY + btnH);
        startGrad.addColorStop(0, startHover ? '#66eebb' : '#4ecdc4');
        startGrad.addColorStop(1, startHover ? '#45d9a8' : '#45b7d1');
        ctx.fillStyle = startGrad;
        this._roundRect(ctx, startBtnX, startBtnY, btnW, btnH, 27 * S);
        ctx.fill();
        // 按钮内高光条
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ffffff';
        this._roundRect(ctx, startBtnX + 2, startBtnY + 2, btnW - 4, btnH * 0.45, 27 * S);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = this._font('bold', 22);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('\u5f00\u59cb\u6e38\u620f', W / 2, startBtnY + btnH / 2 + 1);

        // 游戏设置按钮
        const setBtnY = startBtnY + btnH + btnGap;
        const setBtnX = W / 2 - btnW / 2;
        const setHover = this.mouseX >= setBtnX && this.mouseX <= setBtnX + btnW &&
                         this.mouseY >= setBtnY && this.mouseY <= setBtnY + btnH;

        ctx.fillStyle = setHover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
        this._roundRect(ctx, setBtnX, setBtnY, btnW, btnH, 27 * S);
        ctx.fill();
        ctx.strokeStyle = setHover ? 'rgba(170,200,240,0.6)' : 'rgba(100,140,180,0.3)';
        ctx.lineWidth = 1.5;
        this._roundRect(ctx, setBtnX, setBtnY, btnW, btnH, 27 * S);
        ctx.stroke();

        ctx.font = this._font('bold', 20);
        ctx.fillStyle = setHover ? '#ddeeff' : '#8899aa';
        ctx.fillText('\u6e38\u620f\u8bbe\u7f6e', W / 2, setBtnY + btnH / 2 + 1);

        // ── 底部装饰线 + 版本号 ──
        ctx.strokeStyle = 'rgba(100,140,180,0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W * 0.3, H - 36 * S);
        ctx.lineTo(W * 0.7, H - 36 * S);
        ctx.stroke();

        ctx.font = this._font(null, 11);
        ctx.fillStyle = '#445566';
        ctx.textAlign = 'center';
        ctx.fillText('v1.0  by CatDesk', W / 2, H - 18 * S);

        // 点击检测
        if (startHover && this.consumeClick()) {
            this.clicked = false;
            return 'start';
        }
        if (setHover && this.consumeClick()) {
            this.clicked = false;
            return 'settings';
        }

        this.clicked = false;
        return null;
    }

    // ============================================
    // 设置界面
    // ============================================

    renderSettingsScreen(dt) {
        const ctx = this.ctx;
        const W = this.W;
        const H = this.H;
        const S = this.scale;
        this._titleTime += dt;

        // ── 背景：与封面统一的深蓝星空渐变 ──
        const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
        bgGrad.addColorStop(0, '#1a0533');
        bgGrad.addColorStop(0.5, '#0d1b3e');
        bgGrad.addColorStop(1, '#0a2647');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, W, H);

        // ── 星星背景 ──
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const sx = (Math.sin(i * 127.1 + this._titleTime * 0.1) * 0.5 + 0.5) * W;
            const sy = (Math.cos(i * 311.7 + this._titleTime * 0.05) * 0.5 + 0.5) * H;
            const sr = 1 + Math.sin(this._titleTime * 2 + i) * 0.5;
            ctx.globalAlpha = 0.2 + Math.sin(this._titleTime * 3 + i * 0.7) * 0.12;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // 标题
        ctx.font = this._font('bold', 32);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('游戏设置', W / 2, H * 0.12);

        // 设置面板
        const panelW = Math.min(500 * S, W * 0.85);
        const panelH = Math.round(380 * S);
        const panelX = W / 2 - panelW / 2;
        const panelY = H * 0.18;
        const itemH = Math.round(55 * S);
        const itemPad = Math.round(18 * S);

        ctx.fillStyle = 'rgba(12,22,45,0.8)';
        ctx.strokeStyle = 'rgba(60,80,120,0.3)';
        ctx.lineWidth = 1;
        this._roundRect(ctx, panelX, panelY, panelW, panelH, 16 * S);
        ctx.fill();
        this._roundRect(ctx, panelX, panelY, panelW, panelH, 16 * S);
        ctx.stroke();

        let curY = panelY + itemPad;
        const labelX = panelX + itemPad * 2;
        const rightX = panelX + panelW - itemPad * 2;

        // --- 音效开关 ---
        ctx.font = this._font(null, 16);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ccddee';
        ctx.fillText('音效', labelX, curY + itemH / 2);
        const soundBtnW = 70 * S;
        const soundBtnH = 32 * S;
        const soundBtnX = rightX - soundBtnW;
        const soundBtnY = curY + (itemH - soundBtnH) / 2 - 5 * S;
        const soundHover = this.mouseX >= soundBtnX && this.mouseX <= soundBtnX + soundBtnW &&
                           this.mouseY >= soundBtnY && this.mouseY <= soundBtnY + soundBtnH;
        ctx.fillStyle = this.settings.soundEnabled ? '#4ecdc4' : '#445566';
        this._roundRect(ctx, soundBtnX, soundBtnY, soundBtnW, soundBtnH, 16 * S);
        ctx.fill();
        ctx.font = this._font('bold', 13);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.settings.soundEnabled ? '开启' : '关闭', soundBtnX + soundBtnW / 2, soundBtnY + soundBtnH / 2 + 1);
        if (soundHover && this.consumeClick()) {
            this.settings.soundEnabled = !this.settings.soundEnabled;
        }

        curY += itemH;

        // --- 音乐开关 ---
        ctx.font = this._font(null, 16);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ccddee';
        ctx.fillText('音乐', labelX, curY + itemH / 2);
        const musicBtnX = rightX - soundBtnW;
        const musicBtnY = curY + (itemH - soundBtnH) / 2 - 5 * S;
        const musicHover = this.mouseX >= musicBtnX && this.mouseX <= musicBtnX + soundBtnW &&
                           this.mouseY >= musicBtnY && this.mouseY <= musicBtnY + soundBtnH;
        ctx.fillStyle = this.settings.musicEnabled ? '#4ecdc4' : '#445566';
        this._roundRect(ctx, musicBtnX, musicBtnY, soundBtnW, soundBtnH, 16 * S);
        ctx.fill();
        ctx.font = this._font('bold', 13);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.settings.musicEnabled ? '开启' : '关闭', musicBtnX + soundBtnW / 2, musicBtnY + soundBtnH / 2 + 1);
        if (musicHover && this.consumeClick()) {
            this.settings.musicEnabled = !this.settings.musicEnabled;
        }

        curY += itemH;

        // --- 难度选择 ---
        ctx.font = this._font(null, 16);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ccddee';
        ctx.fillText('难度', labelX, curY + itemH / 2);
        const difficulties = [
            { id: 'easy', label: '简单', color: '#96e6a1' },
            { id: 'normal', label: '普通', color: '#feca57' },
            { id: 'hard', label: '困难', color: '#ff6b6b' },
        ];
        const diffBtnW = 60 * S;
        const diffBtnH = 30 * S;
        const diffGap = 8 * S;
        const diffTotalW = difficulties.length * diffBtnW + (difficulties.length - 1) * diffGap;
        let diffStartX = rightX - diffTotalW;
        for (const diff of difficulties) {
            const dBtnY = curY + (itemH - diffBtnH) / 2 - 5 * S;
            const isActive = this.settings.difficulty === diff.id;
            const dHover = this.mouseX >= diffStartX && this.mouseX <= diffStartX + diffBtnW &&
                           this.mouseY >= dBtnY && this.mouseY <= dBtnY + diffBtnH;
            ctx.fillStyle = isActive ? diff.color : (dHover ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)');
            this._roundRect(ctx, diffStartX, dBtnY, diffBtnW, diffBtnH, 15 * S);
            ctx.fill();
            if (!isActive) {
                ctx.strokeStyle = dHover ? diff.color : '#445566';
                ctx.lineWidth = 1;
                this._roundRect(ctx, diffStartX, dBtnY, diffBtnW, diffBtnH, 15 * S);
                ctx.stroke();
            }
            ctx.font = this._font('bold', 12);
            ctx.textAlign = 'center';
            ctx.fillStyle = isActive ? '#222' : '#aabbcc';
            ctx.fillText(diff.label, diffStartX + diffBtnW / 2, dBtnY + diffBtnH / 2 + 1);
            if (dHover && this.consumeClick()) {
                this.settings.difficulty = diff.id;
            }
            diffStartX += diffBtnW + diffGap;
        }

        curY += itemH;

        // --- 显示帧率 ---
        ctx.font = this._font(null, 16);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ccddee';
        ctx.fillText('显示帧率', labelX, curY + itemH / 2);
        const fpsBtnX = rightX - soundBtnW;
        const fpsBtnY = curY + (itemH - soundBtnH) / 2 - 5 * S;
        const fpsHover = this.mouseX >= fpsBtnX && this.mouseX <= fpsBtnX + soundBtnW &&
                         this.mouseY >= fpsBtnY && this.mouseY <= fpsBtnY + soundBtnH;
        ctx.fillStyle = this.settings.showFps ? '#4ecdc4' : '#445566';
        this._roundRect(ctx, fpsBtnX, fpsBtnY, soundBtnW, soundBtnH, 16 * S);
        ctx.fill();
        ctx.font = this._font('bold', 13);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.fillText(this.settings.showFps ? '开启' : '关闭', fpsBtnX + soundBtnW / 2, fpsBtnY + soundBtnH / 2 + 1);
        if (fpsHover && this.consumeClick()) {
            this.settings.showFps = !this.settings.showFps;
        }

        curY += itemH;

        // --- 操作说明 ---
        ctx.font = this._font(null, 16);
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ccddee';
        ctx.fillText('操作说明', labelX, curY + itemH / 2);
        const helpBtnW = 70 * S;
        const helpBtnH = 32 * S;
        const helpBtnX = rightX - helpBtnW;
        const helpBtnY = curY + (itemH - helpBtnH) / 2 - 5 * S;
        const helpHover = this.mouseX >= helpBtnX && this.mouseX <= helpBtnX + helpBtnW &&
                          this.mouseY >= helpBtnY && this.mouseY <= helpBtnY + helpBtnH;
        ctx.fillStyle = helpHover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
        this._roundRect(ctx, helpBtnX, helpBtnY, helpBtnW, helpBtnH, 16 * S);
        ctx.fill();
        ctx.strokeStyle = helpHover ? '#88bbdd' : '#445566';
        ctx.lineWidth = 1;
        this._roundRect(ctx, helpBtnX, helpBtnY, helpBtnW, helpBtnH, 16 * S);
        ctx.stroke();
        ctx.font = this._font('bold', 13);
        ctx.textAlign = 'center';
        ctx.fillStyle = helpHover ? '#fff' : '#aabbcc';
        ctx.fillText('查看', helpBtnX + helpBtnW / 2, helpBtnY + helpBtnH / 2 + 1);
        if (helpHover && this.consumeClick()) {
            this.settings.showControls = !this.settings.showControls;
        }

        // --- 返回按钮 ---
        const backBtnW = Math.round(160 * S);
        const backBtnH = Math.round(44 * S);
        const backBtnX = W / 2 - backBtnW / 2;
        const backBtnY = panelY + panelH + 30 * S;
        const backHover = this.mouseX >= backBtnX && this.mouseX <= backBtnX + backBtnW &&
                          this.mouseY >= backBtnY && this.mouseY <= backBtnY + backBtnH;
        ctx.fillStyle = backHover ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)';
        ctx.strokeStyle = backHover ? '#ffffff' : '#667788';
        ctx.lineWidth = 2;
        this._roundRect(ctx, backBtnX, backBtnY, backBtnW, backBtnH, 22 * S);
        ctx.fill();
        this._roundRect(ctx, backBtnX, backBtnY, backBtnW, backBtnH, 22 * S);
        ctx.stroke();
        ctx.font = this._font('bold', 18);
        ctx.fillStyle = backHover ? '#fff' : '#aabbcc';
        ctx.textAlign = 'center';
        ctx.fillText('← 返回', W / 2, backBtnY + backBtnH / 2 + 1);

        // 操作说明弹窗
        if (this.settings.showControls) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, W, H);

            const popW = Math.min(400 * S, W * 0.8);
            const popH = Math.round(280 * S);
            const popX = W / 2 - popW / 2;
            const popY = H / 2 - popH / 2;

            ctx.fillStyle = 'rgba(12,22,50,0.95)';
            ctx.strokeStyle = 'rgba(78,205,196,0.5)';
            ctx.lineWidth = 2;
            this._roundRect(ctx, popX, popY, popW, popH, 16 * S);
            ctx.fill();
            this._roundRect(ctx, popX, popY, popW, popH, 16 * S);
            ctx.stroke();

            ctx.font = this._font('bold', 20);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('操作说明', W / 2, popY + 35 * S);

            ctx.font = this._font(null, 14);
            ctx.fillStyle = '#aaccee';
            ctx.textAlign = 'left';
            const isMobile = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
            const lines = isMobile ? [
                '📱 触屏操作：',
                '  · 手指按住屏幕拖拽 → 移动角色',
                '  · 松手 → 停止移动',
                '  · 双指同时点击 → 暂停/继续',
                '  · 角色自动攻击最近的敌人',
                '  · 升级时点击选择强化项',
            ] : [
                '🖥️ 键盘操作：',
                '  · WASD / 方向键 → 移动角色',
                '  · ESC → 暂停/继续',
                '  · Tab → 查看属性面板',
                '  · 角色自动攻击最近的敌人',
                '  · 升级时点击选择强化项',
            ];
            let lineY = popY + 65 * S;
            for (const l of lines) {
                ctx.fillText(l, popX + 30 * S, lineY);
                lineY += 28 * S;
            }

            // 关闭按钮
            const closeBtnW = 100 * S;
            const closeBtnH = 36 * S;
            const closeBtnX = W / 2 - closeBtnW / 2;
            const closeBtnY = popY + popH - 55 * S;
            const closeHover = this.mouseX >= closeBtnX && this.mouseX <= closeBtnX + closeBtnW &&
                               this.mouseY >= closeBtnY && this.mouseY <= closeBtnY + closeBtnH;
            ctx.fillStyle = closeHover ? '#4ecdc4' : 'rgba(78,205,196,0.3)';
            this._roundRect(ctx, closeBtnX, closeBtnY, closeBtnW, closeBtnH, 18 * S);
            ctx.fill();
            ctx.font = this._font('bold', 14);
            ctx.textAlign = 'center';
            ctx.fillStyle = '#fff';
            ctx.fillText('知道了', W / 2, closeBtnY + closeBtnH / 2 + 1);

            if (closeHover && this.consumeClick()) {
                this.settings.showControls = false;
            }
            this.clicked = false;
            return null;
        }

        if (backHover && this.consumeClick()) {
            this.clicked = false;
            return 'back';
        }
        this.clicked = false;
        return null;
    }
}