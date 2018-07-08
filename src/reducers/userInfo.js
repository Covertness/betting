const userInfo = (state = null, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return action.userInfo
        }
        case 'CHECK_IN': {
            return {
                ...state,
                checkin: false
            }
        }
        default:
            return state
    }
}

export default userInfo