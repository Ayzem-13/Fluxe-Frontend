import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, User, Feather } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxeLogo } from "@/components/FluxeLogo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { RootState } from "@/app/store";
import { useWindowWidth } from "@/hooks/useWindowWidth";

interface DesktopSidebarProps {
  onCompose: () => void;
}

export function DesktopSidebar({ onCompose }: DesktopSidebarProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const width = useWindowWidth();
  const navigate = useNavigate();

  const mode: "full" | "compact" | "hidden" =
    width >= 1024 ? "full" : width >= 768 ? "compact" : "hidden";

  if (mode === "hidden") return null;

  const isFull = mode === "full";

  return (
    <motion.aside
      animate={{ width: isFull ? 256 : 64 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex flex-col fixed inset-y-0 left-0 border-r border-border bg-background text-foreground z-20 overflow-hidden"
    >
      {/* Logo */}
      <div className={cn("py-6", isFull ? "px-6" : "px-3 flex justify-center")}>
        <NavLink to="/home" className="flex items-center gap-2.5 w-fit">
          <FluxeLogo className="size-8 shrink-0" />
          <AnimatePresence>
            {isFull && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-xl font-bold tracking-tight overflow-hidden whitespace-nowrap"
              >
                Fluxe
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>
      </div>

      {/* Nav */}
      <nav className={cn("flex-1 flex flex-col gap-0.5", isFull ? "px-3" : "px-2")}>
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg transition-colors",
              isFull ? "gap-3 px-3 py-2.5 text-[15px] font-medium" : "justify-center p-3",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Home className="size-4.5 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
              <AnimatePresence>
                {isFull && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Accueil
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>

        <NavLink
          to={user ? `/profile/${user.id}` : "/home"}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg transition-colors",
              isFull ? "gap-3 px-3 py-2.5 text-[15px] font-medium" : "justify-center p-3",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
            )
          }
        >
          {({ isActive }) => (
            <>
              <User className="size-4.5 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
              <AnimatePresence>
                {isFull && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Profil
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      </nav>

      {/* Bottom */}
      <div className={cn("pb-5 flex flex-col gap-3", isFull ? "px-4" : "px-2 items-center")}>
        {isFull ? (
          <Button onClick={onCompose} className="rounded-lg w-full font-semibold h-10">
            Poster
          </Button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCompose}
            aria-label="Poster"
            className="size-10 rounded-full bg-sky-500 hover:bg-sky-400 flex items-center justify-center transition-colors"
          >
            <Feather className="size-4 text-white" />
          </motion.button>
        )}

        {/* User card → cliquable vers le profil */}
        <button
          onClick={() => user && navigate(`/profile/${user.id}`)}
          className={cn(
            "flex items-center rounded-lg hover:bg-accent/60 transition-colors w-full text-left",
            isFull ? "gap-3 px-3 py-2" : "justify-center p-1.5"
          )}
        >
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.username} />
            <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-xs">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <AnimatePresence>
            {isFull && user && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col min-w-0 overflow-hidden"
              >
                <span className="text-sm font-semibold truncate leading-tight">{user.username}</span>
                <span className="text-xs text-muted-foreground truncate">@{user.username}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
