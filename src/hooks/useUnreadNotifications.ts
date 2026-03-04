import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";

export function useUnreadNotifications() {
  const { items } = useSelector((state: RootState) => state.notifications);
  return items.filter((n) => !n.read).length;
}
