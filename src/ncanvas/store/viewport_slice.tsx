import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewportTransform } from '../ViewportTransform';
import { Vector2 } from '../Vector2';

export interface Viewport {
    midpoint: Vector2,
    zoom: number
};

const initialState: Viewport = {
    midpoint: { x: 0, y: 0 },
    zoom: 1
}

const valid_zoom_levels = [
    0.3,
    0.4,
    0.5,
    0.7,
    1,
    1.5,
    3,
    4,
];

const find_nearest_zoom_level_index = (z: number) => {
    let sqrt_z = Math.sqrt(z);
    let nearest = valid_zoom_levels.reduce<{ lowest_diff: number, index_of_lowest_diff: number }>(
        (acc, cur, i) => {
            let diff = Math.abs(Math.sqrt(cur) - sqrt_z);
            if (diff < acc.lowest_diff) {
                return { lowest_diff: diff, index_of_lowest_diff: i }
            }
            return acc
        }, { lowest_diff: Infinity, index_of_lowest_diff: -1 })
    return nearest.index_of_lowest_diff
};
const increase_zoom = (z: number) => {
    let current_index = find_nearest_zoom_level_index(z);
    if (current_index < valid_zoom_levels.length - 1) {
        return valid_zoom_levels[current_index + 1]
    } else {
        return valid_zoom_levels[current_index]
    }
}
const decrease_zoom = (z: number) => {
    let current_index = find_nearest_zoom_level_index(z);
    if (current_index > 0) {
        return valid_zoom_levels[current_index - 1];
    } else {
        return valid_zoom_levels[current_index];
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
        reset: () => {
            return {
                zoom: 1,
                midpoint: { x: 0, y: 0 }
            }
        },
        zoom_in_to: (state, action: PayloadAction<{ target_screen_position: Vector2, screen_size: Vector2 }>) => {
            let {
                target_screen_position,
                screen_size,
            } = action.payload;
            //let new_zoom = state.zoom * 1.5;
            let new_zoom = increase_zoom(state.zoom);
            return new ViewportTransform(
                state.zoom,
                state.midpoint,
                screen_size
            ).with_zoom_fixed_screen_position(
                target_screen_position,
                new_zoom
            ).as_viewport();
        },
        zoom_out_from: (state, action: PayloadAction<{ target_screen_position: Vector2, screen_size: Vector2 }>) => {
            let {
                target_screen_position,
                screen_size,
            } = action.payload;
            let new_zoom = decrease_zoom(state.zoom);
            return new ViewportTransform(
                state.zoom,
                state.midpoint,
                screen_size
            ).with_zoom_fixed_screen_position(
                target_screen_position,
                new_zoom
            ).as_viewport();
        },
        translate: (state, action: PayloadAction<Vector2>) => {
            state.midpoint = Vector2.add(state.midpoint, action.payload)
        },
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
