import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GroupTabs from './GroupTabs';
import TabTitle from './TabTitle';
import BetItem from './BetItem';

const styles = {
    root: {
        textAlign: 'center'
    },
    schedules: {
    }
};

class ScheduleTab extends React.PureComponent {
    state = {
        groupIndex: 0,
    };

    handleGroupChange = (groupIndex) => {
        this.props.onChangeIndex();
        this.setState({ groupIndex });
    };

    render() {
        const { classes, label, userInfo, schedules, onQuestionClick } = this.props;

        const listBets = schedules.reduce((acc, schedule) => {
            if (schedule.groupTabIndex !== this.state.groupIndex) return acc;

            return acc.concat(
                <ListItem key={schedule.id}>
                    <BetItem userInfo={userInfo} schedule={schedule} />
                </ListItem>
            )
        }, []);

        return (
            <div className={classes.root}>
                <GroupTabs tabIndex={this.state.groupIndex} onTabChange={this.handleGroupChange} />
                <TabTitle icon='schedule' label={label} onQuestionClick={onQuestionClick} />
                <List className={classes.schedules}>{listBets}</List>
            </div>
        )
    }
}

ScheduleTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScheduleTab);