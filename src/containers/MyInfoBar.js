import { connect } from 'react-redux'
import MyBar from '../components/MyBar'
import { calcBalance } from '../util'

const mapStateToProps = ({ userInfo, schedules, history }) => {
    return {
        userInfo: Object.assign({}, userInfo, { money: calcBalance(userInfo.money, schedules, history) })
    }
}

export default connect(mapStateToProps)(MyBar)