import { Handle } from "./Handel";


export type NodeBodyRowProps = {
    handel_left?: ReturnType<typeof Handle>;
    handel_right?: ReturnType<typeof Handle>;
    align?: "left" | "right"
    children?: React.ReactNode;
};
export const NodeBodyRow = (props: NodeBodyRowProps) => {
    return <div
        className="grid grid-cols-[auto_1fr_auto] gap-3 pt-[0.2em] pb-[0.2em]"
    >
        <div className="relative">{props.handel_left}</div>
        <div
            style={{
                textAlign: props.align === "left" ? "left" : props.align === "right" ? "right" : undefined
            }}
        >{props.children}</div>
        <div className="relative">{props.handel_right}</div>
    </div>;
};
