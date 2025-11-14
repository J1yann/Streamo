import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { SignInDialog } from "./SignInDialog";

export function AuthButton() {
  try {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const [showSignIn, setShowSignIn] = useState(false);

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
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowSignIn(true)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-[#4D7CFF] hover:bg-[#3D6CEF] text-white transition-colors"
      >
        <LogIn size={18} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
      <SignInDialog open={showSignIn} onClose={() => setShowSignIn(false)} />
    </>
    );
  } catch (error) {
    console.error("AuthButton error:", error);
    return (
      <button className="px-3 py-2 rounded-full bg-red-500 text-white text-xs">
        Auth Error
      </button>
    );
  }
}
