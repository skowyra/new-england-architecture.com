/**
 * @file
 * Enhanced interactions for portfolio property cards.
 */

(function (Drupal, drupalSettings) {
  'use strict';

  /**
   * Portfolio cards behavior.
   */
  Drupal.behaviors.portfolioCards = {
    attach: function (context, settings) {
      const cards = context.querySelectorAll('.property-card:not(.portfolio-processed)');
      
      cards.forEach(function(card) {
        card.classList.add('portfolio-processed');
        
        // Add lazy loading for images
        const images = card.querySelectorAll('img');
        images.forEach(function(img) {
          if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
          }
        });

        // Add intersection observer for animation
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('property-card--visible');
                observer.unobserve(entry.target);
              }
            });
          }, {
            threshold: 0.1,
            rootMargin: '50px'
          });
          
          observer.observe(card);
        } else {
          // Fallback for browsers without IntersectionObserver
          card.classList.add('property-card--visible');
        }

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
          this.classList.add('property-card--hovered');
        });

        card.addEventListener('mouseleave', function() {
          this.classList.remove('property-card--hovered');
        });

        // Keyboard navigation support
        const cardLink = card.querySelector('.property-card__link, .property-card__title a');
        if (cardLink) {
          card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              cardLink.click();
            }
          });
          
          // Make card focusable
          card.setAttribute('tabindex', '0');
        }
      });

      // Masonry-like layout adjustment for uneven card heights
      adjustCardLayout(context);
    }
  };

  /**
   * Adjust card layout for better visual balance.
   */
  function adjustCardLayout(context) {
    const grids = context.querySelectorAll('.property-cards-grid');
    
    grids.forEach(function(grid) {
      // Add CSS custom properties for dynamic styling
      const cards = grid.querySelectorAll('.property-card');
      const gridComputedStyle = window.getComputedStyle(grid);
      const gap = parseInt(gridComputedStyle.gap) || 24;
      
      // Set CSS custom property for gap
      grid.style.setProperty('--grid-gap', gap + 'px');
      
      // Add staggered animation delays
      cards.forEach(function(card, index) {
        card.style.setProperty('--animation-delay', (index * 0.1) + 's');
      });
    });
  }

  /**
   * Utility function for image optimization.
   */
  function optimizeCardImages(context) {
    const cards = context.querySelectorAll('.property-card');
    
    cards.forEach(function(card) {
      const images = card.querySelectorAll('img');
      
      images.forEach(function(img) {
        // Add WebP support detection
        if (supportsWebP()) {
          const src = img.src;
          if (src && !src.includes('.webp')) {
            const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
            
            // Test if WebP version exists
            const testImg = new Image();
            testImg.onload = function() {
              img.src = webpSrc;
            };
            testImg.src = webpSrc;
          }
        }
        
        // Add responsive image support
        if (!img.getAttribute('sizes')) {
          img.setAttribute('sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');
        }
      });
    });
  }

  /**
   * Check WebP support.
   */
  function supportsWebP() {
    if (typeof supportsWebP.cache !== 'undefined') {
      return supportsWebP.cache;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    supportsWebP.cache = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    return supportsWebP.cache;
  }

})(Drupal, drupalSettings);
