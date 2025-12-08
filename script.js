// ===== STATE MANAGEMENT =====
let currentSlide = 0;
const totalSlides = 9;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeSlides();
    initializeNavigation();
    initializeKeyboardControls();
    initializeSwipeGestures();
    initializeParticles();
    initializeAnimations();
});

// ===== SLIDE MANAGEMENT =====
function initializeSlides() {
    updateSlideDisplay();
    updateSlideCounter();
    updateNavigationButtons();
}

function goToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= totalSlides) return;

    // Remove active class from current slide
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');

    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Update current slide index
    currentSlide = slideIndex;

    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');

    // Update UI
    updateSlideCounter();
    updateNavigationButtons();
    triggerSlideAnimations();

    // Play transition sound (optional)
    playTransitionEffect();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function previousSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function updateSlideDisplay() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

function updateSlideCounter() {
    document.getElementById('currentSlide').textContent = currentSlide + 1;
    document.getElementById('totalSlides').textContent = totalSlides;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

// ===== NAVIGATION CONTROLS =====
function initializeNavigation() {
    // Previous/Next buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        previousSlide();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        nextSlide();
    });

    // Slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });

        // Add tooltip with slide number
        indicator.setAttribute('data-slide', `Slide ${index + 1}`);
    });
}

// ===== KEYBOARD CONTROLS =====
function initializeKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
                previousSlide();
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case ' ': // Space bar
                nextSlide();
                e.preventDefault();
                break;
            case 'Home':
                goToSlide(0);
                e.preventDefault();
                break;
            case 'End':
                goToSlide(totalSlides - 1);
                e.preventDefault();
                break;
        }

        // Number keys for direct slide access
        if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key) - 1;
            if (slideNum < totalSlides) {
                goToSlide(slideNum);
            }
        }
    });
}

// ===== TOUCH/SWIPE GESTURES =====
function initializeSwipeGestures() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    const container = document.querySelector('.presentation-container');

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const horizontalSwipe = Math.abs(touchEndX - touchStartX);
        const verticalSwipe = Math.abs(touchEndY - touchStartY);

        // Only process horizontal swipes
        if (horizontalSwipe > verticalSwipe && horizontalSwipe > swipeThreshold) {
            if (touchEndX < touchStartX) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                previousSlide();
            }
        }

        // Vertical swipes
        if (verticalSwipe > horizontalSwipe && verticalSwipe > swipeThreshold) {
            if (touchEndY < touchStartY) {
                // Swipe up - next slide
                nextSlide();
            } else {
                // Swipe down - previous slide
                previousSlide();
            }
        }
    }

    // Mouse wheel navigation
    let scrollTimeout;
    container.addEventListener('wheel', (e) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }, 150);
    }, { passive: true });
}

// ===== PARTICLE ANIMATION =====
function initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    const numParticles = 30;

    for (let i = 0; i < numParticles; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 1}px`;
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(99, 102, 241, ${Math.random() * 0.5 + 0.1})`;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.5)';

    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Animation
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;

    particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;

    container.appendChild(particle);

    // Add keyframes dynamically
    if (!document.getElementById('particle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'particle-keyframes';
        style.innerHTML = `
            @keyframes float {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.3;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
                    opacity: 0.7;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                    opacity: 0.4;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== ANIMATIONS =====
function initializeAnimations() {
    // Observe elements with data-aos attributes
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos
    document.querySelectorAll('[data-aos]').forEach(el => {
        observer.observe(el);
    });
}

function triggerSlideAnimations() {
    const currentSlideElement = document.querySelectorAll('.slide')[currentSlide];
    const animatedElements = currentSlideElement.querySelectorAll('[data-aos]');

    // Reset animations
    animatedElements.forEach(el => {
        el.classList.remove('aos-animate');
    });

    // Trigger animations with delays
    setTimeout(() => {
        animatedElements.forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, delay);
        });
    }, 100);
}

// ===== TRANSITION EFFECTS =====
function playTransitionEffect() {
    // Visual feedback for slide transition
    const container = document.querySelector('.presentation-container');
    container.style.opacity = '0.95';
    setTimeout(() => {
        container.style.opacity = '1';
    }, 150);
}

// ===== EDITABLE FIELDS ENHANCEMENT =====
function initializeEditableFields() {
    const editableFields = document.querySelectorAll('.editable-field, .table-input');

    editableFields.forEach(field => {
        // Auto-save to localStorage
        field.addEventListener('input', (e) => {
            const fieldId = e.target.id || e.target.placeholder;
            localStorage.setItem(`field_${fieldId}`, e.target.value);
        });

        // Load saved values
        const fieldId = field.id || field.placeholder;
        const savedValue = localStorage.getItem(`field_${fieldId}`);
        if (savedValue) {
            field.value = savedValue;
        }

        // Smooth focus effect
        field.addEventListener('focus', () => {
            field.style.transform = 'scale(1.02)';
        });

        field.addEventListener('blur', () => {
            field.style.transform = 'scale(1)';
        });
    });
}

// Initialize editable fields
document.addEventListener('DOMContentLoaded', initializeEditableFields);

// ===== INTERACTIVE CARDS =====
function initializeInteractiveCards() {
    const cards = document.querySelectorAll('.problem-card, .feature-card, .impact-card, .tech-category, .team-member-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(99, 102, 241, 0.3)';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.pointerEvents = 'none';
            ripple.style.animation = 'ripple 1s ease-out';

            const rect = card.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left - 10}px`;
            ripple.style.top = `${e.clientY - rect.top - 10}px`;

            card.style.position = 'relative';
            card.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1000);
        });
    });

    // Add ripple animation
    if (!document.getElementById('ripple-keyframes')) {
        const style = document.createElement('style');
        style.id = 'ripple-keyframes';
        style.innerHTML = `
            @keyframes ripple {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize interactive cards
document.addEventListener('DOMContentLoaded', initializeInteractiveCards);

// ===== PROTOTYPE DASHBOARD ANIMATION =====
function initializePrototypeDashboard() {
    const detectionBoxes = document.querySelectorAll('.detection-box');

    // Random movement for detection boxes
    detectionBoxes.forEach(box => {
        setInterval(() => {
            const currentTop = parseFloat(box.style.top || box.getAttribute('style')?.match(/top:\s*(\d+)%/)?.[1] || 20);
            const currentLeft = parseFloat(box.style.left || box.getAttribute('style')?.match(/left:\s*(\d+)%/)?.[1] || 15);

            const newTop = currentTop + (Math.random() - 0.5) * 2;
            const newLeft = currentLeft + (Math.random() - 0.5) * 2;

            box.style.top = `${Math.max(10, Math.min(80, newTop))}%`;
            box.style.left = `${Math.max(10, Math.min(80, newLeft))}%`;
        }, 2000);
    });

    // Simulate new alerts
    const alertsPanel = document.querySelector('.alerts-panel');
    if (alertsPanel) {
        setInterval(() => {
            // Flash the latest alert
            const latestAlert = document.querySelector('.alert-item');
            if (latestAlert) {
                latestAlert.style.animation = 'none';
                setTimeout(() => {
                    latestAlert.style.animation = 'alertFlash 2s ease';
                }, 10);
            }
        }, 5000);
    }

    // Add alert flash animation
    if (!document.getElementById('alert-keyframes')) {
        const style = document.createElement('style');
        style.id = 'alert-keyframes';
        style.innerHTML = `
            @keyframes alertFlash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize prototype dashboard
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializePrototypeDashboard, 1000);
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== EXPORT DATA FUNCTIONALITY =====
function exportPresentationData() {
    const data = {};
    const fields = document.querySelectorAll('.editable-field, .table-input');

    fields.forEach(field => {
        const key = field.id || field.placeholder;
        data[key] = field.value;
    });

    // Download as JSON
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'presentation-data.json';
    link.click();
}

// Add export button (optional)
function addExportButton() {
    const exportBtn = document.createElement('button');
    exportBtn.id = 'exportBtn';
    exportBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
    `;
    exportBtn.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f9fafb;
    `;

    exportBtn.addEventListener('click', exportPresentationData);
    exportBtn.addEventListener('mouseenter', () => {
        exportBtn.style.background = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
        exportBtn.style.transform = 'scale(1.1)';
    });
    exportBtn.addEventListener('mouseleave', () => {
        exportBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        exportBtn.style.transform = 'scale(1)';
    });

    document.body.appendChild(exportBtn);
}

// Optional: Add export functionality
// document.addEventListener('DOMContentLoaded', addExportButton);

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load animations only when needed
const debouncedAnimation = debounce(triggerSlideAnimations, 100);

// ===== ACCESSIBILITY =====
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    document.getElementById('prevBtn').setAttribute('aria-label', 'Previous Slide');
    document.getElementById('nextBtn').setAttribute('aria-label', 'Next Slide');

    // Focus management
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'region');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${totalSlides}`);
    });
});

// ===== CONSOLE EASTER EGG =====
console.log('%c🚁 AI-Powered Drone Surveillance System', 'font-size: 20px; font-weight: bold; background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%); -webkit-background-clip: text; color: transparent;');
console.log('%cMaking drones smarter: AI that detects threats before humans can.', 'font-size: 14px; color: #6366f1;');
console.log('%cKeyboard shortcuts:\n← → : Navigate\nHome/End : First/Last slide\n1-9 : Jump to slide', 'font-size: 12px; color: #9ca3af;');

// ===== AUTO-PLAY MODE (Optional) =====
let autoPlayInterval;
function startAutoPlay(intervalMs = 10000) {
    autoPlayInterval = setInterval(() => {
        if (currentSlide < totalSlides - 1) {
            nextSlide();
        } else {
            goToSlide(0); // Loop back to start
        }
    }, intervalMs);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Add 'p' key to toggle auto-play
document.addEventListener('keydown', (e) => {
    if (e.key === 'p' || e.key === 'P') {
        if (autoPlayInterval) {
            stopAutoPlay();
            console.log('Auto-play stopped');
        } else {
            startAutoPlay();
            console.log('Auto-play started');
        }
    }
});

// ===== FULLSCREEN TOGGLE =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
});
