import { NavItem } from "@/types/global/menu.type";
import { atom } from "jotai";

export const menuOpenAtom = atom<boolean>(false);
export const menuRoutinesAtom = atom<NavItem[]>([
  {
    icon: "MdChat",
    name: "Chat",
    authorized: false,
    code: "C",
    path: "/chat",          // ← sem subItems, vai direto para a rota
    subItems: undefined,
  },
  {
    icon: "FiSettings",
    name: "Configurações",
    authorized: false,
    code: "A",
    subItems: [
      {name: "Logs",          path: "/settings/logger",          code: "A1", pro: false, authorized: false },
      {name: "Templates",     path: "/settings/templates",       code: "A2", pro: false, authorized: false },
      {name: "Triggers",      path: "/settings/triggers",        code: "A3", pro: false, authorized: false },
    ]
  },
  {
    icon: "FiGrid",
    name: "Cadastros",
    authorized: false,
    code: "B",
    subItems: [
      {name: "Usuários",          path: "/master-data/users",          code: "B1", pro: false, authorized: false },
      {name: "Perfil de Usuário", path: "/master-data/profile-users",  code: "B2", pro: false, authorized: false },
    ]
  },
]);