"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ResetTemplate, TTemplate } from "@/types/setting/template.type";
import { permissionRead, permissionUpdate } from "@/utils/permission.util";
import dynamic from "next/dynamic";
import ModalV2 from "@/components/ui/modalV2";
import { TemplateModalPreview } from "./TemplateModalPreview";
import { templateAtom, templateModalPreviewAtom } from "@/jotai/master-data/template.jotai";

type TProp = {
  id?: string;
};

const module = "A";
const routine = "A2";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function TemplateForm({id}: TProp) {
  const [_, setLoading] = useAtom(loadingAtom);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [template, setTemplate] = useAtom(templateAtom);
  const [__, setPreviewTemplateModal] = useAtom(templateModalPreviewAtom);
  const router = useRouter();

  const { register, reset, setValue, watch, getValues } = useForm<TTemplate>({
    defaultValues: ResetTemplate
  });

  const save = async (body: TTemplate) => {
    if(!body.id) {
      await create(body);
    } else {
      await update(body);
    };
  } 
    
  const create: SubmitHandler<TTemplate> = async (body: TTemplate) => {
    try {
      setLoading(true);
      const {data} = await api.post(`/templates`, body, configApi());
      const result = data.result;
      resolveResponse({status: 201, message: result.message});
      router.push(`/settings/templates/${result.data.id}`)
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  const update: SubmitHandler<TTemplate> = async (body: TTemplate) => {
    try {
      setLoading(true);
      const {data} = await api.put(`/templates`, body, configApi());
      const result = data.result;
      resolveResponse({status: 200, message: result.message});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/templates/${id}`, configApi());
      const result = data.result.data;
      reset(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const send = async () => {
    try {
      setLoading(true);
      await api.put(`/templates/send-mail`, {...getValues()}, configApi());
      resolveResponse({status: 200, message: "Enviado com sucesso"});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initial = async () => {
      if(id != "create") {
        await getById(id!);
      };
    };
    initial();
  }, []);

  return (
    <>
      <ComponentCard title="Dados Gerais" hasHeader={false}>
        <div className="grid grid-cols-6 gap-2 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-16rem)] overflow-y-auto">
          <div className="col-span-6">
            <Label title="Código"/>
            <input placeholder="Código" {...register("code")} type="text" className="input-erp-primary input-erp-default"/>
          </div>
          <div className="col-span-6">
            <Label title="HTML"/>
            <div className="rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
              <MonacoEditor
                height={'450px'}
                language="html"
                theme="vs-dark"
                value={watch("html")}
                onChange={(value) => setValue("html", value ?? "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </div>
      </ComponentCard>
      {
        permissionRead(module, routine) && (
          <Button variant="outline" onClick={() => {
            setPreviewTemplateModal(true);
            setTemplate({...getValues()});
          }} type="submit" className="max-w-20 mt-2" size="sm">Preview</Button>
        )
      }
      {
        permissionUpdate(module, routine) && (
          <Button variant="outline" onClick={send} type="submit" className="max-w-20 mt-2 ms-2" size="sm">Enviar</Button>
        )
      }
      {
        permissionUpdate(module, routine) && (
          <Button onClick={() => save({...getValues()})} type="submit" className="max-w-20 mt-2 ms-2" size="sm">Salvar</Button>
        )
      }
      <TemplateModalPreview />
    </>
  );
}