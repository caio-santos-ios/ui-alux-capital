"use client";

import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import { userLoggerAtom } from "@/jotai/auth/auth.jotai";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import DropzoneComponent from "../form/form-elements/DropZone";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { api, uriBase } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { useEffect } from "react";
import { ResetUserProfile, TUserProfile } from "@/types/master-data/user/user.type";

export default function UserMetaCard() {
  const [userLogger, setUserLogger] = useAtom(userLoggerAtom);
  const [_, setIsLoading] = useAtom(loadingAtom);
  const { isOpen, openModal, closeModal } = useModal();

  const { register, handleSubmit, watch, reset } = useForm<TUserProfile>({
    defaultValues: ResetUserProfile
  });
  
  const update = async (body: TUserProfile) => {
    try {
    const { status, data} = await api.put(`/users`, body, configApi());
      resolveResponse({status, ...data});
      getUser();
      closeModal();
    } catch (error) {
      resolveResponse(error);
    }
  };

  const uploadFile = async (file: File[]) => {
    const formBody = new FormData();
    formBody.append("id", watch("id")!);
    const fileToUpload = file[0];
    formBody.append('photo', fileToUpload);
    await updatePhoto(formBody);
  };
  
  const updatePhoto = async (form: FormData) => {
    try {
      const { status, data} = await api.put(`/users/profile-photo`, form, configApi(false));
      const result = data.result.data;
      localStorage.setItem("telemovviPhoto", result.photo);
      
      setUserLogger({
        ...userLogger,
        photo: result.photo
      });
      resolveResponse({status, ...data});
    } catch (error) {
      resolveResponse(error);
    }
  };

  const normalizeName = (name: string) => {
    if(name) return name.slice(0, 1);
  };

  const getUser = async () => {
    try {
      setIsLoading(true);
      const {data} = await api.get(`/users/logged`, configApi());
      const result = data.result.data;
      
      if(result.photo) {
        setUserLogger({
          name: result.name,
          email: result.email,
          photo: result.photo
        });
      };
  
      reset({
        id: result.id,
        name: result.name,
        email: result.email,
        phone: result.phone
      });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 flex justify-center items-center overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              {
                userLogger.photo ?
                <img className="w-full h-full object-cover rounded-full bg-white border border-gray-200 dark:border-gray-800" src={userLogger.photo} alt="foto do usuário" />
                :
                <p className="font-bold text-6xl text-gray-800 dark:text-white/90">{normalizeName(userLogger.name)}</p>
              }
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {userLogger.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userLogger.email}
                </p>
              </div>
            </div>
          </div>
          <button onClick={openModal} className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            Editar
          </button>
        </div>
      </div>
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Perfil
            </h4>
          </div>
          <form onSubmit={handleSubmit(update)} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label title="Nome completo" />
                    <input placeholder="Seu nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label title="E-mail" />
                    <input placeholder="Seu e-mail" {...register("email")} type="email" className="input-erp-primary input-erp-default"/>
                  </div>
                  <div className="col-span-2">
                    <DropzoneComponent sendFile={uploadFile} title="Foto de Perfil" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
              <Button type="submit" size="sm">Salvar</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
