import { ForwardedRef, forwardRef } from "react";
import { NodeProps } from "../graph_types.tsx";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";


export const NodeValue = forwardRef(
    (
        props: NodeProps<number>,
        ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>
    ) => {

        return <NodeBody
            {...props.body_props}
        >
            <NodeBodyRow
                handel_right={<Handle
                    background_color="white"
                    handel_reference={{ node_id: props.node.id, handel_id: "R0" }}
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    ref={assignHandelRef(ref, props.node.id, "R0")}
                />}>
                <input type="number"
                    size={10}
                    value={props.node.data}
                    onPointerDown={e => e.stopPropagation()}
                    onChange={e => props.set_node_data && props.set_node_data(parseFloat(e.target.value))}
                />
            </NodeBodyRow>
        </NodeBody>
    });
