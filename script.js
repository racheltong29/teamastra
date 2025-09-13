// Game State
let gameState = {
    level: 1,
    xp: 0,
    stars: 0,
    jobsApplied: 0,
    coffeeChats: 0,
    resumesUpdated: 0,
    networkEvents: 0,
    achievements: []
};

// XP required for each level (exponential growth)
const XP_PER_LEVEL = 100;
const XP_MULTIPLIER = 1.5;

// Achievements data
const achievementsData = [
    {
        id: 'first_application',
        title: 'First Steps',
        description: 'Apply to your first job',
        icon: 'fas fa-paper-plane',
        xpReward: 50,
        starsReward: 25,
        requirement: 1,
        type: 'jobsApplied',
        completed: false
    },
    {
        id: 'job_hunter',
        title: 'Job Hunter',
        description: 'Apply to 5 jobs',
        icon: 'fas fa-bullseye',
        xpReward: 100,
        starsReward: 50,
        requirement: 5,
        type: 'jobsApplied',
        completed: false
    },
    {
        id: 'coffee_master',
        title: 'Coffee Master',
        description: 'Have 3 coffee chats',
        icon: 'fas fa-coffee',
        xpReward: 75,
        starsReward: 30,
        requirement: 3,
        type: 'coffeeChats',
        completed: false
    },
    {
        id: 'resume_expert',
        title: 'Resume Expert',
        description: 'Update your resume 3 times',
        icon: 'fas fa-file-alt',
        xpReward: 60,
        starsReward: 25,
        requirement: 3,
        type: 'resumesUpdated',
        completed: false
    },
    {
        id: 'networker',
        title: 'Networker',
        description: 'Attend 2 networking events',
        icon: 'fas fa-users',
        xpReward: 80,
        starsReward: 35,
        requirement: 2,
        type: 'networkEvents',
        completed: false
    },
    {
        id: 'dedicated_hunter',
        title: 'Dedicated Hunter',
        description: 'Apply to 10 jobs',
        icon: 'fas fa-trophy',
        xpReward: 200,
        starsReward: 100,
        requirement: 10,
        type: 'jobsApplied',
        completed: false
    }
];

// Initialize the game
function initGame() {
    loadGameState();
    updateUI();
    createFloatingParticles();
    setupEventListeners();
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('jobQuestGameState');
    if (saved) {
        const savedState = JSON.parse(saved);
        gameState = { ...gameState, ...savedState };
    }
    updateAchievements();
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('jobQuestGameState', JSON.stringify(gameState));
}

// Update UI elements
function updateUI() {
    document.getElementById('stars').textContent = gameState.stars;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('xp').textContent = gameState.xp;
    
    const xpNeeded = getXPNeededForLevel(gameState.level);
    const xpProgress = (gameState.xp % xpNeeded) / xpNeeded * 100;
    
    document.getElementById('xpFill').style.width = `${xpProgress}%`;
    document.getElementById('currentXp').textContent = gameState.xp % xpNeeded;
    document.getElementById('nextLevelXp').textContent = xpNeeded;
    document.getElementById('currentLevel').textContent = gameState.level;
    document.getElementById('nextLevel').textContent = gameState.level + 1;
    
    updateAchievementsUI();
}

// Calculate XP needed for a specific level
function getXPNeededForLevel(level) {
    return Math.floor(XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, level - 1));
}

// Add XP and check for level up
function addXP(amount) {
    const oldLevel = gameState.level;
    gameState.xp += amount;
    
    // Check for level up
    while (gameState.xp >= getXPNeededForLevel(gameState.level)) {
        gameState.xp -= getXPNeededForLevel(gameState.level);
        gameState.level++;
    }
    
    if (gameState.level > oldLevel) {
        showLevelUpModal(gameState.level);
    }
    
    updateUI();
    saveGameState();
}

// Add stars
function addStars(amount) {
    gameState.stars += amount;
    updateUI();
    saveGameState();
}

// Show level up modal
function showLevelUpModal(newLevel) {
    const modal = document.getElementById('levelUpModal');
    document.getElementById('newLevel').textContent = newLevel;
    
    // Add level up rewards
    addStars(50);
    addXP(100);
    
    modal.classList.add('show');
    
    // Auto close after 5 seconds
    setTimeout(() => {
        modal.classList.remove('show');
    }, 5000);
}

// Update achievements based on current progress
function updateAchievements() {
    achievementsData.forEach(achievement => {
        const currentValue = gameState[achievement.type] || 0;
        if (currentValue >= achievement.requirement && !achievement.completed) {
            achievement.completed = true;
            gameState.achievements.push(achievement.id);
            showAchievementModal(achievement);
        }
    });
}

// Show achievement unlocked modal
function showAchievementModal(achievement) {
    const modal = document.getElementById('achievementModal');
    document.getElementById('achievementTitle').textContent = achievement.title;
    document.getElementById('achievementDesc').textContent = achievement.description;
    document.getElementById('achievementStars').textContent = `+${achievement.starsReward} Stars`;
    
    // Add rewards
    addXP(achievement.xpReward);
    addStars(achievement.starsReward);
    
    modal.classList.add('show');
    
    // Auto close after 4 seconds
    setTimeout(() => {
        modal.classList.remove('show');
    }, 4000);
}

// Update achievements UI
function updateAchievementsUI() {
    const grid = document.getElementById('achievementsGrid');
    grid.innerHTML = '';
    
    achievementsData.forEach((achievement, index) => {
        const currentValue = gameState[achievement.type] || 0;
        const progress = Math.min(currentValue / achievement.requirement * 100, 100);
        
        const card = document.createElement('div');
        card.className = `achievement-card ${achievement.completed ? 'completed' : ''}`;
        card.style.setProperty('--delay', `${index * 0.1}s`);
        
        card.innerHTML = `
            <div class="achievement-header">
                <i class="${achievement.icon} achievement-icon"></i>
                <div class="achievement-title">${achievement.title}</div>
            </div>
            <div class="achievement-desc">${achievement.description}</div>
            <div class="achievement-progress">
                <span>${currentValue}/${achievement.requirement}</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <span>${achievement.completed ? '✓' : Math.round(progress)}%</span>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Add activity to feed
function addActivity(message, icon = 'fas fa-star') {
    const feed = document.getElementById('activityFeed');
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    activityItem.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
        <span class="time">${timeString}</span>
    `;
    
    feed.insertBefore(activityItem, feed.firstChild);
    
    // Keep only last 10 activities
    while (feed.children.length > 10) {
        feed.removeChild(feed.lastChild);
    }
}

// Action button handlers
function setupEventListeners() {
    document.getElementById('applyJob').addEventListener('click', () => {
        gameState.jobsApplied++;
        addXP(50);
        addStars(10);
        addActivity('Applied to a new job! 🚀', 'fas fa-paper-plane');
        updateAchievements();
        updateUI();
        saveGameState();
        animateButton(document.getElementById('applyJob'));
    });
    
    document.getElementById('coffeeChat').addEventListener('click', () => {
        gameState.coffeeChats++;
        addXP(30);
        addStars(5);
        addActivity('Had a great coffee chat! ☕', 'fas fa-coffee');
        updateAchievements();
        updateUI();
        saveGameState();
        animateButton(document.getElementById('coffeeChat'));
    });
    
    document.getElementById('updateResume').addEventListener('click', () => {
        gameState.resumesUpdated++;
        addXP(25);
        addStars(5);
        addActivity('Updated your resume! 📄', 'fas fa-file-alt');
        updateAchievements();
        updateUI();
        saveGameState();
        animateButton(document.getElementById('updateResume'));
    });
    
    document.getElementById('networkEvent').addEventListener('click', () => {
        gameState.networkEvents++;
        addXP(40);
        addStars(8);
        addActivity('Attended a networking event! 🤝', 'fas fa-users');
        updateAchievements();
        updateUI();
        saveGameState();
        animateButton(document.getElementById('networkEvent'));
    });
    
    // Modal close handlers
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('levelUpModal').classList.remove('show');
    });
    
    document.getElementById('closeAchievementModal').addEventListener('click', () => {
        document.getElementById('achievementModal').classList.remove('show');
    });
    
    // Close modals when clicking outside
    document.getElementById('levelUpModal').addEventListener('click', (e) => {
        if (e.target.id === 'levelUpModal') {
            document.getElementById('levelUpModal').classList.remove('show');
        }
    });
    
    document.getElementById('achievementModal').addEventListener('click', (e) => {
        if (e.target.id === 'achievementModal') {
            document.getElementById('achievementModal').classList.remove('show');
        }
    });
}

// Animate button click
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Create floating particles
function createFloatingParticles() {
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            createParticle();
        }, i * 200);
    }
    
    // Create new particles periodically
    setInterval(createParticle, 3000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position and animation duration
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    
    // Random colors
    const colors = [
        'rgba(255, 107, 107, 0.5)',
        'rgba(255, 165, 0, 0.5)',
        'rgba(78, 205, 196, 0.5)',
        'rgba(102, 126, 234, 0.5)',
        'rgba(240, 147, 251, 0.5)'
    ];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 6000);
}

// Add some initial activities
function addInitialActivities() {
    addActivity('Welcome to JobQuest! Start your journey by applying to your first job.', 'fas fa-star');
    addActivity('Complete achievements to earn XP and stars!', 'fas fa-trophy');
    addActivity('Level up to unlock new features and rewards!', 'fas fa-level-up-alt');
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    addInitialActivities();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.getElementById('applyJob').click();
                break;
            case '2':
                e.preventDefault();
                document.getElementById('coffeeChat').click();
                break;
            case '3':
                e.preventDefault();
                document.getElementById('updateResume').click();
                break;
            case '4':
                e.preventDefault();
                document.getElementById('networkEvent').click();
                break;
        }
    }
});

// Add some Easter eggs
let clickCount = 0;
document.querySelector('.logo').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        addStars(100);
        addXP(200);
        addActivity('Easter egg discovered! You found the secret! 🥚', 'fas fa-egg');
        updateUI();
        saveGameState();
        clickCount = 0;
    }
});

// Reset game function (for development)
function resetGame() {
    if (confirm('Are you sure you want to reset your progress?')) {
        localStorage.removeItem('jobQuestGameState');
        location.reload();
    }
}

// Add reset button for development (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset Game';
    resetBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 20px;
        cursor: pointer;
        z-index: 1000;
        font-size: 12px;
    `;
    resetBtn.addEventListener('click', resetGame);
    document.body.appendChild(resetBtn);
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.style.left === '0px') {
    sidebar.style.left = '-200px';
  } else {
    sidebar.style.left = '0px';
  }
}

