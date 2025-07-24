// Dice Rolling Logic and Core Functions

class DiceRoller {
    constructor() {
        this.statistics = {
            rollCount: 0,
            totalSum: 0,
            highestRoll: 0,
            lowestRoll: Infinity,
            rollHistory: []
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.diceTypeSelect = document.getElementById('diceType');
        this.numDiceInput = document.getElementById('numDice');
        this.modifierInput = document.getElementById('modifier');
        this.rollBtn = document.getElementById('rollBtn');
        this.diceContainer = document.getElementById('diceContainer');
        
        // Result elements
        this.individualRollsSpan = document.getElementById('individualRolls');
        this.totalResultSpan = document.getElementById('totalResult');
        this.finalResultSpan = document.getElementById('finalResult');
        
        // Statistics elements
        this.rollCountSpan = document.getElementById('rollCount');
        this.averageRollSpan = document.getElementById('averageRoll');
        this.highestRollSpan = document.getElementById('highestRoll');
        this.lowestRollSpan = document.getElementById('lowestRoll');
        this.resetStatsBtn = document.getElementById('resetStats');
        
        // History elements
        this.rollHistoryDiv = document.getElementById('rollHistory');
        this.clearHistoryBtn = document.getElementById('clearHistory');
    }

    setupEventListeners() {
        this.rollBtn.addEventListener('click', () => this.rollDice());
        this.resetStatsBtn.addEventListener('click', () => this.resetStatistics());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Update display when configuration changes
        this.diceTypeSelect.addEventListener('change', () => this.updateDisplay());
        this.numDiceInput.addEventListener('input', () => this.updateDisplay());
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                e.preventDefault();
                this.rollDice();
            }
        });
    }

    updateDisplay() {
        const numDice = parseInt(this.numDiceInput.value);
        const diceType = parseInt(this.diceTypeSelect.value);
        
        // Clear and create dice elements
        this.diceContainer.innerHTML = '';
        
        for (let i = 0; i < numDice; i++) {
            const diceElement = this.createDiceElement(diceType);
            this.diceContainer.appendChild(diceElement);
        }
    }

    createDiceElement(diceType) {
        const dice = document.createElement('div');
        dice.className = 'dice';
        dice.textContent = '?';
        dice.title = `D${diceType}`;
        
        // Add click handler for individual dice rolling
        dice.addEventListener('click', () => {
            const roll = this.rollSingleDie(diceType);
            dice.textContent = roll;
            dice.classList.add('rolling');
            setTimeout(() => dice.classList.remove('rolling'), 1000);
        });
        
        return dice;
    }

    rollSingleDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    rollDice() {
        const numDice = parseInt(this.numDiceInput.value);
        const diceType = parseInt(this.diceTypeSelect.value);
        const modifier = parseInt(this.modifierInput.value) || 0;
        
        if (numDice < 1 || numDice > 10) {
            alert('Please use between 1 and 10 dice');
            return;
        }
        
        const rolls = [];
        const diceElements = this.diceContainer.querySelectorAll('.dice');
        
        // Animate all dice
        diceElements.forEach(dice => {
            dice.classList.add('rolling');
            dice.textContent = '🎲';
        });
        
        // Roll after animation delay
        setTimeout(() => {
            for (let i = 0; i < numDice; i++) {
                const roll = this.rollSingleDie(diceType);
                rolls.push(roll);
                diceElements[i].textContent = roll;
                diceElements[i].classList.remove('rolling');
            }
            
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            const finalTotal = total + modifier;
            
            this.updateResults(rolls, total, finalTotal);
            this.updateStatistics(finalTotal);
            this.addToHistory(rolls, total, finalTotal, diceType, modifier);
            
        }, 1000);
    }

    updateResults(rolls, total, finalTotal) {
        this.individualRollsSpan.textContent = rolls.join(', ');
        this.totalResultSpan.textContent = total;
        this.finalResultSpan.textContent = finalTotal;
        
        // Add animation classes
        [this.individualRollsSpan, this.totalResultSpan, this.finalResultSpan].forEach(element => {
            element.classList.add('bounce-in');
            setTimeout(() => element.classList.remove('bounce-in'), 600);
        });
    }

    updateStatistics(finalTotal) {
        this.statistics.rollCount++;
        this.statistics.totalSum += finalTotal;
        this.statistics.highestRoll = Math.max(this.statistics.highestRoll, finalTotal);
        this.statistics.lowestRoll = Math.min(this.statistics.lowestRoll, finalTotal);
        
        const average = this.statistics.totalSum / this.statistics.rollCount;
        
        this.rollCountSpan.textContent = this.statistics.rollCount;
        this.averageRollSpan.textContent = average.toFixed(2);
        this.highestRollSpan.textContent = this.statistics.highestRoll;
        this.lowestRollSpan.textContent = this.statistics.lowestRoll === Infinity ? 0 : this.statistics.lowestRoll;
    }

    addToHistory(rolls, total, finalTotal, diceType, modifier) {
        const timestamp = new Date().toLocaleTimeString();
        const historyItem = {
            timestamp,
            rolls,
            total,
            finalTotal,
            diceType,
            modifier
        };
        
        this.statistics.rollHistory.unshift(historyItem);
        
        // Keep only last 20 rolls
        if (this.statistics.rollHistory.length > 20) {
            this.statistics.rollHistory.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.rollHistoryDiv.innerHTML = '';
        
        this.statistics.rollHistory.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item fade-in';
            
            const modifierText = item.modifier !== 0 ? ` (${item.modifier >= 0 ? '+' : ''}${item.modifier})` : '';
            historyElement.innerHTML = `
                <strong>${item.timestamp}</strong> - 
                D${item.diceType}: [${item.rolls.join(', ')}] = ${item.total}${modifierText} = <strong>${item.finalTotal}</strong>
            `;
            
            this.rollHistoryDiv.appendChild(historyElement);
        });
    }

    resetStatistics() {
        if (confirm('Are you sure you want to reset all statistics?')) {
            this.statistics = {
                rollCount: 0,
                totalSum: 0,
                highestRoll: 0,
                lowestRoll: Infinity,
                rollHistory: []
            };
            
            this.rollCountSpan.textContent = '0';
            this.averageRollSpan.textContent = '0';
            this.highestRollSpan.textContent = '0';
            this.lowestRollSpan.textContent = '0';
            
            this.updateHistoryDisplay();
        }
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear the roll history?')) {
            this.statistics.rollHistory = [];
            this.updateHistoryDisplay();
        }
    }

    // Utility methods for games
    rollMultipleDice(numDice, diceType = 6) {
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(this.rollSingleDie(diceType));
        }
        return rolls;
    }

    getStatistics() {
        return { ...this.statistics };
    }
}

// Dice Combinations and Patterns
class DiceCombinations {
    static analyzeYahtzee(rolls) {
        const counts = {};
        rolls.forEach(roll => {
            counts[roll] = (counts[roll] || 0) + 1;
        });
        
        const values = Object.values(counts);
        const maxCount = Math.max(...values);
        const uniqueValues = Object.keys(counts).length;
        
        // Check for specific combinations
        if (maxCount === 5) return 'Yahtzee! (5 of a kind)';
        if (maxCount === 4) return 'Four of a Kind';
        if (maxCount === 3 && uniqueValues === 2) return 'Full House';
        if (maxCount === 3) return 'Three of a Kind';
        if (values.filter(v => v === 2).length === 2) return 'Two Pairs';
        if (maxCount === 2) return 'One Pair';
        
        // Check for straights
        const sortedRolls = [...new Set(rolls)].sort((a, b) => a - b);
        if (this.isConsecutive(sortedRolls)) {
            if (sortedRolls.length === 5) return 'Large Straight';
            if (sortedRolls.length === 4) return 'Small Straight';
        }
        
        return 'High Card';
    }
    
    static isConsecutive(array) {
        for (let i = 1; i < array.length; i++) {
            if (array[i] !== array[i-1] + 1) {
                return false;
            }
        }
        return true;
    }
    
    static calculateYahtzeeScore(combination, rolls) {
        const sum = rolls.reduce((a, b) => a + b, 0);
        
        switch (combination) {
            case 'Yahtzee! (5 of a kind)': return 50;
            case 'Four of a Kind': return sum;
            case 'Full House': return 25;
            case 'Large Straight': return 40;
            case 'Small Straight': return 30;
            case 'Three of a Kind': return sum;
            case 'Two Pairs': return sum;
            case 'One Pair': return sum;
            default: return sum;
        }
    }
}

// Initialize the dice roller when page loads
let diceRoller;
document.addEventListener('DOMContentLoaded', () => {
    diceRoller = new DiceRoller();
});

// Export for use in other files
window.DiceRoller = DiceRoller;
window.DiceCombinations = DiceCombinations;