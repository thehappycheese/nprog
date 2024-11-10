import { Vector2 } from "./Vector2";

// Define a Handle, which represents connection points on nodes
export interface Handle {
    id: string;
    type: 'input' | 'output';
}

// Define a NodeComponent to represent functional components within each node
export interface NodeComponent {
    id: string;
    type: string;
    handles: Handle[];
}

// Node interface representing each node on the graph
export interface GraphNode {
    id: string;
    title: string;
    position: Vector2;
    size: Vector2;
    components: Array<NodeComponent>;
}

// Edge interface representing the connections between nodes
export interface GraphEdge {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandleId: string;
    targetHandleId: string;
}
