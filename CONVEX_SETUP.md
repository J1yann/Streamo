# Convex Setup Guide

## 1. Install Convex CLI
```bash
bun add -g convex
```

## 2. Initialize Convex Project
```bash
bunx convex dev
```

This will:
- Create a Convex project (or link to existing one)
- Generate your `VITE_CONVEX_URL` 
- Set up the schema and functions
- Start the dev server

## 3. Add Environment Variable
Copy the `VITE_CONVEX_URL` from the terminal output and add it to your `.env.local`:
```
VITE_CONVEX_URL=https://your-project.convex.cloud
```

## 4. Deploy (Production)
```bash
bunx convex deploy
```

## Features Included

### Authentication
- Email/password sign up and sign in
- Secure session management
- User profile storage

### Watch History
- Automatically track what users watch
- Store progress for resuming later
- Track TV show episodes and seasons

### Watchlist
- Add movies/shows to watchlist
- Remove from watchlist
- Check if item is in watchlist

## Usage Examples

### In Your Components

```tsx
import { useConvexAuth } from "convex/react";
import { useWatchlist } from "~/hooks/useWatchlist";
import { useWatchHistory } from "~/hooks/useWatchHistory";

function MyComponent() {
  const { isAuthenticated } = useConvexAuth();
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { history, addToHistory } = useWatchHistory();

  // Add to watchlist
  const handleAddToWatchlist = async () => {
    await addToWatchlist({
      mediaId: "123",
      mediaType: "movie",
      title: "Movie Title",
      posterPath: "/path.jpg",
    });
  };

  // Track watch history
  const handleWatch = async () => {
    await addToHistory({
      mediaId: "123",
      mediaType: "movie",
      title: "Movie Title",
      posterPath: "/path.jpg",
      progress: 50, // percentage
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
      ) : (
        <p>Sign in to use watchlist</p>
      )}
    </div>
  );
}
```

## Database Schema

### users
- name (optional)
- email
- emailVerified (optional)
- image (optional)

### watchHistory
- userId
- mediaId (TMDB ID)
- mediaType ("movie" | "tv")
- title
- posterPath (optional)
- backdropPath (optional)
- season (optional, for TV)
- episode (optional, for TV)
- watchedAt (timestamp)
- progress (optional, percentage)

### watchlist
- userId
- mediaId (TMDB ID)
- mediaType ("movie" | "tv")
- title
- posterPath (optional)
- backdropPath (optional)
- overview (optional)
- addedAt (timestamp)

## Next Steps

1. Run `bunx convex dev` to start development
2. The auth button is already in your navbar
3. Use the hooks in your components to add watchlist/history features
4. Customize the SignInDialog styling if needed
