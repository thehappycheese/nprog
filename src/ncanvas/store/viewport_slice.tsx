import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Vector2 from '../Vector2';

export interface Viewport {
    size:Vector2.Vector2,
    midpoint:Vector2.Vector2,
    zoom:number
};

const initialState:Viewport = {
    size:{x:1, y:1},
    midpoint:{x:0, y:0},
    zoom:1
}

export const world_to_screen = (viewport:Viewport) => (point:Vector2.Vector2) => {
    return Vector2.add(
        Vector2.scale(point, viewport.zoom),
        viewport.midpoint,
    )
}

export const screen_to_world = (viewport:Viewport) => (point:Vector2.Vector2) => {
    return Vector2.descale(
            Vector2.sub(point,viewport.midpoint),
            viewport.zoom
        )
}

const graph_slice = createSlice({
    name: 'viewport',
    initialState,
    reducers: {
        zoom_in:state=>{
            state.zoom*=1.5;
        },
        zoom_out:state=> {
            state.zoom/=1.5;
        },
        translate:(state, action:PayloadAction<Vector2.Vector2>) => {
            state.midpoint = Vector2.add(state.midpoint, action.payload)
        }
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
