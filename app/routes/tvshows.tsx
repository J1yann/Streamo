import { useLoaderData } from "react-router";
import type { Route } from "./+types/tvshows";
import { MediaCard } from "~/components/MediaCard";
import { tmdb, type Media } from "~/lib/tmdb";
import { motion } from "framer-motion";

export async function loader() {
  try {
    const [popular, topRated] = await Promise.all([
      tmdb.getPopularTV(),
      tmdb.getTopRatedTV(),
    ]);

    return {
      shows: [...popular.results, ...topRated.results].filter(
        (show, index, self) => self.findIndex((s) => s.id === show.id) === index
      ),
    };
  } catch (error) {
    console.error("Failed to fetch TV shows:", error);
    return { shows: [] };
  }
}

export default function TVShows({ loaderData }: Route.ComponentProps) {
  const { shows } = loaderData as { shows: Media[] };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-[#111111] dark:text-white"
        >
          TV Shows
        </motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {shows.map((show, index) => (
            <MediaCard key={show.id} media={show} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
