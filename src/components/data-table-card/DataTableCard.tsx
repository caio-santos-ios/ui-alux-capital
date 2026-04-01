import { TPagination } from "@/types/global/pagination.type"
import Pagination from "../tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../table/Table";
import { maskDate } from "@/utils/mask.util";
import { TDataTableColumns } from "@/types/global/data-table-card.type";
import { ReactNode } from "react";

type TProps = {
    pagination: TPagination;
    columns: TDataTableColumns[];
    changePage: (page: number) => void;
    actions?: (row: any) => ReactNode;
    heightContainer?: string;
    isActions?: boolean;
}

export const DataTableCard = ({pagination, columns, changePage, actions, isActions = false, heightContainer = "max-h-[calc(100dvh-16rem)] md:max-h-[calc(100dvh-16.5rem)]"}: TProps) => {
    const normalizeTableCell = (value: any, type: string) => {
        switch(type) {
            case "date":
                return maskDate(value);
            case "dateTime":
                return maskDate(value, "seconds");
            case "booleanYesNo":
                return value ? "Sim" : "Não";
            default:
                return value;
        }   
    };

    return (
        <>
            <div className={`rounded-xl border border-gray-200 bg-white dark:border-white/5 dark:bg-white/3 mb-3`}>
                <div className={`${heightContainer} max-w-full overflow-x-auto`}>
                    <div className="min-w-[1102px] divide-y hidden md:block">
                        <Table className="divide-y">
                            <TableHeader className="border-b border-gray-100 dark:border-white/5 tele-table-thead">
                                <TableRow>
                                    {
                                        columns.map((column) => (
                                            <TableCell key={column.label} isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">{column.title}</TableCell>
                                        ))
                                    }
                                    {
                                        actions && isActions && (
                                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">Ações</TableCell>
                                        )
                                    }
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                                {pagination.data.map((x: any) => (
                                    <TableRow key={x.id}>
                                        {
                                            columns.map((column) => (
                                                <TableCell key={column.label} className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">{normalizeTableCell(x[column.label], column.type)}</TableCell>
                                            ))
                                        }
                                        {
                                            actions && isActions && (
                                                <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-500 dark:text-gray-400">
                                                    <div className="flex gap-3"> 
                                                        {actions(x)}
                                                    </div>
                                                </TableCell>
                                            )
                                        }
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </div>
                    
                    <div className="block md:hidden divide-y divide-gray-100 dark:divide-white/5">
                    {pagination.data.map((x: any) => (
                        <div key={x.id} className="px-4 py-4 flex flex-col gap-3">
                            {columns.length > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                                        {normalizeTableCell(x[columns[0].label], columns[0].type)}
                                    </span>
                                    {actions && isActions && (
                                        <div className="flex gap-2">
                                            {actions(x)}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {columns.slice(1).map((column) => (
                                    <div key={column.label} className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                            {column.title}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                            {normalizeTableCell(x[column.label], column.type)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            <Pagination currentPage={pagination.currentPage} totalCount={pagination.totalCount} totalData={pagination.data.length} totalPages={pagination.totalPages} onPageChange={changePage} />
        </>
    )
}