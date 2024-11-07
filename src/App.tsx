import { useState } from 'react';
import { NCanvas } from './ncanvas/NCanvas';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './ncanvas/store';

function App() {
    const [viz, set_viz] = useState(true);
    return <>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NCanvas />
            </PersistGate>
        </Provider>
    </>
}

export default App
