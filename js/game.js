// ============================================
// 游戏主循环
// ============================================

class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // 自适应大小
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // 系统
        this.particles = new ParticleSystem();
        this.ui = new UISystem(this.canvas, this.ctx);
        this.ui.resize(this.logicWidth, this.logicHeight);

        // 游戏状态
        this.state = 'title'; // title, settings, menu, playing, upgrading, dead, paused
        this.player = null;
        this.enemies = [];
        this.expGems = [];
        this.enemyBullets = [];
        this.waveManager = null;
        this.weapons = null;

        // 相机
        this.camera = { x: 0, y: 0 };

        // 输入
        this.keys = {};
        this.inputDir = { x: 0, y: 0 };
        this._setupInput();

        // 升级
        this.upgradeChoices = null;
        this.pendingLevelUps = 0;

        // 背景地砖
        this.gridSize = 80;

        // FPS
        this.lastTime = 0;
        this.fps = 60;
        this.frameCount = 0;
        this.fpsTimer = 0;

        // 暂停 & 属性面板
        this.showStatsPanel = false;

        // === 新系统状态 ===
        this.mapHazards = [];
        this.relicDrops = [];
        this.activeBoss = null;
        this.screenFlash = { color: '#fff', alpha: 0 };
        this.freezeTimer = 0; // 冻帧倒计时
        this.achievementPopup = null;
        this.achievementTimer = 0;
        this.deathAnimEnemies = []; // 正在播放死亡动画的敌人
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.dpr = dpr;
        const w = window.innerWidth;
        const h = window.innerHeight;

        // 物理像素 = 逻辑尺寸 × devicePixelRatio，提升渲染精度
        this.canvas.width = Math.round(w * dpr);
        this.canvas.height = Math.round(h * dpr);
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';

        // 缩放画布坐标系，使后续绘制代码仍以逻辑像素为单位
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // 文字抗锯齿优化
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        // 文字渲染质量提示
        this.ctx.textRendering = 'optimizeLegibility';

        // 逻辑尺寸（供游戏逻辑和UI使用）
        this.logicWidth = w;
        this.logicHeight = h;

        if (this.ui) this.ui.resize(w, h, dpr);
    }

    _setupInput() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;

            // Escape 暂停/继续
            if (e.code === 'Escape' && (this.state === 'playing' || this.state === 'paused')) {
                if (this.state === 'playing') {
                    this.state = 'paused';
                } else {
                    this.state = 'playing';
                    this.showStatsPanel = false;
                }
            }
            // Tab 切换属性面板（仅在 playing / paused 时）
            if (e.code === 'Tab' && (this.state === 'playing' || this.state === 'paused')) {
                this.showStatsPanel = !this.showStatsPanel;
            }

            e.preventDefault();
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // === 触屏虚拟摇杆 ===
        this.isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
        this.joystick = {
            active: false,      // 是否正在触摸
            touchId: null,      // 当前控制的 touch identifier
            baseX: 0, baseY: 0, // 摇杆底座中心（触摸起始点）
            stickX: 0, stickY: 0, // 当前摇杆位置
            dx: 0, dy: 0,       // 归一化方向 (-1~1)
            radius: 60,         // 摇杆底座半径
        };

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // 只在 playing / paused 状态下处理摇杆和暂停
            if (this.state !== 'playing' && this.state !== 'paused') return;

            // 双指点击 → 暂停/继续
            if (e.touches.length >= 2) {
                if (this.state === 'playing') {
                    this.state = 'paused';
                } else if (this.state === 'paused') {
                    this.state = 'playing';
                    this.showStatsPanel = false;
                }
                // 重置摇杆
                this.joystick.active = false;
                this.joystick.touchId = null;
                this.joystick.dx = 0;
                this.joystick.dy = 0;
                return;
            }

            if (this.state !== 'playing') return;

            for (const t of e.changedTouches) {
                if (!this.joystick.active) {
                    // 第一根手指：启动摇杆（无论触摸位置）
                    this.joystick.active = true;
                    this.joystick.touchId = t.identifier;
                    this.joystick.baseX = t.clientX;
                    this.joystick.baseY = t.clientY;
                    this.joystick.stickX = t.clientX;
                    this.joystick.stickY = t.clientY;
                    this.joystick.dx = 0;
                    this.joystick.dy = 0;
                }
            }
        }, { passive: false });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) {
                if (this.joystick.active && t.identifier === this.joystick.touchId) {
                    const dx = t.clientX - this.joystick.baseX;
                    const dy = t.clientY - this.joystick.baseY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = this.joystick.radius;

                    if (dist > 0) {
                        const clampDist = Math.min(dist, maxDist);
                        this.joystick.stickX = this.joystick.baseX + (dx / dist) * clampDist;
                        this.joystick.stickY = this.joystick.baseY + (dy / dist) * clampDist;
                        this.joystick.dx = dx / Math.max(dist, maxDist);
                        this.joystick.dy = dy / Math.max(dist, maxDist);
                    }
                }
            }
        }, { passive: false });

        const endTouch = (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) {
                if (this.joystick.active && t.identifier === this.joystick.touchId) {
                    this.joystick.active = false;
                    this.joystick.touchId = null;
                    this.joystick.dx = 0;
                    this.joystick.dy = 0;
                }
            }
        };
        this.canvas.addEventListener('touchend', endTouch, { passive: false });
        this.canvas.addEventListener('touchcancel', endTouch, { passive: false });
    }

    _updateInput() {
        this.inputDir.x = 0;
        this.inputDir.y = 0;

        // 键盘输入
        if (this.keys['KeyW'] || this.keys['ArrowUp']) this.inputDir.y = -1;
        if (this.keys['KeyS'] || this.keys['ArrowDown']) this.inputDir.y = 1;
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) this.inputDir.x = -1;
        if (this.keys['KeyD'] || this.keys['ArrowRight']) this.inputDir.x = 1;

        // 触屏摇杆输入（叠加，取较大值）
        if (this.joystick.active) {
            const deadzone = 0.15;
            if (Math.abs(this.joystick.dx) > deadzone || Math.abs(this.joystick.dy) > deadzone) {
                this.inputDir.x = this.joystick.dx;
                this.inputDir.y = this.joystick.dy;
            }
        }
    }

    start() {
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        const rawDt = (timestamp - this.lastTime) / 1000;
        const dt = Math.min(rawDt, 0.05); // 防止跳帧
        this.lastTime = timestamp;

        // FPS 计算
        this.frameCount++;
        this.fpsTimer += rawDt;
        if (this.fpsTimer >= 1) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.fpsTimer = 0;
        }

        this.ctx.clearRect(0, 0, this.logicWidth, this.logicHeight);

        // 冻帧处理：仍然渲染但不更新逻辑
        if (this.freezeTimer > 0) {
            this.freezeTimer -= rawDt;
            if (this.state === 'playing') this._render();
            requestAnimationFrame((t) => this.loop(t));
            return;
        }

        switch (this.state) {
            case 'title':
                this._updateTitle(dt);
                break;
            case 'settings':
                this._updateSettings(dt);
                break;
            case 'menu':
                this._updateMenu(dt);
                break;
            case 'playing':
                this._updatePlaying(dt);
                break;
            case 'upgrading':
                this._updateUpgrading(dt);
                break;
            case 'paused':
                this._updatePaused(dt);
                break;
            case 'dead':
                this._updateDead(dt);
                break;
        }

        // FPS显示（根据设置决定是否显示）
        if (this.ui.settings.showFps) {
            this.ctx.font = "12px 'Consolas', 'Monaco', 'Courier New', monospace";
            this.ctx.fillStyle = '#555';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`FPS: ${this.fps}  Enemies: ${this.enemies.length}  Particles: ${this.particles.particles.length}`, 10, this.logicHeight - 10);
        }

        requestAnimationFrame((t) => this.loop(t));
    }

    // === 标题界面 ===
    _updateTitle(dt) {
        const result = this.ui.renderTitleScreen(dt);
        if (result === 'start') {
            this.state = 'menu';
        } else if (result === 'settings') {
            this.state = 'settings';
        }
    }

    // === 设置界面 ===
    _updateSettings(dt) {
        const result = this.ui.renderSettingsScreen(dt);
        if (result === 'back') {
            this.state = 'title';
        }
    }

    // === 菜单 ===
    _updateMenu(dt) {
        const selected = this.ui.renderMainMenu(dt);
        if (selected) {
            this._startGame(selected);
        }
    }

    _startGame(charId) {
        const def = CharacterDefs[charId];
        this.player = new Player(def);
        this.player.x = 0;
        this.player.y = 0;
        this.enemies = [];
        this.expGems = [];
        this.enemyBullets = [];
        this.dropItems = [];
        this.waveManager = new WaveManager();
        // 应用难度设置
        const diffSetting = this.ui.settings.difficulty;
        this.waveManager.difficultyMultiplier = diffSetting === 'easy' ? 0.6 : diffSetting === 'hard' ? 1.5 : 1.0;
        this.weapons = new WeaponSystem(this.player, this.particles);
        // 召唤物系统（亡灵师专用）
        this.summonManager = new SummonManager(this.player, this.particles);
        this.weapons.summonManager = this.summonManager;
        this.player._summonManager = this.summonManager; // 供升级系统解锁召唤物类型
        this.particles.clear();
        this.pendingLevelUps = 0;
        this.upgradeChoices = null;
        this._pendingBossRewards = 0;
        this._isBossReward = false;
        UpgradePool.resetChoices();

        // 新buff计时器
        this.orbitalAngle = 0;
        this.fireTrailTimer = 0;
        this.fireTrails = [];  // {x, y, life, maxLife}
        this.frostTimer = 0;
        this.burnAuraTimer = 0;

        // 受伤反馈
        this.damageVignette = 0;       // 屏幕红色渐变强度
        this.damageIndicators = [];     // {angle, life} 方向箭头

        // 新系统重置
        this.mapHazards = [];
        this.relicDrops = [];
        this.activeBoss = null;
        this.screenFlash = { color: '#fff', alpha: 0 };
        this.freezeTimer = 0;
        this.achievementPopup = null;
        this.achievementTimer = 0;
        this.deathAnimEnemies = [];

        // 应用永久升级（天赋商店加成）
        if (typeof MetaProgress !== 'undefined') {
            MetaProgress.applyPermUpgrades(this.player);
        }

        // 初始化相机到玩家位置
        this.camera.x = this.player.x - this.logicWidth / 2;
        this.camera.y = this.player.y - this.logicHeight / 2;
        this.state = 'playing';
    }

    // === 游戏进行 ===
    _updatePlaying(dt) {
        this._dt = dt; // 缓存dt供render使用
        this._updateInput();

        // 更新玩家
        this.player.update(dt, this.inputDir, this.particles);

        // 更新相机（平滑跟随）
        this.camera.x = Utils.lerp(this.camera.x, this.player.x - this.logicWidth / 2, 0.1);
        this.camera.y = Utils.lerp(this.camera.y, this.player.y - this.logicHeight / 2, 0.1);

        // 屏幕震动
        Utils.updateShake();

        // 波次管理/生怪
        const waveResult = this.waveManager.update(dt, this.player.x, this.player.y, this.enemies, this.particles);
        if (waveResult && waveResult.type === 'stageBossDefeated') {
            // 阶段Boss被击败 → 触发3个buff奖励选择
            this._pendingBossRewards = 3;
        }

        // 更新武器
        this.weapons.update(dt, this.enemies, this.camera);

        // 更新怪物
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const bossEvent = enemy.update(dt, this.player.x, this.player.y);

            // Boss AI事件处理
            if (bossEvent) {
                this._handleBossEvent(bossEvent, enemy);
            }

            // 更新敌人身上的debuff计时器
            if (enemy._shadowMarkTimer > 0) {
                enemy._shadowMarkTimer -= dt;
                if (enemy._shadowMarkTimer <= 0) enemy._shadowMark = false;
            }
            if (enemy._blazeTimer > 0) {
                enemy._blazeTimer -= dt;
                if (enemy._blazeTimer <= 0) enemy._blazeStacks = 0;
            }

            if (!enemy.alive) {
                // 连杀系统
                this.player.addComboKill();
                this.particles.addComboText(this.player.x, this.player.y - 30, this.player.comboCount);

                // 掉落经验
                this._spawnExp(enemy);
                // 掉落道具
                this._trySpawnDrop(enemy);

                // 死亡动画（Boss用环状扩散，普通用碎片）
                if (enemy.dying) {
                    this.deathAnimEnemies.push(enemy);
                }

                // 死亡特效
                this.particles.explode(enemy.x, enemy.y, enemy.colors, enemy.isBoss ? 40 : (enemy.isElite ? 25 : 12), enemy.isBoss ? 8 : 4);
                if (enemy.isBoss) {
                    this.particles.superExplode(enemy.x, enemy.y, enemy.colors);
                    // Boss击杀：冻帧 + 屏幕闪白 + 掉落遗物
                    this.freezeTimer = 0.15;
                    this.screenFlash = { color: '#ffffff', alpha: 0.6 };
                    this._spawnRelicDrop(enemy);
                    this.activeBoss = null;
                } else if (enemy.isElite) {
                    // 精英击杀：小冻帧
                    this.freezeTimer = 0.05;
                    this.screenFlash = { color: '#ffaa00', alpha: 0.3 };
                }

                this.enemies.splice(i, 1);
                continue;
            }

            // 怪物碰撞玩家
            if (Utils.circleCollision(this.player.x, this.player.y, this.player.radius, enemy.x, enemy.y, enemy.radius)) {
                // 爆破虫自爆逻辑
                if (enemy.type === 'exploder' && enemy.alive) {
                    const result = this.player.takeDamage(enemy.damage, this.particles);
                    enemy.hp = 0;
                    enemy.alive = false;
                    this.particles.explode(enemy.x, enemy.y, ['#ff8800', '#ffaa22', '#ffff44'], 20, 6);
                    this.particles.addShockwave(enemy.x, enemy.y, '#ff8800', 100, 0.3);
                    Utils.shake(8);
                    this._spawnExp(enemy);
                    if (result && result !== 'blocked') {
                        this.damageVignette = 0.8;
                    }
                    if (result === 'dead') {
                        this.state = 'dead';
                        this.particles.superExplode(this.player.x, this.player.y, this.player.def.colors, 60);
                        return;
                    }
                    continue; // 自爆后跳过正常碰撞逻辑
                }
                if (enemy.canAttack()) {
                    const result = this.player.takeDamage(enemy.damage, this.particles);
                    // 受伤反馈（格挡不触发红色渐变）
                    if (result && result !== 'blocked') {
                        this.damageVignette = 0.6;
                        this.damageIndicators.push({
                            angle: Utils.angle(this.player.x, this.player.y, enemy.x, enemy.y),
                            life: 0.8,
                        });
                    }
                    // 圣骑士被动：格挡时反击范围圣光伤害
                    if (result === 'blocked' && this.player.def.id === 'paladin') {
                        const counterRange = 120 * this.player.bonuses.areaMult;
                        const counterDmg = this.player.getAttack() * 1.5;
                        for (const e2 of this.enemies) {
                            if (!e2.alive) continue;
                            if (Utils.dist(this.player.x, this.player.y, e2.x, e2.y) < counterRange) {
                                const a = Utils.angle(this.player.x, this.player.y, e2.x, e2.y);
                                e2.takeDamage(counterDmg, this.particles, a, 10);
                                this.particles.addDamageText(e2.x, e2.y, Math.floor(counterDmg), false, '#ffdd44');
                                if (!e2.alive) this.weapons._onKill(e2);
                            }
                        }
                    }
                    if (result === 'dead') {
                        this.state = 'dead';
                        this.particles.superExplode(this.player.x, this.player.y, this.player.def.colors, 60);
                        return;
                    }
                    // 荆棘反伤
                    if (this.player.bonuses.thornAura) {
                        const thornDmg = enemy.damage * 2;
                        const thornRange = 100;
                        for (const e2 of this.enemies) {
                            if (!e2.alive) continue;
                            if (Utils.dist(this.player.x, this.player.y, e2.x, e2.y) < thornRange) {
                                const thornAngle = Utils.angle(this.player.x, this.player.y, e2.x, e2.y);
                                e2.takeDamage(thornDmg, this.particles, thornAngle, 10);
                                this.particles.addDamageText(e2.x, e2.y, thornDmg, false, '#44ff44');
                                if (!e2.alive) this.weapons._onKill(e2);
                            }
                        }
                        this.particles.addShockwave(this.player.x, this.player.y, '#44ff44', 100, 0.3);
                    }
                }
                // 推开怪物
                const pushAngle = Utils.angle(this.player.x, this.player.y, enemy.x, enemy.y);
                enemy.x += Math.cos(pushAngle) * 3;
                enemy.y += Math.sin(pushAngle) * 3;
            }

            // 远程怪射击
            if (enemy.canShoot()) {
                const angle = Utils.angle(enemy.x, enemy.y, this.player.x, this.player.y);
                this.enemyBullets.push(new EnemyBullet(enemy.x, enemy.y, angle, 180, enemy.damage, '#aa44ff'));
                this.particles.emit(enemy.x, enemy.y, 5, {
                    colors: ['#aa44ff', '#cc66ff'],
                    speedMin: 1,
                    speedMax: 3,
                    sizeMin: 1,
                    sizeMax: 3,
                    lifeMin: 0.1,
                    lifeMax: 0.3,
                });
            }
        }

        // 怪物间互斥
        this._separateEnemies();

        // === 新Buff逻辑 ===
        this._updateOrbitalBlades(dt);
        this._updateFireTrail(dt);
        this._updateFrostAura(dt);
        this._updateBurnAura(dt);
        this._updateArcherArrowRain(dt);
        this._updateSummons(dt);

        // === 新系统更新 ===
        this._updateMapHazards(dt);
        this._updateRelicDrops(dt);
        this._updateDeathAnimations(dt);
        this._updateScreenFlash(dt);
        this._updateAchievementPopup(dt);

        // 跟踪活着的Boss
        if (!this.activeBoss || !this.activeBoss.alive) {
            this.activeBoss = this.enemies.find(e => e.alive && e.isBoss) || null;
        }

        // 更新敌人弹幕
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            bullet.update(dt);
            if (!bullet.alive) {
                this.enemyBullets.splice(i, 1);
                continue;
            }
            // 碰撞玩家
            if (Utils.circleCollision(this.player.x, this.player.y, this.player.radius, bullet.x, bullet.y, bullet.radius)) {
                const result = this.player.takeDamage(bullet.damage, this.particles);
                bullet.alive = false;
                this.particles.explode(bullet.x, bullet.y, ['#ff4488', '#ff66aa'], 8, 3);
                // 受伤反馈（格挡不触发红色渐变）
                if (result && result !== 'blocked') {
                    this.damageVignette = 0.7;
                    this.damageIndicators.push({
                        angle: Utils.angle(this.player.x, this.player.y, bullet.x, bullet.y),
                        life: 0.8,
                    });
                }
                if (result === 'dead') {
                    this.state = 'dead';
                    this.particles.superExplode(this.player.x, this.player.y, this.player.def.colors, 60);
                    return;
                }
            }
        }

        // 更新经验宝石
        for (let i = this.expGems.length - 1; i >= 0; i--) {
            const gem = this.expGems[i];
            const collected = gem.update(dt, this.player.x, this.player.y, this.player.getPickupRange(), this.particles);
            if (collected > 0) {
                const leveledUp = this.player.addExp(collected);
                if (leveledUp) {
                    this.pendingLevelUps++;
                    // 升级特效
                    this.particles.addShockwave(this.player.x, this.player.y, '#44aaff', 100, 0.3);
                    this.particles.emit(this.player.x, this.player.y, 20, {
                        colors: ['#44aaff', '#88ddff', '#ffffff'],
                        speedMin: 2,
                        speedMax: 6,
                        sizeMin: 2,
                        sizeMax: 6,
                        lifeMin: 0.3,
                        lifeMax: 0.8,
                        glow: true,
                    });
                }
            }
            if (!gem.alive) {
                this.expGems.splice(i, 1);
            }
        }

        // 更新掉落道具
        for (let i = this.dropItems.length - 1; i >= 0; i--) {
            const item = this.dropItems[i];
            const picked = item.update(dt, this.player.x, this.player.y, this.player.getPickupRange());
            if (picked) {
                this._applyDropItem(item);
            }
            if (!item.alive) {
                this.dropItems.splice(i, 1);
            }
        }

        // 暂停按钮检测
        if (this.ui.pauseClicked) {
            this.ui.pauseClicked = false;
            this.state = 'paused';
            return;
        }

        // 触发Boss奖励（优先于普通升级）
        if (this._pendingBossRewards > 0) {
            this._pendingBossRewards--;
            this.upgradeChoices = UpgradePool.generateChoices(this.player);
            this._isBossReward = true; // 标记当前为Boss奖励（UI可用来显示不同标题）
            this.state = 'upgrading';
            // Boss击败时的华丽特效
            this.particles.superExplode(this.player.x, this.player.y, ['#ffaa00', '#ff6644', '#ffff44']);
            this.particles.addShockwave(this.player.x, this.player.y, '#ffaa00', 300, 0.5);
            Utils.shake(12);
            return;
        }

        // 触发升级
        if (this.pendingLevelUps > 0) {
            this.pendingLevelUps--;
            this.upgradeChoices = UpgradePool.generateChoices(this.player);
            this._isBossReward = false;
            this.state = 'upgrading';
            return;
        }

        // 受伤反馈更新
        if (this.damageVignette > 0) this.damageVignette -= dt * 1.5;
        for (let i = this.damageIndicators.length - 1; i >= 0; i--) {
            this.damageIndicators[i].life -= dt;
            if (this.damageIndicators[i].life <= 0) this.damageIndicators.splice(i, 1);
        }

        // 粒子更新
        this.particles.update(dt);

        // === 渲染 ===
        this._render();
    }

    _separateEnemies() {
        // 优化：只处理玩家附近的敌人，且限制最大处理数
        const MAX_SEP = 80; // 最多处琈80个敌人的互斥
        const px = this.player.x;
        const py = this.player.y;
        const sepRange = 400; // 只处理玩家400像素内的敌人
        const nearby = [];
        for (let i = 0; i < this.enemies.length && nearby.length < MAX_SEP; i++) {
            const e = this.enemies[i];
            if (!e.alive) continue;
            const dx = e.x - px;
            const dy = e.y - py;
            if (dx * dx + dy * dy < sepRange * sepRange) {
                nearby.push(e);
            }
        }
        for (let i = 0; i < nearby.length; i++) {
            for (let j = i + 1; j < nearby.length; j++) {
                const a = nearby[i];
                const b = nearby[j];
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const distSq = dx * dx + dy * dy;
                const minDist = a.radius + b.radius;
                if (distSq < minDist * minDist && distSq > 0.01) {
                    const dist = Math.sqrt(distSq);
                    const overlap = (minDist - dist) * 0.5;
                    const nx = dx / dist;
                    const ny = dy / dist;
                    a.x -= nx * overlap;
                    a.y -= ny * overlap;
                    b.x += nx * overlap;
                    b.y += ny * overlap;
                }
            }
        }
    }

    _spawnExp(enemy) {
        const count = enemy.isBoss ? 20 : (enemy.isElite ? 5 : 1);
        const colors = ['#44ff88', '#88ffaa', '#22dd66'];
        const bigColors = ['#44aaff', '#88ccff'];
        for (let i = 0; i < count; i++) {
            const value = Math.ceil(enemy.exp / count);
            const color = enemy.isBoss || enemy.isElite ? Utils.randPick(bigColors) : Utils.randPick(colors);
            this.expGems.push(new ExpGem(
                enemy.x + Utils.rand(-20, 20),
                enemy.y + Utils.rand(-20, 20),
                value,
                color
            ));
        }
    }

    _trySpawnDrop(enemy) {
        // Boss和精英有更高掉率
        const dropMult = enemy.isBoss ? 5 : (enemy.isElite ? 3 : 1);
        const luckyMult = 1 + (this.player.bonuses.luckyDrop || 0);
        for (const type of Object.keys(DropItemTypes)) {
            const chance = DropItemTypes[type].dropChance * dropMult * luckyMult;
            if (Math.random() < chance) {
                this.dropItems.push(new DropItem(
                    enemy.x + Utils.rand(-15, 15),
                    enemy.y + Utils.rand(-15, 15),
                    type
                ));
                break; // 每个敌人最多掉一个道具
            }
        }
    }

    _applyDropItem(item) {
        switch (item.type) {
            case 'heal': {
                // 回复30%最大生命值
                const healAmount = this.player.getMaxHp() * 0.3;
                this.player.heal(healAmount, this.particles);
                this.particles.addShockwave(this.player.x, this.player.y, '#ff4466', 60, 0.3);
                this.particles.emit(this.player.x, this.player.y, 15, {
                    colors: ['#ff4466', '#ff6688', '#ffaacc'],
                    speedMin: 2, speedMax: 5,
                    sizeMin: 2, sizeMax: 5,
                    lifeMin: 0.3, lifeMax: 0.6,
                    glow: true,
                });
                break;
            }
            case 'bomb': {
                // 全屏爆炸——消灭视野内所有敌人
                const cam = this.camera;
                const sw = this.logicWidth;
                const sh = this.logicHeight;
                let killCount = 0;
                for (const enemy of this.enemies) {
                    if (!enemy.alive) continue;
                    const sx = enemy.x - cam.x;
                    const sy = enemy.y - cam.y;
                    if (sx >= -50 && sx <= sw + 50 && sy >= -50 && sy <= sh + 50) {
                        enemy.hp = 0;
                        enemy.alive = false;
                        this.particles.explode(enemy.x, enemy.y, ['#ff8844', '#ffaa66', '#ffff44'], 10, 4);
                        this._spawnExp(enemy);
                        killCount++;
                        this.player.kills++;
                    }
                }
                // 全屏白闪 + 震动
                this.particles.addFlash(this.player.x, this.player.y, '#ff8844', 400, 0.3);
                this.particles.addShockwave(this.player.x, this.player.y, '#ffaa44', 500, 0.5);
                Utils.shake(12);
                break;
            }
            case 'magnet': {
                // 吸收所有经验宝石
                for (const gem of this.expGems) {
                    gem.attracted = true;
                }
                this.particles.addShockwave(this.player.x, this.player.y, '#44aaff', 400, 0.4);
                this.particles.emit(this.player.x, this.player.y, 20, {
                    colors: ['#44aaff', '#66ccff', '#88eeff'],
                    speedMin: 3, speedMax: 8,
                    sizeMin: 2, sizeMax: 5,
                    lifeMin: 0.3, lifeMax: 0.7,
                    glow: true,
                });
                break;
            }
        }
    }

    _render() {
        const ctx = this.ctx;
        const cam = {
            x: this.camera.x + Utils.screenShake.x,
            y: this.camera.y + Utils.screenShake.y,
        };

        // 背景
        this._renderBackground(ctx, cam);

        // 掉落道具
        for (const item of this.dropItems) {
            item.render(ctx, cam);
        }

        // 经验宝石
        for (const gem of this.expGems) {
            gem.render(ctx, cam);
        }

        // 怪物
        const sw = this.logicWidth;
        const sh = this.logicHeight;
        for (const enemy of this.enemies) {
            enemy.render(ctx, cam, sw, sh);
        }

        // 敌人弹幕
        for (const bullet of this.enemyBullets) {
            bullet.render(ctx, cam);
        }

        // 火焰尾迹渲染
        if (this.fireTrails) {
            for (const fire of this.fireTrails) {
                const fx = fire.x - cam.x;
                const fy = fire.y - cam.y;
const alpha = (fire.life / fire.maxLife) * 0.8;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#ff4422';
            ctx.beginPath();
            ctx.arc(fx, fy, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = '#ffaa00';
            ctx.beginPath();
            ctx.arc(fx, fy, 15, 0, Math.PI * 2);
            ctx.fill();
            }
            ctx.globalAlpha = 1;
        }

        // 武器弹幕
        this.weapons.renderProjectiles(ctx, cam, sw, sh);

        // 环绕刀刃渲染
        const orbCount = this.player.bonuses.orbitalBlades;
        if (orbCount > 0) {
            for (let i = 0; i < orbCount; i++) {
                const angle = this.orbitalAngle + (i / orbCount) * Math.PI * 2;
                const bx = this.player.x + Math.cos(angle) * 70 - cam.x;
                const by = this.player.y + Math.sin(angle) * 70 - cam.y;
                ctx.save();
                ctx.translate(bx, by);
                ctx.rotate(angle + Math.PI / 2);
                // 刀刃光晕
                ctx.globalAlpha = 0.3;
                ctx.fillStyle = this.player.def.color;
                ctx.beginPath();
                ctx.arc(0, 0, 14, 0, Math.PI * 2);
                ctx.fill();
                // 刀刃形状
                ctx.globalAlpha = 1;
                ctx.fillStyle = this.player.def.color;
                ctx.beginPath();
                ctx.moveTo(0, -14);
                ctx.lineTo(5, 0);
                ctx.lineTo(0, 14);
                ctx.lineTo(-5, 0);
                ctx.closePath();
                ctx.fill();
                // 刀刃高光
                ctx.fillStyle = '#ffffff';
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.lineTo(2, 0);
                ctx.lineTo(0, 4);
                ctx.lineTo(-2, 0);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
        }

        // 冰霜光环范围视觉
        if (this.player.bonuses.frostAura) {
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = '#88ccff';
            ctx.beginPath();
            ctx.arc(this.player.x - cam.x, this.player.y - cam.y, 150, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 灼烧光环范围视觉
        if (this.player.bonuses.burnAura) {
            const pulse = 1 + Math.sin(performance.now() / 200) * 0.05;
            ctx.globalAlpha = 0.18;
            ctx.fillStyle = '#ff4422';
            ctx.beginPath();
            ctx.arc(this.player.x - cam.x, this.player.y - cam.y, 120 * pulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.35;
            ctx.strokeStyle = '#ff6644';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.player.x - cam.x, this.player.y - cam.y, 120 * pulse, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // 护盾视觉
        if (this.player.shield > 0) {
            const shieldRatio = this.player.shield / this.player.bonuses.shieldMax;
            ctx.globalAlpha = 0.4 * shieldRatio + 0.15;
            ctx.strokeStyle = '#6688ff';
            ctx.lineWidth = 2.5 + shieldRatio * 2.5;
            ctx.beginPath();
            ctx.arc(this.player.x - cam.x, this.player.y - cam.y, this.player.radius + 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 0.15 * shieldRatio + 0.05;
            ctx.fillStyle = '#6688ff';
            ctx.beginPath();
            ctx.arc(this.player.x - cam.x, this.player.y - cam.y, this.player.radius + 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        // 召唤物
        this.summonManager.render(ctx, cam, sw, sh);

        // 武器外观（在玩家身上）
        this.weapons.renderWeapon(ctx, cam);

        // 玩家
        this.player.render(ctx, cam);

        // 粒子
        this.particles.render(ctx, cam, sw, sh);

        // 地图危险区域
        for (const hz of this.mapHazards) {
            hz.render(ctx, cam);
        }

        // 遗物掉落
        for (const rd of this.relicDrops) {
            rd.render(ctx, cam);
        }

        // 死亡动画残影
        const animDt = this._dt || 0.016;
        for (const de of this.deathAnimEnemies) {
            de.renderDeath(ctx, cam, animDt);
        }

        // HUD
        this.ui.renderHUD(this.player, this.waveManager);

        // Boss血条
        this.ui.renderBossHP(this.activeBoss);

        // 小地图
        this.ui.renderMinimap(this.player, this.enemies, cam);

        // 屏幕边缘警告
        this.ui.renderEdgeWarnings(this.player, this.enemies, cam, sw, sh);

        // 屏幕闪光
        this.ui.renderScreenFlash(this.screenFlash.color, this.screenFlash.alpha);

        // 成就弹窗
        this.ui.renderAchievement(this.achievementPopup, this.achievementTimer);

        // 受伤红色渐变（屏幕边缘）
        if (this.damageVignette > 0) {
            const v = Math.min(1, this.damageVignette);
            ctx.save();
            ctx.globalAlpha = v * 0.4;
            ctx.fillStyle = '#ff0000';
            // 上边
            ctx.fillRect(0, 0, sw, 40 * v);
            // 下边
            ctx.fillRect(0, sh - 40 * v, sw, 40 * v);
            // 左边
            ctx.fillRect(0, 0, 40 * v, sh);
            // 右边
            ctx.fillRect(sw - 40 * v, 0, 40 * v, sh);
            ctx.restore();
        }

        // 受伤方向指示器（屏幕中心指向伤害来源的箭头）
        if (this.damageIndicators.length > 0) {
            const cx = sw / 2;
            const cy = sh / 2;
            const arrowDist = Math.min(sw, sh) * 0.3;
            ctx.save();
            for (const ind of this.damageIndicators) {
                const alpha = ind.life / 0.8;
                ctx.globalAlpha = alpha * 0.7;
                ctx.fillStyle = '#ff2244';
                const ax = cx + Math.cos(ind.angle) * arrowDist;
                const ay = cy + Math.sin(ind.angle) * arrowDist;
                ctx.save();
                ctx.translate(ax, ay);
                ctx.rotate(ind.angle);
                // 箭头三角形
                ctx.beginPath();
                ctx.moveTo(16, 0);
                ctx.lineTo(-8, -10);
                ctx.lineTo(-4, 0);
                ctx.lineTo(-8, 10);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();
        }

        // 虚拟摇杆渲染（仅触屏设备且正在触摸时显示）
        if (this.isTouchDevice && this.joystick.active) {
            ctx.save();
            const jr = this.joystick.radius;
            const bx = this.joystick.baseX;
            const by = this.joystick.baseY;
            const sx = this.joystick.stickX;
            const sy = this.joystick.stickY;

            // 底座
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.arc(bx, by, jr, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#aaaacc';
            ctx.stroke();

            // 摇杆头
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(sx, sy, jr * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#aabbff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();

            ctx.restore();
        }

        // 触屏暂停按钮提示（游戏中，仅触屏设备）
        if (this.isTouchDevice && this.state === 'playing') {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.font = '12px sans-serif';
            ctx.fillStyle = '#aaaacc';
            ctx.textAlign = 'center';
            ctx.fillText('双指点击暂停', sw / 2, sh - 12);
            ctx.restore();
        }
    }

    _renderBackground(ctx, camera) {
        const W = this.logicWidth;
        const H = this.logicHeight;
        const gridSize = this.gridSize;
        const startX = Math.floor(camera.x / gridSize) * gridSize;
        const startY = Math.floor(camera.y / gridSize) * gridSize;
        const endX = startX + W + gridSize;
        const endY = startY + H + gridSize;

        // ── 深空渐变底色 ──
        if (!this._bgGradCache || this._bgGradCache._h !== H) {
            this._bgGradCache = ctx.createLinearGradient(0, 0, 0, H);
            this._bgGradCache.addColorStop(0, '#06060e');
            this._bgGradCache.addColorStop(0.5, '#0a0a18');
            this._bgGradCache.addColorStop(1, '#080814');
            this._bgGradCache._h = H;
        }
        ctx.fillStyle = this._bgGradCache;
        ctx.fillRect(0, 0, W, H);

        // ── 角落微弱色彩光晕（视差跟随相机缓动） ──
        const cx1 = W * 0.15 - (camera.x % W) * 0.02;
        const cy1 = H * 0.2 - (camera.y % H) * 0.02;
        const g1 = ctx.createRadialGradient(cx1, cy1, 0, cx1, cy1, H * 0.5);
        g1.addColorStop(0, 'rgba(40,20,80,0.12)');
        g1.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, W, H);

        const cx2 = W * 0.85 + (camera.x % W) * 0.015;
        const cy2 = H * 0.8 + (camera.y % H) * 0.015;
        const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, H * 0.45);
        g2.addColorStop(0, 'rgba(15,40,60,0.10)');
        g2.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, W, H);

        // ── 星尘粒子（固定在世界坐标，跟随相机） ──
        if (!this._bgStars) {
            this._bgStars = [];
            for (let i = 0; i < 120; i++) {
                this._bgStars.push({
                    wx: Math.random() * 6000 - 1000,
                    wy: Math.random() * 6000 - 1000,
                    r: 0.4 + Math.random() * 1.0,
                    a: 0.08 + Math.random() * 0.18,
                    twinkleSpeed: 1 + Math.random() * 2,
                    twinklePhase: Math.random() * Math.PI * 2,
                });
            }
        }
        const gameTime = this.gameTime || 0;
        for (const star of this._bgStars) {
            const sx = star.wx - camera.x;
            const sy = star.wy - camera.y;
            if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;
            const alpha = star.a * (0.6 + 0.4 * Math.sin(gameTime * star.twinkleSpeed + star.twinklePhase));
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#8899bb';
            ctx.beginPath();
            ctx.arc(sx, sy, star.r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        // ── 网格线（柔和亮度，交叉点加亮） ──
        ctx.strokeStyle = '#16162a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = startX; x <= endX; x += gridSize) {
            const sx = x - camera.x;
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, H);
        }
        for (let y = startY; y <= endY; y += gridSize) {
            const sy = y - camera.y;
            ctx.moveTo(0, sy);
            ctx.lineTo(W, sy);
        }
        ctx.stroke();

        // 交叉点发光小点
        ctx.fillStyle = '#2a2a44';
        for (let x = startX; x <= endX; x += gridSize) {
            for (let y = startY; y <= endY; y += gridSize) {
                const px = x - camera.x;
                const py = y - camera.y;
                ctx.fillRect(px - 1, py - 1, 2, 2);
            }
        }
    }

    // === 升级选择 ===
    _updateUpgrading(dt) {
        // 继续渲染游戏背景（冻结）
        this._render();

        // 粒子继续更新
        this.particles.update(dt);

        // 渲染升级面板
        const selected = this.ui.renderUpgradePanel(this.upgradeChoices, this._isBossReward);
        if (selected >= 0) {
            UpgradePool.applyUpgrade(this.player, this.upgradeChoices[selected]);

            // 升级选择特效
            this.particles.emit(this.player.x, this.player.y, 25, {
                colors: this.player.def.colors.concat(['#fff', '#ffaa44']),
                speedMin: 3,
                speedMax: 8,
                sizeMin: 2,
                sizeMax: 6,
                lifeMin: 0.3,
                lifeMax: 0.8,
                glow: true,
                glowSize: 10,
            });
            this.particles.addShockwave(this.player.x, this.player.y, this.player.def.color, 80, 0.3);

            this.upgradeChoices = null;

            // 如果还有待处理的Boss奖励或升级
            if (this._pendingBossRewards > 0) {
                this._pendingBossRewards--;
                this.upgradeChoices = UpgradePool.generateChoices(this.player);
                this._isBossReward = true;
            } else if (this.pendingLevelUps > 0) {
                this.pendingLevelUps--;
                this.upgradeChoices = UpgradePool.generateChoices(this.player);
                this._isBossReward = false;
            } else {
                this.state = 'playing';
                this._isBossReward = false;
            }
        }
    }

    // === 暂停 ===
    _updatePaused(dt) {
        // 渲染冻结的游戏画面
        this._render();

        // 暂停遮罩 + 按钮
        const result = this.ui.renderPauseScreen(this.player, this.showStatsPanel);
        if (result === 'resume') {
            this.state = 'playing';
            this.showStatsPanel = false;
        } else if (result === 'stats') {
            this.showStatsPanel = !this.showStatsPanel;
        } else if (result === 'quit') {
            this.state = 'menu';
            this.showStatsPanel = false;
            this.particles.clear();
        }
    }

    // === 死亡 ===
    _updateDead(dt) {
        this._render();
        this.particles.update(dt);

        // 记录元进度
        if (!this._deathRecorded) {
            this._deathRecorded = true;
            this._goldEarned = 0;
            if (typeof MetaProgress !== 'undefined') {
                this._goldEarned = MetaProgress.recordRun(this.player, this.waveManager.gameTime);
                MetaProgress.checkAchievements(this.player, this.waveManager.gameTime);
            }
        }

        const restart = this.ui.renderDeathScreen(this.player, this.waveManager.gameTime, this._goldEarned);
        if (restart) {
            this.state = 'menu';
            this.particles.clear();
            this._deathRecorded = false;
            this._goldEarned = 0;
        }
    }

    // =============================================
    // === 新Buff逻辑实现 ===
    // =============================================

    // --- 环绕刀刃 ---
    _updateOrbitalBlades(dt) {
        const count = this.player.bonuses.orbitalBlades;
        if (count <= 0) return;

        this.orbitalAngle += (3 + count * 0.5) * dt; // 刀刃越多转越快
        const orbitRadius = 70;
        const damage = this.player.getAttack() * 0.5;

        for (let i = 0; i < count; i++) {
            const angle = this.orbitalAngle + (i / count) * Math.PI * 2;
            const bx = this.player.x + Math.cos(angle) * orbitRadius;
            const by = this.player.y + Math.sin(angle) * orbitRadius;

            // 拖尾
            this.particles.addTrail(bx, by, this.player.def.color, 4, 0.15);

            // 碰撞敌人
            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                if (Utils.circleCollision(bx, by, 12, enemy.x, enemy.y, enemy.radius)) {
                    if (!enemy._orbitalHitCD || enemy._orbitalHitCD <= 0) {
                        const knockAngle = Utils.angle(this.player.x, this.player.y, enemy.x, enemy.y);
                        enemy.takeDamage(damage, this.particles, knockAngle, 5);
                        this.particles.addDamageText(enemy.x, enemy.y, Math.floor(damage), false, this.player.def.color);
                        enemy._orbitalHitCD = 0.3; // 0.3秒命中冷却
                        if (!enemy.alive) this.weapons._onKill(enemy);
                    }
                }
                // 冷却递减
                if (enemy._orbitalHitCD > 0) enemy._orbitalHitCD -= dt;
            }
        }
    }

    // --- 火焰尾迹 ---
    _updateFireTrail(dt) {
        if (!this.player.bonuses.fireTrail) return;

        this.fireTrailTimer += dt;
        // 移动时每0.08秒留一个火焰点
        if (this.player.isMoving && this.fireTrailTimer >= 0.08) {
            this.fireTrailTimer = 0;
            this.fireTrails.push({
                x: this.player.x,
                y: this.player.y,
                life: 2.0,
                maxLife: 2.0,
            });
            // 限制火焰点数量
            if (this.fireTrails.length > 60) this.fireTrails.shift();
        }

        // 更新火焰点 & 造成伤害
        const fireDamage = this.player.getAttack() * 0.3;
        for (let i = this.fireTrails.length - 1; i >= 0; i--) {
            const fire = this.fireTrails[i];
            fire.life -= dt;
            if (fire.life <= 0) {
                this.fireTrails.splice(i, 1);
                continue;
            }

            // 伤害敌人（每0.5秒一次通过模运算简化）
            if (Math.floor((fire.maxLife - fire.life) * 4) > Math.floor((fire.maxLife - fire.life - dt) * 4)) {
                for (const enemy of this.enemies) {
                    if (!enemy.alive) continue;
                    if (Utils.dist(fire.x, fire.y, enemy.x, enemy.y) < 20) {
                        enemy.takeDamage(fireDamage, this.particles, 0, 0);
                        if (!enemy.alive) this.weapons._onKill(enemy);
                    }
                }
            }

            // 火焰粒子视觉
            if (Math.random() < 0.15) {
                this.particles.emit(fire.x, fire.y, 1, {
                    colors: ['#ff4422', '#ff6644', '#ffaa00'],
                    speedMin: 0.5, speedMax: 2,
                    sizeMin: 2, sizeMax: 5,
                    lifeMin: 0.2, lifeMax: 0.4,
                });
            }
        }
    }

    // --- 弓箭手箭雨被动 ---
    _updateArcherArrowRain(dt) {
        if (this.player.def.id !== 'archer') return;
        if (!this.player.passive) return;

        // 被动计时由 player._updatePassive 处理，此处检查是否触发
        if (!this.player.passive.ready) return;
        this.player.passive.ready = false;

        // 调用武器系统的箭雨方法
        if (this.weapons && this.weapons._arrowRain) {
            this.weapons._arrowRain(this.enemies, this.camera);
        }
    }

    // --- 灼烧光环 ---
    _updateBurnAura(dt) {
        if (!this.player.bonuses.burnAura) return;

        this.burnAuraTimer += dt;
        const burnRange = 120;
        const burnDamage = this.player.getAttack() * 0.25;

        // 每0.5秒对范围内敌人造成一次火焰伤害
        if (this.burnAuraTimer >= 0.5) {
            this.burnAuraTimer = 0;
            for (const enemy of this.enemies) {
                if (!enemy.alive) continue;
                const dist = Utils.dist(this.player.x, this.player.y, enemy.x, enemy.y);
                if (dist < burnRange) {
                    enemy.takeDamage(burnDamage, this.particles, 0, 0);
                    if (!enemy.alive) this.weapons._onKill(enemy);
                }
            }
            // 火焰视觉
            this.particles.emit(this.player.x, this.player.y, 4, {
                colors: ['#ff4422', '#ff6644', '#ffaa00'],
                speedMin: 1, speedMax: 4,
                sizeMin: 2, sizeMax: 5,
                lifeMin: 0.2, lifeMax: 0.5,
                offsetX: 40, offsetY: 40,
            });
        }
    }

    // --- 冰霜光环 ---
    _updateFrostAura(dt) {
        if (!this.player.bonuses.frostAura) return;

        this.frostTimer += dt;
        const frostRange = 150;

        for (const enemy of this.enemies) {
            if (!enemy.alive) continue;
            const dist = Utils.dist(this.player.x, this.player.y, enemy.x, enemy.y);
            if (dist < frostRange) {
                // 减速效果（临时修改speed）
                if (!enemy._originalSpeed) {
                    enemy._originalSpeed = enemy.speed;
                }
                enemy.speed = enemy._originalSpeed * 0.6;
            } else if (enemy._originalSpeed) {
                enemy.speed = enemy._originalSpeed;
                enemy._originalSpeed = null;
            }
        }

        // 冰霜视觉效果（低频）
        if (this.frostTimer >= 0.5) {
            this.frostTimer = 0;
            this.particles.emit(this.player.x, this.player.y, 3, {
                colors: ['#88ccff', '#aaddff', '#ffffff'],
                speedMin: 1, speedMax: 3,
                sizeMin: 2, sizeMax: 4,
                lifeMin: 0.4, lifeMax: 0.8,
                offsetX: 50, offsetY: 50,
            });
        }
    }

    // --- 召唤物系统 ---
    _updateSummons(dt) {
        // 动态更新召唤物上限（基础5 + 武器等级加成 + 升级加成）
        if (this.player.def.id === 'necromancer') {
            const baseMax = 5;
            const levelBonus = Math.floor((this.player.weaponLevel - 1) / 2); // 每2级+1
            const upgradeBonus = this.player.bonuses.summonMaxBonus || 0;
            this.summonManager.maxSummons = baseMax + levelBonus + upgradeBonus;
        }

        // 更新召唤物AI和位置
        this.summonManager.update(dt, this.enemies);
        this.summonManager.updateCollisionCD(dt);

        // 召唤物与敌人的碰撞伤害
        const results = this.summonManager.checkEnemyCollisions(this.enemies);
        for (const r of results) {
            if (r.explode) {
                // 召唤物死亡爆炸
                const range = 80;
                this.particles.explode(r.x, r.y, ['#55ddbb', '#88ffdd', '#aaffee'], 15, 5);
                this.particles.addShockwave(r.x, r.y, '#55ddbb', range, 0.3);
                Utils.shake(4);
                for (const e of this.enemies) {
                    if (!e.alive) continue;
                    if (Utils.dist(r.x, r.y, e.x, e.y) < range + e.radius) {
                        const a = Utils.angle(r.x, r.y, e.x, e.y);
                        e.takeDamage(r.damage, this.particles, a, 8);
                        this.particles.addDamageText(e.x, e.y, Math.floor(r.damage), false, '#88ffdd');
                        if (!e.alive) this.weapons._onKill(e);
                    }
                }
            }
        }

        // 亡灵光环回血（有召唤物时每秒回复玩家生命）
        if (this.player.bonuses.summonHealAura && this.summonManager.summons.length > 0) {
            const healPerSec = 1.5 * this.summonManager.summons.length; // 每只召唤物每秒1.5回血
            this.player.stats.hp = Math.min(this.player.getMaxHp(), this.player.stats.hp + healPerSec * dt);
        }
    }

    // =============================================
    // === 新系统方法 ===
    // =============================================

    // --- Boss AI事件处理 ---
    _handleBossEvent(event, boss) {
        switch (event.type) {
            case 'bossSummon': {
                // Boss召唤小怪（使用骷髅类型，按当前波次强度缩放）
                const count = event.count || 4;
                const waveMult = this.waveManager ? (this.waveManager.wave || 1) * 0.5 : 1;
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    const dist = 80;
                    const ex = boss.x + Math.cos(angle) * dist;
                    const ey = boss.y + Math.sin(angle) * dist;
                    const minion = new Enemy('skeleton', ex, ey, waveMult);
                    this.enemies.push(minion);
                }
                this.particles.addShockwave(boss.x, boss.y, '#aa44ff', 120, 0.3);
                break;
            }
            case 'bossSlam': {
                // Boss地震：对范围内造成伤害
                const slamRange = 180;
                Utils.shake(15);
                this.particles.addShockwave(boss.x, boss.y, '#ff6644', slamRange, 0.4);
                const dist = Utils.dist(boss.x, boss.y, this.player.x, this.player.y);
                if (dist < slamRange) {
                    const result = this.player.takeDamage(boss.damage * 1.5, this.particles);
                    if (result === 'dead') {
                        this.state = 'dead';
                        this.particles.superExplode(this.player.x, this.player.y, this.player.def.colors, 60);
                    }
                }
                // 生成地面危险区域
                this.mapHazards.push(new MapHazard(boss.x, boss.y, 'fire', slamRange * 0.8, 4));
                break;
            }
            case 'bossBullets': {
                // Boss弹幕：环形子弹
                const bulletCount = event.count || 12;
                for (let i = 0; i < bulletCount; i++) {
                    const angle = (i / bulletCount) * Math.PI * 2;
                    this.enemyBullets.push(new EnemyBullet(boss.x, boss.y, angle, 150, boss.damage * 0.8, '#ff44aa'));
                }
                this.particles.emit(boss.x, boss.y, 12, {
                    colors: ['#ff44aa', '#ff88cc'],
                    speedMin: 2, speedMax: 5,
                    sizeMin: 2, sizeMax: 4,
                    lifeMin: 0.2, lifeMax: 0.4,
                });
                break;
            }
        }
    }

    // --- 地图危险区域更新 ---
    _updateMapHazards(dt) {
        for (let i = this.mapHazards.length - 1; i >= 0; i--) {
            const hz = this.mapHazards[i];
            const dmg = hz.update(dt, this.player);
            if (!hz.alive) {
                this.mapHazards.splice(i, 1);
                continue;
            }
            // 对玩家造成伤害
            if (dmg > 0) {
                const result = this.player.takeDamage(dmg, this.particles);
                if (result === 'dead') {
                    this.state = 'dead';
                    this.particles.superExplode(this.player.x, this.player.y, this.player.def.colors, 60);
                    return;
                }
            }
        }
    }

    // --- 遗物掉落更新 ---
    _updateRelicDrops(dt) {
        for (let i = this.relicDrops.length - 1; i >= 0; i--) {
            const rd = this.relicDrops[i];
            const picked = rd.update(dt, this.player.x, this.player.y, this.player.getPickupRange());
            if (picked) {
                // 应用遗物效果
                this.player.addRelic(rd.relicId);
                this.particles.addShockwave(this.player.x, this.player.y, '#ffaa00', 100, 0.4);
                this.particles.emit(this.player.x, this.player.y, 20, {
                    colors: ['#ffaa00', '#ffcc44', '#ffff88'],
                    speedMin: 2, speedMax: 6,
                    sizeMin: 3, sizeMax: 7,
                    lifeMin: 0.4, lifeMax: 0.8, glow: true
                });
                // 显示遗物获得通知
                const relic = typeof RelicDefs !== 'undefined' ? RelicDefs[rd.relicId] : null;
                if (relic) {
                    this.achievementPopup = { name: relic.name, desc: relic.desc };
                    this.achievementTimer = 3.0;
                }
                this.relicDrops.splice(i, 1);
            } else if (!rd.alive) {
                this.relicDrops.splice(i, 1);
            }
        }
    }

    // --- 生成遗物掉落 ---
    _spawnRelicDrop(enemy) {
        if (typeof RelicDefs === 'undefined') return;
        const relicIds = Object.keys(RelicDefs);
        // 过滤掉玩家已有的遗物
        const available = relicIds.filter(id => !this.player.relics.includes(id));
        if (available.length === 0) return;

        // Boss必掉一个遗物
        const relicId = Utils.randPick(available);
        this.relicDrops.push(new RelicDrop(enemy.x, enemy.y, relicId));
    }

    // --- 死亡动画更新 ---
    _updateDeathAnimations(dt) {
        for (let i = this.deathAnimEnemies.length - 1; i >= 0; i--) {
            const de = this.deathAnimEnemies[i];
            if (!de.dying) {
                this.deathAnimEnemies.splice(i, 1);
            }
        }
    }

    // --- 屏幕闪光更新 ---
    _updateScreenFlash(dt) {
        if (this.screenFlash.alpha > 0) {
            this.screenFlash.alpha -= dt * 3; // 快速消退
            if (this.screenFlash.alpha < 0) this.screenFlash.alpha = 0;
        }
    }

    // --- 成就弹窗更新 ---
    _updateAchievementPopup(dt) {
        if (this.achievementTimer > 0) {
            this.achievementTimer -= dt;
            if (this.achievementTimer <= 0) {
                this.achievementPopup = null;
            }
        }
    }
}
