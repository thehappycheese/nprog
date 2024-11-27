import { createSlice } from '@reduxjs/toolkit';
import { Vector2 } from '../Vector2';

type ActiveItem = {
    type: "none",
    target_id: null,
} | {
    type: "drag_canvas",
    target_id: null,
} | {
    type: "hover_edge",
    target_id: string
} | {
    type: "drag_node",
    target_id: string,
    mouse_down_coord: Vector2.Vector2,
} | {
    type: "drag_edge",
    target_id: string,
    mouse_down_coord: Vector2.Vector2,
};

const initial_state: ActiveItem = {
    type: "none",
    target_id: null
}

const active_item_slice = createSlice({
    name: 'active_item',
    initialState: initial_state,
    reducers: {
        mouse_down_node: (_state) => {
            return {
                type: "none",
                target_id: null,
            }
        }
    },
});

export const actions = active_item_slice.actions;
export const reducer = active_item_slice.reducer;
