"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Label from "@/components/form/Label";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetSignUp, TSignUp } from "@/types/auth/signUp.type";
import { maskCNPJ, maskCPF, maskPhone } from "@/utils/mask.util";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";
import { Logo } from "../logo/Logo";

export default function SignUpForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors }} = useForm<TSignUp>({
    defaultValues: ResetSignUp
  });
  
  const create: SubmitHandler<TSignUp> = async (body: TSignUp) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/auth/register`, body);
      resolveResponse({status: 201, message: data.result.message});
      
      setTimeout(() => {
        reset(ResetSignUp);
        setIsChecked(false);
        router.push("confirm-account")
      }, 1000);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("privacyPolicy", isChecked);
  }, [isChecked]);

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full max-w-[90dvw] h-dvh overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto py-4">
        <div className="flex justify-center mb-6">
          <Logo width={250} height={100}/>
        </div>
        <div>
          <form onSubmit={handleSubmit(create)}>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-4">
                <Label title="Nome"/>
                <input placeholder="Seu nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-4">
                <Label title="E-mail"/>
                <input placeholder="Seu e-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
              </div>

              <div className="col-span-4">
                <Label title="Senha"/>
                <div className="relative">
                  <input placeholder="Sua senha" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                  <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              <div className="col-span-4 flex items-center gap-3">
                <Checkbox
                  className="w-5 h-5"
                  checked={isChecked}
                  onChange={setIsChecked}
                />
                <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                  Ao criar uma conta, você concorda com os termos {" "}
                  <span className="text-gray-800 dark:text-white/90">
                    Termos e Condições,
                  </span>{" "}
                  e nosso{" "}
                  <span className="text-gray-800 dark:text-white">
                    Política de Privacidade
                  </span>
                </p>
              </div>
              <div className="col-span-4">
                <Button type="submit" className="w-full" size="sm">Cadastrar</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Já tenho uma conta?
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
