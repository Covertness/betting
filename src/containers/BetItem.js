import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { bettingAction, showErrorAction } from '../actions';
import ScheduleItem from '../components/ScheduleItem';
import { calcBalance } from '../util'

const styles = {
    row: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingBottom: 10
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
    }
};

class BetItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            money: '',
            currentOddsIndex: 0,
            isBetting: false
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
        const {userInfo, schedule, showError, onBetting} = this.props;
        if (money === '' || money <= 0) return;

        if (money > userInfo.money) {
            showError('金币不足。');
            return;
        }

        this.setState({ isBetting: true });
        onBetting(schedule.id, money, currentOddsIndex + 1, schedule.odds[currentOddsIndex]);
        this.setState({ isBetting: false, money: '' });
    }

    render() {
        const { classes, schedule } = this.props;
        const { odds, disableBetting, hasBetting } = schedule;
        const { money, currentOddsIndex, isBetting } = this.state;

        let betText = '投注';
        if (disableBetting) betText = '不可投注'
        else if (isBetting) betText = '投注中'
        else if (hasBetting) betText = '已投注'

        return (
            <div className={classes.row}>
                <ScheduleItem schedule={schedule} />
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
                        <label>{'猜对可赢 '}<b style={{ color: 'red' }}>{parseInt((money || 0) * odds[currentOddsIndex], 10)}</b>{' 金币'}</label>
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
            </div>
        );
    }
}

BetItem.propTypes = {
    classes: PropTypes.object.isRequired,
};


const mapStateToProps = ({ userInfo, schedules, history }) => {
    return {
        userInfo: Object.assign({}, userInfo, { money: calcBalance(userInfo.money, schedules, history) })
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onBetting: (scheduleId, money, result, odds) => dispatch(bettingAction(scheduleId, money, result, odds)),
        showError: (message) => dispatch(showErrorAction(true, message))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BetItem));