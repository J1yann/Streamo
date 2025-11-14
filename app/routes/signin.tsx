import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useState, type FormEvent, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export async function loader() {
  return null;
}

export default function SignInPage() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = {
        email,
        password,
        flow: isSignUp ? "signUp" : "signIn",
      } as any;

      if (isSignUp && name) {
        formData.name = name;
      }

      await signIn("password", formData);
      navigate("/home");
    } catch (err) {
      console.error("Auth error:", err);
      
      // Provide user-friendly error messages
      let errorMessage = "Authentication failed. Please try again.";
      
      if (err instanceof Error) {
        const errMsg = err.message.toLowerCase();
        
        if (errMsg.includes("index") && errMsg.includes("not found")) {
          errorMessage = "Authentication system is being set up. Please wait a moment and try again.";
        } else if (errMsg.includes("invalid") || errMsg.includes("credentials")) {
          errorMessage = isSignUp 
            ? "Unable to create account. Please check your information."
            : "Invalid email or password. Please try again.";
        } else if (errMsg.includes("already exists") || errMsg.includes("duplicate")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (errMsg.includes("network") || errMsg.includes("connection")) {
          errorMessage = "Connection error. Please check your internet and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F8] dark:bg-[#0B0D13] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4D7CFF] mb-2">Streamo</h1>
          <p className="text-black/70 dark:text-white/70">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        <div className="bg-white dark:bg-[#1A1D29] rounded-2xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]"
                  required={isSignUp}
                  placeholder="Enter your name"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]"
                required
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4D7CFF]"
                required
                minLength={8}
                placeholder="Enter your password"
              />
              {isSignUp && (
                <p className="text-xs text-black/50 dark:text-white/50 mt-1">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#4D7CFF] hover:bg-[#3D6CEF] text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-sm text-[#4D7CFF] hover:underline"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
          >
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
