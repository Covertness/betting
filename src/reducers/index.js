import { combineReducers } from 'redux'
import userInfo from './userInfo'
import schedules from './schedules'
import history from './history'
import ranks from './ranks'
import alert from './alert'
import error from './error'

export default combineReducers({
    userInfo,
    schedules,
    history,
    ranks,
    alert,
    error
})