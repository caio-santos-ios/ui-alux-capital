import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { TemplateButtonCreate } from "@/components/pages/settings/template/TemplateButtonCreate";
import TemplateTable from "@/components/pages/settings/template/TemplateTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Templates",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function TemplatePage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="HiTemplate" pageTitle="Templates" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <TemplateButtonCreate />
      </div>
      <TemplateTable />
    </div>
  );
}