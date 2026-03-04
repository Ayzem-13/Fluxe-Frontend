import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { fetchNotifications } from "@/domains/notifications/slice";

const POLLING_INTERVAL = 5000; 

export function useNotificationPolling() {
  const dispatch = useDispatch<AppDispatch>();
  const { hasFetched } = useSelector((state: RootState) => state.notifications);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {

    if (!hasFetched) {
      dispatch(fetchNotifications());
    }
    pollingRef.current = setInterval(() => {
      dispatch(fetchNotifications());
    }, POLLING_INTERVAL);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [dispatch, hasFetched]);
}
