"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { api } from "@/service/api.service";
import { configApi } from "@/service/config.service";
import { TDashboardMonthlySales } from "@/types/dashboard/dashboard-card.type";
import { useAtom } from "jotai";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { selectedStoreAtom } from "@/jotai/dashboard/dashboard.jotai";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function MonthlySalesChart() {
  const [data, setData] = useState<TDashboardMonthlySales | null>(null);
  const [loading, setLoading] = useAtom(loadingAtom);
  const [selectedStore] = useAtom(selectedStoreAtom);

  useEffect(() => {
    setLoading(false);
    // api
    //   .get(`/dashboard/monthly-sales?selectedStore=${selectedStore}`, configApi())
    //   .then((res) => setData(res.data?.result?.data ?? null))
    //   .catch(() => setData(null))
    //   .finally(() => setLoading(false));
  }, []);

  const totals = data?.totals ?? Array(12).fill(0);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 4, colors: ["transparent"] },
    xaxis: {
      categories: MESES,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      labels: {
        formatter: (val) => formatCurrency(val),
      },
      title: { text: undefined },
    },
    grid: { yaxis: { lines: { show: true } } },
    fill: { opacity: 1 },
    tooltip: {
      x: { show: false },
      y: { formatter: (val) => formatCurrency(val) },
    },
  };

  const series = [
    {
      name: "Vendas",
      data: totals,
    },
  ];

  return (
    !loading &&
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Vendas Mensais
        </h3>
        {loading && (
          <span className="text-xs text-gray-400 dark:text-gray-500 animate-pulse">
            Carregando...
          </span>
        )}
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}