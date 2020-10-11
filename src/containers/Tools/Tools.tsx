import React, { useContext } from 'react';
import { ToolContext } from '../../context/toolContext';
import classes from './Tools.module.scss';

import { FcCursor } from 'react-icons/fc';
import { ImEyedropper } from 'react-icons/im';
import { BiShapeSquare } from 'react-icons/bi';
import { FaPaintBrush, FaRedo, FaUndo } from 'react-icons/fa';
import { RiPaintFill } from 'react-icons/ri';
import { IconType } from 'react-icons';

const tools = [ FaPaintBrush, RiPaintFill, BiShapeSquare, ImEyedropper ]

const Tool = ({id, active, Icon, clicked}: {id: number, active: boolean, Icon: IconType, clicked: any}) => {
    return <div key={id} className={[classes.Tool, active ? classes.Active : null].join(' ')} onClick={clicked}><Icon className={classes.Icon} /></div>
}

export const Tools = () => {
    const { selectedToolId, setSelectedToolId, activeColor, setActiveColor } = useContext(ToolContext);
    const handleColorChange = (color: any) => setActiveColor(color.target.value);
    const toolItems = tools.map((tool, i) => <Tool id={i} active={selectedToolId === i} Icon={tool} key={i} clicked={() => setSelectedToolId(i) }/> )

    return (
        <React.Fragment>
            <div className={classes.Tools}>
                {toolItems}    
            </div>
            <div className={classes.Special} >
                <input className={classes.ColorPicker} type="color" value={activeColor} onChange={handleColorChange} />
                <div className={classes.Undoable}>
                    <FaUndo />
                    <FaRedo />
                </div>
            </div>
        </React.Fragment>
    )
}