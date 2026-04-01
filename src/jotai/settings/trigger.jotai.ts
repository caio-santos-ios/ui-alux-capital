import { ResetTrigger, TTrigger } from "@/types/setting/trigger.type";
import { atom } from "jotai";

export const triggerAtom = atom<TTrigger>(ResetTrigger);
export const triggerModalAtom = atom<boolean>(false);