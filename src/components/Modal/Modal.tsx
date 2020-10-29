import React from 'react';
import classes from './Modal.module.scss';

export const Modal = ({show, close, title, children}: { show: boolean, close: () => void, title: string, children: React.ReactNode}) => {
    return (
        <React.Fragment>
            <div className={[classes.Backdrop, show ? classes.Show : ''].join(' ')} onClick={close}></div>
            <div className={[classes.Modal, show ? classes.Show : ''].join(' ')}>
                <div className={classes.Title}>{title}</div>
                <div className={classes.Body}>{children}</div>
            </div>
        </React.Fragment>
    )
}