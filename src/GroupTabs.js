import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
    root: {
    },
    tabLabels: {
        color: 'white',
        backgroundColor: '#263d6e',
    },
    tabLabel: {
        maxWidth: 'none'
    }
};

class GroupTabs extends React.Component {
    handleChange = (event, value) => {
        this.props.onTabChange(value);
    };

    render() {
        const { classes, tabIndex } = this.props;

        return (
            <div className={classes.root}>
                <AppBar position="static" color="inherit" className={classes.tabLabels}>
                    <Tabs
                        value={tabIndex}
                        onChange={this.handleChange}
                        TabIndicatorProps={{
                            style: {
                                color: '#d3c38b',
                                backgroundColor: '#d3c38b'
                            }
                        }}
                        fullWidth
                    >
                        <Tab label="小组赛" className={classes.tabLabel} />
                        <Tab label="8强赛" className={classes.tabLabel} />
                        <Tab label="4强赛" className={classes.tabLabel} />
                        <Tab label="半决赛" className={classes.tabLabel} />
                        <Tab label="总决赛" className={classes.tabLabel} />
                    </Tabs>
                </AppBar>
            </div>
        );
    }
}

GroupTabs.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GroupTabs);