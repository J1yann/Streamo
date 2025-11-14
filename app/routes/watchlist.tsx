import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { Link } from "react-router";
import { MediaCard } from "~/components/MediaCard";
import { useWatchlist } from "~/hooks/useWatchlist";

export default function WatchlistPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { watchlist } = useWatchlist();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D7CFF] mx-auto mb-4"></div>
          <p className="text-black/70 dark:text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <Bookmark size={64} className="mx-auto mb-4 text-[#4D7CFF]" />
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Sign In Required
          </h1>
          <p className="text-black/70 dark:text-white/70 mb-8">
            Sign in to access your watchlist and save your favorite movies and shows.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 lg:px-8 py-8">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">
            My Watchlist
          </h1>
          <p className="text-black/70 dark:text-white/70">
            {watchlist.length} {watchlist.length === 1 ? "item" : "items"}
          </p>
        </motion.div>

        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bookmark size={64} className="mx-auto mb-4 text-black/20 dark:text-white/20" />
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
              Your watchlist is empty
            </h2>
            <p className="text-black/70 dark:text-white/70 mb-8">
              Start adding movies and shows to watch later
            </p>
            <Link
              to="/home"
              className="inline-block px-6 py-3 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-colors"
            >
              Browse Content
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item: any, index: number) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <MediaCard
                  media={{
                    id: parseInt(item.mediaId),
                    title: item.title,
                    name: item.title,
                    poster_path: item.posterPath || "",
                    backdrop_path: item.backdropPath || "",
                    overview: item.overview || "",
                    vote_average: 0,
                    media_type: item.mediaType,
                  }}
                  index={index}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
