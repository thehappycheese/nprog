import { ForwardedRef, forwardRef } from "react";
import { GraphNode } from "../graph_types.tsx";
import { Vector2 } from "../Vector2.tsx";
import { Handle, NodeBody } from "./basics.tsx";
import { assignHandelRef } from "./assignHandelRef.tsx";


export const NodeOutput = forwardRef(
    (
        props: {
            node: GraphNode;
            screen_position: Vector2.Vector2;
            screen_size: Vector2.Vector2;
            screen_padding: Vector2.Vector2;
            font_scale:number;
        },
        ref:ForwardedRef<Record<string,Record<string, HTMLDivElement>>>
    ) => {
    
    return <NodeBody
        screen_padding={props.screen_padding}
        screen_size={props.screen_size}
        screen_position={props.screen_position}
        font_scale={props.font_scale}
    >
        <div
            className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
        >
            <div className="relative">
                <Handle
                    background_color="green"
                    ref = {assignHandelRef(ref, props.node.id, "H1")}
            /></div>
            <div className="text-end">Output</div>
            <div className="relative"></div>
        </div>
    </NodeBody>
});
