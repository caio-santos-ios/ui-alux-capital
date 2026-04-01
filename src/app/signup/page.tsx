import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Cadastrar-se",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <SignUpForm />
    </div>
  ) 
}