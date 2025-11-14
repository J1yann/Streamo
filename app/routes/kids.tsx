import { useLoaderData } from "react-router";
import type { Route } from "./+types/kids";
import { MediaCard } from "~/components/MediaCard";
import { tmdb, type Media } from "~/lib/tmdb";
import { motion } from "framer-motion";

export async function loader() {
  try {
    const data = await tmdb.getKidsContent();
    return { content: data.results || [] };
  } catch (error) {
    console.error("Failed to fetch kids content:", error);
    return { content: [] };
  }
}

export default function Kids({ loaderData }: Route.ComponentProps) {
  const { content } = loaderData as { content: Media[] };

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13] pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white mb-2">
            Kids & Family
          </h1>
          <p className="text-black/70 dark:text-white/70">
            Safe, age-appropriate content for the whole family
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {content.map((item, index) => (
            <MediaCard key={item.id} media={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
