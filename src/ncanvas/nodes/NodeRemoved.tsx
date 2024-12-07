import { ForwardedRef, forwardRef } from "react";
import { NodeBody } from "./core/NodeBody.tsx";
import { HandleRefRegistry } from "./core/Handel.tsx";
import { NodeBodyRow } from "./core/NodeBodyRow.tsx";
import { NodeProps } from "./core/NodeProps.ts";


export const NodeRemoved = forwardRef(
    (
        props: NodeProps<string>,
        ref: ForwardedRef<HandleRefRegistry>
    ) => {

        return <NodeBody
            {...props.body_props}
        >
            <NodeBodyRow>
                The NodeType that was meant to be here
                '{props.node.registered_type}' has been removed and could not be restored.
                Sadly this means this save is corrupted.
            </NodeBodyRow>
        </NodeBody>
    });
