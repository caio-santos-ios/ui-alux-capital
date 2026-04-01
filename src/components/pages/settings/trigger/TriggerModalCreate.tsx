"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { triggerAtom, triggerModalAtom } from "@/jotai/settings/trigger.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { intervalUnitOptions, ResetTrigger, TTrigger } from "@/types/setting/trigger.type";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const TriggerModalCreate = () => {
    const [modal, setModal] = useAtom(triggerModalAtom);
    const [trigger, setTrigger] = useAtom(triggerAtom);
    const [_, setLoading] = useAtom(loadingAtom);

    const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<TTrigger>({
        defaultValues: ResetTrigger,
    });

    const closeModal = () => {
        setModal(false);
        setTrigger(ResetTrigger);
        reset(ResetTrigger);
    };

    const confirm = async (body: TTrigger) => {
        if (!body.id) {
            await create(body);
        } else {
            await update(body);
        }
    };

    const create: SubmitHandler<TTrigger> = async (body) => {
        try {
            setLoading(true);
            const { data } = await api.post(`/triggers`, body, configApi());
            resolveResponse({ status: 201, message: data.result.message });
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const update: SubmitHandler<TTrigger> = async (body) => {
        try {
            setLoading(true);
            const { data } = await api.put(`/triggers`, body, configApi());
            resolveResponse({ status: 200, message: data.result.message });
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getById = async (id: string) => {
        try {
            setLoading(true);
            const { data } = await api.get(`/triggers/${id}`, configApi());
            const result = data.result.data;
            reset(result);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (trigger.id && modal) {
            getById(trigger.id);
        }
    }, [trigger.id, modal]);

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Trigger">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">

                    <div className="col-span-1">
                        <Label title="Nome" />
                        <input
                            placeholder="Nome da trigger"
                            {...register("name", { required: "Nome é obrigatório" })}
                            type="text"
                            className="input-erp-primary input-erp-default"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-error-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="col-span-1">
                        <Label title="E-mail destinatário" />
                        <input
                            placeholder="email@exemplo.com"
                            {...register("email", {
                                required: "E-mail é obrigatório",
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" },
                            })}
                            type="email"
                            className="input-erp-primary input-erp-default"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-error-500">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="col-span-1">
                        <Label title="Intervalo de disparo" />
                        <div className="flex gap-2">
                            <input
                                {...register("intervalValue", {
                                    required: "Informe o intervalo",
                                    min: { value: 1, message: "Mínimo 1" },
                                    valueAsNumber: true,
                                })}
                                type="number"
                                min={1}
                                placeholder="Ex: 2"
                                className="input-erp-primary input-erp-default w-28 no-spinner"
                            />
                            <select
                                {...register("intervalUnit")}
                                className="h-11 flex-1 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                            >
                                {intervalUnitOptions.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.intervalValue && (
                            <p className="mt-1 text-xs text-error-500">{errors.intervalValue.message}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button size="sm" variant="primary" onClick={() => confirm(getValues())}>
                        Confirmar
                    </Button>
                </div>
            </form>
        </ModalV2>
    );
};