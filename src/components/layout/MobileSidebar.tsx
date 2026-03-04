import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Home, User, Bell, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import type { RootState, AppDispatch } from "@/app/store";
import { logout } from "@/domains/auth/slice";

export function MobileSidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 shrink-0">
          <Avatar className="size-10 ring-1 ring-border/20">
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.username} />
            <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-xs">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[80vw] sm:w-80 p-0 flex flex-col pt-12"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Menu</SheetTitle>

        <div className="px-6 pb-6 border-b border-border/50">
          <Avatar className="size-14 ring-2 ring-border mb-3">
            <AvatarImage src={user?.avatar ?? undefined} alt={user?.username} />
            <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold text-sm">
              {user?.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="font-bold text-lg">{user?.username}</div>
          <div className="text-muted-foreground">@{user?.username}</div>
        </div>

        <div className="flex-1 py-4 flex flex-col gap-1">
          <SheetClose asChild>
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-4 px-6 py-4 text-xl font-bold hover:bg-accent transition-colors text-left"
            >
              <Home className="size-6" />
              Accueil
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              onClick={() => user && navigate(`/profile/${user.id}`)}
              className="flex items-center gap-4 px-6 py-4 text-xl font-bold hover:bg-accent transition-colors text-left"
            >
              <User className="size-6" />
              Profil
            </button>
          </SheetClose>

          <SheetClose asChild>
            <button
              onClick={() => navigate("/notifications")}
              className="flex items-center gap-4 px-6 py-4 text-xl font-bold hover:bg-accent transition-colors text-left"
            >
              <Bell className="size-6" />
              Notifications
            </button>
          </SheetClose>
        </div>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/login");
            }}
            className="w-full font-bold flex items-center justify-center gap-2 py-3 rounded-full text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="size-5" />
            Se déconnecter
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
