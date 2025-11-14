import { query } from "./_generated/server";
import { auth } from "./auth";

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    return user;
  },
});

// Check if user is authenticated
export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return !!userId;
  },
});
