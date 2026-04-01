"use client";

import Button from "@/components/ui/button/Button"
import { permissionCreate } from "@/utils/permission.util";
import Link from "next/link";

const module = "A";
const routine = "A2";

export const TemplateButtonCreate = () => {

    return  permissionCreate(module, routine) && (
        <Link href="/settings/templates/create">
            <Button type="submit" className="" size="sm">Adicionar</Button>
        </Link>
    ) 
}