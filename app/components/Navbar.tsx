import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "~/lib/theme-context";
import { Icon } from "./Icon";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { AuthButton } from "./AuthButton";

const navItems = [
  { path: "/home", label: "Home", icon: "home" },
  { path: "/movies", label: "Movies", icon: "movie" },
  { path: "/tvshows", label: "TV Shows", icon: "tv" },
  { path: "/kids", label: "Kids", icon: "teddy" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 h-16 backdrop-blur-xl bg-white/70 dark:bg-[#14171F]/70 border-b border-black/10 dark:border-white/8"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-2xl font-bold text-[#4D7CFF]">
              Streamo
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 text-sm font-medium transition-colors"
                >
                  <span className={isActive ? "text-[#4D7CFF]" : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white"}>
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#4D7CFF]/10 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle theme"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {theme === "light" ? (
                  <>
                    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                  </>
                ) : (
                  <>
                    <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                  </>
                )}
              </svg>
            </button>
            <AuthButton />
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white dark:bg-[#14171F] border-r border-black/10 dark:border-white/8 z-50 md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/8">
                <span className="text-2xl font-bold text-[#4D7CFF]">Streamo</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="p-4 space-y-2">
                <Link
                  to="/search"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === "/search"
                      ? "bg-[#4D7CFF]/10 text-[#4D7CFF]"
                      : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <Search size={20} />
                  <span className="font-medium">Search</span>
                </Link>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#4D7CFF]/10 text-[#4D7CFF]"
                          : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <Icon name={item.icon} size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
