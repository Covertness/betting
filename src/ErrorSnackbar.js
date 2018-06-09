import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const styles = {
    root: {
    }
}

function ErrorSnackbar(props) {
    const { classes, open, message, onClose } = props;

    return (
        <div className={classes.root}>
            <Snackbar
                ContentProps={{
                    'aria-describedby': 'message-id',
                    style: {
                        backgroundColor: '#d32f2f'
                    }
                }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={onClose}
                message={<span id="message-id">{message}</span>}
            />
        </div>
    );
}

ErrorSnackbar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ErrorSnackbar);