"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useModal } from "@/hooks/useModal";
import { IconEdit } from "@/components/icons/iconEdit/IconEdit";
import { IconDelete } from "@/components/icons/iconDelete/IconDelete";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { UserModalCreate } from "./UserModalCreate";
import { userAtom, userModalAtom, userModalUpdatePasswordAtom } from "@/jotai/master-data/user.jotai";
import { chatOpenAtom } from "@/jotai/global/chat.jotai";
import { useChat } from "@/hooks/useChat";
import { MdChat } from "react-icons/md";
import { UserModalUpdatePassword } from "./UserModalUpdatePassword";
import { FaLock } from "react-icons/fa";

const columns: TDataTableColumns[] = [
  {title: "Nome", label: "name", type: "text"},
  {title: "E-mail", label: "email", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "date"},
]

const module = "B";
const routine = "B1";

export default function UserTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useAtom(userAtom);
  const [modal, setModal] = useAtom(userModalAtom);
  const [__, setModalUpdatePassword] = useAtom(userModalUpdatePasswordAtom);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserAdmin, setCurrentUserAdmin] = useState<boolean>(false);

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/users?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
      const result = data.result;

      setPagination({
        currentPage: result.currentPage,
        data: result.data,
        sizePage: result.pageSize,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
      });
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };
  
  const destroy = async () => {
    try {
      setLoading(true);
      await api.delete(`/users/${user.id}`, configApi());
      resolveResponse({status: 204, message: "Excluído com sucesso"});
      closeModal();
      await getAll(pagination.currentPage);
    } catch (error) {
      resolveResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const getObj = (obj: any, action: string) => {
    setUser(obj);

    if(action == "edit") {
      setModal(true);
    };
    
    if(action == "update-password") {
      setModalUpdatePassword(true);
    };

    if(action == "delete") {
      openModal();
    };
  };

  const changePage = async (page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));

    await getAll(page);
  };

  useEffect(() => {
    if(permissionRead(module, routine)) {
      const id = localStorage.getItem("AluxCapitalId");
      const admin = localStorage.getItem("AluxCapitalAdmin");
      if(id) setCurrentUserId(id);
      if(admin) setCurrentUserAdmin(admin == "true");
      getAll(1);
    };
  }, [modal]);

  return (
    <div>
      {
        pagination.data.length > 0 ? 
        <DataTableCard isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)} pagination={pagination} columns={columns} changePage={changePage} actions={(obj) => (
          <>
            {
              permissionUpdate(module, routine) && (obj.id == currentUserId || currentUserAdmin) &&
              <div title="Alterar Senha" onClick={() => getObj(obj, "update-password")} className="cursor-pointer text-blue-400 hover:text-blue-500">
                <FaLock />
              </div>
            }
            {
              permissionUpdate(module, routine) &&
              <IconEdit action="edit" obj={obj} getObj={getObj}/>
            }
            {
              permissionDelete(module, routine) &&
              <IconDelete action="delete" obj={obj} getObj={getObj}/> 
            }
          </>
        )
        }/>
        :
        <NotData />
      }
      <ModalDelete confirm={destroy} isOpen={isOpen} closeModal={closeModal} title="Excluir Usuário" />
      <UserModalCreate />
      <UserModalUpdatePassword />
    </div>    
  );
}