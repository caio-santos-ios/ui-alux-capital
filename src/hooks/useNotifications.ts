"use client";

import * as signalR from "@microsoft/signalr";
import { notificationsAtom, unreadNotifCountAtom } from "@/jotai/global/notification.jotai";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { TNotification } from "@/types/global/notification.type";
import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { useSignalR } from "./useSignalR";

export const useNotifications = () => {
    const [notifications, setNotifications] = useAtom(notificationsAtom);
    const [unreadCount, setUnreadCount]     = useAtom(unreadNotifCountAtom);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const { data } = await api.get("/notifications?limit=30", configApi());
            const list: TNotification[] = data?.result?.data ?? [];
            setNotifications(list);
            setUnreadCount(list.filter((n) => !n.read).length);
        } catch {}
    }, [setNotifications, setUnreadCount]);

    const onConnected = useCallback(
        (conn: signalR.HubConnection) => {
            connectionRef.current = conn;

            conn.on("ReceiveNotification", (notif: TNotification) => {
                setNotifications((prev) => [notif, ...prev]);
                setUnreadCount((prev) => prev + 1);
            });

            conn.on("NotificationRead", (id: string) => {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, read: true } : n))
                );
                setUnreadCount((prev) => Math.max(0, prev - 1));
            });

            conn.on("AllNotificationsRead", () => {
                setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
                setUnreadCount(0);
            });

            fetchNotifications();
        },
        [fetchNotifications, setNotifications, setUnreadCount]
    );

    const { isConnected } = useSignalR({ hubUrl: "/hubs/notifications", onConnected });

    const markAsRead = useCallback(
        async (id: string) => {
            await connectionRef.current?.invoke("MarkAsRead", id);
        },
        []
    );

    const markAllAsRead = useCallback(async () => {
        await connectionRef.current?.invoke("MarkAllAsRead");
    }, []);

    const deleteNotification = useCallback(
        async (id: string) => {
            try {
                await api.delete(`/notifications/${id}`, configApi());
                setNotifications((prev) => prev.filter((n) => n.id !== id));
                setUnreadCount((prev) =>
                    Math.max(0, notifications.find((n) => n.id === id && !n.read) ? prev - 1 : prev)
                );
            } catch {}
        },
        [notifications, setNotifications, setUnreadCount]
    );

    return { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, deleteNotification };
};