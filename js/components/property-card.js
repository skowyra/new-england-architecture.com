class PropertyCard extends HTMLElement {
    constructor() {
        super();
        this.propertyData = null;
    }

    static get observedAttributes() {
        return ['data-property'];
    }

    connectedCallback() {
        this.loadPropertyData();
        this.render();
        this.addEventListeners();
    }

    attributeChangedCallback() {
        if (this.isConnected) {
            this.loadPropertyData();
            this.render();
        }
    }

    loadPropertyData() {
        const propertyId = this.getAttribute('data-property');
        if (propertyId) {
            // In a real app, this would fetch from an API or JSON file
            // For now, we'll use sample data
            this.propertyData = this.getSampleProperty(propertyId);
        }
    }

    getSampleProperty(id) {
        const sampleProperties = {
            'modern-downtown-condo': {
                id: 'modern-downtown-condo',
                title: 'Modern Downtown Condo',
                location: '123 Main Street, Downtown',
                price: '$450,000',
                type: 'Residential',
                mainImage: 'images/properties/condo-main.jpg',
                images: [
                    'images/properties/condo-1.jpg',
                    'images/properties/condo-2.jpg',
                    'images/properties/condo-3.jpg',
                    'images/properties/condo-4.jpg'
                ],
                virtualTour: 'tours/modern-downtown-condo',
                description: 'Stunning modern condo with city views and luxury finishes throughout.',
                features: ['2 Bed', '2 Bath', 'City Views', 'Modern Kitchen']
            },
            'luxury-family-home': {
                id: 'luxury-family-home',
                title: 'Luxury Family Home',
                location: '456 Oak Avenue, Suburbs',
                price: '$750,000',
                type: 'Residential',
                mainImage: 'images/properties/home-main.jpg',
                images: [
                    'images/properties/home-1.jpg',
                    'images/properties/home-2.jpg',
                    'images/properties/home-3.jpg',
                    'images/properties/home-4.jpg'
                ],
                virtualTour: 'tours/luxury-family-home',
                description: 'Beautiful family home with spacious rooms and premium amenities.',
                features: ['4 Bed', '3 Bath', 'Large Yard', 'Gourmet Kitchen']
            },
            'commercial-office': {
                id: 'commercial-office',
                title: 'Modern Office Space',
                location: '789 Business District',
                price: '$2,500/month',
                type: 'Commercial',
                mainImage: 'images/properties/office-main.jpg',
                images: [
                    'images/properties/office-1.jpg',
                    'images/properties/office-2.jpg',
                    'images/properties/office-3.jpg'
                ],
                virtualTour: 'tours/commercial-office',
                description: 'Prime office space in the heart of the business district.',
                features: ['Open Floor Plan', 'Conference Rooms', 'Parking', 'Modern Amenities']
            }
        };

        return sampleProperties[id] || {
            id: 'placeholder',
            title: 'Sample Property',
            location: 'Location TBD',
            price: 'Price TBD',
            type: 'Residential',
            mainImage: 'images/placeholder.jpg',
            images: ['images/placeholder.jpg'],
            description: 'Property description coming soon.',
            features: ['Feature 1', 'Feature 2']
        };
    }

    render() {
        if (!this.propertyData) return;

        const { title, location, price, mainImage, virtualTour, features, type } = this.propertyData;

        this.innerHTML = `
            <div class="property-card">
                <div class="property-image-container">
                    <img src="${mainImage}" alt="${title}" class="property-main-image" 
                         onerror="this.onerror=null; this.src='images/placeholder.jpg'">
                    <div class="property-type-badge">${type}</div>
                    ${features.length > 0 ? `<div class="property-features">${features.slice(0, 2).join(' • ')}</div>` : ''}
                </div>
                
                <div class="property-card-overlay">
                    <div class="property-info">
                        <h3 class="property-card-title">${title}</h3>
                        <p class="property-card-location">${location}</p>
                        <p class="property-card-price">${price}</p>
                    </div>
                    
                    <div class="property-card-buttons">
                        <button class="property-card-btn gallery-btn">
                            View Gallery
                        </button>
                        ${virtualTour ? `
                            <button class="property-card-btn tour-btn">
                                Virtual Tour
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addEventListeners() {
        const galleryBtn = this.querySelector('.gallery-btn');
        const tourBtn = this.querySelector('.tour-btn');

        if (galleryBtn) {
            galleryBtn.addEventListener('click', () => this.openGallery());
        }

        if (tourBtn) {
            tourBtn.addEventListener('click', () => this.openVirtualTour());
        }

        // Add hover effect for card
        const card = this.querySelector('.property-card');
        if (card) {
            card.addEventListener('mouseenter', () => this.onHover());
            card.addEventListener('mouseleave', () => this.onLeave());
        }
    }

    onHover() {
        this.querySelector('.property-card').style.transform = 'translateY(-8px)';
        this.querySelector('.property-card-overlay').style.transform = 'translateY(0)';
    }

    onLeave() {
        this.querySelector('.property-card').style.transform = 'translateY(0)';
        this.querySelector('.property-card-overlay').style.transform = 'translateY(70%)';
    }

    openGallery() {
        // Dispatch custom event for gallery opening
        const event = new CustomEvent('openGallery', {
            detail: {
                property: this.propertyData,
                images: this.propertyData.images
            },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    openVirtualTour() {
        console.log('Virtual Tour button clicked!');
        console.log('Property data:', this.propertyData);
        console.log('Virtual tour path:', this.propertyData.virtualTour);
        
        if (this.propertyData.virtualTour) {
            console.log('Dispatching openVirtualTour event...');
            // Dispatch custom event for virtual tour
            const event = new CustomEvent('openVirtualTour', {
                detail: {
                    property: this.propertyData,
                    tourPath: this.propertyData.virtualTour
                },
                bubbles: true
            });
            this.dispatchEvent(event);
            console.log('Event dispatched!');
        } else {
            console.log('No virtual tour path found for this property');
        }
    }

    addStyles() {
        if (this.querySelector('style')) return; // Prevent duplicate styles

        const style = document.createElement('style');
        style.textContent = `
            .property-card {
                position: relative;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.07);
                transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                cursor: pointer;
                height: 350px;
            }

            .property-image-container {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .property-main-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
            }

            .property-card:hover .property-main-image {
                transform: scale(1.05);
            }

            .property-type-badge {
                position: absolute;
                top: 15px;
                left: 15px;
                background: rgba(37, 99, 235, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                backdrop-filter: blur(10px);
            }

            .property-features {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 500;
                backdrop-filter: blur(10px);
            }

            .property-card-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0,0,0,0.9));
                color: white;
                padding: 2rem;
                transform: translateY(70%);
                transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            }

            .property-info {
                margin-bottom: 1.5rem;
            }

            .property-card-title {
                font-size: 1.3rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                line-height: 1.2;
            }

            .property-card-location {
                opacity: 0.9;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }

            .property-card-price {
                font-size: 1.1rem;
                font-weight: 600;
                color: #60a5fa;
            }

            .property-card-buttons {
                display: flex;
                gap: 0.75rem;
            }

            .property-card-btn {
                padding: 10px 18px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9rem;
                transition: all 0.3s ease;
                flex: 1;
            }

            .gallery-btn {
                background: rgba(255,255,255,0.9);
                color: #333;
            }

            .gallery-btn:hover {
                background: white;
                transform: translateY(-2px);
            }

            .tour-btn {
                background: #2563eb;
                color: white;
            }

            .tour-btn:hover {
                background: #1d4ed8;
                transform: translateY(-2px);
            }

            /* Mobile Responsive */
            @media (max-width: 768px) {
                .property-card {
                    height: 300px;
                }

                .property-card-overlay {
                    transform: translateY(60%);
                }

                .property-card-title {
                    font-size: 1.1rem;
                }

                .property-card-buttons {
                    flex-direction: column;
                    gap: 0.5rem;
                }
            }
        `;
        this.appendChild(style);
    }
}

customElements.define('property-card', PropertyCard);
