"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { userAdmin, userLoggerAtom } from "@/jotai/auth/auth.jotai";
import { removeLocalStorage } from "@/service/config.service";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { ResetUserLogged } from "@/types/master-data/user/user.type";

export const Autorization = () => {
    const [_, setIsLoading] = useAtom(loadingAtom);
    const [__, setUserLogger] = useAtom(userLoggerAtom);
    const [___, setIsAdmin] = useAtom(userAdmin);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const localToken = localStorage.getItem("telemovviToken");
        const token = localToken ? localToken : "";

        if(!token) {
            setUserLogger(ResetUserLogged);
            setIsLoading(false);

            if(!["reset-password", "signup", "new-code-confirm", "confirm-account"].includes(pathname.split("/")[1])) {
                router.push("/");
                removeLocalStorage();
                setIsAdmin(false);
            };
        } else {
            const admin = localStorage.getItem("telemovviAdmin");
            const name = localStorage.getItem("telemovviName");
            const email = localStorage.getItem("telemovviEmail");
            const photo = localStorage.getItem("telemovviPhoto");

            setUserLogger({
                name: name ? name : "",
                email: email ? email : "",
                photo: photo ? photo : "",
            });
            
            setIsAdmin(admin == 'true');

            if(admin == "true") {
                if(pathname == "/" || pathname == "/reset-password") {
                    router.push("/dashboard");
                };
            } else {
                if(pathname == "/" || pathname == "/reset-password") {
                    router.push("/master-data/profile");
                };
            };
        };
    }, [pathname, router]);

    return <></>
}