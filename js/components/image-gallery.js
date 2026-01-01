class ImageGallery extends HTMLElement {
    constructor() {
        super();
        this.currentImageIndex = 0;
        this.images = [];
        this.isSlideShowOpen = false;
        this.isMobile = window.innerWidth < 576;
    }

    connectedCallback() {
        this.getImages();
        this.render();
        this.addEventListeners();
        this.handleResize();
    }

    getImages() {
        // Get image URLs from data attribute or gallery items
        const imageElements = this.querySelectorAll('[data-image]');
        this.images = Array.from(imageElements).map(el => ({
            url: el.getAttribute('data-image'),
            alt: el.getAttribute('data-alt') || 'Gallery image'
        }));
    }

    render() {
        let html = `
            <div class="image-gallery-container">
                <div class="gallery-grid">
        `;

        this.images.forEach((image, index) => {
            html += `
                <div class="gallery-item" data-index="${index}">
                    <img 
                        src="${image.url}" 
                        alt="${image.alt}"
                        class="gallery-image"
                    />
                </div>
            `;
        });

        html += `
                </div>
            </div>

            <!-- Slideshow Modal -->
            <div class="slideshow-modal" style="display: none;">
                <div class="slideshow-container">
                    <div class="slideshow-image-wrapper">
                        <img id="slideshow-image" src="" alt="Gallery image" />
                    </div>
                    
                    <button class="slideshow-nav prev-btn" aria-label="Previous image">
                        <span>❮</span>
                    </button>
                    
                    <button class="slideshow-nav next-btn" aria-label="Next image">
                        <span>❯</span>
                    </button>
                    
                    <button class="slideshow-close" aria-label="Close slideshow">
                        <span>✕</span>
                    </button>
                    
                    <div class="slideshow-counter">
                        <span id="current-image">1</span> / <span id="total-images">${this.images.length}</span>
                    </div>
                </div>
            </div>
        `;

        this.innerHTML = html;
    }

    addEventListeners() {
        // Gallery items
        this.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.isMobile) {
                    const index = parseInt(e.currentTarget.getAttribute('data-index'));
                    this.openSlideshow(index);
                }
            });
        });

        // Slideshow controls
        this.querySelector('.slideshow-close').addEventListener('click', () => {
            this.closeSlideshow();
        });

        this.querySelector('.prev-btn').addEventListener('click', () => {
            this.prevImage();
        });

        this.querySelector('.next-btn').addEventListener('click', () => {
            this.nextImage();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isSlideShowOpen) return;

            if (e.key === 'ArrowLeft') this.prevImage();
            if (e.key === 'ArrowRight') this.nextImage();
            if (e.key === 'Escape') this.closeSlideshow();
        });

        // Close on background click
        this.querySelector('.slideshow-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('slideshow-modal')) {
                this.closeSlideshow();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleResize() {
        this.isMobile = window.innerWidth < 576;
        
        // Close slideshow if user resizes to mobile
        if (this.isMobile && this.isSlideShowOpen) {
            this.closeSlideshow();
        }
    }

    openSlideshow(index) {
        this.currentImageIndex = index;
        this.isSlideShowOpen = true;

        const modal = this.querySelector('.slideshow-modal');
        const img = this.querySelector('#slideshow-image');
        
        img.src = this.images[index].url;
        img.alt = this.images[index].alt;
        
        this.querySelector('#current-image').textContent = index + 1;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeSlideshow() {
        this.isSlideShowOpen = false;
        const modal = this.querySelector('.slideshow-modal');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateSlideshow();
    }

    prevImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateSlideshow();
    }

    updateSlideshow() {
        const img = this.querySelector('#slideshow-image');
        img.src = this.images[this.currentImageIndex].url;
        img.alt = this.images[this.currentImageIndex].alt;
        this.querySelector('#current-image').textContent = this.currentImageIndex + 1;
    }
}

customElements.define('image-gallery', ImageGallery);
