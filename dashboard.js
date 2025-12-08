// ===== STATE MANAGEMENT =====
const state = {
    currentView: 'live-feed',
    activeTab: 'alerts',
    eventsDetected: 1247,
    criticalThreats: 24,
    activeDrones: 3,
    accuracy: 98.7,
    alerts: [],
    isPlaying: true
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeTabs();
    initializeTime();
    initializeStats();
    generateInitialAlerts();
    startLiveUpdates();
    startDetectionAnimation();
    initializeControls();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });
}

function switchView(viewName) {
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');

    // Update content view
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}-view`).classList.add('active');

    // Update header
    const titles = {
        'live-feed': 'Live Surveillance Feed',
        'analytics': 'Analytics Dashboard',
        'alerts': 'Alert Management',
        'map': 'Map View',
        'history': 'Event History',
        'settings': 'System Settings'
    };

    document.getElementById('view-title').textContent = titles[viewName];
    document.getElementById('breadcrumb-current').textContent = titles[viewName];

    state.currentView = viewName;
}

// ===== TABS =====
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');

    state.activeTab = tabName;
}

// ===== TIME UPDATE =====
function initializeTime() {
    updateTime();
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        timeDisplay.textContent = timeString;
    }
}

// ===== STATS UPDATE =====
function initializeStats() {
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('events-detected').textContent = state.eventsDetected.toLocaleString();
    document.getElementById('critical-threats').textContent = state.criticalThreats;
    document.getElementById('active-drones').textContent = state.activeDrones;
    document.getElementById('accuracy').textContent = state.accuracy + '%';
}

function incrementStat(statName, increment = 1) {
    state[statName] += increment;
    updateStatsDisplay();

    // Animate the stat
    const element = document.getElementById(statName.replace(/([A-Z])/g, '-$1').toLowerCase());
    if (element) {
        element.style.transform = 'scale(1.2)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }
}

// ===== ALERTS GENERATION =====
const alertTypes = [
    {
        type: 'critical',
        title: 'Unauthorized Person Detected',
        description: 'Unknown individual detected in restricted zone. Immediate action required.',
        icon: '🚨'
    },
    {
        type: 'critical',
        title: 'Multiple Intruders',
        description: 'Group of 3-4 individuals detected near perimeter fence.',
        icon: '⚠️'
    },
    {
        type: 'warning',
        title: 'Suspicious Vehicle Activity',
        description: 'Unregistered vehicle detected in surveillance area.',
        icon: '🚗'
    },
    {
        type: 'warning',
        title: 'Object Detected',
        description: 'Unidentified object detected near checkpoint.',
        icon: '📦'
    },
    {
        type: 'info',
        title: 'Routine Movement',
        description: 'Authorized personnel detected in designated area.',
        icon: 'ℹ️'
    },
    {
        type: 'critical',
        title: 'Fire/Smoke Detected',
        description: 'Smoke signature detected in sector B. Potential fire hazard.',
        icon: '🔥'
    }
];

const locations = [
    '28.6139° N, 77.2090° E',
    '28.6125° N, 77.2080° E',
    '28.6110° N, 77.2070° E',
    '28.6150° N, 77.2100° E',
    '28.6135° N, 77.2085° E'
];

function generateInitialAlerts() {
    // Generate 10 initial alerts
    for (let i = 0; i < 10; i++) {
        const alert = generateRandomAlert();
        state.alerts.unshift(alert);
    }
    renderAlerts();
}

function generateRandomAlert() {
    const template = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const timestamp = new Date();

    return {
        id: Date.now() + Math.random(),
        type: template.type,
        title: template.title,
        description: template.description,
        icon: template.icon,
        location: location,
        timestamp: timestamp,
        timeAgo: getTimeAgo(timestamp)
    };
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

function addNewAlert() {
    const alert = generateRandomAlert();
    state.alerts.unshift(alert);

    // Keep only last 50 alerts
    if (state.alerts.length > 50) {
        state.alerts = state.alerts.slice(0, 50);
    }

    // Update stats
    incrementStat('eventsDetected', 1);
    if (alert.type === 'critical') {
        incrementStat('criticalThreats', 1);
    }

    renderAlerts();

    // Show notification
    showNotification(alert);
}

function renderAlerts() {
    const alertsList = document.getElementById('alerts-list');
    if (!alertsList) return;

    alertsList.innerHTML = state.alerts.slice(0, 10).map(alert => `
        <div class="alert-card ${alert.type}">
            <div class="alert-header">
                <span class="alert-title">
                    <span>${alert.icon}</span>
                    ${alert.title}
                </span>
                <span class="alert-time">${alert.timeAgo}</span>
            </div>
            <p class="alert-description">${alert.description}</p>
            <div class="alert-location">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>${alert.location}</span>
            </div>
        </div>
    `).join('');
}

function showNotification(alert) {
    // Play sound (optional)
    playAlertSound(alert.type);

    // Flash notification dot
    const notificationDot = document.querySelector('.notification-dot');
    if (notificationDot) {
        notificationDot.style.animation = 'none';
        setTimeout(() => {
            notificationDot.style.animation = 'pulse-dot 2s ease-in-out infinite';
        }, 10);
    }
}

function playAlertSound(type) {
    // In a real application, you would play an actual sound file
    // For now, we'll just log it
    console.log(`🔔 Alert sound: ${type}`);
}

// ===== LIVE UPDATES =====
function startLiveUpdates() {
    // Add new alert every 8-15 seconds
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance
            addNewAlert();
        }
    }, Math.random() * 7000 + 8000);

    // Update time ago for alerts every 30 seconds
    setInterval(() => {
        state.alerts.forEach(alert => {
            alert.timeAgo = getTimeAgo(alert.timestamp);
        });
        renderAlerts();
    }, 30000);

    // Slightly increase detection accuracy over time
    setInterval(() => {
        if (state.accuracy < 99.5) {
            state.accuracy = Math.min(99.5, state.accuracy + 0.1);
            updateStatsDisplay();
        }
    }, 60000);
}

// ===== DETECTION BOX ANIMATION =====
function startDetectionAnimation() {
    const detectionBoxes = document.querySelectorAll('.detection-box');

    detectionBoxes.forEach(box => {
        // Initial position
        const initialStyle = box.style.cssText;

        setInterval(() => {
            // Random small movements
            const currentTop = parseFloat(box.style.top || '25');
            const currentLeft = parseFloat(box.style.left || '20');

            const newTop = currentTop + (Math.random() - 0.5) * 3;
            const newLeft = currentLeft + (Math.random() - 0.5) * 3;

            box.style.top = `${Math.max(10, Math.min(70, newTop))}%`;
            box.style.left = `${Math.max(10, Math.min(70, newLeft))}%`;

            // Random confidence change
            const confidenceSpan = box.querySelector('.confidence');
            if (confidenceSpan) {
                const currentConfidence = parseInt(confidenceSpan.textContent);
                const newConfidence = Math.max(85, Math.min(99, currentConfidence + Math.floor(Math.random() * 3) - 1));
                confidenceSpan.textContent = newConfidence + '%';
            }
        }, 2000);
    });
}

// ===== CONTROLS =====
function initializeControls() {
    // Play/Pause button
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach((btn, index) => {
        if (index === 0) { // Play button
            btn.addEventListener('click', () => {
                state.isPlaying = true;
                btn.classList.add('active');
                controlBtns[1].classList.remove('active');
            });
        } else if (index === 1) { // Pause button
            btn.addEventListener('click', () => {
                state.isPlaying = false;
                btn.classList.add('active');
                controlBtns[0].classList.remove('active');
            });
        }
    });

    // Drone selector
    const droneSelect = document.querySelector('.drone-select');
    if (droneSelect) {
        droneSelect.addEventListener('change', (e) => {
            console.log(`Switched to ${e.target.options[e.target.selectedIndex].text}`);
            // In a real app, this would switch the video feed
        });
    }

    // Settings sliders
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            const span = e.target.nextElementSibling;

            if (slider.max == 100) {
                span.textContent = value + '%';
            } else {
                const levels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
                const index = Math.floor((value - 1) / 2);
                span.textContent = levels[Math.min(index, levels.length - 1)];
            }
        });
    });
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // 1-6 for quick navigation
    const viewKeys = {
        '1': 'live-feed',
        '2': 'analytics',
        '3': 'alerts',
        '4': 'map',
        '5': 'history',
        '6': 'settings'
    };

    if (viewKeys[e.key]) {
        switchView(viewKeys[e.key]);
    }

    // Space to toggle play/pause
    if (e.key === ' ' && state.currentView === 'live-feed') {
        e.preventDefault();
        const playBtn = document.querySelectorAll('.control-btn')[0];
        const pauseBtn = document.querySelectorAll('.control-btn')[1];

        if (state.isPlaying) {
            pauseBtn.click();
        } else {
            playBtn.click();
        }
    }
});

// ===== REAL-TIME CLOCK IN INFO OVERLAY =====
setInterval(() => {
    const infoItems = document.querySelectorAll('.info-item');
    if (infoItems.length > 0) {
        // Simulate FPS variation
        const fpsItem = Array.from(infoItems).find(item => item.textContent.includes('FPS'));
        if (fpsItem) {
            const fps = 28 + Math.floor(Math.random() * 4); // 28-31 FPS
            fpsItem.querySelector('span').textContent = `${fps} FPS`;
        }

        // Simulate altitude variation
        const altItem = Array.from(infoItems).find(item => item.textContent.includes('Altitude'));
        if (altItem) {
            const altitude = 148 + Math.floor(Math.random() * 5); // 148-152m
            altItem.querySelector('span').textContent = `Altitude: ${altitude}m`;
        }
    }
}, 1000);

// ===== USER PROFILE DROPDOWN (Optional Enhancement) =====
const userProfile = document.querySelector('.user-profile');
if (userProfile) {
    userProfile.addEventListener('click', () => {
        console.log('User profile clicked - dropdown menu would appear here');
        // In a real app, show dropdown menu
    });
}

// ===== SEARCH FUNCTIONALITY =====
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        console.log('Searching for:', query);
        // In a real app, filter alerts/events based on search query
    });
}

// ===== NOTIFICATION BUTTON =====
const notificationBtn = document.querySelector('.icon-button');
if (notificationBtn) {
    notificationBtn.addEventListener('click', () => {
        console.log('Notifications panel would open here');
        switchView('alerts');
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
// Use requestAnimationFrame for smooth animations
let animationFrameId;

function animate() {
    // Smooth background animations
    const container = document.querySelector('.dashboard-container');
    if (container) {
        const time = Date.now() * 0.0001;
        const opacity = 0.8 + Math.sin(time) * 0.1;
        container.style.backgroundOpacity = opacity;
    }

    animationFrameId = requestAnimationFrame(animate);
}

// Start animation loop
animate();

// ===== CLEANUP ON PAGE UNLOAD =====
window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationFrameId);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c🚁 DroneGuard AI Detection System', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); -webkit-background-clip: text; color: transparent;');
console.log('%cCommand Center Dashboard Active', 'font-size: 14px; color: #10b981;');
console.log('%cKeyboard Shortcuts:\n1-6: Quick navigation\nSpace: Play/Pause feed', 'font-size: 12px; color: #9ca3af;');

// ===== EXPORT STATE (For debugging) =====
window.getDashboardState = () => state;
window.generateAlert = () => addNewAlert();
window.switchView = switchView;

// ===== EASTER EGG =====
let clickCount = 0;
const logo = document.querySelector('.logo svg');
if (logo) {
    logo.addEventListener('click', () => {
        clickCount++;
        if (clickCount === 5) {
            console.log('%c🎉 Easter Egg Found!', 'font-size: 16px; color: #ec4899;');
            console.log('Dev Mode Activated - Use window.generateAlert() to create alerts manually');
            clickCount = 0;
        }
    });
}
