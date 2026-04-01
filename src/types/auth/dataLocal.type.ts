export type TDataLocal = {
    token: string;
    refreshToken: string;
    name: string;
    email: string;
    admin: string;
    master: string;
    photo: string;
    logoCompany: string;
    nameCompany: string;
    nameStore: string;
    modules: any[];
    typeUser: string;
    typePlan: string;
    subscriberPlan: string;
    expirationDate: string;
    id: string;
}

export const ResetDataLocal: TDataLocal = {
    token: "",
    refreshToken: "",
    name: "",
    email: "",
    admin: "",
    master: "",
    photo: "",
    logoCompany: "",
    nameCompany: "",
    nameStore: "",
    modules: [],
    typeUser: "",
    typePlan: "",
    subscriberPlan: "",
    expirationDate: "",
    id: ""
} 