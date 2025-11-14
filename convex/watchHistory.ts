import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Add or update watch history
export const addToHistory = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    backdropPath: v.optional(v.string()),
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
    progress: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already exists
    const existing = await ctx.db
      .query("watchHistory")
      .withIndex("by_user_and_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      // Update existing entry
      await ctx.db.patch(existing._id, {
        watchedAt: Date.now(),
        progress: args.progress,
        season: args.season,
        episode: args.episode,
      });
      return existing._id;
    }

    // Create new entry
    return await ctx.db.insert("watchHistory", {
      userId,
      ...args,
      watchedAt: Date.now(),
    });
  },
});

// Get user's watch history
export const getHistory = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const history = await ctx.db
      .query("watchHistory")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(50);

    return history;
  },
});

// Remove from watch history
export const removeFromHistory = mutation({
  args: { historyId: v.id("watchHistory") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const history = await ctx.db.get(args.historyId);
    if (!history || history.userId !== userId) {
      throw new Error("Not found or unauthorized");
    }

    await ctx.db.delete(args.historyId);
  },
});
