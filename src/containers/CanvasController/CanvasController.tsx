import React, { useCallback, useContext, useState } from 'react';
import classes from './CanvasController.module.scss';

import * as _ from 'lodash';

import { Canvas } from '../../components/Canvas/Canvas';
import { CanvasAction, CanvasContext, ToolType } from '../../context/canvasContext';

export const CanvasController = () => {
    const { state, dispatch } = useContext(CanvasContext);
    
    const [ mouseDownLocation, setMouseDownLocation ] = useState({x: 0, y: 0});

    const setCell = (x: number, y: number, color: string) => {
        if (x < 0 || x >= state.width || y < 0 || y >= state.height) return;
        if (state.cells[y * state.width + x] === color) return;
        dispatch({type: CanvasAction.SET_CELL, payload: { x, y, color: state.activeColor }});
    }

    const pushHistory = () => dispatch({type: CanvasAction.ADD_HISTORY, payload: null});

    const mouseDownHandler = (x: number, y:number) => {
        switch (state.selectedTool) {
            case (ToolType.PAINT): {
                pushHistory();
                setCell(x, y, state.activeColor);
                break;
            }
            case (ToolType.FILL): {
                pushHistory();
                if (withinSelection(x, y)) dispatch({ type: CanvasAction.FILL_SELECTION, payload: null});
                else dispatch({type: CanvasAction.FLOOD_FILL, payload: { x, y, color: state.activeColor}});
                break;
            }
            case (ToolType.SAMPLE): {
                dispatch({ type: CanvasAction.SAMPLE_CELL, payload: {x, y}});
                break;
            }
            case (ToolType.SELECT): {
                setMouseDownLocation({x, y});
            }
        }
        dispatch({type: CanvasAction.SET_SELECTION, payload: null});
    }

    const dragHandler = (x: number, y: number) => {
        if (state.selectedTool === ToolType.PAINT) {
            setCell(x, y, state.activeColor);
        } else if (state.selectedTool === ToolType.SELECT) {
            debounceHandleSelect(x, y);
        }
    }

    const handleSelect = (x: number, y: number) => {
        const minX = Math.min(mouseDownLocation.x, x!);
        const maxX = Math.max(mouseDownLocation.x, x!);
        const minY = Math.min(mouseDownLocation.y, y!);
        const maxY = Math.max(mouseDownLocation.y, y!);
        dispatch({type: CanvasAction.SET_SELECTION, payload: {x: minX, y: minY, width: maxX - minX, height: maxY - minY}});
    }

    const debounceHandleSelect = useCallback(
        _.throttle((x: number, y: number) => handleSelect(x, y), 100),
        [mouseDownLocation]
    )

    const mouseUpHandler = (x?: number, y?: number) => {
        
    }

    const withinSelection = (x: number, y: number) => {
        if (!state.selection) return false;
        return x >= state.selection.x && x <= state.selection.x + state.selection.width
            && y >= state.selection.y && y <= state.selection.y + state.selection.height;
    }

    return (
        <div className={classes.CanvasController}>
            <Canvas 
                mouseDown={mouseDownHandler}
                mouseUp={mouseUpHandler}
                drag={dragHandler}/>
        </div>
    )
}