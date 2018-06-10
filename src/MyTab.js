import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
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
        flexDirection: 'column'
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
    teamChooser: {
        fontSize: 5,
        padding: '3px 3px',
        minWidth: 20,
        minHeight: 30
    },
    number: {
        minWidth: 10
    },
    money: {
        minWidth: 60
    },
    winLabel: {
        fontWeight: 'bold',
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

class MyTab extends React.Component {
    render() {
        const { classes, label, history } = this.props;

        const listBetting = history.betting.map((betting, index) => {
            const { time, result, homeTeam, awayTeam, odds, groupTabIndex } = betting.schedule;
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
                            <div style={{color: 'grey'}}>
                                <label>{moment(time).format('MM月DD日')}</label>&nbsp;
                                <label>{GroupTabs.index2lable(groupTabIndex)}</label>
                            </div>
                        </div>
                        <div>
                            <Button className={classes.teamChooser} disableRipple size="small" variant="raised" color={betting.result === 1 ? "secondary" : "default"}>主胜({odds[0]})</Button>
                            <Button className={classes.teamChooser} disableRipple size="small" variant="raised" color={betting.result === 3 ? "secondary" : "default"}>平局({odds[2]})</Button>
                            <Button className={classes.teamChooser} disableRipple size="small" variant="raised" color={betting.result === 2 ? "secondary" : "default"}>客胜({odds[1]})</Button>
                        </div>
                    </div>
                    <label className={win ? classes.winLabel : ''}>{notFinish ? '' : (win ? '赢' : '输')}</label>
                    <label className={win ? classNames(classes.winLabel, classes.money) : classes.money}>{notFinish ? '' : (win ? ('+' + betting.money * betting.odds + '币') : '-' + betting.money + '币')}</label>
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