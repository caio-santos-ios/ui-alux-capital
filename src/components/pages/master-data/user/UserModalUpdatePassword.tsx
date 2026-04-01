"use client";

import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import ModalV2 from "@/components/ui/modalV2"
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { userAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { ResetUser, ResetUserResetPassword, TUserResetPassword } from "@/types/master-data/user/user.type";
import { useAtom } from "jotai";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export const UserModalUpdatePassword = () => {
    const [modal, setModal] = useAtom(userModalUpdatePasswordAtom);
    const [user, setUser] = useAtom(userAtom);
    const [_, setLoading] = useAtom(loadingAtom);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const { register, reset, getValues } = useForm<TUserResetPassword>({
        defaultValues: ResetUserResetPassword
    });

    const closeModal = () => {
        setModal(false);
        setUser(ResetUser);
        reset();
    };
    
    const update: SubmitHandler<TUserResetPassword> = async (body: TUserResetPassword) => {
        try {
            setLoading(true);
            const {data} = await api.put(`/auth/reset-password`, {...body, id: user.id}, configApi());
            resolveResponse({status: 200, message: data.result.message});
            closeModal();
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalV2 isOpen={modal} onClose={closeModal} title="Usuário">
            <form className="flex flex-col p-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                    <div className="col-span-6">
                        <Label title="Senha Atual"/>
                        <div className="relative">
                            <input placeholder="Sua senha atual" {...register("password")} type={showPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <Label title="Nova Senha"/>
                        <div className="relative">
                            <input placeholder="Sua nova senha" {...register("newPassword")} type={showNewPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                            <span onClick={() => setShowNewPassword(!showNewPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                {showNewPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="col-span-6">
                        <Label title="Confirmar nova senha"/>
                        <div className="relative">
                            <input placeholder="Confirmar nova senha" {...register("confirmPassword")} type={showConfirmNewPassword ? "text" : "password"} className="input-erp-primary input-erp-default"/>
                            <span onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute z-1 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                                {showConfirmNewPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                )}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={() => update(getValues())}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}