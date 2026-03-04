import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Home,User,Feather,Bell,LogOut,MoreHorizontal,} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FluxeLogo } from "@/components/FluxeLogo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {DropdownMenu,DropdownMenuTrigger,DropdownMenuContent,DropdownMenuItem,} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { RootState, AppDispatch } from "@/app/store";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { logout } from "@/domains/auth/slice";
import { useUnreadNotifications } from "@/hooks/useUnreadNotifications";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DesktopSidebarProps {
  onCompose: () => void;
}

export function DesktopSidebar({ onCompose }: DesktopSidebarProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const width = useWindowWidth();
  const navigate = useNavigate();
  const unreadCount = useUnreadNotifications();
  const prefersReducedMotion = useReducedMotion();
  const dispatch = useDispatch<AppDispatch>();

  const mode: "full" | "compact" | "hidden" =
    width >= 1280 ? "full" : width >= 768 ? "compact" : "hidden";

  if (mode === "hidden") return null;

  const isFull = mode === "full";

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isFull ? 275 : 68,
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }
      }
      className="flex flex-col shrink-0 h-screen border-r border-border bg-background text-foreground overflow-hidden overflow-y-auto"
    >
      {/* Logo */}
      <div className={cn("py-6", isFull ? "px-6" : "px-3 flex justify-center")}>
        <NavLink to="/home" className="flex items-center gap-2.5 w-fit">
          <FluxeLogo className="size-8 shrink-0" />
          <AnimatePresence initial={false}>
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
      <nav
        className={cn("flex-1 flex flex-col gap-0.5", isFull ? "px-3" : "px-2")}
      >
        <NavLink
          to="/home"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg transition-colors",
              isFull
                ? "gap-4 px-3 py-3 text-[17px] font-medium"
                : "justify-center p-3",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Home
                className={cn("shrink-0", isFull ? "size-6" : "size-[1.65rem]")}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <AnimatePresence initial={false}>
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
              isFull
                ? "gap-4 px-3 py-3 text-[17px] font-medium"
                : "justify-center p-3",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )
          }
        >
          {({ isActive }) => (
            <>
              <User
                className={cn("shrink-0", isFull ? "size-6" : "size-[1.65rem]")}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <AnimatePresence initial={false}>
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

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-lg transition-colors relative",
              isFull
                ? "gap-4 px-3 py-3 text-[17px] font-medium"
                : "justify-center p-3",
              isActive
                ? "text-foreground bg-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative flex items-center justify-center shrink-0">
                <Bell
                  className={cn(
                    "shrink-0",
                    isFull ? "size-6" : "size-[1.65rem]",
                  )}
                  strokeWidth={isActive ? 2.5 : 1.75}
                />
                {unreadCount > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 bg-sky-500 rounded-full size-4.5 flex items-center justify-center border-2 border-background">
                    <span className="text-white text-[10px] font-bold leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  </div>
                )}
              </div>
              <AnimatePresence initial={false}>
                {isFull && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    Notifications
                  </motion.span>
                )}
              </AnimatePresence>
            </>
          )}
        </NavLink>
      </nav>

      {/* Bottom */}
      <div
        className={cn(
          "pb-5 flex flex-col gap-3",
          isFull ? "px-4" : "px-2 items-center",
        )}
      >
        {isFull ? (
          <Button
            onClick={onCompose}
            className="rounded-lg w-full font-semibold h-10"
          >
            Poster
          </Button>
        ) : (
          <button
            onClick={onCompose}
            aria-label="Poster"
            className="size-10 rounded-full bg-sky-500 hover:bg-sky-400 active:scale-95 flex items-center justify-center transition-colors"
          >
            <Feather className="size-4 text-white" />
          </button>
        )}

        {/* User card avec dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex items-center rounded-lg hover:bg-accent/60 transition-colors w-full text-left group",
                isFull ? "gap-3 px-3 py-2" : "justify-center p-1.5",
              )}
            >
              <Avatar className="size-8 shrink-0">
                <AvatarImage
                  src={user?.avatar ?? undefined}
                  alt={user?.username}
                />
                <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-xs">
                  {user?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <AnimatePresence initial={false}>
                {isFull && user && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex flex-col min-w-0 overflow-hidden flex-1"
                  >
                    <span className="text-sm font-semibold truncate leading-tight">
                      {user.username}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      @{user.username}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {isFull && (
                <MoreHorizontal className="size-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={isFull ? "start" : "end"}
            side={isFull ? "top" : "right"}
            className="w-48"
            sideOffset={isFull ? 8 : 16}
          >
            <DropdownMenuItem
              onClick={() => user && navigate(`/profile/${user.id}`)}
            >
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <LogOut className="size-4" />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.aside>
  );
}
