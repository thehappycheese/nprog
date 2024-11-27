import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.ts/index.ts";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";


export const NodeOutput = forwardRef(
    (
        props: NodeProps<null>,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {

        return <NodeBody
            {...props.body_props}
        >
            <NodeBodyRow
                handel_left={<Handle
                    background_color="white"
                    ref={assignHandelRef(ref, props.node.id, "L0")}
                    handel_reference={{ handel_type: "input", node_id: props.node.id, handel_id: "L0" }}
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                />}
            >
                Output
            </NodeBodyRow>
        </NodeBody>
    });
