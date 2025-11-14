import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
    isEmailVerified: v.optional(v.boolean()),
  }).index("by_email", ["email"]),

  verificationCodes: defineTable({
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    used: v.optional(v.boolean()),
    // Store pending registration data
    pendingRegistration: v.optional(v.object({
      name: v.string(),
      password: v.string(),
    })),
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
