import { ResetUserLogged, TUserLogged } from "@/types/master-data/user/user.type";
import { atom } from "jotai";

export const userLoggerAtom = atom<TUserLogged>(ResetUserLogged);
export const syncAtom = atom<boolean>(false);
export const userAdmin = atom<boolean>(false);
export const modal403Atom = atom<boolean>(false);