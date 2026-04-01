"use client";

import { useState, useEffect, useRef } from "react";

interface Props {
    options: any[];
    onSelect: (option: any) => void;
    onSearch: (search: string) => void;
    placeholder?: string;
    objKey: string;
    objValue: string;
    defaultValue?: string;
    disabled?: boolean;
}

export default function Autocomplete({ options, onSelect, onSearch, placeholder, objKey, objValue, defaultValue = "", disabled = false }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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
        if(defaultValue == "empty") {
            setSearchTerm("");
        } else {
            setSearchTerm(defaultValue || "");
        };
    }, [defaultValue]);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <input
                    disabled={disabled}
                    type="text"
                    className="input-erp-primary input-erp-default w-full pl-10"
                    placeholder={placeholder || "Buscar..."}
                    value={searchTerm}
                    onChange={(e) => {
                        onSearch(e.target.value);
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
            </div>

            {isOpen && options.length > 0 && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm dark:bg-gray-800">
                    {options.map((opt) => (
                        <li key={opt[objKey]} className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-brand-500 hover:text-white dark:text-gray-200"
                            onClick={() => {
                                onSelect(opt);
                                setSearchTerm(opt[objValue]);
                                setIsOpen(false);
                            }}
                            >
                            <div className="flex flex-col">
                                <span className="font-semibold">{opt[objValue]} 
                                    {
                                        opt["isOutOfStock"] &&
                                        <span> - <span className="text-red-400">SEM ESTOQUE</span></span>
                                    }
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
{/* '
            {searchTerm && (
                <button 
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => {
                        setSearchTerm("");
                        onSelect([]); 
                    }}
                >
                    ✕
                </button>
            )}' */}
        </div>
    );
}