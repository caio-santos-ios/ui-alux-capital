import CorfirmAccountLink from "@/components/auth/CorfirmAccountLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Confirmar Conta",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default async function ConfirmAccountDetails({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <CorfirmAccountLink code={code} />
    </div>
  ) 
}