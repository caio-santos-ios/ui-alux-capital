"use client";

import Button from "@/components/ui/button/Button"
import { permissionCreate } from "@/utils/permission.util";
import Link from "next/link";
import { useEffect, useState } from "react";

const module = "A";
const routine = "A2";

export const TemplateButtonCreate = () => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(permissionCreate(module, routine));
    }, []);

    if (!hasPermission) return null;

    return (
        <Link href="/settings/templates/create">
            <Button type="submit" className="" size="sm">Adicionar</Button>
        </Link>
    );
}