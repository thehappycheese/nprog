import { ViewportTransform } from "../ViewportTransform";
import * as Vector2 from "../Vector2";

export interface GridStyle {
    grid_spacing: number,
    line_width: number,
    color: string,
    minimum_spacing_px: number
}

export function draw_grid(
    ctx: CanvasRenderingContext2D,
    viewport: ViewportTransform,
    style: GridStyle,
) {
    const { top_left, bottom_right } = viewport.screen_bounds_to_world();

    let spacing = style.grid_spacing;

    // Adjust grid spacing based on minimum_spacing_px
    let initial_screen_spacing = viewport.scale_world_to_screen(spacing);
    while (initial_screen_spacing < style.minimum_spacing_px) {
        spacing *= 15;
        initial_screen_spacing = viewport.scale_world_to_screen(spacing);
    }

    const start_x = Math.floor(top_left.x / spacing) * spacing;
    const end_x = Math.ceil(bottom_right.x / spacing) * spacing;
    const start_y = Math.floor(top_left.y / spacing) * spacing;
    const end_y = Math.ceil(bottom_right.y / spacing) * spacing;

    const grid_lines_x = Math.round((end_x - start_x) / spacing) + 1;
    const grid_lines_y = Math.round((end_y - start_y) / spacing) + 1;

    // MARK: Save
    ctx.save();

    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.line_width;
    ctx.setLineDash([2, 3]);

    // Draw vertical grid lines
    for (let i = 0; i < grid_lines_x; i++) {
        const x = start_x + i * spacing;

        const world_point_top = { x, y: top_left.y };
        const world_point_bottom = { x, y: bottom_right.y };

        const screen_point_top = viewport.world_to_screen(world_point_top);
        const screen_point_bottom = viewport.world_to_screen(world_point_bottom);

        ctx.lineDashOffset = viewport.scale_world_to_screen(top_left.y);

        ctx.beginPath();
        ctx.moveTo(Math.round(screen_point_top.x), screen_point_top.y);
        ctx.lineTo(Math.round(screen_point_bottom.x), screen_point_bottom.y);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let j = 0; j < grid_lines_y; j++) {
        const y = start_y + j * spacing;

        const world_point_left = { x: top_left.x, y };
        const world_point_right = { x: bottom_right.x, y };

        const screen_point_left = viewport.world_to_screen(world_point_left);
        const screen_point_right = viewport.world_to_screen(world_point_right);

        ctx.lineDashOffset = viewport.scale_world_to_screen(top_left.x);

        ctx.beginPath();
        ctx.moveTo(screen_point_left.x, Math.round(screen_point_left.y));
        ctx.lineTo(screen_point_right.x, Math.round(screen_point_right.y));
        ctx.stroke();
    }

    // MARK: Origin Circle
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    const origin = viewport.world_to_screen({ x: 0, y: 0 });
    ctx.arc(origin.x, origin.y, 10, 0, Math.PI * 2);
    ctx.stroke();

    arrow_head(
        ctx,
        viewport.world_to_screen({ x: spacing, y: 0 }),
        { x: 1, y: 0 }
    );
    arrow_head(
        ctx,
        viewport.world_to_screen({ x: 0, y: spacing }),
        { x: 0, y: 1 }
    );

    // MARK: Restore
    ctx.restore();
}

/**
 * @param position Arrow tip position
 * @param direction_unit Must already be a unit vector! No checking is performed
 */
function arrow_head(
    ctx: CanvasRenderingContext2D,
    position: Vector2.Vector2,
    direction_unit: Vector2.Vector2,
    width: number = 8,
    length: number = 10
) {

    const side_set = Vector2.scale(Vector2.left(direction_unit), width / 2);

    const arrow_backset = Vector2.sub(
        position,
        Vector2.scale(direction_unit, length)
    );
    const arrow_left = Vector2.add(arrow_backset, side_set);
    const arrow_right = Vector2.add(arrow_backset, Vector2.neg(side_set));
    ctx.beginPath();
    ctx.moveTo(arrow_left.x, arrow_left.y);
    ctx.lineTo(position.x, position.y);
    ctx.lineTo(arrow_right.x, arrow_right.y);
    ctx.stroke();
}
