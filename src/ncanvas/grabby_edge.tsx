import { handel_bezier } from "./bezier/handel_bezier.tsx";
import { solve_x } from "./bezier/solve_x.tsx";
import { GraphEdge } from "./graph_types/GraphEdge.ts";
import { HandelReference, HandelReference_compare, HandelType } from "./graph_types/HandelReference.ts";
import { Vector2 } from "./Vector2.tsx";

export const query_edge_by_from = (edges: GraphEdge[]) => (from: HandelReference) =>
    edges.find(item => HandelReference_compare(item.from, from));



export const grabby_edge = (
    edges: GraphEdge[],
    mouse_position_screen: Vector2.Vector2,
    handel_reference: HandelReference,
    get_handel_position: (reference: HandelReference) => Vector2.Vector2,
    grab_type: HandelType,
) => {
    let user_grabbed_edge_handles = edges.filter(
        grab_type == "output"
            ?
            (item => HandelReference_compare(
                item.from,
                handel_reference
            ))
            :
            (item => HandelReference_compare(
                item.to,
                handel_reference
            ))
    );
    if (user_grabbed_edge_handles.length > 0) {
        // read the position of the edge 20% of the way in, and pick the nearest edge to the mouse
        const edge_from_to = user_grabbed_edge_handles
            .map(edge => ({
                edge_id: edge.id,
                from: get_handel_position(edge.from),
                to: get_handel_position(edge.to)
            }));
        const edge_sample_near_click = edge_from_to
            .map(
                grab_type == "output"
                    ?
                    ({ edge_id, from, to }) => {
                        let result = solve_x(from.x + 5, t => handel_bezier(from, to, t))
                        if (result && result.t < 0.1) {
                            return { edge_id, partway: { x: from.x, y: result.y } };
                        } else {
                            return { edge_id, partway: { x: from.x, y: handel_bezier(from, to, 0.1).y } };
                        }
                    }
                    :
                    ({ edge_id, from, to }) => {
                        let result = solve_x(to.x - 5, t => handel_bezier(from, to, t))
                        if (result && result.t > 0.9) {
                            return { edge_id, partway: { x: to.x, y: result.y } };
                        } else {
                            return { edge_id, partway: { x: to.x, y: handel_bezier(from, to, 0.9).y } };
                        }
                    }
            );
        const best_edge = edge_sample_near_click
            .reduce<{ edge_id: string | null, best: number }>(({ edge_id, best }, { edge_id: challenger_edge_id, partway }) => {
                let challenger = Vector2.mag_squared(Vector2.sub(mouse_position_screen, partway));
                if (challenger <= best) {
                    return { edge_id: challenger_edge_id, best: challenger }
                } else {
                    return { edge_id, best }
                }
            }, { edge_id: null, best: Infinity })
        console.log(
            mouse_position_screen,
            edge_from_to.map(item => item.edge_id).join("|"),
            edge_sample_near_click.map(item => item.partway.x.toFixed(1) + "," + item.partway.y.toFixed(1)),
            best_edge
        );
        // debugger
        let user_grabbed_edge_start_id = best_edge.edge_id ?? user_grabbed_edge_handles[0].id;
        return user_grabbed_edge_start_id;

    }
}