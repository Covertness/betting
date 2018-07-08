import moment from 'moment';

const roundName2GroupTabIndex = {
    'Round of 16': 1,
    'Quarter-finals': 2,
    'Semi-finals': 3,
    'Match for third place': 3,
    'Final': 4
}

const schedules = (state = [], action) => {
    switch (action.type) {
        case 'RECEIVE_ROUNDS': {
            const schedules = []
            action.rounds.forEach(round => {
                let groupTabIndex = roundName2GroupTabIndex[round.name]
                if (groupTabIndex == null) groupTabIndex = 0
                round.matches.forEach(match => {
                    let result
                    if (match.score1 == null) result = null
                    else if (match.score1 > match.score2) result = 1
                    else if (match.score1 < match.score2) result = 2
                    else result = 3

                    schedules.push({
                        "id": match.num,
                        "homeTeam": {
                            "name": match.team1.name
                        },
                        "awayTeam": {
                            "name": match.team2.name
                        },
                        "odds": [
                            1.88,
                            2.35,
                            2.23
                        ],
                        "time": moment([match.date, match.time, '+0' + match.timezone[match.timezone.length - 1]].join(' '), 'YYYY-MM-DD HH:mm Z').format(),
                        "group": match.group && match.group.split(' ')[1],
                        "groupTabIndex": groupTabIndex,
                        "result": result,
                        "disableBetting": false,
                        "showBet": true
                    })
                })
            })
            return schedules
        }
        case 'RECEIVE_COUTRIES': {
            const countries = {}
            action.countries.forEach(country => {
                countries[country.en] = {
                    name: country.cn,
                    code: country.code
                }
            })

            return state.map(schedule => {
                const updateTeam = (team) => {
                    const en = team.name

                    return {
                        name: countries[en].name,
                        logo: '//flags.fmcdn.net/data/flags/w1160/' + countries[en].code.toLowerCase() + '.png'
                    }
                }

                return Object.assign({}, schedule, {
                    homeTeam: updateTeam(schedule.homeTeam),
                    awayTeam: updateTeam(schedule.awayTeam)
                })
            })
        }
        default:
            return state
    }
}

export default schedules