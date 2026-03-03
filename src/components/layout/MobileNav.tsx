import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RootState } from "@/app/store";

export function MobileNav() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-background px-4 py-3">
      <NavLink
        to="/home"
        aria-label="Accueil"
        className={({ isActive }) =>
          cn(
            "flex items-center justify-center px-6 py-1 rounded-xl transition-colors",
            isActive ? "text-foreground" : "text-muted-foreground"
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
            isActive ? "text-foreground" : "text-muted-foreground"
          )
        }
      >
        {({ isActive }) => (
          <User className="size-6" strokeWidth={isActive ? 2.5 : 1.75} />
        )}
      </NavLink>
    </nav>
  );
}
