"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { permissionRead } from "@/utils/permission.util";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { ResetUser, TUser } from "@/types/master-data/user/user.type";
import { NotData } from "@/components/not-data/NotData";
import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { TDataTableColumns } from "@/types/global/data-table-card.type";

const columns: TDataTableColumns[] = [
  {title: "Metodo", label: "method", type: "text"},
  {title: "Rota", label: "path", type: "text"},
  {title: "Mensagem", label: "message", type: "text"},
  {title: "Status", label: "statusCode", type: "text"},
  {title: "Data de Criação", label: "createdAt", type: "dateTime"},
  {title: "Auditoria", label: "audit", type: "booleanYesNo"},
]

const module = "A";
const routine = "A1";

export default function LoggerTable() {
  const [_, setLoading] = useAtom(loadingAtom);
  const [pagination, setPagination] = useAtom(paginationAtom); 
  const { openModal, closeModal } = useModal();
  const [user, setUser] = useState<TUser>(ResetUser);
  const router = useRouter();

  const getAll = async (page: number) => {
    try {
      setLoading(true);
      const {data} = await api.get(`/loggers?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`, configApi());
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
  }, []);

  return (
    <div>
      {
        pagination.data.length > 0 ? 
        <DataTableCard heightContainer="max-h-[calc(100dvh-14rem)] md:max-h-[calc(100dvh-14rem)]" pagination={pagination} columns={columns} changePage={changePage}/>
        :
        <NotData />
      }
    </div>    
  );
}