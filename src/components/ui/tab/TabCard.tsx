import { ReactNode } from "react"

type TProps = {
    children: ReactNode
}

export const TabCard = ({children}: TProps) => {
    return <div>{children}</div>
}