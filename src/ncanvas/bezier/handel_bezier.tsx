import { Vector2 } from "../Vector2";

export const handel_bezier = (p0: Vector2.Vector2, p3: Vector2.Vector2, t: number): Vector2.Vector2 => {
    let abx = Vector2.scale({ x: Math.abs(p3.x - p0.x), y: 0 }, 0.5);
    let p1 = Vector2.add(p0, abx);
    let p2 = Vector2.sub(p3, abx);

    const q0 = Vector2.lerp(p0, p1, t);
    const q1 = Vector2.lerp(p1, p2, t);
    const q2 = Vector2.lerp(p2, p3, t);

    const r0 = Vector2.lerp(q0, q1, t);
    const r1 = Vector2.lerp(q1, q2, t);

    return Vector2.lerp(r0, r1, t);
}