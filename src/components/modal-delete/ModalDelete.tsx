"use client";

import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { GoAlert } from "react-icons/go";
import ModalV2 from "../ui/modalV2";

type TProp = {
    isOpen: boolean;
    closeModal: () => void;
    confirm: () => void;
    title: string;
    description?: string;
};

export const ModalDelete = ({isOpen, closeModal, confirm, title, description = "Deseja excluir esse registro?"}: TProp) => {
    return (
        <ModalV2 isOpen={isOpen} onClose={closeModal} title={title}>
            <form className="flex flex-col p-6">
                <div className="custom-scrollbar h-[150px] overflow-y-auto px-2 pb-3">
                    <div className="mt-7">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                            <div className="h-full flex col-span-1 justify-center items-center flex-col">
                                <GoAlert className="text-red-600" size={80} />
                                <h1 className="font-semibold text-lg text-gray-800 dark:text-white/90">{description}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                    <Button size="sm" variant="outline" onClick={closeModal}>Cancelar</Button>
                    <Button size="sm" variant="primary" onClick={confirm}>Confirmar</Button>
                </div>
            </form>
        </ModalV2>    
    )
}