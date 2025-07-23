// Main App JavaScript
class RealEstatePhotoApp {
    constructor() {
        this.currentModal = null;
        this.isLoaded = false;
    }

    init() {
        // Wait for DOM content to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        console.log('🏠 Real Estate Photography Site Loaded');
        
        // Initialize header functionality
        this.initHeader();
        
        // Initialize components
        this.setupScrollEffects();
        this.setupContactForm();
        this.setupSmoothScrolling();
        this.setupModalHandling();
        this.addBodyPadding();
        
        // Mark as loaded
        this.isLoaded = true;
        
        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('appReady'));
    }

    addBodyPadding() {
        // Add padding to body to account for fixed header
        document.body.style.paddingTop = '70px';
    }

    setupScrollEffects() {
        // Header scroll effect
        let lastScrollY = window.scrollY;
        const header = document.querySelector('site-header');
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (header) {
                const headerElement = header.querySelector('.site-header');
                if (headerElement) {
                    if (currentScrollY > lastScrollY && currentScrollY > 100) {
                        // Scrolling down - hide header
                        headerElement.style.transform = 'translateY(-100%)';
                    } else {
                        // Scrolling up - show header
                        headerElement.style.transform = 'translateY(0)';
                    }
                    
                    // Add/remove background opacity based on scroll
                    if (currentScrollY > 50) {
                        headerElement.style.background = 'rgba(255, 255, 255, 0.98)';
                        headerElement.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
                    } else {
                        headerElement.style.background = 'rgba(255, 255, 255, 0.95)';
                        headerElement.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                    }
                }
            }
            
            lastScrollY = currentScrollY;
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections for animation
        const sections = document.querySelectorAll('.services-overview, .about, .contact');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await this.submitContactForm(data);
                
                // Show success message
                this.showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    async submitContactForm(data) {
        // In a real application, you would send this to your backend
        // For now, we'll just simulate the submission
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submission:', data);
                resolve();
            }, 1000);
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for all anchor links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = 70; // Account for fixed header
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    setupModalHandling() {
        // Global modal handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.gallery-modal, .tour-modal');
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        `;

        // Add to DOM and animate in
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Utility methods for other components to use
    static getInstance() {
        if (!window.RealEstatePhotoApp.instance) {
            window.RealEstatePhotoApp.instance = new RealEstatePhotoApp();
        }
        return window.RealEstatePhotoApp.instance;
    }

    initHeader() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        // Sticky header scroll effect
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                if (targetId === 'top') {
                    // Scroll to very top for home link
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    // Regular section scrolling with header offset
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = 70;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Public API for other components
    getAppVersion() {
        return '1.0.0';
    }

    isAppReady() {
        return this.isLoaded;
    }
}

// Initialize the app
const app = new RealEstatePhotoApp();
app.init();

// Global functions for HTML onclick handlers
function toggleMobileMenu() {
    const menu = document.querySelector('.nav-menu');
    const toggle = document.querySelector('.nav-toggle');
    
    menu.classList.toggle('active');
    toggle.classList.toggle('active');
}

// Make app globally available
window.RealEstatePhotoApp = RealEstatePhotoApp;
window.appInstance = app;

// Export for module systems if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealEstatePhotoApp;
}
