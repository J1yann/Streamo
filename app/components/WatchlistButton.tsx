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
      className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur text-[#111111] dark:text-white font-semibold hover:bg-white dark:hover:bg-white/20 transition-all shadow-lg disabled:opacity-50 text-lg"
      title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
    >
      {inWatchlist ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
      <span>
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </button>
  );
}
