import { ForwardedRef, forwardRef } from "react";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle, HandleRefRegistry } from "./core/Handel.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { HandelType } from "../graph_types/HandelReference.ts";
import { NodeProps } from "./core/NodeProps.ts";


export const NodeTau = forwardRef(
    (
        props: NodeProps<number>,
        ref: ForwardedRef<HandleRefRegistry>
    ) => {
        return <NodeBody
            {...props.body_props}
        >
            <NodeBodyRow
                handel_right={<Handle
                    background_color="white"
                    handel_reference={{ node_id: props.node.id, handel_id: "R0" }}
                    handel_type={HandelType.output}
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    node_id={props.node.id}
                    handel_id="R0"
                    ref={ref}
                />}
            >
                Tau
            </NodeBodyRow>
        </NodeBody>
    });
