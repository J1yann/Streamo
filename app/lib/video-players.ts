export interface VideoPlayer {
  name: string;
  urlTemplate: string;
}

export function getVideoPlayers(): VideoPlayer[] {
  const players: VideoPlayer[] = [];
  
  // Read numbered environment variables (VITE_PLAYER_API_1, VITE_PLAYER_API_2, etc.)
  let index = 1;
  while (true) {
    const envKey = `VITE_PLAYER_API_${index}`;
    const playerConfig = import.meta.env[envKey];
    
    if (!playerConfig) break;
    
    const [name, urlTemplate] = playerConfig.split("|");
    if (name && urlTemplate) {
      players.push({
        name: name.trim(),
        urlTemplate: urlTemplate.trim(),
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
  // Support multiple placeholder formats:
  // {id} or {tmdb_id} or {media_id} - TMDB ID
  // {type} or {media_type} - movie or tv
  // {season} or {s} - season number
  // {episode} or {e} - episode number
  let url = player.urlTemplate
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
