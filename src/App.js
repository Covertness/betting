import React, { Component } from 'react';
import axios from 'axios';
import ImageSlider from './ImageSlider';
import MyBar from './MyBar';
import MainTabs from './MainTabs';
import ErrorSnackbar from './ErrorSnackbar';
import AlertDialog from './AlertDialog';

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
            users: [],
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
    };

    handleBettingResult = (result) => {
        const code = result.code;

        let bettingResult = '';
        if (code === 0) {
            bettingResult = '恭喜投注成功！'

            this.fetchLatest().catch(e => {
                this.setState({ errorOpen: true, errorMessage: 'Fetching latest failed: ' + e.request.responseURL + ' ' + e.response.data });
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
        const { banners, userInfo, schedules, teams, ranks, users, history, showBettingResult, bettingResult, errorOpen, errorMessage } = this.state;

        const expandedSchedules = this.expandSchedule(schedules, teams);

        return (
            <div>
                <div className="App">
                    <ImageSlider images={banners} />
                    <MyBar userInfo={userInfo} />
                    <MainTabs
                        schedules={expandedSchedules}
                        ranks={this.expandRank(ranks, users)}
                        userInfo={userInfo}
                        history={this.expandHistory(history, expandedSchedules)}
                        onBettingResult={this.handleBettingResult}
                    />
                </div>
                <AlertDialog open={userInfo.checkin} onClose={this.handleCheckinClose} title="每日领奖" confirm="确定">
                    <img src="img/money.png" alt="money" />&nbsp;+500金币
                </AlertDialog>
                <AlertDialog open={showBettingResult} onClose={this.handleBettingResultClose} title="投注结果" confirm="确定">
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

    expandRank = (rank, users) => {
        const usersMap = {};
        users.forEach(element => {
            usersMap[element.id] = element;
        });

        return rank.map(element => usersMap[element]);
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
            this.setState({ errorOpen: true, errorMessage: 'Fetching all failed: ' + e.request.responseURL + ' ' + e.response.data });
        }
    }

    fetchLatest = async () => {
        const { data: userInfo } = await axios.get('./samples/my.json');
        const { data: schedules } = await axios.get('./samples/schedules.json');
        const { data: users } = await axios.get('./samples/users.json');
        const { data: ranks } = await axios.get('./samples/ranks.json');
        const { data: history } = await axios.get('./samples/history.json');

        this.setState({ userInfo, schedules, users, ranks, history });
    }
}

export default App;
