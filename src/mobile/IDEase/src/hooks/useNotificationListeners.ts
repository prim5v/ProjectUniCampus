import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export function useNotificationListeners() {
  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data;

          if (data?.type === "payment") {
            router.push("/wallet");
            return;
          }

          if (data?.type === "access") {
            router.push("/activity");
            return;
          }

        //   if (data?.type === "announcement") {
        //     router.push("/announcements");
        //     return;
        //   }
        }
      );

    return () => {
      subscription.remove();
    };
  }, []);
}