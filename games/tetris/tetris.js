// 俄罗斯方块游戏
class TetrisGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏设置
        this.gridSize = 30;
        this.cols = 10;
        this.rows = 20;
        this.speed = 1000; // 初始下落速度（毫秒）
        this.level = 1;
        
        // 游戏状态
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.gameRunning = false;
        this.gameOver = false;
        
        // 方块形状定义
        this.shapes = [
            // I
            [
                [0,0,0,0],
                [1,1,1,1],
                [0,0,0,0],
                [0,0,0,0]
            ],
            // J
            [
                [1,0,0],
                [1,1,1],
                [0,0,0]
            ],
            // L
            [
                [0,0,1],
                [1,1,1],
                [0,0,0]
            ],
            // O
            [
                [1,1],
                [1,1]
            ],
            // S
            [
                [0,1,1],
                [1,1,0],
                [0,0,0]
            ],
            // T
            [
                [0,1,0],
                [1,1,1],
                [0,0,0]
            ],
            // Z
            [
                [1,1,0],
                [0,1,1],
                [0,0,0]
            ]
        ];
        
        // 方块颜色
        this.colors = [
            '#00b894', // I - 青色
            '#0984e3', // J - 蓝色
            '#fdcb6e', // L - 黄色
            '#fdcb6e', // O - 黄色
            '#00b894', // S - 青色
            '#a29bfe', // T - 紫色
            '#e17055'  // Z - 橙色
        ];
        
        // 绑定控制
        this.bindControls();
        
        // 调整画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = this.cols * this.gridSize;
        this.canvas.height = this.rows * this.gridSize;
        this.draw();
    }
    
    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.reset();
                    break;
            }
        });
    }
    
    createPiece() {
        const shapeIndex = Math.floor(Math.random() * this.shapes.length);
        return {
            shape: this.shapes[shapeIndex],
            color: this.colors[shapeIndex],
            x: Math.floor(this.cols / 2) - Math.floor(this.shapes[shapeIndex][0].length / 2),
            y: 0
        };
    }
    
    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gameOver = false;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.speed = 1000;
        
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        
        this.gameLoop();
        this.showMessage('游戏开始！使用方向键控制');
    }
    
    togglePause() {
        if (!this.gameRunning || this.gameOver) return;
        
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
            this.showMessage('游戏暂停，按 P 键继续');
        } else {
            this.gameLoop();
            this.showMessage('游戏继续');
        }
    }
    
    reset() {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
        }
        
        this.gameRunning = false;
        this.gameOver = false;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.speed = 1000;
        
        this.draw();
        this.showMessage('游戏已重置，点击开始按钮');
    }
    
    gameLoop() {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
        }
        
        this.gameLoopId = setInterval(() => {
            if (!this.movePiece(0, 1)) {
                this.lockPiece();
                this.checkLines();
                this.spawnPiece();
            }
            this.draw();
        }, this.speed);
    }
    
    movePiece(dx, dy) {
        const newX = this.currentPiece.x + dx;
        const newY = this.currentPiece.y + dy;
        
        if (this.isValidMove(this.currentPiece.shape, newX, newY)) {
            this.currentPiece.x = newX;
            this.currentPiece.y = newY;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        const shape = this.currentPiece.shape;
        const rotated = shape[0].map((_, i) => 
            shape.map(row => row[i]).reverse()
        );
        
        if (this.isValidMove(rotated, this.currentPiece.x, this.currentPiece.y)) {
            this.currentPiece.shape = rotated;
        }
    }
    
    hardDrop() {
        while (this.movePiece(0, 1)) {}
        this.lockPiece();
        this.checkLines();
        this.spawnPiece();
    }
    
    isValidMove(shape, x, y) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (newX < 0 || newX >= this.cols || newY >= this.rows) {
                        return false;
                    }
                    
                    if (newY >= 0 && this.board[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    lockPiece() {
        const { shape, x, y, color } = this.currentPiece;
        
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col]) {
                    const boardY = y + row;
                    const boardX = x + col;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = color;
                    }
                }
            }
        }
        
        // 检查游戏结束
        if (y < 0) {
            this.endGame();
        }
    }
    
    spawnPiece() {
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        
        if (!this.isValidMove(this.currentPiece.shape, this.currentPiece.x, this.currentPiece.y)) {
            this.endGame();
        }
    }
    
    checkLines() {
        let linesCleared = 0;
        
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                // 移除该行
                this.board.splice(row, 1);
                // 添加新的空行到顶部
                this.board.unshift(Array(this.cols).fill(0));
                linesCleared++;
                row++; // 重新检查同一位置（因为行下移了）
            }
        }
        
        if (linesCleared > 0) {
            // 计算得分
            const points = [0, 100, 300, 500, 800][linesCleared] * this.level;
            this.score += points;
            this.lines += linesCleared;
            
            // 每10行升一级
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.speed = Math.max(100, 1000 - (this.level - 1) * 100);
                this.gameLoop();
                this.showMessage(`升级！当前等级: ${this.level}`);
            }
        }
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        clearInterval(this.gameLoopId);
        this.gameLoopId = null;
        
        this.showMessage(`游戏结束！最终分数: ${this.score}`);
        this.drawGameOver();
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#16213e';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.cols; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let i = 0; i <= this.rows; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // 绘制已固定的方块
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col]) {
                    this.drawBlock(col, row, this.board[row][col]);
                }
            }
        }
        
        // 绘制当前方块
        if (this.currentPiece && this.gameRunning) {
            const { shape, x, y, color } = this.currentPiece;
            
            for (let row = 0; row < shape.length; row++) {
                for (let col = 0; col < shape[row].length; col++) {
                    if (shape[row][col]) {
                        this.drawBlock(x + col, y + row, color);
                    }
                }
            }
        }
        
        // 绘制分数信息
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 10, 20);
        this.ctx.fillText(`行数: ${this.lines}`, 10, 45);
        this.ctx.fillText(`等级: ${this.level}`, 10, 70);
        
        if (this.gameOver) {
            this.drawGameOver();
        }
    }
    
    drawBlock(x, y, color) {
        const blockSize = this.gridSize - 2;
        
        // 绘制方块主体
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            x * this.gridSize + 1,
            y * this.gridSize + 1,
            blockSize,
            blockSize
        );
        
        // 绘制高光效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(
            x * this.gridSize + 1,
            y * this.gridSize + 1,
            blockSize * 0.3,
            blockSize * 0.3
        );
        
        // 绘制阴影效果
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(
            x * this.gridSize + blockSize * 0.7,
            y * this.gridSize + blockSize * 0.7,
            blockSize * 0.3,
            blockSize * 0.3
        );
        
        // 绘制边框
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            x * this.gridSize + 1,
            y * this.gridSize + 1,
            blockSize,
            blockSize
        );
    }
    
    drawGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText(`最终分数: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.fillText(`消除行数: ${this.lines}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        this.ctx.fillText(`最高等级: ${this.level}`, this.canvas.width / 2, this.canvas.height / 2 + 70);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('按 R 键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 110);
    }
    
    showMessage(text) {
        const messageEl = document.getElementById('game-message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.style.opacity = '1';
            
            setTimeout(() => {
                messageEl.style.opacity = '0';
            }, 3000);
        }
    }
}

// 初始化俄罗斯方块游戏
function initTetrisGame() {
    const game = new TetrisGame('tetris-canvas');
    
    // 绑定控制按钮
    document.getElementById('start-tetris').addEventListener('click', () => game.start());
    document.getElementById('pause-tetris').addEventListener('click', () => game.togglePause());
    document.getElementById('reset-tetris').addEventListener('click', () => game.reset());
    
    return game;
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTetrisGame);
} else {
    initTetrisGame();
}