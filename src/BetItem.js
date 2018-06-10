import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import axios from 'axios';
import LazyLoad from 'react-lazyload';
import { Config } from './Config';

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
        justifyContent: 'center',
        fontSize: 10
    },
    moneyIcon: {
        width: 10,
        marginRight: 5
    },
    bet: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    flag: {
        boxShadow: 'rgba(0,0,0,0.8) 0 0 3px'
    }
};

class BetItem extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.showBettingLayout) {
            this.state = {
                money: '',
                currentOddsIndex: 0,
                isBetting: false
            }
        }
    }

    handleBetHome = () => {
        this.setState({ currentOddsIndex: 0 });
    }

    handleBetTied = () => {
        this.setState({ currentOddsIndex: 2 });
    }

    handleBetAway = () => {
        this.setState({ currentOddsIndex: 1 });
    }

    handleBetNumChange = event => {
        let count = event.target.value;
        if (/^(\d+)?$/.test(count)) {
            this.setState({ money: count });
        }
    }

    handleBetting = () => {
        const { money, currentOddsIndex } = this.state;
        const { schedule } = this.props;
        const { id, odds } = schedule;

        this.setState({ isBetting: true });

        const myId = parseInt(localStorage.getItem('token'), 10);

        axios.post(Config.host + '/bet', { user_id: myId, schedule_id: id, betting_money: parseInt(money, 10), betting_result: currentOddsIndex + 1, betting_odds: odds[currentOddsIndex] })
            .then(response => {
                console.log(response);

                this.setState({ isBetting: false, money: '' });

                this.props.onBettingResult({
                    code: 0,
                    data: response
                });
            })
            .catch(error => {
                console.error(error);

                this.setState({ isBetting: false });

                this.props.onBettingResult({
                    code: 1,
                    message: JSON.stringify(error.response.data)
                });
            });
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
        const { odds, disableBetting, hasBetting } = schedule;
        const { money, currentOddsIndex, isBetting } = this.state;

        let betText = '投注';
        if (disableBetting) betText = '不可投注'
        else if (isBetting) betText = '投注中'
        else if (hasBetting) betText = '已投注'

        return (
            <div>
                <div className={classes.betInfo}>
                    <Button className={classes.teamChooser} size="small" variant="raised" color={currentOddsIndex === 0 ? "secondary" : "default"} onClick={this.handleBetHome}>
                        主胜（{odds[0]}）
                    </Button>
                    <Button className={classes.teamChooser} size="small" variant="raised" color={currentOddsIndex === 2 ? "secondary" : "default"} onClick={this.handleBetTied}>
                        平局（{odds[2]}）
                    </Button>
                    <Button className={classes.teamChooser} size="small" variant="raised" color={currentOddsIndex === 1 ? "secondary" : "default"} onClick={this.handleBetAway}>
                        客胜（{odds[1]}）
                    </Button>
                </div>
                <div className={classes.rewardInfo}>
                    <img className={classes.moneyIcon} src="img/money.png" alt="money" />
                    <label>{'猜对可赢 '}<b style={{ color: 'red' }}>{(money || 0) * odds[currentOddsIndex]}</b>{' 金币'}</label>
                </div>
                <div className={classes.bet}>
                    <TextField
                        label="下注金额"
                        placeholder="1000"
                        type="number"
                        value={money}
                        disabled={betText !== '投注'}
                        onChange={this.handleBetNumChange}
                    />
                    <Button size="small" variant="raised" color="primary" disabled={betText !== '投注'} onClick={this.handleBetting}>{betText}</Button>
                </div>
            </div>
        );
    }
}

BetItem.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BetItem);