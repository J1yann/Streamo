# Quick Start Guide

## Setup Convex Authentication & Features

### 1. Initialize Convex
```bash
bunx convex dev
```

Follow the prompts to:
- Login or create a Convex account
- Create a new project or link to existing one
- This will generate your `VITE_CONVEX_URL`

### 2. Add Environment Variable
Add the generated URL to your `.env.local`:
```bash
VITE_CONVEX_URL=https://your-project.convex.cloud
```

### 3. Start Development
In a separate terminal, start your app:
```bash
bun run dev
```

### 4. Test the Features

**Authentication:**
- Click "Sign In" button in the navbar
- Create an account with email/password
- Sign in and out

**Watchlist:**
- Navigate to any movie/show detail page
- Click "Add to Watchlist" button
- View your watchlist at `/watchlist`

**Watch History:**
- Use the `useWatchHistory` hook in your watch page
- Automatically tracks what users watch
- Stores progress for resuming later

## Using the Features in Your Code

### Add Watchlist Button to Any Page
```tsx
import { WatchlistButton } from "~/components/WatchlistButton";

<WatchlistButton
  mediaId="123"
  mediaType="movie"
  title="Movie Title"
  posterPath="/path.jpg"
/>
```

### Track Watch History
```tsx
import { useWatchHistory } from "~/hooks/useWatchHistory";

function WatchPage() {
  const { addToHistory } = useWatchHistory();
  
  // When user starts watching
  await addToHistory({
    mediaId: "123",
    mediaType: "movie",
    title: "Movie Title",
    posterPath: "/path.jpg",
    progress: 0,
  });
  
  // Update progress periodically
  await addToHistory({
    mediaId: "123",
    mediaType: "movie",
    title: "Movie Title",
    progress: 45, // percentage
  });
}
```

### Check Authentication Status
```tsx
import { useConvexAuth } from "convex/react";

function MyComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  return <div>Welcome!</div>;
}
```

## Deploy to Production

### 1. Deploy Convex Backend
```bash
bunx convex deploy
```

### 2. Update Production Environment
Add your production `VITE_CONVEX_URL` to your hosting platform's environment variables.

### 3. Deploy Your App
```bash
bun run deploy
```

## Troubleshooting

**"Cannot find module convex/_generated/api"**
- Make sure `bunx convex dev` is running
- The generated files are created automatically when Convex dev server starts

**Authentication not working**
- Check that `VITE_CONVEX_URL` is set in `.env.local`
- Restart your dev server after adding the env variable
- Make sure Convex dev server is running

**Watchlist/History not saving**
- Ensure user is authenticated
- Check browser console for errors
- Verify Convex dev server is running

## Next Steps

- Customize the SignInDialog styling
- Add OAuth providers (Google, GitHub, etc.)
- Create a watch history page
- Add user profiles
- Implement continue watching feature
