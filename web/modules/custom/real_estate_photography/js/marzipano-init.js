/**
 * @file
 * Marzipano 360° viewer initialization.
 */

(function (Drupal, drupalSettings) {
  'use strict';

  /**
   * Initialize Marzipano viewers.
   */
  Drupal.behaviors.marzipanoViewer = {
    attach: function (context, settings) {
      const viewers = context.querySelectorAll('.marzipano-viewer:not(.marzipano-processed)');
      
      if (viewers.length === 0) {
        return;
      }

      // Wait for Marzipano library to load
      if (typeof Marzipano === 'undefined') {
        console.log('Marzipano library not loaded yet, retrying...');
        setTimeout(function() {
          Drupal.behaviors.marzipanoViewer.attach(context, settings);
        }, 500);
        return;
      }

      console.log('Marzipano library loaded, initializing viewers:', viewers.length);
      
      viewers.forEach(function(viewerElement) {
        viewerElement.classList.add('marzipano-processed');
        
        const panoramaUrl = viewerElement.dataset.panoramaUrl;
        const autoRotate = viewerElement.dataset.autoRotate === 'true';
        const showControls = viewerElement.dataset.controls === 'true';
        
        console.log('Initializing viewer with URL:', panoramaUrl);
        
        if (!panoramaUrl) {
          console.error('No panorama URL provided for Marzipano viewer');
          const loadingElement = viewerElement.querySelector('.marzipano-loading');
          if (loadingElement) {
            loadingElement.innerHTML = 'Error: No panorama URL provided';
          }
          return;
        }

        try {
          // Create viewer with CORS handling
          const viewer = new Marzipano.Viewer(viewerElement, {
            controls: {
              mouseViewMode: showControls ? 'drag' : 'qtvr'
            },
            stage: {
              preserveDrawingBuffer: true
            }
          });

          // Create source with CORS support
          const source = Marzipano.ImageUrlSource.fromString(panoramaUrl, {
            cubeMapPreviewUrl: panoramaUrl
          });

          // Create geometry with multiple levels for better performance
          const geometry = new Marzipano.EquirectGeometry([
            { width: 4096 },
            { width: 2048 },
            { width: 1024 },
            { width: 512 }
          ]);

          // Create view with reasonable limits
          const limiter = Marzipano.RectilinearView.limit.traditional(
            1024,
            100 * Math.PI / 180,
            120 * Math.PI / 180
          );
          const view = new Marzipano.RectilinearView(
            { yaw: 0, pitch: 0, fov: Math.PI / 4 },
            limiter
          );

          // Create scene with error handling
          const scene = viewer.createScene({
            source: source,
            geometry: geometry,
            view: view,
            pinFirstLevel: true
          });

          // Display scene (synchronous in this version)
          try {
            scene.switchTo();
            console.log('Scene loaded successfully');
            
            // Hide loading indicator after a short delay to ensure scene is ready
            setTimeout(function() {
              const loadingElement = viewerElement.querySelector('.marzipano-loading');
              if (loadingElement) {
                loadingElement.style.display = 'none';
              }
            }, 1500);
            
            // Add scene ready event listener if available
            scene.addEventListener && scene.addEventListener('viewChange', function() {
              console.log('Marzipano view changed - scene is interactive');
            });
            
          } catch (switchError) {
            console.error('Error switching to scene:', switchError);
            const loadingElement = viewerElement.querySelector('.marzipano-loading');
            if (loadingElement) {
              loadingElement.innerHTML = '<p style="color: #ff6b6b;">Error displaying panorama</p><p style="font-size: 12px;">' + switchError.message + '</p>';
            }
          }

          // Auto-rotate if enabled
          if (autoRotate) {
            viewer.setIdleMovement(3000, {
              yaw: 0.0003,
              targetPitch: 0,
              targetFov: Math.PI / 4
            });
          }

          // Add controls if enabled
          if (showControls) {
            addMarzipanoControls(viewer, viewerElement);
          }
        } catch (error) {
          console.error('Error initializing Marzipano viewer:', error);
          const loadingElement = viewerElement.querySelector('.marzipano-loading');
          if (loadingElement) {
            loadingElement.innerHTML = 'Error: ' + error.message;
          }
        }
      });
    }
  };

  /**
   * Add custom controls to Marzipano viewer.
   */
  function addMarzipanoControls(viewer, container) {
    const controlsHtml = `
      <div class="marzipano-controls">
        <button class="marzipano-control marzipano-zoom-in" title="Zoom In">+</button>
        <button class="marzipano-control marzipano-zoom-out" title="Zoom Out">−</button>
        <button class="marzipano-control marzipano-fullscreen" title="Fullscreen">⛶</button>
      </div>
    `;
    
    container.insertAdjacentHTML('beforeend', controlsHtml);
    
    // Zoom controls
    container.querySelector('.marzipano-zoom-in').addEventListener('click', function() {
      const view = viewer.scene() && viewer.scene().view();
      if (view) {
        view.setFov(view.fov() * 0.8);
      }
    });
    
    container.querySelector('.marzipano-zoom-out').addEventListener('click', function() {
      const view = viewer.scene() && viewer.scene().view();
      if (view) {
        view.setFov(view.fov() * 1.25);
      }
    });
    
    // Fullscreen control
    container.querySelector('.marzipano-fullscreen').addEventListener('click', function() {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      }
    });
  }

})(Drupal, drupalSettings);
