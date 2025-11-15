import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/search";
import { tmdb, type Media, getImageUrl, getTitle, getYear } from "~/lib/tmdb";
import { MediaCard } from "~/components/MediaCard";
import { motion } from "framer-motion";
import { Search as SearchIcon, X } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  if (!query) {
    return { results: [], query: "" };
  }

  try {
    const data = await tmdb.searchMulti(query);
    const results = (data.results || []).filter(
      (item: any) => 
        (item.media_type === "movie" || item.media_type === "tv") && 
        !item.adult // Explicitly filter out adult content
    );
    return { results, query };
  } catch (error) {
    console.error("Search failed:", error);
    return { results: [], query };
  }
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { results, query: initialQuery } = loaderData as {
    results: Media[];
    query: string;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pt-8 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
            <div className="relative">
              <SearchIcon
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-[#14171F] border border-black/10 dark:border-white/8 rounded-2xl text-[#111111] dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#4D7CFF] transition-all"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                  aria-label="Clear search"
                >
                  <X size={20} className="text-black/40 dark:text-white/40" />
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Results */}
        {initialQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-[#111111] dark:text-white">
              {results.length > 0
                ? `Found ${results.length} result${results.length !== 1 ? "s" : ""} for "${initialQuery}"`
                : `No results found for "${initialQuery}"`}
            </h2>

            {results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((item) => (
                  <MediaCard key={item.id} media={item} />
                ))}
              </div>
            )}

            {results.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-black/5 dark:bg-white/5 rounded-full mb-4">
                  <SearchIcon size={32} className="text-black/20 dark:text-white/20" />
                </div>
                <p className="text-black/60 dark:text-white/60 text-lg">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!initialQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#4D7CFF]/10 rounded-full mb-6">
              <SearchIcon size={40} className="text-[#4D7CFF]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[#111111] dark:text-white">
              Search for Content
            </h2>
            <p className="text-black/60 dark:text-white/60 text-lg max-w-md mx-auto">
              Discover thousands of movies and TV shows. Start typing to find your next favorite.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
