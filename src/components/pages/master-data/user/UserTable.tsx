"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect } from "react";
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
import { userAtom, userModalAtom } from "@/jotai/master-data/user.jotai";
import { chatOpenAtom } from "@/jotai/global/chat.jotai";
import { useChat } from "@/hooks/useChat";
import { MdChat } from "react-icons/md";

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
  const { openChat } = useChat();
  const [__, setChatOpen] = useAtom(chatOpenAtom);

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
      setUser(obj);
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
    </div>    
  );
}