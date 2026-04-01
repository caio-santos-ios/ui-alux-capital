import { TNotification } from "@/types/global/notification.type";
import { atom } from "jotai";

export const notificationsAtom      = atom<TNotification[]>([]);
export const unreadNotifCountAtom   = atom<number>(0);