# NERDDISCO Website Development Conventions

## Project Overview

This is the personal website of NERDDISCO (Tim Pietrusky), built with Hugo static site generator. The site showcases projects, blog posts, creative coding demos, and serves as a portfolio and digital presence.

**Key Features:**
- Hugo static site generator with custom "landing-page" theme
- Progressive Web App (PWA) with Workbox service worker
- Performance-optimized with image compression and inline CSS
- Netlify deployment with automatic builds
- CloudCannon CMS integration for content management
- Mobile-first responsive design

**Live Site:** https://nerddis.co/

## Quick Start

### Prerequisites
- [Hugo](https://gohugo.io/getting-started/installing/) (v0.83.1+)
- [Node.js](https://nodejs.org/) and npm
- [ImageMagick](https://imagemagick.org/script/download.php) (for image optimization)

### Development Setup

1. **Clone and Install**
   ```bash
   git clone https://github.com/NERDDISCO/nerddis.co.git
   cd nerddis.co
   npm install
   ```

2. **Start Development Server**
   ```bash
   # Option 1: Full development environment (recommended)
   npm run start
   
   # Option 2: Hugo only
   npm run dev
   
   # Option 3: Manual (as documented in README)
   hugo server -D --renderToDisk -d public
   npm run watch  # In separate terminal
   ```

3. **Build for Production**
   ```bash
   hugo --gc --minify
   npm run build
   ```

## Project Structure

```
nerddis.co/
├── archetypes/          # Hugo content templates
├── assets/              # SCSS, JS, and other assets to be processed
├── content/             # Markdown content files
├── layouts/             # Custom Hugo layouts (overrides theme)
├── static/              # Static assets (images, fonts, etc.)
├── themes/              # Hugo themes
│   └── landing-page/    # Custom theme
├── public/              # Generated site (git ignored)
├── config.toml          # Hugo configuration
├── package.json         # Node.js dependencies
├── netlify.toml         # Netlify build configuration
├── cloudcannon.config.yml # CloudCannon CMS configuration
└── workbox-config.js    # Service worker configuration
```

## Content Management

### Content Types

1. **Blog Posts/Articles** (`content/*.md`)
   - Technical tutorials
   - Project showcases
   - Creative coding demos
   - Conference talks

2. **Legal Pages** (`content/legal.md`)
   - Privacy policy
   - Terms of service
   - Licensing information

### Content Guidelines

#### Frontmatter Structure
```yaml
---
title: "Your Post Title"
date: 2023-01-01T00:00:00+02:00
draft: false
type: "subpage"  # or leave empty for default
img: "path/to/image.jpg"  # optional
tags: "tag1,tag2"  # optional
---
```

#### Content Types
- **Default**: Regular blog post/article
- **Subpage**: Special layout for project showcases and demos

#### Writing Guidelines
- Use clear, concise language
- Include code examples with proper syntax highlighting
- Add alt text for all images
- Use semantic HTML structure
- Include external links with `target="_blank"`

## Development Workflow

### Making Changes

1. **Content Changes**
   - Edit markdown files in `content/`
   - Preview changes with `hugo server -D`
   - Commit and push to trigger automatic deployment

2. **Theme/Layout Changes**
   - Modify files in `layouts/` (overrides theme)
   - Or edit theme files in `themes/landing-page/`
   - Test thoroughly across different screen sizes

3. **Asset Changes**
   - Images: Add to `static/` directory
   - Fonts: Place in `static/font/`
   - JavaScript: Add to `static/js/`

### Image Optimization

**For Show Images:**
1. Add original image to `static/shows/original/`
2. Run image conversion script:
   ```bash
   ./image-convert.sh
   ```
3. This creates optimized JPG versions in `static/shows/`

**Manual Image Optimization:**
```bash
# Resize to 50% and convert to JPG
convert -resize 50% input.png output.jpg

# Specific settings used by the project
magick "input.jpg" -resize 660 -crop x371+0+0 -quality 1 "output.jpg"
```

## Code Standards

### Hugo Templates
- Use semantic HTML5 elements
- Follow BEM methodology for CSS classes
- Implement lazy loading for images: `loading="lazy"`
- Use `{{ .Site.BaseURL }}` for internal links
- Escape user content: `{{ .Content | safeHTML }}`

### JavaScript
- Keep JavaScript minimal and performance-focused
- Use modern ES6+ features
- Implement progressive enhancement
- All JS should be async-loaded
- Use service worker for offline functionality

### CSS/SCSS
- Mobile-first responsive design
- Use CSS custom properties (variables)
- Inline critical CSS for performance
- Minimize use of external dependencies
- Follow semantic class naming

### Performance Rules
- **Images**: All images should be optimized JPG with quality 1
- **Fonts**: Use WOFF2 format for smallest file sizes
- **CSS**: Inline critical CSS, defer non-critical
- **JavaScript**: Async loading, minimize dependencies
- **Service Worker**: Cache static assets for offline use

## Build and Deployment

### Netlify Configuration
- **Hugo Version**: 0.83.1 (specified in `netlify.toml`)
- **Build Command**: `hugo --gc --minify && npm run build`
- **Publish Directory**: `public/`
- **Auto-deploy**: Triggered on push to master branch

### Environment Variables
- `HUGO_ENV`: Set to "production" for production builds
- `HUGO_ENABLEGITINFO`: Enables git info in Hugo

### Service Worker
- Workbox generates service worker automatically
- Configuration in `workbox-config.js`
- Caches static assets for offline functionality
- Updates automatically on new deployments

## Content Management System

### CloudCannon Integration
- Content can be managed through CloudCannon CMS
- Configuration in `cloudcannon.config.yml`
- Timezone: Europe/Berlin
- Uploads go to `static/uploads/`

### Content Collection
- Collection name: "pages"
- Location: `content/` directory
- Output: Rendered to site

## Performance Optimizations

### Implemented Optimizations
- **Inline CSS**: Critical CSS inlined in HTML
- **Font Optimization**: Badd Mono converted from OTF (76KB) to WOFF2 (7KB)
- **Image Optimization**: All images JPG quality 1
- **Lazy Loading**: Images loaded only when needed
- **Service Worker**: Caches assets for offline use
- **Async JavaScript**: Non-blocking script loading
- **Minification**: HTML, CSS, and JS minified in production

### Performance Guidelines
- Always optimize images before adding to `static/`
- Test on slow connections and mobile devices
- Use Chrome DevTools Lighthouse for performance audits
- Monitor Core Web Vitals
- Keep JavaScript bundle sizes minimal

## Git Workflow

### Branch Strategy
- `master`: Production branch (auto-deploys to Netlify)
- Feature branches: Use descriptive names
- Pull requests: Required for contributions

### Commit Guidelines
- Use conventional commit messages
- Include scope when relevant: `feat(content): add new blog post`
- Reference issues when applicable

## Troubleshooting

### Common Issues

1. **Images not displaying**
   - Check file paths relative to `static/`
   - Ensure images are optimized and in JPG format
   - Verify image exists in `static/` directory

2. **Service Worker not updating**
   - Run `npm run build` to regenerate service worker
   - Clear browser cache and service worker
   - Check console for service worker errors

3. **Build failures**
   - Check Hugo version compatibility
   - Verify all dependencies are installed
   - Review netlify build logs for specific errors

4. **Local development issues**
   - Ensure Hugo server is running with `-D` flag for drafts
   - Check that npm dependencies are installed
   - Verify ImageMagick is installed for image processing

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox/)
- [Netlify Documentation](https://docs.netlify.com/)
- [CloudCannon Documentation](https://cloudcannon.com/documentation/)
- [Performance Best Practices](https://web.dev/fast/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following these conventions
4. Test thoroughly
5. Submit a pull request with detailed description

For questions or issues, please open an issue on the GitHub repository.