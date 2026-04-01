"use client";

import Button from "@/components/ui/button/Button"
import { userModalAtom } from "@/jotai/master-data/user.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const module = "B";
const routine = "B1";

export const UserButtonCreate = () => {
    const [_, setModal] = useAtom(userModalAtom);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return (
        <Button onClick={() => setModal(true)} type="submit" className="" size="sm">
            Adicionar
        </Button>
    );
}