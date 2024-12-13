import { HandelReference } from "./graph_types/HandelReference";
import { Vector2 } from "./Vector2";
import { ViewportTransform } from "./ViewportTransform";

/**
 * 
 * @param event Pointer Event on any element (can be different to the one in which we want the mouse coordinates)
 * @param transform Viewport transform to apply
 * @param reference_element Element relative to which the screen coordinate should be calculated. Often but not always event.target
 * @returns 
 */
const get_mouse_positions: (
    event: React.PointerEvent<HTMLElement>,
    transform: ViewportTransform,
    reference_element: HTMLElement
) => {
    mouse_position_screen: Vector2,
    mouse_position_world: Vector2
} = (event, transform, reference_element) => {
    const canvas_rect = reference_element.getBoundingClientRect();
    let mouse_position_screen = {
        x: event.clientX - canvas_rect.left,
        y: event.clientY - canvas_rect.top
    };
    let mouse_position_world = transform.screen_to_world(mouse_position_screen)

    return { mouse_position_screen, mouse_position_world };
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
    let handel_position: Vector2 = {
        x: handel_rect.left + handel_rect.width / 2 - host_rect.left,
        y: handel_rect.top + handel_rect.height / 2 - host_rect.top,
    };
    return handel_position
};

export default {
    get_mouse_positions,
    get_handel_position,
    draw_edge:(a:Vector2, b:Vector2, ctx:CanvasRenderingContext2D)=>{
        let abx = Vector2.scale({ x: Math.abs(b.x - a.x), y: 0 }, 0.5);
        let c1 = Vector2.add(a, abx);
        let c2 = Vector2.sub(b, abx);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.bezierCurveTo(
            c1.x, c1.y,
            c2.x, c2.y,
            b.x, b.y
        );
        ctx.stroke()
    }
}
