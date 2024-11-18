import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphNode, GraphEdge } from '../graph_types';
import { Vector2 } from '../Vector2';


export interface GraphState {
    nodes: Array<GraphNode>;
    edges: Array<GraphEdge>;
    selected:Array<SelectionItem>
}

export interface SelectionItem {
    type:"node"|"edge",
    id:string,
}

const initialState: GraphState = {
    nodes: [
        {
            id:"node-0",
            title:"input",
            position:{x:50, y:50},
            size:{x:150, y:50},
            registered_type:"tau",
        },

        {
            id:"node-1",
            title:"output",
            position:{x:250, y:130},
            size:{x:150, y:50},
            registered_type:"tau"
        },

    ],
    edges: [],
    selected:[]
};

const graph_slice = createSlice({
    name: 'graph',
    initialState,
    reducers: {
        add_node: (state, action: PayloadAction<GraphNode>) => {
            state.nodes.push(action.payload);
        },
        add_edge: (state, action: PayloadAction<GraphEdge>) => {
            state.edges.push(action.payload);
        },
        offset_node: (state, action:PayloadAction<{id:string, offset:Vector2.Vector2}>)=>{
            let node = state.nodes.find(item=>item.id==action.payload.id);
            if(node){
                node.position = Vector2.add(node.position, action.payload.offset);
            }else{
                throw new Error("Why you ask to move node that not exist eh?")
            }
        },
        select: (state, action:PayloadAction<SelectionItem>)=>{
            if (state.selected.findIndex(item=>item.type===action.payload.type && item.id===action.payload.id)===-1){
                state.selected.push(action.payload)
            }
        },
        deselect: (state, action:PayloadAction<SelectionItem>)=>{
            state.selected = state.selected.filter(item=>!(item.type===action.payload.type && item.id===action.payload.id));
        },
        clear_all: (state) =>{
            state.nodes = []
            state.edges = []
            state.selected = []
        }
    },
});

export const actions = graph_slice.actions;
export const reducer = graph_slice.reducer;
