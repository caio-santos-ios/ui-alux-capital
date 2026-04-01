import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import LoggerTable from "@/components/pages/settings/logger/LoggerTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Logs",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function LoggerPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdArchive" pageTitle="Logs" pageSubTitle="Configurações" />
      <LoggerTable />
    </div>
  );
}