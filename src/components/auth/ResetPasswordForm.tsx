"use client";

import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetPassword, TResetPassword } from "@/types/auth/ResetPassword.type";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";

type TProps = {
  code?: string;
}

export default function ResetPasswordForm({code}: TProps) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors }} = useForm<TResetPassword>({
    defaultValues: ResetPassword
  });
  
  const resetPassword: SubmitHandler<TResetPassword> = async (body: TResetPassword) => {
    try {
      const form = {
        ...body,
        codeAccess: code
      };

      setIsLoading(true);
      const path = code ? "reset" : "request";
      const {data} = await api.put(`/auth/${path}-forgot-password`, form);
      resolveResponse({status: 200, message: data.result.message});
      
      setTimeout(() => {
        reset(ResetPassword);
        setIsChecked(false);
        router.push("/")
      }, 1000);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-[90dvw] overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <form onSubmit={handleSubmit(resetPassword)}>
            <div className="space-y-5">
              {
                !code &&
                <div>
                  <Label title="E-mail"/>
                  <input placeholder="Seu e-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
                </div>
              }
              
              {
                code &&
                <>
                  <div>
                    <Label title="Nova senha"/>
                    <div className="relative">
                      <input placeholder="Sua nova senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                      <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label title="Confirmar senha"/>
                    <div className="relative">
                      <input placeholder="Sua confirmação da senha" {...register("newPassword")} type={showNewPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                      <span onClick={() => setNewShowPassword(!showNewPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                        {showNewPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                </>
              }
              <div>
                <Button type="submit" className="w-full" size="sm">Alterar senha</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Recuperou a senha?
              <Link
                href="/"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              > Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
