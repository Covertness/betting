const ranks = (state = [], action) => {
    switch (action.type) {
        case 'RECEIVE_RANKS': {
            if (state.length === 0) {
                return action.ranks
            } else {
                return action.ranks
            }
        }
        default:
            return state
    }
}

export default ranks