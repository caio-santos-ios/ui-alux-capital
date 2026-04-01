export type TResetPassword = {
    email: string;
    password: string;
    newPassword: string;
    code: string;
}

export const ResetPassword: TResetPassword = {
    email: "",
    password: "",
    newPassword: "",
    code: ""
} 