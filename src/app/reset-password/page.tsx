import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Recuperar Senha",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function ResetPassword() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <ResetPasswordForm />
    </div>
  ) 
}