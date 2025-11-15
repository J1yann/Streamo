import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { siNetflix, siAppletv, siHbo, siParamountplus } from "simple-icons";
import { HorizontalScroller } from "./HorizontalScroller";
import type { Media } from "~/lib/tmdb";

const providers = [
  { id: "netflix", name: "NETFLIX", icon: siNetflix, color: "#E50914", tmdbId: 8 },
  { id: "prime", name: "prime video", icon: null, color: "#00A8E1", tmdbId: 9 },
  { id: "hulu", name: "hulu", icon: null, color: "#1CE783", tmdbId: 15 },
  { id: "hbo", name: "MAX", icon: siHbo, color: "#000000", tmdbId: 1899 },
  { id: "disneyplus", name: "Disney+", icon: null, color: "#113CCF", tmdbId: 337 },
  { id: "paramount", name: "Paramount+", icon: siParamountplus, color: "#0064FF", tmdbId: 531 },
  { id: "appletv", name: "tv+", icon: siAppletv, color: "#000000", tmdbId: 350 },
  { id: "shudder", name: "SHUDDER", icon: null, color: "#FF0000", tmdbId: 99 },
];

export function StreamingProviders() {
  const [activeTab, setActiveTab] = useState<"movies" | "tvshows">("movies");
  const [selectedProvider, setSelectedProvider] = useState(providers[0]);
  const [content, setContent] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const type = activeTab === "movies" ? "movie" : "tv";
        
        // Get date range for recent releases (last 6 months)
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        
        const releaseDateGte = sixMonthsAgo.toISOString().split('T')[0];
        const releaseDateLte = today.toISOString().split('T')[0];
        
        const dateParam = type === "movie" 
          ? `&primary_release_date.gte=${releaseDateGte}&primary_release_date.lte=${releaseDateLte}`
          : `&first_air_date.gte=${releaseDateGte}&first_air_date.lte=${releaseDateLte}`;
        
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&with_watch_providers=${selectedProvider.tmdbId}&watch_region=US&sort_by=popularity.desc${dateParam}&page=1`
        );
        const data = await response.json();
        const results = data.results?.slice(0, 10).map((item: Media) => ({
          ...item,
          media_type: type,
        })) || [];
        setContent(results);
      } catch (error) {
        console.error("Error fetching content:", error);
        setContent([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [selectedProvider, activeTab]);

  const handleProviderClick = (provider: typeof providers[0]) => {
    setSelectedProvider(provider);
  };

  return (
    <div className="py-12">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mb-6">
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#4D7CFF]"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <h2 className="text-2xl md:text-3xl font-bold text-[#111111] dark:text-white">
                Streaming Providers
              </h2>
            </div>
            <p className="text-sm text-black/70 dark:text-white/70">
              Top shows from your favorite streaming services
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("movies")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeTab === "movies"
                  ? "bg-[#4D7CFF] text-white shadow-lg"
                  : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab("tvshows")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
                activeTab === "tvshows"
                  ? "bg-[#4D7CFF] text-white shadow-lg"
                  : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
            >
              TV Shows
            </button>
          </div>
        </div>
      </div>

      {/* Providers - Horizontal Scroll */}
      <section className="mb-12">
        <div className="px-4 md:px-6 lg:px-8">
          <div
            className="overflow-x-auto scrollbar-hide -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="flex gap-4 py-2" style={{ willChange: "transform" }}>
              {providers.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="shrink-0"
                >
                  <button
                    onClick={() => handleProviderClick(provider)}
                    className="group"
                  >
                    <div
                      className={`w-[160px] md:w-[180px] aspect-video rounded-2xl bg-[#1a1d29] hover:bg-[#252936] transition-all duration-300 flex items-center justify-center p-6 md:p-8 ${
                        selectedProvider.id === provider.id ? "ring-2 ring-[#4D7CFF]" : ""
                      }`}
                    >
                      {provider.icon ? (
                        <svg
                          role="img"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full h-full max-w-[100px] max-h-[50px]"
                          style={{
                            fill: provider.id === "appletv" || provider.id === "hbo" ? "#FFFFFF" : `#${provider.icon.hex}`,
                          }}
                        >
                          <path d={provider.icon.path} />
                        </svg>
                      ) : (
                        <span
                          className="text-lg md:text-xl font-bold text-center leading-tight"
                          style={{ color: provider.color }}
                        >
                          {provider.name}
                        </span>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Content */}
      {loading ? (
        <section className="mb-12">
          <div className="px-4 md:px-6 lg:px-8 mb-4">
            <h3 className="text-xl font-bold text-[#111111] dark:text-white">
              Top 10 on {selectedProvider.name}
            </h3>
          </div>
          <div className="px-4 md:px-6 lg:px-8">
            <div className="flex gap-4 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-[160px] md:w-[200px] aspect-2/3 rounded-xl bg-white/50 dark:bg-[#14171F]/50 animate-pulse"
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <HorizontalScroller 
          title={`Top 10 on ${selectedProvider.name}`} 
          items={content} 
        />
      )}
    </div>
  );
}
