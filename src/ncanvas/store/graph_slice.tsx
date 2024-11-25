import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphNode, GraphEdge } from '../graph_types';
import { Vector2 } from '../Vector2';
import helpers from '../helpers';


export interface GraphState {
    nodes: Array<GraphNode<unknown>>;
    edges: Array<GraphEdge>;
    selected: Array<SelectionItem>
}

export interface SelectionItem {
    type: "node" | "edge",
    id: string,
}

let sequence = helpers.sequence_maker();

const initial_state: GraphState = {
    nodes: [
        {
            id: "node-0",
            title: "Tau",
            position: { x: 50, y: 50 },
            registered_type: "tau",
            data: null,
        },
        {
            id: "node-1",
            title: "Value",
            position: { x: 50, y: -150 },
            registered_type: "value",
            data: 0,
        },
        {
            id: "node-2",
            title: "Output",
            position: { x: 250, y: 130 },
            registered_type: "output",
            data: null,
        },
        {
            id: "node-3",
            title: "Add",
            position: { x: 150, y: 230 },
            registered_type: "add",
            data: null,
        },

    ],
    edges: [
        {
            id: `edge-${sequence()}`,
            from: {
                node: "node-0",
                handel: "R0",
            },
            to: {
                node: "node-3",
                handel: "L0"
            }
        },
        {
            id: `edge-${sequence()}`,
            from: {
                node: "node-1",
                handel: "R0",
            },
            to: {
                node: "node-3",
                handel: "L1"
            }
        },
        {
            id: `edge-${sequence()}`,
            from: {
                node: "node-3",
                handel: "R0",
            },
            to: {
                node: "node-2",
                handel: "L0"
            }
        }
    ],
    selected: []
};

const graph_slice = createSlice({
    name: 'graph',
    initialState: initial_state,
    reducers: {
        add_node: (state, action: PayloadAction<GraphNode<unknown>>) => {
            state.nodes.push(action.payload);
        },
        add_edge: (state, action: PayloadAction<GraphEdge>) => {
            state.edges.push(action.payload);
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
