export interface VideoPlayer {
  name: string;
  urlTemplate: string;
  tvUrlTemplate?: string; // Optional separate template for TV shows
}

export function getVideoPlayers(): VideoPlayer[] {
  const players: VideoPlayer[] = [];
  
  // Read numbered environment variables (VITE_PLAYER_API_1, VITE_PLAYER_API_2, etc.)
  let index = 1;
  while (true) {
    const envKey = `VITE_PLAYER_API_${index}`;
    const playerConfig = import.meta.env[envKey];
    
    if (!playerConfig) break;
    
    // Support format: Name|MovieURL or Name|MovieURL|TVURL
    const parts = playerConfig.split("|");
    const name = parts[0]?.trim();
    const urlTemplate = parts[1]?.trim();
    const tvUrlTemplate = parts[2]?.trim();
    
    if (name && urlTemplate) {
      players.push({
        name,
        urlTemplate,
        tvUrlTemplate: tvUrlTemplate || undefined,
      });
    }
    
    index++;
  }
  
  // Default fallback players if none configured
  if (players.length === 0) {
    return [
      {
        name: "VidSrc",
        urlTemplate: "https://vidsrc.xyz/embed/{type}/{id}",
      },
      {
        name: "VidSrc Pro",
        urlTemplate: "https://vidsrc.pro/embed/{type}/{id}",
      },
    ];
  }
  
  return players;
}

export function getPlayerUrl(
  player: VideoPlayer,
  mediaId: number,
  mediaType: "movie" | "tv",
  season?: number,
  episode?: number
): string {
  // Use TV-specific template if available and media is TV show
  const template = mediaType === "tv" && player.tvUrlTemplate 
    ? player.tvUrlTemplate 
    : player.urlTemplate;

  // Support multiple placeholder formats:
  // {id} or {tmdb_id} or {media_id} - TMDB ID
  // {type} or {media_type} - movie or tv
  // {season} or {s} - season number
  // {episode} or {e} - episode number
  let url = template
    .replace(/\{id\}/g, mediaId.toString())
    .replace(/\{tmdb_id\}/g, mediaId.toString())
    .replace(/\{media_id\}/g, mediaId.toString())
    .replace(/\{type\}/g, mediaType)
    .replace(/\{media_type\}/g, mediaType);

  if (season !== undefined) {
    url = url
      .replace(/\{season\}/g, season.toString())
      .replace(/\{s\}/g, season.toString());
  }

  if (episode !== undefined) {
    url = url
      .replace(/\{episode\}/g, episode.toString())
      .replace(/\{e\}/g, episode.toString());
  }

  return url;
}
