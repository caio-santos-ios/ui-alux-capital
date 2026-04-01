import { FaTrash } from "react-icons/fa";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconDelete = ({obj, getObj, action}: TProp) => {

    return (
        <div title="Excluír" onClick={() => getObj(obj, action)} className="cursor-pointer text-red-400 hover:text-red-500">
            <FaTrash />
        </div>
    )
}