export type TSignUp = {
    companyName: string,
    name: string,
    email: string;
    phone: string;
    whatsapp: string;
    password: string;
    document: string;
    privacyPolicy: boolean;
}

export const ResetSignUp: TSignUp = {
    companyName: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    password: "",
    privacyPolicy: false,
    document: ""
} 