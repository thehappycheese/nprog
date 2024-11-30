import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphNode } from "../graph_types/GraphNode.ts";
import { GraphEdge } from "../graph_types/GraphEdge.ts";
import { Vector2 } from '../Vector2';


export interface GraphState {
    _id_counter: number,
    nodes: Array<GraphNode<unknown>>;
    edges: Array<GraphEdge>;
    selected: Array<SelectionItem>
}

export interface SelectionItem {
    type: "node" | "edge",
    id: string,
}

const initial_state: GraphState = {
    _id_counter: 0,
    nodes: [
        {
            id: "node-0",
            title: "Tau",
            position: { x: -85, y: 81 },
            registered_type: "tau",
            data: null,
        },
        {
            id: "node-1",
            title: "Value",
            position: { x: -166, y: 7 },
            registered_type: "value",
            data: 0,
        },
        {
            id: "node-2",
            title: "Output",
            position: { x: 174, y: 114 },
            registered_type: "output",
            data: null,
        },
        {
            id: "node-3",
            title: "Add",
            position: { x: 37, y: 51 },
            registered_type: "add",
            data: null,
        },

    ],
    edges: [
        // {
        //     id: `edge-${sequence()}`,
        //     from: {
        //         node_id: "node-0",
        //         handel_id: "R0",
        //     },
        //     to: {
        //         node_id: "node-3",
        //         handel_id: "L0"
        //     }
        // },
        // {
        //     id: `edge-${sequence()}`,
        //     from: {
        //         node_id: "node-1",
        //         handel_id: "R0",
        //     },
        //     to: {
        //         node_id: "node-3",
        //         handel_id: "L1"
        //     }
        // },
        // {
        //     id: `edge-${sequence()}`,
        //     from: {
        //         node_id: "node-3",
        //         handel_id: "R0",
        //     },
        //     to: {
        //         node_id: "node-2",
        //         handel_id: "L0"
        //     }
        // }
    ],
    selected: [{ type: "node", id: "node-0" }]
};

const graph_slice = createSlice({
    name: 'graph',
    initialState: initial_state,
    reducers: {
        add_node: (state, action: PayloadAction<GraphNode<unknown>>) => {
            state.nodes.push(action.payload);
        },
        add_edge: (state, action: PayloadAction<Omit<GraphEdge, "id">>) => {
            // TODO: pack this nonsense into a reusable function as it will be needed for node ID assignment also
            // TODO: consider making node and edge id a simple integer to simplify this code? I don't think there is a benefit really to having the id be a number
            let limit_counter = 1000;
            let success = false;
            while (limit_counter > 0) {
                limit_counter--;
                state._id_counter++;
                let proposed_id = `e${state._id_counter}`;
                if (state.edges.findIndex(item => item.id === proposed_id) === -1) {
                    state.edges.push({ ...action.payload, id: proposed_id });
                    success = true;
                    break
                }
            }
            if (!success) {
                throw new Error("unable to find a new ID for edge. This might happen if you have had more than 1000 nodes in the history of this document. This limit can be removed in source, you should only see this error in debugging.")
            }
        },
        offset_node: (state, action: PayloadAction<{ id: string, offset: Vector2.Vector2 }>) => {
            let node = state.nodes.find(item => item.id == action.payload.id);
            if (node) {
                node.position = Vector2.add(node.position, action.payload.offset);
            } else {
                throw new Error("Why you ask to move node that not exist eh?")
            }
        },
        select: (state, action: PayloadAction<SelectionItem>) => {
            if (state.selected.findIndex(item => item.type === action.payload.type && item.id === action.payload.id) === -1) {
                state.selected.push(action.payload)
            }
        },
        deselect: (state, action: PayloadAction<SelectionItem>) => {
            state.selected = state.selected.filter(item => !(item.type === action.payload.type && item.id === action.payload.id));
        },
        clear_all: (state) => {
            state.nodes = []
            state.edges = []
            state.selected = []
        },
        set_node_data: (state, action: PayloadAction<{ node_id: string, new_value: unknown }>) => {
            state.nodes.filter(node => node.id == action.payload.node_id).map(item => item.data = action.payload.new_value);
        }
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
