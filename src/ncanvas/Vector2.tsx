/* eslint-disable @typescript-eslint/no-namespace */
export namespace Vector2 {

    export interface Vector2 {
        x: number;
        y: number;
    }

    export function toString(v: Vector2): string {
        return `{${v.x.toFixed(1)}, ${v.y.toFixed(1)}}`;
    }
    export function add(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    export function sub(a: Vector2, b: Vector2): Vector2 {
        return { x: a.x - b.x, y: a.y - b.y };
    }
    export function neg(a: Vector2): Vector2 {
        return { x: -a.x, y: -a.y };
    }
    export function scale(a: Vector2, multiplier: number): Vector2 {
        return { x: a.x * multiplier, y: a.y * multiplier };
    }
    export function descale(a: Vector2, divisor: number): Vector2 {
        return { x: a.x / divisor, y: a.y / divisor };
    }
    export function left(a: Vector2): Vector2 {
        return { x: -a.y, y: a.x };
    }
    export function unit(a: Vector2): Vector2 {
        const mag = Math.sqrt(a.x * a.x + a.y * a.y);
        return {
            x: a.x / mag,
            y: a.y / mag,
        }
    }

    export function cross(a: Vector2, b: Vector2): number {
        return a.x * b.y - a.y * b.x;
    }

    export function mag_squared(a: Vector2): number {
        return Math.sqrt(a.x * a.x + a.y * a.y);
    }

    export const lerp = (a: Vector2, b: Vector2, t: number): Vector2 => ({
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
    });

    export function sum(items: Vector2[]) {
        return items.reduce((cur, acc) => ({ x: cur.x + acc.x, y: cur.y + cur.y }));
    }

    export const inside_rect = (test_position: Vector2) => (rect_position: Vector2, rect_size: Vector2) => {
        let relative_test_position = sub(test_position, rect_position);
        return (
            relative_test_position.x >= 0
            && relative_test_position.y >= 0
            && relative_test_position.x < rect_size.x
            && relative_test_position.y < rect_size.y
        )
    }

    export const line_segments_intersect = (a: Vector2, b: Vector2) => {
        const ab = sub(b, a);
        return (c: Vector2, d: Vector2) => {
            const cd = sub(d, c);
            const ac = sub(c, a);
            const cabcd = cross(ab, cd)
            const t1 = cross(ac, cd) / cabcd;
            const t2 = -cross(ac, ab) / cabcd;
            return t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1;
        }
    }
}

