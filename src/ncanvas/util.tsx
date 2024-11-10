import * as Vector2 from "./Vector2";
import { GraphNode } from "./graph_types";


export function hit_test_nodes(
    nodes: Array<GraphNode>,
    position: Vector2.Vector2
): GraphNode | undefined {
    let hit_test = Vector2.inside_rect(position)
    return nodes.find(node => hit_test(node.position, node.size));
}

