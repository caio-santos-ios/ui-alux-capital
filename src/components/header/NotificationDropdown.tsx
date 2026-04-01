"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useRouter } from "next/navigation";
import { MdDoneAll, MdDelete } from "react-icons/md";
import { TNotification } from "@/types/global/notification.type";

const typeColors: Record<string, string> = {
    info:    "bg-blue-light-50 text-blue-light-600 dark:bg-blue-light-500/15",
    success: "bg-success-50 text-success-600 dark:bg-success-500/15",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/15",
    error:   "bg-error-50 text-error-600 dark:bg-error-500/15",
};

const typeDot: Record<string, string> = {
    info:    "bg-blue-light-500",
    success: "bg-success-500",
    warning: "bg-warning-500",
    error:   "bg-error-500",
};

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const handleClick = (notif: TNotification) => {
        if (!notif.read) markAsRead(notif.id);
        if (notif.link) router.push(notif.link);
        setIsOpen(false);
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1)  return "agora";
        if (mins < 60) return `${mins}min atrás`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24)  return `${hrs}h atrás`;
        return `${Math.floor(hrs / 24)}d atrás`;
    };

    return (
        <div className="relative">
            <button
                className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => setIsOpen((p) => !p)}
            >
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
                <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z" fill="currentColor" />
                </svg>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="absolute -right-2 mt-[17px] flex max-h-[520px] w-[360px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark sm:right-0"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <h5 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Notificações
                        </h5>
                        {unreadCount > 0 && (
                            <span className="flex items-center justify-center h-5 min-w-5 rounded-full bg-brand-500 text-[10px] font-bold text-white px-1">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            title="Marcar todas como lidas"
                            className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-600 font-medium"
                        >
                            <MdDoneAll size={16} />
                            Marcar todas
                        </button>
                    )}
                </div>

                {/* List */}
                <ul className="flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[400px]">
                    {notifications.length === 0 ? (
                        <li className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                            Nenhuma notificação
                        </li>
                    ) : (
                        notifications.map((notif) => (
                            <li
                                key={notif.id}
                                className={`group relative flex items-start gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
                                    notif.read
                                        ? "hover:bg-gray-50 dark:hover:bg-white/5"
                                        : "bg-brand-25 hover:bg-brand-50 dark:bg-brand-500/10 dark:hover:bg-brand-500/15"
                                }`}
                                onClick={() => handleClick(notif)}
                            >
                                {/* Dot type */}
                                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDot[notif.type] ?? typeDot.info}`} />

                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium leading-tight truncate ${notif.read ? "text-gray-600 dark:text-gray-400" : "text-gray-800 dark:text-white/90"}`}>
                                        {notif.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                        {notif.message}
                                    </p>
                                    <span className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
                                        {timeAgo(notif.createdAt)}
                                    </span>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notif.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-error-500 shrink-0 mt-1"
                                    title="Remover"
                                >
                                    <MdDelete size={16} />
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </Dropdown>
        </div>
    );
}