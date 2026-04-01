"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon } from "../icons/index";
import { useAtom } from "jotai";
import { iconAtom } from "@/jotai/global/icons.jotai";
import { userAdmin } from "@/jotai/auth/auth.jotai";
import { NavItem } from "@/types/global/menu.type";
import { menuRoutinesAtom } from "@/jotai/global/menu.jotai";
import { Logo } from "@/components/logo/Logo";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [icons] = useAtom(iconAtom);
  const [isAdmin] = useAtom(userAdmin);
  const [menu] = useAtom(menuRoutinesAtom);

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [filteredNav, setFilteredNav] = useState<NavItem[]>([]);

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  const getAuthorizedMenu = useCallback(() => {
    if (typeof window === "undefined") return [];

    const modulesStr = localStorage.getItem("telemovviModules");
    const masterStr = localStorage.getItem("telemovviMaster");
    const isMaster = masterStr ? masterStr == "true" : false;

    if (!modulesStr) return menu;

    const modules: any[] = JSON.parse(modulesStr);
    return menu.map((item) => {
      const newItem = { ...item };
      newItem.authorized = false;

      if(isMaster) {
        newItem.authorized = true;
        newItem.subItems = newItem.subItems?.map((sub) => ({
          ...sub,
          authorized: true
        }));
      } else {
        const foundModule = modules.find((m: any) => m.code === newItem.code);
        if(foundModule && foundModule.code != "A") {
          if (foundModule && foundModule.routines.length > 0) {
            let authorized = false;
  
            foundModule.routines.forEach((x: any) => {
              if(x.permissions.read || x.permissions.create || x.permissions.update || x.permissions.delete) {
                authorized = true;
              }
            });
            
            newItem.authorized = authorized;
            
            foundModule.routines.find((x: any) => console.log(x.permissions))
  
            newItem.subItems = newItem.subItems?.map((sub) => ({
              ...sub,
              authorized: foundModule.routines.some((x: any) => 
                x.code === sub.code && (
                  x.permissions.read || 
                  x.permissions.create || 
                  x.permissions.update || 
                  x.permissions.delete
                )
              )
            }));
          }
        }
      }

      return newItem;
    });
  }, []);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  useEffect(() => {
    setFilteredNav(getAuthorizedMenu());
  }, [getAuthorizedMenu]);

  return (
    <aside 
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-2 border-r border-gray-200 
      ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"} 
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href={`${isAdmin ? '/dashboard' : '/master-data/profile'}`} className="w-full flex justify-center">
          {isExpanded || isHovered || isMobileOpen ? (
            <Logo width={80} height={80} />
          ) : (
            <Logo width={40} height={40} />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {filteredNav.map((nav, index) => {
              const IconComponent = nav.icon ? icons[nav.icon] : null;
              const hasAccess = nav.authorized || isAdmin;

              if (!hasAccess) return null;

              return (
                <li key={nav.name}>
                  {nav.subItems ? (
                    <>
                      <button 
                        onClick={() => handleSubmenuToggle(index)}
                        className={`menu-item group ${openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"} cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                      >
                        <span className={openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                          {IconComponent && <IconComponent size={15} />}
                        </span>
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <>
                            <span className="menu-item-text">{nav.name}</span>
                            <ChevronDownIcon className={`ml-auto w-5 h-5 transition-transform duration-200 ${openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""}`} />
                          </>
                        )}
                      </button>

                      <div 
                        ref={(el) => { subMenuRefs.current[`${index}`] = el; }} 
                        className="overflow-hidden transition-all duration-300" 
                        style={{ height: !isMobileOpen && !isExpanded && !isHovered ? "0px" : openSubmenu?.index === index ? `${subMenuHeight[`${index}`]}px` : "0px" }}>
                        <ul className="mt-2 space-y-1 ml-9">
                          {nav.subItems.map((subItem) => (subItem.authorized || isAdmin) && (
                            <li key={subItem.name}>
                              <Link 
                                href={subItem.path} 
                                className={`menu-dropdown-item ${isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                                {subItem.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link href={nav.path || "#"} className={`menu-item group ${isActive(nav.path || "") ? "menu-item-active" : "menu-item-inactive"}`}>
                      <span className={isActive(nav.path || "") ? "menu-item-icon-active" : "menu-item-icon-inactive"}>
                        {IconComponent && <IconComponent size={15} />}
                      </span>
                      {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;