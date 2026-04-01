"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const EXPECTED_ERRORS = [
    "AbortError",
    "Failed to start the HttpConnection before stop() was called",
    "Cannot send data if the connection is not in the 'Connected' State",
];

const isExpectedError = (err: any): boolean => {
    if (!err) return false;
    if (err?.name === "AbortError") return true;
    const msg: string = err?.message ?? String(err);
    return EXPECTED_ERRORS.some((e) => msg.includes(e));
};

type UseSignalROptions = {
    hubUrl: string;
    onConnected?: (connection: signalR.HubConnection) => void;
    onDisconnected?: () => void;
};

export const useSignalR = ({ hubUrl, onConnected, onDisconnected }: UseSignalROptions) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("telemovviToken") ?? "";
        if (!token) return;

        let isMounted = true;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.NEXT_PUBLIC_API_URL}${hubUrl}?access_token=${token}`, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .configureLogging(signalR.LogLevel.None)
            .build();

        connectionRef.current = connection;

        connection.onreconnecting(() => {
            if (isMounted) setIsConnected(false);
        });

        connection.onreconnected(() => {
            if (isMounted) {
                setIsConnected(true);
                onConnected?.(connection);
            }
        });

        connection.onclose(() => {
            if (isMounted) {
                setIsConnected(false);
                onDisconnected?.();
            }
        });

        connection
            .start()
            .then(() => {
                if (!isMounted) {
                    connection.stop();
                    return;
                }
                setIsConnected(true);
                onConnected?.(connection);
            })
            .catch((err) => {
                if (!isExpectedError(err)) {
                    console.error(`[SignalR] ${hubUrl} error:`, err);
                }
            });

        return () => {
            isMounted = false;
            if (
                connection.state === signalR.HubConnectionState.Connected ||
                connection.state === signalR.HubConnectionState.Connecting ||
                connection.state === signalR.HubConnectionState.Reconnecting
            ) {
                connection.stop().catch(() => {});
            }
        };
    }, [hubUrl]);

    return { connection: connectionRef.current, isConnected };
};