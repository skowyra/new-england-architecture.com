class PropertyGallery extends HTMLElement {
    constructor() {
        super();
        this.properties = [];
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.currentImages = [];
    }

    connectedCallback() {
        this.loadProperties();
        this.render();
        this.addEventListeners();
        this.createModal();
    }

    loadProperties() {
        // Sample property data - in a real app, this would come from an API
        this.properties = [
            'modern-downtown-condo',
            'luxury-family-home',
            'commercial-office'
        ];
    }

    render() {
        this.innerHTML = `
            <div class="gallery-container">
                <div class="gallery-filters">
                    <button class="filter-btn active" data-filter="all">All Properties</button>
                    <button class="filter-btn" data-filter="residential">Residential</button>
                    <button class="filter-btn" data-filter="commercial">Commercial</button>
                    <button class="filter-btn" data-filter="luxury">Luxury</button>
                </div>
                
                <div class="property-gallery">
                    ${this.properties.map(propertyId => `
                        <property-card data-property="${propertyId}"></property-card>
                    `).join('')}
                </div>
            </div>
        `;

        this.addStyles();
    }

    addEventListeners() {
        // Filter buttons
        this.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Listen for gallery events from property cards
        this.addEventListener('openGallery', (e) => {
            this.openImageGallery(e.detail);
        });

        this.addEventListener('openVirtualTour', (e) => {
            this.openVirtualTour(e.detail);
        });
    }

    handleFilterClick(button) {
        // Update active filter button
        this.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        this.currentFilter = button.dataset.filter;
        this.filterProperties();
    }

    filterProperties() {
        const cards = this.querySelectorAll('property-card');
        
        cards.forEach(card => {
            const propertyId = card.getAttribute('data-property');
            const shouldShow = this.shouldShowProperty(propertyId);
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    shouldShowProperty(propertyId) {
        if (this.currentFilter === 'all') return true;
        
        // Simple filter logic - in a real app, this would be more sophisticated
        const filterMap = {
            'residential': ['modern-downtown-condo', 'luxury-family-home'],
            'commercial': ['commercial-office'],
            'luxury': ['luxury-family-home']
        };

        return filterMap[this.currentFilter]?.includes(propertyId) || false;
    }

    createModal() {
        // Create modal for image gallery
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="this.parentElement.style.display='none'"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.closest('.gallery-modal').style.display='none'">×</button>
                
                <div class="gallery-header">
                    <h3 class="gallery-title"></h3>
                    <p class="gallery-subtitle"></p>
                </div>
                
                <div class="gallery-main">
                    <div class="main-image-container">
                        <button class="gallery-nav prev" onclick="this.getRootNode().host.previousImage()">‹</button>
                        <img class="main-gallery-image" src="" alt="">
                        <button class="gallery-nav next" onclick="this.getRootNode().host.nextImage()">›</button>
                    </div>
                    
                    <div class="gallery-thumbnails">
                        <!-- Thumbnails will be populated dynamically -->
                    </div>
                </div>
                
                <div class="gallery-info">
                    <div class="image-counter">
                        <span class="current-image">1</span> / <span class="total-images">1</span>
                    </div>
                    <button class="virtual-tour-btn" style="display: none;">
                        Open Virtual Tour
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.modal = modal;
    }

    openImageGallery(detail) {
        const { property, images } = detail;
        this.currentImages = images;
        this.currentImageIndex = 0;

        // Update modal content
        this.modal.querySelector('.gallery-title').textContent = property.title;
        this.modal.querySelector('.gallery-subtitle').textContent = property.location;
        
        // Setup virtual tour button
        const tourBtn = this.modal.querySelector('.virtual-tour-btn');
        if (property.virtualTour) {
            tourBtn.style.display = 'block';
            tourBtn.onclick = () => this.openVirtualTour({ property, tourPath: property.virtualTour });
        } else {
            tourBtn.style.display = 'none';
        }

        this.updateGalleryDisplay();
        this.modal.style.display = 'flex';

        // Add keyboard navigation
        this.addKeyboardNavigation();
    }

    updateGalleryDisplay() {
        const mainImage = this.modal.querySelector('.main-gallery-image');
        const currentSpan = this.modal.querySelector('.current-image');
        const totalSpan = this.modal.querySelector('.total-images');
        const thumbnailsContainer = this.modal.querySelector('.gallery-thumbnails');

        // Update main image
        mainImage.src = this.currentImages[this.currentImageIndex];

        // Update counter
        currentSpan.textContent = this.currentImageIndex + 1;
        totalSpan.textContent = this.currentImages.length;

        // Update thumbnails
        thumbnailsContainer.innerHTML = this.currentImages.map((img, index) => `
            <img class="gallery-thumbnail ${index === this.currentImageIndex ? 'active' : ''}" 
                 src="${img}" 
                 alt="Thumbnail ${index + 1}"
                 onclick="this.getRootNode().host.setCurrentImage(${index})">
        `).join('');

        // Update navigation button states
        const prevBtn = this.modal.querySelector('.gallery-nav.prev');
        const nextBtn = this.modal.querySelector('.gallery-nav.next');
        
        prevBtn.style.opacity = this.currentImageIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = this.currentImageIndex === this.currentImages.length - 1 ? '0.5' : '1';
    }

    previousImage() {
        if (this.currentImageIndex > 0) {
            this.currentImageIndex--;
            this.updateGalleryDisplay();
        }
    }

    nextImage() {
        if (this.currentImageIndex < this.currentImages.length - 1) {
            this.currentImageIndex++;
            this.updateGalleryDisplay();
        }
    }

    setCurrentImage(index) {
        this.currentImageIndex = index;
        this.updateGalleryDisplay();
    }

    addKeyboardNavigation() {
        const keyHandler = (e) => {
            if (this.modal.style.display === 'flex') {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'Escape':
                        this.modal.style.display = 'none';
                        break;
                }
            }
        };

        document.addEventListener('keydown', keyHandler);
        
        // Store reference to remove later
        this.keyHandler = keyHandler;
    }

    openVirtualTour(detail) {
        const { property, tourPath } = detail;
        
        // Close image gallery if open
        if (this.modal) {
            this.modal.style.display = 'none';
        }

        // Create and show virtual tour modal
        const tourEvent = new CustomEvent('showVirtualTour', {
            detail: { property, tourPath },
            bubbles: true
        });
        document.dispatchEvent(tourEvent);
    }

    disconnectedCallback() {
        // Clean up event listeners
        if (this.keyHandler) {
            document.removeEventListener('keydown', this.keyHandler);
        }
    }

    addStyles() {
        if (this.querySelector('style')) return;

        const style = document.createElement('style');
        style.textContent = `
            .gallery-container {
                width: 100%;
            }

            .gallery-filters {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .filter-btn {
                padding: 10px 20px;
                border: 2px solid #e2e8f0;
                background: white;
                color: #64748b;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .filter-btn:hover,
            .filter-btn.active {
                border-color: #2563eb;
                background: #2563eb;
                color: white;
            }

            .property-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 2rem;
            }

            /* Modal Styles */
            .gallery-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                align-items: center;
                justify-content: center;
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
            }

            .modal-content {
                position: relative;
                width: 90%;
                height: 90%;
                max-width: 1200px;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                z-index: 10;
                transition: background 0.3s ease;
            }

            .modal-close:hover {
                background: rgba(0, 0, 0, 0.9);
            }

            .gallery-header {
                padding: 2rem 2rem 1rem;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }

            .gallery-title {
                margin: 0 0 0.5rem 0;
                color: #1e293b;
                font-size: 1.5rem;
            }

            .gallery-subtitle {
                margin: 0;
                color: #64748b;
            }

            .gallery-main {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }

            .main-image-container {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f8fafc;
            }

            .main-gallery-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
            }

            .gallery-nav {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 24px;
                transition: all 0.3s ease;
            }

            .gallery-nav:hover {
                background: rgba(0, 0, 0, 0.9);
                transform: translateY(-50%) scale(1.1);
            }

            .gallery-nav.prev {
                left: 20px;
            }

            .gallery-nav.next {
                right: 20px;
            }

            .gallery-thumbnails {
                display: flex;
                gap: 0.5rem;
                padding: 1rem;
                background: #f8fafc;
                overflow-x: auto;
                border-top: 1px solid #e2e8f0;
            }

            .gallery-thumbnail {
                width: 80px;
                height: 60px;
                object-fit: cover;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                flex-shrink: 0;
                border: 2px solid transparent;
            }

            .gallery-thumbnail:hover {
                transform: scale(1.05);
            }

            .gallery-thumbnail.active {
                border-color: #2563eb;
            }

            .gallery-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                background: #f8fafc;
                border-top: 1px solid #e2e8f0;
            }

            .image-counter {
                font-weight: 500;
                color: #64748b;
            }

            .virtual-tour-btn {
                background: #2563eb;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.3s ease;
            }

            .virtual-tour-btn:hover {
                background: #1d4ed8;
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .property-gallery {
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }

                .gallery-filters {
                    gap: 0.5rem;
                }

                .filter-btn {
                    padding: 8px 16px;
                    font-size: 0.9rem;
                }

                .modal-content {
                    width: 95%;
                    height: 95%;
                }

                .gallery-header {
                    padding: 1rem;
                }

                .gallery-info {
                    padding: 1rem;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: stretch;
                }

                .gallery-nav {
                    width: 40px;
                    height: 40px;
                    font-size: 18px;
                }

                .gallery-thumbnails {
                    padding: 0.5rem;
                }

                .gallery-thumbnail {
                    width: 60px;
                    height: 45px;
                }
            }
        `;
        this.appendChild(style);
    }
}

customElements.define('property-gallery', PropertyGallery);
