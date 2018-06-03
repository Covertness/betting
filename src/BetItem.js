import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import NativeSelect from '@material-ui/core/NativeSelect';
import moment from 'moment';

const styles = {
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        borderBottomStyle: 'solid'
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
        width: 300,
        margin: 'auto',
        marginTop: 30,
        marginBottom: 20
    },
    team: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    betInfo: {
        display: 'flex',
        justifyContent: 'center'
    },
    teamChooser: {
        width: 200,
        marginBottom: 20
    },
    rewardInfo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    moneyIcon: {
        width: 10,
        marginRight: 5
    },
    bet: {
        display: 'flex',
        justifyContent: 'space-between'
    }
};

class BetItem extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.showBettingLayout) {
            this.state = {
                betNums: this.calcBetNums(this.props.userInfo.money),
                currentBetIndex: 0,
                currentOddsIndex: 0
            }
        }
    }

    handleBetHome = event => {
        this.setState({ currentOddsIndex: 0 });
    }

    handleBetAway = event => {
        this.setState({ currentOddsIndex: 2 });
    }

    handleBetNumChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    render() {
        const { classes, schedule, showBettingLayout } = this.props;
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
                        <ListItemText primary={homeTeam.name} />
                        <Avatar src={homeTeam.logo} />
                    </div>
                    <label>{moment(time).format('HH:mm')}</label>
                    <div className={classes.team}>
                        <Avatar src={awayTeam.logo} />
                        <ListItemText primary={awayTeam.name} />
                    </div>
                </div>
                {showBettingLayout && this.renderBettingLayout()}
            </div>
        );
    }

    calcBetNums = (totalMoney) => {
        const basicBetNums = [500, 1000, 3000, 5000];

        return basicBetNums.reduce((acc, bet, index) => {
            if (bet >= totalMoney) {
                if (acc[acc.length - 1] === totalMoney) return acc;
                else return acc.concat(totalMoney);
            } else {
                acc = acc.concat(bet);
                if (index === basicBetNums.length - 1) return acc.concat(totalMoney);
                else return acc;
            }
        }, []);
    }

    renderDayOfWeek = (num) => {
        const names = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return names[num];
    }

    renderBettingLayout = () => {
        const { classes, schedule } = this.props;
        const { odds } = schedule;
        const { betNums, currentBetIndex, currentOddsIndex } = this.state;

        const betNumMenus = betNums.map((betNum, index) => {
            return (
                <option key={index} value={index}>{betNum}</option>
            )
        });

        return (
            <div>
                <div className={classes.betInfo}>
                    <Button className={classes.teamChooser} variant="raised" color={currentOddsIndex === 0 ? "secondary" : "default"} onClick={this.handleBetHome}>
                        主胜（{odds[0]}）
                    </Button>
                    <Button className={classes.teamChooser} variant="raised" color={currentOddsIndex === 2 ? "secondary" : "default"} onClick={this.handleBetAway}>
                        客胜（{odds[2]}）
                    </Button>
                </div>
                <div className={classes.rewardInfo}>
                    <img className={classes.moneyIcon} src="img/money.png" alt="money" />
                    <label>{'猜对可赢 '}<b style={{ color: 'red' }}>{betNums[currentBetIndex] * odds[currentOddsIndex]}</b>{' 金币'}</label>
                </div>
                <div className={classes.bet}>
                    <NativeSelect
                        value={currentBetIndex}
                        onChange={this.handleBetNumChange}
                        name="currentBetIndex"
                    >
                        {betNumMenus}
                    </NativeSelect>
                    <Button variant="raised" color="primary">投注</Button>
                </div>
            </div>
        );
    }
}

BetItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BetItem);