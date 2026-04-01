"use client";

import Button from "@/components/ui/button/Button"
import { userModalAtom } from "@/jotai/master-data/user.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";

const module = "B";
const routine = "B1";

export const UserButtonCreate = () => {
    const [_, setModal] = useAtom(userModalAtom);

    return  permissionCreate(module, routine) && <Button onClick={() => setModal(true)} type="submit" className="" size="sm">Adicionar</Button>
}