# Streamo - High-Performance Streaming Platform

A blazing-fast, visually sophisticated streaming platform built with React Router v7, Tailwind CSS, Bun, and Framer Motion.

## Features

- 🎬 **Browse Movies & TV Shows** - Explore thousands of titles from TMDB
- 🌓 **Dark/Light Mode** - Seamless theme switching with persistent preferences
- 📱 **Fully Responsive** - Optimized for all devices (mobile-first)
- ⚡ **Performance Optimized** - Lazy loading, code splitting, 60 FPS on budget devices
- 🎨 **Subtle Animations** - Framer Motion micro-interactions
- ♿ **Accessible** - Semantic HTML, ARIA labels, keyboard navigation

## Tech Stack

- **React Router v7** - Client-side routing with SSR support
- **Tailwind CSS v4** - Utility-first styling with dark mode
- **Bun** - Fast package manager and runtime
- **Framer Motion** - Lightweight animations
- **TypeScript** - Type safety
- **TMDB API** - Movie and TV show data

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your TMDB API key to `.env`:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

### Development

```bash
bun run dev
```

Visit `http://localhost:5173`

### Build

```bash
bun run build
```

### Production

```bash
bun run start
```

## Routes

- `/` - Landing page with hero section
- `/home` - Main content hub with trending media
- `/movies` - Browse movies
- `/tvshows` - Browse TV shows
- `/kids` - Family-friendly content
- `/watch/:id` - Video player page

## Performance Optimizations

- Lazy-loaded routes with React.lazy
- Image lazy loading
- Minimal bundle size
- Efficient re-renders with React.memo
- Virtualized scrolling for large lists
- Optimized animations (GPU-accelerated)

## Project Structure

```
app/
├── components/       # Reusable UI components
├── lib/             # Utilities and context
├── routes/          # Page components
├── app.css          # Global styles
└── root.tsx         # Root layout

```

## License

MIT

## Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
