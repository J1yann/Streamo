import { createPagesFunctionHandler } from "@react-router/cloudflare";
// @ts-ignore - this file may not exist yet
import * as build from "../build/server/index.js";

export const onRequest = createPagesFunctionHandler({
  build,
  mode: "production",
});
