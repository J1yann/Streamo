import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (!args.existingUserId) {
        // New user created - check if they have a verified email
        const user = await ctx.db.get(args.userId);
        if (user?.email) {
          const verificationCodes = await ctx.db.query("verificationCodes").collect();
          const verification = verificationCodes.find(
            (v) => v.email === user.email && v.used === true
          );

          if (verification) {
            // User signed up with verified email - set isEmailVerified and name
            const updates: { isEmailVerified: boolean; name?: string } = {
              isEmailVerified: true,
            };
            
            if (verification.pendingRegistration?.name) {
              updates.name = verification.pendingRegistration.name;
            }
            
            await ctx.db.patch(args.userId, updates);
          }
        }
      }
    },
  },
});
