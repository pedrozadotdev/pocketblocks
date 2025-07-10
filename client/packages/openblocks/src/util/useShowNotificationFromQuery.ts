import { useEffect } from "react";
import { message } from "antd";
import { getQueryParam, removeQueryParam } from "./urlUtils";



export function useShowNotificationFromQuery() {
    useEffect(() => {
        const notification = getQueryParam("notification");
        if (notification) {
            message.error(notification);
            removeQueryParam("notification");
        }
    }, []);
} 