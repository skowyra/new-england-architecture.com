# Image Gallery Setup Guide

This guide shows you how to set up image galleries for your real estate photography site.

## Method 1: Using Media Library (Recommended)

### Step 1: Create a Property Content Type

1. Go to `/admin/structure/types` in your Drupal admin
2. Click "Add content type"
3. Name: "Property"
4. Machine name: "property"
5. Save and manage fields

### Step 2: Add Image Gallery Field

1. On the Property content type manage fields page
2. Click "Add field"
3. Select "Entity reference" → "Media"
4. Field label: "Property Images"
5. Machine name: `field_property_images`
6. Configure:
   - **Reference type**: Media
   - **Reference method**: Default
   - **Media types**: Image
   - **Number of values**: Unlimited
   - **Widget**: Media library

### Step 3: Add 360° Image Field

1. Add another field:
   - Type: "Entity reference" → "Media"
   - Label: "360° Tour Image"
   - Machine name: `field_360_image`
   - Number of values: 1
   - Media types: Image

### Step 4: Configure Display

1. Go to "Manage display" tab
2. Set "Property Images" format to "Media thumbnail"
3. Configure the formatter settings:
   - Image style: "Medium (220×220)"
   - Link image to: Media item

## Method 2: Direct Image Field (Simpler)

### Add Image Field to Article Content Type

```bash
ddev drush field-create-field node article field_images image
```

Or via UI:
1. Go to `/admin/structure/types/manage/article/fields`
2. Add field → Image
3. Label: "Images"
4. Number of values: Unlimited

## Method 3: Using Image Field with Multiple Values

If you want a simple image field that allows multiple uploads:

1. Content type → Manage fields
2. Add field → Image
3. Configure:
   - **Number of values**: Unlimited
   - **Upload destination**: Public files
   - **Maximum upload size**: 10 MB
   - **File extensions**: png gif jpg jpeg
   - **Minimum image resolution**: 800x600
   - **Maximum image resolution**: 3000x2000

## Display Configuration

### Gallery Display Formatter

1. Go to content type → Manage display
2. For your image field, set format to one of:
   - **Image** (basic)
   - **Responsive image** (better for performance)
   - **Image (thumbnail)** with link to full size

### Custom Gallery with Lightbox

Your theme already includes lightbox functionality. Images with these classes will automatically get lightbox behavior:

- `.image-gallery` (container)
- `.image-lightbox` (individual images)

## Using Layout Builder

1. Enable Layout Builder for your content type:
   - Go to content type → Manage display
   - Check "Enable Layout Builder"
   - Choose "Use custom layout" or "Use default layout"

2. Add blocks:
   - Real Estate Photography blocks are available
   - Use "Marzipano Viewer" block for 360° tours
   - Use "Portfolio Projects" block for property listings

## Adding Content

### Create Property Content

1. Go to `/node/add/property`
2. Add title, description
3. Upload multiple images to "Property Images"
4. Upload 360° image if available
5. Save

### Using Media Library

1. When adding images, click "Add media"
2. Upload or select existing images
3. Add alt text and captions
4. Save

## Styling

Your theme includes these CSS classes for galleries:

```css
.has-image-gallery     // Added to nodes with images
.has-360-viewer        // Added to nodes with 360° images
.image-gallery         // Gallery container
.image-lightbox        // Individual gallery images
.marzipano-viewer-wrapper // 360° viewer container
```

## Quick Setup Commands

```bash
# Enable required modules
ddev drush en field_ui media media_library image -y

# Create a property content type with image field
ddev drush content-type-create property "Property Listing"
ddev drush field-create-field node property field_property_images "entity_reference:media" --cardinality=-1

# Clear cache
ddev drush cr
```

## Admin URLs

- Content types: `/admin/structure/types`
- Media: `/admin/content/media`
- Field UI: `/admin/structure/types/manage/[type]/fields`
- Layout Builder: `/admin/structure/types/manage/[type]/display`
