// 井字棋游戏
class TicTacToeGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = 'player'; // player, ai
        this.score = { X: 0, O: 0, ties: 0 };
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    render() {
        this.container.innerHTML = `
            <div style="text-align: center; color: white; max-width: 500px; margin: 0 auto;">
                <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 10px;">井字棋</h3>
                    <p style="margin-bottom: 20px;">两个玩家轮流在3×3的棋盘上放置标记</p>
                    
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 20px;
                    ">
                        <div style="display: flex; justify-content: space-around; margin-bottom: 15px;">
                            <div style="text-align: center;">
                                <div style="font-size: 14px; opacity: 0.8;">当前玩家</div>
                                <div id="current-player" style="
                                    font-size: 32px;
                                    font-weight: bold;
                                    color: ${this.currentPlayer === 'X' ? '#00b894' : '#0984e3'};
                                    margin: 5px 0;
                                ">${this.currentPlayer}</div>
                            </div>
                            
                            <div style="text-align: center;">
                                <div style="font-size: 14px; opacity: 0.8;">游戏状态</div>
                                <div id="game-status" style="
                                    font-size: 16px;
                                    font-weight: bold;
                                    color: #fdcb6e;
                                    margin: 5px 0;
                                ">${this.gameActive ? '进行中' : '已结束'}</div>
                            </div>
                        </div>
                        
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(3, 1fr);
                            gap: 10px;
                            background: rgba(0, 0, 0, 0.3);
                            padding: 10px;
                            border-radius: 8px;
                        " id="game-board">
                            ${this.board.map((cell, index) => `
                                <div class="cell" data-index="${index}" style="
                                    aspect-ratio: 1;
                                    background: rgba(255, 255, 255, 0.1);
                                    border-radius: 8px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 48px;
                                    font-weight: bold;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                    color: ${cell === 'X' ? '#00b894' : cell === 'O' ? '#0984e3' : 'transparent'};
                                ">
                                    ${cell || ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div style="
                        background: rgba(255, 255, 255, 0.1);
                        padding: 15px;
                        border-radius: 10px;
                        margin-bottom: 20px;
                    ">
                        <h4 style="margin-bottom: 15px; color: #fdcb6e;">得分统计</h4>
                        <div style="display: flex; justify-content: space-around;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; color: #00b894; font-weight: bold;">${this.score.X}</div>
                                <div style="font-size: 14px; opacity: 0.8;">玩家 X</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; color: #fdcb6e; font-weight: bold;">${this.score.ties}</div>
                                <div style="font-size: 14px; opacity: 0.8;">平局</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; color: #0984e3; font-weight: bold;">${this.score.O}</div>
                                <div style="font-size: 14px; opacity: 0.8;">玩家 O</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 20px;">
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
                        
                        <button id="switch-mode" style="
                            background: linear-gradient(135deg, #a29bfe, #6c5ce7);
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
                            <i class="fas fa-robot"></i> ${this.gameMode === 'player' ? '对战AI' : '双人对战'}
                        </button>
                    </div>
                </div>
                
                <div class="game-instructions" style="text-align: left; padding: 15px; background: rgba(255, 255, 255, 0.05); border-radius: 8px;">
                    <p><strong>游戏规则：</strong></p>
                    <p>• 两个玩家轮流在3×3的棋盘上放置标记（X和O）</p>
                    <p>• 先连成一条直线（横、竖、斜）的玩家获胜</p>
                    <p>• 如果棋盘填满且无人获胜，则为平局</p>
                    <p><strong>控制方式：</strong></p>
                    <p>• 点击棋盘上的格子放置标记</p>
                    <p>• 可以切换双人对战或对战AI模式</p>
                </div>
            </div>
        `;
        
        // 更新单元格悬停效果
        const cells = this.container.querySelectorAll('.cell');
        cells.forEach(cell => {
            if (!cell.textContent && this.gameActive) {
                cell.addEventListener('mouseenter', () => {
                    cell.style.background = 'rgba(255, 255, 255, 0.2)';
                    cell.style.transform = 'scale(1.05)';
                    cell.textContent = this.currentPlayer;
                    cell.style.color = this.currentPlayer === 'X' ? 'rgba(0, 184, 148, 0.3)' : 'rgba(9, 132, 227, 0.3)';
                });
                
                cell.addEventListener('mouseleave', () => {
                    if (!cell.getAttribute('data-occupied')) {
                        cell.style.background = 'rgba(255, 255, 255, 0.1)';
                        cell.style.transform = 'scale(1)';
                        cell.textContent = '';
                        cell.style.color = 'transparent';
                    }
                });
            }
        });
    }
    
    bindEvents() {
        // 绑定棋盘点击事件
        const board = this.container.querySelector('#game-board');
        board.addEventListener('click', (e) => {
            const cell = e.target.closest('.cell');
            if (cell && this.gameActive) {
                const index = parseInt(cell.getAttribute('data-index'));
                this.makeMove(index);
            }
        });
        
        // 绑定重置按钮
        const resetBtn = this.container.querySelector('#reset-game');
        resetBtn.addEventListener('click', () => this.resetGame());
        
        // 绑定模式切换按钮
        const modeBtn = this.container.querySelector('#switch-mode');
        modeBtn.addEventListener('click', () => this.switchMode());
    }
    
    makeMove(index) {
        if (!this.gameActive || this.board[index] !== '') {
            return;
        }
        
        // 玩家移动
        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        
        // 检查游戏状态
        if (this.checkWin()) {
            this.endGame(`${this.currentPlayer} 获胜！`);
            this.score[this.currentPlayer]++;
            return;
        }
        
        if (this.checkTie()) {
            this.endGame('平局！');
            this.score.ties++;
            return;
        }
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
        
        // 如果是AI模式且轮到AI
        if (this.gameMode === 'ai' && this.currentPlayer === 'O' && this.gameActive) {
            setTimeout(() => this.aiMove(), 500);
        }
    }
    
    aiMove() {
        if (!this.gameActive) return;
        
        // 简单的AI逻辑：优先赢，其次阻止玩家赢，否则随机
        let move = this.findWinningMove('O'); // 寻找AI的获胜位置
        
        if (move === -1) {
            move = this.findWinningMove('X'); // 阻止玩家获胜
        }
        
        if (move === -1) {
            // 随机选择空位
            const emptyCells = this.board
                .map((cell, index) => cell === '' ? index : -1)
                .filter(index => index !== -1);
            
            if (emptyCells.length > 0) {
                move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            }
        }
        
        if (move !== -1) {
            this.makeMove(move);
        }
    }
    
    findWinningMove(player) {
        // 检查所有可能的获胜位置
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
            [0, 4, 8], [2, 4, 6]             // 斜
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            const cells = [this.board[a], this.board[b], this.board[c]];
            
            // 检查是否有两个是当前玩家，一个是空的
            const playerCount = cells.filter(cell => cell === player).length;
            const emptyCount = cells.filter(cell => cell === '').length;
            
            if (playerCount === 2 && emptyCount === 1) {
                // 返回空的位置
                if (this.board[a] === '') return a;
                if (this.board[b] === '') return b;
                if (this.board[c] === '') return c;
            }
        }
        
        return -1;
    }
    
    updateCell(index) {
        const cell = this.container.querySelector(`.cell[data-index="${index}"]`);
        if (cell) {
            cell.textContent = this.board[index];
            cell.style.color = this.board[index] === 'X' ? '#00b894' : '#0984e3';
            cell.style.background = 'rgba(255, 255, 255, 0.15)';
            cell.style.transform = 'scale(1)';
            cell.setAttribute('data-occupied', 'true');
            
            // 移除悬停事件
            cell.removeEventListener('mouseenter', () => {});
            cell.removeEventListener('mouseleave', () => {});
        }
    }
    
    updateStatus() {
        const statusEl = this.container.querySelector('#game-status');
        const playerEl = this.container.querySelector('#current-player');
        
        if (statusEl) {
            statusEl.textContent = this.gameActive ? '进行中' : '已结束';
            statusEl.style.color = this.gameActive ? '#fdcb6e' : '#ff7675';
        }
        
        if (playerEl) {
            playerEl.textContent = this.currentPlayer;
            playerEl.style.color = this.currentPlayer === 'X' ? '#00b894' : '#0984e3';
        }
    }
    
    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 横
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 竖
            [0, 4, 8], [2, 4, 6]             // 斜
        ];
        
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                
                // 高亮获胜的格子
                this.highlightWinningCells(pattern);
                return true;
            }
        }
        
        return false;
    }
    
    highlightWinningCells(pattern) {
        pattern.forEach(index => {
            const cell = this.container.querySelector(`.cell[data-index="${index}"]`);
            if (cell) {
                cell.style.background = 'linear-gradient(135deg, #fdcb6e, #e17055)';
                cell.style.color = 'white';
                cell.style.transform = 'scale(1.1)';
            }
        });
    }
    
    checkTie() {
        return this.board.every(cell => cell !== '');
    }
    
    endGame(message) {
        this.gameActive = false;
        this.updateStatus();
        this.showMessage(message);
    }
    
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.render();
        this.updateStatus();
        this.showMessage('游戏已重置');
    }
    
    switchMode() {
        this.gameMode = this.gameMode === 'player' ? 'ai' : 'player';
        this.resetGame();
        
        const modeBtn = this.container.querySelector('#switch-mode');
        if (modeBtn) {
            modeBtn.innerHTML = `<i class="fas fa-robot"></i> ${this.gameMode === 'player' ? '对战AI' : '双人对战'}`;
        }
        
        this.showMessage(`已切换到${this.gameMode === 'player' ? '双人对战' : '对战AI'}模式`);
    }
    
    showMessage(message) {
        // 创建一个临时消息提示
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
        
        messageEl.textContent = message;
        document.body.appendChild(messageEl);
        
        // 3秒后移除
        setTimeout(() => {
            messageEl.remove();
            style.remove();
        }, 3000);
    }
}

// 初始化井字棋游戏
function initTicTacToeGame() {
    const game = new TicTacToeGame('tictactoe-container');
    return game;
}

// 页面加载时初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTicTacToeGame);
} else {
    initTicTacToeGame();
}