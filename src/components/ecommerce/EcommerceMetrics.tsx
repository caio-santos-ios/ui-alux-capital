"use client";
import { useEffect, useState } from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { TDashboardCards } from "@/types/dashboard/dashboard-card.type";
import { useAtom } from "jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { selectedStoreAtom } from "@/jotai/dashboard/dashboard.jotai";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value ?? 0);
}

export const EcommerceMetrics = () => {
  const [data, setData] = useState<TDashboardCards | null>(null);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [selectedStore] = useAtom(selectedStoreAtom);

  useEffect(() => {
    setLoading(false);
  }, [selectedStore]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-200 rounded-xl dark:bg-gray-700" />
            <div className="mt-5 space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded dark:bg-gray-700" />
              <div className="h-6 w-32 bg-gray-200 rounded dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const salesGrowthPositive = (data?.sales.growthPercent ?? 0) >= 0;
  const customersGrowthPositive = (data?.customers.growthPercent ?? 0) >= 0;

  return (
    !loading &&
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">

      {/* Card — Clientes do Mês */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Novos Clientes (Mês)
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatNumber(data?.customers.countMonth ?? 0)}
            </h4>
          </div>
          <Badge color={customersGrowthPositive ? "success" : "error"}>
            {customersGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(data?.customers.growthPercent ?? 0)}%
          </Badge>
        </div>
      </div>

      {/* Card — Vendas do Mês */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Vendas do Mês
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatCurrency(data?.sales.totalMonth ?? 0)}
            </h4>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatNumber(data?.sales.countMonth ?? 0)} pedidos •{" "}
              {formatNumber(data?.sales.openOrders ?? 0)} em aberto
            </span>
          </div>
          <Badge color={salesGrowthPositive ? "success" : "error"}>
            {salesGrowthPositive ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(data?.sales.growthPercent ?? 0)}%
          </Badge>
        </div>
      </div>

      {/* Card — Contas a Receber */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-xl dark:bg-green-900/20">
          <svg
            className="text-green-600 dark:text-green-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
            <polyline points="16 14 18 16 22 12" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Contas a Receber
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatCurrency(data?.accountsReceivable.totalAmount ?? 0)}
            </h4>
            <div className="mt-1 flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Em aberto: {formatCurrency(data?.accountsReceivable.openAmount ?? 0)}{" "}
                ({formatNumber(data?.accountsReceivable.openCount ?? 0)})
              </span>
              {(data?.accountsReceivable.overdueAmount ?? 0) > 0 && (
                <span className="text-xs text-red-500 dark:text-red-400">
                  Vencidas: {formatCurrency(data?.accountsReceivable.overdueAmount ?? 0)}{" "}
                  ({formatNumber(data?.accountsReceivable.overdueCount ?? 0)})
                </span>
              )}
            </div>
          </div>
          {(data?.accountsReceivable.overdueAmount ?? 0) > 0 ? (
            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              Vencidas
            </Badge>
          ) : (
            <Badge color="success">Em dia</Badge>
          )}
        </div>
      </div>

      {/* Card — Contas a Pagar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-xl dark:bg-red-900/20">
          <svg
            className="text-red-500 dark:text-red-400"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
            <line x1="12" y1="14" x2="12" y2="18" />
            <line x1="10" y1="16" x2="14" y2="16" />
          </svg>
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Contas a Pagar
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {formatCurrency(data?.accountsPayable.totalAmount ?? 0)}
            </h4>
            <div className="mt-1 flex flex-col gap-0.5">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Em aberto: {formatCurrency(data?.accountsPayable.openAmount ?? 0)}{" "}
                ({formatNumber(data?.accountsPayable.openCount ?? 0)})
              </span>
              {(data?.accountsPayable.overdueAmount ?? 0) > 0 && (
                <span className="text-xs text-red-500 dark:text-red-400">
                  Vencidas: {formatCurrency(data?.accountsPayable.overdueAmount ?? 0)}{" "}
                  ({formatNumber(data?.accountsPayable.overdueCount ?? 0)})
                </span>
              )}
            </div>
          </div>
          {(data?.accountsPayable.overdueAmount ?? 0) > 0 ? (
            <Badge color="error">
              <ArrowDownIcon className="text-error-500" />
              Vencidas
            </Badge>
          ) : (
            <Badge color="success">Em dia</Badge>
          )}
        </div>
      </div>

    </div>
  );
};