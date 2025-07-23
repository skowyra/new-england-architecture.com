/**
 * @file
 * Real estate photography site enhancements
 */

(function (Drupal, drupalSettings, once) {
  'use strict';

  /**
   * Image gallery lightbox functionality
   */
  Drupal.behaviors.imageGalleryLightbox = {
    attach: function (context, settings) {
      once('image-lightbox', '.image-lightbox', context).forEach(function (element) {
        element.addEventListener('click', function(e) {
          e.preventDefault();
          
          const imgSrc = this.querySelector('img').src;
          const imgAlt = this.querySelector('img').alt || '';
          
          // Create lightbox modal
          const lightbox = document.createElement('div');
          lightbox.className = 'lightbox-modal';
          lightbox.innerHTML = `
            <div class="lightbox-overlay">
              <div class="lightbox-content">
                <img src="${imgSrc}" alt="${imgAlt}" class="lightbox-image">
                <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
              </div>
            </div>
          `;
          
          // Add lightbox styles
          const style = document.createElement('style');
          style.textContent = `
            .lightbox-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0, 0, 0, 0.9);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10000;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .lightbox-modal.active {
              opacity: 1;
            }
            .lightbox-content {
              position: relative;
              max-width: 90vw;
              max-height: 90vh;
            }
            .lightbox-image {
              max-width: 100%;
              max-height: 90vh;
              object-fit: contain;
              border-radius: 8px;
            }
            .lightbox-close {
              position: absolute;
              top: -40px;
              right: 0;
              background: none;
              border: none;
              color: white;
              font-size: 2rem;
              cursor: pointer;
              padding: 8px;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .lightbox-close:hover {
              background: rgba(255, 255, 255, 0.2);
            }
          `;
          
          document.head.appendChild(style);
          document.body.appendChild(lightbox);
          
          // Show lightbox with animation
          setTimeout(() => lightbox.classList.add('active'), 10);
          
          // Close lightbox functionality
          const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => {
              document.body.removeChild(lightbox);
              document.head.removeChild(style);
            }, 300);
          };
          
          lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
          lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
              closeLightbox();
            }
          });
          
          // Close on escape key
          const escapeHandler = (e) => {
            if (e.key === 'Escape') {
              closeLightbox();
              document.removeEventListener('keydown', escapeHandler);
            }
          };
          document.addEventListener('keydown', escapeHandler);
        });
      });
    }
  };

  /**
   * Property showcase image gallery
   */
  Drupal.behaviors.propertyImageGallery = {
    attach: function (context, settings) {
      once('property-gallery', '.property-gallery', context).forEach(function (gallery) {
        const mainImage = gallery.querySelector('.property-main-image');
        const thumbnails = gallery.querySelectorAll('.property-thumbnail');
        
        if (!mainImage || !thumbnails.length) return;
        
        thumbnails.forEach(function(thumb) {
          thumb.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update main image
            const newSrc = this.dataset.fullsize || this.src;
            const newAlt = this.alt || '';
            
            mainImage.src = newSrc;
            mainImage.alt = newAlt;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Add loading effect
            mainImage.style.opacity = '0.7';
            mainImage.onload = function() {
              this.style.opacity = '1';
            };
          });
        });
        
        // Set first thumbnail as active by default
        if (thumbnails[0]) {
          thumbnails[0].classList.add('active');
        }
      });
    }
  };

  /**
   * Smooth scroll for anchor links
   */
  Drupal.behaviors.smoothScroll = {
    attach: function (context, settings) {
      once('smooth-scroll', 'a[href^="#"]', context).forEach(function (link) {
        link.addEventListener('click', function(e) {
          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
    }
  };

  /**
   * Lazy loading for images
   */
  Drupal.behaviors.lazyLoadImages = {
    attach: function (context, settings) {
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              
              // Add loading class
              img.classList.add('image-loading');
              
              // Load the image
              const actualSrc = img.dataset.src || img.src;
              const tempImg = new Image();
              
              tempImg.onload = function() {
                img.src = actualSrc;
                img.classList.remove('image-loading');
                img.classList.add('image-loaded');
              };
              
              tempImg.onerror = function() {
                img.classList.remove('image-loading');
                img.classList.add('image-error');
              };
              
              tempImg.src = actualSrc;
              observer.unobserve(img);
            }
          });
        });

        once('lazy-load', 'img[data-src], .lazy-load img', context).forEach(function (img) {
          imageObserver.observe(img);
        });
      }
    }
  };

  /**
   * Property card hover effects
   */
  Drupal.behaviors.propertyCardEffects = {
    attach: function (context, settings) {
      once('property-card-effects', '.property-card, .portfolio-card', context).forEach(function (card) {
        const image = card.querySelector('.property-image, .portfolio-image');
        
        if (!image) return;
        
        card.addEventListener('mouseenter', function() {
          // Add subtle animation class
          this.classList.add('card-hover');
        });
        
        card.addEventListener('mouseleave', function() {
          this.classList.remove('card-hover');
        });
        
        // Add parallax effect to card image on mouse move
        card.addEventListener('mousemove', function(e) {
          if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * 2;
            const rotateY = (centerX - x) / centerX * 2;
            
            image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
          }
        });
        
        card.addEventListener('mouseleave', function() {
          image.style.transform = '';
        });
      });
    }
  };

  /**
   * Hero parallax effect
   */
  Drupal.behaviors.heroParallax = {
    attach: function (context, settings) {
      once('hero-parallax', '.hero-section', context).forEach(function (hero) {
        const heroBackground = hero.querySelector('.hero-background');
        
        if (!heroBackground || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return;
        }
        
        const updateParallax = () => {
          const scrolled = window.pageYOffset;
          const heroHeight = hero.offsetHeight;
          const heroTop = hero.getBoundingClientRect().top + scrolled;
          
          if (scrolled < heroTop + heroHeight) {
            const parallaxSpeed = 0.5;
            const yPos = -(scrolled - heroTop) * parallaxSpeed;
            heroBackground.style.transform = `translateY(${yPos}px)`;
          }
        };
        
        // Throttle scroll events
        let ticking = false;
        const scrollHandler = () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              updateParallax();
              ticking = false;
            });
            ticking = true;
          }
        };
        
        window.addEventListener('scroll', scrollHandler, { passive: true });
      });
    }
  };

  /**
   * Form enhancements
   */
  Drupal.behaviors.formEnhancements = {
    attach: function (context, settings) {
      // Add floating labels to form inputs
      once('floating-labels', 'input[type="text"], input[type="email"], input[type="tel"], textarea', context).forEach(function (input) {
        const wrapper = input.closest('.form-item');
        if (!wrapper) return;
        
        const label = wrapper.querySelector('label');
        if (!label) return;
        
        // Add floating label class
        wrapper.classList.add('floating-label');
        
        const checkFloating = () => {
          if (input.value.trim() !== '' || input === document.activeElement) {
            wrapper.classList.add('floating-active');
          } else {
            wrapper.classList.remove('floating-active');
          }
        };
        
        input.addEventListener('focus', checkFloating);
        input.addEventListener('blur', checkFloating);
        input.addEventListener('input', checkFloating);
        
        // Initial check
        checkFloating();
      });
    }
  };

})(Drupal, drupalSettings, once);
