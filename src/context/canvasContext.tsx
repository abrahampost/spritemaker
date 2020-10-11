import React, { createContext, useReducer } from 'react';

enum ToolType {
    PAINT = 0,
    FILL,
    SELECT,
    SAMPLE
}

enum CanvasAction {
    NEW_FILE,
    IMPORT_FILE,
    EXPORT_FILE,
    SET_CELL,
    FLOOD_FILL,
    SAMPLE_CELL,
    ADD_HISTORY,
    UNDO_HISTORY,
    REDO_HISTORY,
    SELECT_TOOL,
    CHANGE_COLOR
}

interface CanvasState {
    width: number;
    height: number;
    undoStack: string[][];
    redoStack: string[][];
    cells: string[];
    previousTool: ToolType | null;
    selectedTool: ToolType;
    activeColor: string
}

const defaultState: CanvasState = { 
    width: 16,
    height: 16,
    undoStack: [],
    redoStack: [],
    cells: [...Array(16* 16).fill('#ffffff')],
    previousTool: null,
    selectedTool: ToolType.PAINT,
    activeColor: '#000000'
};

const CanvasContext = createContext({
    state: defaultState,
    dispatch: ({ type, payload}: { type: CanvasAction, payload: any}) => {}
});

const canvasReducer = (state: CanvasState, action: { type: CanvasAction, payload: any}) => {
    const { type, payload } = action;
    switch (type) {
        case (CanvasAction.NEW_FILE): {
            return {...defaultState};
        }
        case (CanvasAction.EXPORT_FILE): {
            const link = document.createElement('a');
            const data = state.cells.map(cell => {
                return cell.substring(1,2) + cell.substring(3,4) + cell.substring(5, 6);
            }).join('\n');
            link.href='data:,' + encodeURIComponent(data);
            console.log(link.href);
            link.setAttribute('download', "my_save.dat");
            link.click();
            link.parentNode?.removeChild(link);
            return state;
        }
        case (CanvasAction.IMPORT_FILE): {
            const splitLines = (payload as string)
                                .split("\n");
            if (splitLines.length !== state.width * state.height) {
                alert(`Wrong number of lines: received ${splitLines.length}, expected: ${state.width * state.height}`);
                return state;
            }
            const newCells = splitLines.map(line => ['#', line.charAt(0) + line.charAt(0) + line.charAt(1) + line.charAt(1) + line.charAt(2) + line.charAt(2)].join(''));
            console.log(newCells);
            return {...state, cells: newCells};
        }
        case (CanvasAction.SET_CELL): {
            const { x, y, color } = payload;
            const newCells = [...state.cells];
            newCells[y * state.width + x] = color;
            return { ...state, cells: newCells };
        }
        case (CanvasAction.FLOOD_FILL): {
            const { x, y, color } = payload;
            const origColor = state.cells[y * state.width + x];
            const newCells = [...state.cells];
            if (origColor === color) return state;
            const helper = (x: number, y: number, origColor: string, color: string) => {
                if (x < 0 || x >= state.width || y < 0 || y >= state.height || state.cells[y * state.width + x] !== origColor || newCells[y * state.width + x] === color) return;
                newCells[y * state.width + x] = color;
                helper(x - 1, y + 1, origColor, color);
                helper(x    , y + 1, origColor, color);
                helper(x + 1, y + 1, origColor, color);
                helper(x - 1, y    , origColor, color);
                helper(x + 1, y    , origColor, color);
                helper(x - 1, y - 1, origColor, color);
                helper(x    , y - 1, origColor, color);
                helper(x + 1, y - 1, origColor, color);
            }
            helper(x, y, origColor, color);
            return { ...state, cells: newCells }
        }
        case (CanvasAction.ADD_HISTORY): {
            const newUndoStack = [...state.undoStack, [...state.cells]];
            if (newUndoStack.length > 20) newUndoStack.shift();
            return {...state, undoStack: newUndoStack, redoStack: []}
        }
        case (CanvasAction.UNDO_HISTORY): {
            if(state.undoStack.length === 0) return state;
            const newRedoStack = [[...state.cells], ...state.redoStack];
            const newUndoStack = [...state.undoStack];
            const newCells = newUndoStack.pop() || [...Array(state.width * state.height).fill('#ffffff')];
            return {...state, cells: [...newCells], undoStack: newUndoStack, redoStack: newRedoStack};
        }
        case (CanvasAction.REDO_HISTORY): {
            if(state.redoStack.length === 0) return state;
            const newRedoStack = [...state.redoStack];
            const newUndoStack = [...state.undoStack, [...state.cells]];
            const newCells = newRedoStack.shift() || [...Array(state.width * state.height).fill('#ffffff')];
            const newState = {...state, cells: [...newCells], undoStack: newUndoStack, redoStack: newRedoStack};
            return newState;
        }
        case (CanvasAction.SAMPLE_CELL): {
            const { x, y } = payload;
            const newColor = state.cells[y * state.width + x]
            return {...state, activeColor: newColor, selectedTool: state.previousTool || ToolType.PAINT, previousTool: null }
        }
        case (CanvasAction.SELECT_TOOL): {
            return {...state, previousTool: state.selectedTool, selectedTool: payload}; 
        }
        case (CanvasAction.CHANGE_COLOR): {
            return {...state, activeColor: payload}
        }
        default: {
            return state;
        }
    }
}

const CanvasProvider = ({children}: {children: React.ReactNode}) => {
    const [ state, dispatch ] = useReducer(canvasReducer, defaultState);
    return (
        <CanvasContext.Provider value={{state, dispatch}}>
            {children}
        </CanvasContext.Provider>
    )
}

export default CanvasProvider;

export { CanvasAction, ToolType, CanvasContext}