import { NodeRenderStyle } from "./NodeRenderStyle";
import * as Vector2 from "../Vector2";

export function draw_node_body_and_title_bar(
    ctx:CanvasRenderingContext2D,
    position:Vector2.Vector2,
    size:Vector2.Vector2,
    title:string,
    style:NodeRenderStyle,
) {
    // Draw node body
    ctx.fillStyle = style.body.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(position.x, position.y, size.x, size.y, style.radius);
    ctx.fill();

    // Draw title bar
    ctx.fillStyle = style.title.backgroundColor;
    ctx.beginPath();
    ctx.roundRect(
        position.x,
        position.y,
        size.x,
        style.title.height,
        [style.radius, style.radius, 0, 0]
    );
    ctx.fill();

    // Draw title text
    ctx.textBaseline = "middle";
    ctx.font = `${style.fontSize}px ${style.fontFamily}`;
    ctx.fillStyle = "white";
    ctx.fillText(
        title,
        position.x + 2,
        position.y + style.title.height / 2,
        size.x
    );

    // Draw border
    ctx.strokeStyle = style.border.color;
    ctx.lineWidth = style.border.thickness;
    ctx.beginPath();
    ctx.roundRect(position.x, position.y, size.x, size.y, style.radius);
    ctx.stroke();
}