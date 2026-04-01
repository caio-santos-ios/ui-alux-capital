import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { UserButtonCreate } from "@/components/pages/master-data/user/UserButtonCreate";
import UserTable from "@/components/pages/master-data/user/UserTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Usuários",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function UserPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdPeople" pageTitle="Usuários" pageSubTitle="Cadastros" />
      <div className="flex justify-end mb-2">
        <UserButtonCreate />
      </div>
      <UserTable />
    </div>
  );
}