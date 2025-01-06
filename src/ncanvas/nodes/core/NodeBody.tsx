import { ForwardedRef, forwardRef, PointerEventHandler, ReactNode } from "react";
import { Vector2 } from "../../Vector2";
import { GraphNode } from "../../graph_types/GraphNode.ts";
import { HandleRefRegistry } from "./HandleRefRegistry.tsx";
import { ensureMutableRef } from "../ensureMutableRef.tsx";


export type NodeBodyProps<T> = {
    screen_position: Vector2,
    font_scale: number,
    node: GraphNode<T>
    selected: boolean,
    onClick: PointerEventHandler<HTMLDivElement>
    onPointerDown: PointerEventHandler<HTMLDivElement>
    children?: ReactNode,
};

export const NodeBody = forwardRef(<T,>(
    props: NodeBodyProps<T>,
    ref: ForwardedRef<HandleRefRegistry>,
) => <div
        style={{
            transform: `translate(${props.screen_position.x}px, ${props.screen_position.y}px)`,
            fontSize: `${props.font_scale}em`,
            borderColor: props.selected ? "rgb(190 40 64)" : ""
        }}
        className="absolute top-[calc(-1.2rem-4px)] left-0 rounded-md border-[2px] border-level-2 bg-level-1"
        onPointerDown={props.onPointerDown}
        onClick={props.onClick}
        ref={node_div => {
            if(node_div===null) return;
            console.log("NodeBody processes HandleRefRegistry")
            ensureMutableRef(ref);
            ref.current[props.node.id] = ref.current[props.node.id] ?? { handles: {}, node_div };
            ref.current[props.node.id].node_div = node_div;
        }}
    >
        <div className="text-[0.8rem] leading-[1.2rem]  p-[0.1rem] ps-1 pe-1 bg-brand-accent rounded-t-[3px]" title={props.node.id}>
            {props.node.title}
        </div>
        <div className="ml-[-2px] mr-[-2px]">
            {props.children}
        </div>
    </div>
);
