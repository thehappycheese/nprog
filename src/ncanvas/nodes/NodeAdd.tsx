import { ForwardedRef, forwardRef } from "react";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";
import { HandelType } from "../graph_types/HandelReference.ts";
import { NodeProps } from "./core/NodeProps.ts";


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
                    handel_type={HandelType.input}
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
                    handel_type={HandelType.input}
                    ref={assignHandelRef(ref, props.node.id, "L1")}
                />}
            >
                Value
            </NodeBodyRow>
            <NodeBodyRow
                align="right"
                handel_right={<Handle
                    background_color="white"
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    handel_reference={{ node_id: props.node.id, handel_id: "R0" }}
                    handel_type={HandelType.output}
                    ref={assignHandelRef(ref, props.node.id, "R0")}
                />}
            >
                Output
            </NodeBodyRow>

        </NodeBody>
    });
