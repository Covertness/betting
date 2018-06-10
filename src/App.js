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
            errorMessage: '',
            ruleOpen: false,
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

    componentDidMount() {
        if (localStorage.getItem('first_login') === 'true') {
            this.firstLogin = true;
            localStorage.setItem('first_login', false);
        }

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
                this.handleCheckinClose();
            }).catch(error => {
                console.error(error);
                this.showError('checkin failed: ' + error.request.responseURL + ' ' + JSON.stringify(error.response.data));
            });
    }

    handleQuestionClick = () => {
        this.setState({
            ruleOpen: true
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

    handleRuleClose = () => {
        this.setState({ ruleOpen: false });
    }

    handleErrorClose = () => {
        this.setState({ errorOpen: false });
    }

    render() {
        const { banners, userInfo, schedules, teams, ranks, history, showBettingResult, bettingResult, errorOpen, ruleOpen, errorMessage, tips } = this.state;
        const { reward, notice, rule } = tips;

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
                        onQuestionClick={this.handleQuestionClick}
                    />
                </div>
                <AlertDialog open={userInfo.checkin} onClose={this.handleCheckinClose} onClick={this.handleCheckinClick} title="每日领奖" confirm="领取奖励">
                    <img src="img/money.png" alt="money" />&nbsp; {reward.content}
                </AlertDialog>
                <AlertDialog open={showBettingResult} onClose={this.handleBettingResultClose} onClick={this.handleBettingResultClose} title="投注结果" confirm="确定">
                    {bettingResult}
                </AlertDialog>
                <AlertDialog open={ruleOpen} onClose={this.handleRuleClose} onClick={this.handleRuleClose} title="游戏规则" confirm="确定">
                    {rule.content}
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
            const { data: { country } } = await axios.get(Config.host + '/country');
            const { data: { tips: { tips } } } = await axios.get(Config.host + '/tips');

            this.setState({ banners, teams: this.transformTeams(country), tips: this.transformTips(tips) });

            await this.fetchLatest();
        } catch (e) {
            if (e.response.data && e.response.data.status === 9) {
                // login again
                localStorage.clear();
                window.location.href = window.location.href + '?time=' + ((new Date()).getTime());
            }

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

        this.setState({ userInfo: this.transformMy(userInfo), schedules: this.transformSchedules(schedules, betting_history), ranks: this.transformRanks(rank), history: this.transformHistory(betting_history, reward_history) });
    }

    transformMy = my => {
        let checkin = my.daily_reward;
        if (checkin === true && this.firstLogin === true) {
            checkin = false;
        }

        return {
            "id": my.id,
            "nickName": my.en_name,
            "avatarUrl": "./img/qq.png",
            "money": my.money,
            "income": my.money,
            "betCount": my.bet_count,
            "winCount": my.win_count,
            "rank": my.rank,
            "checkin": checkin
        }
    }

    transformSchedules = (schedules, bettingHistory) => {
        const bettingHistoryMap = {};
        bettingHistory.forEach(element => {
            bettingHistoryMap[element.schedule_id] = element;
        });

        return schedules.map(schedule => {
            return {
                id: schedule.schedule_id,
                homeTeamId: schedule.home_team,
                awayTeamId: schedule.away_team,
                odds: [schedule.home_team_win_odds, schedule.away_team_win_odds, schedule.tied_odds],
                time: schedule.schedule_time,
                group: schedule.schedule_group === 'X' ? null : schedule.schedule_group,
                groupTabIndex: schedule.schedule_type,
                disableBetting: schedule.disable_betting,
                hasBetting: bettingHistoryMap[schedule.schedule_id] != null,
                result: schedule.schedule_status,
                showBet: schedule.enable_dispaly
            }
        })
    }

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

    transformRanks = ranks => ranks.map((rank) => {
        return {
            id: rank.user_id,
            nickName: rank.en_name,
            avatarUrl: "./img/qq.png",
            money: rank.money,
            betCount: rank.bet_count,
            winCount: rank.win_count
        }
    })

    transformTeams = teams => teams.map(team => {
        return {
            id: team.id,
            name: team.name,
            logo: team.logo === 'unknown' ? './img/question.png' : team.logo
        }
    })

    transformTips = tips => {
        const names = ['reward', 'notice', 'rule'];
        const formatted = {};
        tips.forEach(tip => {
            formatted[names[tip.tips_id]] = tip;
        });
        return formatted;
    }

    showError = errorMessage => {
        this.setState({ errorOpen: true, errorMessage });
    }
}

export default App;
