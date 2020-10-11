import React from 'react';
import './App.scss';
import { Layout } from './components/Layout/Layout';
import { TopBar } from './components/TopBar/TopBar';
import CanvasProvider from './context/canvasContext';

function App() {
  return (
    <div>
        <CanvasProvider>
            <header>
                <TopBar />
            </header>
            <Layout />
        </CanvasProvider>
    </div>
  );
}

export default App;
