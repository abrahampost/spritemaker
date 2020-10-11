import React, { createContext, useState } from 'react';

export enum ToolType {
    PAINT = 0,
    FILL,
    SELECT,
    SAMPLE
}

const ToolContext = createContext({
    selectedToolId: 0,
    setSelectedToolId: (type: ToolType) => {},
    activeColor: "#000",
    setActiveColor: (color: string) => {}
});

const ToolProvider = ({children}: {children: React.ReactNode}) => {
    const [ selectedToolId, setSelectedToolId ] = useState(ToolType.PAINT);
    const [ activeColor, setActiveColor ] = useState("#000000");
    return (
        <ToolContext.Provider value={{selectedToolId, setSelectedToolId, activeColor, setActiveColor}}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolProvider;

export { ToolContext };