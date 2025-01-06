import { ForwardedRef, forwardRef } from "react";
import { NodeBody } from "./core/NodeBody.tsx";
import { Handle } from "./core/Handel.tsx";
import { HandleRefRegistry } from "./core/HandleRefRegistry.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { HandelType } from "../graph_types/HandelReference.ts";
import { NodeProps } from "./core/NodeProps.ts";


export const NodeOutput = forwardRef(
    (
        props: NodeProps<null>,
        ref: ForwardedRef<HandleRefRegistry>
    ) => {

        return <NodeBody
            {...props.body_props}
            ref={ref}
        >
            <NodeBodyRow
                handel_left={<Handle
                    background_color="white"
                    handel_reference={{ node_id: props.node.id, handel_id: "L0" }}
                    handel_type={HandelType.input}
                    onPointerDown={props.onPointerDownHandel}
                    onPointerUp={props.onPointerUpHandel}
                    node_id={props.node.id}
                    handel_id="L0"
                    ref={ref}
                />}
            >
                Output
            </NodeBodyRow>
        </NodeBody>
    });
