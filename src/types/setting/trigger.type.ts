export type TTrigger = {
    id?: string;
    code: string;
    name: string;
    email: string;
    intervalValue: number;
    intervalUnit: "minutes" | "hours" | "days";
    lastFiredAt?: string;
    nextFireAt?: string;
    active: boolean;
}

export const ResetTrigger: TTrigger = {
    id: "",
    code: "",
    name: "",
    email: "",
    intervalValue: 1,
    intervalUnit: "hours",
    active: true,
}

export const intervalUnitOptions = [
    { value: "minutes", label: "Minutos" },
    { value: "hours",   label: "Horas"   },
    { value: "days",    label: "Dias"    },
]