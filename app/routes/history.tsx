import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { History, Film, Tv } from "lucide-react";
import { Link } from "react-router";
import { MediaCard } from "~/components/MediaCard";
import { useWatchHistory } from "~/hooks/useWatchHistory";
import { useState } from "react";

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { history } = useWatchHistory();
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((item: any) => item.mediaType === filter);

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
          <History size={64} className="mx-auto mb-4 text-[#4D7CFF]" />
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">
            Sign In Required
          </h1>
          <p className="text-black/70 dark:text-white/70 mb-8">
            Sign in to view your watch history.
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
          <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
            Watch History
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-black/70 dark:text-white/70">
              {filteredHistory.length} {filteredHistory.length === 1 ? "item" : "items"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === "all"
                    ? "bg-[#4D7CFF] text-white"
                    : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("movie")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === "movie"
                    ? "bg-[#4D7CFF] text-white"
                    : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Film size={18} />
                Movies
              </button>
              <button
                onClick={() => setFilter("tv")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                  filter === "tv"
                    ? "bg-[#4D7CFF] text-white"
                    : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <Tv size={18} />
                TV Shows
              </button>
            </div>
          </div>
        </motion.div>

        {filteredHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <History size={64} className="mx-auto mb-4 text-black/20 dark:text-white/20" />
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">
              No watch history yet
            </h2>
            <p className="text-black/70 dark:text-white/70 mb-8">
              Start watching movies and shows to build your history
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
            {filteredHistory.map((item: any, index: number) => (
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
                    overview: "",
                    vote_average: 0,
                    media_type: item.mediaType,
                  }}
                  index={index}
                />
                {item.season && item.episode && (
                  <div className="mt-2 text-xs text-black/60 dark:text-white/60 text-center">
                    S{item.season} E{item.episode}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
