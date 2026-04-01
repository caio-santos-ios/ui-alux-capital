import { TChatMessage, TConversation, TChatUser } from "@/types/global/chat.type";
import { atom } from "jotai";

export const conversationsAtom      = atom<TConversation[]>([]);
export const activeChatUserAtom     = atom<TChatUser | null>(null);
export const chatMessagesAtom       = atom<TChatMessage[]>([]);
export const chatOpenAtom           = atom<boolean>(false);
export const unreadChatCountAtom    = atom<number>(0);
export const typingUserAtom         = atom<string | null>(null);