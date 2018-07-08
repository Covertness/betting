import { connect } from 'react-redux'
import MyTab from '../components/MyTab'

const mapStateToProps = state => {
    return {
        schedules: state.schedules,
        history: state.history
    }
}

export default connect(mapStateToProps)(MyTab)