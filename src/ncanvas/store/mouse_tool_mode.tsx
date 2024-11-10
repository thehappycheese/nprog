import { createSlice } from '@reduxjs/toolkit';



export interface MouseToolMode {
    type: "select" | "add" | "delete"
}

const mouse_tool_mode = createSlice({
    name: 'mouse_tool_mode',
    initialState:{type:"select"} as MouseToolMode,
    reducers: {
        setMouseToolModeSelect:state=>{
            state.type="select";
        },
        setMouseToolModeAddNode:state=>{
            state.type="add";
        },
        setMouseToolModeDeleteNode:state=>{
            state.type="delete";
        }
    },
});

export const actions =  mouse_tool_mode.actions;
export const reducer =  mouse_tool_mode.reducer;
