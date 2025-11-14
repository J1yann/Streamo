import { useLoaderData } from "react-router";
import type { Route } from "./+types/movies";
import { MediaCard } from "~/components/MediaCard";
import { tmdb, type Media } from "~/lib/tmdb";
import { motion } from "framer-motion";

export async function loader() {
  try {
    const [popular, topRated] = await Promise.all([
      tmdb.getPopularMovies(),
      tmdb.getTopRatedMovies(),
    ]);

    return {
      movies: [...popular.results, ...topRated.results].filter(
        (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
      ),
    };
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    return { movies: [] };
  }
}

export default function Movies({ loaderData }: Route.ComponentProps) {
  const { movies } = loaderData as { movies: Media[] };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8 text-[#111111] dark:text-white"
        >
          Movies
        </motion.h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, index) => (
            <MediaCard key={movie.id} media={movie} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
