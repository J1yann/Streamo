import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function AuthButton() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, isLoading, currentUser });
  }, [isAuthenticated, isLoading, currentUser]);

  if (isLoading) {
    return (
      <button className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 cursor-not-allowed">
        <User size={20} />
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <button
        onClick={() => void signOut()}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
        title={currentUser?.email || "Sign Out"}
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    );
  }

  return (
    <Link
      to="/signin"
      className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#4D7CFF] hover:bg-[#3D6CEF] text-white transition-colors font-medium"
    >
      <LogIn size={18} />
      <span className="hidden sm:inline">Sign In</span>
    </Link>
  );
}
