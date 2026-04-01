"use client";

import { useChat } from "@/hooks/useChat";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { useEffect, useRef, useState } from "react";
import { MdSend, MdSearch } from "react-icons/md";
import { TChatMessage, TChatUser } from "@/types/global/chat.type";
import { getLoggedUserId } from "@/utils/auth.util";

const timeLabel = (dateStr?: string) => {
    if (!dateStr) return "";
    const d   = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday
        ? d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

const UserAvatar = ({
    name,
    photo,
    size = "md",
}: {
    name: string;
    photo?: string | null;
    size?: "sm" | "md" | "lg";
}) => {
    const sizeClass = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }[size];
    return (
        <div className={`${sizeClass} rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden border border-gray-200 dark:border-gray-700`}>
            {photo ? (
                <img src={photo} alt={name} className="w-full h-full object-cover" />
            ) : (
                <span className="font-bold text-gray-500 dark:text-gray-400">
                    {name?.charAt(0)?.toUpperCase()}
                </span>
            )}
        </div>
    );
};

const UserList = ({
    users,
    activeUserId,
    conversations,
    onSelect,
}: {
    users: TChatUser[];
    activeUserId: string;
    conversations: any[];
    onSelect: (user: TChatUser) => void;
}) => {
    const [search, setSearch] = useState("");

    const filtered = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const getLastMessage = (userId: string) => {
        const myId  = getLoggedUserId();
        const convId = [myId, userId].sort().join("_");
        return conversations.find((c) => c.conversationId === convId);
    };

    return (
        <div className="flex flex-col h-full border-r border-gray-200 dark:border-gray-800">
            <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar usuário..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-700 dark:text-white/90 placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10"
                    />
                </div>
            </div>

            <ul className="flex-1 overflow-y-auto custom-scrollbar">
                {filtered.length === 0 && (
                    <li className="py-10 text-center text-sm text-gray-400">
                        Nenhum usuário encontrado
                    </li>
                )}
                {filtered.map((user) => {
                    const conv     = getLastMessage(user.id);
                    const isActive = activeUserId === user.id;

                    return (
                        <li
                            key={user.id}
                            onClick={() => onSelect(user)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors ${
                                isActive
                                    ? "bg-brand-50 dark:bg-brand-500/10"
                                    : "hover:bg-gray-50 dark:hover:bg-white/5"
                            }`}
                        >
                            <UserAvatar name={user.name} photo={user.photo} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className={`text-sm font-medium truncate ${isActive ? "text-brand-600 dark:text-brand-400" : "text-gray-800 dark:text-white/90"}`}>
                                        {user.name}
                                    </p>
                                    {conv?.lastMessageAt && (
                                        <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                                            {timeLabel(conv.lastMessageAt)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {conv?.lastMessage ?? "Iniciar conversa"}
                                </p>
                            </div>
                            {conv?.unreadCount > 0 && !isActive && (
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shrink-0">
                                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

const MessageArea = ({
    activeUser,
    messages,
    myId,
    typingUser,
    onSend,
    onTyping,
    onStopTyping,
}: {
    activeUser: TChatUser | null;
    messages: TChatMessage[];
    myId: string;
    typingUser: string | null;
    onSend: (content: string) => void;
    onTyping: () => void;
    onStopTyping: () => void;
}) => {
    const [text, setText]   = useState("");
    const bottomRef         = useRef<HTMLDivElement>(null);
    const typingTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = () => {
        if (!text.trim()) return;
        onSend(text.trim());
        setText("");
    };

    const handleChange = (val: string) => {
        setText(val);
        onTyping();
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(onStopTyping, 2000);
    };

    if (!activeUser) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 dark:text-gray-600">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-sm">Selecione um usuário para iniciar o chat</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-800">
                <UserAvatar name={activeUser.name} photo={activeUser.photo} size="md" />
                <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                        {activeUser.name}
                    </p>
                    {typingUser ? (
                        <p className="text-xs text-brand-500 animate-pulse">digitando...</p>
                    ) : (
                        <p className="text-xs text-gray-400">online</p>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 flex flex-col gap-3">
                {messages.length === 0 && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-gray-400">
                            Nenhuma mensagem ainda. Diga olá! 👋
                        </p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMine = msg.senderId === myId;
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}
                        >
                            {!isMine && (
                                <UserAvatar name={msg.senderName} photo={msg.senderPhoto} size="sm" />
                            )}
                            <div className={`max-w-[65%] flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                                {!isMine && (
                                    <span className="text-[10px] text-gray-400 px-1">
                                        {msg.senderName}
                                    </span>
                                )}
                                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed wrap-break-word ${
                                    isMine
                                        ? "bg-brand-500 text-white rounded-br-sm"
                                        : "bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white/90 rounded-bl-sm"
                                }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-400 px-1">
                                    {timeLabel(msg.createdAt)}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} />
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    placeholder={`Mensagem para ${activeUser.name}...`}
                    className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-4 text-sm text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10"
                />
                <button
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500 text-white disabled:opacity-40 hover:bg-brand-600 transition-colors shrink-0"
                >
                    <MdSend size={20} />
                </button>
            </div>
        </div>
    );
};

export default function Chat() {
    const myId = getLoggedUserId();

    const {
        conversations,
        messages,
        activeChatUser,
        typingUser,
        openChat,
        sendMessage,
        notifyTyping,
        notifyStopTyping,
        fetchConversations,
    } = useChat();

    const [users, setUsers] = useState<TChatUser[]>([]);

    const loadUsers = async () => {
        try {
            const { data } = await api.get(
                `/users?deleted=false&orderBy=name&sort=asc&pageSize=100&pageNumber=1`,
                configApi()
            );
            const all: TChatUser[] = data?.result?.data ?? [];
            setUsers(all.filter((u: any) => u.id !== myId));
        } catch {}
    };

    useEffect(() => {
        loadUsers();
        fetchConversations();
    }, []);

    const handleSelectUser = (user: TChatUser) => {
        const conversationId = [myId, user.id].sort().join("_");
        openChat(user, conversationId);
    };

    const handleSend = async (content: string) => {
        if (!activeChatUser) return;
        await sendMessage(activeChatUser.id, content);
    };

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 overflow-hidden"
            style={{ height: "calc(100dvh - 10rem)" }}>
            <div className="grid grid-cols-12 h-full">

                {/* Sidebar — lista de usuários */}
                <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                            Usuários ({users.length})
                        </h3>
                    </div>
                    <UserList
                        users={users}
                        activeUserId={activeChatUser?.id ?? ""}
                        conversations={conversations}
                        onSelect={handleSelectUser}
                    />
                </div>

                {/* Message area */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full overflow-hidden flex flex-col border-l border-gray-200 dark:border-gray-800">
                    <MessageArea
                        activeUser={activeChatUser}
                        messages={messages}
                        myId={myId}
                        typingUser={typingUser}
                        onSend={handleSend}
                        onTyping={() => activeChatUser && notifyTyping(activeChatUser.id)}
                        onStopTyping={() => activeChatUser && notifyStopTyping(activeChatUser.id)}
                    />
                </div>
            </div>
        </div>
    );
}