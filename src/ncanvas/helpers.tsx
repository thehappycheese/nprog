import { HandelReference } from "./graph_types.ts/HandelReference";
import { Vector2 } from "./Vector2";
import { ViewportTransform } from "./ViewportTransform";

const get_mouse_positions: (
    e: React.PointerEvent<HTMLElement>,
    transform: ViewportTransform,
    target?: HTMLElement
) => { mouse_position: Vector2.Vector2, mouse_position_world: Vector2.Vector2 } = (e, transform, target) => {
    const canvas_rect = (target ?? e.currentTarget).getBoundingClientRect();
    let mouse_position = {
        x: e.clientX - canvas_rect.left,
        y: e.clientY - canvas_rect.top
    };
    let mouse_position_world = transform.screen_to_world(mouse_position)

    return { mouse_position, mouse_position_world };
}

/**Screen position of handle */
const get_handel_position = (
    handel_reference: HandelReference,
    handel_refs: Record<string, Record<string, HTMLDivElement>>,
    host: HTMLDivElement
) => {
    let host_rect = host.getBoundingClientRect();
    let handel_rect = handel_refs?.[handel_reference.node_id]?.[handel_reference.handel_id]?.getBoundingClientRect();
    if (!handel_rect) {
        console.error(`Invalid Handle Reference: ${JSON.stringify(handel_reference)}`)
        return { x: 0, y: 0 };
    }
    let handel_position: Vector2.Vector2 = {
        x: handel_rect.left + handel_rect.width / 2 - host_rect.left,
        y: handel_rect.top + handel_rect.height / 2 - host_rect.top,
    };
    return handel_position
};

export default {
    mouse_positions: get_mouse_positions,
    get_handel_position
}
