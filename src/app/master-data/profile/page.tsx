import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Perfil",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function ProfilePage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="" pageTitle="Perfil" pageSubTitle="" />
      <UserMetaCard />
    </div>
  );
}
