import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemovvi | Login",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      <SignInForm />
    </div>
  ) 
}