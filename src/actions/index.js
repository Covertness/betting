import fetch from 'cross-fetch'

export const loginAction = credentials => {
    localStorage.setItem('credentials', JSON.stringify(credentials));

    return {
        type: 'LOGIN',
        userInfo: {
            "id": 0,
            "nickName": credentials.name || "无影风随",
            "avatarUrl": "//avatars3.githubusercontent.com/u/11582431?s=88&v=4",
            "money": 5000,
            "betCount": 0,
            "winCount": 0,
            "checkin": true
        }
    }
}

export const checkInAction = () => ({
    type: 'CHECK_IN'
})

export const bettingAction = (scheduleId, money, result, odds) => ({
    type: 'BETTING',
    scheduleId,
    money,
    result,
    odds
})

export const showErrorAction = (show, message) => ({
    type: 'SHOW_ERROR',
    show,
    message
})

export const showRuleAction = (show) => ({
    type: 'SHOW_RULE',
    show
})

export const confirmCheckInAction = reward => ({
    type: 'CONFIRM_CHECK_IN',
    reward
})

export const confirmBettingAction = () => ({
    type: 'CONFIRM_BETTING'
})

export const fetchCountries = () => {
    return dispatch => {
        return fetch('./samples/countries.json')
            .then(
                response => response.json()
            )
            .then(json =>
                dispatch({
                    type: 'RECEIVE_COUTRIES',
                    countries: json,
                    receivedAt: Date.now()
                })
            )
    }
}

export const fetchRounds = () => {
    return dispatch => {
        return fetch('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json')
            .then(
                response => response.json()
            )
            .then(json =>
                dispatch({
                    type: 'RECEIVE_ROUNDS',
                    rounds: json.rounds,
                    receivedAt: Date.now()
                })
            )
    }
}

export const fetchHistory = () => {
    return dispatch => {
        const oldHistory = localStorage.getItem('history')
        dispatch({
            type: 'RECEIVE_HISTORY',
            history: (oldHistory && JSON.parse(oldHistory)) || {
                betting: [],
                checkin: []
            }
        })
        return Promise.resolve()
    }
}

export const fetchRanks = () => {
    return dispatch => {
        return fetch('./samples/ranks.json')
            .then(
                response => response.json()
            )
            .then(json =>
                dispatch({
                    type: 'RECEIVE_RANKS',
                    ranks: json,
                    receivedAt: Date.now()
                })
            )
    }
}