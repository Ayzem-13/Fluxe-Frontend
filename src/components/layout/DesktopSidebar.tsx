import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, User } from "lucide-react";
import { FluxeLogo } from "@/components/FluxeLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { RootState } from "@/app/store";

export function DesktopSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-64 border-r border-border bg-background text-foreground z-20">
      <div className="px-6 py-6">
        <NavLink to="/home" className="flex items-center gap-2.5 w-fit">
          <FluxeLogo className="size-8" />
          <span className="text-xl font-bold tracking-tight">Fluxe</span>
        </NavLink>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 px-3">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Home className="size-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
              <span>Accueil</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] font-medium transition-colors",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )
          }
        >
          {({ isActive }) => (
            <>
              <User className="size-[18px] shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
              <span>Profil</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="px-4 pb-5 flex flex-col gap-3">
        <Button className="rounded-lg w-full font-semibold h-10">
          Poster
        </Button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/60 transition-colors cursor-pointer">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0">
            <User className="size-4 text-muted-foreground" />
          </div>
          {user && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate">{user.username}</span>
              <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
