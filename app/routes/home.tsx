import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { HorizontalScroller } from "~/components/HorizontalScroller";
import { tmdb, type Media } from "~/lib/tmdb";
import { motion } from "framer-motion";

export async function loader() {
  try {
    const [trending, topMovies, topTV] = await Promise.all([
      tmdb.getTrending(),
      tmdb.getTopRatedMovies(),
      tmdb.getTopRatedTV(),
    ]);

    return {
      trending: trending.results || [],
      topMovies: topMovies.results || [],
      topTV: topTV.results || [],
    };
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return { trending: [], topMovies: [], topTV: [] };
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { trending, topMovies, topTV } = loaderData as {
    trending: Media[];
    topMovies: Media[];
    topTV: Media[];
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="pt-8">
          <HorizontalScroller title="Trending Now" items={trending} />
          <HorizontalScroller title="Top Rated Movies" items={topMovies} />
          <HorizontalScroller title="Top Rated TV Shows" items={topTV} />
        </div>
      </motion.div>
    </div>
  );
}
