import { Link } from "react-router";
import type { Route } from "./+types/home";
import { HorizontalScroller } from "~/components/HorizontalScroller";
import { SignInBanner } from "~/components/SignInBanner";
import { StreamingProviders } from "~/components/StreamingProviders";
import { tmdb, type Media, getImageUrl, getTitle } from "~/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

export async function loader() {
  try {
    const [trending, topRated, nowPlaying, netflix] = await Promise.all([
      tmdb.getTrending(),
      tmdb.getTopRated(),
      tmdb.getNowPlaying(),
      tmdb.getNetflixContent(),
    ]);

    return {
      featuredItems: trending.results?.slice(0, 5) || [],
      trending: trending.results?.slice(5) || [],
      topRated: topRated.results || [],
      latestReleases: nowPlaying.results || [],
      netflix: netflix.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { featuredItems: [], trending: [], topRated: [], latestReleases: [], netflix: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featuredItems, trending, topRated, latestReleases, netflix } = loaderData as {
    featuredItems: Media[];
    trending: Media[];
    topRated: Media[];
    latestReleases: Media[];
    netflix: Media[];
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetTimer, setResetTimer] = useState(0);
  const featured = featuredItems[currentIndex];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (featuredItems.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredItems.length, resetTimer]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
    setResetTimer((prev) => prev + 1); // Reset timer
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length);
    setResetTimer((prev) => prev + 1); // Reset timer
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setResetTimer((prev) => prev + 1); // Reset timer
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13]">
      {/* Featured Hero Section */}
      {featured && (
        <section className="relative h-[85vh] flex items-end overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              {/* Backdrop Image */}
              <img
                src={getImageUrl(featured.backdrop_path || featured.poster_path, "original")}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#F5F6F8] dark:from-[#0B0D13] via-[#F5F6F8]/60 dark:via-[#0B0D13]/60 to-transparent" />
              <div className="absolute inset-0 bg-linear-to-r from-[#F5F6F8] dark:from-[#0B0D13] via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Stacked on Right */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
            <button
              onClick={goToNext}
              className="w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-all shadow-lg"
              aria-label="Next"
            >
              <ChevronRight size={28} className="text-white" />
            </button>
            <button
              onClick={goToPrevious}
              className="w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg transition-all shadow-lg"
              aria-label="Previous"
            >
              <ChevronLeft size={28} className="text-white" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-16 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl"
              >
                {/* Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 bg-[#4D7CFF] text-white text-sm font-semibold rounded-full shadow-lg">
                    #{currentIndex + 1} Spotlight
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-white/10 backdrop-blur rounded-full">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-[#111111] dark:text-white">
                      {featured.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#111111] dark:text-white drop-shadow-lg">
                  {getTitle(featured)}
                </h1>

                {/* Overview */}
                <p className="text-base md:text-lg text-black/80 dark:text-white/90 leading-relaxed mb-6 line-clamp-3 drop-shadow-md">
                  {featured.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/watch/${featured.id}`}
                    className="px-8 py-3.5 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-all shadow-lg hover:shadow-xl flex items-center gap-2.5 text-base"
                  >
                    <Play size={20} fill="currentColor" />
                    Play Now
                  </Link>
                  <Link
                    to={`/watch/${featured.id}`}
                    className="px-8 py-3.5 bg-white/90 dark:bg-white/10 backdrop-blur text-[#111111] dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-white/20 transition-all shadow-lg flex items-center gap-2.5"
                  >
                    <Info size={20} />
                    More Info
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Fade to content */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#F5F6F8] dark:from-[#0B0D13] to-transparent pointer-events-none" />
        </section>
      )}

      {/* Content Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="pb-16"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mb-8">
          <SignInBanner />
        </div>
        <StreamingProviders />
        <HorizontalScroller title="Latest Releases" items={latestReleases} />
        <HorizontalScroller title="Latest Netflix Releases" items={netflix} />
        <HorizontalScroller title="Trending Now" items={trending} />
        <HorizontalScroller title="Top Rated" items={topRated} />
      </motion.div>
    </div>
  );
}
