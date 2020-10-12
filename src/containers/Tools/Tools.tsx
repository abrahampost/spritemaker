import React, { SyntheticEvent, useCallback, useContext } from 'react';
import classes from './Tools.module.scss';

import _ from 'lodash';
import { ImEyedropper } from 'react-icons/im';
import { BiShapeSquare } from 'react-icons/bi';
import { FaPaintBrush, FaRedo, FaUndo } from 'react-icons/fa';
import { RiPaintFill } from 'react-icons/ri';
import { IconType } from 'react-icons';
import { CanvasAction, CanvasContext, ToolType } from '../../context/canvasContext';

const tools = [
    {
        type: ToolType.PAINT,
        icon: FaPaintBrush
    },
    {
        type: ToolType.FILL,
        icon: RiPaintFill   
    },
    {
        type: ToolType.SELECT,
        icon: BiShapeSquare
    },
    {
        type: ToolType.SAMPLE,
        icon: ImEyedropper
    }];

const Tool = ({ id, active, Icon, clicked }: { id: number, active: boolean, Icon: IconType, clicked: any }) => {
    return <div key={id} className={[classes.Tool, active ? classes.Active : null].join(' ')} onClick={clicked}><Icon className={classes.Icon} /></div>
}

export const Tools = () => {
    const { state, dispatch } = useContext(CanvasContext);
    const handleColorChange = (e: SyntheticEvent) => {
        e.persist();
        debouncedHandleColorChange(e);
    };
    //Just a little bit of debouncing here reduces almost all lag when dragging
    const debouncedHandleColorChange = useCallback(
        _.throttle((e: SyntheticEvent) => {
            dispatch({ type: CanvasAction.CHANGE_COLOR, payload: (e.target as any).value })
        }, 25, { leading: true, trailing: false}),
        []
    );
    
    const selectTool = (type: ToolType) => dispatch({ type: CanvasAction.SELECT_TOOL, payload: type });
    const toolItems = tools.map((tool, i) => <Tool id={i} active={state.selectedTool === i} Icon={tool.icon} key={i} clicked={() => selectTool(tool.type)} />)

    return (
        <React.Fragment>
            <div className={classes.Tools}>
                {toolItems}
            </div>
            <div className={classes.Special} >
                <p>{state.activeColor}</p>
                <input className={classes.ColorPicker} type="color" value={state.activeColor} onChange={handleColorChange} />
                <div className={classes.Undoable}>
                    <FaUndo className={state.undoStack.length > 0 ? '': classes.Disabled} onClick={() => dispatch({type: CanvasAction.UNDO_HISTORY, payload: null})}/>
                    <FaRedo className={state.redoStack.length > 0 ? '': classes.Disabled} onClick={() => dispatch({type: CanvasAction.REDO_HISTORY, payload: null})}/>
                </div>
            </div>
        </React.Fragment>
    )
}