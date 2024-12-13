import { Vector2 } from "../Vector2";

export const handel_bezier = (p0: Vector2, p3: Vector2, t: number): Vector2 => {
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

export const handel_bezier_segments = (p0: Vector2, p3: Vector2, number_of_segments: number = 30): [Vector2, Vector2][] => {
    let result: [Vector2, Vector2][] = [];
    for (let i = 1; i < number_of_segments; i++) {
        const t0 = (i - 1) / (number_of_segments - 1);
        const t1 = i / (number_of_segments - 1);
        result.push([
            handel_bezier(p0, p3, t0),
            handel_bezier(p0, p3, t1),
        ])
    }
    return result
}