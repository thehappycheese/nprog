import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import undoable from 'redux-undo';

import * as graph_slice from './graph_slice';
//import * as mouse_tool_mode_slice from './mouse_tool_mode';
import * as viewport_slice from './viewport_slice';


const persisted_reducer = persistReducer(
    {
        key: 'root',
        whitelist: ["graph", "viewport"],
        storage,
    },
    combineReducers({
        graph: undoable(graph_slice.reducer),
        viewport: viewport_slice.reducer,
        //mouse_tool_mode: mouse_tool_mode_slice.reducer
    })
);

export const store = configureStore({
    reducer: persisted_reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistent_store = persistStore(store);
export const actions = {
    graph:graph_slice.actions,
    //mouse_tool_mode:mouse_tool_mode_slice.actions,
    viewport:viewport_slice.actions,
};
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

