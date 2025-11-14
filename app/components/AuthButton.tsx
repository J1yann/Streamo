import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { LogIn, User, Bookmark, History, LogOut } from "lucide-react";
import { Link } from "react-router";
import { api } from "../../convex/_generated/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function AuthButton() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const currentUser = useQuery(api.users.getCurrentUser);

  if (isLoading) {
    return (
      <button className="p-2 rounded-full bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50 cursor-not-allowed">
        <User size={20} />
      </button>
    );
  }

  if (isAuthenticated) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger 
          onClick={(e) => e.preventDefault()}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-black dark:text-white border-none outline-none cursor-pointer"
        >
          <User size={20} />
          <span className="hidden sm:inline text-sm font-medium">
            {currentUser?.email?.split("@")[0] || "Account"}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          sideOffset={8}
          className="bg-white dark:bg-[#1F2937] border-gray-200 dark:border-gray-700 w-[200px] max-w-[calc(100vw-2rem)]"
        >
          <div className="px-3 py-2 text-sm text-black/70 dark:text-white/70">
            {currentUser?.email}
          </div>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem asChild>
            <Link
              to="/watchlist"
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white"
            >
              <Bookmark size={18} />
              <span>My Watchlist</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/history"
              className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 text-black dark:text-white"
            >
              <History size={18} />
              <span>Watch History</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
          <DropdownMenuItem
            onClick={() => void signOut()}
            className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 text-red-600 dark:text-red-400"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
