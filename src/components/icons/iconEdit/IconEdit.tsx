import { MdEdit } from "react-icons/md";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconEdit = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Editar" onClick={() => getObj(obj, action)} className="cursor-pointer text-yellow-400 hover:text-yellow-500">
            <MdEdit />
        </div>
    );
};