import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "./useTheme";
import LogoutButton from "./LogoutButton";
import { Bell, Moon, Sun, User } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function AppHeader({ isAuthenticated, user }) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold hover:text-primary">
          ChatLingo
        </Link>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
            }
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                variant={"ghost"}
                size="icon"
                nativeButton={false}
                render={<NavLink to="/notifications" />}
                aria-label="Notifications"
              >
                <Bell />
              </Button>
              <Avatar className="size-8">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name ?? "User avatar"}
                />
                <AvatarFallback>
                  {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <LogoutButton />
            </>
          ) : (
            <Button
              variant={pathname === "/login" ? "default" : "ghost"}
              nativeButton={false}
              render={<NavLink to="/login" />}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
