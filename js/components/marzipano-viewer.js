class MarzipanoViewer extends HTMLElement {
    constructor() {
        super();
        this.viewer = null;
        this.scenes = [];
        this.currentScene = null;
        this.isLoading = false;
    }

    static get observedAttributes() {
        return ['src', 'width', 'height', 'autoload'];
    }

    connectedCallback() {
        this.render();
        
        if (this.getAttribute('autoload') === 'true') {
            this.loadTour();
        }

        // Listen for virtual tour events
        document.addEventListener('openVirtualTour', (e) => {
            console.log('Marzipano viewer received openVirtualTour event:', e.detail);
            this.handleVirtualTourEvent(e.detail);
        });
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.updateDimensions();
        }
    }

    render() {
        const width = this.getAttribute('width') || '100%';
        const height = this.getAttribute('height') || '600px';

        this.innerHTML = `
            <div class="marzipano-container" style="width: ${width}; height: ${height};">
                <div class="marzipano-viewer" id="marzipano-${this.generateId()}"></div>
                
                <div class="marzipano-loading">
                    <div class="loading-spinner"></div>
                    <p>Loading Virtual Tour...</p>
                </div>
                
                <div class="marzipano-error" style="display: none;">
                    <div class="error-icon">⚠️</div>
                    <p>Failed to load virtual tour</p>
                    <button class="retry-btn">
                        Try Again
                    </button>
                </div>
                
                <div class="marzipano-controls">
                    <div class="scene-selector" style="display: none;">
                        <button class="control-btn prev-scene">
                            ← Previous Room
                        </button>
                        <span class="scene-info">
                            Room <span class="current-scene">1</span> of <span class="total-scenes">1</span>
                        </span>
                        <button class="control-btn next-scene">
                            Next Room →
                        </button>
                    </div>
                    
                    <div class="viewer-controls">
                        <button class="control-btn fullscreen-btn">
                            ⛶ Fullscreen
                        </button>
                        <button class="control-btn info-btn">
                            ℹ️ Info
                        </button>
                    </div>
                </div>
                
                <div class="tour-info" style="display: none;">
                    <div class="info-content">
                        <h3 class="tour-title"></h3>
                        <p class="tour-description"></p>
                        <div class="tour-features"></div>
                    </div>
                </div>
            </div>
        `;

        this.addStyles();
        this.createTourModal();
        this.addButtonEventListeners();
    }

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    addButtonEventListeners() {
        // Retry button
        const retryBtn = this.querySelector('.retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => this.loadTour());
        }

        // Scene navigation
        const prevBtn = this.querySelector('.prev-scene');
        const nextBtn = this.querySelector('.next-scene');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousScene());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextScene());
        }

        // Viewer controls
        const fullscreenBtn = this.querySelector('.fullscreen-btn');
        const infoBtn = this.querySelector('.info-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        if (infoBtn) {
            infoBtn.addEventListener('click', () => this.toggleInfo());
        }
    }

    updateDimensions() {
        const container = this.querySelector('.marzipano-container');
        if (container) {
            container.style.width = this.getAttribute('width') || '100%';
            container.style.height = this.getAttribute('height') || '600px';
        }
    }

    async loadTour() {
        console.log('loadTour called');
        const src = this.getAttribute('src');
        console.log('Tour src:', src);
        
        if (!src) {
            console.warn('No src attribute provided for marzipano-viewer');
            return;
        }

        this.showLoading(true);
        this.showError(false);

        try {
            // Wait for Marzipano library to be available
            let attempts = 0;
            while (typeof Marzipano === 'undefined' && attempts < 50) {
                console.log(`Waiting for Marzipano library... attempt ${attempts + 1}`);
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }
            
            if (typeof Marzipano === 'undefined') {
                throw new Error('Marzipano library failed to load after 5 seconds');
            }
            
            console.log('Marzipano library is available');

            // Initialize Marzipano viewer
            const viewerElement = this.querySelector('.marzipano-viewer');
            console.log('Viewer element:', viewerElement);
            
            if (!viewerElement) {
                throw new Error('Marzipano viewer element not found');
            }
            
            console.log('Creating Marzipano viewer...');
            this.viewer = new Marzipano.Viewer(viewerElement);
            console.log('Viewer created:', this.viewer);

            // For now, we'll create a sample tour
            // In a real implementation, you'd load tour configuration from src
            console.log('Creating sample tour...');
            await this.createSampleTour();
            console.log('Sample tour created');
            
            this.showLoading(false);
            this.setupControls();

        } catch (error) {
            console.error('Error loading Marzipano tour:', error);
            this.showError(true);
            this.showLoading(false);
        }
    }

    async createSampleTour() {
        console.log('createSampleTour started');
        
        // Sample tour data - in a real app, this would be loaded from the src URL
        const tourData = {
            title: 'Virtual Property Tour',
            description: 'Explore this beautiful property with our interactive virtual tour.',
            scenes: [
                {
                    id: 'living-room',
                    name: 'Living Room',
                    imageUrl: 'images/placeholder-360.jpg', // Placeholder for living room
                    hotspots: []
                },
                {
                    id: 'kitchen',
                    name: 'Kitchen',
                    imageUrl: 'https://mackenziejames.nyc3.cdn.digitaloceanspaces.com/tours/kitchen-cors.jpg',
                    hotspots: []
                }
            ]
        };

        console.log('Tour data:', tourData);

        // Update tour info
        const titleElement = this.querySelector('.tour-title');
        const descElement = this.querySelector('.tour-description');
        
        if (titleElement) titleElement.textContent = tourData.title;
        if (descElement) descElement.textContent = tourData.description;

        console.log('Creating scenes...');
        
        // Create scenes (simplified for demo)
        this.scenes = tourData.scenes.map((sceneData, index) => {
            console.log(`Creating scene ${index}:`, sceneData);
            
            try {
                // For demo purposes, we'll create a simple scene
                // In reality, you'd load actual 360° images
                const geometry = new Marzipano.EquirectGeometry([{ width: 4096 }]);
                console.log('Geometry created:', geometry);
                
                const source = Marzipano.ImageUrlSource.fromString(
                    sceneData.imageUrl || 'images/placeholder-360.jpg'
                );
                console.log('Source created:', source);
                
                const view = new Marzipano.RectilinearView();
                console.log('View created:', view);
                
                const scene = this.viewer.createScene({
                    source: source,
                    geometry: geometry,
                    view: view,
                    pinFirstLevel: true
                });
                console.log('Scene created:', scene);

                return {
                    ...sceneData,
                    scene: scene,
                    index: index
                };
            } catch (error) {
                console.error(`Error creating scene ${index}:`, error);
                throw error;
            }
        });

        console.log('All scenes created:', this.scenes);

        // Switch to first scene
        if (this.scenes.length > 0) {
            console.log('Switching to first scene...');
            this.switchToScene(0);
        } else {
            throw new Error('No scenes created');
        }
        
        console.log('createSampleTour completed');
    }

    switchToScene(index) {
        console.log(`switchToScene called with index: ${index}`);
        console.log(`Available scenes: ${this.scenes.length}`);
        
        if (index >= 0 && index < this.scenes.length) {
            this.currentScene = this.scenes[index];
            console.log('Switching to scene:', this.currentScene);
            
            try {
                this.currentScene.scene.switchTo();
                console.log('Scene switch successful');
                this.updateSceneInfo();
            } catch (error) {
                console.error('Error switching to scene:', error);
                throw error;
            }
        } else {
            console.error(`Invalid scene index: ${index}. Available scenes: 0-${this.scenes.length - 1}`);
        }
    }

    updateSceneInfo() {
        const currentSpan = this.querySelector('.current-scene');
        const totalSpan = this.querySelector('.total-scenes');
        
        if (currentSpan && totalSpan && this.currentScene) {
            currentSpan.textContent = this.currentScene.index + 1;
            totalSpan.textContent = this.scenes.length;
        }

        // Show/hide scene selector based on number of scenes
        const sceneSelector = this.querySelector('.scene-selector');
        if (sceneSelector) {
            sceneSelector.style.display = this.scenes.length > 1 ? 'flex' : 'none';
        }
    }

    previousScene() {
        if (this.currentScene && this.currentScene.index > 0) {
            this.switchToScene(this.currentScene.index - 1);
        }
    }

    nextScene() {
        if (this.currentScene && this.currentScene.index < this.scenes.length - 1) {
            this.switchToScene(this.currentScene.index + 1);
        }
    }

    toggleFullscreen() {
        const container = this.querySelector('.marzipano-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    toggleInfo() {
        const infoPanel = this.querySelector('.tour-info');
        const isVisible = infoPanel.style.display !== 'none';
        infoPanel.style.display = isVisible ? 'none' : 'block';
    }

    setupControls() {
        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport()) {
                switch(e.key) {
                    case 'ArrowLeft':
                        this.previousScene();
                        break;
                    case 'ArrowRight':
                        this.nextScene();
                        break;
                    case 'f':
                    case 'F':
                        this.toggleFullscreen();
                        break;
                }
            }
        });
    }

    isInViewport() {
        const rect = this.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    showLoading(show) {
        const loading = this.querySelector('.marzipano-loading');
        if (loading) {
            loading.style.display = show ? 'flex' : 'none';
        }
    }

    showError(show) {
        const error = this.querySelector('.marzipano-error');
        if (error) {
            error.style.display = show ? 'flex' : 'none';
        }
    }

    handleVirtualTourEvent(detail) {
        console.log('handleVirtualTourEvent called with:', detail);
        const { property, tourPath } = detail;
        
        // Show tour in modal
        this.showTourModal(property, tourPath);
    }

    createTourModal() {
        if (document.querySelector('.tour-modal')) return; // Already exists

        const modal = document.createElement('div');
        modal.className = 'tour-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="tour-modal-content">
                <div class="tour-header">
                    <h3 class="tour-modal-title"></h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="tour-viewer-container">
                    <marzipano-viewer width="100%" height="100%" autoload="false"></marzipano-viewer>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.tourModal = modal;

        // Add event listeners for modal controls
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.modal-close');
        
        backdrop.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    showTourModal(property, tourPath) {
        console.log('showTourModal called with:', property, tourPath);
        
        if (!this.tourModal) this.createTourModal();

        // Update modal title
        this.tourModal.querySelector('.tour-modal-title').textContent = 
            `Virtual Tour - ${property.title}`;

        // Set up the tour viewer
        const tourViewer = this.tourModal.querySelector('marzipano-viewer');
        tourViewer.setAttribute('src', tourPath);

        // Show modal
        this.tourModal.style.display = 'flex';
        console.log('Modal shown');

        // Load the tour
        setTimeout(() => {
            tourViewer.loadTour();
        }, 100);
    }

    addStyles() {
        if (this.querySelector('style')) return;

        const style = document.createElement('style');
        style.textContent = `
            .marzipano-container {
                position: relative;
                background: #000;
                border-radius: 8px;
                overflow: hidden;
            }

            .marzipano-viewer {
                width: 100%;
                height: 100%;
            }

            .marzipano-loading,
            .marzipano-error {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                z-index: 10;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .error-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
            }

            .retry-btn {
                background: #2563eb;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 1rem;
            }

            .marzipano-controls {
                position: absolute;
                bottom: 20px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 20;
            }

            .scene-selector {
                display: flex;
                align-items: center;
                gap: 1rem;
                background: rgba(0, 0, 0, 0.7);
                padding: 10px 20px;
                border-radius: 25px;
                color: white;
            }

            .viewer-controls {
                display: flex;
                gap: 0.5rem;
            }

            .control-btn {
                background: rgba(0, 0, 0, 0.7);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 0.9rem;
                transition: background 0.3s ease;
            }

            .control-btn:hover {
                background: rgba(0, 0, 0, 0.9);
            }

            .scene-info {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.9);
            }

            .tour-info {
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 1rem;
                border-radius: 8px;
                max-width: 300px;
                z-index: 20;
            }

            .tour-title {
                margin: 0 0 0.5rem 0;
                font-size: 1.2rem;
            }

            .tour-description {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }

            /* Tour Modal Styles */
            .tour-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 3000;
                align-items: center;
                justify-content: center;
            }

            .tour-modal .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
            }

            .tour-modal-content {
                position: relative;
                width: 95%;
                height: 95%;
                max-width: 1400px;
                background: #000;
                border-radius: 12px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }

            .tour-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 2rem;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .tour-modal-title {
                margin: 0;
                font-size: 1.3rem;
            }

            .tour-viewer-container {
                flex: 1;
                position: relative;
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .marzipano-controls {
                    flex-direction: column;
                    gap: 0.5rem;
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                }

                .scene-selector {
                    order: 2;
                    padding: 8px 15px;
                }

                .viewer-controls {
                    order: 1;
                    justify-content: center;
                }

                .control-btn {
                    padding: 8px 12px;
                    font-size: 0.8rem;
                }

                .tour-info {
                    top: 10px;
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }

                .tour-modal-content {
                    width: 100%;
                    height: 100%;
                    border-radius: 0;
                }

                .tour-header {
                    padding: 1rem;
                }
            }
        `;
        this.appendChild(style);
    }

    disconnectedCallback() {
        if (this.viewer) {
            this.viewer.destroy();
        }
    }
}

customElements.define('marzipano-viewer', MarzipanoViewer);
