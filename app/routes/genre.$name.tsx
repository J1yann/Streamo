import { useLoaderData, useParams } from "react-router";
import { MediaCard } from "~/components/MediaCard";
import { type Media } from "~/lib/tmdb";
import { motion } from "framer-motion";
import { useState } from "react";
import { Film, Tv, Loader2 } from "lucide-react";

const GENRE_MAP: Record<string, { id: number; name: string }> = {
  action: { id: 28, name: "Action" },
  adventure: { id: 12, name: "Adventure" },
  animation: { id: 16, name: "Animation" },
  comedy: { id: 35, name: "Comedy" },
  crime: { id: 80, name: "Crime" },
  documentary: { id: 99, name: "Documentary" },
  drama: { id: 18, name: "Drama" },
  family: { id: 10751, name: "Family" },
  fantasy: { id: 14, name: "Fantasy" },
  horror: { id: 27, name: "Horror" },
  music: { id: 10402, name: "Music" },
  mystery: { id: 9648, name: "Mystery" },
  romance: { id: 10749, name: "Romance" },
  "sci-fi": { id: 878, name: "Sci-Fi" },
  thriller: { id: 53, name: "Thriller" },
};

export async function loader({ params }: { params: { name: string } }) {
  const genreName = params.name;
  const genre = GENRE_MAP[genreName];

  if (!genre) {
    throw new Response("Genre not found", { status: 404 });
  }

  try {
    const [movies, tvShows] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&include_adult=false`
      ).then((r) => r.json()),
      fetch(
        `https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&include_adult=false`
      ).then((r) => r.json()),
    ]);

    return {
      genre: genre.name,
      movies: movies.results.map((m: any) => ({ ...m, media_type: "movie" })),
      tvShows: tvShows.results.map((t: any) => ({ ...t, media_type: "tv" })),
    };
  } catch (error) {
    console.error("Failed to fetch genre content:", error);
    return { genre: genre.name, movies: [], tvShows: [] };
  }
}

export default function GenrePage() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();
  const { genre, movies: initialMovies, tvShows: initialTvShows } = loaderData as {
    genre: string;
    movies: Media[];
    tvShows: Media[];
  };
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const [movies, setMovies] = useState(initialMovies);
  const [tvShows, setTvShows] = useState(initialTvShows);
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const filteredContent =
    filter === "all"
      ? [...movies, ...tvShows]
      : filter === "movie"
        ? movies
        : tvShows;

  const loadMore = async () => {
    setIsLoading(true);
    const genreName = params.name;
    const genreInfo = GENRE_MAP[genreName!];

    try {
      if (filter === "all" || filter === "movie") {
        const nextMoviePage = moviePage + 1;
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreInfo.id}&sort_by=popularity.desc&include_adult=false&page=${nextMoviePage}`
        );
        const movieData = await movieRes.json();
        setMovies((prev) => [
          ...prev,
          ...movieData.results.map((m: any) => ({ ...m, media_type: "movie" })),
        ]);
        setMoviePage(nextMoviePage);
      }

      if (filter === "all" || filter === "tv") {
        const nextTvPage = tvPage + 1;
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/discover/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&with_genres=${genreInfo.id}&sort_by=popularity.desc&include_adult=false&page=${nextTvPage}`
        );
        const tvData = await tvRes.json();
        setTvShows((prev) => [
          ...prev,
          ...tvData.results.map((t: any) => ({ ...t, media_type: "tv" })),
        ]);
        setTvPage(nextTvPage);
      }
    } catch (error) {
      console.error("Failed to load more content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#111111] dark:text-white">
            {genre}
          </h1>

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
        </motion.div>

        {filteredContent.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-black/70 dark:text-white/70">
              No content found for this genre.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredContent.map((media, index) => (
                <MediaCard key={`${media.media_type}-${media.id}`} media={media} index={index} />
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
