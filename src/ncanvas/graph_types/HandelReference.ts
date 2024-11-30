
export enum HandelType {
    input = "input",
    output = "output",
}

export interface HandelReference {
    node_id: string;
    handel_id: string;
}

export const HandelReference_compare = (a: HandelReference, b: HandelReference) =>
    (a.node_id === b.node_id) && (a.handel_id === b.handel_id);