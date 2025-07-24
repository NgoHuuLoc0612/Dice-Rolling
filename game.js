// Dice Games Implementation

class DiceGames {
    constructor() {
        this.guessGame = {
            currentRoll: null,
            score: 0,
            isActive: false
        };
        
        this.initializeGames();
    }

    initializeGames() {
        // Yahtzee game
        const yahtzeeBtn = document.getElementById('yahtzeeBtn');
        const yahtzeeResult = document.getElementById('yahtzeeResult');
        
        yahtzeeBtn.addEventListener('click', () => {
            this.playYahtzee(yahtzeeResult);
        });

        // High-Low guess game
        this.initializeGuessGame();
    }

    playYahtzee(resultElement) {
        resultElement.textContent = 'Rolling 5 dice...';
        resultElement.style.background = 'rgba(102, 126, 234, 0.1)';
        resultElement.style.color = '#667eea';
        
        // Animate rolling
        setTimeout(() => {
            const rolls = [];
            for (let i = 0; i < 5; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            
            const combination = DiceCombinations.analyzeYahtzee(rolls);
            const score = DiceCombinations.calculateYahtzeeScore(combination, rolls);
            
            resultElement.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>Rolls:</strong> [${rolls.join(', ')}]
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Combination:</strong> ${combination}
                </div>
                <div>
                    <strong>Score:</strong> ${score} points
                </div>
            `;
            
            // Color code based on combination quality
            if (combination.includes('Yahtzee')) {
                resultElement.style.background = 'rgba(255, 215, 0, 0.2)';
                resultElement.style.color = '#b7791f';
                this.celebrateYahtzee();
            } else if (combination.includes('Four') || combination.includes('Full House')) {
                resultElement.style.background = 'rgba(72, 187, 120, 0.2)';
                resultElement.style.color = '#48bb78';
            } else if (combination.includes('Three') || combination.includes('Straight')) {
                resultElement.style.background = 'rgba(237, 137, 54, 0.2)';
                resultElement.style.color = '#ed8936';
            } else {
                resultElement.style.background = 'rgba(160, 174, 192, 0.2)';
                resultElement.style.color = '#a0aec0';
            }
            
            resultElement.classList.add('bounce-in');
            setTimeout(() => resultElement.classList.remove('bounce-in'), 600);
            
        }, 1000);
    }

    celebrateYahtzee() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: #ffd700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 1000;
            pointer-events: none;
            animation: celebrationPulse 2s ease-out;
        `;
        celebration.textContent = '🎉 YAHTZEE! 🎉';
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            document.body.removeChild(celebration);
        }, 2000);
        
        // Add celebration animation to CSS if not exists
        if (!document.querySelector('#celebration-style')) {
            const style = document.createElement('style');
            style.id = 'celebration-style';
            style.textContent = `
                @keyframes celebrationPulse {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    initializeGuessGame() {
        const currentGuessRoll = document.getElementById('currentGuessRoll');
        const guessHigher = document.getElementById('guessHigher');
        const guessLower = document.getElementById('guessLower');
        const guessScore = document.getElementById('guessScore');
        
        // Start the game with first roll
        currentGuessRoll.addEventListener('click', () => {
            if (!this.guessGame.isActive) {
                this.startGuessGame(currentGuessRoll, guessScore);
            }
        });
        
        guessHigher.addEventListener('click', () => {
            this.makeGuess('higher', currentGuessRoll, guessScore);
        });
        
        guessLower.addEventListener('click', () => {
            this.makeGuess('lower', currentGuessRoll, guessScore);
        });
        
        // Reset game button
        const resetGuessBtn = document.createElement('button');
        resetGuessBtn.textContent = 'Reset Game';
        resetGuessBtn.className = 'reset-btn';
        resetGuessBtn.style.marginTop = '10px';
        resetGuessBtn.addEventListener('click', () => {
            this.resetGuessGame(currentGuessRoll, guessScore);
        });
        
        guessScore.parentNode.appendChild(resetGuessBtn);
    }

    startGuessGame(rollElement, scoreElement) {
        this.guessGame.currentRoll = Math.floor(Math.random() * 6) + 1;
        this.guessGame.score = 0;
        this.guessGame.isActive = true;
        
        rollElement.textContent = this.guessGame.currentRoll;
        rollElement.style.cursor = 'default';
        scoreElement.textContent = `Score: ${this.guessGame.score}`;
        
        rollElement.classList.add('bounce-in');
        setTimeout(() => rollElement.classList.remove('bounce-in'), 600);
    }

    makeGuess(guess, rollElement, scoreElement) {
        if (!this.guessGame.isActive) {
            alert('Click the current roll to start the game!');
            return;
        }
        
        const newRoll = Math.floor(Math.random() * 6) + 1;
        const previousRoll = this.guessGame.currentRoll;
        
        let correct = false;
        if (guess === 'higher' && newRoll > previousRoll) correct = true;
        if (guess === 'lower' && newRoll < previousRoll) correct = true;
        if (newRoll === previousRoll) {
            // Tie - player gets another chance
            rollElement.textContent = `${newRoll} (Tie! Try again)`;
            rollElement.style.background = 'rgba(237, 137, 54, 0.2)';
            rollElement.style.color = '#ed8936';
            this.guessGame.currentRoll = newRoll;
            return;
        }
        
        if (correct) {
            this.guessGame.score++;
            rollElement.textContent = `${newRoll} ✓`;
            rollElement.style.background = 'rgba(72, 187, 120, 0.2)';
            rollElement.style.color = '#48bb78';
            scoreElement.textContent = `Score: ${this.guessGame.score}`;
            this.guessGame.currentRoll = newRoll;
            
            // Bonus points for streaks
            if (this.guessGame.score > 0 && this.guessGame.score % 5 === 0) {
                this.showStreakBonus(this.guessGame.score);
            }
        } else {
            rollElement.textContent = `${newRoll} ✗ Game Over!`;
            rollElement.style.background = 'rgba(255, 107, 107, 0.2)';
            rollElement.style.color = '#ff6b6b';
            this.endGuessGame(scoreElement);
        }
        
        rollElement.classList.add('bounce-in');
        setTimeout(() => rollElement.classList.remove('bounce-in'), 600);
    }

    showStreakBonus(score) {
        const bonus = document.createElement('div');
        bonus.textContent = `🔥 ${score} Streak! 🔥`;
        bonus.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.5rem;
            font-weight: bold;
            color: #ff6b6b;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 20px;
            border-radius: 10px;
            z-index: 1000;
            pointer-events: none;
            animation: streakBounce 2s ease-out;
        `;
        
        document.body.appendChild(bonus);
        
        setTimeout(() => {
            if (document.body.contains(bonus)) {
                document.body.removeChild(bonus);
            }
        }, 2000);
        
        // Add streak animation to CSS if not exists
        if (!document.querySelector('#streak-style')) {
            const style = document.createElement('style');
            style.id = 'streak-style';
            style.textContent = `
                @keyframes streakBounce {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    endGuessGame(scoreElement) {
        const finalScore = this.guessGame.score;
        this.guessGame.isActive = false;
        
        let message = '';
        if (finalScore === 0) message = 'Better luck next time!';
        else if (finalScore < 3) message = 'Not bad!';
        else if (finalScore < 5) message = 'Good job!';
        else if (finalScore < 10) message = 'Excellent!';
        else message = 'Amazing streak!';
        
        scoreElement.innerHTML = `Final Score: ${finalScore}<br><small>${message}</small>`;
        
        // Store high score in memory
        const currentHighScore = parseInt(localStorage.getItem('guessGameHighScore') || '0');
        if (finalScore > currentHighScore) {
            // Note: We can't actually use localStorage in Claude artifacts, so this is just for demonstration
            scoreElement.innerHTML += '<br><small>🏆 New High Score!</small>';
        }
    }

    resetGuessGame(rollElement, scoreElement) {
        this.guessGame = {
            currentRoll: null,
            score: 0,
            isActive: false
        };
        
        rollElement.textContent = 'Click to start!';
        rollElement.style.background = 'rgba(102, 126, 234, 0.1)';
        rollElement.style.color = '#667eea';
        rollElement.style.cursor = 'pointer';
        scoreElement.textContent = 'Score: 0';
    }
}

// Additional Dice Games
class AdvancedDiceGames {
    static playBunco() {
        // Bunco is typically played with 3 dice
        const rolls = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
        
        const target = Math.floor(Math.random() * 6) + 1; // Random target number
        const matches = rolls.filter(roll => roll === target).length;
        
        let result = '';
        if (matches === 3) {
            result = `BUNCO! All three dice show ${target}!`;
        } else if (matches === 2) {
            result = `Two ${target}s! Good roll!`;
        } else if (matches === 1) {
            result = `One ${target}. Keep trying!`;
        } else {
            result = `No ${target}s this time.`;
        }
        
        return {
            rolls,
            target,
            matches,
            result,
            score: matches * 10
        };
    }
    
    static playShipCaptainCrew() {
        // Traditional dice game where you need 6 (ship), 5 (captain), 4 (crew) in order
        let rolls = [];
        let attempts = 0;
        let ship = false, captain = false, crew = false;
        let cargo = 0;
        
        // Simulate up to 3 rolls
        while (attempts < 3 && (!ship || !captain || !crew)) {
            const roll = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ];
            
            rolls.push(roll);
            attempts++;
            
            // Check for ship (6), captain (5), crew (4) in order
            if (!ship && roll.includes(6)) {
                ship = true;
                roll.splice(roll.indexOf(6), 1);
            }
            if (ship && !captain && roll.includes(5)) {
                captain = true;
                roll.splice(roll.indexOf(5), 1);
            }
            if (ship && captain && !crew && roll.includes(4)) {
                crew = true;
                roll.splice(roll.indexOf(4), 1);
            }
            
            // Remaining dice are cargo
            if (ship && captain && crew) {
                cargo = roll.reduce((sum, die) => sum + die, 0);
                break;
            }
        }
        
        return {
            rolls,
            ship,
            captain,
            crew,
            cargo,
            success: ship && captain && crew,
            attempts
        };
    }
}

// Initialize games when page loads
document.addEventListener('DOMContentLoaded', () => {
    const diceGames = new DiceGames();
    
    // Add additional game buttons if needed
    const gamesSection = document.querySelector('.games-section .games-grid');
    
    // Add Bunco game
    const buncoCard = document.createElement('div');
    buncoCard.className = 'game-card';
    buncoCard.innerHTML = `
        <h4>Bunco</h4>
        <p>Roll 3 dice and try to match the target number!</p>
        <button class="game-btn" id="buncoBtn">Play Bunco</button>
        <div class="game-result" id="buncoResult"></div>
    `;
    gamesSection.appendChild(buncoCard);
    
    document.getElementById('buncoBtn').addEventListener('click', () => {
        const result = AdvancedDiceGames.playBunco();
        const resultDiv = document.getElementById('buncoResult');
        
        resultDiv.innerHTML = `
            <div><strong>Target:</strong> ${result.target}</div>
            <div><strong>Rolls:</strong> [${result.rolls.join(', ')}]</div>
            <div><strong>Matches:</strong> ${result.matches}</div>
            <div><strong>Score:</strong> ${result.score} points</div>
            <div style="margin-top: 8px; font-weight: bold;">${result.result}</div>
        `;
        
        if (result.matches === 3) {
            resultDiv.style.background = 'rgba(255, 215, 0, 0.2)';
            resultDiv.style.color = '#b7791f';
        } else if (result.matches >= 2) {
            resultDiv.style.background = 'rgba(72, 187, 120, 0.2)';
            resultDiv.style.color = '#48bb78';
        } else {
            resultDiv.style.background = 'rgba(160, 174, 192, 0.2)';
            resultDiv.style.color = '#a0aec0';
        }
    });
    
    // Add Ship Captain Crew game
    const sccCard = document.createElement('div');
    sccCard.className = 'game-card';
    sccCard.innerHTML = `
        <h4>Ship Captain Crew</h4>
        <p>Get a 6 (ship), 5 (captain), and 4 (crew) in order!</p>
        <button class="game-btn" id="sccBtn">Play Ship Captain Crew</button>
        <div class="game-result" id="sccResult"></div>
    `;
    gamesSection.appendChild(sccCard);
    
    document.getElementById('sccBtn').addEventListener('click', () => {
        const result = AdvancedDiceGames.playShipCaptainCrew();
        const resultDiv = document.getElementById('sccResult');
        
        let statusText = '';
        if (result.success) {
            statusText = `✅ Complete! Cargo: ${result.cargo}`;
            resultDiv.style.background = 'rgba(72, 187, 120, 0.2)';
            resultDiv.style.color = '#48bb78';
        } else {
            statusText = `❌ Incomplete after ${result.attempts} attempts`;
            resultDiv.style.background = 'rgba(255, 107, 107, 0.2)';
            resultDiv.style.color = '#ff6b6b';
        }
        
        resultDiv.innerHTML = `
            <div><strong>Ship (6):</strong> ${result.ship ? '✅' : '❌'}</div>
            <div><strong>Captain (5):</strong> ${result.captain ? '✅' : '❌'}</div>
            <div><strong>Crew (4):</strong> ${result.crew ? '✅' : '❌'}</div>
            <div style="margin-top: 8px; font-weight: bold;">${statusText}</div>
        `;
    });
});

// Export for potential use
window.DiceGames = DiceGames;
window.AdvancedDiceGames = AdvancedDiceGames;