import { useConvexAuth } from "convex/react";
import { motion } from "framer-motion";
import { Bookmark, History, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export function SignInBanner() {
  const { isAuthenticated } = useConvexAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isAuthenticated || dismissed) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative bg-linear-to-r from-[#4D7CFF] to-[#6B8FFF] text-white rounded-2xl p-6 mb-8 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>

      <div className="relative">
        <div className="flex items-start gap-4">
          <div className="shrink-0 p-3 bg-white/20 rounded-full">
            <Sparkles size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              Unlock Your Personal Streaming Experience
            </h3>
            <p className="text-white/90 mb-4">
              Sign in to access exclusive features and personalize your viewing
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <div className="flex items-center gap-2">
                <Bookmark size={18} className="shrink-0" />
                <span className="text-sm">Save movies & shows to your watchlist</span>
              </div>
              <div className="flex items-center gap-2">
                <History size={18} className="shrink-0" />
                <span className="text-sm">Track your watch history</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/signin"
                className="px-6 py-2.5 bg-white text-[#4D7CFF] rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                Sign In
              </Link>
              <Link
                to="/signin"
                className="px-6 py-2.5 bg-white/20 backdrop-blur text-white rounded-full font-semibold hover:bg-white/30 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
