import { HandelReference } from "./HandelReference";


export interface GraphEdge {
    id: string;
    from: HandelReference;
    to: HandelReference;
}
