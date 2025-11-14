import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useWatchlist() {
  const watchlist = useQuery(api.watchlist.getWatchlist);
  const addToWatchlist = useMutation(api.watchlist.addToWatchlist);
  const removeFromWatchlist = useMutation(api.watchlist.removeFromWatchlist);
  const isInWatchlist = (mediaId: string, mediaType: "movie" | "tv") => {
    return watchlist?.some(
      (item: any) => item.mediaId === mediaId && item.mediaType === mediaType
    );
  };

  return {
    watchlist: watchlist ?? [],
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
