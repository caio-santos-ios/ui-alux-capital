"use client";

import Label from "@/components/form/Label";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { resolveResponse } from "@/service/config.service";
import { ResetNewCodeConfirm, TNewCodeConfirm } from "@/types/auth/newCodeConfirm.type";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../ui/button/Button";

export default function NewCodeConfirmForm() {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const router = useRouter();
  
  const { register, handleSubmit, reset, formState: { errors }} = useForm<TNewCodeConfirm>({
    defaultValues: ResetNewCodeConfirm
  });
  
  const confirm: SubmitHandler<TNewCodeConfirm> = async (body: TNewCodeConfirm) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/auth/new-code-confirm`, body);
      resolveResponse({status: 200, message: data.result.message});
      reset(ResetNewCodeConfirm);
      setTimeout(() => {
        router.push("/confirm-account");
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
                <Label title="E-mail"/>
                <input placeholder="Seu e-mail" {...register("email")} type="text" className="input-erp-primary input-erp-default"/>
              </div>

              <div>
                <Button type="submit" className="w-full" size="sm">Novo código</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
