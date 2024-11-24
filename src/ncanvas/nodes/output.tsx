import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { Handle, NodeBody } from "./basics.tsx";
import { assignHandelRef } from "./assignHandelRef.tsx";


export const NodeOutput = forwardRef(
    (
        props: NodeProps,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {

        return <NodeBody
            {...props}
        >
            <div
                className="grid grid-cols-[auto_1fr_auto] gap-3 pt-2 pb-2 ml-[-2px] mr-[-2px]"
            >
                <div className="relative">
                    <Handle
                        background_color="white"
                        ref={assignHandelRef(ref, props.node.id, "H1")}
                    /></div>
                <div className="text-start">Output</div>
                <div className="relative"></div>
            </div>
        </NodeBody>
    });
