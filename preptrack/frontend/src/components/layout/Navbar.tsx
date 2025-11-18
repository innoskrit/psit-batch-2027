import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { findAllTracks } from "@/apis/apis";
import type { Track } from "@/types/type";
import { toast } from "sonner";
import { ThemeToggle } from "../theme-toggle";

export default function Navbar() {
  const { isAuthenticated, userSession, logout } = useAuth();
  const [tracks, setTracks] = useState<Track[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const findTracks = async () => {
      try {
        const response = await findAllTracks();
        const tracksData = response?.data;
        if (Array.isArray(tracksData)) {
          setTracks(tracksData);
        }
      } catch (error) {
        // ignore for now; could show toast/log if needed
      }
    };

    findTracks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-900 text-white">
              P
            </div>
            <span className="text-base font-semibold tracking-tight">
              Preptrack
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Home
            </NavLink>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-gray-600 hover:text-gray-900">
                Tracks
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Choose a track</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tracks.length > 0 ? (
                  tracks.map((track) => (
                    <DropdownMenuItem key={track.id} asChild>
                      <Link to={`/tracks/${track.slug}`}>{track.name}</Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No tracks available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {!isAuthenticated ? (
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full">
                <Avatar>
                  <AvatarImage src={""} alt={userSession?.name || "User"} />
                  <AvatarFallback>
                    {userSession?.name?.slice(0, 2)?.toUpperCase() || "PR"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">
                  Signed in as {userSession?.email || "user"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
