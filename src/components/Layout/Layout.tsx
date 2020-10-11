import React from 'react';
import { Tools } from '../../containers/Tools/Tools';
import classes from './Layout.module.css';
import { CanvasController } from '../../containers/CanvasController/CanvasController';

export const Layout = () => {
    return (
        <div className={classes.Layout}>

            <div className={classes.Tools}>
                <Tools />
            </div>
            <div className={classes.Main}>
                <CanvasController />
                <div className={classes.Frames}>
                    <h2>Frames</h2>
                </div>
            </div>
            <div className={classes.Layers}>
                <h2>Layers</h2>
            </div>
        </div>
    )
}