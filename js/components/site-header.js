class SiteHeader extends HTMLElement {
    constructor() {
        super();
        this.isMenuOpen = false;
    }

    connectedCallback() {
        this.innerHTML = `
            <header class="site-header">
                <nav class="navbar">
                    <div class="nav-container">
                        <div class="nav-brand">
                            <a href="#" class="brand-link">
                                <img src="images/logo.png" alt="Mackenzie James Media" class="logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <span class="brand-text">Mackenzie James Media</span>
                            </a>
                        </div>
                        
                        <div class="nav-menu ${this.isMenuOpen ? 'active' : ''}">
                            <a href="#" class="nav-link">Home</a>
                            <a href="#portfolio" class="nav-link">Portfolio</a>
                            <a href="#services" class="nav-link">Services</a>
                            <a href="#about" class="nav-link">About</a>
                            <a href="#contact" class="nav-link nav-cta">Contact</a>
                        </div>
                        
                        <div class="nav-toggle" onclick="this.getRootNode().host.toggleMenu()">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </nav>
            </header>
        `;

        this.addStyles();
        this.addEventListeners();
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const menu = this.querySelector('.nav-menu');
        const toggle = this.querySelector('.nav-toggle');
        
        menu.classList.toggle('active');
        toggle.classList.toggle('active');
    }

    addEventListeners() {
        // Smooth scrolling for navigation links
        this.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = 70; // Height of the fixed header
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                if (this.isMenuOpen) {
                    this.toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.contains(e.target)) {
                this.toggleMenu();
            }
        });

        // Add sticky header scroll effect
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class to the component itself (for CSS targeting)
            if (scrollTop > 50) {
                this.classList.add('scrolled');
            } else {
                this.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .site-header {
                background: transparent;
                transition: all 0.3s ease;
            }

            .navbar {
                padding: 0;
            }

            .nav-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 70px;
            }

            .nav-brand .brand-link {
                display: flex;
                align-items: center;
                text-decoration: none;
                color: #1e293b;
                font-weight: 700;
                font-size: 1.5rem;
            }

            .logo {
                height: 40px;
                margin-right: 12px;
            }

            .brand-text {
                display: block;
            }

            .nav-menu {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .nav-link {
                text-decoration: none;
                color: #64748b;
                font-weight: 500;
                transition: color 0.3s ease;
                position: relative;
            }

            .nav-link:hover {
                color: #2563eb;
            }

            .nav-link::after {
                content: '';
                position: absolute;
                bottom: -4px;
                left: 0;
                width: 0;
                height: 2px;
                background: #2563eb;
                transition: width 0.3s ease;
            }

            .nav-link:hover::after {
                width: 100%;
            }

            .nav-cta {
                background: #2563eb;
                color: white !important;
                padding: 10px 20px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }

            .nav-cta::after {
                display: none;
            }

            .nav-cta:hover {
                background: #1d4ed8;
                transform: translateY(-2px);
            }

            .nav-toggle {
                display: none;
                flex-direction: column;
                cursor: pointer;
                padding: 4px;
            }

            .nav-toggle span {
                width: 25px;
                height: 3px;
                background: #333;
                margin: 3px 0;
                transition: 0.3s;
                border-radius: 2px;
            }

            .nav-toggle.active span:nth-child(1) {
                transform: rotate(-45deg) translate(-5px, 6px);
            }

            .nav-toggle.active span:nth-child(2) {
                opacity: 0;
            }

            .nav-toggle.active span:nth-child(3) {
                transform: rotate(45deg) translate(-5px, -6px);
            }

            /* Mobile Styles */
            @media (max-width: 768px) {
                .nav-menu {
                    position: fixed;
                    left: -100%;
                    top: 70px;
                    flex-direction: column;
                    background: white;
                    width: 100%;
                    text-align: center;
                    transition: 0.3s;
                    box-shadow: 0 10px 27px rgba(0,0,0,0.05);
                    padding: 2rem 0;
                    gap: 1rem;
                }

                .nav-menu.active {
                    left: 0;
                }

                .nav-toggle {
                    display: flex;
                }

                .brand-text {
                    font-size: 1.2rem;
                }
            }
        `;
        this.appendChild(style);
    }
}

customElements.define('site-header', SiteHeader);
