import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GraphNode, GraphEdge } from '../types';

interface GraphState {
  nodes: Array<GraphNode>;
  edges: Array<GraphEdge>;
}

const initialState: GraphState = {
  nodes: [],
  edges: [],
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<GraphNode>) => {
      state.nodes.push(action.payload);
    },
    addEdge: (state, action: PayloadAction<GraphEdge>) => {
      state.edges.push(action.payload);
    },
  },
});

export const { addNode, addEdge } = graphSlice.actions;
export default graphSlice.reducer;
