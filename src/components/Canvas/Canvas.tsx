import React, { createRef, Ref, useContext, useEffect, useState } from 'react';
import classnames from 'classnames';
import classes from './Canvas.module.scss';
import { CanvasContext, ToolType } from '../../context/canvasContext';

const MAX_DIMENSION = 512;

export const Canvas = ({widthUnits, heightUnits,  cells, mouseDown, mouseUp, drag}: { widthUnits: number, heightUnits: number, cells: string[], mouseDown: (x:number, y: number) => void, mouseUp: () => void, drag: (x: number, y:number) => void }) => {
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
        if (widthUnits > heightUnits) {
            setDimensions({x: MAX_DIMENSION, y: Math.round((heightUnits / widthUnits) * MAX_DIMENSION)});
            setCellWidth(MAX_DIMENSION / widthUnits);
        } else if (heightUnits > widthUnits) {
            setDimensions({x: Math.round((widthUnits / heightUnits) * MAX_DIMENSION), y: MAX_DIMENSION});
            setCellWidth(MAX_DIMENSION / heightUnits);
        } else {
            setDimensions({x: MAX_DIMENSION, y: MAX_DIMENSION});
            setCellWidth(MAX_DIMENSION / widthUnits);
        }
    }, [widthUnits, heightUnits])

    useEffect(() => {
        if (!ctx) return;

        // Draw Border
        ctx!.fillStyle = "#000000";
        ctx.fillRect(0, 0, dimensions.x, dimensions.y);
        ctx!.strokeStyle = "#000";
        for(let i = 1; i < widthUnits; i++) {
            ctx!.moveTo(cellWidth * i + 1, 0);
            ctx!.lineTo(cellWidth * i + 1, dimensions.y)
            ctx.stroke();
        }
        for(let i = 1; i < heightUnits; i++) {
            ctx!.moveTo(0, cellWidth * i + 1);
            ctx!.lineTo(dimensions.x, cellWidth * i + 1);
            ctx.stroke();
        }
        
        for(let y = 0; y < heightUnits; y++) {
            for (let x = 0; x < widthUnits; x++) {
                ctx!.fillStyle = cells[y * widthUnits + x];
                ctx!.fillRect(x * cellWidth, y * cellWidth, cellWidth - 1, cellWidth - 1);
            }
        }
    }, [ widthUnits, heightUnits, cells, ctx, cellWidth, dimensions ])

    const mouseDownHandler = (e: any) => {
        const x: number = 0 + e.nativeEvent.offsetX;
        const y: number = 0 + e.nativeEvent.offsetY;
        const xCell = Math.floor(x / (cellWidth));
        const yCell = Math.floor(y / (cellWidth));
        mouseDown(xCell, yCell);
        setMouseDown(true);
    }

    const mouseUpHandler = (e: any) => {
        mouseUp();
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