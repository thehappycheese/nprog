
import { RegisteredNodeType } from "./RegisteredNodeType";
import { Vector2 } from "../Vector2";

export interface GraphNode<T> {
    id: string;
    title: string;
    position: Vector2.Vector2;
    registered_type: RegisteredNodeType;
    data: T;
}
