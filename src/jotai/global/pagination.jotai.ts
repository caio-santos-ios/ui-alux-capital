import { TPagination } from "@/types/global/pagination.type";
import { atom } from "jotai";

export const paginationAtom = atom<TPagination>({
    data: [],
    totalPages: 1,
    totalCount: 100,
    currentPage: 1,
    sizePage: 10 
})