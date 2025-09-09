// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links (use actual navbar height)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle on-page anchors
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarEl = document.querySelector('.navbar');
                const offset = navbarEl ? navbarEl.offsetHeight : 70;
                const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = Math.max(0, elementPosition - offset);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Navbar scroll effect (sticky on top)
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove background opacity based on scroll position
    if (scrollTop > 50) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Keep navbar visible at all times (no auto-hide)
    navbar.style.transform = 'translateY(0)';
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animations
const animateElements = document.querySelectorAll('.feature-card, .platform-card, .team-card, .section-header');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Parallax effect for floating cards in hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const speed = 0.3 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
    
    // Parallax for hero circle
    const heroCircle = document.querySelector('.hero-circle');
    if (heroCircle) {
        heroCircle.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0005})`;
    }
});

// Typing animation for hero title
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // First show "Initializing..."
        heroTitle.innerHTML = '';
        
        setTimeout(() => {
            heroTitle.innerHTML = '';
            typeWriter(heroTitle, 'Initiallizing... Project Trinetra', 50);
        }, 500);
    }
});

// Initialize EmailJS
(function() {
    emailjs.init('IOH-i2ErkHXJHXXzG'); // Your EmailJS public key
})();

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = contactForm.querySelector('input[name="from_name"]').value;
        const message = contactForm.querySelector('textarea[name="message"]').value;
        
        // Simple validation
        if (!name || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email using EmailJS
        emailjs.sendForm('service_p2zsz79', 'template_63e12we', '#contact-form')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            }, function(error) {
                console.log('FAILED...', error);
                showNotification('Failed to send message. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemove);
        removeNotification(notification);
    });
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation to buttons on click
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (!this.disabled) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            // Add ripple animation CSS if not exists
            if (!document.querySelector('#ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                    .btn {
                        position: relative;
                        overflow: hidden;
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.appendChild(ripple);
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        }
    });
});

// Cursor trail effect (optional - can be disabled if too much)
const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
    });
    
    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations go here
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Update scroll progress
    const scrollProgress = scrolled / (documentHeight - windowHeight);
    
    // You can use this for scroll progress bars or other effects
    document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
}, 16)); // ~60fps

// Add smooth transitions when page loads
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.3s ease';
});

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Professional website loaded successfully!');
    // Initialize team images (handled by unified DOM ready below)
    
    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', (e) => {
            e.target.style.outline = '2px solid var(--primary-color)';
            e.target.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', (e) => {
            e.target.style.outline = 'none';
        });
    });
});

// Dark mode toggle (bonus feature)
function initDarkModeToggle() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.style.cssText = `
        position: fixed;
        top: 50%;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-gradient);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        z-index: 999;
        transition: all 0.3s ease;
        display: none; /* Hidden by default since we're already dark */
    `;
    
    document.body.appendChild(darkModeToggle);
}

// Initialize dark mode toggle
// initDarkModeToggle(); // Uncomment if you want the toggle

// Coming Soon alert handlers for Instagram and WhatsApp buttons
function initComingSoonAlerts() {
    const links = document.querySelectorAll('.platform-card .platform-link');
    links.forEach(link => {
        const text = (link.textContent || '').trim().toLowerCase();
        // Handle both correct and misspelled variants
        const isComingSoon = text.includes('coming soon') || text.includes('comming soon');
        if (isComingSoon) {
            // Accessibility hint
            if (!link.title) link.title = 'Coming soon';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const card = link.closest('.platform-card');
                const platform = card && card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'This feature';
                alert(`${platform} integration is coming soon!`);
            });
        }
    });
}

// Team images: try multiple extensions for img1..img5 and load the first that exists
function initTeamImages() {
    // Prevent double initialization
    if (window.__teamImagesInit) return;
    window.__teamImagesInit = true;

    const cards = document.querySelectorAll('.team-image[data-img]');
    cards.forEach(card => {
        const base = card.getAttribute('data-img');
        setTeamImage(card, base);
    });
}

function setTeamImage(container, baseName) {
    const extensions = ['.jpg', '.jpeg', '.png', '.webp'];
    let index = 0;

    function tryNext() {
        if (index >= extensions.length) {
            // Fallback to placeholder icon if nothing loads
            container.innerHTML = '<div class="team-placeholder"><i class="fas fa-user"></i></div>';
            return;
        }
        const img = new Image();
        img.alt = baseName;
        img.className = 'team-photo';
        img.loading = 'lazy';
        img.onload = () => {
            container.innerHTML = '';
            container.appendChild(img);
        };
        img.onerror = () => {
            index++;
            tryNext();
        };
        img.src = `${baseName}${extensions[index]}`;
    }

    // Start loading attempts
    tryNext();
}

// Ensure handlers are set up when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initComingSoonAlerts();
        initTeamImages();
    });
} else {
    initComingSoonAlerts();
    initTeamImages();
}
