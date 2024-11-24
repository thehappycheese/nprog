import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";


export const NodeOutput = forwardRef(
    (
        props: NodeProps<null>,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {

        return <NodeBody
            // title={props.node.title}
            // screen_position={props.screen_position}
            // font_scale={props.font_scale}
            {...props}
        >
            <div
                className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
            >
                <div className="relative">
                    <Handle
                        background_color="white"
                        ref={assignHandelRef(ref, props.node.id, "L0")}
                    /></div>
                <div className="text-start">Output</div>
                <div className="relative"></div>
            </div>
        </NodeBody>
    });
