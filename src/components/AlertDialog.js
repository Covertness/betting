import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const styles = {
    root: {
    },
    title: {
        backgroundImage: 'url(./img/alert-title.png)',
        backgroundSize: 'cover',
        textAlign: 'center',
        color: '#cebf88',
        fontSize: 20
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 20,
        fontSize: 16
    },
    button: {
        justifyContent: 'center'
    }
}

function AlertDialog(props) {
    const { classes, open, onClose, title, children, confirm, onClick } = props;

    return (
        <div className={classes.root}>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" disableTypography className={classes.title}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.content} id="alert-dialog-description">{children}</DialogContentText>
                </DialogContent>
                <DialogActions className={classes.button}>
                    <Button onClick={onClick} variant="raised" color="primary">{confirm}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AlertDialog);