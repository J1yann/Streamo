import { motion } from "framer-motion";
import { Link } from "react-router";
import { getImageUrl, getTitle, getYear, type Media } from "~/lib/tmdb";

interface MediaCardProps {
  media: Media;
  index?: number;
}

export function MediaCard({ media, index = 0 }: MediaCardProps) {
  const title = getTitle(media);
  const year = getYear(media);
  const mediaType = media.media_type || (media.title ? "movie" : "tv");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      className="group gpu-accelerated"
    >
      <Link to={`/watch/${media.id}?type=${mediaType}`} className="block">
        <div className="relative aspect-2/3 rounded-xl overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.6)] group-hover:shadow-[0px_8px_32px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0px_10px_40px_rgba(0,0,0,0.8)] transition-shadow duration-200">
          <img
            src={getImageUrl(media.poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-105 will-change-transform"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 text-xs text-white/90">
                <span className="px-2 py-1 bg-[#4D7CFF] rounded-full font-medium flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                  </svg>
                  {media.vote_average.toFixed(1)}
                </span>
                {year && <span>{year}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 px-1">
          <h3 className="font-semibold text-sm line-clamp-1 text-[#111111] dark:text-white">
            {title}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}
