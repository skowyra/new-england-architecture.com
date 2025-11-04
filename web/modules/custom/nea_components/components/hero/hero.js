/**
 * Hero component JavaScript
 */

(function (Drupal) {
  'use strict';

  Drupal.behaviors.heroComponent = {
    attach: function (context, settings) {
      const heroes = context.querySelectorAll('.hero');
      
      heroes.forEach(function(hero) {
        // Add any interactive behavior for hero components
        // Example: parallax effect, lazy loading, etc.
        
        // Simple fade-in animation on scroll
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('hero--visible');
            }
          });
        }, { threshold: 0.1 });
        
        observer.observe(hero);
      });
    }
  };

})(Drupal);