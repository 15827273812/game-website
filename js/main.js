// 主JavaScript文件
document.addEventListener('DOMContentLoaded', function() {
    // 主题切换
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // 检查本地存储的主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    }
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 表单提交
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢你的反馈！我们会认真考虑你的建议。');
            this.reset();
        });
    }
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.backgroundColor = 'rgba(248, 249, 250, 0.9)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.backdropFilter = 'none';
            navbar.style.backgroundColor = 'var(--light-color)';
        }
    });
    
    // 游戏预览动画
    const previewItems = document.querySelectorAll('.preview-item');
    previewItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        item.classList.add('animate-preview');
    });
    
    // 显示邮箱
    window.showEmail = function() {
        alert('请通过GitHub Issues提交反馈：https://github.com/yourusername/game-center/issues');
    };
    
    // 初始化游戏区域
    initGameArea();
});

// 游戏加载函数
function loadGame(gameName) {
    const gameTitle = document.getElementById('game-title');
    const gameArea = document.getElementById('game-area');
    const restartBtn = document.getElementById('restart-game');
    const backBtn = document.getElementById('back-to-games');
    
    // 更新标题
    const gameNames = {
        'snake': '贪吃蛇',
        'tetris': '俄罗斯方块',
        'tictactoe': '井字棋',
        'memory': '记忆翻牌',
        'breakout': '打砖块',
        '2048': '2048'
    };
    
    gameTitle.textContent = gameNames[gameName] || '游戏';
    
    // 显示控制按钮
    restartBtn.style.display = 'inline-flex';
    backBtn.style.display = 'inline-flex';
    
    // 清空游戏区域
    gameArea.innerHTML = '';
    
    // 创建游戏画布容器
    const gameCanvas = document.createElement('div');
    gameCanvas.id = 'game-canvas';
    gameCanvas.className = 'game-canvas';
    
    // 根据游戏类型加载不同的游戏
    switch(gameName) {
        case 'snake':
            loadSnakeGame(gameCanvas);
            break;
        case 'tetris':
            loadTetrisGame(gameCanvas);
            break;
        case 'tictactoe':
            loadTicTacToeGame(gameCanvas);
            break;
        case 'memory':
            loadMemoryGame(gameCanvas);
            break;
        case 'breakout':
            loadBreakoutGame(gameCanvas);
            break;
        case '2048':
            load2048Game(gameCanvas);
            break;
        default:
            gameCanvas.innerHTML = '<p>游戏加载中...</p>';
    }
    
    gameArea.appendChild(gameCanvas);
    
    // 滚动到游戏区域
    document.getElementById('game-container').scrollIntoView({ behavior: 'smooth' });
}

// 隐藏游戏
function hideGame() {
    const gameArea = document.getElementById('game-area');
    const gameTitle = document.getElementById('game-title');
    const restartBtn = document.getElementById('restart-game');
    const backBtn = document.getElementById('back-to-games');
    
    gameTitle.textContent = '选择游戏开始游玩';
    restartBtn.style.display = 'none';
    backBtn.style.display = 'none';
    
    gameArea.innerHTML = `
        <div class="game-placeholder">
            <i class="fas fa-gamepad"></i>
            <p>从左侧选择一款游戏开始游玩</p>
        </div>
    `;
}

// 重新开始游戏
function restartGame() {
    const gameCanvas = document.getElementById('game-canvas');
    if (gameCanvas) {
        const currentGame = gameCanvas.getAttribute('data-game');
        if (currentGame) {
            loadGame(currentGame);
        }
    }
}

// 初始化游戏区域
function initGameArea() {
    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes previewFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .animate-preview {
            animation: previewFloat 3s ease-in-out infinite;
        }
        
        .game-canvas {
            width: 100%;
            height: 500px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: var(--border-radius);
            overflow: hidden;
        }
        
        .game-board {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .game-instructions {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-size: 0.9rem;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// 贪吃蛇游戏加载函数
function loadSnakeGame(container) {
    container.setAttribute('data-game', 'snake');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px; width: 100%;">
            <h3 style="margin-bottom: 20px;">贪吃蛇游戏</h3>
            <p style="margin-bottom: 10px;">使用方向键或触摸控制蛇的移动</p>
            
            <div id="game-message" style="
                position: absolute;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 100;
                opacity: 0;
                transition: opacity 0.3s;
            "></div>
            
            <div class="game-canvas">
                <div class="game-control-hint">
                    <strong>控制说明：</strong> 点击游戏区域获得焦点，然后使用方向键或WASD控制
                </div>
                <div class="game-status">
                    <div class="game-score">得分: <span id="snake-score">0</span></div>
                    <div class="game-controls">
                        <button class="control-btn" onclick="window.snakeGame?.start()">开始</button>
                        <button class="control-btn secondary" onclick="window.snakeGame?.reset()">重置</button>
                        <button class="control-btn secondary" onclick="window.snakeGame?.togglePause()">暂停</button>
                    </div>
                </div>
                <canvas id="snake-canvas" tabindex="0"></canvas>
                
                <div style="margin-top: 20px; display: flex; justify-content: center; gap: 15px;">
                    <button id="start-game" style="
                        background: linear-gradient(135deg, #00b894, #00a085);
                        color: white;
                        border: none;
                        padding: 10px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <i class="fas fa-play"></i> 开始游戏
                    </button>
                    
                    <button id="pause-game" style="
                        background: linear-gradient(135deg, #fdcb6e, #e17055);
                        color: white;
                        border: none;
                        padding: 10px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <i class="fas fa-pause"></i> 暂停/继续
                    </button>
                    
                    <button id="reset-game" style="
                        background: linear-gradient(135deg, #ff7675, #d63031);
                        color: white;
                        border: none;
                        padding: 10px 25px;
                        border-radius: 25px;
                        font-size: 16px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    ">
                        <i class="fas fa-redo"></i> 重新开始
                    </button>
                </div>
            </div>
            
            <div class="game-instructions" style="margin-top: 20px;">
                <p><strong>控制方式：</strong></p>
                <p>键盘：← ↑ → ↓ 控制方向 | 空格键暂停 | R键重新开始</p>
                <p>触摸：在屏幕上滑动控制方向</p>
                <p><strong>游戏规则：</strong>吃到红色食物增加长度和分数，避免撞墙或撞到自己</p>
            </div>
        </div>
    `;
    
    // 动态加载贪吃蛇游戏脚本
    const script = document.createElement('script');
    script.src = 'js/snake.js';
    script.onload = function() {
        console.log('贪吃蛇游戏加载完成');
    };
    document.head.appendChild(script);
}

function loadTetrisGame(container) {
    container.setAttribute('data-game', 'tetris');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h3 style="margin-bottom: 20px;">俄罗斯方块</h3>
            <p style="margin-bottom: 30px;">使用方向键旋转和移动方块</p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; display: inline-block;">
                <div style="display: grid; grid-template-columns: repeat(10, 30px); grid-template-rows: repeat(20, 30px); gap: 2px; margin: 0 auto;">
                    ${Array(200).fill().map((_, i) => 
                        `<div style="background: rgba(255, 255, 255, 0.2); border-radius: 4px;"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="game-instructions">
                <p>← → 移动 | ↑ 旋转 | ↓ 加速下落 | 空格键硬降</p>
            </div>
        </div>
    `;
}

function loadTicTacToeGame(container) {
    container.setAttribute('data-game', 'tictactoe');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h3 style="margin-bottom: 20px;">井字棋</h3>
            <p style="margin-bottom: 30px;">点击格子放置 X 或 O</p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; display: inline-block;">
                <div style="display: grid; grid-template-columns: repeat(3, 80px); grid-template-rows: repeat(3, 80px); gap: 5px; margin: 0 auto;">
                    ${Array(9).fill().map((_, i) => 
                        `<div style="background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer;"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="game-instructions">
                <p>点击格子开始游戏 | 与AI对战 | 先连成一条线者获胜</p>
            </div>
        </div>
    `;
}

function loadMemoryGame(container) {
    container.setAttribute('data-game', 'memory');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h3 style="margin-bottom: 20px;">记忆翻牌</h3>
            <p style="margin-bottom: 30px;">点击卡片找到匹配的图案</p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; display: inline-block;">
                <div style="display: grid; grid-template-columns: repeat(4, 70px); grid-template-rows: repeat(4, 70px); gap: 10px; margin: 0 auto;">
                    ${Array(16).fill().map((_, i) => 
                        `<div style="background: rgba(255, 255, 255, 0.3); border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="game-instructions">
                <p>点击卡片翻开 | 找到所有匹配的卡片 | 计时模式</p>
            </div>
        </div>
    `;
}

function loadBreakoutGame(container) {
    container.setAttribute('data-game', 'breakout');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h3 style="margin-bottom: 20px;">打砖块</h3>
            <p style="margin-bottom: 30px;">使用鼠标或方向键移动挡板</p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; display: inline-block; position: relative;">
                <div style="width: 400px; height: 300px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; position: relative;">
                    <!-- 砖块 -->
                    <div style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); display: grid; grid-template-columns: repeat(8, 40px); gap: 5px;">
                        ${Array(32).fill().map((_, i) => 
                            `<div style="background: rgba(255, 100, 100, 0.8); height: 20px; border-radius: 4px;"></div>`
                        ).join('')}
                    </div>
                    <!-- 挡板 -->
                    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: 80px; height: 15px; background: rgba(255, 255, 255, 0.9); border-radius: 8px;"></div>
                    <!-- 球 -->
                    <div style="position: absolute; bottom: 40px; left: 50%; width: 15px; height: 15px; background: white; border-radius: 50%;"></div>
                </div>
            </div>
            <div class="game-instructions">
                <p>← → 移动挡板 | 反弹小球击碎砖块 | 不要漏球</p>
            </div>
        </div>
    `;
}

function load2048Game(container) {
    container.setAttribute('data-game', '2048');
    container.innerHTML = `
        <div style="text-align: center; color: white; padding: 20px;">
            <h3 style="margin-bottom: 20px;">2048</h3>
            <p style="margin-bottom: 30px;">滑动合并相同数字，合成2048</p>
            <div style="background: rgba(255, 255, 255, 0.1); padding: 30px; border-radius: 10px; display: inline-block;">
                <div style="display: grid; grid-template-columns: repeat(4, 70px); grid-template-rows: repeat(4, 70px); gap: 10px; margin: 0 auto;">
                    ${Array(16).fill().map((_, i) => 
                        `<div style="background: rgba(255, 255, 255, 0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: bold;"></div>`
                    ).join('')}
                </div>
            </div>
            <div class="game-instructions">
                <p>← ↑ → ↓ 滑动合并 | 合成2048获胜 | 空格键重新开始</p>
            </div>
        </div>
    `;
}