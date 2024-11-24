import { Handle } from "./Handel";


export type NodeBodyRowProps = {
    handel_left?: ReturnType<typeof Handle>;
    handel_right?: ReturnType<typeof Handle>;
    children: React.ReactNode;
};

export const NodeBodyRow = (props: NodeBodyRowProps) => {
    return <div
        className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
    >
        <div className="relative">{props.handel_left}</div>
        <div className="text-end">{props.children}</div>
        <div className="relative">{props.handel_right}</div>
    </div>;
};
