import { v } from "convex/values";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";
import { Resend } from "resend";

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check if email verification is enabled
export const isVerificationEnabled = query({
  args: {},
  handler: async () => {
    return process.env.REQUIRE_EMAIL_VERIFICATION === "true";
  },
});

// Internal action to send email
export const sendEmailInternal = internalAction({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log(`No RESEND_API_KEY - Verification code for ${args.email}: ${args.code}`);
      return;
    }
    
    const resend = new Resend(resendApiKey);
    
    try {
      const { data, error } = await resend.emails.send({
        from: "Streamo <noreply@verification.andoks.cc>",
        to: [args.email],
        subject: "Your Streamo Verification Code",
        html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f6f8;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f6f8; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                        <tr>
                          <td style="background: linear-gradient(135deg, #4D7CFF 0%, #6B8FFF 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Streamo</h1>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #111111; font-size: 24px; font-weight: bold;">Verify Your Email</h2>
                            <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                              Thanks for signing up! Please use the verification code below to complete your registration:
                            </p>
                            <div style="background-color: #f5f6f8; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                              <div style="font-size: 14px; color: #666666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                              <div style="font-size: 48px; font-weight: bold; color: #4D7CFF; letter-spacing: 8px; font-family: 'Courier New', monospace;">${args.code}</div>
                            </div>
                            <p style="margin: 24px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                              This code will expire in <strong>15 minutes</strong>. If you didn't request this code, you can safely ignore this email.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="background-color: #f5f6f8; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                              © ${new Date().getFullYear()} Streamo. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
            </html>
          `,
      });

      if (error) {
        console.error("Failed to send email:", error);
        console.log(`Verification code for ${args.email}: ${args.code}`);
      } else {
        console.log(`Email sent successfully to ${args.email}`, data);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      console.log(`Verification code for ${args.email}: ${args.code}`);
    }
  },
});

// Internal mutation to store verification code
export const storeVerificationCode = internalMutation({
  args: {
    email: v.string(),
    code: v.string(),
    expiresAt: v.number(),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Delete any existing codes for this email
    const existing = await ctx.db
      .query("verificationCodes")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();
    
    for (const item of existing) {
      await ctx.db.delete(item._id);
    }

    // Store new code with pending registration data
    await ctx.db.insert("verificationCodes", {
      email: args.email,
      code: args.code,
      expiresAt: args.expiresAt,
      used: false,
      pendingRegistration: args.name && args.password ? {
        name: args.name,
        password: args.password,
      } : undefined,
    });
  },
});

// Action to send email via Resend (must be exported as regular action)
export const sendEmail = action({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log(`No RESEND_API_KEY - Verification code for ${args.email}: ${args.code}`);
      return;
    }

    const resend = new Resend(resendApiKey);

    try {
      const { data, error } = await resend.emails.send({
        from: "Streamo <noreply@verification.andoks.cc>",
        to: [args.email],
        subject: "Your Streamo Verification Code",
        html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f6f8; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                          <!-- Header -->
                          <tr>
                            <td style="background: linear-gradient(135deg, #4D7CFF 0%, #6B8FFF 100%); padding: 40px 40px 30px; text-align: center;">
                              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">Streamo</h1>
                            </td>
                          </tr>
                          
                          <!-- Content -->
                          <tr>
                            <td style="padding: 40px;">
                              <h2 style="margin: 0 0 16px; color: #111111; font-size: 24px; font-weight: bold;">Verify Your Email</h2>
                              <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                                Thanks for signing up! Please use the verification code below to complete your registration:
                              </p>
                              
                              <!-- Verification Code -->
                              <div style="background-color: #f5f6f8; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                                <div style="font-size: 14px; color: #666666; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</div>
                                <div style="font-size: 48px; font-weight: bold; color: #4D7CFF; letter-spacing: 8px; font-family: 'Courier New', monospace;">${args.code}</div>
                              </div>
                              
                              <p style="margin: 24px 0 0; color: #666666; font-size: 14px; line-height: 1.5;">
                                This code will expire in <strong>15 minutes</strong>. If you didn't request this code, you can safely ignore this email.
                              </p>
                            </td>
                          </tr>
                          
                          <!-- Footer -->
                          <tr>
                            <td style="background-color: #f5f6f8; padding: 24px 40px; text-align: center;">
                              <p style="margin: 0; color: #999999; font-size: 12px;">
                                © ${new Date().getFullYear()} Streamo. All rights reserved.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
      });

      if (error) {
        console.error("Failed to send email:", error);
        console.log(`Verification code for ${args.email}: ${args.code}`);
      } else {
        console.log(`Email sent successfully to ${args.email}`, data);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      console.log(`Verification code for ${args.email}: ${args.code}`);
    }
  },
});

// Send verification code with pending registration data
export const sendVerificationCode = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    password: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const verificationEnabled = process.env.REQUIRE_EMAIL_VERIFICATION === "true";
    
    if (!verificationEnabled) {
      return { success: true, code: "000000", verificationDisabled: true };
    }

    const code = generateCode();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store the code in database
    await ctx.scheduler.runAfter(0, internal.verification.storeVerificationCode, {
      email: args.email,
      code,
      expiresAt,
      name: args.name,
      password: args.password,
    });

    // Trigger email sending in background (fire and forget)
    ctx.scheduler.runAfter(0, internal.verification.sendEmailInternal, {
      email: args.email,
      code,
    });
    
    // Return code only in dev mode for testing
    const isDevMode = process.env.DEV_MODE === "true";
    return { 
      success: true, 
      code: isDevMode ? code : undefined 
    };
  },
});

// Verify code and complete registration if pending
export const verifyCodeAndRegister = mutation({
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

    // If there's pending registration data, return it so the frontend can complete registration
    if (verification.pendingRegistration) {
      return { 
        success: true, 
        pendingRegistration: verification.pendingRegistration 
      };
    }

    // Otherwise, just mark existing user as verified
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

// Legacy verify code (for backward compatibility)
export const verifyCode = verifyCodeAndRegister;

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
