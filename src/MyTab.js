import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TabTitle from './TabTitle';

const styles = {
    root: {
        textAlign: 'center'
    }
};

class MyTab extends React.Component {
    render() {
        const { classes, label } = this.props;

        return (
            <div className={classes.root}>
                <TabTitle icon='my' label={label} />
            </div>
        )
    }
}

MyTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyTab);