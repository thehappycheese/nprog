
export interface HandelReference {
    node_id: string;
    handel_id: string;
    handel_type: "input" | "output";
}

export const HandelReference_compare = (a: HandelReference, b: HandelReference) => a.handel_id === b.handel_id && b.node_id === b.node_id;