import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import TemplateForm from "@/components/pages/settings/template/TemplateForm";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Telemovvi | Templates",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb pageIcon="HiTemplate" pageTitle="Templates" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <Link href="/settings/templates">
          <Button type="submit" variant="outline" size="sm">Voltar</Button>
        </Link>
      </div>
      <TemplateForm id={id} />
    </div>
  );
}