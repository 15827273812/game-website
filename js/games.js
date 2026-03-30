// 游戏逻辑文件
// 这里包含所有游戏的完整实现

// 贪吃蛇游戏
class SnakeGame {
    constructor(container) {
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.gridSize = 20;
        this.tileCount = 20;
        this.snake = [];
        this.food = { x: 0, y: 0 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gameLoop = null;
        
        this.init();
    }
    
    init() {
        // 创建画布
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.tileCount * this.gridSize;
        this.canvas.height = this.tileCount * this.gridSize;
        this.canvas.style.border = '2px solid white';
        this.canvas.style.borderRadius = '8px';
        this.ctx = this.canvas.getContext('2d');
        
        // 清空容器并添加画布
        this.container.innerHTML = '';
        this.container.appendChild(this.canvas);
        
        // 添加分数显示
        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = 'snake-score';
        scoreDisplay.style.cssText = `
            color: white;
            font-size: 1.2rem;
            margin-top: 15px;
            font-weight: bold;
        `;
        scoreDisplay.textContent = `得分: ${this.score}`;
        this.container.appendChild(scoreDisplay);
        
        // 初始化游戏
        this.resetGame();
        this.draw();
        
        // 添加键盘控制
        document.addEventListener('keydown', this.keyDown.bind(this));
        
        // 添加触摸控制（移动端）
        this.addTouchControls();
    }
    
    resetGame() {
        this.snake = [
            { x: 10, y: 10 }
        ];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.generateFood();
        this.gameRunning = true;
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
        
        this.gameLoop = setInterval(() => this.update(), 100);
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // 确保食物不在蛇身上
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                break;
            }
        }
    }
    
    update() {
        if (!this.gameRunning) return;
        
        // 移动蛇头
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // 检查碰撞
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount ||
            this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        // 添加新头
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snake-score').textContent = `得分: ${this.score}`;
            this.generateFood();
        } else {
            // 移除尾部
            this.snake.pop();
        }
        
        this.draw();
    }
    
    checkCollision(head) {
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        return false;
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // 绘制蛇
        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createLinearGradient(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                (segment.x + 1) * this.gridSize,
                (segment.y + 1) * this.gridSize
            );
            
            if (index === 0) {
                // 蛇头
                gradient.addColorStop(0, '#4cc9f0');
                gradient.addColorStop(1, '#4361ee');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
                
                // 眼睛
                this.ctx.fillStyle = 'white';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                // 根据方向调整眼睛位置
                let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
                
                if (this.dx === 1) { // 向右
                    leftEyeX = segment.x * this.gridSize + this.gridSize - eyeOffset;
                    leftEyeY = segment.y * this.gridSize + eyeOffset;
                    rightEyeX = segment.x * this.gridSize + this.gridSize - eyeOffset;
                    rightEyeY = segment.y * this.gridSize + this.gridSize - eyeOffset;
                } else if (this.dx === -1) { // 向左
                    leftEyeX = segment.x * this.gridSize + eyeOffset;
                    leftEyeY = segment.y * this.gridSize + eyeOffset;
                    rightEyeX = segment.x * this.gridSize + eyeOffset;
                    rightEyeY = segment.y * this.gridSize + this.gridSize - eyeOffset;
                } else if (this.dy === 1) { // 向下
                    leftEyeX = segment.x * this.gridSize + eyeOffset;
                    leftEyeY = segment.y * this.gridSize + this.gridSize - eyeOffset;
                    rightEyeX = segment.x * this.gridSize + this.gridSize - eyeOffset;
                    rightEyeY = segment.y * this.gridSize + this.gridSize - eyeOffset;
                } else { // 向上或初始状态
                    leftEyeX = segment.x * this.gridSize + eyeOffset;
                    leftEyeY = segment.y * this.gridSize + eyeOffset;
                    rightEyeX = segment.x * this.gridSize + this.gridSize - eyeOffset;
                    rightEyeY = segment.y * this.gridSize + eyeOffset;
                }
                
                this.ctx.beginPath();
                this.ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                // 蛇身
                gradient.addColorStop(0, '#7209b7');
                gradient.addColorStop(1, '#3a0ca3');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
            }
        });
        
        // 绘制食物
        const foodGradient = this.ctx.createRadialGradient(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            0,
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2
        );
        
        foodGradient.addColorStop(0, '#f72585');
        foodGradient.addColorStop(1, '#b5179e');
        
        this.ctx.fillStyle = foodGradient;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        
        // 食物光泽效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 3,
            this.food.y * this.gridSize + this.gridSize / 3,
            this.gridSize / 6,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    keyDown(event) {
        if (!this.gameRunning) return;
        
        const key = event.key;
        
        // 防止反向移动
        switch(key) {
            case 'ArrowLeft':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowUp':
                if (this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowRight':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
            case 'ArrowDown':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case ' ':
                // 空格键暂停/继续
                this.gameRunning = !this.gameRunning;
                break;
            case 'r':
            case 'R':
                this.resetGame();
                break;
        }
    }
    
    addTouchControls() {
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 60px);
            grid-template-rows: repeat(3, 60px);
            gap: 10px;
            margin-top: 20px;
            justify-content: center;
        `;
        
        // 创建方向控制按钮
        const directions = [
            { id: 'up', text: '↑', x: 1, y: 0, dx: 0, dy: -1 },
            { id: 'left', text: '←', x: 0, y: 1, dx: -1, dy: 0 },
            { id: 'center', text: '○', x: 1, y: 1 },
            { id: 'right', text: '→', x: 2, y: 1, dx: 1, dy: 0 },
            { id: 'down', text: '↓', x: 1, y: 2, dx: 0, dy: 1 }
        ];
        
        // 创建3x3网格
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const button = document.createElement('button');
                button.style.cssText = `
                    width: 60px;
                    height: 60px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    grid-column: ${x + 1};
                    grid-row: ${y + 1};
                    transition: all 0.2s;
                `;
                
                // 查找对应的方向
                const dir = directions.find(d => d.x === x && d.y === y);
                if (dir) {
                    button.id = `snake-${dir.id}`;
                    button.textContent = dir.text;
                    
                    if (dir.dx !== undefined) {
                        button.addEventListener('touchstart', (e) => {
                            e.preventDefault();
                            if (this.gameRunning) {
                                // 防止反向移动
                                if ((dir.dx === -1 && this.dx !== 1) ||
                                    (dir.dx === 1 && this.dx !== -1) ||
                                    (dir.dy === -1 && this.dy !== 1) ||
                                    (dir.dy === 1 && this.dy !== -1)) {
                                    this.dx = dir.dx;
                                    this.dy = dir.dy;
                                }
                            }
                            button.style.background = 'rgba(255, 255, 255, 0.4)';
                        });
                        
                        button.addEventListener('touchend', (e) => {
                            e.preventDefault();
                            button.style.background = 'rgba(255, 255, 255, 0.2)';
                        });
                        
                        button.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            if (this.gameRunning) {
                                // 防止反向移动
                                if ((dir.dx === -1 && this.dx !== 1) ||
                                    (dir.dx === 1 && this.dx !== -1) ||
                                    (dir.dy === -1 && this.dy !== 1) ||
                                    (dir.dy === 1 && this.dy !== -1)) {
                                    this.dx = dir.dx;
                                    this.dy = dir.dy;
                                }
                            }
                            button.style.background = 'rgba(255, 255, 255, 0.4)';
                        });
                        
                        button.addEventListener('mouseup', (e) => {
                            e.preventDefault();
                            button.style.background = 'rgba(255, 255, 255, 0.2)';
                        });
                    }
                } else {
                    button.style.visibility = 'hidden';
                }
                
                controls.appendChild(button);
            }
        }
        
        this.container.appendChild(controls);
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        
        // 显示游戏结束画面
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('按 R 键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
}

// 井字棋游戏
class TicTacToeGame {
    constructor(container) {
        this.container = container;
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
            [0, 4, 8], [2, 4, 6]             // 对角线
        ];
        
        this.init();
    }
    
    init() {
        this.container.innerHTML = '';
        
        // 创建游戏标题
        const title = document.createElement('h3');
        title.textContent = '井字棋 (X 先手)';
        title.style.cssText = `
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.8rem;
        `;
        this.container.appendChild(title);
        
        // 创建状态显示
        const status = document.createElement('div');
        status.id = 'tictactoe-status';
        status.style.cssText = `
            color: white;
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.2rem;
            min-height: 30px;
        `;
        status.textContent = `当前玩家: ${this.currentPlayer}`;
        this.container.appendChild(status);
        
        // 创建游戏板
        const board = document.createElement('div');
        board.style.cssText = `
            display: grid;
            grid-template-columns: repeat(3, 100px);
            grid-template-rows: repeat(3, 100px);
            gap: 10px;
            margin: 0 auto;
            width: 320px;
        `;
        
        // 创建格子
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.dataset.index = i;
            cell.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px