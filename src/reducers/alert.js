const initialState = {
    showRule: false,
    showbettingResult: false
}

const alert = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_RULE': {
            return {
                ...state,
                showRule: action.show
            }
        }
        case 'BETTING': {
            return {
                ...state,
                showbettingResult: true
            }
        }
        case 'CONFIRM_BETTING': {
            return {
                ...state,
                showbettingResult: false
            }
        }
        default:
            return state
    }
}

export default alert