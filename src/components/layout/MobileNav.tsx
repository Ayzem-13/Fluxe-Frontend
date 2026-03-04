import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, User, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RootState } from "@/app/store";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";

export function MobileNav() {
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadCount = useUnreadNotifications();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-4 py-3">
      <NavLink
        to="/home"
        aria-label="Accueil"
        className={({ isActive }) =>
          cn(
            "flex items-center justify-center px-6 py-1 rounded-xl transition-colors",
            isActive ? "text-foreground" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <Home className="size-6" strokeWidth={isActive ? 2.5 : 1.75} />
        )}
      </NavLink>

      <NavLink
        to={user ? `/profile/${user.id}` : "/home"}
        aria-label="Profil"
        className={({ isActive }) =>
          cn(
            "flex items-center justify-center px-6 py-1 rounded-xl transition-colors",
            isActive ? "text-foreground" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <User className="size-6" strokeWidth={isActive ? 2.5 : 1.75} />
        )}
      </NavLink>

      <NavLink
        to="/notifications"
        aria-label="Notifications"
        className={({ isActive }) =>
          cn(
            "flex items-center justify-center px-6 py-1 rounded-xl transition-colors relative",
            isActive ? "text-foreground" : "text-muted-foreground",
          )
        }
      >
        {({ isActive }) => (
          <div className="relative flex items-center justify-center">
            <Bell className="size-6" strokeWidth={isActive ? 2.5 : 1.75} />
            {unreadCount > 0 && (
              <div className="absolute -top-1.5 -right-1.5 bg-sky-500 rounded-full size-4.5 flex items-center justify-center border-2 border-background">
                <span className="text-white text-[10px] font-bold leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </div>
            )}
          </div>
        )}
      </NavLink>
    </nav>
  );
}
