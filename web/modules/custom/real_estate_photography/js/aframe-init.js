/**
 * @file
 * A-Frame 360° viewer initialization - loads after A-Frame in head.
 */

(function (Drupal, drupalSettings) {
  'use strict';

  /**
   * Initialize A-Frame viewers.
   */
  Drupal.behaviors.aframeViewer = {
    attach: function (context, settings) {
      const viewers = context.querySelectorAll('.aframe-viewer:not(.aframe-processed)');
      
      if (viewers.length === 0) {
        return;
      }

      // Since A-Frame should be loaded in head, check if it's available
      if (typeof AFRAME === 'undefined') {
        console.error('A-Frame library not found. Make sure it loads in the <head>.');
        viewers.forEach(function(viewerElement) {
          const loadingElement = viewerElement.querySelector('.aframe-loading');
          if (loadingElement) {
            loadingElement.innerHTML = '<p style="color: #ff6b6b;">A-Frame library not loaded</p>';
          }
        });
        return;
      }

      console.log('A-Frame library available, initializing viewers:', viewers.length);
      
      viewers.forEach(function(viewerElement) {
        viewerElement.classList.add('aframe-processed');
        
        const panoramaUrl = viewerElement.dataset.panoramaUrl;
        const autoRotate = viewerElement.dataset.autoRotate === 'true';
        
        console.log('Initializing A-Frame viewer with URL:', panoramaUrl);
        
        if (!panoramaUrl) {
          console.error('No panorama URL provided for A-Frame viewer');
          const loadingElement = viewerElement.querySelector('.aframe-loading');
          if (loadingElement) {
            loadingElement.innerHTML = 'Error: No panorama URL provided';
          }
          return;
        }

        try {
          // Create A-Frame scene
          const sceneHtml = `
            <a-scene embedded style="width: 100%; height: 100%;" 
                     vr-mode-ui="enabled: false" 
                     cursor="rayOrigin: mouse"
                     background="color: #000"
                     inspector="url: https://aframe.io/releases/1.4.0/aframe-inspector.min.js">
              <a-sky src="${panoramaUrl}" 
                     crossorigin="anonymous"
                     ${autoRotate ? 'animation="property: rotation; to: 0 360 0; loop: true; dur: 30000"' : ''}></a-sky>
              <a-camera look-controls wasd-controls="enabled: false" cursor-visible="false">
                <a-cursor color="white" opacity="0.5" scale="0.5 0.5 0.5"></a-cursor>
              </a-camera>
            </a-scene>
          `;
          
          // Hide loading indicator
          const loadingElement = viewerElement.querySelector('.aframe-loading');
          if (loadingElement) {
            loadingElement.style.display = 'none';
          }
          
          // Insert A-Frame scene
          viewerElement.innerHTML = sceneHtml;
          
          console.log('A-Frame viewer initialized successfully');
          
        } catch (error) {
          console.error('Error initializing A-Frame viewer:', error);
          const loadingElement = viewerElement.querySelector('.aframe-loading');
          if (loadingElement) {
            loadingElement.innerHTML = '<p style="color: #ff6b6b;">Error: ' + error.message + '</p>';
          }
        }
      });
    }
  };

})(Drupal, drupalSettings);
