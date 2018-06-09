import React, { Component } from 'react';
import axios from 'axios';
import ImageSlider from './ImageSlider';
import MyBar from './MyBar';
import MainTabs from './MainTabs';
import ErrorSnackbar from './ErrorSnackbar';
import AlertDialog from './AlertDialog';
import { Config } from './Config';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {
                checkin: false
            },
            banners: [],
            teams: [],
            schedules: [],
            ranks: [],
            history: {
                betting: [],
                checkin: []
            },
            showBettingResult: false,
            bettingResult: '',
            errorOpen: false,
            errorMessage: ''
        };
    }

    componentDidMount() {
        this.fetchAll();
    }

    handleCheckinClose = () => {
        this.setState((prevState, _props) => ({
            userInfo: Object.assign(prevState.userInfo, {
                checkin: false
            })
        }));
    }

    handleCheckinClick = () => {
        const myId = parseInt(localStorage.getItem('token'), 10);

        axios.post(Config.host + '/daily_reward', { user_id: myId })
            .then(response => {
                console.log(response);
                return this.fetchLatest();
            })
            .then(() => {
                this.setState((prevState, _props) => ({
                    userInfo: Object.assign(prevState.userInfo, {
                        checkin: false
                    })
                }));
            }).catch(error => {
                console.error(error);
                this.showError('checkin failed: ' + error.request.responseURL + ' ' + JSON.stringify(error.response.data));
            });
    }

    handleBettingResult = (result) => {
        const code = result.code;

        let bettingResult = '';
        if (code === 0) {
            bettingResult = '恭喜投注成功！'

            this.fetchLatest().catch(e => {
                this.showError('Fetching latest failed: ' + e.request.responseURL + ' ' + JSON.stringify(e.response.data));
            });
        } else {
            bettingResult = '投注失败：' + result.message
        }

        this.setState({ showBettingResult: true, bettingResult });
    }

    handleBettingResultClose = () => {
        this.setState({ showBettingResult: false, bettingResult: '' });
    }

    handleErrorClose = () => {
        this.setState({ errorOpen: false });
    }

    render() {
        const { banners, userInfo, schedules, teams, ranks, history, showBettingResult, bettingResult, errorOpen, errorMessage } = this.state;

        const expandedSchedules = this.expandSchedule(schedules, teams);

        return (
            <div>
                <div className="App">
                    <ImageSlider images={banners} />
                    <MyBar userInfo={userInfo} />
                    <MainTabs
                        schedules={expandedSchedules}
                        ranks={ranks}
                        userInfo={userInfo}
                        history={this.expandHistory(history, expandedSchedules)}
                        onBettingResult={this.handleBettingResult}
                    />
                </div>
                <AlertDialog open={userInfo.checkin} onClose={this.handleCheckinClose} onClick={this.handleCheckinClick} title="每日领奖" confirm="领取奖励">
                    <img src="img/money.png" alt="money" />&nbsp;+500金币
                </AlertDialog>
                <AlertDialog open={showBettingResult} onClose={this.handleBettingResultClose} onClick={this.handleBettingResultClose} title="投注结果" confirm="确定">
                    {bettingResult}
                </AlertDialog>
                <ErrorSnackbar open={errorOpen} onClose={this.handleErrorClose} message={errorMessage} />
            </div>
        );
    }

    expandSchedule = (schedule, teams) => {
        const teamsMap = {};
        teams.forEach(element => {
            teamsMap[element.id] = element;
        });

        return schedule.map(element => Object.assign(element, {
            homeTeam: teamsMap[element.homeTeamId],
            awayTeam: teamsMap[element.awayTeamId]
        }));
    }

    expandHistory = (history, schedule) => {
        const scheduleMap = {};
        schedule.forEach(element => {
            scheduleMap[element.id] = element;
        });

        history.betting = history.betting.map(element => Object.assign(element, {
            schedule: scheduleMap[element.scheduleId]
        }));
        return history;
    }

    fetchAll = async () => {
        try {
            const { data: banners } = await axios.get('./samples/banners.json');
            const { data: teams } = await axios.get('./samples/teams.json');

            this.setState({ banners, teams });

            await this.fetchLatest();
        } catch (e) {
            console.error(e);
            this.setState({ errorOpen: true, errorMessage: 'Fetching all failed: ' + e.request.responseURL + ' ' + JSON.stringify(e.response.data) });
        }
    }

    fetchLatest = async () => {
        const myId = localStorage.getItem('token');

        const { data: userInfo } = await axios.get(Config.host + '/my?user_id=' + myId);
        const { data: { schedules } } = await axios.get(Config.host + '/schedules?user_id=' + myId);
        // const { data: users } = await axios.get('./samples/users.json');
        const { data: { rank } } = await axios.get(Config.host + '/rank?limit=20');
        const { data: { betting_history } } = await axios.get(Config.host + '/betting_history?user_id=' + myId);
        const { data: { reward_history } } = await axios.get(Config.host + '/reward_history?user_id=' + myId);

        this.setState({ userInfo: this.transformMy(userInfo), schedules: this.transformSchedules(schedules), ranks: this.transformRanks(rank), history: this.transformHistory(betting_history, reward_history) });
    }

    transformMy = my => {
        return {
            "id": my.id,
            "nickName": my.cn_name,
            "avatarUrl": "//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg",
            "money": my.money,
            "income": my.money,
            "betCount": my.win_count,
            "winCount": my.win_count,
            "rank": my.rank,
            "checkin": my.daily_reward
        }
    }

    transformSchedules = schedules => schedules.map(schedule => {
        return {
            id: schedule.schedule_id,
            homeTeamId: 1, // schedule.home_team,
            awayTeamId: 0, // schedule.away_team,
            odds: [schedule.home_team_win_odds, schedule.away_team_win_odds, schedule.tied_odds],
            time: schedule.schedule_time,
            group: schedule.schedule_group,
            groupTabIndex: schedule.schedule_type,
            disableBetting: schedule.disable_betting,
            result: schedule.schedule_status
        }
    })

    transformHistory = (bettingHistory, rewardHistory) => {
        const betting = bettingHistory.map((item, index) => {
            return {
                id: index,
                scheduleId: item.schedule_id,
                money: item.betting_money,
                result: item.betting_result,
                odds: item.betting_odds
            }
        });

        const checkin = rewardHistory.map((item) => {
            return {
                date: item.reward_time,
                money: item.reward_money
            }
        });

        return { betting, checkin }
    }

    transformRanks = ranks => ranks.map((rank, index) => {
        return {
            id: index,
            nickName: rank.cn_name,
            avatarUrl: "//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg",
            money: rank.money,
            betCount: 0,
            winCount: 0
        }
    })

    showError = errorMessage => {
        this.setState({ errorOpen: true, errorMessage });
    }
}

export default App;
