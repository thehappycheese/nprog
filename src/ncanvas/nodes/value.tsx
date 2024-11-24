import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { Handle, NodeBody, NodeBodyRow } from "./basics.tsx";
import { assignHandelRef } from "./assignHandelRef.tsx";


export const NodeValue = forwardRef(
    (
        props: NodeProps,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {

        return <NodeBody
            {...props}
        >
            <NodeBodyRow
                handel_left={<Handle
                    background_color="white"
                    ref={assignHandelRef(ref, props.node.id, "L1")}
                />}
            >
                <input type="number" />
            </NodeBodyRow>

            <NodeBodyRow
                handel_right={<Handle
                    background_color="white"
                    ref={assignHandelRef(ref, props.node.id, "R1")}
                />}
            >
                Output
            </NodeBodyRow>

        </NodeBody>
    });
