"use client";

import { loadingAtom } from "@/jotai/global/loading.jotai";
import { useAtom } from "jotai";
import Link from "next/link";
import { useEffect } from "react";

export default function NotFound() {
  const [_, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <div className="mx-auto w-full text-center">
        <h1 className="mb-8 font-bold text-gray-800 text-title-md dark:text-white/90 xl:text-title-2xl">
          EM DESENVOLVIMENTO
        </h1>

        <p className="mt-10 mb-6 text-base text-gray-700 dark:text-gray-400 sm:text-lg">
          Não conseguimos encontrar a página que você está procurando!
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/ dark:hover:text-gray-200"
        >
          Voltar
        </Link>
      </div>

      <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
        &copy; {new Date().getFullYear()} - Telemovvi
      </p>
    </div>
  );
}
