import { ForwardedRef, forwardRef } from "react";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { assignHandelRef } from "./core/_helpers.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { HandelType } from "../graph_types/HandelReference.ts";
import { NodeProps } from "./core/NodeProps.ts";


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
                    handel_reference={{ node_id: props.node.id, handel_id: "L0" }}
                    handel_type={HandelType.input}
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                />}
            >
                Output
            </NodeBodyRow>
        </NodeBody>
    });
