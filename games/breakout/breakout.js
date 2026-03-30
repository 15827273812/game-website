// 打砖块游戏
class BreakoutGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.ballRadius = 10;
        this.paddleHeight = 10;
        this.paddleWidth = 75;
        this.brickRowCount = 5;
        this.brickColumnCount = 9;
        this.brickWidth = 75;
        this.brickHeight = 20;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameRunning = false;
        this.gameOver = false;
        
        this.ball = {
            x: 0,
            y: 0,
            dx: 4,
            dy: -4
        };
        
        this.paddle = {
            x: 0,
            y: 0
        };
        
        this.bricks = [];
        this.init();
    }

    init() {
        this.createBricks();
        this.setupCanvas();
        this.resetBallAndPaddle();
        this.draw();
    }

    setupCanvas() {
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.paddle.y = this.canvas.height - this.paddleHeight - 10;
        
        // 添加鼠标和触摸控制
        this.canvas.addEventListener('mousemove', (e) => this.movePaddle(e));
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.movePaddle(e.touches[0]);
        });
    }

    createBricks() {
        this.bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
    }

    resetBallAndPaddle() {
        if (!this.canvas) return;
        
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 30;
        this.ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
        this.ball.dy = -4;
        
        this.paddle.x = (this.canvas.width - this.paddleWidth) / 2;
    }

    drawBall() {
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawPaddle() {
        this.ctx.beginPath();
        this.ctx.rect(this.paddle.x, this.paddle.y, this.paddleWidth, this.paddleHeight);
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawBricks() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status === 1) {
                    const brickX = c * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
                    const brickY = r * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
                    
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    
                    // 不同行的砖块不同颜色
                    const colors = ['#FF9A76', '#FFD166', '#06D6A0', '#118AB2', '#073B4C'];
                    this.ctx.fillStyle = colors[r % colors.length];
                    
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }
    }

    drawScore() {
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(`得分: ${this.score}`, 8, 20);
        this.ctx.fillText(`生命: ${this.lives}`, this.canvas.width - 65, 20);
        this.ctx.fillText(`关卡: ${this.level}`, this.canvas.width / 2 - 25, 20);
    }

    draw() {
        if (!this.ctx || !this.gameRunning) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBricks();
        this.drawBall();
        this.drawPaddle();
        this.drawScore();
        this.collisionDetection();
        
        if (this.gameOver) {
            this.drawGameOver();
            return;
        }
        
        // 移动球
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // 墙壁碰撞检测
        if (this.ball.x + this.ball.dx > this.canvas.width - this.ballRadius || 
            this.ball.x + this.ball.dx < this.ballRadius) {
            this.ball.dx = -this.ball.dx;
        }
        
        if (this.ball.y + this.ball.dy < this.ballRadius) {
            this.ball.dy = -this.ball.dy;
        } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ballRadius) {
            // 底部碰撞检测
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddleWidth) {
                // 击中挡板
                const hitPos = (this.ball.x - this.paddle.x) / this.paddleWidth;
                this.ball.dx = 5 * (hitPos - 0.5);
                this.ball.dy = -this.ball.dy;
            } else {
                // 错过挡板
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                } else {
                    this.resetBallAndPaddle();
                }
            }
        }
        
        requestAnimationFrame(() => this.draw());
    }

    collisionDetection() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                const brick = this.bricks[c][r];
                if (brick.status === 1) {
                    if (this.ball.x > brick.x && 
                        this.ball.x < brick.x + this.brickWidth &&
                        this.ball.y > brick.y && 
                        this.ball.y < brick.y + this.brickHeight) {
                        
                        this.ball.dy = -this.ball.dy;
                        brick.status = 0;
                        this.score += 10;
                        
                        // 检查是否清空所有砖块
                        let allCleared = true;
                        for (let cc = 0; cc < this.brickColumnCount; cc++) {
                            for (let rr = 0; rr < this.brickRowCount; rr++) {
                                if (this.bricks[cc][rr].status === 1) {
                                    allCleared = false;
                                    break;
                                }
                            }
                            if (!allCleared) break;
                        }
                        
                        if (allCleared) {
                            this.levelUp();
                        }
                    }
                }
            }
        }
    }

    levelUp() {
        this.level++;
        this.lives++;
        this.createBricks();
        this.resetBallAndPaddle();
        
        // 增加球速
        this.ball.dx *= 1.1;
        this.ball.dy *= 1.1;
    }

    movePaddle(e) {
        if (!this.canvas || !this.gameRunning) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        
        if (relativeX > 0 && relativeX < this.canvas.width) {
            this.paddle.x = relativeX - this.paddleWidth / 2;
            
            // 限制挡板在画布内
            if (this.paddle.x < 0) {
                this.paddle.x = 0;
            } else if (this.paddle.x + this.paddleWidth > this.canvas.width) {
                this.paddle.x = this.canvas.width - this.paddleWidth;
            }
        }
    }

    drawGameOver() {
        this.ctx.font = '36px Arial';
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#333';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.fillText('点击"重新开始"按钮再来一次', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }

    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.ball.dx = 4;
        this.ball.dy = -4;
        
        this.createBricks();
        this.resetBallAndPaddle();
        this.draw();
    }

    resetGame() {
        this.gameOver = false;
        this.startGame();
    }

    updateStats() {
        const scoreElement = document.getElementById('score-count');
        const livesElement = document.getElementById('lives-count');
        const levelElement = document.getElementById('level-count');
        
        if (scoreElement) scoreElement.textContent = this.score;
        if (livesElement) livesElement.textContent = this.lives;
        if (levelElement) levelElement.textContent = this.level;
    }
}

// 游戏初始化
let breakoutGame = null;

function initBreakoutGame() {
    breakoutGame = new BreakoutGame();
    
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
                <span class="stat-label">生命:</span>
                <span id="lives-count" class="stat-value">3</span>
            </div>
            <div class="stat">
                <span class="stat-label">关卡:</span>
                <span id="level-count" class="stat-value">1</span>
            </div>
        </div>
        <div class="control-buttons">
            <button class="btn-start" onclick="breakoutGame.startGame()">
                <i class="fas fa-play"></i> 开始游戏
            </button>
            <button class="btn-reset" onclick="breakoutGame.resetGame()">
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
window.loadBreakoutGame = function() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div class="game-header">
            <h2><i class="fas fa-table-tennis"></i> 打砖块</h2>
            <p class="game-description">控制挡板反弹小球，击碎所有砖块即可过关。每过一关速度会加快！</p>
        </div>
        <div class="game-canvas-container">
            <canvas id="game-canvas" width="800" height="500"></canvas>
        </div>
        <div class="game-instructions">
            <h3><i class="fas fa-lightbulb"></i> 游戏说明</h3>
            <ul>
                <li>移动鼠标控制挡板左右移动</li>
                <li>用挡板反弹小球击碎砖块</li>
                <li>每击碎一个砖块得10分</li>
                <li>清空所有砖块进入下一关</li>
                <li>错过小球会失去一条生命</li>
                <li>生命值为0时游戏结束</li>
            </ul>
        </div>
    `;
    
    initBreakoutGame();
};