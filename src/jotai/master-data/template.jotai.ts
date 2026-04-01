import { ResetTemplate, TTemplate } from "@/types/setting/template.type";
import { atom } from "jotai";

export const templateAtom = atom<TTemplate>(ResetTemplate);
export const templateModalPreviewAtom = atom<boolean>(false);