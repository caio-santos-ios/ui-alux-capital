import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import ProfileUserTable from "@/components/pages/master-data/profile-permission/ProfileUserTable";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Telemovvi | Perfil de Usuário",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function ProfileUsersPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdAdminPanelSettings" pageTitle="Perfil de Usuário" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <Link href="profile-users/create">
          <Button type="submit" className="" size="sm">Adicionar</Button>
        </Link>
      </div>
      <ProfileUserTable />
    </div>
  );
}