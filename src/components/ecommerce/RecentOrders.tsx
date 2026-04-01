"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "@/components/ui/badge/Badge";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { TDashboardRecentOrder } from "@/types/dashboard/dashboard-card.type";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { selectedStoreAtom } from "@/jotai/dashboard/dashboard.jotai";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}

function statusColor(status: string): "success" | "warning" | "error" | "info" {
  if (status === "Finalizado") return "success";
  if (status === "Em Aberto")  return "warning";
  if (status === "Cancelado")  return "error";
  return "info";
}

export default function RecentOrders() {
  const [orders, setOrders] = useState<TDashboardRecentOrder[]>([]);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [selectedStore] = useAtom(selectedStoreAtom);

  useEffect(() => {
    setLoading(false);
    // api
    //   .get(`/dashboard/recent-orders?selectedStore=${selectedStore}`, configApi())
    //   .then((res) => setOrders(res.data?.result?.data ?? []))
    //   .catch(() => setOrders([]))
    //   .finally(() => setLoading(false));
  }, []);

  return (
    !loading &&
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/3 sm:px-6 h-full">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Pedidos Recentes
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        {loading ? (
          <div className="space-y-3 py-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse dark:bg-gray-800" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
            Nenhum pedido encontrado.
          </p>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Código
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Cliente
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Vendedor
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Total
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Data
                </TableCell>
                <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    #{order.code}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.customerName || "Consumidor"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {order.sellerName || "—"}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatCurrency(order.total)}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={statusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}