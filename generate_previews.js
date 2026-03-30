// 生成游戏预览图片
const fs = require('fs');
const path = require('path');

const games = [
    { name: 'snake', title: '贪吃蛇', color: '#4CAF50', icon: '🐍' },
    { name: 'tetris', title: '俄罗斯方块', color: '#2196F3', icon: '🧩' },
    { name: 'tictactoe', title: '井字棋', color: '#FF9800', icon: '❌⭕' },
    { name: 'memory', title: '记忆翻牌', color: '#9C27B0', icon: '🧠' },
    { name: 'breakout', title: '打砖块', color: '#F44336', icon: '🎾' },
    { name: '2048', title: '2048', color: '#FFC107', icon: '🔢' }
];

// 创建预览图片目录
const imagesDir = path.join(__dirname, 'images', 'games');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// 为每个游戏生成预览图片
games.forEach(game => {
    const svgContent = `
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad${game.name}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${game.color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${game.color}88;stop-opacity:1" />
        </linearGradient>
        <filter id="shadow${game.name}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#00000040"/>
        </filter>
    </defs>
    
    <rect width="300" height="200" rx="15" ry="15" fill="url(#grad${game.name})" filter="url(#shadow${game.name})"/>
    
    <rect x="20" y="20" width="260" height="160" rx="10" ry="10" fill="#FFFFFF20" stroke="#FFFFFF40" stroke-width="2"/>
    
    <text x="150" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">
        ${game.icon}
    </text>
    
    <text x="150" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white">
        ${game.title}
    </text>
    
    <text x="150" y="170" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#FFFFFFCC">
        点击开始游戏
    </text>
</svg>`;

    const filePath = path.join(imagesDir, `${game.name}-preview.svg`);
    fs.writeFileSync(filePath, svgContent.trim());
    console.log(`✅ 已生成 ${game.title} 预览图片: ${filePath}`);
});

console.log('\n🎉 所有游戏预览图片已生成完成！');