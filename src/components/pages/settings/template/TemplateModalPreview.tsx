"use client";

import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { templateAtom, templateModalPreviewAtom } from "@/jotai/master-data/template.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetTemplate, TTemplate } from "@/types/setting/template.type";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const TemplateModalPreview = () => {
    const [modal, setModal] = useAtom(templateModalPreviewAtom);
    const [template, setTemplate] = useAtom(templateAtom);
    const [_, setLoading] = useAtom(loadingAtom);

    const { reset, watch } = useForm<TTemplate>({
        defaultValues: ResetTemplate
    });

    const closeModal = () => {
        setModal(false);
        setTemplate(ResetTemplate);
        reset();
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const {data} = await api.get(`/templates/${id}`, configApi());
            const result = data?.result?.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(template.id && modal) {
            getById(template.id);
        };
    }, [template.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Template" size="xl" className="h-[calc(100dvh-8.5rem)]">
            <form className="flex flex-col p-6 h-full">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 h-[calc(100%-8rem)]">
                    <div className="h-full">
                        <iframe
                            srcDoc={watch("html")}
                            className="w-full h-full rounded-lg border border-gray-200 dark:border-gray-700"
                            sandbox="allow-same-origin"
                            title="Preview HTML"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}