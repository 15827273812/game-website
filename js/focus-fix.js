/**
 * 游戏焦点修复脚本
 * 解决游戏canvas无法获得焦点和键盘控制问题
 */

class GameFocusManager {
    constructor() {
        this.currentGameCanvas = null;
        this.init();
    }
    
    init() {
        // 监听所有游戏canvas的点击事件
        document.addEventListener('click', (e) => {
            const canvas = e.target.closest('canvas');
            if (canvas && canvas.id && canvas.id.includes('-canvas')) {
                this.setFocus(canvas);
            }
        });
        
        // 监听游戏开始按钮
        document.addEventListener('click', (e) => {
            if (e.target.matches('.start-btn, [id*="start"]')) {
                // 找到对应的canvas
                const gameArea = e.target.closest('.game-area');
                if (gameArea) {
                    const canvas = gameArea.querySelector('canvas');
                    if (canvas) {
                        setTimeout(() => this.setFocus(canvas), 100);
                    }
                }
            }
        });
        
        // 添加键盘焦点提示
        this.addFocusStyles();
    }
    
    setFocus(canvas) {
        if (this.currentGameCanvas === canvas) return;
        
        // 移除之前canvas的焦点样式
        if (this.currentGameCanvas) {
            this.currentGameCanvas.classList.remove('game-focused');
        }
        
        // 设置新canvas的焦点
        this.currentGameCanvas = canvas;
        canvas.classList.add('game-focused');
        canvas.focus();
        
        console.log(`Canvas ${canvas.id} 获得焦点`);
    }
    
    addFocusStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .game-focused {
                box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5) !important;
                border-color: #4299e1 !important;
            }
            
            canvas:focus {
                outline: none;
            }
            
            .game-instruction {
                font-size: 14px;
                color: #718096;
                margin-top: 10px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
}

// 初始化焦点管理器
window.gameFocusManager = new GameFocusManager();

// 为所有游戏canvas添加tabindex和焦点支持
document.addEventListener('DOMContentLoaded', () => {
    const gameCanvases = document.querySelectorAll('canvas[id$="-canvas"]');
    gameCanvases.forEach(canvas => {
        canvas.setAttribute('tabindex', '0');
        canvas.style.outline = 'none';
        
        // 添加点击获得焦点
        canvas.addEventListener('click', () => {
            canvas.focus();
            window.gameFocusManager.setFocus(canvas);
        });
        
        // 添加焦点提示
        const instruction = document.createElement('div');
        instruction.className = 'game-instruction';
        instruction.textContent = '提示：点击游戏区域获得键盘控制焦点';
        canvas.parentNode.appendChild(instruction);
    });
    
    console.log(`为 ${gameCanvases.length} 个游戏canvas添加了焦点支持`);
});