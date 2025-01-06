import { RegisteredNodeType } from "./RegisteredNodeType";
import { Vector2 } from "../Vector2";

export enum GraphItemType {
    NODE = "nd",
    REROUTE = "rr",
}

export interface GraphNode<T> {
    type: GraphItemType.NODE;
    id: string;
    title: string;
    position: Vector2;
    registered_type: RegisteredNodeType;
    data: T;
}

export interface GraphReroute {
    type: GraphItemType.REROUTE;
    id: string;
    title: string;
    position: Vector2;
}
