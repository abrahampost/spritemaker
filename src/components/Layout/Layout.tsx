import React from 'react';
import { Tools } from '../../containers/Tools/Tools';
import classes from './Layout.module.css';
import { CanvasController } from '../../containers/CanvasController/CanvasController';
import { Preview } from '../Preview/Preview';

export const Layout = () => {
    return (
        <div className={classes.Layout}>

            <div className={classes.Tools}>
                <Tools />
                <Preview />
            </div>
            <div className={classes.Main}>
                <CanvasController />
                <div className={classes.Frames}>
                </div>
            </div>
            <div className={classes.Layers}>
            </div>
        </div>
    )
}