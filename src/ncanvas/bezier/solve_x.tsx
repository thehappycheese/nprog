import { Vector2 } from "../Vector2";

export function solve_x(x_line: number, f: (t: number) => Vector2.Vector2, tolerance: number = 1e-3): { t: number; y: number; } | null {
    let t_min = 0; // Start of the range
    let t_max = 1; // End of the range


    // Ensure there is a root in the interval
    if ((f(t_min).x - x_line) * (f(t_max).x - x_line) > 0) {
        return null; // No intersection within [0, 1]
    }

    let t: number;
    while (t_max - t_min > tolerance) {
        t = (t_min + t_max) / 2; // Midpoint
        const x_t = f(t).x;

        if (Math.abs(x_t - x_line) <= tolerance) {
            // Found a solution within tolerance
            return { t, y: f(t).y };
        }

        // Narrow down the interval based on the sign
        if ((f(t_min).x - x_line) * (x_t - x_line) < 0) {
            t_max = t;
        } else {
            t_min = t;
        }
    }

    // Final approximation
    t = (t_min + t_max) / 2;
    return { t, y: f(t).y };
}
