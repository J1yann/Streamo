# Quick Setup Guide

## 1. Get TMDB API Key

1. Visit [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
2. Create a free account
3. Go to Settings → API → Request API Key
4. Choose "Developer" option
5. Fill out the form (use any website URL for development)
6. Copy your API Key (v3 auth)

## 2. Configure Environment

Create a `.env` file in the project root:

```bash
VITE_TMDB_API_KEY=your_actual_api_key_here
```

## 3. Install & Run

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

Visit `http://localhost:5173`

## 4. Build for Production

```bash
# Build the app
bun run build

# Start production server
bun run start
```

## Troubleshooting

### API Key Issues
- Make sure your `.env` file is in the project root
- Restart the dev server after adding the API key
- Check that the key starts with your TMDB API key format

### Port Already in Use
- Change the port in `vite.config.ts` or kill the process using port 5173

### Build Errors
- Run `bun run typecheck` to check for TypeScript errors
- Clear `.react-router` folder and rebuild

## Performance Tips

- Images are lazy-loaded automatically
- Routes are code-split for optimal loading
- Dark mode preference is saved in localStorage
- Animations are GPU-accelerated for 60 FPS

## Customization

### Theme Colors
Edit `app/app.css` to customize the color scheme

### API Endpoints
Modify `app/lib/tmdb.ts` to add more TMDB endpoints

### Routes
Add new routes in `app/routes.ts`

### Components
All reusable components are in `app/components/`
