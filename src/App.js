import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import ImageSlider from './ImageSlider';
import MyBar from './MyBar';
import MainTabs from './MainTabs';
import ErrorSnackbar from './ErrorSnackbar';

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
                <Dialog
                    open={userInfo.checkin}
                    onClose={this.handleCheckinClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">每日奖励</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">恭喜获得500金币！</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCheckinClose} color="primary">好的</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={showBettingResult}
                    onClose={this.handleBettingResultClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">投注结果</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{bettingResult}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleBettingResultClose} color="primary">好的</Button>
                    </DialogActions>
                </Dialog>
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
