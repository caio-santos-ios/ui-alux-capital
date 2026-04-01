"use client";

import Button from "@/components/ui/button/Button";
import { triggerModalAtom } from "@/jotai/settings/trigger.jotai";
import { permissionCreate } from "@/utils/permission.util";
import { useAtom } from "jotai";

const module  = "A";
const routine = "A3";

export const TriggerButtonCreate = () => {
    const [_, setModal] = useAtom(triggerModalAtom);

    return permissionCreate(module, routine) ? (
        <Button onClick={() => setModal(true)} type="button" size="sm">
            Adicionar
        </Button>
    ) : null;
};