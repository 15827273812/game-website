// 贪吃蛇游戏
class SnakeGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏设置
        this.gridSize = 20;
        this.tileCount = 20;
        this.speed = 10;
        
        // 蛇的初始状态
        this.snake = [
            {x: 10, y: 10}
        ];
        this.direction = {x: 0, y: 0};
        this.food = this.generateFood();
        this.score = 0;
        this.gameRunning = false;
        
        // 绑定键盘控制
        this.bindControls();
        
        // 调整画布大小
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const size = Math.min(container.clientWidth, container.clientHeight - 100);
        this.canvas.width = size;
        this.canvas.height = size;
        this.gridSize = size / this.tileCount;
        this.draw();
    }
    
    generateFood() {
        let food;
        let onSnake;
        
        do {
            onSnake = false;
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            // 检查食物是否在蛇身上
            for (let segment of this.snake) {
                if (segment.x === food.x && segment.y === food.y) {
                    onSnake = true;
                    break;
                }
            }
        } while (onSnake);
        
        return food;
    }
    
    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.direction.y === 0) {
                        this.direction = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                    if (this.direction.y === 0) {
                        this.direction = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                    if (this.direction.x === 0) {
                        this.direction = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                    if (this.direction.x === 0) {
                        this.direction = {x: 1, y: 0};
                    }
                    break;
                case ' ':
                    this.togglePause();
                    break;
                case 'r':
                case 'R':
                    this.reset();
                    break;
            }
        });
        
        // 触摸控制（移动端）
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (!this.gameRunning) return;
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            if (!this.gameRunning) return;
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!this.gameRunning) return;
            e.preventDefault();
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // 确定滑动方向
            if (Math.abs(dx) > Math.abs(dy)) {
                // 水平滑动
                if (dx > 0 && this.direction.x === 0) {
                    this.direction = {x: 1, y: 0}; // 右
                } else if (dx < 0 && this.direction.x === 0) {
                    this.direction = {x: -1, y: 0}; // 左
                }
            } else {
                // 垂直滑动
                if (dy > 0 && this.direction.y === 0) {
                    this.direction = {x: 0, y: 1}; // 下
                } else if (dy < 0 && this.direction.y === 0) {
                    this.direction = {x: 0, y: -1}; // 上
                }
            }
        });
    }
    
    start() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.direction = {x: 1, y: 0}; // 初始向右移动
        this.gameLoop();
        
        // 显示游戏开始提示
        this.showMessage('游戏开始！使用方向键控制');
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
            this.showMessage('游戏暂停，按空格键继续');
        } else {
            this.gameLoop();
            this.showMessage('游戏继续');
        }
    }
    
    reset() {
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 0, y: 0};
        this.food = this.generateFood();
        this.score = 0;
        
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
            this.gameLoopId = null;
        }
        
        this.gameRunning = false;
        this.draw();
        this.showMessage('游戏已重置，点击开始按钮');
    }
    
    gameLoop() {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
        }
        
        this.gameLoopId = setInterval(() => {
            this.update();
            this.draw();
        }, 1000 / this.speed);
    }
    
    update() {
        if (!this.gameRunning || this.direction.x === 0 && this.direction.y === 0) {
            return;
        }
        
        // 移动蛇头
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // 检查撞墙
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // 检查撞到自己
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        // 添加新的蛇头
        this.snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            
            // 每得50分增加速度
            if (this.score % 50 === 0) {
                this.speed += 2;
                this.gameLoop();
                this.showMessage(`速度提升！当前速度: ${this.speed}`);
            }
        } else {
            // 没吃到食物，移除蛇尾
            this.snake.pop();
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.ctx.strokeStyle = '#16213e';
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
                gradient.addColorStop(0, '#00b894');
                gradient.addColorStop(1, '#00a085');
                
                // 绘制眼睛
                this.ctx.fillStyle = 'white';
                const eyeSize = this.gridSize / 5;
                
                // 根据方向绘制眼睛
                if (this.direction.x === 1) { // 向右
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.7,
                        segment.y * this.gridSize + this.gridSize * 0.3,
                        eyeSize, eyeSize
                    );
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.7,
                        segment.y * this.gridSize + this.gridSize * 0.6,
                        eyeSize, eyeSize
                    );
                } else if (this.direction.x === -1) { // 向左
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.2,
                        segment.y * this.gridSize + this.gridSize * 0.3,
                        eyeSize, eyeSize
                    );
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.2,
                        segment.y * this.gridSize + this.gridSize * 0.6,
                        eyeSize, eyeSize
                    );
                } else if (this.direction.y === 1) { // 向下
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.3,
                        segment.y * this.gridSize + this.gridSize * 0.7,
                        eyeSize, eyeSize
                    );
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.6,
                        segment.y * this.gridSize + this.gridSize * 0.7,
                        eyeSize, eyeSize
                    );
                } else if (this.direction.y === -1) { // 向上
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.3,
                        segment.y * this.gridSize + this.gridSize * 0.2,
                        eyeSize, eyeSize
                    );
                    this.ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize * 0.6,
                        segment.y * this.gridSize + this.gridSize * 0.2,
                        eyeSize, eyeSize
                    );
                }
            } else {
                // 蛇身
                gradient.addColorStop(0, '#55efc4');
                gradient.addColorStop(1, '#00b894');
            }
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
            
            // 蛇身边框
            this.ctx.strokeStyle = '#00a085';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
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
        foodGradient.addColorStop(0, '#ff7675');
        foodGradient.addColorStop(1, '#d63031');
        
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
        
        // 绘制分数
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`分数: ${this.score}`, 10, 30);
        this.ctx.fillText(`速度: ${this.speed}`, 10, 60);
        
        // 绘制长度
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`长度: ${this.snake.length}`, this.canvas.width - 10, 30);
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoopId);
        this.gameLoopId = null;
        
        this.showMessage(`游戏结束！最终分数: ${this.score}`);
        
        // 绘制游戏结束画面
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 30);
        
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`最终分数: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        this.ctx.fillText(`蛇的长度: ${this.snake.length}`, this.canvas.width / 2, this.canvas.height / 2 + 60);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('按 R 键重新开始', this.canvas.width / 2, this.canvas.height / 2 + 100);
    }
    
    showMessage(text) {
        const messageEl = document.getElementById('game-message');
        if (messageEl) {
            messageEl.textContent = text;
            messageEl.style.opacity = '1';
            
            // 3秒后淡出
            setTimeout(() => {
                messageEl.style.opacity = '0';
            }, 3000);
        }
    }
}

// 初始化游戏
function initSnakeGame() {
    const game = new SnakeGame('snake-canvas');
    
    // 绑定控制按钮
    document.getElementById('start-game').addEventListener('click', () => game.start());
    document.getElementById('pause-game').addEventListener('click', () => game.togglePause());
    document.getElementById('reset-game').addEventListener('click', () => game.reset());
    
    return game;
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSnakeGame);
} else {
    initSnakeGame();
}