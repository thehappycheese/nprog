import { GraphNode } from "../../graph_types";
import { PointerHandelHandler } from "./Handel";
import { NodeBodyProps } from "./NodeBody";



export type NodeProps<T> = {
    node: GraphNode<T>;
    body_props: Omit<NodeBodyProps<T>, "children">;
    onPointerDownHandel: PointerHandelHandler;
    onPointerUpHandel: PointerHandelHandler;
} & (T extends null | undefined ? object : {
    set_node_data?: (new_value: T) => void;
});
