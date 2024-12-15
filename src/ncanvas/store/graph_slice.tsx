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

            if (action.payload.from.node_id === action.payload.to.node_id) {
                throw new Error("Cannot connect node with itself")
            }

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
        remove_edges: (state, action: PayloadAction<string[]>) => {
            state.edges = state.edges.filter(item => !action.payload.includes(item.id))
        },
        remove_nodes: (state, action: PayloadAction<string[]>) => {
            const node_ids_to_remove = new Set(action.payload);
            state.edges = state.edges.filter(edge=> !(node_ids_to_remove.has(edge.from.node_id) || node_ids_to_remove.has(edge.to.node_id)));
            state.nodes = state.nodes.filter(item => !node_ids_to_remove.has(item.id));
        },
        offset_nodes: (state, action: PayloadAction<{ ids: string[], offset: Vector2 }>) => {
            action.payload.ids.forEach(node_id=>{
                let node = state.nodes.find(item => item.id == node_id);
                if (node) {
                    node.position = Vector2.add(node.position, action.payload.offset);
                } else {
                    throw new Error("Why you ask to move node that not exist eh?")
                }
            })
        },
        select_append: (state, action: PayloadAction<SelectionItem>) => {
            if (state.selected.findIndex(item => item.type === action.payload.type && item.id === action.payload.id) === -1) {
                state.selected.push(action.payload)
            }
        },
        select_replace: (state, action: PayloadAction<SelectionItem>) => {
            state.selected = [action.payload];
        },
        duplicate_nodes: (state, action:PayloadAction<Record<string, string>>)=>{
            let nodes_to_dupe = state.nodes.filter(node=>node.id in action.payload);
            let edges_to_dupe = state.edges.filter(edge=>nodes_to_dupe.some(node=>node.id===edge.from.node_id) && nodes_to_dupe.some(node=>node.id===edge.to.node_id));
            
            const new_nodes:GraphNode<unknown>[] = nodes_to_dupe.map(old_node=>({
                id:action.payload[old_node.id]!, // TODO
                title:old_node.title,
                position:old_node.position,
                registered_type:old_node.registered_type,
                data:old_node.data,
            }));
            const new_edges:GraphEdge[] = edges_to_dupe.map(old_edge=>{
                return {
                    from:{
                        handel_id:old_edge.from.handel_id,
                        node_id:action.payload[old_edge.from.node_id]!
                    },
                    to:{
                        handel_id:old_edge.to.handel_id,
                        node_id:action.payload[old_edge.to.node_id]!
                    },
                    id:Math.random()*3+"TODO",
                } as GraphEdge
            });
            state.nodes.push(...new_nodes);
            state.edges.push(...new_edges);
            state.selected = new_nodes.map(item=>({type:"node", id:item.id}))
        },
        // select_replace_or_remove: (state, action: PayloadAction<SelectionItem>) => {
        //     if(state.selected.find(item=>item.type===action.payload.type && item.id ===action.payload.id)){
        //         // remove
        //         state.selected = [];
        //     }else{
        //         // replace
        //         state.selected = [action.payload];
        //     }
        // },
        select_remove: (state, action: PayloadAction<SelectionItem>) => {
            state.selected = state.selected.filter(item => !(item.type === action.payload.type && item.id === action.payload.id));
        },
        select_toggle: (state, action: PayloadAction<SelectionItem>) => {
            if(state.selected.find(item=>item.type===action.payload.type && item.id ===action.payload.id)){
                state.selected = state.selected.filter(item => !(item.type === action.payload.type && item.id === action.payload.id));
            }else{
                state.selected.push(action.payload);
            }
        },
        select_none: (state) => {
            state.selected = [];
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
