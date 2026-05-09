// ============================================
// SVG 精灵系统 - 高质量矢量图替代程序化绘制
// ============================================
// 所有 SVG 以 data URI 形式内嵌，运行时转为 Image 对象

const SVG_SPRITES = {};

function svgToDataUri(svgString) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
}

// ─── 史莱姆 (Slime) ─── 果冻质感半透明体，内部气泡流动，表面高光丰富
SVG_SPRITES.slime = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="sl_body" cx="35%" cy="25%" r="70%"><stop offset="0%" stop-color="#ccffdd"/><stop offset="20%" stop-color="#88ffaa"/><stop offset="50%" stop-color="#44dd66"/><stop offset="75%" stop-color="#228844"/><stop offset="100%" stop-color="#0a4422"/></radialGradient>
<radialGradient id="sl_hl" cx="30%" cy="20%" r="35%"><stop offset="0%" stop-color="rgba(255,255,255,0.85)"/><stop offset="60%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<radialGradient id="sl_inner" cx="50%" cy="60%" r="40%"><stop offset="0%" stop-color="rgba(200,255,220,0.5)"/><stop offset="100%" stop-color="rgba(200,255,220,0)"/></radialGradient>
<filter id="sl_soft"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 地面阴影 -->
<ellipse cx="${s*.5}" cy="${s*.9}" rx="${s*.33}" ry="${s*.06}" fill="rgba(0,60,20,0.35)"/>
<!-- 主体轮廓 - 有机不规则形状 -->
<path d="M ${s*.14},${s*.62} Q ${s*.06},${s*.32} ${s*.22},${s*.18} Q ${s*.35},${s*.06} ${s*.5},${s*.08} Q ${s*.65},${s*.06} ${s*.78},${s*.18} Q ${s*.94},${s*.32} ${s*.86},${s*.62} Q ${s*.84},${s*.78} ${s*.72},${s*.84} Q ${s*.6},${s*.9} ${s*.5},${s*.88} Q ${s*.4},${s*.9} ${s*.28},${s*.84} Q ${s*.16},${s*.78} ${s*.14},${s*.62} Z" fill="url(#sl_body)" stroke="rgba(10,60,30,0.4)" stroke-width="${s*.008}"/>
<!-- 内部折射气泡 -->
<circle cx="${s*.35}" cy="${s*.55}" r="${s*.05}" fill="rgba(200,255,230,0.45)" filter="url(#sl_soft)"/>
<circle cx="${s*.62}" cy="${s*.6}" r="${s*.04}" fill="rgba(200,255,230,0.35)" filter="url(#sl_soft)"/>
<circle cx="${s*.42}" cy="${s*.72}" r="${s*.03}" fill="rgba(220,255,240,0.3)"/>
<circle cx="${s*.55}" cy="${s*.48}" r="${s*.025}" fill="rgba(230,255,240,0.4)"/>
<circle cx="${s*.28}" cy="${s*.42}" r="${s*.02}" fill="rgba(255,255,255,0.3)"/>
<!-- 内部光晕 -->
<ellipse cx="${s*.5}" cy="${s*.6}" rx="${s*.2}" ry="${s*.18}" fill="url(#sl_inner)"/>
<!-- 顶部高光 -->
<ellipse cx="${s*.38}" cy="${s*.22}" rx="${s*.14}" ry="${s*.08}" fill="url(#sl_hl)"/>
<ellipse cx="${s*.32}" cy="${s*.16}" rx="${s*.06}" ry="${s*.035}" fill="rgba(255,255,255,0.75)"/>
<!-- 眼睛 - 可爱大眼 -->
<ellipse cx="${s*.38}" cy="${s*.38}" rx="${s*.1}" ry="${s*.11}" fill="#fff" stroke="rgba(20,80,40,0.3)" stroke-width="${s*.005}"/>
<ellipse cx="${s*.62}" cy="${s*.38}" rx="${s*.1}" ry="${s*.11}" fill="#fff" stroke="rgba(20,80,40,0.3)" stroke-width="${s*.005}"/>
<circle cx="${s*.37}" cy="${s*.4}" r="${s*.055}" fill="#117733"/>
<circle cx="${s*.63}" cy="${s*.4}" r="${s*.055}" fill="#117733"/>
<circle cx="${s*.36}" cy="${s*.39}" r="${s*.03}" fill="#003311"/>
<circle cx="${s*.62}" cy="${s*.39}" r="${s*.03}" fill="#003311"/>
<!-- 眼睛高光 -->
<circle cx="${s*.34}" cy="${s*.36}" r="${s*.025}" fill="rgba(255,255,255,0.9)"/>
<circle cx="${s*.6}" cy="${s*.36}" r="${s*.025}" fill="rgba(255,255,255,0.9)"/>
<circle cx="${s*.39}" cy="${s*.43}" r="${s*.012}" fill="rgba(255,255,255,0.5)"/>
<circle cx="${s*.65}" cy="${s*.43}" r="${s*.012}" fill="rgba(255,255,255,0.5)"/>
<!-- 微笑 -->
<path d="M ${s*.4},${s*.56} Q ${s*.5},${s*.65} ${s*.6},${s*.56}" stroke="#0a4422" stroke-width="${s*.02}" fill="none" stroke-linecap="round"/>
<!-- 腮红 -->
<ellipse cx="${s*.28}" cy="${s*.5}" rx="${s*.04}" ry="${s*.025}" fill="rgba(255,150,200,0.3)"/>
<ellipse cx="${s*.72}" cy="${s*.5}" rx="${s*.04}" ry="${s*.025}" fill="rgba(255,150,200,0.3)"/>
<!-- 表面光泽弧线 -->
<path d="M ${s*.25},${s*.5} Q ${s*.3},${s*.45} ${s*.38},${s*.44}" stroke="rgba(255,255,255,0.25)" stroke-width="${s*.008}" fill="none" stroke-linecap="round"/>
</svg>`;
};

// ─── 蝙蝠 (Bat) ─── 暗紫色皮翼展开，尖耳獠牙，红宝石眼
SVG_SPRITES.bat = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="bt_body" cx="45%" cy="35%" r="50%"><stop offset="0%" stop-color="#ee99ff"/><stop offset="40%" stop-color="#aa66dd"/><stop offset="80%" stop-color="#6633aa"/><stop offset="100%" stop-color="#3a1177"/></radialGradient>
<linearGradient id="bt_wl" x1="0%" y1="30%" x2="100%" y2="70%"><stop offset="0%" stop-color="#7744bb"/><stop offset="50%" stop-color="#5522aa"/><stop offset="100%" stop-color="#331177"/></linearGradient>
<linearGradient id="bt_wr" x1="100%" y1="30%" x2="0%" y2="70%"><stop offset="0%" stop-color="#7744bb"/><stop offset="50%" stop-color="#5522aa"/><stop offset="100%" stop-color="#331177"/></linearGradient>
<filter id="bt_glow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 左翼 - 带翼膜纹理 -->
<path d="M ${s*.35},${s*.42} Q ${s*.2},${s*.18} ${s*.04},${s*.28} Q ${s*.06},${s*.38} ${s*.1},${s*.52} L ${s*.18},${s*.58} Q ${s*.22},${s*.62} ${s*.28},${s*.58} Q ${s*.3},${s*.52} ${s*.34},${s*.48} Z" fill="url(#bt_wl)" stroke="#3a1177" stroke-width="${s*.008}"/>
<!-- 左翼骨架 -->
<path d="M ${s*.35},${s*.44} Q ${s*.18},${s*.28} ${s*.06},${s*.3}" stroke="#5a2288" stroke-width="${s*.022}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.34},${s*.46} Q ${s*.22},${s*.42} ${s*.1},${s*.52}" stroke="#5a2288" stroke-width="${s*.018}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.33},${s*.48} Q ${s*.26},${s*.52} ${s*.18},${s*.58}" stroke="#5a2288" stroke-width="${s*.015}" fill="none" stroke-linecap="round"/>
<!-- 左翼膜纹 -->
<path d="M ${s*.14},${s*.32} Q ${s*.2},${s*.42} ${s*.12},${s*.5}" stroke="rgba(130,80,200,0.3)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.22},${s*.26} Q ${s*.26},${s*.38} ${s*.2},${s*.52}" stroke="rgba(130,80,200,0.25)" stroke-width="${s*.005}" fill="none"/>
<!-- 右翼 -->
<path d="M ${s*.65},${s*.42} Q ${s*.8},${s*.18} ${s*.96},${s*.28} Q ${s*.94},${s*.38} ${s*.9},${s*.52} L ${s*.82},${s*.58} Q ${s*.78},${s*.62} ${s*.72},${s*.58} Q ${s*.7},${s*.52} ${s*.66},${s*.48} Z" fill="url(#bt_wr)" stroke="#3a1177" stroke-width="${s*.008}"/>
<!-- 右翼骨架 -->
<path d="M ${s*.65},${s*.44} Q ${s*.82},${s*.28} ${s*.94},${s*.3}" stroke="#5a2288" stroke-width="${s*.022}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.66},${s*.46} Q ${s*.78},${s*.42} ${s*.9},${s*.52}" stroke="#5a2288" stroke-width="${s*.018}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.67},${s*.48} Q ${s*.74},${s*.52} ${s*.82},${s*.58}" stroke="#5a2288" stroke-width="${s*.015}" fill="none" stroke-linecap="round"/>
<!-- 右翼膜纹 -->
<path d="M ${s*.86},${s*.32} Q ${s*.8},${s*.42} ${s*.88},${s*.5}" stroke="rgba(130,80,200,0.3)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.78},${s*.26} Q ${s*.74},${s*.38} ${s*.8},${s*.52}" stroke="rgba(130,80,200,0.25)" stroke-width="${s*.005}" fill="none"/>
<!-- 身体 -->
<ellipse cx="${s*.5}" cy="${s*.5}" rx="${s*.2}" ry="${s*.24}" fill="url(#bt_body)" stroke="#4a1888" stroke-width="${s*.008}"/>
<!-- 绒毛纹理 -->
<ellipse cx="${s*.5}" cy="${s*.45}" rx="${s*.13}" ry="${s*.12}" fill="rgba(200,150,255,0.15)"/>
<!-- 尖耳 -->
<polygon points="${s*.37},${s*.3} ${s*.4},${s*.1} ${s*.45},${s*.28}" fill="#5a2277" stroke="#3a1155" stroke-width="${s*.006}"/>
<polygon points="${s*.55},${s*.28} ${s*.6},${s*.1} ${s*.63},${s*.3}" fill="#5a2277" stroke="#3a1155" stroke-width="${s*.006}"/>
<!-- 内耳 -->
<polygon points="${s*.39},${s*.3} ${s*.41},${s*.16} ${s*.44},${s*.29}" fill="rgba(255,130,200,0.5)"/>
<polygon points="${s*.56},${s*.29} ${s*.59},${s*.16} ${s*.61},${s*.3}" fill="rgba(255,130,200,0.5)"/>
<!-- 眼睛 - 红宝石发光 -->
<ellipse cx="${s*.44}" cy="${s*.44}" rx="${s*.05}" ry="${s*.04}" fill="#ff2244" filter="url(#bt_glow)"/>
<ellipse cx="${s*.56}" cy="${s*.44}" rx="${s*.05}" ry="${s*.04}" fill="#ff2244" filter="url(#bt_glow)"/>
<ellipse cx="${s*.44}" cy="${s*.44}" rx="${s*.02}" ry="${s*.03}" fill="#ffaa44"/>
<ellipse cx="${s*.56}" cy="${s*.44}" rx="${s*.02}" ry="${s*.03}" fill="#ffaa44"/>
<circle cx="${s*.43}" cy="${s*.43}" r="${s*.01}" fill="rgba(255,255,255,0.8)"/>
<circle cx="${s*.55}" cy="${s*.43}" r="${s*.01}" fill="rgba(255,255,255,0.8)"/>
<!-- 獠牙 -->
<polygon points="${s*.45},${s*.57} ${s*.46},${s*.66} ${s*.48},${s*.57}" fill="#fff" stroke="rgba(200,200,200,0.5)" stroke-width="${s*.003}"/>
<polygon points="${s*.52},${s*.57} ${s*.54},${s*.66} ${s*.55},${s*.57}" fill="#fff" stroke="rgba(200,200,200,0.5)" stroke-width="${s*.003}"/>
<!-- 嘴巴 -->
<path d="M ${s*.44},${s*.56} Q ${s*.5},${s*.6} ${s*.56},${s*.56}" stroke="#2a0a44" stroke-width="${s*.01}" fill="none"/>
<!-- 身体高光 -->
<ellipse cx="${s*.46}" cy="${s*.4}" rx="${s*.06}" ry="${s*.04}" fill="rgba(255,255,255,0.2)"/>
</svg>`;
};

// ─── 骷髅 (Skeleton) ─── 骨架分明，绿色灵魂火焰眼，持短剑
SVG_SPRITES.skeleton = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="sk_skull" cx="45%" cy="35%" r="55%"><stop offset="0%" stop-color="#fffff0"/><stop offset="40%" stop-color="#eee8d0"/><stop offset="70%" stop-color="#d4cca8"/><stop offset="100%" stop-color="#a09060"/></radialGradient>
<linearGradient id="sk_bone" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#eee8d0"/><stop offset="100%" stop-color="#c8bc98"/></linearGradient>
<linearGradient id="sk_blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ddd"/><stop offset="40%" stop-color="#bbb"/><stop offset="100%" stop-color="#888"/></linearGradient>
<filter id="sk_fire"><feGaussianBlur stdDeviation="1.8" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.22}" ry="${s*.04}" fill="rgba(0,0,0,0.3)"/>
<!-- 脊椎 -->
<line x1="${s*.5}" y1="${s*.42}" x2="${s*.5}" y2="${s*.82}" stroke="url(#sk_bone)" stroke-width="${s*.035}" stroke-linecap="round"/>
<!-- 脊椎关节 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.02}" fill="#c8bc98"/>
<circle cx="${s*.5}" cy="${s*.58}" r="${s*.018}" fill="#c8bc98"/>
<circle cx="${s*.5}" cy="${s*.66}" r="${s*.016}" fill="#c8bc98"/>
<circle cx="${s*.5}" cy="${s*.74}" r="${s*.015}" fill="#c8bc98"/>
<!-- 肋骨 -->
<path d="M ${s*.37},${s*.47} Q ${s*.5},${s*.5} ${s*.63},${s*.47}" stroke="#e8e0c8" stroke-width="${s*.02}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.38},${s*.53} Q ${s*.5},${s*.56} ${s*.62},${s*.53}" stroke="#e8e0c8" stroke-width="${s*.018}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.39},${s*.59} Q ${s*.5},${s*.62} ${s*.61},${s*.59}" stroke="#e8e0c8" stroke-width="${s*.016}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.4},${s*.65} Q ${s*.5},${s*.67} ${s*.6},${s*.65}" stroke="#ddd8c0" stroke-width="${s*.014}" fill="none" stroke-linecap="round"/>
<!-- 头骨 -->
<circle cx="${s*.5}" cy="${s*.26}" r="${s*.2}" fill="url(#sk_skull)" stroke="#8a7a50" stroke-width="${s*.008}"/>
<!-- 头骨裂缝 -->
<path d="M ${s*.48},${s*.1} Q ${s*.46},${s*.15} ${s*.49},${s*.2}" stroke="rgba(80,60,30,0.3)" stroke-width="${s*.005}" fill="none"/>
<!-- 眼眶 -->
<ellipse cx="${s*.43}" cy="${s*.25}" rx="${s*.06}" ry="${s*.07}" fill="#1a2a1a"/>
<ellipse cx="${s*.57}" cy="${s*.25}" rx="${s*.06}" ry="${s*.07}" fill="#1a2a1a"/>
<!-- 灵魂火焰眼 -->
<circle cx="${s*.43}" cy="${s*.24}" r="${s*.03}" fill="#44ff44" filter="url(#sk_fire)"/>
<circle cx="${s*.57}" cy="${s*.24}" r="${s*.03}" fill="#44ff44" filter="url(#sk_fire)"/>
<circle cx="${s*.43}" cy="${s*.23}" r="${s*.015}" fill="#aaffaa"/>
<circle cx="${s*.57}" cy="${s*.23}" r="${s*.015}" fill="#aaffaa"/>
<!-- 鼻孔 -->
<path d="M ${s*.47},${s*.32} L ${s*.49},${s*.35} L ${s*.51},${s*.35} L ${s*.53},${s*.32}" fill="#3a3a2a"/>
<!-- 牙齿 -->
<rect x="${s*.42}" y="${s*.37}" width="${s*.03}" height="${s*.035}" fill="#fffff0" rx="${s*.003}" stroke="#aaa088" stroke-width="${s*.003}"/>
<rect x="${s*.46}" y="${s*.37}" width="${s*.03}" height="${s*.035}" fill="#fffff0" rx="${s*.003}" stroke="#aaa088" stroke-width="${s*.003}"/>
<rect x="${s*.5}" y="${s*.37}" width="${s*.03}" height="${s*.035}" fill="#fffff0" rx="${s*.003}" stroke="#aaa088" stroke-width="${s*.003}"/>
<rect x="${s*.54}" y="${s*.37}" width="${s*.03}" height="${s*.035}" fill="#fffff0" rx="${s*.003}" stroke="#aaa088" stroke-width="${s*.003}"/>
<!-- 短剑 -->
<rect x="${s*.74}" y="${s*.28}" width="${s*.02}" height="${s*.32}" fill="url(#sk_blade)" rx="${s*.005}" transform="rotate(-12,${s*.75},${s*.44})"/>
<line x1="${s*.74}" y1="${s*.3}" x2="${s*.76}" y2="${s*.3}" stroke="rgba(255,255,255,0.4)" stroke-width="${s*.005}" transform="rotate(-12,${s*.75},${s*.44})"/>
<!-- 剑柄 -->
<rect x="${s*.72}" y="${s*.58}" width="${s*.06}" height="${s*.025}" fill="#8b6914" rx="${s*.005}" transform="rotate(-12,${s*.75},${s*.59})"/>
<rect x="${s*.735}" y="${s*.6}" width="${s*.03}" height="${s*.06}" fill="#5c3311" rx="${s*.005}" transform="rotate(-12,${s*.75},${s*.63})"/>
<!-- 腿骨 -->
<line x1="${s*.46}" y1="${s*.78}" x2="${s*.4}" y2="${s*.9}" stroke="url(#sk_bone)" stroke-width="${s*.025}" stroke-linecap="round"/>
<line x1="${s*.54}" y1="${s*.78}" x2="${s*.6}" y2="${s*.9}" stroke="url(#sk_bone)" stroke-width="${s*.025}" stroke-linecap="round"/>
</svg>`;
};

// ─── 暗影狼 (Shadow Wolf) ─── 流线型狼体，冰蓝色毛皮，利爪与獠牙
SVG_SPRITES.shadowWolf = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="sw_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#aaccff"/><stop offset="30%" stop-color="#6699ee"/><stop offset="60%" stop-color="#4477cc"/><stop offset="100%" stop-color="#1a3366"/></radialGradient>
<radialGradient id="sw_head" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#bbddff"/><stop offset="50%" stop-color="#7799dd"/><stop offset="100%" stop-color="#334488"/></radialGradient>
<linearGradient id="sw_fur" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#88aadd"/><stop offset="100%" stop-color="#334477"/></linearGradient>
<filter id="sw_glow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.9}" rx="${s*.35}" ry="${s*.05}" fill="rgba(10,20,50,0.3)"/>
<!-- 尾巴 -->
<path d="M ${s*.75},${s*.5} Q ${s*.92},${s*.38} ${s*.9},${s*.22} Q ${s*.88},${s*.28} ${s*.85},${s*.32}" stroke="url(#sw_fur)" stroke-width="${s*.06}" fill="none" stroke-linecap="round"/>
<!-- 身体（流线椭圆） -->
<ellipse cx="${s*.5}" cy="${s*.58}" rx="${s*.34}" ry="${s*.2}" fill="url(#sw_body)" stroke="rgba(20,40,80,0.3)" stroke-width="${s*.006}"/>
<!-- 胸口浅色 -->
<ellipse cx="${s*.38}" cy="${s*.6}" rx="${s*.1}" ry="${s*.12}" fill="rgba(180,210,255,0.3)"/>
<!-- 头部 -->
<ellipse cx="${s*.22}" cy="${s*.46}" rx="${s*.16}" ry="${s*.14}" fill="url(#sw_head)" stroke="rgba(20,40,80,0.3)" stroke-width="${s*.006}"/>
<!-- 口吻 -->
<ellipse cx="${s*.12}" cy="${s*.5}" rx="${s*.08}" ry="${s*.05}" fill="#5577aa" stroke="rgba(20,40,80,0.3)" stroke-width="${s*.005}"/>
<!-- 耳朵 -->
<polygon points="${s*.2},${s*.33} ${s*.16},${s*.15} ${s*.25},${s*.3}" fill="#3a5588" stroke="#223355" stroke-width="${s*.006}"/>
<polygon points="${s*.3},${s*.32} ${s*.32},${s*.14} ${s*.36},${s*.3}" fill="#3a5588" stroke="#223355" stroke-width="${s*.006}"/>
<!-- 内耳 -->
<polygon points="${s*.2},${s*.33} ${s*.17},${s*.2} ${s*.24},${s*.31}" fill="rgba(255,150,180,0.3)"/>
<polygon points="${s*.31},${s*.32} ${s*.32},${s*.19} ${s*.35},${s*.31}" fill="rgba(255,150,180,0.3)"/>
<!-- 眼睛 - 金色猎食者之眼 -->
<ellipse cx="${s*.2}" cy="${s*.43}" rx="${s*.04}" ry="${s*.03}" fill="#ffee22" filter="url(#sw_glow)"/>
<ellipse cx="${s*.28}" cy="${s*.43}" rx="${s*.04}" ry="${s*.03}" fill="#ffee22" filter="url(#sw_glow)"/>
<ellipse cx="${s*.2}" cy="${s*.43}" rx="${s*.015}" ry="${s*.025}" fill="#110800"/>
<ellipse cx="${s*.28}" cy="${s*.43}" rx="${s*.015}" ry="${s*.025}" fill="#110800"/>
<!-- 鼻子 -->
<ellipse cx="${s*.08}" cy="${s*.49}" rx="${s*.02}" ry="${s*.015}" fill="#1a2a44"/>
<!-- 獠牙 -->
<polygon points="${s*.12},${s*.54} ${s*.13},${s*.62} ${s*.14},${s*.54}" fill="#eee"/>
<polygon points="${s*.16},${s*.55} ${s*.17},${s*.62} ${s*.18},${s*.55}" fill="#eee"/>
<!-- 腿 -->
<line x1="${s*.32}" y1="${s*.72}" x2="${s*.28}" y2="${s*.88}" stroke="#2a4477" stroke-width="${s*.04}" stroke-linecap="round"/>
<line x1="${s*.42}" y1="${s*.74}" x2="${s*.4}" y2="${s*.88}" stroke="#2a4477" stroke-width="${s*.04}" stroke-linecap="round"/>
<line x1="${s*.58}" y1="${s*.74}" x2="${s*.6}" y2="${s*.88}" stroke="#2a4477" stroke-width="${s*.04}" stroke-linecap="round"/>
<line x1="${s*.68}" y1="${s*.72}" x2="${s*.72}" y2="${s*.88}" stroke="#2a4477" stroke-width="${s*.04}" stroke-linecap="round"/>
<!-- 爪子 -->
<circle cx="${s*.27}" cy="${s*.89}" r="${s*.015}" fill="#1a2a44"/>
<circle cx="${s*.39}" cy="${s*.89}" r="${s*.015}" fill="#1a2a44"/>
<circle cx="${s*.61}" cy="${s*.89}" r="${s*.015}" fill="#1a2a44"/>
<circle cx="${s*.73}" cy="${s*.89}" r="${s*.015}" fill="#1a2a44"/>
<!-- 毛发纹理 -->
<path d="M ${s*.3},${s*.45} Q ${s*.35},${s*.42} ${s*.4},${s*.44}" stroke="rgba(150,190,230,0.3)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.5},${s*.44} Q ${s*.55},${s*.42} ${s*.6},${s*.45}" stroke="rgba(150,190,230,0.25)" stroke-width="${s*.005}" fill="none"/>
</svg>`;
};

// ─── 骷髅法师 (Skeleton Mage) ─── 紫袍裹体，骷髅头戴尖帽，水晶法杖发光
SVG_SPRITES.skeletonMage = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<linearGradient id="sm_robe" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#8855ff"/><stop offset="50%" stop-color="#5533aa"/><stop offset="100%" stop-color="#331a66"/></linearGradient>
<radialGradient id="sm_crystal" cx="50%" cy="30%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#ee88ff"/><stop offset="70%" stop-color="#aa44dd"/><stop offset="100%" stop-color="#6600aa"/></radialGradient>
<radialGradient id="sm_skull" cx="45%" cy="35%" r="55%"><stop offset="0%" stop-color="#fff8f0"/><stop offset="50%" stop-color="#e8e0d0"/><stop offset="100%" stop-color="#c8b8a0"/></radialGradient>
<filter id="sm_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.93}" rx="${s*.22}" ry="${s*.035}" fill="rgba(60,0,100,0.35)"/>
<!-- 魔法光环底座 -->
<ellipse cx="${s*.5}" cy="${s*.88}" rx="${s*.18}" ry="${s*.04}" fill="none" stroke="rgba(170,100,255,0.3)" stroke-width="${s*.008}" stroke-dasharray="${s*.03} ${s*.02}"/>
<!-- 长袍 -->
<path d="M ${s*.35},${s*.35} L ${s*.65},${s*.35} L ${s*.78},${s*.88} Q ${s*.5},${s*.95} ${s*.22},${s*.88} Z" fill="url(#sm_robe)"/>
<!-- 袍子褶皱 -->
<path d="M ${s*.4},${s*.4} Q ${s*.38},${s*.6} ${s*.35},${s*.85}" stroke="rgba(100,50,150,0.4)" stroke-width="${s*.008}" fill="none"/>
<path d="M ${s*.6},${s*.4} Q ${s*.62},${s*.6} ${s*.65},${s*.85}" stroke="rgba(100,50,150,0.4)" stroke-width="${s*.008}" fill="none"/>
<path d="M ${s*.5},${s*.45} Q ${s*.48},${s*.65} ${s*.5},${s*.88}" stroke="rgba(100,50,150,0.3)" stroke-width="${s*.006}" fill="none"/>
<!-- 袍子上的符文 -->
<polygon points="${s*.5},${s*.52} ${s*.44},${s*.62} ${s*.56},${s*.62}" stroke="rgba(180,100,255,0.5)" stroke-width="${s*.008}" fill="none"/>
<circle cx="${s*.5}" cy="${s*.58}" r="${s*.025}" stroke="rgba(180,100,255,0.4)" stroke-width="${s*.006}" fill="none"/>
<!-- 肩甲 -->
<ellipse cx="${s*.36}" cy="${s*.37}" rx="${s*.06}" ry="${s*.04}" fill="#4a2888" stroke="#331a66" stroke-width="${s*.005}"/>
<ellipse cx="${s*.64}" cy="${s*.37}" rx="${s*.06}" ry="${s*.04}" fill="#4a2888" stroke="#331a66" stroke-width="${s*.005}"/>
<!-- 骷髅头 -->
<circle cx="${s*.5}" cy="${s*.25}" r="${s*.12}" fill="url(#sm_skull)"/>
<!-- 颅骨裂缝 -->
<path d="M ${s*.5},${s*.15} Q ${s*.52},${s*.2} ${s*.48},${s*.25}" stroke="rgba(80,60,40,0.3)" stroke-width="${s*.004}" fill="none"/>
<!-- 法师尖帽 -->
<path d="M ${s*.5},${s*.03} Q ${s*.32},${s*.18} ${s*.34},${s*.33} L ${s*.66},${s*.33} Q ${s*.68},${s*.18} ${s*.5},${s*.03} Z" fill="#2a1155" stroke="#1a0a33" stroke-width="${s*.006}"/>
<!-- 帽带 -->
<path d="M ${s*.34},${s*.33} Q ${s*.5},${s*.36} ${s*.66},${s*.33}" fill="#ffcc00" stroke="#cc9900" stroke-width="${s*.004}"/>
<!-- 帽子星饰 -->
<polygon points="${s*.5},${s*.08} ${s*.515},${s*.1} ${s*.535},${s*.095} ${s*.52},${s*.115} ${s*.53},${s*.135} ${s*.5},${s*.12} ${s*.47},${s*.135} ${s*.48},${s*.115} ${s*.465},${s*.095} ${s*.485},${s*.1}" fill="#ffdd44" opacity="0.9"/>
<!-- 眼睛 - 紫色魔力火焰 -->
<circle cx="${s*.45}" cy="${s*.25}" r="${s*.032}" fill="#cc55ff" filter="url(#sm_glow)"/>
<circle cx="${s*.55}" cy="${s*.25}" r="${s*.032}" fill="#cc55ff" filter="url(#sm_glow)"/>
<circle cx="${s*.45}" cy="${s*.25}" r="${s*.015}" fill="#fff" opacity="0.8"/>
<circle cx="${s*.55}" cy="${s*.25}" r="${s*.015}" fill="#fff" opacity="0.8"/>
<!-- 鼻腔 -->
<polygon points="${s*.485},${s*.29} ${s*.515},${s*.29} ${s*.5},${s*.32}" fill="#5a4a3a"/>
<!-- 下颚牙齿 -->
<rect x="${s*.44}" y="${s*.33}" width="${s*.025}" height="${s*.025}" fill="#fff8e8" rx="1"/>
<rect x="${s*.47}" y="${s*.33}" width="${s*.025}" height="${s*.025}" fill="#fff8e8" rx="1"/>
<rect x="${s*.5}" y="${s*.33}" width="${s*.025}" height="${s*.025}" fill="#fff8e8" rx="1"/>
<rect x="${s*.53}" y="${s*.33}" width="${s*.025}" height="${s*.025}" fill="#fff8e8" rx="1"/>
<!-- 法杖 -->
<rect x="${s*.24}" y="${s*.15}" width="${s*.02}" height="${s*.7}" fill="#3a2a1a" rx="${s*.01}" transform="rotate(5,${s*.25},${s*.5})"/>
<!-- 法杖螺纹 -->
<path d="M ${s*.24},${s*.3} Q ${s*.27},${s*.33} ${s*.24},${s*.36} Q ${s*.27},${s*.39} ${s*.24},${s*.42}" stroke="#5a4a3a" stroke-width="${s*.005}" fill="none" transform="rotate(5,${s*.25},${s*.5})"/>
<!-- 法杖顶部水晶球 -->
<circle cx="${s*.245}" cy="${s*.13}" r="${s*.045}" fill="url(#sm_crystal)" filter="url(#sm_glow)"/>
<!-- 水晶内光 -->
<circle cx="${s*.235}" cy="${s*.11}" r="${s*.015}" fill="rgba(255,255,255,0.7)"/>
<!-- 魔法粒子环绕 -->
<circle cx="${s*.18}" cy="${s*.2}" r="${s*.012}" fill="#cc88ff" opacity="0.6" filter="url(#sm_glow)"/>
<circle cx="${s*.3}" cy="${s*.08}" r="${s*.01}" fill="#dd99ff" opacity="0.5" filter="url(#sm_glow)"/>
<circle cx="${s*.72}" cy="${s*.45}" r="${s*.01}" fill="#bb77ee" opacity="0.4"/>
</svg>`;
};

// ─── 石像鬼 (Gargoyle) ─── 岩石质感，翼展，角，裂缝纹理
SVG_SPRITES.gargoyle = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="gg_body" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#c8b898"/><stop offset="30%" stop-color="#a08868"/><stop offset="70%" stop-color="#786048"/><stop offset="100%" stop-color="#504030"/></radialGradient>
<linearGradient id="gg_wing" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#907060"/><stop offset="100%" stop-color="#584038"/></linearGradient>
<filter id="gg_rough"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.35}" ry="${s*.04}" fill="rgba(40,30,20,0.3)"/>
<!-- 左翼 -->
<path d="M ${s*.3},${s*.4} Q ${s*.12},${s*.18} ${s*.05},${s*.35} L ${s*.08},${s*.42} Q ${s*.1},${s*.52} ${s*.18},${s*.58} L ${s*.25},${s*.55} Z" fill="url(#gg_wing)" stroke="#4a3528" stroke-width="${s*.008}"/>
<!-- 翼骨 -->
<line x1="${s*.3}" y1="${s*.4}" x2="${s*.08}" y2="${s*.35}" stroke="#6a5040" stroke-width="${s*.015}" stroke-linecap="round"/>
<line x1="${s*.28}" y1="${s*.45}" x2="${s*.12}" y2="${s*.5}" stroke="#6a5040" stroke-width="${s*.012}"/>
<!-- 右翼 -->
<path d="M ${s*.7},${s*.4} Q ${s*.88},${s*.18} ${s*.95},${s*.35} L ${s*.92},${s*.42} Q ${s*.9},${s*.52} ${s*.82},${s*.58} L ${s*.75},${s*.55} Z" fill="url(#gg_wing)" stroke="#4a3528" stroke-width="${s*.008}"/>
<line x1="${s*.7}" y1="${s*.4}" x2="${s*.92}" y2="${s*.35}" stroke="#6a5040" stroke-width="${s*.015}" stroke-linecap="round"/>
<line x1="${s*.72}" y1="${s*.45}" x2="${s*.88}" y2="${s*.5}" stroke="#6a5040" stroke-width="${s*.012}"/>
<!-- 身体 - 梯形岩石 -->
<path d="M ${s*.28},${s*.3} L ${s*.72},${s*.3} L ${s*.78},${s*.82} Q ${s*.5},${s*.9} ${s*.22},${s*.82} Z" fill="url(#gg_body)" stroke="#504030" stroke-width="${s*.008}"/>
<!-- 岩石裂缝纹理 -->
<path d="M ${s*.38},${s*.35} Q ${s*.4},${s*.5} ${s*.36},${s*.7}" stroke="rgba(40,30,20,0.4)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.6},${s*.38} L ${s*.63},${s*.52} L ${s*.58},${s*.68}" stroke="rgba(40,30,20,0.35)" stroke-width="${s*.005}" fill="none"/>
<path d="M ${s*.5},${s*.4} L ${s*.48},${s*.55}" stroke="rgba(40,30,20,0.3)" stroke-width="${s*.004}" fill="none"/>
<!-- 苔藓斑点 -->
<circle cx="${s*.35}" cy="${s*.7}" r="${s*.025}" fill="#5a8a4a" opacity="0.4"/>
<circle cx="${s*.65}" cy="${s*.65}" r="${s*.02}" fill="#4a7a3a" opacity="0.35"/>
<circle cx="${s*.55}" cy="${s*.78}" r="${s*.015}" fill="#5a8a4a" opacity="0.3"/>
<!-- 弯角 -->
<path d="M ${s*.33},${s*.3} Q ${s*.28},${s*.15} ${s*.22},${s*.08} Q ${s*.2},${s*.12} ${s*.24},${s*.2}" stroke="#6a5540" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.67},${s*.3} Q ${s*.72},${s*.15} ${s*.78},${s*.08} Q ${s*.8},${s*.12} ${s*.76},${s*.2}" stroke="#6a5540" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
<!-- 角纹 -->
<path d="M ${s*.3},${s*.22} L ${s*.28},${s*.2}" stroke="rgba(100,80,60,0.5)" stroke-width="${s*.006}"/>
<path d="M ${s*.7},${s*.22} L ${s*.72},${s*.2}" stroke="rgba(100,80,60,0.5)" stroke-width="${s*.006}"/>
<!-- 眼睛 - 橙色发光 -->
<circle cx="${s*.4}" cy="${s*.44}" r="${s*.04}" fill="#ff8800"/>
<circle cx="${s*.6}" cy="${s*.44}" r="${s*.04}" fill="#ff8800"/>
<circle cx="${s*.4}" cy="${s*.44}" r="${s*.02}" fill="#ffee44"/>
<circle cx="${s*.6}" cy="${s*.44}" r="${s*.02}" fill="#ffee44"/>
<circle cx="${s*.4}" cy="${s*.44}" r="${s*.008}" fill="#fff"/>
<circle cx="${s*.6}" cy="${s*.44}" r="${s*.008}" fill="#fff"/>
<!-- 鼻梁 -->
<path d="M ${s*.5},${s*.48} L ${s*.48},${s*.54} L ${s*.52},${s*.54} Z" fill="#5a4838"/>
<!-- 獠牙嘴 -->
<path d="M ${s*.38},${s*.58} Q ${s*.43},${s*.62} ${s*.5},${s*.61} Q ${s*.57},${s*.62} ${s*.62},${s*.58}" stroke="#3a2a1a" stroke-width="${s*.015}" fill="none"/>
<polygon points="${s*.42},${s*.58} ${s*.44},${s*.65} ${s*.46},${s*.58}" fill="#eee8d8"/>
<polygon points="${s*.54},${s*.58} ${s*.56},${s*.65} ${s*.58},${s*.58}" fill="#eee8d8"/>
<!-- 爪脚 -->
<path d="M ${s*.3},${s*.82} L ${s*.25},${s*.92} L ${s*.3},${s*.9} L ${s*.35},${s*.92}" fill="#6a5540"/>
<path d="M ${s*.7},${s*.82} L ${s*.65},${s*.92} L ${s*.7},${s*.9} L ${s*.75},${s*.92}" fill="#6a5540"/>
</svg>`;
};

// ─── 恶魔术士 (Demon Caster) ─── 暗红法袍，双角恶魔，火焰符文
SVG_SPRITES.demonCaster = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<linearGradient id="dc_robe" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#7a1133"/><stop offset="50%" stop-color="#4a0a22"/><stop offset="100%" stop-color="#2a0511"/></linearGradient>
<radialGradient id="dc_head" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#dd6666"/><stop offset="50%" stop-color="#aa3344"/><stop offset="100%" stop-color="#661122"/></radialGradient>
<radialGradient id="dc_fire" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#ffaa44"/><stop offset="70%" stop-color="#ff4400"/><stop offset="100%" stop-color="#880000"/></radialGradient>
<filter id="dc_glow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.93}" rx="${s*.22}" ry="${s*.035}" fill="rgba(80,0,20,0.35)"/>
<!-- 暗能量圈 -->
<circle cx="${s*.5}" cy="${s*.55}" r="${s*.4}" fill="none" stroke="rgba(255,80,80,0.15)" stroke-width="${s*.01}" stroke-dasharray="${s*.06} ${s*.04}"/>
<!-- 法袍 -->
<path d="M ${s*.5},${s*.28} Q ${s*.32},${s*.38} ${s*.28},${s*.85} Q ${s*.5},${s*.95} ${s*.72},${s*.85} Q ${s*.68},${s*.38} ${s*.5},${s*.28} Z" fill="url(#dc_robe)"/>
<!-- 袍子纹路 -->
<path d="M ${s*.4},${s*.4} Q ${s*.38},${s*.6} ${s*.35},${s*.82}" stroke="rgba(150,30,50,0.3)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.6},${s*.4} Q ${s*.62},${s*.6} ${s*.65},${s*.82}" stroke="rgba(150,30,50,0.3)" stroke-width="${s*.006}" fill="none"/>
<!-- 火焰符文（胸前） -->
<circle cx="${s*.5}" cy="${s*.55}" r="${s*.06}" fill="none" stroke="#ff6644" stroke-width="${s*.008}" opacity="0.7"/>
<polygon points="${s*.5},${s*.48} ${s*.46},${s*.57} ${s*.54},${s*.57}" fill="none" stroke="#ff8844" stroke-width="${s*.006}" opacity="0.6"/>
<!-- 头 -->
<circle cx="${s*.5}" cy="${s*.3}" r="${s*.13}" fill="url(#dc_head)"/>
<!-- 双角 -->
<path d="M ${s*.4},${s*.2} Q ${s*.35},${s*.1} ${s*.3},${s*.03} Q ${s*.33},${s*.08} ${s*.38},${s*.18}" stroke="#441111" stroke-width="${s*.02}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.6},${s*.2} Q ${s*.65},${s*.1} ${s*.7},${s*.03} Q ${s*.67},${s*.08} ${s*.62},${s*.18}" stroke="#441111" stroke-width="${s*.02}" fill="none" stroke-linecap="round"/>
<!-- 角纹 -->
<path d="M ${s*.36},${s*.12} L ${s*.34},${s*.1}" stroke="rgba(100,20,20,0.5)" stroke-width="${s*.005}"/>
<path d="M ${s*.64},${s*.12} L ${s*.66},${s*.1}" stroke="rgba(100,20,20,0.5)" stroke-width="${s*.005}"/>
<!-- 眼 -->
<circle cx="${s*.45}" cy="${s*.28}" r="${s*.028}" fill="#ffcc33" filter="url(#dc_glow)"/>
<circle cx="${s*.55}" cy="${s*.28}" r="${s*.028}" fill="#ffcc33" filter="url(#dc_glow)"/>
<circle cx="${s*.45}" cy="${s*.28}" r="${s*.012}" fill="#fff" opacity="0.8"/>
<circle cx="${s*.55}" cy="${s*.28}" r="${s*.012}" fill="#fff" opacity="0.8"/>
<!-- 嘴 -->
<path d="M ${s*.44},${s*.35} Q ${s*.5},${s*.38} ${s*.56},${s*.35}" stroke="#220808" stroke-width="${s*.012}" fill="none"/>
<!-- 浮空火球（左右手） -->
<circle cx="${s*.28}" cy="${s*.55}" r="${s*.035}" fill="url(#dc_fire)" filter="url(#dc_glow)"/>
<circle cx="${s*.72}" cy="${s*.5}" r="${s*.035}" fill="url(#dc_fire)" filter="url(#dc_glow)"/>
<!-- 火球外环 -->
<circle cx="${s*.28}" cy="${s*.55}" r="${s*.05}" fill="none" stroke="rgba(255,100,0,0.3)" stroke-width="${s*.005}"/>
<circle cx="${s*.72}" cy="${s*.5}" r="${s*.05}" fill="none" stroke="rgba(255,100,0,0.3)" stroke-width="${s*.005}"/>
<!-- 火焰粒子 -->
<circle cx="${s*.25}" cy="${s*.48}" r="${s*.01}" fill="#ff8844" opacity="0.5"/>
<circle cx="${s*.75}" cy="${s*.43}" r="${s*.008}" fill="#ffaa44" opacity="0.4"/>
<circle cx="${s*.32}" cy="${s*.62}" r="${s*.008}" fill="#ff6622" opacity="0.4"/>
</svg>`;
};

// ─── 爆破虫 (Exploder) ─── 球形岩浆体，裂纹流淌，危险光芒
SVG_SPRITES.exploder = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="ex_body" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#ffcc44"/><stop offset="25%" stop-color="#ff8822"/><stop offset="55%" stop-color="#cc4411"/><stop offset="80%" stop-color="#882200"/><stop offset="100%" stop-color="#441100"/></radialGradient>
<radialGradient id="ex_core" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="40%" stop-color="#ffee66"/><stop offset="100%" stop-color="#ff8800"/></radialGradient>
<filter id="ex_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 危险光晕 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.45}" fill="none" stroke="rgba(255,150,0,0.15)" stroke-width="${s*.015}"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.42}" fill="none" stroke="rgba(255,200,0,0.1)" stroke-width="${s*.008}"/>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.88}" rx="${s*.25}" ry="${s*.04}" fill="rgba(80,30,0,0.3)"/>
<!-- 主体球 -->
<circle cx="${s*.5}" cy="${s*.48}" r="${s*.32}" fill="url(#ex_body)"/>
<!-- 岩浆裂缝网络 -->
<path d="M ${s*.35},${s*.32} Q ${s*.4},${s*.4} ${s*.32},${s*.55} Q ${s*.35},${s*.65} ${s*.4},${s*.7}" stroke="#ffee44" stroke-width="${s*.015}" fill="none" opacity="0.8"/>
<path d="M ${s*.55},${s*.22} L ${s*.58},${s*.38} Q ${s*.62},${s*.5} ${s*.65},${s*.6}" stroke="#ffcc22" stroke-width="${s*.012}" fill="none" opacity="0.7"/>
<path d="M ${s*.42},${s*.45} L ${s*.55},${s*.5} L ${s*.5},${s*.62}" stroke="#ffdd33" stroke-width="${s*.01}" fill="none" opacity="0.6"/>
<!-- 裂缝光晕 -->
<path d="M ${s*.35},${s*.32} Q ${s*.4},${s*.4} ${s*.32},${s*.55}" stroke="rgba(255,255,100,0.3)" stroke-width="${s*.03}" fill="none" filter="url(#ex_glow)"/>
<!-- 核心光点 -->
<circle cx="${s*.45}" cy="${s*.42}" r="${s*.05}" fill="url(#ex_core)" opacity="0.8"/>
<!-- 爆炸射线 -->
<line x1="${s*.35}" y1="${s*.3}" x2="${s*.22}" y2="${s*.18}" stroke="#ffee66" stroke-width="${s*.018}" opacity="0.7" stroke-linecap="round"/>
<line x1="${s*.65}" y1="${s*.3}" x2="${s*.78}" y2="${s*.18}" stroke="#ffee66" stroke-width="${s*.018}" opacity="0.7" stroke-linecap="round"/>
<line x1="${s*.35}" y1="${s*.65}" x2="${s*.2}" y2="${s*.78}" stroke="#ffcc44" stroke-width="${s*.015}" opacity="0.6" stroke-linecap="round"/>
<line x1="${s*.65}" y1="${s*.65}" x2="${s*.8}" y2="${s*.78}" stroke="#ffcc44" stroke-width="${s*.015}" opacity="0.6" stroke-linecap="round"/>
<line x1="${s*.5}" y1="${s*.18}" x2="${s*.5}" y2="${s*.08}" stroke="#ffee88" stroke-width="${s*.015}" opacity="0.6" stroke-linecap="round"/>
<line x1="${s*.5}" y1="${s*.78}" x2="${s*.5}" y2="${s*.88}" stroke="#ffaa44" stroke-width="${s*.012}" opacity="0.5" stroke-linecap="round"/>
<!-- 射线末端火花 -->
<circle cx="${s*.22}" cy="${s*.18}" r="${s*.015}" fill="#ffee88" opacity="0.6"/>
<circle cx="${s*.78}" cy="${s*.18}" r="${s*.015}" fill="#ffee88" opacity="0.6"/>
<!-- 眼睛(疯狂) -->
<circle cx="${s*.42}" cy="${s*.42}" r="${s*.04}" fill="#ffffaa"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.04}" fill="#ffffaa"/>
<circle cx="${s*.42}" cy="${s*.42}" r="${s*.018}" fill="#220000"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.018}" fill="#220000"/>
<!-- 小腿（短）-->
<line x1="${s*.38}" y1="${s*.76}" x2="${s*.34}" y2="${s*.87}" stroke="#883311" stroke-width="${s*.025}" stroke-linecap="round"/>
<line x1="${s*.62}" y1="${s*.76}" x2="${s*.66}" y2="${s*.87}" stroke="#883311" stroke-width="${s*.025}" stroke-linecap="round"/>
</svg>`;
};

// ─── 精英骷髅 (Elite Skeleton) ─── 穿戴铠甲的皇冠骷髅战士
SVG_SPRITES.eliteSkeleton = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="es_armor" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#bbaa88"/><stop offset="40%" stop-color="#8a7055"/><stop offset="80%" stop-color="#5a4030"/><stop offset="100%" stop-color="#3a2518"/></radialGradient>
<radialGradient id="es_skull" cx="45%" cy="35%" r="55%"><stop offset="0%" stop-color="#fff8ee"/><stop offset="50%" stop-color="#e8d8c0"/><stop offset="100%" stop-color="#b8a080"/></radialGradient>
<linearGradient id="es_blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e8e8e8"/><stop offset="50%" stop-color="#b0b0b0"/><stop offset="100%" stop-color="#808080"/></linearGradient>
<linearGradient id="es_crown" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe066"/><stop offset="100%" stop-color="#cc8800"/></linearGradient>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.93}" rx="${s*.28}" ry="${s*.04}" fill="rgba(40,20,10,0.3)"/>
<!-- 精英光环 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.42}" fill="rgba(255,60,30,0.06)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.44}" fill="none" stroke="rgba(255,80,40,0.12)" stroke-width="${s*.008}"/>
<!-- 铠甲体 -->
<path d="M ${s*.32},${s*.35} L ${s*.68},${s*.35} L ${s*.74},${s*.82} L ${s*.26},${s*.82} Z" fill="url(#es_armor)" stroke="#4a3020" stroke-width="${s*.008}"/>
<!-- 铠甲中线 -->
<line x1="${s*.5}" y1="${s*.35}" x2="${s*.5}" y2="${s*.8}" stroke="rgba(200,160,100,0.3)" stroke-width="${s*.01}"/>
<!-- 横线装饰 -->
<line x1="${s*.34}" y1="${s*.5}" x2="${s*.66}" y2="${s*.5}" stroke="rgba(200,160,100,0.25)" stroke-width="${s*.008}"/>
<line x1="${s*.32}" y1="${s*.65}" x2="${s*.68}" y2="${s*.65}" stroke="rgba(200,160,100,0.2)" stroke-width="${s*.006}"/>
<!-- 肩甲 -->
<ellipse cx="${s*.32}" cy="${s*.37}" rx="${s*.07}" ry="${s*.045}" fill="#7a6045" stroke="#5a4030" stroke-width="${s*.006}"/>
<ellipse cx="${s*.68}" cy="${s*.37}" rx="${s*.07}" ry="${s*.045}" fill="#7a6045" stroke="#5a4030" stroke-width="${s*.006}"/>
<!-- 肩甲尖刺 -->
<polygon points="${s*.27},${s*.35} ${s*.25},${s*.28} ${s*.3},${s*.34}" fill="#5a4030"/>
<polygon points="${s*.73},${s*.35} ${s*.75},${s*.28} ${s*.7},${s*.34}" fill="#5a4030"/>
<!-- 骷髅头 -->
<circle cx="${s*.5}" cy="${s*.22}" r="${s*.12}" fill="url(#es_skull)"/>
<!-- 皇冠 -->
<rect x="${s*.36}" y="${s*.12}" width="${s*.28}" height="${s*.045}" fill="url(#es_crown)" stroke="#aa7700" stroke-width="${s*.004}"/>
<path d="M ${s*.36},${s*.12} L ${s*.4},${s*.04} L ${s*.44},${s*.09} L ${s*.5},${s*.02} L ${s*.56},${s*.09} L ${s*.6},${s*.04} L ${s*.64},${s*.12} Z" fill="url(#es_crown)" stroke="#aa7700" stroke-width="${s*.005}"/>
<!-- 皇冠宝石 -->
<circle cx="${s*.5}" cy="${s*.1}" r="${s*.018}" fill="#ff2222" stroke="#880000" stroke-width="${s*.003}"/>
<circle cx="${s*.42}" cy="${s*.11}" r="${s*.012}" fill="#2244ff" stroke="#001188" stroke-width="${s*.002}"/>
<circle cx="${s*.58}" cy="${s*.11}" r="${s*.012}" fill="#2244ff" stroke="#001188" stroke-width="${s*.002}"/>
<!-- 眼睛 - 红色火焰 -->
<circle cx="${s*.44}" cy="${s*.22}" r="${s*.03}" fill="#ff3300"/>
<circle cx="${s*.56}" cy="${s*.22}" r="${s*.03}" fill="#ff3300"/>
<circle cx="${s*.44}" cy="${s*.22}" r="${s*.015}" fill="#ffcc00" opacity="0.7"/>
<circle cx="${s*.56}" cy="${s*.22}" r="${s*.015}" fill="#ffcc00" opacity="0.7"/>
<!-- 鼻腔 -->
<polygon points="${s*.485},${s*.26} ${s*.515},${s*.26} ${s*.5},${s*.29}" fill="#4a3a2a"/>
<!-- 剑 -->
<rect x="${s*.74}" y="${s*.15}" width="${s*.022}" height="${s*.4}" fill="url(#es_blade)" rx="${s*.005}" transform="rotate(-12,${s*.75},${s*.35})"/>
<!-- 剑刃光泽 -->
<line x1="${s*.75}" y1="${s*.18}" x2="${s*.75}" y2="${s*.5}" stroke="rgba(255,255,255,0.4)" stroke-width="${s*.005}" transform="rotate(-12,${s*.75},${s*.35})"/>
<!-- 剑柄 -->
<rect x="${s*.725}" y="${s*.53}" width="${s*.05}" height="${s*.025}" fill="#aa8833" rx="2" transform="rotate(-12,${s*.75},${s*.54})"/>
<rect x="${s*.738}" y="${s*.55}" width="${s*.025}" height="${s*.08}" fill="#5a3a1a" rx="2" transform="rotate(-12,${s*.75},${s*.59})"/>
</svg>`;
};

// ─── 暗夜领主/精英恶魔 (Elite Demon) ─── 黑紫恶魔，翼+角+魔法阵
SVG_SPRITES.eliteDemon = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="ed_body" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#bb5588"/><stop offset="40%" stop-color="#772244"/><stop offset="80%" stop-color="#440a2a"/><stop offset="100%" stop-color="#220515"/></radialGradient>
<filter id="ed_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.93}" rx="${s*.3}" ry="${s*.04}" fill="rgba(40,0,20,0.35)"/>
<!-- 暗黑魔法阵 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.44}" fill="rgba(180,40,100,0.06)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.43}" fill="none" stroke="rgba(255,80,150,0.15)" stroke-width="${s*.008}" stroke-dasharray="${s*.08} ${s*.05}"/>
<!-- 逆五芒星 -->
<polygon points="${s*.5},${s*.82} ${s*.24},${s*.35} ${s*.76},${s*.35} ${s*.3},${s*.72} ${s*.7},${s*.72}" fill="none" stroke="rgba(255,80,180,0.12)" stroke-width="${s*.006}"/>
<!-- 黑翼（左）-->
<path d="M ${s*.3},${s*.4} Q ${s*.12},${s*.2} ${s*.08},${s*.38} Q ${s*.15},${s*.52} ${s*.28},${s*.55} Z" fill="#1a0515" stroke="#330a20" stroke-width="${s*.006}"/>
<line x1="${s*.3}" y1="${s*.4}" x2="${s*.1}" y2="${s*.35}" stroke="#2a0a1a" stroke-width="${s*.012}"/>
<!-- 黑翼（右）-->
<path d="M ${s*.7},${s*.4} Q ${s*.88},${s*.2} ${s*.92},${s*.38} Q ${s*.85},${s*.52} ${s*.72},${s*.55} Z" fill="#1a0515" stroke="#330a20" stroke-width="${s*.006}"/>
<line x1="${s*.7}" y1="${s*.4}" x2="${s*.9}" y2="${s*.35}" stroke="#2a0a1a" stroke-width="${s*.012}"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.28}" fill="url(#ed_body)"/>
<!-- 暗纹 -->
<line x1="${s*.5}" y1="${s*.25}" x2="${s*.5}" y2="${s*.75}" stroke="rgba(255,100,180,0.15)" stroke-width="${s*.008}"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.16}" stroke="rgba(255,100,180,0.15)" stroke-width="${s*.008}" fill="none"/>
<!-- 弯角 -->
<path d="M ${s*.37},${s*.28} Q ${s*.3},${s*.15} ${s*.24},${s*.1} Q ${s*.22},${s*.15} ${s*.28},${s*.22}" stroke="#330a15" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
<path d="M ${s*.63},${s*.28} Q ${s*.7},${s*.15} ${s*.76},${s*.1} Q ${s*.78},${s*.15} ${s*.72},${s*.22}" stroke="#330a15" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
<!-- 眼睛 -->
<circle cx="${s*.43}" cy="${s*.45}" r="${s*.035}" fill="#ff88cc" filter="url(#ed_glow)"/>
<circle cx="${s*.57}" cy="${s*.45}" r="${s*.035}" fill="#ff88cc" filter="url(#ed_glow)"/>
<circle cx="${s*.43}" cy="${s*.45}" r="${s*.015}" fill="#fff" opacity="0.7"/>
<circle cx="${s*.57}" cy="${s*.45}" r="${s*.015}" fill="#fff" opacity="0.7"/>
<!-- 嘴（邪笑）-->
<path d="M ${s*.4},${s*.58} Q ${s*.5},${s*.63} ${s*.6},${s*.58}" stroke="#ff44aa" stroke-width="${s*.01}" fill="none" opacity="0.6"/>
<!-- 尾巴 -->
<path d="M ${s*.5},${s*.75} Q ${s*.6},${s*.85} ${s*.72},${s*.82} Q ${s*.78},${s*.78} ${s*.75},${s*.72}" stroke="#440a2a" stroke-width="${s*.02}" fill="none" stroke-linecap="round"/>
<circle cx="${s*.75}" cy="${s*.72}" r="${s*.015}" fill="#ff44aa"/>
<!-- 魔能粒子 -->
<circle cx="${s*.2}" cy="${s*.35}" r="${s*.012}" fill="#ff88cc" opacity="0.5" filter="url(#ed_glow)"/>
<circle cx="${s*.8}" cy="${s*.55}" r="${s*.01}" fill="#ff88cc" opacity="0.4" filter="url(#ed_glow)"/>
<circle cx="${s*.35}" cy="${s*.75}" r="${s*.008}" fill="#ffaadd" opacity="0.35"/>
</svg>`;
};

// ─── Boss 骷髅王 ─── 巨大铠甲+王冠+双手巨剑+暗焰
SVG_SPRITES.boss = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="boss_body" cx="45%" cy="35%" r="55%"><stop offset="0%" stop-color="#cc5533"/><stop offset="30%" stop-color="#992211"/><stop offset="60%" stop-color="#661100"/><stop offset="100%" stop-color="#330800"/></radialGradient>
<radialGradient id="boss_skull" cx="45%" cy="35%" r="55%"><stop offset="0%" stop-color="#fff8e0"/><stop offset="50%" stop-color="#e8d0a0"/><stop offset="100%" stop-color="#a08050"/></radialGradient>
<radialGradient id="boss_gem" cx="40%" cy="35%" r="55%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#ff4444"/><stop offset="70%" stop-color="#cc0000"/><stop offset="100%" stop-color="#660000"/></radialGradient>
<linearGradient id="boss_crown" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffe866"/><stop offset="100%" stop-color="#bb7700"/></linearGradient>
<linearGradient id="boss_blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#444"/><stop offset="30%" stop-color="#222"/><stop offset="70%" stop-color="#444"/><stop offset="100%" stop-color="#111"/></linearGradient>
<filter id="boss_glow"><feGaussianBlur stdDeviation="2.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.94}" rx="${s*.35}" ry="${s*.05}" fill="rgba(50,10,0,0.4)"/>
<!-- Boss气场 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.47}" fill="rgba(255,80,0,0.05)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.46}" fill="none" stroke="rgba(255,100,0,0.12)" stroke-width="${s*.01}" stroke-dasharray="${s*.06} ${s*.03}"/>
<!-- 暗焰斗篷 -->
<path d="M ${s*.32},${s*.32} Q ${s*.28},${s*.6} ${s*.3},${s*.88} L ${s*.7},${s*.88} Q ${s*.72},${s*.6} ${s*.68},${s*.32} Z" fill="#440800" opacity="0.5"/>
<!-- 重甲体 -->
<path d="M ${s*.3},${s*.3} L ${s*.7},${s*.3} L ${s*.78},${s*.82} Q ${s*.5},${s*.9} ${s*.22},${s*.82} Z" fill="url(#boss_body)" stroke="#330800" stroke-width="${s*.01}"/>
<!-- 铠甲纹路 -->
<line x1="${s*.5}" y1="${s*.3}" x2="${s*.5}" y2="${s*.8}" stroke="rgba(255,150,50,0.2)" stroke-width="${s*.01}"/>
<line x1="${s*.28}" y1="${s*.5}" x2="${s*.72}" y2="${s*.5}" stroke="rgba(255,150,50,0.2)" stroke-width="${s*.008}"/>
<!-- 中央暗红宝石 -->
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.04}" fill="url(#boss_gem)" filter="url(#boss_glow)"/>
<!-- 大肩甲 -->
<ellipse cx="${s*.28}" cy="${s*.33}" rx="${s*.09}" ry="${s*.06}" fill="#884422" stroke="#552200" stroke-width="${s*.006}"/>
<ellipse cx="${s*.72}" cy="${s*.33}" rx="${s*.09}" ry="${s*.06}" fill="#884422" stroke="#552200" stroke-width="${s*.006}"/>
<!-- 肩甲尖刺 -->
<polygon points="${s*.22},${s*.3} ${s*.18},${s*.22} ${s*.25},${s*.3}" fill="#553311"/>
<polygon points="${s*.78},${s*.3} ${s*.82},${s*.22} ${s*.75},${s*.3}" fill="#553311"/>
<!-- 骷髅头 -->
<circle cx="${s*.5}" cy="${s*.2}" r="${s*.11}" fill="url(#boss_skull)"/>
<!-- 颅骨裂缝 -->
<path d="M ${s*.48},${s*.12} Q ${s*.5},${s*.17} ${s*.46},${s*.22}" stroke="rgba(80,50,30,0.3)" stroke-width="${s*.004}" fill="none"/>
<!-- 王冠 -->
<rect x="${s*.35}" y="${s*.11}" width="${s*.3}" height="${s*.05}" fill="url(#boss_crown)" stroke="#aa7700" stroke-width="${s*.005}"/>
<path d="M ${s*.35},${s*.11} L ${s*.39},${s*.02} L ${s*.43},${s*.07} L ${s*.5},${s*0} L ${s*.57},${s*.07} L ${s*.61},${s*.02} L ${s*.65},${s*.11} Z" fill="url(#boss_crown)" stroke="#aa7700" stroke-width="${s*.005}"/>
<!-- 王冠宝石 -->
<circle cx="${s*.5}" cy="${s*.08}" r="${s*.02}" fill="url(#boss_gem)"/>
<circle cx="${s*.42}" cy="${s*.1}" r="${s*.013}" fill="#2255ff" stroke="#001188" stroke-width="${s*.003}"/>
<circle cx="${s*.58}" cy="${s*.1}" r="${s*.013}" fill="#2255ff" stroke="#001188" stroke-width="${s*.003}"/>
<!-- 火焰眼 -->
<circle cx="${s*.45}" cy="${s*.2}" r="${s*.03}" fill="#ff6600" filter="url(#boss_glow)"/>
<circle cx="${s*.55}" cy="${s*.2}" r="${s*.03}" fill="#ff6600" filter="url(#boss_glow)"/>
<circle cx="${s*.45}" cy="${s*.2}" r="${s*.015}" fill="#ffee44"/>
<circle cx="${s*.55}" cy="${s*.2}" r="${s*.015}" fill="#ffee44"/>
<!-- 暗黑巨剑（左）-->
<rect x="${s*.12}" y="${s*.12}" width="${s*.025}" height="${s*.5}" fill="url(#boss_blade)" rx="${s*.005}" transform="rotate(20,${s*.13},${s*.37})"/>
<line x1="${s*.133}" y1="${s*.15}" x2="${s*.133}" y2="${s*.55}" stroke="rgba(255,60,0,0.4)" stroke-width="${s*.006}" transform="rotate(20,${s*.13},${s*.37})"/>
<!-- 剑柄 -->
<rect x="${s*.105}" y="${s*.58}" width="${s*.055}" height="${s*.025}" fill="#993300" rx="2" transform="rotate(20,${s*.13},${s*.59})"/>
<!-- 暗黑巨剑（右）-->
<rect x="${s*.86}" y="${s*.12}" width="${s*.025}" height="${s*.5}" fill="url(#boss_blade)" rx="${s*.005}" transform="rotate(-20,${s*.87},${s*.37})"/>
<line x1="${s*.873}" y1="${s*.15}" x2="${s*.873}" y2="${s*.55}" stroke="rgba(255,60,0,0.4)" stroke-width="${s*.006}" transform="rotate(-20,${s*.87},${s*.37})"/>
<rect x="${s*.845}" y="${s*.58}" width="${s*.055}" height="${s*.025}" fill="#993300" rx="2" transform="rotate(-20,${s*.87},${s*.59})"/>
<!-- 暗焰粒子 -->
<circle cx="${s*.2}" cy="${s*.25}" r="${s*.012}" fill="#ff6600" opacity="0.4" filter="url(#boss_glow)"/>
<circle cx="${s*.8}" cy="${s*.25}" r="${s*.012}" fill="#ff6600" opacity="0.4" filter="url(#boss_glow)"/>
<circle cx="${s*.15}" cy="${s*.6}" r="${s*.01}" fill="#ff4400" opacity="0.3"/>
<circle cx="${s*.85}" cy="${s*.6}" r="${s*.01}" fill="#ff4400" opacity="0.3"/>
</svg>`;
};

// ─── 英雄精灵 ───

// ─── 剑士 (Swordsman) ─── 蓝甲战士，带护盔和长剑
SVG_SPRITES.hero_swordsman = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hs_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#88d0f0"/><stop offset="50%" stop-color="#4098d8"/><stop offset="100%" stop-color="#1a5a80"/></radialGradient>
<linearGradient id="hs_blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f8ffff"/><stop offset="30%" stop-color="#d0e8f0"/><stop offset="70%" stop-color="#a8c8e0"/><stop offset="100%" stop-color="#88b0d0"/></linearGradient>
<linearGradient id="hs_armor" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#6cb8ee"/><stop offset="100%" stop-color="#2a6a9a"/></linearGradient>
<filter id="hs_glow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(20,60,100,0.25)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hs_body)"/>
<!-- 铠甲胸板 -->
<path d="M ${s*.35},${s*.44} Q ${s*.5},${s*.37} ${s*.65},${s*.44} L ${s*.62},${s*.7} Q ${s*.5},${s*.75} ${s*.38},${s*.7} Z" fill="url(#hs_armor)" stroke="#2a6496" stroke-width="${s*.006}"/>
<!-- 铠甲中线 -->
<line x1="${s*.5}" y1="${s*.4}" x2="${s*.5}" y2="${s*.72}" stroke="rgba(255,255,255,0.2)" stroke-width="${s*.005}"/>
<!-- 铠甲肩甲 -->
<ellipse cx="${s*.33}" cy="${s*.42}" rx="${s*.075}" ry="${s*.05}" fill="#4a90d9" stroke="#2a6496" stroke-width="${s*.007}"/>
<ellipse cx="${s*.67}" cy="${s*.42}" rx="${s*.075}" ry="${s*.05}" fill="#4a90d9" stroke="#2a6496" stroke-width="${s*.007}"/>
<!-- 头盔 -->
<path d="M ${s*.35},${s*.35} Q ${s*.35},${s*.18} ${s*.5},${s*.16} Q ${s*.65},${s*.18} ${s*.65},${s*.35}" fill="#3a7ab8" stroke="#2a5a8a" stroke-width="${s*.012}"/>
<!-- 头盔面罩 -->
<line x1="${s*.5}" y1="${s*.18}" x2="${s*.5}" y2="${s*.35}" stroke="#2a5a8a" stroke-width="${s*.008}"/>
<!-- 头盔顶饰 -->
<path d="M ${s*.47},${s*.16} Q ${s*.5},${s*.12} ${s*.53},${s*.16}" fill="#ffcc00"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.4}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.4}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.405}" r="${s*.018}" fill="#1a3a5c"/>
<circle cx="${s*.58}" cy="${s*.405}" r="${s*.018}" fill="#1a3a5c"/>
<circle cx="${s*.445}" cy="${s*.4}" r="${s*.006}" fill="#fff"/>
<circle cx="${s*.585}" cy="${s*.4}" r="${s*.006}" fill="#fff"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.5} Q ${s*.5},${s*.53} ${s*.55},${s*.5}" stroke="#1a5276" stroke-width="${s*.01}" fill="none" stroke-linecap="round"/>
<!-- 长剑 -->
<rect x="${s*.72}" y="${s*.1}" width="${s*.022}" height="${s*.48}" fill="url(#hs_blade)" rx="${s*.008}" transform="rotate(12,${s*.73},${s*.34})"/>
<!-- 剑刃光泽 -->
<line x1="${s*.73}" y1="${s*.13}" x2="${s*.73}" y2="${s*.53}" stroke="rgba(255,255,255,0.5)" stroke-width="${s*.006}" transform="rotate(12,${s*.73},${s*.34})" filter="url(#hs_glow)"/>
<!-- 护手 -->
<rect x="${s*.7}" y="${s*.56}" width="${s*.06}" height="${s*.02}" fill="#8B6914" rx="${s*.005}" transform="rotate(12,${s*.73},${s*.57})"/>
<!-- 剑柄 -->
<rect x="${s*.72}" y="${s*.57}" width="${s*.022}" height="${s*.1}" fill="#5c3d11" rx="${s*.005}" transform="rotate(12,${s*.73},${s*.62})"/>
<!-- 风斩特效 -->
<path d="M ${s*.62},${s*.18} Q ${s*.67},${s*.23} ${s*.64},${s*.3}" stroke="rgba(150,220,255,0.5)" stroke-width="${s*.01}" fill="none"/>
<path d="M ${s*.65},${s*.15} Q ${s*.7},${s*.2} ${s*.68},${s*.26}" stroke="rgba(150,220,255,0.35)" stroke-width="${s*.007}" fill="none"/>
<!-- 能量外环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(90,180,255,0.18)" stroke-width="${s*.008}" fill="none" stroke-dasharray="${s*.05} ${s*.04}"/>
</svg>`;
};

// ─── 法师 (Mage) ─── 红袍火法师，法杖火球
SVG_SPRITES.hero_mage = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hm_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#ff9966"/><stop offset="50%" stop-color="#e84530"/><stop offset="100%" stop-color="#8b1a1a"/></radialGradient>
<radialGradient id="hm_fire" cx="50%" cy="80%" r="60%"><stop offset="0%" stop-color="#fff4b0"/><stop offset="40%" stop-color="#ffaa00"/><stop offset="80%" stop-color="#ff4400"/><stop offset="100%" stop-color="#aa0000"/></radialGradient>
<linearGradient id="hm_staff" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B4513"/><stop offset="100%" stop-color="#5c2d0e"/></linearGradient>
<filter id="hm_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(100,20,0,0.25)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hm_body)"/>
<!-- 法袍 -->
<path d="M ${s*.32},${s*.48} Q ${s*.5},${s*.42} ${s*.68},${s*.48} L ${s*.65},${s*.8} Q ${s*.5},${s*.85} ${s*.35},${s*.8} Z" fill="rgba(120,20,30,0.6)" stroke="#6b0f1a" stroke-width="${s*.006}"/>
<!-- 法袍花纹 -->
<path d="M ${s*.4},${s*.54} Q ${s*.5},${s*.5} ${s*.6},${s*.54}" stroke="rgba(255,200,100,0.4)" stroke-width="${s*.007}" fill="none"/>
<path d="M ${s*.42},${s*.62} Q ${s*.5},${s*.58} ${s*.58},${s*.62}" stroke="rgba(255,200,100,0.3)" stroke-width="${s*.005}" fill="none"/>
<!-- 法师帽 -->
<path d="M ${s*.35},${s*.35} L ${s*.5},${s*.08} L ${s*.65},${s*.35}" fill="#7b1818" stroke="#4a0e0e" stroke-width="${s*.008}"/>
<path d="M ${s*.33},${s*.35} Q ${s*.5},${s*.38} ${s*.67},${s*.35}" fill="#9b2020" stroke="#4a0e0e" stroke-width="${s*.005}"/>
<!-- 帽带 -->
<path d="M ${s*.37},${s*.35} Q ${s*.5},${s*.37} ${s*.63},${s*.35}" fill="#ffcc00" opacity="0.6"/>
<!-- 帽尖星 -->
<circle cx="${s*.5}" cy="${s*.1}" r="${s*.018}" fill="#ffdd44" filter="url(#hm_glow)"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.42}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.42}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.425}" r="${s*.018}" fill="#ff4400"/>
<circle cx="${s*.58}" cy="${s*.425}" r="${s*.018}" fill="#ff4400"/>
<circle cx="${s*.44}" cy="${s*.42}" r="${s*.007}" fill="#ffcc00"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.007}" fill="#ffcc00"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.52} Q ${s*.5},${s*.55} ${s*.55},${s*.52}" stroke="#5c1010" stroke-width="${s*.01}" fill="none" stroke-linecap="round"/>
<!-- 法杖 -->
<rect x="${s*.74}" y="${s*.2}" width="${s*.02}" height="${s*.52}" fill="url(#hm_staff)" rx="${s*.01}"/>
<!-- 法杖顶部宝珠 -->
<circle cx="${s*.75}" cy="${s*.17}" r="${s*.04}" fill="url(#hm_fire)" filter="url(#hm_glow)"/>
<circle cx="${s*.75}" cy="${s*.17}" r="${s*.018}" fill="#fff4b0" opacity="0.8"/>
<!-- 火焰粒子 -->
<ellipse cx="${s*.24}" cy="${s*.3}" rx="${s*.025}" ry="${s*.035}" fill="url(#hm_fire)" opacity="0.65" filter="url(#hm_glow)"/>
<ellipse cx="${s*.2}" cy="${s*.55}" rx="${s*.02}" ry="${s*.03}" fill="url(#hm_fire)" opacity="0.45" filter="url(#hm_glow)"/>
<ellipse cx="${s*.78}" cy="${s*.6}" rx="${s*.018}" ry="${s*.025}" fill="url(#hm_fire)" opacity="0.5" filter="url(#hm_glow)"/>
<!-- 魔法环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(255,100,0,0.2)" stroke-width="${s*.01}" fill="none" stroke-dasharray="${s*.04} ${s*.03}"/>
</svg>`;
};

// ─── 刺客 (Assassin) ─── 紫色兜帽，双匕首
SVG_SPRITES.hero_assassin = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="ha_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#c088ff"/><stop offset="50%" stop-color="#8030d0"/><stop offset="100%" stop-color="#3a1166"/></radialGradient>
<linearGradient id="ha_dagger" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f0f0f0"/><stop offset="50%" stop-color="#c0c0c0"/><stop offset="100%" stop-color="#888"/></linearGradient>
<filter id="ha_shadow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(60,10,100,0.28)"/>
<!-- 暗影飘带 -->
<path d="M ${s*.25},${s*.6} Q ${s*.2},${s*.7} ${s*.15},${s*.8}" stroke="rgba(160,80,255,0.3)" stroke-width="${s*.012}" fill="none"/>
<path d="M ${s*.75},${s*.6} Q ${s*.8},${s*.7} ${s*.85},${s*.8}" stroke="rgba(160,80,255,0.3)" stroke-width="${s*.012}" fill="none"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#ha_body)"/>
<!-- 兜帽 -->
<path d="M ${s*.3},${s*.42} Q ${s*.3},${s*.15} ${s*.5},${s*.12} Q ${s*.7},${s*.15} ${s*.7},${s*.42}" fill="#2a0845" stroke="#1a0530" stroke-width="${s*.008}"/>
<path d="M ${s*.3},${s*.42} Q ${s*.5},${s*.48} ${s*.7},${s*.42}" fill="#3a1060"/>
<!-- 面罩 -->
<path d="M ${s*.35},${s*.48} L ${s*.65},${s*.48} L ${s*.62},${s*.57} Q ${s*.5},${s*.6} ${s*.38},${s*.57} Z" fill="#1a0530" opacity="0.7"/>
<!-- 眼睛 -->
<path d="M ${s*.38},${s*.42} L ${s*.43},${s*.4} L ${s*.48},${s*.42} L ${s*.43},${s*.44} Z" fill="#fff"/>
<path d="M ${s*.52},${s*.42} L ${s*.57},${s*.4} L ${s*.62},${s*.42} L ${s*.57},${s*.44} Z" fill="#fff"/>
<circle cx="${s*.43}" cy="${s*.42}" r="${s*.013}" fill="#9900ff"/>
<circle cx="${s*.57}" cy="${s*.42}" r="${s*.013}" fill="#9900ff"/>
<!-- 左匕首 -->
<polygon points="${s*.2},${s*.33} ${s*.22},${s*.3} ${s*.24},${s*.53} ${s*.22},${s*.54}" fill="url(#ha_dagger)"/>
<line x1="${s*.22}" y1="${s*.32}" x2="${s*.22}" y2="${s*.52}" stroke="rgba(255,255,255,0.3)" stroke-width="${s*.004}"/>
<rect x="${s*.195}" y="${s*.53}" width="${s*.05}" height="${s*.018}" fill="#4a2080" rx="${s*.004}"/>
<rect x="${s*.205}" y="${s*.545}" width="${s*.03}" height="${s*.055}" fill="#2a0845" rx="${s*.004}"/>
<!-- 右匕首 -->
<polygon points="${s*.76},${s*.33} ${s*.78},${s*.3} ${s*.8},${s*.53} ${s*.78},${s*.54}" fill="url(#ha_dagger)"/>
<line x1="${s*.78}" y1="${s*.32}" x2="${s*.78}" y2="${s*.52}" stroke="rgba(255,255,255,0.3)" stroke-width="${s*.004}"/>
<rect x="${s*.755}" y="${s*.53}" width="${s*.05}" height="${s*.018}" fill="#4a2080" rx="${s*.004}"/>
<rect x="${s*.765}" y="${s*.545}" width="${s*.03}" height="${s*.055}" fill="#2a0845" rx="${s*.004}"/>
<!-- 毒雾粒子 -->
<circle cx="${s*.2}" cy="${s*.26}" r="${s*.012}" fill="#aa66ff" opacity="0.4"/>
<circle cx="${s*.8}" cy="${s*.26}" r="${s*.01}" fill="#aa66ff" opacity="0.35"/>
<circle cx="${s*.15}" cy="${s*.5}" r="${s*.008}" fill="#cc88ff" opacity="0.3"/>
<!-- 暗影环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(150,50,255,0.18)" stroke-width="${s*.008}" fill="none" stroke-dasharray="${s*.03} ${s*.05}"/>
</svg>`;
};

// ─── 圣骑士 (Paladin) ─── 金甲圣骑士，盾+圣光
SVG_SPRITES.hero_paladin = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hp_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#fff4c0"/><stop offset="50%" stop-color="#ffc832"/><stop offset="100%" stop-color="#b8860b"/></radialGradient>
<linearGradient id="hp_shield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd700"/><stop offset="50%" stop-color="#daa520"/><stop offset="100%" stop-color="#b8860b"/></linearGradient>
<linearGradient id="hp_armor" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff8dc"/><stop offset="100%" stop-color="#daa520"/></linearGradient>
<filter id="hp_holy"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 圣光底部光环 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.3}" ry="${s*.045}" fill="rgba(255,215,0,0.25)" filter="url(#hp_holy)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hp_body)"/>
<!-- 圣骑士重甲 -->
<path d="M ${s*.33},${s*.4} Q ${s*.5},${s*.33} ${s*.67},${s*.4} L ${s*.65},${s*.72} Q ${s*.5},${s*.78} ${s*.35},${s*.72} Z" fill="url(#hp_armor)" stroke="#b8860b" stroke-width="${s*.007}"/>
<!-- 甲胸十字 -->
<rect x="${s*.48}" y="${s*.42}" width="${s*.04}" height="${s*.2}" fill="#b8860b" rx="${s*.005}"/>
<rect x="${s*.4}" y="${s*.49}" width="${s*.2}" height="${s*.04}" fill="#b8860b" rx="${s*.005}"/>
<!-- 肩甲 -->
<ellipse cx="${s*.32}" cy="${s*.4}" rx="${s*.065}" ry="${s*.045}" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.005}"/>
<ellipse cx="${s*.68}" cy="${s*.4}" rx="${s*.065}" ry="${s*.045}" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.005}"/>
<!-- 头冠 -->
<path d="M ${s*.37},${s*.3} L ${s*.4},${s*.2} L ${s*.45},${s*.27} L ${s*.5},${s*.17} L ${s*.55},${s*.27} L ${s*.6},${s*.2} L ${s*.63},${s*.3}" fill="#ffd700" stroke="#b8860b" stroke-width="${s*.005}"/>
<!-- 头冠宝石 -->
<circle cx="${s*.5}" cy="${s*.22}" r="${s*.013}" fill="#ff4444"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.38}" rx="${s*.032}" ry="${s*.028}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.38}" rx="${s*.032}" ry="${s*.028}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.385}" r="${s*.015}" fill="#4a90d9"/>
<circle cx="${s*.58}" cy="${s*.385}" r="${s*.015}" fill="#4a90d9"/>
<circle cx="${s*.445}" cy="${s*.38}" r="${s*.005}" fill="#fff"/>
<circle cx="${s*.585}" cy="${s*.38}" r="${s*.005}" fill="#fff"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.46} Q ${s*.5},${s*.49} ${s*.55},${s*.46}" stroke="#8b6914" stroke-width="${s*.01}" fill="none" stroke-linecap="round"/>
<!-- 盾牌 -->
<path d="M ${s*.12},${s*.35} L ${s*.28},${s*.32} L ${s*.28},${s*.6} Q ${s*.2},${s*.65} ${s*.12},${s*.55} Z" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.008}"/>
<!-- 盾牌十字 -->
<rect x="${s*.18}" y="${s*.38}" width="${s*.022}" height="${s*.16}" fill="#fff" opacity="0.6" rx="${s*.004}"/>
<rect x="${s*.14}" y="${s*.44}" width="${s*.1}" height="${s*.022}" fill="#fff" opacity="0.6" rx="${s*.004}"/>
<!-- 圣光光芒 -->
<line x1="${s*.5}" y1="${s*.05}" x2="${s*.5}" y2="${s*.12}" stroke="rgba(255,215,0,0.5)" stroke-width="${s*.008}" filter="url(#hp_holy)"/>
<line x1="${s*.3}" y1="${s*.1}" x2="${s*.36}" y2="${s*.16}" stroke="rgba(255,215,0,0.35)" stroke-width="${s*.006}" filter="url(#hp_holy)"/>
<line x1="${s*.7}" y1="${s*.1}" x2="${s*.64}" y2="${s*.16}" stroke="rgba(255,215,0,0.35)" stroke-width="${s*.006}" filter="url(#hp_holy)"/>
<!-- 神圣外环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.39}" stroke="rgba(255,215,0,0.2)" stroke-width="${s*.012}" fill="none"/>
</svg>`;
};

// ─── 弓箭手 (Archer) ─── 绿色游侠，弓+箭壶
SVG_SPRITES.hero_archer = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="har_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#90eec0"/><stop offset="50%" stop-color="#3dbd7d"/><stop offset="100%" stop-color="#1a6b42"/></radialGradient>
<linearGradient id="har_bow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B6914"/><stop offset="50%" stop-color="#6b4e12"/><stop offset="100%" stop-color="#4a350d"/></linearGradient>
<linearGradient id="har_arrow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ddd"/><stop offset="100%" stop-color="#888"/></linearGradient>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(20,80,50,0.22)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#har_body)"/>
<!-- 游侠斗篷 -->
<path d="M ${s*.3},${s*.38} Q ${s*.25},${s*.5} ${s*.2},${s*.75}" stroke="#2d5a3d" stroke-width="${s*.018}" fill="none"/>
<path d="M ${s*.7},${s*.38} Q ${s*.75},${s*.5} ${s*.8},${s*.75}" stroke="#2d5a3d" stroke-width="${s*.018}" fill="none"/>
<path d="M ${s*.3},${s*.38} Q ${s*.5},${s*.42} ${s*.7},${s*.38}" fill="#2d5a3d" opacity="0.5"/>
<!-- 皮甲 -->
<path d="M ${s*.38},${s*.45} Q ${s*.5},${s*.42} ${s*.62},${s*.45} L ${s*.6},${s*.68} Q ${s*.5},${s*.72} ${s*.4},${s*.68} Z" fill="#5c3d11" opacity="0.6" stroke="#3a2508" stroke-width="${s*.005}"/>
<!-- 兜帽 -->
<path d="M ${s*.33},${s*.38} Q ${s*.33},${s*.2} ${s*.5},${s*.16} Q ${s*.67},${s*.2} ${s*.67},${s*.38}" fill="#2d5a3d" stroke="#1a3a25" stroke-width="${s*.007}"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.4}" rx="${s*.035}" ry="${s*.028}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.4}" rx="${s*.035}" ry="${s*.028}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.405}" r="${s*.015}" fill="#2d8b57"/>
<circle cx="${s*.58}" cy="${s*.405}" r="${s*.015}" fill="#2d8b57"/>
<circle cx="${s*.445}" cy="${s*.4}" r="${s*.005}" fill="#fff"/>
<circle cx="${s*.585}" cy="${s*.4}" r="${s*.005}" fill="#fff"/>
<!-- 微笑 -->
<path d="M ${s*.45},${s*.49} Q ${s*.5},${s*.52} ${s*.55},${s*.49}" stroke="#1a4030" stroke-width="${s*.009}" fill="none" stroke-linecap="round"/>
<!-- 弓 -->
<path d="M ${s*.76},${s*.2} Q ${s*.68},${s*.45} ${s*.76},${s*.7}" stroke="url(#har_bow)" stroke-width="${s*.022}" fill="none" stroke-linecap="round"/>
<!-- 弓弦 -->
<line x1="${s*.76}" y1="${s*.2}" x2="${s*.76}" y2="${s*.7}" stroke="#ccc" stroke-width="${s*.005}"/>
<!-- 箭矢 -->
<line x1="${s*.68}" y1="${s*.45}" x2="${s*.84}" y2="${s*.45}" stroke="url(#har_arrow)" stroke-width="${s*.01}"/>
<polygon points="${s*.84},${s*.435} ${s*.88},${s*.45} ${s*.84},${s*.465}" fill="#aaa"/>
<!-- 箭壶 -->
<rect x="${s*.26}" y="${s*.45}" width="${s*.055}" height="${s*.2}" fill="#5c3d11" rx="${s*.008}" stroke="#3a2508" stroke-width="${s*.004}"/>
<line x1="${s*.27}" y1="${s*.43}" x2="${s*.27}" y2="${s*.45}" stroke="#888" stroke-width="${s*.005}"/>
<line x1="${s*.29}" y1="${s*.42}" x2="${s*.29}" y2="${s*.45}" stroke="#888" stroke-width="${s*.005}"/>
<line x1="${s*.31}" y1="${s*.43}" x2="${s*.31}" y2="${s*.45}" stroke="#888" stroke-width="${s*.005}"/>
<!-- 叶子装饰 -->
<ellipse cx="${s*.22}" cy="${s*.3}" rx="${s*.012}" ry="${s*.022}" fill="rgba(100,200,100,0.45)" transform="rotate(-20,${s*.22},${s*.3})"/>
<ellipse cx="${s*.8}" cy="${s*.75}" rx="${s*.01}" ry="${s*.018}" fill="rgba(100,200,100,0.35)" transform="rotate(15,${s*.8},${s*.75})"/>
<!-- 自然环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(50,180,100,0.18)" stroke-width="${s*.008}" fill="none" stroke-dasharray="${s*.035} ${s*.045}"/>
</svg>`;
};

// ─── 死灵法师 (Necromancer) ─── 暗绿长袍，骷髅法杖，幽灵球
SVG_SPRITES.hero_necromancer = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hn_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#6bccb0"/><stop offset="50%" stop-color="#2a9a7a"/><stop offset="100%" stop-color="#0d4a3a"/></radialGradient>
<radialGradient id="hn_orb" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#aaffee"/><stop offset="60%" stop-color="#44ddbb"/><stop offset="100%" stop-color="#009977"/></radialGradient>
<linearGradient id="hn_staff" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="100%" stop-color="#1a1a1a"/></linearGradient>
<filter id="hn_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(0,80,60,0.28)"/>
<!-- 灵魂飘带 -->
<path d="M ${s*.3},${s*.7} Q ${s*.2},${s*.8} ${s*.15},${s*.88}" stroke="rgba(100,255,200,0.25)" stroke-width="${s*.01}" fill="none"/>
<path d="M ${s*.7},${s*.7} Q ${s*.8},${s*.8} ${s*.85},${s*.88}" stroke="rgba(100,255,200,0.25)" stroke-width="${s*.01}" fill="none"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hn_body)"/>
<!-- 死灵法袍 -->
<path d="M ${s*.32},${s*.48} Q ${s*.5},${s*.4} ${s*.68},${s*.48} L ${s*.66},${s*.82} Q ${s*.5},${s*.88} ${s*.34},${s*.82} Z" fill="#0d2a22" stroke="#092018" stroke-width="${s*.005}"/>
<!-- 法袍骨纹 -->
<path d="M ${s*.43},${s*.55} L ${s*.43},${s*.7}" stroke="rgba(200,255,230,0.25)" stroke-width="${s*.004}"/>
<path d="M ${s*.57},${s*.55} L ${s*.57},${s*.7}" stroke="rgba(200,255,230,0.25)" stroke-width="${s*.004}"/>
<path d="M ${s*.4},${s*.6} L ${s*.6},${s*.6}" stroke="rgba(200,255,230,0.18)" stroke-width="${s*.004}"/>
<!-- 兜帽 -->
<path d="M ${s*.3},${s*.4} Q ${s*.3},${s*.15} ${s*.5},${s*.08} Q ${s*.7},${s*.15} ${s*.7},${s*.4}" fill="#0d2a22" stroke="#061510" stroke-width="${s*.008}"/>
<!-- 兜帽阴影 -->
<path d="M ${s*.33},${s*.4} Q ${s*.5},${s*.46} ${s*.67},${s*.4}" fill="#061510"/>
<!-- 眼睛 - 幽绿 -->
<ellipse cx="${s*.43}" cy="${s*.38}" rx="${s*.032}" ry="${s*.028}" fill="#00ff88" filter="url(#hn_glow)" opacity="0.9"/>
<ellipse cx="${s*.57}" cy="${s*.38}" rx="${s*.032}" ry="${s*.028}" fill="#00ff88" filter="url(#hn_glow)" opacity="0.9"/>
<circle cx="${s*.43}" cy="${s*.38}" r="${s*.01}" fill="#fff"/>
<circle cx="${s*.57}" cy="${s*.38}" r="${s*.01}" fill="#fff"/>
<!-- 骷髅法杖 -->
<rect x="${s*.73}" y="${s*.2}" width="${s*.018}" height="${s*.52}" fill="url(#hn_staff)" rx="${s*.009}"/>
<!-- 法杖骷髅头 -->
<circle cx="${s*.74}" cy="${s*.17}" r="${s*.032}" fill="#e8e0d0" stroke="#8a7a6a" stroke-width="${s*.004}"/>
<circle cx="${s*.725}" cy="${s*.16}" r="${s*.009}" fill="#1a1a1a"/>
<circle cx="${s*.755}" cy="${s*.16}" r="${s*.009}" fill="#1a1a1a"/>
<path d="M ${s*.73},${s*.185} L ${s*.75},${s*.185}" stroke="#1a1a1a" stroke-width="${s*.004}"/>
<!-- 幽灵球 -->
<circle cx="${s*.2}" cy="${s*.35}" r="${s*.03}" fill="url(#hn_orb)" opacity="0.65" filter="url(#hn_glow)"/>
<circle cx="${s*.82}" cy="${s*.55}" r="${s*.025}" fill="url(#hn_orb)" opacity="0.55" filter="url(#hn_glow)"/>
<circle cx="${s*.25}" cy="${s*.7}" r="${s*.02}" fill="url(#hn_orb)" opacity="0.45" filter="url(#hn_glow)"/>
<!-- 灵魂碎片 -->
<path d="M ${s*.18},${s*.5} Q ${s*.15},${s*.45} ${s*.18},${s*.42}" stroke="rgba(100,255,200,0.35)" stroke-width="${s*.006}" fill="none"/>
<path d="M ${s*.83},${s*.4} Q ${s*.86},${s*.37} ${s*.83},${s*.34}" stroke="rgba(100,255,200,0.3)" stroke-width="${s*.005}" fill="none"/>
<!-- 死亡之环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.39}" stroke="rgba(0,255,150,0.13)" stroke-width="${s*.01}" fill="none" stroke-dasharray="${s*.02} ${s*.035} ${s*.05} ${s*.035}"/>
</svg>`;
};

// ============================================
// SVG Image 预加载器
// ============================================
class SvgSpriteLoader {
    constructor() {
        this.images = {};
        this.heroImages = {};
        this.ready = false;
    }

    loadAll() {
        var self = this;
        var enemyTypes = ['slime', 'bat', 'skeleton', 'shadowWolf', 'skeletonMage', 'gargoyle', 'demonCaster', 'exploder', 'eliteSkeleton', 'eliteDemon', 'boss'];
        var heroTypes = ['swordsman', 'mage', 'assassin', 'paladin', 'archer', 'necromancer'];
        var totalToLoad = enemyTypes.length + heroTypes.length;
        var loaded = 0;

        function onLoad() {
            loaded++;
            if (loaded >= totalToLoad) {
                self.ready = true;
            }
        }

        // 加载怪物精灵
        for (var i = 0; i < enemyTypes.length; i++) {
            var type = enemyTypes[i];
            var svgFn = SVG_SPRITES[type];
            if (svgFn) {
                var def = (typeof EnemyTypes !== 'undefined') ? EnemyTypes[type] : null;
                var size = def ? Math.ceil(def.radius * 4.5) * 2 : 128;
                var svgStr = svgFn(size);
                var img = new Image();
                img.onload = onLoad;
                img.onerror = onLoad; // 即使出错也继续
                img.src = svgToDataUri(svgStr);
                this.images[type] = { img: img, size: size };
            } else {
                onLoad();
            }
        }

        // 加载英雄精灵
        for (var j = 0; j < heroTypes.length; j++) {
            var hType = heroTypes[j];
            var heroFn = SVG_SPRITES['hero_' + hType];
            if (heroFn) {
                var heroSize = 80; // 英雄用 80px
                var heroSvg = heroFn(heroSize);
                var heroImg = new Image();
                heroImg.onload = onLoad;
                heroImg.onerror = onLoad;
                heroImg.src = svgToDataUri(heroSvg);
                this.heroImages[hType] = { img: heroImg, size: heroSize };
            } else {
                onLoad();
            }
        }
    }

    getEnemyImage(type) {
        var entry = this.images[type];
        if (entry && entry.img.complete && entry.img.naturalWidth > 0) {
            return entry;
        }
        return null;
    }

    getHeroImage(heroId) {
        var entry = this.heroImages[heroId];
        if (entry && entry.img.complete && entry.img.naturalWidth > 0) {
            return entry;
        }
        return null;
    }
}

// 全局实例
var svgSpriteLoader = null;
