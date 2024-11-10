import { Viewport, ViewportTransform } from "../store/viewport_slice";

export interface GridStyle{
    grid_spacing:number,
    line_width:number,
    color:string,
}

export function draw_grid(
    ctx:CanvasRenderingContext2D,
    transform:ViewportTransform,
    style:GridStyle,
){
    // Assuming a grid spacing in world units

    // const screen_size = {x:ctx.canvas.width, y:ctx.canvas.height};

    // Convert viewport extents into world space
    // const top_lLeft     = transform.screen_to_world({ x: 0, y: 0 });
    // const bottom_right = transform.screen_to_world(screen_size);
    const {top_left, bottom_right} = transform.screen_bounds_to_world();

    // Calculate grid line bounds in world space
    const startX = Math.floor(top_left.x / style.grid_spacing) * style.grid_spacing;
    const endX = Math.ceil(bottom_right.x / style.grid_spacing) * style.grid_spacing;
    const startY = Math.floor(top_left.y / style.grid_spacing) * style.grid_spacing;
    const endY = Math.ceil(bottom_right.y / style.grid_spacing) * style.grid_spacing;

    ctx.save()
    ctx.strokeStyle = style.color;
    ctx.lineWidth   = style.line_width;
    ctx.setLineDash([2,3])
    // Draw vertical grid lines
    for (let x = startX; x <= endX; x += style.grid_spacing) {
        const worldPointTop = { x, y: top_left.y };
        const worldPointBottom = { x, y: bottom_right.y };
        
        // Convert world points to screen space
        const screenPointTop    = transform.world_to_screen(worldPointTop);
        const screenPointBottom = transform.world_to_screen(worldPointBottom);
        
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(screenPointTop.x, screenPointTop.y);
        ctx.lineTo(screenPointBottom.x, screenPointBottom.y);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = startY; y <= endY; y += style.grid_spacing) {
        const worldPointLeft = { x: top_left.x, y };
        const worldPointRight = { x: bottom_right.x, y };
        
        // Convert world points to screen space
        const screenPointLeft  = transform.world_to_screen(worldPointLeft);
        const screenPointRight = transform.world_to_screen(worldPointRight);
        
        // Draw the line
        ctx.beginPath();
        ctx.moveTo(screenPointLeft.x, screenPointLeft.y);
        ctx.lineTo(screenPointRight.x, screenPointRight.y);
        ctx.stroke();
    }
    ctx.restore()
}