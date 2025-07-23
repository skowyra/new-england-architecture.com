// Tour Admin JavaScript
let tourConfig = {};
let currentTourId = '';

// Load tour configuration on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadTourConfig();
    setupEventListeners();
});

async function loadTourConfig() {
    try {
        const response = await fetch('tours/tour-config.json');
        tourConfig = await response.json();
        console.log('Tour config loaded:', tourConfig);
    } catch (error) {
        console.error('Error loading tour config:', error);
        showStatus('Error loading tour configuration', 'error');
        // Initialize with empty structure
        tourConfig = { virtualTours: {} };
    }
}

function setupEventListeners() {
    const tourSelect = document.getElementById('tourSelect');
    const tourForm = document.getElementById('tourForm');

    tourSelect.addEventListener('change', (e) => {
        const tourId = e.target.value;
        if (tourId) {
            loadTourEditor(tourId);
        } else {
            hideTourEditor();
        }
    });

    tourForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveTour();
    });
}

function loadTourEditor(tourId) {
    currentTourId = tourId;
    const tour = tourConfig.virtualTours[tourId];
    
    if (!tour) {
        showStatus(`Tour "${tourId}" not found`, 'error');
        return;
    }

    // Populate form fields
    document.getElementById('tourTitle').value = tour.title || '';
    document.getElementById('tourDescription').value = tour.description || '';

    // Load scenes
    loadScenes(tour.scenes || []);

    // Show editor
    document.getElementById('tourEditor').classList.add('active');
}

function hideTourEditor() {
    document.getElementById('tourEditor').classList.remove('active');
    currentTourId = '';
}

function loadScenes(scenes) {
    const container = document.getElementById('scenesContainer');
    container.innerHTML = '';

    scenes.forEach((scene, index) => {
        addSceneToDOM(scene, index);
    });
}

function addSceneToDOM(scene = null, index = null) {
    const container = document.getElementById('scenesContainer');
    const sceneIndex = index !== null ? index : container.children.length;
    
    const sceneDiv = document.createElement('div');
    sceneDiv.className = 'scene-item';
    sceneDiv.innerHTML = `
        <div class="scene-header">
            <h4>Scene ${sceneIndex + 1}</h4>
            <button type="button" class="remove-scene" onclick="removeScene(this)">Remove Scene</button>
        </div>
        
        <div class="form-group">
            <label>Scene ID:</label>
            <input type="text" name="sceneId" value="${scene?.id || ''}" required>
        </div>
        
        <div class="form-group">
            <label>Scene Name:</label>
            <input type="text" name="sceneName" value="${scene?.name || ''}" required>
        </div>
        
        <div class="form-group">
            <label>360° Image URL:</label>
            <input type="url" name="sceneImageUrl" value="${scene?.imageUrl || ''}" required 
                   placeholder="https://example.com/image.jpg or images/photo.jpg">
        </div>
    `;
    
    container.appendChild(sceneDiv);
}

function addScene() {
    addSceneToDOM();
    updateSceneHeaders();
}

function removeScene(button) {
    if (confirm('Are you sure you want to remove this scene?')) {
        button.closest('.scene-item').remove();
        updateSceneHeaders();
    }
}

function updateSceneHeaders() {
    const sceneItems = document.querySelectorAll('.scene-item');
    sceneItems.forEach((item, index) => {
        const header = item.querySelector('h4');
        header.textContent = `Scene ${index + 1}`;
    });
}

async function saveTour() {
    try {
        // Collect form data
        const formData = new FormData(document.getElementById('tourForm'));
        const title = formData.get('title');
        const description = formData.get('description');

        // Collect scenes
        const scenes = [];
        const sceneItems = document.querySelectorAll('.scene-item');
        
        sceneItems.forEach(item => {
            const sceneId = item.querySelector('input[name="sceneId"]').value;
            const sceneName = item.querySelector('input[name="sceneName"]').value;
            const sceneImageUrl = item.querySelector('input[name="sceneImageUrl"]').value;
            
            if (sceneId && sceneName && sceneImageUrl) {
                scenes.push({
                    id: sceneId,
                    name: sceneName,
                    imageUrl: sceneImageUrl,
                    hotspots: [] // Could be expanded later
                });
            }
        });

        if (scenes.length === 0) {
            showStatus('Please add at least one scene', 'error');
            return;
        }

        // Update tour config
        tourConfig.virtualTours[currentTourId] = {
            title,
            description,
            scenes
        };

        // Save to file (this would need a backend in production)
        await saveTourConfig();
        
        showStatus('Tour saved successfully!', 'success');
        
    } catch (error) {
        console.error('Error saving tour:', error);
        showStatus('Error saving tour: ' + error.message, 'error');
    }
}

async function saveTourConfig() {
    // In a real application, this would send to a backend API
    // For this demo, we'll simulate saving and provide instructions
    
    const configJson = JSON.stringify(tourConfig, null, 2);
    
    // For now, let's create a downloadable file and show instructions
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tour-config.json';
    
    // Auto-download the updated config
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Config file downloaded! Please replace tours/tour-config.json with the downloaded file.', 'success');
}

function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}

function createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = JSON.stringify(tourConfig, null, 2);
    
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour-config-backup-${timestamp}.json`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showStatus('Backup created successfully!', 'success');
}

function downloadConfig() {
    const configJson = JSON.stringify(tourConfig, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tour-config.json';
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
