import { PointerEventHandler, ReactElement } from "react";
import { Vector2 } from "../../Vector2";
import { NodeBodyRow } from "./NodeBodyRow";
import { GraphNode } from "../../graph_types/GraphNode.ts";


export type NodeBodyProps<T> = {
    screen_position: Vector2.Vector2,
    font_scale: number,
    node: GraphNode<T>
    selected: boolean,
    onClick:PointerEventHandler<HTMLDivElement>
    onPointerDown?: PointerEventHandler<HTMLDivElement>
    children?: NodeBodyChildTypes | NodeBodyChildTypes[]
};

type NodeBodyChildTypes = ReactElement<any, typeof NodeBodyRow>;


export const NodeBody = <T,>(props: NodeBodyProps<T>) => {
    return <div
        style={{
            transform: `translate(${props.screen_position.x}px, ${props.screen_position.y}px)`,
            fontSize: `${props.font_scale}em`,
            borderColor: props.selected ? "rgb(190 40 64)" : ""
        }}
        className="absolute top-[calc(-1.2rem-4px)] left-0 rounded-md border-[2px] border-level-2 bg-level-1"
        onPointerDown={props.onPointerDown}
        onClick={props.onClick}
        title={props.node.id}
    >
        <div className="text-[0.8rem] leading-[1.2rem]  p-[0.1rem] ps-1 pe-1 bg-brand-accent rounded-t-[3px]">{props.node.title}</div>
        <div className="ml-[-2px] mr-[-2px]">
            {props.children}
        </div>
    </div>;
};
