import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import moment from 'moment';
import LazyLoad from 'react-lazyload';

const styles = {
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    head: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 10px 15px 10px',
        backgroundColor: '#ededed'
    },
    teamInfo: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 'auto',
        marginTop: 30,
        marginBottom: 20
    },
    team: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10
    },
    teamTitle: {
        width: 80
    },
    flag: {
        boxShadow: 'rgba(0,0,0,0.8) 0 0 3px'
    }
};

class ScheduleItem extends React.Component {
    render() {
        const { classes, schedule } = this.props;
        const { homeTeam, awayTeam, time, group } = schedule;

        return (
            <div className={classes.row}>
                <div className={classes.head}>
                    <label>{moment(time).format('MM月DD日') + ' ' + this.renderDayOfWeek(moment(time).format('d'))}</label>
                    {group &&
                        <label>{group}组</label>
                    }
                </div>
                <div className={classes.teamInfo}>
                    <div className={classes.team}>
                        <ListItemText className={classes.teamTitle} primary={homeTeam.name} />
                        <LazyLoad height={40}>
                            <Avatar src={homeTeam.logo} className={classes.flag} />
                        </LazyLoad>
                    </div>
                    <label>{moment(time).format('HH:mm')}</label>
                    <div className={classes.team}>
                        <LazyLoad height={40}>
                            <Avatar src={awayTeam.logo} className={classes.flag} />
                        </LazyLoad>
                        <ListItemText className={classes.teamTitle} primary={awayTeam.name} />
                    </div>
                </div>
            </div>
        );
    }

    renderDayOfWeek = (num) => {
        const names = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return names[num];
    }
}

ScheduleItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScheduleItem);