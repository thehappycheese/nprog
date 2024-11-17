import { ViewportTransform } from "../ViewportTransform";
import * as Vector2 from "../Vector2";

export interface GridStyle {
    grid_spacing: number,
    line_width: number,
    color: string,
    //minimum_spacing_px:number
}

export function draw_grid(
    ctx: CanvasRenderingContext2D,
    viewport: ViewportTransform,
    style: GridStyle,
) {
    const { top_left, bottom_right } = viewport.screen_bounds_to_world();

    const startX = Math.floor(top_left.x / style.grid_spacing) * style.grid_spacing;
    const endX = Math.ceil(bottom_right.x / style.grid_spacing) * style.grid_spacing;
    const startY = Math.floor(top_left.y / style.grid_spacing) * style.grid_spacing;
    const endY = Math.ceil(bottom_right.y / style.grid_spacing) * style.grid_spacing;
    
    // MARK: Save
    ctx.save()

    ctx.translate(0.5, 0.5);
    ctx.strokeStyle = style.color;
    ctx.lineWidth = style.line_width;
    ctx.setLineDash([2, 3])

    // Draw vertical grid lines
    for (let x = startX; x <= endX; x += style.grid_spacing) {
        const worldPointTop = { x, y: top_left.y };
        const worldPointBottom = { x, y: bottom_right.y };

        // Convert world points to screen space
        const screenPointTop = viewport.world_to_screen(worldPointTop);
        const screenPointBottom = viewport.world_to_screen(worldPointBottom);
        ctx.lineDashOffset = viewport.scale_world_to_screen(worldPointTop.y);
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(Math.round(screenPointTop.x), screenPointTop.y);
        ctx.lineTo(Math.round(screenPointBottom.x), screenPointBottom.y);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += style.grid_spacing) {
        const worldPointLeft = { x: top_left.x, y };
        const worldPointRight = { x: bottom_right.x, y };

        // Convert world points to screen space
        const screenPointLeft = viewport.world_to_screen(worldPointLeft);
        const screenPointRight = viewport.world_to_screen(worldPointRight);
        ctx.lineDashOffset = viewport.scale_world_to_screen(worldPointLeft.x);
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(screenPointLeft.x, Math.round(screenPointLeft.y));
        ctx.lineTo(screenPointRight.x, Math.round(screenPointRight.y));
        ctx.stroke();
    }

    // MARK: Origin Circle
    ctx.setLineDash([])
    ctx.lineWidth=2
    ctx.beginPath()
    let origin = viewport.world_to_screen({ x: 0, y: 0 });
    ctx.arc(origin.x, origin.y, 10, 0, Math.PI * 2);
    ctx.stroke()
    arrow_head(
        ctx,
        viewport.world_to_screen({ x: style.grid_spacing, y: 0 }),
        {x:1, y:0}
    )
    arrow_head(
        ctx,
        viewport.world_to_screen({ x: 0, y: style.grid_spacing }),
        {x:0, y:1}
    )

    // MARK: Restore
    ctx.restore()
}

/**
 * @param position Arrow tip position
 * @param direction_unit Must already be a unit vector! No checking is performed
 */
function arrow_head(
    ctx:CanvasRenderingContext2D,
    position:Vector2.Vector2, 
    direction_unit:Vector2.Vector2,
    width:number=8,
    length:number=10
){
    
    const side_set = Vector2.scale(Vector2.left(direction_unit), width/2);

    const arrow_backset = Vector2.sub(
        position, 
        Vector2.scale(direction_unit, length)
    );
    const arrow_left = Vector2.add(arrow_backset, side_set);
    const arrow_right = Vector2.add(arrow_backset, Vector2.neg(side_set));
    ctx.beginPath()
    ctx.moveTo(arrow_left.x, arrow_left.y);
    ctx.lineTo(position.x, position.y);
    ctx.lineTo(arrow_right.x, arrow_right.y);
    ctx.stroke()

}