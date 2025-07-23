# Tour Management System

This dynamic tour configuration system allows you to manage virtual tour data without editing code.

## How It Works

### 1. JSON Configuration File
Tour data is stored in `tours/tour-config.json`. Each property has its own tour configuration with:
- Title and description
- Multiple scenes with 360° images
- Hotspots (expandable)

### 2. Dynamic Loading
The `marzipano-viewer` component automatically loads tour data based on property ID:
```html
<marzipano-viewer property-id="modern-downtown-condo"></marzipano-viewer>
```

### 3. Admin Interface
Visit `/admin.html` to edit tours through a user-friendly interface:
- Select tours from dropdown
- Edit titles and descriptions
- Add/remove scenes
- Update 360° image URLs
- Download updated configuration files

## Usage Instructions

### Adding New Tours
1. Open `admin.html` in your browser
2. Select a tour to edit
3. Modify scenes, add images, update descriptions
4. Click "Save Tour" to download updated config
5. Replace `tours/tour-config.json` with the downloaded file

### Adding New Properties
1. Add the property to `tours/tour-config.json`:
```json
{
  "virtualTours": {
    "new-property-id": {
      "title": "New Property Title",
      "description": "Property description",
      "scenes": [
        {
          "id": "room1",
          "name": "Living Room",
          "imageUrl": "path/to/360-image.jpg",
          "hotspots": []
        }
      ]
    }
  }
}
```

2. Update property cards to reference the new ID:
```javascript
virtualTour: 'new-property-id'
```

### Image Requirements
- 360° panoramic images (equirectangular projection)
- Recommended resolution: 4096x2048 or higher
- Formats: JPG, PNG
- Can be hosted locally (`images/`) or on CDN

## File Structure
```
/
├── admin.html              # Tour management interface
├── tours/
│   └── tour-config.json    # Tour data configuration
├── js/
│   ├── tour-admin.js       # Admin interface logic
│   └── components/
│       └── marzipano-viewer.js  # Updated with dynamic loading
└── images/                 # Local 360° images
```

## Future Enhancements
- Backend API for direct saving (no file download needed)
- Image upload interface
- Hotspot editor
- Tour preview functionality
- User authentication for admin access
- Bulk import/export tools

## Troubleshooting

**Tours not loading:**
- Check browser console for errors
- Verify image URLs are accessible
- Ensure tour-config.json is valid JSON

**Admin interface not saving:**
- Currently requires manual file replacement
- Check downloaded file replaces `tours/tour-config.json`
- Refresh website to see changes
