const initialState = {
    betting: [],
    checkin: []
}

const history = (state = initialState, action) => {
    let newState = state

    switch(action.type) {
        case 'RECEIVE_HISTORY': {
            newState = action.history
            break
        }
        case 'CONFIRM_CHECK_IN': {
            newState = {
                ...state,
                checkin: state.checkin.concat({
                    date: Date.now(),
                    money: action.reward
                })
            }
            break
        }
        case 'BETTING': {
            newState = {
                ...state,
                betting: state.betting.concat({
                    id: state.betting.length,
                    scheduleId: action.scheduleId,
                    money: action.money,
                    result: action.result,
                    odds: action.odds
                })
            }
            break
        }
        default:
            break
    }

    // Tricky. Should do it in an action.
    newState !== state && localStorage.setItem('history', JSON.stringify(newState))

    return newState
}

export default history