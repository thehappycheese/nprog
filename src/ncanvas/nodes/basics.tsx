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
        <div className="text-sm p-1 bg-brand-accent rounded-t-[3px]">{props.node.title}</div>
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
