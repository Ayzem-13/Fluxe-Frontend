import { Heart, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { markNotificationAsRead } from "@/domains/notifications/slice";
import type { AppDispatch } from "@/app/store";
import type { Notification } from "@/domains/notifications/types";
import { cn } from "@/lib/utils";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({ notification }: NotificationCardProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = () => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }

    if (notification.type === "FOLLOW") {
      navigate(`/profile/${notification.fromUserId}`);
    } else if (notification.tweet) {
      navigate(`/tweet/${notification.tweet.id}`);
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000);

    if (diffInSeconds < 60) return "À l'instant";
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;

    return notifDate.toLocaleDateString("fr-FR");
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left px-4 py-4 border-b border-border transition-all duration-200 hover:bg-accent/50 active:bg-accent/30",
        !notification.read && "bg-accent/15"
      )}
    >
      <div className="flex gap-4 items-start">
        {/* Avatar with icon badge */}
        <div className="relative shrink-0">
          <Avatar className="size-12 ring-2 ring-border">
            <AvatarImage src={notification.fromUser.avatar ?? undefined} alt={notification.fromUser.username} />
            <AvatarFallback className="bg-sky-500/15 text-sky-500 font-bold">
              {notification.fromUser.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-sky-500 border-2 border-background flex items-center justify-center shadow-md">
            {notification.type === "FOLLOW" ? (
              <UserPlus className="size-3 text-white" strokeWidth={2.5} />
            ) : (
              <Heart className="size-3 text-white fill-white" strokeWidth={2.5} />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">
                {notification.fromUser.username}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {notification.type === "FOLLOW" ? "vous suit maintenant" : "a aimé votre tweet"}
              </p>
            </div>

            {!notification.read && (
              <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-sky-500 mt-1" />
            )}
          </div>

          {notification.tweet && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              "{notification.tweet.content}"
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {formatDate(notification.createdAt)}
          </p>
        </div>
      </div>
    </button>
  );
}
