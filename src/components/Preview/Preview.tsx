import classes from './Preview.module.css';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { CanvasAction, CanvasContext } from '../../context/canvasContext';

export const Preview = () => {
    const { state, dispatch } = useContext(CanvasContext);
    const canvas = useRef<HTMLCanvasElement>(null);
    const [ ctx, setCtx ] = useState<CanvasRenderingContext2D>();

    useEffect(() => {
        if (canvas) {
            setCtx(canvas.current?.getContext("2d") || undefined);
            dispatch({type: CanvasAction.SET_PREVIEW_CANVAS, payload: canvas.current});
        }
    }, [canvas, dispatch]);

    useEffect(() => {
        if (!ctx) return;
        const cellWidth = 64 / state.width;
        for(let y = 0; y < state.height; y++) {
            for (let x = 0; x < state.width; x++) {
                ctx!.fillStyle = state.cells[y * state.width + x];
                ctx!.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
            }
        }
    }, [canvas, ctx, state.width, state.height, state.cells]);

    return (
        <div className={classes.Preview}>
            <p>Preview</p>
            <canvas
                width="64"
                height="64"
                ref={canvas}
                />
        </div>
    )
}