import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Add to watchlist
export const addToWatchlist = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    backdropPath: v.optional(v.string()),
    overview: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if already in watchlist
    const existing = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("watchlist", {
      userId,
      ...args,
      addedAt: Date.now(),
    });
  },
});

// Get user's watchlist
export const getWatchlist = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const watchlist = await ctx.db
      .query("watchlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    return watchlist;
  },
});

// Check if item is in watchlist
export const isInWatchlist = query({
  args: {
    mediaId: v.string(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const item = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    return !!item;
  },
});

// Remove from watchlist
export const removeFromWatchlist = mutation({
  args: {
    mediaId: v.string(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("watchlist")
      .withIndex("by_user_and_media", (q) =>
        q.eq("userId", userId).eq("mediaId", args.mediaId).eq("mediaType", args.mediaType)
      )
      .first();

    if (!item) {
      throw new Error("Not found");
    }

    await ctx.db.delete(item._id);
  },
});
