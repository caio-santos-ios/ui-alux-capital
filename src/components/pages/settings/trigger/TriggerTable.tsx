"use client";

import { DataTableCard } from "@/components/data-table-card/DataTableCard";
import { IconDelete } from "@/components/icons/iconDelete/IconDelete";
import { IconEdit } from "@/components/icons/iconEdit/IconEdit";
import { ModalDelete } from "@/components/modal-delete/ModalDelete";
import { NotData } from "@/components/not-data/NotData";
import { useModal } from "@/hooks/useModal";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { paginationAtom } from "@/jotai/global/pagination.jotai";
import { triggerAtom, triggerModalAtom } from "@/jotai/settings/trigger.jotai";
import { api } from "@/service/api.service";
import { configApi, resolveResponse } from "@/service/config.service";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ResetTrigger, TTrigger } from "@/types/setting/trigger.type";
import { permissionDelete, permissionRead, permissionUpdate } from "@/utils/permission.util";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { TriggerModalCreate } from "./TriggerModalCreate";

const columns: TDataTableColumns[] = [
    { title: "Código",          label: "code",          type: "text"     },
    { title: "Nome",            label: "name",          type: "text"     },
    { title: "E-mail",          label: "email",         type: "text"     },
    { title: "Intervalo",       label: "intervalValue", type: "text"     },
    { title: "Unidade",         label: "intervalUnit",  type: "text"     },
    { title: "Próximo disparo", label: "nextFireAt",    type: "dateTime" },
    { title: "Data de Criação", label: "createdAt",     type: "date"     },
];

const module  = "A";
const routine = "A3";

export default function TriggerTable() {
    const [_, setLoading]       = useAtom(loadingAtom);
    const [pagination, setPagination] = useAtom(paginationAtom);
    const { isOpen, openModal, closeModal } = useModal();
    const [trigger, setTrigger] = useAtom(triggerAtom);
    const [modal, setModal]     = useAtom(triggerModalAtom);

    const getAll = async (page: number) => {
        try {
            setLoading(true);
            const { data } = await api.get(
                `/triggers?deleted=false&orderBy=createdAt&sort=desc&pageSize=10&pageNumber=${page}`,
                configApi()
            );
            const result = data.result;
            setPagination({
                currentPage: result.currentPage,
                data:        result.data,
                sizePage:    result.pageSize,
                totalPages:  result.totalPages,
                totalCount:  result.totalCount,
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
            await api.delete(`/triggers/${trigger.id}`, configApi());
            resolveResponse({ status: 204, message: "Excluída com sucesso" });
            closeModal();
            await getAll(pagination.currentPage);
        } catch (error) {
            resolveResponse(error);
        } finally {
            setLoading(false);
        }
    };

    const getObj = (obj: any, action: string) => {
        setTrigger(obj);
        if (action === "edit")   { setModal(true); setTrigger(obj); }
        if (action === "delete") { openModal(); }
    };

    const changePage = async (page: number) => {
        setPagination((prev) => ({ ...prev, currentPage: page }));
        await getAll(page);
    };

    useEffect(() => {
        if (permissionRead(module, routine)) getAll(1);
    }, [modal]);

    return (
        <div>
            {pagination.data.length > 0 ? (
                <DataTableCard
                    isActions={permissionUpdate(module, routine) || permissionDelete(module, routine)}
                    pagination={pagination}
                    columns={columns}
                    changePage={changePage}
                    actions={(obj) => (
                        <>
                            {permissionUpdate(module, routine) && (
                                <IconEdit action="edit" obj={obj} getObj={getObj} />
                            )}
                            {permissionDelete(module, routine) && (
                                <IconDelete action="delete" obj={obj} getObj={getObj} />
                            )}
                        </>
                    )}
                />
            ) : (
                <NotData />
            )}
            <ModalDelete
                confirm={destroy}
                isOpen={isOpen}
                closeModal={closeModal}
                title="Excluir Trigger"
                description="Deseja excluir esta trigger?"
            />
            <TriggerModalCreate />
        </div>
    );
}