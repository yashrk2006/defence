/**
 * DEFENCE SURVEILLANCE COMMAND CENTER
 * SIMULATION MODE - No Backend Required
 * Perfect for Hackathon Demos & Presentations
 */

// ===== SIMULATION MODE ENABLED =====
const SIMULATION_MODE = true;

console.log('🎭 SIMULATION MODE ACTIVE - No backend required!');

// ===== CONFIGURATION =====
const CONFIG = {
    REFRESH_INTERVAL: 2000,
    ALERT_POLL_INTERVAL: 3000,
    FPS_UPDATE_INTERVAL: 1000,
    MAX_ALERTS: 50,
    MAX_TIMELINE_EVENTS: 100,
    SIMULATION_MODE: true
};

// ===== STATE MANAGEMENT =====
const state = {
    currentView: 'live-feed',
    isStreamActive: true,
    detectionBoxesVisible: true,
    irModeEnabled: false,
    alerts: [],
    timelineEvents: [],
    systemStatus: {
        droneConnected: true,
        aiEngineRunning: true,
        streamLatency: 0
    },
    stats: {
        fps: 30,
        gps: { lat: 28.6139, lng: 77.2090 },
        altitude: 150
    },
    selectedCamera: 'alpha',
    simulationData: {
        detectionCount: 847,
        criticalThreats: 12,
        activeDrones: 3
    }
};

// ===== DOM ELEMENTS =====
let elements = {};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ Defence Surveillance Command Center - INITIALIZING...');
    console.log('🎭 Running in SIMULATION MODE (No backend required)');

    cacheElements();
    initializeNavigation();
    initializeControls();
    initializeSystemClock();

    // Initialize with simulated data
    initializeSimulatedSystem();
    startSimulation();

    console.log('✅ Command Center OPERATIONAL');
    console.log('💡 This is a frontend-only demo - all data is simulated');
});

// Cache all DOM elements
function cacheElements() {
    elements = {
        // Status indicators
        droneStatus: document.getElementById('drone-status'),
        droneStatusText: document.getElementById('drone-status-text'),
        aiStatus: document.getElementById('ai-status'),
        aiStatusText: document.getElementById('ai-status-text'),
        streamStatus: document.getElementById('stream-status'),
        streamLatency: document.getElementById('stream-latency'),

        // Top bar
        systemTime: document.getElementById('system-time'),
        currentViewTitle: document.getElementById('current-view-title'),
        refreshBtn: document.getElementById('refresh-btn'),
        settingsBtn: document.getElementById('settings-btn'),

        // Video panel
        cameraSelect: document.getElementById('camera-select'),
        toggleBoxes: document.getElementById('toggle-boxes'),
        toggleIR: document.getElementById('toggle-ir'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        videoWrapper: document.getElementById('video-wrapper'),
        videoFeed: document.getElementById('video-feed'),
        streamVideo: document.getElementById('stream-video'),
        detectionCanvas: document.getElementById('detection-canvas'),
        videoLoading: document.getElementById('video-loading'),

        // Feed info
        gpsCoords: document.getElementById('gps-coords'),
        altitude: document.getElementById('altitude'),
        fpsCounter: document.getElementById('fps-counter'),
        latencyDisplay: document.getElementById('latency-display'),

        // Alerts
        alertsContainer: document.getElementById('alerts-container'),
        alertCount: document.getElementById('alert-count'),
        clearAlertsBtn: document.getElementById('clear-alerts-btn'),

        // Timeline
        timelineEvents: document.getElementById('timeline-events'),
        filterType: document.getElementById('filter-type'),
        filterCamera: document.getElementById('filter-camera'),

        // Error banner
        errorBanner: document.getElementById('error-banner'),
        errorTitle: document.getElementById('error-title'),
        errorMessage: document.getElementById('error-message'),

        // Navigation
        navItems: document.querySelectorAll('.nav-item'),
        views: document.querySelectorAll('.view'),

        // Sidebar
        sidebar: document.getElementById('sidebar'),
        sidebarToggle: document.getElementById('sidebar-toggle'),

        // System health
        uptime: document.getElementById('uptime'),
        sysTemp: document.getElementById('sys-temp')
    };
}

// ===== SIMULATION INITIALIZATION =====
function initializeSimulatedSystem() {
    // Set all systems to operational
    updateSystemStatus('drone', true, 'CONNECTED');
    updateSystemStatus('ai', true, 'OPERATIONAL');
    updateSystemStatus('stream', true, '25 ms');

    // Hide loading, show simulated feed
    if (elements.videoLoading) {
        elements.videoLoading.style.display = 'none';
    }

    // Initialize GPS
    updateGPS(28.6139, 77.2090);

    // Initialize altitude
    updateAltitude(150);

    // Initialize FPS
    updateFPS(30);

    // Generate initial alerts
    generateInitialAlerts();

    // Generate initial timeline events
    generateInitialTimelineEvents();

    console.log('✅ Simulated system initialized');
}

function startSimulation() {
    // Simulate new detections periodically
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every interval
            generateSimulatedDetection();
        }
    }, CONFIG.REFRESH_INTERVAL);

    // Simulate new alerts occasionally
    setInterval(() => {
        if (Math.random() > 0.9) { // 10% chance
            generateSimulatedAlert();
        }
    }, CONFIG.ALERT_POLL_INTERVAL);

    // Update FPS with slight variations
    setInterval(() => {
        const fps = Math.floor(28 + Math.random() * 4);
        updateFPS(fps);
    }, CONFIG.FPS_UPDATE_INTERVAL);

    // Update latency
    setInterval(() => {
        const latency = Math.floor(20 + Math.random() * 15);
        updateLatency(latency);
    }, 2000);

    // Simulate GPS drift
    setInterval(() => {
        const lat = 28.6139 + (Math.random() - 0.5) * 0.001;
        const lng = 77.2090 + (Math.random() - 0.5) * 0.001;
        updateGPS(lat, lng);
    }, 5000);

    // Simulate altitude changes
    setInterval(() => {
        const alt = Math.floor(140 + Math.random() * 30);
        updateAltitude(alt);
    }, 3000);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    elements.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.dataset.view;
            switchView(viewName);
        });
    });

    // Sidebar toggle
    if (elements.sidebarToggle) {
        elements.sidebarToggle.addEventListener('click', () => {
            elements.sidebar.classList.toggle('collapsed');
        });
    }
}

function switchView(viewName) {
    state.currentView = viewName;

    // Update nav active state
    elements.navItems.forEach(item => {
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update view visibility
    elements.views.forEach(view => {
        if (view.id === `view-${viewName}`) {
            view.classList.add('active');
        } else {
            view.classList.remove('active');
        }
    });

    // Update title
    const viewTitles = {
        'live-feed': 'LIVE SURVEILLANCE FEED',
        'multi-cam': 'MULTI-CAMERA VIEW',
        'alerts': 'ALERTS MANAGEMENT',
        'events': 'EVENT LOG DATABASE',
        'evidence': 'EVIDENCE STORAGE',
        'health': 'SYSTEM HEALTH MONITORING'
    };

    if (elements.currentViewTitle) {
        elements.currentViewTitle.textContent = viewTitles[viewName] || 'COMMAND CENTER';
    }
}

// ===== CONTROLS =====
function initializeControls() {
    // Camera selector
    if (elements.cameraSelect) {
        elements.cameraSelect.addEventListener('change', (e) => {
            state.selectedCamera = e.target.value;
            console.log('📹 Switched to camera:', state.selectedCamera);
            showNotification(`Switched to ${state.selectedCamera.toUpperCase()}`);
        });
    }

    // Toggle detection boxes
    if (elements.toggleBoxes) {
        elements.toggleBoxes.addEventListener('click', () => {
            state.detectionBoxesVisible = !state.detectionBoxesVisible;
            elements.toggleBoxes.dataset.active = state.detectionBoxesVisible;
            console.log('📦 Detection boxes:', state.detectionBoxesVisible ? 'ON' : 'OFF');

            if (!state.detectionBoxesVisible) {
                clearCanvas();
            }
        });
    }

    // Toggle IR mode
    if (elements.toggleIR) {
        elements.toggleIR.addEventListener('click', () => {
            state.irModeEnabled = !state.irModeEnabled;
            elements.toggleIR.dataset.active = state.irModeEnabled;
            console.log('🔴 IR mode:', state.irModeEnabled ? 'ON' : 'OFF');

            // Simulate IR effect
            if (elements.videoFeed) {
                if (state.irModeEnabled) {
                    elements.videoFeed.style.filter = 'hue-rotate(270deg) saturate(3)';
                } else {
                    elements.videoFeed.style.filter = 'none';
                }
            }
            showNotification(`IR Mode ${state.irModeEnabled ? 'ENABLED' : 'DISABLED'}`);
        });
    }

    // Fullscreen
    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', () => {
            if (elements.videoWrapper) {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    elements.videoWrapper.requestFullscreen();
                }
            }
        });
    }

    // Clear alerts
    if (elements.clearAlertsBtn) {
        elements.clearAlertsBtn.addEventListener('click', clearAllAlerts);
    }

    // Refresh button
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', () => {
            console.log('🔄 Refreshing simulation data...');
            generateSimulatedDetection();
            generateSimulatedAlert();
            showNotification('Data Refreshed');
        });
    }

    // Timeline filters
    if (elements.filterType) {
        elements.filterType.addEventListener('change', renderTimeline);
    }
    if (elements.filterCamera) {
        elements.filterCamera.addEventListener('change', renderTimeline);
    }
}

// ===== SYSTEM CLOCK =====
function initializeSystemClock() {
    updateClock();
    setInterval(updateClock, 1000);

    // Uptime counter
    let uptimeSeconds = 0;
    setInterval(() => {
        uptimeSeconds++;
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;

        if (elements.uptime) {
            elements.uptime.textContent =
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }, 1000);

    // System temperature simulation
    setInterval(() => {
        if (elements.sysTemp) {
            const temp = Math.floor(45 + Math.random() * 15);
            elements.sysTemp.textContent = `${temp}°C`;
        }
    }, 5000);
}

function updateClock() {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];

    if (elements.systemTime) {
        elements.systemTime.textContent = timeString;
    }
}

// ===== SIMULATED DATA GENERATION =====
const DETECTION_TYPES = ['person', 'human', 'vehicle', 'object', 'intrusion'];
const THREAT_LEVELS = ['normal', 'warning', 'critical'];
const CAMERAS = ['alpha', 'beta', 'gamma'];

function generateSimulatedDetection() {
    const detection = {
        _id: Date.now(),
        type: DETECTION_TYPES[Math.floor(Math.random() * DETECTION_TYPES.length)],
        confidence: Math.random() * 0.3 + 0.7,
        threatLevel: THREAT_LEVELS[Math.floor(Math.random() * THREAT_LEVELS.length)],
        timestamp: new Date(),
        bbox: {
            x: Math.random() * 60 + 10, // percentage
            y: Math.random() * 60 + 10,
            width: Math.random() * 15 + 10,
            height: Math.random() * 15 + 10
        }
    };

    // Add to timeline
    addTimelineEvent(detection);

    // Draw on canvas if enabled
    if (state.detectionBoxesVisible) {
        drawDetectionBox(detection);
    }

    // Increment detection count
    state.simulationData.detectionCount++;

    console.log('🎯 Simulated detection:', detection.type, detection.confidence.toFixed(2));
}

function generateSimulatedAlert() {
    const alertTemplates = [
        {
            type: 'critical',
            messages: [
                'CRITICAL: Unauthorized person detected in restricted zone',
                'CRITICAL: Unidentified vehicle approaching perimeter',
                'CRITICAL: Intrusion detected - Sector {sector}',
                'CRITICAL: Suspicious activity detected'
            ]
        },
        {
            type: 'warning',
            messages: [
                'WARNING: Movement detected near fence line',
                'WARNING: Multiple personnel in secure area',
                'WARNING: Vehicle stopped in exclusion zone',
                'WARNING: Unusual heat signature detected'
            ]
        },
        {
            type: 'info',
            messages: [
                'INFO: Patrol route completed successfully',
                'INFO: Regular maintenance vehicle detected',
                'INFO: Authorized personnel movement logged',
                'INFO: System health check completed'
            ]
        }
    ];

    const alertType = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
    const message = alertType.messages[Math.floor(Math.random() * alertType.messages.length)]
        .replace('{sector}', CAMERAS[Math.floor(Math.random() * CAMERAS.length)].toUpperCase());

    const alert = {
        _id: Date.now(),
        type: alertType.type,
        message: message,
        timestamp: new Date(),
        acknowledged: false,
        location: {
            lat: 28.6139 + (Math.random() - 0.5) * 0.01,
            lng: 77.2090 + (Math.random() - 0.5) * 0.01
        }
    };

    // Add to alerts array
    state.alerts.unshift(alert);

    // Limit array size
    if (state.alerts.length > CONFIG.MAX_ALERTS) {
        state.alerts = state.alerts.slice(0, CONFIG.MAX_ALERTS);
    }

    renderAlerts();

    if (alert.type === 'critical') {
        state.simulationData.criticalThreats++;
    }

    console.log('🚨 Simulated alert:', alert.type, message);
}

function generateInitialAlerts() {
    // Generate 5-8 initial alerts
    const count = Math.floor(Math.random() * 4) + 5;
    for (let i = 0; i < count; i++) {
        setTimeout(() => generateSimulatedAlert(), i * 200);
    }
}

function generateInitialTimelineEvents() {
    // Generate 10-15 initial timeline events
    const count = Math.floor(Math.random() * 6) + 10;
    for (let i = 0; i < count; i++) {
        setTimeout(() => generateSimulatedDetection(), i * 150);
    }
}

// ===== DETECTION VISUALIZATION =====
let activeDetections = [];
const MAX_ACTIVE_DETECTIONS = 5;

function drawDetectionBox(detection) {
    if (!elements.videoFeed) return;

    // Add to active detections
    activeDetections.push({
        ...detection,
        createdAt: Date.now()
    });

    // Keep only recent detections
    if (activeDetections.length > MAX_ACTIVE_DETECTIONS) {
        activeDetections.shift();
    }

    // Redraw all active detections
    drawAllDetections();

    // Remove old detections after 3 seconds
    setTimeout(() => {
        activeDetections = activeDetections.filter(d =>
            d._id !== detection._id
        );
        drawAllDetections();
    }, 3000);
}

function drawAllDetections() {
    if (!elements.detectionCanvas || !state.detectionBoxesVisible) return;

    const canvas = elements.detectionCanvas;
    const rect = elements.videoFeed.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each active detection
    activeDetections.forEach(detection => {
        const age = Date.now() - detection.createdAt;
        const opacity = Math.max(0, 1 - (age / 3000)); // Fade out over 3 seconds

        // Calculate pixel coordinates
        const x = (detection.bbox.x / 100) * canvas.width;
        const y = (detection.bbox.y / 100) * canvas.height;
        const width = (detection.bbox.width / 100) * canvas.width;
        const height = (detection.bbox.height / 100) * canvas.height;

        // Determine color
        let color = '#00D9FF';
        if (detection.type === 'person' || detection.type === 'human') {
            color = '#FF0044';
        } else if (detection.type === 'vehicle') {
            color = '#FFB800';
        } else if (detection.type === 'intrusion') {
            color = '#FF4500';
        } else if (detection.threatLevel === 'critical') {
            color = '#FF0044';
        }

        ctx.globalAlpha = opacity;

        // Draw box
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw corners (tactical look)
        const cornerLen = 15;
        ctx.lineWidth = 3;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(x, y + cornerLen);
        ctx.lineTo(x, y);
        ctx.lineTo(x + cornerLen, y);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(x + width - cornerLen, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + cornerLen);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(x, y + height - cornerLen);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x + cornerLen, y + height);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(x + width - cornerLen, y + height);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + width, y + height - cornerLen);
        ctx.stroke();

        // Draw label
        const label = `${detection.type.toUpperCase()}`;
        const conf = `${Math.round(detection.confidence * 100)}%`;

        ctx.font = 'bold 11px Roboto Mono';
        const labelWidth = ctx.measureText(label).width;
        const confWidth = ctx.measureText(conf).width;
        const maxWidth = Math.max(labelWidth, confWidth);

        // Label background
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 38, maxWidth + 12, 36);

        // Label text
        ctx.fillStyle = '#000';
        ctx.fillText(label, x + 6, y - 22);
        ctx.fillText(conf, x + 6, y - 8);

        // Tracking line from box to label
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width / 2, y - 38);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.globalAlpha = 1;
    });
}

function clearCanvas() {
    if (!elements.detectionCanvas) return;
    const ctx = elements.detectionCanvas.getContext('2d');
    ctx.clearRect(0, 0, elements.detectionCanvas.width, elements.detectionCanvas.height);
    activeDetections = [];
}

// ===== SYSTEM STATUS UPDATES =====
function updateSystemStatus(system, isActive, text) {
    let statusDot, statusText;

    switch (system) {
        case 'drone':
            statusDot = elements.droneStatus;
            statusText = elements.droneStatusText;
            break;
        case 'ai':
            statusDot = elements.aiStatus;
            statusText = elements.aiStatusText;
            break;
        case 'stream':
            statusDot = elements.streamStatus;
            statusText = elements.streamLatency;
            break;
    }

    if (!statusDot || !statusText) return;

    statusDot.classList.remove('active', 'warning', 'error', 'pulse');

    if (isActive === true) {
        statusDot.classList.add('active', 'pulse');
    } else if (isActive === 'warning') {
        statusDot.classList.add('warning');
    } else {
        statusDot.classList.add('error');
    }

    if (statusText) {
        statusText.textContent = text;
    }
}

function updateGPS(lat, lng) {
    if (elements.gpsCoords) {
        elements.gpsCoords.textContent =
            `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
    }
    state.stats.gps = { lat, lng };
}

function updateAltitude(alt) {
    if (elements.altitude) {
        elements.altitude.textContent = `${alt}m`;
    }
    state.stats.altitude = alt;
}

function updateFPS(fps) {
    if (elements.fpsCounter) {
        elements.fpsCounter.textContent = fps;
    }
    state.stats.fps = fps;
}

function updateLatency(latency) {
    if (elements.streamLatency) {
        elements.streamLatency.textContent = `${latency} ms`;
    }
    if (elements.latencyDisplay) {
        elements.latencyDisplay.textContent = `${latency}ms`;
    }

    // Update status color
    if (latency < 50) {
        updateSystemStatus('stream', true, `${latency} ms`);
    } else if (latency < 100) {
        updateSystemStatus('stream', 'warning', `${latency} ms`);
    } else {
        updateSystemStatus('stream', false, `${latency} ms`);
    }
}

// ===== ALERTS RENDERING =====
function renderAlerts() {
    if (!elements.alertsContainer) return;

    if (state.alerts.length === 0) {
        elements.alertsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <p>NO ACTIVE ALERTS</p>
                <p style="font-size: 0.75rem; margin-top: 0.5rem;">System monitoring normally</p>
            </div>
        `;
        updateAlertBadge(0);
        return;
    }

    const alertsHTML = state.alerts.map(alert => createAlertCard(alert)).join('');
    elements.alertsContainer.innerHTML = alertsHTML;

    // Update badge
    const unacknowledged = state.alerts.filter(a => !a.acknowledged).length;
    updateAlertBadge(unacknowledged);

    // Add click handlers
    document.querySelectorAll('.alert-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            console.log('Alert clicked:', state.alerts[index]);
            showNotification('Alert selected');
        });
    });
}

function createAlertCard(alert) {
    const severity = alert.type || 'info';
    const time = formatTimestamp(alert.timestamp);
    const message = alert.message || 'Unknown alert';

    const gps = alert.location ?
        `${alert.location.lat.toFixed(4)}° N, ${alert.location.lng.toFixed(4)}° E` :
        '28.6139° N, 77.2090° E';

    return `
        <div class="alert-card ${severity}">
            <div class="alert-header">
                <span class="alert-type">${severity}</span>
                <span class="alert-time">${time}</span>
            </div>
            <div class="alert-message">${message}</div>
            <div class="alert-meta">
                <span class="alert-meta-item">📍 ${gps}</span>
            </div>
        </div>
    `;
}

function updateAlertBadge(count) {
    if (elements.alertCount) {
        elements.alertCount.textContent = count;
        elements.alertCount.style.display = count > 0 ? 'block' : 'none';
    }
}

function clearAllAlerts() {
    if (confirm('Clear all alerts?')) {
        state.alerts = [];
        renderAlerts();
        console.log('🗑️ Alerts cleared');
        showNotification('All alerts cleared');
    }
}

// ===== TIMELINE EVENTS =====
function addTimelineEvent(detection) {
    const event = {
        id: detection._id || Date.now(),
        time: new Date(detection.timestamp || Date.now()),
        type: detection.type || 'unknown',
        camera: state.selectedCamera,
        threatLevel: detection.threatLevel || 'normal',
        confidence: detection.confidence || 0,
        details: `Confidence: ${Math.round((detection.confidence || 0) * 100)}%`
    };

    state.timelineEvents.unshift(event);

    if (state.timelineEvents.length > CONFIG.MAX_TIMELINE_EVENTS) {
        state.timelineEvents = state.timelineEvents.slice(0, CONFIG.MAX_TIMELINE_EVENTS);
    }

    renderTimeline();
}

function renderTimeline() {
    if (!elements.timelineEvents) return;

    const filteredEvents = getFilteredTimelineEvents();

    if (filteredEvents.length === 0) {
        elements.timelineEvents.innerHTML = `
            <div style="padding: 2rem; color: #666; text-align: center;">
                No events found
            </div>
        `;
        return;
    }

    const eventsHTML = filteredEvents.map(event => createTimelineEvent(event)).join('');
    elements.timelineEvents.innerHTML = eventsHTML;

    document.querySelectorAll('.timeline-event').forEach((el, index) => {
        el.addEventListener('click', () => {
            console.log('Timeline event clicked:', filteredEvents[index]);
            showNotification('Event selected');
        });
    });
}

function createTimelineEvent(event) {
    const timeStr = event.time.toLocaleTimeString();
    const typeColors = {
        'person': '#FF0044',
        'human': '#FF0044',
        'vehicle': '#FFB800',
        'object': '#00D9FF',
        'intrusion': '#FF4500',
        'fire': '#FF6B00',
        'smoke': '#FF6B00'
    };

    const color = typeColors[event.type.toLowerCase()] || '#00FF41';

    return `
        <div class="timeline-event">
            <div class="timeline-event-time">${timeStr}</div>
            <div class="timeline-event-type" style="color: ${color};">
                ${event.type.toUpperCase()}
            </div>
            <div class="timeline-event-details">
                ${event.details}
            </div>
        </div>
    `;
}

function getFilteredTimelineEvents() {
    let filtered = [...state.timelineEvents];

    const typeFilter = elements.filterType?.value;
    if (typeFilter && typeFilter !== 'all') {
        filtered = filtered.filter(e =>
            e.type.toLowerCase() === typeFilter.toLowerCase()
        );
    }

    const cameraFilter = elements.filterCamera?.value;
    if (cameraFilter && cameraFilter !== 'all') {
        filtered = filtered.filter(e =>
            e.camera.toLowerCase() === cameraFilter.toLowerCase()
        );
    }

    return filtered;
}

// ===== NOTIFICATIONS =====
function showNotification(message) {
    console.log(`📢 ${message}`);
    // Could add toast notification UI here
}

// ===== UTILITY FUNCTIONS =====
function formatTimestamp(timestamp) {
    if (!timestamp) return 'Unknown time';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return date.toLocaleString();
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    const viewKeys = {
        '1': 'live-feed',
        '2': 'multi-cam',
        '3': 'alerts',
        '4': 'events',
        '5': 'evidence',
        '6': 'health'
    };

    if (viewKeys[e.key]) {
        switchView(viewKeys[e.key]);
    }

    if (e.key === 'F5') {
        e.preventDefault();
        generateSimulatedDetection();
        generateSimulatedAlert();
    }
});

// ===== DEBUG HELPERS =====
window.commandCenter = {
    getState: () => state,
    getConfig: () => CONFIG,
    addDetection: () => {
        generateSimulatedDetection();
        console.log('✅ Detection added');
    },
    addAlert: () => {
        generateSimulatedAlert();
        console.log('✅ Alert added');
    },
    clearTimeline: () => {
        state.timelineEvents = [];
        renderTimeline();
        console.log('🗑️ Timeline cleared');
    },
    clearAlerts: () => {
        state.alerts = [];
        renderAlerts();
        console.log('🗑️ Alerts cleared');
    }
};

console.log('💡 Debug helpers available:');
console.log('  window.commandCenter.addDetection() - Add simulated detection');
console.log('  window.commandCenter.addAlert() - Add simulated alert');
console.log('  window.commandCenter.clearTimeline() - Clear timeline');
console.log('  window.commandCenter.clearAlerts() - Clear alerts');

// ===== LIGHT/DARK MODE TOGGLE =====
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('commandCenterTheme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const body = document.body;
    const isLightMode = body.classList.contains('light-mode');

    if (isLightMode) {
        // Switch to dark mode
        body.classList.remove('light-mode');
        localStorage.setItem('commandCenterTheme', 'dark');
        showNotification('Dark Mode Enabled');
        console.log('🌙 Switched to Dark Mode');
    } else {
        // Switch to light mode
        body.classList.add('light-mode');
        localStorage.setItem('commandCenterTheme', 'light');
        showNotification('Light Mode Enabled - Perfect for Presentations!');
        console.log('☀️ Switched to Light Mode');
    }
}

// Initialize theme toggle when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeThemeToggle();
});
