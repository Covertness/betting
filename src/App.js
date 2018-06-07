import React, { Component } from 'react';
import axios from 'axios';
import ImageSlider from './ImageSlider';
import MyBar from './MyBar';
import MainTabs from './MainTabs';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            banners: [],
            teams: [],
            schedules: [],
            users: [],
            ranks: [],
            history: {
                betting: [],
                checkin: []
            }
        };
    }

    componentDidMount() {
        this.fetchAll();
    }

    render() {
        const { banners, userInfo, schedules, teams, ranks, users, history } = this.state;

        const expandedSchedules = this.expandSchedule(schedules, teams);

        return (
            <div className="App">
                <ImageSlider images={banners} />
                <MyBar userInfo={userInfo} />
                <MainTabs
                    schedules={expandedSchedules}
                    ranks={this.expandRank(ranks, users)}
                    userInfo={userInfo}
                    history={this.expandHistory(history, expandedSchedules)}
                />
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
            const { data: userInfo } = await axios.get('./samples/my.json');
            const { data: banners } = await axios.get('./samples/banners.json');
            const { data: teams } = await axios.get('./samples/teams.json');
            const { data: schedules } = await axios.get('./samples/schedules.json');
            const { data: users } = await axios.get('./samples/users.json');
            const { data: ranks } = await axios.get('./samples/ranks.json');
            const { data: history } = await axios.get('./samples/history.json');

            this.setState({userInfo, banners, teams, schedules, users, ranks, history});
        } catch (e) {
            console.error('Fetching all failed: ' + e)
        }
    }
}

export default App;
