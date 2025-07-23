class SiteFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer class="site-footer">
                <div class="footer-content">
                    <div class="footer-section">
                        <div class="footer-brand">
                            <h3>Mackenzie James Media</h3>
                            <p>Professional Real Estate Photography</p>
                        </div>
                        
                        <div class="footer-contact">
                            <h4>Contact Information</h4>
                            <p>📞 <a href="tel:+1234567890">(123) 456-7890</a></p>
                            <p>✉️ <a href="mailto:hello@mackenziejamesmedia.com">hello@mackenziejamesmedia.com</a></p>
                            <p>📍 Serving [Your City] and surrounding areas</p>
                        </div>
                        
                        <div class="footer-services">
                            <h4>Services</h4>
                            <ul>
                                <li>Interior Photography</li>
                                <li>Virtual Tours & 360° Views</li>
                                <li>Drone/Aerial Photography</li>
                                <li>Twilight Photography</li>
                                <li>Commercial Properties</li>
                            </ul>
                        </div>
                        
                        <div class="footer-social">
                            <h4>Follow Us</h4>
                            <div class="social-links">
                                <a href="#" class="social-link" aria-label="Instagram">📷</a>
                                <a href="#" class="social-link" aria-label="Facebook">📘</a>
                                <a href="#" class="social-link" aria-label="LinkedIn">💼</a>
                                <a href="#" class="social-link" aria-label="YouTube">📺</a>
                            </div>
                            
                            <div class="footer-cta">
                                <p><strong>Ready to showcase your listings?</strong></p>
                                <a href="#contact" class="footer-btn">Get Started Today</a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <p>&copy; ${new Date().getFullYear()} Mackenzie James Media. All rights reserved.</p>
                            <div class="footer-links">
                                <a href="#privacy">Privacy Policy</a>
                                <a href="#terms">Terms of Service</a>
                                <a href="#sitemap">Sitemap</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        this.addStyles();
        this.addEventListeners();
    }

    addEventListeners() {
        // Smooth scrolling for footer navigation
        this.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add hover effects to social links
        this.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateY(-3px) scale(1.1)';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .site-footer {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                color: white;
                margin-top: 4rem;
            }

            .footer-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }

            .footer-section {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 3rem;
                padding: 3rem 0;
            }

            .footer-brand h3 {
                color: #60a5fa;
                margin-bottom: 0.5rem;
                font-size: 1.5rem;
            }

            .footer-brand p {
                color: rgba(255, 255, 255, 0.8);
                font-size: 1.1rem;
            }

            .footer-contact h4,
            .footer-services h4,
            .footer-social h4 {
                color: #60a5fa;
                margin-bottom: 1rem;
                font-size: 1.2rem;
            }

            .footer-contact p {
                margin-bottom: 0.5rem;
                color: rgba(255, 255, 255, 0.9);
            }

            .footer-contact a {
                color: white;
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .footer-contact a:hover {
                color: #60a5fa;
            }

            .footer-services ul {
                list-style: none;
                padding: 0;
            }

            .footer-services li {
                margin-bottom: 0.5rem;
                color: rgba(255, 255, 255, 0.9);
                position: relative;
                padding-left: 1rem;
            }

            .footer-services li::before {
                content: '→';
                position: absolute;
                left: 0;
                color: #60a5fa;
            }

            .social-links {
                display: flex;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .social-link {
                display: inline-block;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                text-align: center;
                line-height: 40px;
                font-size: 1.2rem;
                text-decoration: none;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .social-link:hover {
                background: #2563eb;
                transform: translateY(-3px) scale(1.1);
            }

            .footer-cta {
                background: rgba(37, 99, 235, 0.2);
                padding: 1.5rem;
                border-radius: 10px;
                text-align: center;
                border: 1px solid rgba(37, 99, 235, 0.3);
            }

            .footer-cta p {
                margin-bottom: 1rem;
                color: white;
            }

            .footer-btn {
                display: inline-block;
                background: #2563eb;
                color: white;
                padding: 12px 24px;
                border-radius: 6px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .footer-btn:hover {
                background: #1d4ed8;
                transform: translateY(-2px);
            }

            .footer-bottom {
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 2rem 0;
            }

            .footer-bottom-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: rgba(255, 255, 255, 0.7);
            }

            .footer-links {
                display: flex;
                gap: 2rem;
            }

            .footer-links a {
                color: rgba(255, 255, 255, 0.7);
                text-decoration: none;
                transition: color 0.3s ease;
            }

            .footer-links a:hover {
                color: #60a5fa;
            }

            /* Mobile Responsive */
            @media (max-width: 1024px) {
                .footer-section {
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                }
            }

            @media (max-width: 768px) {
                .footer-section {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    padding: 2rem 0;
                }

                .footer-bottom-content {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }

                .footer-links {
                    gap: 1rem;
                }

                .social-links {
                    justify-content: center;
                }

                .footer-cta {
                    margin-top: 1rem;
                }
            }

            @media (max-width: 480px) {
                .footer-links {
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .social-links {
                    flex-wrap: wrap;
                    justify-content: center;
                }
            }
        `;
        this.appendChild(style);
    }
}

customElements.define('site-footer', SiteFooter);
