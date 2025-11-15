const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export interface Genre {
  id: number;
  name: string;
}

export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: "movie" | "tv";
  number_of_seasons?: number;
  seasons?: Season[];
  genres?: Genre[];
  genre_ids?: number[];
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

async function fetchTMDB(endpoint: string) {
  const separator = endpoint.includes('?') ? '&' : '?';
  const res = await fetch(`${BASE_URL}${endpoint}${separator}api_key=${TMDB_API_KEY}&include_adult=false`);
  if (!res.ok) throw new Error("TMDB API error");
  return res.json();
}

export const tmdb = {
  getTrending: () => fetchTMDB("/trending/all/week"),
  getTopRated: () => fetchTMDB("/movie/top_rated"),
  getTopRatedMovies: () => fetchTMDB("/movie/top_rated"),
  getTopRatedTV: () => fetchTMDB("/tv/top_rated"),
  getPopularMovies: () => fetchTMDB("/movie/popular"),
  getPopularTV: () => fetchTMDB("/tv/popular"),
  getUpcomingMovies: () => fetchTMDB("/movie/upcoming"),
  getNowPlaying: () => fetchTMDB("/movie/now_playing"),
  getNetflixContent: () => fetchTMDB("/discover/tv?with_networks=213"),
  getKidsContent: () => fetchTMDB("/discover/movie?certification_country=US&certification.lte=G"),
  getMovieDetails: (id: number) => fetchTMDB(`/movie/${id}`),
  getTVDetails: (id: number) => fetchTMDB(`/tv/${id}`),
  getSeason: (tvId: number, seasonNumber: number) => fetchTMDB(`/tv/${tvId}/season/${seasonNumber}`),
  getSimilar: (type: "movie" | "tv", id: number) => fetchTMDB(`/${type}/${id}/similar`),
  getRecommendations: (type: "movie" | "tv", id: number) => fetchTMDB(`/${type}/${id}/recommendations`),
  searchMulti: (query: string) => fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}`),
};

export function getImageUrl(path: string | null, size: "w500" | "w780" | "original" = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.jpg";
}

export function getTitle(media: Media) {
  return media.title || media.name || "Untitled";
}

export function getYear(media: Media) {
  const date = media.release_date || media.first_air_date;
  return date ? new Date(date).getFullYear() : "";
}
