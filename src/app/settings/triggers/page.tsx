import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { TriggerButtonCreate } from "@/components/pages/settings/trigger/TriggerButtonCreate";
import TriggerTable from "@/components/pages/settings/trigger/TriggerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Telemovvi | Triggers",
    description: "Gerenciamento de triggers de disparo automático",
};

export default function TriggerPage() {
    return (
        <div>
            <PageBreadcrumb
                pageIcon="MdOutlineTimer"
                pageTitle="Triggers"
                pageSubTitle="Configurações"
            />
            <div className="flex justify-end mb-2">
                <TriggerButtonCreate />
            </div>
            <TriggerTable />
        </div>
    );
}