import { Vector2 } from "./Vector2";
import { ViewportTransform } from "./ViewportTransform";

const mouse_positions: (
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

export default {
    mouse_positions
}