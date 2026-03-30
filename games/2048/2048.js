// 2048游戏
class Game2048 {
    constructor() {
        this.gridSize = 4;
        this.grid = [];
        this.score = 0;
        this.bestScore = localStorage.getItem('2048_best_score') || 0;
        this.gameOver = false;
        this.won = false;
        
        this.init();
    }

    init() {
        this.createEmptyGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        this.updateStats();
        
        // 添加键盘控制
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    createEmptyGrid() {
        this.grid = [];
        for (let i = 0; i < this.gridSize; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            // 90%概率生成2，10%概率生成4
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    getTileColor(value) {
        const colors = {
            0: '#CDC1B4',
            2: '#EEE4DA',
            4: '#EDE0C8',
            8: '#F2B179',
            16: '#F59563',
            32: '#F67C5F',
            64: '#F65E3B',
            128: '#EDCF72',
            256: '#EDCC61',
            512: '#EDC850',
            1024: '#EDC53F',
            2048: '#EDC22E',
            4096: '#3C3A32'
        };
        
        return colors[value] || '#3C3A32';
    }

    getTileTextColor(value) {
        return value <= 4 ? '#776E65' : '#F9F6F2';
    }

    render() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = '';
        
        const gridElement = document.createElement('div');
        gridElement.className = 'grid-2048';
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = this.grid[i][j] === 0 ? '' : this.grid[i][j];
                
                const value = this.grid[i][j];
                tile.style.backgroundColor = this.getTileColor(value);
                tile.style.color = this.getTileTextColor(value);
                
                // 根据数字大小调整字体大小
                if (value >= 1000) {
                    tile.style.fontSize = '24px';
                } else if (value >= 100) {
                    tile.style.fontSize = '28px';
                } else if (value >= 10) {
                    tile.style.fontSize = '32px';
                } else {
                    tile.style.fontSize = '36px';
                }
                
                gridElement.appendChild(tile);
            }
        }
        
        gameContainer.appendChild(gridElement);
    }

    move(direction) {
        if (this.gameOver) return false;
        
        let moved = false;
        const oldGrid = this.grid.map(row => [...row]);
        
        switch(direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.render();
            this.updateStats();
            this.checkGameStatus();
        }
        
        return moved;
    }

    moveLeft() {
        let moved = false;
        
        for (let i = 0; i < this.gridSize; i++) {
            // 移除空格
            const row = this.grid[i].filter(cell => cell !== 0);
            
            // 合并相同数字
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            
            // 填充空格
            while (row.length < this.gridSize) {
                row.push(0);
            }
            
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            
            this.grid[i] = row;
        }
        
        return moved;
    }

    moveRight() {
        let moved = false;
        
        for (let i = 0; i < this.gridSize; i++) {
            // 移除空格并反转
            const row = this.grid[i].filter(cell => cell !== 0).reverse();
            
            // 合并相同数字
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            
            // 填充空格并反转回来
            while (row.length < this.gridSize) {
                row.push(0);
            }
            
            row.reverse();
            
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(row)) {
                moved = true;
            }
            
            this.grid[i] = row;
        }
        
        return moved;
    }

    moveUp() {
        let moved = false;
        
        for (let j = 0; j < this.gridSize; j++) {
            // 获取列数据
            const column = [];
            for (let i = 0; i < this.gridSize; i++) {
                column.push(this.grid[i][j]);
            }
            
            // 移除空格
            const filtered = column.filter(cell => cell !== 0);
            
            // 合并相同数字
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    this.score += filtered[i];
                    filtered.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // 填充空格
            while (filtered.length < this.gridSize) {
                filtered.push(0);
            }
            
            // 更新列
            for (let i = 0; i < this.gridSize; i++) {
                if (this.grid[i][j] !== filtered[i]) {
                    moved = true;
                }
                this.grid[i][j] = filtered[i];
            }
        }
        
        return moved;
    }

    moveDown() {
        let moved = false;
        
        for (let j = 0; j < this.gridSize; j++) {
            // 获取列数据并反转
            const column = [];
            for (let i = 0; i < this.gridSize; i++) {
                column.push(this.grid[i][j]);
            }
            
            const filtered = column.filter(cell => cell !== 0).reverse();
            
            // 合并相同数字
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    this.score += filtered[i];
                    filtered.splice(i + 1, 1);
                    moved = true;
                }
            }
            
            // 填充空格并反转回来
            while (filtered.length < this.gridSize) {
                filtered.push(0);
            }
            
            filtered.reverse();
            
            // 更新列
            for (let i = 0; i < this.gridSize; i++) {
                if (this.grid[i][j] !== filtered[i]) {
                    moved = true;
                }
                this.grid[i][j] = filtered[i];
            }
        }
        
        return moved;
    }

    handleKeyPress(e) {
        if (this.gameOver) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.move('right');
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.move('down');
                break;
        }
    }

    checkGameStatus() {
        // 检查是否达到2048
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 2048 && !this.won) {
                    this.won = true;
                    setTimeout(() => {
                        alert('🎉 恭喜！你成功合成了2048！');
                    }, 100);
                }
            }
        }
        
        // 检查游戏是否结束
        if (this.isGameOver()) {
            this.gameOver = true;
            setTimeout(() => {
                alert('游戏结束！没有可移动的方块了。');
            }, 100);
        }
    }

    isGameOver() {
        // 检查是否有空格
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否有可合并的相邻方块
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const current = this.grid[i][j];
                
                // 检查右侧
                if (j < this.gridSize - 1 && current === this.grid[i][j + 1]) {
                    return false;
                }
                
                // 检查下方
                if (i < this.gridSize - 1 && current === this.grid[i + 1][j]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    updateStats() {
        const scoreElement = document.getElementById('score-count');
        const bestElement = document.getElementById('best-count');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (bestElement) {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                localStorage.setItem('2048_best_score', this.bestScore);
            }
            bestElement.textContent = this.bestScore;
        }
    }

    resetGame() {
        this.grid = [];
        this.score = 0;
        this.gameOver = false;
        this.won = false;
        
        this.createEmptyGrid();
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        this.updateStats();
    }
}

// 游戏初始化
let game2048 = null;

function init2048Game() {
    game2048 = new Game2048();
    
    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'game-controls';
    controls.innerHTML = `
        <div class="stats">
            <div class="stat">
                <span class="stat-label">得分:</span>
                <span id="score-count" class="stat-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">最高分:</span>
                <span id="best-count" class="stat-value">${localStorage.getItem('2048_best_score') || 0}</span>
            </div>
        </div>
        <div class="control-buttons">
            <button class="btn-move" onclick="game2048.move('left')">
                <i class="fas fa-arrow-left"></i> 左
            </button>
            <button class="btn-move" onclick="game2048.move('up')">
                <i class="fas fa-arrow-up"></i> 上
            </button>
            <button class="btn-move" onclick="game2048.move('down')">
                <i class="fas fa-arrow-down"></i> 下
            </button>
            <button class="btn-move" onclick="game2048.move('right')">
                <i class="fas fa-arrow-right"></i> 右
            </button>
            <button class="btn-reset" onclick="game2048.resetGame()">
                <i class="fas fa-redo"></i> 重新开始
            </button>
        </div>
    `;
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.parentNode.insertBefore(controls, gameContainer);
    }
}

// 导出游戏函数
window.load2048Game = function() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div class="game-header">
            <h2><i class="fas fa-th-large"></i> 2048</h2>
            <p class="game-description">使用方向键移动方块，当两个相同数字的方块碰撞时会合并成它们的和。尝试合成2048方块！</p>
        </div>
        <div id="game-container"></div>
        <div class="game-instructions">
            <h3><i class="fas fa-lightbulb"></i> 游戏说明</h3>
            <ul>
                <li>使用键盘方向键或屏幕按钮移动方块</li>
                <li>相同数字的方块碰撞时会合并</li>
                <li>每次移动后会在空白处随机生成一个2或4</li>
                <li>目标是合成一个2048的方块</li>
                <li>当没有空格且无法合并时游戏结束</li>
                <li><strong>提示：</strong>尽量保持最大数字在角落</li>
            </ul>
        </div>
    `;
    
    init2048Game();
};