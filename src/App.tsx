import { useState } from 'react';
import { NCanvas } from './ncanvas/NCanvas';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './ncanvas/store';

function App() {
    const [viz, set_viz] = useState(true);
    return <>
        <div>
            <label>Visible Canvas <input type="checkbox" checked={viz} onChange={val=>set_viz(val.target.checked)}/></label>
        </div>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            {
            viz&&
            <NCanvas />
            }
            </PersistGate>
        </Provider>
    </>
}

export default App
