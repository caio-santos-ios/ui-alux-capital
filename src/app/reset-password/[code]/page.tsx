import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Alterar Senha",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default async function ResetPassword({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <ResetPasswordForm code={code} />
    </div>
  ) 
}