import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useWatchHistory() {
  const history = useQuery(api.watchHistory.getHistory);
  const addToHistory = useMutation(api.watchHistory.addToHistory);
  const removeFromHistory = useMutation(api.watchHistory.removeFromHistory);

  return {
    history: history ?? [],
    addToHistory,
    removeFromHistory,
  };
}
