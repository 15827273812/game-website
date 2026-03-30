// 记忆翻牌游戏
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        this.timerInterval = null;
        
        this.symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍉', '🥝'];
        this.init();
    }

    init() {
        // 创建卡片数组（每张卡片出现两次）
        let cardValues = [...this.symbols, ...this.symbols];
        
        // 洗牌
        for (let i = cardValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
        }
        
        this.cards = cardValues;
        this.render();
        this.updateStats();
    }

    render() {
        const gameContainer = document.getElementById('game-container');
        if (!gameContainer) return;
        
        gameContainer.innerHTML = '';
        
        // 创建游戏网格
        const grid = document.createElement('div');
        grid.className = 'memory-grid';
        
        this.cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.index = index;
            card.dataset.symbol = symbol;
            
            const front = document.createElement('div');
            front.className = 'card-front';
            front.textContent = '?';
            
            const back = document.createElement('div');
            back.className = 'card-back';
            back.textContent = symbol;
            
            card.appendChild(front);
            card.appendChild(back);
            
            card.addEventListener('click', () => this.flipCard(index));
            grid.appendChild(card);
        });
        
        gameContainer.appendChild(grid);
    }

    flipCard(index) {
        if (!this.gameStarted) {
            this.startGame();
        }
        
        const card = document.querySelector(`.memory-card[data-index="${index}"]`);
        if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        if (this.flippedCards.length >= 2) {
            return;
        }
        
        // 翻转卡片
        card.classList.add('flipped');
        this.flippedCards.push({ index, card });
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            
            const card1 = this.flippedCards[0];
            const card2 = this.flippedCards[1];
            
            if (this.cards[card1.index] === this.cards[card2.index]) {
                // 匹配成功
                setTimeout(() => {
                    card1.card.classList.add('matched');
                    card2.card.classList.add('matched');
                    this.flippedCards = [];
                    this.matchedPairs++;
                    
                    if (this.matchedPairs === this.totalPairs) {
                        this.endGame();
                    }
                }, 500);
            } else {
                // 匹配失败，翻回去
                setTimeout(() => {
                    card1.card.classList.remove('flipped');
                    card2.card.classList.remove('flipped');
                    this.flippedCards = [];
                }, 1000);
            }
        }
    }

    startGame() {
        this.gameStarted = true;
        this.timer = 0;
        
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateStats();
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        
        setTimeout(() => {
            alert(`🎉 恭喜！游戏完成！\n用时: ${this.timer}秒\n步数: ${this.moves}步`);
            this.resetGame();
        }, 500);
    }

    resetGame() {
        clearInterval(this.timerInterval);
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameStarted = false;
        this.timer = 0;
        
        // 重新洗牌
        let cardValues = [...this.symbols, ...this.symbols];
        for (let i = cardValues.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
        }
        
        this.cards = cardValues;
        this.render();
        this.updateStats();
    }

    updateStats() {
        const movesElement = document.getElementById('moves-count');
        const timerElement = document.getElementById('timer-count');
        const pairsElement = document.getElementById('pairs-count');
        
        if (movesElement) movesElement.textContent = this.moves;
        if (timerElement) timerElement.textContent = this.timer;
        if (pairsElement) pairsElement.textContent = `${this.matchedPairs}/${this.totalPairs}`;
    }
}

// 游戏初始化
let memoryGame = null;

function initMemoryGame() {
    memoryGame = new MemoryGame();
    
    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'game-controls';
    controls.innerHTML = `
        <div class="stats">
            <div class="stat">
                <span class="stat-label">步数:</span>
                <span id="moves-count" class="stat-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">时间:</span>
                <span id="timer-count" class="stat-value">0</span>
            </div>
            <div class="stat">
                <span class="stat-label">匹配:</span>
                <span id="pairs-count" class="stat-value">0/8</span>
            </div>
        </div>
        <button class="btn-reset" onclick="memoryGame.resetGame()">
            <i class="fas fa-redo"></i> 重新开始
        </button>
    `;
    
    const gameContainer = document.getElementById('game-container');
    if (gameContainer) {
        gameContainer.parentNode.insertBefore(controls, gameContainer);
    }
}

// 导出游戏函数
window.loadMemoryGame = function() {
    const gameArea = document.getElementById('game-area');
    if (!gameArea) return;
    
    gameArea.innerHTML = `
        <div class="game-header">
            <h2><i class="fas fa-brain"></i> 记忆翻牌</h2>
            <p class="game-description">点击卡片找到匹配的图案。记住卡片位置，用最少的步数完成所有匹配！</p>
        </div>
        <div id="game-container"></div>
        <div class="game-instructions">
            <h3><i class="fas fa-lightbulb"></i> 游戏说明</h3>
            <ul>
                <li>点击卡片查看图案</li>
                <li>找到两个相同的图案即可匹配</li>
                <li>匹配所有8对卡片即可获胜</li>
                <li>尽量用最少的步数和时间完成</li>
            </ul>
        </div>
    `;
    
    initMemoryGame();
};