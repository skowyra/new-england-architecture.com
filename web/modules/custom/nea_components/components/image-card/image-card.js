/**
 * @file
 * Image Card component behaviors.
 */

(function (Drupal) {
  'use strict';

  /**
   * Image Card component behavior.
   */
  Drupal.behaviors.imageCard = {
    attach: function (context, settings) {
      // Add loading state handling
      const images = context.querySelectorAll('.image-card__img');
      
      images.forEach(function(img) {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
          
          img.addEventListener('error', function() {
            this.classList.add('error');
            // Could add a fallback image or error message here
            console.warn('Failed to load image:', this.src);
          });
        }
      });

      // Add intersection observer for lazy loading enhancement
      if ('IntersectionObserver' in window) {
        const imageCards = context.querySelectorAll('.image-card');
        
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
            }
          });
        }, {
          threshold: 0.1
        });

        imageCards.forEach(function(card) {
          observer.observe(card);
        });
      }
    }
  };

})(Drupal);