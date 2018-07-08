import React, { Component } from 'react';
import { connect } from 'react-redux';
import { checkInAction, confirmCheckInAction, confirmBettingAction, showRuleAction, showErrorAction } from '../actions';
import ImageSlider from '../components/ImageSlider';
import MyBar from './MyInfoBar';
import MainTabs from '../components/MainTabs';
import ErrorSnackbar from '../components/ErrorSnackbar';
import AlertDialog from '../components/AlertDialog';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tips: {
                reward: {
                    content: '每天领取奖励 50 个金币',
                    enable_display: true
                },
                notice: {
                    content: '重要通知',
                    enable_display: true
                },
                rule: {
                    content: '游戏规则',
                    enable_display: true
                }
            }
        };
    }

    handleCheckinClose = () => {
        this.props.onCheckin();
    }

    handleCheckinClick = () => {
        this.props.onConfirmCheckin();
        this.handleCheckinClose();
    }

    handleBettingResultClose = () => {
        this.props.onConfirmBetting();
    }

    handleErrorClose = () => {
        this.props.hideError();
    }

    render() {
        const { tips } = this.state;
        const { reward, rule } = tips;
        const { userInfo, showbettingResult, showRule, onRuleClose, errorMessage } = this.props;

        return (
            <div>
                <div className="App">
                    <ImageSlider images={['img/slider.png', 'img/slider.png', 'img/slider.png']} />
                    <MyBar />
                    <MainTabs />
                </div>
                <AlertDialog open={userInfo.checkin} onClose={this.handleCheckinClose} onClick={this.handleCheckinClick} title="每日领奖" confirm="领取奖励">
                    <img src="img/money.png" alt="money" />&nbsp; {reward.content}
                </AlertDialog>
                <AlertDialog open={showbettingResult} onClose={this.handleBettingResultClose} onClick={this.handleBettingResultClose} title="投注结果" confirm="确定">
                    恭喜投注成功！
                </AlertDialog>
                <AlertDialog open={showRule} onClose={onRuleClose} onClick={onRuleClose} title="游戏规则" confirm="确定">
                    {rule.content}
                </AlertDialog>
                <ErrorSnackbar open={errorMessage.show} onClose={this.handleErrorClose} message={errorMessage.content} />
            </div>
        );
    }
}


const mapStateToProps = state => {
    let checkin = state.userInfo.checkin;
    const today = (new Date()).toDateString();
    const checkinHistory = state.history.checkin.find(c => (new Date(c.date)).toDateString() === today);
    if (checkinHistory) checkin = false;

    return {
        userInfo: Object.assign({}, state.userInfo, { checkin }),
        showRule: state.alert.showRule,
        showbettingResult: state.alert.showbettingResult,
        errorMessage: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCheckin: () => dispatch(checkInAction()),
        onConfirmCheckin: () => dispatch(confirmCheckInAction(50)),
        onRuleClose: () => dispatch(showRuleAction(false)),
        onConfirmBetting: () => dispatch(confirmBettingAction()),
        hideError: () => dispatch(showErrorAction(false))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)