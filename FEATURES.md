# Streamo Features

## Core Features

### 🎬 Content Browsing
- **Landing Page** (`/`) - Hero section with compelling CTA and feature showcase
- **Home Hub** (`/home`) - Trending content, top-rated movies and TV shows
- **Movies** (`/movies`) - Dedicated movie browsing with grid layout
- **TV Shows** (`/tvshows`) - TV series collection
- **Kids** (`/kids`) - Family-friendly, age-appropriate content
- **Watch Page** (`/watch/:id`) - Video player with related recommendations

### 🌓 Theme System
- Seamless dark/light mode toggle
- Persistent user preference via localStorage
- Smooth CSS transitions (200ms)
- System preference detection on first visit
- Theme-aware components throughout

### 📱 Responsive Design
- Mobile-first approach
- Breakpoints: mobile (0-640px), tablet (641-1024px), desktop (1025px+)
- Touch-optimized interactions
- Icon-only navigation on mobile
- Adaptive grid layouts (2-5 columns based on screen size)

### ⚡ Performance Optimizations
- **Code Splitting** - Routes lazy-loaded automatically
- **Image Lazy Loading** - Native browser lazy loading
- **Minimal Bundle** - ~193KB gzipped main bundle
- **GPU Acceleration** - Transform-based animations
- **Efficient Re-renders** - React.memo on cards
- **Suspense Boundaries** - Loading skeletons during data fetch

### 🎨 Animations (Framer Motion)
- Entrance fades (opacity 0→1)
- Card hover lifts (scale 1→1.04)
- Smooth page transitions
- Scroll-triggered animations (viewport detection)
- Theme toggle transitions
- Navigation active indicator (layoutId animation)

### ♿ Accessibility
- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Alt text on all images
- Color contrast compliance

## Design System Implementation

### Colors
- **Light Mode**: White backgrounds, dark text, subtle shadows
- **Dark Mode**: Deep blue-black (#0B0D13), elevated surfaces (#14171F)
- **Accent**: Blue (#4D7CFF) for CTAs and highlights
- **Borders**: Transparent overlays (rgba)

### Typography
- **Font**: Inter (loaded from Google Fonts)
- **Scales**: Display (32-56px), Headline (20-32px), Body (16px), Caption (13px)
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Components
- **Navbar**: Sticky, blurred background, pill-style active indicator
- **Media Cards**: 2:3 aspect ratio, hover effects, rating badges
- **Horizontal Scroller**: Snap scrolling, arrow navigation, edge fade
- **Hero Section**: Full-bleed background, gradient overlay, dual CTAs
- **Buttons**: Primary (filled), Secondary (outlined), rounded-full shape

### Layout
- **Max Width**: 1400px container
- **Padding**: 16px (mobile), 24px (tablet), 32px (desktop)
- **Gaps**: 8px (small), 16px (medium), 24px (large)
- **Border Radius**: 12px (cards), 24px+ (sections)

## Technical Architecture

### State Management
- React Context for theme
- URL state for routing
- No Redux (kept simple)

### Data Fetching
- React Router loaders (SSR-compatible)
- TMDB API integration
- Error boundaries for failed requests

### File Structure
```
app/
├── components/          # Reusable UI
│   ├── Navbar.tsx
│   ├── MediaCard.tsx
│   ├── HorizontalScroller.tsx
│   ├── Hero.tsx
│   └── LoadingSkeleton.tsx
├── lib/                 # Utilities
│   ├── theme-context.tsx
│   └── tmdb.ts
├── routes/              # Pages
│   ├── _index.tsx       # Landing
│   ├── home.tsx         # Main hub
│   ├── movies.tsx
│   ├── tvshows.tsx
│   ├── kids.tsx
│   └── watch.$id.tsx
├── app.css              # Global styles
└── root.tsx             # Layout + error boundary
```

### Browser Support
- Modern browsers (ES2022+)
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile Safari, Chrome Mobile

## Future Enhancements

### Potential Features
- Search functionality
- Genre filtering
- User watchlists
- Infinite scroll pagination
- Video player integration (YouTube, Vimeo, custom)
- Multi-language support
- User authentication
- Content recommendations algorithm
- Watch history tracking
- Subtitle support

### Performance Improvements
- Virtual scrolling for large lists
- Service worker for offline support
- Image optimization (WebP, AVIF)
- Prefetching on hover
- CDN integration

## API Integration

### TMDB Endpoints Used
- `/trending/all/week` - Trending content
- `/movie/top_rated` - Top movies
- `/tv/top_rated` - Top TV shows
- `/movie/popular` - Popular movies
- `/tv/popular` - Popular TV shows
- `/discover/movie` - Kids content (G-rated)
- `/movie/{id}` - Movie details
- `/tv/{id}` - TV show details
- `/{type}/{id}/similar` - Similar content

### Image Sizes
- `w500` - Card posters
- `w780` - Detail pages
- `original` - Hero backgrounds

## Development Notes

### Environment Variables
- `VITE_TMDB_API_KEY` - Required for API access

### Scripts
- `bun run dev` - Development server (port 5173)
- `bun run build` - Production build
- `bun run start` - Production server
- `bun run typecheck` - TypeScript validation

### Dependencies
- **Runtime**: React 19, React Router 7, Framer Motion
- **Build**: Vite 7, TypeScript 5, Tailwind CSS 4
- **Package Manager**: Bun 1.2+
