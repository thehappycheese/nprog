import { PointerEvent } from "react";
import { ReactElement } from "react";
import { Vector2 } from "../../Vector2";
import { NodeBodyRow } from "./NodeBodyRow";


export type NodeBodyProps = {
    screen_position: Vector2.Vector2,
    font_scale: number,
    title: string,
    selected: boolean,
    onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void
}

type NodeBodyChildTypes = ReactElement<any, typeof NodeBodyRow>
type LocalNodeBodyProps = NodeBodyProps & {
    children: NodeBodyChildTypes | NodeBodyChildTypes[]
}

export const NodeBody = (props: LocalNodeBodyProps) => {
    return <div
        style={{
            transform: `translate(${props.screen_position.x}px, ${props.screen_position.y}px)`,
            fontSize: `${props.font_scale}em`,
            borderColor: props.selected ? "rgb(190 40 64)" : ""
        }}
        className="absolute top-0 left-0 box-border rounded-md border-[2px] border-level-2 bg-level-1"
        onPointerDown={props.onPointerDown}
    >
        <div className="text-sm p-[0.1rem] ps-1 pe-1 bg-brand-accent rounded-t-[3px]">{props.title}</div>
        <div className="">
            {props.children}
        </div>
    </div>;
};
