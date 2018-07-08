import React from 'react';
import { connect } from 'react-redux';
import { showRuleAction } from '../actions';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GroupTabs from '../components/GroupTabs';
import TabTitle from '../components/TabTitle';
import ScheduleItem from '../components/ScheduleItem';

const styles = {
    root: {
        textAlign: 'center'
    },
    schedules: {
    }
};

class ScheduleTab extends React.Component {
    state = {
        groupIndex: 0,
    };

    handleGroupChange = (groupIndex) => {
        this.setState({ groupIndex });
    };

    render() {
        const { classes, label, schedules, onQuestionClick } = this.props;

        const listBets = schedules.reduce((acc, schedule) => {
            if (schedule.groupTabIndex !== this.state.groupIndex) return acc;

            return acc.concat(
                <ListItem key={schedule.id}>
                    <ScheduleItem schedule={schedule} />
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


const mapStateToProps = state => {
    return {
        schedules: state.schedules
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onQuestionClick: () => dispatch(showRuleAction(true))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ScheduleTab));