import classes from './TopBar.module.scss';
import React from 'react';

export const TopBar = () => {
    return (
        <div className={classes.TopBar}>
            <button>File</button>
            <button>Edit</button>
        </div>
    )
}