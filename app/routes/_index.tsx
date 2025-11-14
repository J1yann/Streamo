import { motion } from "framer-motion";
import { Link } from "react-router";
import { Hero } from "~/components/Hero";
import { Icon } from "~/components/Icon";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#F5F6F8] dark:bg-[#0B0D13]">
      <Hero
        title="Stream Unlimited Entertainment"
        description="Discover thousands of movies, TV shows, and exclusive content. Watch anywhere, anytime."
        backgroundImage="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80"
        ctaText="Get Started"
        ctaLink="/home"
      />

      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#111111] dark:text-white">
            Why Choose Streamo?
          </h2>
          <p className="text-lg text-black/70 dark:text-white/70 max-w-2xl mx-auto">
            Experience cinema-quality streaming with our curated collection
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#14171F] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_16px_rgba(0,0,0,0.6)]"
            >
              <div className="mb-4">
                <Icon name={feature.icon} size={48} className="text-[#4D7CFF]" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#111111] dark:text-white">
                {feature.title}
              </h3>
              <p className="text-black/70 dark:text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 px-6 rounded-3xl bg-linear-to-r from-[#4D7CFF] to-[#8AA3FF]"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Watching?
          </h2>
          <p className="text-white/90 mb-6 text-lg">
            Join a community of viewers streaming their favorite content
          </p>
          <Link
            to="/home"
            className="inline-block px-8 py-4 bg-white text-[#4D7CFF] rounded-full font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            Browse Content
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: "library",
    title: "Vast Library",
    description: "Access thousands of movies and TV shows across all genres",
  },
  {
    icon: "bolt",
    title: "Lightning Fast",
    description: "Optimized streaming with minimal buffering and instant playback",
  },
  {
    icon: "device",
    title: "Watch Anywhere",
    description: "Seamless experience across all your devices",
  },
];
