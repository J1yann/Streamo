import { useParams, useSearchParams, Link } from "react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const providerIds: Record<string, number> = {
  netflix: 8,
  prime: 9,
  hulu: 15,
  shudder: 99,
  disneyplus: 337,
  appletv: 350,
  peacock: 387,
  paramount: 531,
  hbo: 384,
};

const providerNames: Record<string, string> = {
  netflix: "Netflix",
  prime: "Prime Video",
  hulu: "Hulu",
  shudder: "Shudder",
  disneyplus: "Disney+",
  appletv: "Apple TV+",
  peacock: "Peacock",
  paramount: "Paramount+",
  hbo: "HBO Max",
};

export default function ProviderContent() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "movie";
  const [content, setContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const providerId = id ? providerIds[id] : null;
  const providerName = id ? providerNames[id] : "Provider";

  useEffect(() => {
    if (!providerId) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&with_watch_providers=${providerId}&watch_region=US&sort_by=popularity.desc&page=1`
        );
        const data = await response.json();
        setContent(data.results || []);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [providerId, type]);

  if (!id || !providerId) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] flex items-center justify-center">
        <p className="text-black/70 dark:text-white/70">Provider not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/providers"
          className="inline-flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-[#4D7CFF] transition-colors mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Providers</span>
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white mb-2">
            {providerName}
          </h1>
          <p className="text-black/70 dark:text-white/70">
            {type === "movie" ? "Movies" : "TV Shows"} available on {providerName}
          </p>
        </motion.div>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-2/3 rounded-xl bg-white/50 dark:bg-[#14171F]/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {content.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
              >
                <Link
                  to={`/watch/${item.id}?type=${type}`}
                  className="block group"
                >
                  <div className="relative aspect-2/3 rounded-xl overflow-hidden bg-white dark:bg-[#14171F] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.6)] group-hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:group-hover:shadow-[0px_8px_24px_rgba(0,0,0,0.8)] transition-all duration-300">
                    {item.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                        alt={item.title || item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/5">
                        <span className="text-black/30 dark:text-white/30">
                          No Image
                        </span>
                      </div>
                    )}
                    {item.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white">
                        ⭐ {item.vote_average.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-[#111111] dark:text-white line-clamp-2">
                    {item.title || item.name}
                  </h3>
                  <p className="text-xs text-black/50 dark:text-white/50">
                    {item.release_date?.split("-")[0] ||
                      item.first_air_date?.split("-")[0]}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && content.length === 0 && (
          <div className="text-center py-12">
            <p className="text-black/70 dark:text-white/70">
              No content found for this provider
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
