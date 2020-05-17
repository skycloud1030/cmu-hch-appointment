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
    Notification.requestPermission((val) => {
      if (val === "granted") permission.current = true;
    });
  }, []);

  const notify = useCallback((value) => {
    if (permission.current) {
      new Notification(value, setting);
    }
  }, []);

  return notify;
};

export default useNotification;
