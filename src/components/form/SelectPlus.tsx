"use client";

import { FiPlus } from "react-icons/fi";
import { useAtom } from "jotai";

type TProp = {
    code: string;
    label: string;
    options?: { value: string; label: string }[];
    onAddClick?: () => void; 
    disabled?: boolean;
    genericTable?: string;
    [key: string]: any;
};

export const SelectPlus = ({options, code, label, onAddClick, disabled, genericTable, ...rest}: TProp) => {
    // const [_, setModal] = useAtom(genericTableModalCreateAtom);
    // const [__, setTable] = useAtom(genericTableTableAtom);

    return (
        <div className="relative">
            <select {...rest} disabled={disabled} className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 text-gray-800">
                {
                    options?.map((o: any) => (
                        <option key={o[code]} value={o[code]}>{o[label]}</option>
                    ))
                }
            </select>
            {
                genericTable ? (
                    <button
                        type="button"
                        // onClick={() => {
                        //     setTable(genericTable);
                        //     setModal(true);
                        // }}
                        className="absolute right-0 p-3 bg-brand-500 hover:bg-brand-600 text-white transition-colors rounded-e-lg"
                        title="Adicionar novo">
                        <FiPlus size={20} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onAddClick}
                        className="absolute right-0 p-3 bg-brand-500 hover:bg-brand-600 text-white transition-colors rounded-e-lg"
                        title="Adicionar novo">
                        <FiPlus size={20} />
                    </button>
                )
            }
        </div>
    );
}