import { FaEye } from "react-icons/fa";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconView = ({ obj, getObj, action }: TProp) => {
    return (
        <div onClick={() => getObj(obj, action)} className="cursor-pointer text-blue-400 hover:text-blue-500">
            <FaEye />
        </div>
    );
};