import { connect } from 'react-redux'
import RankTab from '../components/RankTab'
import { fetchRanks } from '../actions';
import { calcBalance, calcWinCount } from '../util'

const mapStateToProps = ({ userInfo, schedules, history, ranks }) => {
    const latestMyInfo = Object.assign({}, userInfo, {
        money: calcBalance(userInfo.money, schedules, history),
        betCount: history.betting.length,
        winCount: calcWinCount(schedules, history)
    })
    
    const latestRanks = ranks.slice()
    let myRank = ranks.findIndex(user => user.money <= latestMyInfo.money)
    if (myRank === -1) myRank = latestRanks.length
    latestMyInfo.rank = myRank + 1
    latestRanks.splice(myRank, 0, latestMyInfo)

    return {
        userInfo: latestMyInfo,
        ranks: latestRanks
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchRanks: () => dispatch(fetchRanks())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RankTab)