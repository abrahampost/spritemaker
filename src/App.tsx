import React from 'react';
import './App.scss';
import { Layout } from './components/Layout/Layout';
import { TopBar } from './components/TopBar/TopBar';
import { InputManager } from './containers/InputManager/InputManager';
import CanvasProvider from './context/canvasContext';

function App() {
    return (
        <div>
            <CanvasProvider>
                <InputManager>
                    <header>
                        <TopBar />
                    </header>
                    <Layout />
                </InputManager>
            </CanvasProvider>
        </div>
    );
}

export default App;
