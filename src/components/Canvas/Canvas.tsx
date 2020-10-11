import React, { createRef, Ref, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import classes from './Canvas.module.scss';
import { CanvasContext, ToolType } from '../../context/canvasContext';

const MAX_DIMENSION = 512;

export const Canvas = ({mouseDown, mouseUp, drag}: { mouseDown: (x:number, y: number) => void, mouseUp: (x: number, y: number) => void, drag: (x: number, y:number) => void }) => {
    const canv: Ref<HTMLCanvasElement> = createRef();
    const [ ctx, setCtx ] = useState<CanvasRenderingContext2D | null>(null);
    const [ dimensions, setDimensions ] = useState({ x: MAX_DIMENSION, y: MAX_DIMENSION });

    const [ cellWidth, setCellWidth ] = useState(MAX_DIMENSION / 16);
    const [ isMouseDown, setMouseDown ] = useState(false);
    const { state } = useContext(CanvasContext);

    useEffect(() => {
        if (canv) {
            setCtx(canv.current?.getContext("2d") || null);
        }
    }, [ canv ]);

    useEffect(() => {
        if (state.width > state.height) {
            setDimensions({x: MAX_DIMENSION, y: Math.round((state.height / state.width) * MAX_DIMENSION)});
            setCellWidth(MAX_DIMENSION / state.width);
        } else if (state.height > state.width) {
            setDimensions({x: Math.round((state.width / state.height) * MAX_DIMENSION), y: MAX_DIMENSION});
            setCellWidth(MAX_DIMENSION / state.height);
        } else {
            setDimensions({x: MAX_DIMENSION, y: MAX_DIMENSION});
            setCellWidth(MAX_DIMENSION / state.width);
        }
    }, [state.width, state.height])

    useEffect(() => {
        if (!ctx) return;
        ctx!.fillStyle = "#000000";
        ctx.fillRect(0, 0, dimensions.x, dimensions.y);

        for(let y = 0; y < state.height; y++) {
            for (let x = 0; x < state.width; x++) {
                ctx!.fillStyle = state.cells[y * state.width + x];
                ctx!.fillRect(x * cellWidth, y * cellWidth, cellWidth - 1, cellWidth - 1);
            }
        }

        // make selection
        if (state.selection != null) {
            ctx.lineWidth = 5;
            ctx.fillStyle = "#0000ff88";
            ctx.fillRect(state.selection.x * cellWidth - 1, state.selection.y * cellWidth - 1, (state.selection.width + 1) * cellWidth + 1, (state.selection.height + 1) * cellWidth + 1);
            ctx.lineWidth = 1;
        }

        // Draw Border
        ctx!.strokeStyle = "#333333";
        for(let i = 1; i < state.width; i++) {
            ctx!.moveTo(cellWidth * i, 0);
            ctx!.lineTo(cellWidth * i, dimensions.y)
            ctx.stroke();
        }
        for(let i = 1; i < state.height; i++) {
            ctx!.moveTo(0, cellWidth * i);
            ctx!.lineTo(dimensions.x, cellWidth * i);
            ctx.stroke();
        }

    }, [ ctx, cellWidth, dimensions, state.width, state.height, state.cells, state.selection ])

    const mouseDownHandler = (e: any) => {
        const x: number = 0 + e.nativeEvent.offsetX;
        const y: number = 0 + e.nativeEvent.offsetY;
        const xCell = Math.floor(x / (cellWidth));
        const yCell = Math.floor(y / (cellWidth));
        mouseDown(xCell, yCell);
        setMouseDown(true);
    }
    
    const mouseUpHandler = (e: any) => {
        const x: number = 0 + e.nativeEvent.offsetX;
        const y: number = 0 + e.nativeEvent.offsetY;
        const xCell = Math.floor(x / (cellWidth));
        const yCell = Math.floor(y / (cellWidth));
        mouseUp(xCell, yCell);
        setMouseDown(false);
    }

    const dragHandler = (e: any) => {
        if (!isMouseDown) return;

        const x: number = 0 + e.nativeEvent.offsetX;
        const y: number = 0 + e.nativeEvent.offsetY;
        const xCell = Math.floor(x / (cellWidth));
        const yCell = Math.floor(y / (cellWidth));

        drag(xCell, yCell);
    }

    return (
        (
        <canvas
            className={classnames(classes.Canvas,
                state.selectedTool === ToolType.SELECT && classes.Selecting,
                state.selectedTool === ToolType.FILL && classes.Filling,
                state.selectedTool === ToolType.PAINT && classes.Painting,
                state.selectedTool === ToolType.SAMPLE && classes.Sampling)}
            ref={canv}
            width={dimensions.x}
            height={dimensions.y}
            onMouseMove={dragHandler}
            onMouseDown={mouseDownHandler}
            onMouseUp={mouseUpHandler} />
        )
    )

}