import { ResetUser, TUser } from "@/types/master-data/user/user.type";
import { atom } from "jotai";

export const userModalAtom = atom<boolean>(false);
export const userAtom = atom<TUser>(ResetUser);