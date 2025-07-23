# Real Estate Photography Website

A modern, responsive website built with Web Components for showcasing real estate photography services. Features custom image galleries, virtual tour integration with Marzipano, and a professional design optimized for real estate agents and property listings.

## 🌟 Features

- **Custom Web Components** - Modular, reusable components
- **Advanced Image Gallery** - Improved gallery with lightbox, thumbnails, and keyboard navigation
- **Marzipano Virtual Tours** - Integrated 360° virtual tour support
- **Responsive Design** - Mobile-first approach with beautiful layouts
- **Fast Performance** - Optimized loading and smooth animations
- **SEO Friendly** - Semantic HTML and meta tags
- **Contact Forms** - Lead capture with form validation

## 🏗️ Project Structure

```
real-estate-site/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css            # Main stylesheet
├── js/
│   ├── app.js               # Main application logic
│   └── components/          # Web Components
│       ├── site-header.js
│       ├── property-card.js
│       ├── property-gallery.js
│       ├── marzipano-viewer.js
│       └── site-footer.js
├── images/
│   ├── properties/          # Property photos
│   ├── testimonials/        # Client photos
│   └── 360/                # 360° images for tours
├── tours/                   # Marzipano tour files
├── data/
│   └── portfolio.json       # Sample property data
└── README.md
```

## 🚀 Getting Started

### 1. Clone or Download

```bash
# If using git
git clone [your-repo-url]
cd real-estate-site

# Or download and extract the files
```

### 2. Add Your Content

**Images:**
- Add your property photos to `images/properties/`
- Add testimonial photos to `images/testimonials/`
- Add your logo as `images/logo.png`
- Add a hero image as `images/hero-property.jpg`

**Data:**
- Update `data/portfolio.json` with your actual properties
- Modify contact information in the HTML and components

### 3. Customize Branding

**Colors & Styling:**
- Update CSS custom properties in `css/styles.css`
- Modify the color scheme to match your brand

**Content:**
- Update business name, contact info, and service areas
- Add your professional headshot and bio
- Update service descriptions and pricing

### 4. Set Up Virtual Tours

**For Marzipano Integration:**
1. Create 360° photos of your properties
2. Use Marzipano Tool to generate tour files
3. Place tour folders in the `tours/` directory
4. Update property data with tour paths

### 5. Deploy

**Free Hosting Options:**
- **Netlify**: Drag and drop the folder to netlify.com
- **GitHub Pages**: Push to GitHub and enable Pages
- **Vercel**: Connect your repository for automatic deploys

**Custom Domain:**
- Purchase domain from your preferred registrar
- Configure DNS to point to your hosting service

## 🛠️ Customization

### Adding New Properties

Edit `data/portfolio.json` or modify the `getSampleProperty()` method in `property-card.js`:

```javascript
{
  "id": "your-property-id",
  "title": "Property Title",
  "location": "Address",
  "price": "$Price",
  "type": "Residential/Commercial",
  "category": "residential/commercial/luxury",
  "mainImage": "images/properties/main.jpg",
  "images": [
    "images/properties/photo1.jpg",
    "images/properties/photo2.jpg"
  ],
  "virtualTour": "tours/property-tour",
  "description": "Property description",
  "features": ["Feature 1", "Feature 2"]
}
```

### Modifying Gallery Behavior

The gallery component (`property-gallery.js`) supports:
- **Filtering** by property type
- **Keyboard navigation** (arrow keys, escape)
- **Touch gestures** on mobile
- **Thumbnail navigation**

### Customizing Virtual Tours

The Marzipano viewer (`marzipano-viewer.js`) includes:
- **Multi-scene support** for room-to-room navigation
- **Fullscreen mode**
- **Mobile-responsive controls**
- **Loading states and error handling**

### Styling Components

Each web component includes its own styles. To modify:

1. **Global styles**: Edit `css/styles.css`
2. **Component styles**: Edit the `addStyles()` method in each component
3. **Colors**: Update CSS custom properties or component style variables

## 📱 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (ES6+ support)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Web Components**: Native support in all modern browsers

## 🔧 Development

### Local Development

1. **Use a local server** (required for some features):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve .
   ```

2. **Open** `http://localhost:8000` in your browser

### File Organization

- **Components** are self-contained with their own styles
- **No build process** required - works directly in the browser
- **ES6 modules** structure for future expansion

## 🎨 Design Features

### Layout
- **CSS Grid** for responsive layouts
- **Flexbox** for component alignment
- **Mobile-first** responsive design

### Animations
- **Smooth transitions** for all interactions
- **Intersection Observer** for scroll animations
- **Transform-based** animations for performance

### Typography
- **System fonts** for fast loading
- **Responsive sizing** with proper line heights
- **Accessibility** considerations

## 📧 Contact Form Setup

The contact form currently logs submissions to console. To make it functional:

### Option 1: Netlify Forms (Recommended)
```html
<form class="contact-form" netlify>
  <!-- Add netlify attribute to form -->
```

### Option 2: Custom Backend
Update the `submitContactForm()` method in `js/app.js` to send data to your API endpoint.

### Option 3: Third-party Services
- **Formspree**: Add action="https://formspree.io/f/YOUR_ID"
- **EmailJS**: Client-side email sending
- **ConvertKit**: Email marketing integration

## 🚀 Performance Tips

1. **Optimize Images**:
   - Use WebP format when possible
   - Compress images (aim for <500KB per image)
   - Use appropriate dimensions (max 1920px wide)

2. **Lazy Loading**:
   - Images load as needed
   - Virtual tours load on demand

3. **Caching**:
   - Enable browser caching on your server
   - Use CDN for static assets if needed

## 📈 SEO Optimization

- **Semantic HTML** structure
- **Meta tags** for each page/property
- **Image alt tags** for accessibility
- **Structured data** for real estate listings (expandable)
- **Fast loading** for better search rankings

## 🤝 Support

For questions or customization help:
1. Check the component code comments
2. Review browser console for any errors
3. Test in incognito mode to rule out extensions

## 📄 License

This project is open source. Feel free to modify and use for your real estate photography business.

---

**Built with ❤️ for real estate photographers who want complete control over their web presence.**

