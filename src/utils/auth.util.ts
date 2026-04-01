import { jwtDecode } from "jwt-decode";

type JwtPayload = { sub: string; email: string; };

export const getLoggedUserId = (): string => {
    try {
        const token = localStorage.getItem("telemovviToken") ?? "";
        if (!token) return "";
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.sub ?? "";
    } catch {
        return "";
    }
};