export type TChatMessage = {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export type TConversation = {
    id: string;
    conversationId: string;
    participants: string[];
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    // campos enriquecidos no frontend
    otherUserName?: string;
    otherUserPhoto?: string;
    otherUserId?: string;
}

export type TChatUser = {
    id: string;
    name: string;
    photo: string;
}