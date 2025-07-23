# Real Estate Photography Drupal Site

A professional real estate photography website built with Drupal 11, featuring 360° panoramic viewers, image galleries, and modern responsive design.

## 🌟 Features

- **360° Marzipano Viewer** - Interactive panoramic property tours
- **Custom Real Estate Olivero Theme** - Modern, responsive design based on Drupal's Olivero theme
- **Layout Builder Integration** - Flexible page layouts
- **Image Galleries** - Lightbox-enabled photo galleries
- **Property Showcase** - Dedicated content types for portfolio projects and service pages
- **SEO Optimized** - Meta tags, structured data, and performance optimizations

## 🛠️ Tech Stack

- **Drupal 11.2.2** - Content management system
- **PHP 8.3** - Server-side language
- **MySQL** - Database
- **Marzipano.js** - 360° panoramic viewer
- **DDEV** - Local development environment

## 📁 Project Structure

```
├── composer.json              # PHP dependencies
├── web/                       # Web root
│   ├── core/                 # Drupal core
│   ├── modules/
│   │   └── custom/
│   │       └── real_estate_photography/  # Custom module
│   ├── themes/
│   │   └── custom/
│   │       └── real_estate_olivero/       # Custom theme
│   └── sites/default/        # Site configuration
└── .ddev/                    # DDEV configuration
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd real-estate-photography
   ```

2. **Start DDEV:**
   ```bash
   ddev start
   ```

3. **Install dependencies:**
   ```bash
   ddev composer install
   ```

4. **Import database (if available):**
   ```bash
   ddev import-db --src=database.sql.gz
   ```

5. **Access the site:**
   - Frontend: https://real-estate-photography.ddev.site
   - Admin: https://real-estate-photography.ddev.site/admin

## 🎨 Custom Theme

The **Real Estate Olivero** theme includes:

- 📱 **Responsive Design** - Mobile-first approach
- 🖼️ **Image Galleries** - Lightbox functionality
- 🏠 **Property Cards** - Showcase real estate projects
- 🎯 **Hero Sections** - Eye-catching landing areas
- ⚡ **Performance Optimized** - Lazy loading, optimized CSS/JS

### Theme Files:
- `web/themes/custom/real_estate_olivero/css/` - Styling
- `web/themes/custom/real_estate_olivero/js/` - JavaScript enhancements
- `web/themes/custom/real_estate_olivero/templates/` - Twig templates

## 🔧 Custom Module

The **Real Estate Photography** module provides:

- 🌐 **Marzipano 360° Viewer Block** - Interactive panoramic tours
- 📊 **Portfolio Projects Block** - Display property showcases
- 📝 **Custom Content Types** - Portfolio projects and service pages

## 🏗️ Development

### Requirements:
- DDEV
- Composer
- Node.js (for theme development)

### Local Development:
```bash
# Start the environment
ddev start

# Clear caches
ddev drush cache:rebuild

# Enable development mode
ddev drush config:set system.performance css.preprocess 0
ddev drush config:set system.performance js.preprocess 0
```

## 📦 Content Types

1. **Portfolio Project** - Individual property showcases
   - Hero image
   - Image gallery
   - Location
   - 360° panorama URL

2. **Service Page** - Photography service descriptions
   - Hero image
   - Service details

## 🌐 Production Deployment

1. **Prepare for production:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Configure settings:**
   - Copy `web/sites/default/default.settings.php` to `settings.php`
   - Configure database credentials
   - Set trusted host patterns

3. **Performance:**
   - Enable CSS/JS aggregation
   - Configure caching
   - Optimize images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Drupal](https://drupal.org)
- 360° viewer powered by [Marzipano](https://www.marzipano.net)
- Based on Drupal's [Olivero](https://www.drupal.org/project/olivero) theme
- Development environment by [DDEV](https://ddev.com)
