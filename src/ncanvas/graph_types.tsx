import { NodeAdd } from "./nodes/NodeAdd";
import { NodeOutput } from "./nodes/NodeOutput";
import { NodeTau } from "./nodes/NodeTau";
import { NodeValue } from "./nodes/NodeValue";
import { Vector2 } from "./Vector2";
import { NodeBodyProps } from "./nodes/core/NodeBody";
import { PointerHandelHandler } from "./nodes/core/Handel";


export interface Handle {
    id: string;
    type: 'input' | 'output';
}

export interface GraphNode<T> {
    id: string;
    title: string;
    position: Vector2.Vector2;
    registered_type: RegisteredNodeType;
    data: T
}

export interface HandelReference {
    node_id: string,
    handel_id: string
}

export interface GraphEdge {
    id: string;
    from: HandelReference,
    to: HandelReference
}

export type NodeProps<T> = {
    node: GraphNode<T>;
    body_props: Omit<NodeBodyProps<T>, "children">;
    onPointerDownHandel: PointerHandelHandler;
    onPointerUpHandel: PointerHandelHandler;
} & (T extends null | undefined ? {} : {
    set_node_data?: (new_value: T) => void
});

export type RegisteredNodeType = "tau" | "output" | "add" | "value";

export const NodeRegistry: Record<
    RegisteredNodeType,
    React.ForwardRefExoticComponent<
        NodeProps<any>
        & React.RefAttributes<Record<string, Record<string, HTMLDivElement>>>
    >
> = {
    "tau": NodeTau,
    "output": NodeOutput,
    "add": NodeAdd,
    "value": NodeValue
}
