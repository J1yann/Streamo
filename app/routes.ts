import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("home", "routes/home.tsx"),
  route("movies", "routes/movies.tsx"),
  route("tvshows", "routes/tvshows.tsx"),
  route("kids", "routes/kids.tsx"),
  route("search", "routes/search.tsx"),
  route("watch/:id", "routes/watch.$id.tsx"),
] satisfies RouteConfig;
