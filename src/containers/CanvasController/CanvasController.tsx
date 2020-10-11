import React, { SyntheticEvent, useContext, useState } from 'react';
import classes from './CanvasController.module.scss';

import { Canvas } from '../../components/Canvas/Canvas';
import { Layer } from '../../domain/Layer';
import { ToolContext } from '../../context/toolContext';
import { RiContactsBookLine } from 'react-icons/ri';

export const CanvasController = () => {
    const { selectedToolId, activeColor, setActiveColor } = useContext(ToolContext);

    const [ width, setWidth ] = useState(16);
    const [ height, setHeight ] = useState(16);
    const [ border, setBorder ] = useState(true);
    const [ layer, _ ] = useState(new Layer(width, height));
    const [ cells, setCells ] = useState(layer.cells);
    const [ draggedCells, setDraggedCells ] = useState<{x: number, y: number}[]>([]);

    const [ unitDimensions, setUnitDimension ] = useState({x: 16, y: 16});

    const handleDimensionChange = () => {
        setUnitDimension({x: width, y: height});
    }

    const mouseDownHandler = (x: number, y:number) => {
        switch (selectedToolId) {
            case (0): {
                layer.setCell(x, y, activeColor);
                setCells([...layer.cells]);
                return;
            }
            case (1): {
                layer.floodFill(x, y, activeColor);
                setCells([...layer.cells]);
                return;
            }
            case (3): {
                const color = layer.getCell(x, y);
                setActiveColor(color);
            }
        }
    }

    const dragHandler = (x: number, y: number) => {
        layer.setCell(x, y, activeColor);
        if (!draggedCells.some(val => val.x === x && val.y === y)) {
            setDraggedCells([...draggedCells, {x, y}]);
        }
        setCells([...layer.cells]);
    }

    const mouseUpHandler = () => {
        layer.setCells(draggedCells.map(cell => Object.assign(cell, {color: activeColor})));
        setDraggedCells([]);
    }

    return (
        <div className={classes.CanvasController}>
            <Canvas 
                widthUnits={unitDimensions.x}
                heightUnits={unitDimensions.y}
                cells={cells}
                border={border}
                mouseDown={mouseDownHandler}
                mouseUp={mouseUpHandler}
                drag={dragHandler}/>
            <div className={classes.Buttons}>
                <label>Width Units</label>
                <input type="number" min="8" max="128" onChange={(e) => setWidth(+e.target.value)} value={width} />
                <label>Height Units</label>
                <input type="number" min="8" max="128" onChange={(e) => setHeight(+e.target.value)} value={height} />
                <button onClick={handleDimensionChange}>Change</button>
            </div>
        </div>
    )
}