import React, { SyntheticEvent, useContext, useState } from 'react';
import classes from './ExportModal.module.scss';
import { CanvasAction, CanvasContext } from '../../../context/canvasContext';
import { Modal } from '../../Modal/Modal';

export const ExportModal = ({show, close}: { show: boolean, close: () => void}) => {
    const { dispatch } = useContext(CanvasContext);
    const [type, setType] = useState('bmp');
    const [ fileName, setFileName ] = useState('MyImage');
    const handleNameChange = (e: SyntheticEvent) => {
        setFileName((e.target as any).value);
    }
    return (
        <Modal show={show} title="Export" close={close}>
            <form className={classes.ExportModal} noValidate autoComplete="off">
                <div>
                    <label>File Name:</label>
                    <input type="text" onChange={handleNameChange} placeholder="My_Save"/>
                </div>
                <select value={type} onChange={(e: any) => setType(e.target.value)}>
                    <option value="bmp">541 BMP</option>
                    <option value="png">PNG</option>
                </select>
                <button onClick={() => {dispatch({type: CanvasAction.EXPORT_FILE, payload: { fileType: type, fileName: fileName }})}}>
                    Export as {type.toUpperCase()}
                </button>
            </form>
            <div className={classes.Close}>
                <button onClick={close}>Close</button>
            </div>
        </Modal>
    );
}