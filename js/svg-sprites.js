// ============================================
// SVG 精灵系统 - 高质量矢量图替代程序化绘制
// ============================================
// 所有 SVG 以 data URI 形式内嵌，运行时转为 Image 对象

const SVG_SPRITES = {};

function svgToDataUri(svgString) {
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
}

// ─── 史莱姆 (Slime) ───
SVG_SPRITES.slime = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="sb" cx="35%" cy="30%" r="65%"><stop offset="0%" stop-color="#aaffcc"/><stop offset="30%" stop-color="#44dd66"/><stop offset="70%" stop-color="#228844"/><stop offset="100%" stop-color="#115522"/></radialGradient>
<radialGradient id="sh" cx="30%" cy="25%" r="40%"><stop offset="0%" stop-color="rgba(255,255,255,0.7)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
</defs>
<ellipse cx="${s/2}" cy="${s*.88}" rx="${s*.32}" ry="${s*.06}" fill="rgba(0,0,0,0.3)"/>
<path d="M ${s*.15},${s*.65} Q ${s*.08},${s*.35} ${s*.25},${s*.2} Q ${s*.4},${s*.08} ${s*.5},${s*.1} Q ${s*.6},${s*.08} ${s*.75},${s*.2} Q ${s*.92},${s*.35} ${s*.85},${s*.65} Q ${s*.82},${s*.82} ${s*.65},${s*.85} Q ${s*.5},${s*.88} ${s*.35},${s*.85} Q ${s*.18},${s*.82} ${s*.15},${s*.65} Z" fill="url(#sb)"/>
<circle cx="${s*.38}" cy="${s*.55}" r="${s*.04}" fill="rgba(170,255,200,0.35)"/>
<circle cx="${s*.6}" cy="${s*.6}" r="${s*.035}" fill="rgba(170,255,200,0.3)"/>
<circle cx="${s*.45}" cy="${s*.7}" r="${s*.025}" fill="rgba(200,255,220,0.25)"/>
<ellipse cx="${s*.38}" cy="${s*.28}" rx="${s*.12}" ry="${s*.08}" fill="url(#sh)"/>
<ellipse cx="${s*.32}" cy="${s*.22}" rx="${s*.06}" ry="${s*.04}" fill="rgba(255,255,255,0.6)"/>
<ellipse cx="${s*.38}" cy="${s*.4}" rx="${s*.09}" ry="${s*.1}" fill="#fff"/>
<ellipse cx="${s*.62}" cy="${s*.4}" rx="${s*.09}" ry="${s*.1}" fill="#fff"/>
<circle cx="${s*.36}" cy="${s*.42}" r="${s*.05}" fill="#116622"/>
<circle cx="${s*.64}" cy="${s*.42}" r="${s*.05}" fill="#116622"/>
<circle cx="${s*.35}" cy="${s*.41}" r="${s*.025}" fill="#001100"/>
<circle cx="${s*.63}" cy="${s*.41}" r="${s*.025}" fill="#001100"/>
<circle cx="${s*.34}" cy="${s*.37}" r="${s*.02}" fill="rgba(255,255,255,0.8)"/>
<circle cx="${s*.62}" cy="${s*.37}" r="${s*.02}" fill="rgba(255,255,255,0.8)"/>
<path d="M ${s*.4},${s*.58} Q ${s*.5},${s*.65} ${s*.6},${s*.58}" stroke="#115522" stroke-width="${s*.018}" fill="none" stroke-linecap="round"/>
</svg>`;
};

// ─── 蝙蝠 (Bat) ───
SVG_SPRITES.bat = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="bb" cx="40%" cy="35%" r="55%"><stop offset="0%" stop-color="#dd99ff"/><stop offset="50%" stop-color="#9966dd"/><stop offset="100%" stop-color="#5533aa"/></radialGradient>
<linearGradient id="bwl" x1="0%" y1="0%" x2="100%"><stop offset="0%" stop-color="#5533aa"/><stop offset="100%" stop-color="#9966dd"/></linearGradient>
<linearGradient id="bwr" x1="0%" y1="0%" x2="100%"><stop offset="0%" stop-color="#9966dd"/><stop offset="100%" stop-color="#5533aa"/></linearGradient>
</defs>
<path d="M ${s*.35},${s*.42} Q ${s*.15},${s*.2} ${s*.05},${s*.35} L ${s*.12},${s*.55} L ${s*.22},${s*.6} Q ${s*.28},${s*.55} ${s*.35},${s*.5} Z" fill="url(#bwl)" opacity="0.85"/>
<path d="M ${s*.65},${s*.42} Q ${s*.85},${s*.2} ${s*.95},${s*.35} L ${s*.88},${s*.55} L ${s*.78},${s*.6} Q ${s*.72},${s*.55} ${s*.65},${s*.5} Z" fill="url(#bwr)" opacity="0.85"/>
<line x1="${s*.35}" y1="${s*.45}" x2="${s*.05}" y2="${s*.35}" stroke="#4a2266" stroke-width="${s*.02}" stroke-linecap="round"/>
<line x1="${s*.35}" y1="${s*.48}" x2="${s*.12}" y2="${s*.55}" stroke="#4a2266" stroke-width="${s*.015}"/>
<line x1="${s*.65}" y1="${s*.45}" x2="${s*.95}" y2="${s*.35}" stroke="#4a2266" stroke-width="${s*.02}" stroke-linecap="round"/>
<line x1="${s*.65}" y1="${s*.48}" x2="${s*.88}" y2="${s*.55}" stroke="#4a2266" stroke-width="${s*.015}"/>
<ellipse cx="${s*.5}" cy="${s*.5}" rx="${s*.2}" ry="${s*.25}" fill="url(#bb)"/>
<polygon points="${s*.38},${s*.3} ${s*.42},${s*.12} ${s*.46},${s*.3}" fill="#5a2277"/>
<polygon points="${s*.54},${s*.3} ${s*.58},${s*.12} ${s*.62},${s*.3}" fill="#5a2277"/>
<polygon points="${s*.39},${s*.32} ${s*.42},${s*.17} ${s*.45},${s*.32}" fill="rgba(220,100,200,0.4)"/>
<polygon points="${s*.55},${s*.32} ${s*.58},${s*.17} ${s*.61},${s*.32}" fill="rgba(220,100,200,0.4)"/>
<ellipse cx="${s*.43}" cy="${s*.45}" rx="${s*.05}" ry="${s*.035}" fill="#ffdd22"/>
<ellipse cx="${s*.57}" cy="${s*.45}" rx="${s*.05}" ry="${s*.035}" fill="#ffdd22"/>
<ellipse cx="${s*.43}" cy="${s*.45}" rx="${s*.015}" ry="${s*.03}" fill="#110800"/>
<ellipse cx="${s*.57}" cy="${s*.45}" rx="${s*.015}" ry="${s*.03}" fill="#110800"/>
<polygon points="${s*.45},${s*.58} ${s*.47},${s*.67} ${s*.49},${s*.58}" fill="#eee"/>
<polygon points="${s*.51},${s*.58} ${s*.53},${s*.67} ${s*.55},${s*.58}" fill="#eee"/>
</svg>`;
};

// ─── 骷髅 (Skeleton) ───
SVG_SPRITES.skeleton = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="skg" cx="40%" cy="35%" r="55%"><stop offset="0%" stop-color="#fffff8"/><stop offset="50%" stop-color="#e8e8d0"/><stop offset="80%" stop-color="#d8f0c0"/><stop offset="100%" stop-color="#a0d888"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.9}" rx="${s*.25}" ry="${s*.05}" fill="rgba(0,0,0,0.3)"/>
<line x1="${s*.5}" y1="${s*.45}" x2="${s*.5}" y2="${s*.82}" stroke="#d0e8c0" stroke-width="${s*.03}" stroke-linecap="round"/>
<path d="M ${s*.35},${s*.5} Q ${s*.5},${s*.53} ${s*.65},${s*.5}" stroke="#e8ffd8" stroke-width="${s*.018}" fill="none"/>
<path d="M ${s*.36},${s*.56} Q ${s*.5},${s*.59} ${s*.64},${s*.56}" stroke="#e8ffd8" stroke-width="${s*.018}" fill="none"/>
<path d="M ${s*.37},${s*.62} Q ${s*.5},${s*.65} ${s*.63},${s*.62}" stroke="#e8ffd8" stroke-width="${s*.018}" fill="none"/>
<path d="M ${s*.38},${s*.68} Q ${s*.5},${s*.71} ${s*.62},${s*.68}" stroke="#e8ffd8" stroke-width="${s*.018}" fill="none"/>
<circle cx="${s*.5}" cy="${s*.28}" r="${s*.2}" fill="url(#skg)"/>
<ellipse cx="${s*.42}" cy="${s*.27}" rx="${s*.055}" ry="${s*.065}" fill="#1a2a1a"/>
<ellipse cx="${s*.58}" cy="${s*.27}" rx="${s*.055}" ry="${s*.065}" fill="#1a2a1a"/>
<circle cx="${s*.42}" cy="${s*.27}" r="${s*.025}" fill="#ff3300"/>
<circle cx="${s*.58}" cy="${s*.27}" r="${s*.025}" fill="#ff3300"/>
<polygon points="${s*.47},${s*.33} ${s*.53},${s*.33} ${s*.5},${s*.38}" fill="#3a4a3a"/>
<rect x="${s*.4}" y="${s*.39}" width="${s*.04}" height="${s*.04}" fill="#fffff0" rx="1"/>
<rect x="${s*.45}" y="${s*.39}" width="${s*.04}" height="${s*.04}" fill="#fffff0" rx="1"/>
<rect x="${s*.5}" y="${s*.39}" width="${s*.04}" height="${s*.04}" fill="#fffff0" rx="1"/>
<rect x="${s*.55}" y="${s*.39}" width="${s*.04}" height="${s*.04}" fill="#fffff0" rx="1"/>
<rect x="${s*.72}" y="${s*.4}" width="${s*.025}" height="${s*.3}" fill="#aabbaa" rx="2" transform="rotate(-15,${s*.73},${s*.55})"/>
<rect x="${s*.7}" y="${s*.67}" width="${s*.06}" height="${s*.045}" fill="#887766" rx="2" transform="rotate(-15,${s*.73},${s*.69})"/>
</svg>`;
};

// ─── 暗影狼 (Shadow Wolf) ───
SVG_SPRITES.shadowWolf = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="wb" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#99bbff"/><stop offset="40%" stop-color="#5588dd"/><stop offset="80%" stop-color="#3366bb"/><stop offset="100%" stop-color="#224499"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.88}" rx="${s*.35}" ry="${s*.05}" fill="rgba(0,0,0,0.3)"/>
<path d="M ${s*.75},${s*.45} Q ${s*.9},${s*.35} ${s*.88},${s*.25}" stroke="#4477bb" stroke-width="${s*.06}" fill="none" stroke-linecap="round"/>
<ellipse cx="${s*.5}" cy="${s*.55}" rx="${s*.35}" ry="${s*.2}" fill="url(#wb)"/>
<ellipse cx="${s*.25}" cy="${s*.48}" rx="${s*.16}" ry="${s*.13}" fill="url(#wb)"/>
<ellipse cx="${s*.14}" cy="${s*.52}" rx="${s*.08}" ry="${s*.05}" fill="#4466aa"/>
<polygon points="${s*.22},${s*.35} ${s*.18},${s*.18} ${s*.28},${s*.33}" fill="#334488"/>
<polygon points="${s*.32},${s*.34} ${s*.34},${s*.18} ${s*.38},${s*.35}" fill="#334488"/>
<ellipse cx="${s*.22}" cy="${s*.44}" rx="${s*.04}" ry="${s*.025}" fill="#ffee22"/>
<ellipse cx="${s*.3}" cy="${s*.44}" rx="${s*.04}" ry="${s*.025}" fill="#ffee22"/>
<ellipse cx="${s*.22}" cy="${s*.44}" rx="${s*.012}" ry="${s*.022}" fill="#110800"/>
<ellipse cx="${s*.3}" cy="${s*.44}" rx="${s*.012}" ry="${s*.022}" fill="#110800"/>
<polygon points="${s*.12},${s*.55} ${s*.13},${s*.63} ${s*.15},${s*.55}" fill="#ddd"/>
<polygon points="${s*.17},${s*.56} ${s*.18},${s*.63} ${s*.2},${s*.56}" fill="#ddd"/>
<line x1="${s*.32}" y1="${s*.7}" x2="${s*.3}" y2="${s*.85}" stroke="#223388" stroke-width="${s*.035}" stroke-linecap="round"/>
<line x1="${s*.42}" y1="${s*.7}" x2="${s*.44}" y2="${s*.85}" stroke="#223388" stroke-width="${s*.035}" stroke-linecap="round"/>
<line x1="${s*.58}" y1="${s*.7}" x2="${s*.56}" y2="${s*.85}" stroke="#223388" stroke-width="${s*.035}" stroke-linecap="round"/>
<line x1="${s*.68}" y1="${s*.7}" x2="${s*.7}" y2="${s*.85}" stroke="#223388" stroke-width="${s*.035}" stroke-linecap="round"/>
</svg>`;
};

// ─── 骷髅法师 (Skeleton Mage) ───
SVG_SPRITES.skeletonMage = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<linearGradient id="mr" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#7744aa"/><stop offset="50%" stop-color="#553388"/><stop offset="100%" stop-color="#331a66"/></linearGradient>
<radialGradient id="mc" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#dd88ff"/><stop offset="100%" stop-color="#7700aa"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.25}" ry="${s*.04}" fill="rgba(0,0,0,0.3)"/>
<path d="M ${s*.35},${s*.35} L ${s*.65},${s*.35} L ${s*.78},${s*.9} Q ${s*.5},${s*.95} ${s*.22},${s*.9} Z" fill="url(#mr)"/>
<polygon points="${s*.5},${s*.5} ${s*.43},${s*.65} ${s*.57},${s*.65}" stroke="#aa66ff" stroke-width="${s*.012}" fill="none" opacity="0.5"/>
<circle cx="${s*.5}" cy="${s*.58}" r="${s*.035}" stroke="#aa66ff" stroke-width="${s*.01}" fill="none" opacity="0.5"/>
<circle cx="${s*.5}" cy="${s*.25}" r="${s*.13}" fill="#ddddc8"/>
<path d="M ${s*.5},${s*.05} Q ${s*.3},${s*.2} ${s*.32},${s*.35} L ${s*.68},${s*.35} Q ${s*.7},${s*.2} ${s*.5},${s*.05} Z" fill="#2a1144"/>
<circle cx="${s*.45}" cy="${s*.27}" r="${s*.035}" fill="#cc55ff"/>
<circle cx="${s*.55}" cy="${s*.27}" r="${s*.035}" fill="#cc55ff"/>
<circle cx="${s*.45}" cy="${s*.27}" r="${s*.015}" fill="#fff" opacity="0.7"/>
<circle cx="${s*.55}" cy="${s*.27}" r="${s*.015}" fill="#fff" opacity="0.7"/>
<line x1="${s*.25}" y1="${s*.18}" x2="${s*.28}" y2="${s*.88}" stroke="#554433" stroke-width="${s*.025}" stroke-linecap="round"/>
<circle cx="${s*.245}" cy="${s*.15}" r="${s*.045}" fill="url(#mc)"/>
</svg>`;
};

// ─── 石像鬼 (Gargoyle) ───
SVG_SPRITES.gargoyle = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="gb" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#ffddbb"/><stop offset="30%" stop-color="#eebb88"/><stop offset="70%" stop-color="#cc9955"/><stop offset="100%" stop-color="#997733"/></radialGradient>
</defs>
<path d="M ${s*.3},${s*.4} Q ${s*.1},${s*.2} ${s*.05},${s*.4} L ${s*.12},${s*.55} L ${s*.25},${s*.58} Z" fill="#bb8844" opacity="0.8"/>
<path d="M ${s*.7},${s*.4} Q ${s*.9},${s*.2} ${s*.95},${s*.4} L ${s*.88},${s*.55} L ${s*.75},${s*.58} Z" fill="#bb8844" opacity="0.8"/>
<path d="M ${s*.25},${s*.25} L ${s*.75},${s*.25} L ${s*.82},${s*.8} Q ${s*.5},${s*.9} ${s*.18},${s*.8} Z" fill="url(#gb)"/>
<path d="M ${s*.4},${s*.3} Q ${s*.42},${s*.5} ${s*.38},${s*.7}" stroke="rgba(30,20,10,0.4)" stroke-width="1.5" fill="none"/>
<path d="M ${s*.62},${s*.35} L ${s*.65},${s*.55} L ${s*.6},${s*.72}" stroke="rgba(30,20,10,0.4)" stroke-width="1.2" fill="none"/>
<circle cx="${s*.35}" cy="${s*.7}" r="${s*.03}" fill="#4a7a3a" opacity="0.4"/>
<circle cx="${s*.68}" cy="${s*.65}" r="${s*.025}" fill="#4a7a3a" opacity="0.35"/>
<path d="M ${s*.32},${s*.25} Q ${s*.25},${s*.1} ${s*.3},${s*.05} Q ${s*.35},${s*.12} ${s*.38},${s*.25}" fill="#664422"/>
<path d="M ${s*.62},${s*.25} Q ${s*.65},${s*.12} ${s*.7},${s*.05} Q ${s*.75},${s*.1} ${s*.68},${s*.25}" fill="#664422"/>
<circle cx="${s*.4}" cy="${s*.42}" r="${s*.045}" fill="#ff7700"/>
<circle cx="${s*.6}" cy="${s*.42}" r="${s*.045}" fill="#ff7700"/>
<circle cx="${s*.4}" cy="${s*.42}" r="${s*.02}" fill="#fff" opacity="0.6"/>
<circle cx="${s*.6}" cy="${s*.42}" r="${s*.02}" fill="#fff" opacity="0.6"/>
<path d="M ${s*.38},${s*.58} L ${s*.45},${s*.62} L ${s*.55},${s*.62} L ${s*.62},${s*.58}" stroke="#2a1a0a" stroke-width="${s*.02}" fill="none"/>
</svg>`;
};

// ─── 恶魔术士 (Demon Caster) ───
SVG_SPRITES.demonCaster = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<linearGradient id="dr" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stop-color="#6a1133"/><stop offset="50%" stop-color="#4a0a22"/><stop offset="100%" stop-color="#2a0511"/></linearGradient>
<radialGradient id="dh" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#cc5555"/><stop offset="60%" stop-color="#881133"/><stop offset="100%" stop-color="#550a1a"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.25}" ry="${s*.04}" fill="rgba(0,0,0,0.3)"/>
<path d="M ${s*.5},${s*.25} Q ${s*.3},${s*.35} ${s*.25},${s*.85} Q ${s*.5},${s*.95} ${s*.75},${s*.85} Q ${s*.7},${s*.35} ${s*.5},${s*.25} Z" fill="url(#dr)"/>
<circle cx="${s*.5}" cy="${s*.3}" r="${s*.14}" fill="url(#dh)"/>
<path d="M ${s*.38},${s*.2} Q ${s*.32},${s*.08} ${s*.28},${s*.05} Q ${s*.34},${s*.12} ${s*.42},${s*.2}" fill="#331111"/>
<path d="M ${s*.58},${s*.2} Q ${s*.66},${s*.12} ${s*.72},${s*.05} Q ${s*.68},${s*.08} ${s*.62},${s*.2}" fill="#331111"/>
<circle cx="${s*.45}" cy="${s*.28}" r="${s*.03}" fill="#ffcc33"/>
<circle cx="${s*.55}" cy="${s*.28}" r="${s*.03}" fill="#ffcc33"/>
<circle cx="${s*.45}" cy="${s*.28}" r="${s*.012}" fill="#fff" opacity="0.7"/>
<circle cx="${s*.55}" cy="${s*.28}" r="${s*.012}" fill="#fff" opacity="0.7"/>
<circle cx="${s*.3}" cy="${s*.6}" r="${s*.04}" fill="#ff88aa" opacity="0.6"/>
<circle cx="${s*.7}" cy="${s*.55}" r="${s*.04}" fill="#ff88aa" opacity="0.6"/>
<circle cx="${s*.5}" cy="${s*.72}" r="${s*.04}" fill="#ff88aa" opacity="0.6"/>
</svg>`;
};

// ─── 爆破虫 (Exploder) ───
SVG_SPRITES.exploder = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="eb" cx="35%" cy="35%" r="60%"><stop offset="0%" stop-color="#ffaa44"/><stop offset="30%" stop-color="#cc5522"/><stop offset="70%" stop-color="#883311"/><stop offset="100%" stop-color="#551a08"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.88}" rx="${s*.22}" ry="${s*.04}" fill="rgba(0,0,0,0.3)"/>
<circle cx="${s*.5}" cy="${s*.48}" r="${s*.32}" fill="url(#eb)"/>
<line x1="${s*.5}" y1="${s*.2}" x2="${s*.5}" y2="${s*.76}" stroke="rgba(40,15,5,0.4)" stroke-width="${s*.015}"/>
<ellipse cx="${s*.5}" cy="${s*.48}" rx="${s*.18}" ry="${s*.3}" stroke="rgba(40,15,5,0.4)" stroke-width="${s*.012}" fill="none"/>
<line x1="${s*.35}" y1="${s*.3}" x2="${s*.22}" y2="${s*.2}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<line x1="${s*.65}" y1="${s*.3}" x2="${s*.78}" y2="${s*.2}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<line x1="${s*.35}" y1="${s*.65}" x2="${s*.2}" y2="${s*.75}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<line x1="${s*.65}" y1="${s*.65}" x2="${s*.8}" y2="${s*.75}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<line x1="${s*.5}" y1="${s*.18}" x2="${s*.5}" y2="${s*.1}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<line x1="${s*.5}" y1="${s*.78}" x2="${s*.5}" y2="${s*.86}" stroke="#ffee66" stroke-width="${s*.02}" opacity="0.7"/>
<circle cx="${s*.42}" cy="${s*.42}" r="${s*.045}" fill="#ffff88"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.045}" fill="#ffff88"/>
<circle cx="${s*.42}" cy="${s*.42}" r="${s*.02}" fill="#220000"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.02}" fill="#220000"/>
<line x1="${s*.3}" y1="${s*.72}" x2="${s*.22}" y2="${s*.85}" stroke="#663311" stroke-width="${s*.025}" stroke-linecap="round"/>
<line x1="${s*.7}" y1="${s*.72}" x2="${s*.78}" y2="${s*.85}" stroke="#663311" stroke-width="${s*.025}" stroke-linecap="round"/>
<line x1="${s*.38}" y1="${s*.75}" x2="${s*.32}" y2="${s*.87}" stroke="#663311" stroke-width="${s*.025}" stroke-linecap="round"/>
<line x1="${s*.62}" y1="${s*.75}" x2="${s*.68}" y2="${s*.87}" stroke="#663311" stroke-width="${s*.025}" stroke-linecap="round"/>
</svg>`;
};

// ─── 精英骷髅 (Elite Skeleton) ───
SVG_SPRITES.eliteSkeleton = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="esb" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#ccbbaa"/><stop offset="30%" stop-color="#8a6655"/><stop offset="60%" stop-color="#664433"/><stop offset="100%" stop-color="#442211"/></radialGradient>
<radialGradient id="esk" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#eeddcc"/><stop offset="60%" stop-color="#ccaa88"/><stop offset="100%" stop-color="#886644"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.05}" fill="rgba(0,0,0,0.3)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.4}" fill="rgba(255,50,50,0.08)"/>
<path d="M ${s*.32},${s*.35} L ${s*.68},${s*.35} L ${s*.75},${s*.82} L ${s*.25},${s*.82} Z" fill="url(#esb)"/>
<line x1="${s*.5}" y1="${s*.35}" x2="${s*.5}" y2="${s*.8}" stroke="rgba(200,160,100,0.3)" stroke-width="${s*.012}"/>
<line x1="${s*.3}" y1="${s*.55}" x2="${s*.7}" y2="${s*.55}" stroke="rgba(200,160,100,0.3)" stroke-width="${s*.012}"/>
<ellipse cx="${s*.33}" cy="${s*.38}" rx="${s*.08}" ry="${s*.05}" fill="#776655"/>
<ellipse cx="${s*.67}" cy="${s*.38}" rx="${s*.08}" ry="${s*.05}" fill="#776655"/>
<circle cx="${s*.5}" cy="${s*.22}" r="${s*.12}" fill="url(#esk)"/>
<path d="M ${s*.35},${s*.12} L ${s*.4},${s*.02} L ${s*.44},${s*.1} L ${s*.5},${s*0} L ${s*.56},${s*.1} L ${s*.6},${s*.02} L ${s*.65},${s*.12} Z" fill="#ffbb00"/>
<circle cx="${s*.5}" cy="${s*.15}" r="${s*.025}" fill="#ff2222"/>
<circle cx="${s*.42}" cy="${s*.23}" r="${s*.035}" fill="#ff3300"/>
<circle cx="${s*.58}" cy="${s*.23}" r="${s*.035}" fill="#ff3300"/>
<circle cx="${s*.42}" cy="${s*.23}" r="${s*.015}" fill="#fff" opacity="0.5"/>
<circle cx="${s*.58}" cy="${s*.23}" r="${s*.015}" fill="#fff" opacity="0.5"/>
<rect x="${s*.73}" y="${s*.15}" width="${s*.025}" height="${s*.45}" fill="#bbb" rx="2" transform="rotate(-12,${s*.74},${s*.37})"/>
<rect x="${s*.71}" y="${s*.55}" width="${s*.07}" height="${s*.03}" fill="#aa8833" rx="1" transform="rotate(-12,${s*.74},${s*.565})"/>
</svg>`;
};

// ─── 暗夜领主/精英恶魔 (Elite Demon) ───
SVG_SPRITES.eliteDemon = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="edb" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#993366"/><stop offset="40%" stop-color="#661144"/><stop offset="80%" stop-color="#440a2a"/><stop offset="100%" stop-color="#220515"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.05}" fill="rgba(0,0,0,0.3)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.42}" fill="rgba(170,34,100,0.08)"/>
<path d="M ${s*.3},${s*.4} Q ${s*.12},${s*.22} ${s*.08},${s*.4} Q ${s*.15},${s*.55} ${s*.3},${s*.55} Z" fill="#2a0a1a"/>
<path d="M ${s*.7},${s*.4} Q ${s*.88},${s*.22} ${s*.92},${s*.4} Q ${s*.85},${s*.55} ${s*.7},${s*.55} Z" fill="#2a0a1a"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.3}" fill="url(#edb)"/>
<line x1="${s*.5}" y1="${s*.22}" x2="${s*.5}" y2="${s*.78}" stroke="rgba(255,100,180,0.2)" stroke-width="${s*.012}"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.17}" stroke="rgba(255,100,180,0.2)" stroke-width="${s*.012}" fill="none"/>
<path d="M ${s*.35},${s*.28} Q ${s*.28},${s*.15} ${s*.22},${s*.1} Q ${s*.3},${s*.2} ${s*.4},${s*.28}" fill="#330a15"/>
<path d="M ${s*.6},${s*.28} Q ${s*.7},${s*.2} ${s*.78},${s*.1} Q ${s*.72},${s*.15} ${s*.65},${s*.28}" fill="#330a15"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.22}" stroke="#ff55aa" stroke-width="${s*.012}" fill="none" opacity="0.4" stroke-dasharray="${s*.1} ${s*.08}"/>
<circle cx="${s*.42}" cy="${s*.44}" r="${s*.04}" fill="#ff88cc"/>
<circle cx="${s*.58}" cy="${s*.44}" r="${s*.04}" fill="#ff88cc"/>
<circle cx="${s*.42}" cy="${s*.44}" r="${s*.015}" fill="#fff" opacity="0.6"/>
<circle cx="${s*.58}" cy="${s*.44}" r="${s*.015}" fill="#fff" opacity="0.6"/>
</svg>`;
};

// ─── Boss 骷髅王 ───
SVG_SPRITES.boss = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="bossBody" cx="45%" cy="40%" r="55%"><stop offset="0%" stop-color="#aa4422"/><stop offset="30%" stop-color="#882211"/><stop offset="60%" stop-color="#661100"/><stop offset="100%" stop-color="#440800"/></radialGradient>
<radialGradient id="bossSkull" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#ffeecc"/><stop offset="50%" stop-color="#ddbb88"/><stop offset="100%" stop-color="#996633"/></radialGradient>
<radialGradient id="bossGem" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#ff4444"/><stop offset="100%" stop-color="#880000"/></radialGradient>
</defs>
<ellipse cx="${s*.5}" cy="${s*.93}" rx="${s*.3}" ry="${s*.05}" fill="rgba(0,0,0,0.35)"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.46}" fill="rgba(255,100,0,0.06)"/>
<path d="M ${s*.32},${s*.35} Q ${s*.28},${s*.65} ${s*.33},${s*.88} L ${s*.67},${s*.88} Q ${s*.72},${s*.65} ${s*.68},${s*.35} Z" fill="#cc2200" opacity="0.4"/>
<path d="M ${s*.3},${s*.32} L ${s*.7},${s*.32} L ${s*.78},${s*.82} Q ${s*.5},${s*.9} ${s*.22},${s*.82} Z" fill="url(#bossBody)"/>
<line x1="${s*.5}" y1="${s*.32}" x2="${s*.5}" y2="${s*.8}" stroke="rgba(255,180,80,0.25)" stroke-width="${s*.012}"/>
<line x1="${s*.28}" y1="${s*.52}" x2="${s*.72}" y2="${s*.52}" stroke="rgba(255,180,80,0.25)" stroke-width="${s*.012}"/>
<circle cx="${s*.5}" cy="${s*.5}" r="${s*.04}" fill="url(#bossGem)"/>
<ellipse cx="${s*.3}" cy="${s*.35}" rx="${s*.09}" ry="${s*.06}" fill="#776655"/>
<ellipse cx="${s*.7}" cy="${s*.35}" rx="${s*.09}" ry="${s*.06}" fill="#776655"/>
<polygon points="${s*.27},${s*.33} ${s*.25},${s*.25} ${s*.32},${s*.32}" fill="#443322"/>
<polygon points="${s*.68},${s*.32} ${s*.75},${s*.25} ${s*.73},${s*.33}" fill="#443322"/>
<circle cx="${s*.5}" cy="${s*.2}" r="${s*.11}" fill="url(#bossSkull)"/>
<rect x="${s*.32}" y="${s*.12}" width="${s*.36}" height="${s*.06}" fill="#cc8800" rx="2"/>
<path d="M ${s*.33},${s*.12} L ${s*.38},${s*.02} L ${s*.43},${s*.08} L ${s*.5},${s*0} L ${s*.57},${s*.08} L ${s*.62},${s*.02} L ${s*.67},${s*.12} Z" fill="#ffbb00"/>
<circle cx="${s*.5}" cy="${s*.1}" r="${s*.02}" fill="#ff0000"/>
<circle cx="${s*.42}" cy="${s*.1}" r="${s*.015}" fill="#0044ff"/>
<circle cx="${s*.58}" cy="${s*.1}" r="${s*.015}" fill="#0044ff"/>
<circle cx="${s*.44}" cy="${s*.21}" r="${s*.03}" fill="#ffaa00"/>
<circle cx="${s*.56}" cy="${s*.21}" r="${s*.03}" fill="#ffaa00"/>
<circle cx="${s*.44}" cy="${s*.21}" r="${s*.012}" fill="#fff"/>
<circle cx="${s*.56}" cy="${s*.21}" r="${s*.012}" fill="#fff"/>
</svg>`;
};

// ─── 英雄精灵 ───
SVG_SPRITES.hero_swordsman = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hs_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#7ec8e3"/><stop offset="50%" stop-color="#3a8fd4"/><stop offset="100%" stop-color="#1a5276"/></radialGradient>
<linearGradient id="hs_blade" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f0f8ff"/><stop offset="50%" stop-color="#c0d8e8"/><stop offset="100%" stop-color="#a0c0d8"/></linearGradient>
<linearGradient id="hs_armor" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#5cacee"/><stop offset="100%" stop-color="#2a6496"/></linearGradient>
<filter id="hs_glow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.3}" ry="${s*.045}" fill="rgba(20,60,100,0.25)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hs_body)"/>
<!-- 铠甲胸板 -->
<path d="M ${s*.35},${s*.45} Q ${s*.5},${s*.38} ${s*.65},${s*.45} L ${s*.62},${s*.7} Q ${s*.5},${s*.75} ${s*.38},${s*.7} Z" fill="url(#hs_armor)" opacity="0.7"/>
<!-- 铠甲肩甲 -->
<ellipse cx="${s*.33}" cy="${s*.42}" rx="${s*.08}" ry="${s*.055}" fill="#4a90d9" stroke="#2a6496" stroke-width="${s*.008}"/>
<ellipse cx="${s*.67}" cy="${s*.42}" rx="${s*.08}" ry="${s*.055}" fill="#4a90d9" stroke="#2a6496" stroke-width="${s*.008}"/>
<!-- 头盔轮廓 -->
<path d="M ${s*.35},${s*.35} Q ${s*.35},${s*.2} ${s*.5},${s*.18} Q ${s*.65},${s*.2} ${s*.65},${s*.35}" fill="none" stroke="#2a6496" stroke-width="${s*.02}" stroke-linecap="round"/>
<!-- 头盔面罩缝 -->
<line x1="${s*.5}" y1="${s*.2}" x2="${s*.5}" y2="${s*.35}" stroke="#2a6496" stroke-width="${s*.008}"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.42}" rx="${s*.04}" ry="${s*.035}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.42}" rx="${s*.04}" ry="${s*.035}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.425}" r="${s*.02}" fill="#1a3a5c"/>
<circle cx="${s*.58}" cy="${s*.425}" r="${s*.02}" fill="#1a3a5c"/>
<circle cx="${s*.45}" cy="${s*.42}" r="${s*.007}" fill="#fff"/>
<circle cx="${s*.59}" cy="${s*.42}" r="${s*.007}" fill="#fff"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.52} Q ${s*.5},${s*.55} ${s*.55},${s*.52}" stroke="#1a5276" stroke-width="${s*.012}" fill="none" stroke-linecap="round"/>
<!-- 武士刀 -->
<rect x="${s*.71}" y="${s*.12}" width="${s*.025}" height="${s*.5}" fill="url(#hs_blade)" rx="${s*.012}" transform="rotate(12,${s*.72},${s*.37})"/>
<rect x="${s*.695}" y="${s*.59}" width="${s*.055}" height="${s*.025}" fill="#8B6914" rx="${s*.005}" transform="rotate(12,${s*.72},${s*.6})"/>
<rect x="${s*.71}" y="${s*.6}" width="${s*.025}" height="${s*.12}" fill="#5c3d11" rx="${s*.005}" transform="rotate(12,${s*.72},${s*.66})"/>
<!-- 刀刃光效 -->
<line x1="${s*.72}" y1="${s*.15}" x2="${s*.72}" y2="${s*.55}" stroke="rgba(255,255,255,0.4)" stroke-width="${s*.008}" transform="rotate(12,${s*.72},${s*.37})" filter="url(#hs_glow)"/>
<!-- 风斩特效 -->
<path d="M ${s*.6},${s*.2} Q ${s*.65},${s*.25} ${s*.62},${s*.32}" stroke="rgba(150,220,255,0.5)" stroke-width="${s*.01}" fill="none"/>
<path d="M ${s*.63},${s*.18} Q ${s*.68},${s*.22} ${s*.66},${s*.28}" stroke="rgba(150,220,255,0.35)" stroke-width="${s*.008}" fill="none"/>
<!-- 能量外环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(90,180,255,0.2)" stroke-width="${s*.01}" fill="none" stroke-dasharray="${s*.06} ${s*.04}"/>
</svg>`;
};

SVG_SPRITES.hero_mage = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hm_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#ff9966"/><stop offset="50%" stop-color="#e84530"/><stop offset="100%" stop-color="#8b1a1a"/></radialGradient>
<radialGradient id="hm_fire" cx="50%" cy="80%" r="60%"><stop offset="0%" stop-color="#fff4b0"/><stop offset="40%" stop-color="#ffaa00"/><stop offset="80%" stop-color="#ff4400"/><stop offset="100%" stop-color="#aa0000"/></radialGradient>
<linearGradient id="hm_staff" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#8B4513"/><stop offset="100%" stop-color="#5c2d0e"/></linearGradient>
<filter id="hm_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.3}" ry="${s*.045}" fill="rgba(100,20,0,0.25)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hm_body)"/>
<!-- 法袍 -->
<path d="M ${s*.32},${s*.5} Q ${s*.5},${s*.42} ${s*.68},${s*.5} L ${s*.65},${s*.8} Q ${s*.5},${s*.85} ${s*.35},${s*.8} Z" fill="rgba(120,20,30,0.6)" stroke="#6b0f1a" stroke-width="${s*.006}"/>
<!-- 法袍花纹 -->
<path d="M ${s*.4},${s*.55} Q ${s*.5},${s*.5} ${s*.6},${s*.55}" stroke="rgba(255,200,100,0.4)" stroke-width="${s*.008}" fill="none"/>
<path d="M ${s*.42},${s*.62} Q ${s*.5},${s*.58} ${s*.58},${s*.62}" stroke="rgba(255,200,100,0.3)" stroke-width="${s*.006}" fill="none"/>
<!-- 法师帽 -->
<path d="M ${s*.35},${s*.35} L ${s*.5},${s*.1} L ${s*.65},${s*.35}" fill="#7b1818" stroke="#4a0e0e" stroke-width="${s*.008}"/>
<path d="M ${s*.33},${s*.35} Q ${s*.5},${s*.38} ${s*.67},${s*.35}" fill="#9b2020" stroke="#4a0e0e" stroke-width="${s*.006}"/>
<!-- 帽子星星装饰 -->
<circle cx="${s*.5}" cy="${s*.2}" r="${s*.02}" fill="#ffcc00" opacity="0.8"/>
<!-- 眼睛 - 发光 -->
<ellipse cx="${s*.43}" cy="${s*.42}" rx="${s*.04}" ry="${s*.035}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.42}" rx="${s*.04}" ry="${s*.035}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.425}" r="${s*.02}" fill="#ff4400"/>
<circle cx="${s*.58}" cy="${s*.425}" r="${s*.02}" fill="#ff4400"/>
<circle cx="${s*.44}" cy="${s*.42}" r="${s*.008}" fill="#ffcc00"/>
<circle cx="${s*.58}" cy="${s*.42}" r="${s*.008}" fill="#ffcc00"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.52} Q ${s*.5},${s*.55} ${s*.55},${s*.52}" stroke="#5c1010" stroke-width="${s*.012}" fill="none" stroke-linecap="round"/>
<!-- 法杖 -->
<rect x="${s*.74}" y="${s*.2}" width="${s*.022}" height="${s*.55}" fill="url(#hm_staff)" rx="${s*.011}"/>
<!-- 法杖顶部宝珠 -->
<circle cx="${s*.75}" cy="${s*.18}" r="${s*.04}" fill="url(#hm_fire)" filter="url(#hm_glow)"/>
<circle cx="${s*.75}" cy="${s*.18}" r="${s*.02}" fill="#fff4b0" opacity="0.8"/>
<!-- 火焰粒子 -->
<ellipse cx="${s*.25}" cy="${s*.3}" rx="${s*.03}" ry="${s*.04}" fill="url(#hm_fire)" opacity="0.7" filter="url(#hm_glow)"/>
<ellipse cx="${s*.2}" cy="${s*.55}" rx="${s*.025}" ry="${s*.035}" fill="url(#hm_fire)" opacity="0.5" filter="url(#hm_glow)"/>
<ellipse cx="${s*.78}" cy="${s*.6}" rx="${s*.02}" ry="${s*.03}" fill="url(#hm_fire)" opacity="0.55" filter="url(#hm_glow)"/>
<ellipse cx="${s*.3}" cy="${s*.75}" rx="${s*.018}" ry="${s*.025}" fill="url(#hm_fire)" opacity="0.4"/>
<!-- 魔法环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(255,100,0,0.25)" stroke-width="${s*.012}" fill="none" stroke-dasharray="${s*.05} ${s*.03}"/>
</svg>`;
};

SVG_SPRITES.hero_assassin = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="ha_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#c088ff"/><stop offset="50%" stop-color="#8030d0"/><stop offset="100%" stop-color="#3a1166"/></radialGradient>
<linearGradient id="ha_dagger" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e8e8e8"/><stop offset="50%" stop-color="#b8b8b8"/><stop offset="100%" stop-color="#888"/></linearGradient>
<filter id="ha_shadow"><feGaussianBlur stdDeviation="1.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.3}" ry="${s*.045}" fill="rgba(60,10,100,0.3)"/>
<!-- 暗影飘带 -->
<path d="M ${s*.25},${s*.6} Q ${s*.2},${s*.7} ${s*.15},${s*.8}" stroke="rgba(160,80,255,0.3)" stroke-width="${s*.015}" fill="none"/>
<path d="M ${s*.75},${s*.6} Q ${s*.8},${s*.7} ${s*.85},${s*.8}" stroke="rgba(160,80,255,0.3)" stroke-width="${s*.015}" fill="none"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#ha_body)"/>
<!-- 兜帽 -->
<path d="M ${s*.3},${s*.42} Q ${s*.3},${s*.15} ${s*.5},${s*.12} Q ${s*.7},${s*.15} ${s*.7},${s*.42}" fill="#2a0845" stroke="#1a0530" stroke-width="${s*.008}"/>
<path d="M ${s*.3},${s*.42} Q ${s*.5},${s*.48} ${s*.7},${s*.42}" fill="#3a1060"/>
<!-- 面罩 -->
<path d="M ${s*.35},${s*.48} L ${s*.65},${s*.48} L ${s*.62},${s*.58} Q ${s*.5},${s*.6} ${s*.38},${s*.58} Z" fill="#1a0530" opacity="0.7"/>
<!-- 眼睛 - 锐利 -->
<path d="M ${s*.38},${s*.42} L ${s*.43},${s*.4} L ${s*.48},${s*.42} L ${s*.43},${s*.44} Z" fill="#fff"/>
<path d="M ${s*.52},${s*.42} L ${s*.57},${s*.4} L ${s*.62},${s*.42} L ${s*.57},${s*.44} Z" fill="#fff"/>
<circle cx="${s*.43}" cy="${s*.42}" r="${s*.015}" fill="#9900ff"/>
<circle cx="${s*.57}" cy="${s*.42}" r="${s*.015}" fill="#9900ff"/>
<!-- 左匕首 -->
<polygon points="${s*.2},${s*.35} ${s*.22},${s*.32} ${s*.24},${s*.55} ${s*.22},${s*.56}" fill="url(#ha_dagger)"/>
<rect x="${s*.195}" y="${s*.55}" width="${s*.05}" height="${s*.02}" fill="#4a2080" rx="${s*.005}"/>
<rect x="${s*.205}" y="${s*.57}" width="${s*.03}" height="${s*.06}" fill="#2a0845" rx="${s*.005}"/>
<!-- 右匕首 -->
<polygon points="${s*.76},${s*.35} ${s*.78},${s*.32} ${s*.8},${s*.55} ${s*.78},${s*.56}" fill="url(#ha_dagger)"/>
<rect x="${s*.755}" y="${s*.55}" width="${s*.05}" height="${s*.02}" fill="#4a2080" rx="${s*.005}"/>
<rect x="${s*.765}" y="${s*.57}" width="${s*.03}" height="${s*.06}" fill="#2a0845" rx="${s*.005}"/>
<!-- 毒雾粒子 -->
<circle cx="${s*.22}" cy="${s*.28}" r="${s*.015}" fill="#aa66ff" opacity="0.4"/>
<circle cx="${s*.78}" cy="${s*.28}" r="${s*.012}" fill="#aa66ff" opacity="0.35"/>
<circle cx="${s*.15}" cy="${s*.5}" r="${s*.01}" fill="#cc88ff" opacity="0.3"/>
<!-- 暗影环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(150,50,255,0.2)" stroke-width="${s*.01}" fill="none" stroke-dasharray="${s*.03} ${s*.06}"/>
</svg>`;
};

SVG_SPRITES.hero_paladin = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hp_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#fff4c0"/><stop offset="50%" stop-color="#ffc832"/><stop offset="100%" stop-color="#b8860b"/></radialGradient>
<linearGradient id="hp_shield" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd700"/><stop offset="50%" stop-color="#daa520"/><stop offset="100%" stop-color="#b8860b"/></linearGradient>
<linearGradient id="hp_armor" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff8dc"/><stop offset="100%" stop-color="#daa520"/></linearGradient>
<filter id="hp_holy"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 圣光底部光环 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.32}" ry="${s*.05}" fill="rgba(255,215,0,0.3)" filter="url(#hp_holy)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hp_body)"/>
<!-- 圣骑士重甲 -->
<path d="M ${s*.33},${s*.4} Q ${s*.5},${s*.33} ${s*.67},${s*.4} L ${s*.65},${s*.72} Q ${s*.5},${s*.78} ${s*.35},${s*.72} Z" fill="url(#hp_armor)" stroke="#b8860b" stroke-width="${s*.008}"/>
<!-- 甲胸十字 -->
<rect x="${s*.48}" y="${s*.42}" width="${s*.04}" height="${s*.2}" fill="#b8860b" rx="${s*.005}"/>
<rect x="${s*.4}" y="${s*.49}" width="${s*.2}" height="${s*.04}" fill="#b8860b" rx="${s*.005}"/>
<!-- 肩甲 -->
<ellipse cx="${s*.32}" cy="${s*.4}" rx="${s*.07}" ry="${s*.05}" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.006}"/>
<ellipse cx="${s*.68}" cy="${s*.4}" rx="${s*.07}" ry="${s*.05}" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.006}"/>
<!-- 头冠 -->
<path d="M ${s*.37},${s*.3} L ${s*.4},${s*.2} L ${s*.45},${s*.27} L ${s*.5},${s*.17} L ${s*.55},${s*.27} L ${s*.6},${s*.2} L ${s*.63},${s*.3}" fill="#ffd700" stroke="#b8860b" stroke-width="${s*.006}"/>
<!-- 头冠宝石 -->
<circle cx="${s*.5}" cy="${s*.22}" r="${s*.015}" fill="#ff4444"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.38}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.38}" rx="${s*.035}" ry="${s*.03}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.385}" r="${s*.017}" fill="#4a90d9"/>
<circle cx="${s*.58}" cy="${s*.385}" r="${s*.017}" fill="#4a90d9"/>
<circle cx="${s*.445}" cy="${s*.38}" r="${s*.006}" fill="#fff"/>
<circle cx="${s*.585}" cy="${s*.38}" r="${s*.006}" fill="#fff"/>
<!-- 嘴 -->
<path d="M ${s*.45},${s*.46} Q ${s*.5},${s*.49} ${s*.55},${s*.46}" stroke="#8b6914" stroke-width="${s*.012}" fill="none" stroke-linecap="round"/>
<!-- 盾牌 -->
<path d="M ${s*.12},${s*.35} L ${s*.28},${s*.32} L ${s*.28},${s*.6} Q ${s*.2},${s*.65} ${s*.12},${s*.55} Z" fill="url(#hp_shield)" stroke="#8b6914" stroke-width="${s*.01}"/>
<rect x="${s*.18}" y="${s*.38}" width="${s*.025}" height="${s*.16}" fill="#fff" opacity="0.6" rx="${s*.005}"/>
<rect x="${s*.14}" y="${s*.44}" width="${s*.1}" height="${s*.025}" fill="#fff" opacity="0.6" rx="${s*.005}"/>
<!-- 圣光光芒 -->
<line x1="${s*.5}" y1="${s*.05}" x2="${s*.5}" y2="${s*.12}" stroke="rgba(255,215,0,0.5)" stroke-width="${s*.01}" filter="url(#hp_holy)"/>
<line x1="${s*.3}" y1="${s*.1}" x2="${s*.36}" y2="${s*.16}" stroke="rgba(255,215,0,0.4)" stroke-width="${s*.008}" filter="url(#hp_holy)"/>
<line x1="${s*.7}" y1="${s*.1}" x2="${s*.64}" y2="${s*.16}" stroke="rgba(255,215,0,0.4)" stroke-width="${s*.008}" filter="url(#hp_holy)"/>
<!-- 神圣外环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.39}" stroke="rgba(255,215,0,0.25)" stroke-width="${s*.015}" fill="none"/>
</svg>`;
};

SVG_SPRITES.hero_archer = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="har_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#90eec0"/><stop offset="50%" stop-color="#3dbd7d"/><stop offset="100%" stop-color="#1a6b42"/></radialGradient>
<linearGradient id="har_bow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8B6914"/><stop offset="50%" stop-color="#6b4e12"/><stop offset="100%" stop-color="#4a350d"/></linearGradient>
<linearGradient id="har_arrow" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ddd"/><stop offset="100%" stop-color="#888"/></linearGradient>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.28}" ry="${s*.04}" fill="rgba(20,80,50,0.25)"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#har_body)"/>
<!-- 游侠斗篷 -->
<path d="M ${s*.3},${s*.38} Q ${s*.25},${s*.5} ${s*.2},${s*.75}" stroke="#2d5a3d" stroke-width="${s*.02}" fill="none"/>
<path d="M ${s*.7},${s*.38} Q ${s*.75},${s*.5} ${s*.8},${s*.75}" stroke="#2d5a3d" stroke-width="${s*.02}" fill="none"/>
<path d="M ${s*.3},${s*.38} Q ${s*.5},${s*.42} ${s*.7},${s*.38}" fill="#2d5a3d" opacity="0.5"/>
<!-- 皮甲 -->
<path d="M ${s*.38},${s*.45} Q ${s*.5},${s*.42} ${s*.62},${s*.45} L ${s*.6},${s*.68} Q ${s*.5},${s*.72} ${s*.4},${s*.68} Z" fill="#5c3d11" opacity="0.6" stroke="#3a2508" stroke-width="${s*.005}"/>
<!-- 兜帽 -->
<path d="M ${s*.33},${s*.38} Q ${s*.33},${s*.2} ${s*.5},${s*.16} Q ${s*.67},${s*.2} ${s*.67},${s*.38}" fill="#2d5a3d" stroke="#1a3a25" stroke-width="${s*.008}"/>
<!-- 眼睛 -->
<ellipse cx="${s*.43}" cy="${s*.4}" rx="${s*.038}" ry="${s*.03}" fill="#fff"/>
<ellipse cx="${s*.57}" cy="${s*.4}" rx="${s*.038}" ry="${s*.03}" fill="#fff"/>
<circle cx="${s*.44}" cy="${s*.405}" r="${s*.017}" fill="#2d8b57"/>
<circle cx="${s*.58}" cy="${s*.405}" r="${s*.017}" fill="#2d8b57"/>
<circle cx="${s*.445}" cy="${s*.4}" r="${s*.006}" fill="#fff"/>
<circle cx="${s*.585}" cy="${s*.4}" r="${s*.006}" fill="#fff"/>
<!-- 微笑 -->
<path d="M ${s*.45},${s*.49} Q ${s*.5},${s*.52} ${s*.55},${s*.49}" stroke="#1a4030" stroke-width="${s*.01}" fill="none" stroke-linecap="round"/>
<!-- 弓 -->
<path d="M ${s*.76},${s*.2} Q ${s*.68},${s*.45} ${s*.76},${s*.7}" stroke="url(#har_bow)" stroke-width="${s*.025}" fill="none" stroke-linecap="round"/>
<!-- 弓弦 -->
<line x1="${s*.76}" y1="${s*.2}" x2="${s*.76}" y2="${s*.7}" stroke="#ccc" stroke-width="${s*.006}"/>
<!-- 弓弦拉伸 -->
<path d="M ${s*.76},${s*.2} Q ${s*.68},${s*.45} ${s*.76},${s*.7}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="${s*.01}"/>
<!-- 箭矢 -->
<line x1="${s*.68}" y1="${s*.45}" x2="${s*.82}" y2="${s*.45}" stroke="url(#har_arrow)" stroke-width="${s*.012}"/>
<polygon points="${s*.82},${s*.43} ${s*.86},${s*.45} ${s*.82},${s*.47}" fill="#aaa"/>
<!-- 箭壶 -->
<rect x="${s*.26}" y="${s*.45}" width="${s*.06}" height="${s*.22}" fill="#5c3d11" rx="${s*.01}" stroke="#3a2508" stroke-width="${s*.005}"/>
<line x1="${s*.27}" y1="${s*.43}" x2="${s*.27}" y2="${s*.45}" stroke="#888" stroke-width="${s*.006}"/>
<line x1="${s*.29}" y1="${s*.42}" x2="${s*.29}" y2="${s*.45}" stroke="#888" stroke-width="${s*.006}"/>
<line x1="${s*.31}" y1="${s*.43}" x2="${s*.31}" y2="${s*.45}" stroke="#888" stroke-width="${s*.006}"/>
<!-- 叶子装饰 -->
<ellipse cx="${s*.22}" cy="${s*.3}" rx="${s*.015}" ry="${s*.025}" fill="rgba(100,200,100,0.5)" transform="rotate(-20,${s*.22},${s*.3})"/>
<ellipse cx="${s*.8}" cy="${s*.75}" rx="${s*.012}" ry="${s*.02}" fill="rgba(100,200,100,0.4)" transform="rotate(15,${s*.8},${s*.75})"/>
<!-- 自然环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.38}" stroke="rgba(50,180,100,0.2)" stroke-width="${s*.01}" fill="none" stroke-dasharray="${s*.04} ${s*.05}"/>
</svg>`;
};

SVG_SPRITES.hero_necromancer = function(s) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}"><defs>
<radialGradient id="hn_body" cx="40%" cy="35%" r="60%"><stop offset="0%" stop-color="#6bccb0"/><stop offset="50%" stop-color="#2a9a7a"/><stop offset="100%" stop-color="#0d4a3a"/></radialGradient>
<radialGradient id="hn_orb" cx="40%" cy="30%" r="60%"><stop offset="0%" stop-color="#aaffee"/><stop offset="60%" stop-color="#44ddbb"/><stop offset="100%" stop-color="#009977"/></radialGradient>
<linearGradient id="hn_staff" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#3a3a3a"/><stop offset="100%" stop-color="#1a1a1a"/></linearGradient>
<filter id="hn_glow"><feGaussianBlur stdDeviation="2" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
</defs>
<!-- 阴影 -->
<ellipse cx="${s*.5}" cy="${s*.92}" rx="${s*.3}" ry="${s*.05}" fill="rgba(0,80,60,0.3)"/>
<!-- 灵魂飘带 -->
<path d="M ${s*.3},${s*.7} Q ${s*.2},${s*.8} ${s*.15},${s*.88}" stroke="rgba(100,255,200,0.25)" stroke-width="${s*.012}" fill="none"/>
<path d="M ${s*.7},${s*.7} Q ${s*.8},${s*.8} ${s*.85},${s*.88}" stroke="rgba(100,255,200,0.25)" stroke-width="${s*.012}" fill="none"/>
<!-- 身体 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.34}" fill="url(#hn_body)"/>
<!-- 死灵法袍 -->
<path d="M ${s*.32},${s*.48} Q ${s*.5},${s*.4} ${s*.68},${s*.48} L ${s*.66},${s*.82} Q ${s*.5},${s*.88} ${s*.34},${s*.82} Z" fill="#0d2a22" stroke="#092018" stroke-width="${s*.006}"/>
<!-- 法袍骨纹装饰 -->
<path d="M ${s*.43},${s*.55} L ${s*.43},${s*.7}" stroke="rgba(200,255,230,0.3)" stroke-width="${s*.005}"/>
<path d="M ${s*.57},${s*.55} L ${s*.57},${s*.7}" stroke="rgba(200,255,230,0.3)" stroke-width="${s*.005}"/>
<path d="M ${s*.4},${s*.6} L ${s*.6},${s*.6}" stroke="rgba(200,255,230,0.2)" stroke-width="${s*.005}"/>
<!-- 兜帽 - 尖角 -->
<path d="M ${s*.3},${s*.4} Q ${s*.3},${s*.15} ${s*.5},${s*.08} Q ${s*.7},${s*.15} ${s*.7},${s*.4}" fill="#0d2a22" stroke="#061510" stroke-width="${s*.01}"/>
<!-- 兜帽阴影 -->
<path d="M ${s*.33},${s*.4} Q ${s*.5},${s*.46} ${s*.67},${s*.4}" fill="#061510"/>
<!-- 眼睛 - 幽绿发光 -->
<ellipse cx="${s*.43}" cy="${s*.38}" rx="${s*.035}" ry="${s*.03}" fill="#00ff88" filter="url(#hn_glow)" opacity="0.9"/>
<ellipse cx="${s*.57}" cy="${s*.38}" rx="${s*.035}" ry="${s*.03}" fill="#00ff88" filter="url(#hn_glow)" opacity="0.9"/>
<circle cx="${s*.43}" cy="${s*.38}" r="${s*.012}" fill="#fff"/>
<circle cx="${s*.57}" cy="${s*.38}" r="${s*.012}" fill="#fff"/>
<!-- 骷髅法杖 -->
<rect x="${s*.73}" y="${s*.2}" width="${s*.02}" height="${s*.55}" fill="url(#hn_staff)" rx="${s*.01}"/>
<!-- 法杖顶部骷髅 -->
<circle cx="${s*.74}" cy="${s*.17}" r="${s*.035}" fill="#e8e0d0" stroke="#8a7a6a" stroke-width="${s*.005}"/>
<circle cx="${s*.725}" cy="${s*.16}" r="${s*.01}" fill="#1a1a1a"/>
<circle cx="${s*.755}" cy="${s*.16}" r="${s*.01}" fill="#1a1a1a"/>
<path d="M ${s*.73},${s*.185} L ${s*.75},${s*.185}" stroke="#1a1a1a" stroke-width="${s*.005}"/>
<!-- 幽灵球 -->
<circle cx="${s*.2}" cy="${s*.35}" r="${s*.035}" fill="url(#hn_orb)" opacity="0.7" filter="url(#hn_glow)"/>
<circle cx="${s*.82}" cy="${s*.55}" r="${s*.03}" fill="url(#hn_orb)" opacity="0.6" filter="url(#hn_glow)"/>
<circle cx="${s*.25}" cy="${s*.7}" r="${s*.025}" fill="url(#hn_orb)" opacity="0.5" filter="url(#hn_glow)"/>
<!-- 灵魂碎片 -->
<path d="M ${s*.18},${s*.5} Q ${s*.15},${s*.45} ${s*.18},${s*.42}" stroke="rgba(100,255,200,0.4)" stroke-width="${s*.008}" fill="none"/>
<path d="M ${s*.83},${s*.4} Q ${s*.86},${s*.37} ${s*.83},${s*.34}" stroke="rgba(100,255,200,0.35)" stroke-width="${s*.006}" fill="none"/>
<!-- 死亡之环 -->
<circle cx="${s*.5}" cy="${s*.52}" r="${s*.39}" stroke="rgba(0,255,150,0.15)" stroke-width="${s*.012}" fill="none" stroke-dasharray="${s*.02} ${s*.04} ${s*.06} ${s*.04}"/>
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
