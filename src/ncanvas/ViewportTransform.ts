import { Viewport } from "./store/viewport_slice";
import { Vector2 } from "./Vector2";

export class ViewportTransform {
    #zoom: number;
    #midpoint: Vector2;
    #screen_size: Vector2;

    constructor(
        zoom: number,
        midpoint: Vector2,
        screen_size: Vector2,
    ) {
        this.#zoom = zoom;
        this.#midpoint = midpoint;
        this.#screen_size = screen_size;
    }

    world_to_screen(point: Vector2): Vector2 {
        return Vector2.add(
            Vector2.scale(point, this.#zoom),
            Vector2.add(this.#midpoint, Vector2.scale(this.#screen_size, 0.5)),
        );
    }

    screen_to_world(point: Vector2): Vector2 {
        return Vector2.descale(
            Vector2.sub(
                point,
                Vector2.add(
                    this.#midpoint,
                    Vector2.scale(this.#screen_size, 0.5),
                ),
            ),
            this.#zoom,
        );
    }

    scalar_world_to_screen(value: number): number {
        return value * this.#zoom;
    }

    scalar_screen_to_world(value: number): number {
        return value / this.#zoom;
    }

    scale_only_world_to_screen(value: Vector2) {
        return Vector2.scale(value, this.#zoom);
    }

    scale_only_screen_to_world(value: Vector2) {
        return Vector2.descale(value, this.#zoom);
    }

    screen_bounds_to_world() {
        return {
            top_left: this.screen_to_world({ x: 0, y: 0 }),
            bottom_right: this.screen_to_world(this.#screen_size),
        };
    }

    with_zoom(new_zoom: number): ViewportTransform {
        return new ViewportTransform(
            new_zoom,
            this.#midpoint,
            this.#screen_size,
        );
    }

    with_zoom_fixed_screen_position(
        target_screen_position: Vector2,
        new_zoom_factor: number,
    ): ViewportTransform {
        let tx1 = this.screen_to_world(target_screen_position);
        let tx2 = this.with_zoom(new_zoom_factor).screen_to_world(
            target_screen_position,
        );
        let new_midpoint = Vector2.add(
            this.#midpoint,
            Vector2.scale(
                Vector2.sub(tx2, tx1),
                new_zoom_factor,
            ),
        );
        return new ViewportTransform(
            new_zoom_factor,
            new_midpoint,
            this.#screen_size,
        );
    }

    as_viewport(): Viewport {
        return {
            midpoint: this.#midpoint,
            zoom: this.#zoom,
        };
    }
}
