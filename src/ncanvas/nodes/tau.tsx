import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { Handle, NodeBody, NodeBodyRow } from "./basics.tsx";
import { assignHandelRef } from "./assignHandelRef.tsx";





export const NodeTau = forwardRef(
    (
        props: NodeProps,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {
        return <NodeBody
            {...props}
        >
            <NodeBodyRow
                handel_right={<Handle
                    background_color="white"
                    ref={assignHandelRef(ref, props.node.id, "H1")}
                />}
            >
                Tau
            </NodeBodyRow>
        </NodeBody>
    });
