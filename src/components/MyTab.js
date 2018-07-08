import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import TabTitle from './TabTitle';
import GroupTabs from './GroupTabs';

const styles = {
    root: {
        textAlign: 'center'
    },
    tabContent: {
        marginLeft: 16,
        marginRight: 16
    },
    bettings: {
    },
    betting: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    oddBetting: {},
    evenBetting: {
        backgroundColor: '#ededed'
    },
    bettingTeams: {
        display: 'flex',
        flexDirection: 'column',
        width: '15rem'
    },
    bettingTeamsInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bettingTeamsFlag: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    teamFlag: {
        width: 25,
        height: 25,
        margin: 5
    },
    teamChoosers: {
        display: 'flex',
        justifyContent: 'center'
    },
    number: {
        minWidth: 10
    },
    money: {
        minWidth: 60
    },
    winLabel: {
        color: '#cebf88'
    },
    checkinTitle: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        paddingTop: 10,
        paddingBottom: 5,
        fontSize: 16,
        backgroundColor: '#ededed'
    },
    checkin: {
        display: 'flex',
        justifyContent: 'space-between',
        color: 'lightgrey'
    }
};

const resultLabels = ['主', '客', '平'];

class MyTab extends React.Component {
    render() {
        const { classes, label, schedules, history } = this.props;

        const listBetting = history.betting.map((betting, index) => {
            const { time, result, homeTeam, awayTeam, groupTabIndex } = schedules.find(s => s.id === betting.scheduleId);
            const notFinish = result == null;
            const win = result === betting.result;

            const bettingCustom = index % 2 === 0 ? classes.oddBetting : classes.evenBetting;

            return (
                <ListItem key={betting.id} className={classNames(classes.betting, bettingCustom)}>
                    <label className={classes.number}>{index + 1}</label>
                    <div className={classes.bettingTeams}>
                        <div className={classes.bettingTeamsInfo}>
                            <div className={classes.bettingTeamsFlag}>
                                <Avatar className={classes.teamFlag} src={homeTeam.logo} />
                                <label>VS</label>
                                <Avatar className={classes.teamFlag} src={awayTeam.logo} />
                            </div>
                            <label>{!notFinish && resultLabels[betting.result - 1]}</label>
                            <div style={{color: 'grey'}}>
                                <label>{moment(time).format('MM月DD日')}</label>&nbsp;
                                <label>{GroupTabs.index2lable(groupTabIndex)}</label>
                            </div>
                        </div>
                    </div>
                    <label className={win ? classes.winLabel : ''}>{notFinish ? '' : (win ? '赢' : '输')}</label>
                    <label className={win ? classNames(classes.winLabel, classes.money) : classes.money}>{notFinish ? '' : (win ? ('+' + parseInt(betting.money * betting.odds, 10) + '币') : '-' + betting.money + '币')}</label>
                </ListItem>
            )
        });

        const listCheckin = history.checkin.map((checkin, index) => {
            return (
                <ListItem key={index} className={classes.checkin}>
                    <label className={classes.number}>{index + 1}</label>
                    <label>每日签到</label>
                    <label>{moment(checkin.date).format('M月D日')}</label>
                    <label>领</label>
                    <label className={classes.money}>+{checkin.money}币</label>
                </ListItem>
            )
        });

        return (
            <div className={classes.root}>
                <TabTitle icon='my' label={label} />
                <div className={classes.tabContent}>
                    <List className={classes.bettings}>{listBetting}</List>
                    <label className={classes.checkinTitle}>领奖记录</label>
                    <List className={classes.checkins}>{listCheckin}</List>
                </div>
            </div>
        )
    }
}

MyTab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyTab);