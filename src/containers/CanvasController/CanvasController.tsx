import React, { useContext } from 'react';
import classes from './CanvasController.module.scss';

import { Canvas } from '../../components/Canvas/Canvas';
import { CanvasAction, CanvasContext, ToolType } from '../../context/canvasContext';

const WIDTH = 16;
const HEIGHT = 16;

export const CanvasController = () => {
    const { state, dispatch } = useContext(CanvasContext);    

    const setCell = (x: number, y: number, color: string) => {
        if (state.cells[y * WIDTH + x] === color) return;
        dispatch({type: CanvasAction.SET_CELL, payload: { x, y, color: state.activeColor }});
    }

    const pushHistory = () => dispatch({type: CanvasAction.ADD_HISTORY, payload: null});

    const mouseDownHandler = (x: number, y:number) => {
        pushHistory();
        switch (state.selectedTool) {
            case (ToolType.PAINT): {
                setCell(x, y, state.activeColor);
                break;
            }
            case (ToolType.FILL): {
                dispatch({type: CanvasAction.FLOOD_FILL, payload: { x, y, color: state.activeColor}});
                break;
            }
            case (ToolType.SAMPLE): {
                dispatch({ type: CanvasAction.SAMPLE_CELL, payload: {x, y}});
                break;
            }
        }
    }

    const dragHandler = (x: number, y: number) => {
        if (state.selectedTool === ToolType.PAINT) {
            setCell(x, y, state.activeColor);
        }
    }

    const mouseUpHandler = () => {
    }

    return (
        <div className={classes.CanvasController}>
            <Canvas 
                widthUnits={WIDTH}
                heightUnits={HEIGHT}
                cells={state.cells}
                mouseDown={mouseDownHandler}
                mouseUp={mouseUpHandler}
                drag={dragHandler}/>
        </div>
    )
}