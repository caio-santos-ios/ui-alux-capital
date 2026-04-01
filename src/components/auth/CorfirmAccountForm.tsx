"use client";

import Label from "@/components/form/Label";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetConfirmAccount, TConfirmAccount } from "@/types/auth/confirmAccount.type";
import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";

export default function CorfirmAccountForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<TConfirmAccount>({
    defaultValues: ResetConfirmAccount
  });
  
  const confirm: SubmitHandler<TConfirmAccount> = async (body: TConfirmAccount) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/auth/confirm-account`, body);
      resolveResponse({status: 201, message: data.result.message});
      reset(ResetConfirmAccount);
      setTimeout(() => {
        router.push("/");      
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
          <form onSubmit={handleSubmit(confirm)}>
            <div className="space-y-5">
              <div>
                <Label title="Código de confirmação"/>
                <input placeholder="Seu código de confirmação" {...register("code")} type="text" className="input-erp-primary input-erp-default"/>
              </div>

              <div>
                <Button type="submit" className="w-full" size="sm">Confirmar</Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Não chegou o código?
              <Link
                href="/new-code-confirm"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              > Solicitar novo código
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
