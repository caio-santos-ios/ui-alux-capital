export type TUser = {
    id: string;
    name: string;
    email: string;
    profileUserId: string;
    password: string;
}

export const ResetUser: TUser = {
    id: "",
    email: "",
    name: "",
    profileUserId: "",
    password: ""
}

export type TUserLogged = {
    photo: string;
    name: string;
    email: string;
}

export const ResetUserLogged: TUserLogged = {
    photo: "",
    name: "",
    email: ""
}

export type TUserProfile = {
    id?: string;
    photo: any;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
}

export const ResetUserProfile: TUserProfile = {
    id: "",
    photo: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
}