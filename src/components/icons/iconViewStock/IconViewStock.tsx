import { BsBox2 } from "react-icons/bs";

type TProp = {
    action: string; 
    obj?: any;
    getObj: (action: string, obj?: any) => void;
}

export const IconViewStock = ({ obj, getObj, action }: TProp) => {
    return (
        <div title="Visualizar Estoque" onClick={() => getObj(obj, action)} className="cursor-pointer text-orange-400 hover:text-orange-500">
            <BsBox2 />
        </div>
    );
};