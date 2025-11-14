import { useParams } from "react-router";
import type { Route } from "./+types/watch.$id";
import { tmdb, getImageUrl, getTitle, type Media } from "~/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { MediaCard } from "~/components/MediaCard";
import { Icon } from "~/components/Icon";
import { Play, Clock, Calendar, Info, ChevronDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getVideoPlayers, getPlayerUrl } from "~/lib/video-players";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WatchlistButton } from "~/components/WatchlistButton";
import { useWatchHistory } from "~/hooks/useWatchHistory";

export async function loader({ params }: Route.LoaderArgs) {
  const id = parseInt(params.id);
  
  try {
    // Try to fetch as movie first, then TV show
    const media = await tmdb.getMovieDetails(id).catch(() => tmdb.getTVDetails(id));
    const mediaType = media.title ? "movie" : "tv";
    
    // Extract genre IDs from the current media
    const currentGenreIds = (media as any).genres?.map((g: any) => g.id) || [];
    
    // Fetch both similar and recommended content in parallel
    const [similarData, recommendedData] = await Promise.all([
      tmdb.getSimilar(mediaType, id).catch(() => ({ results: [] })),
      tmdb.getRecommendations(mediaType, id).catch(() => ({ results: [] })),
    ]);

    // Combine and deduplicate results
    const allResults = [...(similarData.results || []), ...(recommendedData.results || [])];
    const uniqueResults = Array.from(
      new Map(allResults.map(item => [item.id, item])).values()
    );

    // Calculate genre match score for each item
    const calculateGenreScore = (item: Media) => {
      if (!item.genre_ids || currentGenreIds.length === 0) return 0;
      const matchingGenres = item.genre_ids.filter(gid => currentGenreIds.includes(gid));
      return matchingGenres.length / currentGenreIds.length; // Percentage of matching genres
    };

    // Sort by genre match first, then rating
    const sortedResults = uniqueResults
      .filter(item => item.poster_path && item.vote_average > 0) // Filter out items without posters or ratings
      .map(item => ({
        ...item,
        genreScore: calculateGenreScore(item),
      }))
      .sort((a, b) => {
        // Prioritize genre matching heavily
        // Score: 60% genre match, 30% rating, 10% popularity
        const scoreA = 
          (a.genreScore * 60) + 
          (a.vote_average * 3) + 
          (Math.min(a.vote_average, 10));
        const scoreB = 
          (b.genreScore * 60) + 
          (b.vote_average * 3) + 
          (Math.min(b.vote_average, 10));
        return scoreB - scoreA;
      })
      .slice(0, 10); // Show top 10 recommendations

    return {
      media,
      similar: sortedResults,
    };
  } catch (error) {
    console.error("Failed to fetch media details:", error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function Watch({ loaderData }: Route.ComponentProps) {
  const { media, similar } = loaderData as { media: Media; similar: Media[] };
  const params = useParams();
  const title = getTitle(media);
  const year = media.release_date || media.first_air_date;
  const runtime = (media as any).runtime || (media as any).episode_run_time?.[0];
  const [showPlayer, setShowPlayer] = useState(false);
  
  const players = useMemo(() => getVideoPlayers(), []);
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  
  const mediaType = media.title ? "movie" : "tv";
  const isTVShow = mediaType === "tv";
  
  // TV Show episode selection
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const seasons = media.seasons?.filter(s => s.season_number > 0) || [];
  
  // Watch history tracking
  const { addToHistory } = useWatchHistory();
  
  // Track when user starts watching
  useEffect(() => {
    if (showPlayer) {
      addToHistory({
        mediaId: params.id!,
        mediaType,
        title,
        posterPath: media.poster_path || undefined,
        backdropPath: media.backdrop_path || undefined,
        season: isTVShow ? selectedSeason : undefined,
        episode: isTVShow ? selectedEpisode : undefined,
      }).catch(err => console.error("Failed to add to history:", err));
    }
  }, [showPlayer, params.id, mediaType, title, media.poster_path, media.backdrop_path, isTVShow, selectedSeason, selectedEpisode, addToHistory]);
  
  const playerUrl = useMemo(
    () => getPlayerUrl(
      players[selectedPlayer], 
      parseInt(params.id!), 
      mediaType,
      isTVShow ? selectedSeason : undefined,
      isTVShow ? selectedEpisode : undefined
    ),
    [players, selectedPlayer, params.id, mediaType, isTVShow, selectedSeason, selectedEpisode]
  );

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {!showPlayer ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              {/* Backdrop Image */}
              {media.backdrop_path && (
                <div className="absolute inset-0 h-[600px]">
                  <img
                    src={getImageUrl(media.backdrop_path, "original")}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#F5F6F8] dark:from-[#0B0D13] via-[#F5F6F8]/80 dark:via-[#0B0D13]/80 to-transparent" />
                  <div className="absolute inset-0 bg-linear-to-r from-[#F5F6F8] dark:from-[#0B0D13] via-transparent to-[#F5F6F8]/50 dark:to-[#0B0D13]/50" />
                </div>
              )}

              {/* Content */}
              <div className="relative max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-12">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Poster */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="shrink-0"
                  >
                    <img
                      src={getImageUrl(media.poster_path, "w500")}
                      alt={title}
                      className="w-64 md:w-80 rounded-2xl shadow-2xl"
                    />
                  </motion.div>

                  {/* Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex-1 pt-4"
                  >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-[#111111] dark:text-white">
                      {title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className="px-4 py-2 bg-[#4D7CFF] text-white rounded-full font-semibold flex items-center gap-2 shadow-lg">
                        <Icon name="star" size={18} />
                        {media.vote_average.toFixed(1)}
                      </span>
                      {year && (
                        <span className="px-4 py-2 bg-white/90 dark:bg-white/10 backdrop-blur rounded-full font-medium text-[#111111] dark:text-white flex items-center gap-2">
                          <Calendar size={18} />
                          {new Date(year).getFullYear()}
                        </span>
                      )}
                      {runtime && (
                        <span className="px-4 py-2 bg-white/90 dark:bg-white/10 backdrop-blur rounded-full font-medium text-[#111111] dark:text-white flex items-center gap-2">
                          <Clock size={18} />
                          {runtime} min
                        </span>
                      )}
                    </div>

                    {/* Overview */}
                    <p className="text-lg text-black/80 dark:text-white/80 leading-relaxed mb-8 max-w-3xl">
                      {media.overview}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => setShowPlayer(true)}
                        className="px-8 py-4 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-all shadow-lg hover:shadow-xl flex items-center gap-3 text-lg"
                      >
                        <Play size={24} fill="currentColor" />
                        Play Now
                      </button>
                      <WatchlistButton
                        mediaId={params.id!}
                        mediaType={mediaType}
                        title={title}
                        posterPath={media.poster_path || undefined}
                        backdropPath={media.backdrop_path || undefined}
                        overview={media.overview || undefined}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8 pb-12"
            >
              <div className="relative bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <iframe
                  key={`${selectedPlayer}-${selectedSeason}-${selectedEpisode}`}
                  src={playerUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={title}
                />
              </div>

              {/* TV Show Episode Selector */}
              {isTVShow && seasons.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-black/70 dark:text-white/70 shrink-0">
                      Season:
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-4 py-2 bg-white/90 dark:bg-[#1F2937] backdrop-blur text-[#111111] dark:text-white rounded-full text-sm font-medium border-none outline-none cursor-pointer shadow-lg flex items-center gap-2 hover:bg-white dark:hover:bg-[#374151] transition-colors">
                        {seasons.find(s => s.season_number === selectedSeason)?.name || `Season ${selectedSeason}`}
                        <ChevronDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700">
                        {seasons.map((season) => (
                          <DropdownMenuItem
                            key={season.season_number}
                            onClick={() => {
                              setSelectedSeason(season.season_number);
                              setSelectedEpisode(1);
                            }}
                            className="cursor-pointer"
                          >
                            {season.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-black/70 dark:text-white/70 shrink-0">
                      Episode:
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="px-4 py-2 bg-white/90 dark:bg-[#1F2937] backdrop-blur text-[#111111] dark:text-white rounded-full text-sm font-medium border-none outline-none cursor-pointer shadow-lg flex items-center gap-2 hover:bg-white dark:hover:bg-[#374151] transition-colors">
                        Episode {selectedEpisode}
                        <ChevronDown size={16} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                        {Array.from({ length: seasons.find(s => s.season_number === selectedSeason)?.episode_count || 1 }, (_, i) => i + 1).map((ep) => (
                          <DropdownMenuItem
                            key={ep}
                            onClick={() => setSelectedEpisode(ep)}
                            className="cursor-pointer"
                          >
                            Episode {ep}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}

              {/* Player Selector */}
              {players.length > 1 && (
                <div className="mt-4 flex items-start gap-3">
                  <span className="text-sm font-medium text-black/70 dark:text-white/70 pt-2 shrink-0">
                    Player:
                  </span>
                  <div className="flex-1 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-2 pb-2">
                      {players.map((player, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedPlayer(index)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                            selectedPlayer === index
                              ? "bg-[#4D7CFF] text-white shadow-lg"
                              : "bg-white/90 dark:bg-white/10 text-[#111111] dark:text-white hover:bg-white dark:hover:bg-white/20"
                          }`}
                        >
                          {player.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Info Below Player */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-[#111111] dark:text-white">
                    {title}
                  </h1>
                  <button
                    onClick={() => setShowPlayer(false)}
                    className="px-6 py-3 bg-white/90 dark:bg-white/10 backdrop-blur text-[#111111] dark:text-white rounded-full font-semibold hover:bg-white dark:hover:bg-white/20 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Info size={20} />
                    Details
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="px-4 py-2 bg-[#4D7CFF] text-white rounded-full font-semibold flex items-center gap-2 shadow-lg">
                    <Icon name="star" size={18} />
                    {media.vote_average.toFixed(1)}
                  </span>
                  {year && (
                    <span className="px-4 py-2 bg-white/90 dark:bg-white/10 backdrop-blur rounded-full font-medium text-[#111111] dark:text-white flex items-center gap-2">
                      <Calendar size={18} />
                      {new Date(year).getFullYear()}
                    </span>
                  )}
                  {runtime && (
                    <span className="px-4 py-2 bg-white/90 dark:bg-white/10 backdrop-blur rounded-full font-medium text-[#111111] dark:text-white flex items-center gap-2">
                      <Clock size={18} />
                      {runtime} min
                    </span>
                  )}
                </div>
                <p className="text-black/70 dark:text-white/70 leading-relaxed">
                  {media.overview}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Similar Content */}
        {similar.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-[#111111] dark:text-white">
                More Like This
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {similar.map((item, index) => (
                  <MediaCard key={item.id} media={item} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
