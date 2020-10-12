import React, { useContext, useEffect } from 'react';
import { CanvasAction, CanvasContext } from '../../context/canvasContext';

export const InputManager = ({children}: {children: React.ReactNode}) => {
    const { dispatch } = useContext(CanvasContext);
    const undoAction = () => dispatch({type: CanvasAction.UNDO_HISTORY, payload: null});
    const redoAction = () => dispatch({type: CanvasAction.REDO_HISTORY, payload: null});

    const keydown = (e: any) => {
        e.preventDefault();

        if (e.ctrlKey) {
            if(e.code === "KeyZ") {
                if (e.shiftKey) {
                    redoAction();
                } else {
                    undoAction();
                }
            }
        }
        
    }
    
    useEffect(() => {
        document.addEventListener("keypress", keydown);
        return () => {
            document.removeEventListener("keypress", keydown)
        }
    });

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}