import React from 'react';
import './App.scss';
import { Layout } from './components/Layout/Layout';
import { TopBar } from './components/TopBar/TopBar';
import ToolProvider from './context/toolContext';

function App() {
  return (
    <div>
        <ToolProvider>
            <header>
                <TopBar />
            </header>
            <Layout />
        </ToolProvider>
    </div>
  );
}

export default App;
