import { useConvexAuth } from "convex/react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { useWatchlist } from "~/hooks/useWatchlist";

interface WatchlistButtonProps {
  mediaId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath?: string;
  backdropPath?: string;
  overview?: string;
}

export function WatchlistButton({
  mediaId,
  mediaType,
  title,
  posterPath,
  backdropPath,
  overview,
}: WatchlistButtonProps) {
  const { isAuthenticated } = useConvexAuth();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [loading, setLoading] = useState(false);
  const inWatchlist = isInWatchlist(mediaId, mediaType);

  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist({ mediaId, mediaType });
      } else {
        await addToWatchlist({
          mediaId,
          mediaType,
          title,
          posterPath,
          backdropPath,
          overview,
        });
      }
    } catch (error) {
      console.error("Failed to update watchlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {inWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
      <span className="text-sm font-medium">
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
}
