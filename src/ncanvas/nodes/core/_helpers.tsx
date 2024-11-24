import { ForwardedRef } from "react";



export const assignHandelRef = (
    outer_ref: ForwardedRef<Record<string, Record<string, HTMLDivElement>>>,
    node_id: string,
    handel_id: string
) => (handel_div: HTMLDivElement | null) => {
    if (outer_ref === null) return;

    if (typeof outer_ref === "function") {
        // TODO: unhandled
        throw new Error("Not sure how to handel this callback ref");
    } else {
        outer_ref.current = outer_ref.current ?? {};
        outer_ref.current = {
            ...outer_ref.current,
            [node_id]: {
                ...(outer_ref.current[node_id] ?? {}),
                ...(handel_div ? { [handel_id]: handel_div } : {})
            }
        };
    }
};
