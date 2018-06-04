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
            ranks: []
        };
    }

    componentDidMount() {
        this.fetchUrl('./samples/my.json', data => this.setState({userInfo: data}));
        this.fetchUrl('./samples/banners.json', data => this.setState({banners: data}));
        this.fetchUrl('./samples/teams.json', data => this.setState({teams: data}));
        this.fetchUrl('./samples/schedules.json', data => this.setState({schedules: data}));
        this.fetchUrl('./samples/users.json', data => this.setState({users: data}));
        this.fetchUrl('./samples/ranks.json', data => this.setState({ranks: data}));
    }

    render() {
        const {banners, userInfo, schedules, teams, ranks, users} = this.state;

        return (
            <div className="App">
                <ImageSlider images={banners} />
                <MyBar userInfo={userInfo} />
                <MainTabs
                    schedules={this.expandSchedule(schedules, teams)}
                    ranks={this.expandRank(ranks, users)}
                    userInfo={userInfo}
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

    fetchUrl = (url, cb) => {
        axios.get(url).then(resp => {
            cb(resp.data);
        }, error => {
            console.error(`fetching ${url} failed: ` + error);
        });
    }
}

export default App;
