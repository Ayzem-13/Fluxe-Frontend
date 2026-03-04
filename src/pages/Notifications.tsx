import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { AppDispatch, RootState } from "@/app/store";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/domains/notifications/slice";
import { NotificationCard } from "@/domains/notifications/components/NotificationCard";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Notifications() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, isLoading, hasFetched } = useSelector(
    (state: RootState) => state.notifications,
  );

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchNotifications());
    } else {
      items.forEach((notification) => {
        if (!notification.read) {
          dispatch(markNotificationAsRead(notification.id));
        }
      });
    }
  }, [dispatch, hasFetched, items]);

  return (
    <AppLayout>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-4 h-13.25 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <div className="flex-1">
          <p className="font-bold text-[15px] leading-tight">Notifications</p>
        </div>
      </div>

      <div className="flex flex-col">
        {isLoading && !hasFetched ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-4 py-4 flex gap-4">
              <Skeleton className="size-12 rounded-full shrink-0" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-4 gap-4">
            <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center mb-2">
              <Bell className="size-10 text-muted-foreground/40" />
            </div>
            <div className="text-center space-y-2 max-w-70">
              <p className="font-bold text-xl text-foreground">
                Aucune notification
              </p>
              <p className="text-[15px] text-muted-foreground leading-snug">
                Restez à l'affût, vos notifications apparaîtront ici.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationCard notification={notification} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </AppLayout>
  );
}
