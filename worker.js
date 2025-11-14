import { createRequestHandler } from "@react-router/cloudflare";
import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import * as build from "./build/server/index.js";

const handleRequest = createRequestHandler({
  build,
  mode: "production",
});

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Try to serve static assets first
      if (url.pathname.startsWith("/assets/") || 
          url.pathname === "/favicon.ico" || 
          url.pathname === "/placeholder.jpg" ||
          url.pathname.endsWith(".css") ||
          url.pathname.endsWith(".js") ||
          url.pathname.endsWith(".jpg") ||
          url.pathname.endsWith(".png") ||
          url.pathname.endsWith(".svg")) {
        try {
          const assetResponse = await getAssetFromKV(
            {
              request,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
            }
          );
          // Add cache headers
          const response = new Response(assetResponse.body, assetResponse);
          response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
          return response;
        } catch (e) {
          console.error("Asset error for " + url.pathname + ":", e.message);
          // Return 404 for missing assets instead of falling through to SSR
          return new Response("Asset not found", { status: 404 });
        }
      }

      // Handle SSR for all other routes
      return await handleRequest({
        request,
        env,
        ctx,
        waitUntil: ctx.waitUntil.bind(ctx),
        passThroughOnException: ctx.passThroughOnException.bind(ctx),
      });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response("Internal Server Error: " + error.message + "\n" + error.stack, { status: 500 });
    }
  },
};
