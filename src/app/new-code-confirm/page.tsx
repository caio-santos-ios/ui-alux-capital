import NewCodeConfirmForm from "@/components/auth/NewCodeConfirmForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Novo Código de Confirmação",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function NewCodeConfirm() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <NewCodeConfirmForm />
    </div>
  ) 
}