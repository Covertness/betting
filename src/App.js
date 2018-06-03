import React, { Component } from 'react';
import ImageSlider from './ImageSlider';
import MyBar from './MyBar';
import MainTabs from './MainTabs';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {
                id: 0,
                nickName: '无影风随',
                avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
                money: 5000,
                income: 5555,
                betCount: 0,
                winCount: 0,
                rank: 4,
            }
        };
    }

    render() {
        const images = [
            'img/slider1.png',
            'img/slider2.png',
            'img/slider3.png'
        ];
        const teams = [{
            id: 0,
            name: '巴西',
            logo: '//flags.fmcdn.net/data/flags/w1160/br.png'
        }, {
            id: 1,
            name: '德国',
            logo: '//flags.fmcdn.net/data/flags/w1160/de.png'
        }];
        const schedule = [{
            id: 0,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            group: 'A',
            groupTabIndex: 0,
            enableBetting: true
        }, {
            id: 1,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            group: 'A',
            groupTabIndex: 0
        }, {
            id: 2,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            group: 'A',
            groupTabIndex: 0,
            enableBetting: true
        }, {
            id: 3,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            groupTabIndex: 1,
            enableBetting: true
        }, {
            id: 4,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            groupTabIndex: 1
        }, {
            id: 5,
            homeTeamId: 0,
            awayTeamId: 1,
            odds: [1.88, 2.35, 2.23],
            time: new Date(),
            groupTabIndex: 2
        }];
        const users = [{
            id: 0,
            nickName: '无影风随',
            avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
            money: 5000,
            betCount: 0,
            winCount: 0,
        }, {
            id: 1,
            nickName: '张三',
            avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
            money: 50000,
            betCount: 2,
            winCount: 2,
        }, {
            id: 2,
            nickName: '李四',
            avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
            money: 100000,
            betCount: 20,
            winCount: 12,
        }, {
            id: 3,
            nickName: '王二麻子',
            avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
            money: 10000,
            betCount: 2,
            winCount: 1,
        }, {
            id: 4,
            nickName: '李明',
            avatarUrl: '//tva3.sinaimg.cn/crop.0.0.180.180.180/5e37efe3jw1e8qgp5bmzyj2050050aa8.jpg',
            money: 5000,
            betCount: 2,
            winCount: 0,
        }];
        const rank = [2, 1, 3, 0, 4];

        return (
            <div className="App">
                <ImageSlider images={images} />
                <MyBar userInfo={this.state.userInfo} />
                <MainTabs
                    schedules={this.expandSchedule(schedule, teams)}
                    ranks={this.expandRank(rank, users)}
                    userInfo={this.state.userInfo}
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
}

export default App;
