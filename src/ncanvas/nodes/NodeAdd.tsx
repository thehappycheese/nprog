import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";


export const NodeAdd = forwardRef(
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
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    handel_reference={{ node_id: props.node.id, handel_id: "L0" }}
                    ref={assignHandelRef(ref, props.node.id, "L0")}
                />}
            >
                Value
            </NodeBodyRow>
            <NodeBodyRow
                handel_left={<Handle
                    background_color="white"
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    handel_reference={{ node_id: props.node.id, handel_id: "L1" }}
                    ref={assignHandelRef(ref, props.node.id, "L1")}
                />}
            >
                Value
            </NodeBodyRow>
            <NodeBodyRow
                handel_right={<Handle
                    background_color="white"
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    handel_reference={{ node_id: props.node.id, handel_id: "R0" }}
                    ref={assignHandelRef(ref, props.node.id, "R0")}
                />}
            >
                Output
            </NodeBodyRow>

        </NodeBody>
    });
