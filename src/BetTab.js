import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GroupTabs from './GroupTabs';
import BetItem from './BetItem';
import TabTitle from './TabTitle';

const styles = {
    root: {
        textAlign: 'center'
    },
    bets: {
    }
};

class BetTab extends React.Component {
    state = {
        groupIndex: 0,
    };

    handleGroupChange = (groupIndex) => {
        this.props.onChangeIndex();
        this.setState({ groupIndex });
    };

    render() {
        const { classes, label, schedules, userInfo } = this.props;

        const listBets = schedules.reduce((acc, schedule) => {
            if (schedule.groupTabIndex !== this.state.groupIndex) return acc;

            return acc.concat(
                <ListItem key={schedule.id}>
                    <BetItem userInfo={userInfo} schedule={schedule} showBettingLayout />
                </ListItem>
            )
        }, []);

        return (
            <div className={classes.root}>
                <GroupTabs tabIndex={this.state.groupIndex} onTabChange={this.handleGroupChange} />
                <TabTitle icon='bet' label={label} />
                <List className={classes.bets}>{listBets}</List>
            </div>
        )
    }
}

BetTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BetTab);