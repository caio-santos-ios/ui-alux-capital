"use client";

import { useState, useEffect, useRef } from "react";
import { FiEdit2, FiPlus } from "react-icons/fi";

interface Props {
    options: any[];
    onSelect: (option: any) => void;
    onSearch: (search: string) => void;
    onAddClick?: () => void;
    onEditClick?: () => void;
    placeholder?: string;
    objKey: string;
    objValue: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function AutocompletePlus({ options, onSelect, onSearch, placeholder, objKey, objValue, defaultValue = "", disabled = false, onAddClick, onEditClick }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef(false); // trava após seleção

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (defaultValue === "empty") {
            setSearchTerm("");
        } else {
            setSearchTerm(defaultValue || "");
        }
    }, [defaultValue]);

    // Quando o pai atualiza options, só abre se NÃO foi uma seleção
    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current = false;
            return;
        }
        if (options.length > 0) setIsOpen(true);
    }, [options]);

    const handleSelect = (opt: any) => {
        selectedRef.current = true;
        setIsOpen(false);
        setSearchTerm(opt[objValue]);
        onSelect(opt);
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative flex items-center">
                <input
                    disabled={disabled}
                    type="text"
                    className="h-11 w-full rounded-lg border appearance-none py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-(--erp-primary-color) bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 pl-4 pr-15"
                    placeholder={placeholder || "Buscar..."}
                    value={searchTerm}
                    onChange={(e) => {
                        selectedRef.current = false;
                        setSearchTerm(e.target.value);
                        onSearch(e.target.value);
                    }}
                />
                {searchTerm ? (
                    <button
                        type="button"
                        onClick={onEditClick}
                        className="absolute right-0 p-3 bg-brand-500 hover:bg-brand-600 text-white transition-colors rounded-e-lg"
                        title="Editar"
                    >
                        <FiEdit2 size={20} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onAddClick}
                        className="absolute right-0 p-3 bg-brand-500 hover:bg-brand-600 text-white transition-colors rounded-e-lg"
                        title="Adicionar novo"
                    >
                        <FiPlus size={20} />
                    </button>
                )}
            </div>

            {isOpen && options.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800">
                    {options.map((opt) => (
                        <li
                            key={opt[objKey]}
                            className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-brand-500 hover:text-white dark:text-gray-200"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelect(opt);
                            }}
                        >
                            <span className="font-semibold">
                                {opt[objValue]}
                                {opt["isOutOfStock"] && (
                                    <span> - <span className="text-red-400">SEM ESTOQUE</span></span>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}