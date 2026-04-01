import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import Chat from "@/components/pages/chat/Chat";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Telemovvi | Chat",
    description: "Chat em tempo real",
};

export default function ChatPage() {
    return (
        <div>
            <PageBreadcrumb pageIcon="MdChat" pageTitle="Chat" pageSubTitle="" />
            <Chat />
        </div>
    );
}