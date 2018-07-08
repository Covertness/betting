const initialState = {
    show: false,
    content: ''
}

const error = (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_ERROR': {
            return {
                ...state,
                show: action.show,
                content: action.message
            }
        }
        default:
            return state
    }
}

export default error