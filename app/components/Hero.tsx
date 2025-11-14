import { motion } from "framer-motion";
import { Link } from "react-router";

interface HeroProps {
  title: string;
  description: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function Hero({ title, description, backgroundImage, ctaText = "Explore Now", ctaLink = "/home" }: HeroProps) {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      )}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex gap-4"
          >
            <Link
              to={ctaLink}
              className="px-6 py-3 bg-[#4D7CFF] text-white rounded-full font-semibold hover:bg-[#3D6CEF] transition-colors shadow-lg"
            >
              {ctaText}
            </Link>
            <Link
              to="/movies"
              className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Movies
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
