import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import GroupTabs from '../components/GroupTabs';
import TabTitle from '../components/TabTitle';
import BetItem from './BetItem';

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
        this.setState({ groupIndex });
    };

    render() {
        const { classes, label, schedules } = this.props;

        const listBets = schedules.reduce((acc, schedule) => {
            if (!schedule.showBet) return acc;
            if (schedule.groupTabIndex !== this.state.groupIndex) return acc;

            return acc.concat(
                <ListItem key={schedule.id}>
                    <BetItem schedule={schedule} />
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


const mapStateToProps = ({ schedules, history }) => {
    const bettingMap = {};
    history.betting.forEach(betting => {
        bettingMap[betting.scheduleId] = betting;
    });

    return {
        schedules: schedules.map(schedule => {
            if (bettingMap[schedule.id]) {
                return Object.assign({ hasBetting: true }, schedule);
            } else {
                return schedule;
            }
        })
    }
}

export default connect(mapStateToProps)(withStyles(styles)(BetTab));