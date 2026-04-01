import { ReactNode } from "react"

type TProps = {
    children: ReactNode
}

export const Tab = ({children}: TProps) => {
    return (
        <div className="flex items-center font-medium gap-2 rounded-lg transition  px-3 py-2 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/3 dark:hover:text-gray-300 w-full">
            {children}
        </div>
    )
}