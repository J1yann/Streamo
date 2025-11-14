import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code (in production, use Resend or similar)
export const sendVerificationCode = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const code = generateCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Delete any existing codes for this email
    const existing = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    // Store new code
    await ctx.db.insert("verificationCodes", {
      email: args.email,
      code,
      expiresAt,
      used: false,
    });

    // TODO: In production, send email via Resend or similar service
    // For now, we'll just log it (you'll see it in Convex dashboard logs)
    console.log(`Verification code for ${args.email}: ${code}`);
    
    return { success: true, code }; // Remove 'code' in production!
  },
});

// Verify code
export const verifyCode = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const verification = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!verification) {
      throw new Error("No verification code found");
    }

    if (verification.used) {
      throw new Error("Code already used");
    }

    if (verification.expiresAt < Date.now()) {
      throw new Error("Code expired");
    }

    if (verification.code !== args.code) {
      throw new Error("Invalid code");
    }

    // Mark as used
    await ctx.db.patch(verification._id, { used: true });

    // Update user's email verification status
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        isEmailVerified: true,
        emailVerified: Date.now(),
      });
    }

    return { success: true };
  },
});

// Check if email is verified
export const isEmailVerified = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;

    const user = await ctx.db.get(userId);
    return user?.isEmailVerified ?? false;
  },
});
