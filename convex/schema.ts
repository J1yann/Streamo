import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
  }).index("by_email", ["email"]),

  watchHistory: defineTable({
    userId: v.id("users"),
    mediaId: v.string(), // TMDB ID
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    backdropPath: v.optional(v.string()),
    // For TV shows
    season: v.optional(v.number()),
    episode: v.optional(v.number()),
    // Progress tracking
    watchedAt: v.number(),
    progress: v.optional(v.number()), // percentage watched
  })
    .index("by_user", ["userId"])
    .index("by_user_and_media", ["userId", "mediaId", "mediaType"]),

  watchlist: defineTable({
    userId: v.id("users"),
    mediaId: v.string(),
    mediaType: v.union(v.literal("movie"), v.literal("tv")),
    title: v.string(),
    posterPath: v.optional(v.string()),
    backdropPath: v.optional(v.string()),
    overview: v.optional(v.string()),
    addedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_media", ["userId", "mediaId", "mediaType"]),
});
