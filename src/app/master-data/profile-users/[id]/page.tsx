import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import ProfileUserForm from "@/components/pages/master-data/profile-permission/ProfileUserForm";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Telemovvi | Perfil de Usuário",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function ProfilePermissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb pageIcon="MdAdminPanelSettings" pageTitle="Perfil de Usuário" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <Link href="/master-data/profile-users">
          <Button type="submit" variant="outline" size="sm">Voltar</Button>
        </Link>
      </div>
      <ProfileUserForm id={id} />
    </div>
  );
}