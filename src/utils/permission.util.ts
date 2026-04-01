const getFromStorage = (key: string) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
};

export const permissionRead = (module: string, subModule: string) => {
    const adminStr = getFromStorage("telemovviAdmin");
    if (adminStr == "true") return true;

    const modulesStr = getFromStorage("telemovviModules");
    if (modulesStr) {
        const modules = JSON.parse(modulesStr);
        const currentModule = modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = modules[currentModule].routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return modules[currentModule].routines[currentRoutine].permissions.read;
            }
        }
    }
    return false;
};

export const permissionCreate = (module: string, subModule: string) => {
    const adminStr = getFromStorage("telemovviAdmin");
    if (adminStr == "true") return true;

    const modulesStr = getFromStorage("telemovviModules");
    if (modulesStr) {
        const modules = JSON.parse(modulesStr);
        const currentModule = modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = modules[currentModule].routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return modules[currentModule].routines[currentRoutine].permissions.create;
            }
        }
    }
    return false;
};

export const permissionUpdate = (module: string, subModule: string) => {
    const adminStr = getFromStorage("telemovviAdmin");
    if (adminStr == "true") return true;

    const modulesStr = getFromStorage("telemovviModules");
    if (modulesStr) {
        const modules = JSON.parse(modulesStr);
        const currentModule = modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = modules[currentModule].routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return modules[currentModule].routines[currentRoutine].permissions.update;
            }
        }
    }
    return false;
};

export const permissionDelete = (module: string, subModule: string) => {
    const adminStr = getFromStorage("telemovviAdmin");
    if (adminStr == "true") return true;

    const modulesStr = getFromStorage("telemovviModules");
    if (modulesStr) {
        const modules = JSON.parse(modulesStr);
        const currentModule = modules.findIndex((m: any) => m.code == module);
        if (currentModule >= 0) {
            const currentRoutine = modules[currentModule].routines.findIndex((r: any) => r.code == subModule);
            if (currentRoutine >= 0) {
                return modules[currentModule].routines[currentRoutine].permissions.delete;
            }
        }
    }
    return false;
};