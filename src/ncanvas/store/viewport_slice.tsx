import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Vector2 from '../Vector2';
import { ViewportTransform } from '../ViewportTransform';

export interface Viewport {
    midpoint: Vector2.Vector2,
    zoom: number
};

const initialState: Viewport = {
    midpoint: { x: 0, y: 0 },
    zoom: 1
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
        zoom_in_to: (state, action: PayloadAction<{target_screen_position:Vector2.Vector2, screen_size:Vector2.Vector2}>) => {
            let {
                target_screen_position,
                screen_size,
            } = action.payload;
            let new_zoom = state.zoom * 1.5;
            return new ViewportTransform(
                state.zoom,
                state.midpoint,
                screen_size
            ).with_zoom_fixed_screen_position(
                target_screen_position,
                new_zoom
            ).as_viewport();
        },
        
        zoom_out_from: (state, action: PayloadAction<{target_screen_position:Vector2.Vector2, screen_size:Vector2.Vector2}>) => {
            let {
                target_screen_position,
                screen_size,
            } = action.payload;
            let new_zoom = state.zoom / 1.5;
            return new ViewportTransform(
                state.zoom,
                state.midpoint,
                screen_size
            ).with_zoom_fixed_screen_position(
                target_screen_position,
                new_zoom
            ).as_viewport();
        },
        translate: (state, action: PayloadAction<Vector2.Vector2>) => {
            state.midpoint = Vector2.add(state.midpoint, action.payload)
        },
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
