import { NodeOutput, NodeTau } from "./nodes";
import { Vector2 } from "./Vector2";

// Define a Handle, which represents connection points on nodes
export interface Handle {
    id: string;
    type: 'input' | 'output';
}

// Node interface representing each node on the graph
export interface GraphNode {
    id: string;
    title: string;
    position: Vector2.Vector2;
    size: Vector2.Vector2;
    registered_type: RegisteredNodeType
}

export interface HandelReference {
    node: string,
    handel: string
}

// Edge interface representing the connections between nodes
export interface GraphEdge {
    id: string;
    from: HandelReference,
    to: HandelReference
}


export type RegisteredNodeType = "tau" | "output";



export type NodeProps = {
    node: GraphNode;
    screen_position: Vector2.Vector2;
    screen_size: Vector2.Vector2;
    screen_padding: Vector2.Vector2;
    font_scale: number;
} & React.HTMLAttributes<HTMLDivElement>;



export const NodeRegistry: Record<
    RegisteredNodeType,
    React.ForwardRefExoticComponent<
        NodeProps
        & React.RefAttributes<Record<string, Record<string, HTMLDivElement>>>
    >
> = {
    "tau": NodeTau,
    "output": NodeOutput,
}
