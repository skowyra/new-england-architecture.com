/**
 * Project Card component JavaScript
 */

(function (Drupal) {
  'use strict';

  Drupal.behaviors.projectCardComponent = {
    attach: function (context, settings) {
      const projectCards = context.querySelectorAll('.project-card');
      
      projectCards.forEach(function(card) {
        // Add lazy loading for images
        const image = card.querySelector('.project-card__image img');
        if (image && 'IntersectionObserver' in window) {
          const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                  img.src = img.dataset.src;
                  img.removeAttribute('data-src');
                  imageObserver.unobserve(img);
                }
              }
            });
          });
          
          if (image.dataset.src) {
            imageObserver.observe(image);
          }
        }
        
        // Add analytics tracking for card clicks
        card.addEventListener('click', function(e) {
          const link = card.querySelector('.project-card__link');
          if (link && e.target !== link) {
            // If clicked anywhere on card except the main link, simulate link click
            link.click();
          }
          
          // Track card interaction
          if (typeof gtag !== 'undefined') {
            gtag('event', 'project_card_click', {
              'project_title': card.querySelector('.project-card__title')?.textContent?.trim() || 'Unknown'
            });
          }
        });
      });
    }
  };

})(Drupal);