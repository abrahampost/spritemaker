import classes from './TopBar.module.scss';
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';

import classnames from 'classnames';
import { CanvasAction, CanvasContext } from '../../context/canvasContext';

const SubMenuFileBrowserItem = ({dispatch}: {dispatch: any}) => {
    const onFileChange = (e: SyntheticEvent) => { 
        if ((e.target as any).files?.length === 0) return;
        let reader = new FileReader();
        reader.readAsText((e.target as any).files[0]);
        reader.onload = () => {
            dispatch({type: CanvasAction.IMPORT_FILE, payload: reader.result});

        }
        reader.onerror = (e) => console.error(e);
    }
    return (
        <div className={classes.SubMenuFileBrowserItem}>
            <input type="file" onChange={onFileChange} value=""></input>
            <label>Import</label>
        </div>
    )
}

const SubMenuItem = ({ label, alt, onClick, disabled}: { label: string, alt?: string, onClick: any, disabled?: boolean}) => {
    return (
        <div className={classnames(classes.SubMenuItem, disabled && classes.Disabled)} onClick={onClick}>
            <span className={classes.Label}>{label}</span>
            <span className={classes.Alt}>{alt}</span>
        </div>
    );
}

const MenuItem = ({label, isOpen, open, children}: {label: string, isOpen: boolean, open: any, children: React.ReactNode}) => {
    return (
        <div className={classes.MenuItem}>
            <label onClick={open}>{label}</label>
            <div className={classnames(classes.SubMenu, isOpen && classes.Open)}>
                {children}
            </div>
        </div>
    )
}

export const TopBar = () => {
    const [ openItem, setOpenItem ] = useState<number | null>(null);
    const { state, dispatch } = useContext(CanvasContext);
    const closeOpenItem = () => setOpenItem(null);
    useEffect(() => {
        
        if (openItem !== null) {
            document.addEventListener("click", closeOpenItem);
        } else {
            document.removeEventListener("click", closeOpenItem);
        }

        return () => document.removeEventListener("click", closeOpenItem);
    }, [openItem])

    return (
        <div className={classes.TopBar}>
            <MenuItem label="File" open={() => setOpenItem(1)}isOpen={openItem === 1}>
                <SubMenuItem 
                    label="New File" 
                    onClick={() => dispatch({type: CanvasAction.NEW_FILE, payload: null})} />
                <SubMenuFileBrowserItem dispatch={dispatch}/>
                <SubMenuItem label="Export" onClick={() => {dispatch({type: CanvasAction.EXPORT_FILE, payload: null})}} />
            </MenuItem>
            <MenuItem label="Edit" open={() => setOpenItem(2)} isOpen={openItem === 2}>
                <SubMenuItem
                    label="Undo"
                    alt="ctrl + z"
                    onClick={() => {dispatch({ type: CanvasAction.UNDO_HISTORY, payload: null})}}
                    disabled={state.undoStack.length === 0} />
                <SubMenuItem
                    label="Redo"
                    alt="ctrl + shift + z"
                    onClick={() => {dispatch({ type: CanvasAction.REDO_HISTORY, payload: null})}}
                    disabled={state.redoStack.length === 0} />
            </MenuItem>
        </div>
    )
}