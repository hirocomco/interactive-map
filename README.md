# Interactive US Outdoor Activity Map

A responsive, interactive visualization showing outdoor activity preferences across all 50 US states based on search volume data.

## Features

🗺️ **Interactive SVG Map**
- Color-coded states by activity search volume per 100k population
- Smooth hover effects with instant tooltips
- Click functionality for detailed state breakdowns

🎯 **Activity Toggle**
- Switch between 14 different outdoor activities
- Real-time color updates with smooth transitions
- Dynamic legend updates

📱 **Mobile-First Design**
- Touch-friendly interactions
- Responsive layout for all screen sizes
- Optimized for both desktop and mobile sharing

⚡ **Performance Optimized**
- jQuery US Map plugin with Raphael.js for smooth SVG rendering
- CDN-hosted dependencies for fast loading
- Lightweight vector graphics for crisp display at any size

## Data Insights

- **Most Active State**: Vermont (8,515 total searches per 100k)
- **Surfing Capital**: Hawaii dominates with 2,314 surfing searches per 100k
- **Regional Patterns**: Clear geographic clustering (coastal states prefer water activities, mountain states favor winter sports)
- **Top Activities**: Camping, hiking, and kayaking show highest overall engagement

## Technical Stack

- **jQuery US Map Plugin** - Interactive SVG map rendering
- **Raphael.js** - Cross-browser vector graphics library
- **jQuery** - DOM manipulation and event handling
- **CSS3** - Responsive styling with CSS Grid and Flexbox
- **HTML5** - Semantic structure with accessibility features

## File Structure

```
interactive-map/
├── index.html                          # Main page
├── css/styles.css                     # Responsive styles
├── js/
│   ├── data.js                        # Processed activity data
│   └── map.js                         # jQuery US Map implementation
├── us-map/                            # US Map plugin files
│   ├── jquery.usmap.js               # Main plugin
│   └── lib/raphael.js                # Raphael.js library
├── State-by-State Favorite...csv      # Original data source
└── README.md                          # Documentation
```

## How to Use

1. **View the Map**: Open `index.html` in any modern web browser
2. **Explore Activities**: Use the dropdown to switch between different outdoor activities
3. **Get State Details**: Hover for quick stats, click for comprehensive breakdown
4. **Share**: The visualization is designed to be highly shareable across social media

## Development

**Important**: The map must run from a web server (not opened as a file) to load properly.

### Setup Options

**Option 1: Python (Recommended)**
```bash
cd /Users/oded/opt/interactive-map
python3 -m http.server 8000
```
Then open: http://localhost:8000

**Option 2: Node.js**
```bash
cd /Users/oded/opt/interactive-map
npx http-server -p 8000
```
Then open: http://localhost:8000

**Option 3: PHP**
```bash
cd /Users/oded/opt/interactive-map
php -S localhost:8000
```
Then open: http://localhost:8000

### Why This Is Needed
Modern browsers block loading external resources when opening HTML files directly (`file://` protocol). Running from a web server (`http://` protocol) allows the external resources to load properly.

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Data Source

Based on search volume data for outdoor activities across US states, measured as searches per 100,000 population. Activities include:

- Fishing, Backpacking, Biking, Birdwatching
- Camping, Hiking, Hunting, Kayaking
- Mountaineering, RV Camping, Skiing, Snowboarding
- Surfing, Swimming

## SEO & Social Sharing

- Open Graph meta tags for social media preview
- Twitter Card support
- Semantic HTML structure
- Descriptive alt texts and ARIA labels
- Fast loading for better search rankings

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Reduced motion preferences
- Touch-friendly mobile interactions

Perfect for digital PR campaigns, data journalism, and educational content about outdoor recreation patterns in America.