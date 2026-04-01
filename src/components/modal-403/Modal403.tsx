"use client";

import { modal403Atom } from "@/jotai/auth/auth.jotai";
import { useAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Modal } from "../ui/modal";

export const Modal403 = () => {
    const [modal, setModal] = useAtom(modal403Atom);
    const pathname = usePathname();
    
    return (
        <Modal isOpen={modal && pathname != '/plans'} onClose={() => setModal(false)} showCloseButton={false} className="max-w-[700px] m-4">
            <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="px-2 pr-14">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">Assinatura do Plano</h4>
                </div>

                <form className="flex flex-col">
                    <div className="custom-scrollbar h-[150px] overflow-y-auto px-2 pb-3">
                        <div className="mt-7">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                                <div className="h-full flex col-span-1 justify-center items-center flex-col">
                                    <h1 className="font-semibold text-lg text-gray-800 dark:text-white/90">
                                        Gostou da experiência? Seu teste terminou, mas o sucesso da sua empresa não pode parar. Escolha o plano ideal e libere todos os recursos agora. <Link href="/plans" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">Acessar Planos</Link>
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </Modal> 
    )
}