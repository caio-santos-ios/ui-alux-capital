export type TNotification = {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    read: boolean;
    link?: string;
    createdAt: string;
}