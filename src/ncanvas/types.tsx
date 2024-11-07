// Assuming Vector2 is something like this:
export interface Vector2 {
    x: number;
    y: number;
}

// Define a Handle, which represents connection points on nodes
export interface Handle {
    id: string;
    type: 'input' | 'output'; // 'input' for receiving data, 'output' for sending data
}

// Define a NodeComponent to represent functional components within each node
export interface NodeComponent {
    id: string;
    type: string; // e.g., 'math', 'color', 'transform', etc.
    handles: Handle[]; // Components have handles for connecting edges
}

// Node interface representing each node on the graph
export interface GraphNode {
    id: string;
    title: string;
    position: Vector2;
    size: Vector2;
    components: NodeComponent[];
}

// Edge interface representing the connections between nodes
export interface GraphEdge {
    id: string;
    sourceNodeId: string;
    targetNodeId: string;
    sourceHandleId: string;
    targetHandleId: string;
}