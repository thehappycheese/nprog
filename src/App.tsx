import { NCanvas } from './ncanvas/NCanvas';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistent_store } from './ncanvas/store';

function App() {
    return <>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistent_store}>
                <NCanvas />
            </PersistGate>
        </Provider>
    </>
}

export default App
