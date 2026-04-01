"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import { Portuguese } from "flatpickr/dist/l10n/pt";
import { TDashboardMonthlySales } from "@/types/dashboard/dashboard-card.type";
import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import { selectedStoreAtom } from "@/jotai/dashboard/dashboard.jotai";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

export default function StatisticsChart() {
  const datePickerRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    if (!datePickerRef.current) return;
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d M",
      locale: Portuguese,
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });
    return () => { if (!Array.isArray(fp)) fp.destroy(); };
  }, []);

  const totals = data?.totals ?? Array(12).fill(0);
  const counts = data?.counts ?? Array(12).fill(0);

  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: { curve: "straight", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { show: true },
      y: {
        formatter: (val, { seriesIndex }) =>
          seriesIndex === 0 ? formatCurrency(val) : `${val} pedidos`,
      },
    },
    xaxis: {
      type: "category",
      categories: MESES,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (val) => formatCurrency(val),
      },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = [
    { name: "Faturamento", data: totals },
    { name: "Qtd. Pedidos", data: counts },
  ];

  return (
    !loading &&
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Estatísticas
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Faturamento e pedidos por mês
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[310px]">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      )}
    </div>
  );
}