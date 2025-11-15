import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router";
import {
  siNetflix,
  siAppletv,
  siHbo,
  siParamountplus,
} from "simple-icons";

const providers = [
  { id: "netflix", name: "NETFLIX", icon: siNetflix, color: "#E50914" },
  { id: "prime", name: "prime video", icon: null, color: "#00A8E1" },
  { id: "hulu", name: "hulu", icon: null, color: "#1CE783" },
  { id: "hbo", name: "HBO MAX", icon: siHbo, color: "#000000" },
  { id: "disneyplus", name: "Disney+", icon: null, color: "#113CCF" },
  { id: "paramount", name: "Paramount+", icon: siParamountplus, color: "#0064FF" },
  { id: "peacock", name: "peacock", icon: null, color: "#000000" },
  { id: "appletv", name: "tv+", icon: siAppletv, color: "#000000" },
  { id: "shudder", name: "SHUDDER", icon: null, color: "#FF0000" },
];

export default function StreamingProviders() {
  const [activeTab, setActiveTab] = useState<"movies" | "tvshows">("movies");

  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#4D7CFF]"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] dark:text-white">
              Streaming Providers
            </h1>
          </div>
          <p className="text-black/70 dark:text-white/70">
            Browse content from your favorite streaming services
          </p>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          <button
            onClick={() => setActiveTab("movies")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === "movies"
                ? "bg-[#4D7CFF] text-white shadow-lg"
                : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setActiveTab("tvshows")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              activeTab === "tvshows"
                ? "bg-[#4D7CFF] text-white shadow-lg"
                : "bg-white dark:bg-[#14171F] text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            TV Shows
          </button>
        </motion.div>

        {/* Providers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/providers/${provider.id}?type=${activeTab === "movies" ? "movie" : "tv"}`}
                className="block group"
              >
                <div className="aspect-3/2 rounded-2xl bg-white dark:bg-[#14171F] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.6)] hover:shadow-[0px_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0px_8px_24px_rgba(0,0,0,0.8)] transition-all duration-300 flex items-center justify-center p-6 group-hover:scale-105">
                  {provider.icon ? (
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full max-w-[120px] max-h-[60px]"
                      style={{
                        fill: `#${provider.icon.hex}`,
                      }}
                    >
                      <path d={provider.icon.path} />
                    </svg>
                  ) : (
                    <span 
                      className="text-xl md:text-2xl font-bold"
                      style={{ color: provider.color }}
                    >
                      {provider.name}
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
