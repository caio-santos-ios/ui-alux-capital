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
import { iconAtom } from "@/jotai/global/icons.jotai";
import { menuRoutinesAtom } from "@/jotai/global/menu.jotai";
import { NavItem, NavSubItem } from "@/types/global/menu.type";
import { ResetProfileUser, TProfileUser } from "@/types/setting/profile-permission.type";

type TProp = {
  id?: string;
};

export default function ProfileUserForm({id}: TProp) {
  const [_, setIsLoading] = useAtom(loadingAtom);
  const [icons] = useAtom(iconAtom);
  const [menus] = useAtom<NavItem[]>(menuRoutinesAtom);
  const [isMaster, setIsMaster] = useState(false);
  const router = useRouter();

  const { register, reset, setValue, watch, getValues } = useForm<TProfileUser>({
    defaultValues: ResetProfileUser
  });

  const modules = watch("modules");

  const save = async (body: TProfileUser) => {
    if(!body.id) {
      const bodyModules: any[] = [];
      menus.forEach(m => {
        const routines: any[] = [];
  
        m.subItems?.forEach(sm => {
          routines.push({
            code: sm.code,
            description: sm.name,
            permissions: {
              read: false,            
              create: false,            
              update: false,            
              delete: false
            }
          });
        });
  
        bodyModules.push({
          code: m.code,
          description: m.name,
          routines
        });
      });

      body.modules = bodyModules;
      await create(body);
    } else {
      await update(body);
    };
  } 
    
  const create: SubmitHandler<TProfileUser> = async (body: TProfileUser) => {
    try {
      setIsLoading(true);
      const {data} = await api.post(`/profile-users`, body, configApi());
      const result = data.result;
      resolveResponse({status: 201, message: result.message});
      router.push(`/master-data/profile-users/${result.data.id}`)
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const update: SubmitHandler<TProfileUser> = async (body: TProfileUser) => {
    try {
      setIsLoading(true);
      const {data} = await api.put(`/profile-users`, body, configApi());
      const result = data.result;
      resolveResponse({status: 200, message: result.message});
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getById = async (id: string) => {
    try {
      setIsLoading(true);
      const {data} = await api.get(`/profile-users/${id}`, configApi());
      const result = data.result.data;
      reset(result);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (moduleCode: string, routineCode: string, operation: string) => {
    const currentModules: any[] = [...modules]; 
    const moduleIndex = currentModules.findIndex(m => m.code === moduleCode);
    
    if (moduleIndex > -1) {
      const routineIndex = currentModules[moduleIndex].routines.findIndex((r: any) => r.code === routineCode);
      
      if (routineIndex > -1) {
        const permissions = currentModules[moduleIndex].routines[routineIndex].permissions;

        if (operation === "all") {
          const newValue = !permissions.read; 
          currentModules[moduleIndex].routines[routineIndex].permissions = {
            create: newValue,
            update: newValue,
            delete: newValue,
            read: newValue,
          };
        } else {
          currentModules[moduleIndex].routines[routineIndex].permissions[operation] = !permissions[operation];
        }

        setValue("modules", currentModules);
      }
    }
  };

  const isChecked = (moduleCode: string, routineCode: string, operation: string) => {
    const moduleItem = modules?.find(m => m.code === moduleCode);
    const routineItem: any = moduleItem?.routines?.find(r => r.code === routineCode);
    
    if (!routineItem) return false;

    if (operation === "all") {
      const p = routineItem.permissions;
      return p.create && p.update && p.delete && p.read;
    }

    return !!routineItem.permissions[operation];
  };

  useEffect(() => {
    const masterStr = localStorage.getItem("telemovviMaster");
    if(masterStr) setIsMaster(masterStr === "true");

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
        <div className="grid grid-cols-6 gap-2 max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-19rem)] overflow-y-auto">
          <div className="col-span-6 xl:col-span-2">
            <Label title="Nome"/>
            <input placeholder="Nome" {...register("name")} type="text" className="input-erp-primary input-erp-default"/>
          </div>
          <div className="col-span-6 xl:col-span-4">
            <Label title="Descrição" required={false}/>
            <input placeholder="Descrição" {...register("description")} type="text" className="input-erp-primary input-erp-default"/>
          </div>
          {
            id != "create" &&
            <div className="col-span-6">
              <h1 className="mt-4 mb-1.5 block text-lg font-medium text-gray-700 dark:text-gray-400">Módulos</h1>
              <ul className="grid grid-cols-6 gap-2">
                {
                  menus.map(menu => {
                    const IconComponent = icons[menu.icon];

                    if(menu.code === "A" && !isMaster) return null;

                    return (
                      <li className="col-span-6 lg:col-span-3 relative p-5 bg-white border border-gray-200 rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5" key={menu.code}>
                        <div className="space-y-4">
                          <div>
                            <h4 className="mb-5 mr-10 text-base font-semibold text-gray-800 dark:text-white/90">{menu.name}</h4>
                            
                            <ul className="flex flex-col gap-4">
                              {
                                menu.subItems!.map((r: NavSubItem) => {
                                  return (
                                    <li key={r.code} className="grid grid-cols-12">
                                      <div className="col-span-11 mb-5 mr-10 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        {r.name}
                                      </div>

                                      <div className="col-span-1">
                                        <input checked={isChecked(menu.code, r.code, 'all')} onChange={() => handlePermissionChange(menu.code, r.code, 'all')} type="checkbox" className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60" />
                                      </div>

                                      <div className="col-span-11 mb-0.5 mr-10 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Criação
                                        <p className="text-gray-500 text-sm">Permite que o usuário crie {r.name}</p>
                                      </div>

                                      <div className="col-span-1">
                                        <input checked={isChecked(menu.code, r.code, 'create')} onChange={() => handlePermissionChange(menu.code, r.code, 'create')} type="checkbox" className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60" />
                                      </div>
                                      
                                      <div className="col-span-11 mb-0.5 mr-10 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Edição
                                        <p className="text-gray-500 text-sm">Permite que o usuário edite {r.name}</p>
                                      </div>

                                      <div className="col-span-1">
                                        <input checked={isChecked(menu.code, r.code, 'update')} onChange={() => handlePermissionChange(menu.code, r.code, 'update')} type="checkbox" className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60" />
                                      </div>

                                      <div className="col-span-11 mb-0.5 mr-10 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Exclusão
                                        <p className="text-gray-500 text-sm">Permite que o usuário exclua {r.name}</p>
                                      </div>

                                      <div className="col-span-1">
                                        <input checked={isChecked(menu.code, r.code, 'delete')} onChange={() => handlePermissionChange(menu.code, r.code, 'delete')} type="checkbox" className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60" />
                                      </div>

                                      <div className="col-span-11 mb-0.5 mr-10 text-sm font-semibold text-gray-800 dark:text-white/90">
                                        Listagem
                                        <p className="text-gray-500 text-sm">Permite que o usuário liste {r.name}</p>
                                      </div>

                                      <div className="col-span-1">
                                        <input checked={isChecked(menu.code, r.code, 'read')} onChange={() => handlePermissionChange(menu.code, r.code, 'read')} type="checkbox" className="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-brand-500 disabled:opacity-60" />
                                      </div>
                                    </li>
                                  )
                                })
                              }
                            </ul>
                          </div>
                        </div>
                        <div className="h-6 absolute top-5 right-5 top w-full max-w-6 text-gray-800 dark:text-white/90">
                          {IconComponent && <IconComponent size={20} />}
                        </div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          }        
        </div>
      </ComponentCard>
      <Button onClick={() => save({...getValues()})} type="submit" className="w-full xl:max-w-20 mt-2" size="sm">Salvar</Button>
    </>
  );
}