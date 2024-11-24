import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";


export function NodeBody(props: NodeProps) {
    return <div
        style={{
            transform: `translate(${props.screen_position.x}px, ${props.screen_position.y}px)`,
            fontSize: `${props.font_scale}em`
        }}
        className="absolute top-0 left-0 box-border rounded-md border-[2px] border-level-2 bg-level-1"
        {...props}
    >
        <div className="text-sm p-[0.1em] ps-1 pe-1 bg-brand-accent rounded-t-[3px]">{props.node.title}</div>
        <div className="">
            {props.children}
        </div>
    </div>
}

export const Handle = forwardRef((props: {
    background_color: string
}, ref: ForwardedRef<HTMLDivElement>) => {
    const handle_size = 10;
    return <div
        ref={ref}
        style={{
            width: `${handle_size}px`,
            height: `${handle_size}px`,
            borderRadius: `${handle_size / 2}px`,
            backgroundColor: props.background_color,
            position: "absolute",
            left: `${-handle_size / 2}px`,
            top: `calc(50% - ${handle_size / 2}px)`,
        }}
    ></div>
})


export type NodeBodyRowProps = {
    handel_left?: ReturnType<typeof Handle>,
    handel_right?: ReturnType<typeof Handle>,
    children: React.ReactNode
}

export const NodeBodyRow = (props: NodeBodyRowProps) => {
    return <div
        className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
    >
        <div className="relative">{props.handel_left}</div>
        <div className="text-end">{props.children}</div>
        <div className="relative">{props.handel_right}</div>
    </div>
}