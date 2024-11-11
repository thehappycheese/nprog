import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Vector2 from '../Vector2';

export interface Viewport {
    midpoint: Vector2.Vector2,
    zoom: number
};

const initialState: Viewport = {
    midpoint: { x: 0, y: 0 },
    zoom: 1
}

export class ViewportTransform {
    #zoom: number;
    #midpoint: Vector2.Vector2;
    #screen_size: Vector2.Vector2;

    constructor(zoom: number, midpoint: Vector2.Vector2, screen_size: Vector2.Vector2) {
        this.#zoom = zoom;
        this.#midpoint = midpoint;
        this.#screen_size = screen_size;
    }

    world_to_screen(point: Vector2.Vector2): Vector2.Vector2 {
        return Vector2.add(
            Vector2.scale(point, this.#zoom),
            Vector2.add(this.#midpoint, Vector2.scale(this.#screen_size, 0.5))
        );
    }

    screen_to_world(point: Vector2.Vector2): Vector2.Vector2 {
        return Vector2.descale(
            Vector2.sub(
                point,
                Vector2.add(this.#midpoint, Vector2.scale(this.#screen_size, 0.5))
            ),
            this.#zoom
        );
    }

    screen_bounds_to_world() {
        return {
            top_left: this.screen_to_world({ x: 0, y: 0 }),
            bottom_right: this.screen_to_world(this.#screen_size),
        }
    }
}


const graph_slice = createSlice({
    name: 'viewport',
    initialState,
    reducers: {
        zoom_in: state => {
            state.zoom *= 1.5;
        },
        zoom_out: state => {
            state.zoom /= 1.5;
        },
        reset: state=>{
            return {
                zoom:1,
                midpoint:{x:0,y:0}
            }
        },
        zoom_in_to: (state, action: PayloadAction<Vector2.Vector2>) => {
            const target = action.payload;
            const zoomFactor = 1.5;
        
            // Adjust midpoint to zoom into the target point
            state.midpoint = Vector2.add(
                Vector2.scale(target, 1 - 1 / zoomFactor),
                Vector2.descale(state.midpoint, zoomFactor)
            );
        
            // Apply the zoom
            state.zoom *= zoomFactor;
        },
        
        zoom_out_from: (state, action: PayloadAction<Vector2.Vector2>) => {
            const target = action.payload;
            const zoomFactor = 1.5;
        
            // Adjust midpoint to zoom out from the target point
            state.midpoint = Vector2.add(
                Vector2.scale(target, 1 - zoomFactor),
                Vector2.scale(state.midpoint, zoomFactor)
            );
        
            // Apply the zoom
            state.zoom /= zoomFactor;
        },
        translate: (state, action: PayloadAction<Vector2.Vector2>) => {
            state.midpoint = Vector2.add(state.midpoint, action.payload)
        },
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
