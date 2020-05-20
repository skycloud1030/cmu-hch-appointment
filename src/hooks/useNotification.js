import { useCallback, useEffect, useRef } from "react";

const setting = {
  icon: "./notification.png",
  vibrate: [200, 100, 200],
  renotify: true,
  tag: "notify",
};

const useNotification = () => {
  const permission = useRef(false);

  useEffect(() => {
    try {
      if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return;
      }
      Notification.requestPermission((val) => {
        if (val === "granted") permission.current = true;
      });
    } catch {}
  }, []);

  const notify = useCallback((value) => {
    try {
      if (permission.current) {
        new Notification(value, setting);
      }
    } catch {}
  }, []);

  return notify;
};

export default useNotification;
